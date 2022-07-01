import React, { useState } from "react";
import "./userManagement.css";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import Header from "../../components/Header";
import SideBar from "../../components/Sidebar";
import MainContent from "../../components/MainContent";
import MainContentHeader from "../../components/MainContent/MainContentHeader";

const UserManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedList, setSelectedList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const onHandleRefreshClicked = () => {};

  const onHandleDeleteClicked = () => {};

  const onHandleAddClicked = () => {};

  return (
    <div>
      <Header />
      <Grid container>
        <Grid item xs={12} sm={12} md={2}>
          <SideBar location="/user-management" />
        </Grid>
        <Grid item xs={12} sm={12} md={10}>
          <MainContent>
            <Box>
              <MainContentHeader
                of="tên người dùng"
                isRefreshDisabled={isLoading}
                isDeleteDisabled={selectedList.length > 0 ? false : true}
                handleRefreshClicked={onHandleRefreshClicked}
                handleDeleteClicked={onHandleDeleteClicked}
                handleAddClicked={onHandleAddClicked}
                catchTerm={(term) => setSearchTerm(term)}
              />
            </Box>
          </MainContent>
        </Grid>
      </Grid>
    </div>
  );
};

export default UserManagement;
