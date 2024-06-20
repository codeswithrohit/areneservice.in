import { useEffect, useState,useRef } from "react";
import { useRouter } from 'next/router';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
const placesLibrary = ['places'];
const HomePage = () => {
  const router = useRouter();
  const [Location, setLocation] = useState('');
  const [activeTab, setActiveTab] = useState('pg');
  const [category, setCategory] = useState('');
  const handleTabClick = (tab) => {
    setActiveTab(tab);


    
  };


  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const imageList = [
   
    {
      id: 1,
      imageUrl: "slidera.gif",
    },
    {
      id: 2,
      imageUrl: "sliderb.gif",
    },
    {
      id: 3,
      imageUrl: "sliderc.gif",
    },
    {
      id: 3,
      imageUrl: "sliderd.gif",
    },
    {
      id: 3,
      imageUrl: "slidere.gif",
    },
    {
      id: 3,
      imageUrl: "sliderf.gif",
    },
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === imageList.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change the interval as needed

    return () => clearInterval(intervalId);
  }, [currentImageIndex]);

 
 
  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };


  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locations, setLocations] = useState(null);

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

                setLocations(detailedLocation);
              } else {
                setLocations("Location not found");
              }
            })
            .catch(error => {
              console.error('Error fetching location:', error);
              setLocations("Error fetching location");
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
  const [nearestLocation, setNearestLocation] = useState('');
  const [services, setServices] = useState('');
  const [subservices, setSubservices] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0); 
  const images = [
    "https://www.easiui.com/hero-section/image/hero17.png",
  ];

  // Function to handle automatic image slider
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(intervalId);
  }, [images.length]);
  const handleNearestLocationChange = (e) => {
   setNearestLocation(e.target.value);
 };
  const handleServiceChange = (e) => {
   setServices(e.target.value);
 };
  const handleSubsevicesChange = (e) => {
   setSubservices(e.target.value);
 };
  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setCategory(selectedCategory);
    console.log('Selected Category:', selectedCategory);
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyB6gEq59Ly20DUl7dEhHW9KgnaZy4HrkqQ',
    libraries: placesLibrary,
  });
 

  const autocompleteRef = useRef();



  const onLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };
  




  const onPlaceChanged = () => {
    const autocomplete = autocompleteRef.current;
  
    if (autocomplete && autocomplete.getPlace) {
      const place = autocomplete.getPlace();
  
      if (place && place.formatted_address) {
        setLocation(place.formatted_address); // Update to set the full formatted address
      }
    }
  };
  if (!isLoaded) {
    return (
      <div className='flex min-h-screen justify-center item-center'>
      <h1>Loading...</h1>
      </div>
    );
  }

  const buyData = ['Buy Category', 'Appartment', 'Builder Floor','Villas',,'Land','Shop/Showroom','Office Space','Other Properties'];
  const handleBuySearch = () => {
    // Redirect to the detail page with the parameters
    router.push(`/Buy?category=${category}&location=${Location}&nearestLocation=${nearestLocation}`);
  };


  const pgData = ['PG Category', 'Boys', 'Girls'];
  const handlePGSearch = () => {
    // Redirect to the detail page with the parameters
    router.push(`/pg?category=${category}&location=${Location}&nearestLocation=${nearestLocation}`);
  };


  const rentData = ['Rent Category', 'Appartment', 'Builder Floor','Shop/Showroom','Office Space','Other Properties'];
  const handleRentSearch = () => {
    // Redirect to the detail page with the parameters
    router.push(`/Rent?category=${category}&location=${Location}&nearestLocation=${nearestLocation}`);
  };


  const handleHotelSearch = () => {
    // Redirect to the detail page with the parameters
    router.push(`/Hotel?location=${Location}&nearestLocation=${nearestLocation}`);
  };
  const handleBanqueetHallSearch = () => {
    // Redirect to the detail page with the parameters
    router.push(`/BanqueetHall?location=${Location}&nearestLocation=${nearestLocation}`);
  };
  const handleResortSearch = () => {
    // Redirect to the detail page with the parameters
    router.push(`/Resort?location=${Location}&nearestLocation=${nearestLocation}`);
  };
  const handleLaundrySearch = () => {
    const nearestLocation = 10; // Setting nearestLocation to 10
    // Redirect to the detail page with the parameters
    router.push(`/Laundry?location=${Location}&nearestLocation=${nearestLocation}&services=${services}`);
  };
  const handleCloudKitchenSearch = () => {
    const nearestLocation = 10; // Setting nearestLocation to 10
    // Redirect to the detail page with the parameters
    router.push(`/CloudKitchen?location=${Location}&nearestLocation=${nearestLocation}&services=${services}`);
  };

  
  return (
    <div  >
         <div  className=" bg-white px-2 mb-8 md:mt-12 mt-32">
       
        {/* Left Column - Image Slider */}
        {/* <div  >
          <div className="lg:pr-1   lg:py-4 ">
            <img src={imageList[currentImageIndex].imageUrl} className="h-full w-full object-cover rounded-xl" alt={`Slider Image ${currentImageIndex + 1}`} />
          </div>
        </div>
        <div className="flex justify-center -mt-8 lg:-mt-16">
          {imageList.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 lg:w-4 lg:h-4 mx-1 rounded-full cursor-pointer ${index === currentImageIndex ? 'bg-white' : 'bg-gray-300'}`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div> */}
      </div>

      <div className="relative min-h-[430px] mt-1">
  <video
    className="absolute top-0 left-0 w-full h-full object-cover"
    style={{ objectFit: 'fill' }} // Ensures the video covers the entire area without being cut off
    src="home2.mp4"
    autoPlay
    loop
    muted
  />
  
  <div className="relative z-10 hero-content__container flex flex-col  container mx-auto px-2 md:px-4">
    <div className="flex items-start justify-start gap-5">
      <button className="flex items-center rounded-full h-10 px-3 text-red-600 font-bold capitalize border-2 border-white hover:scale-95 transition-all duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide mr-4 text-red-600 font-bold lucide-map-pin">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <span className="sr-only">Location Icon</span>
        {locations}
      </button>
    </div>
    <div className="hero-content__text py-4">
      <h3 className="text-4xl text-center text-white font-medium">
        Discover your perfect stay around the globe
      </h3>
    </div>
    
      <section className="relative w-full h-full  mb-4">
   
      <div className="w-full h-32 rounded-5xl md:px-32  ">


        
      <div className="md:h-10 h-16 grid grid-cols-4 md:grid-cols-8 w-full gap-0">
  <button
    className={`flex items-center justify-center text-sm border border-gray-300 ${
      activeTab === 'pg' ? 'bg-emerald-500 text-white font-bold text-md border-emerald-500' : 'font-bold text-sm bg-neutral-100 border-gray-300'
    }`}
    onClick={() => handleTabClick('pg')}
  >
    ARENE PG
  </button>
  <button
    className={`flex items-center justify-center text-sm border border-gray-300 ${
      activeTab === 'buy' ? 'bg-emerald-500 text-white font-bold text-xs border-emerald-500' : 'font-semibold text-xs bg-neutral-100 border-gray-300'
    }`}
    onClick={() => handleTabClick('buy')}
  >
    Buy
  </button>
  <button
    className={`flex items-center justify-center text-sm border border-gray-300 ${
      activeTab === 'rent' ? 'bg-emerald-500 text-white font-bold text-xs border-emerald-500' : 'font-semibold text-xs bg-neutral-100 border-gray-300'
    }`}
    onClick={() => handleTabClick('rent')}
  >
    Rent
  </button>
  <button
    className={`flex items-center justify-center text-sm border border-gray-300 ${
      activeTab === 'hotel' ? 'bg-emerald-500 text-white font-bold text-xs border-emerald-500' : 'font-semibold text-xs bg-neutral-100 border-gray-300'
    }`}
    onClick={() => handleTabClick('hotel')}
  >
    Hotel
  </button>
  <button
    className={`flex items-center justify-center text-xs border border-gray-300 ${
      activeTab === 'BanqueetHall' ? 'bg-emerald-500 text-white font-bold text-xs border-emerald-500' : 'font-semibold text-xs bg-neutral-100 border-gray-300'
    }`}
    onClick={() => handleTabClick('BanqueetHall')}
  >
    Banquet Hall
  </button>
  <button
    className={`flex items-center justify-center text-sm border border-gray-300 ${
      activeTab === 'Resort' ? 'bg-emerald-500 text-white font-bold text-xs border-emerald-500' : 'font-semibold text-xs bg-neutral-100 border-gray-300'
    }`}
    onClick={() => handleTabClick('Resort')}
  >
    Resort
  </button>
  <button
    className={`flex items-center justify-center text-sm border border-gray-300 ${
      activeTab === 'Laundry' ? 'bg-emerald-500 text-white font-bold text-xs border-emerald-500' : 'font-semibold text-xs bg-neutral-100 border-gray-300'
    }`}
    onClick={() => handleTabClick('Laundry')}
  >
    Arene Laundry
  </button>
  <button
    className={`flex items-center justify-center text-xs border border-gray-300 ${
      activeTab === 'CloudKitchen' ? 'bg-emerald-500 text-white font-bold text-xs border-emerald-500' : 'font-semibold text-xs bg-neutral-100 border-gray-300'
    }`}
    onClick={() => handleTabClick('CloudKitchen')}
  >
    Arene Chef
  </button>
</div>









      <div className="h-20 bg-white rounded-b-sm shadow-md lg:px-5 py-3 grid grid-cols-3 gap-5">
     
        {activeTab === 'pg' && (
         <>
         <div className="h-full w-full">
           <select value={category} onChange={handleCategoryChange} name="" id="" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs">
           {pgData.map((categoryOption, index) => (
             <option key={index} value={categoryOption}>
             {categoryOption}
             </option>
           ))}
           </select>
         </div>
         <div className="h-full w-full">
           <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
           <input   value={Location} name="Location" placeholder="Search location"
 onChange={(e) => setLocation(e.target.value)} className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs" type="text" />
           </Autocomplete>
         </div>
         <div className="h-full w-full">
           <select  value={nearestLocation}
       onChange={handleNearestLocationChange} name="" id="" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs">
          <option value="" disabled selected>
         Nearest location
       </option>
            <option value="2">Nearest 2 Km</option>
       <option value="4">Nearest 4 Km</option>
       <option value="6">Nearest 6 Km</option>
       <option value="8">Nearest 8 Km</option>
       <option value="10">Nearest 10 Km</option>
           </select>
         </div>
         <button  onClick={handlePGSearch} className="text-white bg-emerald-500 font-bold text-xs  px-5 py-1 h-10 col-span-3">Search</button>
         
       </>
        )}
        {activeTab === 'buy' && (
          <>
            <div className="h-full w-full">
              <select value={category} onChange={handleCategoryChange} name="" id="" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs">
              {buyData.map((categoryOption, index) => (
                <option key={index} value={categoryOption}>
                {categoryOption}
                </option>
              ))}
              </select>
            </div>
            <div className="h-full w-full">
              <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
              <input   value={Location} name="Location" placeholder="Search location"
    onChange={(e) => setLocation(e.target.value)} className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs" type="text" />
              </Autocomplete>
            </div>
            <div className="h-full w-full">
              <select  value={nearestLocation}
          onChange={handleNearestLocationChange} name="" id="" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs">
             <option value="" disabled selected>
            Nearest location
          </option>
               <option value="2">Nearest 2 Km</option>
          <option value="4">Nearest 4 Km</option>
          <option value="6">Nearest 6 Km</option>
          <option value="8">Nearest 8 Km</option>
          <option value="10">Nearest 10 Km</option>
              </select>
            </div>
            <button  onClick={handleBuySearch} className="text-white  bg-emerald-500 font-bold text-xs  px-5 py-1 h-10 col-span-3">Search</button>
          </>
        )}
        {activeTab === 'rent' && (
          <>
          <div className="h-full w-full">
            <select value={category} onChange={handleCategoryChange} name="" id="" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs">
            {rentData.map((categoryOption, index) => (
              <option key={index} value={categoryOption}>
              {categoryOption}
              </option>
            ))}
            </select>
          </div>
          <div className="h-full w-full">
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <input   value={Location} name="Location" placeholder="Search location"
  onChange={(e) => setLocation(e.target.value)} className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs" type="text" />
            </Autocomplete>
          </div>
          <div className="h-full w-full">
            <select  value={nearestLocation}
        onChange={handleNearestLocationChange} name="" id="" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs">
           <option value="" disabled selected>
          Nearest location
        </option>
             <option value="2">Nearest 2 Km</option>
        <option value="4">Nearest 4 Km</option>
        <option value="6">Nearest 6 Km</option>
        <option value="8">Nearest 8 Km</option>
        <option value="10">Nearest 10 Km</option>
            </select>
          </div>
          <button  onClick={handleRentSearch} className="text-white  bg-emerald-500 font-bold text-xs  px-5 py-1 h-10 col-span-3">Search</button>
        </>
        )}
        {activeTab === 'hotel' && (
            <>
           
            <div className="h-full w-full">
              <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
              <input   value={Location} name="Location" placeholder="Search location"
    onChange={(e) => setLocation(e.target.value)} className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs" type="text" />
              </Autocomplete>
            </div>
            <div className="h-full w-full">
              <select  value={nearestLocation}
          onChange={handleNearestLocationChange} name="" id="" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs">
             <option value="" disabled selected>
            Nearest location
          </option>
               <option value="2">Nearest 2 Km</option>
          <option value="4">Nearest 4 Km</option>
          <option value="6">Nearest 6 Km</option>
          <option value="8">Nearest 8 Km</option>
          <option value="10">Nearest 10 Km</option>
              </select>
            </div>
            <div className="h-full w-full" >
            <button  onClick={handleHotelSearch} className="text-white md:w-full bg-emerald-500 font-bold text-xs  px-4 py-1 h-8 col-span-3">Search</button>
            </div>

          </>
        )}
        {activeTab === 'BanqueetHall' && (
            <>
           
            <div className="h-full w-full">
              <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
              <input   value={Location} name="Location" placeholder="Search location"
    onChange={(e) => setLocation(e.target.value)} className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs" type="text" />
              </Autocomplete>
            </div>
            <div className="h-full w-full">
              <select  value={nearestLocation}
          onChange={handleNearestLocationChange} name="" id="" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs">
             <option value="" disabled selected>
            Nearest location
          </option>
               <option value="2">Nearest 2 Km</option>
          <option value="4">Nearest 4 Km</option>
          <option value="6">Nearest 6 Km</option>
          <option value="8">Nearest 8 Km</option>
          <option value="10">Nearest 10 Km</option>
              </select>
            </div>
            <div className="h-full w-full" >
            <button  onClick={handleBanqueetHallSearch} className="text-white md:w-full bg-emerald-500 font-bold text-xs  px-4 py-1 h-8 col-span-3">Search</button>
            </div>

          </>
        )}
        {activeTab === 'Resort' && (
            <>
           
            <div className="h-full w-full">
              <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
              <input   value={Location} name="Location" placeholder="Search location"
    onChange={(e) => setLocation(e.target.value)} className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs" type="text" />
              </Autocomplete>
            </div>
            <div className="h-full w-full">
              <select  value={nearestLocation}
          onChange={handleNearestLocationChange} name="" id="" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs">
             <option value="" disabled selected>
            Nearest location
          </option>
               <option value="2">Nearest 2 Km</option>
          <option value="4">Nearest 4 Km</option>
          <option value="6">Nearest 6 Km</option>
          <option value="8">Nearest 8 Km</option>
          <option value="10">Nearest 10 Km</option>
              </select>
            </div>
            <div className="h-full w-full" >
            <button  onClick={handleResortSearch} className="text-white bg-emerald-500 md:w-full font-bold text-xs  px-4 py-1 h-8 col-span-3">Search</button>
            </div>

          </>
        )}
        

        {activeTab === 'Laundry' && (
          <>
          <div className="h-full w-full">
            <select
        name="service"
        value={services}
       onChange={handleServiceChange}
        required
        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs"
      >
        <option value="">Select Service</option>
        {/* Replace this with your list of services */}
        <option value="Iron and Fold">Iron & Fold</option>
        <option value="Wash and Iron">Wash & Iron</option>
        <option value="Wash and Fold">Wash & Fold</option>
        <option value="Dry Cleaning">Dry Cleaning</option>
        <option value="Emergency Service">Emergency Service</option>
        <option value="Subscription Based">Subscription Based</option>
        {/* Add more options as needed */}
      </select>
          </div>
          
          <div className="h-full w-full">
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <input   value={Location} name="Location" placeholder="Search location"
  onChange={(e) => setLocation(e.target.value)} className="appearance-none text-xs border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" />
            </Autocomplete>
          </div>
          <div className="h-full w-full">
          <button  onClick={handleLaundrySearch} className="text-white bg-emerald-500 md:w-full font-bold text-xs  px-4 py-1 h-8 col-span-3">Search</button>
          </div>
        </>
        )}
        {activeTab === 'CloudKitchen' && (
          <>
          <div className="h-full w-full">
            <select
        name="service"
        value={services}
       onChange={handleServiceChange}
        required
        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-xs"
      >
        <option value="">Select Service</option>
        <option value="chinese">Chinese</option>
      <option value="veg-thali">Veg Thali</option>
      <option value="non-veg-thali">Non-Veg Thali</option>
      </select>
          </div>
          
          <div className="h-full w-full">
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <input   value={Location} name="Location" placeholder="Search location"
  onChange={(e) => setLocation(e.target.value)} className="appearance-none text-xs border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" />
            </Autocomplete>
          </div>
          <div className="h-full w-full">
          <button  onClick={handleCloudKitchenSearch} className="text-white md:w-full bg-emerald-500 font-bold text-xs  px-4 py-1 h-8 col-span-3">Search</button>
          </div>
        </>
        )}

      </div>
    </div>
  

</section>
    </div>
  </div>








    </div>
  )
}

export default HomePage