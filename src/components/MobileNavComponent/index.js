import React from "react";
import { Link } from "react-router-dom";
import { removeUserSession } from "../../adapter/Auth";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import DoDisturbOnOutlinedIcon from "@mui/icons-material/DoDisturbOnOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";

export default function MobileNavComponent() {
  return (
    <>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <BreadcrumbComponent name="หน้าแรก" to="/" />
      </Breadcrumbs>
      <ul className="grid-container-nav-button mobile">
        <Link to="/sales">
          <li className="menu-button">
            <AttachMoneyRoundedIcon />
            <div>การขาย</div>
          </li>
        </Link>
        <Link to="/inventory">
          <li className="menu-button">
            <Inventory2OutlinedIcon />
            <div>คลังสินค้า</div>
          </li>
        </Link>
        {/* <Link to="/engineer">
          <li className="menu-button">
            <EngineeringOutlinedIcon />
            <div>ติดตั้ง/ถอดแบบ</div>
          </li>
        </Link> */}
        <Link to="/purchase">
          <li className="menu-button">
            <AddShoppingCartRoundedIcon />
            <div>จัดซื้อ</div>
          </li>
        </Link>
        <Link to="/income">
          <li className="menu-button">
            <AddCircleOutlineOutlinedIcon />
            <div>รายรับ</div>
          </li>
        </Link>
        <Link to="/expense">
          <li className="menu-button">
            <DoDisturbOnOutlinedIcon />
            <div>รายจ่าย</div>
          </li>
        </Link>
        <Link to="/employee">
          <li className="menu-button">
            <PeopleAltOutlinedIcon />
            <div>บัญชีผู้ใช้</div>
          </li>
        </Link>
        <Link
          to="/engineer"
          onClick={() => {
            removeUserSession();
            window.location.reload();
          }}
        >
          <li className="menu-button mobile">
            <LogoutRoundedIcon />
            <div>ออกจากระบบ</div>
          </li>
        </Link>
      </ul>
    </>
  );
}
