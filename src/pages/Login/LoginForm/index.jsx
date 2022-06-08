import React, { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import Link from "@mui/material/Link";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useFormik } from "formik";
import axios from "axios";

import "./loginForm.css";
import SERVER_API from "../../../objects/ServerApi";
import ServerResponse from "../../../objects/ServerResponse";

const LoginForm = (props) => {
  const [canSubmit, setCanSubmit] = useState(false);

  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const switchVisibility = () => {
    setIsVisible(!isVisible);
  };

  const formik = useFormik({
    initialValues: {
      userName: "",
      passWord: "",
      rememberMe: false,
    },
    onSubmit: (values) => {
      setIsLoading(true);
      console.log(SERVER_API.BASE_URL + SERVER_API.LOGIN_ENDPOINT);
      axios
        .post(SERVER_API.BASE_URL + SERVER_API.LOGIN_ENDPOINT, {
          username: values.userName,
          password: values.passWord,
        })
        .then((res) => {
          console.log(res);
          setIsLoading(false);
          res = ServerResponse(res);
          props.handleError(res);
        })
        .catch((err) => {
          setIsLoading(false);
          err = ServerResponse(err);
          props.handleError(err);
        });
    },
  });

  window.onbeforeunload = function () {
    if (!formik.values.rememberMe) {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      console("xoa cookie");
    }
  };

  const checkCanSubmit = () => {
    if (formik.values.userName !== "" && formik.values.passWord !== "") {
      setCanSubmit(true);
    } else setCanSubmit(false);
  };

  return (
    <form className="loginForm">
      <Grid container justifyContent="center">
        <Grid item justifyContent="center" xs={10} sm={8} md={4}>
          <div className="loginFromInput">
            <div className="loginFormInput__header">Xin chào</div>
            <div className="loginFormInput__body">
              <Grid container className="field" xs={10} sm={9} md={9}>
                <Grid item xs={1.5} sm={1.5} md={1.5} className="field__icon">
                  <AccountCircleIcon sx={{ verticalAlign: "middle" }} />
                </Grid>
                <Grid
                  item
                  xs={10.5}
                  sm={10.5}
                  md={10.5}
                  className="field__input"
                >
                  <input
                    type="text"
                    onChange={(e) => {
                      checkCanSubmit();
                      formik.setFieldValue("userName", e.currentTarget.value);
                    }}
                    onBlur={formik.handleBlur}
                    value={formik.values.userName}
                    placeholder="Tên đăng nhập/ địa chỉ email"
                    name="userName"
                  />
                </Grid>
              </Grid>

              <Grid container className="field" xs={10} sm={9} md={9}>
                <Grid item xs={1.5} sm={1.5} md={1.5} className="field__icon">
                  <LockIcon sx={{ verticalAlign: "middle" }} />
                </Grid>
                <Grid item xs={10.5} sm={10.5} md={10.5}>
                  <Grid container className="field__input">
                    <Grid item xs={10} sm={10.5} md={10.5}>
                      <input
                        placeholder="Mật khẩu"
                        type={isVisible ? "text" : "password"}
                        onChange={(e) => {
                          checkCanSubmit();
                          formik.setFieldValue(
                            "passWord",
                            e.currentTarget.value
                          );
                        }}
                        onBlur={formik.handleBlur}
                        name="passWord"
                        value={formik.values.passWord}
                      />
                    </Grid>

                    <Grid item xs={2} sm={1.5} md={1.5}>
                      <label
                        onClick={switchVisibility}
                        className="field__password-eye"
                      >
                        {isVisible ? (
                          <Tooltip
                            arrow
                            title="Ẩn mật khẩu"
                            TransitionComponent={Zoom}
                          >
                            <VisibilityOffIcon
                              sx={{ verticalAlign: "middle" }}
                            />
                          </Tooltip>
                        ) : (
                          <Tooltip
                            arrow
                            title="Hiện mật khẩu"
                            TransitionComponent={Zoom}
                          >
                            <RemoveRedEyeIcon
                              sx={{ verticalAlign: "middle" }}
                            />
                          </Tooltip>
                        )}
                      </label>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </div>
        </Grid>
      </Grid>

      <div className="cta">
        <div className="rememberForgetPassword">
          <Grid
            container
            columnSpacing={{ xs: 3, sm: 25, md: 28 }}
            direction="row"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) =>
                      formik.setFieldValue(
                        "rememberMe",
                        e.currentTarget.checked
                      )
                    }
                    onBlur={formik.handleBlur}
                    value={formik.values.rememberMe}
                  />
                }
                label="Nhớ mật khẩu"
              />
            </Grid>
            <Grid item>
              <Link href="#" underline="none">
                {"Quên mật khẩu ?"}
              </Link>
            </Grid>
          </Grid>
        </div>

        <div className="submitBtn">
          {isLoading ? (
            <CircularProgress />
          ) : (
            <Tooltip
              arrow
              title={
                canSubmit ? "Đăng nhập" : "Bạn phải điền đầy đủ các thông tin!"
              }
              TransitionComponent={Zoom}
            >
              <div style={{ display: "inline-block" }}>
                <button
                  type="submit"
                  onClick={formik.handleSubmit}
                  style={!canSubmit ? { pointerEvents: "none" } : {}}
                  disabled={!canSubmit}
                  className="btn btn-primary btn-submit"
                >
                  đăng nhập
                </button>
              </div>
            </Tooltip>
          )}
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
