import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { firebase } from '../Firebase/config';
import 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Askuserinfo = () => {
  const router = useRouter();

  const [success, setSuccess] = useState(false);
  const [userData, setUserData] = useState({
    mobileNumber: '',
    address: '',
    name: '',
    email: '',
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aadharCard, setAadharCard] = useState(null);
  const [panCard, setPanCard] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleAadharCardChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 51200) {
      setAadharCard(file);
    } else {
      toast.error('Aadhar Card file size should be less than or equal to 50KB.');
    }
  };

  const handlePanCardChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 51200) {
      setPanCard(file);
    } else {
      toast.error('PAN Card file size should be less than or equal to 50KB.');
    }
  };

  useEffect(() => {
    const authObserver = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
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

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidMobileNumber = (number) => {
    const mobileRegex = /^\d{10}$/;
    return mobileRegex.test(number);
  };

  const handleSubmitStep1 = async () => {
    if (!isValidEmail(userData.email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (!isValidMobileNumber(userData.mobileNumber)) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }

    try {
      setLoading(true);

      const uploadFile = (file, path) => {
        return new Promise((resolve, reject) => {
          const fileRef = firebase.storage().ref().child(path);
          const uploadTask = fileRef.put(file);

          uploadTask.on(
            'state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => reject(error),
            () => {
              uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => resolve(downloadURL));
            }
          );
        });
      };

      const aadharCardUrl = await uploadFile(aadharCard, `aadharCards/${aadharCard.name}`);
      const panCardUrl = await uploadFile(panCard, `panCards/${panCard.name}`);

      if (userData.mobileNumber && userData.email && userData.name && userData.address && aadharCardUrl && panCardUrl) {
        const userRef = firebase.firestore().collection('Users').doc(user.uid);
        const updatedUser = {
          ...userData,
          userId: user.uid,
          aadharCardUrl,
          panCardUrl,
          verified: false,
        };

        await userRef.set(updatedUser);
        setSuccess(true);
        setLoading(false);
        router.push('/signin');
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
          name: '',
          email: ''
        });
      } else {
        let missingFields = [];
        if (!userData.name) missingFields.push("Name");
        if (!userData.email) missingFields.push("Email");
        if (!userData.mobileNumber) missingFields.push("Phone Number");
        if (!userData.address) missingFields.push("Address");
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
      console.error("Error submitting data:", error);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div>
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
            <p className="text-base ml-3 font-medium leading-4 text-gray-800">Signup With Mobile Number</p>
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
        <p role="contentinfo" className="focus:outline-nonetext-sm font-light leading-tight text-gray-600 mt-4">
          Fill in the data for profile. It will take a couple of minutes. <br />
        </p>
        <h2 role="heading" aria-label="enter Personal data" className="text-xl font-semibold leading-7 text-gray-800 mt-10">
          Personal data
        </h2>
        <p className="text-sm font-light leading-none text-gray-600 mt-0.5">Your Details </p>

        <div className="mt-4 md:flex items-center">
          <div className="flex flex-col">
            <label className="mb-3 text-sm leading-none text-gray-800">Your name</label>
            <input
              className="w-64 bg-gray-100 text-sm font-medium leading-none text-gray-800 p-3 border rounded border-gray-200"
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
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
              value={userData.email}
              onChange={handleChange}
              placeholder="Your Email"
            />
          </div>
          <div className="flex flex-col md:ml-12 md:mt-0 mt-8">
            <label className="mb-3 text-sm leading-none text-gray-800">Phone number</label>
            <input
              className="w-64 bg-gray-100 text-sm font-medium leading-none text-gray-800 p-3 border rounded border-gray-200"
              type="number"
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
              <span className="text-red-600 ml-2 mr-2">Terms of Service</span> and <span className="text-red-600 ml-2 ">Privacy Policy</span>
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
    </div>
  );
};

export default Askuserinfo;
