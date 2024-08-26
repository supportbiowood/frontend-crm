import React from "react";
import { Switch, useRouteMatch } from "react-router-dom";
import NavLeftComponent from "../../components/NavLeftComponent";
import NavTopComponent from "../../components/NavTopComponent";
import FooterComponent from "../../components/FooterComponent";
import ProtectedRoute from "../../components/ProtectedRoute";

import DescriptionIcon from "@mui/icons-material/Description";
import EngineerComponent from "../../components/Engineer/EngineerComponent";
import { Breadcrumbs } from "@mui/material";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";
import { Link } from "react-router-dom";
import AddEngineerComponent from "../../components/Engineer/EngineerComponent/AddEngineerComponent";

export default function EngineerScreen(props) {
  const { path } = useRouteMatch();
  return (
    <>
      <NavLeftComponent />
      <div className={"whole-wrapper"}>
        <NavTopComponent />
        <main>
          <Switch>
            <ProtectedRoute exact path={`${path}`}>
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                <BreadcrumbComponent name="ถอดแบบ/ติดตั้ง" to="/engineer" />
              </Breadcrumbs>
              <ul className="grid-container-nav-button">
                <Link to={`${path}/estimate`}>
                  <li className="menu-button">
                    <DescriptionIcon />
                    <div>ใบถอดแบบ/ติดตั้ง</div>
                  </li>
                </Link>
              </ul>
            </ProtectedRoute>
            <ProtectedRoute exact path={`${path}/estimate`}>
              <EngineerComponent />
            </ProtectedRoute>
            <ProtectedRoute exact path={`${path}/estimate/add`}>
              <AddEngineerComponent />
            </ProtectedRoute>
            <ProtectedRoute exact path={`${path}/estimate/:id`}>
              <AddEngineerComponent />
            </ProtectedRoute>
          </Switch>
        </main>
        <FooterComponent />
      </div>
    </>
  );
}
