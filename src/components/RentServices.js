import { City, Country, State } from "country-state-city";
import { useEffect, useState,useRef } from "react";
import { useRouter } from 'next/router';
import { FaShoppingCart, FaHome, FaBuilding, FaHotel } from 'react-icons/fa';
import Selector from "./Selector";
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
const placesLibrary = ['places'];
const RentServices = () => {
    const router = useRouter();
       // Fetch all countries
       const [Location, setLocation] = useState('');
       const [nearestLocation, setNearestLocation] = useState('');
   let countryData = Country.getAllCountries();
   const handleNearestLocationChange = (e) => {
    setNearestLocation(e.target.value);
  };
   // Find the country object for India and set it as the default selected value
   const indiaCountry = countryData.find((country) => country.name === 'India');
 
   const [stateData, setStateData] = useState();
   const [cityData, setCityData] = useState();
 
   // Use India as the default selected country
   const [country, setCountry] = useState(indiaCountry);
   const [state, setState] = useState();
   const [city, setCity] = useState();
   const [category, setCategory] = useState('');

  const categoryRentData = ['Select Category', 'Appartment', 'Builder Floor','Shop/Showroom','Office Space','Other Properties'];

  // Handle change event for the category selector
  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setCategory(selectedCategory);
    console.log('Selected Category:', selectedCategory);
  };

  const handleStateChange = (selectedState) => {
    setState(selectedState);
    console.log('Selected State:', selectedState);
  };

  const handleCityChange = (selectedCity) => {
    setCity(selectedCity);
    console.log('Selected City:', selectedCity);
  };
   useEffect(() => {
     setStateData(State.getStatesOfCountry(country?.isoCode));
   }, [country]);
 
   useEffect(() => {
     setCityData(City.getCitiesOfState(country?.isoCode, state?.isoCode));
   }, [state]);
 
   useEffect(() => {
     stateData && setState(stateData.find((s) => s.name === 'Delhi'));
   }, [stateData]);
 
   useEffect(() => {
     cityData && setCity(cityData[0]);
   }, [cityData]);


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

   const handleRentSearch = () => {
    // Redirect to the detail page with the parameters
    router.push(`/Rent?category=${category}&location=${Location}&nearestLocation=${nearestLocation}`);
  };
 
  return (
    <div className="bg-white w-full h-full md:h-32 p-8 rounded-lg border border-emerald-500 md:-mt-2">
    <div className="flex flex-wrap gap-4 text-center">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Displaying a single grid item in mobile and three items in a row for larger screens */}
        <div className="relative w-72 max-w-full mx-auto mt-4">
<svg
xmlns="http://www.w3.org/2000/svg"
className="absolute top-0 bottom-0 w-5 h-5 my-auto text-gray-400 right-3"
viewBox="0 0 20 20"
fill="currentColor"
>
<path
fillRule="evenodd"
d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
clipRule="evenodd"
/>
</svg>
<select   value={category}
onChange={handleCategoryChange} className="w-full px-3 py-2 text-sm text-gray-600 bg-white border rounded-lg shadow-sm outline-none appearance-none focus:ring-offset-2 focus:ring-indigo-600 focus:ring-2">
{categoryRentData.map((categoryOption, index) => (
<option key={index} value={categoryOption}>
{categoryOption}
</option>
))}

</select>
</div>

<div>
              <label class="text-sm mb-2 block">Enter Location</label>
              <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
              <input name="Location" type="Location"    value={Location}
    onChange={(e) => setLocation(e.target.value)} class="w-full px-3 py-2 text-sm text-gray-600 bg-white border rounded-lg shadow-sm outline-none appearance-none focus:ring-offset-2 focus:ring-indigo-600 focus:ring-2" placeholder="Enter Your location" />
              </Autocomplete>
            </div>
            <div className="flex-1 mt-4">
      <div className="relative flex items-center">
        <select
          value={nearestLocation}
          onChange={handleNearestLocationChange}
          className="px-4 py-2.5 bg-white w-full text-sm border-2 focus:border-[#333] outline-none rounded-lg"
        >
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
    </div>
        {/* {state && (
                <div className="">
                  <p className="text-teal-800 font-semibold"> Select State </p>
                  <Selector
                    data={stateData}
                    selected={state}
                    setSelected={setState}
                  />
                </div>
              )}
              {city && (
                <div>
                  <p className="text-teal-800 font-semibold">Select City </p>
                  <Selector data={cityData} selected={city} setSelected={setCity} />
                </div>
              )} */}
              <button onClick={handleRentSearch} className="border-2 w-56 h-12 mt-4 md:mt-0 border-emerald-600 text-black px-4 py-2 rounded-md text-1xl font-medium hover:border-white text-white bg-emerald-600 transition duration-300">Search</button>
      </div>
    </div>
    </div>
  )
}

export default RentServices