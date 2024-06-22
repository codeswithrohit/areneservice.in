import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; 
import { firebase } from '../Firebase/config';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Askuserinfo = () => {
  const router = useRouter();
  
  const [success, setSuccess] = useState(false);
  const [userData, setUserData] = useState({
    mobileNumber: '',
    address: '',
  });
  const [user, setUser] = useState(null);
  const [username, setUserName] = useState(null);
  const [useremail, setUserEmail] = useState(null);
  const [photoURL, setPhotoURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [aadharCard, setAadharCard] = useState(null); // State for Aadhar Card file
  const [panCard, setPanCard] = useState(null); // State for PAN Card file

  useEffect(() => {
    const authObserver = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setUserName(user.displayName);
        setUserEmail(user.email);
        setPhotoURL(user.photoURL);
        const userRef = firebase.firestore().collection('Users').doc(user.uid);
        userRef.get().then((doc) => {
          if (doc.exists) {
            setUserData(doc.data());
          } else {
            console.log('No such document!');
          }
        });
      } else {
        setUser(null);
      }
    });

    return () => authObserver();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleAadharCardChange = (e) => {
    setAadharCard(e.target.files[0]);
  };

  const handlePanCardChange = (e) => {
    setPanCard(e.target.files[0]);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobileNumber = (mobileNumber) => {
    const mobileNumberRegex = /^\d{10}$/;
    return mobileNumberRegex.test(mobileNumber);
  };

  const handleSubmitStep1 = async () => {
    try {
      if (!validateEmail(useremail)) {
        toast.error('Invalid email address.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      if (!validateMobileNumber(userData.mobileNumber)) {
        toast.error('Invalid mobile number. It should be a 10-digit number.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      if (aadharCard.size > 51200) {
        toast.error('Aadhar card file size should be less than or equal to 50KB.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      if (panCard.size > 51200) {
        toast.error('PAN card file size should be less than or equal to 50KB.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      setLoading(true);
      const storageRef = firebase.storage().ref();

      const aadharCardRef = storageRef.child(`aadharCards/${aadharCard.name}`);
      const panCardRef = storageRef.child(`panCards/${panCard.name}`);

      const uploadTaskAadhar = aadharCardRef.put(aadharCard);
      const uploadTaskPan = panCardRef.put(panCard);

      uploadTaskAadhar.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 50;
        setUploadProgress(progress);
      });

      uploadTaskPan.on('state_changed', (snapshot) => {
        const progress = 50 + (snapshot.bytesTransferred / snapshot.totalBytes) * 50;
        setUploadProgress(progress);
      });

      await Promise.all([uploadTaskAadhar, uploadTaskPan]);

      const aadharCardUrl = await aadharCardRef.getDownloadURL();
      const panCardUrl = await panCardRef.getDownloadURL();

      if (
        username &&
        useremail &&
        photoURL &&
        userData.mobileNumber &&
        userData.address &&
        aadharCardUrl &&
        panCardUrl
      ) {
        const userRef = firebase.firestore().collection('Users').doc(user.uid);
        const updatedUser = {
          ...userData,
          name: username,
          email: useremail,
          photo: photoURL,
          userId: user.uid,
          aadharCardUrl,
          panCardUrl,
          verified: false,
        };
        await userRef.set(updatedUser);
        setSuccess(true);
        setLoading(false);
        router.push('/');
        toast.success('Data submitted successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setUserData({
          mobileNumber: '',
          address: '',
        });
      } else {
        let missingFields = [];
        if (!username) missingFields.push('Name');
        if (!useremail) missingFields.push('Email');
        if (!userData.mobileNumber) missingFields.push('Phone Number');
        if (!userData.address) missingFields.push('Address');
        if (!aadharCardUrl) missingFields.push('Aadhar Card');
        if (!panCardUrl) missingFields.push('PAN Card');
        toast.error(`Please fill in all the following fields: ${missingFields.join(', ')}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Error submitting data:', error);
      setLoading(false);
      toast.error('Error submitting data. Please try again later.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="w-full bg-[#e8f0fe] p-10">
      {success && (
        <div className="bg-green-200 text-green-800 p-3 rounded mt-3">
          Data submitted successfully!
        </div>
      )}
      <div className="md:flex items-center border-b pb-6 border-gray-200">
        <div className="flex items-center md:mt-0 mt-4">
          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-base font-medium leading-none text-black">01</p>
          </div>
          <p className="text-base ml-3 font-medium leading-4 text-gray-800">Signup With Google</p>
        </div>
        <div className="flex items-center md:mt-0 mt-4 md:ml-12">
          <div className="w-8 h-8 bg-red-700 rounded flex items-center justify-center">
            <p className="text-base font-medium leading-none text-white">02</p>
          </div>
          <p className="text-base ml-3 font-medium leading-4 text-gray-800">Personal Detail</p>
        </div>
      </div>
      <h1 tabIndex={0} role="heading" aria-label="profile information" className="focus:outline-none text-3xl font-bold text-gray-800 mt-12">
        Profile info
      </h1>
      <p role="contentinfo" className=" focus:outline-none text-sm font-light leading-tight text-gray-600 mt-4">
        Fill in the data for profile. It will take a couple of minutes. <br />
      </p>
      <h2 role="heading" aria-label="enter Personal data" className="text-xl font-semibold leading-7 text-gray-800 mt-10">
        Personal data
      </h2>
      <p className="text-sm font-light leading-none text-gray-600">Your Details </p>
      <div className="flex mt-4">
        <div className="flex-shrink-0 w-full md:mr-12 h-44 sm:h-32 sm:w-32 sm:mb-0">
          <img
            src={photoURL}
            alt=""
            className="object-cover object-center w-32 h-32 rounded dark:bg-gray-500"
          />
        </div>
      </div>

      <div className="mt-4 md:flex items-center">
        <div className="flex flex-col">
          <label className="mb-3 text-sm leading-none text-gray-800">Your name</label>
          <input
            className="w-64 bg-gray-100 text-sm font-medium leading-none text-gray-800 p-3 border rounded border-gray-200"
            type="text"
            name="name"
            value={username}
            onChange={handleChange}
            readOnly
            placeholder="Your Name"
          />
        </div>
      </div>

      <div className="mt-12 md:flex items-center">
        <div className="flex flex-col">
          <label className="mb-3 text-sm leading-none text-gray-800">Email Address</label>
          <input
            className="w-64 bg-gray-100 text-sm font-medium leading-none text-gray-800 p-3 border rounded border-gray-200"
            type="email"
            name="email"
            value={useremail}
            onChange={handleChange}
            readOnly
            placeholder="Your Email"
          />
        </div>
        <div className="flex flex-col md:ml-12 md:mt-0 mt-8">
          <label className="mb-3 text-sm leading-none text-gray-800">Phone number</label>
          <input
            className="w-64 bg-gray-100 text-sm font-medium leading-none text-gray-800 p-3 border rounded border-gray-200"
            type="tel"
            name="mobileNumber"
            value={userData.mobileNumber}
            onChange={handleChange}
            placeholder="Enter Mobile Number"
          />
        </div>
      </div>

      <div className="mt-12 md:flex items-center">
        <div className="flex flex-col">
          <label className="mb-3 text-sm leading-none text-gray-800">Aadhar Card</label>
          <input
            accept="image/*"
            type="file"
            onChange={handleAadharCardChange}
            className="w-64 bg-gray-100 text-sm font-medium leading-none text-gray-800 p-3 border rounded border-gray-200"
          />
        </div>
        <div className="flex flex-col md:ml-12 md:mt-0 mt-8">
          <label className="mb-3 text-sm leading-none text-gray-800">PAN Card</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePanCardChange}
            className="w-64 bg-gray-100 text-sm font-medium leading-none text-gray-800 p-3 border rounded border-gray-200"
          />
        </div>
      </div>

      <div className="mt-12 md:flex items-center">
        <div className="flex flex-col">
          <label className="mb-3 text-sm leading-none text-gray-800">Address</label>
          <textarea
            className="w-72 md:w-96 bg-gray-100 text-sm h-32 font-medium leading-none text-gray-800 p-3 border rounded border-gray-200"
            type="text"
            name="address"
            value={userData.address}
            onChange={handleChange}
            placeholder="Enter Your Address"
          ></textarea>
        </div>
      </div>

      <div className="mt-12">
        <div className="py-4 flex items-center">
          <p className="text-sm text-black leading-none ml-2">
            By clicking on Continue, you accept our
            <span className="text-red-600 ml-2 mr-2">Terms of Service</span> and
            <span className="text-red-600 ml-2">Privacy Policy</span>
          </p>
        </div>
      </div>

      <button
          onClick={handleSubmitStep1}
          role="submit"
          className="flex items-center justify-center py-4 px-7 focus:outline-none bg-[#e8f0fe] border rounded border-red-700 mt-7 md:mt-14 hover:bg-red-400 focus:ring-2 focus:ring-offset-2 focus:ring-red-700"
        >
          <span className="text-sm font-medium text-center text-gray-800 capitalize">
            {loading ? `Uploading... ${uploadProgress.toFixed(0)}%` : 'Submit'}
          </span>
          <svg className="mt-1 ml-3" width={12} height={8} viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.01 3H0V5H8.01V8L12 4L8.01 0V3Z" fill="#242731" />
          </svg>
        </button>

      <ToastContainer />
    </div>
  );
};

export default Askuserinfo;

