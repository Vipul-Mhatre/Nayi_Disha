import React, { useContext, useEffect, useState } from 'react';
import { MdDelete, MdEdit } from "react-icons/md";
import { tagType, thirdweb } from '../assets';
import { daysLeft } from '../utils';
import { useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../constants';
import axios from 'axios';
import { toast } from 'react-toastify';
import { UserContext } from '../App';

const FundCard = ({ campaign, setHasDeleted, editable=false, handleClick }) => {
  const {state,dispatch} = useContext(UserContext);
  const remainingDays = daysLeft(campaign.deadline);
  const navigate = useNavigate();

  const handleDelete = () =>{
    axios.post(SERVER_URL + '/deleteCampaign', {_id: campaign._id} , {withCredentials: true})
      .then((res) => {
        if(res.status === 200){
          setHasDeleted((prev) => !prev)
          toast.success("Campaign Deleted Succesfully")
          navigate('/')
        } 
        else{
          toast.error("Campaign couldn't be deleted")
        }
    })
    .catch((e)=>console.log(e))
  }

  const handleUpdate = () => {
    navigate(`/update/${campaign._id}` , {state : campaign})
  }

  return (
    <div className="relative sm:w-[300px] w-full rounded-[15px] bg-[#1c1c24] cursor-pointer">
      <img src={campaign.image} alt="fund" className="w-full h-[180px] object-cover rounded-[15px]" onClick={handleClick}/>
      {editable && 
        <div className='absolute right-2 top-2 h-auto w-fit flex gap-2'>
          <div className='p-[6px] rounded-full bg-blue-500' onClick={handleUpdate}>
            <MdEdit color='white' size={20}/>
          </div>
          <div className='p-[6px] rounded-full bg-red-500' onClick={handleDelete}>
            <MdDelete color='white' size={20}/>
          </div>
        </div>
      }
      <div className="flex flex-col p-4" onClick={handleClick}>
        <div className="flex flex-row items-center mb-[12px]">
          <img src={tagType} alt="tag" className="w-[20px] h-[20px] object-contain"/>
          <p className="ml-[8px] mt-[2px] font-epilogue font-medium text-[14px] text-[#808191]">{campaign.towards}</p>
        </div>

        <div className="block">
          <h3 className="font-epilogue font-semibold text-[16px] text-white text-left leading-[26px] line-clamp-1">{campaign.title}</h3>
          <p className="mt-[5px] font-epilogue font-normal text-[#808191] text-left leading-[18px] truncate">{campaign.description}</p>
        </div>

        <div className="flex justify-between flex-wrap mt-[15px] gap-2">
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">${campaign.amountCollected}</h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">Raised out of ${campaign.target}</p>
          </div>
          <div className="flex flex-col">
            <h4 className="font-epilogue font-semibold text-[14px] text-[#b2b3bd] leading-[22px]">{remainingDays > 0 ? remainingDays : 0}</h4>
            <p className="mt-[3px] font-epilogue font-normal text-[12px] leading-[18px] text-[#808191] sm:max-w-[120px] truncate">Days Left</p>
          </div>
        </div>

        <div className="flex items-center mt-[20px] gap-[12px]">
          <div className="w-[30px] h-[30px] rounded-full flex justify-center items-center bg-[#13131a]">
            <img src={thirdweb} alt="user" className="w-1/2 h-1/2 object-contain"/>
          </div>
          <p className="flex-1 font-epilogue font-normal text-[12px] text-[#808191] truncate">by <span className="text-[#b2b3bd]">{campaign.name}</span></p>
        </div>
      </div>
      
    </div>
  )
}

export default FundCard