import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import "./addVoucher.css";
import Step1 from "./Step1";
import Step2 from "./Step2";
import SERVER_API from "../../../objects/ServerApi";
import Wrapper from "../../../utils/Wrapper";
const AddVoucher = (props) => {
  const [step1_info, setStep1_info] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [item, setItem] = useState(null);
  const handleNextStep = (s1) => {
    setStep1_info(s1);
    setCurrentStep(2);
  };

  const catchData = (res) => {
    setItem(res.data.data.voucher);
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
          console.log(res);
          catchData(res);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }
  }, []);
  const onHandleBackFrom2 = () => {
    setCurrentStep(1);
  };

  const onHandleBackFrom1 = () => {
    props.handleCancel();
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
              />
            )}
          </Wrapper>
        )}
      </div>
    </div>
  );
};

export default AddVoucher;
