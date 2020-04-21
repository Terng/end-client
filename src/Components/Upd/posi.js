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

import { useHistory } from "react-router-dom";

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
      posiId
    }
  }
`;

const UPDATE_POSI_MUTA = gql`
  mutation updatePosi($pcId: ID!, $posiId: String!) {
    updatePosi(pcId: $pcId, posiId: $posiId) {
      id
      posiId
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

function UpdIp({ pcId }) {
  const classes = useStyles();
  const [errors, setErrors] = useState({});

  const { data } = useQuery(getposition);
  const [posi, setPosi] = React.useState("");
  /*   const [value, setValue] = useState({
    posiId: ""
  }); */
  const onChange = (e) => {
    /*     setValue({ ...value, [e.target.name]: e.target.value });
     */ setPosi(e.target.value);
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

  const [updatePosi] = useMutation(UPDATE_POSI_MUTA, {
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
    <React.Fragment key={pc_data.getPc.id}>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Edit Position
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Update PC Position"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography>
              Position Details <ShowPosi posiId={pc_data.getPc.posiId} />
            </Typography>
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
                  updatePosi({
                    variables: { pcId, posiId: posi },
                    refetchQueries: [{ query: getPcs }],
                  });
                }}
              >
                <FormControl>
                  <InputLabel id="select">Position</InputLabel>
                  <Select
                    labelId="simple-select"
                    id="simple-select"
                    value={posi}
                    onChange={onChange}
                    type="text"
                    name="posiId"
                    placeholder="Position ID"
                    required
                  >
                    <MenuItem value={""} disabled required>
                      <em>None</em>
                    </MenuItem>
                    {data &&
                      data.getPosis.map((posi) => (
                        <MenuItem value={posi.id} key={posi.id}>
                          {posi.name} - {posi.floor}
                        </MenuItem>
                      ))}
                  </Select>
                  <Button type="submit">Update Position</Button>
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
export default UpdIp;
