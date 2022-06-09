import React from "react";
import "./addProduct.css";
const AddProduct = (props) => {
  return (
    <div className="addProduct">
      <div className="addProduct__address">
        <i className="bx bx-package addProduct__address-icon"></i>
        {props.editItem
          ? "Product > Chỉnh sửa product"
          : "Product > Thêm product"}
      </div>
      <div className="addProduct__formContainer">
        {props.editItem ? props.editItem.ID : null}sadsad
      </div>
    </div>
  );
};

export default AddProduct;
