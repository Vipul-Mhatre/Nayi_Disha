import React, { useContext, useState } from 'react';
import Web3Context from '../store/Web3Context';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const RegisterCharity = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [charityAddress, setCharityAddress] = useState('');
    const { state } = useContext(Web3Context);
    const navigate = useNavigate();
    const { contract } = state;
    const [files, setFiles] = useState([]);
    const [fileUri, setFileUri] = useState([]);

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        const selectedFileUris = selectedFiles.map(file => URL.createObjectURL(file));
        setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
        setFileUri(prevFileUri => [...prevFileUri, ...selectedFileUris]);
    };

    const handleUpload = async () => {
        const uploadedUrls = [];

        for (let file of files) {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);
            data.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);

            try {
                const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`, {
                    method: "post",
                    body: data
                });

                if (res.status !== 200) {
                    console.error("Unable to upload image");
                    const error = await res.text();
                    console.error(error);
                    return [];
                }

                const imgLink = await res.json();
                uploadedUrls.push(imgLink.secure_url);
            } catch (error) {
                console.error("Error uploading image:", error);
                toast.error("Error uploading image");
                return [];
            }
        }

        return uploadedUrls;
    };

    const registerCharity = async () => {
        console.log(contract);
        try {
            if (contract) {
                const transaction = await contract.registerCharity(name, description, charityAddress);
                console.log('Transaction:', transaction);

                await transaction.wait();

                const uploadedUrls = await handleUpload();

                if (uploadedUrls.length === 0) {
                    toast.error('File upload failed.');
                    return;
                }

                console.log(uploadedUrls);

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
        console.log(urls);
        try {
            const token = localStorage.getItem('token'); // Assuming JWT is stored in localStorage

            const response = await axios.post('http://localhost:5000/create-campaign', {
                name,
                description,
                address: charityAddress,
                photo: urls[0],  // Pass the first URL or whatever you need
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
            <div className="flex flex-col items-center p-4">
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="mb-4"
                />
                {files.length > 0 && (
                    <div className="mt-4 w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-2">Selected Files:</h2>
                        <ul className="list-disc pl-5">
                            {fileUri.map((img, index) => (
                                <li key={index} className="text-sm">
                                    <img
                                        src={img}
                                        alt="Preview"
                                        className="w-24 h-24 object-cover rounded mb-4 ml-4"
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
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