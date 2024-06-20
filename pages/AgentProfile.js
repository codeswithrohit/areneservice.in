import React from 'react'
import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { firebase } from '../Firebase/config';
const AgentProfile = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
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
          router.push('/Admin/Register'); // Redirect to the login page if the user is not authenticated
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
          } else {
            router.push('/Admin/Register'); // Redirect to the login page if the user is not an admin
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
  
    const handleLogout = async () => {
      const auth = getAuth();
      try {
        await signOut(auth);
        router.push('/Admin/Register');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    };
  
    if (isLoading) {
      return <p>Loading...</p>; // Show a loading indicator while fetching data
    }
    
  console.log(userData)
  return (
    <div>
        <div class="bg-gray-100 dark:bg-gray-900 dark:text-white text-gray-600 h-screen flex overflow-hidden text-sm">

  <div class="flex-grow overflow-hidden h-full flex flex-col">
    <div class="h-16 lg:flex w-full border-b border-gray-200 dark:border-gray-800 hidden px-10">
      <div class="flex h-full text-gray-600 dark:text-gray-400">
        <a href="#" class="cursor-pointer h-full border-b-2 border-transparent inline-flex items-center mr-8">Company</a>
        <a href="#" class="cursor-pointer h-full border-b-2 border-blue-500 text-blue-500 dark:text-white dark:border-white inline-flex mr-8 items-center">Users</a>
        <a href="#" class="cursor-pointer h-full border-b-2 border-transparent inline-flex items-center mr-8">Expense Centres</a>
        <a href="#" class="cursor-pointer h-full border-b-2 border-transparent inline-flex items-center">Currency Exchange</a>
      </div>
      <div class="ml-auto flex items-center space-x-7">
        <button class="h-8 px-3 rounded-md shadow text-white bg-blue-500">Deposit</button>

        <button class="flex items-center">
          <span class="relative flex-shrink-0">
            <img class="w-7 h-7 rounded-full" src="https://images.unsplash.com/photo-1521587765099-8835e7201186?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ" alt="profile" />
            <span class="absolute right-0 -mb-0.5 bottom-0 w-2 h-2 rounded-full bg-green-500 border border-white dark:border-gray-900"></span>
          </span>
          <span class="ml-2">James Smith</span>
          <svg viewBox="0 0 24 24" class="w-4 ml-1 flex-shrink-0" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
      </div>
    </div>
    <div class="flex-grow flex overflow-x-hidden">
     
      <div class="flex-grow bg-white dark:bg-gray-900 overflow-y-auto">
        <div class="sm:px-7 sm:pt-7 px-4 pt-4 mt-36 lg:mt-0 flex flex-col w-full border-b border-gray-200 bg-white dark:bg-gray-900 dark:text-white dark:border-gray-800 sticky top-0">
          <div class="flex w-full items-center">
            <div class="flex items-center text-3xl text-gray-900 dark:text-white">
              {/* <img src="https://assets.codepen.io/344846/internal/avatars/users/default.png?fit=crop&format=auto&height=512&version=1582611188&width=512" class="w-12 mr-4 rounded-full" alt="profile" /> */}
            Welcome, {userData.name}
            </div>
            <div class="ml-auto sm:flex hidden items-center justify-end">
              <div class="text-right">
                <div class="text-xs text-gray-400 dark:text-gray-400">Account balance:</div>
                <div class="text-gray-900 text-lg dark:text-white">$2,794.00</div>
              </div>
              <button class="w-8 h-8 ml-4 text-gray-400 shadow dark:text-gray-400 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700">
                <svg viewBox="0 0 24 24" class="w-4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="19" cy="12" r="1"></circle>
                  <circle cx="5" cy="12" r="1"></circle>
                </svg>
              </button>
            </div>
          </div>
          <div class="flex items-center space-x-3 sm:mt-7 mt-4">
            <a href="#" class="px-3 border-b-2 border-blue-500 text-blue-500 dark:text-white dark:border-white pb-1.5">Dashboard</a>
            <a href="#" class="px-3 border-b-2 border-transparent text-gray-600 dark:text-gray-400 pb-1.5">Order</a>
            <a href="#" class="px-3 border-b-2 border-transparent text-gray-600 dark:text-gray-400 pb-1.5">Buy</a>
            <a href="#" class="px-3 border-b-2 border-transparent text-gray-600 dark:text-gray-400 pb-1.5 sm:block hidden">Rent</a>
            <a href="#" class="px-3 border-b-2 border-transparent text-gray-600 dark:text-gray-400 pb-1.5 sm:block hidden">PG</a>
            <a href="#" class="px-3 border-b-2 border-transparent text-gray-600 dark:text-gray-400 pb-1.5 sm:block hidden">Hotel</a>
            <a href="#" class="px-3 border-b-2 border-transparent text-gray-600 dark:text-gray-400 pb-1.5 sm:block hidden">Cloud Kitchen</a>
            <a href="#" class="px-3 border-b-2 border-transparent text-gray-600 dark:text-gray-400 pb-1.5 sm:block hidden">Laundry</a>
          </div>
        </div>
        <section class="px-6 pt-6">
                    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        <div class="flex items-center p-4 rounded-md shadow dark:bg-gray-900 bg-gray-50">
                            <div class="mr-4">
                                <span
                                    class="inline-block p-4 mr-2 text-blue-600 bg-blue-100 rounded-full dark:text-gray-400 dark:bg-gray-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        class="w-6 h-6 bi bi-currency-dollar" viewBox="0 0 16 16">
                                        <path
                                            d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z">
                                        </path>
                                    </svg>
                                </span>
                            </div>
                            <div>
                                <p class="mb-2 text-gray-700 dark:text-gray-400">Earnings Annual</p>
                                <h2 class="text-2xl font-bold text-gray-700 dark:text-gray-400">
                                    $1,25,220</h2>
                            </div>
                        </div>
                        <div class="flex items-center p-4 rounded-md shadow dark:bg-gray-900 bg-gray-50">
                            <div class="mr-4">
                                <span
                                    class="inline-block p-4 mr-2 text-blue-600 bg-blue-100 rounded-full dark:text-gray-400 dark:bg-gray-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        class="w-6 h-6 bi bi-bag-check" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd"
                                            d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z">
                                        </path>
                                        <path
                                            d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z">
                                        </path>
                                    </svg>
                                </span>
                            </div>
                            <div>
                                <p class="mb-2 text-gray-700 dark:text-gray-400">Pending Orders</p>
                                <h2 class="text-2xl font-bold text-gray-700 dark:text-gray-400">
                                    100</h2>
                            </div>
                        </div>
                        <div class="flex items-center p-4 rounded-md shadow dark:bg-gray-900 bg-gray-50">
                            <div class="mr-4">
                                <span
                                    class="inline-block p-4 mr-2 text-blue-600 bg-blue-100 rounded-full dark:text-gray-400 dark:bg-gray-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                        class="w-6 h-6 bi bi-chat-text" viewBox="0 0 16 16">
                                        <path
                                            d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z">
                                        </path>
                                        <path
                                            d="M4 5.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zM4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8zm0 2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z">
                                        </path>
                                    </svg>
                                </span>
                            </div>
                            <div>
                                <p class="mb-2 text-gray-700 dark:text-gray-400">Pending Requests</p>
                                <h2 class="text-2xl font-bold text-gray-700 dark:text-gray-400">
                                    56</h2>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="px-6 py-6">
                    <div class="grid lg:grid-cols-[100%,1fr]  grid-cols-1 gap-6 ">
                        <div class="pt-4 bg-white rounded shadow dark:text-gray-100 dark:bg-gray-900">
                            <div class="flex px-6 pb-4 border-b dark:border-gray-700">
                                <h2 class="text-xl font-bold dark:text-gray-400">Orders</h2>
                            </div>
                            <div class="p-4 overflow-x-auto">
                                <table class="w-full table-auto">
                                    <thead>
                                        <tr class="text-xs text-left text-gray-500 dark:text-gray-400">
                                            <th class="px-6 pb-3 font-medium">Transaction ID</th>
                                            <th class="px-6 pb-3 font-medium ">Date </th>
                                            <th class="px-6 pb-3 font-medium">Email </th>
                                            <th class="px-6 pb-3 font-medium">Status </th>
                                            <th class="px-6 pb-3 font-medium"> </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="text-xs bg-gray-100 dark:text-gray-400 dark:bg-transparent">
                                            <td class="px-6 py-5 font-medium">018276td45</td>
                                            <td class="px-6 py-5 font-medium ">08.4.2021</td>
                                            <td class="px-6 py-5 font-medium ">abc@gmail.com</td>
                                            <td>
                                                <span
                                                    class="inline-block px-2 py-1 text-center text-green-600 bg-green-100 rounded-full dark:text-green-700 dark:bg-green-200">Completed</span>
                                            </td>
                                            <td class="px-6 py-5 ">
                                                <a href="#"
                                                    class="px-4 py-2 font-medium text-blue-500 border border-blue-500 rounded-md dark:text-blue-300 dark:border-blue-300 dark:hover:bg-blue-300 dark:hover:text-gray-700 hover:text-gray-100 hover:bg-blue-500">Edit
                                                </a>
                                            </td>
                                        </tr>
                                        <tr class="text-xs dark:text-gray-400">
                                            <td class="px-6 py-5 font-medium">018276td45</td>
                                            <td class="px-6 py-5 font-medium ">08.4.2021</td>
                                            <td class="px-6 py-5 font-medium ">abc@gmail.com</td>
                                            <td>
                                                <span
                                                    class="inline-block px-2 py-1 text-center text-yellow-600 bg-yellow-100 rounded-full dark:text-yellow-700 dark:bg-yellow-200">Pending</span>
                                            </td>
                                            <td class="px-6 py-5 ">
                                                <a href="#"
                                                    class="px-4 py-2 font-medium text-blue-500 border border-blue-500 rounded-md dark:text-blue-300 dark:border-blue-300 dark:hover:bg-blue-300 dark:hover:text-gray-700 hover:text-gray-100 hover:bg-blue-500">Edit
                                                </a>
                                            </td>
                                        </tr>
                                        <tr class="text-xs bg-gray-100 dark:bg-transparent dark:text-gray-400">
                                            <td class="px-6 py-5 font-medium">018276td45</td>
                                            <td class="px-6 py-5 font-medium ">08.4.2021</td>
                                            <td class="px-6 py-5 font-medium ">abc@gmail.com</td>
                                            <td>
                                                <span
                                                    class="inline-block px-2 py-1 text-center text-green-600 bg-green-100 rounded-full dark:text-green-700 dark:bg-green-200">Completed</span>
                                            </td>
                                            <td class="px-6 py-5 ">
                                                <a href="#"
                                                    class="px-4 py-2 font-medium text-blue-500 border border-blue-500 rounded-md dark:text-blue-300 dark:border-blue-300 dark:hover:bg-blue-300 dark:hover:text-gray-700 hover:text-gray-100 hover:bg-blue-500">Edit
                                                </a>
                                            </td>
                                        </tr>
                                        <tr class="text-xs dark:text-gray-400">
                                            <td class="px-6 py-5 font-medium">018276td45</td>
                                            <td class="px-6 py-5 font-medium ">08.4.2021</td>
                                            <td class="px-6 py-5 font-medium ">abc@gmail.com</td>
                                            <td>
                                                <span
                                                    class="inline-block px-2 py-1 text-center text-red-600 bg-red-100 rounded-full dark:text-red-700 dark:bg-red-200">
                                                    Cancelled</span>
                                            </td>
                                            <td class="px-6 py-5 ">
                                                <a href="#"
                                                    class="px-4 py-2 font-medium text-blue-500 border border-blue-500 rounded-md dark:text-blue-300 dark:border-blue-300 dark:hover:bg-blue-300 dark:hover:text-gray-700 hover:text-gray-100 hover:bg-blue-500">Edit
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                       
                    </div>
                </section>
       
      </div>
    </div>
  </div>
</div>
    </div>
  )
}

export default AgentProfile