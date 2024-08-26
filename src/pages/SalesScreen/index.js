import React from "react";
import { Switch, Route, useRouteMatch, Link } from "react-router-dom";
import NavLeftComponent from "../../components/NavLeftComponent";
import NavTopComponent from "../../components/NavTopComponent";
import FooterComponent from "../../components/FooterComponent";
import AddContactComponent from "../../components/AddContactComponent";
import ContactInfoComponent from "../../components/ContactInfoComponent";
import ContactComponent from "../../components/ContactComponent";
import ProjectComponent from "../../components/ProjectComponent";
import ProjectInfoComponent from "../../components/ProjectInfoComponent";
import AddProjectComponent from "../../components/AddProjectComponent";
import EventComponent from "../../components/EventComponent";
import ReportSalesComponent from "../../components/ReportSalesComponent";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import PersonPinRoundedIcon from "@mui/icons-material/PersonPinRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import FindInPageRoundedIcon from "@mui/icons-material/FindInPageRounded";
import DescriptionIcon from "@mui/icons-material/Description";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";

export default function SalesScreen(props) {
  const { path } = useRouteMatch();
  return (
    <>
      <NavLeftComponent />
      <div className={"whole-wrapper"}>
        <NavTopComponent />
        <main>
          <Switch>
            <Route exact path={`${path}`}>
              <Breadcrumbs separator=">" aria-label="breadcrumb">
                <BreadcrumbComponent name="การขาย" to="/sales" />
              </Breadcrumbs>
              <ul className="grid-container-nav-button">
                <Link to={`${path}/event`}>
                  <li className="menu-button">
                    <EventRoundedIcon />
                    <div>แผนการทำงาน</div>
                  </li>
                </Link>
                <Link to={`${path}/project`}>
                  <li className="menu-button">
                    <HomeWorkRoundedIcon />
                    <div>โครงการ</div>
                  </li>
                </Link>
                <Link to={`${path}/contact`}>
                  <li className="menu-button">
                    <PersonPinRoundedIcon />
                    <div>ผู้ติดต่อ</div>
                  </li>
                </Link>
                <Link to={`/income/quotation`}>
                  <li className="menu-button">
                    <DescriptionIcon />
                    <div>ใบเสนอราคา</div>
                  </li>
                </Link>
                <Link to={`/income/sales-order`}>
                  <li className="menu-button">
                    <DescriptionIcon />
                    <div>ใบสั่งขาย</div>
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
            <Route exact path={`${path}/project`}>
              <ProjectComponent />
            </Route>
            <Route exact path={`${path}/project/add`}>
              <AddProjectComponent />
            </Route>
            <Route exact path={`${path}/project/:id`}>
              <ProjectInfoComponent />
            </Route>
            <Route exact path={`${path}/event`}>
              <EventComponent />
            </Route>
            <Route exact path={`${path}/contact`}>
              <ContactComponent />
            </Route>
            <Route exact path={`${path}/contact/add`}>
              <AddContactComponent />
            </Route>
            <Route exact path={`${path}/contact/:id`}>
              <ContactInfoComponent />
            </Route>
            <Route path={`${path}/report`}>
              <ReportSalesComponent />
            </Route>
          </Switch>
        </main>
        <FooterComponent />
      </div>
    </>
  );
}
