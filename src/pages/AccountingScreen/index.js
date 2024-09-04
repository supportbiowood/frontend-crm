// นำเข้า React เพื่อใช้สร้างคอมโพเนนต์
import React from "react";
// นำเข้า Switch สำหรับการกำหนดเส้นทางหลายเส้นทาง และ useRouteMatch สำหรับการจับคู่เส้นทางปัจจุบัน
import { Switch, useRouteMatch } from "react-router-dom";
// นำเข้า NavLeftComponent, NavTopComponent และ FooterComponent ซึ่งเป็นคอมโพเนนต์นำทาง (navigation) และส่วนท้าย (footer) ที่คุณสร้างขึ้น
import NavLeftComponent from "../../components/NavLeftComponent";
import NavTopComponent from "../../components/NavTopComponent";
import FooterComponent from "../../components/FooterComponent";
// นำเข้า ProtectedRoute ซึ่งเป็นคอมโพเนนต์ที่ใช้ในการป้องกันเส้นทางบางเส้นทางที่ต้องการการอนุญาต
import ProtectedRoute from "../../components/ProtectedRoute";
// นำเข้าไอคอนจาก Material-UI สำหรับใช้ใน UI
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import FindInPageRoundedIcon from "@mui/icons-material/FindInPageRounded";

// นำเข้าคอมโพเนนต์ต่างๆ ที่เกี่ยวข้องกับฟีเจอร์ทางบัญชีในระบบ
import AccountingComponent from "../../components/Accounting/AccountingComponent";
import ChartofAccountsInfo from "../../components/Accounting/ChartofAccounts/ChartofAccountsInfo";
import ChartofAccountComponent from "../../components/Accounting/ChartofAccounts/ChartofAccountComponent";
import JournalEntryComponent from "../../components/Accounting/JournalEntry/JournalEntryComponent";
import JournalEntryInfo from "../../components/Accounting/JournalEntry/JournalEntryInfo";
// นำเข้า Route และ Link จาก react-router-dom สำหรับการกำหนดเส้นทางและลิงก์ภายในแอปพลิเคชัน
import { Route } from "react-router-dom";
import { Link } from "react-router-dom";
// นำเข้า Breadcrumbs จาก Material-UI สำหรับสร้าง breadcrumb และ BreadcrumbComponent ที่คุณสร้างขึ้นเพื่อการนำทาง
import { Breadcrumbs } from "@mui/material";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";

// ฟังก์ชันคอมโพเนนต์หลักของคุณที่ชื่อว่า AccountingScreen จะถูกส่งออก (export) เพื่อให้ใช้งานในส่วนอื่นได้
export default function AccountingScreen(props) {
  // ใช้ useRouteMatch เพื่อจับคู่เส้นทางปัจจุบันและนำ path มาใช้ในส่วนต่างๆ ของคอมโพเนนต์นี้
  const { path } = useRouteMatch();
  return (
    <>
       {/* แสดงคอมโพเนนต์การนำทางด้านซ้าย */}
      <NavLeftComponent />
       {/* ใช้ div สำหรับห่อหุ้มส่วนหลักทั้งหมดของคอมโพเนนต์นี้ */}
      <div className={"whole-wrapper"}>
        {/* แสดงคอมโพเนนต์การนำทางด้านบน */}
        <NavTopComponent />
         {/* ส่วนหลักของคอนเทนต์ที่จะเปลี่ยนไปตามเส้นทางที่เลือก */}
        <main>
          {/* ใช้ Switch เพื่อแสดงคอมโพเนนต์ที่ตรงกับเส้นทางที่กำหนด */}
          <Switch>
             {/* เส้นทางหลักที่ป้องกันด้วย ProtectedRoute โดยใช้ path ปัจจุบัน */}
            <Route exact path={`${path}`}>
              {/* แสดง Breadcrumbs เพื่อการนำทางแบบลำดับขั้น */}
              <Breadcrumbs separator="›" aria-label="breadcrumb">
              {/* แสดง breadcrumb หนึ่งรายการที่นำไปยังหน้า "คลังสินค้า" */}
                <BreadcrumbComponent name="คลังสินค้า" to="/inventory" />
              </Breadcrumbs>
              {/* สร้างเมนูปุ่มที่แสดงเป็นกริด */}
              <ul className="grid-container-nav-button">
                {/* ลิงก์ไปยังเส้นทาง "/chart" */}
                <Link to={`${path}/chart`}>
                  <li className="menu-button">
                     {/* แสดงไอคอนบัญชี */}
                    <AccountBalanceOutlinedIcon />
                    {/* แสดงข้อความ "ผังบัญชี" */}
                    <div>ผังบัญชี</div>
                  </li>
                </Link>
                {/* ลิงก์ไปยังเส้นทาง "/journal" */}
                <Link to={`${path}/journal`}>
                  <li className="menu-button">
                    {/* แสดงไอคอนบัญชี */}
                    <AccountBalanceOutlinedIcon />
                    {/* แสดงข้อความ "บันทึกบัญชี" */}
                    <div>บันทึกบัญชี</div>
                  </li>
                </Link>
                {/* ลิงก์ไปยังเส้นทาง "/report" */}
                <Link to={`${path}/report`}>
                  <li className="menu-button">
                    {/* แสดงไอคอนรายงาน */}
                    <FindInPageRoundedIcon />
                    {/* แสดงข้อความ "รายงาน" */}
                    <div>รายงาน</div>
                  </li>
                </Link>
              </ul>
            </Route>
            <ProtectedRoute exact path={`${path}`}>
              <AccountingComponent />
            </ProtectedRoute>
            {/* เส้นทาง "/chart" ป้องกันด้วย ProtectedRoute และแสดง ChartofAccountComponent */}
            <ProtectedRoute exact path={`${path}/chart`}>
              <ChartofAccountComponent />
            </ProtectedRoute>
            {/* เส้นทาง "/chart/add" ป้องกันด้วย ProtectedRoute และแสดง ChartofAccountsInfo พร้อมส่ง prop "add" */}
            <ProtectedRoute exact path={`${path}/chart/add`}>
              <ChartofAccountsInfo add />
            </ProtectedRoute>
            {/* เส้นทาง "/chart/view" ป้องกันด้วย ProtectedRoute และแสดง ChartofAccountsInfo */}
            <ProtectedRoute exact path={`${path}/chart/view`}>
              <ChartofAccountsInfo />
            </ProtectedRoute>
            {/* เส้นทาง "/chart/view/transaction" ป้องกันด้วย ProtectedRoute และแสดงข้อความ "TEST" */}
            <ProtectedRoute exact path={`${path}/chart/view/transaction`}>
              <div>TEST</div>
            </ProtectedRoute>
            {/* เส้นทาง "/journal" ป้องกันด้วย ProtectedRoute และแสดง JournalEntryComponent */}
            <ProtectedRoute exact path={`${path}/journal`}>
              <JournalEntryComponent />
            </ProtectedRoute>
            {/* เส้นทาง "/journal/add" ป้องกันด้วย ProtectedRoute และแสดง JournalEntryInfo พร้อมส่ง prop "add" */}
            <ProtectedRoute exact path={`${path}/journal/add`}>
              <JournalEntryInfo add />
            </ProtectedRoute>
          </Switch>
        </main>
        {/* แสดงคอมโพเนนต์ส่วนท้ายของหน้า */}
        <FooterComponent />
      </div>
    </>
  );
}
