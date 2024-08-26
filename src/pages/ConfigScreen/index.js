import React from "react";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import NavLeftComponent from "../../components/NavLeftComponent";
import NavTopComponent from "../../components/NavTopComponent";
import FooterComponent from "../../components/FooterComponent";
import ProtectedRoute from "../../components/ProtectedRoute";

import ImporterComponent from "../../components/Config/ImporterComponent";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { Breadcrumbs } from "@mui/material";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";
import WarehouseComponent from "../../components/Config/WarehouseComponent";
import UOMComponent from "../../components/Config/UOMComponent";
import UOMGroupComponent from "../../components/Config/UOMGroupComponent";
import CategoryComponent from "../../components/Config/CategoryComponent";
import PropertyComponent from "../../components/Config/PropertyComponent";
import UOMGroupEditComponent from "../../components/Config/UOMGroupComponent/UOMGroupEditComponent";

export default function ConfigScreen(props) {
  const { path } = useRouteMatch();
  return (
    <>
      <NavLeftComponent />
      <div className={"whole-wrapper"}>
        <NavTopComponent />
        <main>
          <Switch>
            <Route exact path={`${path}`}>
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                <BreadcrumbComponent name="ตั้งค่า" to="#" />
              </Breadcrumbs>
              <ul className="grid-container-nav-button">
                <Link to={`${path}/warehouse`}>
                  <li className="menu-button">
                    <SettingsOutlinedIcon />
                    <div>คลัง</div>
                  </li>
                </Link>
                <Link to={`${path}/category`}>
                  <li className="menu-button">
                    <SettingsOutlinedIcon />
                    <div>หมวดหมู่</div>
                  </li>
                </Link>
                <Link to={`${path}/uom`}>
                  <li className="menu-button">
                    <SettingsOutlinedIcon />
                    <div>หน่วย</div>
                  </li>
                </Link>
                <Link to={`${path}/uomConversion`}>
                  <li className="menu-button">
                    <SettingsOutlinedIcon />
                    <div>การแปลงหน่วย</div>
                  </li>
                </Link>
                <Link to={`${path}/property`}>
                  <li className="menu-button">
                    <SettingsOutlinedIcon />
                    <div>คุณสมบัติ</div>
                  </li>
                </Link>
              </ul>
            </Route>
            <ProtectedRoute exact path={`${path}/importer`}>
              <ImporterComponent />
            </ProtectedRoute>
            <ProtectedRoute exact path={`${path}/warehouse`}>
              <WarehouseComponent />
            </ProtectedRoute>
            <ProtectedRoute exact path={`${path}/category`}>
              <CategoryComponent />
            </ProtectedRoute>
            <ProtectedRoute exact path={`${path}/uom`}>
              <UOMComponent />
            </ProtectedRoute>
            <ProtectedRoute exact path={`${path}/uomConversion`}>
              <UOMGroupComponent />
            </ProtectedRoute>
            <ProtectedRoute exact path={`${path}/uomConversion/:id`}>
              <UOMGroupEditComponent />
            </ProtectedRoute>
            <ProtectedRoute exact path={`${path}/property`}>
              <PropertyComponent />
            </ProtectedRoute>
          </Switch>
        </main>
        <FooterComponent />
      </div>
    </>
  );
}
