import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "react-apollo";
import {
  TextField,
  Button,
  Typography,
  Breadcrumbs,
  makeStyles,
  Grid,
  Link as PLink,
  FormControl,
  Box,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";

import { useHistory } from "react-router-dom";

import { getPosi, getposition } from "../../ExQueries/Queries";
import CircularProgress from "@material-ui/core/CircularProgress";

import EditIcon from "@material-ui/icons/Edit";

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
      posiId
    }
  }
`;

const UPDATE_FLOOR_MUTA = gql`
  mutation updatePosiFloor($posiId: ID!, $floor: String!) {
    updatePosiFloor(posiId: $posiId, floor: $floor) {
      id
      floor
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  errWidth: "100%",
  "& > * + *": {
    marginTop: theme.spacing(2),
  },
}));

function FloorUpd({ posiId }) {
  const classes = useStyles();
  const [state, setState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  const [errors, setErrors] = useState({});

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
  const [updatePosiFloor] = useMutation(UPDATE_FLOOR_MUTA, {
    update(proxy, result) {
      console.log(result);
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
  });
  let input;
  if (error)
    return (
      <div className={classes.errWidth}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          <p>
            Can't Connect to database, Please Contact<b> Administartor</b>
          </p>
        </Alert>
      </div>
    );

  if (loading) return <CircularProgress color="secondary" />;
  return (
    <React.Fragment key={data.getPosi.id}>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
        startIcon={<EditIcon />}
      >
        Floor
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Update Position Floor"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
              align="center"
            >
              <Typography>Floor : {data.getPosi.floor}</Typography>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updatePosiFloor({
                    variables: { posiId, floor: input.value },
                    refetchQueries: [{ query: getposition }],
                  });

                  input.value = "";
                }}
              >
                <FormControl>
                  <TextField
                    required
                    label="Floor . . ."
                    defaultValue={""}
                    inputRef={(node) => {
                      input = node;
                    }}
                    error={errors.floor ? true : false}
                  />
                  <Button type="submit">Update Floor</Button>
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
export default FloorUpd;
