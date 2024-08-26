import React, { useState, useEffect } from "react";
import moment from "moment";
import {
  Autocomplete,
  Box,
  Checkbox,
  createFilterOptions,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  MenuItem,
  Select,
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

const withHoldingTaxOption = [
  { name: "กำหนดเอง", value: "กำหนดเอง" },
  { name: "0.75%", value: "0.75%" },
  { name: "1%", value: "1%" },
  { name: "1.5%", value: "1.5%" },
  { name: "2%", value: "2%" },
  { name: "3%", value: "3%" },
  { name: "5%", value: "5%" },
  { name: "10%", value: "10%" },
  { name: "15%", value: "15%" },
];

const PaymentReceipt = ({
  formik,
  billingNote,
  allPaymentChannel,
  disabled,
  error,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [payment, setPayment] = useState("");
  const [checked, setChecked] = useState(false);

  const defaultValue =
    formik.values.payment_channel_info !== null &&
    formik.values.payment_channel_info?.platform_name === "ผู้ให้บริการรับชำระ"
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
      formik.values.payment_channel_type === "cash" ||
      formik.values.payment_channel_type === "bank" ||
      formik.values.payment_channel_type === "e_wallet" ||
      formik.values.payment_channel_type === "receiver"
    ) {
      if (formik.values.payment_channel_id) {
        setPaymentMethod(formik.values.payment_channel_id);
      } else {
        setPaymentMethod("addNewPayment");
      }
      switch (formik.values.payment_channel_type) {
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
    } else if (formik.values.payment_channel_type === "check") {
      setPaymentMethod("check");
    }
  }, [
    paymentMethod,
    allPaymentChannel,
    formik.values.payment_channel_id,
    formik.values.payment_channel_info,
    formik.values.payment_channel_type,
  ]);

  const handlePaymentMethodChange = (event) => {
    formik.setFieldValue("payment_channel_type", event.target.value);
    setPaymentMethod(event.target.value);
    setPayment("");
    if (event.target.value === "check") {
      formik.setFieldValue("payment_channel_id", null);
      formik.setFieldValue("payment_channel_info", "");
      formik.setFieldValue("check_info.pay_to", "บจ.");
      formik.setFieldValue("check_info.check_date", moment().format());
      if (!billingNote) {
        formik.setFieldValue("payment_receipt_data[0].received_amount", 0);
      }
    } else if (event.target.value === "addNewPayment") {
      formik.setFieldValue("payment_channel_id", null);
      formik.setFieldValue("check_info", null);
      /* Ask P'Bee again before deliver to user */
      // if (!billingNote) {
      //   formik.setFieldValue("payment_receipt_data[0].received_amount", 0);
      // }
    } else {
      formik.setFieldValue("payment_channel_id", event.target.value);
      const findPaymentChannel = allPaymentChannel.find(
        (channel) => channel.payment_channel_id === event.target.value
      );
      switch (findPaymentChannel.payment_channel_type) {
        case "cash":
          setPayment("cash");
          formik.setFieldValue(
            "payment_channel_info.cash_name",
            findPaymentChannel.payment_channel_info.cash_name
          );
          break;
        case "bank":
          setPayment("bank");
          formik.setFieldValue(
            "payment_channel_info.bank_name",
            findPaymentChannel.payment_channel_info.bank_name
          );
          formik.setFieldValue(
            "payment_channel_info.account_no",
            findPaymentChannel.payment_channel_info.account_no
          );
          formik.setFieldValue(
            "payment_channel_info.account_name",
            findPaymentChannel.payment_channel_info.account_name
          );
          formik.setFieldValue(
            "payment_channel_info.account_type",
            findPaymentChannel.payment_channel_info.account_type
          );
          break;
        case "e_wallet":
          setPayment("e_wallet");
          formik.setFieldValue(
            "payment_channel_info.account_no",
            findPaymentChannel.payment_channel_info.account_no
          );
          formik.setFieldValue(
            "payment_channel_info.account_name",
            findPaymentChannel.payment_channel_info.account_name
          );
          formik.setFieldValue(
            "payment_channel_info.platform_name",
            findPaymentChannel.payment_channel_info.platform_name
          );
          formik.setFieldValue(
            "payment_channel_info.provider_name",
            findPaymentChannel.payment_channel_info.provider_name
          );
          break;
        case "receiver":
          setPayment("receiver");
          formik.setFieldValue(
            "payment_channel_info.receiver_name",
            findPaymentChannel.payment_channel_info.receiver_name
          );
          break;
        default:
          formik.setFieldValue("payment_channel_info", null);
          setPayment("");
      }
    }
  };

  const handlePaymentChange = (event) => {
    switch (event.target.value) {
      case "cash":
        formik.setFieldValue("payment_channel_type", "cash");
        formik.setFieldValue("payment_channel_info", {
          cash_name: "",
        });
        break;
      case "bank":
        formik.setFieldValue("payment_channel_type", "bank");
        formik.setFieldValue("payment_channel_info", {
          bank_name: "",
          account_type: "",
          account_name: "",
          account_no: "",
        });
        break;
      case "e_wallet":
        formik.setFieldValue("payment_channel_type", "e_wallet");
        formik.setFieldValue("payment_channel_info", {
          platform_name: "",
          provider_name: "",
          account_name: "",
          account_no: "",
        });
        break;
      case "receiver":
        formik.setFieldValue("payment_channel_type", "receiver");
        formik.setFieldValue("payment_channel_info", {
          receiver_name: "",
        });
        break;
      default:
        formik.setFieldValue("payment_channel_type", null);
        formik.setFieldValue("payment_channel_info", null);
    }
    setPayment(event.target.value);
  };

  const handleAccountTypeChange = (event) => {
    if (formik.values.payment_channel_type === "bank") {
      formik.setFieldValue(
        "payment_channel_info.account_type",
        event.target.value
      );
    }
  };

  const handleCheckedChange = () => {
    setChecked(!checked);
    if (!checked) {
      formik.setFieldValue("withholding_tax.tax", null);
      formik.setFieldValue("withholding_tax.withholding_tax_amount", 0);
    }
  };

  const withholdingTaxChangeHandler = (e) => {
    switch (e.target.value) {
      case "0.75%": {
        const withholdingTaxAmount = formik.values.total_amount * 0.0075;
        formik.setFieldValue("withholding_tax.tax", e.target.value);
        formik.setFieldValue(
          "withholding_tax.withholding_tax_amount",
          withholdingTaxAmount
        );
        break;
      }
      case "1%": {
        const withholdingTaxAmount = formik.values.total_amount * 0.01;
        formik.setFieldValue("withholding_tax.tax", e.target.value);
        formik.setFieldValue(
          "withholding_tax.withholding_tax_amount",
          withholdingTaxAmount
        );
        break;
      }
      case "1.5%": {
        const withholdingTaxAmount = formik.values.total_amount * 0.015;
        formik.setFieldValue("withholding_tax.tax", e.target.value);
        formik.setFieldValue(
          "withholding_tax.withholding_tax_amount",
          withholdingTaxAmount
        );
        break;
      }
      case "2%": {
        const withholdingTaxAmount = formik.values.total_amount * 0.02;
        formik.setFieldValue("withholding_tax.tax", e.target.value);
        formik.setFieldValue(
          "withholding_tax.withholding_tax_amount",
          withholdingTaxAmount
        );
        break;
      }
      case "3%": {
        const withholdingTaxAmount = formik.values.total_amount * 0.03;
        formik.setFieldValue("withholding_tax.tax", e.target.value);
        formik.setFieldValue(
          "withholding_tax.withholding_tax_amount",
          withholdingTaxAmount
        );
        break;
      }
      case "5%": {
        const withholdingTaxAmount = formik.values.total_amount * 0.05;
        formik.setFieldValue("withholding_tax.tax", e.target.value);
        formik.setFieldValue(
          "withholding_tax.withholding_tax_amount",
          withholdingTaxAmount
        );
        break;
      }
      case "10%": {
        const withholdingTaxAmount = formik.values.total_amount * 0.1;
        formik.setFieldValue("withholding_tax.tax", e.target.value);
        formik.setFieldValue(
          "withholding_tax.withholding_tax_amount",
          withholdingTaxAmount
        );
        break;
      }
      case "15%": {
        const withholdingTaxAmount = formik.values.total_amount * 0.15;
        formik.setFieldValue("withholding_tax.tax", e.target.value);
        formik.setFieldValue(
          "withholding_tax.withholding_tax_amount",
          withholdingTaxAmount
        );
        break;
      }
      default:
        formik.setFieldValue("withholding_tax.tax", e.target.value);
        formik.setFieldValue("withholding_tax.withholding_tax_amount", 0);
    }
  };

  useEffect(() => {
    if (formik.values.withholding_tax) {
      setChecked(true);
    }
  }, [formik.values.withholding_tax]);

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
                disabled={disabled || formik.values.payment_channel_id}
                label="วันที่เช็ค"
                value={formik.values.check_info?.check_date || ""}
                inputFormat="dd/MM/yyyy"
                onChange={(newValue) => {
                  formik.setFieldValue("check_info.check_date", newValue);
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
                disabled={disabled || formik.values.payment_channel_id}
              />
            )}
        </Grid>
      </Grid>
      {payment === "cash" && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              error={error}
              helperText={error}
              disabled={disabled || formik.values.payment_channel_id}
              name="payment_channel_info.cash_name"
              value={formik.values.payment_channel_info?.cash_name || ""}
              onChange={formik.handleChange}
              fullWidth
              margin="normal"
              size="small"
              label="ชื่อช่องทางเงินสด"
              placeholder="ระบุชื่อเงินสด"
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
                disabled={disabled || formik.values.payment_channel_id}
                bank={formik.values.payment_channel_info?.bank_name || ""}
                name="payment_channel_info.bank_name"
                formik={formik}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
              <SelectAccountType
                disabled={disabled || formik.values.payment_channel_id}
                accountType={
                  formik.values.payment_channel_info?.account_type || ""
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
                disabled={disabled || formik.values.payment_channel_id}
                name="payment_channel_info.account_name"
                value={formik.values.payment_channel_info?.account_name || ""}
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
                disabled={disabled || formik.values.payment_channel_id}
                name="payment_channel_info.account_no"
                value={formik.values.payment_channel_info?.account_no || ""}
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
                name="payment_channel_info.platform_name"
                platform={
                  formik.values.payment_channel_info?.platform_name || ""
                }
                formik={formik}
                disabled={disabled || formik.values.payment_channel_id}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
              <Autocomplete
                fullWidth
                disabled={disabled || formik.values.payment_channel_id}
                size="small"
                value={formik.values.payment_channel_info?.provider_name || ""}
                onChange={(_, newValue) => {
                  if (typeof newValue === "string") {
                    formik.setFieldValue(
                      "payment_channel_info.provider_name",
                      newValue
                    );
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    formik.setFieldValue(
                      "payment_channel_info.provider_name",
                      newValue.inputValue
                    );
                  } else {
                    formik.setFieldValue(
                      "payment_channel_info.provider_name",
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
                disabled={disabled || formik.values.payment_channel_id}
                name="payment_channel_info.account_name"
                value={formik.values.payment_channel_info?.account_name || ""}
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
                disabled={disabled || formik.values.payment_channel_id}
                name="payment_channel_info.account_no"
                value={formik.values.payment_channel_info?.account_no || ""}
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
              disabled={disabled || formik.values.payment_channel_id}
              name="payment_channel_info.receiver_name"
              value={formik.values.payment_channel_info?.receiver_name || ""}
              onChange={formik.handleChange}
              fullWidth
              margin="normal"
              size="small"
              label="ชื่อผู้ที่สำรองจ่าย"
              placeholder="ระบุชื่อผู้ที่สำรองจ่าย"
            />
          </Grid>
        </Grid>
      )}
      {paymentMethod === "check" && (
        <Box>
          <p>จ่ายให้กับ: {formik.values.check_info?.pay_to || ""}</p>
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
                label="ธนาคารผู้ออกเช็ค"
                name="check_info.bank_name"
                bank={formik.values.check_info?.bank_name || ""}
                formik={formik}
                disabled={disabled || formik.values.payment_channel_id}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
              <TextField
                disabled={
                  disabled || billingNote || formik.values.payment_channel_id
                }
                name="check_info.total_amount"
                value={
                  formik.values.check_info?.total_amount ||
                  formik.values.total_amount ||
                  ""
                }
                onChange={(e) => {
                  formik.setFieldValue(
                    "check_info.total_amount",
                    e.target.value
                  );
                  formik.setFieldValue(
                    "payment_receipt_data[0].received_amount",
                    e.target.value
                  );
                }}
                type="number"
                fullWidth
                margin="normal"
                size="small"
                label="จำนวนเงิน"
                placeholder="ระบุจำนวนเงิน"
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
                disabled={disabled || formik.values.payment_channel_id}
                name="check_info.check_no"
                value={formik.values.check_info?.check_no || ""}
                onChange={formik.handleChange}
                fullWidth
                margin="normal"
                size="small"
                label="เลขที่เช็ค"
                placeholder="ระบุเลขที่เช็ค"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
              <TextField
                disabled={disabled || formik.values.payment_channel_id}
                name="check_info.branch_no"
                value={formik.values.check_info?.branch_no || ""}
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
                disabled={disabled || formik.values.payment_channel_id}
                name="check_info.account_no"
                value={formik.values.check_info?.account_no || ""}
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
      {paymentMethod && (
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                disabled={disabled}
                checked={checked}
                onChange={handleCheckedChange}
                inputProps={{ "aria-label": "controlled" }}
                sx={{
                  "&.Mui-checked": {
                    color: "#419644",
                  },
                }}
              />
            }
            label="ภาษีหัก ณ ที่จ่าย"
          />
        </FormGroup>
      )}
      {paymentMethod && checked && (
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
            <FormControl fullWidth size="small" margin="normal">
              <InputLabel disabled={disabled} id="demo-simple-select-label">
                อัตราที่หัก
              </InputLabel>
              <Select
                disabled={disabled}
                name="withholding_tax.tax"
                value={formik.values.withholding_tax?.tax || ""}
                label="อัตราที่หัก"
                onChange={withholdingTaxChangeHandler}
              >
                {withHoldingTaxOption.map((tax, index) => (
                  <MenuItem key={index} value={tax.value}>
                    {tax.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              disabled={
                disabled || formik.values.withholding_tax.tax !== "กำหนดเอง"
              }
              name="withholding_tax.withholding_tax_amount"
              value={formik.values.withholding_tax.withholding_tax_amount.toFixed(
                2
              )}
              onChange={formik.handleChange}
              fullWidth
              margin="normal"
              size="small"
              label="มูลค่าภาษี หัก ณ ที่จ่าย"
              placeholder="ระบุมูลค่าภาษี หัก ณ ที่จ่าย"
            />
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default PaymentReceipt;
