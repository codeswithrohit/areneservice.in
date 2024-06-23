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
  const [aadharCard, setAadharCard] = useState(null);
  const [panCard, setPanCard] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchUserData(user);
      } else {
        setUser(null);
        setUserData(null);
        router.push('/AreneChefVendor/loginregister'); // Redirect to the login page if the user is not authenticated
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (user) => {
    try {
      const db = getFirestore();
      const userDocRef = doc(db, 'AreneChefVendor', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        if (userData.isVendor) {
          setUserData(userData);
          router.push('/AreneChefVendor');
        } else {
          router.push('/AreneChefVendor/loginregister');
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAadharCardChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 51200) { // 50KB = 50 * 1024 bytes = 51200 bytes
      setAadharCard(file);
    } else {
      toast.error('Aadhar Card file size must be less than or equal to 50KB.');
    }
  };

  const handlePanCardChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 51200) { // 50KB = 50 * 1024 bytes = 51200 bytes
      setPanCard(file);
    } else {
      toast.error('PAN Card file size must be less than or equal to 50KB.');
    }
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const validateMobileNumber = (number) => {
    const re = /^\d{10}$/;
    return re.test(String(number));
  };

  const handleSignUp = async () => {
    try {
      setisLoadinglogin(true);
      const auth = getAuth();
      const storageRef = firebase.storage().ref();

      const { name, email, mobileNumber, password, address, pincode } = getUserInputValues();

      if (!name || !email || !mobileNumber || !address || !pincode || !password) {
        toast.error('All fields are required.');
        setisLoadinglogin(false);
        return;
      }

      if (!validateEmail(email)) {
        toast.error('Invalid email address.');
        setisLoadinglogin(false);
        return;
      }

      if (!validateMobileNumber(mobileNumber)) {
        toast.error('Mobile number must be a 10-digit number.');
        setisLoadinglogin(false);
        return;
      }

      // Upload Aadhar Card and get the download URL
      const aadharCardRef = storageRef.child(`aadharCards/${aadharCard.name}`);
      const aadharUploadTask = aadharCardRef.put(aadharCard);

      // Upload PAN Card and get the download URL
      const panCardRef = storageRef.child(`panCards/${panCard.name}`);
      const panUploadTask = panCardRef.put(panCard);

      // Show upload progress
      aadharUploadTask.on('state_changed', snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      });

      panUploadTask.on('state_changed', snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      });

      const [aadharSnapshot, panSnapshot] = await Promise.all([aadharUploadTask, panUploadTask]);
      const aadharCardUrl = await aadharSnapshot.ref.getDownloadURL();
      const panCardUrl = await panSnapshot.ref.getDownloadURL();

      const foodTypes = getSelectedFoodTypes();

      const userData = {
        name,
        email,
        mobileNumber,
        isArenechef: true,
        aadharCardUrl,
        panCardUrl,
        pincode,
        address,
        foodTypes,
        verified: false
      };

      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      await firebase.firestore().collection('AreneChefVendor').doc(user.uid).set(userData);
      toast.success('Arene Chef Vendor account has been created.');
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

  const getSelectedFoodTypes = () => {
    const foodTypes = [];
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach((checkbox) => {
      foodTypes.push(checkbox.value);
    });
    return foodTypes;
  };

  

  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = (event) => {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
  
    if (!email || !password) {
      return toast.error('Please enter both email and password.', {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  
    setIsLoading(true);
  
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Check if isVendor is true
        const user = userCredential.user;
        console.log("user",user);
        firebase
          .firestore()
          .collection('AreneChefVendor')
          .doc(user.uid)
          .get()
          .then((doc) => {
            const userData = doc.data();
            console.log(userData);
            if (userData.isArenechef) {
              toast.success('Login successful.', {
                position: toast.POSITION.TOP_RIGHT,
              });
              router.push('/AreneChefVendor');
            } else {
              toast.error('You do not have Arene Chef Vendor permission.', {
                position: toast.POSITION.TOP_RIGHT,
              });
            }
            setIsLoading(false);
          });
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error.message);
        toast.error('Email & Password are Incorrect ' , {
          position: toast.POSITION.TOP_RIGHT,
        });
      });
  };
  

  return (
    <div classNameName='min-h-screen bg-white dark:bg-white'>
  <div className="flex flex-wrap text-slate-800">
   <div className="md:mt-0 mt-16 mx-auto flex  max-w-lg flex-col md:max-w-none md:flex-row md:pr-10">

  <div className="px-4 py-20">
    <h2 className="mb-2 text-3xl font-bold">Sign Up</h2>
   
    <p className="mb-1 font-medium text-gray-500">Name</p>
    <div className="mb-4 flex flex-col">
      <div className="focus-within:border-blue-600 relativeflex overflow-hidden rounded-md border-2 transition sm:w-80 lg:w-full">
        <input type="name" id="signup-name" className="w-full border-emerald-500 border-2 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none" placeholder="Enter your Name" />
      </div>
    </div>
    <p className="mb-1 font-medium text-gray-500">Email</p>
    <div className="mb-4 flex flex-col">
      <div className="focus-within:border-blue-600 relativeflex overflow-hidden rounded-md border-2 transition sm:w-80 lg:w-full">
        <input type="email" id="signup-email" className="w-full border-emerald-500 border-2 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none" placeholder="Enter your email" />
      </div>
    </div>
    <p className="mb-1 font-medium text-gray-500">Mobile Number</p>
    <div className="mb-4 flex flex-col">
      <div className="focus-within:border-blue-600 relativeflex overflow-hidden rounded-md border-2 transition sm:w-80 lg:w-full">
        <input type="tel" id="signup-mobilenumber" className="w-full border-emerald-500 border-2 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none" placeholder="Enter your Mobile Number" />
      </div>
    </div>
    <p className="mb-1 font-medium text-gray-500">Select Food Types</p>
<div className="mb-4 flex flex-col">
  <div className="flex flex-wrap gap-2">
    <label className="inline-flex items-center">
      <input type="checkbox" value="chinese" className="form-checkbox text-emerald-600" />
      <span className="ml-2">Chinese</span>
    </label>
    <label className="inline-flex items-center">
      <input type="checkbox" value="veg-thali" className="form-checkbox text-emerald-600" />
      <span className="ml-2">Veg Thali</span>
    </label>
    <label className="inline-flex items-center">
      <input type="checkbox" value="non-veg-thali" className="form-checkbox text-emerald-600" />
      <span className="ml-2">Non-Veg Thali</span>
    </label>
  </div>
</div>



    <p className="mb-1 font-medium text-gray-500">Address</p>
    <div className="mb-4 flex flex-col">
      <div className="focus-within:border-blue-600 relativeflex overflow-hidden rounded-md border-2 transition sm:w-80 lg:w-full">
        <input type="text" id="signup-address" className="w-full border-emerald-500 border-2 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none" placeholder="Enter your Kitchen Address" />
      </div>
    </div>
    <p className="mb-1 font-medium text-gray-500">Pin Code</p>
    <div className="mb-4 flex flex-col">
      <div className="focus-within:border-blue-600 relativeflex overflow-hidden rounded-md border-2 transition sm:w-80 lg:w-full">
        <input type="text" id="signup-pincode" className="w-full border-emerald-500 border-2 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none" placeholder="Enter your Kitchen Area Pin Code" />
      </div>
    </div>
    <p className="mb-1 font-medium text-gray-500">Password</p>
    <div className="mb-4 flex flex-col">
      <div className="focus-within:border-blue-600 relative flex overflow-hidden rounded-md border-2 transition sm:w-80 lg:w-full">
        <input type="password" id="signup-password" className="w-full border-emerald-500 border-2 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none" placeholder="Choose a password " />
      </div>
    </div>
    <p className="mb-1 font-medium text-gray-500">Confirm Password</p>
    <div className="mb-4 flex flex-col">
      <div className="focus-within:border-blue-600 relative flex overflow-hidden rounded-md border-2 transition sm:w-80 lg:w-full">
      <input type="password" id="signup-confirm-password" className="w-full border-emerald-500 border-2 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none" placeholder="Choose a confirm password" />
      </div>
    </div>
    
   <div className="mt-12 mb-12 md:flex items-center">
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
  


      <button type="submit"
             onClick={handleSignUp}
             disabled={isLoadinglogin}
             className="w-full bg-blue-500 text-white p-2 rounded">
              {isLoadinglogin ? `Uploading... ${uploadProgress.toFixed(2)}%` : 'Submit'}
            </button>
  </div>
</div>

<div className='mx-auto py-0 md:-mt-0  md:py-24 flex h-screen max-w-lg flex-col md:max-w-none md:flex-row md:pr-10'>
          <div className='flex w-full flex-col md:w-1/2 '>
            <div className='lg:w-[28rem] mx-auto my-auto flex flex-col justify-center pt-8 md:justify-start md:px-6 md:pt-0'>
              <p className='text-left text-2xl font-bold'>Welcome back, Arene Chef Vendor</p>
              <p className='mt-2 text-left text-gray-500'>Welcome back, please enter your details.</p>

              <div className='relative mt-8 flex h-px place-items-center bg-gray-200'>
                <div className='absolute left-1/2 h-6 w-14 -translate-x-1/2 bg-white text-center text-sm text-gray-500'>or</div>
              </div>
              <form className='flex flex-col pt-3 md:pt-8' onSubmit={handleLogin}>
                <div className='flex flex-col pt-4'>
                  <div className='focus-within:border-b-gray-500 relative flex overflow-hidden border-b-2 transition'>
                    <input
                      type='email'
                      id='login-email'
                      className='w-full flex-1 appearance-none border-emerald-500 border-2 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none'
                      placeholder='Email'
                    />
                  </div>
                </div>
                <div className='mb-12 flex flex-col pt-4'>
                  <div className='focus-within:border-b-gray-500 relative flex overflow-hidden border-b-2 transition'>
                    <input
                      type='password'
                      id='login-password'
                      className='w-full flex-1 appearance-none border-emerald-500 border-2 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none'
                      placeholder='Password'
                    />
                  </div>
                </div>
                <button
                  type='submit'
                  disabled={isLoading}
                  className='w-full rounded-lg bg-gray-900 px-4 py-2 text-center text-base font-semibold text-white shadow-md ring-gray-500 ring-offset-2 transition focus:ring-2'
                >
                  {isLoading ? 'Logging in...' : 'Log in'}
                </button>
              </form>
            </div>
          </div>
        </div>

</div>


<ToastContainer/>
    </div>
  )
}

export default Register