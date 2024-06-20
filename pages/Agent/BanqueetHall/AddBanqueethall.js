import React, { useState,useEffect,useRef } from 'react';
import { firebase } from '../../../Firebase/config';
import 'firebase/firestore';
import 'firebase/storage';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import { City, Country, State } from "country-state-city";
import Selector from "../../../src/components/Selector";
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
const placesLibrary = ['places'];
const AddBanqueethall = ({handleCloseAllInputFormats}) => {
   
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
   
    const [Location, setLocation] = useState('');
    const router = useRouter();
    const [user, setUser] = useState(null);
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
    
  
    const [formData, setFormData] = useState({
        imgSrc: [],
        videoSrc: null,
        description: '',
        Owner: '',
        category: 'Banqueethall',
        BanqueethallName: '',
        wifi: '',
        Aquaguard: '',
        Firecracker:'',
        Alcohal:'',
        DjSound:'',
        Suited: [],
        SeatingCapacity:'',
        WithoutFoodPrice:'',
        nonvegperplate:'',
        vegperplate:'',
        Airconditioner:'',
        Foodtype:'',
        AdvancePayment:'',
        Parking:'',
        Decoration:'',
        createdAt: new Date().toISOString(),
       


      });
      const options = [
        { label: 'All Events', value: 'All Events' },
        { label: 'Wedding ceremony', value: 'Wedding ceremony' },
        { label: 'Birthday Party', value: 'Birthday Party' },
        { label: 'Wedding reception', value: 'Wedding reception' },
        { label: 'Confrence / Seminar / Workshop', value: 'Confrence / Seminar / Workshop' },
        // Add more options as needed
      ];
      const [selectedOptions, setSelectedOptions] = useState([]);

      const handleCheckboxChange = (value) => {
        if (selectedOptions.includes(value)) {
          setSelectedOptions(selectedOptions.filter((option) => option !== value));
        } else {
          setSelectedOptions([...selectedOptions, value]);
        }
      };
      const handleImageChange = (e) => {
        const images = Array.from(e.target.files);
        setFormData({ ...formData, imgSrc: [...formData.imgSrc, ...images] });
      };
    
      const handleVideoChange = (e) => {
        const video = e.target.files[0];
        setFormData({ ...formData, videoSrc: video });
      };
    
    
 
     
      const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
      
        if (type === 'checkbox') {
          // For checkboxes, handle multiple selections
          if (checked) {
            // If checked, add the value to the array
            setFormData((prevFormData) => ({
              ...prevFormData,
              [name]: [...prevFormData[name], value],
            }));
          } else {
            // If unchecked, remove the value from the array
            setFormData((prevFormData) => ({
              ...prevFormData,
              [name]: prevFormData[name].filter((val) => val !== value),
            }));
          }
        } else {
          // For other input types, update the value directly
          setFormData({ ...formData, [name]: value });
        }
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
            // state: state?.name || '',
            // city: city?.name || '',
            location: Location,
            Verified:'false'
          };
      
        
    
    
          const db = firebase.firestore();
          const docRef = await db.collection('Banqueethalldetail').add(dataWithImageUrls);
       
    
          toast.success('Submission successful!', {
            position: toast.POSITION.TOP_CENTER
          });
          setFormData({
            imgSrc: [],
            videoSrc: null,
            description: '',
            Owner: '',
            category: 'Banqueethall',
            BanqueethallName: '',
            wifi: '',
            Aquaguard: '',
            Food: '',
            Suited:'',
            SeatingCapacity:'',
            WithoutFoodPrice:'',
            nonvegperplate:'',
            vegperplate:'',
            Airconditioner:'',
            Foodtype:'',
            AdvancePayment:'',
            Parking:'',
            Decoration:'',
            Firecracker:'',
            Alcohal:'',
            DjSound:'',
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
    <div>
      <button onClick={handleCloseAllInputFormats} className="w-36 p-2 bg-red-500 text-white rounded-md">
            Close Form
          </button>
          <form onSubmit={handleSubmit} className="flex flex-wrap justify-center gap-4">
         
      <div className="flex flex-wrap justify-center gap-4 w-full">
  <div className="flex w-full gap-4">
    <div className="w-1/2">
      <label className="w-full">
        Upload BanqueetHall Photos:
        <input type="file" accept="image/*" multiple onChange={handleImageChange} className="w-full p-2 border border-gray-300 rounded-md" />
      </label>
    </div>
    <div className="w-1/2">
      <label className="w-full">
        Upload BanqueetHall Video:
        <input type="file" accept="video/*" onChange={handleVideoChange} className="w-full p-2 border border-gray-300 rounded-md" />
      </label>
    </div>
  </div>
</div>

<div className="flex w-full gap-4">
<div className="w-1/2">

        
        <input
          type="text"
          name="Owner"
          value={formData.Owner}
          onChange={handleChange}
          placeholder="Banqueet Hall Owner Name"
         className="w-full p-2 border border-gray-300 rounded-md"
        />
        </div>
       {/* <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category Name"
         className="w-full p-2 border border-gray-300 rounded-md"
        /> */}
        <div>
        {/* <div className="lg:flex gap-8">
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
</div> */}
<div className="w-full"> {/* Ensure the parent container spans the full width */}
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
        </div>
        <div className="flex w-full gap-4">
        <div className="w-1/2">
        <input
          type="text"
          name="BanqueethallName"
          value={formData.BanqueethallName}
          onChange={handleChange}
          placeholder="Banqueethall Name"
         className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="w-1/2">
        <input
          type="text"
          name="SeatingCapacity"
          value={formData.SeatingCapacity}
          onChange={handleChange}
          placeholder="Enter No. of Seating Capacity"
         className="w-full p-2 border border-gray-300 rounded-md"
        />
        </div>
        </div>
        <div className="flex w-full gap-4">
        <div className="w-1/2">
        <input
          type="text"
          name="WithoutFoodPrice"
          value={formData.WithoutFoodPrice}
          onChange={handleChange}
          placeholder="Enter Price Boking for without Food"
         className="w-full p-2 border border-gray-300 rounded-md"
        />
        </div>
        <div className="w-1/2">
        <input
          type="text"
          name="nonvegperplate"
          value={formData.nonvegperplate}
          onChange={handleChange}
          placeholder="Enter Price Non-Veg Per Plate"
         className="w-full p-2 border border-gray-300 rounded-md"
        />
        </div>
        </div>
        <div className="flex w-full gap-4">
        <div className="w-1/2">
        <input
          type="text"
          name="vegperplate"
          value={formData.vegperplate}
          onChange={handleChange}
          placeholder="Enter Price Veg Per Plate"
         className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      <div className="w-1/2">
        <input
          type="text"
          name="AdvancePayment"
          value={formData.AdvancePayment}
          onChange={handleChange}
          placeholder="Enter Payment Rule"
         className="w-full p-2 border border-gray-300 rounded-md"
        />
        </div>
        </div>
        <div className="flex w-full gap-4">
        <div className="w-1/2">
          <input
          type="text"
          name="Parking"
          value={formData.Parking}
          onChange={handleChange}
          placeholder="Enter Parking how much space for vehicle eg:Private Parking For 25 Cars"
         className="w-full p-2 border border-gray-300 rounded-md"
        />
        </div>
        <div className="w-1/2">
          <select
            name="Decoration"
            value={formData.Decoration}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Decoration</option>
            <option value="InHouse">InHouse</option>
            <option value="Out-House">Out-House</option>
            <option value="Both InHouse & OutHouse">Both InHouse & OutHouse</option>
          </select>
        </div>
      </div>
      <div className="flex w-full gap-4">
      <div className="w-1/2">
          <select
            name="Foodtype"
            value={formData.Foodtype}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select FoodTypes</option>
            <option value="Vegeterian">Vegeterian</option>
            <option value="Non-Vegeterian">Non-Vegeterian</option>
            <option value="Both Vegeterian & Non-Vegeterian">Both Vegeterian & Non-Vegeterian</option>
          </select>
        </div>
        <div className="w-1/2">
          <select
            name="wifi"
            value={formData.wifi}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Wi-Fi Availability</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        </div>
        <div className="flex w-full gap-4">
        <div className="w-1/2">
          <select
            name="Airconditioner"
            value={formData.Airconditioner}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Airconditioner Availability</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="w-1/2">
          <select
            name="Aquaguard"
            value={formData.Aquaguard}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Aquaguard Availability</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        </div>
        <div className="flex w-full gap-4">
        <div className="w-1/2">
          <select
            name="Firecracker"
            value={formData.Firecracker}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Firecracker Allowed</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="w-1/2">
          <select
            name="Alcohal"
            value={formData.Alcohal}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Alcohal Allowed</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        </div>
        <div className="w-full">
          <select
            name="DjSound"
            value={formData.DjSound}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">DjSound Available</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="w-full">
        <div className="flex flex-wrap justify-center gap-4">
  <label className="mb-2">Suited For:</label>
  {options.map((option) => (
    <div key={option.value} className="flex items-center mb-2 mr-4">
      <input
        type="checkbox"
        id={option.value}
        value={option.value}
        checked={formData.Suited.includes(option.value)}
        onChange={handleChange}
        name="Suited" // Ensure the name is "Suited" for consistent handling
        className="mr-2"
      />
      <label htmlFor={option.value}>{option.label}</label>
    </div>
  ))}
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

       
       
        <button type="submit" className="w-full mb-10 p-2 bg-green-500 text-white rounded-md" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}

export default AddBanqueethall