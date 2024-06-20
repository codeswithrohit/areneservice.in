import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { firebase } from '../../Firebase/config';
import AgentNav from '../../components/AgentNav';
import Link from 'next/link';
const Ourhistory = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [bookings, setBookings] = useState([]); // Moved here
    const [totalOrders, setTotalOrders] = useState(0);
    const [todayOrders, setTodayOrders] = useState(0);
    const [loading, setLoading] = useState(true);

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
                console.log(currentDate) // Get current date in 'YYYY-MM-DD' format
                const filteredBookings = data.filter(booking => booking.OrderDate === currentDate);
                console.log(filteredBookings); // Log filtered bookings
                setBookings(filteredBookings);
                setTodayOrders(filteredBookings.length);
                setTotalOrders(data.length);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching bookings:', error);
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user]);

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
    return (
        <div className='min-h-screen' >
            <AgentNav />
            <section className=" container px-4 md:px-24 lg:py-4 py-4 mt-24 md:py-4 font-mono">
                
            {/* <div class="  flex items-center justify-center font-[sans-serif] text-[#333]">
      <div class="bg-white shadow-[0_4px_24px_-8px_rgba(0,0,0,0.2)] grid lg:grid-cols-2 sm:grid-cols-2 sm:gap-24 gap-4 rounded-3xl px-20 py-10">
        <div class="text-center">
          <h3 class="text-4xl font-extrabold">{totalOrders}<span class="text-blue-600"></span></h3>
          <p class="text-gray-500 font-semibold mt-3">Total Orders</p>
        </div>
        <div class="text-center">
          <h3 class="text-4xl font-extrabold">{todayOrders}<span class="text-blue-600"></span></h3>
          <p class="text-gray-500 font-semibold mt-3">Today Orders</p>
        </div>

      </div>
    </div> */}
 

                <h1 className='text-red-600 text-center font-bold text-4xl mb-4'>Today Orders</h1>
                {loading &&  <div className="flex justify-center items-center h-screen">
          <button type="button"
            className="px-6 py-2.5 rounded-full text-white text-sm tracking-wider font-semibold border-none outline-none bg-[#43d3b0] hover:bg-orange-700 active:bg-[#43d3b0]">
            Loading
            <svg xmlns="http://www.w3.org/2000/svg" width="18px" fill="#fff" className="ml-2 inline animate-spin" viewBox="0 0 24 24">
              <path fillRule="evenodd"
                d="M7.03 2.757a1 1 0 0 1 1.213-.727l4 1a1 1 0 0 1 .59 1.525l-2 3a1 1 0 0 1-1.665-1.11l.755-1.132a7.003 7.003 0 0 0-2.735 11.77 1 1 0 0 1-1.376 1.453A8.978 8.978 0 0 1 3 12a9 9 0 0 1 4.874-8l-.117-.03a1 1 0 0 1-.727-1.213zm10.092 3.017a1 1 0 0 1 1.376-1.453A8.978 8.978 0 0 1 21 12a9 9 0 0 1-4.874 8l.117.03a1 1 0 0 1 .727 1.213 1 1 0 0 1-1.213.727l-4-1a1 1 0 0 1-.59-1.525l2-3a1 1 0 0 1 1.665 1.11l-.755 1.132a7.003 7.003 0 0 0 2.735-11.77z"
                clipRule="evenodd" />
            </svg>
          </button>
        </div>
                }
               {!loading && bookings.length === 0 && (
          <p className="text-black text-center mt-4">No Today Orders.</p>
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
                                    {bookings &&
                                        bookings.map((booking) => (
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
                                                        <Link href={`/bookingdetails?orderId=${booking.orderId}`}>
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
