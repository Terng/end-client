import React from "react";
import { Grid } from "@material-ui/core";
import PcList from "../Components/PcList";
import Activity from "../Components/activity";

function List() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={10}>
        <PcList />
      </Grid>
      <Grid item xs={2}>
        <Activity />
      </Grid>
    </Grid>
  );
}

export default List;
