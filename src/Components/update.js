import React from "react";
import { useQuery } from "@apollo/react-hooks";
import {
  Typography,
  Container,
  LinearProgress,
  Box,
  withStyles,
  Badge,
  Avatar,
  Divider,
  FormControl
} from "@material-ui/core";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { useHistory } from "react-router-dom";
import { Link as PLink } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import ComputerIcon from "@material-ui/icons/Computer";
import { grey } from "@material-ui/core/colors";
import ShowPosi from "../pages/showPosis";

const useStyles = makeStyles(theme => ({
  root: {
    "& > * + *": {
      marginTop: theme.spacing(2)
    },
    rootb: {
      display: "flex",
      "& > *": {
        margin: theme.spacing(1)
      }
    }
  },
  grey: {
    color: "#fff",
    backgroundColor: grey[800]
  },
  divider1: {
    margin: theme.spacing(1)
  }
}));

const StyledBadge = withStyles(theme => ({
  badge: {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absoposiIdlute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "$ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""'
    }
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0
    }
  }
}))(Badge);

function ShowPc(props) {
  const classes = useStyles();
  const history = useHistory();
  function handleClick(e) {
    e.preventDefault();
    history.push("/list");
  }
  const pcId = props.match.params.pcId;

  /*   console.log(pcId);
   */

  const { data } = useQuery(FETCH_PC_QUERY, {
    variables: {
      pcId
    }
  });
  /* console.log(data); */
  let pcMarkup;
  if (!data) {
    pcMarkup = <LinearProgress />;
  } else {
    /* console.log(data.getPc.name) */
    pcMarkup = (
      <div>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          <PLink color="inherit" onClick={handleClick} href="/">
            <Typography>List</Typography>
          </PLink>
          <Typography color="textPrimary">{data.getPc.name}</Typography>
        </Breadcrumbs>
        <Container fixed>
          <Box
            boxShadow={3}
            bgcolor="background.paper"
            m={1}
            p={1}
            style={{ width: "70rem", height: "30rem" }}
          >
            <StyledBadge
              overlap="circle"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right"
              }}
              variant="dot"
            >
              <Avatar variant="circle" className={classes.grey}>
                <ComputerIcon />
              </Avatar>
            </StyledBadge>
            <Divider variant="fullWidth" className={classes.divider1} />
            <Typography>PC Name : {data.getPc.name}</Typography>

            <Typography>Service Tag : {data.getPc.sertag}</Typography>
            <Typography>Asset Tag : {data.getPc.assettag}</Typography>
            <Typography>IP Address : {data.getPc.ip}</Typography>
            <Typography>VLAN : {data.getPc.vlan}</Typography>
            <FormControl>
              <ShowPosi posiId={data.getPc.posiId} />
            </FormControl>
          </Box>
        </Container>
      </div>
    );
  }
  return pcMarkup;
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
      posiId
    }
  }
`;

export default ShowPc;
