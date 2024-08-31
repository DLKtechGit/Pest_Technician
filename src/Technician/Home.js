import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Menus from "../Screens/Customer/Home/Menus/Menus";
import { Heading } from "../Reusable/Headings/Heading";
import Caroseuls from "../Reusable/Caroseuls";
import CustomerList from './Customerllist/CustomerList';

const Home = () => {
 
  const navigate = useNavigate();
  
  useEffect(() => {
    const location = localStorage.getItem("location_check")
    if(!location){
      navigate('/tech/home')
    }
    const isLoggedIn = localStorage.getItem("login") === 'true'; 
    if (!isLoggedIn) {
      navigate("/"); 
      return; 
    }
    localStorage.setItem("location", window.location.pathname);
  }, []);

  return (
    <div>
      <Menus title="HOME" />
      <section>
        <Heading heading="Your Ultimate Pest Control Solution Starts Here!" />
      </section>
      <section>
        <Caroseuls showDots={true} />
      </section>
      <CustomerList />
      <section></section>
    </div>
  );
};

export default Home;
