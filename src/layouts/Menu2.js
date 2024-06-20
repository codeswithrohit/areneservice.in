// Menu2.js

import Link from "next/link";
import React, { Fragment } from "react";
import { useRouter } from 'next/router';

export const Home = ({ setToggle }) => (
  <Fragment>
    <li className="menu-item" onClick={() => setToggle(false)}>
      <Link href="/">Home</Link>
    </li>
  </Fragment>
);

export const About = ({ setToggle }) => (
  <Fragment>
    <li className="menu-item" onClick={() => setToggle(false)}>
      <Link href="/about">About</Link>
    </li>
  </Fragment>
);

export const Listing = ({ setToggle }) => (
  <Fragment>
    <li className="menu-item" onClick={() => setToggle(false)}>
      <Link href="/PGboy">Boys</Link>
    </li>
    <li className="menu-item" onClick={() => setToggle(false)}>
      <Link href="/PGgirl">Girls</Link>
    </li>
  </Fragment>
);

export const Pages = ({ setToggle }) => {
  const router = useRouter();

  const handleClick = (subcategory) => {
    setToggle(false);
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

export const Blog = ({ setToggle }) => {
  const router = useRouter();

  const handleClick = (subcategory) => {
    setToggle(false);
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

export const BanQueetHall = ({ setToggle }) => (
  <Fragment>
    <li className="menu-item" onClick={() => setToggle(false)}>
      <Link href="/banquethallall">Banqueet Hall</Link>
    </li>
  </Fragment>
);

export const CloudKitchen = ({ setToggle }) => (
  <Fragment>
    <li className="menu-item" onClick={() => setToggle(false)}>
      <Link href="/allarenechef">Arene Chef</Link>
    </li>
  </Fragment>
);

export const LaundryService = ({ setToggle }) => (
  <Fragment>
    <li className="menu-item" onClick={() => setToggle(false)}>
      <Link href="/allarenelaundry">Laundry</Link>
    </li>
  </Fragment>
);

export const Contact = ({ setToggle }) => (
  <Fragment>
    <li className="menu-item" onClick={() => setToggle(false)}>
      <Link href="/contact">Contact</Link>
    </li>
  </Fragment>
);

export default { Home, About, Listing, Pages, Blog, BanQueetHall, CloudKitchen, LaundryService, Contact };
