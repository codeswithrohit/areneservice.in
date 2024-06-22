import React,{useState,useEffect} from 'react'
import Link from 'next/link';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaCamera, FaHeart, FaStar, FaBed, FaBath, FaHome, FaSms, FaPhone } from 'react-icons/fa';
import { FaPersonCircleCheck } from 'react-icons/fa6';
import { useRouter } from 'next/router';
import { firebase } from '../Firebase/config';
import 'firebase/firestore';
import 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
const Buy = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [flatTypeFilter, setFlatTypeFilter] = useState('');
  const [fetchedData, setFetchedData] = useState([]);
  const [priceRangeFilter, setPriceRangeFilter] = useState('');
  // Extracting the parameters from the URL query
  const { location, category, nearestLocation } = router.query;
  const [buydata, setBuyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        fetchUserData(authUser.uid);
      } else {
        setUser(null);
        setUserData(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid) => {
    try {
      const userDoc = await firebase
        .firestore()
        .collection("Users")
        .doc(uid)
        .get();
      if (userDoc.exists) {
        const fetchedUserData = userDoc.data();
        setUserData(fetchedUserData);
        setMobileNumber(fetchedUserData?.mobileNumber || "");
        setAddress(fetchedUserData?.address || "");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };
console.log(userData)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace 'yourCollectionName' with the actual collection name
        const collectionRef = firebase.firestore().collection('buydetail').where('subcat', '==', category).where('Verified', '==', 'true');
  
        // Get all documents from the collection
        const querySnapshot = await collectionRef.get();
  
        // Extract the data from the documents along with document IDs
        const data = querySnapshot.docs.map((doc) => {
          const userData = doc.data();
          return {
            id: doc.id, // Add document ID to the data
            ...userData,
            distance: null, // Initially set distance as null
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
  }, [location, category]);
  
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

  // Filter fetchedData based on distances less than 15 km
  const filteredData = fetchedData.filter(item => parseFloat(item.distance) < parseFloat(nearestLocation));

 console.log(filteredData)
  
  
  return (
    <div className="px-8 min-h-screen ">
    <Head>
      <script
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyB6gEq59Ly20DUl7dEhHW9KgnaZy4HrkqQ&libraries=places`}
        async
        defer
      ></script>
    </Head>
    <p className=" text-xs leading-4 text-gray-600 font-normal mt-32 md:mt-16">Arene Services offers a comprehensive buy and sell service that simplifies the process of property transactions for our clients. Whether you are looking to buy your dream home or sell a property, Arene Services is your trusted partner in the real estate market.
Our dedicated team of professionals is committed to providing a seamless and transparent experience for buyers and sellers alike. With Arene Services, you can expect personalized assistance, expert guidance, and access to a wide range of properties to suit your preferences and budget.
When you choose Arene Services for your buy or sell needs, you benefit from our extensive network, market knowledge, and negotiation skills that ensure a successful and satisfactory transaction. We handle all aspects of the buying and selling process, from property valuation and listing to showcasing properties and facilitating negotiations.
Whether you are a first-time buyer or a seasoned investor, Arene Services is here to make your property buying or selling journey smooth, efficient, and rewarding. Trust Arene Services for all your real estate needs and let us help you achieve your property goals with confidence.</p>
  
<div className="grid px-8 mt-4 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
      filteredData.length === 0 ? (
        <div className="flex justify-center items-center">
          <p className="text-2xl text-gray-600">No Data</p>
        </div>
      ) : (
        filteredData
          .sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance)) // Sort data based on distance
          .map((item, index) => (
        <div key={item.id} className="w-full bg-gray-100 dark:bg-gray-800 border-gray-800 shadow-md hover:shadow-lg rounded-md">
            <Link href={`/listing-details-2?id=${item.id}`}>
          <div className="flex-none lg:flex-col">
          <Carousel showThumbs={false} autoPlay>
            {item.imgSrc.map((src, idx) => (
              <div key={idx} className="h-full w-full lg:h-64 lg:w-full rounded-md lg:mb-0 mb-3">
                <img src={src} alt={`Image ${idx}`} className="w-full h-64 object-contain rounded-md" />
              </div>
            ))}
          </Carousel>
            <div className="flex-auto mt-4 px-6 lg:ml-3 justify-evenly py-2">
              <div className="flex flex-col">
                <div className="flex items-center mr-auto text-sm">
                  <FaStar size={16} className='stroke-yellow-500 fill-yellow-500' />  {/* Use the imported Star icon */}
                  <p className="font-normal text-gray-500">5</p>
                </div>
                <div className="flex items-center justify-between min-w-0">
                  <h2 className="mr-auto text-blue-600 text-base capitalize font-medium truncate">{item.Propertyname}</h2>
                </div>
                <p className="flex capitalize items-center text-xs text-gray-400">
                {item.location.split(',')[item.location.split(',').length - 4]},{item.location.split(',')[item.location.split(',').length - 3]}, {item.location.split(',')[item.location.split(',').length - 2]}, {item.location.split(',')[item.location.split(',').length - 1]},{item.distance}
                  <span className="relative inline-flex rounded-md shadow-sm ml-2">
                    <span className="flex absolute h-2 w-2 top-0 right-0 -mt-1 -mr-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                  </span>
                </p>
                <div className=" flex flex-col  font-medium text-gray-700 dark:text-gray-100">
            

{item.propertytypes.map((property, i) => (
                    <div key={i}>
                          <span className="price text-xs font-bold">{i + 1}. {property.type} - {property.price}</span>
                    </div>
                  ))}
                  {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg> */}
                 
                </div>
              </div>
              <div className="flex my-3 border-t border-gray-300 dark:border-gray-600"></div>
              <div className="flex items-center justify-center space-x-3 text-sm font-medium">
               
                <button className="mb-2 md:mb-0 flex-no-shrink bg-blue-400 hover:bg-blue-500 px-5 py-2 text-xs shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-blue-300 hover:border-blue-500 text-white rounded-full transition ease-in duration-300" type="button" aria-label="like">
                  Book Now
                </button>
              </div>
            </div>
          </div>
          </Link>
        </div>
       ))
      )
    )}
    </div>
    
  
  </div>
  )
}

export default Buy