import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import { useFormik } from "formik";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CircularProgress from "@mui/material/CircularProgress";
import Wrapper from "../../../../utils/Wrapper";
import SERVER_API from "../../../../objects/ServerApi";
import ServerResPonse from "../../../../objects/ServerResponse";
import "./step2.css";
import { useNavigate } from "react-router-dom";
const DEAD_TEXT = " <<Product đã bị xóa>>";

const Step2 = (props) => {
  let navigate = useNavigate();
  const [productOptions, setProductOptions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [serverStatus, setServerStatus] = useState(null);
  const formik = useFormik({
    initialValues: {
      productList: [{ value: -1, label: "" }],
      gift: props.item !== null ? props.item.Gift.GiftName : "",
    },
    onSubmit: (values) => {
      setIsSaving(true);
      console.log(values);
      const endPoint =
        props.item !== null
          ? SERVER_API.CREATE_VOUCHER + "/" + props.item.ID
          : SERVER_API.CREATE_VOUCHER;
      const local_token = localStorage.getItem("token");
      const body_params = {
        name: props.step1Info.tenVoucher,
        description: props.step1Info.ghiChu,
        total: props.step1Info.soLuong,
        remaining: props.step1Info.soLuong,
        total_price_min: props.step1Info.tienMin,
        total_price_max: props.step1Info.tienMax,
        published: props.step1Info.publish,
        products: values.productList.map((item) => item.value),
        gift: values.gift,
      };

      console.log(body_params);
      const config = {
        headers: {
          Authorization: "Bearer " + local_token,
          "Content-Type": "application/json",
        },
      };
      if (props.item === null) {
        axios
          .post(SERVER_API.BASE_URL + endPoint, body_params, config)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            catchError(err);
          });
      } else {
        axios
          .put(SERVER_API.BASE_URL + endPoint, body_params, config)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            catchError(err);
          });
      }
    },
  });

  const catchData = (res) => {
    res = ServerResPonse(res);
    setServerStatus({
      code: res.status,
      msg: "Voucher đã được cập nhật thành công",
      hint: "",
    });
    console.log(res);
    const prods = res.data.products;
    if (prods != null) {
      const listProductName = prods.map((item) => {
        return { label: item.ProductName, value: item.ID };
      });
      setProductOptions([...listProductName, ""]);
      if (props.item !== null && props.item.Products.length > 0) {
        formik.setFieldValue(
          "productList",
          props.item.Products.map((item) => {
            return {
              value: item.ID,
              label: listProductName.find((x) => x.value === item.ID)
                ? listProductName.find((x) => x.value === item.ID).label
                : item.ProductName + DEAD_TEXT,
            };
          })
        );
      }
    }
  };
  const catchError = (err) => {
    console.log("err:", err);
    err = ServerResPonse(err);
    if (err.status === 401)
      setServerStatus({
        code: err.status,
        msg: err.message,
        hint: "Đăng nhập lại ?",
      });
    else
      setServerStatus({
        code: err.status,
        msg: err.message,
        hint: "",
      });
  };

  useEffect(() => {
    const local_token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: "Bearer " + local_token,
        "Content-Type": "application/json",
      },
    };
    axios
      .get(SERVER_API.BASE_URL + SERVER_API.GETALLPRODUCTS, config)
      .then((res) => {
        catchData(res);
      })
      .catch((err) => {
        catchError(err);
      });
  }, []);
  const handleUserLostFocus = (e, item, index) => {
    console.log(e);
    const newList = formik.values.productList.map((it, id) =>
      id !== index ? it : ""
    );
    formik.setFieldValue("productList", newList);
    setProductOptions([
      ...productOptions.filter((it, id) => {
        return it !== item;
      }),
    ]);
  };

  const handleDeleteProduct = (index) => {
    console.log(formik.values.productList[index]);
    if (formik.values.productList.length > 1) {
      const newList = formik.values.productList.filter((it, id) => {
        return id !== index;
      });
      formik.setFieldValue("productList", newList);
    }
  };
  //   const renderList = () => {
  //     return
  //   };

  const handleOnAddClicked = () => {
    if (!formik.values.productList.includes({ label: "", value: -1 })) {
      formik.setFieldValue("productList", [
        ...formik.values.productList,
        { label: "", value: -1 },
      ]);
    }
  };
  const handleAgree = () => {
    setIsSaving(false);
    if (serverStatus.code === 200) props.handleDone();
    if (serverStatus.code === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      navigate("/login");
    } else setIsSaving(false);
  };
  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container rowSpacing={5}>
        <Grid item xs={12} sm={12} md={12} container>
          <Grid item xs={12} sm={2} md={2}>
            <p className="label"> Mặt hàng: </p>
          </Grid>
          <Grid item xs={12} sm={10} md={10}>
            <div className="productList">
              {
                <Wrapper>
                  {formik.values.productList.map((mItem, index) => (
                    <Grid container columnSpacing={2} key={mItem.value}>
                      <Grid
                        item={true}
                        xs={1}
                        sm={1}
                        md={1}
                        container
                        justifyContent="center"
                        justifySelf="center"
                      >
                        <span style={{ margin: "auto" }}>{index + 1}</span>
                      </Grid>
                      <Grid item={true} xs={10} sm={10} md={10}>
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={productOptions}
                          // sx={{ width: 300 }}
                          defaultValue={mItem.label}
                          onChange={(e, v) => {
                            handleUserLostFocus(e, v, index);
                          }}
                          renderInput={(params) => (
                            <TextField
                              fullWidth
                              error={
                                formik.values.productList[index].value === -1 ??
                                formik.values.productList[index].label.includes(
                                  DEAD_TEXT
                                )
                                  ? true
                                  : false
                              }
                              id="fullWidth"
                              label="Tên sản phẩm*"
                              variant="filled"
                              size="small"
                              {...params}
                            />
                          )}
                        />
                      </Grid>
                      <Grid
                        item={true}
                        xs={1}
                        sm={1}
                        md={1}
                        container
                        justifyContent="center"
                        justifySelf="center"
                      >
                        <IconButton
                          size="small"
                          color="error"
                          sx={{
                            padding: "0.5rem 1rem",
                          }}
                          onClick={() => handleDeleteProduct(index)}
                        >
                          {"x"}
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
                </Wrapper>
              }
              <Grid
                item={true}
                xs={12}
                sm={1}
                md={1}
                sx={{ textAlign: "center" }}
              >
                <IconButton size="large" onClick={handleOnAddClicked}>
                  <AddCircleIcon />
                </IconButton>
              </Grid>
            </div>
          </Grid>
        </Grid>
        <Grid item={true} xs={12} sm={12} md={12} container>
          <Grid item={true} xs={12} sm={2} md={2}>
            <p className="label">Quà tặng:</p>
          </Grid>
          <Grid item={true} xs={12} sm={10} md={10}>
            <TextField
              fullWidth
              label="Bắt buộc*"
              variant="filled"
              multiline
              rows={4}
              id="gift"
              name="gift"
              value={formik.values.gift}
              onChange={(e) => formik.setFieldValue("gift", e.target.value)}
              onBlur={(e) => formik.setFieldValue("gift", e.target.value)}
            />
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          md={12}
          sm={12}
          container
          columnSpacing={3}
          rowSpacing={2}
          justifyContent="flex-end"
        >
          <Grid item xs={6} sm={3} md={2}>
            <button
              className="btn btn-primary fullWidth"
              type="button"
              onClick={() => props.handleBackFrom2()}
            >
              Quay lại
            </button>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <button
              className="btn btn-safe fullWidth"
              type="submit"
              disabled={
                formik.values.productList.find(
                  (x) => x.label === "" ?? x.label.includes(DEAD_TEXT)
                ) || formik.values.gift === ""
                  ? true
                  : false
              }
            >
              Lưu
            </button>
          </Grid>
          <Grid item xs={12} sm={4} md={2.5}>
            <button
              className="btn btn-safe fullWidth"
              type="submit"
              disabled={
                formik.values.productList.find(
                  (x) => x.label === "" ?? x.label.includes(DEAD_TEXT)
                ) || formik.values.gift === ""
                  ? true
                  : false
              }
            >
              Lưu và thêm mới
            </button>
          </Grid>
        </Grid>
      </Grid>
      <div className="dialog">
        <Dialog
          open={isSaving}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {serverStatus === null ? (
              <span>"Voucher đang được lưu vào hệ thống..."</span>
            ) : (
              <p
                className={
                  serverStatus.code !== 200 ? "msg__error" : "msg__safe"
                }
              >
                {serverStatus.msg}
              </p>
            )}
          </DialogTitle>
          <DialogContent sx={{ textAlign: "center" }}>
            {serverStatus === null ? (
              <CircularProgress sx={{ margin: "0.5rem" }} />
            ) : (
              <p>{serverStatus.hint}</p>
            )}
          </DialogContent>
          {serverStatus && (
            <DialogActions>
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => handleAgree()}
              >
                Đồng ý
              </button>
            </DialogActions>
          )}
        </Dialog>
      </div>
    </form>
  );
};

export default Step2;
