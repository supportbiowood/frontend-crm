import { Autocomplete, Box, Button, TextField } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { toLocaleWithTwoDigits } from "../../../../../adapter/Utils";
import AccountTableComponent from "../../../AccountTableComponent";

const DepositInvoiceTabComponent = ({
  formik,
  disabled,
  salesInvoiceDocumentIdList,
  applyToSalesInvoice,
  cancelSalesInvoice,
}) => {
  const columns = [
    {
      headerName: "เลขที่เอกสาร",
      field: "sales_invoice_document_id",
      flex: 1,
      renderCell: () => {
        if (!disabled) {
          return (
            <Autocomplete
              fullWidth
              sx={{ paddingTop: ".75rem" }}
              disabled={disabled}
              size="small"
              freeSolo
              value={
                formik.values.sales_invoice_document_id
                  ? {
                      sales_invoice_document_id:
                        formik.values.sales_invoice_document_id,
                    }
                  : {
                      sales_invoice_document_id: "",
                    }
              }
              onChange={(_, value) => {
                if (value !== null) {
                  formik.setFieldValue(
                    "deposit_invoice_info[0].sales_invoice_document_id",
                    value.sales_invoice_document_id
                  );
                  formik.setFieldValue(
                    "deposit_invoice_info[0].issue_date",
                    value.issue_date
                  );
                  formik.setFieldValue(
                    "deposit_invoice_info[0].total_amount",
                    value.total_amount
                  );
                  formik.setFieldValue(
                    "deposit_invoice_info[0].amount_to_pay",
                    value.amount_to_pay
                  );
                  formik.setFieldValue(
                    "deposit_invoice_info[0].deposit_invoice_amount",
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
                    "sales_invoice_document_id",
                    value.sales_invoice_document_id
                  );
                } else {
                  formik.setFieldValue("sales_invoice_document_id", null);
                  formik.setFieldValue(
                    "deposit_invoice_info[0].sales_invoice_document_id",
                    null
                  );
                  formik.setFieldValue(
                    "deposit_invoice_info[0].issue_date",
                    "-"
                  );
                  formik.setFieldValue(
                    "deposit_invoice_info[0].total_amount",
                    0
                  );
                  formik.setFieldValue(
                    "deposit_invoice_info[0].amount_to_pay",
                    0
                  );
                }
              }}
              getOptionLabel={(option) => option.sales_invoice_document_id}
              isOptionEqualToValue={(option, value) =>
                option.sales_invoice_document_id ===
                value.sales_invoice_document_id
              }
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.sales_invoice_document_id}>
                    {option.sales_invoice_document_id}
                  </li>
                );
              }}
              options={salesInvoiceDocumentIdList}
              renderInput={(params) => <TextField {...params} />}
            />
          );
        } else {
          return formik.values.deposit_invoice_info[0]
            .sales_invoice_document_id;
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
      headerName: "จำนวนเงินมัดจำ",
      field: "deposit_invoice_amount",
      flex: 1,
      renderCell: () => {
        return toLocaleWithTwoDigits(parseFloat(formik.values.total_amount));
      },
    },
  ];

  const [allSalesInvoice, setAllSalesInvoice] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (formik.values.deposit_invoice_info) {
      const formatData = formik.values.deposit_invoice_info.map(
        (data, index) => ({
          id: index,
          ...data,
        })
      );
      setAllSalesInvoice(formatData);
      setRows(formatData);
    } else {
      const formatData = [
        {
          id: 1,
          sales_invoice_document_id: "",
          issue_date: "-",
          total_amount: 0,
          amount_to_pay: 0,
        },
      ];
      setAllSalesInvoice(formatData);
      setRows(formatData);
    }
  }, [formik.values.deposit_invoice_info]);

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
      {!disabled && (
        <Box sx={{ display: "flex", gap: ".5rem" }}>
          <Button
            variant="contained"
            onClick={cancelSalesInvoice}
            sx={{ mt: 2.5 }}
          >
            ยกเลิก
          </Button>
          <Button
            variant="contained"
            onClick={applyToSalesInvoice}
            sx={{ mt: 2.5 }}
          >
            บันทึก
          </Button>
        </Box>
      )}
    </>
  );
};

export default DepositInvoiceTabComponent;
