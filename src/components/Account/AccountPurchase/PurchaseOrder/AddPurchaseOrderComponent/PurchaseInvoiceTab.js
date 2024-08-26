import React, { useEffect, useState } from "react";
import moment from "moment";
import { useHistory } from "react-router-dom";
import AccountTableComponent from "../../../AccountTableComponent";

const columns = [
  {
    headerName: "เลขที่เอกสาร",
    field: "purchase_invoice_document_id",
    flex: 1,
  },
  {
    headerName: "วันที่ออกเอกสาร",
    field: "purchase_invoice_issue_date",
    flex: 1,
    renderCell: (params) => {
      const purchase_invoice_issue_date = moment
        .unix(params.row.purchase_invoice_issue_date)
        .format("DD/MM/YYYY");
      return purchase_invoice_issue_date;
    },
  },
  {
    headerName: "ต้องการภายในวันที่",
    field: "purchase_invoice_due_date",
    flex: 1,
    renderCell: (params) => {
      const purchase_invoice_due_date = moment
        .unix(params.row.purchase_invoice_due_date)
        .format("DD/MM/YYYY");
      return purchase_invoice_due_date;
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
    field: "purchase_invoice_status",
    flex: 1,
    renderCell: (params) => {
      switch (params.row.purchase_invoice_status) {
        case "draft":
          return <div className="account__box-draft">ร่าง</div>;
        case "wait_payment":
          return <div className="account__box-waitPay">รอชำระ</div>;
        case "payment_complete":
          return <div className="account__box-paid">ชำระแล้ว</div>;
        case "partial_payment":
          return <div className="account__box-paid">ชำระแล้วบางส่วน</div>;
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

const PurchaseInvoiceTab = ({ purchaseInvoiceList }) => {
  const [allPurchaseInvoice, setAllPurchaseInvoice] = useState([]);
  const [rows, setRows] = useState([]);
  const history = useHistory();
  useEffect(() => {
    const formatData = purchaseInvoiceList.map((purchaseInvoice, index) => {
      return {
        id: index + 1,
        ...purchaseInvoice,
      };
    });
    setAllPurchaseInvoice(formatData);
    setRows(formatData);
  }, [purchaseInvoiceList]);

  const onRowDoubleClick = (params) => {
    let purchase_invoice_document_id = params.row.purchase_invoice_document_id;
    history.push("/expense/purchase-invoice/" + purchase_invoice_document_id);
  };
  return (
    <>
      <AccountTableComponent
        tableRows={allPurchaseInvoice}
        tableColumns={columns}
        onRowDoubleClick={onRowDoubleClick}
        rows={rows}
        setRows={setRows}
        short
        hideFooter
      />
    </>
  );
};

export default PurchaseInvoiceTab;
