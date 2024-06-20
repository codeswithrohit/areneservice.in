import Link from "next/link";
import React from "react";
import PageBanner from "../src/components/PageBanner";
import TestimoinalSlider from "../src/components/Slider/TestimonialSlider";
import Layout from "../src/layouts/Layout";

const About = () => {
  return (
    <div className="min-h-screen mt-16 bg-white" >

      {/*====== Start Features Section ======*/}
      <section className="features-area">
        <div className="features-wrapper-three pt-110">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="section-title text-center mb-6 wow fadeInUp">
                  <span className="sub-title">Our Service</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div
                  className="features-item features-item-two text-center mb-40 wow fadeInUp"
                  data-wow-delay="10ms"
                >
                
                  <div className="content">
                    <h3 className="title">ARENE PG</h3>
                    
                    <Link href="/AllPg">
                      <a className="btn-link icon-btn">More Details</a>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div
                  className="features-item features-item-two text-center mb-40 wow fadeInDown"
                  data-wow-delay="20ms"
                >
                  
                  <div className="content">
                    <h3 className="title">BUY PROPERTY</h3>
                   
                    <Link href="/Allbuy">
                      <a className="btn-link icon-btn">More Details</a>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div
                  className="features-item features-item-two text-center mb-40 wow fadeInUp"
                  data-wow-delay="30ms"
                >
                  
                  <div className="content">
                    <h3 className="title">RENT PROPERTY</h3>
                  
                    <Link href="/Allrent">
                      <a className="btn-link icon-btn">More Details</a>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div
                  className="features-item features-item-two text-center mb-40 wow fadeInDown"
                  data-wow-delay="40ms"
                >
                  <div className="content">
                    <h3 className="title">Hotel</h3>
                   
                    <Link href="/hotelall">
                      <a className="btn-link icon-btn">More Details</a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*====== End Features Section ======*/}
      {/*====== Start Features Section ======*/}
      <section className="features-area">
        <div className="features-wrapper-four ">
          <div className="container">
            <div className="row">
              <div className="col-lg-6">
                <div className="features-img wow fadeInLeft">
                  <img
                    src="https://media.licdn.com/dms/image/C5612AQHyzhAzEblGag/article-cover_image-shrink_600_2000/0/1520253580718?e=2147483647&v=beta&t=92rJHwgyMNCGsFPfPkgERZWUYQwkqlJDsLw58FwnJuo"
                    alt="Features Image"
                  />
                </div>
              </div>
              <div className="col-lg-6">
                <div className="features-content-box features-content-box-one">
                  <div className="section-title section-title-left mb-30 wow fadeInUp">
                    <span className="sub-title">Our Speciality</span>
                    <h2>About Arene Services</h2>
                  </div>
                 
                  <ul className="features-list-one">
                    <li
                      className="list-item wow fadeInUp"
                      data-wow-delay="10ms"
                    >
                      <div className="icon">
                        <i className="flaticon-find" />
                      </div>
                      <div className="content">
                        <h5>Find What You Want</h5>
                        <p>
                        Welcome to Arene Services, your premier destination for all your property needs without any brokerage hassles. We specialize in providing top-notch services in PG accommodations, buying, renting, and selling properties, managing hotels, banquet halls, resorts, and laundry facilities.
                        </p>
                      </div>
                    </li>
                    <li
                      className="list-item wow fadeInUp"
                      data-wow-delay="20ms"
                    >
                      <div className="icon">
                        <i className="flaticon-place" />
                      </div>
                      <div className="content">
                        <h5>Easy Choose Your Place</h5>
                        <p>
                        At Arene Services, we pride ourselves on our commitment to excellence, transparency, and customer satisfaction. In addition to our core services, we also operate our own cloud kitchen where we prepare and deliver high-quality, delicious food at minimal costs.
                        </p>
                      </div>
                    </li>
                    <li
                      className="list-item wow fadeInUp"
                      data-wow-delay="30ms"
                    >
                      <div className="icon">
                        <i className="flaticon-social-care" />
                      </div>
                      <div className="content">
                        <h5>Live Online Assistance</h5>
                        <p>
                        Our dedicated team of professionals works tirelessly to ensure that your experience with us is seamless, efficient, and tailored to your specific requirements. Whether you are looking for a comfortable PG accommodation, a dream property to buy or rent, a luxurious hotel stay, a stunning banquet hall for your special event, a relaxing resort getaway, or reliable laundry services, Arene Services is your one-stop solution.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
 
    </div>
  );
};
export default About;
