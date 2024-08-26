import { TextField } from "@mui/material";
import { Box } from "@mui/system";
import moment from "moment";
import { useEffect, useState } from "react";
import { toLocaleWithTwoDigits } from "../../../../../adapter/Utils";
import AccountTableComponent from "../../../AccountTableComponent";

const PaymentDepositHistory = ({ paymentReceiptData, formik, disabled }) => {
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
      headerName: "จำนวนเงิน",
      field: "received_amount",
      flex: 1,
      renderCell: (params) => {
        if (formik.values.payment_receipt_data.length === 1) {
          return (
            <TextField
              disabled={
                formik.values.payment_channel_type === "check" || disabled
              }
              autoComplete="off"
              type="number"
              name="payment_receipt_data[0].received_amount"
              value={formik.values.payment_receipt_data[0].received_amount}
              onChange={formik.handleChange}
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
    const formatData = paymentReceiptData.map((paymentReceipt, index) => {
      return {
        id: index + 1,
        ...paymentReceipt,
      };
    });
    setAllPaymentReceipt(formatData);
    setRows(formatData);
  }, [paymentReceiptData]);

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

export default PaymentDepositHistory;
