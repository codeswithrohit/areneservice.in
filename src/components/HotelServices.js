import { City, Country, State } from "country-state-city";
import { useEffect, useState,useRef } from "react";
import { useRouter } from 'next/router';
import { FaShoppingCart, FaHome, FaBuilding, FaHotel } from 'react-icons/fa';
import Selector from "./Selector";

const HotelServices = () => {
    const router = useRouter();
       // Fetch all countries
   let countryData = Country.getAllCountries();
  
   // Find the country object for India and set it as the default selected value
   const indiaCountry = countryData.find((country) => country.name === 'India');
 
   const [stateData, setStateData] = useState();
   const [cityData, setCityData] = useState();
 
   // Use India as the default selected country
   const [country, setCountry] = useState(indiaCountry);
   const [state, setState] = useState();
   const [city, setCity] = useState();
   const [category, setCategory] = useState('');

  // Category data for the dropdown
  const categoryData = ['Select Category', 'Boys', 'Girls'];
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



   /* for Hotel */
   const handleHotelSearch = () => {
    // Redirect to the detail page with the parameters
    router.push(`/Hotel?state=${state?.name}&city=${city?.name}`);
  };
  return (
    <div className="bg-white w-full h-full md:h-32 p-8 rounded-lg border border-emerald-500 md:-mt-2">
              <div className="flex flex-wrap gap-4 text-center">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
                  {/* Displaying a single grid item in mobile and three items in a row for larger screens */}
              
      {/* <div className="relative w-72 max-w-full mx-auto mt-4">
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
                {categoryData.map((categoryOption, index) => (
         <option key={index} value={categoryOption}>
         {categoryOption}
        </option>
                ))}
       
      </select>
    </div> */}
                  {state && (
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
                        )}
                        <button onClick={handleHotelSearch} className="border-2 w-56 h-12 mt-4 md:mt-0 border-emerald-600 text-black px-4 py-2 rounded-md text-1xl font-medium hover:border-white text-white bg-emerald-600 transition duration-300 ">Search</button>
                </div>
              </div>
              </div>
  )
}

export default HotelServices