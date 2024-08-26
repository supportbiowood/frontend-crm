import React from 'react'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import BreadcrumbComponent from '../../components/BreadcrumbComponent'
import { Link } from 'react-router-dom'
import { Switch, Route, useRouteMatch } from 'react-router-dom'

import ReportIncomeCustomer from './ReportIncomeCustomer'
import ReportIncomeInvoice from './ReportIncomeInvoice'
import ReportIncomeProduct from './ReportIncomeProduct'
import ReportIncomeQuotation from './ReportIncomeQuotation'
import ReportIncomeSalesOrder from './ReportIncomeSalesOrder'

export default function ReportIncomeComponent(props) {
  const { path } = useRouteMatch()

  return (
    <>
      <Switch>
        <Route exact path={`${path}`}>
          <ReportHome />
        </Route>
        <Route exact path={`${path}/1`}>
          <ReportIncomeCustomer />
        </Route>
        <Route exact path={`${path}/2`}>
          <ReportIncomeProduct />
        </Route>
        <Route exact path={`${path}/3`}>
          <ReportIncomeQuotation />
        </Route>
        <Route exact path={`${path}/4`}>
          <ReportIncomeSalesOrder />
        </Route>
        <Route exact path={`${path}/5`}>
          <ReportIncomeInvoice />
        </Route>
      </Switch>
    </>
  )
}

function ReportHome(props) {
  const { path } = useRouteMatch()
  return (
    <>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <BreadcrumbComponent name="รายรับ" key="1" to="/income" />
        <BreadcrumbComponent name="รายงาน" key="2" to="/income/report" />
      </Breadcrumbs>
      <div className="grid-container-25 myReportSelection">
        <div>
          <Link to={`${path}/1`}>รายงานยอดขายรายลูกค้า</Link>
        </div>
        <div>
          <Link to={`${path}/2`}>รายงานยอดขายรายสินค้า</Link>
        </div>
        <div>
          <Link to={`${path}/3`}>รายงานใบเสนอราคา</Link>
        </div>
        <div>
          <Link to={`${path}/4`}>รายงานใบสั่งขาย</Link>
        </div>
        <div>
          <Link to={`${path}/5`}>รายงานใบแจ้งหนี้</Link>
        </div>
      </div>
    </>
  )
}
