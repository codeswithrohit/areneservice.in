import { useState, useEffect, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { firebase } from "../../Firebase/config";
import "firebase/firestore";
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link'
import AgentNav from '../../components/AgentNav'
import { useRouter } from 'next/router';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
const placesLibrary = ['places'];
const Laundry = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [Location, setLocation] = useState('');
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
        if (!userData.selectedRentType) {
          router.push('/Agent'); // Navigate to the login page if selectedBuyOption is not available
        }
      }
    }

    // ... (Previous code)
  }, [userData]);

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

  const [formData, setFormData] = useState({
    service: '',
    GarmentTypes: [], // Initialize GarmentTypes as an empty array
  });


  const [editData, setEditData] = useState({
    service: '',
    GarmentTypes: [], // Initialize GarmentTypes as an empty array
  });
  const [showAllInputFormats, setShowAllInputFormats] = useState(false);
  const handleShowAllInputFormats = () => {
    setShowAllInputFormats(true);
  };

  const handleCloseAllInputFormats = () => {
    setShowAllInputFormats(false);
  };


  const handleGarmentTypeChange = (index, event) => {
    const { name, value } = event.target;
    const updatedGarmentTypes = [...formData.GarmentTypes];
    updatedGarmentTypes[index][name] = value;
    setFormData({ ...formData, GarmentTypes: updatedGarmentTypes });
  };

  const handleAddGarmentType = () => {
    const updatedGarmentTypes = [...formData.GarmentTypes, { tenure: '', noofgarments: '', price: '' }];
    setFormData({ ...formData, GarmentTypes: updatedGarmentTypes });
  };
  const handleEditGarmentTypeChange = (index, event) => {
    const { name, value } = event.target;
    const updatedGarmentTypes = [...editData.GarmentTypes];
    updatedGarmentTypes[index][name] = value;
    setEditData({ ...editData, GarmentTypes: updatedGarmentTypes });
  };

  const handleEditGarmentType = () => {
    const updatedGarmentTypes = [...editData.GarmentTypes, { tenure: '', noofgarments: '', price: '' }];
    setEditData({ ...editData, GarmentTypes: updatedGarmentTypes });
  };


  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleInputChanges = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };



  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const db = firebase.firestore();
      const storage = firebase.storage();

      const dataToUpload = {
        ...formData, AgentId: user.uid, vendor: userData.name,
        location: Location, Verified: 'false',createdAt: new Date().toISOString(),
      };
      await db.collection("Laundry").add(dataToUpload);
      toast.success("Data uploaded successfully!");
      window.location.reload();
      setFormData({
        service: '',
        Garment: [],
      });
    } catch (error) {
      console.error("Error uploading data: ", error);
      toast.error("Error uploading data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleDelete = async (id) => {
    try {
      const db = firebase.firestore();
      await db.collection('Laundry').doc(id).delete();
      const updatedData = productdata.filter((item) => item.id !== id);
      setProductData(updatedData);
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



  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // ... existing functions for input changes, form submission, and delete remain unchanged

  // Function to set the form data for editing
  const handleEdit = (id) => {
    const selectedData = productdata.find((item) => item.id === id);
    setIsEditing(true);
    setEditingProduct(id);
    setEditData({
      service: selectedData.service,
      GarmentTypes: selectedData.GarmentTypes,
    });
  };

  // Function to update the edited product
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const db = firebase.firestore();

      // Check if the document exists before updating
      const docRef = db.collection('Laundry').doc(editingProduct);
      const doc = await docRef.get();

      if (doc.exists) {
        const dataToUpdate = { ...editData };
        await docRef.update(dataToUpdate);
        toast.success('Product updated successfully!');
        window.location.reload();
        setIsEditing(false);
        setEditingProduct(null);
      } else {
        // Handle the case where the document doesn't exist
        toast.error('Document does not exist!');
      }
    } catch (error) {
      console.error('Error updating product: ', error);
      toast.error('Error updating product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };











  const [productdata, setProductData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = firebase.firestore();
        const productRef = db.collection('Laundry').where('AgentId', '==', user.uid);
        const snapshot = await productRef.get();
        const data = [];
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setProductData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    // You might want to add a condition here that triggers fetching
    // data based on some criteria. For now, I've removed the empty if statement.
    fetchData();
  }, [user]);



  return (
    <div className='min-h-screen  bg-white dark:bg-white'>
      <AgentNav />
      <div className=" text-center p-4 mt-20 md:p-4 bg-white dark:bg-white ">
        {showAllInputFormats ? (
          <div>
            <form onSubmit={handleFormSubmit} className="max-w-2xl mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">

              <div className="grid grid-cols-1 gap-4 mb-4">
                <div>
                  <select
                    name="service"
                    onChange={handleInputChange}
                    required
                    className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
              </div>
              <div style={{ width: '100%' }}> {/* Ensure the parent container spans the full width */}
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

              {formData.GarmentTypes && formData.GarmentTypes.map((garmentType, index) => (
                <div key={index} className="flex flex-wrap justify-center mt-2 gap-4 w-full">
                  <select
                    name="tenure"
                    value={garmentType.tenure}
                    onChange={(e) => handleGarmentTypeChange(index, e)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Type</option>
                    <option value="1 Pickup">1 Pickup</option>
                    <option value="2 Pickup">2 Pickup</option>
                    <option value="1 Month">1 Month</option>
                    <option value="6 Month">6 Month</option>
                    <option value="9 Month">9 Month</option>
                    <option value="12 Month">12 Month</option>
                    {/* Add more options as needed */}
                  </select>
                  <input
                    type="number"
                    name="noofgarments"
                    value={garmentType.noofgarments}
                    onChange={(e) => handleGarmentTypeChange(index, e)}
                    placeholder="No. of Garments"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="number"
                    name="price"
                    value={garmentType.price}
                    onChange={(e) => handleGarmentTypeChange(index, e)}
                    placeholder="Total Price"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              ))}

              <button type="button" onClick={handleAddGarmentType} className="w-full mt-2 p-2 bg-blue-500 text-white rounded-md">
                Add Garment
              </button>


              {/* Add similar grid layouts for the remaining input fields */}
              {/* ... */}
              <div className="flex items-center justify-center mt-4">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
                <button onClick={handleCloseAllInputFormats} className="bg-red-500 ml-4 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                  Close Form
                </button>
              </div>
            </form>

          </div>
        ) : (
          // Display the add PG Detail button when isEditing is false and showAllInputFormats is false
          <div className="flex items-end justify-end" >
          <button onClick={handleShowAllInputFormats} className="w-48 mt-6 mb-2 p-2 bg-blue-500 text-white rounded-md">
           + Add Products
          </button>
          </div>
        )}
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white font-[sans-serif]">
            <thead class="bg-gray-100 whitespace-nowrap">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Services
                </th>

                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Loaction
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  GarmentTypes
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="whitespace-nowrap">
              {productdata
                .map((item, index) => (
                  <tr key={item.id} class="hover:bg-gray-50">
                    <td class="px-6 py-4 text-base">
                      {item.service}
                    </td>

                    <td class="px-6 py-4 text-base">
                      {item.location}
                    </td>
                    <td class="px-6 py-4 text-base">
                      {item.GarmentTypes && item.GarmentTypes.map((type, idx) => (
                        <div key={idx}>
                          <span>{type.tenure}</span> - <span>{type.noofgarments}</span> - <span>{type.price}</span>
                        </div>
                      ))}
                    </td>
                    <td class="px-6 py-4">
                      <button onClick={() => handleEdit(item.id)} class="mr-4" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 fill-blue-500 hover:fill-blue-700"
                          viewBox="0 0 348.882 348.882">
                          <path
                            d="m333.988 11.758-.42-.383A43.363 43.363 0 0 0 304.258 0a43.579 43.579 0 0 0-32.104 14.153L116.803 184.231a14.993 14.993 0 0 0-3.154 5.37l-18.267 54.762c-2.112 6.331-1.052 13.333 2.835 18.729 3.918 5.438 10.23 8.685 16.886 8.685h.001c2.879 0 5.693-.592 8.362-1.76l52.89-23.138a14.985 14.985 0 0 0 5.063-3.626L336.771 73.176c16.166-17.697 14.919-45.247-2.783-61.418zM130.381 234.247l10.719-32.134.904-.99 20.316 18.556-.904.99-31.035 13.578zm184.24-181.304L182.553 197.53l-20.316-18.556L294.305 34.386c2.583-2.828 6.118-4.386 9.954-4.386 3.365 0 6.588 1.252 9.082 3.53l.419.383c5.484 5.009 5.87 13.546.861 19.03z"
                            data-original="#000000" />
                          <path
                            d="M303.85 138.388c-8.284 0-15 6.716-15 15v127.347c0 21.034-17.113 38.147-38.147 38.147H68.904c-21.035 0-38.147-17.113-38.147-38.147V100.413c0-21.034 17.113-38.147 38.147-38.147h131.587c8.284 0 15-6.716 15-15s-6.716-15-15-15H68.904C31.327 32.266.757 62.837.757 100.413v180.321c0 37.576 30.571 68.147 68.147 68.147h181.798c37.576 0 68.147-30.571 68.147-68.147V153.388c.001-8.284-6.715-15-14.999-15z"
                            data-original="#000000" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(item.id)} class="mr-4" title="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 fill-red-500 hover:fill-red-700" viewBox="0 0 24 24">
                          <path
                            d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z"
                            data-original="#000000" />
                          <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z"
                            data-original="#000000" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {isEditing && (
          <form onSubmit={handleUpdate} className="max-w-2xl mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="grid grid-cols-1 gap-4 mb-4">

              {/* Include input fields for editing */}

              <div>
                <select
                  name="service"
                  value={editData.service}
                  onChange={handleInputChanges}
                  required
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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




            </div>

            {editData.GarmentTypes && editData.GarmentTypes.map((garmentType, index) => (
                <div key={index} className="flex flex-wrap justify-center mt-2 gap-4 w-full">
                  <select
                    name="tenure"
                    value={garmentType.tenure}
                    onChange={(e) => handleEditGarmentTypeChange(index, e)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Type</option>
                    <option value="1 Pickup">1 Pickup</option>
                    <option value="2 Pickup">2 Pickup</option>
                    <option value="1 Month">1 Month</option>
                    <option value="6 Month">6 Month</option>
                    <option value="9 Month">9 Month</option>
                    <option value="12 Month">12 Month</option>
                    {/* Add more options as needed */}
                  </select>
                  <input
                    type="number"
                    name="noofgarments"
                    value={garmentType.noofgarments}
                    onChange={(e) => handleEditGarmentTypeChange(index, e)}
                    placeholder="No. of Garments"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="number"
                    name="price"
                    value={garmentType.price}
                    onChange={(e) => handleEditGarmentTypeChange(index, e)}
                    placeholder="Total Price"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              ))}

              <button type="button" onClick={handleEditGarmentType} className="w-full mt-2 p-2 bg-blue-500 text-white rounded-md">
                Add Garment
              </button>

            <div className="flex items-center justify-center mt-4">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update'}
              </button>
            </div>
          </form>
        )}
        <ToastContainer />
      </div>
      <ToastContainer />
    </div>
  )
}

export default Laundry