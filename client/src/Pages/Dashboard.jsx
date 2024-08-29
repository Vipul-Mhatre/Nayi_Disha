import React, { useState } from 'react';

const Dashboard = () => {
    // Dummy data for campaigns
    const dummyCampaigns = [
        { id: 1, name: 'Campaign 1', date: '2024-08-01', donatedAmount: 100 },
        { id: 2, name: 'Campaign 2', date: '2024-08-05', donatedAmount: 250 },
        { id: 3, name: 'Campaign 3', date: '2024-08-10', donatedAmount: 150 },
        { id: 4, name: 'Campaign 4', date: '2024-08-15', donatedAmount: 300 },
        { id: 5, name: 'Campaign 5', date: '2024-08-20', donatedAmount: 50 },
        { id: 6, name: 'Campaign 6', date: '2024-08-25', donatedAmount: 200 },
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const campaignsPerPage = 2;

    // Search and filter campaigns
    const filteredCampaigns = dummyCampaigns.filter(campaign =>
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastCampaign = currentPage * campaignsPerPage;
    const indexOfFirstCampaign = indexOfLastCampaign - campaignsPerPage;
    const currentCampaigns = filteredCampaigns.slice(indexOfFirstCampaign, indexOfLastCampaign);

    const totalPages = Math.ceil(filteredCampaigns.length / campaignsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                            <th className="border p-4">Date</th>
                            <th className="border p-4">Donated Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCampaigns.map(campaign => (
                            <tr key={campaign.id} className="hover:bg-gray-100">
                                <td className="border p-4 text-gray-800">{campaign.name}</td>
                                <td className="border p-4 text-gray-800">{campaign.date}</td>
                                <td className="border p-4 text-gray-800">${campaign.donatedAmount}</td>
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

export default Dashboard;
