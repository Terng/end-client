import React from "react";
import { useMutation } from "@apollo/react-hooks";
import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import gql from "graphql-tag";
import { getPcs } from "../ExQueries/Queries";

function DeletePc({ pcId }) {
  const [delPcs] = useMutation(DELETE_PC_MUTATION);
  return (
    <IconButton
      aria-label="delete"
      size="small"
      onClick={() => {
        delPcs({
          variables: {
            pcId
          },
          refetchQueries: [{ query: getPcs }]
        });
      }}
    >
      <DeleteIcon />
    </IconButton>
  );
}
const DELETE_PC_MUTATION = gql`
  mutation deletePc($pcId: ID!) {
    deletePc(pcId: $pcId)
  }
`;
export default DeletePc;
