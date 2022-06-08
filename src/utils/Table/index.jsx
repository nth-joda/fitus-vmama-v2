import React from "react";
import "./table.css";
const Table = (props) => {
  return (
    <div className="scrollBody">
      <table className="table">
        <thead className="table__thead">
          <tr className="table__head">{props.headers}</tr>
        </thead>

        <tbody className="table__tbody">{props.body}</tbody>
      </table>
    </div>
  );
};

export default Table;
