import React from "react";
import Grid from "@mui/material/Grid";
import "./card.css";
const Card = (props) => {
  return (
    <div
      onClick={() => props.onNavigate(props.endpoint)}
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
          sm={4}
          md={2}
          container
          justify="center"
          justifyContent="center"
        >
          <p className="card__name icon" style={{ margin: "auto auto" }}>
            {props.icon}
          </p>
        </Grid>
        <Grid item xs={9} sm={6} md={9} container justifyContent="center">
          <p className="card__name">{props.children.replace("-", " ")}</p>
        </Grid>
      </Grid>
    </div>
  );
};

export default Card;
