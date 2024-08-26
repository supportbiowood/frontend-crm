import React from "react";
import { Switch, useRouteMatch } from "react-router-dom";
import NavLeftComponent from "../../components/NavLeftComponent";
import NavTopComponent from "../../components/NavTopComponent";
import FooterComponent from "../../components/FooterComponent";
import ProtectedRoute from "../../components/ProtectedRoute";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import FindInPageRoundedIcon from "@mui/icons-material/FindInPageRounded";

import AccountingComponent from "../../components/Accounting/AccountingComponent";
import ChartofAccountsInfo from "../../components/Accounting/ChartofAccounts/ChartofAccountsInfo";
import ChartofAccountComponent from "../../components/Accounting/ChartofAccounts/ChartofAccountComponent";
import JournalEntryComponent from "../../components/Accounting/JournalEntry/JournalEntryComponent";
import JournalEntryInfo from "../../components/Accounting/JournalEntry/JournalEntryInfo";
import { Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { Breadcrumbs } from "@mui/material";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";

export default function AccountingScreen(props) {
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
                <BreadcrumbComponent name="คลังสินค้า" to="/inventory" />
              </Breadcrumbs>
              <ul className="grid-container-nav-button">
                <Link to={`${path}/chart`}>
                  <li className="menu-button">
                    <AccountBalanceOutlinedIcon />
                    <div>ผังบัญชี</div>
                  </li>
                </Link>
                <Link to={`${path}/journal`}>
                  <li className="menu-button">
                    <AccountBalanceOutlinedIcon />
                    <div>บันทึกบัญชี</div>
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
            <ProtectedRoute exact path={`${path}`}>
              <AccountingComponent />
            </ProtectedRoute>
            <ProtectedRoute exact path={`${path}/chart`}>
              <ChartofAccountComponent />
            </ProtectedRoute>
            <ProtectedRoute exact path={`${path}/chart/add`}>
              <ChartofAccountsInfo add />
            </ProtectedRoute>
            <ProtectedRoute exact path={`${path}/chart/view`}>
              <ChartofAccountsInfo />
            </ProtectedRoute>
            <ProtectedRoute exact path={`${path}/chart/view/transaction`}>
              <div>TEST</div>
            </ProtectedRoute>
            <ProtectedRoute exact path={`${path}/journal`}>
              <JournalEntryComponent />
            </ProtectedRoute>
            <ProtectedRoute exact path={`${path}/journal/add`}>
              <JournalEntryInfo add />
            </ProtectedRoute>
          </Switch>
        </main>
        <FooterComponent />
      </div>
    </>
  );
}
