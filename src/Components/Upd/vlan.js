import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "react-apollo";
import {
  TextField,
  Button,
  Typography,
  makeStyles,
  Grid,
  FormControl,
  Box,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

import { getPcs } from "../../ExQueries/Queries";
import Skeleton from "../Skeleton";

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

const UPDATE_VLAN_MUTA = gql`
  mutation updateVlan($pcId: ID!, $vlan: String!) {
    updateVlan(pcId: $pcId, vlan: $vlan) {
      id
      vlan
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  errWidth: "100%",
  "& > * + *": {
    marginTop: theme.spacing(2),
  },
}));

function UpdVlan({ pcId }) {
  const classes = useStyles();
  const [errors, setErrors] = useState({});

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const { data, loading, error } = useQuery(getPc, {
    variables: {
      pcId,
    },
  });
  const [updateVlan] = useMutation(UPDATE_VLAN_MUTA, {
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
            This PC <b>don't contain vlan field</b> Or Can't Connect to
            database, Please Contact<b> Administartor</b>
          </p>
        </Alert>
      </div>
    );

  if (loading) return <Skeleton />;
  return (
    <React.Fragment key={data.getPc.id}>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Edit Vlan
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Update PC Vlan"}</DialogTitle>
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
              <Typography>Vlan : {data.getPc.vlan}</Typography>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  updateVlan(
                    {
                      variables: { pcId, vlan: input.value },
                      refetchQueries: [{ query: getPcs }],
                    }
                    /*   props.history.push("/list") */
                  );

                  input.value = "";
                }}
              >
                <FormControl>
                  <TextField
                    required
                    label="VLAN . . ."
                    defaultValue={""}
                    inputRef={(node) => {
                      input = node;
                    }}
                    error={errors.name ? true : false}
                  />
                  <Button type="submit">Update vlan</Button>
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
export default UpdVlan;
