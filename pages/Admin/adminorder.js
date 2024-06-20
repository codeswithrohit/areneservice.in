import { useState, useEffect } from 'react';
import { firebase } from '../../Firebase/config';
import { useRouter } from 'next/router';
import dayjs from 'dayjs'; // Import dayjs
import AdminNavbar from '../../components/AdminNavbar';
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

    fetchBookingDetails();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };
  if (loading) {
    return <div class="flex min-h-screen justify-center items-center">
    <img class="w-20 h-20 animate-spin" src="https://www.svgrepo.com/show/70469/loading.svg" alt="Loading icon"/>
</div>;
  }

  if (!bookingData) {
    return <div>No booking found for orderId: {orderId}</div>;
  }

  // Render booking details using bookingData
  const duePayment = bookingData.totalpayment - bookingData.Payment;
  const start = dayjs(bookingData.checkIn);
  const end = dayjs(bookingData.checkOut);
  const totalDays = end.diff(start, 'days') || 1; // Set default value to 1 if totalDays is 0
  const subtotal = bookingData.totalDays * bookingData.roomprice;
  return (
    <div className='min-h-screen py-12' >
        <AdminNavbar/>
        <div className=" lg:ml-64 max-w-[85rem] px-4 sm:px-6 lg:px-8  my-4 sm:my-10">

<div className="mb-5 pb-5 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
  <div>
    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Invoice</h2>
  </div>

  <div className="inline-flex gap-x-2">
    {/* <a className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-lg border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800" href="#">
      <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
      Invoice PDF
    </a> */}
               <button onClick={handlePrint} className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
              <svg className="flex-shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>
              Print
            </button>

  </div>
</div>

<div className="grid md:grid-cols-2 gap-3">
  <div>
    <div className="grid space-y-3">
      <dl className="grid sm:flex gap-x-3 text-sm">
        <dt className="min-w-36 max-w-[200px] text-gray-500">
          Billed to:
        </dt>
        <dd className="text-gray-800 flex flex-col dark:text-gray-200">
          <a className="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline font-medium" href="#">
          {bookingData.firstName} {bookingData.lastName}
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
        <dt className="min-w-36 max-w-[200px] text-gray-500">
          Your address:
        </dt>
        <dd className="font-medium text-gray-800 dark:text-gray-200">
          {/* <span className="block font-semibold">Sara Williams</span> */}
          <address className="not-italic font-normal">
           {bookingData.address}
          </address>
        </dd>
      </dl>

      {/* <dl className="grid sm:flex gap-x-3 text-sm">
        <dt className="min-w-36 max-w-[200px] text-gray-500">
          Shipping details:
        </dt>
        <dd className="font-medium text-gray-800 dark:text-gray-200">
          <span className="block font-semibold">Sara Williams</span>
          <address className="not-italic font-normal">
            280 Suzanne Throughway,<br />
            Breannabury, OR 45801,<br />
            United States<br />
          </address>
        </dd>
      </dl> */}
    </div>
  </div>

  <div>
    <div className="grid space-y-3">
      <dl className="grid sm:flex gap-x-3 text-sm">
        <dt className="min-w-36 max-w-[200px] text-gray-500">
          Order number:
        </dt>
        <dd className="font-medium text-gray-800 dark:text-gray-200">
        {bookingData.orderId}
        </dd>
      </dl>

      {/* <dl className="grid sm:flex gap-x-3 text-sm">
        <dt className="min-w-36 max-w-[200px] text-gray-500">
          Currency:
        </dt>
        <dd className="font-medium text-gray-800 dark:text-gray-200">
          USD - US Dollar
        </dd>
      </dl> */}

      <dl className="grid sm:flex gap-x-3 text-sm">
        <dt className="min-w-36 max-w-[200px] text-gray-500">
          Payment date:
        </dt>
        <dd className="font-medium text-gray-800 dark:text-gray-200">
        {bookingData.OrderDate}
        </dd>
      </dl>
      <dl className="grid sm:flex gap-x-3 text-sm">
  <dt className="min-w-36 max-w-[200px] text-gray-500">Check In date:</dt>
  <dd className="font-medium text-gray-800 dark:text-gray-200">{bookingData.bookingDate.checkIn}</dd>
</dl>
{bookingData.bookingDate.checkOut ? (
<dl className="grid sm:flex gap-x-3 text-sm">
  <dt className="min-w-36 max-w-[200px] text-gray-500">Check Out date:</dt>
  <dd className="font-medium text-gray-800 dark:text-gray-200">{bookingData.bookingDate.checkOut}</dd>
</dl>
  ) : null}


      {/* <dl className="grid sm:flex gap-x-3 text-sm">
        <dt className="min-w-36 max-w-[200px] text-gray-500">
          Billing method:
        </dt>
        <dd className="font-medium text-gray-800 dark:text-gray-200">
          Send invoice
        </dd>
      </dl> */}
    </div>
  </div>
</div>
<div class="mt-6 overflow-x-auto">
  <table class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
    <thead class="bg-gray-50 dark:bg-gray-800">
      <tr>
        <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
        <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
        <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
        <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Room Price</th>
        <th scope="col" class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Amount Paid</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200">
      <tr>
        <td class="px-3 py-2 whitespace-nowrap">{bookingData.Propertyname}</td>
        <td class="px-3 py-2 whitespace-nowrap">{bookingData.roomType}</td>
        <td class="px-3 py-2 whitespace-nowrap">{bookingData.Location}</td>
        <td class="px-3 py-2 whitespace-nowrap">₹{bookingData.roomprice}</td>
        <td class="px-3 py-2 text-right whitespace-nowrap">₹{bookingData.Payment}</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="mt-8 flex sm:justify-end">
<div class="w-full max-w-2xl sm:text-end space-y-2">

<div class="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">

{bookingData.totalDays ? (
  <dl class="grid sm:grid-cols-5 gap-x-3 text-sm">
  <dt class="col-span-3 text-gray-500">Subtotal:</dt>
  <dd class="col-span-2 font-medium text-gray-800 dark:text-gray-200">
          Total Days * Room Price: {bookingData.totalDays} * {bookingData.roomprice} = ₹{subtotal}
        </dd>
</dl>

  ) :    <dl class="grid sm:grid-cols-5 gap-x-3 text-sm">
  <dt class="col-span-3 text-gray-500">Subtotal:</dt>
  <dd class="col-span-2 font-medium text-gray-800 dark:text-gray-200">
          {bookingData.totalpayment}
        </dd>
</dl>}






  

  <dl class="grid sm:grid-cols-5 gap-x-3 text-sm">
    <dt class="col-span-3 text-gray-500">Amount paid:</dt>
    <dd class="col-span-2 font-medium text-gray-800 dark:text-gray-200">₹{bookingData.Payment}</dd>
  </dl>

  <dl class="grid sm:grid-cols-5 gap-x-3 text-sm">
    <dt class="col-span-3 text-gray-500">Due payment:</dt>
    <dd class="col-span-2 font-medium text-gray-800 dark:text-gray-200">₹{duePayment.toFixed(2)}</dd>
  </dl>
</div>
</div>
</div>
</div>
    </div>
  )
}

export default Billing