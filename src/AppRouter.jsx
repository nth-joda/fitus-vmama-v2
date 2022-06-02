import React from "react";

import Vouchers from "./pages/Vouchers/index";
import Products from "./pages/Products/index";
import Vmachines from "./pages/Vmachines/index";
import NotFound from "./pages/NotFound";

import {
  BrowserRouter as Router,
  Navigate,
  useNavigate,
  Route,
  Routes,
} from "react-router-dom";
import Login from "./pages/Login";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login from="vouchers" />}></Route>
        <Route
          path="/vouchers"
          element={
            localStorage.getItem("token") ? (
              <Vouchers />
            ) : (
              <Login from="vouchers" />
            )
          }
        ></Route>
        <Route
          path="/products"
          element={
            localStorage.getItem("token") ? (
              <Products />
            ) : (
              <Login from="products" />
            )
          }
        ></Route>
        <Route
          path="/vmachines"
          element={
            localStorage.getItem("token") ? (
              <Vmachines />
            ) : (
              <Login from="vmachines" />
            )
          }
        ></Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
