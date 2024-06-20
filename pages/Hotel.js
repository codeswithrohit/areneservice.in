import React,{useState,useEffect} from 'react'
import Link from 'next/link';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaCamera, FaHeart, FaStar, FaBed, FaBath, FaHome, FaSms, FaPhone,FaMapMarkerAlt  } from 'react-icons/fa';
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


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace 'yourCollectionName' with the actual collection name
        const collectionRef = firebase.firestore().collection('Hoteldetail').where('Verified', '==', 'true');
  
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
  
 const onViewMapClick = (location) => {
  window.open(`https://www.google.com/maps/search/?api=1&query=${location}`, '_blank');
};
  return (
    <div className="px-8 min-h-screen ">
    <Head>
      <script
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyB6gEq59Ly20DUl7dEhHW9KgnaZy4HrkqQ&libraries=places`}
        async
        defer
      ></script>
    </Head>
    <p className=" text-xs leading-4 text-gray-600 font-normal mt-32 md:mt-16 ">Experience luxury and comfort like never before with Arene Services' exceptional hotel services in collaboration with top-tier hotels. We pride ourselves on delivering superior customer satisfaction and unmatched quality to ensure a memorable stay for our guests.
Arene Services partners with renowned hotels known for their exquisite amenities, impeccable service, and stunning locations. Whether you are traveling for business or leisure, our curated selection of hotels caters to every need and preference, promising a stay that exceeds expectations.</p>
  
    {loading ? ( // Show spinner while loading
      <div class="flex min-h-screen justify-center items-center">
      <img class="w-20 h-20 animate-spin" src="https://www.svgrepo.com/show/70469/loading.svg" alt="Loading icon"/>
  </div>
    ) : (
      filteredData.map((item, index) => (
        <div key={item.id} className="w-full  p-4 bg-gray-100 dark:bg-gray-800 border-gray-800 shadow-md hover:shodow-lg rounded-md">
          <div className="flex-none lg:flex">
            <div className="h-48 w-full lg:h-32 lg:w-32 rounded-md lg:mb-0 mb-3">
              <img
                src={item.imgSrc}
                alt="Pet images"
                className="w-full h-full lg:object-cover rounded-md"
                style={{ objectFit: 'cover' }} 
              />
            </div>
            <div className="flex-auto lg:ml-3 justify-evenly py-2">
            <div className="absolute  right-16">
              <button onClick={() => onViewMapClick(item.location)} className="text-gray-500 flex hover:text-emerald-500">
                <FaMapMarkerAlt className='mr-2' /> View On Map
              </button>
              </div>
              <div className="flex flex-col ">
                <div className="flex items-center mr-auto text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                  <p className="font-normal text-gray-500">4.5</p>
                </div>
                <div className="flex items-center  justify-between min-w-0">
                  <h2 className="mr-auto text-red-600  text-base capitalize font-medium truncate">{item.HotelName}</h2>
                </div>
                <p className="flex capitalize items-center text-xs text-gray-400">{item.location}. {item.distance} <span className="relative inline-flex rounded-md shadow-sm ml-2"><span className="flex absolute h-2 w-2 top-0 right-0 -mt-1 -mr-1"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span></span></span></p>
              </div>
              
              <div className="flex my-3 border-t border-gray-300 dark:border-gray-600 "></div>
              <div className="flex space-x-3 text-sm font-medium">
                <div className=" items-center bg-white p-2 rounded-lg justify-center flex gap-1 font-medium text-[#10b981] dark:text-[#10b981]">
                {item.roomTypes && item.roomTypes.map((property, i) => (
  <div key={i}>
    <p className='text-emerald-500'>{property.type}-{property.price}/Month |</p>
  </div>
))}

                </div>
                <Link href={`/hoteldetail?id=${item.id}`} passHref>
  <button className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-full transition duration-300 ease-in-out">
    View Details
  </button>
</Link>



              </div>
            </div>
          </div>
        </div>
      ))
      
    )}
    
  
  </div>
  )
}

export default Buy