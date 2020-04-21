import React from "react";
import { useQuery } from "react-apollo";
import { Breadcrumbs, Link as PLink, Typography } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { useHistory, Link } from "react-router-dom";
import gql from "graphql-tag";

function Breadcrumb(props) {
  const pcId = props.pcId;
  const history = useHistory();
  const { data } = useQuery(FETCH_PC_QUERY, {
    variables: {
      pcId
    }
  });
  function handleBreadcrumbs(e) {
    e.preventDefault();
    history.push("/list");
  }
  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
    >
      <PLink color="inherit" onClick={handleBreadcrumbs} href="/">
        <Typography>List</Typography>
      </PLink>
      <Typography>Update</Typography>
      <Typography color="textPrimary">{data.getPc.name}</Typography>
    </Breadcrumbs>
  );
}
const FETCH_PC_QUERY = gql`
  query($pcId: ID!) {
    getPc(pcId: $pcId) {
      id
      name
    }
  }
`;

export default Breadcrumb;
