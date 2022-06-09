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

const Products = () => {
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [addOrEditMode, setAddOrEditMode] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [serverStatus, setServerStatus] = useState(null);

  const onHandleCheck = (id, isCheck) => {
    if (selectedList.includes(id) && isCheck === false) {
      const newList = selectedList.filter((item) => item !== id);
      setSelectedList(newList);
    } else if (!selectedList.includes(id) && isCheck === true) {
      setSelectedList([...selectedList, id]);
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
                setSelectedList(products.map((item) => item.ID));
              } else setSelectedList([]);
            }}
          />
          {selectedList.length > 0 ? "Chọn " + selectedList.length : null}
        </th>
        <th className="table__th">ID</th>
        <th className="table__th">Tên Sản phẩm</th>
        <th className="table__th">Chỉnh sửa</th>
      </Wrapper>
    );
  };

  const renderBody = (prods) => {
    return (
      <Wrapper>
        {prods.map((item) => (
          <tr
            className={
              selectedList.includes(item.ID)
                ? "table__tr table__tr-selected"
                : "table__tr"
            }
          >
            <td className="table__td table__mobile-title">
              <span className="table__mobile-value">
                <Checkbox
                  sx={{
                    color: "black",
                    "&.Mui-checked": {
                      color: "black",
                    },
                  }}
                  checked={selectedList.includes(item.ID)}
                  onChange={(e) => onHandleCheck(item.ID, e.target.checked)}
                />
              </span>
              <span className="table__mobile-name">{item.ProductName}</span>
            </td>
            <td className="table__td">
              <span className="table__mobile-caption">ID</span>
              <span className="table__value">{item.ID}</span>
            </td>
            <td className="table__td">
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

        {/* <tr className="table__tr">
          <td className="table__td table__mobile-title">
            <span>Post production</span>
          </td>
          <td className="table__td">
            <span className="table__mobile-caption">Silver Package</span>
            <span className="table__value">2 weeks</span>
          </td>
          <td className="table__td">
            <span className="table__mobile-caption">Gold Package</span>
            <span className="table__value">3 weeks</span>
          </td>
          <td className="table__td">
            <span className="table__mobile-caption">Platinum Package</span>
            <span className="table__value">4 weeks</span>
          </td>
        </tr> */}
      </Wrapper>
    );
  };

  const catchData = (res) => {
    const meta = res.data.metadata;
    const prods = res.data.products;
    if (meta != null) setTotalPages(meta.total_pages);
    if (prods != null) setProducts(prods);
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

  const loadData = () => {
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
          SERVER_API.BASE_URL + SERVER_API.GETPRODUCTS_ENDPOINT + currentPage,
          config
        )
        .then((res) => {
          console.log(res);
          catchData(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          catchError(err);
        });
    } else {
      localStorage.removeItem("name");
      localStorage.removeItem("token");
    }
  };

  useEffect(() => {
    loadData();
  }, [currentPage]);

  const onHandleRefreshClicked = () => {
    setIsLoading(true);
    setSelectedList([]);
    loadData();
  };

  const onHandleDeleteClicked = () => {
    alert("Xoa nha?");
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
    loadData();
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
                      body={renderBody(products)}
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
    </div>
  );
};

export default Products;
