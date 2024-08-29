import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { logo, sun } from '../assets';
import { navlinks } from '../constants';
import Logout from './Logout';
import { UserContext } from '../App';
import { toast } from 'react-toastify';

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (
  <div className={`w-[48px] h-[48px] rounded-[10px] ${isActive && isActive === name && 'bg-[#2c2f32]'} flex justify-center items-center ${!disabled && 'cursor-pointer'} ${styles}`} onClick={handleClick}>
    {!isActive ? (
      <img src={imgUrl} alt="fund_logo" className="w-1/2 h-1/2" />
    ) : (
      <img src={imgUrl} alt="fund_logo" className={`w-1/2 h-1/2 ${isActive !== name && 'grayscale'}`} />
    )}
  </div>
)

const Sidebar = () => {
  const {state , dispatch} = useContext(UserContext)
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('dashboard');
   
  return (
    <div className="flex justify-between items-center flex-col sticky top-5 h-[93vh]">
      <Link to="/">
        <Icon styles="w-[52px] h-[52px] bg-[#2c2f32]" imgUrl={logo} />
      </Link>

      <div className="flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[20px] w-[76px] py-4 mt-12">
        <div className="flex flex-col justify-center items-center gap-3">
          {navlinks.map((link) => (
            <div key={link.name} className='rounded-[15px] hover:bg-[#3f3f3f]'>
              <Icon 
                {...link}
                isActive={isActive}
                handleClick={() => {
                  if(!link.disabled && link.name === 'Logout'){
                    if(state.loggedIn){
                      Logout();
                      dispatch({type: "USER" , payload: {loggedIn: false, loggedUser: null}});
                      navigate('/');
                    }
                    else{
                      toast.info("Please login first!")
                    }
                  }
                  else if(!link.disabled) {
                    if(state.loggedIn || link.name === "Dashboard"){
                      setIsActive(link.name);
                      navigate(link.link);
                    }
                    else{
                      toast.info("Please login first!")
                    }
                  }
                }}
              />
            </div>
          ))}
        </div>

        <Icon styles="bg-[#1c1c24] shadow-secondary" imgUrl={sun} />
      </div>
    </div>
  )
}

export default Sidebar