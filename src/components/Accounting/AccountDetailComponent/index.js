import React from "react";
import { Grid } from "@mui/material";
import TextFieldCustom from "../AccountReuseComponent/TextFieldCustom";
import AutoCompleteCustom from "../AccountReuseComponent/AutoCompleteCustom";
import ButtonComponent from "../../ButtonComponent";

export default function AccountDetailComponent({
  disabled,
  view,
  values,
  formik,
}) {
  const handleChange = formik.handleChange;

  const disabledField = (disabled, data) => {
    if (!view) return false;
    if (disabled) return true;
    if (!disabled && data && data !== undefined) return false;
    if (!disabled && !data && data === undefined) return true;
  };

  const MainField = [
    {
      id: "account_type_id",
      name: "account_type_id",
      values: values.account_type_id,
      label: "ผังบัญชีหลัก",
      disabled: disabledField(disabled, values.employee_id),
      onChange: handleChange,
      errors:
        formik.errors.account_type_id &&
        formik.touched.account_type_id &&
        formik.errors.account_type_id,
      helperText:
        formik.errors.account_type_id &&
        formik.touched.account_type_id &&
        formik.errors.account_type_id,
    },
    {
      id: "-",
      name: "-",
      label: "ผังบัญชีรอง",
      disabled: disabledField(disabled, values.employee_id),
      onChange: handleChange,
      // errors: formik.errors.account_type_id,
      // helperText: formik.errors.account_type_id,
    },
    {
      id: "-",
      name: "-",
      label: "ผังบัญชีย่อย",
      disabled: disabledField(disabled, values.employee_id),
      onChange: handleChange,
      // errors: formik.errors.account_type_id,
      // helperText: formik.errors.account_type_id,
    },
  ];

  const SecondField = [
    {
      id: "account_code",
      name: "account_code",
      label: "รหัสบัญชี",
      values: values.account_code,
      disabled: disabled,
      onChange: handleChange,
      errors:
        formik.errors.account_code &&
        formik.touched.account_type_id &&
        formik.errors.account_type_id,
      helperText:
        formik.errors.account_code &&
        formik.touched.account_type_id &&
        formik.errors.account_type_id,
    },
    {
      id: "account_name_th",
      name: "account_name_th",
      values: values.account_name_th,
      label: "ชื่อบัญชีภาษาไทย",
      disabled: disabled,
      onChange: handleChange,
      errors:
        formik.errors.account_name_th &&
        formik.touched.account_type_id &&
        formik.errors.account_type_id,
      helperText:
        formik.errors.account_name_th &&
        formik.touched.account_type_id &&
        formik.errors.account_type_id,
    },
    {
      id: "account_name",
      name: "account_name",
      label: "ชื่อบัญชีภาษาอังกฤษ",
      values: values.account_name,
      disabled: disabled,
      onChange: handleChange,
      errors:
        formik.errors.account_name &&
        formik.touched.account_type_id &&
        formik.errors.account_type_id,
      helperText:
        formik.errors.account_name &&
        formik.touched.account_type_id &&
        formik.errors.account_type_id,
    },
  ];

  const LastField = [
    {
      id: "account_input_tax",
      name: "account_input_tax",
      label: "ประเภทเงินได้ภาษี",
      values: values.account_input_tax,
      disabled: disabled,
      onChange: handleChange,
      errors:
        formik.errors.account_input_tax &&
        formik.touched.account_type_id &&
        formik.errors.account_type_id,
      helperText:
        formik.errors.account_input_tax &&
        formik.touched.account_type_id &&
        formik.errors.account_type_id,
    },
    {
      id: "account_output_tax",
      name: "account_output_tax",
      label: "อัตราหักภาษี ณ ที่จ่าย",
      values: values.account_output_tax,
      disabled: disabled,
      onChange: handleChange,
      errors:
        formik.errors.account_output_tax &&
        formik.touched.account_type_id &&
        formik.errors.account_type_id,
      helperText:
        formik.errors.account_output_tax &&
        formik.touched.account_type_id &&
        formik.errors.account_type_id,
    },
  ];

  const button = [
    {
      text: "ยกเลิก",
      variant: "outlined",
      type: "submit",
      onClick: formik.handleReset,
      color: "success",
      sx: { width: "100px" },
    },
    {
      text: "บันทึก",
      variant: "contained",
      type: "submit",
      onClick: formik.handleSubmit,
      color: "success",
      sx: { width: "100px" },
    },
  ];

  return (
    <>
      <div className="accounting__container accounting__container__field-layout">
        <div>
          {view && (
            <Grid container spacing={2} marginBottom={4}>
              <Grid item xs={4}>
                <TextFieldCustom
                  id="-"
                  name="-"
                  label="ปิดยอด"
                  disabled={view}
                />
              </Grid>
            </Grid>
          )}
          <Grid container spacing={2} marginBottom={2}>
            {MainField.map((item, index) => {
              return (
                <Grid item xs={12} md={4} key={index}>
                  <AutoCompleteCustom
                    id={item.id}
                    name={item.name}
                    label={item.label}
                    options={[]}
                    disabled={item.disabled}
                    onChange={item.onChange}
                    values={item.values}
                    errors={item.errors}
                    helperText={item.helperText}
                  />
                </Grid>
              );
            })}
          </Grid>
          <Grid container spacing={2} marginBottom={2}>
            {SecondField.map((item, index) => {
              return (
                <Grid item xs={12} md={4} key={index}>
                  <TextFieldCustom
                    id={item.id}
                    name={item.name}
                    label={item.label}
                    disabled={item.disabled}
                    onChange={item.onChange}
                    values={item.values}
                    errors={item.errors}
                    helperText={item.helperText}
                  />
                </Grid>
              );
            })}
          </Grid>
          <Grid container spacing={2} marginBottom={2}>
            {LastField.map((item, index) => {
              return (
                <Grid item xs={12} md={4} key={index}>
                  <AutoCompleteCustom
                    id={item.id}
                    name={item.name}
                    label={item.label}
                    options={[]}
                    disabled={item.disabled}
                    onChange={item.onChange}
                    values={item.values}
                    errors={item.errors}
                    helperText={item.helperText}
                  />
                </Grid>
              );
            })}
          </Grid>
          <Grid container spacing={2} marginBottom={4}>
            <Grid item xs={12} md={8}>
              <TextFieldCustom
                multiline
                rows={4}
                id="account_description"
                name="account_description"
                label="คำอธิบาย"
                disabled={disabled}
                values={values.account_description}
                onChange={handleChange}
                errors={
                  formik.errors.account_description &&
                  formik.touched.account_description &&
                  formik.errors.account_description
                }
                helperText={
                  formik.errors.account_description &&
                  formik.touched.account_description &&
                  formik.errors.account_description
                }
              />
            </Grid>
          </Grid>
        </div>
      </div>
      {!disabled && (
        <div className="accounting__button-layout">
          {button.map((button, index) => {
            return (
              <ButtonComponent
                key={index}
                text={button.text}
                variant={button.variant}
                color={button.color}
                onClick={button.onClick}
                type={button.type}
                sx={button.sx}
              />
            );
          })}
        </div>
      )}
    </>
  );
}
