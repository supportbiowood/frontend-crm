import React from 'react'
import { Switch, Route, useRouteMatch, Link } from 'react-router-dom'
import NavLeftComponent from '../../components/NavLeftComponent'
import NavTopComponent from '../../components/NavTopComponent'
import FooterComponent from '../../components/FooterComponent'

import FindInPageRoundedIcon from '@mui/icons-material/FindInPageRounded'
import DescriptionIcon from '@mui/icons-material/Description'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'

import Breadcrumbs from '@mui/material/Breadcrumbs'
import BreadcrumbComponent from '../../components/BreadcrumbComponent'
import QuotationComponent from '../../components/Account/AccountSales/Quotation/QuotationComponent'
import AddQuotationComponent from '../../components/Account/AccountSales/Quotation/AddQuotationComponent'
import SalesOrderComponent from '../../components/Account/AccountSales/SalesOrder/SalesOrderComponent'
import SalesInvoiceComponent from '../../components/Account/AccountSales/SalesInvoice/SalesInvoiceComponent'
import PaymentComponent from '../../components/Account/AccountSales/Payment/PaymentComponent'
import AddSalesOrderComponent from '../../components/Account/AccountSales/SalesOrder/AddSalesOrderComponent'
import AddSalesInvoiceComponent from '../../components/Account/AccountSales/SalesInvoice/AddSalesInvoiceComponent'
import AddPaymentComponent from '../../components/Account/AccountSales/Payment/AddPaymentComponent'
import DeliveryOrderComponent from '../../components/Account/AccountSales/DeliveryOrder/DeliveryOrderComponent'
import AddDeliveryOrderComponent from '../../components/Account/AccountSales/DeliveryOrder/AddDeliveryOrderComponent'
import AddBillingNoteComponent from '../../components/Account/AccountSales/BillingNote/AddBillingNoteComponent'
import QuotationPdfComponent from '../../components/Account/AccountSales/Quotation/QuotationPdfComponent'
import SalesOrderPdfComponent from '../../components/Account/AccountSales/SalesOrder/SalesOrderPdfComponent'
import SalesInvoicePdfComponent from '../../components/Account/AccountSales/SalesInvoice/SalesInvoicePdfComponent'
import BillingNotePdfComponent from '../../components/Account/AccountSales/BillingNote/BillingNotePdfComponent'
import DeliveryOrderPdfComponent from '../../components/Account/AccountSales/DeliveryOrder/DeliveryOrderPdfComponent'
import PaymentPdfComponent from '../../components/Account/AccountSales/Payment/PaymentPdfComponent'
import CreditNotePdfComponent from '../../components/Account/AccountSales/CreditNote/CreditNotePdfComponent'
import DepositInvoicePdfComponent from '../../components/Account/AccountSales/DepositInvoice/DepositInvoicePdfComponent'
import BillingNoteComponent from '../../components/Account/AccountSales/BillingNote/BillingNoteComponent'
import SalesReturnComponent from '../../components/Account/AccountSales/SalesReturn/SalesReturnComponent'
import AddSalesReturnComponent from '../../components/Account/AccountSales/SalesReturn/AddSalesReturnComponent'
import CreditNoteComponent from '../../components/Account/AccountSales/CreditNote/CreditNoteComponent'
import AddCreditNoteComponent from '../../components/Account/AccountSales/CreditNote/AddCreditNoteComponent'
import DepositInvoiceComponent from '../../components/Account/AccountSales/DepositInvoice/DepositInvoiceComponent'
import AddDepositInvoiceComponent from '../../components/Account/AccountSales/DepositInvoice/AddDepositInvoiceComponent'
import ReportIncomeComponent from "../../components/ReportIncomeComponent";

export default function IncomeScreen() {
  const { path } = useRouteMatch()
  return (
    <>
      <NavLeftComponent />
      <div className={'whole-wrapper'}>
        <NavTopComponent />
        <main>
          <Switch>
            <Route exact path={`${path}`}>
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                <BreadcrumbComponent name="รายรับ" to="/income" />
              </Breadcrumbs>
              <ul className="grid-container-nav-button">
                <Link to={`${path}/quotation`}>
                  <li className="menu-button">
                    <DescriptionIcon />
                    <div>ใบเสนอราคา</div>
                  </li>
                </Link>
                <Link to={`${path}/sales-order`}>
                  <li className="menu-button">
                    <DescriptionIcon />
                    <div>ใบสั่งขาย</div>
                  </li>
                </Link>
                <Link to={`${path}/sales-invoice`}>
                  <li className="menu-button">
                    <DescriptionIcon />
                    <div>ใบแจ้งหนี้</div>
                  </li>
                </Link>
                <Link to={`${path}/payment-receipt`}>
                  <li className="menu-button">
                    <DescriptionIcon />
                    <div>การรับชำระ</div>
                  </li>
                </Link>
                <Link to={`${path}/billing-note`}>
                  <li className="menu-button">
                    <DescriptionIcon />
                    <div>ใบวางบิล</div>
                  </li>
                </Link>
                <Link to={`${path}/sales-return`}>
                  <li className="menu-button">
                    <DescriptionIcon />
                    <div>ใบรับคืน</div>
                  </li>
                </Link>
                <Link to={`${path}/credit-note`}>
                  <li className="menu-button">
                    <DescriptionIcon />
                    <div>ใบลดหนี้</div>
                  </li>
                </Link>
                <Link to={`${path}/deposit-invoice`}>
                  <li className="menu-button">
                    <DescriptionIcon />
                    <div>ใบแจ้งหนี้มัดจำ</div>
                  </li>
                </Link>
                <Link to={`${path}/delivery-order`}>
                  <li className="menu-button">
                    <LocalShippingOutlinedIcon />
                    <div>ใบส่งของ</div>
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
            <Route exact path={`${path}/quotation`}>
              <QuotationComponent />
            </Route>
            <Route exact path={`${path}/quotation/add`}>
              <AddQuotationComponent />
            </Route>
            <Route exact path={`${path}/quotation/:id`}>
              <AddQuotationComponent />
            </Route>
            <Route exact path={`${path}/quotation/:id/pdf`}>
              <QuotationPdfComponent />
            </Route>

            <Route exact path={`${path}/sales-order`}>
              <SalesOrderComponent />
            </Route>
            <Route exact path={`${path}/sales-order/add`}>
              <AddSalesOrderComponent />
            </Route>
            <Route exact path={`${path}/sales-order/:id`}>
              <AddSalesOrderComponent />
            </Route>
            <Route exact path={`${path}/sales-order/:id/pdf`}>
              <SalesOrderPdfComponent />
            </Route>

            <Route exact path={`${path}/sales-invoice`}>
              <SalesInvoiceComponent />
            </Route>
            <Route exact path={`${path}/sales-invoice/add`}>
              <AddSalesInvoiceComponent />
            </Route>
            <Route exact path={`${path}/sales-invoice/:id`}>
              <AddSalesInvoiceComponent />
            </Route>
            <Route exact path={`${path}/sales-invoice/:id/pdf`}>
              <SalesInvoicePdfComponent />
            </Route>

            <Route exact path={`${path}/payment-receipt`}>
              <PaymentComponent />
            </Route>
            <Route exact path={`${path}/payment-receipt/add`}>
              <AddPaymentComponent />
            </Route>
            <Route exact path={`${path}/payment-receipt/:id`}>
              <AddPaymentComponent />
            </Route>
            <Route exact path={`${path}/payment-receipt/:id/pdf`}>
              <PaymentPdfComponent />
            </Route>

            <Route exact path={`${path}/billing-note`}>
              <BillingNoteComponent />
            </Route>
            <Route exact path={`${path}/billing-note/add`}>
              <AddBillingNoteComponent />
            </Route>
            <Route exact path={`${path}/billing-note/:id`}>
              <AddBillingNoteComponent />
            </Route>
            <Route exact path={`${path}/billing-note/:id/pdf`}>
              <BillingNotePdfComponent />
            </Route>

            <Route exact path={`${path}/sales-return`}>
              <SalesReturnComponent />
            </Route>
            <Route exact path={`${path}/sales-return/add`}>
              <AddSalesReturnComponent />
            </Route>
            <Route exact path={`${path}/sales-return/:id`}>
              <AddSalesReturnComponent />
            </Route>

            <Route exact path={`${path}/credit-note`}>
              <CreditNoteComponent />
            </Route>
            <Route exact path={`${path}/credit-note/add`}>
              <AddCreditNoteComponent />
            </Route>
            <Route exact path={`${path}/credit-note/:id`}>
              <AddCreditNoteComponent />
            </Route>
            <Route exact path={`${path}/credit-note/:id/pdf`}>
              <CreditNotePdfComponent />
            </Route>

            <Route exact path={`${path}/deposit-invoice`}>
              <DepositInvoiceComponent />
            </Route>
            <Route exact path={`${path}/deposit-invoice/add`}>
              <AddDepositInvoiceComponent />
            </Route>
            <Route exact path={`${path}/deposit-invoice/:id`}>
              <AddDepositInvoiceComponent />
            </Route>
            <Route exact path={`${path}/deposit-invoice/:id/pdf`}>
              <DepositInvoicePdfComponent />
            </Route>

            <Route exact path={`${path}/delivery-order`}>
              <DeliveryOrderComponent />
            </Route>
            <Route exact path={`${path}/delivery-order/add`}>
              <AddDeliveryOrderComponent />
            </Route>
            <Route exact path={`${path}/delivery-order/:id`}>
              <AddDeliveryOrderComponent />
            </Route>
            <Route exact path={`${path}/delivery-order/:id/pdf`}>
              <DeliveryOrderPdfComponent />
            </Route>

            <Route path={`${path}/report`}>
              <ReportIncomeComponent />
            </Route>
          </Switch>
        </main>
        <FooterComponent />
      </div>
    </>
  )
}
