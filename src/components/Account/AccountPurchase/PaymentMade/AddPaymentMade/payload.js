import * as yup from "yup";

export const validationSchema = yup.object({});

export const initialValues = {
  payment_made_document_id: "",
  ref_type: "",
  ref_document_id: "",
  external_ref_document_id: "",
  payment_made_issue_date: null,
  payment_date: null,
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
  payment_channel_id: null,
  payment_channel_type: "",
  payment_channel_info: null,
  check_info: null,
  payment_made_data: [
    {
      document_id: "",
      issue_date: "",
      due_date: "",
      total_amount: 0,
      amount_to_pay: 0,
      received_amount: 0,
    },
  ],
  total_amount: 0,
  attachment_list: [],
  attachment_remark: "",
};
