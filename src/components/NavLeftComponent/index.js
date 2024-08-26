import React from "react";
import { Link } from "react-router-dom";
import { removeUserSession } from "../../adapter/Auth";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import HomeWorkRoundedIcon from "@mui/icons-material/HomeWorkRounded";
import PersonPinRoundedIcon from "@mui/icons-material/PersonPinRounded";
import EventRoundedIcon from "@mui/icons-material/EventRounded";
import FindInPageRoundedIcon from "@mui/icons-material/FindInPageRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AppsOutlinedIcon from "@mui/icons-material/AppsOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import LibraryAddCheckOutlinedIcon from "@mui/icons-material/LibraryAddCheckOutlined";
import EngineeringOutlinedIcon from "@mui/icons-material/EngineeringOutlined";
import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DoDisturbOnOutlinedIcon from "@mui/icons-material/DoDisturbOnOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import AddModeratorOutlinedIcon from "@mui/icons-material/AddModeratorOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import GroupsIcon from "@mui/icons-material/Groups";
import FileUploadIcon from "@mui/icons-material/FileUpload";

export default function NavTopComponent() {
  return (
    <>
      <nav className="navbar">
        <ul className="navbar-nav">
          <li className="logo">
            <Link to="/" className="nav-link-heading">
              <span className="link-text logo-text">
                <Link to="/">
                  <img alt="biowood-logo" src="/logos/biowood-logo.png" />
                </Link>
              </span>
              <MenuRoundedIcon />
            </Link>
          </li>

          {/* <li className="nav-item">
            <Link to="/" className="nav-link main-menu">
              <HomeOutlinedIcon />
              <span className="link-text">หน้าแรก</span>
            </Link>
          </li> */}

          <li className="nav-item">
            <Link to="/sales" className="nav-link main-menu">
              <AttachMoneyRoundedIcon />
              <span className="link-text">การขาย</span>
            </Link>
            <ul className="sub-menu">
              <li>
                <Link to="/sales/event" className="nav-link">
                  <EventRoundedIcon />
                  แผนการทำงาน
                </Link>
              </li>
              <li>
                <Link to="/sales/project" className="nav-link">
                  <HomeWorkRoundedIcon />
                  โครงการ
                </Link>
              </li>
              <li>
                <Link to="/sales/contact" className="nav-link">
                  <PersonPinRoundedIcon />
                  ผู้ติดต่อ
                </Link>
              </li>
              <li>
                <Link to="/income/quotation" className="nav-link">
                  <DescriptionOutlinedIcon />
                  ใบเสนอราคา
                </Link>
              </li>
              <li>
                <Link to="/income/sales-order" className="nav-link">
                  <DescriptionOutlinedIcon />
                  ใบสั่งขาย
                </Link>
              </li>
              <li>
                <Link to="/sales/report" className="nav-link">
                  <FindInPageRoundedIcon />
                  รายงาน
                </Link>
              </li>
              {/* <li><Link to="/" className="nav-link"><AddCircleRoundedIcon/> สร้างใบเสนอราคา</Link></li>
          <li><Link to="/" className="nav-link"><AddCircleRoundedIcon/> สร้างใบถอดแบบ</Link></li> */}
            </ul>
          </li>

          <li className="nav-item">
            <Link to="/inventory" className="nav-link main-menu">
              <Inventory2OutlinedIcon />
              <span className="link-text">คลังสินค้า</span>
            </Link>
            <ul className="sub-menu">
              <li>
                <Link to="/inventory/item-master" className="nav-link">
                  <AppsOutlinedIcon />
                  สินค้า
                </Link>
              </li>
              <li>
                <Link to="/inventory/good-recieve" className="nav-link">
                  <ArrowForwardOutlinedIcon />
                  นำเข้า
                </Link>
              </li>
              <li>
                <Link to="/inventory/good-issue" className="nav-link">
                  <ArrowBackOutlinedIcon />
                  นำออก
                </Link>
              </li>
              <li>
                <Link to="/inventory/good-transfer" className="nav-link">
                  <CompareArrowsIcon />
                  โอนย้าย
                </Link>
              </li>
              <li>
                <Link to="/inventory/stock-count" className="nav-link">
                  <LibraryAddCheckOutlinedIcon />
                  ปรับลดยอด
                </Link>
              </li>
              <li>
                <Link to="/income/delivery-order" className="nav-link">
                  <LocalShippingOutlinedIcon />
                  ใบส่งของ
                </Link>
              </li>
              <li>
                <Link to="/inventory/report" className="nav-link">
                  <FindInPageRoundedIcon />
                  รายงาน
                </Link>
              </li>
            </ul>
          </li>

          <li className="nav-item">
            <Link to="/engineer" className="nav-link main-menu">
              <EngineeringOutlinedIcon />
              <span className="link-text">ถอดแบบ/ติดตั้ง</span>
            </Link>
            <ul className="sub-menu">
              <li>
                <Link to="/engineer/estimate" className="nav-link">
                  <DescriptionOutlinedIcon />
                  ใบถอดแบบ/ติดตั้ง
                </Link>
              </li>
            </ul>
          </li>

          <li className="nav-item">
            <Link to="/purchase" className="nav-link main-menu">
              <AddShoppingCartRoundedIcon />
              <span className="link-text">จัดซื้อ</span>
            </Link>
            <ul className="sub-menu">
              <li>
                <Link to="/expense/purchase-request" className="nav-link">
                  <DescriptionOutlinedIcon />
                  ใบขอซื้อ
                </Link>
              </li>
              <li>
                <Link to="/expense/purchase-order" className="nav-link">
                  <DescriptionOutlinedIcon />
                  ใบสั่งซื้อ
                </Link>
              </li>
              <li>
                <Link to="/purchase/contact" className="nav-link">
                  <PersonPinRoundedIcon />
                  ผู้ติดต่อ
                </Link>
              </li>
              <li>
                <Link to="/purchase/report" className="nav-link">
                  <FindInPageRoundedIcon />
                  รายงาน
                </Link>
              </li>
            </ul>
          </li>

          <li className="nav-item">
            <Link to="/income" className="nav-link main-menu">
              <AddCircleOutlineOutlinedIcon />
              <span className="link-text">รายรับ</span>
            </Link>
            <ul className="sub-menu">
              <li>
                <Link to="/income/quotation" className="nav-link">
                  <DescriptionOutlinedIcon />
                  ใบเสนอราคา
                </Link>
              </li>
              <li>
                <Link to="/income/sales-order" className="nav-link">
                  <DescriptionOutlinedIcon />
                  ใบสั่งขาย
                </Link>
              </li>
              <li>
                <Link to="/income/sales-invoice" className="nav-link">
                  <DescriptionOutlinedIcon />
                  ใบแจ้งหนี้
                </Link>
              </li>
              <li>
                <Link to="/income/payment-receipt" className="nav-link">
                  <DescriptionOutlinedIcon />
                  การรับชำระ
                </Link>
              </li>
              <li>
                <Link to="/income/billing-note" className="nav-link">
                  <DescriptionOutlinedIcon />
                  ใบวางบิล
                </Link>
              </li>
              <li>
                <Link to="/income/sales-return" className="nav-link">
                  <DescriptionOutlinedIcon />
                  ใบรับคืน
                </Link>
              </li>
              <li>
                <Link to="/income/credit-note" className="nav-link">
                  <DescriptionOutlinedIcon />
                  ใบลดหนี้
                </Link>
              </li>
              <li>
                <Link to="/income/deposit-invoice" className="nav-link">
                  <DescriptionOutlinedIcon />
                  ใบแจ้งหนี้มัดจำ
                </Link>
              </li>
              <li>
                <Link to="/income/delivery-order" className="nav-link">
                  <LocalShippingOutlinedIcon />
                  ใบส่งของ
                </Link>
              </li>
              <li>
                <Link to="/income/report" className="nav-link">
                  <FindInPageRoundedIcon />
                  รายงาน
                </Link>
              </li>
            </ul>
          </li>

          <li className="nav-item">
            <Link to="/expense" className="nav-link main-menu">
              <DoDisturbOnOutlinedIcon />
              <span className="link-text">รายจ่าย</span>
            </Link>
            <ul className="sub-menu">
              <li>
                <Link to="/expense/purchase-request" className="nav-link">
                  <DescriptionOutlinedIcon />
                  ใบขอซื้อ
                </Link>
              </li>
              <li>
                <Link to="/expense/purchase-order" className="nav-link">
                  <DescriptionOutlinedIcon />
                  ใบสั่งซื้อ
                </Link>
              </li>
              <li>
                <Link to="/expense/purchase-invoice" className="nav-link">
                  <DescriptionOutlinedIcon />
                  บันทึกซื้อ
                </Link>
              </li>
              <li>
                <Link to="/expense/payment-made" className="nav-link">
                  <DescriptionOutlinedIcon />
                  การชำระเงิน
                </Link>
              </li>
              <li>
                <Link to="/expense/combined-payment" className="nav-link">
                  <DescriptionOutlinedIcon />
                  ใบรวมจ่าย
                </Link>
              </li>
              <li>
                <Link to="/expense/expenses" className="nav-link">
                  <DescriptionOutlinedIcon />
                  บันทึกค่าใช้จ่าย
                </Link>
              </li>
              <li>
                <Link to="/expense/purchase-return" className="nav-link">
                  <DescriptionOutlinedIcon />
                  ใบส่งคืน
                </Link>
              </li>
              <li>
                <Link to="/expense/debit-note" className="nav-link">
                  <DescriptionOutlinedIcon />
                  รับใบลดหนี้
                </Link>
              </li>
              <li>
                <Link to="/expense/report" className="nav-link">
                  <FindInPageRoundedIcon />
                  รายงาน
                </Link>
              </li>
            </ul>
          </li>

          <li className="nav-item">
            <Link to="/accounting" className="nav-link main-menu">
              <AccountBalanceOutlinedIcon />
              <span className="link-text">บัญชี</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/employee" className="nav-link main-menu">
              <PeopleAltOutlinedIcon />
              <span className="link-text">บัญชีผู้ใช้</span>
            </Link>
            <ul className="sub-menu">
              <li>
                <Link to="/employee" className="nav-link">
                  <PeopleAltOutlinedIcon />
                  บัญชีผู้ใช้
                </Link>
              </li>
              <li>
                <Link to="/employee/permission" className="nav-link">
                  <AddModeratorOutlinedIcon />
                  จัดการสิทธิ
                </Link>
              </li>
              <li>
                <Link to="/employee/team" className="nav-link">
                  <GroupsIcon />
                  จัดการทีม
                </Link>
              </li>
              {/* <li>
                <Link to="/employee/report" className="nav-link">
                  <FindInPageRoundedIcon />
                  รายงาน
                </Link>
              </li> */}
            </ul>
          </li>

          <li className="nav-item">
            <Link to="/config" className="nav-link main-menu">
              <SettingsOutlinedIcon />
              <span className="link-text">ตั้งค่า</span>
            </Link>
            <ul className="sub-menu">
              <li>
                <Link to="/config" className="nav-link">
                  <SettingsOutlinedIcon />
                  ตั้งค่า
                </Link>
              </li>
              <li>
                <Link to="/config/importer" className="nav-link">
                  <FileUploadIcon />
                  นำเข้าข้อมูล
                </Link>
              </li>
            </ul>
          </li>

          {/* <li className="nav-item">
            <Link to="/logistics" className="nav-link main-menu">
              <LocalShippingOutlinedIcon />
              <span className="link-text">ขนส่ง</span>
            </Link>
          </li> */}

          <li className="nav-item">
            <Link
              to="/"
              className="nav-link main-menu"
              onClick={() => {
                removeUserSession();
                window.location.reload();
              }}
            >
              <LogoutRoundedIcon />
              <span className="link-text">ออกจากระบบ</span>
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
