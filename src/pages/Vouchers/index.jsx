import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import axios from "axios";
import TextField from "@mui/material/TextField";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";

import Header from "../../components/Header";
import SideBar from "../../components/Sidebar";
import MainContent from "../../components/MainContent";
import Table from "../../utils/Table";
import Wrapper from "../../utils/Wrapper";
import AddVoucher from "./AddVoucher";
import SERVER_API from "../../objects/ServerApi";
import ServerResponse from "../../objects/ServerResponse";

import "./vouchers.css";
import MainContentHeader from "../../components/MainContent/MainContentHeader";
import ServerApi from "../../objects/ServerApi";
import { Autocomplete, Typography } from "@mui/material";

const NET_ERROR_MSG = "[Lỗi đường truyền]";

const Vouchers = () => {
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [vouchers, setVouchers] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [addOrEditMode, setAddOrEditMode] = useState(false);
  const [editItem, setEditItem] = useState(-1);
  const [openDialog, setOpenDialog] = useState(false);
  const [serverStatus, setServerStatus] = useState(null);
  const [openConfirmDel, setOpenConfirmDel] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showItem, setShowItem] = useState(null);
  const [openCheckingContent, setOpenCheckingContent] = useState(false);
  const [testingBill, setTestingBill] = useState([]);

  const [tempTestingProduct, setTempTestingProduct] = useState({
    pdName: "",
    pdPrice: "",
  });
  const [allProducts, setAllProducts] = useState(null);
  const [openAddTestProductDialog, setOpenAddTestProductDialog] =
    useState(false);
  const onHandleCheck = (item, isCheck) => {
    if (
      selectedList.filter((fitem, fid) => fitem.ID === item.ID).length > 0 &&
      isCheck === false
    ) {
      const newList = selectedList.filter((fitem) => fitem.ID !== item.ID);
      setSelectedList(newList);
    } else if (
      !selectedList.filter((fitem, fid) => fitem.ID === item.ID).length > 0 &&
      isCheck === true
    ) {
      setSelectedList([...selectedList, item]);
    }
  };

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
                setSelectedList(vouchers.map((item) => item));
              } else setSelectedList([]);
            }}
          />
          {selectedList.length > 0 ? "Chọn " + selectedList.length : null}
        </th>
        <th className="table__th small">ID</th>
        <th className="table__th simi-small">Tên voucher</th>
        <th className="table__th">Miêu tả</th>
        <th className="table__th small">Còn lại</th>
        <th className="table__th small">Số lượng</th>
        <th className="table__th">Chỉnh sửa</th>
      </Wrapper>
    );
  };

  const handleShowItem = (item) => {
    setShowItem(item);
    const local_token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: "Bearer " + local_token,
        "Content-Type": "application/json",
      },
    };
    axios
      .get(SERVER_API.BASE_URL + SERVER_API.GET_VOUCHER_BY_ID + item.ID, config)
      .then((res) => {
        // catchData(res);
        // setIsLoading(false);
        setShowItem(res.data.data.voucher);
      })
      .catch((err) => {
        console.log(err);
        // setIsLoading(false);
        catchError(err);
      });
  };

  const renderBody = (prods) => {
    return (
      <Wrapper>
        {prods
          // .filter((val) => {
          //   if (searchTerm === "") {
          //     return val;
          //   } else if (
          //     val.Name.toLowerCase().includes(searchTerm.toLowerCase())
          //   ) {
          //     return val;
          //   }
          //   return false;
          // })
          .map((item, index) => (
            <tr
              key={index}
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
                    onChange={(e) => onHandleCheck(item, e.target.checked)}
                  />
                </span>
                <span
                  className="table__mobile-name"
                  onClick={() => {
                    handleShowItem(item);
                  }}
                >
                  {item.Name}
                </span>
              </td>
              <td
                className="table__td small"
                onClick={() => handleShowItem(item)}
              >
                <span className="table__mobile-caption">ID</span>
                <span className="table__value">{item.ID}</span>
              </td>
              <td
                className="table__td simi-small"
                onClick={() => handleShowItem(item)}
              >
                <span className="table__mobile-caption">Tên voucher</span>
                <span className="table__value">{item.Name}</span>
              </td>

              <td
                className="table__td table__value-description"
                onClick={() => handleShowItem(item)}
              >
                <span className="table__mobile-caption">Miêu tả</span>
                <span
                  style={{ whiteSpace: "pre-line" }}
                  className="table__value"
                >
                  {item.Description.replace(/\\n/g, "")}
                </span>
              </td>

              <td className="table__td small">
                <span className="table__mobile-caption">Còn lại</span>
                <span
                  className="table__value"
                  onClick={() => handleShowItem(item)}
                >
                  {item.Remaining}
                </span>
              </td>

              <td className="table__td small">
                <span className="table__mobile-caption">Số lượng</span>
                <span
                  className="table__value"
                  onClick={() => handleShowItem(item)}
                >
                  {item.Total}
                </span>
              </td>

              <td className="table__td">
                <span className="table__mobile-caption">Chỉnh sửa</span>
                <span className="table__value">
                  <IconButton
                    color="primary"
                    aria-label="chinh sua"
                    onClick={() => {
                      setEditItem(item.ID);
                      setAddOrEditMode(true);
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

  const catchData = (res) => {
    const meta = res.data.metadata;
    const vouchs = res.data.vouchers;
    if (meta != null) setTotalPages(meta.total_pages);
    if (vouchs != null) setVouchers(vouchs);
  };

  const catchError = (err) => {
    err = ServerResponse(err);

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
    setOpenDialog(true);
  };

  const loadData = (pageNum) => {
    const local_token = localStorage.getItem("token");
    setIsLoading(true);
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
            SERVER_API.BASE_URL + SERVER_API.GETVOUCHERS_ENDPOINT + pageNum,
            config
          )
          .then((res) => {
            console.log(res);
            catchData(res.data);
            setIsLoading(false);
          })
          .catch((err) => {
            setIsLoading(false);
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
            SERVER_API.BASE_URL + SERVER_API.SEARCH_VOUCHERS_BY_KW + searchTerm,
            config
          )
          .then((res) => {
            console.log(res);
            catchData(res.data);
            setIsLoading(false);
          })
          .catch((err) => {
            setIsLoading(false);
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
  }, [currentPage, searchTerm]);

  const onHandleCancel = () => {
    setEditItem(-1);
    setAddOrEditMode(false);
  };

  const onHandleRefreshClicked = () => {
    setIsLoading(true);
    setSelectedList([]);
    loadData(currentPage);
  };

  const onHandleDeleteClicked = () => {
    const newList = selectedList.map((item) => ({
      ...item,
      status: "Chờ xử lý",
    }));
    setSelectedList(newList);
    setOpenConfirmDel(true);
  };
  const onHandleAddClicked = () => {
    setAddOrEditMode(true);
    setCurrentPage(totalPages + 1);
  };

  const onHandleCheckClicked = () => {
    const local_token = localStorage.getItem("token");
    if (local_token !== null || local_token !== "") {
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
          setAllProducts(res.data.data.products);
        })
        .catch((err) => {
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
      localStorage.removeItem("name");
      localStorage.removeItem("token");
    }
    setOpenCheckingContent(true);
  };

  const onHandleAfterAddOrEditingMode = (isCont) => {
    setAddOrEditMode((prevState) => {
      if (prevState === false) {
        return false;
      } else return false;
    });
    setEditItem(-1);
    loadData(currentPage);
    if (isCont === true) {
      setAddOrEditMode((prevState) => {
        if (prevState === false) {
          return true;
        } else return true;
      });
    }
  };
  const handleAgree = () => {
    if (serverStatus.code === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      navigate("/login");
    } else setOpenDialog(false);
  };

  const confirmedDelete = () => {
    let deletingList = selectedList;
    for (
      let remainingItemsDel = selectedList.length;
      remainingItemsDel > 0;
      --remainingItemsDel
    ) {
      setDeleting(true);
      let deletingID = deletingList[remainingItemsDel - 1].ID;
      setDeletingId(deletingID);

      const local_token = localStorage.getItem("token");
      if (local_token !== null || local_token !== "") {
        const config = {
          headers: {
            Authorization: "Bearer " + local_token,
            "Content-Type": "application/json",
          },
        };
        axios
          .delete(
            ServerApi.BASE_URL + ServerApi.DELETE_VOUCHER + deletingID,
            config
          )
          .then((res) => {
            // res = catchData(res);
            console.log("res: ", res);
            if (res.data.status === 200) {
              console.log("filtering: ", deletingID);
              setSelectedList((prevState) => [
                ...prevState.filter((fit, fid) => fit.ID !== deletingID),
              ]);
            }
          })
          .catch((err) => {
            console.log("error: ", err);
            selectedList.map((mit, mid) => {
              if (mit.ID === deletingID) {
                mit.status = err.response.data.message;
              }
              return mit;
            });
          })
          .finally(() => {
            loadData(currentPage);
            setDeleting(false);
          });
      }
    }
  };

  return (
    <div>
      <Header />
      <Grid container>
        <Grid item xs={12} sm={12} md={2}>
          <SideBar
            location="/vouchers"
            handleRefresh={() => onHandleRefreshClicked()}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={10}>
          <MainContent of="vouchers">
            {openCheckingContent ? (
              <div>
                <div className="chosen-vouchers-and-bills">
                  <Grid container columnSpacing={3} rowSpacing={2}>
                    <Grid item container xs={12} sm={6} md={6}>
                      <Grid item xs={12} sm={12} md={12}>
                        <Box
                          sx={{
                            background: "rgba(0, 85, 147, 0.78)",
                            padding: "0rem 1.3rem",
                            borderRadius: "0.6rem",
                          }}
                        >
                          <Typography
                            sx={{
                              color: "white",
                              fontWeight: 600,
                              fontSize: "1.2rem",
                              lineHeight: "2.2rem",
                            }}
                          >
                            Voucher đã chọn
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        sx={{
                          background: "white",
                          marginTop: "0.3rem",

                          borderRadius: "0.5rem",
                          overflowY: "auto",
                          height: "12rem",
                        }}
                      >
                        {selectedList.map((mit, mid) => {
                          return (
                            <Box
                              sx={
                                mid % 2 === 1
                                  ? {
                                      background: "#DBE8F1",
                                      padding: "0.3rem 1rem",
                                    }
                                  : {
                                      padding: "0.3rem 1rem",
                                    }
                              }
                            >
                              <Typography
                                sx={{ color: "#005593", fontWeight: 600 }}
                              >
                                {mit.Name}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Grid>
                    </Grid>
                    <Grid item container xs={12} sm={6} md={6}>
                      <Grid item xs={12} sm={12} md={12}>
                        <Box
                          sx={{
                            background: "rgba(0, 85, 147, 0.78)",
                            padding: "0rem 1.3rem",
                            borderRadius: "0.6rem",
                          }}
                        >
                          <Grid container>
                            <Grid item xs={7} sm={7} md={7} alignSelf="center">
                              <Typography
                                sx={{
                                  color: "white",
                                  fontWeight: 600,
                                  fontSize: "1.2rem",
                                  lineHeight: "2.2rem",
                                }}
                              >
                                Hóa đơn
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              container
                              xs={5}
                              sm={5}
                              md={5}
                              alignSelf="center"
                              justifyContent="flex-end"
                            >
                              <IconButton
                                sx={{ color: "white" }}
                                size="small"
                                aria-label="upload json file"
                                component="label"
                              >
                                <input
                                  hidden
                                  accept="application/JSON"
                                  multiple
                                  type="file"
                                  onChange={(e) => {
                                    console.log(e.target.value);
                                    var data = require("json!." +
                                      e.target.value);
                                    console.log("JSONcdat: ", data);
                                  }}
                                />
                                <FileUploadOutlinedIcon />
                              </IconButton>

                              <IconButton
                                sx={{ color: "white" }}
                                size="small"
                                onClick={() => {
                                  let today = new Date();
                                  var fileName =
                                    "vmama_test_bill_" +
                                    today.getDate() +
                                    "-" +
                                    (today.getMonth() + 1) +
                                    "-" +
                                    today.getFullYear() +
                                    ".json";

                                  let dataUri =
                                    "data:application/json;charset=utf-8," +
                                    encodeURIComponent(
                                      JSON.stringify(testingBill)
                                    );
                                  let linkElement = document.createElement("a");
                                  linkElement.setAttribute("href", dataUri);
                                  linkElement.setAttribute(
                                    "download",
                                    fileName
                                  );
                                  linkElement.click();
                                }}
                              >
                                <FileDownloadOutlinedIcon />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Box>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        sx={{
                          background: "white",
                          marginTop: "0.3rem",

                          borderRadius: "0.5rem",
                          overflowY: "auto",
                          height: "12rem",
                        }}
                      >
                        <Box>
                          {testingBill.map((mit, mid) => {
                            return (
                              <Box
                                sx={
                                  mid % 2 === 1
                                    ? {
                                        background: "#DBE8F1",
                                        padding: "0.3rem 1rem",
                                      }
                                    : {
                                        padding: "0.3rem 1rem",
                                      }
                                }
                              >
                                <Grid container>
                                  <Grid item xs={9} sm={9} md={9}>
                                    <Typography
                                      sx={{ color: "#005593", fontWeight: 600 }}
                                    >
                                      {mit.pdName}
                                    </Typography>
                                  </Grid>

                                  <Grid item xs={3} sm={3} md={3}>
                                    <Typography
                                      sx={{ color: "#005593", fontWeight: 600 }}
                                    >
                                      {mit.pdPrice}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </Box>
                            );
                          })}
                          <Box sx={{ padding: "0.2rem 1rem" }}>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setTempTestingProduct({
                                  pdName: null,
                                  pdPrice: null,
                                });
                                setOpenAddTestProductDialog(true);
                              }}
                            >
                              <AddCircleOutlinedIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
                <div className="checking-cta" style={{ margin: "0.5rem 1rem" }}>
                  <Grid container justifyContent={"flex-end"}>
                    <button className="btn btn-light-green">Kiểm tra</button>
                  </Grid>
                </div>
                <div className="checking-results">
                  <Grid
                    container
                    sx={{
                      background: "rgba(0, 85, 147, 0.78)",
                      borderRadius: "0.5rem",
                      padding: "0rem 1.3rem",
                    }}
                  >
                    <Grid item container xs={6} sm={6} md={6}>
                      <Typography
                        sx={{
                          color: "white",
                          fontWeight: 600,
                          fontSize: "1.2rem",
                          lineHeight: "2.2rem",
                        }}
                      >
                        Tên voucher
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      container
                      xs={6}
                      sm={6}
                      md={6}
                      textAlign="center"
                      justifyContent="center"
                    >
                      <Typography
                        sx={{
                          color: "white",
                          fontWeight: 600,
                          fontSize: "1.2rem",
                          lineHeight: "2.2rem",
                          textAlign: "center",
                        }}
                      >
                        Kết quả
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    sx={{
                      background: "white",
                      marginTop: "0.3rem",

                      borderRadius: "0.5rem",
                      overflowY: "auto",
                      height: "12rem",
                    }}
                  >
                    {selectedList.map((mit, mid) => {
                      return (
                        <Box
                          sx={
                            mid % 2 === 1
                              ? {
                                  background: "#DBE8F1",
                                  padding: "0.3rem 1rem",
                                }
                              : {
                                  padding: "0.3rem 1rem",
                                }
                          }
                        >
                          <Typography
                            sx={{ color: "#005593", fontWeight: 600 }}
                          >
                            {mit.Name}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Grid>
                </div>
                <div className="checking-footer-cta">
                  <Grid
                    sx={{ marginTop: "0.8rem" }}
                    container
                    justifyContent={"flex-end"}
                    columnSpacing={2}
                  >
                    <Grid item xs={4} sm={4} md={1.5}>
                      <button
                        className="btn btn-orange fullWidth"
                        onClick={() => setOpenCheckingContent(false)}
                      >
                        Thoát
                      </button>
                    </Grid>
                    <Grid item xs={4} sm={4} md={1.5}>
                      <button className="btn btn-light-green fullWidth">
                        Tiếp tục
                      </button>
                    </Grid>
                  </Grid>
                </div>
              </div>
            ) : !addOrEditMode ? (
              <Box>
                <MainContentHeader
                  of="vouchers"
                  addOn={true}
                  delOn={true}
                  checkOn={true}
                  catchTerm={(term) => setSearchTerm(term)}
                  isRefreshDisabled={isLoading}
                  isDeleteDisabled={selectedList.length > 0 ? false : true}
                  isCheckingDisabled={selectedList.length > 0 ? false : true}
                  handleRefreshClicked={onHandleRefreshClicked}
                  handleDeleteClicked={onHandleDeleteClicked}
                  handleAddClicked={onHandleAddClicked}
                  handleCheckClicked={onHandleCheckClicked}
                />
                {isLoading ? (
                  <Box sx={{ textAlign: "center" }}>
                    <CircularProgress sx={{ color: "white", margin: "1rem" }} />
                  </Box>
                ) : (
                  <div className="content_body">
                    <Table
                      headers={renderHeaders()}
                      body={renderBody(vouchers)}
                    />
                    <div className="mainContent__footer">
                      <Stack spacing={2}>
                        <Pagination
                          count={totalPages}
                          defaultPage={currentPage}
                          variant="outlined"
                          color="secondary"
                          shape="rounded"
                          onChange={(event, pageNumber) => {
                            setCurrentPage(pageNumber);
                            console.log(pageNumber);
                          }}
                        />
                      </Stack>
                    </div>
                  </div>
                )}
              </Box>
            ) : (
              <AddVoucher
                editItem={editItem}
                handleCancel={onHandleCancel}
                afterAddOrEditingMode={(isCont) =>
                  onHandleAfterAddOrEditingMode(isCont)
                }
              />
            )}
          </MainContent>
        </Grid>
      </Grid>
      {serverStatus && (
        <Dialog
          open={openDialog}
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
      <Dialog
        open={openConfirmDel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogTitle id="alert-dialog-title">
          {selectedList.length > 0 ? (
            <p>Xóa {selectedList.length} vouchers sau khỏi hệ thống?</p>
          ) : (
            <p>"Đã xóa thành công"</p>
          )}
        </DialogTitle>
        <DialogContent>
          {selectedList.length > 0 && (
            <DialogContentText id="alert-dialog-description">
              <Grid
                container
                sx={{ background: "#3084d7", padding: "0.5rem" }}
                columnSpacing={3}
              >
                <Grid item xs={1} sm={1} md={1}>
                  <span className="table__title">No </span>
                </Grid>
                <Grid item xs={1} sm={1} md={1}>
                  <span className="table__title">Id </span>
                </Grid>
                <Grid item xs={3} sm={3} md={3}>
                  <span className="table__title">Tên voucher</span>
                </Grid>
                <Grid item xs={3.5} sm={3.5} md={3.5}>
                  <span className="table__title">Miêu tả</span>
                </Grid>
                <Grid item xs={1.5} sm={1.5} md={1.5}>
                  <span className="table__title">Còn lại / Số lượng</span>
                </Grid>
                <Grid item xs={2} sm={2} md={2}>
                  <span className="table__title">Trạng thái</span>
                </Grid>
              </Grid>
              {selectedList.map((item, index) => {
                console.log(item);
                return (
                  <Grid container sx={{ padding: "0.5rem" }} columnSpacing={3}>
                    <Grid item xs={1} sm={1} md={1}>
                      <span>{index + 1}</span>
                    </Grid>
                    <Grid item xs={1} sm={1} md={1}>
                      <span>{item.ID}</span>
                    </Grid>
                    <Grid item xs={3} sm={3} md={3}>
                      <span>{item.Name}</span>
                    </Grid>
                    <Grid item xs={3.5} sm={3.5} md={3.5}>
                      <span>{item.Description}</span>
                    </Grid>
                    <Grid
                      item
                      xs={1.5}
                      sm={1.5}
                      md={1.5}
                      sx={{ textAlign: "center" }}
                    >
                      <span>
                        {item.Remaining} / {item.Total}
                      </span>
                    </Grid>
                    <Grid item xs={2} sm={2} md={2}>
                      <span style={{ textAlign: "center" }}>
                        {deletingId === item.ID ? (
                          <CircularProgress sx={{ verticalAlign: "center" }} />
                        ) : (
                          <span>{item.status}</span>
                        )}
                      </span>
                    </Grid>
                  </Grid>
                );
              })}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          {deleting ? (
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
              <Button onClick={() => setOpenConfirmDel(false)}>
                {selectedList.length <= 0 ? "Xác nhận" : "Hủy bỏ"}
              </Button>

              {selectedList.length > 0 && (
                <Button color="error" onClick={confirmedDelete}>
                  Xác nhận xóa
                </Button>
              )}
            </Wrapper>
          )}
        </DialogActions>
      </Dialog>
      <Dialog
        open={showItem != null}
        onClose={() => setShowItem(null)}
        fullWidth
        maxWidth="lg"
      >
        <div className="dialog-content">
          <div className="dialog-title detail">
            <Grid container>
              <Grid item xs={10} sm={10} md={11}>
                Thông tin chi tiết
              </Grid>
              <Grid item xs={2} sm={2} md={1}>
                <span style={{ marginLeft: "1rem" }}>
                  <IconButton
                    color="primary"
                    aria-label="chinh sua"
                    onClick={() => {
                      setEditItem(showItem.ID);
                      setShowItem(null);
                      setAddOrEditMode(true);
                    }}
                  >
                    <EditIcon sx={{ fontSize: "2rem" }} />
                  </IconButton>
                </span>
              </Grid>
            </Grid>
          </div>

          <Grid
            container
            rowSpacing={8}
            columnSpacing={5}
            sx={{ padding: { xs: "2rem 0.5rem", md: "1rem 5rem" } }}
          >
            {/* Chia 2 cột cho 2 steps */}
            <Grid
              item
              container
              xs={12}
              sm={6}
              md={6}
              rowSpacing={5}
              columnSpacing={0}
            >
              {/* Step1 */}
              <Box
                sx={{
                  background: "#cccccc27",
                  padding: "1.5rem",
                  borderRadius: "0.5rem",
                }}
              >
                <Grid
                  item
                  container
                  xs={12}
                  sm={12}
                  md={12}
                  rowSpacing={4}
                  columnSpacing={2}
                >
                  <Grid
                    item
                    container
                    xs={12}
                    sm={12}
                    md={12}
                    rowSpacing={0}
                    columnSpacing={2}
                  >
                    {/* Field1 */}
                    <Grid item xs={12} sm={5} md={3} alignSelf="center">
                      <label className="form-edit-add__label">
                        Tên Voucher
                      </label>
                    </Grid>
                    <Grid item xs={12} sm={7} md={8}>
                      <TextField
                        fullWidth
                        disabled
                        inputProps={{ min: 0, style: { textAlign: "center" } }}
                        variant="standard"
                        defaultValue={showItem ? showItem.Name : ""}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    container
                    xs={12}
                    sm={12}
                    md={12}
                    rowSpacing={0}
                    columnSpacing={2}
                  >
                    {/* Field2 */}
                    <Grid item xs={12} sm={12} md={3} alignSelf="center">
                      <label className="form-edit-add__label">Miêu tả</label>
                    </Grid>
                    <Grid item xs={12} sm={12} md={8}>
                      <TextField
                        fullWidth
                        multiline
                        maxRows={5}
                        variant="filled"
                        disabled
                        inputProps={{
                          min: 0,
                          style: {
                            textAlign: "left",
                            fontSize: "0.8rem",
                            wordWrap: "wrap",
                            padding: "0 0.3rem",
                          },
                        }}
                        defaultValue={
                          showItem
                            ? showItem.Description.replace(/\\n/g, "")
                            : ""
                        }
                      />
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    container
                    xs={12}
                    sm={12}
                    md={12}
                    rowSpacing={0}
                    columnSpacing={1}
                  >
                    {/* Field3 */}
                    <Grid item xs={12} sm={12} md={3} alignSelf="center">
                      <label className="form-edit-add__label">Tổng tiền</label>
                    </Grid>
                    <Grid item xs={5} sm={5} md={3.5}>
                      <TextField
                        fullWidth
                        disabled
                        inputProps={{ min: 0, style: { textAlign: "center" } }}
                        variant="standard"
                        value={
                          showItem && showItem.TotalPriceMin
                            ? showItem.TotalPriceMin
                            : NET_ERROR_MSG
                        }
                      />
                    </Grid>
                    <Grid
                      item
                      xs={2}
                      sm={2}
                      md={1.5}
                      alignSelf="center"
                      textAlign="center"
                    >
                      <label className="form-edit-add__label">đến</label>
                    </Grid>
                    <Grid item xs={5} sm={5} md={3.5}>
                      <TextField
                        fullWidth
                        disabled
                        inputProps={{ min: 0, style: { textAlign: "center" } }}
                        variant="standard"
                        value={
                          showItem && showItem.TotalPriceMax
                            ? showItem.TotalPriceMax
                            : NET_ERROR_MSG
                        }
                      />
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    container
                    xs={12}
                    sm={12}
                    md={12}
                    rowSpacing={3}
                    columnSpacing={2}
                  >
                    {/* Field4, 5 */}
                    <Grid item xs={5} sm={4} md={3} alignSelf="center">
                      <label className="form-edit-add__label">Số lượng</label>
                    </Grid>
                    <Grid item xs={7} sm={5} md={3}>
                      <TextField
                        fullWidth
                        disabled
                        inputProps={{ min: 0, style: { textAlign: "center" } }}
                        variant="standard"
                        defaultValue={showItem ? showItem.Total : ""}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      sm={5}
                      md={3}
                      alignSelf="center"
                      textAlign={{ md: "center", sm: "left" }}
                    >
                      <label className="form-edit-add__label">Publish</label>
                    </Grid>
                    <Grid item xs={6} sm={2} md={2} alignSelf="center">
                      <Checkbox
                        value={showItem ? showItem.Published : false}
                        disabled
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid
              item
              container
              xs={12}
              sm={6}
              md={6}
              rowSpacing={5}
              columnSpacing={0}
            >
              {/* Step2 */}
              <Box
                sx={{
                  background: "#cccccc27",
                  padding: "1.5rem",
                  borderRadius: "0.5rem",
                }}
              >
                <Grid
                  item
                  container
                  xs={12}
                  sm={12}
                  md={12}
                  rowSpacing={5}
                  columnSpacing={2}
                >
                  <Grid
                    item
                    container
                    xs={12}
                    sm={12}
                    md={12}
                    rowSpacing={5}
                    columnSpacing={2}
                  >
                    {/* Field1 */}
                    <Grid
                      item
                      container
                      xs={12}
                      sm={12}
                      md={12}
                      rowSpacing={1}
                      columnSpacing={2}
                    >
                      <Grid item xs={12} sm={6} md={3}>
                        <label className="form-edit-add__label">Sản phẩm</label>
                      </Grid>
                      <Grid
                        item
                        container
                        xs={12}
                        sm={12}
                        md={8}
                        rowSpacing={1}
                        columnSpacing={2}
                      >
                        {showItem && showItem.Products
                          ? showItem.Products.map((p, pIdx) => {
                              return (
                                <Grid item xs={12} sm={12} md={12} key={pIdx}>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    variant="outlined"
                                    disabled
                                    inputProps={{
                                      min: 0,
                                      style: { textAlign: "center" },
                                    }}
                                    defaultValue={p ? p.ProductName : ""}
                                  />
                                </Grid>
                              );
                            })
                          : null}
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item container xs={12} sm={12} md={12}>
                    {/* Field2 */}
                    <Grid item xs={12} sm={4} md={3} alignSelf="center">
                      <label className="form-edit-add__label">Quà tặng</label>
                    </Grid>
                    <Grid item xs={12} sm={8} md={8} alignSelf="center">
                      <TextField
                        fullWidth
                        disabled
                        inputProps={{
                          min: 0,
                          style: { textAlign: "center" },
                        }}
                        variant="standard"
                        value={
                          showItem && showItem.Gift
                            ? showItem.Gift.GiftName
                            : NET_ERROR_MSG
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
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
      <Dialog
        open={openAddTestProductDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="sm"
      >
        <Box className="dialog-content">
          <div className="dialog-title detail">Thêm sản phẩm kiểm tra</div>
          <div className="dialog-content">
            <Grid container rowSpacing={4}>
              <Grid item container xs={12} md={12} sm={12}>
                <Grid item xs={12} sm={4} md={3} alignSelf="center">
                  <label className="form-edit-add__label">Tên sản phẩm</label>
                </Grid>
                <Grid item xs={12} sm={8} md={9} alignSelf="center">
                  <Autocomplete
                    ListboxProps={{
                      style: { maxHeight: 150, overflow: "auto" },
                    }}
                    disablePortal
                    fullWidth
                    id="testing-product-name"
                    onChange={(e, v) => {
                      if (v.ID > 0) {
                        setTempTestingProduct((prevState) => {
                          const newState = {
                            pdName: v.ProductName,
                            pdPrice: prevState.pdPrice,
                          };
                          return newState;
                        });
                      }
                    }}
                    options={
                      allProducts
                        ? allProducts
                        : [
                            {
                              ID: -1,
                              CreatedAt: "null",
                              UpdatedAt: "null",
                              DeletedAt: "null",
                              ProductName: "null",
                            },
                          ]
                    }
                    getOptionLabel={(option) => option.ProductName}
                    size="small"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="filled"
                        label="Bắt buộc *"
                      />
                    )}
                  />
                  {/* <TextField
                    label="Bắt buộc *"
                    variant="filled"
                    size="small"
                    error={tempTestingProduct.pdName === "" ? true : false}
                    fullWidth
                  /> */}
                </Grid>
              </Grid>
              <Grid item container xs={12} md={12} sm={12}>
                <Grid item xs={12} sm={4} md={3} alignSelf="center">
                  <label className="form-edit-add__label">Giá tiền</label>
                </Grid>
                <Grid item xs={12} sm={8} md={9} alignSelf="center">
                  <TextField
                    label="Bắt buộc *"
                    variant="filled"
                    type="number"
                    // min={0}
                    value={tempTestingProduct.pdPrice}
                    onChange={(e) => {
                      const { value } = e.target;
                      if (/^[0-9]*$/.test(value)) {
                        setTempTestingProduct((prevState) => {
                          const newState = {
                            pdName: prevState.pdName,
                            pdPrice: value,
                          };
                          return newState;
                        });
                      }
                    }}
                    InputProps={{ inputProps: { min: 0 } }}
                    size="small"
                    error={tempTestingProduct.pdPrice === "" ? true : false}
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
                      onClick={() => setOpenAddTestProductDialog(false)}
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
                      type="button"
                      disabled={
                        tempTestingProduct.pdName === "" ||
                        tempTestingProduct.pdName == null ||
                        tempTestingProduct.pdPrice === "" ||
                        tempTestingProduct.pdPrice == null
                      }
                      onClick={() => {
                        testingBill.push(tempTestingProduct);
                        // console.log(testingBill, tempTestingProduct);
                        setOpenAddTestProductDialog(false);
                      }}
                    >
                      Xác nhận
                    </button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Box>
      </Dialog>
    </div>
  );
};

export default Vouchers;
