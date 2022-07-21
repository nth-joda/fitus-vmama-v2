import React, { useState, useEffect } from "react";

import Vouchers from "./pages/Vouchers/index";
import Products from "./pages/Products/index";
import Vmachines from "./pages/Vmachines/index";
import Gifts from "./pages/Gifts/index";
import NotFound from "./pages/NotFound";

import { Navigate, useNavigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import UserManagement from "./pages/UserManagement";
import Transactions from "./pages/Transactions";
import TestChart from "./pages/TestCharts";

const AppRouter = () => {
  let navigate = useNavigate();
  const handleNavigate = (m) => {
    if (m === true) {
      navigate("/vouchers");
    }
  };

  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/vouchers" />}></Route>
        <Route
          path="/login"
          element={<Login handleAuth={(auth) => handleNavigate(auth)} />}
        ></Route>
        <Route
          path="/vouchers"
          element={
            localStorage.getItem("token") ? (
              <Vouchers />
            ) : (
              <Navigate to="/login" />
            )
          }
        ></Route>
        <Route
          path="/gifts"
          element={
            localStorage.getItem("token") ? (
              <Gifts />
            ) : (
              <Navigate
                to={{ pathname: "/login", state: { from: "/gifts" } }}
              />
            )
          }
        ></Route>
        <Route
          path="/products"
          element={
            localStorage.getItem("token") ? (
              <Products />
            ) : (
              <Navigate
                to={{ pathname: "/login", state: { from: "/products" } }}
              />
            )
          }
        ></Route>
        <Route
          path="/User-Management"
          element={
            localStorage.getItem("token") ? (
              <UserManagement />
            ) : (
              <Navigate
                to={{ pathname: "/login", state: { from: "/User-Management" } }}
              />
            )
          }
        ></Route>
        <Route
          path="/vmachines"
          element={
            localStorage.getItem("token") ? (
              <Vmachines />
            ) : (
              <Navigate
                to={{ pathname: "/login", state: { from: "/vmachines" } }}
              />
            )
          }
        ></Route>
        <Route
          path="/transactions"
          element={
            localStorage.getItem("token") ? (
              <Transactions />
            ) : (
              <Navigate
                to={{ pathname: "/login", state: { from: "/transactions" } }}
              />
            )
          }
        ></Route>
        <Route path="/charts" element={<TestChart />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </div>
  );
};

export default AppRouter;
