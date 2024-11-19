// นำเข้า React เพื่อใช้สร้างคอมโพเนนต์
import React from "react";
// นำเข้า Link สำหรับสร้างลิงก์, Route สำหรับกำหนดเส้นทาง, Switch สำหรับการเลือกเส้นทางที่ตรงกับ URL และ useRouteMatch สำหรับการจับคู่เส้นทางปัจจุบัน
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
// นำเข้าคอมโพเนนต์การนำทางและส่วนท้ายที่คุณสร้างไว้เพื่อใช้งานในหน้า
import NavLeftComponent from "../../components/NavLeftComponent";
import NavTopComponent from "../../components/NavTopComponent";
import FooterComponent from "../../components/FooterComponent";
// นำเข้า ProtectedRoute ซึ่งเป็นคอมโพเนนต์ที่ใช้ป้องกันเส้นทางบางเส้นทางที่ต้องการการอนุญาต (เช่นการล็อกอินก่อน)
import ProtectedRoute from "../../components/ProtectedRoute";

// นำเข้า ImporterComponent สำหรับจัดการฟีเจอร์การนำเข้าข้อมูล
import ImporterComponent from "../../components/Config/ImporterComponent";
// นำเข้าไอคอนรูปเฟืองจาก Material-UI สำหรับใช้ใน UI
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
// นำเข้า Breadcrumbs จาก Material-UI สำหรับสร้าง breadcrumb และ BreadcrumbComponent ที่คุณสร้างขึ้นเพื่อการนำทาง
import { Breadcrumbs } from "@mui/material";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";
// นำเข้าคอมโพเนนต์ที่เกี่ยวข้องกับหน้าตั้งค่าต่างๆ เช่น คลังสินค้า หน่วย หมวดหมู่ และคุณสมบัติ
import WarehouseComponent from "../../components/Config/WarehouseComponent";
import UOMComponent from "../../components/Config/UOMComponent";
import UOMGroupComponent from "../../components/Config/UOMGroupComponent";
import CategoryComponent from "../../components/Config/CategoryComponent";
import PropertyComponent from "../../components/Config/PropertyComponent";
import UOMGroupEditComponent from "../../components/Config/UOMGroupComponent/UOMGroupEditComponent";

// ฟังก์ชันคอมโพเนนต์หลักชื่อว่า ConfigScreen ที่จะถูกส่งออก (export) ให้สามารถใช้งานได้ในส่วนอื่นๆ ของแอปพลิเคชัน
export default function ConfigScreen(props) {
  // ใช้ useRouteMatch เพื่อจับคู่เส้นทางปัจจุบันและดึง path มาใช้ในคอมโพเนนต์นี้
  const { path } = useRouteMatch();
  return (
    <>
      {/* แสดงคอมโพเนนต์การนำทางด้านซ้าย */}
      <NavLeftComponent />
      {/* ใช้ div สำหรับห่อหุ้มเนื้อหาหลักของหน้าทั้งหมด */}
      <div className={"whole-wrapper"}>
        {/* แสดงคอมโพเนนต์การนำทางด้านบน */}
        <NavTopComponent />
        {/* ส่วนหลักของเนื้อหาที่จะแสดงตามเส้นทางที่เลือก */}
        <main>
          {/* ใช้ Switch เพื่อแสดงคอมโพเนนต์ที่ตรงกับเส้นทางที่กำหนด */}
          <Switch>
            {/* เส้นทางหลักที่ใช้ path ปัจจุบัน ไม่ใช้ Route ทำให้ทุกคนสามารถเข้าถึงได้ */}
            <Route exact path={`${path}`}>
              {/* แสดง Breadcrumbs เพื่อการนำทางแบบลำดับขั้น */}
              <Breadcrumbs separator="›" aria-label="breadcrumb">
              {/* แสดง breadcrumb หนึ่งรายการที่มีข้อความ "ตั้งค่า" */}
                <BreadcrumbComponent name="ตั้งค่า" to="#" />
              </Breadcrumbs>
              {/* สร้างเมนูปุ่มที่แสดงเป็นกริด */}
              <ul className="grid-container-nav-button">
                {/* ลิงก์ไปยังเส้นทาง "/warehouse" */}
                <Link to={`${path}/warehouse`}>
                  <li className="menu-button">
                    {/* แสดงไอคอนรูปเฟือง */}
                    <SettingsOutlinedIcon />
                    {/* แสดงข้อความ "คลัง" */}
                    <div>คลัง</div>
                  </li>
                </Link>
                {/* ลิงก์ไปยังเส้นทาง "/category" */}
                <Link to={`${path}/category`}>
                  <li className="menu-button">
                    {/* แสดงไอคอนรูปเฟือง */}
                    <SettingsOutlinedIcon />
                    {/* แสดงข้อความ "หมวดหมู่" */}
                    <div>หมวดหมู่</div>
                  </li>
                </Link>
                {/* ลิงก์ไปยังเส้นทาง "/uom" */}
                <Link to={`${path}/uom`}>
                  <li className="menu-button">
                    {/* แสดงไอคอนรูปเฟือง */}
                    <SettingsOutlinedIcon />
                    {/* แสดงข้อความ "หน่วย" */}
                    <div>หน่วย</div>
                  </li>
                </Link>
                {/* ลิงก์ไปยังเส้นทาง "/uomConversion" */}
                <Link to={`${path}/uomConversion`}>
                  <li className="menu-button">
                    {/* แสดงไอคอนรูปเฟือง */}
                    <SettingsOutlinedIcon />
                    {/* แสดงข้อความ "การแปลงหน่วย" */}
                    <div>การแปลงหน่วย</div>
                  </li>
                </Link>
                {/* ลิงก์ไปยังเส้นทาง "/property" */}
                <Link to={`${path}/property`}>
                  <li className="menu-button">
                    {/* แสดงไอคอนรูปเฟือง */}
                    <SettingsOutlinedIcon />
                    {/* แสดงข้อความ "คุณสมบัติ" */}
                    <div>คุณสมบัติ</div>
                  </li>
                </Link>
              </ul>
            </Route>
            {/* เส้นทาง "/importer" ที่ป้องกันด้วย ProtectedRoute เพื่อให้เฉพาะผู้ที่มีสิทธิ์เข้าถึง */}
            <ProtectedRoute exact path={`${path}/importer`}>
              <ImporterComponent />
            </ProtectedRoute>
            {/* เส้นทาง "/warehouse" ที่ป้องกันด้วย ProtectedRoute */}
            <ProtectedRoute exact path={`${path}/warehouse`}>
              <WarehouseComponent />
            </ProtectedRoute>
            {/* เส้นทาง "/category" ที่ป้องกันด้วย ProtectedRoute */}
            <ProtectedRoute exact path={`${path}/category`}>
              <CategoryComponent />
            </ProtectedRoute>
            {/* เส้นทาง "/uom" ที่ป้องกันด้วย ProtectedRoute */}
            <ProtectedRoute exact path={`${path}/uom`}>
              <UOMComponent />
            </ProtectedRoute>
            {/* เส้นทาง "/uomConversion" ที่ป้องกันด้วย ProtectedRoute */}
            <ProtectedRoute exact path={`${path}/uomConversion`}>
              <UOMGroupComponent />
            </ProtectedRoute>
            {/* เส้นทาง "/uomConversion/:id" ที่ป้องกันด้วย ProtectedRoute โดย :id เป็น dynamic parameter ที่สามารถแทนด้วยค่าจริงได้ */}
            <ProtectedRoute exact path={`${path}/uomConversion/:id`}>
              <UOMGroupEditComponent />
            </ProtectedRoute>
            {/* เส้นทาง "/property" ที่ป้องกันด้วย ProtectedRoute */}
            <ProtectedRoute exact path={`${path}/property`}>
              <PropertyComponent />
            </ProtectedRoute>
          </Switch>
        </main>
        {/* แสดงคอมโพเนนต์ส่วนท้ายของหน้า */}
        <FooterComponent />
      </div>
    </>
  );
}
