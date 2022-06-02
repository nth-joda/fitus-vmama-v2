import React from "react";
import { useNavigate } from "react-router-dom";
const Login = (props) => {
  let navigate = useNavigate();
  const onSubmit = () => {
    localStorage.setItem("token", true);
    if (props.from) navigate(props.from);
    else navigate("/vouchers");
  };
  return (
    <div>
      <button onClick={onSubmit}>Đăng nhập</button>
    </div>
  );
};

export default Login;
