import React, { useState } from "react";
import "./userManagement.css";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import Pagination from "@mui/material/Pagination";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import Dialog from "@mui/material/Dialog";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import axios from "axios";

import Header from "../../components/Header";
import SideBar from "../../components/Sidebar";
import MainContent from "../../components/MainContent";
import MainContentHeader from "../../components/MainContent/MainContentHeader";
import Table from "../../utils/Table";
import Wrapper from "../../utils/Wrapper";
import { useEffect } from "react";
import ServerResponse from "../../objects/ServerResponse";
import ServerApi from "../../objects/ServerApi";
import { DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useNavigate } from "react-router-dom";

// const usersList = [
//   {
//     ID: 1,
//     Full_Name: "Nguyễn Văn A",
//     User_Name: "user1",
//     Password: "nvauser1",
//     Admin: false,
//   },
//   {
//     ID: 2,
//     Full_Name: "Nguyễn Văn B",
//     User_Name: "user2",
//     Password: "nvbuser2",
//     Admin: false,
//   },
//   {
//     ID: 3,
//     Full_Name: "Nguyễn Văn C",
//     User_Name: "user3",
//     Password: "nvcuser3",
//     Admin: true,
//   },
//   {
//     ID: 4,
//     Full_Name: "Nguyễn Văn D",
//     User_Name: "user4",
//     Password: "nvduser4",
//     Admin: false,
//   },
//   {
//     ID: 5,
//     Full_Name: "Nguyễn Văn E",
//     User_Name: "user5",
//     Password: "nveuser5",
//     Admin: false,
//   },
// ];

const getRoleText = (id) => {
  if (id === 1) return "Quản trị viên";
  else if (id === 2) return "Nhân viên bán hàn";
  else return "Chưa xác định";
};

const UserManagement = () => {
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedList, setSelectedList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [editItem, setEditItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showItem, setShowItem] = useState(null);
  const [serverStatus, setServerStatus] = useState(null);
  const [serverDialog, setServerDialog] = useState(false);
  const [usersOnCurrentPage, setUsersOnCurrentPage] = useState(null);

  // Load data:
  const catchData = (res) => {
    const meta = res.data.metadata;
    const prods = res.data.accounts;
    if (meta != null) setTotalPages(meta.total_pages);
    if (prods != null) setUsersOnCurrentPage(prods);
  };

  const catchError = (err) => {
    err = ServerResponse(err);
    if (err.status && err.status === 405) {
      setServerStatus({
        code: err.status,
        msg: err.message,
        hint: "Kiểm tra lại kết nối internet và thử lại...",
      });
    } else if (err.status === 401)
      setServerStatus({
        code: err.status,
        msg: err.message,
        hint: "Đăng nhập lại",
      });
    else setServerStatus({ code: err.status, msg: err.message, hint: "..." });
    setServerDialog(true);
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
      axios
        .get(ServerApi.BASE_URL + ServerApi.GET_STAFFS + pageNum, config)
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
      localStorage.removeItem("name");
      localStorage.removeItem("token");
    }
  };

  useEffect(() => {
    loadData(currentPage);
  }, [currentPage]);

  // Diaglog:
  const [openAddDialog, setOpenAddDialog] = React.useState(false);

  const handleClickOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddEditDialog = () => {
    formik.setFieldValue("userName", "");
    formik.setFieldValue("fullName", "");
    formik.setFieldValue("password", "");
    formik.setFieldValue("repassword", "");

    setOpenAddDialog(false);
    setEditItem(null);
  };
  // End dialog
  const handleAgree = () => {
    console.log("server: ", serverStatus);
    if (serverStatus.code === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      navigate("/login");
    } else if (serverStatus.code === 200) {
      loadData(totalPages);
      setServerDialog(false);
      setServerStatus(null);
    } else setServerDialog(false);
  };

  // thong tin chi tiet:

  const handleCloseDetailDialog = () => {
    setShowItem(null);
  };

  const formik = useFormik({
    initialValues: {
      fullName: "",
      userName: "",
      password: "",
      repassword: "",
    },
    onSubmit: (values) => {
      const local_token = localStorage.getItem("token");
      handleCloseAddEditDialog();
      if (local_token !== null || local_token !== "") {
        const config = {
          headers: {
            Authorization: "Bearer " + local_token,
            "Content-Type": "application/json",
          },
        };
        const body_params = {
          username: values.userName,
          password: values.password,
          confirmed_password: values.repassword,
          name: values.fullName,
        };

        axios
          .post(
            ServerApi.BASE_URL + ServerApi.REGISTER_STAFF,
            body_params,
            config
          )
          .then((res) => {
            console.log("Đăng ký thành công: ", res);
            res = ServerResponse(res);
            setServerStatus({ code: res.status, msg: res.message, hint: "" });

            setServerDialog(true);
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
    },
  });

  useEffect(() => {
    if (editItem != null) {
      formik.setFieldValue("fullName", editItem.Name);
      formik.setFieldValue("userName", editItem.Username);
      formik.setFieldValue(
        "password",
        "Todo: kiểm tra quyền, only enable for ADMIN"
      );
      setIsEditing(true);
    } else {
      formik.setFieldValue("fullName", "");
      formik.setFieldValue("userName", "");
      formik.setFieldValue("password", "");
      setIsEditing(false);
    }
    console.log(editItem);
  }, [editItem]);

  const onHandleRefreshClicked = () => {
    setIsLoading(true);
    setSelectedList([]);
    loadData(currentPage);
  };

  const onHandleDeleteClicked = () => {};

  const onHandleAddClicked = () => {
    setOpenAddDialog(true);
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
              // TODO: Toggle all selected list
            }}
          />
          {selectedList.length > 0 ? "Chọn " + selectedList.length : null}
        </th>
        <th className="table__th small">ID</th>
        <th className="table__th">Tên nhân viên</th>
        <th className="table__th">Tên đăng nhập</th>
        <th className="table__th small">Admin</th>
        <th className="table__th">Chỉnh sửa</th>
      </Wrapper>
    );
  };
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

  const renderBody = (users) => {
    return (
      <Wrapper>
        {users
          ? users
              .filter((val) => {
                if (searchTerm === "") {
                  return val;
                } else if (
                  val.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  val.Username.toLowerCase().includes(searchTerm.toLowerCase())
                ) {
                  return val;
                }
                return false;
              })
              .map((item) => (
                <tr
                  className={
                    selectedList.filter((it, id) => it.ID === item.ID).length >
                    0
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
                          selectedList.filter((it, id) => it.ID === item.ID)
                            .length > 0
                            ? true
                            : false
                        }
                        onChange={(e) => onHandleCheck(item, e.target.checked)}
                      />
                    </span>
                    <span className="table__mobile-name">{item.Name}</span>
                  </td>
                  <td
                    className="table__td small"
                    onClick={() => setShowItem(item)}
                  >
                    <span className="table__mobile-caption">ID</span>
                    <span className="table__value">{item.ID}</span>
                  </td>
                  <td className="table__td" onClick={() => setShowItem(item)}>
                    <span className="table__mobile-caption">Tên nhân viên</span>
                    <span>{item.Name}</span>
                  </td>

                  <td className="table__td" onClick={() => setShowItem(item)}>
                    <span className="table__mobile-caption">Tên đăng nhập</span>
                    <span>{item.Username}</span>
                  </td>

                  <td
                    className="table__td small"
                    onClick={() => setShowItem(item)}
                  >
                    <span className="table__mobile-caption">Admin</span>
                    <span>
                      {item.Role.ID === 1 ? (
                        <CheckIcon sx={{ color: "#2e7d32" }} />
                      ) : (
                        <ClearIcon sx={{ color: "#a00000" }} />
                      )}
                    </span>
                  </td>

                  <td className="table__td">
                    <span className="table__mobile-caption">Chỉnh sửa</span>
                    <span className="table__value">
                      <IconButton
                        color="primary"
                        aria-label="chinh sua"
                        onClick={() => setEditItem(item)}
                      >
                        <EditIcon />
                      </IconButton>
                    </span>
                  </td>
                </tr>
              ))
          : null}
      </Wrapper>
    );
  };

  return (
    <div>
      <Header />
      <Grid container>
        <Grid item xs={12} sm={12} md={2}>
          <SideBar location="/user-management" />
        </Grid>
        <Grid item xs={12} sm={12} md={10}>
          <MainContent>
            <Box>
              <MainContentHeader
                of="thông tin nhân viên"
                addOn={true}
                delOn={true}
                isRefreshDisabled={isLoading}
                isDeleteDisabled={selectedList.length > 0 ? false : true}
                handleRefreshClicked={onHandleRefreshClicked}
                handleDeleteClicked={onHandleDeleteClicked}
                handleAddClicked={onHandleAddClicked}
                catchTerm={(term) => setSearchTerm(term)}
              />
              {isLoading ? (
                <Box sx={{ textAlign: "center" }}>
                  <CircularProgress sx={{ color: "white", margin: "1rem" }} />
                </Box>
              ) : (
                <div className="content_body">
                  <Table
                    headers={renderHeaders()}
                    body={renderBody(usersOnCurrentPage)}
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
          </MainContent>
        </Grid>
      </Grid>
      {serverStatus && (
        <Dialog
          open={serverDialog}
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
        open={openAddDialog}
        fullWidth={true}
        maxWidth="sm"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <form className="dialog-content">
          <div className="dialog-title">
            {editItem ? "Chỉnh sửa thông tin" : "Thêm nhân viên"}
          </div>
          <div className="form-edit-add">
            <Grid container rowSpacing={2}>
              <Grid container item columnSpacing={2}>
                <Grid item xs={12} sm={4} md={4} alignSelf="center">
                  <label className="form-edit-add__label">Tên người dùng</label>
                </Grid>
                <Grid item xs={12} sm={8} md={8}>
                  <TextField
                    fullWidth
                    id="fullname"
                    label="Bắt buộc *"
                    variant="filled"
                    name="fullName"
                    value={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.values.fullName === ""}
                  />
                </Grid>
              </Grid>
              <Grid container item columnSpacing={2}>
                <Grid item xs={12} sm={4} md={4} alignSelf="center">
                  <label className="form-edit-add__label">Tên đăng nhập</label>
                </Grid>
                <Grid item xs={12} sm={8} md={8}>
                  <TextField
                    fullWidth
                    id="userName"
                    label="Bắt buộc *"
                    variant="filled"
                    name="userName"
                    value={formik.values.userName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.values.userName === ""}
                  />
                </Grid>
              </Grid>

              <Grid container item columnSpacing={2}>
                <Grid item xs={12} sm={4} md={4} alignSelf="center">
                  <label className="form-edit-add__label">Mật khẩu</label>
                </Grid>
                <Grid item xs={12} sm={8} md={8}>
                  <TextField
                    fullWidth
                    id="password"
                    label="Bắt buộc *"
                    variant="filled"
                    name="password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.values.password === "" ||
                      formik.values.password !== formik.values.repassword
                    }
                    helperText={
                      formik.values.password !== formik.values.repassword
                        ? "Mật khẩu không khớp"
                        : ""
                    }
                  />
                </Grid>
              </Grid>
              <Grid container item columnSpacing={2}>
                <Grid item xs={12} sm={4} md={4} alignSelf="center">
                  <label className="form-edit-add__label">
                    Xác nhận Mật khẩu
                  </label>
                </Grid>
                <Grid item xs={12} sm={8} md={8}>
                  <TextField
                    fullWidth
                    id="repassword"
                    label="Bắt buộc *"
                    variant="filled"
                    name="repassword"
                    type="password"
                    value={formik.values.repassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.values.password === "" ||
                      formik.values.password !== formik.values.repassword
                    }
                    helperText={
                      formik.values.password !== formik.values.repassword
                        ? "Mật khẩu không khớp"
                        : ""
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          </div>
          <div className="form-edit-add__cta">
            <Grid container direction="row" alignItems="center">
              <Grid
                item
                container
                xs={6}
                sm={6}
                md={6}
                direction="column"
                alignItems="center"
              >
                <Grid item>
                  <button
                    onClick={() => formik.handleSubmit(formik.values)}
                    className="btn btn-safe"
                    type="submit"
                    disabled={
                      formik.values.fullName === "" ||
                      formik.values.userName === "" ||
                      formik.values.password === "" ||
                      formik.values.repassword === "" ||
                      formik.values.repassword !== formik.values.password
                    }
                  >
                    Xác nhận
                  </button>
                </Grid>
              </Grid>
              <Grid
                item
                container
                xs={6}
                sm={6}
                md={6}
                direction="column"
                alignItems="center"
              >
                <Grid item>
                  <button
                    onClick={handleCloseAddEditDialog}
                    className="btn btn-danger"
                  >
                    Hủy bỏ
                  </button>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </form>
      </Dialog>

      {/* EDIT */}
      <Dialog
        open={isEditing}
        fullWidth={true}
        maxWidth="sm"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="dialog-content">
          <div className="dialog-title edit">Chỉnh sửa thông tin</div>
          <form className="form-edit-add">
            <Grid container rowSpacing={2}>
              <Grid container item columnSpacing={2}>
                <Grid item xs={12} sm={4} md={4} alignSelf="center">
                  <label className="form-edit-add__label">Tên người dùng</label>
                </Grid>
                <Grid item xs={12} sm={8} md={8}>
                  <TextField
                    fullWidth
                    id="fullName"
                    label="Bắt buộc *"
                    variant="filled"
                    name="fullName"
                    defaultValue={formik.values.fullName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Grid>
              </Grid>
              <Grid container item columnSpacing={2}>
                <Grid item xs={12} sm={4} md={4} alignSelf="center">
                  <label className="form-edit-add__label">Tên đăng nhập</label>
                </Grid>
                <Grid item xs={12} sm={8} md={8}>
                  <TextField
                    fullWidth
                    id="userName"
                    label="Bắt buộc *"
                    variant="filled"
                    name="userName"
                    defaultValue={formik.values.userName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Grid>
              </Grid>

              <Grid container item columnSpacing={2}>
                <Grid item xs={12} sm={4} md={4} alignSelf="center">
                  <label className="form-edit-add__label">Mật khẩu</label>
                </Grid>
                <Grid item xs={12} sm={8} md={8}>
                  <TextField
                    fullWidth
                    id="password"
                    label="Bắt buộc *"
                    variant="filled"
                    name="password"
                    defaultValue={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Grid>
              </Grid>
            </Grid>
          </form>
          <div className="form-edit-add__cta edit">
            <Grid container direction="row" alignItems="center">
              <Grid
                item
                container
                xs={6}
                sm={6}
                md={6}
                direction="column"
                alignItems="center"
              >
                <Grid item>
                  <button
                    onClick={() => formik.handleSubmit(formik.values)}
                    className="btn btn-safe"
                  >
                    Xác nhận
                  </button>
                </Grid>
              </Grid>
              <Grid
                item
                container
                xs={6}
                sm={6}
                md={6}
                direction="column"
                alignItems="center"
              >
                <Grid item>
                  <button
                    onClick={handleCloseAddEditDialog}
                    className="btn btn-danger"
                  >
                    Hủy bỏ
                  </button>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </div>
      </Dialog>

      {/* Detail */}
      <Dialog
        open={showItem}
        onClose={() => {
          setShowItem(null);
        }}
        fullWidth={true}
        maxWidth="sm"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="dialog-content">
          <div className="dialog-title detail">Thông tin chi tiết</div>
          <form className="form-edit-add">
            <Grid container rowSpacing={2}>
              <Grid container item columnSpacing={2}>
                <Grid item xs={12} sm={4} md={4} alignSelf="center">
                  <label className="form-edit-add__label">Tên người dùng</label>
                </Grid>
                <Grid item xs={12} sm={8} md={8}>
                  <TextField
                    fullWidth
                    disabled
                    variant="standard"
                    defaultValue={showItem ? showItem.Name : ""}
                  />
                </Grid>
              </Grid>
              <Grid container item columnSpacing={2}>
                <Grid item xs={12} sm={4} md={4} alignSelf="center">
                  <label className="form-edit-add__label">Tên đăng nhập</label>
                </Grid>
                <Grid item xs={12} sm={8} md={8}>
                  <TextField
                    fullWidth
                    variant="standard"
                    disabled
                    defaultValue={showItem ? showItem.Username : ""}
                  />
                </Grid>
              </Grid>

              <Grid container item columnSpacing={2}>
                <Grid item xs={12} sm={4} md={4} alignSelf="center">
                  <label className="form-edit-add__label">Vai trò</label>
                </Grid>
                <Grid item xs={12} sm={8} md={8}>
                  <TextField
                    fullWidth
                    variant="standard"
                    disabled
                    defaultValue={
                      showItem && showItem.Role
                        ? getRoleText(showItem.Role.ID)
                        : "[Lỗi hệ thống]"
                    }
                  />
                </Grid>
              </Grid>

              <Grid container item columnSpacing={2}>
                <Grid item xs={12} sm={4} md={4} alignSelf="center">
                  <label className="form-edit-add__label">Mật khẩu</label>
                </Grid>
                <Grid item xs={12} sm={8} md={8}>
                  <TextField
                    fullWidth
                    variant="standard"
                    disabled
                    defaultValue={
                      showItem && showItem.Password
                        ? showItem.Password
                        : "[Hệ thống: Bạn không có quyền xem]"
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          </form>
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
                    onClick={handleCloseDetailDialog}
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
    </div>
  );
};

export default UserManagement;
