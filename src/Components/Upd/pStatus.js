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

import { getPosi, getposition } from "../../ExQueries/Queries";
import Skeleton from "../Skeleton";
import ShowPosi from "../../pages/showPosis";
import { useHistory } from "react-router-dom";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const UPDATE_STATUS_POSI = gql`
  mutation updatePosiStatus($posiId: ID!, $status: String!) {
    updatePosiStatus(posiId: $posiId, status: $status) {
      id
      status
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

function UpdStatus({ posiId }) {
  const classes = useStyles();
  const [errors, setErrors] = useState({});
  const [p_status, setStatus] = React.useState("");
  const onChange = (e) => {
    setStatus(e.target.value);
    /* setStatus(e.target.value); */
  };

  const history = useHistory();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const { data, loading, error } = useQuery(getPosi, {
    variables: {
      posiId,
    },
  });

  const [updatePosiStatus] = useMutation(UPDATE_STATUS_POSI, {
    update(proxy, result) {
      console.log(result);
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
  });
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
    <React.Fragment key={data.getPosi.id}>
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
            <Typography>Status : {data.getPosi.status}</Typography>
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
                  updatePosiStatus({
                    variables: { posiId, status: p_status },
                    refetchQueries: [{ query: getposition }],
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
                    <MenuItem value="Maintenance">
                      <em>Maintenance</em>
                    </MenuItem>
                  </Select>
                  <Button type="submit">Update Position Status</Button>
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
