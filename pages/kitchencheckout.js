import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import axios from 'axios';
import { firebase } from '../Firebase/config';
import { DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { error } from 'highcharts';
dayjs.extend(customParseFormat);

const test = () => {
  const [vendorData, setVendorData] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [userData, setUserData] = useState(null); // Change initial state to null
  const [mobilenumber, setMobileNumber] = useState("");
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [paymentOption, setPaymentOption] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState({ checkIn: null });

  const router = useRouter();
  const { thaliname, selectedTenure, Foodcharge, Foodname, Ingredients, noofthalli, selectedPrice, selectedNoOfThali } = router.query;

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const snapshot = await firebase.firestore().collection('AreneChefVendor').get();
        const data = snapshot.docs.map(doc => {
          const vendorData = doc.data();
          const foodTypesArray = Object.keys(vendorData.foodTypes).map(key => vendorData.foodTypes[key]);
          vendorData.foodTypes = foodTypesArray;
          return { id: doc.id, ...vendorData };
        });
        const filteredData = data.filter(vendor => vendor.foodTypes.includes(thaliname));
        setVendorData(filteredData);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };
    fetchVendors();
  }, [thaliname]);

  const handleCheckInChange = (date, dateString) => {
    setSelectedDate(prevState => ({
      ...prevState,
      checkIn: dateString
    }));
  };

  const loadScript = async (src) => {
    try {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
      return true;
    } catch (error) {
      console.error('Error loading script:', error);
      toast.error('Failed to load Razorpay SDK. Please try again later.');
      return false;
    }
  };

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      setLoading(true);
      if (authUser) {
        setUser(authUser);
        fetchUserData(authUser.uid);
      } else {
        setUser(null);
        setUserData(null);
        setLoading(false);
        router.push('/signin'); // Redirect to sign-in page
      }
    });
    return () => unsubscribe();
  }, []);
  
  const fetchUserData = async (uid) => {
    console.log("uid", uid);
    try {
      const userDoc = await firebase.firestore().collection("Users").doc(uid).get();
      console.log("userdoc", userDoc);
      if (userDoc.exists) {
        const fetchedUserData = userDoc.data();
        console.log("fetchedata", fetchedUserData);
        setUserData(fetchedUserData);
        setFirstName(fetchedUserData.name || "");
        setEmail(fetchedUserData.email || "");
        setMobileNumber(fetchedUserData.mobileNumber || "");
        setAddress(fetchedUserData.address || "");
      } else {
        console.log("userdata not found");
        setUserData(null);
        toast.error('User data not found, redirecting to sign-in page.');
        router.push('/signin'); // Redirect to sign-in page if user data not found
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error('Error fetching user data, redirecting to sign-in page.');
      router.push('/signin'); // Redirect to sign-in page on error
    } finally {
      setLoading(false);
    }
  };
  

  

 
  const generateOrderId = () => {
    const randomNumber = Math.floor(Math.random() * 1000000);
    const orderId = `ORDER-${randomNumber}`;
    return orderId;
  };
  const submitBookingData = async (paymentAmount) => {
    try {
      setLoading(true)
      const currentDate = dayjs().format('YYYY-MM-DD');
      const bookingDateStr = selectedDate.checkIn; // Access the checkIn property
      const bookingDate = dayjs(bookingDateStr, 'YYYY-MM-DD'); // Ensure selectedDate is parsed correctly
  
      // Log selectedDate and bookingDate to debug date parsing issues
      console.log('Selected Date:', bookingDateStr);
      console.log('Parsed Booking Date:', bookingDate.format('YYYY-MM-DD'));
      console.log('Current Date:', currentDate);
  
      const noOfThalli = selectedNoOfThali
      const deliveryInfoArray = [];
  
      // Check if bookingDate is valid
      if (!bookingDate.isValid()) {
        throw new Error('Invalid booking date');
      }
  
      // Create Deliveryinfo array based on noofthalli and bookingDate
      for (let i = 0; i < noOfThalli; i++) {
        const deliveryDate = bookingDate.clone().add(i, 'day').format('YYYY-MM-DD'); // Clone the bookingDate before adding days
        deliveryInfoArray.push({
          thalliNo: i + 1,
          date: deliveryDate,
          todayconfirm: "yes",
          deliverystatus: 'Pending' // Assuming initial status is 'Pending'
        });
      }
  
      // Log the deliveryInfoArray to the console
      console.log('Deliveryinfo Array:', deliveryInfoArray);
  
      const orderId = generateOrderId();
  
      // Create the order object to log it before adding to Firestore
      const orderData = {
        firstName,
        orderId,
        address,
        phoneNumber: mobilenumber,
        email,
        confirmation: 'false',
        thaliname,
        Foodname,
        selectedTenure,
        Ingredients,
        Foodcharge: selectedPrice,
        orderstatus: "Processing",
        totalpayment: selectedPrice,
        Userid: user.uid,
        OrderDate: currentDate,
        Payment: paymentAmount,
        bookingDate: bookingDateStr,
        noofthalli: selectedNoOfThali,
        availablethalli: selectedNoOfThali,
        pincode,
        Deliveryinfo: deliveryInfoArray // Add the Deliveryinfo array to the document
      };
  
      // Log the orderData object to the console
      console.log('Order Data:', orderData);
  
      await firebase.firestore().collection('kitchenorder').add(orderData);
      setLoading(false)
      toast.success('Booking Successful!');
      
      router.push(`/arenechefdetails?orderId=${orderId}`);
  
    } catch (error) {
      console.error('Error submitting booking data:', error);
      toast.error('Failed to submit booking data. Please try again later.');
    }
  };
  
  
  
  

  const initiatePayment = async () => {
    if (!firstName  || !email || !mobilenumber || !address || !pincode ||!selectedDate.checkIn) {
      toast.error('All fields are required.');
      return;
    }

    try {
      setLoading(true);
      let paymentAmount;
      if (paymentOption === 'oneday') {
        paymentAmount = 500;
      } else if (paymentOption === 'threeday') {
        paymentAmount = 1000;
      } else if (paymentOption === 'allday') {
        paymentAmount = selectedPrice;
      } else {
        paymentAmount = selectedPrice;
      }

      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        toast.error('Failed to load Razorpay SDK. Please try again later.');
        return;
      }

      const amountInPaise = paymentAmount * 100;

      const options = {
        key: 'rzp_test_td8CxckGpxFssp',
        currency: 'INR',
        amount: amountInPaise,
        name: 'Arene Services',
        description: 'Thanks for purchasing',
        image: 'https://www.areneservices.in/public/front/images/property-logo.png',
        handler: async function (response) {
          console.log('Payment Successful:', response);
          await submitBookingData(paymentAmount);
          await axios.post('/api/sendEmail', {
            Foodcharge,
            location: Location,
            email,
            firstName,
            noofthalli
          });
        },
        prefill: {
          name: `${firstName}`,
          email
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error('Failed to initiate payment. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const checkAvailabilityAndInitiatePayment = async () => {
    if (!pincode) {
      toast.error('Please enter a valid pin code.');
      return;
    }
  
    let matchedVendor = null;
    if (vendorData) {
      for (const vendor of vendorData) {
        console.log('Vendor Pincode:', vendor.pincode);
        console.log('Pincode:', pincode);
        if (vendor.pincode === pincode) {
          matchedVendor = vendor;
          break;
        }
      }
    }
  
    if (matchedVendor) {
      initiatePayment();
    } else {
      toast.error('We do not provide service at this pin code.');
      console.log(error)
    }
  };
  

  return (
    <div>
       {loading ? (
        <div className="flex justify-center items-center h-screen">
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
      ) : (
      <div class="font-[sans-serif] bg-white mt-20 p-4">
      <div class="max-w-4xl mx-auto">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-[#333] inline-block border-b-4 border-[#333] pb-1">Checkout</h2>
        </div>
        <div class="mt-12">
          <div class="grid md:grid-cols-3 gap-6">
            <div>
              <h3 class="text-xl font-bold text-[#333]">01</h3>
              <h3 class="text-xl font-bold text-[#333]">Personal Details</h3>
            </div>
            <div class="md:col-span-2">
            <form>
  <div class="grid sm:grid-cols-2 gap-5">
    <input 
      value={firstName} 
      onChange={(e) => setFirstName(e.target.value)} 
      type="text" 
      placeholder="Enter your name"
      class="px-4 py-3.5 bg-white text-[#333] w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none" 
    />
   
    <input 
      value={email} 
      onChange={(e) => setEmail(e.target.value)} 
      type="email" 
      placeholder="Email address"
      class="px-4 py-3.5 bg-white text-[#333] w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none" 
    />
    <input 
      value={mobilenumber} 
      onChange={(e) => setMobileNumber(e.target.value)} 
      type="number" 
      placeholder="Phone number"
      class="px-4 py-3.5 bg-white text-[#333] w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none" 
    />
    <input 
      value={pincode} 
      onChange={(e) => setPincode(e.target.value)} 
      type="number" 
      placeholder="Pin Code"
      class="px-4 py-3.5 mb-2 bg-white text-[#333] w-full text-sm border-2 rounded-md focus:border-blue-500 outline-none" 
    />
   
    <div className=" mb-2 flex items-center">
        <DatePicker
          value={selectedDate.checkIn ? dayjs(selectedDate.checkIn) : null}
          onChange={handleCheckInChange}
          format="YYYY-MM-DD"
          placeholder="Delivery Date || Starting Date"
          style={{ marginRight: "10px" }}
          
        />
       
      </div>
  </div>
  <textarea 
      value={address} 
      onChange={(e) => setAddress(e.target.value)} 
      placeholder="Address"
      class="px-4 py-3.5 bg-white text-[#333] w-full h-24 text-sm border-2 rounded-md focus:border-blue-500 outline-none resize-none"
    ></textarea>
</form>

            </div>
          </div>
          <div class="grid md:grid-cols-3 gap-6 mt-12">
    <div class="col-span-1">
        <h3 class="text-xl font-bold text-[#333]">02</h3>
        <h3 class="text-xl font-bold text-[#333]">Booking Summary</h3>
    </div>
    <div class="col-span-2">
        <div class="flex flex-wrap items-start pb-4 mb-10 border-b border-gray-200 dark:border-gray-700">
            <div class="w-full px-4 mb-4 md:w-1/2">
                <p class="mb-1 text-sm font-semibold leading-5 text-gray-600 dark:text-gray-400">Thaliname:</p>
                <p class="text-base leading-6 text-gray-800 dark:text-gray-400 uppercase">{thaliname}</p>
            </div>
            <div class="w-full px-4 mb-4 md:w-1/2">
                <p class="mb-1 text-sm font-semibold leading-5 text-gray-600 dark:text-gray-400">Foodname:</p>
                <p class="text-base leading-6 text-gray-800 dark:text-gray-400 uppercase">{Foodname}</p>
            </div>
            {/* <div class="w-full px-4 mb-4 md:w-1/2">
                <p class="mb-1 text-sm font-semibold leading-5 text-gray-600 dark:text-gray-400">Location:</p>
                <p class="text-base leading-6 text-gray-800 dark:text-gray-400">{address}</p>
            </div> */}
            <div class="w-full px-4 mb-4 md:w-1/2">
                <p class="mb-1 text-sm font-semibold leading-5 text-gray-600 dark:text-gray-400">Ingredients:</p>
                <p class="text-base leading-6 text-blue-600 dark:text-gray-400">{Ingredients}</p>
            </div>
            <div class="w-full px-4 mb-4 md:w-1/2">
            <ul>

    <li >
        <p className='uppercase'>Tenure: {selectedTenure}</p>
        <p className='uppercase'>Price: {selectedPrice}</p>
        <p className='uppercase'>Thalli/Plate Qty: {selectedNoOfThali}</p>
    </li>

          </ul>
            </div>
        </div>
    </div>
</div>

          {/* <div class="grid md:grid-cols-3 gap-6 mt-12">
            <div>
              <h3 class="text-xl font-bold text-[#333]">03</h3>
              <h3 class="text-xl font-bold text-[#333]">Payment method</h3>
            </div>
            <div class="md:col-span-2">
           
              <div class="grid gap-6 sm:grid-cols-2">
                <div class="flex items-center">
                  <input class="w-5 h-5 cursor-pointer"  type="radio" id="oneday" name="paymentOption" value="oneday" onChange={(e) => setPaymentOption(e.target.value)} />
                  <label for="card" class="ml-4 flex gap-2 cursor-pointer">
                  Pay only 500 for one day
                  </label>
                </div>
                <div class="flex items-center">
                  <input type="radio" id="threeday" name="paymentOption" value="threeday" onChange={(e) => setPaymentOption(e.target.value)}  class="w-5 h-5 cursor-pointer"  />
                  <label for="paypal" class="ml-4 flex gap-2 cursor-pointer">
                  Pay only 1000 for three days
                  </label>
                </div>
                <div class="flex items-center">
                  <input type="radio" id="allday" name="paymentOption" value="allday" onChange={(e) => setPaymentOption(e.target.value)}  class="w-5 h-5 cursor-pointer"  />
                  <label for="paypal" class="ml-4 flex gap-2 cursor-pointer">
                  Full Payment {Foodcharge && JSON.parse(Foodcharge)[0]?.price}
                  </label>
                </div>
              </div>
            
            </div>
          </div> */}
          <div class="flex flex-wrap justify-end gap-4 mt-12">
          {/* <button type="button" class="px-6 py-3.5 text-sm bg-transparent border-2 text-[#333] rounded-md hover:bg-gray-100">
  Estimated Total : ₹ {paymentOption ? (paymentOption === 'oneday' ? 500 : (paymentOption === 'threeday' ? 1000 : roomprice)) : roomprice}
</button> */}

            <button onClick={checkAvailabilityAndInitiatePayment} 
              class="px-6 py-3.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">Pay now ₹ {paymentOption ? (paymentOption === 'oneday' ? 500 : (paymentOption === 'threeday' ? 1000 : selectedPrice)) : selectedPrice}</button>
          </div>
        </div>
      </div>
    </div>
      )}
    <ToastContainer/>
    </div>
  )
}

export default test