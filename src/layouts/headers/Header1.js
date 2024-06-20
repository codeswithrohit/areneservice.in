import { useState, useEffect, useRef } from "react";
import { firebase } from "../../../Firebase/config";
import { BiShoppingBag } from 'react-icons/bi';
import { About, Blog, Contact, Home, Listing, Pages,CloudKitchen,LaundryService } from "../Menu";
import { FaUser, FaShoppingCart } from "react-icons/fa"; // Import the cart icon
import Link from "next/link";
const Header1 = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchUserData(authUser.uid); // Fetch user data based on UID
      } else {
        setUser(null);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);
  

  // Function to fetch user data from Firestore
  const fetchUserData = async (uid) => {
    try {
      const userDoc = await firebase
        .firestore()
        .collection("Users")
        .doc(uid)
        .get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        if (userData && userData.photoURL) {
          setUserData(userData);
        } else {
          // If photoURL is missing or undefined, set it to a default value or null
          setUserData({ ...userData, photoURL: null }); // You can set a default value or handle it as per your requirement
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };



  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true); // Set state to indicate logout is in progress
      await firebase.auth().signOut(); // Perform the logout action using Firebase Auth
      // Additional cleanup or state resetting if needed after logout

      setLoggingOut(false); // Reset state after successful logout
      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
      setLoggingOut(false); // Reset state in case of an error during logout
    }
  };

  const [showDropdown, setShowDropdown] = useState(false);

  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };
  return (
    <header style={{backgroundColor:'white'}}  className="header-area  h-10 d-none d-xl-block">
      
      <div className="header-navigation">
        <div className="container-fluid">
          <div className="primary-menu">
            <div className="row">
              <div style={{backgroundColor:'white'}} className="col-lg-2 col-5">
                <div className="">
                  <Link href="/">
                  <a
  className="h-20 w-20 mt-2" // Replace with your desired class name
 
>
  <img
    src="https://www.areneservices.in/public/front/images/property-logo.png"
    alt="Brand Logo"
  />
</a>

                  </Link>
                </div>
              </div>
              <div style={{backgroundColor:'white'}} className="col-lg-6 col-2">
                <div className="nav-menu">
                  <div className="navbar-close">
                    <i className="ti-close"></i>
                  </div>
                  <nav className="main-menu">
                    <ul>
                     
                        
                         
                    
                    <About/>
                      <li className="menu-item has-children">
                        <a href="#">ARENE PG</a>
                        <ul className="sub-menu">
                          <Listing/>
                        </ul>
                      </li>
                      <li className="menu-item has-children">
                        <a href="#">Buy</a>
                        <ul className="sub-menu">
                          <Pages />
                        </ul>
                      </li>
                      <li className="menu-item has-children">
                        <a href="#">Rent</a>
                        <ul className="sub-menu">
                          <Blog />
                        </ul>
                      </li>
                      {/* <li className="menu-item ">
                        <a href="/hotelall">Hotel</a>
                        
                      </li> */}
                     
                    
                      <LaundryService/>
                      <CloudKitchen/>
                      <Contact />
                     
                      <li className="nav-btn">
                        <Link href="/Admin/Register">
                          <a className="main-btn icon-btn">Add Listing</a>
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div style={{backgroundColor:'white'}} className="col-lg-4 col-5">
                <div className="header-right-nav">
                  <ul className="d-flex align-items-center">
                  <div className="nav-right-item">
              <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {user && userData ? (
                  <div className="flex items-center space-x-3 z-30  relative hover:cursor-pointer">
                    <div className="flex items-center">
                      {userData.photoURL ? (
                        <img
                          src={userData.photoURL}
                          alt="User Profile"
                          style={{width:24,height:24}}
                          className="md:w-8 md:h-8 w-8 h-8 mt-4 rounded-full cursor-pointer"
                        />
                      ) : (
                        <FaUser style={{width:24,height:24,marginTop:16}} className="" />
                      )}
                    </div>

                    {showDropdown && (
                      <div class="absolute  right-0 w-48 top-4   bg-white shadow-lg rounded-2xl dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div
                          class="py-1 border-b border-gray-200 dark:border-gray-600"
                          role="none"
                        >
                          <p class="px-4 pt-2 mb-1 font-normal text-black dark:text-black">
                            Signed in as:
                          </p>
                          <a
                            href="#"
                            class="flex px-4 py-2 text-sm font-semibold text-black border-l-2 border-transparent hover:border-red-600 dark:text-black dark:hover:text-black hover:text-red-600 dark:hover:text-red-600"
                          >
                            <span class="mr-2">
                              {userData.photoURL ? (
                                <img
                                  src={userData.photoURL}
                                  alt="User Profile"
                                  className="w-4 h-4 rounded-full cursor-pointer"
                                />
                              ) : (
                                <FaUser className="w-4 h-4 text-black cursor-pointer" />
                              )}
                            </span>
                            {userData.name}
                          </a>
                        </div>

                        <div class="py-1" role="none">
                        <a
      href="/dashboard"
      className="flex px-4 py-2 text-sm text-black border-l-2 border-transparent dark:hover:border-red-600 rounded-bl-md hover:border-red-600 dark:text-black dark:hover:text-black hover:text-red-600"
    >
      <span className="mr-2">
        <BiShoppingBag className="w-4 h-4 hover:text-red-600" />
      </span>
      Dashboard
    </a>
                        </div>
                        {/* <div class="py-1" role="none">
                          <a
                            href="/Our-history"
                            class="flex px-4 py-2 text-sm text-black border-l-2 border-transparent dark:hover:border-red-600 rounded-bl-md hover:border-red-600 dark:text-black dark:hover:text-black hover:text-red-600"
                          >
                            <span class="mr-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                class="w-4 h-4 hover:text-red-600 bi bi-bag"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M4 9h16v11a1 1 0 01-1 1H5a1 1 0 01-1-1V9zm7-6a2 2 0 012 2v2a2 2 0 01-2 2v0a2 2 0 01-2-2V5a2 2 0 012-2zm4 0a2 2 0 012 2v2a2 2 0 01-2 2v0a2 2 0 01-2-2V5a2 2 0 012-2z"
                                ></path>
                              </svg>
                            </span>
                            Our Order
                          </a>
                        </div>
                        <div class="py-1" role="none">
                          <a
                            href="/arenecheforders"
                            class="flex px-4 py-2 text-sm text-black border-l-2 border-transparent dark:hover:border-red-600 rounded-bl-md hover:border-red-600 dark:text-black dark:hover:text-black hover:text-red-600"
                          >
                            <span class="mr-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                class="w-4 h-4 hover:text-red-600 bi bi-bag"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M4 9h16v11a1 1 0 01-1 1H5a1 1 0 01-1-1V9zm7-6a2 2 0 012 2v2a2 2 0 01-2 2v0a2 2 0 01-2-2V5a2 2 0 012-2zm4 0a2 2 0 012 2v2a2 2 0 01-2 2v0a2 2 0 01-2-2V5a2 2 0 012-2z"
                                ></path>
                              </svg>
                            </span>
                            Arene Chef Orders
                          </a>
                        </div>
                        <div class="py-1" role="none">
                          <a
                            href="/arenelaundryorders"
                            class="flex px-4 py-2 text-sm text-black border-l-2 border-transparent dark:hover:border-red-600 rounded-bl-md hover:border-red-600 dark:text-black dark:hover:text-black hover:text-red-600"
                          >
                            <span class="mr-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                class="w-4 h-4 hover:text-red-600 bi bi-bag"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M4 9h16v11a1 1 0 01-1 1H5a1 1 0 01-1-1V9zm7-6a2 2 0 012 2v2a2 2 0 01-2 2v0a2 2 0 01-2-2V5a2 2 0 012-2zm4 0a2 2 0 012 2v2a2 2 0 01-2 2v0a2 2 0 01-2-2V5a2 2 0 012-2z"
                                ></path>
                              </svg>
                            </span>
                            Arene laundry Orders
                          </a>
                        </div> */}

                        <div class="py-1" role="none">
                          <button
                            onClick={handleLogout}
                            class="flex px-4 py-2 text-sm text-black border-l-2 border-transparent dark:hover:border-red-600 rounded-bl-md hover:border-red-600 dark:text-black dark:hover:text-black hover:text-red-600"
                          >
                            <span class="mr-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                class="w-4 h-4 hover:text-red-600 bi bi-box-arrow-right"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"
                                />
                                <path
                                  fill-rule="evenodd"
                                  d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"
                                />
                              </svg>
                            </span>
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="menu-button ">
                    <Link href="/signin">
                      <div class="flex rounded  hover:border-red-600 overflow-hidden">
                      <li className="hero-nav-btn">
                      <Link href="/signin">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 24 24"
        class="cursor-pointer hover:fill-[#43d3b0] inline mt-4">
        <circle cx="10" cy="7" r="6" data-original="#000000" />
        <path
          d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
          data-original="#000000" />
      </svg>
                      </Link>
                    </li>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
              {/* <div class=" mr-4 md:ml-6  text-white flex justify-center items-center">
                <a href="/Cart" class="relative py-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="file: md:w-8 md:h-8 w-8 h-8 ml-4 text-white hover:text-red-600 "
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                    />
                  </svg>
                </a>
              </div> */}
              {/* <div className="navbar-toggler">
                <span />
                <span />
                <span />
              </div> */}
            </div>
                   
                    {/* <li className="user-btn">
                      <Link href="/Cart">
                        <a className="icon">
                        <FaShoppingCart />
                        </a>
                      </Link>
                    </li> */}
                    <li className="hero-nav-btn">
                     
                      <div className=" border-2 border-gray-800 hover:border-[#43d3b0] p-2 mt-4">
                        <a className="flex flex-row"  href="/Agent/Register" >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" class="mr-2" viewBox="0 0 24 24">
              <g data-name="Layer 2">
                <path
                  d="M14.5 12.75A3.22 3.22 0 0 1 12 11.6a3.27 3.27 0 0 1-2.5 1.15A3.22 3.22 0 0 1 7 11.6a2.91 2.91 0 0 1-.3.31 3.22 3.22 0 0 1-2.51.82 3.35 3.35 0 0 1-2.94-3.37v-.71a4.76 4.76 0 0 1 .24-1.5l1.57-4.7a1.75 1.75 0 0 1 1.66-1.2h14.56a1.75 1.75 0 0 1 1.66 1.2l1.57 4.7a4.76 4.76 0 0 1 .24 1.5v.71a3.35 3.35 0 0 1-2.92 3.37 3.2 3.2 0 0 1-2.51-.82c-.11-.1-.22-.22-.32-.33a3.28 3.28 0 0 1-2.5 1.17zm-9.78-10a.26.26 0 0 0-.24.17l-1.56 4.7a3.27 3.27 0 0 0-.17 1v.71a1.84 1.84 0 0 0 1.57 1.88A1.75 1.75 0 0 0 6.25 9.5a.75.75 0 0 1 1.5 0 1.67 1.67 0 0 0 1.75 1.75 1.76 1.76 0 0 0 1.75-1.75.75.75 0 0 1 1.5 0 1.67 1.67 0 0 0 1.75 1.75 1.76 1.76 0 0 0 1.75-1.75.75.75 0 0 1 1.5 0 1.75 1.75 0 0 0 1.93 1.74 1.84 1.84 0 0 0 1.57-1.88v-.71a3.27 3.27 0 0 0-.17-1l-1.56-4.7a.26.26 0 0 0-.24-.17z"
                  data-original="#000000" />
                <path
                  d="M20 22.75H4A1.76 1.76 0 0 1 2.25 21v-9.52a.75.75 0 0 1 1.5 0V21a.25.25 0 0 0 .25.25h16a.25.25 0 0 0 .25-.25v-9.53a.75.75 0 1 1 1.5 0V21A1.76 1.76 0 0 1 20 22.75z"
                  data-original="#000000" />
                <path
                  d="M15.5 22.75h-7a.76.76 0 0 1-.75-.75v-5a1.76 1.76 0 0 1 1.75-1.75h5A1.76 1.76 0 0 1 16.25 17v5a.76.76 0 0 1-.75.75zm-6.25-1.5h5.5V17a.25.25 0 0 0-.25-.25h-5a.25.25 0 0 0-.25.25z"
                  data-original="#000000" />
              </g>
            </svg>
           Post Property
           </a>
           </div>
                     
                    </li>
                    <li className="nav-toggle-btn">
                      <div className="navbar-toggler">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </li> 
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header1;
