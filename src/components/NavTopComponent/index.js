import React from "react";
import { Link, useHistory } from "react-router-dom";
import { getUser, removeUserSession } from "../../adapter/Auth";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
// import NotificationsIcon from "@mui/icons-material/Notifications";
import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Chip from "@mui/material/Chip";

export default function NavTopComponent() {
  const history = useHistory();
  const user = getUser();

  return (
    <>
      <nav className="sticky desktop">
        <div className="grid-container-nav-top">
          <div className="item1">
            <Button
              variant="outlined"
              onClick={() => {
                history.goBack();
              }}
              startIcon={<ArrowBackRoundedIcon />}
            >
              ย้อนกลับ
            </Button>
          </div>
          <div className="item2" style={{ textAlign: "right" }}>
            <div style={{ display: "inline-block" }}>
              <Link to={`/employee/${user && user.employee_document_id}`}>
                <Chip
                  avatar={
                    user && user.employee_img_url ? (
                      <Avatar
                        sx={{ width: 24, height: 24 }}
                        src={user.employee_img_url}
                      />
                    ) : (
                      <Avatar
                        sx={{ width: 24, height: 24, bgcolor: "#2e7d32" }}
                      >
                        {user &&
                          user.employee_firstname &&
                          user.employee_firstname[0]}
                      </Avatar>
                    )
                  }
                  label={
                    user &&
                    `${user.employee_firstname} ${user.employee_lastname} (${user.employee_department})`
                  }
                  variant="outlined"
                  clickable
                  style={{
                    marginRight: "15px",
                    lineHeight: "36px",
                    height: "36px",
                    padding: "2px",
                    borderRadius: "20px",
                    border: "1px solid #bdbdbd",
                  }}
                />
              </Link>
              {/* <Link to={`/notification`}>
                <Badge
                  badgeContent={1}
                  color="success"
                  style={{ marginRight: "20px" }}
                >
                  <NotificationsIcon color="action" />
                </Badge>
              </Link> */}
              <Link to={`/approval`}>
                <Badge
                  badgeContent={1}
                  color="success"
                  style={{ marginRight: "20px" }}
                >
                  <DoneAllOutlinedIcon color="action" />
                </Badge>
              </Link>
              <Button
                style={{ marginLeft: "10px" }}
                variant="outlined"
                onClick={() => {
                  removeUserSession();
                  window.location.reload();
                }}
                startIcon={<LogoutRoundedIcon />}
              >
                ออกจากระบบ
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <nav className="sticky mobile mobile-top-nav" style={{ width: "100%" }}>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" style={{ background: "#fff" }}>
            <Toolbar>
              <Link to="/" style={{ color: "#2e7d32" }}>
                <IconButton
                  onClick={() => history.push("/")}
                  size="large"
                  edge="start"
                  aria-label="menu"
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              </Link>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                <Link to="/">
                  <img alt="logo" src="/logos/biowood-logo.png" />
                </Link>
              </Typography>
              {/* <Link to={`/notification`}>
                <Badge
                  badgeContent={1}
                  color="success"
                  style={{ marginRight: "20px", marginTop: "6px" }}
                >
                  <NotificationsIcon color="action" />
                </Badge>
              </Link> */}
              <Link to={`/approval`}>
                <Badge
                  badgeContent={1}
                  color="success"
                  style={{ marginRight: "20px", marginTop: "6px" }}
                >
                  <DoneAllOutlinedIcon color="action" />
                </Badge>
              </Link>
              <Link to={`/employee/${user && user.employee_id}`}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: "#2e7d32" }}>
                  {user &&
                    user.employee_firstname &&
                    user.employee_firstname[0]}
                </Avatar>
              </Link>
            </Toolbar>
          </AppBar>
        </Box>
      </nav>
      <div className="clear-sticky" />
    </>
  );
}
