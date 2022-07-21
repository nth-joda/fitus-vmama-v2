import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "./Card";
import "./sideBar.css";

import DiscountIcon from "@mui/icons-material/Discount";
import RedeemIcon from "@mui/icons-material/Redeem";
import WidgetsIcon from "@mui/icons-material/Widgets";
import Grid from "@mui/material/Grid";
import GroupIcon from "@mui/icons-material/Group";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
const SideBar = (props) => {
  const navigate = useNavigate();
  const goTo = (location) => {
    navigate("/" + location);
    props.handleRefresh();
  };
  return (
    <Grid
      container
      className="sideBar"
      justify="center"
      justifyContent="center"
    >
      <Grid item xs={6} sm={2.5} md={12}>
        <Card
          isActive={props.location === "/vouchers" ? true : false}
          icon={<DiscountIcon />}
          endpoint="vouchers"
          onNavigate={(where) => goTo(where)}
        >
          Khuyến mãi
        </Card>
      </Grid>
      <Grid item xs={6} sm={2.5} md={12}>
        <Card
          isActive={props.location === "/gifts" ? true : false}
          icon={<RedeemIcon />}
          endpoint="gifts"
          onNavigate={(where) => goTo(where)}
        >
          Quà tặng
        </Card>
      </Grid>
      <Grid item xs={6} sm={2.5} md={12}>
        <Card
          isActive={props.location === "/products" ? true : false}
          endpoint="products"
          icon={<WidgetsIcon />}
          onNavigate={(where) => goTo(where)}
        >
          Sản phẩm
        </Card>
      </Grid>
      <Grid item xs={6} sm={2.5} md={12}>
        <Card
          isActive={props.location === "/user-management" ? true : false}
          endpoint="user-management"
          icon={<GroupIcon />}
          onNavigate={(where) => goTo(where)}
        >
          Nhân viên
        </Card>
      </Grid>

      <Grid item xs={6} sm={2.5} md={12}>
        <Card
          isActive={props.location === "/transactions" ? true : false}
          endpoint="transactions"
          icon={<ReceiptLongIcon />}
          onNavigate={(where) => goTo(where)}
        >
          Giao dịch
        </Card>
      </Grid>
    </Grid>
  );
};

export default SideBar;
