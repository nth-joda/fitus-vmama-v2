import React from "react";

const ServerApi = {
  BASE_URL: "https://rpa-voucher-exchange.herokuapp.com",
  LOGIN_ENDPOINT: "/api/v1/auth/login",
  GETPRODUCTS_ENDPOINT: "/api/v1/products?page=",
  GETVOUCHERS_ENDPOINT: "/api/v1/vouchers?page=",
  GETALLPRODUCTS: "/api/v1/products/getAll",
  CREATE_VOUCHER: "/api/v1/vouchers",
  GET_VOUCHER_BY_ID: "/api/v1/vouchers/",
};

export default ServerApi;
