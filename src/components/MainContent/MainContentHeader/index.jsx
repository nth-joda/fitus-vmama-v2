import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import "./mainContentHeader.css";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "white",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "white",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1.5em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "100%",
    },
    [theme.breakpoints.up("sm")]: {
      width: "100%",
    },
    [theme.breakpoints.up("xs")]: {
      width: "100%",
    },
  },
}));

const MainContentHeader = (props) => {
  // const [inputSearchTerm, setInputSearchTerm] = useState("");
  return (
    <Grid
      container
      className="mainContentHeader"
      spacing={1}
      alignItems="center"
    >
      <Grid item xs={12} sm={4} md={5}>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder={
              props.of ? "Nhập tên " + props.of + " ..." : "Nhập từ khóa"
            }
            inputProps={{ "aria-label": "search" }}
            onChange={(e) => props.catchTerm(e.target.value)}
          />
        </Search>
        {/* <TextField
          id="outlined-adornment-password"
          variant="outlined"
          type="text"
          label={props.of ? "Nhập tên " + props.of + " ..." : "Nhập từ khóa"}
          size="small"
          sx={{ width: "100%" }}
          onChange={(e) => props.catchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <span fontSize={2}>I</span>
                <IconButton color="primary" type="submit">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
            className: { color: "red" },
          }}
        /> */}
      </Grid>
      <Grid item xs={0} sm={0} md={2}></Grid>
      <Grid
        item
        xs={12}
        sm={7.5}
        md={5}
        container
        spacing={2}
        justify="center"
        justifyContent="center"
      >
        <Grid item xs={4} sm={4} md={4}>
          <button
            className={"btn btn-primary fullWidth"}
            disabled={props.isRefreshDisabled}
            onClick={() => props.handleRefreshClicked()}
          >
            <RefreshIcon
              sx={{ verticalAlign: "middle", marginRight: "0.5rem" }}
            />
            Làm mới
          </button>
        </Grid>

        <Grid item xs={4} sm={4} md={4}>
          <button
            className="btn btn-safe fullWidth"
            disabled={props.isAddDisabled}
            onClick={() => props.handleAddClicked()}
          >
            <AddIcon sx={{ verticalAlign: "middle", marginRight: "0.5rem" }} />
            Thêm
          </button>
        </Grid>

        <Grid item xs={4} sm={4} md={4}>
          <button
            className="btn btn-danger fullWidth"
            disabled={props.isDeleteDisabled}
            onClick={() => props.handleDeleteClicked()}
          >
            <DeleteForeverIcon
              sx={{ verticalAlign: "middle", marginRight: "0.5rem" }}
            />
            Xóa
          </button>
        </Grid>
      </Grid>
    </Grid>
  );
};
export default MainContentHeader;
