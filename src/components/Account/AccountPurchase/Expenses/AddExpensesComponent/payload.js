import * as yup from "yup";

yup.addMethod(yup.array, "unique", function (message, mapper = (a) => a) {
  return this.test("unique", message, function (list) {
    return list.length === new Set(list.map(mapper)).size;
  });
});

export const validationSchema = yup.object({
  expenses_issue_date: yup.date().required("กรุณาระบุวันที่"),
  expenses_due_date: yup.date().required("กรุณาระบุวันที่"),
});

export const initialValues = {
  expenses_issue_date: null,
  expenses_due_date: null,
  external_ref_document_id: "",
  inventory_target: "",
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
  expenses_status: "",
  expenses_template_remark_id: "",
  expenses_remark: "",
  additional_discount: 0,
  vat_exempted_amount: 0,
  vat_0_amount: 0,
  vat_7_amount: 0,
  vat_amount: 0,
  net_amount: 0,
  withholding_tax: 0,
  total_amount: 0,
  expenses_data: [
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
      item_account: "",
    },
  ],
};
