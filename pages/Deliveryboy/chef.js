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
  const [activeTab, setActiveTab] = useState("ongoingOrders");
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
  const [availablethalli, setavailablethalli] = useState('');
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

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

const [latitude, setLatitude] = useState(null);
const [longitude, setLongitude] = useState(null);
const [locations, setLocations] = useState(null);

useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);

        // Fetch location name using reverse geocoding
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyB6gEq59Ly20DUl7dEhHW9KgnaZy4HrkqQ`)
          .then(response => response.json())
          .then(data => {
            if (data.results && data.results.length > 0) {
              // Extracting more specific address components
              const addressComponents = data.results[0].address_components;
              const cityName = addressComponents.find(component => component.types.includes('locality'));
              const stateName = addressComponents.find(component => component.types.includes('administrative_area_level_1'));
              const countryName = addressComponents.find(component => component.types.includes('country'));

              // Constructing a more detailed location name
              const detailedLocation = [cityName, stateName, countryName]
                .filter(component => component !== undefined)
                .map(component => component.long_name)
                .join(', ');

              setLocations(detailedLocation);
            } else {
              setLocations("Location not found");
            }
          })
          .catch(error => {
            console.error('Error fetching location:', error);
            setLocations("Error fetching location");
          });
      },
      (error) => {
        console.error('Error getting geolocation:', error);
      }
    );
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
}, []);



  const handleConfirmOrder = async (bookingId) => {
      try {
          const currentUser = firebase.auth().currentUser;
          if (!currentUser || !currentUser.uid) {
              console.error('User is not authenticated.');
              return;
          }
  
          await firebase.firestore().collection('kitchenorder').doc(bookingId).update({
              deliveryboyid: currentUser.uid,
              deliveryconfirmation:true,
            //   deliveryboylocation:locations
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
  

 
  

// Inside the component
const filteredBookings = !isLoadingData && bookings && bookings.filter(booking => {
  // Filter by confirmation and deliveryboyid
  if (activeTab === "today") {
      return booking.OrderDate === getCurrentDate() && booking.deliveryboyid === currentUser.uid;
  } else {
      return booking.deliveryboyid === currentUser.uid;
  }
});

const ongoingOrders = bookings 
  ? bookings.filter(booking => 
      booking.availablethalli > 0 && 
      booking.orderstatus === "Confirm" && 
      booking.deliveryboyid === currentUser.uid
    ) 
  : [];

const currentDate = new Date().toISOString().split('T')[0];

const completedOrders = bookings 
  ? bookings.filter(booking => 
      booking.availablethalli === 0 && 
      booking.deliveryboyid === currentUser.uid
    ) 
  : [];

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString(); // This will give the date and time in a readable format
  };
  
  const handleStatusChange = async (bookingId, deliveryIndex, newStatus) => {
    try {
      const bookingRef = firebase.firestore().collection('kitchenorder').doc(bookingId);
      const bookingDoc = await bookingRef.get();
      if (bookingDoc.exists) {
        const bookingData = bookingDoc.data();
        const deliveryInfo = bookingData.Deliveryinfo;
        deliveryInfo[deliveryIndex].deliverystatus = newStatus;
        deliveryInfo[deliveryIndex].deliverydatetime = getCurrentDateTime();
        deliveryInfo[deliveryIndex].todayconfirm = newStatus;
  
        if (newStatus === "Out of Delivery") {
          // Update the deliveryboylocation with current location
          await bookingRef.update({
            Deliveryinfo: deliveryInfo,
            deliveryboylocation: locations,
          });
          toast.success('Status updated to Out of Delivery');
        } else if (newStatus === "Delivered") {
          // Update the Deliveryinfo and decrease availablethalli by 1
          const updatedAvailableThalli = bookingData.availablethalli - 1;
          await bookingRef.update({
            Deliveryinfo: deliveryInfo,
            availablethalli: updatedAvailableThalli,
          });
          toast.success('Status updated to Delivered');
        } else {
          await bookingRef.update({
            Deliveryinfo: deliveryInfo,
          });
          toast.success('Status updated successfully');
        }
        setTimeout(() => {
          window.location.reload();
        }, 2000); // Reload the page after 2 seconds to give time for the toast to show
      } else {
        console.log('No such document!');
        toast.error('No such document!');
      }
    } catch (error) {
      console.error('Error updating document: ', error);
      toast.error('Error updating document');
    }
  };



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
                                            <p>No. of Thalli: {booking.availablethalli}</p>
                                            <p>Tenure: {booking.selectedTenure}</p>
                                            <p>Price: {booking.Foodcharge}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#333]">{booking.Payment}</td>
                                    <td className="px-6 py-4 text-sm text-[#333]">
                                        {/* Display booking date */}
                                        {booking.bookingDate instanceof Object ? (
                                            <>
                                                <p>{booking.bookingDate.checkIn}</p>
                                                {booking.bookingDate.checkOut ? (
                                                    <p>{booking.bookingDate.checkOut}</p>
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
                                            <form className="flex items-center w-50 mt-2 ">
                                            {/* <select 
                                              className="bg-blue-500 text-white px-2 py-1 rounded"
                                              value={booking.orderstatus}
                                              onChange={(e) => handleOrderStatusChange(booking.id, e.target.value)}
                                            >
                                              <option value="">Select Options</option>
                                              <option value="Out of delivery">Out of delivery</option>
                                              <option value="Delivered">Delivered</option>
                                            </select> */}
                                        
                                          </form>
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
                      <button
                        className={`mx-1 px-3 py-1 rounded ${activeTab === "ongoingOrders" ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}`}
                        onClick={() => setActiveTab("ongoingOrders")}
                      >
                        Ongoing Orders
                      </button>
                      <button
                        className={`mx-1 px-3 py-1 rounded ${activeTab === "completedOrders" ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}`}
                        onClick={() => setActiveTab("completedOrders")}
                      >
                        Completed Orders
                      </button>
                    </div>
                  </div>
                  {activeTab === "ongoingOrders" && (
                     <div>
                     {!isLoadingData && ongoingOrders && ongoingOrders.length > 0 ? (
                       <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
                         <div className="w-full overflow-x-auto">
                           <table className="min-w-full divide-y divide-gray-200 font-[sans-serif]">
                             <thead className="bg-gray-100">
                               <tr>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thalli Name</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food Name</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Details</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking Date</th>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                               </tr>
                             </thead>
                             <tbody className="bg-white divide-y divide-gray-200 whitespace-nowrap">
      {ongoingOrders.map((booking, index) => (
        <React.Fragment key={booking.id}>
          <tr>
            <td className="px-6 py-4 text-sm text-gray-800">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center font-bold rounded-full bg-gray-200 text-gray-800 mr-3">
                  {index + 1}.
                </div>
                {booking.firstName} {booking.lastName}
              </div>
            </td>
            <td className="px-6 py-4 text-sm text-gray-800">{booking.thaliname}</td>
            <td className="px-6 py-4 text-sm text-gray-800">{booking.Foodname}</td>
            <td className="px-6 py-4 text-sm text-gray-800">
              <div>
                <p>No. of Thalli: {booking.availablethalli}</p>
                <p>Tenure: {booking.selectedTenure}</p>
                <p>Price: {booking.Foodcharge}</p>
              </div>
            </td>
            <td className="px-6 py-4 text-sm text-gray-800">{booking.Payment}</td>
            <td className="px-6 py-4 text-sm text-gray-800">
              {booking.bookingDate instanceof Object ? (
                <>
                  <p>{booking.bookingDate.checkIn}</p>
                  {booking.bookingDate.checkOut && <p>{booking.bookingDate.checkOut}</p>}
                </>
              ) : (
                <p>{booking.bookingDate}</p>
              )}
            </td>
            <td className="px-6 py-4 text-sm text-gray-800">
             
            <Link href={`/Admin/adminarenechefdetails?orderId=${booking.orderId}`}>
                  <a className="bg-blue-500 text-white px-2 py-1 rounded">Booking Details</a>
                </Link>
            </td>
          </tr>
          {booking.Deliveryinfo && booking.Deliveryinfo.length > 0 && (
            <tr>
              <td colSpan="7">
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thalli No</th>
                        <th className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Today Delivery</th>
                        <th className="px-3 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {booking.Deliveryinfo.map((delivery, deliveryIndex) => (
                        delivery.date === currentDate && (
                          <tr key={deliveryIndex} className={delivery.deliverystatus === "cancel" ? "border-b-2 border-red-500" : ""}>
                            <td className="px-3 py-1 text-sm font-medium text-gray-900">{delivery.thalliNo}</td>
                            <td className="px-3 py-1 text-sm text-gray-500">{delivery.date}</td>
                            <td className={`px-3 py-1 font-bold uppercase text-sm ${delivery.todayconfirm === 'yes' ? 'text-green-500' : delivery.todayconfirm === 'no' ? 'text-red-500' : 'text-gray-500'}`}>
  {delivery.todayconfirm}
</td>

                            <td className="px-3 py-1 text-sm text-gray-500">
                              <select
                                value={delivery.deliverystatus}
                                onChange={(e) => handleStatusChange(booking.id, deliveryIndex, e.target.value)}
                                className="border border-gray-300 rounded px-2 py-1"
                              >
                                <option value="">Change Status</option>
                                <option value="Out of Delivery">Out of Delivery</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                              {delivery.deliverystatus}
                              {delivery.deliverystatus === "Out of Delivery" && (
                  <div>
                    <a href={`/Deliveryboy/viewmap?orderId=${booking.orderId}`} className="text-green-500 cursor-pointer font-bold p-2 rounded">
                    Track Order
                    </a>
                  </div>
                )}
                            </td>
                          </tr>
                        )
                      ))}
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      ))}
    </tbody>
                           </table>
                         </div>
                       </div>
                     ) : (
                       <div className="text-center mt-4">No ongoing orders</div>
                     )}
                   </div>
                  )}

                  {activeTab === "completedOrders" && (
                    <div>
                      {!isLoadingData && completedOrders && completedOrders.length > 0 ? (
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
                                    Food Name
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
                                {completedOrders.map(booking => (
                                  <tr key={booking.id}>
                                    <td className="px-6 py-4 text-sm text-[#333]">{booking.firstName} {booking.lastName}</td>
                                    <td className="px-6 py-4 text-sm text-[#333]">{booking.thaliname}</td>
                                    <td className="px-6 py-4 text-sm text-[#333]">{booking.Foodname}</td>
                                    <td className="px-6 py-4 text-sm text-[#333]">
                                      <div>
                                        <p>No. of Thalli: {booking.availablethalli}</p>
                                        <p>Tenure: {booking.selectedTenure}</p>
                                        <p>Price: {booking.Foodcharge}</p>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#333]">{booking.Payment}</td>
                                    <td className="px-6 py-4 text-sm text-[#333]">
                                      {booking.bookingDate instanceof Object ? (
                                        <>
                                          <p> {booking.bookingDate.checkIn}</p>
                                          {booking.bookingDate.checkOut ? (
                                            <p> {booking.bookingDate.checkOut}</p>
                                          ) : null}
                                        </>
                                      ) : (
                                        <p>{booking.bookingDate}</p>
                                      )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[#333]">
                                      {booking.orderstatus === "Out of delivery" && (
                                        <div>
                                          <a href={`/mapview?orderId=${booking.orderId}`} className="bg-green-500 text-white px-2 py-1 rounded">
                                            View on Map
                                          </a>
                                        </div>
                                      )}
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
                                      {/* <button onClick={() => handleConfirmOrder(booking.id)}
                                        className="animate-bounce focus:animate-none ml-8 hover:animate-none inline-flex text-md font-medium bg-indigo-900  px-4 py-2 rounded-lg tracking-wide text-white">
                                        <span className="ml-2">Confirm </span>
                                      </button> */}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center mt-4">
                          No completed orders
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
    </div>

    
        </div>
        )}
    </section>
    
 



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
