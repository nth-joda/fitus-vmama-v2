import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import TodayIcon from "@mui/icons-material/Today";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Checkbox from "@mui/material/Checkbox";

import FormControlLabel from "@mui/material/FormControlLabel";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ErrorIcon from "@mui/icons-material/Error";
import Header from "../../components/Header";
import MainContent from "../../components/MainContent";
import MainContentHeader from "../../components/MainContent/MainContentHeader";
import SideBar from "../../components/Sidebar";
import Wrapper from "../../utils/Wrapper";
import "./transactions.css";
import TransactionList from "../../assets/MOCK_DATA.json";
import { useEffect } from "react";
import CheckBoxOutlineBlank from "@mui/icons-material/CheckBoxOutlineBlank";
import { Formik, useFormik } from "formik";

const RenderStatus = (props) => {
  return (
    <Wrapper>
      {props.checkingItem.status == null && (
        <span className="history-table__value">
          <button
            className="btn btn-orange"
            onClick={() => props.handleDoCheckClicked(props.checkingItem)}
          >
            kiểm tra
          </button>
        </span>
      )}
      {props.checkingItem.status === true && (
        <span className="history-table__value">
          <span className="approved">Hợp lệ</span>
        </span>
      )}

      {props.checkingItem.status === false && (
        <span className="history-table__value">
          <span className="rejected">Không hợp lệ</span>
        </span>
      )}
    </Wrapper>
  );
};

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showItem, setShowItem] = useState(null);
  const [imgOnShow, setImgOnShow] = useState(null);
  const [mainTabOnShown, setMainTabOnSHown] = useState("voucher");
  const [isChecking, setIsChecking] = useState(false);
  const [checkingTransaction, setCheckingTransaction] = useState(null);

  const checkingFormik = useFormik({
    initialValues: {
      isError: null,
      comment: "",
      transaction: checkingTransaction,
    },
    onSubmit: (values) => alert(JSON.stringify(values)),
  });

  const handleImgChange = (event, newValue) => {
    setImgOnShow(newValue);
  };

  useEffect(() => {
    if (showItem != null) {
      setImgOnShow(showItem.imageList[0].uri);
    } else setImgOnShow(null);
  }, [showItem]);

  const onHandleRefreshClicked = () => {};
  const onHandleDeleteClicked = () => {};
  const onHandleAddClicked = () => {};

  const handleCheckYes = (value) => {
    console.log(value);
    if (value === true) {
      checkingFormik.setFieldValue("isError", false);
    } else {
      checkingFormik.setFieldValue("isError", null);
    }
  };

  const handleCheckError = (value) => {
    console.log(value);
    if (value === true) {
      checkingFormik.setFieldValue("isError", true);
    } else {
      checkingFormik.setFieldValue("isError", null);
    }
  };

  const historyTable = () => {
    return (
      <Wrapper>
        <div className="history-table__date">
          <Grid container>
            <Grid item xs={2} sm={0.7} md={0.5}>
              <TodayIcon />
            </Grid>
            <Grid item xs={10}>
              Ngày 27/07/2000
            </Grid>
          </Grid>
        </div>
        <table className="history-table">
          <thead>
            <tr className="history-table__title">
              <td>Thời gian</td>
              <td>Mã hóa đơn</td>
              <td>Tổng tiền</td>
              <td>Mã nhân viên</td>
              <td>Trạng thái</td>
            </tr>
          </thead>
          <tbody className="history-table__body">
            {TransactionList.map((item, index) => {
              return (
                <Wrapper>
                  <tr className="history-table__row" key={item.ID}>
                    <td
                      className="td-key"
                      onClick={() => {
                        setShowItem(item);
                      }}
                    >
                      <span className="history-table__mobile-title">
                        Thời gian
                      </span>
                      <span className="history-table__value bold-value">
                        9:20
                      </span>
                    </td>
                    <td className="td-item" onClick={() => setShowItem(item)}>
                      <span className="history-table__mobile-title">
                        Mã hóa đơn
                      </span>
                      <span className="history-table__value">
                        {item.billNum}
                      </span>
                    </td>
                    <td className="td-item" onClick={() => setShowItem(item)}>
                      <span className="history-table__mobile-title">
                        Tổng hóa đơn
                      </span>
                      <span className="history-table__value">
                        {item.totalMoney}
                      </span>
                    </td>
                    <td className="td-item" onClick={() => setShowItem(item)}>
                      <span className="history-table__mobile-title">
                        Mã nhân viên
                      </span>
                      <span className="history-table__value bold-value">
                        {item.staffAccount}
                      </span>
                    </td>
                    <td className="td-item">
                      <span className="history-table__mobile-title">
                        Trạng thái
                      </span>
                      <RenderStatus
                        checkingItem={item}
                        handleDoCheckClicked={(checkedItem) => {
                          setCheckingTransaction(checkedItem);
                        }}
                      />
                    </td>
                  </tr>
                </Wrapper>
              );
            })}
          </tbody>
        </table>
      </Wrapper>
    );
  };

  return (
    <div>
      <Header />
      <Grid container>
        <Grid item xs={12} sm={12} md={2}>
          <SideBar location="/transactions" />
        </Grid>
        <Grid item xs={12} sm={12} md={10}>
          <MainContent of="transactions">
            <Box>
              <MainContentHeader
                of="giao dịch"
                catchTerm={(term) => setSearchTerm(term)}
                isRefreshDisabled={isLoading}
                isDeleteDisabled={false}
                handleRefreshClicked={onHandleRefreshClicked}
                handleDeleteClicked={onHandleDeleteClicked}
                handleAddClicked={onHandleAddClicked}
                addName={"Báo Cáo"}
                addIcon={
                  <FileDownloadIcon
                    sx={{ verticalAlign: "middle", marginRight: "0.5rem" }}
                  />
                }
                deleteName={"Biểu đồ"}
                deleteIcon={
                  <EqualizerIcon
                    sx={{ verticalAlign: "middle", marginRight: "0.5rem" }}
                  />
                }
                deleteColor={"secondary"}
              />
            </Box>
            <Box>{historyTable()}</Box>
          </MainContent>
        </Grid>
      </Grid>
      {/* Detail */}
      <Dialog
        open={showItem}
        onClose={() => {
          setShowItem(null);
        }}
        fullWidth={true}
        maxWidth={"xl"}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="dialog-content">
          <div className="dialog-title detail">Thông tin chi tiết</div>
          <Grid container columnSpacing={20} rowSpacing={2}>
            <Grid item container xs={12} sm={6} md={6} rowSpacing={1.5}>
              {/* Left Column */}
              <Grid
                item
                container
                xs={12}
                sm={12}
                md={12}
                columnSpacing={2}
                rowSpacing={2}
              >
                <Grid item xs={4} sm={6} md={4}>
                  <label className="form-edit-add__label">Thời gian</label>
                </Grid>
                <Grid item xs={8} sm={6} md={8}>
                  <TextField
                    fullWidth
                    disabled
                    inputProps={{ min: 0, style: { textAlign: "center" } }}
                    variant="standard"
                    defaultValue="Todo 27/07/2000 9:20"
                  />
                </Grid>
              </Grid>

              <Grid item container xs={12} sm={12} md={12}>
                <Grid item xs={4} sm={6} md={4}>
                  <label className="form-edit-add__label">Mã hóa đơn</label>
                </Grid>
                <Grid item xs={8} sm={6} md={8}>
                  <TextField
                    fullWidth
                    disabled
                    inputProps={{ min: 0, style: { textAlign: "center" } }}
                    variant="standard"
                    defaultValue={showItem ? showItem.billNum : ""}
                  />
                </Grid>
              </Grid>
              <Grid item container xs={12} sm={12} md={12}>
                <Grid item xs={4} sm={6} md={4}>
                  <label className="form-edit-add__label">
                    Tổng tiền trên hóa đơn
                  </label>
                </Grid>
                <Grid item xs={8} sm={6} md={8}>
                  <TextField
                    fullWidth
                    disabled
                    inputProps={{ min: 0, style: { textAlign: "center" } }}
                    variant="standard"
                    defaultValue="Todo: 1.000.000"
                  />
                </Grid>
              </Grid>
              <Grid item container xs={12} sm={12} md={12}>
                <Grid item xs={4} sm={6} md={4}>
                  <label className="form-edit-add__label">Tên voucher</label>
                </Grid>
                <Grid item xs={8} sm={6} md={8}>
                  <TextField
                    fullWidth
                    disabled
                    inputProps={{ min: 0, style: { textAlign: "center" } }}
                    variant="standard"
                    defaultValue="Todo: Tên voucher ABC"
                  />
                </Grid>
              </Grid>
            </Grid>
            {/* Right Coulumn */}
            <Grid item container xs={12} sm={6} md={6} rowSpacing={2}>
              <Grid item container xs={12} sm={12} md={12}>
                <Grid item xs={4} sm={6} md={4}>
                  <label className="form-edit-add__label">Tên khách hàng</label>
                </Grid>
                <Grid item xs={8} sm={6} md={8}>
                  <TextField
                    fullWidth
                    disabled
                    inputProps={{ min: 0, style: { textAlign: "center" } }}
                    variant="standard"
                    defaultValue={showItem ? showItem.clientName : ""}
                  />
                </Grid>
              </Grid>

              <Grid item container xs={12} sm={12} md={12}>
                <Grid item xs={4} sm={6} md={4}>
                  <label className="form-edit-add__label">Sđt khách hàng</label>
                </Grid>
                <Grid item xs={8} sm={6} md={8}>
                  <TextField
                    fullWidth
                    disabled
                    inputProps={{ min: 0, style: { textAlign: "center" } }}
                    variant="standard"
                    defaultValue={showItem ? showItem.clientPhoneNum : ""}
                  />
                </Grid>
              </Grid>

              <Grid item container xs={12} sm={12} md={12}>
                <Grid item xs={4} sm={6} md={4}>
                  <label className="form-edit-add__label">
                    Nhân viên thực hiện giao dịch
                  </label>
                </Grid>
                <Grid item xs={8} sm={6} md={8}>
                  <TextField
                    fullWidth
                    disabled
                    inputProps={{ min: 0, style: { textAlign: "center" } }}
                    variant="standard"
                    defaultValue={showItem ? showItem.staffAccount : ""}
                  />
                </Grid>
              </Grid>
              <Grid item container xs={12} sm={12} md={12}>
                <Grid item xs={4} sm={6} md={4}>
                  <label className="form-edit-add__label">Trạng thái</label>
                </Grid>
                <Grid item xs={8} sm={6} md={8} alignSelf="center">
                  {/* <TextField
                    fullWidth
                    disabled
                    inputProps={{ min: 0, style: { textAlign: "center" } }}
                    variant="standard"
                    defaultValue="Todo làm sau"
                  /> */}
                  <span className="history-table__value">
                    {showItem ? (
                      <RenderStatus
                        checkingItem={showItem}
                        handleDoCheckClicked={(checkedItem) =>
                          setCheckingTransaction(checkedItem)
                        }
                      />
                    ) : (
                      <span className="rejected">Lỗi hệ thống</span>
                    )}
                  </span>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid container sx={{ marginTop: "1rem" }}>
            <Grid
              container
              item
              xs={12}
              sm={12}
              md={6}
              rowSpacing={1.2}
              alignContent="flex-start"
            >
              <Grid item xs={12} sm={12} md={12} alignSelf="center">
                <label className="form-edit-add__label">
                  Danh sách sản phẩm:
                </label>
              </Grid>
              <Grid container item xs={12} sm={12} md={12} rowSpacing={1.5}>
                {showItem
                  ? showItem.productsList.map((item, index) => {
                      return (
                        <Grid item container columnSpacing={2}>
                          <Grid
                            item
                            xs={2}
                            sm={2}
                            md={2}
                            alignSelf="center"
                            textAlign={"center"}
                          >
                            {index + 1}
                          </Grid>
                          <Grid item xs={5} sm={5} md={5}>
                            {item.productName}
                          </Grid>
                          <Grid
                            item
                            xs={2}
                            sm={2}
                            md={2}
                            alignSelf="center"
                            textAlign={"center"}
                          >
                            {"(x" + item.productAmount + ")"}
                          </Grid>
                          <Grid
                            item
                            xs={3}
                            sm={3}
                            md={3}
                            alignSelf="center"
                            textAlign={"center"}
                          >
                            {item.productPricePerUnit}
                          </Grid>
                        </Grid>
                      );
                    })
                  : null}
              </Grid>
            </Grid>
            <Grid container item xs={12} sm={12} md={6} alignSelf="flex-start">
              <Grid item xs={12} sm={12} md={12}>
                <Tabs
                  value={mainTabOnShown}
                  onChange={(event, newValue) => setMainTabOnSHown(newValue)}
                  textColor="primary"
                  variant="scrollable"
                  scrollButtons="auto"
                  indicatorColor="primary"
                  aria-label="primary tabs example"
                >
                  <Tab value={"voucher"} label={"Voucher đã áp dụng"} />
                  <Tab value={"images"} label={"Ảnh chụp hóa đơn"} />
                </Tabs>
              </Grid>
              <Grid item xs={12} sm={12} md={12} alignSelf="flex-start">
                {mainTabOnShown === "images" && (
                  <Grid container item xs={12} sm={12} md={12}>
                    <Grid item xs={12} sm={12} md={12}>
                      <Tabs
                        value={imgOnShow}
                        onChange={handleImgChange}
                        textColor="secondary"
                        variant="scrollable"
                        scrollButtons="auto"
                        indicatorColor="secondary"
                        aria-label="secondary tabs example"
                      >
                        {showItem
                          ? showItem.imageList.map((im, id) => {
                              return (
                                <Tab value={im.uri} label={"Ảnh " + (id + 1)} />
                              );
                            })
                          : null}
                      </Tabs>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                      <img alt="" src={imgOnShow} className="image-scaned" />
                    </Grid>
                  </Grid>
                )}
                {mainTabOnShown === "voucher" && (
                  <div
                    style={{
                      background: "#ccccccc9",
                      borderRadius: "0.5rem",
                      padding: "0.5rem 0.5rem 2rem",
                      margin: "0.5rem",
                    }}
                  >
                    <Grid
                      item
                      container
                      sx={{ margin: "0.5rem 0" }}
                      columnSpacing={2}
                      rowSpacing={3}
                    >
                      <Grid item container xs={11} sm={11} md={12}>
                        <Grid item xs={12} sm={3} md={3} alignSelf="center">
                          <label className="form-edit-add__label">
                            Tên voucher:
                          </label>
                        </Grid>
                        <Grid item xs={12} sm={9} md={8.5}>
                          <TextField
                            fullWidth
                            disabled
                            inputProps={{
                              min: 0,
                              style: { textAlign: "center" },
                            }}
                            variant="standard"
                            defaultValue="TODO: Hiện tên voucher chổ này"
                          />
                        </Grid>
                      </Grid>

                      <Grid item container xs={11} sm={11} md={12}>
                        <Grid item xs={12} sm={3} md={3} alignSelf="center">
                          <label className="form-edit-add__label">
                            Điều kiện áp dụng:
                          </label>
                        </Grid>
                        <Grid item xs={5} sm={4} md={3.5}>
                          <TextField
                            fullWidth
                            disabled
                            inputProps={{
                              min: 0,
                              style: { textAlign: "center" },
                            }}
                            variant="standard"
                            defaultValue="TODO: minMoney"
                          />
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          sm={1}
                          md={1.5}
                          alignSelf="center"
                          textAlign={"center"}
                        >
                          <label className="form-edit-add__label">đến</label>
                        </Grid>
                        <Grid item xs={5} sm={4} md={3.5}>
                          <TextField
                            fullWidth
                            disabled
                            inputProps={{
                              min: 0,
                              style: { textAlign: "center" },
                            }}
                            variant="standard"
                            defaultValue="TODO: maxMoney"
                          />
                        </Grid>
                      </Grid>

                      <Grid
                        item
                        container
                        xs={11}
                        sm={11}
                        md={12}
                        rowSpacing={2}
                        columnSpacing={2}
                      >
                        <Grid item xs={12} sm={3} md={3}>
                          <label className="form-edit-add__label">
                            Sản phẩm phải có:
                          </label>
                        </Grid>
                        {
                          // TODO: map chổ này list ra các sản phẩm
                        }
                        <Grid
                          item
                          container
                          xs={12}
                          sm={8}
                          md={8.5}
                          rowSpacing={2}
                          columnSpacing={2}
                        >
                          <Grid item xs={5.5} sm={5.5} md={5.5}>
                            <TextField
                              fullWidth
                              disabled
                              inputProps={{
                                min: 0,
                                style: { textAlign: "center" },
                              }}
                              variant="standard"
                              defaultValue="TODO: Sản phẩm 1"
                            />
                          </Grid>
                          <Grid item xs={0.5} sm={0.5} md={0.5}>
                            <label className="form-edit-add__label">;</label>
                          </Grid>

                          <Grid item xs={5.5} sm={5.5} md={5.5}>
                            <TextField
                              fullWidth
                              disabled
                              inputProps={{
                                min: 0,
                                style: { textAlign: "center" },
                              }}
                              variant="standard"
                              defaultValue="TODO: Sản phẩm 2"
                            />
                          </Grid>
                          <Grid item xs={0.5} sm={0.5} md={0.5}>
                            <label className="form-edit-add__label">;</label>
                          </Grid>
                          <Grid item xs={5.5} sm={5.5} md={5.5}>
                            <TextField
                              fullWidth
                              disabled
                              inputProps={{
                                min: 0,
                                style: { textAlign: "center" },
                              }}
                              variant="standard"
                              defaultValue="TODO: Sản phẩm 3"
                            />
                          </Grid>
                          <Grid item xs={0.5} sm={0.5} md={0.5}>
                            <label className="form-edit-add__label">;</label>
                          </Grid>
                          <Grid item xs={5.5} sm={5.5} md={5.5}>
                            <TextField
                              fullWidth
                              disabled
                              inputProps={{
                                min: 0,
                                style: { textAlign: "center" },
                              }}
                              variant="standard"
                              defaultValue="TODO: Sản phẩm 4"
                            />
                          </Grid>
                          <Grid item xs={0.5} sm={0.5} md={0.5}>
                            <label className="form-edit-add__label">;</label>
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item container xs={11} sm={11} md={12}>
                        <Grid item xs={12} sm={3} md={3} alignSelf="center">
                          <label className="form-edit-add__label">
                            Quà tặng:
                          </label>
                        </Grid>
                        <Grid item xs={12} sm={9} md={8.5}>
                          <TextField
                            fullWidth
                            disabled
                            inputProps={{
                              min: 0,
                              style: { textAlign: "center" },
                            }}
                            variant="standard"
                            defaultValue="TODO: Tên quà tặng"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                )}
              </Grid>
            </Grid>
            <Grid container item xs={12} sm={12} md={6} rowSpacing={2}>
              {mainTabOnShown === "images" && (
                <Grid item xs={12} sm={12} md={12}></Grid>
              )}
              <Grid item xs={12} sm={12} md={12}></Grid>
            </Grid>
          </Grid>
          <div className="form-detail__cta">
            <Grid container direction="row" alignItems="center">
              <Grid
                item
                container
                xs={12}
                sm={12}
                md={12}
                direction="column"
                alignItems="end"
              >
                <Grid item>
                  <button
                    onClick={() => {
                      setShowItem(null);
                    }}
                    className="btn btn-primary"
                  >
                    Đóng
                  </button>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </div>
      </Dialog>
      <Dialog open={checkingTransaction} fullWidth={true} maxWidth={"lg"}>
        <div className="dialog-content">
          <div className="dialog-title detail">Thẩm định giao dịch</div>
          <Grid container columnSpacing={10} rowSpacing={2}>
            <Grid item container xs={12} sm={12} md={6}>
              <Grid item xs={12} sm={12} md={6}>
                <label className="form-edit-add__label">Mã hóa đơn</label>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  fullWidth
                  disabled
                  inputProps={{ min: 0, style: { textAlign: "center" } }}
                  variant="standard"
                  defaultValue={
                    checkingTransaction ? checkingTransaction.billNum : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <label className="form-edit-add__label">Thời gian</label>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  fullWidth
                  disabled
                  inputProps={{ min: 0, style: { textAlign: "center" } }}
                  variant="standard"
                  defaultValue={"TODO: 9h20"}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <label className="form-edit-add__label">Khách hàng</label>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  fullWidth
                  disabled
                  inputProps={{ min: 0, style: { textAlign: "center" } }}
                  variant="standard"
                  defaultValue={
                    checkingTransaction ? checkingTransaction.clientName : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <label className="form-edit-add__label">Sđt khách hàng</label>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  fullWidth
                  disabled
                  inputProps={{ min: 0, style: { textAlign: "center" } }}
                  variant="standard"
                  defaultValue={
                    checkingTransaction
                      ? checkingTransaction.clientPhoneNum
                      : ""
                  }
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <label className="form-edit-add__label">Quà tặng đã nhận</label>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  fullWidth
                  disabled
                  inputProps={{ min: 0, style: { textAlign: "center" } }}
                  variant="standard"
                  defaultValue={"TODO: tên quà tặng trong voucher"}
                />
              </Grid>
            </Grid>
            <Grid item container xs={12} sm={12} md={6}>
              <Grid item xs={12} sm={12} md={6}>
                <label className="form-edit-add__label">
                  Nhân viên thực hiện giao dịch
                </label>
              </Grid>
              <Grid item xs={12} sm={12} md={6}>
                <TextField
                  fullWidth
                  disabled
                  inputProps={{
                    min: 0,
                    style: {
                      textAlign: "center",
                      fontSize: 20,
                      fontWeight: 600,
                    },
                  }}
                  variant="standard"
                  defaultValue={
                    checkingTransaction ? checkingTransaction.staffAccount : ""
                  }
                />
              </Grid>
              <div
                style={
                  checkingFormik.values.isError == null ||
                  (checkingFormik.values.isError === true &&
                    checkingFormik.values.comment === "")
                    ? {
                        border: "2px solid #a00000",
                        background: "#c3727253",
                        borderRadius: "1rem",
                        margin: "0.8rem",
                        padding: "0.8rem",
                      }
                    : {
                        border: "2px solid #2e7d32",
                        background: "#6bcb6f6e",
                        borderRadius: "1rem",
                        margin: "0.8rem",
                        padding: "0.8rem",
                      }
                }
              >
                <Grid item container xs={12} sm={12} md={12}>
                  <Grid item xs={12} sm={12} md={12}>
                    <label className="form-edit-add__label">
                      Đánh giá giao dịch
                    </label>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    justifyContent="center"
                    alignSelf="center"
                    sx={{ padding: "0.5rem 3rem" }}
                  >
                    <FormControlLabel
                      value="top"
                      control={
                        <Checkbox
                          inputProps={{ "aria-label": "Checkbox demo" }}
                          icon={<CheckBoxOutlineBlank />}
                          checkedIcon={<CheckBoxIcon />}
                          color="success"
                          onClick={(e) => {
                            handleCheckYes(e.target.checked);
                          }}
                          checked={
                            checkingFormik.values.isError != null
                              ? !checkingFormik.values.isError
                              : false
                          }
                        />
                      }
                      label="Hợp lệ"
                      labelPlacement="end"
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={6}
                    sx={{ padding: "0.5rem 3rem" }}
                  >
                    <FormControlLabel
                      value="top"
                      control={
                        <Checkbox
                          inputProps={{ "aria-label": "Checkbox demo" }}
                          icon={<ErrorOutlineIcon />}
                          checkedIcon={<ErrorIcon />}
                          sx={{
                            color: "default",
                            "&.Mui-checked": {
                              color: "#a00000",
                            },
                          }}
                          onChange={(e) => {
                            handleCheckError(e.target.checked);
                          }}
                          checked={
                            checkingFormik.values.isError
                              ? checkingFormik.values.isError
                              : false
                          }
                        />
                      }
                      label="Không hợp lệ"
                      labelPlacement="end"
                    />
                  </Grid>
                </Grid>

                {checkingFormik.values.isError == null && (
                  <Grid item xs={12} sm={12} md={12}>
                    <span className="checking-help">
                      {"Hãy chọn [Hợp lệ] / [Không hợp lệ]"}
                    </span>
                  </Grid>
                )}

                <Grid item xs={12} sm={12} md={12}>
                  <TextField
                    id="filled-multiline-static"
                    label="Lý do"
                    fullWidth
                    multiline
                    rows={3}
                    placeholder=" Nhập bình luận.
                    Nếu chọn [Không hợp lệ] thì mục này là bắt buộc (lý do không hợp lệ)."
                    variant="filled"
                    name="comment"
                    onChange={checkingFormik.handleChange}
                    error={
                      checkingFormik.values.isError === true &&
                      checkingFormik.values.comment === ""
                    }
                  />
                </Grid>
              </div>
            </Grid>
          </Grid>
          <div className="form-detail__cta">
            <Grid container direction="row" alignItems="center">
              <Grid
                item
                container
                xs={12}
                sm={12}
                md={12}
                direction="row"
                alignItems="end"
                justifyContent="flex-end"
                rowSpacing={2}
                columnSpacing={3}
              >
                <Grid item>
                  <button
                    onClick={() => {
                      setCheckingTransaction(null);
                      checkingFormik.setFieldValue("isError", null);
                    }}
                    className="btn btn-primary"
                  >
                    Hủy
                  </button>
                </Grid>
                <Grid item>
                  <button
                    onClick={() => {
                      setCheckingTransaction(null);
                    }}
                    className="btn btn-safe"
                    disabled={
                      checkingFormik.values.isError === null ||
                      (checkingFormik.values.isError === true &&
                        checkingFormik.values.comment === "")
                    }
                  >
                    Xác nhận
                  </button>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Transactions;
