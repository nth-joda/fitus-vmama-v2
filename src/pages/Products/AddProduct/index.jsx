import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CircularProgress from "@mui/material/CircularProgress";
import { useFormik } from "formik";
import axios from "axios";
import ServerApi from "../../../objects/ServerApi";
import ServerResponse from "../../../objects/ServerResponse";
import "./addProduct.css";
import Wrapper from "../../../utils/Wrapper";
const AddProduct = (props) => {
  let navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [serverStatus, setServerStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      productName: props.editItem === null ? "" : props.editItem.ProductName,
    },

    onSubmit: (values) => {
      const local_token = localStorage.getItem("token");
      const body_params = {
        product_name: values.productName,
      };
      const config = {
        headers: {
          Authorization: "Bearer " + local_token,
          "Content-Type": "application/json",
        },
      };
      setIsLoading(true);
      if (props.editItem === null)
        axios
          .post(
            ServerApi.BASE_URL + ServerApi.CREATE_PRODUCT,
            body_params,
            config
          )
          .then((res) => {
            catchData(res);
            setIsLoading(false);
          })
          .catch((err) => {
            catchError(err);
            setIsLoading(false);
          });
      else
        axios
          .put(
            ServerApi.BASE_URL +
              ServerApi.CREATE_PRODUCT +
              "/" +
              props.editItem.ID,
            body_params,
            config
          )
          .then((res) => {
            catchData(res);
            setIsLoading(false);
          })
          .catch((err) => {
            catchError(err);
            setIsLoading(false);
          });
    },
  });
  const catchData = (res) => {
    res = ServerResponse(res);
    setServerStatus({ code: res.status, msg: res.message, hint: "" });
  };

  const catchError = (err) => {
    err = ServerResponse(err);
    setServerStatus({ code: err.status, msg: err.message, hint: "" });
    console.log("errorr", err);
  };

  const handleAgree = () => {
    if (serverStatus.code === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      navigate("/login");
    } else if (serverStatus.code === 201 || serverStatus.code === 200) {
      props.handleAddOrEditDone();
    } else {
      setOpenDialog(false);
      setServerStatus(null);
    }
  };

  return (
    <div className="addProduct">
      <div className="addProduct__address">
        <i className="bx bx-package addProduct__address-icon"></i>
        {props.editItem
          ? "Product > Chỉnh sửa product"
          : "Product > Thêm product"}
      </div>
      <form
        onSubmit={formik.handleSubmit}
        className="addProduct__formContainer"
      >
        <Grid container rowSpacing={5}>
          <Grid item xs={12} sm={12} md={12} container>
            <Grid item xs={12} sm={4} md={2}>
              <p className="label">Tên product:</p>
            </Grid>
            <Grid item xs={12} sm={8} md={10}>
              <TextField
                fullWidth
                id="productName"
                name="productName"
                value={formik.values.productName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                label="Bắt buộc*"
                variant="filled"
                error={formik.values.productName === "" ? true : false}
              />
            </Grid>
          </Grid>
          <Grid
            item
            md={12}
            sm={12}
            xs={12}
            container
            columnSpacing={2}
            justifyContent="flex-end"
          >
            <Grid item xs={6} sm={2.5} md={1.5}>
              <button
                className="btn btn-primary fullWidth"
                type="button"
                onClick={props.handleCancel}
              >
                Hủy
              </button>
            </Grid>
            <Grid item xs={6} sm={2.5} md={1.5}>
              <button
                className="btn btn-safe fullWidth"
                type="submit"
                disabled={formik.values.productName === "" ? true : false}
              >
                Lưu
              </button>
            </Grid>
          </Grid>
        </Grid>
      </form>
      {(serverStatus || isLoading) && (
        <Dialog
          open={serverStatus !== null || isLoading}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          {isLoading && (
            <Wrapper>
              <DialogTitle>{"Hệ thống đang lưu ..."}</DialogTitle>
              <DialogContent sx={{ textAlign: "center" }}>
                <CircularProgress></CircularProgress>
              </DialogContent>
            </Wrapper>
          )}
          {serverStatus && (
            <Wrapper>
              <DialogTitle>{serverStatus.msg}</DialogTitle>
              <DialogContent>
                <p>{serverStatus.hint}</p>
              </DialogContent>
              <DialogActions>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleAgree}
                >
                  Đồng ý
                </button>
              </DialogActions>
            </Wrapper>
          )}
        </Dialog>
      )}
    </div>
  );
};

export default AddProduct;
