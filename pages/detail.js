import React,{useState,useEffect} from 'react'
import Link from 'next/link';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { FaCamera, FaHeart, FaStar, FaBed, FaBath, FaHome, FaSms, FaPhone,FaCar,FaUtensils } from 'react-icons/fa';
import { FaPersonCircleCheck } from 'react-icons/fa6';
import { useRouter } from 'next/router';
import { firebase } from '../Firebase/config';
import 'firebase/firestore';
import 'firebase/storage';
const DetailPage = () => {
  const router = useRouter();
  const [roomTypeFilter, setRoomTypeFilter] = useState('');
  const [priceRangeFilter, setPriceRangeFilter] = useState('');
  // Extracting the parameters from the URL query
  const { location, category, subcategory } = router.query;
  const [rentdata, setRentdata] = useState([]);
 
  useEffect(() => {
    const db = firebase.firestore();
    let galleryRef = db.collection('rentdetail');
  
    // Filtering based on location
    if (location) {
      galleryRef = galleryRef.where('location', '==', location);
    }
  
    // Filtering based on category
    if (category) {
      galleryRef = galleryRef.where('category', '==', category);
    }
  
    // Filtering based on subcategory
    if (subcategory) {
      galleryRef = galleryRef.where('subcat', '==', subcategory);
    }
  
    // Fetching data based on applied filters
    
    galleryRef.get().then((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setRentdata(data);
      setIsLoading(false);
    });
  }, [location, category, subcategory]);
  
console.log(subcategory)


  const [pgdata, setPgdata] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
 
  useEffect(() => {
    const db = firebase.firestore();
    let galleryRef = db.collection('pgdetail');
  
    // Filtering based on location
    if (location) {
      galleryRef = galleryRef.where('location', '==', location);
    }
  
    // Filtering based on category
    if (category) {
      galleryRef = galleryRef.where('category', '==', category);
    }
  
    // Filtering based on subcategory
    if (subcategory) {
      galleryRef = galleryRef.where('subcat', '==', subcategory);
    }
  
    // Fetching data based on applied filters
    
    galleryRef.get().then((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setPgdata(data);
      setIsLoading(false);
    });
  }, [location, category, subcategory]);
  
  const filteredPGData = pgdata.filter((item) => {
    const isRoomTypeMatch =
      !roomTypeFilter || item.roomTypes.some((room) => room.type === roomTypeFilter);

    const isPriceRangeMatch =
      !priceRangeFilter ||
      (priceRangeFilter === 'Below 2999' && parseInt(item.roomTypes[0].price) >= 2999) ||
      (priceRangeFilter === 'Below 4999' && parseInt(item.roomTypes[0].price) >= 4999);

    return isRoomTypeMatch && isPriceRangeMatch;
  });

  
  const [flatTypeFilter, setFlatTypeFilter] = useState('');
  const [buydata, setBuyData] = useState([]);
 
  useEffect(() => {
    const db = firebase.firestore();
    let galleryRef = db.collection('BuyDetail');
  
    // Filtering based on location
    if (location) {
      galleryRef = galleryRef.where('location', '==', location);
    }
  
    // Filtering based on category
    if (category) {
      galleryRef = galleryRef.where('category', '==', category);
    }
  
    // Filtering based on subcategory
    if (subcategory) {
      galleryRef = galleryRef.where('propertytypes', '==', subcategory);
    }
  
    // Fetching data based on applied filters
    galleryRef.get().then((snapshot) => {
      const data = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setBuyData(data);
      setIsLoading(false);
    });
  }, [location, category, subcategory]);
  console.log(buydata)
  const filteredbuydata = buydata.filter((item) => {
    const isFlatTypeMatch =
      !flatTypeFilter || item.flatTypes.some((flat) => flat.type === flatTypeFilter);

  

    return isFlatTypeMatch ;
  });
  return (
    
  
  <div className='min-h-screen bg-white dark:bg-white'>
     {isLoading ? (
         <div className="bg-white ">
           <div className="px-4 py-12 bg-white">
             <div className="flex gap-10 justify-center">
               <div className="w-8 h-8 bg-indigo-700 rounded-full" />
               <div className="w-8 h-8 bg-indigo-700 rounded-full" />
               <div className="w-8 h-8 bg-indigo-700 rounded-full" />
             </div>
             <div className="flex gap-10 justify-center mt-10">
               <div className="w-8 h-8 bg-indigo-200 rounded-full animate-bounce" />
               <div className="w-8 h-8 bg-indigo-200 rounded-full animate-bounce" />
               <div className="w-8 h-8 bg-indigo-200 rounded-full animate-bounce" />
             </div>
           </div>
         </div>
      ) : category === 'PG' ? (
        <div className="flex flex-wrap justify-center">
           <div className="w-full px-24 bg-white">
      <h1>{location}-{category}-{subcategory}</h1>
       <div className="flex items-center justify-between">
         <p className="font-medium">Filter Room</p>
       </div>
       <div>
         <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
          
           <div className="relative w-72 max-w-full mx-auto mt-2">
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
     <select  onChange={(e) => setRoomTypeFilter(e.target.value)} className="w-full px-3 py-2 text-sm text-gray-600 bg-white border rounded-lg shadow-sm outline-none appearance-none focus:ring-offset-2 focus:ring-indigo-600 focus:ring-2">
     <option value="">Type Of Room</option>
             <option value="Single Sharing with AC">Single Sharing with AC</option>
             <option value="Single Sharing with Non-AC">Single Sharing with Non-AC</option>
             <option value="Double Sharing with Non-AC">Double Sharing with Non-AC</option>
             <option value="Double Sharing with AC">Double Sharing with Non-AC</option>
     </select>
   </div>
          
           <div className="relative w-72 max-w-full mx-auto mt-2">
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
     <select  onChange={(e) => setPriceRangeFilter(e.target.value)} className="w-full px-3 py-2 text-sm text-gray-600 bg-white border rounded-lg shadow-sm outline-none appearance-none focus:ring-offset-2 focus:ring-indigo-600 focus:ring-2">
     <option value="">Price Range</option>
             <option value="Below 2999">Below 2999</option>
             <option value="Below 4999">Below 4999</option>
             <option value="Below 9999">Below 9999</option>
     </select>
   </div>
         </div>
       </div>
     </div>
     {filteredPGData.length > 0 ? (
     <div className="flex flex-wrap justify-center">
       <div className=" p-16 bg-white grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
         {filteredPGData
           .map((item, index) => (
             <div key={item.id} className="relative mx-auto w-full">
               <Link
                 href={`/product?category=${category}&id=${item.id}`}
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
                             style={{ width: '196px', height: '196px' }}
                           />
                         </div>
                       ))}
                     </Carousel>
                   </div>
 
                   <div className="mt-4 text-start">
                     <h2 className="line-clamp-1   text-xl font-medium text-gray-800 md:text-sm" title="New York">
                       {item.location}
                     </h2>
 
                     <p className="text-primary mt-2 inline-block whitespace-nowrap rounded-xl font-semibold leading-tight">
                       <span className="text-sm">{item.PGName}</span>
                     </p>
                   </div>
                   <div className="mt-4">
                     <p className="line-clamp-1 mt-2 text-lg text-gray-800">{item.description}</p>
                   </div>
                   <div className="justify-center">
                     <div className="mt-4 flex space-x-3 overflow-hidden rounded-lg px-1 py-1">
                      
                       <p className="flex items-center font-medium text-gray-800">
                         <FaPersonCircleCheck className="mr-2 text-blue-900" />
                         2
                       </p>
                       <p className="flex items-center font-medium text-gray-800">
                         <FaHome className="mr-2 text-blue-900" />
                        2
                       </p>
                     </div>
                   </div>
                   <div className="mt-8 grid grid-cols-2">
                     <div className="flex items-center">
                       <div className="relative">
                         <div className="h-6 w-6 rounded-full bg-gray-200 md:h-8 md:w-8"></div>
                         <span className="bg-primary-red absolute top-0 right-0 inline-block h-3 w-3 rounded-full"></span>
                       </div>
 
                       <p className="line-clamp-1 ml-2 text-gray-800">{item.Owner}</p>
                     </div>
 
                     <div className="flex justify-end">
                       <button>
                         <FaSms className="mr-2 text-2xl text-red-300" />
                       </button>
                       <button>
                         <FaPhone className="ml-4 text-2xl text-red-300" />
                       </button>
                     </div>
                   </div>
                 </div>
               </Link>
             </div>
           ))}
       </div>
     </div>
   ) : (
     <div className='py-16'>
       
<style>@import url(https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/5.3.45/css/materialdesignicons.min.css);</style>
<div className="min-w-screen min-h-screen bg-blue-100 flex items-center p-5 lg:p-20 overflow-hidden relative">
    <div className="flex-1 min-h-full min-w-full rounded-3xl bg-white shadow-xl p-10 lg:p-20 text-gray-800 relative md:flex items-center text-center md:text-left">
        <div className="w-full md:w-1/2">
        <div className="w-24">
                        <img
        src="https://www.areneservices.in/public/front/images/property-logo.png"
        className='h-24 w-24'
      />
      <h2 className='text-[12px] font-semibold '>
        <span className='text-emerald-500 inline'>Arene</span>
        <span className='text-black inline'>Services</span>
      </h2>
                        </div>
            <div className="mb-10 md:mb-20 text-gray-600 font-light">
                <h1 className="font-black uppercase text-3xl lg:text-5xl text-yellow-500 mb-10">Wait Our Team Will Be Data Upload!</h1>
                
                <p>Try searching again or use the Go Back button below.</p>
            </div>
            <div className="mb-20 md:mb-0">
                <a href='/'>
                
                <button className="text-lg font-light outline-none focus:outline-none transform transition-all hover:scale-110 text-yellow-500 hover:text-yellow-600"><i className="mdi mdi-arrow-left mr-2"></i>Go Back</button>
                </a>
            </div>
            
        </div>
        
    </div>
    <div className="w-64 md:w-96 h-96 md:h-full bg-blue-200 bg-opacity-30 absolute -top-64 md:-top-96 right-20 md:right-32 rounded-full pointer-events-none -rotate-45 transform"></div>
    <div className="w-96 h-full bg-yellow-200 bg-opacity-20 absolute -bottom-96 right-64 rounded-full pointer-events-none -rotate-45 transform"></div>
</div>


<div className="flex items-end justify-end fixed bottom-0 right-0 mb-4 mr-4 z-10">
    <div>
        <a title="Buy me a beer" href="https://www.buymeacoffee.com/scottwindon" target="_blank" className="block w-16 h-16 rounded-full transition-all shadow hover:shadow-lg transform hover:scale-110 hover:rotate-12">
            <img className="object-cover object-center w-full h-full rounded-full" src="https://i.pinimg.com/originals/60/fd/e8/60fde811b6be57094e0abc69d9c2622a.jpg"/>
        </a>
    </div>
</div>
        </div>
   )}        </div>
      ) : category === 'Buy' ? (
        <div className="max-w-6xl mx-auto py-24 md:py-0">

            <div className="w-full px-24 bg-white">
      <h1>{location}-{category}-{subcategory}</h1>
       <div className="flex items-center justify-between">
         <p className="font-medium">Filter Property</p>
       </div>
       <div>
         <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
          
           <div className="relative w-72 max-w-full mx-auto mt-2">
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
     <select  onChange={(e) => setFlatTypeFilter(e.target.value)} className="w-full px-3 py-2 text-sm text-gray-600 bg-white border rounded-lg shadow-sm outline-none appearance-none focus:ring-offset-2 focus:ring-indigo-600 focus:ring-2">
     <option value="">Type Of Flat</option>
             <option value="1 BHK">1 BHK</option>
             <option value="2 BHK">2 BHK</option>
             <option value="3 BHK">3 BHK</option>
             <option value="4 BHK">4 BHK</option>
             <option value="5 BHK">5 BHK</option>
     </select>
   </div>
          
       
         </div>
       </div>
     </div>
     {filteredbuydata.length === 0 ? (
     <div className='py-16'>
       
     <style>@import url(https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/5.3.45/css/materialdesignicons.min.css);</style>
     <div className="min-w-screen min-h-screen bg-blue-100 flex items-center p-5 lg:p-20 overflow-hidden relative">
         <div className="flex-1 min-h-full min-w-full rounded-3xl bg-white shadow-xl p-10 lg:p-20 text-gray-800 relative md:flex items-center text-center md:text-left">
             <div className="w-full md:w-1/2">
             <div className="w-24">
                             <img
             src="https://www.areneservices.in/public/front/images/property-logo.png"
             className='h-24 w-24'
           />
           <h2 className='text-[12px] font-semibold '>
             <span className='text-emerald-500 inline'>Arene</span>
             <span className='text-black inline'>Services</span>
           </h2>
                             </div>
                 <div className="mb-10 md:mb-20 text-gray-600 font-light">
                     <h1 className="font-black uppercase text-3xl lg:text-5xl text-yellow-500 mb-10">Wait Our Team Will Be Data Upload!</h1>
                     
                     <p>Try searching again or use the Go Back button below.</p>
                 </div>
                 <div className="mb-20 md:mb-0">
                     <a href='/'>
                     
                     <button className="text-lg font-light outline-none focus:outline-none transform transition-all hover:scale-110 text-yellow-500 hover:text-yellow-600"><i className="mdi mdi-arrow-left mr-2"></i>Go Back</button>
                     </a>
                 </div>
                 
             </div>
             
         </div>
         <div className="w-64 md:w-96 h-96 md:h-full bg-blue-200 bg-opacity-30 absolute -top-64 md:-top-96 right-20 md:right-32 rounded-full pointer-events-none -rotate-45 transform"></div>
         <div className="w-96 h-full bg-yellow-200 bg-opacity-20 absolute -bottom-96 right-64 rounded-full pointer-events-none -rotate-45 transform"></div>
     </div>
     
     
     <div className="flex items-end justify-end fixed bottom-0 right-0 mb-4 mr-4 z-10">
         <div>
             <a title="Buy me a beer" href="https://www.buymeacoffee.com/scottwindon" target="_blank" className="block w-16 h-16 rounded-full transition-all shadow hover:shadow-lg transform hover:scale-110 hover:rotate-12">
                 <img className="object-cover object-center w-full h-full rounded-full" src="https://i.pinimg.com/originals/60/fd/e8/60fde811b6be57094e0abc69d9c2622a.jpg"/>
             </a>
         </div>
     </div>
             </div>
  ) : (
  <div className="flex items-center justify-center grid grid-cols-1 md:grid-cols-3 gap-4 ">
    {filteredbuydata.map((item, index) => (
      <div key={item.id} className="max-w-sm w-full sm:w-full lg:w-full py-6 px-3">
        <Link href={`/product?category=${category}&id=${item.id}`} className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="relative bg-cover bg-center h-56 p-4" style={{ backgroundImage: 'url(https://via.placeholder.com/450x450)' }}>
            <div className="absolute top-0 left-0 w-full h-full bg-opacity-50 bg-black flex items-center justify-center">
              <Carousel showThumbs={false} autoPlay>
                {item.imgSrc.map((image, index) => (
                  <div key={index}>
                    <img src={image} alt={`Image ${index}`} style={{ width: '336px', height: '216px' }} />
                  </div>
                ))}
              </Carousel>
            </div>
          </div>
          <div className="p-4">
            <p className="uppercase tracking-wide text-sm font-bold text-gray-700">{item.propertyName} • 5y old</p>
            <p className="text-gray-700">{item.location}</p>
            <div className="flex mt-2">
              {item.flatTypes.map((flat, index) => (
                <div key={index} className="px-2 py-1 border border-gray-300 mr-2">
                  <p className="text-gray-700 text-sm">{flat.type}</p>
                  <p className="text-green-500 font-bold text-sm">{flat.price}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex p-4 border-t border-gray-300 text-gray-700">
            <div className="flex-1 inline-flex items-center">
              <div className="text-green-500 mr-3">
                <FaBed className="h-6 w-6" />
              </div>
            </div>
            <div className="flex-1 inline-flex items-center">
              <div className="text-green-500 mr-3">
                <FaBath className="h-6 w-6" />
              </div>
            </div>
            <div className="flex-1 inline-flex items-center">
              <div className="text-green-500 mr-3">
                <FaCar className="h-6 w-6" />
              </div>
            </div>
            <div className="flex-1 inline-flex items-center">
              <div className="text-green-500 mr-3">
                <FaUtensils className="h-6 w-6" />
              </div>
            </div>
          </div>
          <div className="px-4 pt-3 pb-4 border-t border-gray-300 bg-gray-100">
            <div className="text-xs uppercase font-bold text-gray-600 tracking-wide">{item.status}</div>
            <div className="flex items-center pt-2">
              <div className="bg-cover bg-center w-10 h-10 rounded-full mr-3" style={{ backgroundImage: 'url(https://via.placeholder.com/50x50)' }}></div>
              <div>
                <p className="font-bold text-gray-900">{item.Owner}</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    ))}
  </div>
  )}
</div>
) : category === 'Rent' ? (
  <div className="flex flex-wrap justify-center">
 
{rentdata.length > 0 ? (
<div className="flex flex-wrap justify-center">
<div className=" p-16 bg-white grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
{rentdata
  .map((item, index) => (
    <div key={item.id} className="relative mx-auto w-full">
      <Link
        href={`/product?category=${category}&id=${item.id}`}
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
                    style={{ width: '196px', height: '196px' }}
                  />
                </div>
              ))}
            </Carousel>
          </div>

          <div className="mt-4 text-start">
            <h2 className="line-clamp-1   text-xl font-medium text-gray-800 md:text-sm" title="New York">
              {item.location}
            </h2>

            <p className="text-primary mt-2 inline-block whitespace-nowrap rounded-xl font-semibold leading-tight">
              <span className="text-sm">{item.PropertyName}</span>
            </p>
          </div>
          <div className="mt-4">
            <p className="line-clamp-1 mt-2 text-lg text-gray-800">{item.description}</p>
          </div>
          <div className="justify-center">
            <div className="mt-4 flex space-x-3 overflow-hidden rounded-lg px-1 py-1">
             
              <p className="flex items-center font-medium text-gray-800">
                <FaPersonCircleCheck className="mr-2 text-blue-900" />
                2
              </p>
              <p className="flex items-center font-medium text-gray-800">
                <FaHome className="mr-2 text-blue-900" />
               2
              </p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2">
            <div className="flex items-center">
              <div className="relative">
                <div className="h-6 w-6 rounded-full bg-gray-200 md:h-8 md:w-8"></div>
                <span className="bg-primary-red absolute top-0 right-0 inline-block h-3 w-3 rounded-full"></span>
              </div>

              <p className="line-clamp-1 ml-2 text-gray-800">{item.Owner}</p>
            </div>

            <div className="flex justify-end">
              <button>
                <FaSms className="mr-2 text-2xl text-red-300" />
              </button>
              <button>
                <FaPhone className="ml-4 text-2xl text-red-300" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  ))}
</div>
</div>
) : (
<div className='py-16'>

<style>@import url(https://cdnjs.cloudflare.com/ajax/libs/MaterialDesign-Webfont/5.3.45/css/materialdesignicons.min.css);</style>
<div className="min-w-screen min-h-screen bg-blue-100 flex items-center p-5 lg:p-20 overflow-hidden relative">
<div className="flex-1 min-h-full min-w-full rounded-3xl bg-white shadow-xl p-10 lg:p-20 text-gray-800 relative md:flex items-center text-center md:text-left">
<div className="w-full md:w-1/2">
<div className="w-24">
               <img
src="https://www.areneservices.in/public/front/images/property-logo.png"
className='h-24 w-24'
/>
<h2 className='text-[12px] font-semibold '>
<span className='text-emerald-500 inline'>Arene</span>
<span className='text-black inline'>Services</span>
</h2>
               </div>
   <div className="mb-10 md:mb-20 text-gray-600 font-light">
       <h1 className="font-black uppercase text-3xl lg:text-5xl text-yellow-500 mb-10">Wait Our Team Will Be Data Upload!</h1>
       
       <p>Try searching again or use the Go Back button below.</p>
   </div>
   <div className="mb-20 md:mb-0">
       <a href='/'>
       
       <button className="text-lg font-light outline-none focus:outline-none transform transition-all hover:scale-110 text-yellow-500 hover:text-yellow-600"><i className="mdi mdi-arrow-left mr-2"></i>Go Back</button>
       </a>
   </div>
   
</div>

</div>
<div className="w-64 md:w-96 h-96 md:h-full bg-blue-200 bg-opacity-30 absolute -top-64 md:-top-96 right-20 md:right-32 rounded-full pointer-events-none -rotate-45 transform"></div>
<div className="w-96 h-full bg-yellow-200 bg-opacity-20 absolute -bottom-96 right-64 rounded-full pointer-events-none -rotate-45 transform"></div>
</div>


<div className="flex items-end justify-end fixed bottom-0 right-0 mb-4 mr-4 z-10">
<div>
<a title="Buy me a beer" href="https://www.buymeacoffee.com/scottwindon" target="_blank" className="block w-16 h-16 rounded-full transition-all shadow hover:shadow-lg transform hover:scale-110 hover:rotate-12">
   <img className="object-cover object-center w-full h-full rounded-full" src="https://i.pinimg.com/originals/60/fd/e8/60fde811b6be57094e0abc69d9c2622a.jpg"/>
</a>
</div>
</div>
</div>
)}        </div>

      ) : (
        <div className="mt-16">
          <p className="text-sm text-gray-700">Please select location and category</p>
        </div>
      )}
    </div>

  );
};

export default DetailPage;
