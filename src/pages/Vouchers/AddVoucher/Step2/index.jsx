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
import CircularProgress from "@mui/material/CircularProgress";
import Wrapper from "../../../../utils/Wrapper";
import SERVER_API from "../../../../objects/ServerApi";
import "./step2.css";

const DEAD_TEXT = " <<Product đã bị xóa>>";

const Step2 = (props) => {
  const [productOptions, setProductOptions] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const formik = useFormik({
    initialValues: {
      productList: [{ value: -1, label: "" }],
      gift: props.item !== null ? props.item.Gift.GiftName : "",
    },
    onSubmit: (values) => {
      setIsSaving(true);
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
            setIsSaving(false);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        axios
          .put(SERVER_API.BASE_URL + endPoint, body_params, config)
          .then((res) => {
            console.log(res);
            setIsSaving(false);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
  });

  const catchData = (res) => {
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
              value: item,
              label: listProductName.find((x) => x.value === item.ID)
                ? listProductName.find((x) => x.value === item.ID).label
                : item.ProductName + DEAD_TEXT,
            };
          })
        );
      }
    }
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
        console.log(res);
        catchData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handleUserLostFocus = (item, index) => {
    const newList = formik.values.productList.map((it, id) =>
      id !== index ? it : item
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
  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container rowSpacing={5}>
        <Grid item md={12} container>
          <Grid item md={2}>
            <p className="label"> Mặt hàng: </p>
          </Grid>
          <Grid item md={10}>
            <div className="productList">
              {
                <Wrapper>
                  {formik.values.productList.map((mItem, index) => (
                    <Grid container columnSpacing={2} key={mItem.value}>
                      <Grid
                        item={true}
                        md={1}
                        container
                        justifyContent="center"
                        justifySelf="center"
                      >
                        <span style={{ margin: "auto" }}>{index + 1}</span>
                      </Grid>
                      <Grid item={true} md={10}>
                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={productOptions}
                          // sx={{ width: 300 }}
                          defaultValue={mItem}
                          onChange={(e, v) => handleUserLostFocus(v, index)}
                          renderInput={(params) => (
                            <TextField
                              fullWidth
                              error={
                                formik.values.productList[index].value === -1 ||
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
              <Grid item={true} md={1} sx={{ textAlign: "center" }}>
                <IconButton size="large" onClick={handleOnAddClicked}>
                  <AddCircleIcon />
                </IconButton>
              </Grid>
            </div>
          </Grid>
        </Grid>
        <Grid item={true} md={12} container>
          <Grid item={true} md={2}>
            <p className="label">Quà tặng:</p>
          </Grid>
          <Grid item={true} md={10}>
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
          md={12}
          container
          columnSpacing={3}
          justifyContent="flex-end"
        >
          <Grid item md={2}>
            <button
              className="btn btn-primary fullWidth"
              type="button"
              onClick={() => props.handleBackFrom2()}
            >
              Quay lại
            </button>
          </Grid>
          <Grid item md={2}>
            <button
              className="btn btn-safe fullWidth"
              type="submit"
              disabled={
                formik.values.productList.find(
                  (x) => x.label === "" || x.label.includes(DEAD_TEXT)
                ) || formik.values.gift === ""
                  ? true
                  : false
              }
            >
              Lưu
            </button>
          </Grid>
          <Grid item md={2.5}>
            <button
              className="btn btn-safe fullWidth"
              type="submit"
              disabled={
                formik.values.productList.find(
                  (x) => x.label === "" || x.label.includes(DEAD_TEXT)
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
            {"Voucher đang được lưu vào hệ thống..."}
          </DialogTitle>
          <DialogContent sx={{ textAlign: "center" }}>
            <CircularProgress sx={{ margin: "0.5rem" }} />
          </DialogContent>
        </Dialog>
      </div>
    </form>
  );
};

export default Step2;
