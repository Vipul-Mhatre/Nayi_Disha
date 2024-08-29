import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import FundCard from './FundCard';
import { loader } from '../assets';
import { toast } from 'react-toastify';
import { UserContext } from '../App';

const DisplayCampaigns = ({ title, notFound, isLoading, setHasDeleted, campaigns={} }) => {
  const navigate = useNavigate();
  const {state,dispatch} = useContext(UserContext);
  const handleNavigate = (campaign) => {
    navigate(`/campaign-details/${campaign.title}`, { state: campaign })
  }

  return (
    <div>
      <h1 className="font-epilogue font-semibold font-['Ubuntu'] text-xl md:text-3xl text-white text-center md:text-left">{title} ({campaigns.length})</h1>
      <div className="flex flex-wrap justify-center md:justify-start mt-[20px] gap-[26px]">
        {isLoading && (
          <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
        )}

        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] text-center md:text-left leading-[30px] text-[#818183]">
            {notFound ? notFound : "You have not created any campaigns yet..."}
          </p>
        )}
          {!isLoading && campaigns.length > 0 && campaigns.map((campaign) => 
            <FundCard 
              key={campaign._id}
              campaign={campaign}
              setHasDeleted={setHasDeleted}
              editable={state.loggedIn && state.loggedUser && state.loggedUser.yourCampaigns.find(item => item.campaign.campaign_id === campaign._id)}
              handleClick={() => {
                if(state.loggedIn){
                  handleNavigate(campaign)
                }
                else{
                  toast.info("Please login first!")
                }
              }}
            />)
          }
      </div>
    </div>
  )
}

export default DisplayCampaigns