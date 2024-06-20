
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { firebase } from '../Firebase/config';
import Link from 'next/link';
import Layout from '../src/layouts/Layout';
const Cart = ({ addToCart, cart, removeFromCart, clearCart, subTotal }) => {
  console.log(cart)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // Get the router instance

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
        // If user is not authenticated, redirect to the login page
        router.push('/login'); // Modify the '/login' path according to your login page route
      }
    });

    return () => unsubscribe();
  }, [router]);
  if (!user) {
    // If productdata is undefined or null, you can return a loading state or handle it as per your requirement.
    return  <div className="preloader">
    <div className="loader">
      {/* You can use the img tag to display the 'ramji.gif' image */}
      <img className="h-48 w-48" src="ramji.gif" alt="Loading..." />
      {/* You can retain your existing loader structure if needed */}
      
    </div>
  </div>; // You can replace this with your loading component or message
  }
  return (
    <div>
    <div className='min-h-screen'>
        <section class="flex items-center pt-10 bg-white  font-poppins dark:bg-gray-700 ">
<div class="justify-center flex-1 px-4 py-6 mx-auto max-w-7xl lg:py-4 md:px-6">
<div class="p-8 bg-gray-50 dark:bg-gray-800">
<h2 class="mb-8 text-4xl font-bold dark:text-gray-400">Your Cart</h2>
<div class="flex flex-wrap -mx-4">
<div class="w-full px-4 mb-8 xl:w-8/12 xl:mb-0">
<div class="flex flex-wrap items-center mb-6 -mx-4 md:mb-8">
<div class="w-full md:block hidden px-4 mb-6 md:w-4/6 lg:w-6/12 md:mb-0">
<h2 class="font-bold text-gray-500 dark:text-gray-400">Product name</h2>
</div>
<div class="hidden px-4 lg:block lg:w-2/12">
<h2 class="font-bold text-gray-500 dark:text-gray-400">Price</h2>
</div>
<div class="hidden md:block px-4 md:w-1/6 lg:w-2/12 ">
<h2 class="font-bold text-gray-500 dark:text-gray-400">Quantity</h2>
</div>

</div>

{Object.keys(cart).length==0 &&
  <div className='text-center text-orange-500 text-xl justify-center mb-12'>No item in the cart</div>
   }
{Object.keys(cart).map((k)=>{ return<div key={k} class="py-4 mb-8 border-t border-b border-gray-200 dark:border-gray-700">
<div class="flex flex-wrap items-center mb-6 -mx-4 md:mb-8">
<div class="w-full px-4 mb-6 md:w-4/6 lg:w-6/12 md:mb-0">
<div class="flex flex-wrap items-center -mx-4">

<div class="w-2/3 px-4">
<h2 class="mb-2 text-xl font-bold dark:text-gray-400">{cart[k].service}-{cart[k].productname}</h2>
</div>
</div>
</div>
<div class="hidden px-4 lg:block lg:w-2/12">
<p class="text-lg font-bold text-orange-500 dark:text-gray-400">₹{cart[k].price}</p>
</div>
<div class="w-auto px-4 md:w-1/6 lg:w-2/12 ">
<div class="inline-flex items-center px-4 font-semibold text-gray-500 border border-gray-200 rounded-md dark:border-gray-700 ">
<button onClick={()=>{removeFromCart(k,1,cart[k].price,cart[k].bookName)}} class="py-2 hover:text-gray-700 dark:text-gray-400">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
<path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"></path>
</svg>
</button>
<div className="w-12 px-2 py-4 text-center border-0 rounded-md dark:bg-gray-800 bg-gray-50 dark:text-gray-400 md:text-right">
  {cart[k].qty}
</div>
<button  onClick={()=>{addToCart(k,1,cart[k].price,cart[k].bookName)}} class="py-2 hover:text-gray-700 dark:text-gray-400">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
<path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"></path>
</svg>
</button>
</div>
</div>

</div>

</div>
})}


</div>
<div class="w-full px-4 xl:w-4/12">
<div class="p-6 border border-orange-100 dark:bg-gray-900 dark:border-gray-900 bg-orange-50 md:p-8">
<h2 class="mb-8 text-3xl font-bold text-gray-700 dark:text-gray-400">Order Summary</h2>
<div class="flex items-center justify-between pb-4 mb-4 border-b border-gray-300 dark:border-gray-700 ">
<span class="text-gray-700 dark:text-gray-400">Subtotal</span>
<span class="text-xl font-bold text-gray-700 dark:text-gray-400 ">₹{subTotal}</span>
</div>
<div class="flex items-center justify-between pb-4 mb-4 ">
<span class="text-gray-700 dark:text-gray-400 ">Shipping</span>
<span class="text-xl font-bold text-gray-700 dark:text-gray-400 ">Free</span>
</div>
<div class="flex items-center justify-between pb-4 mb-4 ">
<span class="text-gray-700 dark:text-gray-400">Order Total</span>
<span class="text-xl font-bold text-gray-700 dark:text-gray-400">₹{subTotal}.00</span>
</div>
<h2 class="text-lg text-gray-500 dark:text-gray-400">We offer:</h2>
<div class="flex items-center mb-4 ">
<a href="#">
<img src="https://i.postimg.cc/g22HQhX0/70599-visa-curved-icon.png" alt="" class="object-cover h-16 mr-2 w-26"/>
</a>
<a href="#">
 <img src="https://i.postimg.cc/HW38JkkG/38602-mastercard-curved-icon.png" alt="" class="object-cover h-16 mr-2 w-26"/>
</a>
<a href="#">
<img src="https://i.postimg.cc/HL57j0V3/38605-paypal-straight-icon.png" alt="" class="object-cover h-16 mr-2 w-26"/>
</a>
</div>
<div class="flex items-center justify-between ">
<button onClick={clearCart} class="block w-full mr-4 py-4 font-bold text-center text-gray-100 uppercase bg-orange-500 rounded-md hover:bg-orange-600">Clear Cart</button>
<button class="block w-full mr-4 py-4 font-bold text-center text-gray-100 uppercase bg-orange-500 rounded-md hover:bg-orange-600">
<a  href='/checkout' >Checkout</a>
</button>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
    </div>
    </div>
  )
}

export default Cart