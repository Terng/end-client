import React from "react";
import { Skeleton } from "@material-ui/lab";
import LinearProgress from '@material-ui/core/LinearProgress';



export default function Variants() {
  return (
    <div>
      <Skeleton variant="rect" animation="wave" height={50} >
      <LinearProgress />
      </Skeleton>
    </div>
  );
}
