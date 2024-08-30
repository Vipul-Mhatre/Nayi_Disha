import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../store/auth';
import Web3Context from '../store/Web3Context';

const Navbar = () => {
    const [state, setState] = useState(false);
    const { isLoggedIn, setTheme, theme } = useAuth();
    const { connectWallet, address } = useContext(Web3Context);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    console.log('role', role);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    const handleProfileClick = () => {
        navigate('/dashboard');
    };

    const navigationUser = [
        { title: 'Home', path: '/' },
        { title: 'Ongoing Campaigns', path: '/ongoing' },
        { title: 'Upcoming Campaigns', path: '/' },
        { title: 'Organizations', path: '/' },
        { title: 'Donate', path: '/donate' },
        { title: 'Donations', path: '/donations' },
        { title: 'Track Donations', path: '/track-donations' },
    ];
    
    const navigationOrg = [
        { title: 'Home', path: '/' },
        { title: 'Create Campaign', path: '/register-campaign' },
        { title: 'Edit Campaign', path: '/edit-campaign' },
        { title: 'All Campaign', path: '/all-campaign' },
        { title: 'Complete Donations', path: '/complete-donations' },
        { title: 'Donors', path: '/donors' },
        { title: 'Transfer Donation', path: '/complete-donation' },
    ];

    return (
        <div className={`${token ? '' : 'hidden'}`}>
            <button
                className="fixed top-4 left-4 z-50 text-gray-500 hover:text-gray-800 md:hidden"
                onClick={() => setState(!state)}
                aria-label="Toggle menu"
            >
                {state ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 z-50" viewBox="0 0 20 20" fill="rgba(255,255,255,0.6)">
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                ) : (
                    <div className="bg-slate-200 p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </div>
                )}
            </button>

            <nav className={`fixed top-0 border-r border-r-white left-0 h-full w-64 bg-gray-900 transform ${state ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0 z-40`}>
                <div className="p-4">
                    <ul className="space-y-4">
                        <li className="flex justify-center align-middle items-center text-white gap-1 py-7">
                            <img src="logo192.png" className="w-7" alt="Logo" />
                            NayiDisha
                        </li>
                        <hr />
                        <li>
                            <button
                                onClick={connectWallet}
                                className="flex items-center py-3 px-5 font-medium text-center text-blue-600 border border-blue-600 bg-transparent hover:bg-blue-600 hover:text-white active:text-white active:bg-blue-700 rounded-lg shadow-lg cursor-pointer transition-colors duration-300 mb-3"
                            >
                                {address ? `${address.slice(0, 15)}...${address.slice(-4)}` : 'Connect Wallet'}
                            </button>
                        </li>

                        {role === 'user' && (
                            navigationUser.map((item, idx) => (
                                <li key={idx} onClick={() => setState(false)} className="text-gray-200 hover:bg-slate-600 rounded-lg">
                                    <Link to={item.path} className="block py-2 px-4">
                                        {item.title}
                                    </Link>
                                </li>
                            ))
                        )}

                        {role === 'organization' && (
                            navigationOrg.map((item, idx) => (
                                <li key={idx} onClick={() => setState(false)} className="text-gray-200 hover:bg-slate-600 rounded-lg">
                                    <Link to={item.path} className="block py-2 px-4">
                                        {item.title}
                                    </Link>
                                </li>
                            ))
                        )}

                        <li className="mt-36">
                            {isLoggedIn && (
                                <>
                                    <p
                                        onClick={handleProfileClick}
                                        className="flex items-center py-3 px-5 font-medium text-center text-blue-600 border border-blue-600 bg-transparent hover:bg-blue-600 hover:text-white active:text-white active:bg-blue-700 rounded-lg shadow-lg cursor-pointer transition-colors duration-300 mb-3"
                                    >
                                        <FaUserCircle className="mr-3 text-2xl" />
                                        Dashboard
                                    </p>
                                    <p
                                        onClick={logout}
                                        className="flex items-center py-3 px-5 font-medium text-center text-red-600 border border-red-600 bg-transparent hover:bg-red-600 hover:text-white active:text-white active:bg-red-700 rounded-lg shadow-lg cursor-pointer transition-colors duration-300"
                                    >
                                        Log out
                                    </p>
                                </>
                            )}
                        </li>
                        {!isLoggedIn && (
                            <li className="mt-4">
                                <Link to="/login" className="block py-2 px-4 font-medium text-center text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg shadow">
                                    Log in
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
