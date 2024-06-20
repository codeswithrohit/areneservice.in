import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { firebase } from '../Firebase/config';
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
                const bookingRef = db.collection('kitchenorder').where('orderId', '==', orderId);
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

    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [location, setLocation] = useState(null);
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [map, setMap] = useState(null);
    const mapRef = useRef(null);
console.log("updateddeliveryboylocation",location)
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
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        setLatitude(lat);
                        setLongitude(lng);

                        // Initialize Google Map
                        const mapInstance = new window.google.maps.Map(mapRef.current, {
                            center: { lat, lng },
                            zoom: 12,
                        });
                        setMap(mapInstance);

                        // Add user's current location marker
                        addMarker(mapInstance, { lat, lng }, "https://cdn-icons-png.freepik.com/256/1758/1758531.png?ga=GA1.1.626007579.1690598554&semt=ais_hybrid");

                        // Fetch and add other locations with different icons
                        fetchLocationAndAddMarker(mapInstance, address, "https://cdn-icons-png.freepik.com/256/5675/5675580.png?ga=GA1.1.626007579.1690598554&semt=ais_hybrid");
                        fetchLocationAndAddMarker(mapInstance, VendorLocation, "https://cdn-icons-png.freepik.com/256/9289/9289887.png?ga=GA1.1.626007579.1690598554&semt=ais_hybrid");

                        // Fetch location name using reverse geocoding
                        fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyB6gEq59Ly20DUl7dEhHW9KgnaZy4HrkqQ`)
                            .then(response => response.json())
                            .then(data => {
                                if (data.results && data.results.length > 0) {
                                    const addressComponents = data.results[0].address_components;
                                    const cityName = addressComponents.find(component => component.types.includes('locality'));
                                    const stateName = addressComponents.find(component => component.types.includes('administrative_area_level_1'));
                                    const countryName = addressComponents.find(component => component.types.includes('country'));

                                    const detailedLocation = [cityName, stateName, countryName]
                                        .filter(component => component !== undefined)
                                        .map(component => component.long_name)
                                        .join(', ');

                                    setLocation(detailedLocation);
                                } else {
                                    setLocation("Location not found");
                                }
                            })
                            .catch(error => {
                                console.error('Error fetching location:', error);
                                setDeliveryLocation("Error fetching location");
                            });

                        // Show route between address and VendorLocation
                        showRoute(mapInstance, { lat, lng }, address);
                    },
                    (error) => {
                        console.error('Error getting geolocation:', error);
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
            }
        };

        loadGoogleMapsScript();
    }, [address, VendorLocation]);





    const fetchLocationAndAddMarker = (map, address, iconUrl) => {
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

    const showRoute = (map, origin, destinationAddress) => {
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: destinationAddress }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK) {
          const destination = results[0].geometry.location;
          directionsService.route(
            {
              origin,
              destination,
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === window.google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(result);
                
                // Extract distance and duration
                const route = result.routes[0].legs[0];
                setDistance(route.distance.text);
                setDuration(route.duration.text);
              } else {
                console.error(`Directions request failed due to ${status}`);
              }
            }
          );
        } else {
          console.error(`Geocode was not successful for the following reason: ${status}`);
        }
      });
    };

    const updateLocationInFirebase = async () => {
        try {
            const db = firebase.firestore();
            const bookingRef = db.collection('kitchenorder').where('orderId', '==', orderId);
            const querySnapshot = await bookingRef.get();

            if (querySnapshot.empty) {
                toast.error('No matching documents found');
                console.error('No matching documents found');
                return;
            }

            querySnapshot.forEach(async (doc) => {
                await doc.ref.update({ deliveryboylocation: location });
            });

            setDeliveryLocation(location);
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
                        {distance && duration && (
                         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-2">
                         <div className="flex items-center justify-between gap-2">
                             <button className="flex items-center rounded-full h-10 px-3 text-red-600 bg-white font-bold capitalize border-2 border-white hover:scale-95 transition-all duration-300">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide mr-4 text-red-600 font-bold lucide-map-pin">
                                     <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                                     <circle cx="12" cy="10" r="3"></circle>
                                 </svg>
                                 <span className="sr-only">Location Icon</span>
                                 {deliverylocation}
                             </button>
                             {/* <button 
                                 onClick={updateLocationInFirebase} 
                                 className="lg:mt-0 lg:ml-4 px-4 py-2 w-32 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                             >
                                 Refresh Location
                             </button> */}
                             <p className="text-md font-bold">{distance}</p>
                             <p className="text-md font-bold">{duration}</p>
                             
                         </div>
                       
                     </div>
                     
                        )}
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
