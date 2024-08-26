import React, { useState, useEffect } from "react";
import moment from "moment";
import AccountTableComponent from "../../../AccountTableComponent";
import { useHistory } from "react-router-dom";

const columns = [
  {
    headerName: "เลขที่เอกสาร",
    field: "purchase_order_document_id",
    flex: 1,
  },
  {
    headerName: "วันที่ออกเอกสาร",
    field: "purchase_order_issue_date",
    flex: 1,
    renderCell: (params) => {
      const purchase_order_issue_date = moment
        .unix(params.row.purchase_order_issue_date)
        .format("DD/MM/YYYY");
      return purchase_order_issue_date;
    },
  },
  {
    headerName: "ต้องการภายในวันที่",
    field: "purchase_order_due_date",
    flex: 1,
    renderCell: (params) => {
      const purchase_order_due_date = moment
        .unix(params.row.purchase_order_due_date)
        .format("DD/MM/YYYY");
      return purchase_order_due_date;
    },
  },
  {
    headerName: "วันประมาณการณ์สินค้าเข้า",
    field: "purchase_order_expect_date",
    flex: 1,
    renderCell: (params) => {
      const purchase_order_expect_date = moment
        .unix(params.row.purchase_order_expect_date)
        .format("DD/MM/YYYY");
      return purchase_order_expect_date;
    },
  },
  {
    headerName: "ผู้ขาย",
    field: "vendor_name",
    flex: 1,
    renderCell: (params) => {
      const contact_name = params.row.vendor_info.contact_name;
      return contact_name;
    },
  },
  {
    headerName: "สถานะ",
    field: "purchase_order_status",
    flex: 1,
    renderCell: (params) => {
      switch (params.row.purchase_order_status) {
        case "draft":
          return <div className="account__box-draft">ร่าง</div>;
        case "wait_approve":
          return <div className="account__box-waitApprove">รออนุมัติ</div>;
        case "not_approve":
          return <div className="account__box-notApprove">ไม่อนุมัติ</div>;
        case "approved":
          return <div className="account__box-approved">อนุมัติแล้ว</div>;
        case "expired":
          return <div className="account__box-expired">เกินเวลา</div>;
        case "importing":
          return (
            <div className="account__box-cancelled">นำเข้าแล้วบางส่วน</div>
          );
        case "fully_import":
          return <div className="account__box-closed">นำเข้าแล้ว</div>;
        case "cancelled":
          return <div className="account__box-cancelled">ยกเลิก</div>;
        default:
          return;
      }
    },
  },
];

export default function PurchaseOrderTabComponent({ purchaseOrderList }) {
  const [allPurchaseOrder, setAllPurchaseOrder] = useState([]);
  const [rows, setRows] = useState([]);
  const history = useHistory();
  useEffect(() => {
    const formatData = purchaseOrderList.map((purchaseOrder, index) => {
      return {
        id: index + 1,
        ...purchaseOrder,
      };
    });
    setAllPurchaseOrder(formatData);
    setRows(formatData);
  }, [purchaseOrderList]);

  const onRowDoubleClick = (params) => {
    let purchase_order_document_id = params.row.purchase_order_document_id;
    history.push("/expense/purchase-order/" + purchase_order_document_id);
  };

  return (
    <>
      <AccountTableComponent
        tableRows={allPurchaseOrder}
        tableColumns={columns}
        onRowDoubleClick={onRowDoubleClick}
        rows={rows}
        setRows={setRows}
        short
        hideFooter
      />
    </>
  );
}
