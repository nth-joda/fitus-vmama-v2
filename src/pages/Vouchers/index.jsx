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
  const [openAfterDelete, setOpenAfterDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
        <th className="table__th">ID</th>
        <th className="table__th">Tên voucher</th>
        <th className="table__th">Miêu tả</th>
        <th className="table__th">Còn lại</th>
        <th className="table__th">Đã đổi</th>
        <th className="table__th">Chỉnh sửa</th>
      </Wrapper>
    );
  };

  const renderBody = (prods) => {
    return (
      <Wrapper>
        {prods
          .filter((val) => {
            if (searchTerm === "") {
              return val;
            } else if (
              val.Name.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
              return val;
            }
            return false;
          })
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
                      color: { xs: "white", sm: "black", md: "black" },
                      "&.Mui-checked": {
                        color: { xs: "white", sm: "black", md: "black" },
                      },
                    }}
                    checked={
                      selectedList.filter((fitem, fid) => fitem.ID === item.ID)
                        .length > 0
                    }
                    onChange={(e) => onHandleCheck(item, e.target.checked)}
                  />
                </span>
                <span className="table__mobile-name">{item.Name}</span>
              </td>
              <td className="table__td">
                <span className="table__mobile-caption">ID</span>
                <span className="table__value">{item.ID}</span>
              </td>
              <td className="table__td">
                <span className="table__mobile-caption">Tên voucher</span>
                <span className="table__value">{item.Name}</span>
              </td>

              <td className="table__td">
                <span className="table__mobile-caption">Miêu tả</span>
                <span className="table__value">{item.Description}</span>
              </td>

              <td className="table__td">
                <span className="table__mobile-caption">Còn lại</span>
                <span className="table__value">{item.Remaining}</span>
              </td>

              <td className="table__td">
                <span className="table__mobile-caption">Đã đổi</span>
                <span className="table__value">{item.Total}</span>
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
    if (err.status === 401)
      setServerStatus({
        code: err.status,
        msg: err.message,
        hint: "Đăng nhập lại",
      });
    else setServerStatus({ code: err.status, msg: err.message, hint: "" });
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
      axios
        .get(
          SERVER_API.BASE_URL + SERVER_API.GETVOUCHERS_ENDPOINT + pageNum,
          config
        )
        .then((res) => {
          catchData(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err);
          if (err.response.data.status === 404 && currentPage > 1) {
            console.log("asdfasdasd", currentPage);
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

  const onHandleCancel = () => {
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
  };

  const onHandleAfterAddOrEditingMode = () => {
    setAddOrEditMode(false);
    loadData(currentPage);
  };
  const handleAgree = () => {
    if (serverStatus.code === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      navigate("/login");
    } else setOpenDialog(false);
  };

  const confirmedDelete = () => {
    for (
      let remainingItemsDel = selectedList.length;
      remainingItemsDel > 0;
      remainingItemsDel--
    ) {
      setDeleting(true);
      const deletingID = selectedList[remainingItemsDel - 1].ID;
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
              setSelectedList([
                ...selectedList.filter((fit, fid) => fit.ID !== deletingID),
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
          <SideBar location="/vouchers" />
        </Grid>
        <Grid item xs={12} sm={12} md={10}>
          <MainContent of="vouchers">
            {!addOrEditMode ? (
              <Box>
                <MainContentHeader
                  of="vouchers"
                  catchTerm={(term) => setSearchTerm(term)}
                  isRefreshDisabled={isLoading}
                  isDeleteDisabled={selectedList.length > 0 ? false : true}
                  handleRefreshClicked={onHandleRefreshClicked}
                  handleDeleteClicked={onHandleDeleteClicked}
                  handleAddClicked={onHandleAddClicked}
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
                afterAddOrEditingMode={onHandleAfterAddOrEditingMode}
              />
            )}
          </MainContent>
        </Grid>
      </Grid>
      {serverStatus && (
        <Dialog
          open={openDialog}
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
        open={openConfirmDel && selectedList.length > 0}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="lg"
      >
        <DialogTitle id="alert-dialog-title">
          Xóa {selectedList.length} vouchers sau khỏi hệ thống?
        </DialogTitle>
        <DialogContent>
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
                <span className="table__title">Còn lại / Đã đổi</span>
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
                {openAfterDelete ? "Xác nhận" : "Hủy bỏ"}
              </Button>

              {!openAfterDelete && (
                <Button color="error" onClick={confirmedDelete}>
                  Xác nhận xóa
                </Button>
              )}
            </Wrapper>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Vouchers;
