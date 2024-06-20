import Link from "next/link";
import React, { useState,useEffect } from "react";
import { About, Blog, Contact, Home, Listing, Pages } from "./Menu";
import { firebase } from "../../Firebase/config";
import { FaUser, FaShoppingCart } from "react-icons/fa"; // Import the cart icon
const MobileMenu = () => {
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
  const [toggle, setToggle] = useState(false);
  const [activeMenu, setActiveMenu] = useState("");
  const activeMenuSet = (value) =>
      setActiveMenu(activeMenu === value ? "" : value),
    activeLi = (value) =>
      value === activeMenu ? { display: "block" } : { display: "none" };
  return (
    <header className="header-area header-area-one d-xl-none">
    
      <div className="header-navigation sticky breakpoint-on">
        <div className="container-fluid">
          <div className="primary-menu">
            <div className="row">
              <div className="col-lg-2 col-5">
                <div className="site-branding">
                  <Link href="/">
                    <a className="brand-logo "  style={{
    padding: "21px 10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    // Other styles if needed
  }}>
                    <img
    src="https://www.areneservices.in/public/front/images/property-logo.png"
    alt="Brand Logo"
  />
                    </a>
                  </Link>
                </div>
              </div>
              <div className="col-lg-6 col-2">
                <div className={`nav-menu ${toggle ? "menu-on" : ""}`}>
                  <div
                    className="navbar-close"
                    onClick={() => setToggle(false)}
                  >
                    <i className="ti-close"></i>
                  </div>
                  <nav className="main-menu">
                    <ul>
                      <li className="menu-item has-children">
                        <Link href="/">
                          <a>Home</a>
                        </Link>
                       
                        <span
                          className="dd-trigger"
                          onClick={() => activeMenuSet("Home")}
                        >
                          <i className="ti-arrow-down"></i>
                        </span>
                      </li>
                      <About onClick={() => setToggle(false)}/>
                      <li className="menu-item has-children">
                        <a href="#">ARENE PG</a>
                        <ul className="sub-menu" style={activeLi("Listings")}>
                          <Listing onClick={() => setToggle(false)}/>
                        </ul>
                        <span
                          className="dd-trigger"
                          onClick={() => activeMenuSet("Listings")}
                        >
                          <i className="ti-arrow-down"></i>
                        </span>
                      </li>
                      <li className="menu-item has-children">
                        <a href="#">Buy</a>
                        <ul className="sub-menu" style={activeLi("Pages")}>
                          <Pages onClick={() => setToggle(false)}/>
                        </ul>
                        <span
                          className="dd-trigger"
                          onClick={() => activeMenuSet("Pages")}
                        >
                          <i className="ti-arrow-down"></i>
                        </span>
                      </li>
                      <li className="menu-item has-children">
                        <a href="#">Rent</a>
                        <ul className="sub-menu" style={activeLi("Article")}>
                          <Blog onClick={() => setToggle(false)}/>
                        </ul>
                        <span
                          className="dd-trigger"
                          onClick={() => activeMenuSet("Article")}
                        >
                          <i className="ti-arrow-down"></i>
                        </span>
                      </li>
                      <Contact onClick={() => setToggle(false)}/>
                      <li className="nav-btn">
                        <Link href="/Agent/Register">
                          <a className="main-btn icon-btn">Add Listing</a>
                        </Link>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div className="col-lg-4 col-5">
                <div className="header-right-nav">
                  <ul className="d-flex align-items-center">
                    <li className="user-btn">
                      <Link href="/">
                        <a className="icon">
                          <i className="flaticon-avatar"></i>
                        </a>
                      </Link>
                    </li>
                    <li className="hero-nav-btn">
                      <Link href="/Agent/Register">
                        <a className="main-btn icon-btn">Add Listing</a>
                      </Link>
                    </li>
                    <div
                    className="ml-4"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {user && userData ? (
                  <div className="flex items-center space-x-3  relative hover:cursor-pointer">
                    <div className="flex items-center">
                      {userData.photoURL ? (
                        <img
                          src={userData.photoURL}
                          alt="User Profile"
                          style={{width:24,height:24}}
                          className="md:w-8 md:h-8 w-8 h-8 rounded-full cursor-pointer"
                        />
                      ) : (
                        <FaUser style={{width:24,height:24}} className="" />
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
                            href="/Profile"
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
                      <li >
                      <Link href="/signin">
                        <a className="main-btn ">Login</a>
                      </Link>
                    </li>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
                    <li className="nav-toggle-btn">
                      <div
                        className={`navbar-toggler ${toggle ? "active" : ""}`}
                        onClick={() => setToggle(!toggle)}
                      >
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
export default MobileMenu;
