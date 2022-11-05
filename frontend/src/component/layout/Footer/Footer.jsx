import React from "react";
import playStore from "../../../images/playstore.jpg";
import appstore from "../../../images/appstore.jpg";
import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download App for Android and IOS mobile phone</p>
        <img src={playStore} alt="playstore" />
        <img src={appstore} alt="appstore" />
      </div>

      <div className="midFooter">
        <h1>ELECTRONICFIND.COM</h1>
        <p>High Quality is our first priority</p>

        <p>Copyrights 2022 &copy; MeAnilKumar</p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="https://www.linkedin.com/in/anilkumareth/">Linkedin</a>
        <a href="https://mobile.twitter.com/AnilKum13806593">Twitter</a>
        
      </div>
    </footer>
  );
};

export default Footer;