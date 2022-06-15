import React from "react";

const ServerApi = {
  BASE_URL: "https://rpa-voucher-exchange.herokuapp.com",
  LOGIN_ENDPOINT: "/api/v1/auth/login",
  GETPRODUCTS_ENDPOINT: "/api/v1/products?page=",
  GETVOUCHERS_ENDPOINT: "/api/v1/vouchers?page=",
  GETALLPRODUCTS: "/api/v1/products/getAll",
  CREATE_VOUCHER: "/api/v1/vouchers",
  GET_VOUCHER_BY_ID: "/api/v1/vouchers/",
  CREATE_PRODUCT: "/api/v1/products",
  DELETE_PRODUCTS: "/api/v1/products/delete_products",
};

export default ServerApi;
