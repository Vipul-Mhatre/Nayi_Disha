import React, { useContext, useState } from 'react';
import Web3Context from '../store/Web3Context';
import { ethers } from 'ethers';

const Donate = () => {
    const [amount, setAmount] = useState('');
    const [charityId, setCharityId] = useState('');
    const [TrxHash, setTrxHash] = useState('');
    const { state } = useContext(Web3Context);
    const { contract } = state;

    const donate = async () => {
        console.log(contract);
        try {
            if (contract) {
                const transaction = await contract.donate(charityId, {
                    value: ethers.utils.parseEther(amount),  // Parse amount to Ether
                });
                console.log('Transaction:', transaction);
                setTrxHash(transaction.hash);
                await transaction.wait();
                alert('Donation made successfully');
            } else {
                alert('Metamask disconnected.');
            }
        } catch (error) {
            console.error('Error donating: ', error);
            alert('Failed to donate.');
        }
    };

    return (
        <div className="container md:ml-64 mx-auto my-10 p-5 border rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold mb-4">Donate to Charity</h1>
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
                    Charity ID
                </label>
                <input
                    type="text"
                    id="charityId"
                    value={charityId}
                    onChange={(e) => setCharityId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
                    placeholder="Enter charity ID"
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

export default Donate;