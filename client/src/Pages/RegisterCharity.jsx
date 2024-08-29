import React, { useContext, useState } from 'react';
import Web3Context from '../store/Web3Context';

const RegisterCharity = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [charityAddress, setCharityAddress] = useState('');
    const { address, state } = useContext(Web3Context);
    const { contract } = state;

    const registerCharity = async () => {
        console.log(contract);
        try {
            if (contract) {
                const transaction = await contract.registerCharity(name, description, charityAddress);
                console.log('Transaction:', transaction);
                // Optionally wait for the transaction to be mined
                await transaction.wait();
                alert('Charity registered successfully');
            } else {
                alert('Metamask disconnected.');
            }
        } catch (error) {
            console.error('Error registering charity:', error);
            alert('Failed to register charity.');
        }
    };

    return (
        <div className="container md:ml-64 mx-auto my-10 p-5 border rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold mb-4">Register Charity</h1>
            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                    Charity Name
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
                    placeholder="Enter charity name"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="description">
                    Description
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
                    placeholder="Enter charity description"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="charityAddress">
                    Charity Wallet Address
                </label>
                <input
                    type="text"
                    id="charityAddress"
                    value={charityAddress}
                    onChange={(e) => setCharityAddress(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
                    placeholder="Enter charity wallet address"
                />
            </div>
            <button
                onClick={registerCharity}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition-colors"
            >
                Register Charity
            </button>
        </div>
    );
};

export default RegisterCharity;