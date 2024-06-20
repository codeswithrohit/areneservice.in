import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from "react";
import { FaHome, FaClipboardList, FaUser } from 'react-icons/fa';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";



const AgentNav = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const navigateTo = (path) => {
    router.push(`/Agent${path}`);
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user.uid);
        fetchUserData(user);
      } else {
        setUser(null);
        setUserData(null);
        router.push('/Agent/Register'); // Redirect to the login page if the user is not authenticated
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) {
      return; // No need to fetch user data while loading
    }
    // Fetch user data after authentication is done
    fetchUserData(user);
  }, [loading, user]);

  const fetchUserData = async (user) => {
    try {
      const db = getFirestore();
      const userDocRef = doc(db, 'AgentOwner', user.uid); // Update the path to the user document
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        if (userData.isVendor) {
          setUserData(userData);
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
      setLoading(false);
    }
  };

  const [menuState, setMenuState] = useState(false);

  const navigation = [
    { title: "Sell Property", path: "/Agent/addbuydata" },
    { title: "Rent Property", path: "/Agent/addrent" },
    { title: "PG", path: "/Agent/addpg" },
    { title: "Hotel", path: "/Agent/addhotel" },
    { title: "Banqueet Hall", path: "/Agent/addbanqueethall" },
    { title: "Resort", path: "/Agent/addresort" },
    // { title: "Laundry", path: "/Agent/Laundry" },
  ];

  return (
    <div>
      <div className='fixed top-0 w-full z-30 '>
        <nav className="bg-white border-b">
          <div className="flex items-center space-x-8 py-3 px-4 max-w-screen-xl mx-auto md:px-8">
            <div className="flex-none lg:flex-initial">
              <a href="javascript:void(0)">
                <img
                  src="https://www.areneservices.in/public/front/images/property-logo.png"
                  width={80}
                  height={30}
                  alt="logo"
                />
              </a>
            </div>
            <div className="flex-1 flex items-center justify-between">
              <div className={`bg-white absolute z-20 w-full top-16 left-0 p-4 border-b lg:static lg:block lg:border-none ${menuState ? '' : 'hidden'}`}>
                <ul className="mt-12 space-y-5 lg:flex lg:space-x-6 lg:space-y-0 lg:mt-0">
                  {
                    navigation.map((item, idx) => (
                      <li key={idx} className="bg-gray-600 hover:bg-gray-900 p-2 rounded-lg">
                        <a className='text-white font-bold hover:white' href={item.path}>
                          {item.title}
                        </a>
                      </li>
                    ))
                  }
                </ul>
             
              </div>
              <div className="flex-1 flex items-center justify-end space-x-2 sm:space-x-6">
               
                <button
                  className="outline-none text-gray-400 block lg:hidden"
                  onClick={() => setMenuState(!menuState)}
                >
                  {
                    menuState ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                      </svg>
                    )
                  }
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>
    <div className='fixed bottom-0 w-full bg-white shadow-md z-30'>
      <ul className='flex justify-around font-sans'>
        <li
          className={`flex flex-col items-center justify-center font-bold w-full text-[15px] py-3.5 cursor-pointer ${
            router.pathname === '/Agent' ? 'text-blue-600' : 'text-gray-600'
          }`}
          onClick={() => navigateTo('')}
        >
          <FaHome className='w-6 h-6 mb-1' />
          Home
        </li>
        <li
          className={`flex flex-col items-center justify-center font-bold w-full text-[15px] py-3.5 cursor-pointer ${
            router.pathname.startsWith('/Agent/Orders') ? 'text-blue-600' : 'text-gray-600'
          }`}
          onClick={() => navigateTo('/Orders')}
        >
          <FaClipboardList className='w-6 h-6 mb-1' />
          Orders
        </li>
        <li
          className={`flex flex-col items-center justify-center font-bold w-full text-[15px] py-3.5 cursor-pointer ${
            router.pathname.startsWith('/Agent/Profile') ? 'text-blue-600' : 'text-gray-600'
          }`}
          onClick={() => navigateTo('/Profile')}
        >
          <FaUser className='w-6 h-6 mb-1' />
          Profile
        </li>
      </ul>
    </div>
    </div>
  );
};

export default AgentNav;
