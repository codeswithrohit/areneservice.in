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
import AddBanqueethall from './BanqueetHall/AddBanqueethall';
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
    
   
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editData, setEditData] = useState({
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
  });


  const [showAllInputFormats, setShowAllInputFormats] = useState(false);
  const handleShowAllInputFormats = () => {
    setShowAllInputFormats(true);
  };

  const handleCloseAllInputFormats = () => {
    setShowAllInputFormats(false);
  };
  const options = [
    { label: 'All Events', value: 'All Events' },
    { label: 'Wedding ceremony', value: 'Wedding ceremony' },
    { label: 'Birthday Party', value: 'Birthday Party' },
    { label: 'Wedding reception', value: 'Wedding reception' },
    { label: 'Confrence / Seminar / Workshop', value: 'Confrence / Seminar / Workshop' },
    // Add more options as needed
  ];
  const [selectedOptions, setSelectedOptions] = useState([]);

  const [Banqueethalldata, setBanqueethalldata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

 
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const db = firebase.firestore();
          const galleryRef = db.collection('Banqueethalldetail').where('AgentId', '==', user.uid);
          const snapshot = await galleryRef.get();
          const data = [];
          snapshot.forEach((doc) => {
            data.push({ id: doc.id, ...doc.data() });
          });
          setBanqueethalldata(data);
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
    const { name, value, type, checked } = e.target;
  
    if (type === 'checkbox') {
      // For checkboxes, handle multiple selections
      if (checked) {
        // If checked, add the value to the array
        setEditData((preveditData) => ({
          ...preveditData,
          [name]: [...preveditData[name], value],
        }));
      } else {
        // If unchecked, remove the value from the array
        setEditData((preveditData) => ({
          ...preveditData,
          [name]: preveditData[name].filter((val) => val !== value),
        }));
      }
    } else {
      // For other input types, update the value directly
      setEditData({ ...editData, [name]: value });
    }
  };
  

  // const handleEditChange = (e) => {
  //   const { name, value } = e.target;
  //   setEditData({ ...editData, [name]: value });
  // };

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
    const selectedData = Banqueethalldata.find((item) => item.id === id);
    setEditData({
      imgSrc: selectedData.imgSrc,
      videoSrc: selectedData.videoSrc,
      description: selectedData.description,
      Owner: selectedData.Owner,
      category: selectedData.category,
      BanqueethallName: selectedData.BanqueethallName,
      wifi: selectedData.wifi,
      Aquaguard: selectedData.Aquaguard,
      Suited: selectedData.Suited,
      SeatingCapacity: selectedData.SeatingCapacity,
      WithoutFoodPrice: selectedData.WithoutFoodPrice,
      nonvegperplate: selectedData.nonvegperplate,
      vegperplate: selectedData.vegperplate,
      Airconditioner: selectedData.Airconditioner,
      Foodtype: selectedData.Foodtype,
      AdvancePayment: selectedData.AdvancePayment,
      Parking: selectedData.Parking,
      Decoration: selectedData.Decoration,
      Firecracker: selectedData.Firecracker,
      Alcohal: selectedData.Alcohal,
      DjSound: selectedData.DjSound,
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
      await db.collection('Banqueethalldetail').doc(editId).update(dataWithImageUrls);

      toast.success('Update successful!', {
        position: toast.POSITION.TOP_CENTER,
      });
      window.location.reload();
      setEditData({
        imgSrc: [],
    videoSrc: null,
    description: '',
    Owner: '',
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
      await db.collection('Banqueethalldetail').doc(id).delete();
      const updatedData = Banqueethalldata.filter((item) => item.id !== id);
      setBanqueethalldata(updatedData);
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
        <form onSubmit={handleUpdate} className="flex flex-wrap justify-end gap-4">
          <button onClick={() => setIsEditing(false)} className="w-36 p-2 bg-red-500 text-white rounded-md">
            Cancel
          </button>
          {/* Rest of the form */}
          <div className="flex flex-wrap justify-center gap-4 w-full">
          <div className="flex flex-wrap justify-center gap-4 w-full">
  <div className="flex w-full gap-4">
    <div className="w-1/2">
      <label className="w-full">
        Upload BanqueetHall Photos:
        <input type="file" accept="image/*" multiple onChange={handleEditImageChange} className="w-full p-2 border border-gray-300 rounded-md" />
      </label>
    </div>
    <div className="w-1/2">
      <label className="w-full">
        Upload BanqueetHall Video:
        <input type="file" accept="video/*" onChange={handleEditVideoChange} className="w-full p-2 border border-gray-300 rounded-md" />
      </label>
    </div>
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
       
        <div className="w-1/2">
        <input
          type="text"
          name="BanqueethallName"
          value={editData.BanqueethallName}
          onChange={handleEditChange}
          placeholder="Banqueethall Name"
         className="w-full p-2 border border-gray-300 rounded-md"
        />
        </div>
        </div>

        <div className="flex w-full gap-4">
    <div className="w-1/2">
     
     <input
          type="text"
          name="SeatingCapacity"
          value={editData.SeatingCapacity}
          onChange={handleEditChange}
          placeholder="Enter No. of Seating Capacity"
         className="w-full p-2 border border-gray-300 rounded-md"
        />
        </div>
        <div className="w-1/2">
        <input
          type="text"
          name="WithoutFoodPrice"
          value={editData.WithoutFoodPrice}
          onChange={handleEditChange}
          placeholder="Enter Price Boking for without Food"
         className="w-full p-2 border border-gray-300 rounded-md"
        />
        </div>
        </div>

        <div className="flex w-full gap-4">
        <div className="w-1/2">
        <input
          type="text"
          name="nonvegperplate"
          value={editData.nonvegperplate}
          onChange={handleEditChange}
          placeholder="Enter Price Non-Veg Per Plate"
         className="w-full p-2 border border-gray-300 rounded-md"
        />
        </div>
        <div className="w-1/2">
        <input
          type="text"
          name="vegperplate"
          value={editData.vegperplate}
          onChange={handleEditChange}
          placeholder="Enter Price Veg Per Plate"
         className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>
      </div>
      <div className="flex w-full gap-4">
      <div className="w-1/2">
        <input
          type="text"
          name="AdvancePayment"
          value={editData.AdvancePayment}
          onChange={handleEditChange}
          placeholder="Enter Payment Rule"
         className="w-full p-2 border border-gray-300 rounded-md"
        />
        </div>
        <div className="w-1/2">
          <input
          type="text"
          name="Parking"
          value={editData.Parking}
          onChange={handleEditChange}
          placeholder="Enter Parking how much space for vehicle eg:Private Parking For 25 Cars"
         className="w-full p-2 border border-gray-300 rounded-md"
        />
        </div>
        </div>
        <div className="flex w-full gap-4">
        <div className="w-1/2">
          <select
            name="Decoration"
            value={editData.Decoration}
            onChange={handleEditChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Decoration</option>
            <option value="InHouse">InHouse</option>
            <option value="Out-House">Out-House</option>
            <option value="Both InHouse & OutHouse">Both InHouse & OutHouse</option>
          </select>
        </div>
      
        <div className="w-1/2">
          <select
            name="Foodtype"
            value={editData.Foodtype}
            onChange={handleEditChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select FoodTypes</option>
            <option value="Vegeterian">Vegeterian</option>
            <option value="Non-Vegeterian">Non-Vegeterian</option>
            <option value="Both Vegeterian & Non-Vegeterian">Both Vegeterian & Non-Vegeterian</option>
          </select>
        </div>
        </div>
        <div className="flex w-full gap-4">
        <div className="w-1/2">
          <select
            name="wifi"
            value={editData.wifi}
            onChange={handleEditChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Wi-Fi Availability</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="w-1/2">
          <select
            name="Airconditioner"
            value={editData.Airconditioner}
            onChange={handleEditChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Airconditioner Availability</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        </div>
        <div className="flex w-full gap-4">
        <div className="w-1/2">
          <select
            name="Aquaguard"
            value={editData.Aquaguard}
            onChange={handleEditChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Aquaguard Availability</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="w-1/2">
          <select
            name="Firecracker"
            value={editData.Firecracker}
            onChange={handleEditChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Firecracker Allowed</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        </div>
        <div className="flex w-full gap-4">
        <div className="w-1/2">
          <select
            name="Alcohal"
            value={editData.Alcohal}
            onChange={handleEditChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Alcohal Allowed</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="w-1/2">
          <select
            name="DjSound"
            value={editData.DjSound}
            onChange={handleEditChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">DjSound Available</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
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
        checked={editData.Suited.includes(option.value)}
        onChange={handleEditChange}
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
    value={editData.description}
    onChange={handleEditChange}
    placeholder="Description"
    className="w-full p-2 border border-gray-300 rounded-md"
    rows="4" // This attribute controls the number of visible text lines for the textarea
  ></textarea>
  </div>

 
          </div>
          <button type="submit" className="w-full p-2 bg-green-500 text-white rounded-md" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update'}
          </button>
        </form>
      </div> 
    ) : showAllInputFormats ? (
    <div>
        <AddBanqueethall handleCloseAllInputFormats={handleCloseAllInputFormats}/>
        </div>
      ) : (
        // Display the add Banqueethall Detail button when isEditing is false and showAllInputFormats is false
        <div className="flex justify-end">
  <button onClick={handleShowAllInputFormats} className="w-36 font-bold  p-2 bg-blue-500 text-white rounded-md">
  <span className='text-2xl font-bold' >+</span>  Add BanqueetHall Data
  </button>
</div>
      )}
      <div>
      {Banqueethalldata.length > 0 ? (
      <div className="flex flex-wrap justify-center">
        <div className=" p-16 bg-white grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Banqueethalldata
            .map((item, index) => (
              <div key={item.id} className="relative mx-auto w-full">
                <Link
                   href={`/Banqueethalldetail?id=${item.id}`}
                  className="relative inline-block w-full transform transition-transform duration-300 ease-in-out hover:-translate-y-2"
                >
                  <div className="rounded-lg bg-white p-4 shadow">
                    <div className="relative flex justify-center overflow-hidden rounded-lg">
                      <Carousel showThumbs={false} autoPlay>
                        {item.imgSrc.map((image, index) => (
                          <div key={index}>
                            <img
                              src={image}
                              alt={`Image ${index}`}
                             className='h-48 w-196'
                            />
                          </div>
                        ))}
                      </Carousel>
                    </div>

                    <div className="mt-4 text-start">
                      <h2 className="line-clamp-1   text-xl font-medium text-gray-800 md:text-sm" >
                        {item.location}
                      </h2>

                      <p className="text-primary  mt-2  rounded-xl font-semibold ">
                        <span className="text-xs">{item.BanqueethallName}</span>
                      </p>
                    </div>
                
                  </div>
                </Link>
                 <div className="flex items-center justify-between mt-4">
                
                      <button onClick={() => handleEdit(item.id)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              Edit
            </button>
               
           
                 <button onClick={() => handleDelete(item.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
              Delete
            </button>
              
              </div>
              </div>
            ))}
        </div>
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
