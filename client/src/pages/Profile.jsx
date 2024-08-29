import React, { useState, useEffect, useContext } from 'react'
import { SERVER_URL } from '../constants';
import { DisplayCampaigns } from '../components';
import axios from 'axios';
import { UserContext } from '../App';

const Profile = () => {
  // const {state , dispatch} = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [hasDeleted, setHasDeleted] = useState(false)

  const fetchCampaigns = () => {
    axios.post(SERVER_URL + '/getManyCampaigns', state.loggedUser.yourCampaigns) //returns list of campaigns from id's in yourCampaigns
      .then((res) => {
        console.log(res.data)
        setCampaigns(res.data)
        setIsLoading(false);
      })
      .catch((err)=>console.log(err))
  }
  
  useEffect(() => {
    setIsLoading(true);
    console.log("state:",state.loggedUser)
    setTimeout(() => {
      fetchCampaigns();
    },700)
  }, []);

  return (
    <DisplayCampaigns 
      title="Your Campaigns"
      setHasDeleted={setHasDeleted}
      isLoading={isLoading}
      campaigns={campaigns}
    />
  )
}

export default Profile