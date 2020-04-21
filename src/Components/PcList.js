import React from "react";
import Skeleton from "./Skeleton";
import { useQuery } from "@apollo/react-hooks";
import "../App.css";
import { Paper, makeStyles, IconButton, Box } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { Link } from "react-router-dom";
import { getPcs } from "../ExQueries/Queries";
import DeletePc from "./Delete";
import Xlsx from "../Components/Exportxlsx";
import Tables from "../Components/Table/Table";
import AddPc from "../pages/AddPc";

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
  Button1: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

/* const columns = [
  { id: "Name", label: "Name", minWidth: 170, align: "left" },
  { id: "ServiceTag", label: "Service Tag", minWidth: 100, align: "left" },
  { id: "AssetTag", label: "Asset Tag", minWidth: 100, align: "left" },
  { id: "Vlan", label: "VLAN", minWidth: 100, align: "left" },
  { id: "IP", label: "IP Address", minWidth: 100, align: "left" },
  { id: "Create time", label: "Create time", minWidth: 20, align: "left" },
  { id: "Action", label: "Action", minWidth: 50, align: "left" }
]; */

function PcList() {
  const { loading, data, error } = useQuery(getPcs);

  const columns = /* useMemo(() => */ [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Service Tag",
      accessor: "sertag",
    },
    {
      Header: "Asset Tag",
      accessor: "assettag",
    },
    {
      Header: "VLAN",
      accessor: "vlan",
    },
    {
      Header: "IP Address",
      accessor: "ip",
    },
    {
      Header: "Action",
      accessor: "id",
      disableFilters: true,
      Cell: ({ cell: { value } }) => {
        return (
          <div>
            <DeletePc pcId={value} />

            <IconButton
              aria-label="view"
              size="small"
              component={Link}
              to={`/pc/${value}`}
            >
              <VisibilityIcon />
            </IconButton>
          </div>
        );
      },
    },
    /*       ],
    }, */
  ]; /* ) */
  const classes = useStyles();

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
    <div>
      <Box
        display="flex"
        justifyContent="flex-end"
        m={1}
        className={classes.Button1}
      >
        <Xlsx csvData={data.getPcs} fileName={"List"} />
        <AddPc />
      </Box>
      <Paper>
        <Tables data={data.getPcs} columns={columns} />
      </Paper>
    </div>
  );
}

export default PcList;
