import React from "react";
import { useNavigate } from "react-router-dom";
import "./sideBar.css";

const SideBar = () => {
  const navigate = useNavigate();
  const goTo = (location) => {
    navigate(location);
  };
  return (
    <div>
      <div onClick={() => goTo("/vouchers")} className="sideBar__location">
        Vouchers
      </div>
      <div onClick={() => goTo("/products")} className="sideBar__location">
        Products
      </div>
      <div onClick={() => goTo("/vmachines")} className="sideBar__location">
        Vmachines
      </div>
    </div>
  );
};

export default SideBar;
