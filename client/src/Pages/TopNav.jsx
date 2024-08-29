import React from 'react';

const TopNav = () => {
    return (
        <main>
            <div className={`bg-gray-900 text-white ml-64 py-5 shadow-md`}>
                <ul className='flex justify-around items-center space-x-8 text-lg font-semibold'>
                    <li className='hover:text-gray-300 transition-colors duration-200 cursor-pointer'>Home</li>
                    <li className='hover:text-gray-300 transition-colors duration-200 cursor-pointer'>About</li>
                    <li className='hover:text-gray-300 transition-colors duration-200 cursor-pointer'>Services</li>
                    <li className='hover:text-gray-300 transition-colors duration-200 cursor-pointer'>Contact</li>
                </ul>
            </div>
            <hr/>
        </main>
    );
}

export default TopNav;