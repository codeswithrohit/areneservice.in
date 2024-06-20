
import React, { useState } from 'react';
import { firebase } from '../Firebase/config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import 'tailwindcss/tailwind.css'
const Login = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      setLoading(true);
      await firebase.auth().signInWithEmailAndPassword(email, password);
      setLoading(false);
      toast.success('Logged in successfully');
      router.push('/'); // Redirect to home page after successful login
    } catch (error) {
      setLoading(false);
      console.error('Error signing in:', error.message);
      toast.error('Failed to sign in. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const provider = new firebase.auth.GoogleAuthProvider();
      await firebase.auth().signInWithPopup(provider);
      setLoading(false);
      toast.success('Logged in with Google successfully');
      router.push('/'); // Redirect to home page after successful login
    } catch (error) {
      setLoading(false);
      console.error('Error signing in with Google:', error.message);
      toast.error('Failed to sign in with Google. Please try again.');
    }
  };

  return (
    <div>
    <section class="font-poppins ">
    <div class="hidden py-20 text-center bg-orange-100 dark:bg-gray-700 lg:block">
        <div class="max-w-6xl mx-auto mb-24">
            <span class="inline-block text-base font-medium text-red-600 dark:text-orange-300">Welcome Back</span>
            <h2 class="mb-6 font-semibold text-gray-800 text-7xl dark:text-gray-300">Login our account</h2>
        </div>
    </div>
    <div class="max-w-xl mx-auto ">
        <div class="w-full shadow-lg bg-gray-50 dark:bg-gray-800 mt-11 lg:-mt-36 lg:full p-7 rounded-3xl">
            <span class="flex justify-end mb-8">
                <a href="/register" class="px-4 py-3 text-sm font-medium text-gray-100 bg-orange-700 hover:text-orange-200 rounded-lg">
                    Register Account
                </a>
            </span>
            <div class="">
                <form onSubmit={handleEmailLogin} action="" class="p-0 m-0">
                    <div class="mb-7">
                        <input type="email"
                            class="w-full px-4 py-4 bg-gray-200 rounded-lg dark:bg-gray-700 lg:py-5 dark:text-gray-300 "
                            id="email"
                            name="email"
                            autoComplete="email"
                            required placeholder="Enter your email"/>
                    </div>
                    <div class="mb-6">
                        <div class="relative flex items-center">
                            <input 
                                class="w-full px-4 py-4 bg-gray-200 rounded-lg lg:py-5 dark:text-gray-300 dark:bg-gray-700 "
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required placeholder="Enter password"/>
                            
                        </div>
                    </div>
                    <div class="mt-6 text-right">
                        <a href="/Forgotpassword"
                            class="text-sm font-semibold text-orange-700 dark:text-orange-300 dark:hover:text-orange-500">
                            forgot password?</a>
                    </div>
                    <button
                        class="w-full px-4 py-4 mt-6 font-medium text-gray-200 bg-orange-700 rounded-lg dark:bg-orange-500 hover:text-orange-200 "
                        type="submit"
                        disabled={loading}> {loading ? 'Signing In...' : 'Sign in'}</button>
                    <div class="py-5 text-base text-center text-gray-600 dark:text-gray-400">Or login with</div>
                    <div className=" flex justify-center">
              <div onClick={handleGoogleLogin}>
                <a
                  href="#"
                  className="w-full flex items-center justify-center px-8 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <img
                  
                    className="h-6 w-6 mr-2"
                    src="https://www.svgrepo.com/show/506498/google.svg"
                    alt="Google Logo"
                  />
                  Login with Gmail
                </a>
              </div>
            </div>
                </form>
            </div>
        </div>
    </div>
</section>
</div>
  )
}

export default Login