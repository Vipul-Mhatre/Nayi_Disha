import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';

const EditCharity = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCampaignId, setEditingCampaignId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await axios.get('http://localhost:5000/get-campaigns', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const formattedCampaigns = response.data.campaign.map(campaign => ({
          id: campaign._id,
          name: campaign.name,
          description: campaign.description,
          organization: campaign.organization,
          totalAmtCollected: campaign.totalAmtCollected || 0,
          totalAmtRequired: campaign.totalAmtRequired || 0,
          daysLeft: campaign.daysLeft || 0
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

  const handleEditClick = (campaign) => {
    setEditingCampaignId(campaign.id);
    setEditForm({
      name: campaign.name,
      description: campaign.description,
      totalAmtRequired: campaign.totalAmtRequired,
      daysLeft: campaign.daysLeft
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      await axios.patch(`http://localhost:5000/update-campaign/${editingCampaignId}`, editForm, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCampaigns(prevCampaigns =>
        prevCampaigns.map(campaign =>
          campaign.id === editingCampaignId ? { ...campaign, ...editForm } : campaign
        )
      );
      setEditingCampaignId(null);
    } catch (e) {
      console.error('Error updating campaign:', e);
      setError('Failed to update campaign');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className='ml-44 bg-slate-900 w-full text-center text-white min-h-screen flex flex-wrap items-center justify-center flex-col'>
      <h1 className='py-10 text-3xl font-semibold'>Edit Campaigns</h1>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
        {campaigns.map((campaign, index) => (
          <div key={campaign.id} className='max-w-xs bg-white rounded-xl shadow-lg overflow-hidden border border-green-200 shadow-green-100 relative'>
            <img
              className='w-full h-30 object-cover'
              src='https://media.istockphoto.com/id/1385717484/photo/ukrainians-outside-the-train-station-in-lviv-ukraine.jpg?s=612x612&w=0&k=20&c=V8qA7qRiFAuPl2OqJyLCOviMKEZufVeCFBPBj2MrwcU='
              alt={campaign.name}
            />
            <div className='p-4'>
              <h2 className='text-xl font-bold text-slate-900'>
                {editingCampaignId === campaign.id ? (
                  <input
                    type='text'
                    name='name'
                    value={editForm.name}
                    onChange={handleInputChange}
                    className='text-xl font-bold text-slate-900 w-full bg-gray-200 p-1 rounded'
                  />
                ) : (
                  campaign.name
                )}
              </h2>
              <p className='text-gray-700 mt-2'>
                {editingCampaignId === campaign.id ? (
                  <textarea
                    name='description'
                    value={editForm.description}
                    onChange={handleInputChange}
                    className='w-full bg-gray-200 p-1 rounded'
                  />
                ) : (
                  campaign.description
                )}
              </p>
              <div className='mt-4 flex justify-between items-center'>
                <div>
                  <div className='text-green-600 font-bold'>
                    ${campaign.totalAmtCollected}
                  </div>
                  <div className='text-gray-600'>
                    Raised out of{' '}
                    {editingCampaignId === campaign.id ? (
                      <input
                        type='number'
                        name='totalAmtRequired'
                        value={editForm.totalAmtRequired}
                        onChange={handleInputChange}
                        className='w-full bg-gray-200 p-1 rounded'
                      />
                    ) : (
                      `$${campaign.totalAmtRequired}`
                    )}
                  </div>
                </div>
                <div className='text-gray-600'>
                  <span className='font-bold'>
                    {editingCampaignId === campaign.id ? (
                      <input
                        type='number'
                        name='daysLeft'
                        value={editForm.daysLeft}
                        onChange={handleInputChange}
                        className='w-full bg-gray-200 p-1 rounded'
                      />
                    ) : (
                      campaign.daysLeft
                    )}
                  </span>{' '}
                  Days Left
                </div>
              </div>
              {editingCampaignId === campaign.id && (
                <button
                  onClick={handleSaveChanges}
                  className='mt-4 py-2 px-4 bg-green-600 text-white rounded'
                >
                  Save Changes
                </button>
              )}
            </div>
            <button
              onClick={() => handleEditClick(campaign)}
              className='absolute top-2 right-2 bg-blue-600 text-white p-2 rounded-full'
            >
              <FaEdit />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditCharity;
