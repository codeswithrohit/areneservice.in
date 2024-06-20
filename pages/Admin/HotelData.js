import React, { useState, useEffect } from 'react';
import { firebase } from '../../Firebase/config';
import AdminNavbar from '../../components/AdminNavbar';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Hoteldata = () => {
    const [hoteldata, setHotelData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [approvedCount, setApprovedCount] = useState(0);
    const [unapprovedCount, setUnapprovedCount] = useState(0);
    const [filter, setFilter] = useState('all'); // 'all', 'approved', 'unapproved'
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const db = firebase.firestore();
                const galleryRef = db.collection('Hoteldetail');
                const snapshot = await galleryRef.get();
                const data = [];
                let approved = 0;
                let unapproved = 0;
                snapshot.forEach((doc) => {
                    const item = { id: doc.id, ...doc.data() };
                    // Convert Verified field to boolean
                    item.Verified = item.Verified === "true"; // Convert "true" to true, "false" to false
                    data.push(item);
                    if (item.Verified) {
                        approved++;
                    } else {
                        unapproved++;
                    }
                });
                // Sort the data based on createdAt timestamp in descending order
                data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setHotelData(data);
                setApprovedCount(approved);
                setUnapprovedCount(unapproved);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data: ', error);
                setIsLoading(false); // Update isLoading to false even if there's an error
            }
        };
      
        fetchData();
    }, []);

    const handleVerificationChange = async (id, Verified) => {
        try {
            const db = firebase.firestore();
            const RentRef = db.collection('Hoteldetail').doc(id);
            await RentRef.update({ Verified: Verified });
            // Update the local state to reflect the change immediately
            setHotelData(prevState => prevState.map(item => item.id === id ? { ...item, Verified: Verified === 'true' } : item));
            if (Verified === 'true') {
                setApprovedCount(prevCount => prevCount + 1);
                setUnapprovedCount(prevCount => prevCount - 1);
            } else {
                setApprovedCount(prevCount => prevCount - 1);
                setUnapprovedCount(prevCount => prevCount + 1);
            }
            console.log(`Verification status for Hotel with ID ${id} changed to ${Verified}`);
            
            // Show toast notification
            toast.success(`Verification status for Hotel with ID ${id} changed to ${Verified === 'true' ? 'Approved' : 'Unapproved'}`);
        } catch (error) {
            console.error('Error updating verification status: ', error);
            toast.error('Error updating verification status');
        }
    };

    // Get current items
    const filteredData = filter === 'approved' ? hoteldata.filter(item => item.Verified) :
                        filter === 'unapproved' ? hoteldata.filter(item => !item.Verified) :
                        hoteldata;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminNavbar/>
            <div className="lg:ml-64 p-8">
                <h1 className="text-3xl font-bold mb-8">Hotel Property Data</h1>
                <div className="flex mb-4">
                    <button className={`mr-4 ${filter === 'all' ? 'bg-gray-500 rounded-sm px-2 text-white' : 'text-blue-500'}`} onClick={() => setFilter('all')}>All ({approvedCount + unapprovedCount})</button>
                    <button className={`mr-4 ${filter === 'approved' ? 'bg-gray-500 rounded-sm px-2 text-white' : 'text-blue-500'}`} onClick={() => setFilter('approved')}>Approved ({approvedCount})</button>
                    <button className={`${filter === 'unapproved' ? 'bg-gray-500 rounded-sm px-2 text-white' : 'text-blue-500'}`} onClick={() => setFilter('unapproved')}>Unapproved ({unapprovedCount})</button>
                </div>
                {isLoading ? (
                    <div className="flex min-h-screen justify-center items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            className="w-12 h-12 animate-spin"
                            viewBox="0 0 16 16"
                        >
                            <path
                                d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"
                            />
                            <path
                                fillRule="evenodd"
                                d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
                            />
                        </svg>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white shadow-md rounded-md overflow-hidden">
                            <thead className="bg-gray-200 text-gray-700">
                                <tr>
                                    <th className="py-3 px-4 text-left">Hotel Name</th>
                                    <th className="py-3 px-4 text-left">Hotel Owner</th>
                                    <th className="py-3 px-4 text-left">Verification</th>
                                    <th className="py-3 px-4 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item, index) => (
                                    <tr key={index} className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                                        <td className="py-3 px-4">{item.HotelName}</td>
                                        <td className="py-3 px-4">{item.Owner}</td>
                                        <td className="py-3 px-4">
                                            <select
                                                className="border rounded p-1"
                                                value={item.Verified ? "true" : "false"}
                                                onChange={(e) => handleVerificationChange(item.id, e.target.value)}
                                            >
                                                <option value="true">Approved</option>
                                                <option value="false">Unapproved</option>
                                            </select>
                                        </td>
                                        <td className="py-3 px-4">
                                            <Link href={`/hoteldetail?id=${item.id}`}>
                                                <a className="text-blue-500 hover:text-blue-700">View Details</a>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <nav className="mt-4" aria-label="Pagination">
                    <ul className="flex justify-center">
                        {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, i) => (
                            <li key={i} onClick={() => paginate(i + 1)} className={`cursor-pointer mx-1 px-3 py-1 rounded-md ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                                {i + 1}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <ToastContainer/>
        </div>
    );
};

export default Hoteldata;
