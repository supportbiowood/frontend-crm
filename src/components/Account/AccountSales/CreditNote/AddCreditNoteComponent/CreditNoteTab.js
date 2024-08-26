import {
  Box,
  Backdrop,
  CircularProgress,
  FormControl,
  FormControlLabel,
  TextField,
  Radio,
  RadioGroup,
  Grid,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import AccountPaymentMethodComponent from "../../../AccountPaymentMethodComponent";
import CreditNoteTable from "./CreditNoteTable";
import { getPaymentChannel } from "../../../../../adapter/Api";

const CreditNoteTab = ({
  disabled,
  formik,
  updateCreditNoteTab,
  salesInvoiceDocumentIdList,
  cancelCreditNoteTab,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [allPaymentChannel, setAllPaymentChannel] = useState();

  const typeChangeHandler = (event) => {
    formik.setFieldValue("credit_note_type", event.target.value);
    if (event.target.value === "credit_note") {
      formik.setFieldValue("credit_note_info", [
        {
          sales_invoice_document_id: "",
          issue_date: "-",
          total_amount: 0,
          amount_to_pay: 0,
        },
      ]);
    } else {
      formik.setFieldValue("credit_note_info", {
        payment_channel_id: null,
        payment_channel_type: null,
        payment_channel_info: null,
      });
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getPaymentChannel().then((data) => {
      const myData = data.data.data;
      setAllPaymentChannel(myData);
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <div className="account__formHeader-primary">
        <div className="account__formHeader-labelContainer">
          <h2 className="form-heading">ลดหนี้</h2>
        </div>
      </div>
      <Box
        sx={{
          boxShadow:
            "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
          borderRadius: "4px",
          padding: "1.5rem",
        }}
      >
        <FormControl component="fieldset" disabled={disabled} fullWidth>
          <RadioGroup
            name="radio-buttons-group"
            onChange={typeChangeHandler}
            value={formik.values.credit_note_type}
          >
            <FormControlLabel
              value="credit_note"
              control={
                <Radio
                  sx={{
                    "&, &.Mui-checked": {
                      color: "#419644",
                    },
                  }}
                  disableRipple
                />
              }
              label="ลดหนี้ (ยอดที่ต้องชำระตามใบแจ้งหนี้ที่เลือกจะลดลง)"
            />
            {formik.values.credit_note_type === "credit_note" && (
              <CreditNoteTable
                formik={formik}
                disabled={disabled}
                salesInvoiceDocumentIdList={salesInvoiceDocumentIdList}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            )}
            <FormControlLabel
              value="payment"
              control={
                <Radio
                  sx={{
                    "&, &.Mui-checked": {
                      color: "#419644",
                    },
                  }}
                  disableRipple
                />
              }
              label="ชำระเงินคืน (ชำระคืนเป็นเงินสด ธนาคาร หรือสำรองจ่าย)"
            />
            {formik.values.credit_note_type === "payment" && (
              <>
                <Box
                  sx={{
                    my: 2,
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                      <TextField
                        fullWidth
                        value={formik.values.total_amount}
                        size="small"
                        label="จำนวนเงินชำระคืน"
                        disabled
                        InputProps={{
                          inputProps: {
                            style: { textAlign: "right" },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ mb: 1 }}>
                  <b>ช่องทางการชำระเงิน</b>
                </Box>
                <AccountPaymentMethodComponent
                  disabled={disabled}
                  formik={formik}
                  allPaymentChannel={allPaymentChannel}
                  creditNote
                />
              </>
            )}
          </RadioGroup>
        </FormControl>
      </Box>
      {!disabled && (
        <Box sx={{ mt: 2.5, display: "flex", gap: ".5rem" }}>
          <Button variant="contained" onClick={cancelCreditNoteTab}>
            ยกเลิก
          </Button>
          <Button variant="contained" onClick={updateCreditNoteTab}>
            บันทึก
          </Button>
        </Box>
      )}
    </>
  );
};

export default CreditNoteTab;
