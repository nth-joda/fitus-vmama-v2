import React, { useState, useEffect } from "react";

import Vouchers from "./pages/Vouchers/index";
import Products from "./pages/Products/index";
import Vmachines from "./pages/Vmachines/index";
import NotFound from "./pages/NotFound";

import { Navigate, useNavigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";

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
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </div>
  );
};

export default AppRouter;
