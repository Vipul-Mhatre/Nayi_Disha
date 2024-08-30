import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Donations = () => {
    const [donations, setDonations] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchDonations = async () => {
            console.log(token);
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_API}/donations`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setDonations(response.data);
            } catch (error) {
                console.error('Error fetching donations:', error);
                alert('Failed to fetch donations.');
            }
        };

        fetchDonations();
    }, [token]);

    return (
        <div className="container mx-auto md:ml-64 my-10 p-5 border rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold mb-4">My Donations</h1>
            {donations.length === 0 ? (
                <p>No donations found.</p>
            ) : (
                <ul>
                    {donations.map((donation, index) => (
                        <li key={index} className="mb-4 p-4 border rounded-lg shadow">
                            <p><strong>Transaction Hash:</strong> {donation.hash}</p>
                            <p><strong>Campaign ID:</strong> {donation.BcampaignId}</p>
                            <p><strong>Amount:</strong> {donation.amount}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Donations;