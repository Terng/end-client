import React from "react";
import { getPcs } from "../ExQueries/Queries";
import { useQuery } from "react-apollo";
import { Typography, Box, makeStyles } from "@material-ui/core";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

function Home() {
  const classes = useStyles;
  const { data, loading, error } = useQuery(getPcs);
  if (loading)
    return (
      <div>
        <Box display="flex" justifyContent="center">
          <Box justifyContent="center">
            <Typography variant="h1">Welcome</Typography>
            <div className={classes.root}>
              <Alert variant="outlined" severity="info">
                <div>
                  System Status : <strong>Busy!</strong>
                </div>
              </Alert>
            </div>
          </Box>
        </Box>
      </div>
    );

  if (error)
    return (
      <div>
        <Box display="flex" justifyContent="center">
          <Box justifyContent="center">
            <Typography variant="h1">Welcome</Typography>
            <div className={classes.root}>
              <Alert variant="outlined" severity="error">
                <div>
                  System Status : <strong>Offline!</strong>
                </div>
              </Alert>
            </div>
          </Box>
        </Box>
      </div>
    );

  return (
    <div key={data.getPcs.id}>
      <Box display="flex" justifyContent="center">
        <Box justifyContent="center">
          <Typography variant="h1">Welcome</Typography>
          <div className={classes.root}>
            <Alert variant="outlined" severity="success">
              <div>
                System Status : <strong>All Good!</strong>
              </div>
            </Alert>
          </div>
        </Box>
      </Box>
    </div>
  );
}

export default Home;
