import React, { useState, useEffect } from "react";
import moment from "moment";
import AccountTableComponent from "../../../AccountTableComponent";
import { toLocaleWithTwoDigits } from "../../../../../adapter/Utils";

const columns = [
  {
    headerName: "เลขที่เอกสาร",
    field: "payment_receipt_document_id",
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
    field: "payment_issue_date",
    flex: 1,
    renderCell: (params) => {
      const payment_date = moment
        .unix(params.row.payment_date)
        .format("DD/MM/YYYY");
      return payment_date;
    },
  },
  {
    headerName: "ประเภท",
    field: "payment_channel_type",
    flex: 1,
    renderCell: (params) => {
      switch (params.row.payment_channel_type) {
        case "cash":
          return "เงินสด";
        case "bank":
          return "ธนาคาร";
        case "e_wallet":
          return "e-wallet";
        case "receiver":
          return "สำรองรับ-จ่าย";
        case "check":
          return "เช็ค";
        default:
          return "-";
      }
    },
  },
  {
    headerName: "รูปแบบการชำระ",
    field: "ref_type",
    flex: 1,
    renderCell: (params) => {
      switch (params.row.ref_type) {
        case "sales_invoice":
          return "การรับชำระ";
        case "billing_note":
          return "การรับชำระ";
        case "deposit_invoice":
          return "การรับชำระมัดจำ";
        default:
          return "-";
      }
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
    field: "payment_receipt_status",
    flex: 1,
    renderCell: (params) => {
      switch (params.row.payment_receipt_status) {
        case "draft":
          return <div className="account__box-draft">ร่าง</div>;
        case "payment_complete":
          return <div className="account__box-paid">ชำระแล้ว</div>;
        case "cancelled":
          return <div className="account__box-cancelled">ยกเลิก</div>;
        default:
          return;
      }
    },
  },
];

export default function PaymentTabComponent({ paymentReceiptList }) {
  const [allReceipt, setAllReceipt] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const formatData = paymentReceiptList.map((paymentReceipt, index) => {
      return {
        id: index + 1,
        ...paymentReceipt,
      };
    });
    setAllReceipt(formatData);
    setRows(formatData);
  }, [paymentReceiptList]);

  const onRowDoubleClick = (params) => {
    let payment_receipt_document_id = params.row.payment_receipt_document_id;
    window.location.href =
      "/income/payment-receipt/" + payment_receipt_document_id;
  };
  return (
    <>
      <h2 className="form-heading">รับชำระ</h2>
      <AccountTableComponent
        tableRows={allReceipt}
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
