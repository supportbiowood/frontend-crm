import moment from "moment";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { toLocaleWithTwoDigits } from "../../../../../adapter/Utils";
import AccountTableComponent from "../../../AccountTableComponent";

const PaymentHistory = ({ salesInvoiceList }) => {
  const history = useHistory();
  const columns = [
    {
      headerName: "เลขที่เอกสาร",
      field: "document_id",
      flex: 1,
    },
    {
      headerName: "วันที่ออก",
      field: "issue_date",
      flex: 1,
      renderCell: (params) => {
        const issue_date = moment
          .unix(params.row.issue_date)
          .format("DD/MM/YYYY");
        return issue_date;
      },
    },
    {
      headerName: "วันที่ครบกำหนด",
      field: "due_date",
      flex: 1,
      renderCell: (params) => {
        const due_date = moment.unix(params.row.due_date).format("DD/MM/YYYY");
        return due_date;
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
      headerName: "มูลค่าที่ชำระแล้ว",
      field: "paid_amount",
      flex: 1,
      renderCell: (params) => {
        const paid_amount = params.row.paid_amount;
        return toLocaleWithTwoDigits(paid_amount);
      },
    },
    {
      headerName: "จำนวนเงินวางบิล",
      field: "billing_amount",
      flex: 1,
      renderCell: (params) => {
        const billing_amount = params.row.billing_amount;
        return toLocaleWithTwoDigits(billing_amount);
      },
    },
  ];

  const [allSalesInvoice, setAllSalesInvoice] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    setAllSalesInvoice(salesInvoiceList);
    setRows(salesInvoiceList);
  }, [salesInvoiceList]);

  const onRowDoubleClick = (params) => {
    let sales_invoice_document_id = params.row.document_id;
    history.push(`/income/sales-invoice/${sales_invoice_document_id}`);
  };
  return (
    <>
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
};

export default PaymentHistory;
