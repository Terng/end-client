import React from "react";
import { getposition, getPcs } from "../ExQueries/Queries";
import { useQuery } from "react-apollo";
import Table2 from "../Components/Table/Table2";
import DeletePosi from "../Components/DeletePosi";
import AddPosi from "../pages/AddPosi";
import PosinameUpd from "../Components/Upd/posiname";
import FloorUpd from "../Components/Upd/floor";
import PMenus from "../Components/Upd/Pmenu";
import { makeStyles, Box } from "@material-ui/core";
import Xlsx from "../Components/Exportxlsx";

const useStyles = makeStyles((theme) => ({
  Button1: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

function PosiTable() {
  const classes = useStyles();
  const columns = /* React.useMemo(() =>  */ [
    {
      Header: "Position",
      accessor: "name",
    },
    {
      Header: "Floor",
      accessor: "floor",
    },
    {
      Header: "Status",
      accessor: "status",
    },
    {
      Header: "Action",
      accessor: "id",
      Cell: ({ cell: { value } }) => {
        return (
          <div className={classes.Button1}>
            <PMenus posiId={value} />
            {/* <DeletePosi posiId={value} /> */}
            {/*             <PosinameUpd posiId={value} />
            <FloorUpd posiId={value} /> */}
          </div>
        );
      },
    },
  ]; /* ) */
  const { data, loading, error } = useQuery(getposition);
  if (error) return <p>error</p>;
  if (loading) return <p>loading ...</p>;
  return (
    <React.Fragment>
      <Box
        display="inline"
        justifyContent="flex-end"
        m={1}
        className={classes.Button1}
      >
        <AddPosi />
        <Xlsx csvData={data.getPosis} fileName={"Position_List"} />
      </Box>

      <Table2 columns={columns} data={data.getPosis} />
    </React.Fragment>
  );
}

export default PosiTable;
