import React from "react";
import { CSVLink } from "react-csv";
import { Button, Link } from "@material-ui/core";

const ExportCSV = ({ csvData, fileName }) => {
  return (
    <CSVLink data={csvData} filename={fileName}>
      <Button variant="contained" color="default">
        <Link color="inherit">Export</Link>
      </Button>
    </CSVLink>
  );
};
export default ExportCSV;
