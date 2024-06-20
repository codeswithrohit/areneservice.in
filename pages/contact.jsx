import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { firebase } from "../Firebase/config";
import "firebase/firestore";
import { FaWhatsapp, FaMapMarkerAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import axios from "axios";
const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    emailAddress: "",
    message: "",
  });

  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = `0${now.getMonth() + 1}`.slice(-2);
    const day = `0${now.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const db = firebase.firestore();
    const currentDate = getCurrentDate(); // Get current date
    const formDataWithDate = { ...formData, currentDate }; // Include current date in form data
    await db.collection("contacts").add(formDataWithDate);
      // Reset form data after successful submission
      setFormData({
        fullName: "",
        mobileNumber: "",
        emailAddress: "",
        message: "",
      });
      toast.success("Your enquiry data has been submitted successfully!", {
        // You can customize toast configurations here
      });
      await axios.post("/api/sendEmail", formDataWithDate);
    
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting form. Please try again.", {
        // You can customize toast configurations here
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  return (
    <div extraClass={"pt-160"}>
      {/*====== Start Info Section ======*/}
      <section className="contact-info-section font-sans pt-10 ">
        <div className="container mt-3">
          <div className="row justify-content-center">
            <div className="col-xl-8">
              {/*=== Section Title ===*/}
              <div className="section-title text-center  wow fadeInDown">
                <span className="sub-title uppercase  text-3xl">Contact Us</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="contact-section  ">
        <div className="container">
          <div className="row justify-content-center">
            <div class="font-[sans-serif] max-w-6xl mx-auto relative bg-white rounded my-2">
              <div class="grid lg:grid-cols-3 items-center">
                <div class="grid sm:grid-cols-2 gap-4 md:z-20 relative lg:left-16 max-lg:mb-8">
                  <div class="flex flex-col items-center justify-center rounded w-full h-44 p-4 text-center bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]">
                    <FaMapMarkerAlt className="w-6 fill-red-500" />
                    <h4 class="text-[#333] text-base font-extrabold ">
                      Office
                    </h4>
                    <p class="text-sm text-left text-justify tect-gray-400 mt-2">
                      
                     Pan India
                    </p>
                  </div>
                  <div class="flex flex-col items-center justify-center rounded w-full h-44 p-4 text-center bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]">
                    <a
                      href="tel:+919871713129"
                      class="flex flex-col items-center justify-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-6 fill-red-600"
                        viewBox="0 0 473.806 473.806"
                      >
                        <path
                          d="M374.456 293.506c-9.7-10.1-21.4-15.5-33.8-15.5-12.3 0-24.1 5.3-34.2 15.4l-31.6 31.5c-2.6-1.4-5.2-2.7-7.7-4-3.6-1.8-7-3.5-9.9-5.3-29.6-18.8-56.5-43.3-82.3-75-12.5-15.8-20.9-29.1-27-42.6 8.2-7.5 15.8-15.3 23.2-22.8 2.8-2.8 5.6-5.7 8.4-8.5 21-21 21-48.2 0-69.2l-27.3-27.3c-3.1-3.1-6.3-6.3-9.3-9.5-6-6.2-12.3-12.6-18.8-18.6-9.7-9.6-21.3-14.7-33.5-14.7s-24 5.1-34 14.7l-.2.2-34 34.3c-12.8 12.8-20.1 28.4-21.7 46.5-2.4 29.2 6.2 56.4 12.8 74.2 16.2 43.7 40.4 84.2 76.5 127.6 43.8 52.3 96.5 93.6 156.7 122.7 23 10.9 53.7 23.8 88 26 2.1.1 4.3.2 6.3.2 23.1 0 42.5-8.3 57.7-24.8.1-.2.3-.3.4-.5 5.2-6.3 11.2-12 17.5-18.1 4.3-4.1 8.7-8.4 13-12.9 9.9-10.3 15.1-22.3 15.1-34.6 0-12.4-5.3-24.3-15.4-34.3l-54.9-55.1zm35.8 105.3c-.1 0-.1.1 0 0-3.9 4.2-7.9 8-12.2 12.2-6.5 6.2-13.1 12.7-19.3 20-10.1 10.8-22 15.9-37.6 15.9-1.5 0-3.1 0-4.6-.1-29.7-1.9-57.3-13.5-78-23.4-56.6-27.4-106.3-66.3-147.6-115.6-34.1-41.1-56.9-79.1-72-119.9-9.3-24.9-12.7-44.3-11.2-62.6 1-11.7 5.5-21.4 13.8-29.7l34.1-34.1c4.9-4.6 10.1-7.1 15.2-7.1 6.3 0 11.4 3.8 14.6 7l.3.3c6.1 5.7 11.9 11.6 18 17.9 3.1 3.2 6.3 6.4 9.5 9.7l27.3 27.3c10.6 10.6 10.6 20.4 0 31-2.9 2.9-5.7 5.8-8.6 8.6-8.4 8.6-16.4 16.6-25.1 24.4-.2.2-.4.3-.5.5-8.6 8.6-7 17-5.2 22.7l.3.9c7.1 17.2 17.1 33.4 32.3 52.7l.1.1c27.6 34 56.7 60.5 88.8 80.8 4.1 2.6 8.3 4.7 12.3 6.7 3.6 1.8 7 3.5 9.9 5.3.4.2.8.5 1.2.7 3.4 1.7 6.6 2.5 9.9 2.5 8.3 0 13.5-5.2 15.2-6.9l34.2-34.2c3.4-3.4 8.8-7.5 15.1-7.5 6.2 0 11.3 3.9 14.4 7.3l.2.2 55.1 55.1c10.3 10.2 10.3 20.7.1 31.3zm-154.2-286.1c26.2 4.4 50 16.8 69 35.8s31.3 42.8 35.8 69c1.1 6.6 6.8 11.2 13.3 11.2.8 0 1.5-.1 2.3-.2 7.4-1.2 12.3-8.2 11.1-15.6-5.4-31.7-20.4-60.6-43.3-83.5s-51.8-37.9-83.5-43.3c-7.4-1.2-14.3 3.7-15.6 11s3.5 14.4 10.9 15.6zm217.2 96.3c-8.9-52.2-33.5-99.7-71.3-137.5s-85.3-62.4-137.5-71.3c-7.3-1.3-14.2 3.7-15.5 11-1.2 7.4 3.7 14.3 11.1 15.6 46.6 7.9 89.1 30 122.9 63.7 33.8 33.8 55.8 76.3 63.7 122.9 1.1 6.6 6.8 11.2 13.3 11.2.8 0 1.5-.1 2.3-.2 7.3-1.1 12.3-8.1 11-15.4z"
                          data-original="#000000"
                        ></path>
                      </svg>
                      <h4 class="text-[#333] text-base font-extrabold mt-4">
                        Call
                      </h4>
                      <p class="text-sm tect-gray-400 mt-2">+91 9871713129</p>
                      <p class="text-sm tect-gray-400 mt-2">+91 9999789352</p>
                    </a>
                  </div>

                  <div class="flex flex-col items-center justify-center rounded w-full h-44 p-4 text-center bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]">
                    <MdEmail className="w-10 h-10 fill-blue-500" />
                    <h4 class="text-[#333] text-base font-extrabold mt-4">
                      Email
                    </h4>
                    <p class="text-sm tect-gray-400 mt-2">
                      support@arene.com
                    </p>
                  </div>
                  <div class="flex flex-col items-center justify-center rounded w-full h-44 p-4 text-center bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.3)]">
                    <a
                      href="https://wa.me/919871713129"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="flex flex-col items-center justify-center"
                    >
                      <FaWhatsapp className="w-10 h-10 fill-green-600" />
                      <h4 class="text-[#333] text-base font-extrabold mt-4">
                        WhatsApp
                      </h4>
                      <p class="text-sm tect-gray-400 mt-2">+91 9871713129</p>
                      <p class="text-sm tect-gray-400 mt-2">+91 9999789352</p>
                    </a>
                  </div>
                </div>
                <div style={{ backgroundColor: "#10b981" }} class="lg:col-span-2  rounded sm:p-10 p-4 z-10">
                  <h2 class="text-3xl uppercase text-white text-center font-extrabold mb-6">
                    Please write to us
                  </h2>
                  <form onSubmit={handleSubmit}>
                    <div class="max-w-sm mx-auto space-y-4">
                      <input
                        type="text"
                        placeholder="Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        class="w-full bg-gray-100 rounded py-3 px-6 text-sm outline-none"
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        name="emailAddress"
                        value={formData.emailAddress}
                        onChange={handleChange}
                        class="w-full bg-gray-100 rounded py-3 px-6 text-sm outline-none"
                      />
                      <input
                        type="tel"
                        placeholder="Phone No."
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        class="w-full bg-gray-100 rounded py-3 px-6 text-sm outline-none"
                      />
                      <textarea
                        name="message"
                        placeholder="Message"
                        rows="6"
                        value={formData.message}
                        onChange={handleChange}
                        class="w-full bg-gray-100 rounded px-6 text-sm pt-3 outline-none"
                      ></textarea>
                      <button
                        type="submit"
                        class="text-[#333] mx-auto block relative bg-gray-100 hover:bg-gray-200 font-semibold rounded text-sm px-6 py-3"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16px"
                          height="16px"
                          fill="currentColor"
                          class="mr-2 inline"
                          viewBox="0 0 548.244 548.244"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M392.19 156.054 211.268 281.667 22.032 218.58C8.823 214.168-.076 201.775 0 187.852c.077-13.923 9.078-26.24 22.338-30.498L506.15 1.549c11.5-3.697 24.123-.663 32.666 7.88 8.542 8.543 11.577 21.165 7.879 32.666L390.89 525.906c-4.258 13.26-16.575 22.261-30.498 22.338-13.923.076-26.316-8.823-30.728-22.032l-63.393-190.153z"
                            clip-rule="evenodd"
                            data-original="#000000"
                          />
                        </svg>
                        Send Message
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="pt-2 pb-2">
              <iframe
                title="Ayodhya Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14579.93047856068!2d82.19594292910159!3d26.795062843037497!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398d5dd52f675eef%3A0x52a5ab30b817df65!2sAyodhya%2C%20Uttar%20Pradesh%2C%20India!5e0!3m2!1sen!2sbd!4v1605093240208!5m2!1sen!2sbd"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/*====== End Contact Map Section ======*/}
      {/*====== Start Contact Section ======*/}

      <ToastContainer />
    </div>
  );
};
export default Contact;
