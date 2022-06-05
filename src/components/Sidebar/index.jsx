import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "./Card";
import "./sideBar.css";

import DiscountIcon from "@mui/icons-material/Discount";
import CategoryIcon from "@mui/icons-material/Category";

const SideBar = (props) => {
  const navigate = useNavigate();
  const goTo = (location) => {
    navigate("/" + location);
  };
  return (
    <div className="sideBar">
      <Card
        isActive={props.location === "/vouchers" ? true : false}
        icon={<DiscountIcon />}
        onNavigate={(where) => goTo(where)}
      >
        Vouchers
      </Card>
      <Card
        isActive={props.location === "/products" ? true : false}
        icon={<CategoryIcon />}
        onNavigate={(where) => goTo(where)}
      >
        Products
      </Card>
    </div>
  );
};

export default SideBar;
