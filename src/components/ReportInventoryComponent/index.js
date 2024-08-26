import React from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";
import { Link } from "react-router-dom";
import { Switch, Route, useRouteMatch } from "react-router-dom";

export default function ReportInventoryComponent(props) {
  const { path } = useRouteMatch();
  return (
    <>
      <Switch>
        <Route exact path={`${path}`}>
          <ReportHome />
        </Route>
        <Route exact path={`${path}/ledger`}>
          <div>รายงานการเคลื่อนไหวสินค้า</div>
        </Route>
        <Route exact path={`${path}/onhanditems`}>
          <div>รายงานสินค้าคงคลัง</div>
        </Route>
        <Route exact path={`${path}/items`}>
          <div>ReportItemsComponent</div>
        </Route>
      </Switch>
    </>
  );
}

function ReportHome(props) {
  const { path } = useRouteMatch();
  return (
    <>
      <Breadcrumbs separator=">" aria-label="breadcrumb">
        <BreadcrumbComponent name="คลังสินค้า" key="1" to="/inventory" />
        <BreadcrumbComponent name="รายงาน" key="2" to="/inventory/report" />
      </Breadcrumbs>
      <div className="grid-container-25 myReportSelection">
        <div>
          <Link to={`${path}/items`}>รายงานสินค้า</Link>
        </div>
        <div>
          <Link to={`${path}/ledger`}>รายงานการเคลื่อนไหวสินค้า</Link>
        </div>
        <div>
          <Link to={`${path}/onhanditems`}>รายงานสินค้าคงคลัง</Link>
        </div>
      </div>
    </>
  );
}
