import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const Donors = () => {
    const [donors, setDonors] = useState([]); // State to store donors
    const [loading, setLoading] = useState(true); // State for loading status
    const [error, setError] = useState(null); // State for handling errors
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchDonors = async () => {
            try {
                const response = await axios.get("http://localhost:5000/organization/donors", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setDonors(response.data); // Assuming the API returns an array of donors
                setLoading(false); // Set loading to false after data is fetched
            } catch (e) {
                console.error(e);
                setError("Failed to fetch donors");
                setLoading(false); // Set loading to false in case of error
                toast.error("Error occurred");
            }
        };

        fetchDonors();
    }, [token]);

    if (loading) return <div className="text-center text-lg">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="container bg-gray-800 text-green-500 h-screen mx-auto p-4 md:ml-64">
            <h2 className="text-2xl font-bold mb-4">Donors List</h2>
            <ul className="space-y-4">
                {donors.length > 0 ? (
                    donors.map((donor, index) => (
                        <li key={index} className="p-4 border rounded shadow-md bg-white">
                            <div className="font-medium">
                                <p>Name: <span className="text-gray-700">{donor.name}</span></p>
                                <p>Email: <span className="text-gray-700">{donor.email}</span></p>
                                <p>Amount Donated: <span className="text-gray-700">${donor.amountDonated}</span></p>
                                <p>Date: <span className="text-gray-700">{new Date(donor.date).toLocaleDateString()}</span></p>
                            </div>
                        </li>
                    ))
                ) : (
                    <div className="text-center text-green-500">No donors found</div>
                )}
            </ul>
        </div>
    );
};

export default Donors;
