import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import TodayIcon from "@mui/icons-material/Today";
import Dialog from "@mui/material/Dialog";
import useMediaQuery from "@mui/material/useMediaQuery";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Header from "../../components/Header";
import MainContent from "../../components/MainContent";
import MainContentHeader from "../../components/MainContent/MainContentHeader";
import SideBar from "../../components/Sidebar";
import Wrapper from "../../utils/Wrapper";
import "./transactions.css";
import TransactionList from "../../assets/MOCK_DATA.json";

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedList, setSelectedList] = useState([]);
  const [showItem, setShowItem] = useState(null);
  const theme = useTheme();
  const [imgOnShow, setImgOnShow] = useState(null);
  const handleImgChange = (event, newValue) => {
    setImgOnShow(newValue);
  };

  const onHandleRefreshClicked = () => {};
  const onHandleDeleteClicked = () => {};
  const onHandleAddClicked = () => {};

  const doCheckBtn = (checkItem) => {
    return (
      <button
        className="btn btn-orange"
        onClick={() => alert("TODO Kiểm traing : " + checkItem.staffAccount)}
      >
        kiểm tra
      </button>
    );
  };

  const historyTable = () => {
    return (
      <Wrapper>
        <div className="history-table__date">
          <Grid container>
            <Grid item xs={2} sm={2} md={0.5}>
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
                    <td className="td-key" onClick={() => setShowItem(item)}>
                      <span className="history-table__mobile-title">
                        Thời gian
                      </span>
                      <span className="history-table__value bold-value">
                        9:20
                      </span>
                    </td>
                    <td className="td-item">
                      <span className="history-table__mobile-title">
                        Mã hóa đơn
                      </span>
                      <span className="history-table__value">
                        {item.billNum}
                      </span>
                    </td>
                    <td className="td-item">
                      <span className="history-table__mobile-title">
                        Tổng hóa đơn
                      </span>
                      <span className="history-table__value">
                        {item.totalMoney}
                      </span>
                    </td>
                    <td className="td-item">
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
                      <span className="history-table__value">
                        {item.status == null && doCheckBtn(item)}
                        {item.status === true && (
                          <span className="approved">Hợp lệ</span>
                        )}
                        {item.status === false && (
                          <span className="rejected">Không hợp lệ</span>
                        )}
                      </span>
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
          <div className="dialog-title detail">Thông tin cho tiết</div>
          <Grid container>
            <Grid container item xs={12} sm={12} md={6} rowSpacing={1.2}>
              <Grid item xs={12} sm={4} md={4} alignSelf="center">
                <label className="form-edit-add__label">Thời gian</label>
              </Grid>
              <Grid item xs={12} sm={8} md={8}>
                <TextField
                  fullWidth
                  disabled
                  variant="standard"
                  defaultValue="27/07/2000 9:20"
                />
              </Grid>

              <Grid item xs={12} sm={4} md={4} alignSelf="center">
                <label className="form-edit-add__label">Mã hóa đơn</label>
              </Grid>
              <Grid item xs={12} sm={8} md={8}>
                <TextField
                  fullWidth
                  disabled
                  variant="standard"
                  defaultValue={showItem ? showItem.billNum : ""}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={4} alignSelf="center">
                <label className="form-edit-add__label">Tổng hóa đơn</label>
              </Grid>
              <Grid item xs={12} sm={8} md={8}>
                <TextField
                  fullWidth
                  disabled
                  variant="standard"
                  defaultValue={showItem ? showItem.totalMoney : ""}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={4} alignSelf="center">
                <label className="form-edit-add__label">Mã nhân viên</label>
              </Grid>
              <Grid item xs={12} sm={8} md={8}>
                <TextField
                  fullWidth
                  disabled
                  variant="standard"
                  defaultValue={showItem ? showItem.staffAccount : ""}
                />
              </Grid>

              <Grid item xs={12} sm={4} md={4} alignSelf="center">
                <label className="form-edit-add__label">Trạng thái</label>
              </Grid>
              <Grid item xs={12} sm={8} md={8}>
                <TextField
                  fullWidth
                  disabled
                  variant="standard"
                  defaultValue={"Todo: làm sau"}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} alignSelf="center">
                <label className="form-edit-add__label">
                  Danh sách sách sản phẩm
                </label>
              </Grid>
              <Grid
                container
                item
                xs={12}
                sm={12}
                md={12}
                rowSpacing={1.5}
                alignSelf="center"
              >
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

            <Grid container item xs={12} sm={12} md={6} rowSpacing={2}>
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
                        return <Tab value={im.uri} label={"Ảnh " + (id + 1)} />;
                      })
                    : null}
                </Tabs>
              </Grid>
              <Grid item xs={12} sm={12} md={12}>
                <img alt="" src={imgOnShow} className="image-scaned" />
              </Grid>
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
                    onClick={() => setShowItem(null)}
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

export default Transactions;
