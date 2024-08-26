import React from "react";
import { Switch, useRouteMatch } from "react-router-dom";
// import HomeSection from "../../components/HomeSection";
import NavLeftComponent from "../../components/NavLeftComponent";
import NavTopComponent from "../../components/NavTopComponent";
import FooterComponent from "../../components/FooterComponent";

import EmployeeComponent from "../../components/EmployeeComponent";
import EmployeeInfoComponent from "../../components/EmployeeInfoComponent";
import AddEmployeeComponent from "../../components/AddEmployeeComponent";
import EmployeePermissionComponent from "../../components/Employee/EmployeePermissionComponent";
import EmployeeTeamComponent from "../../components/Employee/EmployeeTeamComponent";
import ProtectedRoute from "../../components/ProtectedRoute";
import AddEmployeeTeamComponent from "../../components/Employee/EmployeeTeamComponent/AddEmployeeTeamComponent";

export default function EmployeeScreen(props) {
  const { path } = useRouteMatch();

  return (
    <>
      <NavLeftComponent />
      <div className={"whole-wrapper"}>
        <NavTopComponent />
        <main>
          <Switch>
            <ProtectedRoute exact path={`${path}`}>
              <EmployeeComponent />
            </ProtectedRoute>
            <ProtectedRoute exact path={`${path}/add`}>
              <AddEmployeeComponent />
            </ProtectedRoute>
            <ProtectedRoute exact path={`${path}/permission`}>
              <EmployeePermissionComponent />
            </ProtectedRoute>
            {/* <ProtectedRoute exact path={`${path}/access/add`}>
              <EmployeeAddAccessComponent />
            </ProtectedRoute> */}
            <ProtectedRoute exact path={`${path}/team`}>
              <EmployeeTeamComponent />
            </ProtectedRoute>
            <ProtectedRoute exact path={`${path}/team/add`}>
              <AddEmployeeTeamComponent />
            </ProtectedRoute>
            {/* <ProtectedRoute exact path={`${path}/team/:id`}>
              <EmployeeTeamInfoComponent />
            </ProtectedRoute> */}
            <ProtectedRoute exact path={`${path}/:id`}>
              <EmployeeInfoComponent />
            </ProtectedRoute>
          </Switch>
        </main>
        <FooterComponent />
      </div>
    </>
  );
}
