import { useState, useEffect } from 'react';
import { firebase } from '../../Firebase/config';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import Modal from 'react-modal'; // Import react-modal
import { ToastContainer, toast } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify CSS

const Billing = () => {
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [garmentCount, setGarmentCount] = useState(''); // State for garment count
  const [pickupDate, setPickupDate] = useState(''); // State for pickup date
  const router = useRouter();
  const { orderId } = router.query;

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const db = firebase.firestore();
        const bookingRef = db.collection('laundryorders').where('orderId', '==', orderId);
        const snapshot = await bookingRef.get();

        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }

        snapshot.forEach((doc) => {
          setBookingData({ id: doc.id, ...doc.data() });
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [orderId]);

  const handleSendPickup = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Close the modal
  };


  const handlePrint = () => {
    window.print();
  };

const handleFormSubmit = async () => {
  if (parseInt(garmentCount) > bookingData.Noofgarment) {
    toast.error('Number of garments cannot exceed available garments.');
    return;
  }

  try {
    const db = firebase.firestore();
    const bookingRef = db.collection('laundryorders').where('orderId', '==', orderId);
    const snapshot = await bookingRef.get();

    if (snapshot.empty) {
      toast.error('No document to update.');
      console.error('Error: No matching documents found for orderId:', orderId);
      return;
    }

    let docId = null;
    snapshot.forEach((doc) => {
      docId = doc.id;
    });

    if (!docId) {
      toast.error('No document ID found.');
      console.error('Error: Document ID is null or undefined.');
      return;
    }

    const laundryOrdersRef = db.collection('laundryorders').doc(docId);
    console.log('Updating document with ID:', docId);

    await laundryOrdersRef.update({
      orderHistory: firebase.firestore.FieldValue.arrayUnion({
        garmentCount: parseInt(garmentCount),
        pickupDate: dayjs(pickupDate).format('YYYY-MM-DD'),
      })
    });

    toast.success('Pickup scheduled successfully!');
    setIsModalOpen(false);
  } catch (error) {
    toast.error('Error scheduling pickup. Please try again.');
    console.error('Error updating Firestore:', error);
  }
};

  

  if (loading) {
    return (
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
    );
  }

  if (!bookingData) {
    return <div>No booking found for orderId: {orderId}</div>;
  }

  const duePayment = bookingData.totalpayment - bookingData.Payment;
  const start = dayjs(bookingData.checkIn);
  const end = dayjs(bookingData.checkOut);
  const totalDays = end.diff(start, 'days') || 1;
  const subtotal = bookingData.totalDays * bookingData.roomprice;
  return (
    <div className='min-h-screen py-12' >
        <div className=" px-4 sm:px-6 lg:px-8  my-4 sm:my-10">

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
        <dt className="min-w-36 max-w-[200px] text-gray-500">
         Order Status:
        </dt>
        <dd className="font-medium text-gray-800 dark:text-gray-200">
        {bookingData.orderstatus}
        </dd>
      </dl>
      {/* <dl className="grid sm:flex gap-x-3 text-sm">
  <dt className="min-w-36 max-w-[200px] text-gray-500">Start date:</dt>
  <dd className="font-medium text-gray-800 dark:text-gray-200">{bookingData.bookingDate.checkIn}</dd>
</dl> */}



   
    </div>
  </div>
</div>
<div class="mt-6 overflow-x-auto">
  <table class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
    <thead class="bg-gray-50 dark:bg-gray-800">
      <tr>
        <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
        <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
        <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Delivery In</th>
        <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
        <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">No. of Garments Available</th>
        <th scope="col" class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase">Amount Paid</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200">
  <tr>
    <td class="px-3 py-2 whitespace-nowrap">{bookingData.Service}</td>
    <td class="px-3 py-2 whitespace-nowrap">{bookingData.address}</td>
    <td class="px-3 py-2 whitespace-nowrap">{bookingData.selectedTenure}</td>
    <td class="px-3 py-2 whitespace-nowrap">₹ {bookingData.totalpayment}</td>
    <td class="px-3 py-2 whitespace-nowrap">{bookingData.Noofgarment}</td>
    <td class="px-3 py-2 text-right whitespace-nowrap">₹{bookingData.Payment}</td>
  </tr>
</tbody>

  </table>
</div>
<div className="inline-flex gap-x-2 mt-2">
    
               <button onClick={handleSendPickup}  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">

              Send Pickup to Washman
            </button>
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




<Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center p-4 bg-gray-800 bg-opacity-75"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Schedule Pickup</h2>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Number of Garments</label>
              <input
                type="number"
                value={garmentCount}
                onChange={(e) => setGarmentCount(e.target.value)}
                className="mt-1 block w-full border border-gray-300 p-1 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Pickup Date</label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="mt-1 block w-full p-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleFormSubmit}
                className="py-2 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={handleModalClose}
                className="py-2 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>


  

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
<ToastContainer/>
    </div>
  )
}

export default Billing