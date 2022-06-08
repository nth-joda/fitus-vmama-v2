import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "./mainContentHeader.css";
// const Span = styled("span")(({ theme }) => ({
//   ...theme.typography.button,
//   padding: theme.spacing(1),
//   fontSize: "2rem",
//   color: "#005593",
// }));

// const useStyles = makeStyles((theme) => ({
//   root: {
//     overflow: "hidden",
//     width: "100%",
//     borderRadius: "0.6rem",
//     color: "#000",
//     backgroundColor: "#fff",
//     "&:hover": {
//       backgroundColor: "#fff",
//     },
//     "&$focused": {
//       backgroundColor: "#fff",
//     },
//   },
//   focused: {},
// }));

const MainContentHeader = (props) => {
  return (
    <Grid
      container
      className="mainContentHeader"
      spacing={1}
      alignItems="center"
    >
      <Grid item xs={12} sm={4.5} md={5}>
        <TextField
          id="outlined-adornment-password"
          variant="outlined"
          type="text"
          label={props.of ? "Nhập tên " + props.of + " ..." : "Nhập từ khóa"}
          size="small"
          sx={{ width: "100%" }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <span fontSize={2}>I</span>
                <IconButton
                  color="primary"
                  // onClick={this.handleClickShowPassword}
                >
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item xs={0} sm={0.5} md={2}></Grid>
      <Grid
        item
        xs={12}
        sm={7}
        md={5}
        container
        spacing={3}
        alignItems="center"
      >
        <Grid item>
          <button className="btn btn-primary custom">
            <RefreshIcon
              sx={{ verticalAlign: "middle", marginRight: "0.5rem" }}
            />
            Làm mới
          </button>
        </Grid>

        <Grid item>
          <button className="btn btn-safe custom">
            <AddIcon sx={{ verticalAlign: "middle", marginRight: "0.5rem" }} />
            Thêm
          </button>
        </Grid>

        <Grid item>
          <button className="btn btn-danger custom">
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
