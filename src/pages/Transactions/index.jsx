import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import TodayIcon from "@mui/icons-material/Today";
import Header from "../../components/Header";
import MainContent from "../../components/MainContent";
import MainContentHeader from "../../components/MainContent/MainContentHeader";
import SideBar from "../../components/Sidebar";
import Wrapper from "../../utils/Wrapper";
import "./transactions.css";
const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedList, setSelectedList] = useState([]);

  const onHandleRefreshClicked = () => {};
  const onHandleDeleteClicked = () => {};
  const onHandleAddClicked = () => {};

  const title_cell_width = 5;

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
            <tr className="history-table__row">
              <td className="td-key">
                <span className="history-table__mobile-title">Thời gian</span>
                <span className="history-table__value bold-value">21:30</span>
              </td>
              <td className="td-item">
                <span className="history-table__mobile-title">Mã hóa đơn</span>
                <span className="history-table__value">213</span>
              </td>
              <td className="td-item">
                <span className="history-table__mobile-title">
                  Tổng hóa đơn
                </span>
                <span className="history-table__value">213.000</span>
              </td>
              <td className="td-item">
                <span className="history-table__mobile-title">
                  Mã nhân viên
                </span>
                <span className="history-table__value bold-value">ABCXYZ</span>
              </td>
              <td className="td-item">
                <span className="history-table__mobile-title">Trạng thái</span>
                <span className="history-table__value">Chờ kiểm tra</span>
              </td>
            </tr>

            <tr className="history-table__row">
              <td className="td-key">
                <span className="history-table__mobile-title">Thời gian</span>
                <span className="history-table__value">21:30</span>
              </td>
              <td className="td-item">
                <span className="history-table__mobile-title">Mã hóa đơn</span>
                <span className="history-table__value">213</span>
              </td>
              <td className="td-item">
                <span className="history-table__mobile-title">
                  Tổng hóa đơn
                </span>
                <span className="history-table__value">213.000</span>
              </td>
              <td className="td-item">
                <span className="history-table__mobile-title">
                  Mã nhân viên
                </span>
                <span className="history-table__value">ABCXYZ</span>
              </td>
              <td className="td-item">
                <span className="history-table__mobile-title">Trạng thái</span>
                <span className="history-table__value">Chờ kiểm tra</span>
              </td>
            </tr>
            <tr className="history-table__row">
              <td className="td-key">
                <span className="history-table__mobile-title">Thời gian</span>
                <span className="history-table__value">21:30</span>
              </td>
              <td className="td-item">
                <span className="history-table__mobile-title">Mã hóa đơn</span>
                <span className="history-table__value">213</span>
              </td>
              <td className="td-item">
                <span className="history-table__mobile-title">
                  Tổng hóa đơn
                </span>
                <span className="history-table__value">213.000</span>
              </td>
              <td className="td-item">
                <span className="history-table__mobile-title">
                  Mã nhân viên
                </span>
                <span className="history-table__value">ABCXYZ</span>
              </td>
              <td className="td-item">
                <span className="history-table__mobile-title">Trạng thái</span>
                <span className="history-table__value">Chờ kiểm tra</span>
              </td>
            </tr>
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
    </div>
  );
};

export default Transactions;
