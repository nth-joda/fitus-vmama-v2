import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import "./addVoucher.css";
import Step1 from "./Step1";
import Step2 from "./Step2";
import SERVER_API from "../../../objects/ServerApi";
import Wrapper from "../../../utils/Wrapper";
import ServerResponse from "../../../objects/ServerResponse";
const AddVoucher = (props) => {
  let navigate = useNavigate();
  const [step1_info, setStep1_info] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [item, setItem] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [serverStatus, setServerStatus] = useState(null);
  const handleNextStep = (s1) => {
    setStep1_info(s1);
    setCurrentStep(2);
  };

  const catchData = (res) => {
    res = ServerResponse(res);
    setItem(res.data.voucher);
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

  useEffect(() => {
    if (props.editItem > 0) {
      const local_token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: "Bearer " + local_token,
          "Content-Type": "application/json",
        },
      };
      setIsLoading(true);
      axios
        .get(
          SERVER_API.BASE_URL + SERVER_API.GET_VOUCHER_BY_ID + props.editItem,
          config
        )
        .then((res) => {
          catchData(res);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          catchError(err);
        });
    }
  }, []);
  const onHandleBackFrom2 = () => {
    setCurrentStep(1);
  };

  const onHandleBackFrom1 = () => {
    props.handleCancel();
  };

  const onHandleDone = (isCont) => {
    props.afterAddOrEditingMode(isCont);
    setCurrentStep(1);
  };

  const handleAgree = () => {
    if (serverStatus.code === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      navigate("/login");
    } else setOpenDialog(false);
  };

  return (
    <div className="addVoucher">
      <div className="addVoucher__address">
        <i className="bx bxs-discount addVoucher__address-icon"></i>
        {props.editItem > 0
          ? "Vouchers > Chỉnh sửa voucher"
          : "Vouchers > Thêm voucher"}
      </div>
      <div className="addVoucher__formContainer">
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Wrapper>
            {currentStep === 1 && (
              <Step1
                item={item}
                catchStep1={(s1) => handleNextStep(s1)}
                handleBackFrom1={onHandleBackFrom1}
              />
            )}
            {currentStep === 2 && (
              <Step2
                item={item}
                step1Info={step1_info}
                handleBackFrom2={onHandleBackFrom2}
                handleDone={(isCont) => onHandleDone(isCont)}
              />
            )}
          </Wrapper>
        )}
      </div>
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

export default AddVoucher;
