import React, { useState,useEffect,useRef } from 'react';
import { firebase } from '../../../Firebase/config';
import 'firebase/firestore';
import 'firebase/storage';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaCamera, FaHeart, FaStar, FaBed, FaBath, FaHome, FaSms, FaPhone } from 'react-icons/fa';
import { FaPersonCircleCheck } from 'react-icons/fa6';
import { useRouter } from 'next/router';
import { City, Country, State } from "country-state-city";
import Selector from "../../../src/components/Selector";
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
const placesLibrary = ['places'];
const AddBuy = ({handleCloseAllInputFormats}) => {
   
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const [Location, setLocation] = useState('');
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
          router.push('/Agent/Register'); // Redirect to the login page if the user is not authenticated
        }
      });
  
      return () => unsubscribe();
    }, []);
  
    const fetchUserData = async (user) => {
      try {
        const db = getFirestore();
        const userDocRef = doc(db, 'AgentOwner', user.uid); // Update the path to the user document
        const userDocSnap = await getDoc(userDocRef);
  
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData.isVendor) {
            setUserData(userData);
          } else {
            router.push('/Agent/Register'); // Redirect to the login page if the user is not an Agent
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
    
    useEffect(() => {
      // ... (Previous code)
  
      if (userData) {
        if (userData.userType === 'Agent') {
          if (!userData.selectedBuyOption) {
            router.push('/Agent'); // Navigate to the login page if selectedBuyOption is not available
          }
        }
      }
  
      // ... (Previous code)
    }, [userData]);
    const [formData, setFormData] = useState({
        imgSrc: [],
        videoSrc: null,
        subcat: '',
        description: '',
        Owner: '',
        category: 'Buy',
        Propertyname: '',
        nearbylocality:'',
        locality:'',
        Propertyprocess: '',
        parkingspcae: '',
        kitchenaccessories: '',
        streetwidness: '',
        propertytypes: [],
        createdAt: new Date().toISOString(),
      });
    
      const handleImageChange = (e) => {
        const images = Array.from(e.target.files);
        setFormData({ ...formData, imgSrc: [...formData.imgSrc, ...images] });
      };
    
      const handleVideoChange = (e) => {
        const video = e.target.files[0];
        setFormData({ ...formData, videoSrc: video });
      };
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
      const handlePropertytypechange = (index, event) => {
        const { name, value } = event.target;
        const updatedpropertytypes = [...formData.propertytypes];
        updatedpropertytypes[index][name] = value;
        setFormData({ ...formData, propertytypes: updatedpropertytypes });
      };
    
      const hangleAddPropertyType = () => {
        const updatedpropertytypes = [...formData.propertytypes, { type: '',  price: '' }];
        setFormData({ ...formData, propertytypes: updatedpropertytypes });
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

    useEffect(() => {
        console.log('Selected State:', state?.name);
      }, [state]);
      
      useEffect(() => {
        console.log('Selected City:', city?.name);
      }, [city]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const key in formData) {
        if (!formData[key]) {
          toast.error(`${key} cannot be empty. Please fill in all fields.`, {
            position: toast.POSITION.TOP_CENTER
          });
          return; // Stop submission if any field is empty
        }
      }
    setIsSubmitting(true);

    try {
      const storageRef = firebase.storage().ref();

      // Uploading images
      const imageUrls = [];
      for (const image of formData.imgSrc) {
        const imageRef = storageRef.child(image.name);
        await imageRef.put(image);
        const url = await imageRef.getDownloadURL();
        imageUrls.push(url);
      }

      // Uploading video
      const videoRef = storageRef.child(formData.videoSrc.name);
      await videoRef.put(formData.videoSrc);
      const videoUrl = await videoRef.getDownloadURL();

      const dataWithImageUrls = {
        ...formData,
        imgSrc: imageUrls,
        videoSrc: videoUrl,
        AgentId: user.uid,
        location: Location,
        Verified:'true'
        // state: state?.name || '',
        // city: city?.name || '',
      };


      const db = firebase.firestore();
      const docRef = await db.collection('buydetail').add(dataWithImageUrls);
      console.log('Document written with ID: ', docRef.id);

      toast.success('Submission successful!', {
        position: toast.POSITION.TOP_CENTER
      });
      window.location.reload();
      setFormData({
        imgSrc: [],
        videoSrc: null,
        subcat: '',
        description: '',
        Owner: '',
        category: 'Buy',
        Propertyname: '',
        nearbylocality:'',
        locality:'',
        Propertyprocess: '',
        parkingspcae: '',
        kitchenaccessories: '',
        streetwidness: '',
        propertytypes: [],
      });
    } catch (error) {
      console.error('Error adding document: ', error);
      toast.error('Submission failed. Please try again.', {
        position: toast.POSITION.TOP_CENTER
      });
    }
    finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className='flex min-h-screen justify-center item-center'>
       <h1>Loading ....</h1>
      </div>
    );
  }
  return (
    <div className=''>
      <h1 className='text-center text-emerald-500 font-bold mt-4 text-2xl' >Add Buy Data</h1>
    <form onSubmit={handleSubmit} className="flex flex-wrap justify-center gap-4">
   
 <div className="flex flex-wrap justify-center gap-4 w-full">
<div className="flex w-full gap-4">
<div className="w-1/2">
 <label className="w-full">
   Upload Property Photos:
   <input type="file" accept="image/*" multiple onChange={handleImageChange} className="w-full p-2 border border-gray-300 rounded-md" />
 </label>
</div>
<div className="w-1/2">
 <label className="w-full">
   Upload Property Video:
   <input type="file" accept="video/*" onChange={handleVideoChange} className="w-full p-2 border border-gray-300 rounded-md" />
 </label>
</div>
</div>
</div>

<div className="flex w-full gap-4">

{userData && userData.userType === "Agent" ? (
           <div className="w-full">
             <select
               name="subcat"
               value={formData.subcat}
               onChange={handleChange}
               className="w-full p-2 border border-gray-300 rounded-md"
             >
               <option value="">Select Property Type</option>
               <option value={userData.selectedBuyOption}>
                 {userData.selectedBuyOption}
               </option>
             </select>
           </div>
         ) : userData && userData.userType === "Individual" ? (
          <div className="w-1/2">
             <select
               name="subcat"
               value={formData.subcat}
               onChange={handleChange}
               className="w-full p-2 border border-gray-300 rounded-md"
             >
               <option value="">Select Property Type</option>
           <option value="Appartment">Apartment</option>
           <option value="Builder Floor">Builder Floor</option>
           <option value="Shop/Showroom">Shop/Showroom</option>
           <option value="Office Space">Office Space</option>
           <option value="Other Properties">Other Properties</option>
             </select>
           </div>
         ) : null}
         <div className="w-1/2">
   <input
     type="text"
     name="Owner"
     value={formData.Owner}
     onChange={handleChange}
     placeholder="Property Owner Name"
    className="w-full p-2 border border-gray-300 rounded-md"
   />
   </div>
   </div>
   <div className="flex w-full gap-4">

   <div className="w-1/2">

  <input
     type="text"
     name="locality"
     value={formData.locality}
     onChange={handleChange}
     placeholder="Enter Property Locality"
    className="w-full p-2 border border-gray-300 rounded-md"
   />
   </div>

   <div className="w-1/2">
   <input
     type="text"
     name="streetwidness"
     value={formData.streetwidness}
     onChange={handleChange}
     placeholder="Type Street Widness in Sq.ft"
    className="w-full p-2 border border-gray-300 rounded-md"
   />
   </div>
   </div>
   <div className="flex w-full gap-4">
<div className="w-1/2">
  <input
     type="text"
     name="nearbylocality"
     value={formData.nearbylocality}
     onChange={handleChange}
     placeholder="Enter Nearby Locality"
    className="w-full p-2 border border-gray-300 rounded-md"
   />
   </div>
   

              
   <div className="w-1/2"> {/* Ensure the parent container spans the full width */}
  <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
    <input
      name="Location"
      type="Location"
      value={Location}
      onChange={(e) => setLocation(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded-md"
      style={{ width: '100%' }} 
      placeholder="Enter Your location"
    />
  </Autocomplete>
</div>
</div>
            
<div className="flex w-full gap-4">
<div className="w-1/2">
   <input
     type="text"
     name="Propertyname"
     value={formData.Propertyname}
     onChange={handleChange}
     placeholder="Property Name"
    className="w-full p-2 border border-gray-300 rounded-md"
   />
   </div>
   <div className="w-1/2">
  <select
  name="Propertyprocess"
  value={formData.Propertyprocess}
  onChange={handleChange}
  className="w-full p-2 border border-gray-300 rounded-md"
>
  <option value="">Select Property Process</option>
  <option value="Ready To Move">Ready To Move</option>
  <option value="Under Construction">Under Construction</option>
  {/* Add more options as needed */}
</select>
</div>
</div>

<div className="flex w-full gap-4">
<div className="w-1/2">
<input
     type="text"
     name="parkingspcae"
     value={formData.parkingspcae}
     onChange={handleChange}
     placeholder="Enter Parking Space in Sq.ft"
    className="w-full p-2 border border-gray-300 rounded-md"
   />
   </div>
   <div className="w-1/2">
<input
     type="text"
     name="kitchenaccessories"
     value={formData.kitchenaccessories}
     onChange={handleChange}
     placeholder="Type For Kitchen Accessories"
    className="w-full p-2 border border-gray-300 rounded-md"
   />
   </div>
   </div>
   <div className="w-full">
  <textarea
    name="description"
    value={formData.description}
    onChange={handleChange}
    placeholder="Description"
    className="w-full p-2 border border-gray-300 rounded-md"
    rows="4" // This attribute controls the number of visible text lines for the textarea
  ></textarea>
  </div>
  
    {formData.propertytypes.map((propertytype, index) => (
     <div key={index} className="flex flex-wrap justify-center gap-4 w-full">
       <select
  name="type"
  value={propertytype.type}
  onChange={(e) => handlePropertytypechange(index, e)}
  className="w-full p-2 border border-gray-300 rounded-md"
>
  <option value="">Select Property Type</option>
  <option value="1 BHK">1 BHK</option>
  <option value="2 BHK">2 BHK</option>
  <option value="3 BHK">3 BHK</option>
  <option value="4 BHK">4 BHK</option>
  <option value="5 BHK">5 BHK</option>
  <option value="6 BHK">6 BHK</option>
</select>

       <input
         type="text"
         name="price"
         value={propertytype.price}
         onChange={(e) => handlePropertytypechange(index, e)}
         placeholder="Price"
         className="w-full p-2 border border-gray-300 rounded-md"
       />
     </div>
   ))}
   <div className="flex justify-between space-x-2">
   <button type="button" onClick={hangleAddPropertyType} className="w-full p-2 bg-blue-500 text-white rounded-md">
     Add Property Type
   </button>
   <button type="submit" className="w-full p-2 bg-green-500 text-white rounded-md" disabled={isSubmitting}>
     {isSubmitting ? 'Submitting...' : 'Submit'}
   </button>
   <button onClick={handleCloseAllInputFormats} className="w-full p-2 bg-red-500 text-white rounded-md">
       Close Form
     </button>
     </div>
 </form>
   </div>
  )
}

export default AddBuy