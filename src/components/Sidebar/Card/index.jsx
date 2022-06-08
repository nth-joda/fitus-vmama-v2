import React from "react";
import Grid from "@mui/material/Grid";
import "./card.css";
const Card = (props) => {
  return (
    <div
      onClick={() => props.onNavigate(props.children)}
      className={props.isActive ? "card card_active" : "card"}
    >
      <Grid
        container
        columnSpacing={0}
        justify="center"
        justifyContent="center"
      >
        <Grid
          item
          xs={3}
          sm={3}
          md={2}
          container
          justify="center"
          justifyContent="center"
        >
          <p className="card__name icon">{props.icon}</p>
        </Grid>
        <Grid item xs={9} sm={9} md={9} container justifyContent="center">
          <p className="card__name">{props.children}</p>
        </Grid>
      </Grid>
    </div>
  );
};

export default Card;
