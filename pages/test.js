import React, { useState, useEffect } from 'react';
import { firebase } from '../../Firebase/config';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

const Register = () => {
  const router = useRouter();
  const [isLoadinglogin, setisLoadinglogin] = useState(false);
  const [selectedPgType, setSelectedPgType] = useState('');
  const [aadharCard, setAadharCard] = useState(null);
  const [panCard, setPanCard] = useState(null);
  const [user, setUser] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        router.push('/Deliveryboy/loginregister');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAadharCardChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 50 * 1024) {
      setAadharCard(file);
    } else {
      toast.error('Aadhar Card file size must be less than or equal to 50KB.');
    }
  };

  const handlePanCardChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 50 * 1024) {
      setPanCard(file);
    } else {
      toast.error('PAN Card file size must be less than or equal to 50KB.');
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateMobileNumber = (number) => {
    const re = /^\d{10}$/;
    return re.test(String(number));
  };

  const handleSignUp = async () => {
    try {
      const { name, email, mobileNumber, password, address, pincode } = getUserInputValues();

      if (!name || !email || !mobileNumber || !address || !pincode || !password) {
        toast.error('All fields are required.');
        setisLoadinglogin(false);
        return;
      }

      if (!validateEmail(email)) {
        toast.error('Invalid email format.');
        return;
      }

      if (!validateMobileNumber(mobileNumber)) {
        toast.error('Mobile number must be 10 digits.');
        return;
      }

      if (!aadharCard || !panCard) {
        toast.error('Aadhar Card and PAN Card are required.');
        return;
      }

      setisLoadinglogin(true);
      const auth = getAuth();
      const storageRef = firebase.storage().ref();

      const uploadFile = async (file, path) => {
        const fileRef = storageRef.child(path);
        const uploadTask = fileRef.put(file);
        uploadTask.on('state_changed', (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        });

        await uploadTask;
        return await fileRef.getDownloadURL();
      };

      const aadharCardUrl = await uploadFile(aadharCard, `aadharCards/${aadharCard.name}`);
      const panCardUrl = await uploadFile(panCard, `panCards/${panCard.name}`);

      let boyType = '';
      if (selectedPgType === 'Arene laundry') {
        boyType = 'laundry';
      } else if (selectedPgType === 'Arene Chef') {
        boyType = 'chef';
      }

      const userData = {
        name,
        email,
        mobileNumber,
        isDeliveryboy: true,
        aadharCardUrl,
        panCardUrl,
        pincode,
        address,
        verified: false,
        boyType,
      };

      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      await firebase.firestore().collection('Deliveryboy').doc(user.uid).set(userData);

      toast.success('Delivery Boy account has been created.');
      setisLoadinglogin(false);
    } catch (error) {
      setisLoadinglogin(false);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already exists.');
      } else {
        toast.error('Error signing up: ' + error.message);
      }
    }
  };

  const getUserInputValues = () => {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const mobileNumber = document.getElementById('signup-mobilenumber').value;
    const password = document.getElementById('signup-password').value;
    const address = document.getElementById('signup-address').value;
    const pincode = document.getElementById('signup-pincode').value;
    return { name, email, mobileNumber, password, address, pincode };
  };

  return (
    <div className="min-h-screen bg-white dark:bg-white">
      <div className="flex flex-wrap text-slate-800">
        <div className="md:mt-0 mt-16 mx-auto flex max-w-lg flex-col md:max-w-none md:flex-row md:pr-10">
          <div className="px-4 py-20">
            <h2 className="mb-2 text-3xl font-bold">Sign Up</h2>

            <p className="mb-1 font-medium text-gray-500 py-4">Delivery Boy Type?</p>
            <div className="mb-6 flex flex-col gap-y-2 gap-x-4 lg:flex-row">
              <div className="relative flex w-56 items-center justify-center rounded-xl bg-gray-50 px-4 py-3 font-medium text-gray-700">
                <input
                  type="radio"
                  name="radio"
                  id="radio1"
                  checked={selectedPgType === 'Arene laundry'}
                  onChange={() => setSelectedPgType('Arene laundry')}
                />
                <label
                  className="peer-checked:border-blue-600 peer-checked:bg-blue-200 absolute top-0 h-full w-full cursor-pointer rounded-xl border"
                  htmlFor="radio1"
                ></label>
                <span className="pointer-events-none z-10">For Arene laundry</span>
              </div>
              <div className="relative flex w-56 items-center justify-center rounded-xl bg-gray-50 px-4 py-3 font-medium text-gray-700">
                <input
                  type="radio"
                  name="radio"
                  id="radio3"
                  checked={selectedPgType === 'Arene Chef'}
                  onChange={() => setSelectedPgType('Arene Chef')}
                />
                <label
                  className="peer-checked:border-blue-600 peer-checked:bg-blue-200 absolute top-0 h-full w-full cursor-pointer rounded-xl border"
                  htmlFor="radio3"
                ></label>
                <span className="pointer-events-none z-10">For Arene Chef</span>
              </div>
            </div>

            <p className="mb-1 font-medium text-gray-500">Name</p>
            <div className="mb-4 flex flex-col">
              <div className="focus-within:border-blue-600 relative flex overflow-hidden rounded-md border-2 transition sm:w-80 lg:w-full">
                <input type="name" id="signup-name" className="w-full border-emerald-500 border-2 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none" placeholder="Enter your Name" />
              </div>
            </div>
            <p className="mb-1 font-medium text-gray-500">Email</p>
            <div className="mb-4 flex flex-col">
              <div className="focus-within:border-blue-600 relative flex overflow-hidden rounded-md border-2 transition sm:w-80 lg:w-full">
                <input type="email" id="signup-email" className="w-full border-emerald-500 border-2 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none" placeholder="Enter your email" />
              </div>
            </div>
            <p className="mb-1 font-medium text-gray-500">Mobile Number</p>
            <div className="mb-4 flex flex-col">
              <div className="focus-within:border-blue-600 relative flex overflow-hidden rounded-md border-2 transition sm:w-80 lg:w-full">
                <input type="tel" id="signup-mobilenumber" className="w-full border-emerald-500 border-2 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none" placeholder="Enter your mobile number" />
              </div>
            </div>
            <p className="mb-1 font-medium text-gray-500">Address</p>
            <div className="mb-4 flex flex-col">
              <div className="focus-within:border-blue-600 relative flex overflow-hidden rounded-md border-2 transition sm:w-80 lg:w-full">
                <input type="address" id="signup-address" className="w-full border-emerald-500 border-2 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none" placeholder="Enter your address" />
              </div>
            </div>
            <p className="mb-1 font-medium text-gray-500">Pincode</p>
            <div className="mb-4 flex flex-col">
              <div className="focus-within:border-blue-600 relative flex overflow-hidden rounded-md border-2 transition sm:w-80 lg:w-full">
                <input type="text" id="signup-pincode" className="w-full border-emerald-500 border-2 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none" placeholder="Enter your pincode" />
              </div>
            </div>
            <p className="mb-1 font-medium text-gray-500">Password</p>
            <div className="mb-4 flex flex-col">
              <div className="focus-within:border-blue-600 relative flex overflow-hidden rounded-md border-2 transition sm:w-80 lg:w-full">
                <input type="password" id="signup-password" className="w-full border-emerald-500 border-2 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none" placeholder="Enter your password" />
              </div>
            </div>
            <p className="mb-1 font-medium text-gray-500">Aadhar Card</p>
            <div className="mb-4 flex flex-col">
              <input type="file" onChange={handleAadharCardChange} className="border-emerald-500 border-2 px-4 py-2" />
            </div>
            <p className="mb-1 font-medium text-gray-500">PAN Card</p>
            <div className="mb-4 flex flex-col">
              <input type="file" onChange={handlePanCardChange} className="border-emerald-500 border-2 px-4 py-2" />
            </div>
            <div className="relative">
              <button onClick={handleSignUp} className="focus:shadow-outline my-6 w-80 rounded-lg bg-emerald-500 py-2 px-4 font-bold text-white hover:bg-emerald-700 focus:outline-none lg:w-full">
                Sign Up
              </button>
            </div>
            {isLoadinglogin && <div>Uploading: {uploadProgress}%</div>}
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
