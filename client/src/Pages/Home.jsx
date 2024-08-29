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
  <div className='ml-44  bg-slate-900 w-full text-center text-white min-h-screen flex flex-wrap items-center justify-center flex-col'>
    <h1 className='py-10 text-3xl font-semibold'>All Campaigns</h1>
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className='max-w-xs bg-white rounded-lg shadow-lg overflow-hidden'>
          <img
            className='w-full h-30 object-cover'
            src='https://via.placeholder.com/400x200.png?text=Environment' 
            alt='Environmental Conservation'
          />
          <div className='p-4'>
            <h2 className='text-xl font-bold text-slate-900'>
              Environmental Conservation Initiative
            </h2>
            <p className='text-gray-700 mt-2'>
              Join me in protecting our environment by supporting this conservation project. Funds raised will be used for tree planting, wildlife preservation, and environmental education programs. Together, we can contribute to a sustainable and healthier planet.
            </p>
            <div className='mt-4 flex justify-between items-center'>
              <div>
                <div className='text-green-600 font-bold'>$2869</div>
                <div className='text-gray-600'>Raised out of $12000</div>
              </div>
              <div className='text-gray-600'>
                <span className='font-bold'>92</span> Days Left
              </div>
            </div>
            {/* Progress Bar */}
            <div className='w-full bg-gray-300 rounded-full h-2.5 mt-2'>
              <div
                className='bg-green-600 h-2.5 rounded-full'
                style={{ width: '23.9%' }} 
              ></div>
            </div>
            <div className='mt-4 text-sm text-gray-600'>
              <span className='font-bold'>by</span> Vipul Mhatre
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

}

export default Home;