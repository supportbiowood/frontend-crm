import { TextField } from "@mui/material";
import { Box } from "@mui/system";
import moment from "moment";
import { useEffect, useState } from "react";
import { toLocaleWithTwoDigits } from "../../../../../adapter/Utils";
import AccountTableComponent from "../../../AccountTableComponent";

const PaymentHistory = ({
  paymentReceiptList,
  formik,
  disabled,
  billingNote,
}) => {
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
      headerName: "จำนวนเงิน",
      field: "received_amount",
      flex: 1,
      renderCell: (params) => {
        if (formik.values.payment_receipt_data.length === 1) {
          return (
            <TextField
              disabled={
                formik.values.payment_channel_type === "check" ||
                billingNote ||
                disabled
              }
              autoComplete="off"
              type="number"
              name="payment_receipt_data[0].received_amount"
              value={formik.values.payment_receipt_data[0].received_amount}
              onChange={(e) => {
                const value = e.target.value;
                formik.setFieldValue(
                  "payment_receipt_data[0].received_amount",
                  value
                );
                switch (formik.values.withholding_tax?.tax) {
                  case "0.75%": {
                    const withholdingTaxAmount = value * 0.0075;
                    formik.setFieldValue(
                      "withholding_tax.withholding_tax_amount",
                      withholdingTaxAmount
                    );
                    break;
                  }
                  case "1%": {
                    const withholdingTaxAmount = value * 0.01;
                    formik.setFieldValue(
                      "withholding_tax.withholding_tax_amount",
                      withholdingTaxAmount
                    );
                    break;
                  }
                  case "1.5%": {
                    const withholdingTaxAmount = value * 0.015;
                    formik.setFieldValue(
                      "withholding_tax.withholding_tax_amount",
                      withholdingTaxAmount
                    );
                    break;
                  }
                  case "2%": {
                    const withholdingTaxAmount = value * 0.02;
                    formik.setFieldValue(
                      "withholding_tax.withholding_tax_amount",
                      withholdingTaxAmount
                    );
                    break;
                  }
                  case "3%": {
                    const withholdingTaxAmount = value * 0.03;
                    formik.setFieldValue(
                      "withholding_tax.withholding_tax_amount",
                      withholdingTaxAmount
                    );
                    break;
                  }
                  case "5%": {
                    const withholdingTaxAmount = value * 0.05;
                    formik.setFieldValue(
                      "withholding_tax.withholding_tax_amount",
                      withholdingTaxAmount
                    );
                    break;
                  }
                  case "10%": {
                    const withholdingTaxAmount = value * 0.1;
                    formik.setFieldValue(
                      "withholding_tax.withholding_tax_amount",
                      withholdingTaxAmount
                    );
                    break;
                  }
                  case "15%": {
                    const withholdingTaxAmount = value * 0.15;
                    formik.setFieldValue(
                      "withholding_tax.withholding_tax_amount",
                      withholdingTaxAmount
                    );
                    break;
                  }
                  default:
                    formik.setFieldValue(
                      "withholding_tax.withholding_tax_amount",
                      0
                    );
                }
              }}
              size="small"
              fullWidth
            />
          );
        } else {
          const received_amount = params.row.received_amount;
          return toLocaleWithTwoDigits(received_amount);
        }
      },
    },
  ];

  const [allPaymentReceipt, setAllPaymentReceipt] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const formatData = paymentReceiptList.map((paymentReceipt, index) => {
      return {
        id: index + 1,
        ...paymentReceipt,
      };
    });
    setAllPaymentReceipt(formatData);
    setRows(formatData);
  }, [paymentReceiptList]);

  return (
    <Box sx={{ mb: "1.5rem" }}>
      <AccountTableComponent
        tableRows={allPaymentReceipt}
        tableColumns={columns}
        rows={rows}
        setRows={setRows}
        short
        hideFooter
      />
    </Box>
  );
};

export default PaymentHistory;
