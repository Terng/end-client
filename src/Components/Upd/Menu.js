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

function Menus({ pcId }) {
  const { data, loading, error } = useQuery(FETCH_PC_QUERY, {
    variables: {
      pcId,
    },
  });

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  if (loading) return <LinearProgress />;
  if (error) return <p>error</p>;
  return (
    <div>
      {/*       <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <EditIcon />
      </IconButton> */}
      <Button variant="outlined" color="primary" onClick={handleClick}>
        Update Details
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>
          <NameUpd pcId={data.getPc.id} />
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <VlanUpd pcId={data.getPc.id} />
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <IpUpd pcId={data.getPc.id} />
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <UpdStatus pcId={data.getPc.id} />
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <UpdPName pcId={data.getPc.id} />
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <UpdPFloor pcId={data.getPc.id} />
        </MenuItem>
      </Menu>
    </div>
  );
}
const FETCH_PC_QUERY = gql`
  query($pcId: ID!) {
    getPc(pcId: $pcId) {
      id
      name
      sertag
      assettag
      vlan
      ip
      createdAt
      status
      positionName
      positionFloor
    }
  }
`;
export default Menus;
