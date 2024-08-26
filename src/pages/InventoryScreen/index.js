import React from "react";
import { Switch, Route, useRouteMatch, Link } from "react-router-dom";
// import HomeSection from "../../components/HomeSection";
import NavLeftComponent from "../../components/NavLeftComponent";
import NavTopComponent from "../../components/NavTopComponent";
import FooterComponent from "../../components/FooterComponent";
import ItemMasterDataComponent from "../../components/ItemMasterDataComponent";
import AddItemInventoryComponent from "../../components/AddInventoryItemComponent";
import GoodsReceiptComponent from "../../components/GoodsReceiptComponent";
import AddGoodsReceiptComponent from "../../components/AddGoodsReceiptComponent";
import GoodsIssueComponent from "../../components/GoodsIssueComponent";
import AddGoodsIssueComponent from "../../components/AddGoodsIssueComponent";
import StockCountComponent from "../../components/StockCountComponent";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import LibraryAddCheckOutlinedIcon from "@mui/icons-material/LibraryAddCheckOutlined";
import FindInPageRoundedIcon from "@mui/icons-material/FindInPageRounded";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AddStockCountComponent from "../../components/AddStockCountComponent";
import LedgerComponent from "../../components/LedgerComponent";
import ReportInventoryComponent from "../../components/ReportInventoryComponent";
import InventoryItemComponent from "../../components/InventoryItemComponent";
import ReportItemsComponent from "../../components/ReportInventoryComponent/ReportItemsComponent";
import ReportOnhandItemComponent from "../../components/ReportInventoryComponent/ReporOnhandItemsComponent";

import Breadcrumbs from "@mui/material/Breadcrumbs";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";
import GoodsReceiptItemComponent from "../../components/GoodsReceiptItemComponent";
import GoodsIssueItemComponent from "../../components/GoodsIssueItemComponent";
import GoodsTransferComponent from "../../components/Inventory/GoodsTransferComponent";
import AddGoodsTransferComponent from "../../components/Inventory/AddGoodsTransferComponent";
import GoodsTransferItemComponent from "../../components/Inventory/GoodsTransferItemComponent";
import StockCountItemComponent from "../../components/StockCountItemComponent";

export default function InventoryScreen() {
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
                <Link to={`${path}/item-master`}>
                  <li className="menu-button">
                    <Inventory2OutlinedIcon />
                    <div>สินค้า</div>
                  </li>
                </Link>
                <Link to={`${path}/good-recieve`}>
                  <li className="menu-button">
                    <ArrowForwardOutlinedIcon />
                    <div>นำเข้า</div>
                  </li>
                </Link>
                <Link to={`${path}/good-issue`}>
                  <li className="menu-button">
                    <ArrowBackOutlinedIcon />
                    <div>นำออก</div>
                  </li>
                </Link>
                <Link to={`${path}/good-transfer`}>
                  <li className="menu-button">
                    <CompareArrowsIcon />
                    <div>โอนย้าย</div>
                  </li>
                </Link>
                <Link to={`${path}/stock-count`}>
                  <li className="menu-button">
                    <LibraryAddCheckOutlinedIcon />
                    <div>ปรับลดยอด</div>
                  </li>
                </Link>
                <Link to={`/income/delivery-order`}>
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
            <Route exact path={`${path}/item-master`}>
              <ItemMasterDataComponent />
            </Route>
            <Route exact path={`${path}/item-master/add`}>
              <AddItemInventoryComponent />
            </Route>
            <Route exact path={`${path}/item-master/:id`}>
              <InventoryItemComponent />
            </Route>
            <Route exact path={`${path}/good-recieve`}>
              <GoodsReceiptComponent />
            </Route>
            <Route exact path={`${path}/good-recieve/:txSeries&:id`}>
              <GoodsReceiptItemComponent />
            </Route>
            <Route exact path={`${path}/good-recieve/add`}>
              <AddGoodsReceiptComponent />
            </Route>
            <Route exact path={`${path}/good-issue`}>
              <GoodsIssueComponent />
            </Route>
            <Route exact path={`${path}/good-issue/add`}>
              <AddGoodsIssueComponent />
            </Route>
            <Route exact path={`${path}/good-issue/:txSeries&:id`}>
              <GoodsIssueItemComponent />
            </Route>
            <Route exact path={`${path}/good-transfer`}>
              <GoodsTransferComponent />
            </Route>
            <Route exact path={`${path}/good-transfer/add`}>
              <AddGoodsTransferComponent />
            </Route>
            <Route exact path={`${path}/good-transfer/:txSeries&:id`}>
              <GoodsTransferItemComponent />
            </Route>
            <Route exact path={`${path}/stock-count`}>
              <StockCountComponent />
            </Route>
            <Route exact path={`${path}/stock-count/add`}>
              <AddStockCountComponent />
            </Route>
            <Route exact path={`${path}/stock-count/:txSeries&:id`}>
              <StockCountItemComponent />
            </Route>
            <Route exact path={`${path}/report`}>
              <ReportInventoryComponent />
            </Route>
            <Route exact path={`${path}/report/ledger`}>
              <LedgerComponent />
            </Route>
            <Route exact path={`${path}/report/items`}>
              <ReportItemsComponent />
            </Route>
            <Route exact path={`${path}/report/onhanditems`}>
              <ReportOnhandItemComponent />
            </Route>
          </Switch>
        </main>
        <FooterComponent />
      </div>
    </>
  );
}
