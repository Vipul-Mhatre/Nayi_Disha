import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Link, Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem } from "@nextui-org/react";
import { MailIcon, LockIcon, NameIcon } from '../assets';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

export default function App({ onClose, setFormType, error }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    type: '', // Change `role` to `type`
    description: '', // Add a description field
  });

  const [selectedType, setSelectedType] = useState('Select Role'); 

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleTypeChange = (key) => {
    setSelectedType(key);
    handleChange('type', key); 
  };

  const handleSubmit = async () => {
    console.log("form data", formData);
    try {
      const response = await axios.post('http://localhost:5000/register', formData);
      toast.success("Registered Successfully");
      setFormType("Login");
    } catch (err) {
      toast.error(err.response.data.error || "An error occurred");
    }
  };

  return (
    <>
      <Input
        isClearable
        autoFocus
        endContent={<NameIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
        label="Name"
        placeholder="Enter your name"
        variant="bordered"
        color="success"
        onChange={(e) => handleChange('name', e.target.value)}
      />

      <Input
        isClearable
        endContent={<MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
        label="Email"
        placeholder="Enter your email"
        isInvalid={error ? true : false}
        color={error ? 'danger' : 'success'}
        variant="bordered"
        onChange={(e) => handleChange('email', e.target.value)}
      />

      <Input
        endContent={<LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
        label="Password"
        placeholder="Enter your password"
        type="password"
        variant="bordered"
        isInvalid={error ? true : false}
        color={error ? 'danger' : 'success'}
        onChange={(e) => handleChange('password', e.target.value)}
      />

      <Input
        label="Wallet Address"
        placeholder="Enter your Wallet Address"
        variant="bordered"
        color={error ? 'danger' : 'success'}
        onChange={(e) => handleChange('address', e.target.value)}
      />

      {/* Type Dropdown */}
      <Dropdown>
        <DropdownTrigger>
          <Button flat color="primary">{selectedType}</Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Type selection"
          onAction={handleTypeChange}
        >
          <DropdownSection title="Type">
            <DropdownItem key="organization">Organisation</DropdownItem>
            <DropdownItem key="charity">Charity</DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>

      {/* Description Field for Organisation */}
      {selectedType === 'organization' && (
        <Input
          label="Description"
          placeholder="Enter organization description"
          variant="bordered"
          color={error ? 'danger' : 'success'}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      )}

      <div className="flex py-2 px-1 justify-end">
        <Link color="primary" href="#" size="sm" onPress={() => setFormType("Login")}>
          Already have an Account?
        </Link>
      </div>

      <div className="flex py-2 px-1 justify-end">
        <Button color="success" onPress={handleSubmit}>
          Register
        </Button>
      </div>
      
      <ToastContainer />
    </>
  );
}
