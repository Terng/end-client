import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { Typography } from "@material-ui/core";
import gql from "graphql-tag";
import CircularProgress from "@material-ui/core/CircularProgress";

function ShowPosi(props) {
  const posiId = props.posiId;
  const { data, loading, error } = useQuery(FETCH_POSI, {
    variables: {
      posiId
    }
  });
  if (loading) return <CircularProgress />;
  if (error) return <p>This PC don't contain the Position and floor</p>;
  return (
    <div>
      <Typography color="textSecondary">ID : {data.getPosi.id}</Typography>
      <Typography>Position : {data.getPosi.name}</Typography>
      <Typography>Floor : {data.getPosi.floor}</Typography>
    </div>
  );
}
const FETCH_POSI = gql`
  query($posiId: ID!) {
    getPosi(posiId: $posiId) {
      id
      name
      floor
    }
  }
`;
export default ShowPosi;
