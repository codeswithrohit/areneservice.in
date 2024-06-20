import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { firebase } from '../../Firebase/config';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { FaBell, FaCheckCircle } from 'react-icons/fa';

const Test = () => {
  const [mainactiveTab, setMainActiveTab] = useState('orderAlert'); // State to track active tab

  // Function to handle tab change
  const handleTabChange = (tab) => {
    setMainActiveTab(tab);
  };


  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // Loading state for user authentication
  const [userData, setUserData] = useState(null);
  const [bookings, setBookings] = useState(null);
  const [deliverybookings, setDeliveryBookings] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true); // Loading state for fetching bookings
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [thalliName, setThalliName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [noOfThalli, setNoOfThalli] = useState('');
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [activeTab, setActiveTab] = useState("today");

  const getCurrentDate = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
  };

  useEffect(() => {
      const unsubscribe = firebase.auth().onAuthStateChanged(user => {
          setUser(user);
          setIsLoadingAuth(false); // Set loading state to false when authentication state is resolved
      });
      return () => unsubscribe();
  }, []);

  useEffect(() => {
      if (user) {
          fetchUserData(user);
      }
  }, [user]);

  const fetchUserData = async (user) => {
      try {
          const userDocRef = firebase
              .firestore()
              .collection("Deliveryboy")
              .doc(user.uid);
          const userDocSnap = await userDocRef.get();
          if (userDocSnap.exists) {
              const userData = userDocSnap.data();
              if (userData && userData.isDeliveryboy) {
                  setUserData(userData);
              } else {
                  router.push('/Deliveryboy/loginregister');
              }
          } else {
              // Handle case where user data doesn't exist
          }
      } catch (error) {
          console.error('Error fetching user data:', error);
      } finally {
          setIsLoadingData(false); // Set loading state to false after fetching user data
      }
  };

  const handleLogout = async () => {
      const auth = getAuth();
      try {
          await signOut(auth);
          router.push('/Admin/Register');
      } catch (error) {
          console.error('Error signing out:', error);
      }
  };
  const currentUser = firebase.auth().currentUser;
  useEffect(() => {
    const fetchBookings = async () => {
        try {
            if (userData) {
                const snapshot = await firebase.firestore().collection('kitchenorder').where('pincode', '==', userData.pincode).get();
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                data.sort((a, b) => new Date(a.OrderDate) - new Date(b.OrderDate));
                setBookings(data);
                setIsLoadingData(false); // Set loading state to false after fetching bookings
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };
    fetchBookings();
}, [userData,currentUser]); // Add userData to the dependency array
  useEffect(() => {
    const fetchBookings = async () => {
        try {
            if (userData) {
                const snapshot = await firebase.firestore().collection('kitchenorder').where('pincode', '==', userData.pincode).where('deliveryconfirmation', '==', "false").get();
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                data.sort((a, b) => new Date(a.OrderDate) - new Date(b.OrderDate));
                setDeliveryBookings(data);
                setIsLoadingData(false); // Set loading state to false after fetching bookings
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };
    fetchBookings();
}, [userData,currentUser]); // Add userData to the dependency array

  
  console.log("orders",bookings)
console.log("userdata",userData)

  const handleConfirmOrder = async (bookingId) => {
      try {
          const currentUser = firebase.auth().currentUser;
          if (!currentUser || !currentUser.uid) {
              console.error('User is not authenticated.');
              return;
          }
  
          await firebase.firestore().collection('kitchenorder').doc(bookingId).update({
              deliveryboyid: currentUser.uid,
              deliveryconfirmation:true
          });
          toast.success('Order confirmed successfully!', {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
          });
          window.location.reload();
      } catch (error) {
          console.error('Error confirming order:', error);
      }
  };
  
  

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
          const orderDocRef = firebase.firestore().collection('kitchenorder').doc(selectedOrder.id);
          const orderSnapshot = await orderDocRef.get();
          const currentOrderData = orderSnapshot.data();
          const newOrderHistory = {
              thalliName: thalliName,
              ingredients: ingredients,
              noOfThalli: parseInt(noOfThalli),
              createdAt: firebase.firestore.Timestamp.now()
          };
          const updatedOrderHistory = [...(currentOrderData.orderHistory || []), newOrderHistory];
          const updatedNoofthalli = selectedOrder.noofthalli - parseInt(noOfThalli);
          await orderDocRef.update({
              orderHistory: updatedOrderHistory,
              noofthalli: updatedNoofthalli
          });
          const updatedBookings = bookings.map(booking => {
              if (booking.id === selectedOrder.id) {
                  return { ...booking, noofthalli: updatedNoofthalli };
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

// Inside the component
const filteredBookings = !isLoadingData && bookings && bookings.filter(booking => {
  // Filter by confirmation and deliveryboyid
  if (activeTab === "today") {
      return booking.OrderDate === getCurrentDate() && booking.deliveryboyid === currentUser.uid;
  } else {
      return booking.deliveryboyid === currentUser.uid;
  }
});




if (userData && userData.verified) {
  return (
    <div>
    <section className="px-6 lg:py-4 py-4 font-mono">
    {isLoadingAuth || isLoadingData ? ( // Check if either authentication or data loading is in progress
            <div className="text-center mt-4">
                Loading...
            </div>
        ) : (
<div>

        <h1 className='text-red-600 text-center font-bold text-4xl'>Our Orders</h1>
        <div className="flex mb-8">
      <button
        className={`mr-4 px-4 py-2 flex items-center justify-center ${mainactiveTab === 'orderAlert' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
        onClick={() => handleTabChange('orderAlert')}
      >
        <FaBell className="mr-2" />
        Order Alert
      </button>
      <button
        className={`px-4 py-2 flex items-center justify-center ${mainactiveTab === 'confirmedOrders' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
        onClick={() => handleTabChange('confirmedOrders')}
      >
        <FaCheckCircle className="mr-2" />
        Confirmed Orders
      </button>
    </div>
         {/* Data display based on active tab */}
    <div className="bg-gray-100 p-4 rounded-md">
      {mainactiveTab === 'orderAlert' && (
        <div>
      
       
        {/* Step 5: Use filteredBookings */}

        {!isLoadingData && deliverybookings && deliverybookings.length > 0 ? (
            <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
                <div className="w-full overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 font-[sans-serif]">
                        <thead className="bg-gray-100 whitespace-nowrap">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thalli Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order Details
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Booking Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 whitespace-nowrap">
                            {/* Table rows */}

            
                            {deliverybookings.map(booking => (
                                <tr key={booking.id}>
                                    <td className="px-6 py-4 text-sm text-[#333]">{booking.firstName} {booking.lastName}</td>
                                    <td className="px-6 py-4 text-sm text-[#333]">{booking.thaliname}</td>
                                    <td className="px-6 py-4 text-sm text-[#333]">
                                        <div>
                                            <p>No. of Thalli: {booking.noofthalli}</p>
                                            <p>Tenure: {booking.selectedTenure}</p>
                                            <p>Price: {booking.Foodcharge}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#333]">{booking.Payment}</td>
                                    <td className="px-6 py-4 text-sm text-[#333]">
                                        {/* Display booking date */}
                                        {booking.bookingDate instanceof Object ? (
                                            <>
                                                <p>Check In: {booking.bookingDate.checkIn}</p>
                                                {booking.bookingDate.checkOut ? (
                                                    <p>Check Out: {booking.bookingDate.checkOut}</p>
                                                ) : null}
                                            </>
                                        ) : (
                                            <p>{booking.bookingDate}</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#333]">
                                        {/* Display action buttons */}
                                        {booking.GarmentTypes ? (
                                            <Link href={`/laundrybookingdetails?orderId=${booking.orderId}`}>
                                                <a className="bg-blue-500 text-white px-2 py-1 rounded">
                                                    View Details
                                                </a>
                                            </Link>
                                        ) : (
                                            <Link href={`/Admin/adminarenechefdetails?orderId=${booking.orderId}`}>
                                                <a className="bg-blue-500 text-white px-2 py-1 rounded">
                                                    Booking Details
                                                </a>
                                            </Link>
                                        )}
                                        {booking.deliveryconfirmation === "false" ? (
                                       <button onClick={() => handleConfirmOrder(booking.id)}
                                       class="animate-bounce focus:animate-none ml-8 hover:animate-none inline-flex text-md font-medium bg-indigo-900  px-4 py-2 rounded-lg tracking-wide text-white">
                                       <span class="ml-2">Confirm </span>
                                   </button>
                                        ) : (
                                            <button onClick={() => openModal(booking)} className="bg-blue-500 ml-4 text-white px-2 py-1 rounded">
                                                Update Orders Delivery
                                            </button>
                                        )}
                                    </td>
                                   
                                  
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        ) : (
            <div className="text-center mt-4">
                {activeTab === "today" ? "No orders for today" : "No orders"}
            </div>
        )}
        </div>
      )}

      {mainactiveTab === 'confirmedOrders' && (
        <div>
      
        <div className="sm:flex items-center mt-2 mb-4 ">
            <div className="flex ">
                {/* Step 4: Add button click handlers */}
                <button
                    className={`mx-1 px-3 py-1 rounded ${
                        activeTab === "today"
                            ? "bg-gray-800 text-white"
                            : "bg-gray-200 text-black"
                    }`}
                    onClick={() => setActiveTab("today")}
                >
                    Today
                </button>
                <button
                    className={`mx-1 px-3 py-1 rounded ${
                        activeTab === "total"
                            ? "bg-gray-800 text-white"
                            : "bg-gray-200 text-black"
                    }`}
                    onClick={() => setActiveTab("total")}
                >
                    Total
                </button>
            </div>
        </div>
        {/* Step 5: Use filteredBookings */}

        {!isLoadingData && filteredBookings && filteredBookings.length > 0 ? (
            <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
                <div className="w-full overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 font-[sans-serif]">
                        <thead className="bg-gray-100 whitespace-nowrap">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thalli Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order Details
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Booking Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 whitespace-nowrap">
                            {/* Table rows */}

            
                            {filteredBookings.map(booking => (
                                <tr key={booking.id}>
                                    <td className="px-6 py-4 text-sm text-[#333]">{booking.firstName} {booking.lastName}</td>
                                    <td className="px-6 py-4 text-sm text-[#333]">{booking.thaliname}</td>
                                    <td className="px-6 py-4 text-sm text-[#333]">
                                        <div>
                                            <p>No. of Thalli: {booking.noofthalli}</p>
                                            <p>Tenure: {booking.selectedTenure}</p>
                                            <p>Price: {booking.Foodcharge}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#333]">{booking.Payment}</td>
                                    <td className="px-6 py-4 text-sm text-[#333]">
                                        {/* Display booking date */}
                                        {booking.bookingDate instanceof Object ? (
                                            <>
                                                <p>Check In: {booking.bookingDate.checkIn}</p>
                                                {booking.bookingDate.checkOut ? (
                                                    <p>Check Out: {booking.bookingDate.checkOut}</p>
                                                ) : null}
                                            </>
                                        ) : (
                                            <p>{booking.bookingDate}</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#333]">
                                        {/* Display action buttons */}
                                        {booking.GarmentTypes ? (
                                            <Link href={`/laundrybookingdetails?orderId=${booking.orderId}`}>
                                                <a className="bg-blue-500 text-white px-2 py-1 rounded">
                                                    View Details
                                                </a>
                                            </Link>
                                        ) : (
                                            <Link href={`/Admin/adminarenechefdetails?orderId=${booking.orderId}`}>
                                                <a className="bg-blue-500 text-white px-2 py-1 rounded">
                                                    Booking Details
                                                </a>
                                            </Link>
                                        )}
                                        {booking.deliveryconfirmation === "false" ? (
                                       <button onClick={() => handleConfirmOrder(booking.id)}
                                       class="animate-bounce focus:animate-none ml-8 hover:animate-none inline-flex text-md font-medium bg-indigo-900  px-4 py-2 rounded-lg tracking-wide text-white">
                                       <span class="ml-2">Confirm </span>
                                   </button>
                                        ) : (
                                            <button onClick={() => openModal(booking)} className="bg-blue-500 ml-4 text-white px-2 py-1 rounded">
                                                Update Orders Delivery
                                            </button>
                                        )}
                                    </td>
                                   
                                  
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        ) : (
            <div className="text-center mt-4">
                {activeTab === "today" ? "No orders for today" : "No orders"}
            </div>
        )}
        </div>
      )}
    </div>

    
        </div>
        )}
    </section>
    
    {isModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true"></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4" id="modal-title">
                                    Update Order Delivery
                                </h3>
                                <form onSubmit={handleSubmit} className="space-y-6 px-4 max-w-sm mx-auto font-[sans-serif]">
                                    <div className="flex items-center">
                                        <label className="text-gray-400 w-36 text-sm">Thalli Name</label>
                                        <input type="text" placeholder="Enter thalli name"
                                            value={thalliName}
                                            onChange={(e) => setThalliName(e.target.value)}
                                            className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
                                    </div>
                                    <div className="flex items-center">
                                        <label className="text-gray-400 w-36 text-sm">Ingredients</label>
                                        <input type="text" placeholder="Enter Ingredients"
                                            value={ingredients}
                                            onChange={(e) => setIngredients(e.target.value)}
                                            className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
                                    </div>
                                    <div className="flex items-center">
                                        <label className="text-gray-400 w-36 text-sm">No. of Thalli</label>
                                        <input type="number" placeholder="Enter no. of thalli"
                                            value={noOfThalli}
                                            onChange={(e) => setNoOfThalli(e.target.value)}
                                            className="px-2 py-2 w-full border-b-2 focus:border-[#333] outline-none text-sm bg-white" />
                                    </div>
                                    <button
                                        type="button"
                                        className="px-6 py-2 w-full bg-[#333] text-sm text-white hover:bg-[#444] mx-auto block"
                                        onClick={handleSubmit}
                                        disabled={isLoadingSubmit}
                                    >
                                        {isLoadingSubmit ? 'Submitting...' : 'Submit'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button type="button" onClick={closeModal} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )}



    <ToastContainer />
</div>
  );
} else {
  return (
      <div className="flex justify-center items-center h-screen">
          {/* Show a message if user data is not verified */}
          <p>Your account verification is in process. Please wait.</p>
      </div>
  );
}

};

export default Test;
