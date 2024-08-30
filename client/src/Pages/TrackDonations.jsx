import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Web3Context from '../store/Web3Context';
import { toast } from 'react-toastify';

const TrackDonations = () => {
    const [completions, setCompletions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem('token');
    const { state } = useContext(Web3Context);
    const { contract } = state;

    useEffect(() => {
        fetchCompletions();
    }, []);

    const requestRefund = async (charityId, id) => {
        try {
            const transaction = await contract.requestRefund(charityId);
            console.log('Transaction:', transaction);
            await transaction.wait();
            toast.success('Transaction Completed successfully');

            // Mark the transaction as refunded in the frontend
            setCompletions(completions.map(completion =>
                completion._id === id ? { ...completion, refunded: true } : completion
            ));
        } catch (e) {
            console.error(e);
            toast.error("Error occurred while getting refund");
        }
    };

    const fetchCompletions = async () => {
        try {
            const response = await axios.get('http://localhost:5000/completions', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            setCompletions(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch completions');
            setLoading(false);
        }
    };

    const handleClick = async (id) => {
        try {
            const response = await axios.patch(`http://localhost:5000/verify-completion/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log(response.data);
            setCompletions(completions.map(completion =>
                completion._id === id ? { ...completion, verified: true } : completion
            ));
        } catch (e) {
            console.error(e);
            toast.error('Failed to verify completion');
        }
    };

    if (loading) return <div className="text-center text-lg">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-4 md:ml-64">
            <h2 className="text-2xl font-bold mb-4">Track Donations</h2>
            <ul className="space-y-4">
                <p className="mb-4">You can track the hash values by putting them on <a href="https://sepolia.etherscan.io" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">sepolia.etherscan.io</a></p>
                {completions.map((completion) => (
                    <li key={completion._id} className="p-4 border rounded shadow-md bg-white">
                        <div className="flex justify-end items-center w-max">
                            {completion.verified ? (
                                <p className="rounded-md p-2 text-white bg-green-500">Verified</p>
                            ) : completion.refunded ? (
                                <p className="rounded-md p-2 text-white bg-red-500">Refunded</p>
                            ) : (
                                <>
                                    <p
                                        onClick={() => requestRefund(completion.charityId, completion._id)}
                                        className="cursor-pointer text-red-500 hover:underline"
                                    >
                                        Request Refund
                                    </p>
                                    <button
                                        onClick={() => handleClick(completion._id)}
                                        className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Verify
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="font-medium mt-2">
                            Hash:
                            <p className="text-gray-700">{completion.hash}</p>
                        </div>
                        <div className="font-medium mt-2">
                            Amount:
                            <p className="text-gray-700">{completion.amount}</p>
                        </div>
                        <div className="font-medium mt-2">
                            Charity ID:
                            <p className="text-gray-700">{completion.charityId}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TrackDonations;