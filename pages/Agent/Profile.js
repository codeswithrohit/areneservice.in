import AgentNav from '../../components/AgentNav'
import { useRouter } from 'next/router';
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const Profile = () => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                fetchUserData(user);
            } else {
                setUser(null);
                setUserData(null);
                router.push('/Agent/Register'); // Redirect to the register page if the user is not authenticated
            }
        });

        return () => unsubscribe();
    }, []);

    const fetchUserData = async (user) => {
        try {
            const db = getFirestore();
            const userDocRef = doc(db, 'AgentOwner', user.uid); // Update the path to the user document
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                if (userData.isVendor) {
                    setUserData(userData);
                } else {
                    router.push('/Agent/Register'); // Redirect to the register page if the user is not an admin
                }
            } else {
                // Handle case where user data doesn't exist in Firestore
                // You can create a new user profile or handle it based on your app's logic
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            router.push('/Agent/Register'); // Redirect to the register page after logout
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    useEffect(() => {
        if (userData) {
            console.log("User Data:", JSON.stringify(userData, null, 2));
        }
    }, [userData]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <button type="button"
                        className="px-6 py-2.5 rounded-full text-white text-sm tracking-wider font-semibold border-none outline-none bg-orange-600 hover:bg-orange-700 active:bg-orange-600">
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

    return (
        <div className='min-h-screen bg-white'>
            <AgentNav />

            <div className="mt-16 mb-16 flex justify-center items-center">
                <div
                    className="w-full  mt-16 bg-white shadow-xl rounded-lg text-gray-900">
                    {/* <div className="rounded-t-lg h-32 overflow-hidden">
                        <img className="object-cover object-top w-full"
                             src='https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjE0NTg5fQ'
                             alt='Mountain'/>
                    </div> */}
                    {/* <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
                        <img className="object-cover object-center h-32"
                             src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQvOx9JNXTmMLHtCqOcR25UD7GIKqDyrd4fk5L_S-NdhlpNIulgBTvBe_RqL9Li3Gi3QL8&usqp=CAU'
                             alt='Profile'/>
                    </div> */}
                    <div className="text-center mt-2">
                        <h2 className="font-bold">Hello,{userData?.name}</h2>
                        <p className="text-gray-500">{userData?.email}</p>
                        <p className="text-gray-500">{userData?.mobileNumber}</p>
                        <p className="text-gray-500">{userData?.userType}</p>
                        <p className="text-gray-500">{userData?.verified ? 'Verified' : 'Not Verified'} Member</p>
                        <div className='flex flex-row items-center justify-center' >
                        <div className="mt-4 ">
                            <img className="object-cover object-center h-32 w-32"
                                 src={userData?.aadharCardUrl}
                                 alt='Aadhar Card'/>
                                 <p className="text-gray-500 font-bold">Aadhar Card</p>
                        </div>
                        <div className="mt-4">
                            <img className="object-cover object-center h-32 w-32"
                                 src={userData?.panCardUrl}
                                 alt='PAN Card'/>
                                    <p className="text-gray-500 font-bold">Pan Card</p>
                        </div>
                        </div>
                    </div>
                    <div className="p-4 border-t mx-8 mt-2">
                        <button onClick={handleLogout}
                                className="w-1/2 block mx-auto rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2">Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
