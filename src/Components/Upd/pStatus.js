import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/react-hooks";
/* import { useQuery, useMutation } from "react-apollo";
 */ import {
  Button,
  Typography,
  makeStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  TextField,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

import { getPosi, getposition } from "../../ExQueries/Queries";
import Skeleton from "../Skeleton";
import ShowPosi from "../../pages/showPosis";
import { useHistory } from "react-router-dom";
import Store from "../Upd/store";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const UPDATE_STATUS_POSI = gql`
  mutation updatePosiStatus(
    $posiId: ID!
    $status: String!
    $positionName: String!
  ) {
    updatePosiStatus(
      posiId: $posiId
      status: $status
      positionName: $positionName
    ) {
      id
      status
    }
  }
`;
const getPcs = gql`
  {
    getPcs {
      positionName
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
  const [p_name, setPname] = React.useState("");
  const onChange = (e) => {
    setStatus(e.target.value);

    /* setStatus(e.target.value); */
  };
  const onChanges = (e) => {
    setPname(e.target.value);

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
  const { data, loading, error } = useQuery(getPcs);
  const { data: posi_data, loading: posi_load, error: posi_err } = useQuery(
    getPosi,
    {
      variables: {
        posiId,
      },
    }
  );
  const [updatePosiStatus] = useMutation(UPDATE_STATUS_POSI, {
    update(proxy, result) {
      console.log(result);
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
  });
  if (posi_err)
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

  if (posi_load) return <Skeleton />;
  return (
    <React.Fragment key={posi_data.getPosi.id}>
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
            <Store />
            <Typography>Status : {posi_data.getPosi.status}</Typography>
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
                    variables: {
                      posiId,
                      status: p_status,
                      positionName: p_name,
                    },
                    refetchQueries: [{ query: getposition }],
                  });
                }}
              >
                <FormControl required>
                  <FormControl>
                    <InputLabel id="select">Status</InputLabel>
                    <Select
                      labelId="simple-select"
                      id="simple-select"
                      onChange={onChange}
                      type="text"
                      name="Status"
                      placeholder="Status"
                      required
                      value={p_status}
                      error={errors.status ? true : false}
                      /*                       error={errors.status ? true : false} */
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
                      <MenuItem value="Expired">
                        <em>Expired</em>
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <Typography>
                      Type the <strong>{posi_data.getPosi.name}</strong> in the
                      below
                    </Typography>
                    <TextField
                      required
                      id="standard-required"
                      label={`Enter the ${posi_data.getPosi.name}`}
                      placeholder="Position Name"
                      name="Position Name"
                      value={p_name}
                      onChange={onChanges}
                    />
                  </FormControl>
                  <Button type="submit">Update Status</Button>
                </FormControl>
              </form>
              {Object.keys(errors).length > 0 && (
                <Alert severity="error">
                  <AlertTitle>Error</AlertTitle>
                  <div>
                    {Object.values(errors).map((value) => (
                      <Box display="flex" justifyContent="flex-start">
                        <Box>
                          <li key={value}>{value}</li>
                        </Box>
                      </Box>
                    ))}
                  </div>
                </Alert>
              )}
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
