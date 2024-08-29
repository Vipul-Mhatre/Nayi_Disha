import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Ongoing= () => {
    const [campaigns, setCampaigns] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const campaignsPerPage = 2;
    const token = localStorage.getItem('token'); 
    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                console.log('Fetching campaigns...');
                const response = await axios.get('http://localhost:5000/ongoing-campaigns');
                console.log('Response:', response);
                const formattedCampaigns = response.data.campaigns  .map(campaign => ({
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

  
    const filteredCampaigns = campaigns.filter(campaign =>
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

 
    const indexOfLastCampaign = currentPage * campaignsPerPage;
    const indexOfFirstCampaign = indexOfLastCampaign - campaignsPerPage;
    const currentCampaigns = filteredCampaigns.slice(indexOfFirstCampaign, indexOfLastCampaign);

    const totalPages = Math.ceil(filteredCampaigns.length / campaignsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="ml-64 p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-semibold text-gray-800">My Campaigns</h1>
                <input
                    type="text"
                    placeholder="Search campaigns..."
                    className="p-2 border rounded-lg w-72 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-blue-500 text-white">
                            <th className="border p-4">Campaign Name</th>
                            <th className="border p-4">Description</th>
                            <th className="border p-4">Organization</th>
                            <th className="border p-4">Donation</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCampaigns.map(campaign => (
                            <tr key={campaign.id} className="hover:bg-gray-100">
                                <td className="border p-4 text-gray-800">{campaign.name}</td>
                                <td className="border p-4 text-gray-800">{campaign.description}</td>
                                <td className="border p-4 text-gray-800">{campaign.organization}</td>
                                <td className="border p-4 text-gray-800">${campaign.donatedAmount ?? 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-6 flex justify-center">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i + 1}
                        className={`px-4 py-2 mx-1 rounded-lg transition-colors duration-200 ${
                            currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        onClick={() => paginate(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Ongoing;
