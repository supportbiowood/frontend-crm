import * as yup from "yup";

yup.addMethod(yup.array, "unique", function (message, mapper = (a) => a) {
  return this.test("unique", message, function (list) {
    return list.length === new Set(list.map(mapper)).size;
  });
});

export const validationSchema = yup.object({});

export const initialValues = {
  ref_document_id: "",
  ref_type: null,
  debit_note_issue_date: null,
  external_ref_document_id: "",
  debit_note_reason: "",
  debit_note_type: null,
  debit_note_info: null,
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
  debit_note_data: [
    {
      vat: "NONE",
      item_id: "",
      item_name: "",
      item_unit: "",
      item_price: 0,
      discount_list: [
        {
          amount: 0,
          percent: 0,
        },
      ],
      item_quantity: 0,
      pre_vat_amount: 0,
      total_discount: 0,
      item_description: "",
      item_withholding_tax: {
        tax: "ยังไม่ระบุ",
        withholding_tax_amount: "0",
      },
    },
  ],
  debit_note_status: "",
  debit_note_template_remark_id: "",
  debit_note_remark: "",
  additional_discount: 0,
  vat_exempted_amount: 0,
  vat_0_amount: 0,
  vat_7_amount: 0,
  vat_amount: 0,
  net_amount: 0,
  withholding_tax: 0,
  total_amount: 0,
};
