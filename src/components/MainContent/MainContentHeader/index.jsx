import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
// import TextField from "@mui/material/TextField";
// import InputAdornment from "@mui/material/InputAdornment";
// import IconButton from "@mui/material/IconButton";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import "./mainContentHeader.css";

const Search = styled("div")(({ theme }) => ({
  // position: "absolute",
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
  display: "inline-block",
  alignItems: "center",
  justifyContent: "center",
  color: "#ccc",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "white",
  width: "95%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(0.0em + ${theme.spacing(4)})`,

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
  const getNumOfBtns = () => {
    let i = 0;
    if (props.addOn) i = i + 1;
    if (props.refOn) i = i + 1;
    if (props.checkOn) i = i + 1;
    if (props.delOn) i = i + 1;
    return i;
  };
  const [inputSearchTerm, setInputSearchTerm] = useState(null);
  useEffect(() => {
    if (props.isResetSearch) {
      setInputSearchTerm(null);
    }
  }, [props.isResetSearch]);
  return (
    <Grid
      container
      className="mainContentHeader"
      spacing={1}
      alignItems="center"
    >
      <Grid container item xs={12} sm={4} md={7}>
        <form
          style={{ width: "100%" }}
          onSubmit={(event) => {
            event.preventDefault();

            if (inputSearchTerm != null) props.catchTerm(inputSearchTerm);
            else props.catchTerm("");
          }}
        >
          <Grid container>
            <Grid item xs={10} sm={10} md={8}>
              <Search>
                <StyledInputBase
                  placeholder={
                    props.of ? "Nh???p t??n " + props.of + " ..." : "Nh???p t??? kh??a"
                  }
                  inputProps={{ "aria-label": "search" }}
                  onChange={(e) => {
                    if (e.target.value !== "")
                      setInputSearchTerm(e.target.value);
                    else {
                      setInputSearchTerm(null);
                      props.catchTerm("");
                    }
                  }}
                  value={inputSearchTerm != null ? inputSearchTerm : ""}
                />
              </Search>
            </Grid>
            <Grid item xs={2} sm={2} md={0.5}>
              <IconButton type="submit" sx={{ color: "white" }} size="medium">
                <SearchIcon />
              </IconButton>
            </Grid>
          </Grid>
        </form>
      </Grid>

      <Grid
        item
        xs={12}
        sm={7.5}
        md={5}
        container
        spacing={2}
        justify="flex-end"
        justifyContent="center"
      >
        {props.checkOn && (
          <Grid
            item
            xs={12 / getNumOfBtns()}
            sm={12 / getNumOfBtns()}
            md={12 / getNumOfBtns()}
            alignSelf="center"
            justifyContent={"center"}
          >
            <button
              className={"btn btn-light-green fullWidth"}
              disabled={props.isCheckingDisabled}
              onClick={() => props.handleCheckClicked()}
            >
              {/* <RefreshIcon
              sx={{ verticalAlign: "middle", marginRight: "0.5rem" }}
            /> */}
              <FactCheckOutlinedIcon
                sx={{ verticalAlign: "middle", marginRight: "0.5rem" }}
              />
              Ki???m tra
            </button>
          </Grid>
        )}
        {props.refOn && (
          <Grid
            item
            xs={12 / getNumOfBtns()}
            sm={12 / getNumOfBtns()}
            md={12 / getNumOfBtns()}
            alignSelf="center"
            justifyContent={"center"}
          >
            <button
              className={"btn btn-primary fullWidth"}
              disabled={props.isRefreshDisabled}
              onClick={() => props.handleRefreshClicked()}
            >
              <RefreshIcon
                sx={{ verticalAlign: "middle", marginRight: "0.5rem" }}
              />
              L??m m???i
            </button>
          </Grid>
        )}
        {props.addOn && (
          <Grid
            container
            item
            xs={12 / getNumOfBtns()}
            sm={12 / getNumOfBtns()}
            md={12 / getNumOfBtns()}
          >
            <button
              className="btn btn-safe fullWidth"
              disabled={props.isAddDisabled}
              onClick={() => props.handleAddClicked()}
            >
              {props.addIcon ? (
                props.addIcon
              ) : (
                <AddIcon
                  sx={{ verticalAlign: "middle", marginRight: "0.5rem" }}
                />
              )}
              {props.addName ? props.addName : "Th??m"}
            </button>
          </Grid>
        )}

        {props.delOn && (
          <Grid
            item
            xs={12 / getNumOfBtns()}
            sm={12 / getNumOfBtns()}
            md={12 / getNumOfBtns()}
          >
            <button
              className={
                props.deleteColor
                  ? "btn btn-" + props.deleteColor + " fullWidth"
                  : "btn btn-danger fullWidth"
              }
              disabled={props.isDeleteDisabled}
              onClick={() => props.handleDeleteClicked()}
            >
              {props.deleteIcon ? (
                props.deleteIcon
              ) : (
                <DeleteForeverIcon
                  sx={{ verticalAlign: "middle", marginRight: "0.5rem" }}
                />
              )}
              {props.deleteName ? props.deleteName : "X??a B???"}
            </button>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};
export default MainContentHeader;
