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
  const [userType, setUserType] = useState('Individual');
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
    setActivePage(router.pathname);
  }, [router.pathname]);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchUserData(user);
      } else {
        setUser(null);
        setUserData(null);
        router.push('/Agent/Register'); // Redirect to the login page if the user is not authenticated
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (user) => {
    try {
      const db = getFirestore();
      const userDocRef = doc(db, 'users', user.uid); // Update the path to the user document
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        if (userData.isVendor) {
          setUserData(userData);
          router.push('/Agent');
        } else {
          router.push('/Agent/Register'); // Redirect to the login page if the user is not an admin
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
    // Get other input values (name, email, mobileNumber, password, confirmPassword)
    const nameInput = document.getElementById('signup-name');
    const emailInput = document.getElementById('signup-email');
    const mobileNumberInput = document.getElementById('signup-mobilenumber');
    const passwordInput = document.getElementById('signup-password');
    const confirmPasswordInput = document.getElementById('signup-confirm-password');
    
    const name = nameInput.value;
    const email = emailInput.value;
    const mobileNumber = mobileNumberInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
  
    if (!name || !email || !mobileNumber || !password || !confirmPassword) {
      return toast.error('All fields are required.', {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
  
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
  
    if (mobileNumber.length !== 10) {
      toast.error('Mobile number must be exactly 10 digits.', {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
  
    try {
      setisLoadinglogin(true);
      const storageRef = firebase.storage().ref();
  
      // Assuming 'aadharCard' and 'panCard' are already defined or provided in the scope
  
      const aadharCardRef = storageRef.child(`aadharCards/${aadharCard.name}`);
      await aadharCardRef.put(aadharCard);
      const aadharCardUrl = await aadharCardRef.getDownloadURL();
  
      const panCardRef = storageRef.child(`panCards/${panCard.name}`);
      await panCardRef.put(panCard);
      const panCardUrl = await panCardRef.getDownloadURL();
  
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
  
      const userData = {
        name: name,
        email: email,
        mobileNumber: mobileNumber,
        userType: userType,
        isVendor: true,
        aadharCardUrl: aadharCardUrl,
        panCardUrl: panCardUrl
      };
  
      if (userType === 'Agent') {
        userData.selectedBuyOption = selectedBuyOption;
        userData.Verified = false; // Assuming 'Verified' should be a boolean, not a string
  
      }
  
      await firebase.firestore().collection('AgentOwner').doc(user.uid).set(userData);
      setisLoadinglogin(false);
  
      if (userType === 'Agent') {
        toast.success('Agent account has been created.', {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else if (userType === 'Individual') {
        toast.success('Owner account has been created.', {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
  
      // Clear input fields
      nameInput.value = '';
      emailInput.value = '';
      mobileNumberInput.value = '';
      passwordInput.value = '';
      confirmPasswordInput.value = '';
  
    } catch (error) {
      setisLoadinglogin(false);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already exists.', {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.error('Error signing up: ' + error.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
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
        firebase
          .firestore()
          .collection('AgentOwner')
          .doc(user.uid)
          .get()
          .then((doc) => {
            const userData = doc.data();
            if (userData.isVendor) {
              toast.success('Login successful.', {
                position: toast.POSITION.TOP_RIGHT,
              });
              router.push('/Agent')
            } else {
              toast.error('You do not have Agent permission.', {
                position: toast.POSITION.TOP_RIGHT,
              });
            }
            setIsLoading(false);
          });
      })
      .catch((error) => {
        setIsLoading(false);
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
    <a href="#" className="mb-10 block font-bold text-gray-600">Have an account</a>
    <p className="mb-1 font-medium text-gray-500">User Type?</p>
    <div className="mb-6 flex flex-col gap-y-2 gap-x-4 lg:flex-row">
      <div onClick={() => handleUserTypeChange('Agent')} className="relative flex w-56 items-center justify-center rounded-xl bg-gray-50 px-4 py-3 font-medium text-gray-700">
        <input className="peer hidden" type="radio" name="radio" id="radio1" checked />
        <label className="peer-checked:border-blue-600 peer-checked:bg-blue-200 absolute top-0 h-full w-full cursor-pointer rounded-xl border" for="radio1"> </label>
        <div className="peer-checked:border-transparent peer-checked:bg-blue-600 peer-checked:ring-2 absolute left-4 h-5 w-5 rounded-full border-2 border-emerald-500 border-2 bg-gray-200 ring-blue-600 ring-offset-2"></div>
        <span className="pointer-events-none z-10">Agent</span>
      </div>
      <div onClick={() => handleUserTypeChange('Individual')} className="relative flex w-56 items-center justify-center rounded-xl bg-gray-50 px-4 py-3 font-medium text-gray-700">
        <input className="peer hidden" type="radio" name="radio" id="radio3" checked />
        <label className="peer-checked:border-blue-600 peer-checked:bg-blue-200 absolute top-0 h-full w-full cursor-pointer rounded-xl border" for="radio3"> </label>
        <div className="peer-checked:border-transparent peer-checked:bg-blue-600 peer-checked:ring-2 absolute left-4 h-5 w-5 rounded-full border-2 border-emerald-500 border-2 bg-gray-200 ring-blue-600 ring-offset-2"></div>
        <span className="pointer-events-none z-10">Owner</span>
      </div>
    </div>
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
    {userType === 'Agent' && (
      <>
   {/* <div className="mb-4 flex flex-col">
  <label htmlFor="select-pg-type" className="mb-1 font-medium text-gray-500 uppercase">Select PG Type</label>
  <div className="relative">
    <select
      className="w-full border-emerald-500 border-2 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-600 rounded-md"
      id="select-pg-type"
      name="select-pg-type"
      onChange={(e) => setSelectedPgType(e.target.value)}
    >
      <option value="Boys">Boys</option>
      <option value="Girls">Girls</option>
    </select>
   
  </div>
</div>

<div className="mb-4 flex flex-col">
  <label htmlFor="select-rent-type" className="mb-1 font-medium text-gray-500 uppercase">Select Rent Type</label>
  <div className="relative">
    <select
      className="w-full border-emerald-500 border-2 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-600 rounded-md"
      id="select-rent-type"
      name="select-rent-type"
      onChange={(e) => setSelectedRentType(e.target.value)}
    >
      <option value="Appartment">Appartment</option>
      <option value="Builder floor">Builder Floor</option>
      <option value="Shop/Showroom">Shop/Showroom</option>
      <option value="Office space">Office Space</option>
      <option value="Other properties">Other Properties</option>
    </select>
   
  </div>
</div> */}


<div className="mb-4 flex flex-col">
  <label htmlFor="select-buy-option" className="mb-1 font-medium text-gray-500 uppercase">Select Sell Property Type</label>
  <div className="relative">
    <select
      className="w-full border-emerald-500 border-2 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-600 rounded-md"
      id="select-buy-option"
      name="select-buy-option"
      onChange={(e) => setSelectedBuyOption(e.target.value)}
    >
      <option value="Appartment">Appartment</option>
      <option value="Independent House">Independent House</option>
      <option value="Builder Floor">Builder Floor</option>
      <option value="Villas">Villas</option>
      <option value="Bunglow">Bunglow</option>
      <option value="Land">Land</option>
      <option value="Commercial Shop">Commercial Shop</option>
      <option value="Office Space">Office Space</option>
      <option value="Go Down">Go Down</option>
    </select>
   
  </div>
</div>

</>
    )}
    
{/*     
    <button   disabled={isLoadinglogin}
            onClick={handleSignUp}
            classNameName={`w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform ${
              isLoadinglogin
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-400'
            } rounded-lg focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50`}
          >
         {isLoadinglogin ? 'Loading...' : 'Sign Up'}
          </button> */}

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
              <p className='text-left text-3xl font-bold'>Welcome back, User</p>
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