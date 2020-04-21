import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  makeStyles,
  FormControl,
  TextField,
  InputLabel,
  MenuItem,
  Button,
  Select,
  Grid,
  Box,
} from "@material-ui/core";
import { createPc, getposition, getPcs } from "../ExQueries/Queries";
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
      width: 200,
    },
  },
}));

function Add() {
  const classes = useStyles();
  const [values, setValues] = useState({
    name: "",
    sertag: "",
    assettag: "",
    ip: "",
    vlan: "",
    posiId: "",
  });
  const [errors, setErrors] = useState({});
  const { data } = useQuery(getposition);
  const [posi, setPosi] = React.useState("");
  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    setPosi(e.target.value);
  };
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [addPc] = useMutation(createPc, {
    update(proxy, result) {
      console.log(result);
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
    refetchQueries: [{ query: getPcs }],
  });
  const onSubmit = (e) => {
    e.preventDefault();
    addPc();
  };

  return (
    <React.Fragment>
      <Button
        variant="outlined"
        color="primary"
        onClick={handleClickOpen}
        noValidate
      >
        Add PC
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
              <form className={classes.root} onSubmit={onSubmit} noValidate>
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
                    label="Asset Tag"
                    placeholder="Asset Tag"
                    name="assettag"
                    value={values.assettag}
                    error={errors.assettag ? true : false}
                    onChange={onChange}
                  />
                </FormControl>
                <FormControl>
                  <TextField
                    required
                    id="standard-required"
                    label="VLAN"
                    placeholder="VLAN"
                    name="vlan"
                    value={values.vlan}
                    error={errors.vlan ? true : false}
                    onChange={onChange}
                  />
                </FormControl>

                <FormControl>
                  <TextField
                    required
                    id="standard-required"
                    label="Service Tag"
                    placeholder="Service Tag"
                    name="sertag"
                    value={values.sertag}
                    error={errors.sertag ? true : false}
                    onChange={onChange}
                  />
                </FormControl>

                <FormControl>
                  <TextField
                    required
                    id="standard-required"
                    label="IP Address"
                    placeholder="IP Address"
                    name="ip"
                    value={values.ip}
                    error={errors.ip ? true : false}
                    onChange={onChange}
                  />
                </FormControl>

                <FormControl>
                  <InputLabel id="select">Position</InputLabel>
                  <Select
                    labelId="simple-select"
                    id="simple-select"
                    value={values.posiId}
                    onChange={onChange}
                    type="text"
                    name="posiId"
                    placeholder="Position ID"
                    required
                    error={errors.posiId ? true : false}
                  >
                    <MenuItem value={""} disabled>
                      <em>None</em>
                    </MenuItem>
                    {data &&
                      data.getPosis.map((posi) => (
                        <MenuItem value={posi.id} key={posi.id}>
                          {posi.name} - {posi.floor}
                        </MenuItem>
                      ))}
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
