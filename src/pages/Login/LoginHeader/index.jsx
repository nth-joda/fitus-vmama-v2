import React from "react";
import "./loginHeader.css";
import PayooLogo from "../../../assets/VMAMA logo/Payoo Logo.png";
import VmamaLogo from "../../../assets/VMAMA logo/VMAMA horiz.png";
const LoginHeader = () => {
  return (
    <div className="loginHeader">
      <div className="logoHeader__logo">
        <img src={PayooLogo} alt="Payoo Logo" />
      </div>

      <div className="logoHeader__logo">
        <img src={VmamaLogo} alt="Vmama logo" />
      </div>
    </div>
  );
};

export default LoginHeader;
