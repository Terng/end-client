import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import {
  makeStyles,
  FormControl,
  TextField,
  Button,
  Grid,
  Box,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import { createPosi, getposition } from "../ExQueries/Queries";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Alert, AlertTitle } from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: 150,
    },
  },
}));

function Add() {
  const classes = useStyles();
  const [values, setValues] = useState({
    name: "",
    floor: "",
    status: "",
  });
  const [errors, setErrors] = useState({});

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [addPosi] = useMutation(createPosi, {
    update(proxy, result) {
      console.log(result);
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
    refetchQueries: [{ query: getposition }],
  });
  const onSubmit = (e) => {
    e.preventDefault();
    addPosi();
  };

  return (
    <React.Fragment>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Add Position
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Add New Pc"}</DialogTitle>
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
              <form className={classes.root} onSubmit={onSubmit}>
                <FormControl>
                  <TextField
                    required
                    id="standard-required"
                    label="Name"
                    placeholder="Name"
                    name="name"
                    value={values.name}
                    error={errors.name ? true : false}
                    onChange={onChange}
                  />
                </FormControl>
                <FormControl>
                  <TextField
                    required
                    id="standard-required"
                    label="Floor"
                    placeholder="Floor"
                    name="floor"
                    value={values.floor}
                    onChange={onChange}
                  />
                </FormControl>

                <FormControl>
                  <InputLabel id="select">Status</InputLabel>
                  <Select
                    labelId="simple-select"
                    id="simple-select"
                    value={values.status}
                    onChange={onChange}
                    type="text"
                    name="status"
                    placeholder="status"
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
                </FormControl>
                <FormControl>
                  <Button
                    variant="outlined"
                    color="primary"
                    type="submit"
                    value="Save"
                    size="small"
                  >
                    Add
                  </Button>
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

export default Add;
