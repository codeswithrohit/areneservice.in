import React, { useState, useEffect } from "react";
import { firebase } from "../../Firebase/config";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminNavbar from "../../components/AdminNavbar";

const User = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [registration, setRegistration] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();
  const [selectedAadharUrl, setSelectedAadharUrl] = useState("");
  const [selectedPanUrl, setSelectedPanUrl] = useState("");
  const [showAadharPopup, setShowAadharPopup] = useState(false);
  const [showPanPopup, setShowPanPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const db = firebase.firestore();
    const RegistrationRef = db.collection("AgentOwner");

    RegistrationRef.get()
      .then((RegistrationSnapshot) => {
        const RegistrationData = [];
        RegistrationSnapshot.forEach((doc) => {
          RegistrationData.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        RegistrationData.sort(
          (a, b) => new Date(b.currentDate) - new Date(a.currentDate)
        );

        setRegistration(RegistrationData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error getting documents: ", error);
        setIsLoading(false);
      });
  }, []);

  const filteredRegistration = registration.filter((user) => {
    if (activeTab === "all") return true;
    if (activeTab === "verified") return user.verified;
    if (activeTab === "unverified") return !user.verified;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRegistration = filteredRegistration.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredRegistration.length / itemsPerPage);

  const viewAadhar = (aadharUrl) => {
    setSelectedAadharUrl(aadharUrl);
    setShowAadharPopup(true);
  };

  const viewPan = (panUrl) => {
    setSelectedPanUrl(panUrl);
    setShowPanPopup(true);
  };

  const handleVerification = async (userId, isVerified) => {
    try {
      const db = firebase.firestore();
      const userRef = db.collection("AgentOwner").doc(userId);

      await userRef.update({
        verified: isVerified,
      });

      toast.success("User data verified successfully!");
      // Reload the page after verification
      router.reload();
    } catch (error) {
      console.error("Error verifying user data:", error);
      toast.error("Error verifying user data. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:white">
      <AdminNavbar />
      <div className="w-full lg:ml-56 sm:px-6">
        <div className="px-4 md:px-10 py-4 md:py-7 bg-gray-100 rounded-tl-lg rounded-tr-lg">
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-normal text-black">
              AgentOwner Data
            </p>
          <div className="sm:flex items-center mt-2 ">
           
            <div className="flex ">
              <button
                className={`mx-1 px-3 py-1 rounded ${
                  activeTab === "all"
                    ? "bg-gray-800 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => setActiveTab("all")}
              >
                All ({registration.length})
              </button>
              <button
                className={`mx-1 px-3 py-1 rounded ${
                  activeTab === "verified"
                    ? "bg-gray-800 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => setActiveTab("verified")}
              >
                Verified ({registration.filter((user) => user.verified).length})
              </button>
              <button
                className={`mx-1 px-3 py-1 rounded ${
                  activeTab === "unverified"
                    ? "bg-gray-800 text-white"
                    : "bg-gray-200 text-black"
                }`}
                onClick={() => setActiveTab("unverified")}
              >
                Unverified ({registration.filter((user) => !user.verified).length})
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div class="flex min-h-screen justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              class="w-12 h-12 animate-spin"
              viewBox="0 0 16 16"
            >
              <path
                d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"
              />
              <path
                fill-rule="evenodd"
                d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
              />
            </svg>
          </div>
        ) : (
          <div className="bg-white shadow px-4 md:px-4 pt-4 md:pt-7 pb-5 overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 font-[sans-serif]">
              <thead class="bg-gray-100 whitespace-nowrap">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mobile Number
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                 
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200 whitespace-nowrap">
                {currentRegistration.map((data, index) => (
                  <tr key={data.id}>
                    <td class="px-6 py-4 text-xs text-[#333]">{data.name}</td>
                    <td class="px-6 py-4 text-xs text-[#333]">{data.email}</td>
                    <td class="px-6 py-4 text-xs text-[#333]">
                      {data.mobileNumber}
                    </td>
                    <td class="px-6 py-4 text-xs text-[#333]">
                      <button
                        onClick={() => viewAadhar(data.aadharCardUrl)}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        Aadhar
                      </button>
                      <button
                        onClick={() => viewPan(data.panCardUrl)}
                        className="text-blue-500 hover:text-blue-700 mr-2"
                      >
                        PAN
                      </button>
                      <select
                        className="text-blue-500 hover:text-blue-700 mr-2"
                        value={data.verified ? "verify" : "unverify"}
                        onChange={(e) =>
                          handleVerification(
                            data.id,
                            e.target.value === "verify"
                          )
                        }
                      >
                        <option value="verify">Verify</option>
                        <option value="unverify">Unverify</option>
                      </select>
                    </td>
                
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex items-center justify-center mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      <div
        className={`fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 ${
          showAadharPopup || showPanPopup ? "visible" : "hidden"
        }`}
      >
        <div className="bg-white p-4 rounded-lg">
          {showAadharPopup && (
            <img
              src={selectedAadharUrl}
              alt="Aadhar Card"
              className="h-96 w-96"
            />
          )}
          {showPanPopup && (
            <img src={selectedPanUrl} alt="PAN Card" className="h-96 w-96" />
          )}
          <button
            onClick={() => {
              setShowAadharPopup(false);
              setShowPanPopup(false);
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default User;
