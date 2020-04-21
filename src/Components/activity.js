import React from "react";
import Skeleton from "./Skeleton";
import moment from "moment";
import { useQuery } from "@apollo/react-hooks";
import "../App.css";
import {
  Paper,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Link } from "react-router-dom";
import { Link as PLink } from "@material-ui/core";
import { getPcs } from "../ExQueries/Queries";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  rootp: {
    width: "100%",
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  container: {
    maxHeight: 800,
  },
  errWidth: "100%",
  "& > * + *": {
    marginTop: theme.spacing(2),
  },
  title: {
    flex: "1 1 100%",
  },
}));

const columns = [
  { id: "Activity", label: "Activity", minWidth: 170, align: "left" },
];

function PcList() {
  const classes = useStyles();
  const { loading, data, error } = useQuery(getPcs);
  if (loading) return <Skeleton />;

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
  return (
    <Paper>
      <TableContainer className={classes.container}>
        <Table
          stickyHeader
          aria-label="sticky table"
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  <Typography
                    variant="h6"
                    id="tableTitle"
                    className={classes.title}
                  >
                    {column.label}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {data &&
              data.getPcs.map((pc) => (
                <TableRow key={pc.id} hover>
                  <TableCell id="Cell" align="left">
                    <PLink
                      color="inherit"
                      underline="none"
                      component={Link}
                      to={`/pc/${pc.id}`}
                    >
                      {pc.name} was Created on{" "}
                      {moment(pc.createdAt).format("LLL")}
                      {", "}
                      {"( "}
                      {moment(pc.createdAt).fromNow()}
                      {" )"}
                    </PLink>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
export default PcList;
