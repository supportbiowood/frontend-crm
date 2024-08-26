import * as yup from "yup";

yup.addMethod(yup.array, "unique", function (message, mapper = (a) => a) {
  return this.test("unique", message, function (list) {
    return list.length === new Set(list.map(mapper)).size;
  });
});

export const validationSchema = yup.object({});

export const initialValues = {
  sales_invoice_document_id: null,
  ref_document_id: "",
  ref_type: null,
  credit_note_issue_date: null,
  credit_note_reason: "",
  credit_note_type: "",
  credit_note_info: null,
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
    project_id: "",
    project_document_id: "",
    village_no: "",
    postal_code: "",
    address_name: "",
    contact_name: "",
    project_name: "",
    sub_district: "",
  },
  credit_note_data: [
    {
      group_name: "",
      category_list: [
        { category_name: "วัสดุไม้", item_data: [] },
        { category_name: "วัสดุประกอบ", item_data: [] },
        { category_name: "วัสดุอุปกรณ์หลัก", item_data: [] },
        { category_name: "วัสดุสิ้นเปลือง", item_data: [] },
        { category_name: "บริการ", item_data: [] },
        { category_name: "อื่นๆ", item_data: [] },
      ],
    },
  ],
  credit_note_status: "",
  credit_note_template_remark_id: "",
  credit_note_remark: "",
  shipping_cost: 0,
  additional_discount: 0,
  vat_exempted_amount: 0,
  vat_0_amount: 0,
  vat_7_amount: 0,
  vat_amount: 0,
  net_amount: 0,
  withholding_tax: 0,
  total_amount: 0,
};
