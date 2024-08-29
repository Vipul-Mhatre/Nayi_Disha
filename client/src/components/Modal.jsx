import React, { useContext, useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import { toast } from 'react-toastify';
import axios from 'axios';
import Register from './Register';
import Login from './Login';
import { UserContext } from "../App";
import { SERVER_URL } from '../constants';

export default function App(props) {
  
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [formType, setFormType] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "", type: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", pwd: "", cpwd: "" });

  useEffect(() => {
    setFormType(props.formType);
    resetForms();
  }, [props.formType]);

  const resetForms = () => {
    setLoginForm({ email: "", password: "", type: "" });
    setRegisterForm({ name: "", email: "", pwd: "", cpwd: "" });
    setSuccess(false);
    setError(false);
  };

  function validateEmail(email) {
    const regex = /^[\w.-]+@[a-zA-Z_-]+?\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  const handleLoginChange = (fieldname, e) => {
    setLoginForm({ ...loginForm, [fieldname]: e.target.value });
  };

  const handleRegisterChange = (fieldname, e) => {
    setRegisterForm({ ...registerForm, [fieldname]: e.target.value });
  };

  const registerSubmitHandler = () => {
    if (!validateEmail(registerForm.email)) {
      toast.error("Invalid Email");
      setError(true);
      return;
    }

    if (!registerForm.email || !registerForm.pwd || !registerForm.name || !registerForm.cpwd) {
      toast.error("Please enter all the fields");
      setError(true);
      return;
    }

    axios.post(SERVER_URL + '/register', registerForm)
      .then((res) => {
        if (res.status === 201) {
          toast.success(res.data.message);
          setSuccess(true);
          setError(false);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 401) {
          toast.error(err.response.data.message);
          setError(true);
        }
      });

    props.handleClick();
    setFormType(props.formType);
  };

  const loginSubmitHandler = () => {
    // Validate input fields based on the selected role
    console.log(loginForm.type)
    if (loginForm.type === "organization") {
      if (!loginForm.name || !loginForm.password) {
        toast.warning("Please enter the organization name and password.");
        setError(true);
        return;
      }
    } else if (loginForm.type === "charity") {
      if (!loginForm.email || !loginForm.password) {
        toast.warning("Please enter the charity email and password.");
        setError(true);
        return;
      }
    } else {
      toast.warning("Please select a role (Organization or Charity).");
      setError(true);
      return;
    }
  
    axios.post(SERVER_URL + "/login", loginForm)
      .then((res) => {
        console.log(loginForm);
        if (res.status === 200) {
          const actionType = loginForm.type === "charity" ? "charity" : "organization";
          dispatch({ type: actionType, payload: { loggedIn: true, loggedUser: res.data.loggedUser } });
          toast.success(res.data.message);
          setError(false);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response && (err.response.status === 401 || err.response.status === 500)) {
          toast.error(err.response.data.message);
          setError(true);
        }
      });
  
    setFormType("Login");
  };

  return (
    <>
      <Button onPress={onOpen} className="font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[48px] px-4 rounded-[10px] bg-[#1dc071]">
        {props.formType}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center" backdrop="blur" className="pt-2">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-4xl text-semibold">{formType}</ModalHeader>
              <ModalBody>
                {formType === "Login" ? (
                  <Login 
                    loginForm={loginForm} 
                    handleLoginChange={handleLoginChange} 
                    onClose={onClose} 
                    setFormType={setFormType} 
                    error={error} 
                  />
                ) : (
                  <Register handleChange={handleRegisterChange} onClose={onClose} setFormType={setFormType} error={error} />
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose} onClick={() => { setFormType(props.formType); resetForms(); }}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    if (formType === "Login") loginSubmitHandler();
                    else if (formType === "Register") registerSubmitHandler();
                  }}
                  onPress={success ? onClose : null}
                  className="bg-[#1dc071]"
                >
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
