import React, { useState } from 'react';
import {
  Button, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem, Checkbox, Link
} from "@nextui-org/react";
import { MailIcon, LockIcon } from '../assets';

function Login({ loginForm, handleLoginChange, error }) {
  const [selectedRole, setSelectedRole] = useState('Select Role');

  const handleRoleChange = (key) => {
    setSelectedRole(key);
    handleLoginChange('type', { target: { value: key } }); // Update the 'type' in loginForm
  };

  return (
    <>
      {/* Role Dropdown */}
      <Dropdown>
        <DropdownTrigger>
          <Button flat color="primary">{selectedRole}</Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Role selection">
          <DropdownSection title="Role">
            <DropdownItem onClick={() => handleRoleChange("organization")} key="organization">Organization</DropdownItem>
            <DropdownItem onClick={() => handleRoleChange("charity")} key="charity">Charity</DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>

      {/* Conditionally render based on role selection */}
      {loginForm.type === 'organization' ? (
        <Input
          isClearable
          autoFocus
          label="Organization Name"
          placeholder="Enter organization name"
          variant="bordered"
          color={error ? 'danger' : 'success'}
          onChange={(e) => handleLoginChange('name', e)}
        />
      ) : (
        <Input
          isClearable
          endContent={<MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
          label="Email"
          placeholder="Enter email"
          isInvalid={error ? true : false}
          color={error ? 'danger' : 'success'}
          variant="bordered"
          onChange={(e) => handleLoginChange('email', e)}
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
        onChange={(e) => handleLoginChange('password', e)}
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
        >
          Don't have an account?
        </Link>
      </div>
    </>
  );
}

export default Login;
