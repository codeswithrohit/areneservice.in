import { useState, useEffect } from 'react';
import { firebase } from '../Firebase/config';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';

const Billing = () => {
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { orderId } = router.query;

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const db = firebase.firestore();
        const bookingRef = db.collection('bookings').where('orderId', '==', orderId);
        const snapshot = await bookingRef.get();

        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }

        snapshot.forEach((doc) => {
          setBookingData(doc.data());
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setLoading(false);
      }
    };

    if (orderId) {
      fetchBookingDetails();
    }
  }, [orderId]);

  console.log("Bookingdetails",bookingData)

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <button
          type="button"
          className="px-6 py-2.5 rounded-full text-white text-sm tracking-wider font-semibold border-none outline-none bg-[#43d3b0] hover:bg-orange-700 active:bg-[#43d3b0]"
        >
          Loading
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18px"
            fill="#fff"
            className="ml-2 inline animate-spin"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M7.03 2.757a1 1 0 0 1 1.213-.727l4 1a1 1 0 0 1 .59 1.525l-2 3a1 1 0 0 1-1.665-1.11l.755-1.132a7.003 7.003 0 0 0-2.735 11.77 1 1 0 0 1-1.376 1.453A8.978 8.978 0 0 1 3 12a9 9 0 0 1 4.874-8l-.117-.03a1 1 0 0 1-.727-1.213zm10.092 3.017a1 1 0 0 1 1.376-1.453A8.978 8.978 0 0 1 21 12a9 9 0 0 1-4.874 8l.117.03a1 1 0 0 1 .727 1.213 1 1 0 0 1-1.213.727l-4-1a1 1 0 0 1-.59-1.525l2-3a1 1 0 0 1 1.665 1.11l-.755 1.132a7.003 7.003 0 0 0 2.735-11.77z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    );
  }

  if (!bookingData) {
    return <div>No booking found for orderId: {orderId}</div>;
  }

  const duePayment = bookingData.totalpayment - bookingData.Payment;
  const start = dayjs(bookingData.checkInDate);
  const end = dayjs(bookingData.checkOutDate);
  const totalDays = end.diff(start, 'days') || 1;
  const subtotal = bookingData.totalDays * bookingData.roomprice;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto my-4 sm:my-10">
        <div className="mb-5 pb-5 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Invoice</h2>
          </div>

          <div className="inline-flex gap-x-2">
            <button
              onClick={handlePrint}
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
            >
              <svg
                className="flex-shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect width="12" height="8" x="6" y="14" />
              </svg>
              Print
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <div className="grid space-y-3">
              <dl className="grid sm:flex gap-x-3 text-sm">
                <dt className="min-w-36 max-w-[200px] text-gray-500">Billed to:</dt>
                <dd className="text-gray-800 flex flex-col dark:text-gray-200">
                  <a className="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline font-medium" href="#">
                    {bookingData.Name}
                  </a>
                  <a className="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline font-medium" href="#">
                    {bookingData.email}
                  </a>
                  <a className="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline font-medium" href="#">
                    {bookingData.phoneNumber}
                  </a>
                </dd>
              </dl>

              <dl className="grid sm:flex gap-x-3 text-sm">
                <dt className="min-w-36 max-w-[200px] text-gray-500">Your address:</dt>
                <dd className="font-medium text-gray-800 dark:text-gray-200">
                  <address className="not-italic font-normal">{bookingData.address}</address>
                </dd>
              </dl>
            </div>
          </div>

          <div>
            <div className="grid space-y-3">
              <dl className="grid sm:flex gap-x-3 text-sm">
                <dt className="min-w-36 max-w-[200px] text-gray-500">Order number:</dt>
                <dd className="font-medium text-gray-800 dark:text-gray-200">{bookingData.orderId}</dd>
              </dl>

              <dl className="grid sm:flex gap-x-3 text-sm">
                <dt className="min-w-36 max-w-[200px] text-gray-500">Payment date:</dt>
                <dd className="font-medium text-gray-800 dark:text-gray-200">{bookingData.OrderDate}</dd>
              </dl>

              <dl className="grid sm:flex gap-x-3 text-sm">
                <dt className="min-w-36 max-w-[200px] text-gray-500">Check In date:</dt>
                <dd className="font-medium text-gray-800 dark:text-gray-200">{bookingData.bookingDate.checkInDate}</dd>
              </dl>
              {bookingData.bookingDate.checkOutDate && (
  <dl className="grid sm:flex gap-x-3 text-sm">
    <dt className="min-w-36 max-w-[200px] text-gray-500">Check Out date:</dt>
    <dd className="font-medium text-gray-800 dark:text-gray-200">{bookingData.bookingDate.checkOutDate}</dd>
  </dl>
)}

            </div>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Room
                </th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Location
                </th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Room Price
                </th>
                <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  Amount Paid
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-3 py-2 whitespace-nowrap">{bookingData.Propertyname}</td>
                <td className="px-3 py-2 whitespace-nowrap">{bookingData.roomType}</td>
                <td className="px-3 py-2 whitespace-nowrap">{bookingData.Location}</td>
                <td className="px-3 py-2 whitespace-nowrap">₹{bookingData.roomprice}</td>
                <td className="px-3 py-2 text-right whitespace-nowrap">₹{bookingData.Payment}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex sm:justify-end">
          <div className="w-full max-w-2xl sm:text-end space-y-2">
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">
              <dl className="grid sm:grid-cols-5 gap-x-3 text-sm">
                <dt className="col-span-3 text-gray-500">Subtotal:</dt>
                <dd className="col-span-2 font-medium text-gray-800 dark:text-gray-200">
                  {bookingData.totalDays ? `Total Days * Room Price: ${bookingData.totalDays} * ${bookingData.roomprice} = ₹${subtotal}` : `₹${bookingData.totalpayment}`}
                </dd>
              </dl>

              <dl className="grid sm:grid-cols-5 gap-x-3 text-sm">
                <dt className="col-span-3 text-gray-500">Amount paid:</dt>
                <dd className="col-span-2 font-medium text-gray-800 dark:text-gray-200">₹{bookingData.Payment}</dd>
              </dl>

              <dl className="grid sm:grid-cols-5 gap-x-3 text-sm">
                <dt className="col-span-3 text-gray-500">Due payment:</dt>
                <dd className="col-span-2 font-medium text-gray-800 dark:text-gray-200">₹{duePayment.toFixed(2)}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
