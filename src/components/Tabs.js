import { City, Country, State } from "country-state-city";
import { useEffect, useState,useRef } from "react";
import { useRouter } from 'next/router';
import { FaShoppingCart, FaHome, FaBuilding, FaHotel } from 'react-icons/fa';
import Selector from "./Selector";
import Laundryservices from "./Laundryservices";
import Cloudkitchen from "../../pages/CloudKitchen";
import PGServices from "./PGServices";
import RentServices from "./RentServices";
import BuyProperty from "./BuyProperty";
import HotelServices from "./HotelServices";
const TabsComponent = ({ items,addToCart }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const firstBtnRef = useRef(null); // Initialize the ref with null

  useEffect(() => {
    // Check if the reference exists before calling focus
    if (firstBtnRef.current) {
      firstBtnRef.current.focus();
    }
  }, []);

  const router = useRouter();

  const tabIcons = [
    <FaHome size={24} />,
    <FaHome size={24} />,
    <FaBuilding size={24} />,
    <FaHotel size={24} />,
  ];



  
  return (
    <div className='flex justify-center  items-center '>
      <div className='max-w-full  flex flex-col gap-y-2 w-full'>
      <div className='grid grid-cols-2 gap-4 gap-x-16  px-6 md:grid-cols-6 px-8 md:-mt-12 -mt-12 '>
        {items.map((item, index) => (
          <div key={index} className="flex flex-col  items-center">
            <button
              onClick={() => setSelectedTab(index)}
              className={`outline-none w-36 md:w-48  h-16 md:p-0 p-2 rounded-xl  flex items-center justify-center ${
                selectedTab === index ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-white'
              }`}
            >
              {tabIcons[index]}
              <span className="ml-2 text-white md:text-lg text-sm font-bold">{item.title}</span>
            </button>
            <div className={` hidden md:block w-10 h-4 ${selectedTab === index ? 'bg-emerald-500' : 'bg-transparent'}`}></div>
          </div>
        ))}
      </div>

        <div className=" px-2 md:px-0">
          {items.map((item, index) => (
            <div key={index} className={`${selectedTab === index ? '' : 'hidden'}`}>
              {index === 0 && (
              <PGServices/>
              )}
              {index === 1 && (
                     <RentServices/>
              )}
              {index === 2 && (
                 <BuyProperty/>
              )}
              {index === 3 && (
                  <div className=" md:-mt-2 max-w-8xl bg-white mx-auto p-4 border-4 border-emerald-500  rounded-lg shadow-md flex flex-col md:flex-row">
                <HotelServices/>
            </div>
              )}
              {index === 4 && (
                 <Laundryservices/>
              )}
              {index === 5 && (
                 <Cloudkitchen/>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TabsPage = () => {
  return (
    <div className='rounded-lg mx-4 p-4'>
      {/* Tabs Component */}
      <TabsComponent items={items} />
    </div>
  );
};

export default TabsPage;

const items = [
    { title: 'Search PG' },
    { title: 'Rent Property' },
    { title: 'Buy Property' },
    { title: 'Hotel' },
    { title: 'Laundry' },
    { title: 'Cloud Kitchen' },
  ];
