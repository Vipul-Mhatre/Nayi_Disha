import React, { useContext, useState } from 'react';
import Web3Context from '../store/Web3Context';
import { ethers } from 'ethers';
import axios from 'axios'; // Import axios for making HTTP requests
import { useAuth } from '../store/auth';
import { useNavigate } from 'react-router-dom';

const CompleteDonations = () => {
    const [amount, setAmount] = useState('');
    const [charityId, setCharityId] = useState('');
    const { state } = useContext(Web3Context);
    const { contract } = state;
    const { token,user } = useAuth();
    const navigate = useNavigate();
    console.log(user);

    const donate = async () => {
        try {
            if (contract) {
                // Convert the amount from Ether to Wei
                const weiAmount = ethers.utils.parseEther(amount);

                const transaction = await contract.releaseFunds(charityId, weiAmount);

                console.log('Transaction:', transaction);

                await transaction.wait();

                await saveDonationDetails(transaction.hash, amount, charityId);

                alert('Donation made successfully');
            } else {
                alert('Metamask disconnected.');
            }
        } catch (error) {
            console.error('Error donating: ', error);
            alert('Failed to donate.');
        }
    };


    const saveDonationDetails = async (hash, amount, charityId) => {
        try {
            const response = await axios.patch('http://localhost:5000/complete-donation', {
                hash,
                amount,
                charityId: charityId,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(response => {
                console.log('Donation completed:', response.data);
            })
                .catch(error => {
                    console.error('Error completing donation:', error);
                });
            // console.log('Donation saved:', response.data);
            // navigate('/donations');
        } catch (error) {
            console.error('Error saving donation:', error);
            alert('Failed to save donation.');
        }
    };

    return (
        <div className="container md:ml-64 mx-auto my-10 p-5 border rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold mb-4">Complete the Donation to Charity</h1>
            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="amount">
                    Donation Amount (in Ether)
                </label>
                <input
                    type="text"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
                    placeholder="Enter donation amount"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="charityId">
                    Campaign ID
                </label>
                <input
                    type="text"
                    id="charityId"
                    value={charityId}
                    onChange={(e) => setCharityId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
                    placeholder="Enter campaign ID"
                />
            </div>
            <button
                onClick={donate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition-colors"
            >
                Donate
            </button>
        </div>
    );
};

export default CompleteDonations;