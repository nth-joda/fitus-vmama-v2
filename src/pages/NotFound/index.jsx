import React from "react";
import logo_404 from "../../assets/VMAMA logo/khue di cho 1.png";
import "./notFound.css";
import { useNavigate } from "react-router-dom";
const NotFound = () => {
  let navigate = useNavigate();
  return (
    <div>
      <div className="page404">
        <div className="page404_content">
          <p className="header_404"> 404</p>
          <p className="header_404_1">Trang không tồn tại</p>
          <div className="page404_form">
            <p>Trang bạn đang tìm kiếm hiện không khả dụng. </p>
            <p>Bạn có muốn quay lại trang chủ không?</p>
          </div>
          <button
            className="btn_404"
            onClick={() => {
              navigate("/");
            }}
          >
            {" "}
            Trang Chủ
          </button>
        </div>
        <div className="page404_logo">
          <img className="logo_404" src={logo_404} alt="logo 404" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
