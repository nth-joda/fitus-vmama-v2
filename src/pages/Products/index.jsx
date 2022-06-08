import React, { useEffect, useState } from "react";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

import "./products.css";
import MainContent from "../../components/MainContent";
import Header from "../../components/Header";
import SideBar from "../../components/Sidebar";
import AddProduct from "./AddProduct";
import MainContentHeader from "../../components/MainContent/MainContentHeader";

import { DataGrid } from "@mui/x-data-grid";
import Table from "../../utils/Table";
import Wrapper from "../../utils/Wrapper";
import SERVER_API from "../../objects/ServerApi";
const renderHeaders = () => {
  return (
    <Wrapper>
      <th className="table__th">
        <Checkbox />
      </th>
      <th className="table__th">ID</th>
      <th className="table__th">Tên Sản phẩm</th>
    </Wrapper>
  );
};

const renderBody = (prods) => {
  return (
    <Wrapper>
      {prods.map((item) => (
        <tr className="table__tr">
          <td>
            <Checkbox />
          </td>
          <td className="table__td">
            <span className="table__mobile-caption">ID</span>
            <span className="table__value">{item.ID}</span>
          </td>
          <td className="table__td table__mobile-title">
            <span>{item.ProductName}</span>
          </td>
        </tr>
      ))}

      {/* <tr className="table__tr">
        <td className="table__td table__mobile-title">
          <span>Post production</span>
        </td>
        <td className="table__td">
          <span className="table__mobile-caption">Silver Package</span>
          <span className="table__value">2 weeks</span>
        </td>
        <td className="table__td">
          <span className="table__mobile-caption">Gold Package</span>
          <span className="table__value">3 weeks</span>
        </td>
        <td className="table__td">
          <span className="table__mobile-caption">Platinum Package</span>
          <span className="table__value">4 weeks</span>
        </td>
      </tr> */}
    </Wrapper>
  );
};

const Products = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState("1");
  const [products, setProducts] = useState([]);
  const catchData = (res) => {
    const meta = res.data.metadata;
    const prods = res.data.products;
    if (meta != null) setTotalPages(meta.total_pages);
    if (prods != null) setProducts(prods);
  };
  const loadData = () => {
    const local_token = localStorage.getItem("token");
    setIsLoading(true);
    if (local_token !== null || local_token !== "") {
      const config = {
        headers: {
          Authorization: "Bearer " + local_token,
          "Content-Type": "application/json",
        },
      };
      axios
        .get(
          SERVER_API.BASE_URL + SERVER_API.GETPRODUCTS_ENDPOINT + currentPage,
          config
        )
        .then((res) => {
          console.log(res);
          catchData(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err);
        });
    } else {
      localStorage.removeItem("name");
      localStorage.removeItem("token");
    }
  };

  useEffect(() => {
    loadData();
  }, [currentPage]);
  return (
    <div>
      <Header />
      <Grid container>
        <Grid item xs={12} sm={12} md={2}>
          <SideBar location="/products" />
        </Grid>
        <Grid item xs={12} sm={12} md={10}>
          <MainContent of="products">
            <Box>
              <MainContentHeader />
              {isLoading ? (
                <Box sx={{ textAlign: "center" }}>
                  <CircularProgress sx={{ color: "white", margin: "1rem" }} />
                </Box>
              ) : (
                <div className="content_body">
                  <Table
                    headers={renderHeaders()}
                    body={renderBody(products)}
                  />
                  <div className="mainContent__footer">
                    <Stack spacing={2}>
                      <Pagination
                        count={totalPages}
                        variant="outlined"
                        color="secondary"
                        shape="rounded"
                        onChange={(event, pageNumber) => {
                          setCurrentPage(pageNumber);
                          console.log(pageNumber);
                        }}
                      />
                    </Stack>
                  </div>
                </div>
              )}
            </Box>
            {/* <AddProduct /> */}
          </MainContent>
        </Grid>
      </Grid>
    </div>
  );
};

export default Products;
