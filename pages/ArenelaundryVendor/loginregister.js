import React,{useState,useEffect} from 'react'
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
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedPgType, setSelectedPgType] = useState('');
  const [selectedRentType, setSelectedRentType] = useState('');
  const [selectedBuyOption, setSelectedBuyOption] = useState('');
  const [aadharCard, setAadharCard] = useState(null); // State for Aadhar Card file
  const [panCard, setPanCard] = useState(null); // State for PAN Card file

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [activePage, setActivePage] = useState('');

 
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchUserData(user);
      } else {
        setUser(null);
        setUserData(null);
        router.push('/ArenelaundryVendor/loginregister'); // Redirect to the login page if the user is not authenticated
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (user) => {
    try {
      const db = getFirestore();
      const userDocRef = doc(db, 'ArenelaundryVendor', user.uid); // Update the path to the user document
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        if (userData.isVendor) {
          setUserData(userData);
          router.push('/ArenelaundryVendor');
        } else {
          router.push('/ArenelaundryVendor/loginregister'); // Redirect to the login page if the user is not an admin
        }
      } else {
        // Handle case where user data doesn't exist in Firestore
        // You can create a new user profile or handle it based on your app's logic
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleUserTypeChange = (selectedType) => {
    setUserType(selectedType);
  };

  const handleAadharCardChange = (e) => {
    setAadharCard(e.target.files[0]);
  };

  const handlePanCardChange = (e) => {
    setPanCard(e.target.files[0]);
  };
  const handleSignUp = async () => {
    try {
      setisLoadinglogin(true);
      const auth = getAuth();
      const storageRef = firebase.storage().ref();
  
      // Upload Aadhar Card and get the download URL
      const aadharCardRef = storageRef.child(`aadharCards/${aadharCard.name}`);
      await aadharCardRef.put(aadharCard);
      const aadharCardUrl = await aadharCardRef.getDownloadURL();
  
      // Upload PAN Card and get the download URL
      const panCardRef = storageRef.child(`panCards/${panCard.name}`);
      await panCardRef.put(panCard);
      const panCardUrl = await panCardRef.getDownloadURL();
  
      // Get user input values
      const { name, email, mobileNumber, password, address, pincode } = getUserInputValues();
  
      if (!name || !email || !mobileNumber || !address || !pincode || !password) {
        toast.error('All fields are required.');
        setisLoadinglogin(false);
        return;
      }
  
    
  
      // Prepare user data object
      const userData = {
        name: name,
        email: email,
        mobileNumber: mobileNumber,
        isArenelaundry: true,
        aadharCardUrl: aadharCardUrl,
        panCardUrl: panCardUrl,
        pincode: pincode,
        address: address,
        verified: false
      };
  
      // Create user in Firebase Authentication
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      await firebase.firestore().collection('ArenelaundryVendor').doc(user.uid).set(userData);
      // Display success message
      toast.success('Arene laundry Vendor account has been created.');
      setisLoadinglogin(false);
    } catch (error) {
      setisLoadinglogin(false);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already exists.');
      } else {
        toast.error('Error signing up: ' + error.message);
        console.log(error.message);
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
          .collection('ArenelaundryVendor')
          .doc(user.uid)
          .get()
          .then((doc) => {
            const userData = doc.data();
            console.log(userData);
            if (userData.isArenelaundry) {
              toast.success('Login successful.', {
                position: toast.POSITION.TOP_RIGHT,
              });
              router.push('/ArenelaundryVendor');
            } else {
              toast.error('You do not have Arene laundry Vendor permission.', {
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
  


          <button
                  type='submit'
                  onClick={handleSignUp}
                  disabled={isLoading}
                  className='w-full rounded-lg bg-gray-900 px-4 py-2 text-center text-base font-semibold text-white shadow-md ring-gray-500 ring-offset-2 transition focus:ring-2'
                >
                    {isLoadinglogin ? 'Loading...' : 'Sign Up'}
                </button>
  </div>
</div>

<div className='mx-auto py-0 md:-mt-0  md:py-24 flex h-screen max-w-lg flex-col md:max-w-none md:flex-row md:pr-10'>
          <div className='flex w-full flex-col md:w-1/2 '>
            <div className='lg:w-[28rem] mx-auto my-auto flex flex-col justify-center pt-8 md:justify-start md:px-6 md:pt-0'>
              <p className='text-left text-2xl font-bold'>Welcome back, Arene Laundry Vendor</p>
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