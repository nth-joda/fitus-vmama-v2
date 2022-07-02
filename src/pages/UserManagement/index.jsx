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
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";

import Header from "../../components/Header";
import SideBar from "../../components/Sidebar";
import MainContent from "../../components/MainContent";
import MainContentHeader from "../../components/MainContent/MainContentHeader";
import Table from "../../utils/Table";
import Wrapper from "../../utils/Wrapper";

const usersList = [
  {
    ID: 1,
    Full_Name: "Nguyễn Văn A",
    User_Name: "user1",
    Password: "nvauser1",
    Admin: false,
  },
  {
    ID: 2,
    Full_Name: "Nguyễn Văn B",
    User_Name: "user2",
    Password: "nvbuser2",
    Admin: false,
  },
  {
    ID: 3,
    Full_Name: "Nguyễn Văn C",
    User_Name: "user3",
    Password: "nvcuser3",
    Admin: true,
  },
  {
    ID: 4,
    Full_Name: "Nguyễn Văn D",
    User_Name: "user4",
    Password: "nvduser4",
    Admin: false,
  },
  {
    ID: 5,
    Full_Name: "Nguyễn Văn E",
    User_Name: "user5",
    Password: "nveuser5",
    Admin: false,
  },
];

const UserManagement = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedList, setSelectedList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [usersOnCurrentPage, setUsersOnCurrentPage] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [editItem, setEditItem] = useState(null);

  // Diaglog:
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClickOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddEditDialog = () => {
    setOpenAddDialog(false);
    setEditItem(null);
  };
  // ENd dialog

  const formik = useFormik({
    initialValues: {
      fullName: editItem ? editItem.Full_Name : "",
      userName: editItem ? editItem.User_Name : "",
      password: editItem ? editItem.Password : "",
    },

    onSubmit: (values) => {
      alert("Send Request to BE: " + JSON.stringify(values));
      handleCloseAddEditDialog();
    },
  });

  const onHandleRefreshClicked = () => {};

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
        <th className="table__th">Tên người dùng</th>
        <th className="table__th">Tên đăng nhập</th>
        <th className="table__th small">Admin</th>
        <th className="table__th">Chỉnh sửa</th>
      </Wrapper>
    );
  };
  const onHandleCheck = (it, isCheck) => {};

  const renderBody = (users) => {
    return (
      <Wrapper>
        {users
          .filter((val) => {
            if (searchTerm === "") {
              return val;
            } else if (
              val.User_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              val.Full_Name.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
              return val;
            }
            return false;
          })
          .map((item) => (
            <tr
              className={
                selectedList.filter((it, id) => it.ID === item.ID).length > 0
                  ? "table__tr table__tr-selected"
                  : "table__tr"
              }
            >
              <td className="table__td table__mobile-title">
                <span className="table__mobile-value">
                  <Checkbox
                    sx={{
                      color: { xs: "white", sm: "black", md: "black" },
                      "&.Mui-checked": {
                        color: { xs: "white", sm: "black", md: "black" },
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
                <span className="table__mobile-name">{item.Full_Name}</span>
              </td>
              <td className="table__td small">
                <span className="table__mobile-caption">ID</span>
                <span className="table__value">{item.ID}</span>
              </td>
              <td className="table__td">
                <span className="table__mobile-caption">Tên người dùng</span>
                <span>{item.Full_Name}</span>
              </td>

              <td className="table__td">
                <span className="table__mobile-caption">Tên đăng nhập</span>
                <span>{item.User_Name}</span>
              </td>

              <td className="table__td small">
                <span className="table__mobile-caption">Admin</span>
                <span>
                  {item.Admin ? (
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
                    onClick={() => {
                      setEditItem(item);
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
      <Header />
      <Grid container>
        <Grid item xs={12} sm={12} md={2}>
          <SideBar location="/user-management" />
        </Grid>
        <Grid item xs={12} sm={12} md={10}>
          <MainContent>
            <Box>
              <MainContentHeader
                of="tên người dùng"
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
                    body={renderBody(usersList)}
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
      <Dialog
        open={openAddDialog}
        fullScreen={fullScreen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <div className="dialog-content">
          <div className="dialog-title">
            {editItem ? "Chỉnh sửa thông tin" : "Thêm người dùng"}
          </div>
          <form className="form-edit-add">
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

      {/* EDIT */}
      <Dialog
        open={editItem}
        fullScreen={fullScreen}
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
    </div>
  );
};

export default UserManagement;
