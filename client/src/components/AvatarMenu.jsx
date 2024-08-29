import React, { useContext, useEffect, useState } from "react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, User, DropdownSection} from "@nextui-org/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logout from "./Logout";
import { UserContext } from "../App";
import { SERVER_URL } from '../constants';
// For name and Email
export default function AvatarMenu() {
    const {state , dispatch} = useContext(UserContext)
    const navigate = useNavigate()
    const [user , setUser] = useState({})
   useEffect(() => {
        axios.get(SERVER_URL + '/currentUser' , {withCredentials: true})
            .then((res) => {
                if(res.data){
                  setUser(res.data);
                  console.log(res.data)  
                }     
            })
            .catch((e)=>{console.log(e)})
   },[]) 

  return (
    <div className="flex items-center -ml-3 -mt-1 gap-4">
      <Dropdown placement="bottom-start">
        <DropdownTrigger>
          <User
            as="button"
            avatarProps={{
              isBordered: true,
              src: "https://i.pravatar.cc/150?img=12",
            }}
            className="transition-transform"
            description={user.email}
            name={user.name}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownSection showDivider>
            <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-bold">Signed in as</p>
                <p className="font-bold">{user.name}</p>
            </DropdownItem>
          </DropdownSection>

          <DropdownItem key="profile" onPress={() => {navigate('/profile')}}>Show Profile</DropdownItem>
          <DropdownItem 
            key="logout" 
            color="danger" 
            onPress={() => {
                Logout();
                navigate('/')
                dispatch({type: "USER" , payload: false })
                }}
            >
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
}
