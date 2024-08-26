import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Autocomplete,
  Box,
  createFilterOptions,
  Grid,
  TextField,
} from "@mui/material";
import SelectPaymentMethod from "./SelectPaymentMethod";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import PaymentMethodRadioButton from "./PaymentMethodRadioButton";
import SelectBank from "./SelectBank";
import SelectAccountType from "./SelectAccountType";
import SelectPlatformType from "./SelectPlatFormType";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const filter = createFilterOptions();

const CreditNotePayment = ({ formik, allPaymentChannel, disabled }) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [payment, setPayment] = useState("");

  const defaultValue =
    formik.values.credit_note_info.payment_channel_info !== null &&
    formik.values.credit_note_info.payment_channel_info?.platform_name ===
      "ผู้ให้บริการรับชำระ"
      ? [
          { title: "2C2P" },
          { title: "OMISE" },
          { title: "True wallet" },
          { title: "LINE Pay/wePAY" },
          { title: "Paypal" },
          { title: "Pay solutions" },
          { title: "GBPrimePAY" },
        ]
      : [{ title: "Shopee" }, { title: "Lazada" }];

  useEffect(() => {
    if (
      formik.values.credit_note_info.payment_channel_type === "cash" ||
      formik.values.credit_note_info.payment_channel_type === "bank" ||
      formik.values.credit_note_info.payment_channel_type === "e_wallet" ||
      formik.values.credit_note_info.payment_channel_type === "receiver"
    ) {
      if (formik.values.credit_note_info.payment_channel_id) {
        setPaymentMethod(formik.values.credit_note_info.payment_channel_id);
      } else {
        setPaymentMethod("addNewPayment");
      }
      switch (formik.values.credit_note_info.payment_channel_type) {
        case "cash":
          setPayment("cash");
          break;
        case "bank":
          setPayment("bank");
          break;
        case "e_wallet":
          setPayment("e_wallet");
          break;
        case "receiver":
          setPayment("receiver");
          break;
        default:
          setPayment("");
      }
    } else if (
      formik.values.credit_note_info.payment_channel_type === "check"
    ) {
      setPaymentMethod("check");
    }
  }, [
    paymentMethod,
    allPaymentChannel,
    formik.values.credit_note_info.payment_channel_id,
    formik.values.credit_note_info.payment_channel_info,
    formik.values.credit_note_info.payment_channel_type,
  ]);

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
    setPayment("");
    if (event.target.value === "check") {
      formik.setFieldValue("credit_note_info.payment_channel_id", null);
      formik.setFieldValue("credit_note_info.payment_channel_info", "");
      formik.setFieldValue("credit_note_info.check_info.pay_to", "บจ.");
      formik.setFieldValue(
        "credit_note_info.check_info.check_date",
        moment().format()
      );
    } else if (event.target.value === "addNewPayment") {
      formik.setFieldValue("credit_note_info.payment_channel_id", null);
      formik.setFieldValue("credit_note_info.check_info", null);
    } else {
      formik.setFieldValue(
        "credit_note_info.payment_channel_id",
        event.target.value
      );
      const findPaymentChannel = allPaymentChannel.find(
        (channel) => channel.payment_channel_id === event.target.value
      );
      switch (findPaymentChannel.payment_channel_type) {
        case "cash":
          setPayment("cash");
          formik.setFieldValue("credit_note_info.payment_channel_type", "cash");
          formik.setFieldValue(
            "credit_note_info.payment_channel_info.cash_name",
            findPaymentChannel.payment_channel_info.cash_name
          );
          break;
        case "bank":
          setPayment("bank");
          formik.setFieldValue("credit_note_info.payment_channel_type", "bank");
          formik.setFieldValue(
            "credit_note_info.payment_channel_info.bank_name",
            findPaymentChannel.payment_channel_info.bank_name
          );
          formik.setFieldValue(
            "credit_note_info.payment_channel_info.account_no",
            findPaymentChannel.payment_channel_info.account_no
          );
          formik.setFieldValue(
            "credit_note_info.payment_channel_info.account_name",
            findPaymentChannel.payment_channel_info.account_name
          );
          formik.setFieldValue(
            "credit_note_info.payment_channel_info.account_type",
            findPaymentChannel.payment_channel_info.account_type
          );
          break;
        case "e_wallet":
          setPayment("e_wallet");
          formik.setFieldValue(
            "credit_note_info.payment_channel_type",
            "e_wallet"
          );
          formik.setFieldValue(
            "credit_note_info.payment_channel_info.account_no",
            findPaymentChannel.payment_channel_info.account_no
          );
          formik.setFieldValue(
            "credit_note_info.payment_channel_info.account_name",
            findPaymentChannel.payment_channel_info.account_name
          );
          formik.setFieldValue(
            "credit_note_info.payment_channel_info.platform_name",
            findPaymentChannel.payment_channel_info.platform_name
          );
          formik.setFieldValue(
            "credit_note_info.payment_channel_info.provider_name",
            findPaymentChannel.payment_channel_info.provider_name
          );
          break;
        case "receiver":
          setPayment("receiver");
          formik.setFieldValue(
            "credit_note_info.payment_channel_type",
            "receiver"
          );
          formik.setFieldValue(
            "credit_note_info.payment_channel_info.receiver_name",
            findPaymentChannel.payment_channel_info.receiver_name
          );
          break;
        default:
          formik.setFieldValue("credit_note_info.payment_channel_type", null);
          formik.setFieldValue("credit_note_info.payment_channel_info", null);
          setPayment("");
      }
    }
  };

  const handlePaymentChange = (event) => {
    formik.setFieldValue(
      "credit_note_info.payment_channel_type",
      event.target.value
    );
    formik.setFieldValue("credit_note_info.payment_channel_info", null);
    setPayment(event.target.value);
  };

  const handleAccountTypeChange = (event) => {
    if (formik.values.credit_note_info.payment_channel_type === "bank") {
      formik.setFieldValue(
        "credit_note_info.payment_channel_info.account_type",
        event.target.value
      );
    }
  };
  return (
    <>
      {formik.values.payment_channel_type === "cash" && (
        <Box>เลขที่ช่องทางการเงิน: CSH002</Box>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
          <SelectPaymentMethod
            disabled={disabled}
            paymentMethod={paymentMethod}
            handlePaymentMethodChange={handlePaymentMethodChange}
            allPaymentChannel={allPaymentChannel}
          />
        </Grid>
        {paymentMethod === "check" && (
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                disabled={
                  disabled || formik.values.credit_note_info.payment_channel_id
                }
                label="วันที่เช็ค"
                value={
                  formik.values.credit_note_info.check_info?.check_date || ""
                }
                inputFormat="dd/MM/yyyy"
                onChange={(newValue) => {
                  formik.setFieldValue(
                    "credit_note_info.check_info.check_date",
                    newValue
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    sx={{ my: "1rem" }}
                    fullWidth
                    size="small"
                    {...params}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
        )}
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          {paymentMethod &&
            paymentMethod.length !== 0 &&
            paymentMethod !== "check" && (
              <PaymentMethodRadioButton
                handlePaymentChange={handlePaymentChange}
                payment={payment}
                disabled={
                  disabled || formik.values.credit_note_info.payment_channel_id
                }
              />
            )}
        </Grid>
      </Grid>
      {payment === "cash" && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              disabled={
                disabled || formik.values.credit_note_info.payment_channel_id
              }
              name="credit_note_info.payment_channel_info.cash_name"
              value={
                formik.values.credit_note_info.payment_channel_info
                  ?.cash_name || ""
              }
              onChange={formik.handleChange}
              fullWidth
              margin="normal"
              size="small"
              label="ชื่อช่องทางเงินสด"
              placeholder="ระบุชื่อเงินสด"
              required
            />
          </Grid>
        </Grid>
      )}
      {payment === "bank" && (
        <>
          <Grid
            container
            spacing={{
              xl: 2,
              lg: 2,
              md: 2,
              sm: 0,
              xs: 0,
            }}
          >
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
              <SelectBank
                label="ธนาคาร"
                disabled={
                  disabled || formik.values.credit_note_info.payment_channel_id
                }
                bank={
                  formik.values.credit_note_info.payment_channel_info
                    ?.bank_name || ""
                }
                name="credit_note_info.payment_channel_info.bank_name"
                formik={formik}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
              <SelectAccountType
                disabled={
                  disabled || formik.values.credit_note_info.payment_channel_id
                }
                accountType={
                  formik.values.credit_note_info.payment_channel_info
                    ?.account_type || ""
                }
                handleAccountTypeChange={handleAccountTypeChange}
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={{
              xl: 2,
              lg: 2,
              md: 2,
              sm: 0,
              xs: 0,
            }}
          >
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
              <TextField
                disabled={
                  disabled || formik.values.credit_note_info.payment_channel_id
                }
                name="credit_note_info.payment_channel_info.account_name"
                value={
                  formik.values.credit_note_info.payment_channel_info
                    ?.account_name || ""
                }
                onChange={formik.handleChange}
                fullWidth
                margin="normal"
                size="small"
                label="ชื่อบัญชีธนาคาร"
                placeholder="ระบุชื่อบัญชีธนาคาร"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
              <TextField
                disabled={
                  disabled || formik.values.credit_note_info.payment_channel_id
                }
                name="credit_note_info.payment_channel_info.account_no"
                value={
                  formik.values.credit_note_info.payment_channel_info
                    ?.account_no || ""
                }
                onChange={formik.handleChange}
                fullWidth
                margin="normal"
                size="small"
                label="เลขบัญชีธนาคาร"
                placeholder="ระบุเลขบัญชีธนาคาร"
              />
            </Grid>
          </Grid>
        </>
      )}
      {payment === "e_wallet" && (
        <>
          <Grid
            container
            spacing={{
              xl: 2,
              lg: 2,
              md: 2,
              sm: 0,
              xs: 0,
            }}
          >
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
              <SelectPlatformType
                label="รูปแบบผู้ให้บริการ"
                name="credit_note_info.payment_channel_info.platform_name"
                platform={
                  formik.values.credit_note_info.payment_channel_info
                    ?.platform_name || ""
                }
                formik={formik}
                disabled={
                  disabled || formik.values.credit_note_info.payment_channel_id
                }
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
              <Autocomplete
                fullWidth
                disabled={
                  disabled || formik.values.credit_note_info?.payment_channel_id
                }
                size="small"
                value={
                  formik.values.credit_note_info?.payment_channel_info
                    ?.provider_name || ""
                }
                onChange={(_, newValue) => {
                  if (typeof newValue === "string") {
                    formik.setFieldValue(
                      "credit_note_info.payment_channel_info.provider_name",
                      newValue
                    );
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    formik.setFieldValue(
                      "credit_note_info.payment_channel_info.provider_name",
                      newValue.inputValue
                    );
                  } else {
                    formik.setFieldValue(
                      "credit_note_info.payment_channel_info.provider_name",
                      newValue?.title || ""
                    );
                  }
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);
                  const { inputValue } = params;
                  // Suggest the creation of a new value
                  const isExisting = options.some(
                    (option) => inputValue === option.title
                  );
                  if (inputValue !== "" && !isExisting) {
                    filtered.push({
                      inputValue,
                      title: `เพิ่ม "${inputValue}"`,
                    });
                  }
                  return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                id="free-solo-with-text-demo"
                options={defaultValue}
                getOptionLabel={(option) => {
                  // Value selected with enter, right from the input
                  if (typeof option === "string") {
                    return option;
                  }
                  // Add "xxx" option created dynamically
                  if (option.inputValue) {
                    return option.inputValue;
                  }
                  // Regular option
                  return option.title;
                }}
                renderOption={(props, option) => (
                  <li {...props}>{option.title}</li>
                )}
                freeSolo
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="normal"
                    label="ผู้ให้บริการ"
                    placeholder="ระบุผู้ให้บริการ"
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid
            container
            spacing={{
              xl: 2,
              lg: 2,
              md: 2,
              sm: 0,
              xs: 0,
            }}
          >
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
              <TextField
                required
                disabled={
                  disabled || formik.values.credit_note_info.payment_channel_id
                }
                name="credit_note_info.payment_channel_info.account_name"
                value={
                  formik.values.credit_note_info.payment_channel_info
                    ?.account_name || ""
                }
                onChange={formik.handleChange}
                fullWidth
                margin="normal"
                size="small"
                label="ชื่อบัญชีที่ให้บริการ"
                placeholder="ระบุชื่อบัญชีที่ให้บริการ"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
              <TextField
                disabled={
                  disabled || formik.values.credit_note_info.payment_channel_id
                }
                name="credit_note_info.payment_channel_info.account_no"
                value={
                  formik.values.credit_note_info.payment_channel_info
                    ?.account_no || ""
                }
                onChange={formik.handleChange}
                fullWidth
                margin="normal"
                size="small"
                label="เลขที่บัญชีที่ให้บริการ"
                placeholder="ระบุเลขที่บัญชีที่ให้บริการ"
              />
            </Grid>
          </Grid>
        </>
      )}
      {payment === "receiver" && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              disabled={
                disabled || formik.values.credit_note_info.payment_channel_id
              }
              name="credit_note_info.payment_channel_info.receiver_name"
              value={
                formik.values.credit_note_info.payment_channel_info
                  ?.receiver_name || ""
              }
              onChange={formik.handleChange}
              fullWidth
              margin="normal"
              size="small"
              label="ชื่อผู้ที่สำรองจ่าย"
              placeholder="ระบุชื่อผู้ที่สำรองจ่าย"
              required
            />
          </Grid>
        </Grid>
      )}
      {paymentMethod === "check" && (
        <Box>
          <p>
            จ่ายให้กับ:{" "}
            {formik.values.credit_note_info.check_info?.pay_to || ""}
          </p>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
              <SelectBank
                label="ธนาคารผู้ออกเช็ค"
                name="credit_note_info.check_info.bank_name"
                bank={
                  formik.values.credit_note_info.check_info?.bank_name || ""
                }
                formik={formik}
                disabled={
                  disabled || formik.values.credit_note_info.payment_channel_id
                }
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
              <TextField
                disabled={
                  disabled || formik.values.credit_note_info.payment_channel_id
                }
                name="credit_note_info.check_info.total_amount"
                value={
                  formik.values.credit_note_info.check_info?.total_amount ||
                  formik.values.credit_note_info.total_amount ||
                  ""
                }
                onChange={(e) => {
                  formik.setFieldValue(
                    "credit_note_info.check_info.total_amount",
                    e.target.value
                  );
                }}
                type="number"
                fullWidth
                margin="normal"
                size="small"
                label="จำนวนเงิน"
                placeholder="ระบุจำนวนเงิน"
                required
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
              <TextField
                disabled={
                  disabled || formik.values.credit_note_info.payment_channel_id
                }
                name="credit_note_info.check_info.check_no"
                value={
                  formik.values.credit_note_info.check_info?.check_no || ""
                }
                onChange={formik.handleChange}
                fullWidth
                margin="normal"
                size="small"
                label="เลขที่เช็ค"
                placeholder="ระบุเลขที่เช็ค"
                required
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
              <TextField
                disabled={
                  disabled || formik.values.credit_note_info.payment_channel_id
                }
                name="credit_note_info.check_info.branch_no"
                value={
                  formik.values.credit_note_info.check_info?.branch_no || ""
                }
                onChange={formik.handleChange}
                fullWidth
                margin="normal"
                size="small"
                label="เลขที่สาขา"
                placeholder="ระบุเลขที่สาขา"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
              <TextField
                disabled={
                  disabled || formik.values.credit_note_info.payment_channel_id
                }
                name="credit_note_info.check_info.account_no"
                value={
                  formik.values.credit_note_info.check_info?.account_no || ""
                }
                onChange={formik.handleChange}
                fullWidth
                margin="normal"
                size="small"
                label="เลขที่บัญชี"
                placeholder="ระบุเลขที่บัญชี"
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default CreditNotePayment;
