import React,{useState,useEffect,Fragment} from 'react'
import Link from 'next/link';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaCamera, FaHeart, FaStar, FaBed, FaBath, FaHome, FaSms, FaPhone,FaCar,FaUtensils } from 'react-icons/fa';
import { FaPersonCircleCheck } from 'react-icons/fa6';
import { useRouter } from 'next/router';
import { firebase } from '../Firebase/config';
import 'firebase/firestore';
import 'firebase/storage';
import Layout from "../src/layouts/Layout";
import Head from 'next/head';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const LaundryPage = ({addToCart}) => {
  const router = useRouter(); // Initialize the router
 
  const { location,services,subservices,nearestLocation } = router.query;
  const [loading, setLoading] = useState(true);
  const [fetchedData, setFetchedData] = useState([]);
 console.log(location,services,nearestLocation)
 useEffect(() => {
  const fetchData = async () => {
    try {
      // Replace 'yourCollectionName' with the actual collection name
      const collectionRef = firebase.firestore().collection('Laundry');

      // Get all documents from the collection
      const querySnapshot = await collectionRef.get();

      // Extract the data from the documents along with document IDs
      const data = querySnapshot.docs.map((doc) => {
        const userData = doc.data();
        return {
          id: doc.id, // Add document ID to the data
          ...userData,
          distance: null, // Initially set distance as null
          selectedTenure: '',
        };
      });

      // Set the fetched data to the state
      setFetchedData(data);

      // Calculate distances for each item
      const distances = await Promise.all(
        data.map(async (item) => {
          const formattedDistance = await calculateDistance(location, item.location);
          console.log(formattedDistance);
          return formattedDistance;
        })
      );

      // Update the distances in fetchedData
      const updatedData = data.map((item, index) => ({
        ...item,
        distance: distances[index],
      }));

      // Set the updated fetched data to the state
      setFetchedData(updatedData);
      setLoading(false); // Set loading to false after data is fetched
    } catch (error) {
      console.error('Error fetching data:', error);
    
      setLoading(false); // Set loading to false in case of error
    }
  };

  fetchData(); // Call the function to fetch data
}, []);

const calculateDistance = (location1, location2) => {
  return new Promise((resolve, reject) => {
    if (location1.trim() !== '' && location2.trim() !== '') {
      const service = new window.google.maps.DistanceMatrixService();
      service.getDistanceMatrix(
        {
          origins: [location1],
          destinations: [location2],
          travelMode: 'DRIVING',
        },
        (response, status) => {
          if (status === 'OK' && response.rows && response.rows.length > 0 && response.rows[0].elements && response.rows[0].elements.length > 0) {
            const { distance } = response.rows[0].elements[0];
            if (distance) {
              const distanceValue = distance.value; // Distance in meters
              const distanceKm = distanceValue / 1000; // Convert distance to kilometers
              const formattedDistance = `${distance.text}`; // Construct the desired format
              console.log('Distance:', formattedDistance);
              resolve(formattedDistance);
            }
          } else {
            console.log('Error:', status);
            reject(null);
          }
        }
      );
    } else {
      console.log('Please enter both locations.');
      reject(null);
    }
  });
};







const onViewMapClick = (location) => {
window.open(`https://www.google.com/maps/search/?api=1&query=${location}`, '_blank');
};
const handleTenureChange = (e, id) => {
  // Function to handle tenure change
  const { value } = e.target;
  setFetchedData((prevData) =>
    prevData.map((item) =>
      item.id === id
        ? {
            ...item,
            selectedTenure: value,
          }
        : item
    )
  );
};
  return (
    <Fragment>
      <Head>
        <title>{router.query.title || 'Laundry Page'}</title>
      </Head>
      <div className="flex flex-wrap justify-center">
        <div className=" p-16 bg-white grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {loading ? ( // Show spinner while loading
    <div className="flex justify-center items-center h-screen">
    <button type="button"
      className="px-6 py-2.5 rounded-full text-white text-sm tracking-wider font-semibold border-none outline-none bg-[#43d3b0] hover:bg-orange-700 active:bg-[#43d3b0]">
      Loading
      <svg xmlns="http://www.w3.org/2000/svg" width="18px" fill="#fff" className="ml-2 inline animate-spin" viewBox="0 0 24 24">
        <path fillRule="evenodd"
          d="M7.03 2.757a1 1 0 0 1 1.213-.727l4 1a1 1 0 0 1 .59 1.525l-2 3a1 1 0 0 1-1.665-1.11l.755-1.132a7.003 7.003 0 0 0-2.735 11.77 1 1 0 0 1-1.376 1.453A8.978 8.978 0 0 1 3 12a9 9 0 0 1 4.874-8l-.117-.03a1 1 0 0 1-.727-1.213zm10.092 3.017a1 1 0 0 1 1.414.038A8.973 8.973 0 0 1 21 12a9 9 0 0 1-5.068 8.098 1 1 0 0 1-.707 1.864l-3.5-1a1 1 0 0 1-.557-1.517l2-3a1 1 0 0 1 1.664 1.11l-.755 1.132a7.003 7.003 0 0 0 3.006-11.5 1 1 0 0 1 .039-1.413z"
          clipRule="evenodd" data-original="#000000" />
      </svg> {/* You can replace this with any loading spinner component or element */}
    </button>
  </div>
    ) : (
      fetchedData.map((item, index) => (
        <div key={item.id} className="w-full mt-32 md:mt-16 p-4 bg-gray-100 dark:bg-gray-800 border-gray-800 shadow-md hover:shodow-lg rounded-md">
          <div className="flex-none lg:flex">
           
            <div className="flex-auto lg:ml-3 justify-evenly py-2">
          
              <div className="flex flex-col ">
              <div className="flex items-center  justify-between min-w-0">
                  <h2 className="mr-auto text-red-600  text-base capitalize font-bold truncate">{item.service}</h2>

                </div>

              </div>
              
              <div className="flex my-3 border-t border-gray-300 dark:border-gray-600 "></div>
              <div className="flex-col space-y-3 text-sm font-medium">
              <div className="items-center bg-white p-2 rounded-lg justify-center flex gap-1 font-medium text-[#10b981] dark:text-[#10b981]">
                        <select value={item.selectedTenure} onChange={(e) => handleTenureChange(e, item.id)} className="outline-none">
                          <option value="">Select Your Tenure Period</option>
                          {item.GarmentTypes && item.GarmentTypes.map((property, i) => (
                            <option key={i} value={property.tenure}>{property.tenure}-{property.noofgarments} Garments -₹ {property.price} </option>
                          ))}
                        </select>
                      </div>
                      {item.selectedTenure && (
                        <div>
                          {item.GarmentTypes && item.GarmentTypes.filter(property => property.tenure === item.selectedTenure).map((filteredProperty, index) => (
                            <div key={index}>
                                           <h2 className="mr-auto text-red-600  text-base capitalize font-bold truncate">{filteredProperty.noofgarments} Garments</h2>
                                           <h2 className="mr-auto text-red-600  text-base capitalize font-bold truncate">Per Piece Price: ₹ {(parseFloat(filteredProperty.price) / parseFloat(filteredProperty.noofgarments)).toFixed(4)}</h2>
                                           <h2 className="mr-auto text-red-600  text-base capitalize font-bold truncate">₹ {filteredProperty.price} </h2>

                            </div>
                          ))}
                        </div>
                      )}


<div className="flex justify-center">
  <Link href={{
      pathname: '/laundrycheckout',
      query: {
        Vendor:item.vendor,
        Location:item.location,
        DeliverLocation:location,
        service: item.service,
        Agentid: item.AgentId,
        selectedTenure: item.selectedTenure,
        GarmentTypes: JSON.stringify(item.GarmentTypes.filter(property => property.tenure === item.selectedTenure))
      }
    }} passHref>
    <button className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-full transition duration-300 ease-in-out">
      Select Package
    </button>
  </Link>
</div>




              </div>
            </div>
          </div>
        </div>
      ))
      
    )}
     </div>
     </div>
    </Fragment>
  );
};

export default LaundryPage;
