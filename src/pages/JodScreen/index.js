import React from "react";
import NavLeftComponent from "../../components/NavLeftComponent";
import NavTopComponent from "../../components/NavTopComponent";
import FooterComponent from "../../components/FooterComponent";
// import ItemMasterDataComponent from "../../components/ItemMasterDataComponent";
import TestTableCell from "../../components/Test/TestTableCell";

export default function JodScreen() {
  // const { path } = useRouteMatch()

  return (
    <>
      <NavLeftComponent />
      <div className={"whole-wrapper"}>
        <NavTopComponent />
        <main>
          {/* <ItemMasterDataComponent /> */}
          <TestTableCell />
        </main>
        <FooterComponent />
      </div>
    </>
  );
}
