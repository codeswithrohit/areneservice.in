import React, { useState, useEffect } from 'react';
import { firebase } from '../Firebase/config';
import 'firebase/firestore';
import 'firebase/storage';
import { useRouter } from 'next/router';
import Select from 'react-select';
import { DatePicker } from 'antd';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

const RentDetailsViewCard = () => {
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });
  const [selectedRoom, setSelectedRoom] = useState(null);

  const router = useRouter();
  const [rentdetaildata, setRentdetaildata] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    const db = firebase.firestore();
    const pgRef = db.collection('rentdetail').doc(id);

    pgRef.get().then((doc) => {
      if (doc.exists) {
        setRentdetaildata(doc.data());
      } else {
        console.log('Document not found!');
      }
      setIsLoading(false);
    });
  }, []);

  const handleCheckInChange = (date, dateString) => {
    setDateRange({
      ...dateRange,
      startDate: date.toDate(), // Convert dayjs object to JavaScript Date object
    });
  };

  const handleRoomSelect = (selectedOption) => {
    setSelectedRoom(selectedOption);
  };

  const handleConfirmBooking = () => {
    if (selectedRoom && dateRange.startDate) {
      const formattedDate = moment(dateRange.startDate).format('DD-MM-YYYY');
      router.push({
        pathname: '/booking',
        query: {
          Name: rentdetaildata.Propertyname,
          Agentid: rentdetaildata.AgentId,
          location: rentdetaildata.location,
          roomType: selectedRoom.type, // Change selectedProperty to selectedRoom
          roomprice: selectedRoom.price, // Change selectedProperty to selectedRoom
          checkInDate: formattedDate // Ensure date is in dd-MM-yyyy format
        }
      });
    } else {
      toast.error('Please select a room type and check-in date');
    }
  };

  const roomOptions = rentdetaildata.propertytypes ? rentdetaildata.propertytypes.map((room) => ({
    value: room.type,
    label: `${room.type} - ${room.price} INR -${room.availability} Aval.`,
    type: room.type,
    price: room.price,
    availability: room.availability
  })) : [];

  return (
    <div className='py-4'>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <button type="button"
            className="px-6 py-2.5 rounded-full text-white text-sm tracking-wider font-semibold border-none outline-none bg-[#43d3b0] hover:bg-orange-700 active:bg-[#43d3b0]">
            Loading
            <svg xmlns="http://www.w3.org/2000/svg" width="18px" fill="#fff" className="ml-2 inline animate-spin" viewBox="0 0 24 24">
              <path fillRule="evenodd"
                d="M7.03 2.757a1 1 0 0 1 1.213-.727l4 1a1 1 0 0 1 .59 1.525l-2 3a1 1 0 0 1-1.665-1.11l.755-1.132a7.003 7.003 0 0 0-2.735 11.77 1 1 0 0 1-1.376 1.453A8.978 8.978 0 0 1 3 12a9 9 0 0 1 4.874-8l-.117-.03a1 1 0 0 1-.727-1.213zm10.092 3.017a1 1 0 0 1 1.414.038A8.973 8.973 0 0 1 21 12a9 9 0 0 1-5.068 8.098 1 1 0 0 1-.707 1.864l-3.5-1a1 1 0 0 1-.557-1.517l2-3a1 1 0 0 1 1.664 1.11l-.755 1.132a7.003 7.003 0 0 0 3.006-11.5 1 1 0 0 1 .039-1.413z"
                clipRule="evenodd" data-original="#000000" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="flex items-start justify-center flex-wrap md:flex-nowrap container mx-auto p-4">
          <div className="w-full md:w-[800px] bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="relative w-full">
              <Carousel showThumbs={false} autoPlay>
                {rentdetaildata.imgSrc.map((image, index) => (
                  <div key={index}>
                    <img src={image} className='h-96 w-96 rounded-lg' alt={`Image ${index}`} />
                  </div>
                ))}
              </Carousel>
            </div>
            <div className="p-4">
              <h2 className="text-3xl font-semibold text-gray-800 mb-2">{rentdetaildata.Propertyname}</h2>
              <p className="text-sm text-gray-600 mb-4">
                {rentdetaildata.location.split(',').slice(-4).join(', ')}
              </p>
              <div className="mt-2 space-y-2">
                <p>{rentdetaildata.description}</p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm font-bold text-gray-900">
                  <span className="font-bold">Benefits:</span> {rentdetaildata.benefits ? rentdetaildata.benefits.join(' | ') : 'No benefits specified'}
                </p>
              </div>
              <div className="relative mt-4">
                <div className="aspect-w-16 aspect-h-9">
                  <video controls className="rounded-lg shadow-lg">
                    <source src={rentdetaildata.videoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-2 h-screen bg-white shadow-xl rounded-xl overflow-hidden mt-2 w-full md:w-[380px]">
            <div className="px-6 py-4 bg-blue-600 text-white">
              <h2 className="text-xl font-bold">Booking Details</h2>
            </div>
            <div className="p-6 text-sm md:text-base">
              <div className="mb-4">
                <div className="font-semibold text-gray-800">Check-in Date</div>
                <DatePicker
                  onChange={handleCheckInChange}
                  format="YYYY-MM-DD"
                  placeholder="Check-in Date"
                  style={{ width: '100%' }}
                />
              </div>
              <div className="mb-4">
                <div className="font-semibold text-gray-800">Room Type</div>
                <Select
                  options={roomOptions}
                  onChange={handleRoomSelect}
                  placeholder="Select Room Type"
                />
              </div>
              {selectedRoom && (
                <div className="mb-4">
                  <div className="font-semibold text-gray-800">Price-Availability</div>
                  <div className="text-gray-600">{selectedRoom.price} INR - {selectedRoom.availability} Avail. </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 bg-gray-50">
              <button 
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-yellow-600 transition duration-300"
                onClick={handleConfirmBooking}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default RentDetailsViewCard;
