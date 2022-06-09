import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import { useFormik } from "formik";
import "./step1.css";
const Step1 = (props) => {
  const formik = useFormik({
    initialValues: {
      tenVoucher: props.item !== null ? props.item.Name : "",
      ghiChu: props.item !== null ? props.item.Description : "",
      tienMin: props.item !== null ? props.item.TotalPriceMin : 0,
      tienMax: props.item !== null ? props.item.TotalPriceMax : 1000,
      soLuong: props.item !== null ? props.item.Total : 0,
      publish: props.item !== null ? props.item.Published : false,
    },
    onSubmit: (values) => {
      props.catchStep1(values);
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container rowSpacing={4}>
        <Grid item xs={12} sm={12} md={12} container rowSpacing={0}>
          <Grid item xs={12} sm={4} md={2}>
            <p className="label">Tên voucher: </p>
          </Grid>
          <Grid item xs={12} sm={8} md={10}>
            <TextField
              fullWidth
              id="tenVoucher"
              name="tenVoucher"
              value={formik.values.tenVoucher}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              label="Bắt buộc*"
              error={formik.values.tenVoucher === "" ? true : false}
              variant="filled"
            />
          </Grid>
        </Grid>

        <Grid item xs={12} sm={12} md={12} container>
          <Grid item xs={12} sm={4} md={2}>
            <p className="label">Ghi chú: </p>
          </Grid>
          <Grid item xs={12} sm={8} md={10}>
            <TextField
              fullWidth
              label="Bắt buộc*"
              variant="filled"
              id="ghiChu"
              name="ghiChu"
              value={formik.values.ghiChu}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              multiline
              error={formik.values.ghiChu === "" ? true : false}
              rows={4}
            />
          </Grid>
        </Grid>

        <Grid item xs={12} sm={12} md={12} container>
          <Grid item xs={12} sm={4} md={2}>
            <p className="label">Tổng tiền: </p>
          </Grid>
          <Grid
            item
            xs={12}
            sm={8}
            md={10}
            container
            columnSpacing={5}
            rowSpacing={1}
          >
            <Grid item xs={12} sm={5} md={4}>
              <TextField
                fullWidth
                label="Tối thiểu"
                variant="filled"
                id="tienMin"
                name="tienMin"
                value={formik.values.tienMin}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.values.tienMin < 0 ||
                  formik.values.tienMax < formik.values.tienMin
                    ? true
                    : false
                }
                type="number"
              />
            </Grid>
            <Grid item xs={8.5} sm={5} md={4}>
              <TextField
                fullWidth
                label="Tối đa"
                id="tienMax"
                name="tienMax"
                value={formik.values.tienMax}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.values.tienMax < 0 ||
                  formik.values.tienMax < formik.values.tienMin
                    ? true
                    : false
                }
                type="number"
                variant="filled"
              />
            </Grid>
            <Grid item xs={1.5} sm={2} md={2}>
              <p className="label">VND</p>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={12} md={12} container>
          <Grid item xs={12} sm={4} md={2}>
            <p className="label">Số lượng voucher: </p>
          </Grid>
          <Grid item xs={12} sm={8} md={10} container columnSpacing={5}>
            <Grid item xs={12} sm={5} md={4}>
              <TextField
                fullWidth
                label="Số lượng"
                variant="filled"
                id="soLuong"
                name="soLuong"
                value={formik.values.soLuong}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.values.soLuong < 0 ? true : false}
                type="number"
              />
            </Grid>
            <Grid item sm={7} md={6}>
              <p className="label">
                Publish:{" "}
                <Checkbox
                  id="publish"
                  name="publish"
                  value={formik.values.publish}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  size="large"
                  sx={{ marginLeft: "3rem" }}
                />
              </p>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          md={12}
          sm={12}
          xs={12}
          container
          columnSpacing={3}
          justifyContent="flex-end"
        >
          <Grid item xs={6} sm={3} md={2}>
            <button
              type="button"
              className="btn btn-primary fullWidth"
              onClick={() => props.handleBackFrom1()}
            >
              Hủy
            </button>
          </Grid>
          <Grid item xs={6} sm={3} md={2}>
            <button
              type="submit"
              className="btn btn-safe fullWidth"
              disabled={
                formik.values.ghiChu === "" ||
                formik.values.tenVoucher === "" ||
                formik.values.tienMin < 0 ||
                formik.values.tienMax < 0 ||
                formik.values.tienMax < formik.values.tienMin ||
                formik.values.soLuong < 0
                  ? true
                  : false
              }
            >
              Tiếp tục
            </button>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};

export default Step1;
