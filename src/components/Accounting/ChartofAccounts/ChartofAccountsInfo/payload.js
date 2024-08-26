import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  account_type_id: Yup.string()
    .required("กรุณาเลือกผังบัญชีหลัก")
    .typeError("กรุณากรอกเป็นตัวอักษร"),
  account_code: Yup.string()
    .required("กรุณากรอกรหัสบัญชี")
    .typeError("กรุณากรอกเป็นตัวอักษร"),
  parent_account_id: Yup.string()
    .required("กรุณากรอก")
    .typeError("กรุณากรอกเป็นตัวอักษร"),
  account_name: Yup.string()
    .required("กรุณากรอกชื่อภาษาอังกฤษ")
    .typeError("กรุณากรอกเป็นตัวอักษร"),
  account_name_th: Yup.string()
    .required("กรุณากรอกชื่อภาษาไทย")
    .typeError("กรุณากรอกเป็นตัวอักษร"),
  account_description: Yup.string()
    .required("กรุณากรอกคำอธิบาย")
    .typeError("กรุณากรอกเป็นตัวอักษร"),
  account_input_tax: Yup.string()
    .required("กรุณาเลือกประเภทเงินได้ภาษี")
    .typeError("กรุณากรอกเป็นตัวอักษร"),
  account_output_tax: Yup.string()
    .required("กรุณาเลือกอัตราหักภาษี ญ ที่จ่าย")
    .typeError("กรุณากรอกเป็นตัวอักษร"),
});

export const initialValues = {
  account_type_id: "",
  account_code: "",
  parent_account_id: null,
  account_name: "",
  account_name_th: "",
  account_description: "",
  account_input_tax: "",
  account_output_tax: "",
};
