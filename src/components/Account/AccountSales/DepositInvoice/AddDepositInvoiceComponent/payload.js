import * as yup from "yup";

export const validationSchema = yup.object({});

export const initialValues = {
  deposit_invoice_info: null,
  deposit_invoice_issue_date: null,
  billing_info: {
    fax: "",
    road: "",
    email: "",
    phone: "",
    tax_no: "",
    country: "",
    building: "",
    district: "",
    house_no: "",
    province: "",
    contact_id: "",
    project_document_id: "",
    project_id: "",
    village_no: "",
    postal_code: "",
    address_name: "",
    contact_name: "",
    project_name: "",
    sub_district: "",
  },
  sale_list: [],
  deposit_invoice_data: [
    {
      vat: "NONE",
      description: "",
      pre_vat_amount: 0,
    },
  ],
  deposit_invoice_status: "",
  deposit_invoice_template_remark_id: "",
  deposit_invoice_remark: "",
  vat_exempted_amount: 0,
  vat_0_amount: 0,
  vat_7_amount: 0,
  total_amount: 0,
};
