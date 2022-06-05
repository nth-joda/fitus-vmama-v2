import React from "react";
import Header from "../../components/Header";
import SideBar from "../../components/Sidebar";
import Grid from "@mui/material/Grid";
import "./products.css";
import MainContent from "../../components/MainContent";

const Products = () => {
  return (
    <div>
      <Header />
      <Grid container>
        <Grid item xs={1.5} sm={1.5} md={2}>
          <SideBar location="/products" />
        </Grid>
        <Grid item xs={10} sm={10} md={10}>
          <MainContent>Main Content Products</MainContent>
        </Grid>
      </Grid>
    </div>
  );
};

export default Products;
