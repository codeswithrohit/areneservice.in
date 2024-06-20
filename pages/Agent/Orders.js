import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';
import { firebase } from '../../Firebase/config';
import AgentNav from '../../components/AgentNav';
import Link from 'next/link';

const Ourhistory = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [bookings, setBookings] = useState([]); // Moved here
    const [totalOrders, setTotalOrders] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showToday, setShowToday] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user.uid);
                fetchUserData(user);
            } else {
                setUser(null);
                setUserData(null);
                router.push('/Agent/Register'); // Redirect to the login page if the user is not authenticated
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const snapshot = await firebase.firestore().collection('bookings').where('Agentid', '==', user).get();
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // Sort bookings by OrderDate from current date to the latest date
                data.sort((a, b) => new Date(a.OrderDate) - new Date(b.OrderDate));
                const currentDate = new Date().toISOString().slice(0, 10);
                const filteredBookings = showToday ? data.filter(booking => booking.OrderDate === currentDate) : data;
                setBookings(filteredBookings);
                setTotalOrders(data.length);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching bookings:', error);
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user, showToday]);

    useEffect(() => {
        if (loading) {
            return; // No need to fetch user data while loading
        }
        // Fetch user data after authentication is done
        fetchUserData(user);
    }, [loading, user]);

    const fetchUserData = async (user) => {
        try {
            const db = getFirestore();
            const userDocRef = doc(db, 'AgentOwner', user.uid); // Update the path to the user document
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                if (userData.isVendor) {
                    setUserData(userData);
                } else {
                    router.push('/Agent/Register'); // Redirect to the login page if the user is not an admin
                }
            } else {
                // Handle case where user data doesn't exist in Firestore
                // You can create a new user profile or handle it based on your app's logic
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTodayClick = () => {
        setShowToday(true);
    };

    const handleTotalClick = () => {
        setShowToday(false);
    };

    return (
        <div className='min-h-screen'>
            <AgentNav />
            <section className="container px-4 md:px-24 lg:py-16 py-4 md:py-36 font-mono">
                <h1 className='text-red-600 text-center font-bold text-4xl'>Our Orders</h1>
                <ul className="grid grid-cols-2 mt-20 font-sans">
                    <li
                        onClick={handleTodayClick}
                        className={`text-center py-3 px-4 border-b-2 cursor-pointer transition-all ${
                            showToday ? 'bg-blue-600 font-bold text-xl text-white' : 'bg-gray-200 font-bold text-xl text-gray-700 hover:bg-gray-300'
                        }`}>
                        Today
                    </li>
                    <li
                        onClick={handleTotalClick}
                        className={`text-center py-3 px-4 border-b-2 cursor-pointer transition-all ${
                            !showToday ? 'bg-blue-600 font-bold text-xl text-white' : 'bg-gray-200 font-bold text-xl text-gray-700 hover:bg-gray-300'
                        }`}>
                        Total
                    </li>
                </ul>
                {loading && <div className="flex min-h-screen justify-center items-center">
                    <button type="button"
                        className="px-6 py-2.5 rounded-full text-white text-sm tracking-wider font-semibold border-none outline-none bg-orange-600 hover:bg-orange-700 active:bg-orange-600">
                        Loading
                        <svg xmlns="http://www.w3.org/2000/svg" width="18px" fill="#fff" className="ml-2 inline animate-spin"
                            viewBox="0 0 24 24">
                            <path fillRule="evenodd"
                                d="M7.03 2.757a1 1 0 0 1 1.213-.727l4 1a1 1 0 0 1 .59 1.525l-2 3a1 1 0 0 1-1.665-1.11l.755-1.132a7.003 7.003 0 0 0-2.735 11.77 1 1 0 0 1-1.376 1.453A8.978 8.978 0 0 1 3 12a9 9 0 0 1 4.874-8l-.117-.03a1 1 0 0 1-.727-1.213zm10.092 3.017a1 1 0 0 1 1.414.038A8.973 8.973 0 0 1 21 12a9 9 0 0 1-5.068 8.098 1 1 0 0 1-.707 1.864l-3.5-1a1 1 0 0 1-.557-1.517l2-3a1 1 0 0 1 1.664 1.11l-.755 1.132a7.003 7.003 0 0 0 3.006-11.5 1 1 0 0 1 .039-1.413z"
                                clipRule="evenodd" data-original="#000000" />
                        </svg>
                    </button>
                </div>}
                { bookings.length === 0 && (
          <p className="text-black text-center mt-4">No  Orders.</p>
        )}
                {!loading && bookings && bookings.length > 0 && (
                    <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
                        <div className="w-full overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 font-[sans-serif]">
                                <thead className="bg-gray-100 whitespace-nowrap">
                                    <tr>
                                        <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customer Name
                                        </th>
                                        <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Order Details
                                        </th>
                                        <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Payment
                                        </th>
                                        <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Booking Date
                                        </th>
                                        <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 whitespace-nowrap">
                                    {bookings.map((booking) => (
                                        <tr key={booking.id}>
                                            <td className="px-2 py-4 text-xs text-[#333]">
                                                {booking.Name}
                                            </td>
                                            <td className="px-2 py-4 text-xs text-[#333]">
                                                {booking.GarmentTypes ? (
                                                    // If GarmentTypes available, show the data
                                                    JSON.parse(booking.GarmentTypes).map((garment, index) => (
                                                        <div key={index}>
                                                            <p>No. of Garments: {garment.noofgarments}</p>
                                                            <p>Tenure: {garment.tenure}</p>
                                                            <p>Price: {garment.price}</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    // If GarmentTypes not available, show order details
                                                    `${booking.Propertyname}-${booking.roomType}-${booking.roomprice}`
                                                )}
                                            </td>
                                            <td className="px-2 py-4 text-xs text-[#333]">
                                                {booking.Payment}
                                            </td>
                               <td className="px-2 py-4 text-xs text-[#333]">
                                 {booking.bookingDate instanceof Object ? (
                                   // If bookingDate is an object, extract checkIn or checkOut
                                   <>
                                     <p>Check In: {booking.bookingDate.checkIn}</p>
                                     {booking.bookingDate.checkOut ? (
                                       <p>Check Out: {booking.bookingDate.checkOut}</p>
                                     ) : null}
                                   </>
                                 ) : (
                                   // If bookingDate is a string, display it directly
                                   <p>{booking.bookingDate}</p>
                                 )}
                               </td>
                               <td className="px-2 py-4 text-xs text-[#333]">
                                 {booking.GarmentTypes ? (
                                   <Link href={`/laundrybookingdetails?orderId=${booking.orderId}`}>
                                     <a className="bg-blue-500 text-white px-2 py-1 rounded">View Details</a>
                                   </Link>
                                 ) : (
                                   <Link href={`/Admin/adminorder?orderId=${booking.orderId}`}>
                                     <a className="bg-blue-500 text-white px-2 py-1 rounded">Booking Details</a>
                                   </Link>
                                 )}
                               </td>
                             </tr>
                           ))}
                       </tbody>
                     </table>
                   </div>
                 </div>
                 
                )}
            </section>
        </div>
    );
}

export default Ourhistory;
