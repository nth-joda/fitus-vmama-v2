import { Box } from "@mui/material";
import React from "react";

import "./mainContent.css";

const MainContent = (props) => {
  return <Box className="mainContent">{props.children}</Box>;
};

export default MainContent;
