import React from "react";
import { Switch, Route, useRouteMatch, Link } from "react-router-dom";
import NavLeftComponent from "../../components/NavLeftComponent";
import NavTopComponent from "../../components/NavTopComponent";
import FooterComponent from "../../components/FooterComponent";

import FindInPageRoundedIcon from "@mui/icons-material/FindInPageRounded";
import DescriptionIcon from '@mui/icons-material/Description';
import PersonPinRoundedIcon from "@mui/icons-material/PersonPinRounded";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";

export default function PurchaseScreen() {
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
                <BreadcrumbComponent name="จัดซื้อ" to="/purchase" />
              </Breadcrumbs>
              <ul className="grid-container-nav-button">
                <Link to={`/expense/purchase-request`}>
                  <li className="menu-button">
                    <DescriptionIcon />
                    <div>ใบขอซื้อ</div>
                  </li>
                </Link>
                <Link to={`/expense/purchase-order`}>
                  <li className="menu-button">
                    <DescriptionIcon />
                    <div>ใบสั่งซื้อ</div>
                  </li>
                </Link>
                <Link to={`${path}/contact`}>
                  <li className="menu-button">
                    <PersonPinRoundedIcon />
                    <div>ผู้ติดต่อ</div>
                  </li>
                </Link>
                <Link to={`${path}/report`}>
                  <li className="menu-button">
                    <FindInPageRoundedIcon />
                    <div>รายงาน</div>
                  </li>
                </Link>
              </ul>
            </Route>

            <Route exact path={`${path}/contact`}>
                <div>A</div>
            </Route>
            <Route exact path={`${path}/contact/add`}>
              <div>B</div>
            </Route>
            <Route exact path={`${path}/contact/:id`}>
              <div>C</div>
            </Route>

            <Route exact path={`${path}/report`}>
              <div>Report</div>
            </Route>
          </Switch>
        </main>
        <FooterComponent />
      </div>
    </>
  );
}
