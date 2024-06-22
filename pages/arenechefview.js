import React, { useState, useEffect } from 'react';
import { firebase } from '../Firebase/config';
import 'firebase/firestore';
import 'firebase/storage';
import { useRouter } from 'next/router';

const AreneChef = () => {
    const router = useRouter();
    const [fetchedData, setFetchedData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTenure, setSelectedTenure] = useState(0);
    const [quantity, setQuantity] = useState(0);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
    
        const db = firebase.firestore();
        const pgRef = db.collection('Cloud Kitchen').doc(id);
    
        pgRef.get().then((doc) => {
            if (doc.exists) {
                const data = doc.data();
                setFetchedData(data);
                setQuantity(parseInt(data.Foodcharge[0].noofthalli)); // Set initial quantity to the noofthalli of the first package
                console.log("Data", data);
            } else {
                console.log('Document not found!');
            }
            setIsLoading(false);
        });
    }, []);

    const handleTenureClick = (index) => {
        setSelectedTenure(index);
        setQuantity(parseInt(fetchedData.Foodcharge[index].noofthalli)); // Set quantity to noofthalli of selected package
    };

    const handleBuyNow = () => {
        if (fetchedData && selectedTenure !== null) {
            const selectedTenureData = fetchedData.Foodcharge[selectedTenure];
            const query = {
                thaliname: fetchedData.thaliname,
                Foodname: fetchedData.Foodname,
                Ingredients: fetchedData.Ingredients,
                selectedTenure: selectedTenureData.tenure,
                selectedPrice: getCurrentPrice().toFixed(2),
                selectedNoOfThali: quantity,
            };

            router.push({
                pathname: '/kitchencheckout',
                query: query,
            });
        }
    };

    const increaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const decreaseQuantity = () => {
        setQuantity(prevQuantity => Math.max(prevQuantity - 1, parseInt(fetchedData.Foodcharge[selectedTenure].noofthalli)));
    };

    const getCurrentPrice = () => {
        if (!fetchedData || selectedTenure === null) return 0;
        const selectedTenureData = fetchedData.Foodcharge[selectedTenure];
        const basePrice = parseFloat(selectedTenureData.price);
        const baseQuantity = parseFloat(selectedTenureData.noofthalli);
        return (basePrice / baseQuantity) * quantity;
    };
    return (
        <div className='mt-36'>
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
                fetchedData && (
                    <div className="font-sans mt-8">
                        <div className="p-4 lg:max-w-7xl max-w-xl max-lg:mx-auto">
                            <div className="grid items-start grid-cols-1 lg:grid-cols-5 gap-12">
                                <div className="min-h-[200px] lg:col-span-3 bg-gradient-to-tr from-emerald-200 via-emerald-300 to-emerald-400 rounded-lg w-full lg:sticky top-0 text-center p-6">
                                    <img src={fetchedData.image} alt={fetchedData.Foodname} className="w-60 h-60 rounded object-cover mx-auto py-6" />
                                    <hr className="border-white border my-6" />
                                </div>

                                <div className="lg:col-span-2">
                                    <h2 className="text-2xl font-bold text-gray-800">{fetchedData.Foodname}</h2>
                                    <h5 className="text-md font-semibold uppercase text-gray-800">{fetchedData.thaliname}</h5>

                                    <div className="mt-4">
                                        <h3 className="text-xl font-bold text-gray-800">Select Package</h3>
                                        <div className="flex flex-wrap gap-4 mt-4">
                                            {fetchedData.Foodcharge.map((charge, index) => (
                                                <button 
                                                    key={index}
                                                    type="button" 
                                                    className={`px-4 py-2 border rounded-md ${selectedTenure === index ? 'border-gray-800 bg-gray-800 text-white' : 'border-gray-400'}`} 
                                                    onClick={() => handleTenureClick(index)}
                                                >
                                                    {charge.tenure}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {selectedTenure !== null && (
                                        <div className="mt-4">
                                            <p className="text-xl font-bold text-gray-800">
                                                Price: ₹ {getCurrentPrice().toFixed(2)}
                                            </p>
                                            <p className="text-xl font-bold text-gray-800">
                                                Number of Thalis/Plate: {quantity}
                                            </p>
                                        </div>
                                    )}
                                    
                                    <hr className="my-6" />

                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">Quantity</h3>
                                        <div className="flex divide-x border w-max mt-4 rounded overflow-hidden">
                                            <button 
                                                type="button" 
                                                className="bg-gray-100 w-12 h-10 font-semibold" 
                                                onClick={decreaseQuantity}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 fill-current inline" viewBox="0 0 124 124">
                                                    <path d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z" data-original="#000000"></path>
                                                </svg>
                                            </button>
                                            <button type="button" className="bg-transparent w-12 h-10 font-semibold text-gray-800 text-lg">
                                                {quantity}
                                            </button>
                                            <button 
                                                type="button" 
                                                className="bg-gray-800 text-white w-12 h-10 font-semibold" 
                                                onClick={increaseQuantity}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 fill-current inline" viewBox="0 0 42 42">
                                                    <path d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" data-original="#000000"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <hr className="my-8" />

                                    <div className="mt-8">
                                        <h3 className="text-xl font-bold text-gray-800">Ingredients</h3>
                                        <p className="text-sm text-gray-800 mt-4">{fetchedData.Ingredients}</p>
                                    </div>
                                    <button 
                                        type="button" 
                                        className="w-full mt-8 px-6 py-3 bg-emerald-400 hover:bg-emerald-500 text-white text-sm font-semibold rounded-md"
                                        onClick={handleBuyNow}
                                    >
                                        Order Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    )
}

export default AreneChef;
