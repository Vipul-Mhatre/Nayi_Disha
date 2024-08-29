import React, { useState } from 'react';
import { useAuth } from '../store/auth';

const Dropdown = ({ head, data }) => {
    const { setRole } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [label, setLabel] = useState();

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className='w-full h-full min-h-20 flex justify-center items-center flex-col'>
            <button
                id="dropdownSearchButton"
                onClick={toggleDropdown}
                className="text-white w-full bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
                type="button"
            >
                {label || head}
                <svg
                    className="w-2.5 h-2.5 ms-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 4 4 4-4"
                    />
                </svg>
            </button>

            {isOpen && (
                <div id="dropdownSearch" className="md:w-3/12 w-10/12 absolute z-10 mt-80 bg-white rounded-lg shadow dark:bg-gray-700">
                    <div className="p-3">
                        <label htmlFor="input-group-search" className="sr-only">Search</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg
                                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="input-group-search"
                                className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500"
                                placeholder="Search user"
                            />
                        </div>
                    </div>
                    <ul className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownSearchButton">
                        {data && data.length > 0 ? data.map((row, index) => (
                            <li key={index} className="flex items-center ps-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                                <label onClick={() => { setRole(row.label.toLowerCase()); setLabel(row.label);setIsOpen(!isOpen)}} htmlFor={`checkbox-item-${index}`} className="w-full py-2 ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
                                    {row.label}
                                </label>
                            </li>
                        )) : (
                            <li className="text-center py-2">No data</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Dropdown;