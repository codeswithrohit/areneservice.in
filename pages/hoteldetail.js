import React, { useState, useEffect } from 'react';
import { firebase } from '../Firebase/config';
import 'firebase/firestore';
import 'firebase/storage';
import { useRouter } from 'next/router';
import Select from 'react-select';
import { DatePicker } from 'antd';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';

const HotelDetailsViewCard = () => {
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDays, setTotalDays] = useState(0);

  const router = useRouter();
  const [pgdetaildata, setPgdetaildata] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    const db = firebase.firestore();
    const pgRef = db.collection('Hoteldetail').doc(id);

    pgRef.get().then((doc) => {
      if (doc.exists) {
        setPgdetaildata(doc.data());
      } else {
        console.log('Document not found!');
      }
      setIsLoading(false);
    });
  }, []);

  const handleCheckInChange = (date, dateString) => {
    setDateRange({
      ...dateRange,
      startDate: date.toDate(),
    });
  };

  const handleCheckOutChange = (date, dateString) => {
    setDateRange({
      ...dateRange,
      endDate: date.toDate(),
    });
  };

  const handleRoomSelect = (selectedOption) => {
    setSelectedRoom(selectedOption);
  };

  useEffect(() => {
    if (selectedRoom && dateRange.startDate && dateRange.endDate) {
      const days = moment(dateRange.endDate).diff(moment(dateRange.startDate), 'days');
      const price = days * selectedRoom.price;
      setTotalPrice(price);
      setTotalDays(days);
    }
  }, [selectedRoom, dateRange]);

  const handleConfirmBooking = () => {
    if (selectedRoom && dateRange.startDate && dateRange.endDate) {
      const formattedCheckInDate = moment(dateRange.startDate).format('DD-MM-YYYY');
      const formattedCheckOutDate = moment(dateRange.endDate).format('DD-MM-YYYY');
      router.push({
        pathname: '/bookings',
        query: {
          Name: pgdetaildata.HotelName,
          Agentid: pgdetaildata.AgentId,
          location: pgdetaildata.location,
          roomType: selectedRoom.type,
          roomprice: selectedRoom.price,
          checkInDate: formattedCheckInDate,
          checkOutDate: formattedCheckOutDate,
          totalPrice: totalPrice,
          totalDays: totalDays
        }
      });
    } else {
      toast.error('Please select a room type, check-in date, and check-out date');
    }
  };

  const roomOptions = pgdetaildata.roomTypes ? pgdetaildata.roomTypes.map((room) => ({
    value: room.type,
    label: `${room.type} - ${room.price} INR - ${room.availability} Avail.`,
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
                {pgdetaildata.imgSrc.map((image, index) => (
                  <div key={index}>
                    <img src={image} className='h-96 w-96 rounded-lg' alt={`Image ${index}`} />
                  </div>
                ))}
              </Carousel>
            </div>
            <div className="p-4">
              <h2 className="text-3xl font-semibold text-gray-800 mb-2">{pgdetaildata.HotelName}</h2>
              <p className="text-sm text-gray-600 mb-4">
                {pgdetaildata.location.split(',').slice(-4).join(', ')}
              </p>
              <div className="mt-2 space-y-2">
                <p>{pgdetaildata.description}</p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm font-bold text-gray-900">
                  <span className="font-bold">Benefits:</span> {pgdetaildata.benefits ? pgdetaildata.benefits.join(' | ') : 'No benefits specified'}
                </p>
              </div>
              <div className="relative mt-4">
                <div className="aspect-w-16 aspect-h-9">
                  <video controls className="rounded-lg shadow-lg">
                    <source src={pgdetaildata.videoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-2 bg-white shadow-xl rounded-xl overflow-hidden h-screen mt-2 w-full md:w-[380px]">
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
                <div className="font-semibold text-gray-800">Check-out Date</div>
                <DatePicker
                  onChange={handleCheckOutChange}
                  format="YYYY-MM-DD"
                  placeholder="Check-Out Date"
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
              {totalPrice > 0 && (
                <div className="mb-4">
                  <div className="font-semibold text-gray-800">Total Price</div>
                  <div className="text-gray-600">{totalPrice} INR</div>
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

export default HotelDetailsViewCard;
