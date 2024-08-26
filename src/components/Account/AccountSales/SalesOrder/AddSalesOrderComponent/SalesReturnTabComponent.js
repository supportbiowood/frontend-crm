import React, { useState, useEffect } from "react";
import moment from "moment";
import AccountTableComponent from "../../../AccountTableComponent";

const columns = [
  {
    headerName: "เลขที่เอกสาร",
    field: "sales_return_document_id",
    flex: 1,
  },
  {
    headerName: "โครงการ",
    field: "project_name",
    flex: 1,
    renderCell: (params) => {
      const project_name = params.row.billing_info.project_name;
      if (project_name) {
        return project_name;
      } else {
        return "-";
      }
    },
  },
  {
    headerName: "ลูกค้า",
    field: "contact_name",
    flex: 1,
    renderCell: (params) => {
      const contact_name = params.row.billing_info.contact_name;
      return contact_name;
    },
  },
  {
    headerName: "วันที่ออกเอกสาร",
    field: "sales_return_issue_date",
    flex: 1,
    renderCell: (params) => {
      const sales_return_issue_date = moment
        .unix(params.row.sales_return_issue_date)
        .format("DD/MM/YYYY");
      return sales_return_issue_date;
    },
  },
  {
    headerName: "วันที่ส่ง",
    field: "sales_return_delivery_date",
    flex: 1,
    renderCell: (params) => {
      const sales_return_delivery_date = moment
        .unix(params.row.sales_return_delivery_date)
        .format("DD/MM/YYYY");
      return sales_return_delivery_date;
    },
  },
  {
    headerName: "มูลค่าสุทธิ",
    field: "total_amount",
    flex: 1,
    renderCell: (params) => {
      const total_amount = params.row.total_amount;
      return total_amount;
    },
  },
  {
    headerName: "สถานะ",
    field: "sales_return_status",
    flex: 1,
    renderCell: (params) => {
      switch (params.row.sales_return_status) {
        case "draft":
          return <div className="account__box-draft">ร่าง</div>;
        case "wait_approve":
          return <div className="account__box-waitApprove">รออนุมัติ</div>;
        case "not_approve":
          return <div className="account__box-notApprove">ไม่อนุมัติ</div>;
        case "wait_payment":
          return <div className="account__box-waitPay">รอชำระ</div>;
        case "closed":
          return <div className="account__box-closed">ชำระแล้ว</div>;
        case "expired":
          return <div className="account__box-expired">เกินเวลา</div>;
        case "cancelled":
          return <div className="account__box-cancelled">ยกเลิก</div>;
        default:
          return;
      }
    },
  },
];

export default function SalesReturnTabComponent({ salesReturnList }) {
  const [allSalesReturn, setAllSalesReturn] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const formatData = salesReturnList.map((salesReturn, index) => {
      return {
        id: index + 1,
        ...salesReturn,
      };
    });
    setAllSalesReturn(formatData);
    setRows(formatData);
  }, [salesReturnList]);

  const onRowDoubleClick = (params) => {
    let sales_return_document_id = params.row.sales_return_document_id;
    window.location.href = "/income/sales-return/" + sales_return_document_id;
  };
  return (
    <>
      <h2 className="form-heading">ใบแจ้งหนี้</h2>
      <AccountTableComponent
        tableRows={allSalesReturn}
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
