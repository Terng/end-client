import React from "react";
import { Skeleton } from "@material-ui/lab";
import LinearProgress from "@material-ui/core/LinearProgress";

export default function Variants() {
  return (
    <Skeleton variant="rect" animation="wave" width={50} height={50}>
      <LinearProgress />
    </Skeleton>
  );
}
