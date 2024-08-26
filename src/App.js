import "./styles/main.scss";
import "./index.scss";
import React from "react";
import { Switch } from "react-router-dom";

import "./styles/main.scss";

import SuccessSnackbar from "./components/SnackbarComponent";

// import FormInputScreen from './pages/FormInputScreen'
import HomeScreen from "./pages/HomeScreen";
import SalesScreen from "./pages/SalesScreen";
import InventoryScreen from "./pages/InventoryScreen";
// import LogisticsScreen from './pages/LogisticsScreen'
// import ConfigurationScreen from './pages/ConfigurationScreen'
import LoginScreen from "./pages/LoginScreen";
import KitScreen from "./pages/KitScreen";
import JodScreen from "./pages/JodScreen";
import EmployeeScreen from "./pages/EmployeeScreen";
import NotiScreen from "./pages/NotiScreen";
import ApprovalScreen from "./pages/ApprovalScreen";
import PurchaseScreen from "./pages/PurchaseScreen";
import IncomeScreen from "./pages/IncomeScreen";
import ExpenseScreen from "./pages/ExpenseScreen";
import AccountingScreen from "./pages/AccountingScreen";  
import EngineerScreen from "./pages/EngineerScreen";
import ConfigScreen from "./pages/ConfigScreen";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <>
      <Switch>
        <ProtectedRoute path="/" exact component={HomeScreen} />
        <PublicRoute path="/login" exact component={LoginScreen} />
        <ProtectedRoute path="/sales" component={SalesScreen} />
        <ProtectedRoute path="/employee" component={EmployeeScreen} />
        <ProtectedRoute path="/inventory" component={InventoryScreen} />
        <ProtectedRoute path="/engineer" component={EngineerScreen} />
        <ProtectedRoute path="/purchase" component={PurchaseScreen} />
        <ProtectedRoute path="/income" component={IncomeScreen} />
        <ProtectedRoute path="/expense" component={ExpenseScreen} />
        <ProtectedRoute path="/accounting" component={AccountingScreen} />
        <ProtectedRoute path="/config" component={ConfigScreen} />
        <ProtectedRoute path="/notification" component={NotiScreen} />
        <ProtectedRoute path="/approval" component={ApprovalScreen} />

        <ProtectedRoute path="/kitscreen" exact component={KitScreen} />
        <ProtectedRoute path="/jod" exact component={JodScreen} />
        {/* <ProtectedRoute path="/logistics" component={LogisticsScreen} />
        <ProtectedRoute path="/configuration" component={ConfigurationScreen} /> */}
      </Switch>
      <SuccessSnackbar />
    </>
  );
}

export default App;
