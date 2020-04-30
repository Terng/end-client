import React from "react";
import { getPcs } from "../../ExQueries/Queries";
import { useQuery } from "@apollo/react-hooks";

function PCStore() {
  const { data, loading, error } = useQuery(getPcs);
  if (error) return <p>error</p>;
  if (loading) return <p>loading ...</p>;
  let pcs;
  {
    data &&
      data.getPcs.map((pc) => {
        pcs = pc.positionName;
      });
  }
  console.log(data);
  return <div></div>;
}
export default PCStore;
