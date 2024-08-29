import React, { useContext, useState, useRef } from 'react';
import Web3Context from '../store/Web3Context';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../Components/FileUpload';

const RegisterCharity = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [charityAddress, setCharityAddress] = useState('');
    const [uploadedUrls, setUploadedUrls] = useState([]);
    const { state } = useContext(Web3Context);
    const navigate = useNavigate();
    const { contract } = state;

    const fileUploadRef = useRef();

    const handleUploadComplete = (urls) => {
        setUploadedUrls(urls); // Store the URLs
    };

    const registerCharity = async () => {
        console.log(contract);
        try {
            if (contract) {
                const transaction = await contract.registerCharity(name, description, charityAddress);
                console.log('Transaction:', transaction);

                // Wait for the transaction to be mined
                await transaction.wait();

                // Upload files after the transaction is mined
                if (fileUploadRef.current) {
                    await fileUploadRef.current.uploadFiles();
                }

                // Call the backend to register the campaign after the transaction is mined
                await saveCampaignToBackend(name, description, charityAddress, uploadedUrls);

                toast.success('Charity registered successfully');
            } else {
                toast.error('Metamask disconnected.');
            }
        } catch (error) {
            console.error('Error registering charity:', error);
            toast.error('Failed to register charity.');
        }
    };

    const saveCampaignToBackend = async (name, description, charityAddress, urls) => {
        try {
            const token = localStorage.getItem('token'); // Assuming JWT is stored in localStorage

            const response = await axios.post('http://localhost:5000/create-campaign', {
                name,
                description,
                address: charityAddress,
                images: urls, // Include URLs in request payload
            }, {
                headers: {
                    Authorization: `Bearer ${token}`, // Add the Authorization header
                },
            });

            toast.success(response.data.message);
            console.log('Campaign saved to backend:', response.data);
            navigate('/get-charities');
        } catch (error) {
            console.error('Error saving campaign to backend:', error);
            toast.error('Failed to save campaign to backend.');
        }
    };

    return (
        <div className="container md:ml-64 mx-auto my-10 p-5 border rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold mb-4">Register Campaign</h1>
            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                    Campaign Name
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
                    placeholder="Enter campaign name"
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
                    placeholder="Enter campaign description"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2" htmlFor="charityAddress">
                    Campaign Charity Wallet Address
                </label>
                <input
                    type="text"
                    id="charityAddress"
                    value={charityAddress}
                    onChange={(e) => setCharityAddress(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-500"
                    placeholder="Enter campaign wallet address"
                />
            </div>
            <FileUpload ref={fileUploadRef} onUploadComplete={handleUploadComplete} />
            <button
                onClick={registerCharity}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-500 transition-colors"
            >
                Register Campaign
            </button>
        </div>
    );
};

export default RegisterCharity;