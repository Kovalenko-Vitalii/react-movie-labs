import React from "react";
import Grid from "@mui/material/Grid";

const HomePage = (props) => {
  const { movies } = props;

  return (
    <Grid container>
      <Grid item xs={12}>
        <h1>HomePage</h1>
      </Grid>
    </Grid>
  );
};

export default HomePage;
