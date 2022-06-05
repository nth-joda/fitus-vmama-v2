import React, { useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import Popover from "@mui/material/Popover";
import "./header.css";
import VMAMALOGO from "../../assets/VMAMA logo/VMAMA Text only.png";
import HeaderDropdown from "./HeaderDropdown";
import Grid from "@mui/material/Grid";
const Header = () => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    setUserName(localStorage.getItem("name"));
  }, []);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <Grid container className="header">
      <Grid item xs={4.5} sm={3} md={1.5} container alignItems="center">
        <img src={VMAMALOGO} alt="logo" className="header__logo" />
      </Grid>
      <Grid item className="empty-space" xs={1} sm={5.8} md={8.8}></Grid>
      <Grid
        item
        xs={6}
        sm={2.8}
        md={1.5}
        className="header__menu"
        justify="center"
        container
        justifyContent="center"
      >
        <Grid
          item
          className="header__menu-profile"
          aria-describedby={id}
          variant="contained"
          onClick={handleClick}
          container
          alignItems="center"
          justifyContent="center"
        >
          <PersonIcon className="profile-avt"></PersonIcon>
          <span className="profile-name">{userName}</span>
        </Grid>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <HeaderDropdown></HeaderDropdown>
        </Popover>
      </Grid>
    </Grid>
  );
};

export default Header;
