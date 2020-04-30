import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "react-apollo";
import {
  Button,
  Typography,
  makeStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

import { getPcs } from "../../ExQueries/Queries";
import Skeleton from "../Skeleton";
import ShowPosi from "../../pages/showPosis";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const getPc = gql`
  query($pcId: ID!) {
    getPc(pcId: $pcId) {
      id
      name
      sertag
      assettag
      vlan
      ip
      createdAt
      status
      positionName
      positionFloor
    }
  }
`;

const UPDATE_STATUS_NAME = gql`
  mutation updateStatus($pcId: ID!, $status: String!) {
    updateStatus(pcId: $pcId, status: $status) {
      id
      status
    }
  }
`;
const getposition = gql`
  {
    getPosis {
      id
      name
      floor
    }
  }
`;
const useStyles = makeStyles((theme) => ({
  errWidth: "100%",
  "& > * + *": {
    marginTop: theme.spacing(2),
  },
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

function UpdStatus({ pcId }) {
  const classes = useStyles();
  const [errors, setErrors] = useState({});
  const [p_status, setStatus] = React.useState("");
  const onChange = (e) => {
    setStatus(e.target.value);
    /* setStatus(e.target.value); */
  };
  const { data: pc_data, loading, error } = useQuery(getPc, {
    variables: {
      pcId,
    },
  });
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [updateStatus] = useMutation(UPDATE_STATUS_NAME, {
    update(proxy, result) {
      console.log(result);
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
  });
  const onSubmit = (e) => {
    e.preventDefault();
    updateStatus();
  };
  if (error)
    return (
      <div className={classes.errWidth}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          <p>
            This PC <b>don't contain Position field</b> Or Can't Connect to
            database, Please Contact<b> Administartor</b>
          </p>
        </Alert>
      </div>
    );

  if (loading) return <Skeleton />;
  return (
    <React.Fragment key={pc_data.getPc.id}>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Status
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Update Status"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography></Typography>
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
              align="center"
            >
              <form
                className={classes.root}
                onSubmit={(e) => {
                  e.preventDefault();
                  updateStatus({
                    variables: { pcId, status: p_status },
                    refetchQueries: [{ query: getPcs }],
                  });
                }}
              >
                <FormControl required>
                  <InputLabel id="select">Status</InputLabel>
                  <Select
                    labelId="simple-select"
                    id="simple-select"
                    value={p_status}
                    onChange={onChange}
                    type="text"
                    name="Status"
                    placeholder="Status"
                    required
                  >
                    <MenuItem value={""} disabled>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="Active">
                      <em>Active</em>
                    </MenuItem>
                    <MenuItem value="Expired">
                      <em>Expired</em>
                    </MenuItem>
                    <MenuItem value="Scrap">
                      <em>Scrap</em>
                    </MenuItem>
                  </Select>
                  <Button type="submit">Update Status</Button>
                </FormControl>
              </form>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
export default UpdStatus;
