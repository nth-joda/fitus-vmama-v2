import React from "react";
import { useNavigate } from "react-router-dom";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

import LoginForm from "./LoginForm";
import LoginHeader from "./LoginHeader";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login = (props) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(true);
  const [error, setError] = React.useState(null);
  const handleClose = () => {
    setOpen(false);
  };

  const onHandleError = (err) => {
    setOpen(true);
    setError(err);
    if (err.status === 200) {
      if (props.from) navigate(props.from);
      else navigate("vouchers");
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
