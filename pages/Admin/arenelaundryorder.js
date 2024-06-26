import React, { useEffect, useState } from 'react';
import { firebase } from '../../Firebase/config';
import Link from 'next/link';
import AdminNavbar from "../../components/AdminNavbar";
import { toast, ToastContainer } from 'react-toastify'; // Fixed import
import 'react-toastify/dist/ReactToastify.css';
const ChefOrders = () => {
    const [bookings, setBookings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [noofgarment, setNoofgarment] = useState('');
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false); 
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const snapshot = await firebase.firestore().collection('laundryorders').get();
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setBookings(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching bookings:', error);
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const openModal = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async () => {
        setIsLoadingSubmit(true);
        try {
            // Check if the entered noofgarment is a valid positive integer
            const parsedNoOfGarment = parseInt(noofgarment);
            if (isNaN(parsedNoOfGarment) || parsedNoOfGarment <= 0) {
                toast.error('Please enter a valid number of garments.');
                setIsLoadingSubmit(false);
                return;
            }
    
            // Check if the entered noofgarment is not greater than the available Noofgarment
            if (parsedNoOfGarment > selectedOrder.Noofgarment) {
                toast.error('Cannot enter more garments than available.');
                setIsLoadingSubmit(false);
                return;
            }
    
            const orderDocRef = firebase.firestore().collection('laundryorders').doc(selectedOrder.id);
    
            // Get the current kitchenorder document
            const orderSnapshot = await orderDocRef.get();
            const currentOrderData = orderSnapshot.data();
    
            // Create a new order history object
            const newOrderHistory = {
                noofgarment: parsedNoOfGarment,
                createdAt: firebase.firestore.Timestamp.now() // Add current date
            };
    
            // Update the order history field in the kitchenorder document
            const updatedOrderHistory = [...(currentOrderData.orderHistory || []), newOrderHistory];
    
            // Update noofgarment in the kitchenorder collection
            const updatednoofgarment = selectedOrder.Noofgarment - parsedNoOfGarment;
    
            // Update the kitchenorder document with the new order history and updated noofgarment
            await orderDocRef.update({
                orderHistory: updatedOrderHistory,
                Noofgarment: updatednoofgarment // Update Noofgarment with the correct casing
            });
    
            // Update bookings state
            const updatedBookings = bookings.map(booking => {
                if (booking.id === selectedOrder.id) {
                    return { ...booking, Noofgarment: updatednoofgarment }; // Update Noofgarment with the correct casing
                }
                return booking;
            });
            setBookings(updatedBookings);
    
            toast.success('Order delivery updated successfully!', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
    
            setIsLoadingSubmit(false);
            closeModal();
        } catch (error) {
            console.error('Error updating orders:', error);
        }
    };
    
    
    
    
    


    return (
        <div className='min-h-screen' >
                <AdminNavbar />
            <section className=" lg:ml-64 px-6 lg:py-16 py-36 font-mono">
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
     Service
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
        {booking.Service}
        </td>
        <td class="px-6 py-4 text-sm text-[#333]">
        <div>
                    <p>No. of Garments: {booking.Noofgarment}</p>
                    <p>Tenure: {booking.selectedTenure}</p>
                    <p>Price: {booking.totalpayment}</p>
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
                                                                        <Link href={`/Admin/adminarenelaundrydetails?orderId=${booking.orderId}`}>
                                                                            <a className="bg-blue-500 text-white px-2 py-1 rounded">
                                                                                View Details
                                                                            </a>
                                                                        </Link>
                                                                    ) : (
                                                                        <Link href={`/Admin/adminarenelaundrydetails?orderId=${booking.orderId}`}>
                                                                            <a className="bg-blue-500 text-white px-2 py-1 rounded">
                                                                                Booking Details
                                                                            </a>
                                                                        </Link>
                                                                    )}
                                                                    <button onClick={() => openModal(booking)} className="bg-blue-500 ml-4 text-white px-2 py-1 rounded">
                                                                                Update Orders Delivery
                                                                            </button>
        </td>
       
      </tr>
    ))}
    </tbody>
  </table>
                        </div>
                    </div>
                )}
            </section>
            {isModalOpen && (
                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        {/* Modal background */}
                        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true"></div>
                        {/* Modal content */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            {/* Modal content here */}
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4" id="modal-title">
                                            Update Order Delivery
                                        </h3>
                                        <form onSubmit={handleSubmit} className="space-y-6 px-4 max-w-sm mx-auto font-[sans-serif]">
                                            
                                            <div className="flex items-center">
                                                <input type="number" placeholder="Enter no. of Garments"
                                                    value={noofgarment}
                                                    onChange={(e) => setNoofgarment(e.target.value)}
                                                    className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
                                            </div>

                                            <button
                                                type="button"
                                                className="px-6 py-2 w-full bg-[#333] text-sm text-white hover:bg-[#444] mx-auto block"
                                                onClick={handleSubmit}
                                                disabled={isLoadingSubmit} // Disable button while loading
                                            >
                                                {isLoadingSubmit ? 'Submitting...' : 'Submit'}
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            {/* Modal footer */}
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button type="button" onClick={closeModal} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer/>
        </div>
    );
}

export default ChefOrders;
