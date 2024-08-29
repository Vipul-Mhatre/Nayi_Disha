import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token'); 

  useEffect(() => {
    const fetchCampaigns = async () => {
        try {
            console.log('Fetching campaigns...');
            const response = await axios.get('http://localhost:5000/get-campaigns', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log('Response:', response);
            const formattedCampaigns = response.data.campaign.map(campaign => ({
                id: campaign._id,
                name: campaign.name,
                description: campaign.description,
                organization: campaign.organization,
                donatedAmount: null 
            }));
            setCampaigns(formattedCampaigns);
            setLoading(false);
        } catch (e) {
            console.error('Error fetching campaigns:', e);
            setError('Failed to load campaigns');
            setLoading(false);
        }
    };

    fetchCampaigns();
}, []);

  return (
    <>
      <div className='ml-36 bg-slate-900 w-full text-center text-white min-h-screen'>
      
      </div>
    </>
  )
}

export default Home;