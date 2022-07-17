import React from "react";

const ServerApi = {
  BASE_URL: "https://rpa-voucher-exchange.herokuapp.com",
  LOGIN_ENDPOINT: "/api/v1/admin/auth/login",
  GETPRODUCTS_ENDPOINT: "/api/v1/admin/products?page=",
  GETVOUCHERS_ENDPOINT: "/api/v1/admin/vouchers?page=",
  GETALLPRODUCTS: "/api/v1/admin/products/getAll",
  CREATE_VOUCHER: "/api/v1/admin/vouchers",
  DELETE_VOUCHER: "/api/v1/admin/vouchers/",
  TEST_VOUCHERS: "/api/v1/admin/test_voucher",
  GET_VOUCHER_BY_ID: "/api/v1/admin/vouchers/",
  SEARCH_VOUCHERS_BY_KW: "/api/v1/admin/vouchers/search?query=",
  CREATE_PRODUCT: "/api/v1/admin/products",
  DELETE_PRODUCTS: "/api/v1/admin/products/delete_products",
  SEARCH_PRODUCTS_NY_KW: "/api/v1/admin/products/search?query=",
  GET_STAFFS: "/api/v1/admin/accounts?page=",
  SEARCH_STAFFS: "/api/v1/admin/accounts/search?query=",
  GET_TRANSACTIONS: "/api/v1/admin/transactions?page=",
  GET_TRANSACTION_DETAIL: "/api/v1/admin/transactions/",
  CHECK_TRANSACTION: "/api/v1/admin/transactions/",
  REGISTER_STAFF: "/api/v1/admin/auth/register_sales",
  TRANSACTION_SEARCH: "/api/v1/admin/transactions/search?",
};

export default ServerApi;
