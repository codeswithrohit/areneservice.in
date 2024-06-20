import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {firebase } from '../Firebase/config'
import PreLoader from "../src/components/PreLoader";
import "../styles/globals.css";
import Header1 from "../src/layouts/headers/Header1";
import Navbar from "../components/Navbar";
import Footer from "../src/layouts/Footer";
import MobileMenu from "../src/layouts/MobileMenu";
import 'tailwindcss/tailwind.css'; 

const MyApp = ({ Component, pageProps }) => {
 


  const router = useRouter();





  

  const showHeaderFooterMobileMenu = !router.pathname.includes('/Admin') && !router.pathname.includes('/Agent') && !router.pathname.includes('/AreneChefVendor') && !router.pathname.includes('/Deliveryboy');


  return (
    <Fragment>
      <Head>
        <title>Arene Services | Real Estate | Property in India | Buy/Sell | Rent Properties</title>
        <link
          rel="shortcut icon"
          href="assets/images/favicon.ico"
          type="image/png"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Mulish:wght@400;500;600&family=Quicksand:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      {showHeaderFooterMobileMenu && (
        <Fragment>
          <MobileMenu />
          <Header1 />
        </Fragment>
      )}
      
      <Component  {...pageProps} />
      {showHeaderFooterMobileMenu && (
        <Fragment>
          <Footer />
        </Fragment>
      )}
    </Fragment>
  );
};
export default MyApp;
