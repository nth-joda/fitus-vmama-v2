import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import "./products.css";
import MainContent from "../../components/MainContent";
import Header from "../../components/Header";
import SideBar from "../../components/Sidebar";
import AddProduct from "./AddProduct";
import MainContentHeader from "../../components/MainContent/MainContentHeader";
import Table from "../../utils/Table";
import Wrapper from "../../utils/Wrapper";
import SERVER_API from "../../objects/ServerApi";
import ServerResponse from "../../objects/ServerResponse";
import { TextField } from "@mui/material";

const Products = () => {
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsOnCurrentPage, setProductsOnCurrentPage] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [addOrEditMode, setAddOrEditMode] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [serverStatus, setServerStatus] = useState(null);
  const [openConfirmDel, setOpenConfirmDel] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showItem, setShowItem] = useState(null);

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
                setSelectedList([
                  ...selectedList.concat(productsOnCurrentPage),
                ]);
              } else setSelectedList([]);
            }}
          />
          {selectedList.length > 0 ? "Chọn " + selectedList.length : null}
        </th>
        <th className="table__th small">ID</th>
        <th className="table__th">Tên Sản phẩm</th>
        <th className="table__th">Chỉnh sửa</th>
      </Wrapper>
    );
  };

  const handleShowItem = (item) => {
    setShowItem(item);
  };

  const renderBody = (prods) => {
    return (
      <Wrapper>
        {prods
          // .filter((val) => {
          //   if (searchTerm === "") {
          //     return val;
          //   } else if (
          //     val.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
          //   ) {
          //     return val;
          //   }
          //   return false;
          // })
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
                <span
                  className="table__mobile-name"
                  onClick={() => handleShowItem(item)}
                >
                  {item.ProductName}
                </span>
              </td>
              <td
                className="table__td small"
                onClick={() => handleShowItem(item)}
              >
                <span className="table__mobile-caption">ID</span>
                <span className="table__value">{item.ID}</span>
              </td>
              <td className="table__td" onClick={() => handleShowItem(item)}>
                <span className="table__mobile-caption">Tên sản phẩm</span>
                <span>{item.ProductName}</span>
              </td>

              <td className="table__td">
                <span className="table__mobile-caption">Chỉnh sửa</span>
                <span className="table__value">
                  <IconButton
                    color="primary"
                    aria-label="chinh sua"
                    onClick={() => {
                      setEditItem(item);
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
    const prods = res.data.products;
    if (meta != null) setTotalPages(meta.total_pages);
    if (prods != null) setProductsOnCurrentPage(prods);
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
            SERVER_API.BASE_URL + SERVER_API.GETPRODUCTS_ENDPOINT + pageNum,
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
            SERVER_API.BASE_URL + SERVER_API.SEARCH_PRODUCTS_NY_KW + searchTerm,
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

  const onHandleRefreshClicked = () => {
    setIsLoading(true);
    setSelectedList([]);
    loadData(currentPage);
  };

  const onHandleDeleteClicked = () => {
    setOpenConfirmDel(true);
  };
  const onHandleAddClicked = () => {
    setAddOrEditMode(true);
  };

  const onHandleCancel = () => {
    setAddOrEditMode(false);
    setEditItem(null);
  };
  const handleAgree = () => {
    if (serverStatus.code === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      navigate("/login");
    } else setOpenDialog(false);
  };

  const onHandleAddOrEditDone = () => {
    setAddOrEditMode(false);
    loadData(currentPage);
  };

  const confirmedDelete = () => {
    setDeleting(true);
    const local_token = localStorage.getItem("token");
    if (local_token !== null || local_token !== "") {
      const config = {
        headers: {
          Authorization: "Bearer " + local_token,
          "Content-Type": "application/json",
        },
      };
      const body_params = { ids: selectedList.map((item) => item.ID) };
      axios
        .post(
          SERVER_API.BASE_URL + SERVER_API.DELETE_PRODUCTS,
          body_params,
          config
        )
        .then((res) => {
          res = catchData(res);
          setDeleting(false);
          setOpenConfirmDel(false);
          setSelectedList([]);
          loadData(currentPage);
        })
        .catch((err) => {
          catchError(err);
          setDeleting(false);
          setOpenConfirmDel(false);
        });
    } else {
      localStorage.removeItem("name");
      localStorage.removeItem("token");
    }
  };
  return (
    <div>
      <Header />
      <Grid container>
        <Grid item xs={12} sm={12} md={2}>
          <SideBar location="/products" />
        </Grid>
        <Grid item xs={12} sm={12} md={10}>
          <MainContent>
            {!addOrEditMode ? (
              <Box>
                <MainContentHeader
                  of="sản phẩm"
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
                      body={renderBody(productsOnCurrentPage)}
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
              <AddProduct
                editItem={editItem}
                handleCancel={onHandleCancel}
                handleAddOrEditDone={onHandleAddOrEditDone}
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
        open={openConfirmDel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">
          Xóa {selectedList.length} sản phẩm sau khỏi hệ thống?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Grid container sx={{ background: "#3084d7", padding: "0.5rem" }}>
              <Grid item xs={3} sm={3} md={3}>
                <span className="table__title">No </span>
              </Grid>
              <Grid item xs={3} sm={3} md={3}>
                <span className="table__title">Id </span>
              </Grid>
              <Grid item xs={6} sm={6} md={6}>
                <span className="table__title">Tên sản phẩm</span>
              </Grid>
            </Grid>
            {selectedList.map((item, index) => {
              console.log(item);
              return (
                <Grid container sx={{ padding: "0.5rem" }}>
                  <Grid item xs={3} sm={3} md={3}>
                    <span>{index + 1} </span>
                  </Grid>
                  <Grid item xs={3} sm={3} md={3}>
                    <span>{item.ID} </span>
                  </Grid>
                  <Grid item xs={3} sm={3} md={3}>
                    <span>{item.ProductName}</span>
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
              <Button onClick={() => setOpenConfirmDel(false)}>Hủy bỏ</Button>
              <Button color="error" onClick={confirmedDelete}>
                Xác nhận xóa
              </Button>
            </Wrapper>
          )}
        </DialogActions>
      </Dialog>
      <Dialog
        open={showItem != null}
        onClose={() => setShowItem(null)}
        fullWidth
        maxWidth="sm"
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
                      setEditItem(showItem);
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
          <Grid container rowSpacing={8}>
            <Grid
              item
              container
              xs={12}
              sm={12}
              md={12}
              rowSpacing={1}
              columnSpacing={5}
            >
              <Grid
                item
                xs={12}
                sm={4}
                md={4}
                alignSelf="center"
                textAlign={{ md: "right", xs: "left" }}
              >
                <label className="form-edit-add__label">Tên sản phẩm</label>
              </Grid>
              <Grid item xs={12} sm={8} md={8}>
                <TextField
                  fullWidth
                  disabled
                  inputProps={{
                    min: 0,
                    style: { textAlign: "center", fontSize: "1.2rem" },
                  }}
                  variant="standard"
                  defaultValue={showItem ? showItem.ProductName : ""}
                />
              </Grid>
            </Grid>
            <Grid
              item
              container
              xs={12}
              sm={12}
              md={12}
              direction="column"
              alignContent="flex-end"
            >
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
        </div>
      </Dialog>
    </div>
  );
};

export default Products;
