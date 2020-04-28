import React from "react";
import Skeleton from "./Skeleton";
import { useQuery } from "@apollo/react-hooks";
import "../App.css";
import { Paper, makeStyles, IconButton, Box } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";

import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";

import { Link } from "react-router-dom";
import { getPcs } from "../ExQueries/Queries";
import DeletePc from "./Delete";
import Xlsx from "../Components/Exportxlsx";
/* import Tables from "../Components/Table/Table";
 */
import AddPc from "../pages/AddPc";

import MaUTable from "@material-ui/core/Table";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  TableBody,
  InputAdornment,
  Select,
  MenuItem,
} from "@material-ui/core";
import { useTable, useSortBy, useFilters, useGlobalFilter } from "react-table";
import matchSorter from "match-sorter";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    display: "flex",
    flexWrap: "wrap",
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
  margin: {
    margin: theme.spacing(0),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: "25ch",
  },
  formControl: {
    minWidth: 100,
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

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const classes = useStyles();
  return (
    <FormControl fullWidth className={classes.margin} variant="outlined">
      <InputLabel htmlFor="outlined-adornment-amount">Search</InputLabel>
      <OutlinedInput
        id="outlined-adornment-amount"
        value={globalFilter || ""}
        onChange={(e) => {
          setGlobalFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        startAdornment={
          <InputAdornment position="start">Search : </InputAdornment>
        }
        labelWidth={55}
        placeholder={`${count} records...`}
      />
    </FormControl>
  );
}

function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  const classes = useStyles();
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="demo-simple-select-label">Status</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={filterValue}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
      >
        <MenuItem value="">All</MenuItem>
        {options.map((option, i) => (
          <MenuItem key={i} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  return (
    <TextField
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
    },
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    useSortBy
  );
  // Render the UI for your table
  return (
    <React.Fragment>
      <div>
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      </div>
      <MaUTable {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableCell
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </TableCell>
              ))}
            </TableRow>
          ))}
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableCell {...column.getHeaderProps()}>
                  {column.canFilter ? column.render("Filter") : null}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <TableCell {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
        {/*       <div>
        <pre>
          <code>{JSON.stringify(state.filters, null, 2)}</code>
        </pre>
      </div> */}
      </MaUTable>
    </React.Fragment>
  );
}

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
  return rows.filter((row) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = (val) => typeof val !== "number";

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
      Header: "Status",
      accessor: "status",
      Filter: SelectColumnFilter,
      filter: "includes",
    },
    {
      Header: "Action",
      accessor: "id",
      disableFilters: true,
      Cell: ({ cell: { value } }) => {
        return (
          <div>
            {/* <DeletePc pcId={value} /> */}

            <IconButton
              aria-label="view"
              size="small"
              component={Link}
              to={`/pc/${value}`}
            >
              <EditIcon />
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
        <Table data={data.getPcs} columns={columns} />
      </Paper>
    </div>
  );
}

export default PcList;
