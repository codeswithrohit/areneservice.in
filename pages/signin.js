import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/router';
import { firebase } from '../Firebase/config';
import 'firebase/auth';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Modal from 'react-modal'; // Import Modal
import Link from 'next/link';
import { signInWithPhoneNumber } from "firebase/auth";
Modal.setAppElement('#__next'); // Set the root element for the modal

const Signinsinup = () => {
  const router = useRouter();

  const [referralId, setReferralId] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false); // State to control the email modal

  useEffect(() => {
    const searchParams = new URLSearchParams(router.query);
    const referralId = searchParams.get('refferal');
    setReferralId(referralId);
  }, [router.query]);

  const handleRedirect = async (user) => {
    try {
      const doc = await firebase.firestore().collection('Users').doc(user.uid).get();
      if (doc.exists) {
        router.push('/');
      } else {
        router.push(`/askuserinfo?id=${user.uid}&mobileNumber=${ph}`);
      }
    } catch (error) {
      console.error('Error getting user document:', error);
    }
  };
  const handleRedirectmobile = async (user) => {
    try {
      const doc = await firebase.firestore().collection('Users').doc(user.uid).get();
      if (doc.exists) {
        router.push('/');
      } else {
        router.push(`/signinwithmobilenumber?id=${user.uid}&mobileNumber=${ph}`);
      }
    } catch (error) {
      console.error('Error getting user document:', error);
    }
  };

  const handleSubmitGoogleSignIn = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await firebase.auth().signInWithPopup(provider);

      if (result?.user) {
        handleRedirect(result.user);
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

 
  const [otp, setOtp] = useState("");
  const [ph, setPh] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);


  
  function onSignup() {
    setLoading(true);

    const appVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          signIn();
        },
        "expired-callback": () => {},
      }
    );

    const formatPh = "+" + ph;

    signInWithPhoneNumber(firebase.auth(), formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sent successfully!");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  function signIn() {
    const appVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container"
    );
    const formatPh = "+" + ph;

    signInWithPhoneNumber(firebase.auth(), formatPh, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        setLoading(false);
        setShowOTP(true);
        toast.success("OTP sent successfully!");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  function onOTPVerify() {
    setLoading(true);
    window.confirmationResult
      .confirm(otp)
      .then(async (res) => {
        setLoading(false);
        toast.success("Phone number verified successfully!");
        console.log("User object:", res.user);
  
        // Extract the user's phone number and UID
        const { phoneNumber, uid } = res.user;
  
        if (res.user) { // Corrected variable name from 'result' to 'res'
          handleRedirectmobile(res.user);
        }
      })
      .catch((err) => {
        console.error("Error verifying OTP:", err);
        setLoading(false);
        toast.error("Invalid verification code. Please try again.");
      });
  }
  
  
  

  return (
      <div className=" bg-red-100">
        <div className="flex justify-center items-center mb-4 lg:py-16">
          <img src="https://www.areneservices.in/public/front/images/property-logo.png" alt="Logo" className="w-20 h-20" />
        </div>
        <div className="w-full lg:-mt-20 bg-red-100 flex justify-center items-center">
          <div className="w-full max-w-md p-6 bg-red-100 ">
            <p className="text-center text-sm font-bold text-black mb-6 font-serif">
              We'll check if you have an account, and help create one if you don't.
            </p>
            <div className="flex flex-col items-center justify-center space-y-2">
            <div id="recaptcha-container"></div>
            <div className="w-80 flex flex-col gap-2 rounded-lg p-2">
                        {showOTP ? (
                          <>
                            <p class="mb-1 font-medium text-center text-black">Enter OTP</p>
                            <div class="mb-1 flex flex-col">
                              <div class="focus-within:border-red-600 relativeflex overflow-hidden rounded-md border-2 transition sm:w-80 lg:w-full">
                                <input
                                  type="text"
                                  value={otp}
                                  onChange={(e) => setOtp(e.target.value)}
                                  placeholder="Enter OTP"
                                  class="w-full border-gray-300 bg-white px-4 py-2 text-base text-black placeholder-gray-400 focus:outline-none"
                                />
                              </div>
                            </div>

                            <button
                              onClick={onOTPVerify}
                              className="bg-red-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                            >
                              {loading && (
                                <CgSpinner
                                  size={20}
                                  className="mt-1 animate-spin"
                                />
                              )}
                              <span>Verify OTP</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <PhoneInput
                              country={"in"}
                              value={ph}
                              onChange={setPh}
                            />
                            <button
                              onClick={onSignup}
                              className="bg-red-600 w-full flex gap-1 items-center justify-center py-2.5 text-white rounded"
                            >
                              {loading && (
                                <CgSpinner
                                  size={20}
                                  className="mt-1 animate-spin"
                                />
                              )}
                              <span>Send code via SMS</span>
                            </button>
                          </>
                        )}
                      </div>
              <p className="text-gray-500 text-center">------------------- or -----------------</p>
              
              <div className="flex flex-col items-center justify-center space-y-4">
  <button
    onClick={handleSubmitGoogleSignIn}
    className="bg-white w-full md:w-80 py-2 px-4 text-black rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 flex items-center justify-center"
  >
    <img src="google.svg" className="w-5 h-5 mr-2" alt="Google Logo" />
    <span className="font-medium">Continue with Google</span>
  </button>
 
  <div >
    <a href="/signupwithemail" className="bg-white w-full md:w-80 py-2 px-4 text-black rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 flex items-center justify-center">
      <img src="email1.svg" className="w-6 h-5 mr-2" alt="Email Logo" />
      <span className="font-medium">Continue with Email</span>
    </a>
  </div>
  
 
</div>


            
            </div>
          </div>
        </div>
      </div>

     
      
  );
};

export default Signinsinup;
