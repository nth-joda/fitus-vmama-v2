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
        <Grid item xs={2} sm={2} md={2}>
          <SideBar location="/vouchers" />
        </Grid>
        <Grid item xs={10} sm={10} md={10}>
          <MainContent>content vouchers</MainContent>
        </Grid>
      </Grid>
    </div>
  );
};

export default Vouchers;
