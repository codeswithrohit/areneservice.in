import React, { useEffect, useState } from 'react';
import { firebase } from '../../Firebase/config';
import Link from 'next/link';
import AdminNavbar from '../../components/AdminNavbar';
const Ourhistory = () => {
    const [bookings, setBookings] = useState(null);
    const [loading, setLoading] = useState(true);

   

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const snapshot = await firebase.firestore().collection('bookings').get();
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // Sort bookings by OrderDate from current date to the latest date
                data.sort((a, b) => new Date(a.OrderDate) - new Date(b.OrderDate));
                setBookings(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching bookings:', error);
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    console.log(bookings)
    return (
        <div className='min-h-screen' >
            <AdminNavbar/>
            <section className=" lg:ml-56 container px-4 md:px-24 lg:py-16 py-4 md:py-36 font-mono">
                <h1 className='text-red-600 text-center font-bold text-4xl'>Our Orders</h1>
                {loading && <div class="flex min-h-screen justify-center items-center">
    <img class="w-20 h-20 animate-spin" src="https://www.svgrepo.com/show/70469/loading.svg" alt="Loading icon"/>
</div>
}
                {!loading && !bookings && <p>No Orders. Please make an order.</p>}
                {!loading && bookings && bookings.length > 0 && (
                   <div className="w-full px-12 mb-8 overflow-hidden rounded-lg shadow-lg">
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
