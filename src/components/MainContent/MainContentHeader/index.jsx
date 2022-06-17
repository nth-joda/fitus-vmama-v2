import React, { useState } from "react";
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
  // const [inputSearchTerm, setInputSearchTerm] = useState("");
  return (
    <Grid
      container
      className="mainContentHeader"
      spacing={1}
      alignItems="center"
    >
      <Grid item xs={12} sm={4} md={5}>
        <TextField
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
        />
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
