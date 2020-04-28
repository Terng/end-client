import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import {
  Menu,
  MenuItem,
  LinearProgress,
  IconButton,
  Button,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import NameUpd from "../Upd/name";
import VlanUpd from "../Upd/vlan";
import IpUpd from "../Upd/Ip";
import UpdPName from "../Upd/pcPname";
import UpdPFloor from "../Upd/pcPfloor";
import UpdStatus from "../Upd/status";
import { getPosi, getposition } from "../../ExQueries/Queries";
import PosinameUpd from "../Upd/posiname";
import FloorUpd from "../Upd/floor";
import StatusUpd from "../Upd/pStatus";
function PMenus({ posiId }) {
  const { data, loading, error } = useQuery(getPosi, {
    variables: {
      posiId,
    },
  });
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  if (loading) return <p>loading...</p>;
  if (error) return <p>error</p>;
  return (
    <div>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <EditIcon />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <PosinameUpd posiId={data.getPosi.id} />
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <FloorUpd posiId={data.getPosi.id} />
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <StatusUpd posiId={data.getPosi.id} />
        </MenuItem>
      </Menu>
    </div>
  );
}
export default PMenus;
