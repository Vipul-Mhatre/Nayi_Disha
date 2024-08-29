import { ethers, Contract } from "ethers";
import Abi from './ABI.json';

export const connectWallet = async () => {
    try {
        if (!window.ethereum) throw new Error("Metamask is not installed");

        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });

        const chainIdHex = await window.ethereum.request({
            method: 'eth_chainId'
        });
        const chainId = parseInt(chainIdHex, 16);

        const selectedAccount = accounts[0];
        if (!selectedAccount) throw new Error("No Ethereum accounts available");

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        const contractAddress = "0x13D1734A0Cbb0a7472Fe8fd7023Ead0F67a64012";

        const charityContract = new Contract(contractAddress, Abi, signer);

        return { provider, selectedAccount, charityContract, chainId };
    } catch (error) {
        console.error("Error connecting wallet:", error);
        throw error;
    }
};
