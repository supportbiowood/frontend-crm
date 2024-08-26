import React, { useState, useEffect } from "react";
import moment from "moment";
import AccountTableComponent from "../../../AccountTableComponent";
import { toLocaleWithTwoDigits } from "../../../../../adapter/Utils";

const columns = [
  {
    headerName: "เลขที่เอกสาร",
    field: "sales_invoice_document_id",
    flex: 1,
  },
  {
    headerName: "โครงการ",
    field: "project_id",
    flex: 1,
    renderCell: (params) => {
      const project_id = params.row.billing_info.project_id;
      return project_id;
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
    field: "sales_invoice_issue_date",
    flex: 1,
    renderCell: (params) => {
      const sales_invoice_issue_date = moment
        .unix(params.row.sales_invoice_issue_date)
        .format("DD/MM/YYYY");
      return sales_invoice_issue_date;
    },
  },
  {
    headerName: "วันที่ครบกำหนด",
    field: "sales_invoice_due_date",
    flex: 1,
    renderCell: (params) => {
      const sales_invoice_due_date = moment
        .unix(params.row.sales_invoice_due_date)
        .format("DD/MM/YYYY");
      return sales_invoice_due_date;
    },
  },
  {
    headerName: "มูลค่าสุทธิ",
    field: "total_amount",
    flex: 1,
    renderCell: (params) => {
      const total_amount = params.row.total_amount;
      return toLocaleWithTwoDigits(total_amount);
    },
  },
  {
    headerName: "สถานะ",
    field: "sales_invoice_status",
    flex: 1,
    renderCell: (params) => {
      switch (params.row.sales_invoice_status) {
        case "draft":
          return <div className="account__box-draft">ร่าง</div>;
        case "wait_approve":
          return <div className="account__box-waitApprove">รออนุมัติ</div>;
        case "not_approve":
          return <div className="account__box-notApprove">ไม่อนุมัติ</div>;
        case "wait_payment":
          return <div className="account__box-waitPay">รอชำระ</div>;
        case "partial_payment":
          return <div className="account__box-closed">ชำระแล้วบางส่วน</div>;
        case "payment_complete":
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

export default function SalesinvoiceTabComponent({ salesInvoiceList }) {
  const [allSalesInvoice, setAllSalesInvoice] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const formatData = salesInvoiceList.map((salesOrder, index) => {
      return {
        id: index + 1,
        ...salesOrder,
      };
    });
    setAllSalesInvoice(formatData);
    setRows(formatData);
  }, [salesInvoiceList]);

  const onRowDoubleClick = (params) => {
    let sales_invoice_document_id = params.row.sales_invoice_document_id;
    window.location.href = "/income/sales-invoice/" + sales_invoice_document_id;
  };
  return (
    <>
      <h2 className="form-heading">ใบแจ้งหนี้</h2>
      <AccountTableComponent
        tableRows={allSalesInvoice}
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
