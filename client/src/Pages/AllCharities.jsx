import React, { useContext, useState, useEffect } from 'react';
import Web3Context from '../store/Web3Context';

const AllCharities = () => {
    const [charities, setCharities] = useState([]);
    const { state } = useContext(Web3Context);
    const { contract } = state;

    const getCharities = async () => {
        try {
            if (contract) {
                const charitiesList = await contract.getAllCharities();
                console.log(charitiesList);
                const parsedCharities = charitiesList.flat().map(charity => ({
                    name: charity[0] || "",
                    description: charity[1] || "",
                    charityAddress: charity[2] || "",
                    id: charity[3] ? charity[3].toString() : "",  // Convert BigNumber to string if needed
                    isActive: charity[4] || false,
                }));

                console.log(parsedCharities);
                setCharities(parsedCharities);
            } else {
                alert('Metamask disconnected.');
            }
        } catch (error) {
            console.error('Error fetching charities:', error);
            alert('Failed to fetch charities.');
        }
    };


    useEffect(() => {
        getCharities();
    }, []); // Fetch charities when the contract is loaded

    return (
        <div className="container md:ml-64 mx-auto my-10 p-5 border rounded-lg shadow-md">
            <h1 className="text-2xl font-semibold mb-4">All Registered Charities</h1>
            {charities.length === 0 ? (
                <p>No charities registered yet.</p>
            ) : (
                <ul>
                    {charities.map((charity, index) => (
                        <li key={index} className="mb-4 p-4 border rounded-lg shadow">
                            <p><strong>Name:</strong> {charity.name}</p>
                            <p><strong>Description:</strong> {charity.description}</p>
                            <p><strong>Address:</strong> {charity.charityAddress}</p>
                            <p><strong>ID:</strong> {charity.id}</p>
                            <p><strong>Active:</strong> {charity.isActive ? 'Yes' : 'No'}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AllCharities;