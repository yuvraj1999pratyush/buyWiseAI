import React from "react";
import BuyWiseLogo from "../assets/BuyWiseLogo";
import "../styles/navbar.css";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-cont">
        <div className="navbar-logo">
          <h3 className="navbar-logo__maintext">BuyWise</h3>
          <h1 className="navbar-logo__altext">AI</h1>
          <BuyWiseLogo />
        </div>
        <p className="navbar-tagline">Find the best, skip the rest.</p>
      </div>
    </div>
  );
};

export default Navbar;
