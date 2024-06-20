import React,{useState,useEffect} from 'react'
import Link from 'next/link';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaCamera, FaHeart, FaStar, FaBed, FaBath, FaHome, FaSms, FaPhone,FaMapMarkerAlt  } from 'react-icons/fa';
import { FaPersonCircleCheck } from 'react-icons/fa6';
import { useRouter } from 'next/router';
import { firebase } from '../../../Firebase/config';
import 'firebase/firestore';
import 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
const BUYPROPERTY = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [flatTypeFilter, setFlatTypeFilter] = useState('');
  const [fetchedData, setFetchedData] = useState([]);
  const [priceRangeFilter, setPriceRangeFilter] = useState('');
  // Extracting the parameters from the URL query
  const [buydata, setBuyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);

          // Fetch location name using reverse geocoding
          fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyB6gEq59Ly20DUl7dEhHW9KgnaZy4HrkqQ`)
            .then(response => response.json())
            .then(data => {
              if (data.results && data.results.length > 0) {
                // Extracting more specific address components
                const addressComponents = data.results[0].address_components;
                const cityName = addressComponents.find(component => component.types.includes('locality'));
                const stateName = addressComponents.find(component => component.types.includes('administrative_area_level_1'));
                const countryName = addressComponents.find(component => component.types.includes('country'));

                // Constructing a more detailed location name
                const detailedLocation = [cityName, stateName, countryName]
                  .filter(component => component !== undefined)
                  .map(component => component.long_name)
                  .join(', ');

                setLocation(detailedLocation);
              } else {
                setLocation("Location not found");
              }
            })
            .catch(error => {
              console.error('Error fetching location:', error);
              setLocation("Error fetching location");
            });
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace 'yourCollectionName' with the actual collection name
        const collectionRef = firebase.firestore().collection('buydetail').where('Verified', '==', 'true');
  
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
  }, [location]);
  
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
  const filteredData = fetchedData.filter(item => parseFloat(item.distance) < parseFloat("5000"));

 console.log(filteredData)
  
 const onViewMapClick = (location) => {
  window.open(`https://www.google.com/maps/search/?api=1&query=${location}`, '_blank');
};

  return (
    <div>
      <Head>
      <script
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyB6gEq59Ly20DUl7dEhHW9KgnaZy4HrkqQ&libraries=places`}
        async
        defer
      ></script>
    </Head>

    <div className='mt-16' >
    <div className="flex items-center justify-center gap-5 uppercase text-[#43d3b0]  text-sm lg:text-xl font-semibold mt-10">
<div className="w-6 lg:w-12 h-0.5 lg:h-1.5 rounded-full bg-[#43d3b0] ">
</div   >Nearest BUY Property<div className="w-6 lg:w-12 h-0.5 lg:h-1.5 rounded-full bg-[#43d3b0]">
</div>
</div>
   
    
    <div className="grid px-8 mt-4 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {loading ? ( // Show spinner while loading
      <div className="flex justify-center items-center">
        <img className="w-20 h-20 animate-spin" src="https://www.svgrepo.com/show/70469/loading.svg" alt="Loading icon"/>
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
    <div
    class="fter:h-px  flex items-center mt-4 before:h-px before:flex-1  before:bg-emerald-500 before:content-[''] after:h-px after:flex-1 after:bg-emerald-500  after:content-['']">
    <a href="/Allbuy"
        class="flex items-center rounded-full border border-gray-300 bg-secondary-50 px-3 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="mr-1 h-4 w-4">
            <path fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clip-rule="evenodd" />
        </svg>
        View More Property
    </a>
</div>
    </div>
  );
}

export default BUYPROPERTY;
