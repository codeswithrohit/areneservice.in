import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { firebase } from '../../Firebase/config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Test = () => {
    const [bookingData, setBookingData] = useState(null);
    const [VendorLocation, setVendorLocation] = useState(null);
    const [address, setAddress] = useState(null);
    const [deliverylocation, setDeliveryLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { orderId } = router.query;

    console.log("VendorLocation", VendorLocation, "address", address, "deliverylocation", deliverylocation);

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
                    const data = doc.data();
                    setBookingData(data);
                    setVendorLocation(data.VendorLocation);
                    setAddress(data.address);
                    setDeliveryLocation(data.deliveryboylocation);
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

    const [map, setMap] = useState(null);
    const mapRef = useRef(null);

    useEffect(() => {
        const loadGoogleMapsScript = () => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB6gEq59Ly20DUl7dEhHW9KgnaZy4HrkqQ`;
            script.async = true;
            script.defer = true;
            script.onload = initializeMap;
            document.head.appendChild(script);
        };

        const initializeMap = () => {
            // Initialize Google Map
            const mapInstance = new window.google.maps.Map(mapRef.current, {
                center: { lat: 0, lng: 0 },
                zoom: 12,
            });
            setMap(mapInstance);

            // Fetch and add locations with different icons
            fetchLocationAndAddMarker(mapInstance, address, "https://cdn-icons-png.freepik.com/256/5675/5675580.png?ga=GA1.1.626007579.1690598554&semt=ais_hybrid");
            fetchLocationAndAddMarker(mapInstance, VendorLocation, "https://cdn-icons-png.freepik.com/256/9289/9289887.png?ga=GA1.1.626007579.1690598554&semt=ais_hybrid");
            fetchLocationAndAddMarker(mapInstance, deliverylocation, "https://cdn-icons-png.freepik.com/256/1758/1758531.png?ga=GA1.1.626007579.1690598554&semt=ais_hybrid");

            // Show route between deliverylocation and address
            showRoute(mapInstance, deliverylocation, address);
        };

        loadGoogleMapsScript();
    }, [address, VendorLocation, deliverylocation]);

    const fetchLocationAndAddMarker = (map, address, iconUrl) => {
        if (!address) return;
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyB6gEq59Ly20DUl7dEhHW9KgnaZy4HrkqQ`)
            .then(response => response.json())
            .then(data => {
                if (data.results && data.results.length > 0) {
                    const location = data.results[0].geometry.location;
                    addMarker(map, location, iconUrl);
                } else {
                    console.error(`Geocode was not successful for the following reason: ${data.status}`);
                }
            })
            .catch(error => console.error('Error fetching geocode:', error));
    };

    const addMarker = (map, location, iconUrl) => {
        new window.google.maps.Marker({
            position: location,
            map,
            icon: {
                url: iconUrl,
                scaledSize: new window.google.maps.Size(50, 50),
            },
        });
    };

    const showRoute = (map, originAddress, destinationAddress) => {
        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer();
        directionsRenderer.setMap(map);

        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: originAddress }, (originResults, originStatus) => {
            if (originStatus === window.google.maps.GeocoderStatus.OK) {
                const origin = originResults[0].geometry.location;

                geocoder.geocode({ address: destinationAddress }, (destResults, destStatus) => {
                    if (destStatus === window.google.maps.GeocoderStatus.OK) {
                        const destination = destResults[0].geometry.location;

                        directionsService.route(
                            {
                                origin,
                                destination,
                                travelMode: window.google.maps.TravelMode.DRIVING,
                            },
                            (result, status) => {
                                if (status === window.google.maps.DirectionsStatus.OK) {
                                    directionsRenderer.setDirections(result);
                                } else {
                                    console.error(`Directions request failed due to ${status}`);
                                }
                            }
                        );
                    } else {
                        console.error(`Geocode for destination was not successful for the following reason: ${destStatus}`);
                    }
                });
            } else {
                console.error(`Geocode for origin was not successful for the following reason: ${originStatus}`);
            }
        });
    };

    const updateLocationInFirebase = async () => {
        try {
            const db = firebase.firestore();
            const bookingRef = db.collection('laundryorders').where('orderId', '==', orderId);
            const querySnapshot = await bookingRef.get();

            if (querySnapshot.empty) {
                toast.error('No matching documents found');
                console.error('No matching documents found');
                return;
            }

            querySnapshot.forEach(async (doc) => {
                await doc.ref.update({ deliveryboylocation: deliverylocation });
            });

            toast.success('Location updated in Firebase');
        } catch (error) {
            toast.error('Error updating location in Firebase');
            console.error('Error updating location in Firebase:', error);
        }
    };

    return (
        <div className='min-h-screen bg-white mt-12'>
            <div>
                {loading ? (
                    <div className="flex items-center justify-center h-screen">
                        <div className="text-center mt-4">
                            Loading...
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-start gap-5">
                            <button 
                                onClick={updateLocationInFirebase} 
                                className="lg:mt-0 lg:ml-4 px-4 py-2 w-32 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            >
                                Refresh Location
                            </button>
                        </div>
                        <div ref={mapRef} style={{ width: '100%', height: '800px' }} />
                    </>
                )}
            </div>
            <ToastContainer/>
        </div>
    );
};

export default Test;
