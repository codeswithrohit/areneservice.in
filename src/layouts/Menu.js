import Link from "next/link";
import React, { Fragment } from "react";
import { useRouter } from 'next/router';

export const Home = () => (
  <Fragment>
    <li className="menu-item" >
      <Link href="/">Home</Link>
    </li>
  </Fragment>
);

export const About = () => (
  <Fragment>
    <li className="menu-item" >
      <Link href="/about">About</Link>
    </li>
  </Fragment>
);

export const Listing = () => (
  <Fragment>
    <li className="menu-item" >
      <Link href="/PGboy">Boys</Link>
    </li>
    <li className="menu-item" >
      <Link href="/PGgirl">Girls</Link>
    </li>
  </Fragment>
);

export const Pages = () => {
  const router = useRouter();

  const handleClick = (subcategory) => {
    router.push({
      pathname: '/Allbuysubcat',
      query: { subcategory: subcategory }
    });
  };

  return (
    <Fragment>
      <li className="menu-item" onClick={() => handleClick('Appartment')}>
        <Link href="">Appartment</Link>
      </li>
      <li className="menu-item" onClick={() => handleClick('Builder Floor')}>
        <Link href="">Builder Floor</Link>
      </li>
      <li className="menu-item" onClick={() => handleClick('Bunglow')}>
        <Link href="">Bunglow</Link>
      </li>
      <li className="menu-item" onClick={() => handleClick('Shop/Showroom')}>
        <Link href="">Shop/Showroom</Link>
      </li>
      <li className="menu-item" onClick={() => handleClick('Office Space')}>
        <Link href="">Office Space</Link>
      </li>
      <li className="menu-item" onClick={() => handleClick('Go Down')}>
        <Link href="">Go Down</Link>
      </li>
      <li className="menu-item" onClick={() => handleClick('Land')}>
        <Link href="">Land</Link>
      </li>
      <li className="menu-item" onClick={() => handleClick('Villas')}>
        <Link href="">Villas</Link>
      </li>
    </Fragment>
  );
};

export const Blog = () => {
  const router = useRouter();

  const handleClick = (subcategory) => {
 
    router.push({
      pathname: '/Allrentsubcat',
      query: { subcategory: subcategory }
    });
  };

  return (
    <Fragment>
      <li className="menu-item" onClick={() => handleClick('Appartment')}>
        <Link href="">Appartment</Link>
      </li>
      <li className="menu-item" onClick={() => handleClick('Builder Floor')}>
        <Link href="">Builder Floor</Link>
      </li>
      <li className="menu-item" onClick={() => handleClick('Bunglow')}>
        <Link href="">Bunglow</Link>
      </li>
      <li className="menu-item" onClick={() => handleClick('Shop/Showroom')}>
        <Link href="">Shop/Showroom</Link>
      </li>
      <li className="menu-item" onClick={() => handleClick('Office Space')}>
        <Link href="">Office Space</Link>
      </li>
      <li className="menu-item" onClick={() => handleClick('Go Down')}>
        <Link href="">Go Down</Link>
      </li>
      <li className="menu-item" onClick={() => handleClick('Villas')}>
        <Link href="">Villas</Link>
      </li>
    </Fragment>
  );
};

export const BanQueetHall = () => (
  <Fragment>
    <li className="menu-item" >
      <Link href="/banquethallall">Banqueet Hall</Link>
    </li>
  </Fragment>
);

export const CloudKitchen = () => (
  <Fragment>
    <li className="menu-item" >
      <Link href="/allarenechef">Arene Chef</Link>
    </li>
  </Fragment>
);

export const LaundryService = () => (
  <Fragment>
    <li className="menu-item" >
      <Link href="/allarenelaundry">Laundry</Link>
    </li>
  </Fragment>
);

export const Contact = () => (
  <Fragment>
    <li className="menu-item" >
      <Link href="/contact">Contact</Link>
    </li>
  </Fragment>
);
