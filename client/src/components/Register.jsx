import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link, Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem } from "@nextui-org/react";
import { MailIcon } from '../assets';
import { LockIcon } from '../assets';
import { NameIcon } from '../assets';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

export default function App({ handleChange, onClose, setFormType, error }) {
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
        onChange={(e) => { handleChange('name', e) }}
      />

      <Input
        isClearable
        endContent={
          <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
        }
        label="Email"
        placeholder="Enter your email"
        isInvalid={error ? true : false}
        color={error ? 'danger' : 'success'}
        variant="bordered"
        onChange={(e) => { handleChange('email', e) }}
      />
      <Input
        endContent={
          <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
        }
        label="Password"
        placeholder="Enter your password"
        type="password"
        variant="bordered"
        isInvalid={error ? true : false}
        color={error ? 'danger' : 'success'}
        onChange={(e) => { handleChange('pwd', e) }}
      />
      <Input
        label="Wallet Address"
        placeholder="Enter your Wallet Address"
        variant="bordered"
        color={error ? 'danger' : 'success'}
        onChange={(e) => { handleChange('walletAddress', e) }}
      />

      {/* Role Dropdown */}
      <Dropdown>
        <DropdownTrigger>
          <Button flat color="primary">Select Role</Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Role selection"
          onAction={(key) => handleChange('role', key)}
        >
          <DropdownSection title="Role">
            <DropdownItem key="organisation">Organisation</DropdownItem>
            <DropdownItem key="charity">Charity</DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>

      <div className="flex py-2 px-1 justify-end">
        <Link color="primary" href="#" size="sm" onPress={() => setFormType("Login")}>
          Already have an Account?
        </Link>
      </div>
    </>
  );
}
