import React from "react";
import { useNavigate } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import ProfileWrapper from "../ProfileWrapper";
import "./headerDropdown.css";
const HeaderDropdown = () => {
  let navigate = useNavigate();
  const onLogOut = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    console.log("local: ", localStorage);
    console.log("logut, navigate: login");
    navigate("/login");
  };
  return (
    <ProfileWrapper>
      <MenuItem>
        <Grid container columnSpacing={6} alignItems="center">
          <Grid item xs={3} sm={4}>
            <SettingsIcon sx={{ verticalAlign: "middle" }} />
          </Grid>
          <Grid item xs={9} sm={8}>
            <p>Cài đặt</p>
          </Grid>
        </Grid>
      </MenuItem>
      <MenuItem className="logout" onClick={onLogOut}>
        <Grid container columnSpacing={6} alignItems="center">
          <Grid item xs={3} sm={4} container>
            <LogoutIcon sx={{ verticalAlign: "middle" }} />
          </Grid>
          <Grid item xs={9} sm={8}>
            <p>Đăng xuất</p>
          </Grid>
        </Grid>
      </MenuItem>
    </ProfileWrapper>
  );
};

export default HeaderDropdown;
