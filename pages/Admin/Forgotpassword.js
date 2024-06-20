import React, { useState } from "react";
import { firebase } from "../../Firebase/config";

const Forgotpassword = () => {
  const [email, setEmail] = useState("");
  const [resetError, setResetError] = useState(null);
  const [resetSuccess, setResetSuccess] = useState(null);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await firebase.auth().sendPasswordResetEmail(email);
      setResetSuccess("Password reset email sent. Check your inbox.");
      setResetError(null);
    } catch (error) {
      setResetError(
        "Error sending reset email. Please check your email address."
      );
      setResetSuccess(null);
    }
  };

  return (
    <div>
      <main
        id="content"
        role="main"
        className="w-full mt-4 max-w-md mx-auto p-6"
      >
        <div className="mt-7 bg-white rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 border-2 border-red-600">
          <div className="p-4 sm:p-7">
            <div className="text-center">
              <h1 className="block text-2xl font-bold text-black dark:text-white">
                Forgot password?
              </h1>
              <p className="mt-2 text-sm text-black dark:text-black">
                Remember your password?
                <a
                  className="text-red-600 decoration-2 hover:underline font-medium"
                  href="Admin/adminlogin"
                >
                  Login here
                </a>
              </p>
            </div>

            <div className="mt-5">
              <form onSubmit={handleResetPassword}>
                <div className="grid gap-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-bold ml-1 mb-2 dark:text-white"
                    >
                      Email address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="py-3 px-4 block w-full border-2 border-gray-200 rounded-md text-sm focus:border-red-600 focus:ring-red-600 shadow-sm"
                        required
                        aria-describedby="email-error"
                      />
                    </div>
                    {resetError && (
                      <p className="text-xs text-red-600 mt-2" id="email-error">
                        {resetError}
                      </p>
                    )}
                    {resetSuccess && (
                      <p className="text-xs text-green-600 mt-2">
                        {resetSuccess}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-red-600 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                  >
                    Reset password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Forgotpassword;
