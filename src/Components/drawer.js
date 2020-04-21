import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import {
  Drawer,
  AppBar,
  CssBaseline,
  Toolbar,
  List,
  ListItemText,
  ListItem,
  ListItemIcon,
  Typography,
  Divider,
} from "@material-ui/core";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import FormatListBulletedRoundedIcon from "@material-ui/icons/FormatListBulletedRounded";
import MyLocationIcon from "@material-ui/icons/MyLocation";

import Home from "../pages/Home";
import PcList from "../pages/List";
import ShowPc from "../pages/ShowPc";
import NoMatchPage from "../pages/404";
import Position from "../pages/position";

import Tables from "../Components/Table/Table";
import GenQR from "../Components/QRCode";
import NameUpd from "../Components/Upd/name";
import VlanUpd from "../Components/Upd/vlan";
import IpUpd from "../Components/Upd/Ip";
import PosiUpd from "../Components/Upd/posi";
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
}));

function ClippedDrawer() {
  const pathname = window.location.pathname;
  const path = pathname === "/" ? "home" : pathname.substr(1);

  const [activeItem, setActiveItem] = useState(path);
  /*   const handleItemClick = (e, { index }) => setActiveItem(index);
   */

  const handleListItemClick = (event, index) => {
    setActiveItem(index);
  };
  const classes = useStyles();
  return (
    <Router>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" noWrap>
              Asset
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.toolbar} />
          <List>
            <ListItem
              button
              name="home"
              selected={activeItem === "home"}
              onClick={(e) => handleListItemClick(e, "home")}
              component={Link}
              to="/"
            >
              <ListItemIcon>
                <HomeRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem
              button
              name="list"
              selected={activeItem === "list"}
              onClick={(e) => handleListItemClick(e, "list")}
              component={Link}
              to="/list"
            >
              <ListItemIcon>
                <FormatListBulletedRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="List" />
            </ListItem>
            {/*             <ListItem
              button
              name="edit"
              selected={activeItem === "edit"}
              onClick={e => handleListItemClick(e, "edit")}
              component={Link}
              to="/edit"
            >
              <ListItemIcon>
                <EditAttributesRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Edit" />
            </ListItem> */}
          </List>
          <Divider />
          <ListItem
            button
            name="position"
            selected={activeItem === "position"}
            onClick={(e) => handleListItemClick(e, "position")}
            component={Link}
            to="/position"
          >
            <ListItemIcon>
              <MyLocationIcon />
            </ListItemIcon>
            <ListItemText primary="Position" />
          </ListItem>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/list" component={PcList} />
            <Route exact path="/pc/:pcId" component={ShowPc} />
            <Route exact path="/edit/name/:pcId" component={NameUpd} />
            <Route exact path="/edit/vlan/:pcId" component={VlanUpd} />
            <Route exact path="/edit/ip/:pcId" component={IpUpd} />
            <Route exact path="/edit/posi/:pcId" component={PosiUpd} />
            <Route exact path="/QR/:pcId" component={GenQR} />
            <Route exact path="/position" component={Position} />
            <Route exact path="/table" component={Tables} />

            <Route component={NoMatchPage} />
          </Switch>
        </main>
      </div>
    </Router>
  );
}
export default ClippedDrawer;
