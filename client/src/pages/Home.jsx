import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios';
import { DisplayCampaigns } from '../components';
import { SERVER_URL } from '../constants';
import { UserContext } from '../App';

const Home = () => {
  // const {state,dispatch} = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [hasDeleted, setHasDeleted] = useState(false)

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      axios.get(SERVER_URL + '/allCampaigns')
      .then((res) => {
        setCampaigns(res.data);
        setIsLoading(false);
      })
      .catch((e)=>{
        console.log(e);
        setIsLoading(false);
      })
    }, 700);

  },[hasDeleted]);

  return (
    <DisplayCampaigns 
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
      setHasDeleted={setHasDeleted}
    />
  )
}

export default Home