import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { users } from '../store/mockData';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TopDonorsChart = () => {
    const topDonors = users
        .map(user => ({
            ...user,
            totalDonated: Object.values(user.donations).reduce((sum, donation) => sum + donation, 0),
        }))
        .sort((a, b) => b.totalDonated - a.totalDonated)
        .slice(0, 10);

    const data = {
        labels: topDonors.map(user => user.name),
        datasets: [
            {
                label: 'May',
                data: topDonors.map(user => user.donations.May),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
            {
                label: 'June',
                data: topDonors.map(user => user.donations.June),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
            {
                label: 'July',
                data: topDonors.map(user => user.donations.July),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, // Maintain aspect ratio for no overflow
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Top 3 Donors Over 3 Months',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="p-6 w-full h-96 bg-white rounded-xl shadow-md space-y-4">
            <Bar data={data} options={options} />
        </div>
    );
};

export default TopDonorsChart;
