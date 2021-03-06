import React, { useState } from "react";
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Pagination,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";

import Headers from "../../components/Header";
import MainContent from "../../components/MainContent";
import MainContentHeader from "../../components/MainContent/MainContentHeader";
import SideBar from "../../components/Sidebar";
import Wrapper from "../../utils/Wrapper";
import Table from "../../utils/Table";
import { useEffect } from "react";
import axios from "axios";
import * as yup from "yup";
import { useFormik } from "formik";
import ServerApi from "../../objects/ServerApi";
import ServerResponse from "../../objects/ServerResponse";
import { useNavigate } from "react-router-dom";

const Gifts = () => {
  let navigate = useNavigate();
  const [hardLoading, setHardLoading] = useState(false);
  const [softLoading, setSoftLoading] = useState(false);
  const [giftsOnCurrentPage, setGiftsOnCurrentPage] = useState(null);
  const [metaD, setMetaD] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [giftOnFocus, setGiftOnFocus] = useState(null);
  const [addingOrEditingMode, setAddingOrEditingMode] = useState(null);
  const [selectedList, setSelectedList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [serverStatus, setServerStatus] = useState(null);
  const [openServerDialog, setOpenServerDialog] = useState(null);
  const [openConfirmDelDialog, setOpenConfirmDelDialog] = useState(false);

  const catchData = (res) => {
    const meta = res.data.metadata;
    const gifts = res.data.gifts;
    if (meta != null) setMetaD(meta);
    if (gifts != null) setGiftsOnCurrentPage(gifts);
  };
  const catchError = (err) => {
    err = ServerResponse(err);
    console.log(err);
    if (err.status && err.status === 405) {
      setServerStatus({
        code: err.status,
        msg: err.message,
        hint: "Kiểm tra lại kết nối internet và thử lại...",
      });
    } else if (err.status && err.status === 401)
      setServerStatus({
        code: err.status,
        msg: err.message,
        hint: "Đăng nhập lại",
      });
    else setServerStatus({ code: err.status, msg: err.message, hint: "..." });
    setOpenServerDialog(true);
  };

  const loadData = (pageNum) => {
    const local_token = localStorage.getItem("token");
    setHardLoading(true);
    if (local_token !== null || local_token !== "") {
      const config = {
        headers: {
          Authorization: "Bearer " + local_token,
          "Content-Type": "application/json",
        },
      };
      if (searchTerm == null || searchTerm === "") {
        axios
          .get(
            ServerApi.BASE_URL +
              ServerApi.GET_ALL_GIFTS +
              pageNum +
              "&per_page=5",
            config
          )
          .then((res) => {
            console.log(res);
            catchData(res.data);
            setHardLoading(false);
          })
          .catch((err) => {
            setHardLoading(false);
            console.log(err);
            if (
              err.response.data &&
              err.response.data.status === 404 &&
              currentPage > 1
            ) {
              const prevPage = currentPage - 1;
              setCurrentPage(prevPage);
              loadData(prevPage);
              setSelectedList([]);
            } else {
              catchError(err);
            }
          });
      } else {
        axios
          .get(
            ServerApi.BASE_URL + ServerApi.SEARCH_GIFTS_BY_KW + searchTerm,
            config
          )
          .then((res) => {
            console.log(res);
            catchData(res.data);
            setHardLoading(false);
          })
          .catch((err) => {
            setHardLoading(false);
            console.log(err);
            if (
              err.response.data &&
              err.response.data.status === 404 &&
              currentPage > 1
            ) {
              const prevPage = currentPage - 1;
              setCurrentPage(prevPage);
              loadData(prevPage);
              setSelectedList([]);
            } else {
              catchError(err);
            }
          });
      }
    } else {
      localStorage.removeItem("name");
      localStorage.removeItem("token");
    }
  };

  useEffect(() => {
    loadData(currentPage);
  }, [currentPage]);

  const editFormik = useFormik({
    initialValues: {
      ID: -1,
      giftName: "",
      amount: 999999,
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  const handleAgree = () => {
    if (serverStatus.code === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      navigate("/login");
    } else setOpenServerDialog(false);
  };

  const onHandleDeleteClicked = () => {
    setOpenConfirmDelDialog(true);
  };

  const confirmedDelete = () => {
    setSoftLoading(true);
    const local_token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: "Bearer " + local_token,
        "Content-Type": "application/json",
      },
    };
    const body_req = {
      ids: selectedList.map((item) => item.ID),
    };
    axios
      .post(ServerApi.BASE_URL + ServerApi.DELETE_GIFTS, body_req, config)
      .then((res) => {
        console.log("after deling:", res);
        res = ServerResponse(res);
        setServerStatus({
          msg: "Thao tác thành công",
          hint: "",
        });
        loadData(metaD.total_pages - 1);
        setSelectedList([]);
        setOpenConfirmDelDialog(false);
        setSoftLoading(false);
        setOpenServerDialog(true);
      })
      .catch((err) => {
        console.log(err);
        setSoftLoading(true);
        catchError(err);
      });
  };

  const editFormHandleSubmit = () => {
    setSoftLoading(true);
    const local_token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: "Bearer " + local_token,
        "Content-Type": "application/json",
      },
    };
    const body_req = {
      gift_name: editFormik.values.giftName,
      total: parseInt(editFormik.values.amount),
      remaining: parseInt(editFormik.values.amount),
    };
    if (giftOnFocus == null) {
      axios
        .post(ServerApi.BASE_URL + ServerApi.CREATE_GIFT, body_req, config)
        .then((res) => {
          console.log("after adding:", res);
          res = ServerResponse(res);
          console.log("asdsa", res);
          setServerStatus({
            msg: "Thao tác thành công",
            hint: "",
          });
          editFormik.setFieldValue("giftName", "");
          editFormik.setFieldValue("amount", "");
          editFormik.setFieldValue("ID", -1);
          loadData(currentPage);
          setSoftLoading(false);
          setOpenServerDialog(true);
        })
        .catch((err) => {
          console.log(err);
          setSoftLoading(true);
          catchError(err);
        });
    } else {
      //edit gift
      axios
        .put(
          ServerApi.BASE_URL + ServerApi.UPDATE_GIFT + giftOnFocus.ID,
          body_req,
          config
        )
        .then((res) => {
          console.log("after adding:", res);
          res = ServerResponse(res);
          setServerStatus({
            msg: "Thao tác thành công",
            hint: "",
          });
          editFormik.setFieldValue("giftName", "");
          editFormik.setFieldValue("amount", "");
          editFormik.setFieldValue("ID", -1);
          loadData(currentPage);

          setSoftLoading(false);
          setOpenServerDialog(true);
        })
        .catch((err) => {
          console.log(err);
          setSoftLoading(true);
          catchError(err);
        });
    }
    setGiftOnFocus(null);
    setAddingOrEditingMode(false);
  };

  useEffect(() => {
    if (giftOnFocus != null) {
      editFormik.setFieldValue("ID", giftOnFocus.ID);
      editFormik.setFieldValue("giftName", giftOnFocus.GiftName);
      editFormik.setFieldValue("amount", giftOnFocus.Remaining);
    } else {
      editFormik.setFieldValue("ID", -1);
      editFormik.setFieldValue("giftName", "");
      editFormik.setFieldValue("amount", "");
    }
  }, [giftOnFocus]);

  // TABLE DATA:
  const renderHeaders = () => {
    return (
      <Wrapper>
        <th className="table__th">
          <Checkbox
            sx={{
              color: "white",
              "&.Mui-checked": {
                color: "white",
              },
            }}
            checked={selectedList.length > 0}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedList(giftsOnCurrentPage);
              } else setSelectedList([]);
            }}
          />
          {selectedList.length > 0 ? "Chọn " + selectedList.length : null}
        </th>
        <th className="table__th small">ID</th>
        <th className="table__th simi-small">Tên quà tặng</th>
        <th className="table__th simi-small">Số lượng trong kho</th>
        <th className="table__th">Chỉnh sửa</th>
      </Wrapper>
    );
  };
  const renderBody = (gifts) => {
    return (
      <Wrapper>
        {gifts != null &&
          gifts.map((item, index) => (
            <tr
              key={item.ID}
              className={
                selectedList.filter((fitem, fid) => fitem.ID === item.ID)
                  .length > 0
                  ? "table__tr table__tr-selected"
                  : "table__tr"
              }
            >
              <td className="table__td table__mobile-title">
                <span className="table__mobile-value">
                  <Checkbox
                    sx={{
                      color: { xs: "white", sm: "white", md: "black" },
                      "&.Mui-checked": {
                        color: { xs: "white", sm: "white", md: "black" },
                      },
                    }}
                    checked={
                      selectedList.filter((fitem, fid) => fitem.ID === item.ID)
                        .length > 0
                    }
                    onChange={(e) => {
                      console.log(e.target.checked);
                      if (e.target.checked) {
                        setSelectedList((prevState) => [...prevState, item]);
                      } else {
                        setSelectedList((prevState) => {
                          const newState = prevState.filter(
                            (fitem) => fitem.ID !== item.ID
                          );
                          return newState;
                        });
                      }
                    }}
                  />
                </span>
                <span
                  className="table__mobile-name"
                  onClick={() => {
                    setGiftOnFocus(item);
                  }}
                >
                  {item.GiftName}
                </span>
              </td>
              <td
                className="table__td small"
                onClick={() => setGiftOnFocus(item)}
              >
                <span className="table__mobile-caption">ID</span>
                <span className="table__value">{item.ID}</span>
              </td>

              <td
                className="table__td simi-small"
                onClick={() => setGiftOnFocus(item)}
              >
                <span className="table__mobile-caption">Tên Quà tặng</span>
                <span className="table__value">{item.GiftName}</span>
              </td>
              <td
                className="table__td simi-small"
                // onClick={() => handleShowItem(item)}
              >
                <span className="table__mobile-caption">Số lượng còn lại</span>
                <span className="table__value">{item.Remaining}</span>
              </td>
              <td className="table__td">
                <span className="table__mobile-caption">Chỉnh sửa</span>
                <span className="table__value">
                  <IconButton
                    color="primary"
                    aria-label="chinh sua"
                    onClick={() => {
                      setGiftOnFocus(item);
                      setAddingOrEditingMode(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </span>
              </td>
            </tr>
          ))}
      </Wrapper>
    );
  };

  return (
    <div>
      <Headers />
      <Grid container>
        <Grid item xs={12} sm={12} md={2}>
          <SideBar
            location="/gifts"
            handleRefresh={() => onHandleRefreshClicked()}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={10}>
          <MainContent>
            <Box>
              <MainContentHeader
                of="quà tặng"
                addOn={true}
                delOn={true}
                isDeleteDisabled={selectedList.length > 0 ? false : true}
                // handleRefreshClicked={onHandleRefreshClicked}
                handleDeleteClicked={onHandleDeleteClicked}
                handleAddClicked={() => {
                  setGiftOnFocus(null);
                  setAddingOrEditingMode(true);
                }}
                // catchTerm={(term) => setSearchTerm(term)}
                // isResetSearch={searchTerm === null ? true : false}
              />
              {hardLoading ? (
                <Box sx={{ textAlign: "center" }}>
                  <CircularProgress sx={{ color: "white", margin: "1rem" }} />
                </Box>
              ) : (
                <div className="content_body">
                  <Table
                    headers={renderHeaders()}
                    body={renderBody(giftsOnCurrentPage)}
                  />
                  {metaD && (
                    <div className="mainContent__footer">
                      <Stack
                        spacing={{ md: 3, xs: 2 }}
                        direction={{ md: "row", xs: "column" }}
                      >
                        <Stack>
                          <Box
                            sx={{ padding: "0 0.5rem", width: "max-content" }}
                          >
                            Tổng số loại quà tặng: {metaD.total_records}
                          </Box>
                          <Box
                            sx={{ padding: "0 0.5rem", width: "max-content" }}
                          >
                            Số trang hiện tại: {currentPage} /{" "}
                            {metaD.total_pages}
                          </Box>
                        </Stack>
                        <Grid container justifyContent="center">
                          <Pagination
                            count={metaD.total_pages}
                            defaultPage={currentPage}
                            variant="outlined"
                            color="secondary"
                            shape="rounded"
                            sx={{ margin: "auto" }}
                            onChange={(event, pageNumber) => {
                              setCurrentPage(pageNumber);
                              console.log(pageNumber);
                            }}
                          />
                        </Grid>
                      </Stack>
                    </div>
                  )}
                </div>
              )}
            </Box>
          </MainContent>
        </Grid>
      </Grid>
      <Dialog
        open={addingOrEditingMode === true ? true : false}
        fullWidth
        maxWidth="md"
        onClose={() => {
          if (giftOnFocus == null) setAddingOrEditingMode(false);
        }}
      >
        <Box className="dialog-content">
          <div className="dialog-title detail">
            {giftOnFocus != null ? "Chỉnh sửa quà tặng" : "Thêm loại quà tặng"}
          </div>
          <div className="dialog-content">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                editFormHandleSubmit();
              }}
            >
              <Grid container rowSpacing={4}>
                <Grid item container xs={12} sm={12} md={12}>
                  <Grid item xs={12} sm={4} md={3} alignSelf="center">
                    <label className="form-edit-add__label">Tên quà tặng</label>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9} alignSelf="center">
                    <TextField
                      label="Bắt buộc *"
                      variant="filled"
                      type="text"
                      error={
                        editFormik.values.giftName === "" ||
                        editFormik.values.giftName == null
                      }
                      name="giftName"
                      onChange={editFormik.handleChange}
                      InputProps={{ inputProps: { min: 0 } }}
                      value={editFormik.values.giftName}
                      size="small"
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <Grid item container xs={12} sm={12} md={12}>
                  <Grid item xs={12} sm={4} md={3} alignSelf="center">
                    <label className="form-edit-add__label">
                      Số lượng còn lại
                    </label>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9} alignSelf="center">
                    <TextField
                      // disabled={giftOnFocus != null ? true : false}
                      label="Bắt buộc *"
                      variant="filled"
                      type="number"
                      name="amount"
                      error={
                        editFormik.values.amount <= 0 ||
                        editFormik.values.amount == null
                      }
                      InputProps={{ inputProps: { min: 0 } }}
                      onChange={(e) =>
                        editFormik.setFieldValue("amount", e.target.value)
                      }
                      value={editFormik.values.amount}
                      size="small"
                      fullWidth
                    />
                  </Grid>
                </Grid>
                <Grid item container xs={12} md={12} sm={12}>
                  <Grid item xs={12} sm={4} md={3} alignSelf="center"></Grid>
                  <Grid
                    item
                    xs={12}
                    sm={8}
                    md={9}
                    alignSelf="center"
                    container
                    justifyContent="flex-end"
                  >
                    <Grid item xs={6.5} sm={6.5} md={6.5}>
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          setGiftOnFocus(null);
                          setAddingOrEditingMode(false);
                        }}
                      >
                        Hủy bỏ thao tác
                      </button>
                    </Grid>
                    <Grid
                      item
                      xs={5.5}
                      sm={5.5}
                      md={5.5}
                      container
                      justifyContent="flex-end"
                    >
                      <button
                        className="btn btn-safe"
                        type="submit"
                        disabled={
                          editFormik.values.giftName === "" ||
                          editFormik.values.giftName == null ||
                          editFormik.values.amount <= 0 ||
                          editFormik.values.amount == null
                        }
                      >
                        Xác nhận
                      </button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </form>
          </div>
        </Box>
      </Dialog>
      <Dialog
        open={openConfirmDelDialog === true ? true : false}
        fullWidth
        maxWidth="md"
        onClose={() => {
          if (giftOnFocus == null) setAddingOrEditingMode(false);
        }}
      >
        <DialogTitle id="alert-dialog-title">
          Xóa {selectedList.length} sản phẩm sau khỏi hệ thống?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Grid container sx={{ background: "#3084d7", padding: "0.5rem" }}>
              <Grid item xs={2} sm={2} md={1.5}>
                <span className="table__title">No </span>
              </Grid>
              <Grid item xs={2} sm={2} md={1.5}>
                <span className="table__title">Id </span>
              </Grid>
              <Grid item xs={6} sm={6} md={7}>
                <span className="table__title">Tên quà tặng</span>
              </Grid>
              <Grid item xs={2} sm={2} md={2}>
                <span className="table__title">Số lượng</span>
              </Grid>
            </Grid>
            {selectedList.map((item, index) => {
              console.log(item);
              return (
                <Grid container sx={{ padding: "0.5rem" }}>
                  <Grid item xs={2} sm={2} md={1.5}>
                    <span>{index + 1} </span>
                  </Grid>
                  <Grid item xs={2} sm={2} md={1.5}>
                    <span>{item.ID} </span>
                  </Grid>
                  <Grid item xs={6} sm={6} md={7}>
                    <span>{item.GiftName}</span>
                  </Grid>
                  <Grid item xs={2} sm={2} md={2}>
                    <span>{item.Remaining}</span>
                  </Grid>
                </Grid>
              );
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {softLoading === true ? (
            <Grid
              container
              sx={{
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                padding: "0.5rem",
              }}
            >
              <CircularProgress />
            </Grid>
          ) : (
            <Wrapper>
              <Button onClick={() => setOpenConfirmDelDialog(false)}>
                Hủy bỏ
              </Button>
              <Button color="error" onClick={confirmedDelete}>
                Xác nhận xóa
              </Button>
            </Wrapper>
          )}
        </DialogActions>
      </Dialog>
      {serverStatus && (
        <Dialog
          open={openServerDialog === true ? true : false}
          fullWidth
          maxWidth="sm"
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
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
        </Dialog>
      )}

      <Snackbar
        open={softLoading === true ? true : false}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          color: "#2e7d32",
        }}
      >
        <Box
          sx={{
            background: "#302c2c7e",
            padding: "0.5rem",
            borderRadius: "0.3rem",
          }}
        >
          <Grid container>
            <CircularProgress
              size="1.5rem"
              sx={{ margin: "auto", color: "white" }}
            />
          </Grid>
        </Box>
      </Snackbar>
    </div>
  );
};

const onHandleRefreshClicked = () => {};

export default Gifts;
