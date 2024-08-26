import React from "react";
import NavLeftComponent from "../../components/NavLeftComponent";
import NavTopComponent from "../../components/NavTopComponent";
import FooterComponent from "../../components/FooterComponent";

export default function ApprovalScreen(props) {
  return (
    <>
      <NavLeftComponent />
      <div className={"whole-wrapper"}>
        <NavTopComponent />
        <main>ยังไม่ถูกเปิดใช้งาน</main>
        <FooterComponent />
      </div>
    </>
  );
}
