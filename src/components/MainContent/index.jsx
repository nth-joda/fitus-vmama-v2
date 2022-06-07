import React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

import "./mainContent.css";
import MainContentHeader from "./MainContentHeader";

const MainContent = (props) => {
  return (
    <div className="mainContent">
      <MainContentHeader />
      <div>{props.children}</div>
      <div className="mainContent__footer">
        <Stack spacing={2}>
          <Pagination
            count={10}
            variant="outlined"
            color="secondary"
            shape="rounded"
          />
        </Stack>
      </div>
    </div>
  );
};

export default MainContent;
