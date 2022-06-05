import { useNavigate } from "react-router-dom";
import React from "react";

const Header = () => {
  let navigate = useNavigate();
  const onLogOut = () => {
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    console.log("local: ", localStorage);
    console.log("logut, navigate: login");
    navigate("/login");
  };
  return (
    <div>
      <button onClick={onLogOut}>Đăng xuất</button>
    </div>
  );
};

export default Header;
