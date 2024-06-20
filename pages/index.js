import Link from "next/link";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import HomePage from "../src/components/HomePage";
import PGHOME from "../src/components/Home/PGHOME";
import BUYHOME from "../src/components/Home/BUYHOME";
import RENT from "../src/components/Home/RENT";
import HOTEL from "../src/components/Home/HOTEL";
const Counter = dynamic(() => import("../src/components/Counter"), {
  ssr: false,
});


const Index = () => {

  return (
    <div>
   
      {/* <!--====== Start Hero Section ======--> */}
    <HomePage/>
      {/* <!--====== Start PG Listing Section ======--> */}
   <PGHOME/>
   {/* <!--====== Start BUY Property Listing Section ======--> */}
  <BUYHOME/>
  {/* <!--====== Start RENT Property Listing Section ======--> */}
  <RENT/>
  {/* <!--====== Start HOTEL Property Listing Section ======--> */}
  <HOTEL/>
    </div>
  );
};
export default Index;
