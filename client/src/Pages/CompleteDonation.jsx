import React, { useContext, useState } from 'react';
import Web3Context from '../store/Web3Context';
import { ethers } from 'ethers';
import axios from 'axios'; 
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
        <div className="mx-7 w-full h-screen flex justify-center items-center bg-gray-800">
        <div className="container md:ml-64 mx-auto my-10 p-8 bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
            <h1 className="text-3xl h-10 font-bold text-green-500 mb-6 text-center">Complete the Donation to Charity</h1>
            <div className="mb-6">
                <label className="block text-gray-400 font-medium mb-2" htmlFor="amount">
                    Donation Amount (in Ether)
                </label>
                <input
                    type="text"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter donation amount"
                />
            </div>
            <div className="mb-6">
                <label className="block text-gray-400 font-medium mb-2" htmlFor="charityId">
                    Campaign ID
                </label>
                <input
                    type="text"
                    id="charityId"
                    value={charityId}
                    onChange={(e) => setCharityId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-600 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Enter campaign ID"
                />
            </div>
            <button
                onClick={donate}
                className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition-colors"
            >
                Donate
            </button>
        </div>
        </div>
    );
};

export default CompleteDonations;