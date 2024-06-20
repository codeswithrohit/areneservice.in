import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { firebase } from '../Firebase/config';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage'; // Import storage module
import { useRouter } from 'next/router';

const Signupwithemail = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [aadharCard, setAadharCard] = useState(null); // State for Aadhar Card file
  const [panCard, setPanCard] = useState(null); // State for PAN Card file
  const [loading, setLoading] = useState(false);

  const handleAadharCardChange = (e) => {
    setAadharCard(e.target.files[0]);
  };

  const handlePanCardChange = (e) => {
    setPanCard(e.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Upload Aadhar Card and PAN Card to Firebase Storage
      const storageRef = firebase.storage().ref();
      const aadharCardRef = storageRef.child(`aadharCards/${aadharCard.name}`);
      await aadharCardRef.put(aadharCard);
      const aadharCardUrl = await aadharCardRef.getDownloadURL();

      const panCardRef = storageRef.child(`panCards/${panCard.name}`);
      await panCardRef.put(panCard);
      const panCardUrl = await panCardRef.getDownloadURL();

      // Create user with email and password
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const userId = userCredential.user.uid;

      // Store additional user details in Firestore including Aadhar Card and PAN Card URLs
      await firebase.firestore().collection('Users').doc(userId).set({
        name,
        mobileNumber,
        email,
        address,
        aadharCardUrl,
        panCardUrl,
        verified: false,
      });

      // Reset form fields
      setName('');
      setMobileNumber('');
      setEmail('');
      setPassword('');
      setAddress('');
      setAadharCard(null);
      setPanCard(null);

      // Show success toast
      toast.success('Account created successfully');

      setLoading(false);
      router.push('/');
    } catch (error) {
      console.error('Error creating account:', error);
      toast.error('Error creating account');
      setLoading(false);
    }
  };

  return (
    <div className='bg-red-100' >
         <div className="flex flex-col items-center justify-center min-h-screen px-4"> {/* Center the content vertically and horizontally */}
         <div className="flex justify-center items-center mb-4 ">
          <img src="logo1.png" alt="Logo" className="w-20 h-20" />
        </div>
         <p className="text-center text-sm font-bold text-black  font-serif">
              We'll check if you have an account, and help create one if you don't.
            </p>
  <div className="w-full max-w-full"> {/* Set maximum width for better readability */}
  <p class="text-sm mt-6 text-center">Already have an account? <a href="/signinwithemail" class="text-red-600 font-semibold hover:underline ml-1">Login here</a></p>

  <form class="font-[sans-serif] text-[#333] max-w-4xl mx-auto px-6 my-6">
    
      <div class="grid sm:grid-cols-2 gap-10">
        <div class="relative flex items-center">
          <label class="text-[13px] absolute top-[-10px] left-0 font-semibold"> Name</label>
          <input type="text" placeholder="Enter your name" value={name}
                  onChange={(e) => setName(e.target.value)}
            class="px-2 pt-5 pb-2 bg-red-100 w-full text-sm border-b-2 border-red-600 focus:border-[#333] outline-none" />
          <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-4"
            viewBox="0 0 24 24">
            <circle cx="10" cy="7" r="6" data-original="#000000"></circle>
            <path
              d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
              data-original="#000000"></path>
          </svg>
        </div>
        
        <div class="relative flex items-center">
          <label class="text-[13px] absolute top-[-10px] left-0 font-semibold">mobileNumber No</label>
          <input type="number" placeholder="Enter mobileNumber no." value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
            class="px-2 pt-5 pb-2 bg-red-100 w-full text-sm border-b-2 border-red-600 focus:border-[#333] outline-none" />
          <svg fill="#bbb" class="w-[18px] h-[18px] absolute right-4" viewBox="0 0 64 64">
            <path
              d="m52.148 42.678-6.479-4.527a5 5 0 0 0-6.963 1.238l-1.504 2.156c-2.52-1.69-5.333-4.05-8.014-6.732-2.68-2.68-5.04-5.493-6.73-8.013l2.154-1.504a4.96 4.96 0 0 0 2.064-3.225 4.98 4.98 0 0 0-.826-3.739l-4.525-6.478C20.378 10.5 18.85 9.69 17.24 9.69a4.69 4.69 0 0 0-1.628.291 8.97 8.97 0 0 0-1.685.828l-.895.63a6.782 6.782 0 0 0-.63.563c-1.092 1.09-1.866 2.472-2.303 4.104-1.865 6.99 2.754 17.561 11.495 26.301 7.34 7.34 16.157 11.9 23.011 11.9 1.175 0 2.281-.136 3.29-.406 1.633-.436 3.014-1.21 4.105-2.302.199-.199.388-.407.591-.67l.63-.899a9.007 9.007 0 0 0 .798-1.64c.763-2.06-.007-4.41-1.871-5.713z"
              data-original="#000000"></path>
          </svg>
        </div>
        
        <div class="relative flex items-center ">
          <label class="text-[13px] absolute top-[-10px] left-0 font-semibold">Email</label>
          <input type="email" placeholder="Enter email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
            class="px-2 pt-5 pb-2 bg-red-100 w-full text-sm border-b-2 border-red-600 focus:border-[#333] outline-none" />
          <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-[18px] h-[18px] absolute right-4"
            viewBox="0 0 682.667 682.667">
            <defs>
              <clipPath id="a" clipPathUnits="userSpaceOnUse">
                <path d="M0 512h512V0H0Z" data-original="#000000"></path>
              </clipPath>
            </defs>
            <g clip-path="url(#a)" transform="matrix(1.33 0 0 -1.33 0 682.667)">
              <path fill="none" stroke-miterlimit="10" stroke-width="40"
                d="M452 444H60c-22.091 0-40-17.909-40-40v-39.446l212.127-157.782c14.17-10.54 33.576-10.54 47.746 0L492 364.554V404c0 22.091-17.909 40-40 40Z"
                data-original="#000000"></path>
              <path
                d="M472 274.9V107.999c0-11.027-8.972-20-20-20H60c-11.028 0-20 8.973-20 20V274.9L0 304.652V107.999c0-33.084 26.916-60 60-60h392c33.084 0 60 26.916 60 60v196.653Z"
                data-original="#000000"></path>
            </g>
          </svg>
        </div>
        <div class="relative flex items-center ">
                <label class="text-[13px] absolute top-[-10px] left-0 font-semibold">Upload Aadhar Card</label>
                <input
                  type="file"
                  onChange={handleAadharCardChange}
                  class="px-2 pt-5 pb-2 bg-red-100 w-full text-sm border-b-2 border-red-600 focus:border-[#333] outline-none"
                />
              
              </div>
              <div class="relative flex items-center ">
                <label class="text-[13px] absolute top-[-10px] left-0 font-semibold">Upload PAN Card</label>
                <input
                  type="file"
                  onChange={handlePanCardChange}
                  class="px-2 pt-5 pb-2 bg-red-100 w-full text-sm border-b-2 border-red-600 focus:border-[#333] outline-none"
                />
                
              </div>
        <div class="relative flex items-center ">
          <label class="text-[13px] absolute top-[-10px] left-0 font-semibold">Password</label>
          <input type="password" autocomplete="new-password" placeholder="Enter password" value={password}
                  onChange={(e) => setPassword(e.target.value)}
            class="px-2 pt-5 pb-2 bg-red-100 w-full text-sm border-b-2 border-red-600 focus:border-[#333] outline-none" />
          <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb"
            class="w-[18px] h-[18px] absolute right-4 cursor-pointer" viewBox="0 0 128 128">
            <path
              d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
              data-original="#000000"></path>
          </svg>
        </div>
        <div class="relative flex items-center  ">
        <textarea placeholder='Enter Your Address'
    class="p-4 bg-red-100 max-w-md mx-auto w-full block text-sm border-2 border-red-600 outline-[#007bff] rounded" rows="4"></textarea>
        </div>
      </div>
      <button type="button"
      onClick={handleSubmit}
      disabled={loading}
        class="mt-10 px-2 mb-12 py-2.5 w-full rounded text-sm font-semibold bg-[#333] text-red-100 hover:bg-[#222]">{loading ? 'Loading...' : 'Submit'}</button>
    </form>
  </div>
<ToastContainer/>
</div>
    </div>
  )
}

export default Signupwithemail