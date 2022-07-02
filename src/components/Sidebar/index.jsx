import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "./Card";
import "./sideBar.css";

import DiscountIcon from "@mui/icons-material/Discount";
import CategoryIcon from "@mui/icons-material/Category";
import Grid from "@mui/material/Grid";
import GroupIcon from "@mui/icons-material/Group";

const SideBar = (props) => {
  const navigate = useNavigate();
  const goTo = (location) => {
    navigate("/" + location);
  };
  return (
    <Grid
      container
      className="sideBar"
      justify="center"
      justifyContent="center"
    >
      <Grid item xs={4} sm={2.5} md={12}>
        <Card
          isActive={props.location === "/vouchers" ? true : false}
          icon={<DiscountIcon />}
          endpoint="vouchers"
          onNavigate={(where) => goTo(where)}
        >
          Vouchers
        </Card>
      </Grid>
      <Grid item xs={4} sm={2.5} md={12}>
        <Card
          isActive={props.location === "/products" ? true : false}
          endpoint="products"
          icon={<CategoryIcon />}
          onNavigate={(where) => goTo(where)}
        >
          Products
        </Card>
      </Grid>
      <Grid item xs={4} sm={2.5} md={12}>
        <Card
          isActive={props.location === "/user-management" ? true : false}
          endpoint="user-management"
          icon={<GroupIcon />}
          onNavigate={(where) => goTo(where)}
        >
          Người dùng
        </Card>
      </Grid>
    </Grid>
  );
};

export default SideBar;
