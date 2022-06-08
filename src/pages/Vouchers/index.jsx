import React from "react";
import Header from "../../components/Header";
import SideBar from "../../components/Sidebar";
import Grid from "@mui/material/Grid";
import "./vouchers.css";
import MainContent from "../../components/MainContent";
const Vouchers = () => {
  return (
    <div>
      <Header />
      <Grid container>
        <Grid item xs={12} sm={12} md={2}>
          <SideBar location="/vouchers" />
        </Grid>
        <Grid item xs={12} sm={12} md={10}>
          <MainContent of="vouchers">content vouchers</MainContent>
        </Grid>
      </Grid>
    </div>
  );
};

export default Vouchers;
