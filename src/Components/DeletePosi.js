import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import gql from "graphql-tag";
import { getposition } from "../ExQueries/Queries";

function DeletePosi({ posiId }) {
  const [delPosi] = useMutation(DELETE_PC_MUTATION);
  return (
    <IconButton
      aria-label="delete"
      size="small"
      onClick={() => {
        delPosi({
          variables: {
            posiId,
          },
          refetchQueries: [{ query: getposition }],
        });
      }}
    >
      <DeleteIcon />
    </IconButton>
  );
}
const DELETE_PC_MUTATION = gql`
  mutation deletePosi($posiId: ID!) {
    deletePosi(posiId: $posiId)
  }
`;
export default DeletePosi;
