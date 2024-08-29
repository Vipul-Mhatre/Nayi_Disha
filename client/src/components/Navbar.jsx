import { useContext, useState, useEffect } from 'react'
import {  useNavigate } from 'react-router-dom';

// import { useStateContext } from '../context';
import { AvatarMenu, CustomButton } from './';
import { logo, menu, search } from '../assets';
import { navlinks } from '../constants';
import { UserContext } from '../App';
import Logout from './Logout';
import { Avatar, AvatarIcon } from '@nextui-org/react';
import Modal from './Modal';
import {toast} from 'react-toastify'
import axios from 'axios';
import { SERVER_URL } from '../constants';

const Navbar = () => {
  const {state , dispatch} = useContext(UserContext)
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('dashboard');
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [searchValue , setSearchValue] = useState("");
  let navlinksList;
  !state.loggedIn ? navlinksList = navlinks.filter((links) => links.name != 'Logout') : navlinksList = navlinks ;

  const changeHandler = (e) => {
    setSearchValue(e.target.value);
  }

  useEffect( () => {
    axios.get(SERVER_URL + '/checkLoggedUser', {withCredentials : true})
    .then((res) => {
      if(res.status === 200)
        dispatch({type: "USER" , payload: {loggedIn: true, loggedUser: res.data.user}});
    })
    .catch((e) => {
      console.log(e)
    })
  },[])

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6 ">
      <div className="lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-[100px]">
        <input 
          type="text"  
          placeholder="Search for campaigns"
          value={searchValue} 
          className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none" 
          onChange={changeHandler}
        />
        
        <div 
          className="w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer"
          onClick={() => {
            if(searchValue === "" || searchValue === undefined || searchValue === " ")
              toast.warning('Search Bar is empty!');
            else    
              {
                navigate(`/search/${searchValue}`);
                setSearchValue("");
              }
          }}
        >
          <img src={search} alt="search" className="w-[15px] h-[15px] object-contain"/>
        </div>
      </div>

      <div className="sm:flex hidden flex-row justify-end gap-4">
        
        { state.loggedIn ? 
        <>
          <CustomButton 
            btnType="button"
            title='Create a campaign'
            styles='bg-[#1dc071]'
            handleClick={() => {navigate('create-campaign')}}
          />

          <CustomButton 
            btnType="button"
            title='Logout'
            styles='bg-[#1dc071]'
            handleClick={() => {
              Logout()
              dispatch({type: "USER" , payload: {loggedIn: false, loggedUser: null}});
              navigate('/')
            }}
          />

          <AvatarMenu/>
          
        </> :
          <>
            <Modal 
              formType="Login"
              handleClick={() => {
                navigate('/');
              }}
            />
            <Modal 
              formType="Register"
              handleClick={() => { 
                navigate('/');
              }}
            />
          </>
        }
      </div>

      {/* Small screen navigation */}
        <div className="md:hidden flex justify-between items-center relative">
        <div 
          className="w-[40px] h-[40px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer" 
          onClick={()=>{
            navigate('/')
            setToggleDrawer(false)
          }}>
            <img src={logo} alt="user" className="w-[60%] h-[60%] object-contain" />
          </div>

          <div>
            {state.loggedIn ? 
              <Avatar 
                isBordered 
                icon={<AvatarIcon/>}
                // src="https://i.pravatar.cc/150?u=a042581f4e29026024d" 
                onClick={() => {setToggleDrawer((prev) => !prev)}}
              /> 
              :
              <img 
                src={menu}
                alt="menu"
                className="w-[34px] h-[34px] object-contain cursor-pointer"
                onClick={() => setToggleDrawer((prev) => !prev)}
              />
            }
          </div>

          <div className={`absolute top-[60px] right-0 left-0 bg-[#2a2a31] z-10 rounded-2xl shadow-secondary py-4 ${!toggleDrawer ? '-translate-y-[100vh]' : 'translate-y-0'} transition-all duration-700`}>
            <ul className="mb-4">
              {navlinksList.map((link) => (
                <li
                  key={link.name}
                  className={`flex p-4 ${isActive === link.name && 'bg-[#3a3a43]'}`}
                  onClick={() => {
                    setIsActive(link.name);
                    setToggleDrawer(false);

                    if(link.name === 'Logout'){
                      Logout();
                      dispatch({type: "USER" , payload: {loggedIn: false, loggedUser: null}});
                      navigate('/')
                    }

                    else if(state.loggedIn){
                      navigate(link.link);
                    }

                    else{
                      if(link.name === "Dashboard")
                      navigate(link.link);
                      else
                      toast.info("Please login first")
                    }
                  }}
                >
                  <img 
                    src={link.imgUrl}
                    alt={link.name}
                    className={`w-[24px] h-[24px] object-contain ${isActive === link.name ? 'grayscale-0' : 'grayscale'}`}
                  />
                  <p className={`ml-[20px] font-epilogue font-semibold text-[14px] ${isActive === link.name ? 'text-[#1dc071]' : 'text-[#808191]'}`}>
                    {link.name}
                  </p>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-x-48 gap-y-5 mx-4">
              {state.loggedIn ? 
              <CustomButton 
                btnType="button"
                title='Create a campaign' 
                styles='bg-[#1dc071]'
                onClick={() => {setToggleDrawer(false);}}
                handleClick={() => { 
                  navigate('create-campaign');
                  setToggleDrawer(false);
                }}
              /> :
              <>
                <Modal 
                  handleClick={() => { 
                    navigate('/');
                    setToggleDrawer(false);
                  }}
                  formType="Login"
                  />

                <Modal 
                handleClick={() => { 
                  navigate('/');
                  setToggleDrawer(false);
                }}
                formType="Register"
                />
              </>
              }
            </div>
          </div>
        </div>
    </div>
  )
}

export default Navbar