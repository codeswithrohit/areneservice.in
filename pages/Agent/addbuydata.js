import React, { useState,useEffect,useRef } from 'react';
import { firebase } from '../../Firebase/config';
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
import AddBuy from '../Agent/Buy/AddBuy';
import AgentNav from '../../components/AgentNav';
const Index = () => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editData, setEditData] = useState({
    imgSrc: [],
    videoSrc: null,
    subcat: '',
    description: '',
    Owner: '',
    Propertyname: '',
    nearbylocality:'',
    locality:'',
    Propertyprocess: '',
    parkingspcae: '',
    kitchenaccessories: '',
    streetwidness: '',
    propertytypes: [{ type: '', price: '' }],
  });
  
 


 


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

 


  

  
  const [showAllInputFormats, setShowAllInputFormats] = useState(false);
  const handleShowAllInputFormats = () => {
    setShowAllInputFormats(true);
  };

  const handleCloseAllInputFormats = () => {
    setShowAllInputFormats(false);
  };

  const [propertydata, setPropertyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

 
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const db = firebase.firestore();
          const galleryRef = db.collection('buydetail').where('AgentId', '==', user.uid);
          const snapshot = await galleryRef.get();
          const data = [];
          snapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
          });
          setPropertyData(data);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
      }
    };
  
    fetchData();
  }, [user]);
  

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const handleEditImageChange = (e) => {
    const images = Array.from(e.target.files);
    setEditData({ ...editData, imgSrc: [...editData.imgSrc, ...images] });
  };

  const handleEditVideoChange = (e) => {
    const video = e.target.files[0];
    setEditData({ ...editData, videoSrc: video });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleEditPropertyTypechange = (index, event) => {
    const { name, value } = event.target;
    const updatedPropertyTypes = [...editData.propertytypes];
    updatedPropertyTypes[index][name] = value;
    setEditData({ ...editData, propertytypes: updatedPropertyTypes });
  };
  
  

  const handleEditPropertyType = () => {
    const updatedpropertytypes = [...editData.propertytypes, { type: '',  price: '' }];
    setEditData({ ...editData, propertytypes: updatedpropertytypes });
  };

  const handleEdit = (id) => {
    const selectedData = propertydata.find((item) => item.id === id);
    setEditData({
      imgSrc: selectedData.imgSrc,
      videoSrc: selectedData.videoSrc,
      subcat: selectedData.subcat,
      description: selectedData.description,
      Owner: selectedData.Owner,
      category: selectedData.category,
      locality:selectedData.locality,
      Propertyname: selectedData.Propertyname,
      parkingspcae: selectedData.parkingspcae,
      kitchenaccessories: selectedData.kitchenaccessories,
      streetwidness: selectedData.streetwidness,
      Propertyprocess: selectedData.Propertyprocess,
      nearbylocality: selectedData.nearbylocality,
      propertytypes: selectedData.propertytypes,
    });
    setIsEditing(true);
    setEditId(id);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const storageRef = firebase.storage().ref();

      // Uploading images
      const imageUrls = [];
      for (const image of editData.imgSrc) {
        if (typeof image === 'object') {
          const imageRef = storageRef.child(image.name);
          await imageRef.put(image);
          const url = await imageRef.getDownloadURL();
          imageUrls.push(url);
        } else {
          imageUrls.push(image);
        }
      }

      // Uploading video
      let videoUrl = editData.videoSrc;
      if (typeof editData.videoSrc === 'object') {
        const videoRef = storageRef.child(editData.videoSrc.name);
        await videoRef.put(editData.videoSrc);
        videoUrl = await videoRef.getDownloadURL();
      }

      const dataWithImageUrls = { ...editData, imgSrc: imageUrls, videoSrc: videoUrl };

      const db = firebase.firestore();
      await db.collection('buydetail').doc(editId).update(dataWithImageUrls);

      toast.success('Update successful!', {
        position: toast.POSITION.TOP_CENTER,
      });
      window.location.reload();
      setEditData({
        imgSrc: [],
        videoSrc: null,
        subcat: '',
        description: '',
        Owner: '',
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
      console.error('Error updating document: ', error);
      toast.error('Update failed. Please try again.', {
        position: toast.POSITION.TOP_CENTER,
      });
    } finally {
      setIsSubmitting(false);
      setIsEditing(false);
      setEditId(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      const db = firebase.firestore();
      await db.collection('buydetail').doc(id).delete();
      const updatedData = propertydata.filter((item) => item.id !== id);
      setPropertyData(updatedData);
      toast.success('Deletion successful!', {
        position: toast.POSITION.TOP_CENTER,
      });
    } catch (error) {
      console.error('Error deleting document: ', error);
      toast.error('Deletion failed. Please try again.', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

 
  console.log(editData.propertytypes);


  return (
    <div className=''>
      <AgentNav/>
      <h1 className="text-center text-3xl py-2 font-bold text-emerald-500">Buy/Sell Property</h1>
       <div className="mt-20">
        {isLoading ? ( // Display loading message while isLoading is true
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
    <div className=" text-center p-8 bg-white dark:bg-white ">
        {isEditing ? (
        // Display the edit form when isEditing is true
<div>
        <form onSubmit={handleUpdate} className=" flex flex-wrap justify-center gap-4">
          <button onClick={() => setIsEditing(false)} className="w-full p-2 bg-red-500 text-white rounded-md">
            Cancel
          </button>
          {/* Rest of the form */}
          <div className="flex flex-wrap justify-center gap-4 w-full">
          <div className="flex flex-wrap justify-center gap-4 w-full">
  <div className="flex w-full gap-4">
    <div className="w-1/2">
      <label className="w-full">
        Upload Property Photos:
        <input type="file" accept="image/*" multiple onChange={handleEditImageChange} className="w-full p-2 border border-gray-300 rounded-md" />
      </label>
    </div>
    <div className="w-1/2">
      <label className="w-full">
        Upload Property Video:
        <input type="file" accept="video/*" onChange={handleEditVideoChange} className="w-full p-2 border border-gray-300 rounded-md" />
      </label>
    </div>
  </div>
</div>
<div className="flex w-full gap-4">
<div className="w-1/2">
{userData && userData.userType === "Agent" ? (
                <div className="w-full">
                  <select
                    name="subcat"
                    value={editData.subcat}
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
                <div className="w-full">
                  <select
                    name="subcat"
                    value={editData.subcat}
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
    
       </div>
       <div className="w-1/2">
        <input
          type="text"
          name="Owner"
          value={editData.Owner}
          onChange={handleEditChange}
          placeholder="Room Owner Name"
         className="w-full p-2 border border-gray-300 rounded-md"
        />
        </div>
        </div>

        <div className="flex w-full gap-4">
<div className="w-1/2">
       
       <input
     type="text"
     name="locality"
     value={editData.locality}
     onChange={handleChange}
     placeholder="Enter Property Locality"
    className="w-full p-2 border border-gray-300 rounded-md"
   />
   </div>
   <div className="w-1/2">
  <input
     type="text"
     name="nearbylocality"
     value={editData.nearbylocality}
     onChange={handleChange}
     placeholder="Enter Nearby Locality"
    className="w-full p-2 border border-gray-300 rounded-md"
   />
   </div>
   </div>

   <div className="flex w-full gap-4">
   <div className="w-1/2">
         
        <input
          type="text"
          name="Propertyname"
          value={editData.Propertyname}
          onChange={handleEditChange}
          placeholder="PG Name"
         className="w-full p-2 border border-gray-300 rounded-md"
        />
        </div>
        <div className="w-1/2">
        <select
  name="Propertyprocess"
  value={editData.Propertyprocess}
  onChange={handleChange}
  className="w-full p-2 border border-gray-300 rounded-md"
>
  <option value="">Select Property Process</option>
  <option value="Ready To Move">Ready To Move</option>
  <option value="Under Construction">Under Construction</option>

</select>
</div>
</div>
<div className="flex w-full gap-4">
<div className="w-1/2">
     
<input
     type="text"
     name="parkingspcae"
     value={editData.parkingspcae}
     onChange={handleChange}
     placeholder="Enter Parking Space"
    className="w-full p-2 border border-gray-300 rounded-md"
   />
   </div>
   <div className="w-1/2">
<input
     type="text"
     name="kitchenaccessories"
     value={editData.kitchenaccessories}
     onChange={handleChange}
     placeholder="Type For Kitchen Accessories"
    className="w-full p-2 border border-gray-300 rounded-md"
   />
   </div>
   </div>
   

    <input
     type="text"
     name="streetwidness"
     value={editData.streetwidness}
     onChange={handleChange}
     placeholder="Type Street Widness"
    className="w-full p-2 border border-gray-300 rounded-md"
   />
    <div className="w-full">
  <textarea
    name="description"
    value={editData.description}
    onChange={handleChange}
    placeholder="Description"
    className="w-full p-2 border border-gray-300 rounded-md"
    rows="4" // This attribute controls the number of visible text lines for the textarea
  ></textarea>
  </div>
   
   {editData.propertytypes.map((propertytype, index) => (
  <div key={index} className="flex flex-wrap justify-center gap-4 w-full">
    <select
      name="type"
      value={propertytype.type}
      onChange={(e) => handleEditPropertyTypechange(index, e)}
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
      onChange={(e) => handleEditPropertyTypechange(index, e)}
      placeholder="Price"
      className="w-full p-2 border border-gray-300 rounded-md"
    />
  </div>
))}


     
        <button type="button" onClick={handleEditPropertyType} className="w-full p-2 mt-4 bg-blue-500 text-white rounded-md">
          Add Property Type
        </button>
            {/* Add similar input fields for other data */}
          </div>
          <button type="submit" className="w-full p-2 bg-green-500 text-white rounded-md" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update'}
          </button>
        </form>
      </div>      ) : showAllInputFormats ? (
    <AddBuy handleCloseAllInputFormats={handleCloseAllInputFormats}/>
      ) : (
        // Display the add PG Detail button when isEditing is false and showAllInputFormats is false
        <div className="flex justify-end">
  <button onClick={handleShowAllInputFormats} className="w-36 font-bold  p-2 bg-blue-500 text-white rounded-md">
  <span className='text-2xl font-bold' >+</span>  Add Buy/Sell Property
  </button>
</div>

      
      )}
    <div className="container mx-auto px-4 py-8">
  
  {propertydata.length > 0 ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {propertydata.map((item) => (
        <div key={item.id} className="rounded-lg shadow-md bg-white">
          <a href={`/buydetail?id=${item.id}`} >
            <div className="relative overflow-hidden rounded-t-lg">
              <Carousel showThumbs={false} autoPlay>
                {item.imgSrc.map((image, index) => (
                  <div key={index}>
                    <img
                      src={image}
                      alt={`Image ${index}`}
                      className="h-48 w-full object-cover"
                    />
                  </div>
                ))}
              </Carousel>
            </div>

            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 line-clamp-1" title="location">
                {item.location}
              </h2>
              <p className="text-primary text-sm mt-2 font-semibold">{item.Propertyname}</p>
         
              
            </div>
          </a>
          <div className="p-4 flex justify-between">
            <button
              onClick={() => handleEdit(item.id)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item.id)}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="flex justify-center items-center">
    <p className="text-2xl text-gray-600">No Data</p>
  </div>
  )}
</div>

     <ToastContainer />
    </div>
        )}
        </div>
    </div>
  );
};

export default Index;
