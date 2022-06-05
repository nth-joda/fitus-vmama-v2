import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

import LoginForm from "./LoginForm";
import LoginHeader from "./LoginHeader";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login = (props) => {
  let navigate = useNavigate();
  const [open, setOpen] = React.useState(true);
  const [error, setError] = React.useState(null);
  const handleClose = () => {
    setOpen(false);
  };

  // useEffect(() => {
  //   if (localStorage.length > 0) {
  //     if (
  //       localStorage.getItem("name") !== null &&
  //       localStorage.getItem("name") !== "" &&
  //       localStorage.getItem("token") !== null &&
  //       localStorage.getItem("token") !== ""
  //     ) {
  //       if (props.from) {
  //         console.log("navigate to:", props.from);
  //         navigate(props.from);
  //       } else {
  //         console.log("navigate back");
  //         navigate(-1);
  //       }
  //     }
  //   }
  // }, []);

  const onHandleError = (err) => {
    setOpen(true);
    setError(err);
    if (err.status === 200) {
      console.log(err.data.name);
      localStorage.setItem("name", err.data.name);
      localStorage.setItem("token", err.data.token);
      console.log(localStorage);
      props.handleAuth(true);
    }
  };

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <LoginHeader />
      <LoginForm handleError={(err) => onHandleError(err)} />
      {error !== null ? (
        <Snackbar
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleClose}
            severity={error.status === 200 ? "success" : "error"}
          >
            {error.message}
          </Alert>
        </Snackbar>
      ) : null}
    </Stack>
  );
};

export default Login;
