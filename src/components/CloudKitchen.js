import React, { useState, useEffect } from 'react';
import { firebase } from "../../Firebase/config";
import "firebase/firestore";

const Food = ({addToCart}) => {
  const [productdata, setProductData] = useState([]);
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = firebase.firestore();
        const productRef = db.collection('Prasadam');
        const snapshot = await productRef.get();
        const data = [];
        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        setProductData(data);
        setFoods(data); // Initialize foods with fetched data
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  // Filter Type burgers/pizza/etc
  const filterType = (service) => {
    if (service === 'all') {
      setFoods(productdata); // Reset to original data
    } else {
      setFoods(productdata.filter((item) => item.service === service));
    }
  };

  // Filter by price
  const filterPrice = (price) => {
    if (price === 'all') {
      setFoods(productdata); // Reset to original data
    } else {
      setFoods(productdata.filter((item) => item.price === price));
    }
  };
  return (
    <div className='max-w-[1640px] m-auto px-4 py-12 bg-white '>
      <h1 className='text-emerald-600 font-bold text-4xl text-center'>
        Top Rated Menu Items
      </h1>

      {/* Filter Row */}
      <div className='flex flex-col lg:flex-row justify-between'>
        {/* Fliter Type */}
        <div>
          <p className='font-bold text-gray-700'>Filter Type</p>
          <div className='flex justfiy-between flex-wrap'>
            <button
              onClick={() => setFoods(productdata)}
              className='m-1 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white'
            >
              All
            </button>
            <button
              onClick={() => filterType('Burger')}
              className='m-1 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white'
            >
              Burgers
            </button>
            <button
              onClick={() => filterType('pizza')}
              className='m-1 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white'
            >
              Pizza
            </button>
            <button
              onClick={() => filterType('salad')}
              className='m-1 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white'
            >
              Salads
            </button>
            <button
              onClick={() => filterType('chicken')}
              className='m-1 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white'
            >
              Chicken
            </button>
          </div>
        </div>

        {/* Filter Price */}
        <div>
          <p className='font-bold text-gray-700'>Filter Price</p>
          <div className='flex justify-between max-w-[390px] w-full'>
            <button
              onClick={() => filterPrice('$')}
              className='m-1 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white'
            >
              $
            </button>
            <button
              onClick={() => filterPrice('$$')}
              className='m-1 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white'
            >
              $$
            </button>
            <button
              onClick={() => filterPrice('$$$')}
              className='m-1 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white'
            >
              $$$
            </button>
            <button
              onClick={() => filterPrice('$$$$')}
              className='m-1 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white'
            >
              $$$$
            </button>
          </div>
        </div>
      </div>

      {/* Display foods */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-6 pt-4'>
        {foods.map((item, index) => (
          <div
            key={index}
            className='border shadow-lg rounded-lg hover:scale-105 duration-300'
          >
            <img
              src={item.frontImage}
              alt={item.productname}
              className='w-full h-[200px] object-cover rounded-t-lg'
            />
            <div className='flex justify-between px-2 py-4'>
              <p className='font-bold'>{item.productname}</p>
              <p>
                <span className='bg-emerald-500 text-white p-1 rounded-full'>
                ₹ {item.price}
                </span>
              </p>
            </div>
            <div onClick={() => addToCart(item.id, 1, item.price, item.service, item.productname)}  className='flex justify-center cursor-pointer items-center bg-emerald-500 px-4 py-4 rounded-lg'>
  <p className='font-bold text-white '>Add To Cart</p>
</div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Food;