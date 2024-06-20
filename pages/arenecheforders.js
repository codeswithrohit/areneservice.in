import React, { useEffect, useState } from 'react';
import { firebase } from '../Firebase/config';
import Link from 'next/link';
const ChefOrders = () => {
    const [bookings, setBookings] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
        if (authUser) {
          setUser(authUser.email);
        } else {
          setUser(null);
        }
      });
      return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const snapshot = await firebase.firestore().collection('kitchenorder').where('email', '==', user).get();
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setBookings(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching bookings:', error);
                setLoading(false);
            }
        };
    
        fetchBookings();
    }, [user]);

    return (
        <div>
            <section className="container mx-auto px-6 lg:py-16 py-36 font-mono">
                <h1 className='text-red-600 text-center font-bold text-4xl'>Our Orders</h1>
                {loading && <div class="flex min-h-screen justify-center items-center">
    <img class="w-20 h-20 animate-spin" src="https://www.svgrepo.com/show/70469/loading.svg" alt="Loading icon"/>
</div>
}
                {!loading && !bookings && <p>No Orders. Please make an order.</p>}
                {!loading && bookings && bookings.length > 0 && (
                    <div class="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
                        <div class="w-full overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200 font-[sans-serif]">
    <thead class="bg-gray-100 whitespace-nowrap">
      <tr>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Customer Name
        </th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
       Thalli Name
        </th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Order Details
        </th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Payment
        </th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Booking Date
        </th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200 whitespace-nowrap">
    {bookings && bookings.map(booking => (
      <tr key={booking.id} >
        <td class="px-6 py-4 text-sm text-[#333]">
        {booking.firstName} {booking.lastName}
        </td>
        <td class="px-6 py-4 text-sm text-[#333]">
        {booking.thaliname}
        </td>
        <td class="px-6 py-4 text-sm text-[#333]">
        <div>
                    <p>No. of Thalli: {booking.noofthalli}</p>
                    <p>Tenure: {booking.selectedTenure}</p>
                    <p>Price: {booking.Foodcharge}</p>
                </div>
        
        </td>
        <td class="px-6 py-4 text-sm text-[#333]">
        {booking.Payment}
        </td>
        <td class="px-6 py-4 text-sm text-[#333]">
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
        <td class="px-6 py-4 text-sm text-[#333]">
        {booking.GarmentTypes ? (
                                                                        <Link href={`/laundrybookingdetails?orderId=${booking.orderId}`}>
                                                                            <a className="bg-blue-500 text-white px-2 py-1 rounded">
                                                                                View Details
                                                                            </a>
                                                                        </Link>
                                                                    ) : (
                                                                        <Link href={`/arenechefdetails?orderId=${booking.orderId}`}>
                                                                            <a className="bg-blue-500 text-white px-2 py-1 rounded">
                                                                                Booking Details
                                                                            </a>
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

export default ChefOrders;
