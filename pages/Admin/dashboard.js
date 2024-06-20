import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { firebase } from "../../Firebase/config";
import AdminNavbar from "../../components/AdminNavbar";
const Dashboard = () => {
  const router = useRouter(); // Use useRouter hook
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if the user is an admin when the component mounts
  useEffect(() => {
    const isAdminInLocalStorage = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(isAdminInLocalStorage);
    if (!isAdminInLocalStorage) {
      // If the user is not an admin, show a loading message or redirect them to the login page
      router.push("/Admin/adminlogin");
    } else {
    }
  }, [router]);

  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRef = firebase.firestore().collection("AgentOwner");
        const querySnapshot = await userRef.get();

        const fetchedUserData = [];
        querySnapshot.forEach((doc) => {
          // Extract data for each document
          const data = doc.data();
          fetchedUserData.push(data);
        });

        setUserData(fetchedUserData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  const countUsersByStatus = (status) => {
    return userData.filter((user) => user.status === status).length;
  };

  // Calculate counts for Active and Pending users
  const totalUsers = userData.length;
  const approvedUsers = countUsersByStatus("Active");
  const pendingUsers = countUsersByStatus("Pending");
  const [imageUrl, setImageUrl] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewAadhar = (aadharImageUrl) => {
    setImageUrl(aadharImageUrl);
    setModalOpen(true);
  };

  const handleViewPAN = (panImageUrl) => {
    setImageUrl(panImageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setImageUrl("");
  };

  const handleStatusChange = async (userId, status) => {
    try {
      const userRef = firebase.firestore().collection("AgentOwner").doc(userId);
      await userRef.update({ status }); // Update the status in Firestore
      // Refresh the data after updating
      const updatedUserData = [...userData];
      const updatedIndex = updatedUserData.findIndex(
        (user) => user.userId === userId
      );
      if (updatedIndex !== -1) {
        updatedUserData[updatedIndex].status = status;
        setUserData(updatedUserData);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const [statusFilter, setStatusFilter] = useState("All"); // State to manage selected status filter

  // ... (other code)

  const filteredUsers = userData.filter((user) => {
    if (statusFilter === "All") {
      return true; // Show all users when 'All' is selected
    }
    return user.status === statusFilter; // Filter users based on the selected status
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5); // Define the number of users per page

  // ... Existing code ...

  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="">
      <AdminNavbar />
      <div className="lg:ml-64 bg-white dark:bg-white min-h-screen">
        {modalOpen && (
          <div className="modal fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 z-30 bg-opacity-100">
            <div className="modal-content bg-white p-4 rounded-lg">
              <span
                className="close text-4xl cursor-pointer absolute top-2 right-4 text-red-600 "
                onClick={closeModal}
              >
                &times;
              </span>
              <img className="h-64 w-64 mx-auto" src={imageUrl} alt="Card" />
            </div>
          </div>
        )}
        <section class="px-6 py-6">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            <div class="flex items-center justify-between p-4 border-l-2 border-yellow-500 rounded-md shadow dark:border-blue-400 dark:bg-gray-900 bg-gray-50">
              <div>
                <p class="mb-2 text-black dark:text-black">Total Users</p>
                <h2 class="text-2xl font-bold text-black dark:text-black">
                  {totalUsers}
                </h2>
              </div>
              <div>
                <span class="inline-block p-4 mr-2 text-white bg-yellow-500 rounded-full dark:text-black dark:bg-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="w-6 h-6 bi bi-bag-check"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z"
                    ></path>
                    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"></path>
                  </svg>
                </span>
              </div>
            </div>
            <div class="flex items-center justify-between p-4 border-l-2 border-green-500 rounded-md shadow dark:border-blue-400 dark:bg-gray-900 bg-gray-50">
              <div>
                <p class="mb-2 text-black dark:text-black">Approved Users</p>
                <h2 class="text-2xl font-bold text-black dark:text-black">
                  {approvedUsers}
                </h2>
              </div>
              <div>
                <span class="inline-block p-4 mr-2 text-white bg-green-500 rounded-full dark:text-black dark:bg-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="w-6 h-6 bi bi-bag-check"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z"
                    ></path>
                    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"></path>
                  </svg>
                </span>
              </div>
            </div>
            <div class="flex items-center justify-between p-4 border-l-2 border-red-500 rounded-md shadow dark:border-blue-400 dark:bg-gray-900 bg-gray-50">
              <div>
                <p class="mb-2 text-black dark:text-black">Pending Users</p>
                <h2 class="text-2xl font-bold text-black dark:text-black">
                  {pendingUsers}
                </h2>
              </div>
              <div>
                <span class="inline-block p-4 mr-2 text-white bg-red-500 rounded-full dark:text-black dark:bg-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="w-6 h-6 bi bi-bag-check"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z"
                    ></path>
                    <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"></path>
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* <body class="antialiased font-sans z-10 ">
          <div class=" px-4 sm:px-8">
            <div class="py-8">
              <div>
                <h2 class="text-2xl font-semibold leading-tight">Users</h2>
              </div>
              <div class="my-2 ml-8 flex sm:flex-row flex-col">
                <div class="flex flex-row mb-1 sm:mb-0">
                  <div class="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      class="appearance-none h-full rounded-r border-t sm:rounded-r-none sm:border-r-0 border-r border-b block appearance-none w-full bg-white border-gray-400 text-black py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500"
                    >
                      <option value="All">All</option>
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-black">
                      <svg
                        class="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
                  <table class="min-w-full leading-normal">
                    <thead>
                      <tr>
                        <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                          User Name
                        </th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                          Email
                        </th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                          Mobile Number
                        </th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                          Aadhar Detail
                        </th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                          Pan Detail
                        </th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                          Address
                        </th>

                        <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-black uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.map((user, index) => (
                        <tr key={user.id}>
                          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <div class="flex items-center">
                              <div class="flex-shrink-0 w-10 h-10">
                                <img
                                  className="w-full h-full rounded-full"
                                  src={user.photo || "default_avatar_url"}
                                  alt=""
                                />
                              </div>
                              <div class="ml-3">
                                <p class="text-black whitespace-no-wrap">
                                  {user.name}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p class="text-black whitespace-no-wrap">
                              {user.email}
                            </p>
                          </td>
                          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p class="text-black whitespace-no-wrap">
                              {user.phoneNumber}
                            </p>
                          </td>
                          <td class="px-5 py-5 border-b border-gray-200 cursor-pointer bg-white text-sm">
                            <p
                              className="text-white bg-green-500 rounded-lg text-center font-bold whitespace-no-wrap"
                              onClick={() =>
                                handleViewAadhar(user.aadharCardUrl)
                              }
                            >
                              View Aadhar
                            </p>
                          </td>
                          <td class="px-5 py-5 border-b border-gray-200 cursor-pointer bg-white text-sm">
                            <p
                              className="text-white bg-green-500 rounded-lg text-center font-bold whitespace-no-wrap"
                              onClick={() => handleViewPAN(user.panCardUrl)}
                            >
                              View PAN
                            </p>
                          </td>
                          <td class="px-5 py-5 border-b border-gray-200  bg-white text-sm">
                            <p class="text-black whitespace-no-wrap">
                              {user.address}
                            </p>
                          </td>
                          <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <button
                              className={`text-white rounded-lg text-center font-bold whitespace-no-wrap ${
                                user.status === "Active"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                              onClick={() => {
                                const newStatus =
                                  user.status === "Active"
                                    ? "Pending"
                                    : "Active";
                                handleStatusChange(user.userId, newStatus);
                              }}
                            >
                              {user.status === "Active" ? "Active" : "Pending"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
                    <span className="text-xs xs:text-sm text-black">
                      Showing {indexOfFirstUser + 1} to{" "}
                      {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
                      {filteredUsers.length} Entries
                    </span>
                    <div className="inline-flex mt-2 xs:mt-0">
                      <button
                        className="text-sm bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded-l"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Prev
                      </button>
                      <button
                        className="text-sm bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded-r"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={indexOfLastUser >= filteredUsers.length}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </body>

        <script
          defer
          src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js"
        ></script> */}
      </div>
    </div>
  );
};

export default Dashboard;
