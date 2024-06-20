import React, { useEffect, useState,Fragment } from 'react';
import { firebase } from '../../Firebase/config';
import Link from 'next/link';
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { Listbox, Transition } from "@headlessui/react";
import AdminNavbar from "../../components/AdminNavbar";
const people = [
  { name: "This weekly" },
  { name: "This monthly" },
  { name: "This yearly" },
];
const graphDropdown = [
  { name: "Daily" },
  { name: "Weekly" },
  { name: "Monthly" },
  { name: "Yearly" },
];
const resultDropdown = [{ name: "Full Result" }, { name: "Quarterly Results" }];

const options = {
  chart: {
    type: "pie",
    height: 120,
    width: 128,
  },
  title: false,
  series: [
    {
      name: "Data",
      data: [[23], [13], [62]],
    },
  ],
  exporting: {
    enabled: false,
  },
  credits: {
    enabled: false,
  },
  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 100,
        },
      },
    ],
  },
  legend: {
    enabled: false,
  },
  plotOptions: {
    pie: {
      borderWidth: 0,
      innerSize: "60%",
      dataLabels: {
        enabled: false,
      },
      showInLegend: true,
      colors: ["#E5E5E5", "#18CDCA", "#4F80E1"],
      states: {
        hover: {
          brightness: 0.1,
        },
      },
    },
  },
};
const options2 = {
  chart: {
    type: "column",
    height: 150,
  },
  xAxis: {
    categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
  yAxis: {
    lineColor: "transparent",
    title: {
      text: null,
    },
    labels: {
      enabled: false,
    },
    gridLineWidth: 2,
  },
  title: false,
  series: [
    {
      name: "Vision",
      data: [5, 3, 4, 7, 2, 6, 8],
    },
    {
      name: "Sales",
      data: [2, 2, 2, 2, 1, 8, 10],
    },
  ],
  responsive: {
    rules: [
      {
        condition: {
          maxWidth: 500,
        },
      },
    ],
  },
  exporting: {
    enabled: false,
  },
  credits: {
    enabled: false,
  },
  legend: {
    align: "left",
    verticalAlign: "top",
    x: -14,
    y: -12,
    enabled: true,
  },
  plotOptions: {
    pie: {
      borderWidth: 0,
      innerSize: "60%",
      dataLabels: {
        enabled: false,
      },
      showInLegend: true,
      colors: ["#18CDCA", "#4F80E1"],
      states: {
        hover: {
          brightness: 0.1,
        },
      },
    },
  },
};


const DropDowns = ({ list }) => {
  const [selected, setSelected] = useState(list[0]);
  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className="relative mt-1">
        <Listbox.Button className="py-2.5 px-2 border border-[#E7E7E7] flex justify-center items-center gap-1 rounded text-sm text-[#637381] font-normal">
          <span className="block truncate">{selected.name}</span>{" "}
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="14" height="14" fill="white" />
            <path
              d="M11 5L7.5 8.5L4 5"
              stroke="#637381"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 z-50 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm min-w-[100px]">
            {list?.map((person, personIdx) => (
              <Listbox.Option
                key={personIdx}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-2 pr-4 ${
                    active ? "bg-[#F6F8FA] text-gray-900" : "text-gray-900"
                  }`
                }
                value={person}
              >
                {({ selected }) => (
                  <span
                    className={`block truncate ${
                      selected
                        ? "font-medium text-[#212B36]"
                        : "font-normal text-[#637381]"
                    }`}
                  >
                    {person.name}
                  </span>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};
const Dashbord = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [openSideBar, setOpenSieBar] = useState(true);
  const changeSideBar = () => {
    setOpenSieBar(!openSideBar);
  };
  const showMenuItems = () => {
    setShowMenu(!showMenu);
  };

  const [bookings, setBookings] = useState(null);
  const [todaybookings, setTodayBookings] = useState(null);
  const [cheforder, setCheforder] = useState(null);
  const [todaycheforder, setTodayCheforder] = useState(null);
  const [laundryorder, setLaundryorder] = useState(null);
  const [todaylaundryorder, setTodayLaundryorder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [registration, setRegistration] = useState([]);

  useEffect(() => {
      const fetchBookings = async () => {
          try {
              const snapshot = await firebase.firestore().collection('bookings').get();
              const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              // Filter bookings by current date
              const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
              const filteredBookings = data.filter(booking => booking.OrderDate === currentDate);
              // Log the booking data
              console.log('Today\'s bookings:', filteredBookings);
              setTodayBookings(filteredBookings)
              // Sort bookings by OrderDate from current date to the latest date
              data.sort((a, b) => new Date(a.OrderDate) - new Date(b.OrderDate));
              setBookings(data);
              setLoading(false);
          } catch (error) {
              console.error('Error fetching bookings:', error);
              setLoading(false);
          }
      };

      fetchBookings();
  }, []);


  useEffect(() => {
      const fetchBookings = async () => {
          try {
              const snapshot = await firebase.firestore().collection('kitchenorder').get();
              const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              // Filter bookings by current date
              const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
              const filteredBookings = data.filter(booking => booking.OrderDate === currentDate);
              // Log the booking data
              console.log('Today\'s bookings:', filteredBookings);
              setTodayCheforder(filteredBookings)
              // Sort bookings by OrderDate from current date to the latest date
              data.sort((a, b) => new Date(a.OrderDate) - new Date(b.OrderDate));
              setCheforder(data);
              setLoading(false);
          } catch (error) {
              console.error('Error fetching bookings:', error);
              setLoading(false);
          }
      };

      fetchBookings();
  }, []);
  useEffect(() => {
      const fetchBookings = async () => {
          try {
              const snapshot = await firebase.firestore().collection('laundryorders').get();
              const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              // Filter bookings by current date
              const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
              const filteredBookings = data.filter(booking => booking.OrderDate === currentDate);
              // Log the booking data
              console.log('Today\'s bookings:', filteredBookings);
              setTodayLaundryorder(filteredBookings)
              // Sort bookings by OrderDate from current date to the latest date
              data.sort((a, b) => new Date(a.OrderDate) - new Date(b.OrderDate));
              setLaundryorder(data);
              setLoading(false);
          } catch (error) {
              console.error('Error fetching bookings:', error);
              setLoading(false);
          }
      };

      fetchBookings();
  }, []);

  useEffect(() => {
    const db = firebase.firestore();
    const RegistrationRef = db.collection("Users");

    RegistrationRef.get()
      .then((RegistrationSnapshot) => {
        const RegistrationData = [];
        RegistrationSnapshot.forEach((doc) => {
          RegistrationData.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        RegistrationData.sort(
          (a, b) => new Date(b.currentDate) - new Date(a.currentDate)
        );

        setRegistration(RegistrationData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error getting documents: ", error);
        setIsLoading(false);
      });
  }, []);

  const Totalorder = bookings ? bookings.length : 0;
  const Totalcheforder = cheforder ? cheforder.length : 0;
  const Totallaundryorder = laundryorder ? laundryorder.length : 0;
  const Totaluser = registration ? registration.length : 0;
  
  return (
    <div className="min-h-[100vh] bg-[#F6F8FA]  w-full nourd-text admin-dashboard">
         <AdminNavbar/>
        <div className="lg:ml-64" >
        {loading ? (
          <div className="flex justify-center items-center h-screen">
       <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="w-12 h-12 animate-spin"
       viewBox="0 0 16 16">
       <path
           d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
       <path fill-rule="evenodd"
           d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z" />
   </svg>
   </div>
      ) : (
      <div
        className={`w-full flex ${
          showMenu ? "overflow-hidden h-screen" : "sm:overflow-auto"
        }`}
      >
     
        <div className="w-full flex flex-col">
       
          <div className="w-full py-3 pl-7 pr-5 grid xl:grid-cols-12 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 justify-start">
          <div
                className="p-5 h-36 xl:col-span-3 bg-white flex flex-col max-w-xs 2xl:max-w-none w-full rounded-xl gap-2 border border-[#E7E7E7] hover:shadow-xl cursor-pointer"
              
              >
                <div
                  className={`flex justify-between ${
                    openSideBar ? " sm:flex-col md:flex-row" : " sm:flex-row"
                  }`}
                >
                  <span className="text-[#637381] text-sm font-medium">
                    Total Users
                  </span>
                
                </div>
                <div
                  className={`flex gap-4  justify-between ${
                    openSideBar
                      ? "flex-wrap sm:flex-col md:flex-row items-end md:flex-nowrap"
                      : "flex-nowrap items-center"
                  }`}
                >
                  <span className="text-2xl font-bold whitespace-nowrap">
                   {Totaluser}
                  </span>
                
                </div>
              </div>
          <div
                className="p-5 h-36 xl:col-span-3 bg-white flex flex-col max-w-xs 2xl:max-w-none w-full rounded-xl gap-2 border border-[#E7E7E7] hover:shadow-xl cursor-pointer"
              
              >
                <div
                  className={`flex justify-between ${
                    openSideBar ? " sm:flex-col md:flex-row" : " sm:flex-row"
                  }`}
                >
                  <span className="text-[#637381] text-sm font-medium">
                    Total Booking
                  </span>
                
                </div>
                <div
                  className={`flex gap-4  justify-between ${
                    openSideBar
                      ? "flex-wrap sm:flex-col md:flex-row items-end md:flex-nowrap"
                      : "flex-nowrap items-center"
                  }`}
                >
                  <span className="text-2xl font-bold whitespace-nowrap">
                    {Totalorder}
                  </span>
                
                </div>
              </div>
          <div
                className="p-5 h-36 xl:col-span-3 bg-white flex flex-col max-w-xs 2xl:max-w-none w-full rounded-xl gap-2 border border-[#E7E7E7] hover:shadow-xl cursor-pointer"
              
              >
                <div
                  className={`flex justify-between ${
                    openSideBar ? " sm:flex-col md:flex-row" : " sm:flex-row"
                  }`}
                >
                  <span className="text-[#637381] text-sm font-medium">
                    Total Arene laundry booking
                  </span>
                
                </div>
                <div
                  className={`flex gap-4  justify-between ${
                    openSideBar
                      ? "flex-wrap sm:flex-col md:flex-row items-end md:flex-nowrap"
                      : "flex-nowrap items-center"
                  }`}
                >
                  <span className="text-2xl font-bold whitespace-nowrap">
                   {Totallaundryorder}
                  </span>
                
                </div>
              </div>
          <div
                className="p-5 h-36 xl:col-span-3 bg-white flex flex-col max-w-xs 2xl:max-w-none w-full rounded-xl gap-2 border border-[#E7E7E7] hover:shadow-xl cursor-pointer"
              
              >
                <div
                  className={`flex justify-between ${
                    openSideBar ? " sm:flex-col md:flex-row" : " sm:flex-row"
                  }`}
                >
                  <span className="text-[#637381] text-sm font-medium">
                    Total Arene Chef Order
                  </span>
                
                </div>
                <div
                  className={`flex gap-4  justify-between ${
                    openSideBar
                      ? "flex-wrap sm:flex-col md:flex-row items-end md:flex-nowrap"
                      : "flex-nowrap items-center"
                  }`}
                >
                  <span className="text-2xl font-bold whitespace-nowrap">
                    {Totalcheforder}
                  </span>
                
                </div>
              </div>
          






            {/* <div className="px-4 pt-4 pb-7 bg-white flex-col gap-1 justify-between  w-full max-h-64 xl:col-span-3 xl:row-start-2 lg:row-start-3 rounded-xl border border-[#E7E7E7]">
              <span className="text-[#212B36] text-base font-semibold -tracking-[0.15px]">
                Customer Volume
              </span>
              <div className="flex justify-between sm:flex-col md:flex-row max-w-xs 2xl:max-w-none h-full max-h-60 md:pb-5">
                <div className="sm:mt-2 md:mt-0 self-center md:self-end">
                  <div className="flex gap-1 items-center">
                    <div className="h-2 w-3 bg-[#497AF9] rounded-sm"></div>
                    <div className="text-[10px] flex gap-1">
                      <span className="">62%</span>
                      <span className="text-[#637381]">New</span>
                    </div>
                  </div>
                  <div className="flex gap-1 items-center">
                    <div className="h-2 w-3 bg-[#18CDCA] rounded-sm"></div>
                    <div className="text-[10px] flex gap-1">
                      <span>13% </span>
                      <span className="text-[#637381]">Returning</span>
                    </div>
                  </div>
                  <div className="flex gap-1 items-center">
                    <div className="h-2 w-3 bg-[#000000]/20 rounded-sm"></div>
                    <div className="text-[10px] flex gap-1">
                      <span>23%</span>
                      <span className="text-[#637381]">Inactive</span>
                    </div>
                  </div>
                </div>
                <HighchartsReact highcharts={Highcharts} options={options} />
              </div>
            </div>
            <div className="px-4 py-4 bg-white flex-col sm:col-span-2 w-full max-h-64 xl:col-span-6 xl:row-start-2 lg:row-start-3 rounded-xl border border-[#E7E7E7] ">
              <div className="flex flex-col justify-between">
                <div className="flex items-center justify-between ">
                  <span className="text-[#212B36] text-base font-semibold -tracking-[0.15px] whitespace-nowrap">
                    Sales Volume
                  </span>
                  <div className="sm:flex gap-2 items-center hidden">
                    <span className="text-sm font-medium text-[#212B36] -tracking-[0.15px] cursor-pointer">
                      Daily
                    </span>
                    <span className="text-[#637381] text-sm font-medium -tracking-[0.15px] cursor-pointer">
                      Weekly
                    </span>
                    <span className="text-[#637381] text-sm font-medium -tracking-[0.15px] cursor-pointer">
                      Monthly
                    </span>
                    <span className="text-[#637381] text-sm font-medium -tracking-[0.15px] cursor-pointer">
                      Yearly
                    </span>
                  </div>
                  <div className=" block sm:hidden">
                    <DropDowns list={graphDropdown} />
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className=" w-full  h-full">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={options2}
                    />
                  </div>
                </div>
              </div>
            </div> */}
            <div className="xl:row-span-2 row-span-1 lg:row-start-4 bg-white py-5 xl:col-span-3 px-3 flex flex-col gap-5 h-full rounded-xl border border-[#E7E7E7]">
              <span className="text-sm text-[#212B36] font-semibold -tracking-[0.15px]">
                New Messages
              </span>
              <div className="flex flex-col gap-5">
                {/* {messages?.map((data, index) => (
                  <div key={index} className="flex gap-3.5">
                    <div className="">
                      <img src={data?.image} alt={data?.alt} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-medium text-[#212B36] cursor-pointer">
                        {data?.name}
                      </span>
                      <span className="text-sm font-normal text-[#637381] cursor-pointer">
                        {data?.message}
                      </span>
                    </div>
                  </div>
                ))} */}
              </div>
            </div>
            <div className="p-3 bg-white flex flex-col xl:col-span-9 xl:row-auto lg:row-start-4 lg:col-span-2 rounded-xl border border-[#E7E7E7]">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="text-[#212B36] text-base font-semibold -tracking-[0.15px] whitespace-nowrap">
                 Today Bookings
                </span>
               
              </div>
              <div className="w-full overflow-x-scroll md:overflow-auto max-w-xl xs:max-w-xl sm:max-w-xl md:max-w-8xl 2xl:max-w-none mt-1">
              <table className="min-w-full divide-y divide-gray-200 font-[sans-serif]">
                       <thead className="bg-gray-100 whitespace-nowrap">
                         <tr>
                           <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                             Customer Name
                           </th>
                           <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                             Order Details
                           </th>
                           <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                             Payment
                           </th>
                           <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                             Booking Date
                           </th>
                           <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                             Actions
                           </th>
                         </tr>
                       </thead>
                       <tbody className="bg-white divide-y divide-gray-200 whitespace-nowrap">
                       {todaybookings.length === 0 && (
  <tr>
    <td colSpan="6" className="px-6 py-4 text-center text-[#333]">
      Today, there are no orders.
    </td>
  </tr>
)}

                         {todaybookings &&
                           todaybookings.map((booking) => (
                             <tr key={booking.id}>
                               <td className="px-2 py-4 text-xs text-[#333]">
                                 {booking.Name}
                               </td>
                               <td className="px-2 py-4 text-xs text-[#333]">
                                 {booking.GarmentTypes ? (
                                   // If GarmentTypes available, show the data
                                   JSON.parse(booking.GarmentTypes).map((garment, index) => (
                                     <div key={index}>
                                       <p>No. of Garments: {garment.noofgarments}</p>
                                       <p>Tenure: {garment.tenure}</p>
                                       <p>Price: {garment.price}</p>
                                     </div>
                                   ))
                                 ) : (
                                   // If GarmentTypes not available, show order details
                                   `${booking.Propertyname}-${booking.roomType}-${booking.roomprice}`
                                 )}
                               </td>
                               <td className="px-2 py-4 text-xs text-[#333]">
                                 {booking.Payment}
                               </td>
                               <td className="px-2 py-4 text-xs text-[#333]">
                                 {booking.bookingDate instanceof Object ? (
                                   // If bookingDate is an object, extract checkIn or checkOut
                                   <>
                                     <p>Check In: {booking.bookingDate.checkIn}</p>
                                     {booking.bookingDate.checkOut ? (
                                       <p>Check Out: {booking.bookingDate.checkOut}</p>
                                     ) : null}
                                   </>
                                 ) : (
                                   // If bookingDate is a string, display it directly
                                   <p>{booking.bookingDate}</p>
                                 )}
                               </td>
                               <td className="px-2 py-4 text-xs text-[#333]">
                                 {booking.GarmentTypes ? (
                                   <Link href={`/laundrybookingdetails?orderId=${booking.orderId}`}>
                                     <a className="bg-blue-500 text-white px-2 py-1 rounded">View Details</a>
                                   </Link>
                                 ) : (
                                   <Link href={`/Admin/adminorder?orderId=${booking.orderId}`}>
                                     <a className="bg-blue-500 text-white px-2 py-1 rounded">Booking Details</a>
                                   </Link>
                                 )}
                               </td>
                             </tr>
                           ))}
                       </tbody>
                     </table>
              </div>
            </div>
            <div className="p-3 bg-white flex flex-col xl:col-span-8 lg:row-start-5 xl:row-auto lg:col-span-2 rounded-xl border border-[#E7E7E7] h-max">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="text-[#212B36] text-base font-semibold -tracking-[0.15px] whitespace-nowrap">
                  Today Arene Chef Order
                </span>
                
              </div>
              <div className="w-full overflow-x-scroll md:overflow-auto max-w-xl sm:max-w-xl md:max-w-3xl 2xl:max-w-none mt-1">
              <table class="min-w-full divide-y divide-gray-200 font-[sans-serif]">
    <thead class="bg-gray-100 whitespace-nowrap">
      <tr>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Customer Name
        </th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
       Thalli Name
        </th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Order Details
        </th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Payment
        </th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Booking Date
        </th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200 whitespace-nowrap">
    {todaycheforder && todaycheforder.length === 0 && (
  <tr>
    <td colSpan="6" className="px-6 py-4 text-center text-[#333]">
      Today, there are no orders.
    </td>
  </tr>
)}


    {todaycheforder && todaycheforder.map(booking => (
      <tr key={booking.id} >
        <td class="px-6 py-4 text-sm text-[#333]">
        {booking.firstName} {booking.lastName}
        </td>
        <td class="px-6 py-4 text-sm text-[#333]">
        {booking.thaliname}
        </td>
        <td class="px-6 py-4 text-sm text-[#333]">
        <div>
                    <p>No. of Thalli: {booking.noofthalli}</p>
                    <p>Tenure: {booking.selectedTenure}</p>
                    <p>Price: {booking.Foodcharge}</p>
                </div>
        
        </td>
        <td class="px-6 py-4 text-sm text-[#333]">
        {booking.Payment}
        </td>
        <td class="px-6 py-4 text-sm text-[#333]">
        {booking.bookingDate instanceof Object ? (
    // If bookingDate is an object, extract checkIn or checkOut
    <>
        <p>Check In: {booking.bookingDate.checkIn}</p>
        {booking.bookingDate.checkOut ? (
            <p>Check Out: {booking.bookingDate.checkOut}</p>
  ) : null}
    </>
) : (
    // If bookingDate is a string, display it directly
    <p>{booking.bookingDate}</p>
)}

        </td>
        <td class="px-6 py-4 text-sm text-[#333]">
        {booking.GarmentTypes ? (
                                                                        <Link href={`/laundrybookingdetails?orderId=${booking.orderId}`}>
                                                                            <a className="bg-blue-500 text-white px-2 py-1 rounded">
                                                                                View Details
                                                                            </a>
                                                                        </Link>
                                                                    ) : (
                                                                        <Link href={`/Admin/adminarenechefdetails?orderId=${booking.orderId}`}>
                                                                            <a className="bg-blue-500 text-white px-2 py-1 rounded">
                                                                                Booking Details
                                                                            </a>
                                                                        </Link>
                                                                    )}
                                                                    {/* <button onClick={() => openModal(booking)} className="bg-blue-500 ml-4 text-white px-2 py-1 rounded">
                                                                                Update Orders Delivery
                                                                            </button> */}
        </td>
       
      </tr>
    ))}
    </tbody>
  </table>
              </div>
            </div>
            <div className="p-3 bg-white flex flex-col xl:col-span-8 lg:row-start-5 xl:row-auto lg:col-span-2 rounded-xl border border-[#E7E7E7] h-max">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <span className="text-[#212B36] text-base font-semibold -tracking-[0.15px] whitespace-nowrap">
                  Today Arene Laundry Order
                </span>
                
              </div>
              <div className="w-full overflow-x-scroll md:overflow-auto max-w-xl sm:max-w-xl md:max-w-3xl 2xl:max-w-none mt-1">
              <table class="min-w-full divide-y divide-gray-200 font-[sans-serif]">
    <thead class="bg-gray-100 whitespace-nowrap">
      <tr>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Customer Name
        </th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
     Service
        </th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Order Details
        </th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Payment
        </th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Booking Date
        </th>
        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Actions
        </th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200 whitespace-nowrap">
    {todaylaundryorder && todaylaundryorder.length === 0 && (
  <tr>
    <td colSpan="6" className="px-6 py-4 text-center text-[#333]">
      Today, there are no orders.
    </td>
  </tr>
)}


    {todaylaundryorder && todaylaundryorder.map(booking => (
      <tr key={booking.id} >
        <td class="px-6 py-4 text-sm text-[#333]">
        {booking.firstName} {booking.lastName}
        </td>
        <td class="px-6 py-4 text-sm text-[#333]">
        {booking.Service}
        </td>
        <td class="px-6 py-4 text-sm text-[#333]">
        <div>
                    <p>No. of Garments: {booking.Noofgarment}</p>
                    <p>Tenure: {booking.selectedTenure}</p>
                    <p>Price: {booking.totalpayment}</p>
                </div>
        
        </td>
        <td class="px-6 py-4 text-sm text-[#333]">
        {booking.Payment}
        </td>
        <td class="px-6 py-4 text-sm text-[#333]">
        {booking.bookingDate instanceof Object ? (
    // If bookingDate is an object, extract checkIn or checkOut
    <>
        <p>Check In: {booking.bookingDate.checkIn}</p>
        {booking.bookingDate.checkOut ? (
            <p>Check Out: {booking.bookingDate.checkOut}</p>
  ) : null}
    </>
) : (
    // If bookingDate is a string, display it directly
    <p>{booking.bookingDate}</p>
)}

        </td>
        <td class="px-6 py-4 text-sm text-[#333]">
        {booking.GarmentTypes ? (
                                                                        <Link href={`/Admin/adminarenelaundrydetails?orderId=${booking.orderId}`}>
                                                                            <a className="bg-blue-500 text-white px-2 py-1 rounded">
                                                                                View Details
                                                                            </a>
                                                                        </Link>
                                                                    ) : (
                                                                        <Link href={`/Admin/adminarenelaundrydetails?orderId=${booking.orderId}`}>
                                                                            <a className="bg-blue-500 text-white px-2 py-1 rounded">
                                                                                Booking Details
                                                                            </a>
                                                                        </Link>
                                                                    )}
                                                                    {/* <button onClick={() => openModal(booking)} className="bg-blue-500 ml-4 text-white px-2 py-1 rounded">
                                                                                Update Orders Delivery
                                                                            </button> */}
        </td>
       
      </tr>
    ))}
    </tbody>
  </table>
              </div>
            </div>
           
          </div>
        </div>
      </div>
      )}
      </div>
    </div>
  );
};
export default Dashbord;