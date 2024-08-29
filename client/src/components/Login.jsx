import React, { useState } from 'react';
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter,
  Button, Checkbox, Input, Link, Dropdown, DropdownTrigger,
  DropdownMenu, DropdownSection, DropdownItem
} from "@nextui-org/react";
import { MailIcon, LockIcon } from '../assets';

function Login({  onClose, setFormType, error }) {
  const [selectedRole, setSelectedRole] = useState('Select Role');

  const handleChange = (field, value) => {
    setFormState(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleRoleChange = (key) => {
    setSelectedRole(key);
    handleChange('type', key); // Updated to send the role as 'type'
  };

  return (
    <>
      {/* Role Dropdown */}
      <Dropdown>
        <DropdownTrigger>
          <Button flat color="primary">{selectedRole}</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Role selection" onAction={handleRoleChange}>
          <DropdownSection title="Role">
            <DropdownItem key="organization">Organization</DropdownItem>
            <DropdownItem key="charity">Charity</DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>

      {/* Conditionally render based on role selection */}
      {selectedRole === 'organization' && (
        <Input
          isClearable
          autoFocus
          label="Name"
          placeholder="Enter organization name"
          variant="bordered"
          color={error ? 'danger' : 'success'}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      )}

      {selectedRole === 'charity' && (
        <Input
          isClearable
          endContent={<MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
          label="Email"
          placeholder="Enter charity email"
          isInvalid={error ? true : false}
          color={error ? 'danger' : 'success'}
          variant="bordered"
          onChange={(e) => handleChange('email', e.target.value)}
        />
      )}

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

      <div className="flex py-2 px-1 justify-between">
        <Checkbox
          classNames={{
            label: "text-xs md:text-sm",
          }}
        >
          Remember me
        </Checkbox>
        <Link
          className='text-xs md:text-sm'
          color="primary"
          href="#"
          onPress={() => setFormType("Register")}
        >
          Don't have an account?
        </Link>
      </div>
    </>
  );
}

export default Login;
