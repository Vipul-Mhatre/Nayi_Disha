import { Contract, ethers } from 'ethers';  // Use ethers directly for both Contract and providers
import abi from './abi.json';
import { createContext, useEffect, useState } from 'react';

const Web3Context = createContext();

export const Web3ProviderComponent = ({ children }) => {
    const [state, setState] = useState({
        provider: null,
        signer: null,
        contract: null,
    });

    const [address, setAddress] = useState(null);

    const connectWallet = async () => {
        const contractAddress = "0x2BC98e63F8F171328e4aA287BC18b3C2276e0159";
        const contractABI = abi;
        try {
            const { ethereum } = window;
            if (ethereum) {
                const account = await ethereum.request({
                    method: "eth_requestAccounts",
                });
                ethereum.on("chainChanged", () => {
                    window.location.reload();
                });

                ethereum.on("accountsChanged", () => {
                    window.location.reload();
                });

                const provider = new ethers.providers.Web3Provider(ethereum);  // Use ethers.providers directly
                const signer = provider.getSigner();
                const contract = new Contract(
                    contractAddress,
                    contractABI,
                    signer
                );
                setAddress(account[0]);
                setState({ provider, signer, contract });

            } else {
                alert('Please install and log in to Metamask wallet to initiate the transaction.');
            }
        } catch (error) {
            console.error("Error connecting wallet:", error);
            alert("An error occurred while connecting to the wallet. Please try again.");
        }
    }

    useEffect(() => {
        connectWallet();
    }, []);

    return (
        <Web3Context.Provider value={{ address, state }}>
            {children}
        </Web3Context.Provider>
    );
};

export default Web3Context;