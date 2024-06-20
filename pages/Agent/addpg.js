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
import AgentNav from '../../components/AgentNav'
import { useRouter } from 'next/router';
import { City, Country, State } from "country-state-city";
import AddPG from './PG/AddPG';
const Index = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
      const [userData, setUserData] = useState(null);
      const [selectedBenefits, setSelectedBenefits] = useState([]);
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
          if (!userData.selectedPgType) {
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
    category: '',
    location: '',
    PGName: '',
    roomTypes: [],
    benefits: [], // Initialize benefits as an empty array
  });
  


  const [showAllInputFormats, setShowAllInputFormats] = useState(false);
  const handleShowAllInputFormats = () => {
    setShowAllInputFormats(true);
  };

  const handleCloseAllInputFormats = () => {
    setShowAllInputFormats(false);
  };

  const [pgdata, setPgdata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

 
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const db = firebase.firestore();
          const galleryRef = db.collection('pgdetail').where('AgentId', '==', user.uid);
          const snapshot = await galleryRef.get();
          const data = [];
          snapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
          });
          setPgdata(data);
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
      }
    };
  
    fetchData();
  }, [user]);
  
console.log("pgdata",pgdata)
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

  const handleEditRoomTypeChange = (index, event) => {
    const { name, value } = event.target;
    const updatedRoomTypes = [...editData.roomTypes];
    updatedRoomTypes[index][name] = value;
    setEditData({ ...editData, roomTypes: updatedRoomTypes });
  };

  const handleEditAddRoomType = () => {
    const updatedRoomTypes = [...editData.roomTypes, { type: '', availability: '', price: '' }];
    setEditData({ ...editData, roomTypes: updatedRoomTypes });
  };

  const handleEdit = (id) => {
    const selectedData = pgdata.find((item) => item.id === id);
    setEditData({
      imgSrc: selectedData.imgSrc,
      videoSrc: selectedData.videoSrc,
      subcat: selectedData.subcat,
      description: selectedData.description,
      Owner: selectedData.Owner,
      category: selectedData.category,
      PGName: selectedData.PGName,
      benefits: selectedData.benefits || [], // Ensure selectedData.benefits is an array
      roomTypes: selectedData.roomTypes,
    });
    
    setSelectedBenefits(selectedData.benefits || []); // set selected benefits here
    setIsEditing(true);
    setEditId(id);
  };
  
  const handleBenefitChange = (e) => {
    const { name } = e.target;
    setSelectedBenefits((prevBenefits) =>
      prevBenefits.includes(name)
        ? prevBenefits.filter((benefit) => benefit !== name)
        : [...prevBenefits, name]
    );
  };

  console.log("editdata",editData)

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

      const dataWithImageUrls = { ...editData, imgSrc: imageUrls, videoSrc: videoUrl, benefits: selectedBenefits, };

      const db = firebase.firestore();
      await db.collection('pgdetail').doc(editId).update(dataWithImageUrls);

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
        category: '',
        PGName: '',
      
        roomTypes: [],
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
      await db.collection('pgdetail').doc(id).delete();
      const updatedData = pgdata.filter((item) => item.id !== id);
      setPgdata(updatedData);
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



  return (
    <div className='bg-white'>
       <AgentNav/>
       <div className="mt-24">
        {isLoading ? ( // Display loading message while isLoading is true
          <div className="flex justify-center items-center h-screen">
          <button type="button"
                  className="px-6 py-2.5 rounded-full text-white text-sm tracking-wider font-semibold border-none outline-none bg-[#43d3b0] hover:bg-orange-700 active:bg-[#43d3b0]">
              Loading
              <svg xmlns="http://www.w3.org/2000/svg" width="18px" fill="#fff" className="ml-2 inline animate-spin"
                   viewBox="0 0 24 24">
                  <path fillRule="evenodd"
                        d="M7.03 2.757a1 1 0 0 1 1.213-.727l4 1a1 1 0 0 1 .59 1.525l-2 3a1 1 0 0 1-1.665-1.11l.755-1.132a7.003 7.003 0 0 0-2.735 11.77 1 1 0 0 1-1.376 1.453A8.978 8.978 0 0 1 3 12a9 9 0 0 1 4.874-8l-.117-.03a1 1 0 0 1-.727-1.213zm10.092 3.017a1 1 0 0 1 1.414.038A8.973 8.973 0 0 1 21 12a9 9 0 0 1-5.068 8.098 1 1 0 0 1-.707 1.864l-3.5-1a1 1 0 0 1-.557-1.517l2-3a1 1 0 0 1 1.664 1.11l-.755 1.132a7.003 7.003 0 0 0 3.006-11.5 1 1 0 0 1 .039-1.413z"
                        clipRule="evenodd" data-original="#000000"/>
              </svg> {/* You can replace this with any loading spinner component or element */}
          </button>
      </div>
        ) : (
    <div className=" text-center p-8 bg-white dark:bg-white ">
        {isEditing ? (
        // Display the edit form when isEditing is true
<div>
        <form onSubmit={handleUpdate} className="flex flex-wrap justify-center gap-4">
          <div className='flex justify-end' >
          <button onClick={() => setIsEditing(false)} className="w-36 p-2 bg-red-500 text-white rounded-md">
            Cancel
          </button>
          </div>
          {/* Rest of the form */}
          <div className="flex flex-wrap justify-center gap-4 w-full">
          <div className="flex flex-wrap justify-center gap-4 w-full">
  <div className="flex w-full gap-4">
    <div className="w-1/2">
      <label className="w-full">
        Upload Hostel Photos:
        <input type="file" accept="image/*" multiple onChange={handleEditImageChange} className="w-full p-2 border border-gray-300 rounded-md" />
      </label>
    </div>
    <div className="w-1/2">
      <label className="w-full">
        Upload Hostel Video:
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
                    onChange={handleEditChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Hostel Type</option>
                    <option value={userData.selectedPgType}>
                      {userData.selectedPgType}
                    </option>
                  </select>
                </div>
              ) : userData && userData.userType === "Individual" ? (
                <div className="w-full">
                  <select
                    name="subcat"
                    value={editData.subcat}
                    onChange={handleEditChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Hostel Type</option>
                    <option value="Boys">Boys</option>
                    <option value="Girls">Girls</option>
                  </select>
                </div>
              ) : null}
              </div>
              <div className="w-1/2">
      <input
          type="text"
          name="PGName"
          value={editData.PGName}
          onChange={handleEditChange}
          placeholder="PG Name"
         className="w-full p-2 border border-gray-300 rounded-md"
        />
        </div>
        </div>
        <div className="flex w-full gap-4"> 
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
        {/* <div className="w-1/2">
          <select
            name="category"
            value={editData.category}
            onChange={handleEditChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            
            <option value="PG">PG</option>
          </select>
        </div> */}
        </div>
       <div className='w-full' >
        <textarea
    name="description"
    value={editData.description}
          onChange={handleEditChange}
    placeholder="Description"
    className="w-full p-2 border border-gray-300 rounded-md"
    rows="4" // This attribute controls the number of visible text lines for the textarea
  ></textarea>
       </div>
          
     
     <h2 class="text-md font-bold  text-gray-900">Select Benifits</h2>
<div className="  grid grid-cols-1 lg:grid-cols-4 gap-4 p-10 mt-16">
{['Food', 'Laundry', 'Parking', 'WiFi', '24/7 Security', 'Aquaguard'].map((benefit) => (
  <div key={benefit} className="relative flex w-60 items-center rounded bg-gray-50 py-2 px-4 pl-14 font-medium text-gray-700">
    <input 
      id={benefit} 
      className="peer hidden" 
      type="checkbox"
      name={benefit} // Use `benefit` directly
      checked={selectedBenefits.includes(benefit)} // Check if `benefit` is in `selectedBenefits`
      onChange={handleBenefitChange} 
    />
    <label className="absolute left-0 top-0 h-full w-full cursor-pointer rounded border peer-checked:border-blue-600 peer-checked:bg-blue-100" htmlFor={benefit}></label>
    <div className="absolute left-4 h-3 w-3 rounded border-2 border-gray-300 bg-gray-200 ring-blue-600 ring-offset-2 peer-checked:border-transparent peer-checked:bg-blue-600 peer-checked:ring-2"></div>
    <span className="pointer-events-none z-10 ml-4">{benefit}</span>
  </div>
))}

</div>
        {editData.roomTypes.map((roomType, index) => (
          <div key={index} className="flex flex-wrap justify-center gap-4 w-full">
            <select
  name="type"
  value={roomType.type}
  onChange={(e) => handleEditRoomTypeChange(index, e)}
  className="w-full p-2 border border-gray-300 rounded-md"
>
  <option value="">Select Type</option>
  <option value="Single Room">Single Room</option>
  <option value="Double Sharing Room">Double Sharing Room</option>
  <option value="Triple Sharing Room">Triple Sharing Room</option>
  <option value="Single Ac Room">Single Ac Room</option>
  <option value="Double Sharing Ac Room">Double Sharing Ac Room</option>
  <option value="Triple Sharing Ac Room">Triple Sharing Ac Room</option>
  {/* Add more options as needed */}
</select>
            <input
              type="number"
              name="availability"
              value={roomType.availability}
              onChange={(e) => handleEditRoomTypeChange(index, e)}
              placeholder="Availability"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              name="price"
              value={roomType.price}
              onChange={(e) => handleEditRoomTypeChange(index, e)}
              placeholder="Price"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        ))}
     
        <button type="button" onClick={handleEditAddRoomType} className="w-full p-2 bg-blue-500 text-white rounded-md">
          Add Room Type
        </button>
            {/* Add similar input fields for other data */}
          </div>
          <button type="submit" className="w-full p-2 bg-green-500 text-white rounded-md" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update'}
          </button>
        </form>
      </div> 
    ) : showAllInputFormats ? (
    <div>
        <AddPG handleCloseAllInputFormats={handleCloseAllInputFormats}/>
        </div>
      ) : (
        // Display the add PG Detail button when isEditing is false and showAllInputFormats is false
        <div className="flex justify-end">
  <button onClick={handleShowAllInputFormats} className="w-36 font-bold  p-2 bg-blue-500 text-white rounded-md">
  <span className='text-2xl font-bold' >+</span>  Add PG Detail
  </button>
</div>

      )}
        <div className="grid px-8 mb-20 mt-4 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {isLoading ? ( // Show spinner while loading
      <div className="flex justify-center items-center">
        <img className="w-20 h-20 animate-spin" src="https://www.svgrepo.com/show/70469/loading.svg" alt="Loading icon"/>
      </div>
    ) : (
      pgdata.length === 0 ? (
        <div className="flex justify-center items-center">
          <p className="text-2xl text-gray-600">No Data</p>
        </div>
      ) : (
       pgdata
          .map((item, index) => (
        <div key={item.id} className="w-full bg-gray-100 dark:bg-gray-800 border-gray-800 shadow-md hover:shadow-lg rounded-md">
          
          <div className="flex-none lg:flex-col">
          <Link href={`/pgdetail?id=${item.id}`}>
          <Carousel showThumbs={false} autoPlay>
            {item.imgSrc.map((src, idx) => (
              <div key={idx} className="h-full w-full lg:h-64 lg:w-full rounded-md lg:mb-0 mb-3">
                <img src={src} alt={`Image ${idx}`} className="w-full h-64 object-contain rounded-md" />
              </div>
            ))}
          </Carousel>
          </Link>
            <div className="flex-auto mt-4 px-6 lg:ml-3 justify-evenly py-2">
              <div className="flex flex-col">
                {/* <div className="flex items-center mr-auto text-sm">
                  <FaStar size={16} className='stroke-yellow-500 fill-yellow-500' />  
                  <p className="font-normal text-gray-500">5</p>
                </div> */}
                <div className="flex items-center justify-between min-w-0">
                  <h2 className="mr-auto text-blue-600 text-base capitalize font-medium truncate">{item.PGName}</h2>
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
                {item.roomTypes && item.roomTypes.map((property, i) => (
  <div key={i}>
    <span className="price text-xs font-bold">{i + 1}. {property.type} - {property.price}/Month</span>
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
              <div className="flex items-center justify-between mt-4">
                
                <button onClick={() => handleEdit(item.id)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
        Edit
      </button>
         
     
           <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
        Delete
      </button>
        
        </div>
            </div>
          </div>
          
        </div>
       ))
      )
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
