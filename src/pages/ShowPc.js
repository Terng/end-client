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
  Grid,
} from "@material-ui/core";
import gql from "graphql-tag";
import { makeStyles } from "@material-ui/core/styles";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { useHistory } from "react-router-dom";
import { Link as PLink } from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import ComputerIcon from "@material-ui/icons/Computer";
import { grey } from "@material-ui/core/colors";
import GenQR from "../Components/QRCode";
import ShowPosi from "./showPosis";
import NameUpd from "../Components/Upd/name";
import VlanUpd from "../Components/Upd/vlan";
import PosiUpd from "../Components/Upd/posi";
import IpUpd from "../Components/Upd/Ip";
import QRCode from "qrcode.react";
import Xlsx from "../Components/Exportxlsx";
const useStyles = makeStyles((theme) => ({
  root: {
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
    rootb: {
      display: "flex",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
  },
  grey: {
    color: "#fff",
    backgroundColor: grey[800],
  },
  divider1: {
    margin: theme.spacing(1),
  },
  Button1: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

const StyledBadge = withStyles((theme) => ({
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
      content: '""' < QRCode,
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}))(Badge);

function ShowPc(props) {
  const classes = useStyles();
  const history = useHistory();
  function handleClick(e) {
    e.preventDefault();
    history.push("/list");
  }

  const pcId = props.match.params.pcId;
  const { data, loading, error } = useQuery(FETCH_PC_QUERY, {
    variables: {
      pcId,
    },
  });
  if (loading) return <LinearProgress />;
  if (error) return <p>error</p>;

  const pc = Object.values(data);
  return (
    <React.Fragment>
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
          <Box display="inline">
            <StyledBadge
              overlap="circle"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              variant="dot"
            >
              <Avatar variant="circle" className={classes.grey}>
                <ComputerIcon />
              </Avatar>
            </StyledBadge>
          </Box>

          <Box
            display="inline"
            justifyContent="flex-end"
            m={1}
            className={classes.Button1}
          >
            <Xlsx csvData={pc} fileName={data.getPc.name} />
            <GenQR pcId={data.getPc.id} />
          </Box>
          <Divider variant="fullWidth" className={classes.divider1} />
          <Grid container>
            <Grid item xs={1}>
              <Typography>PC Name</Typography>
              <Typography>Service Tag</Typography>
              <Typography>Asset Tag</Typography>
              <Typography>IP Address</Typography>
              <Typography>VLAN</Typography>
              <Typography>Position</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography>{data.getPc.name}</Typography>
              <Typography>{data.getPc.sertag}</Typography>
              <Typography>{data.getPc.assettag}</Typography>
              <Typography>{data.getPc.ip}</Typography>
              <Typography>{data.getPc.vlan}</Typography>
              <ShowPosi posiId={data.getPc.posiId} />
            </Grid>
            <Grid
              container
              item
              xs={4}
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
              align="center"
              display="flex"
              justifyContent="center"
            >
              <QRCode size={256} value={data.getPc.id} level="H" />
            </Grid>
          </Grid>
          <Box display="inline" className={classes.Button1}>
            <NameUpd pcId={data.getPc.id} />
            <VlanUpd pcId={data.getPc.id} />
            <IpUpd pcId={data.getPc.id} />
            <PosiUpd pcId={data.getPc.id} />
          </Box>
        </Box>
      </Container>
    </React.Fragment>
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
      posiId
    }
  }
`;

export default ShowPc;
