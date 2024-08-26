import { Autocomplete, TextField } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { toLocaleWithTwoDigits } from "../../../../../adapter/Utils";
import AccountTableComponent from "../../../AccountTableComponent";

const DebitNoteTable = ({
  formik,
  disabled,
  purchaseInvoiceDocumentIdList,
}) => {
  const columns = [
    {
      headerName: "เลขที่เอกสาร",
      field: "purchase_invoice_document_id",
      flex: 1,
      renderCell: () => {
        if (!disabled) {
          return (
            <Autocomplete
              fullWidth
              disabled={disabled}
              size="small"
              freeSolo
              value={
                formik.values.purchase_invoice_document_id
                  ? {
                      purchase_invoice_document_id:
                        formik.values.purchase_invoice_document_id,
                    }
                  : {
                      purchase_invoice_document_id: "",
                    }
              }
              onChange={(_, value) => {
                if (value !== null) {
                  formik.setFieldValue(
                    "debit_note_info[0].purchase_invoice_document_id",
                    value.purchase_invoice_document_id
                  );
                  formik.setFieldValue(
                    "debit_note_info[0].issue_date",
                    value.issue_date
                  );
                  formik.setFieldValue(
                    "debit_note_info[0].total_amount",
                    value.total_amount
                  );
                  formik.setFieldValue(
                    "debit_note_info[0].amount_to_pay",
                    value.amount_to_pay
                  );
                  formik.setFieldValue(
                    "debit_note_info[0].debit_note_amount",
                    formik.values.total_amount
                  );
                  const formatData = [
                    {
                      id: 1,
                      ...value,
                    },
                  ];
                  setAllSalesInvoice(formatData);
                  setRows(formatData);
                  formik.setFieldValue(
                    "purchase_invoice_document_id",
                    value.purchase_invoice_document_id
                  );
                } else {
                  formik.setFieldValue("purchase_invoice_document_id", null);
                  formik.setFieldValue(
                    "debit_note_info[0].purchase_invoice_document_id",
                    null
                  );
                  formik.setFieldValue("debit_note_info[0].issue_date", "-");
                  formik.setFieldValue("debit_note_info[0].total_amount", 0);
                  formik.setFieldValue("debit_note_info[0].amount_to_pay", 0);
                }
              }}
              getOptionLabel={(option) => option.purchase_invoice_document_id}
              isOptionEqualToValue={(option, value) =>
                option.purchase_invoice_document_id ===
                value.purchase_invoice_document_id
              }
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.purchase_invoice_document_id}>
                    {option.purchase_invoice_document_id}
                  </li>
                );
              }}
              options={purchaseInvoiceDocumentIdList}
              renderInput={(params) => <TextField {...params} />}
            />
          );
        } else {
          return formik.values.debit_note_info[0].purchase_invoice_document_id;
        }
      },
    },
    {
      headerName: "วันที่ออกเอกสาร",
      field: "issue_date",
      flex: 1,
      renderCell: (params) => {
        if (params.row.issue_date === "-") {
          return "-";
        } else {
          const issue_date = moment
            .unix(params.row.issue_date)
            .format("DD/MM/YYYY");
          return issue_date;
        }
      },
    },
    {
      headerName: "ยอดรวมสุทธิ",
      field: "total_amount",
      flex: 1,
      renderCell: (params) => {
        const total_amount = params.row.total_amount;
        return toLocaleWithTwoDigits(total_amount);
      },
    },
    {
      headerName: "รอรับชำระ",
      field: "amount_to_pay",
      flex: 1,
      renderCell: (params) => {
        const amount_to_pay = params.row.amount_to_pay;
        return toLocaleWithTwoDigits(amount_to_pay);
      },
    },
    {
      headerName: "จำนวนลดหนี้",
      field: "debit_note_amount",
      flex: 1,
      renderCell: () => {
        return toLocaleWithTwoDigits(parseFloat(formik.values.total_amount));
      },
    },
  ];
  const [allSalesInvoice, setAllSalesInvoice] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    console.log("info", formik.values.debit_note_info);
    if (formik.values.debit_note_info) {
      const formatData = formik.values.debit_note_info.map((data, index) => ({
        id: index,
        ...data,
      }));
      setAllSalesInvoice(formatData);
      setRows(formatData);
    } else {
      const formatData = [
        {
          id: 1,
          purchase_invoice_document_id: "",
          issue_date: "-",
          total_amount: 0,
          amount_to_pay: 0,
        },
      ];
      setAllSalesInvoice(formatData);
      setRows(formatData);
    }
  }, [formik.values.debit_note_info]);

  return (
    <>
      <AccountTableComponent
        tableRows={allSalesInvoice}
        tableColumns={columns}
        rows={rows}
        setRows={setRows}
        short
        hideFooter
      />
    </>
  );
};

export default DebitNoteTable;
