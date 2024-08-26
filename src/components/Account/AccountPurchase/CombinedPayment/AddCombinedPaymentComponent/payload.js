import * as yup from "yup";

export const validationSchema = yup.object({});

export const initialValues = {
  purchase_invoice_document_id_list: [],
  combined_payment_issue_date: null,
  combined_payment_due_date: null,
  vendor_info: {
    road: "",
    phone: "",
    tax_no: "",
    country: "",
    building: "",
    district: "",
    house_no: "",
    province: "",
    contact_id: "",
    village_no: "",
    postal_code: "",
    address_name: "",
    contact_name: "",
    sub_district: "",
  },
  document_list: [],
  combined_payment_status: "",
  combined_payment_template_remark_id: "",
  combined_payment_remark: "",
  vat_exempted_amount: 0,
  vat_0_amount: 0,
  vat_7_amount: 0,
  vat_amount: 0,
  net_amount: 0,
  withholding_tax: 0,
  total_amount: 0,
};
