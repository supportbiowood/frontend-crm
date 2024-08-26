import moment from "moment";
import { useEffect } from "react";
import { useState } from "react";
import AccountTableComponent from "../../../AccountTableComponent";

const columns = [
  {
    headerName: "เลขที่เอกสาร",
    field: "document_id",
    flex: 1,
    renderCell: (params) => params.row.billing_note_data.document_id,
  },
  {
    headerName: "วันที่ออก",
    field: "issue_date",
    flex: 1,
    renderCell: (params) => {
      const issue_date = moment
        .unix(params.row.billing_note_data.issue_date)
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
        .unix(params.row.billing_note_data.due_date)
        .format("DD/MM/YYYY");
      return due_date;
    },
  },
  {
    headerName: "ยอดรวมสุทธิ",
    field: "total_amount",
    flex: 1,
    renderCell: (params) => {
      const total_amount = params.row.billing_note_data.total_amount;
      return total_amount.toFixed(2);
    },
  },
  {
    headerName: "มูลค่าที่ชำระแล้ว",
    field: "paid_amount",
    flex: 1,
    renderCell: (params) => {
      const paid_amount = params.row.billing_note_data.paid_amount;
      return paid_amount.toFixed(2);
    },
  },
  {
    headerName: "จำนวนเงินวางบิล",
    field: "billing_amount",
    flex: 1,
    renderCell: (params) => {
      const billing_amount = params.row.billing_note_data.billing_amount;
      return billing_amount.toFixed(2);
    },
  },
];

export default function SalesInvoiceTable({
  setSelectedImportdocument,
  salesInvoiceList,
}) {
  const [allSalesInvoice, setAllSalesInvoice] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const formatData = salesInvoiceList.map((salesInvoice, index) => {
      return {
        id: index + 1,
        ...salesInvoice,
      };
    });
    setAllSalesInvoice(formatData);
    setRows(formatData);
  }, [salesInvoiceList]);

  return (
    <>
      <AccountTableComponent
        checkboxSelection
        tableRows={allSalesInvoice}
        tableColumns={columns}
        rows={rows}
        setRows={setRows}
        setSelectedImportdocument={setSelectedImportdocument}
        short
      />
    </>
  );
}
