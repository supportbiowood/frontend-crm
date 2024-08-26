import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";
import { Link } from "react-router-dom";
import { Switch, Route, useRouteMatch } from "react-router-dom";

import ReportWarranty from "../ReportCRMComponent/ReportWarranty";
import ReportEventComponent from "../ReportCRMComponent/ReportEventComponent";
import ReportPersonComponent from "../ReportCRMComponent/ReportPersonComponent";
import ReportProjectComponent from "../ReportCRMComponent/ReportProjectComponent";
import ReportContact from "../ReportCRMComponent/ReportContact";

export default function ReportSalesComponent(props) {
  const { path } = useRouteMatch();
  return (
    <>
      <Switch>
        <Route exact path={`${path}`}>
          <ReportHome />
        </Route>
        <Route exact path={`${path}/1`}>
          <ReportEventComponent />
        </Route>
        <Route exact path={`${path}/2`}>
          <ReportProjectComponent />
        </Route>
        <Route exact path={`${path}/3`}>
          <ReportWarranty />
        </Route>
        <Route exact path={`${path}/4`}>
          <ReportContact />
        </Route>
        <Route exact path={`${path}/5`}>
          <ReportPersonComponent />
        </Route>
      </Switch>
    </>
  );
}

function ReportHome(props) {
  const { path } = useRouteMatch();
  return (
    <>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <BreadcrumbComponent name="การขาย" key="1" to="/sales" />
        <BreadcrumbComponent name="รายงาน" key="2" to="/sales/report" />
      </Breadcrumbs>
      <div className="grid-container-25 myReportSelection">
        <div>
          <Link to={`${path}/1`}>ตารางทำงาน & รายงานระยะทาง</Link>
        </div>
        <div>
          <Link to={`${path}/2`}>โครงการ</Link>
        </div>
        <div>
          <Link to={`${path}/3`}>การรับประกัน</Link>
        </div>
        <div>
          <Link to={`${path}/4`}>ผู้ติดต่อ</Link>
        </div>
        <div>
          <Link to={`${path}/5`}>บุคคลติดต่อ</Link>
        </div>
      </div>
    </>
  );
}
