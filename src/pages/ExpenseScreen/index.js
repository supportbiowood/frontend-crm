import React from "react";
import { Switch, Route, useRouteMatch, Link } from "react-router-dom";
import NavLeftComponent from "../../components/NavLeftComponent";
import NavTopComponent from "../../components/NavTopComponent";
import FooterComponent from "../../components/FooterComponent";

import FindInPageRoundedIcon from "@mui/icons-material/FindInPageRounded";
import DescriptionIcon from "@mui/icons-material/Description";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";
import PurchaseRequestComponent from "../../components/Account/AccountPurchase/PurchaseRequest/PurchaseRequestComponent";
import AddPurchaseRequestComponent from "../../components/Account/AccountPurchase/PurchaseRequest/AddPurchaseRequestComponent";
import PurchaseOrderComponent from "../../components/Account/AccountPurchase/PurchaseOrder/PurchaseOrderComponent";
import AddPurchaseOrderComponent from "../../components/Account/AccountPurchase/PurchaseOrder/AddPurchaseOrderComponent";
import PurchaseInvoiceComponent from "../../components/Account/AccountPurchase/PurchaseInvoice/PurchaseInvoiceComponent";
import AddPurchaseInvoiceComponent from "../../components/Account/AccountPurchase/PurchaseInvoice/AddPurchaseInvoiceComponent";
import PaymentMadeComponent from "../../components/Account/AccountPurchase/PaymentMade/PaymentMadeComponent";
import AddPaymentMadeComponent from "../../components/Account/AccountPurchase/PaymentMade/AddPaymentMade";
import CombinedPaymentComponent from "../../components/Account/AccountPurchase/CombinedPayment/CombinedPaymentComponent";
import AddCombinedPaymentComponent from "../../components/Account/AccountPurchase/CombinedPayment/AddCombinedPaymentComponent";
import PurchaseReturnComponent from "../../components/Account/AccountPurchase/PurchaseReturn/PurchaseReturnComponent";
import AddPurchaseReturnComponent from "../../components/Account/AccountPurchase/PurchaseReturn/AddPurchaseReturnComponent";
import ExpensesComponent from "../../components/Account/AccountPurchase/Expenses/ExpensesComponent";
import AddExpensesComponent from "../../components/Account/AccountPurchase/Expenses/AddExpensesComponent";
import DebitNoteComponent from "../../components/Account/AccountPurchase/DebitNote/DebitNoteComponent";
import AddDebitNoteComponent from "../../components/Account/AccountPurchase/DebitNote/AddDebitNoteComponent";
import PurchaseRequestPdfComponent from "../../components/Account/AccountPurchase/PurchaseRequest/PurchaseRequestPdfComponent";
import PurchaseOrderPdfComponent from "../../components/Account/AccountPurchase/PurchaseOrder/PurchaseOrderPdfComponent";
import PurchaseInvoicePdfComponent from "../../components/Account/AccountPurchase/PurchaseInvoice/PurchaseInvoicePdfComponent";
import ExpensesPdfComponent from "../../components/Account/AccountPurchase/Expenses/ExpensesPdfComponent";
import DebitNotePdfComponent from "../../components/Account/AccountPurchase/DebitNote/DebitNotePdfComponent";
import CombinedPaymentPdfComponent from "../../components/Account/AccountPurchase/CombinedPayment/CombinedPaymentPdfComponent";
import PaymentMadePdfComponent from "../../components/Account/AccountPurchase/PaymentMade/PaymentMadePdfComponent";

export default function ExpenseScreen() {
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
                <BreadcrumbComponent name="รายจ่าย" to="/expense" />
              </Breadcrumbs>
              <ul className="grid-container-nav-button">
                <Link to={`${path}/purchase-request`}>
                  <li className="menu-button">
                    <DescriptionIcon />
                    <div>ใบขอซื้อ</div>
                  </li>
                </Link>
                <Link to={`${path}/purchase-order`}>
                  <li className="menu-button">
                    <DescriptionIcon />
                    <div>ใบสั่งซื้อ</div>
                  </li>
                </Link>
                <Link to={`${path}/purchase-invoice`}>
                  <li className="menu-button">
                    <DescriptionIcon />
                    <div>บันทึกซื้อ</div>
                  </li>
                </Link>
                <Link to={`${path}/payment-made`}>
                  <li className="menu-button">
                    <DescriptionIcon />
                    <div>การชำระเงิน</div>
                  </li>
                </Link>
                <Link to={`${path}/combined-payment`}>
                  <li className="menu-button">
                    <DescriptionIcon />
                    <div>ใบรวมจ่าย</div>
                  </li>
                </Link>
                <Link to={`${path}/expense-note`}>
                  <li className="menu-button">
                    <DescriptionIcon />
                    <div>บันทึกค่าใช้จ่าย</div>
                  </li>
                </Link>
                <Link to={`${path}/purchase-return`}>
                  <li className="menu-button">
                    <DescriptionIcon />
                    <div>ใบส่งคืน</div>
                  </li>
                </Link>
                <Link to={`${path}/debit-note`}>
                  <li className="menu-button">
                    <DescriptionIcon />
                    <div>รับใบลดหนี้</div>
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

            <Route exact path={`${path}/purchase-request`}>
              <PurchaseRequestComponent />
            </Route>
            <Route exact path={`${path}/purchase-request/add`}>
              <AddPurchaseRequestComponent />
            </Route>
            <Route exact path={`${path}/purchase-request/:id`}>
              <AddPurchaseRequestComponent />
            </Route>
            <Route exact path={`${path}/purchase-request/:id/pdf`}>
              <PurchaseRequestPdfComponent />
            </Route>

            <Route exact path={`${path}/purchase-order`}>
              <PurchaseOrderComponent />
            </Route>
            <Route exact path={`${path}/purchase-order/add`}>
              <AddPurchaseOrderComponent />
            </Route>
            <Route exact path={`${path}/purchase-order/:id`}>
              <AddPurchaseOrderComponent />
            </Route>
            <Route exact path={`${path}/purchase-order/:id/pdf`}>
              <PurchaseOrderPdfComponent />
            </Route>

            <Route exact path={`${path}/purchase-invoice`}>
              <PurchaseInvoiceComponent />
            </Route>
            <Route exact path={`${path}/purchase-invoice/add`}>
              <AddPurchaseInvoiceComponent />
            </Route>
            <Route exact path={`${path}/purchase-invoice/:id`}>
              <AddPurchaseInvoiceComponent />
            </Route>
            <Route exact path={`${path}/purchase-invoice/:id/pdf`}>
              <PurchaseInvoicePdfComponent />
            </Route>

            <Route exact path={`${path}/payment-made`}>
              <PaymentMadeComponent />
            </Route>
            <Route exact path={`${path}/payment-made/add`}>
              <AddPaymentMadeComponent />
            </Route>
            <Route exact path={`${path}/payment-made/:id`}>
              <AddPaymentMadeComponent />
            </Route>
            <Route exact path={`${path}/payment-made/:id/pdf`}>
              <PaymentMadePdfComponent />
            </Route>

            <Route exact path={`${path}/combined-payment`}>
              <CombinedPaymentComponent />
            </Route>
            <Route exact path={`${path}/combined-payment/add`}>
              <AddCombinedPaymentComponent />
            </Route>
            <Route exact path={`${path}/combined-payment/:id`}>
              <AddCombinedPaymentComponent />
            </Route>
            <Route exact path={`${path}/combined-payment/:id/pdf`}>
              <CombinedPaymentPdfComponent />
            </Route>

            <Route exact path={`${path}/expenses`}>
              <ExpensesComponent />
            </Route>
            <Route exact path={`${path}/expenses/add`}>
              <AddExpensesComponent />
            </Route>
            <Route exact path={`${path}/expenses/:id`}>
              <AddExpensesComponent />
            </Route>
            <Route exact path={`${path}/expenses/:id/pdf`}>
              <ExpensesPdfComponent />
            </Route>

            <Route exact path={`${path}/purchase-return`}>
              <PurchaseReturnComponent />
            </Route>
            <Route exact path={`${path}/purchase-return/add`}>
              <AddPurchaseReturnComponent />
            </Route>
            <Route exact path={`${path}/purchase-return/:id`}>
              <AddPurchaseReturnComponent />
            </Route>

            <Route exact path={`${path}/debit-note`}>
              <DebitNoteComponent />
            </Route>
            <Route exact path={`${path}/debit-note/add`}>
              <AddDebitNoteComponent />
            </Route>
            <Route exact path={`${path}/debit-note/:id`}>
              <AddDebitNoteComponent />
            </Route>
            <Route exact path={`${path}/debit-note/:id/pdf`}>
              <DebitNotePdfComponent />
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
