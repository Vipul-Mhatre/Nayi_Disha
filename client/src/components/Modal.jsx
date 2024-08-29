import React, { useContext, useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";
import {MailIcon} from '../assets';
import {LockIcon} from '../assets';
import axios from "axios";
import { toast } from 'react-toastify';
import Register from './Register'
import Login from './Login'
import { UserContext } from "../App";
import { SERVER_URL } from '../constants';

export default function App(props) {

  const {state , dispatch} = useContext(UserContext);
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const [success , setSuccess] = useState(false)
  const [error , setError] = useState(false)
  const [formType , setFormType] = useState("")

  const [ loginForm , setLoginForm ] = useState({
    email: "",
    pwd: ""
  })
  const [ registerForm , setRegisterForm ] = useState({
    name:"",
    email: "",
    pwd: "",
    cpwd:""
  })

  useEffect(() =>{
    setFormType(props.formType);
    setSuccess(false)
  },[])

  function validateEmail(email) {
    const regex = /^[\w.-]+@[a-zA-Z_-]+?\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  const handleLoginChange = (fieldname, e) => {
    setLoginForm({...loginForm , [fieldname]: e.target.value})
  }

  const handleRegisterChange = (fieldname, e) => {
    setRegisterForm({...registerForm , [fieldname]: e.target.value})
  }
  
  const registerSubmitHandler = () => {
    if(!validateEmail(registerForm.email)){
      toast.error("Invalid Email");
      setSuccess(false)
      setError(true)
    }
    if(!registerForm.email || !registerForm.pwd || !registerForm.name || !registerForm.cpwd){
      toast.error("Please enter all the fields");
      setSuccess(false)
    }

    axios.post(SERVER_URL + '/register' , registerForm)
      .then((res) => {
        if(res.status === 201){
          toast.success(res.data.message)
          setSuccess(true)
          setError(false)
        }
      })
      .catch((err) => {
        console.log(err);
        if( err.response.status === 401 ){
          toast.error(err.response.data.message);
          setSuccess(false)
          setError(true)
        }
      })
      props.handleClick();
      setFormType(props.formType);
  }

  const loginSubmitHandler = () => {
    if(!validateEmail(loginForm.email)){
      toast.warning("Invalid Email");
      setSuccess(false)
      setError(true)
    }
    if(!loginForm.email || !loginForm.pwd){
      toast.warning("Please Enter all the fields");
      setSuccess(false)
    }

    axios.post(SERVER_URL + '/login' , loginForm , {withCredentials:true , credentials: "include"})
      .then((res) => {
        if(res.status === 200){
          dispatch({type: "USER" , payload: {loggedIn: true, loggedUser: res.data.loggedUser}})
          console.log("state:",state.loggedUser)
          toast.success(res.data.message)
          setSuccess(true)
          setError(false)
        }
      })
      .catch((err) => {
        console.log(err);
        if( err.response.status === 401 || err.response.status === 500 ){
          toast.error(err.response.data.message);
          setSuccess(false)
          setError(true)
        }
      })
      props.handleClick()
      setFormType(props.formType);
  }

  return (
    <>
      <Button 
        onPress={onOpen} 
        className="font-epilogue font-semibold text-[16px] leading-[26px] text-white min-h-[48px] px-4 rounded-[10px] bg-[#1dc071]"
        >
        {props.formType}
      </Button>
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="blur"
        className="pt-2"
      >
        <ModalContent>
          {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-4xl text-semibold">{formType}</ModalHeader>
              <ModalBody>
                {formType === "Login" ? 
                  <Login handleChange={handleLoginChange} onClose={onClose} setFormType={setFormType} error={error}/> : 
                  <Register handleChange={handleRegisterChange} onClose={onClose} setFormType={setFormType} error={error} />
                }
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose} onClick={()=>{setFormType(props.formType);}}>
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    if(formType === "Login")
                      loginSubmitHandler()
                    else if(formType === "Register")
                      registerSubmitHandler()
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