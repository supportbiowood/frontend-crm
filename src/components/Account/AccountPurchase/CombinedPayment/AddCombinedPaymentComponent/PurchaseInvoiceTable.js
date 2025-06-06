import moment from "moment";
import { useEffect, useState } from "react";
import AccountTableComponent from "../../../AccountTableComponent";

const columns = [
  {
    headerName: "เลขที่เอกสาร",
    field: "document_id",
    flex: 1,
    renderCell: (params) => params.row.combined_payment_data.document_id,
  },
  {
    headerName: "วันที่ออก",
    field: "issue_date",
    flex: 1,
    renderCell: (params) => {
      const issue_date = moment
        .unix(params.row.combined_payment_data.issue_date)
        .format("DD/MM/YYYY");
      return issue_date;
    },
  },
  {
    headerName: "วันที่ครบกำหนด",
    field: "due_date",
    flex: 1,
    renderCell: (params) => {
      const due_date = moment
        .unix(params.row.combined_payment_data.due_date)
        .format("DD/MM/YYYY");
      return due_date;
    },
  },
  {
    headerName: "ยอดรวมสุทธิ",
    field: "total_amount",
    flex: 1,
    renderCell: (params) => {
      const total_amount = params.row.combined_payment_data.total_amount;
      return total_amount.toFixed(2);
    },
  },
  {
    headerName: "มูลค่าที่ชำระแล้ว",
    field: "paid_amount",
    flex: 1,
    renderCell: (params) => {
      const paid_amount = params.row.combined_payment_data.paid_amount;
      return paid_amount.toFixed(2);
    },
  },
  {
    headerName: "จำนวนเงินวางบิล",
    field: "billing_amount",
    flex: 1,
    renderCell: (params) => {
      const billing_amount = params.row.combined_payment_data.billing_amount;
      return billing_amount.toFixed(2);
    },
  },
];

export default function PurchaseInvoiceTable({
  setSelectedImportdocument,
  purchaseInvoiceList,
}) {
  const [allPurchaseInvoice, setAllPurchaseInvoice] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const formatData = purchaseInvoiceList.map((pruchaseInvoice, index) => {
      return {
        id: index + 1,
        ...pruchaseInvoice,
      };
    });

    setAllPurchaseInvoice(formatData);
    setRows(formatData);
  }, [purchaseInvoiceList]);

  return (
    <>
      <AccountTableComponent
        checkboxSelection
        tableRows={allPurchaseInvoice}
        tableColumns={columns}
        rows={rows}
        setRows={setRows}
        setSelectedImportdocument={setSelectedImportdocument}
        short
      />
    </>
  );
}
