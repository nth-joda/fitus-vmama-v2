import React from "react";

const ServerApi = {
  BASE_URL: "https://rpa-voucher-exchange.herokuapp.com",
  LOGIN_ENDPOINT: "/api/v1/admin/auth/login",
  GETPRODUCTS_ENDPOINT: "/api/v1/admin/products?page=",
  GETVOUCHERS_ENDPOINT: "/api/v1/admin/vouchers?page=",
  GETALLPRODUCTS: "/api/v1/admin/products/getAll",
  CREATE_VOUCHER: "/api/v1/admin/vouchers",
  DELETE_VOUCHER: "/api/v1/admin/vouchers/",
  GET_VOUCHER_BY_ID: "/api/v1/admin/vouchers/",
  CREATE_PRODUCT: "/api/v1/admin/products",
  DELETE_PRODUCTS: "/api/v1/admin/products/delete_products",
  GET_STAFFS: "/api/v1/admin/accounts?page=",
  GET_TRANSACTIONS: "/api/v1/admin/transactions?page=",
  GET_TRANSACTION_DETAIL: "/api/v1/admin/transactions/",
  REGISTER_STAFF: "/api/v1/admin/auth/register_sales",
};

export default ServerApi;
