import * as yup from "yup";

yup.addMethod(yup.array, "unique", function (message, mapper = (a) => a) {
  return this.test("unique", message, function (list) {
    return list.length === new Set(list.map(mapper)).size;
  });
});

export const validationSchema = yup.object({
  delivery_note_issue_date: yup.date().required("กรุณาระบุวันที่"),
  delivery_note_delivery_date: yup.date().required("กรุณาระบุวันที่"),
  billing_info: yup.object({
    contact_id: yup.string(),
  }),
});

export const initialValues = {
  delivery_note_issue_date: null,
  delivery_note_delivery_date: null,
  sales_order_document_id_list: [],
  sales_order_project_list: [],
  billing_info: {
    road: "",
    phone: "",
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
  delivery_info: {
    delivery_type: "",
    sender: {},
    ref_no: "",
  },
  delivery_note_status: "",
  delivery_note_data: [
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
  delivery_note_template_remark_id: "",
  delivery_note_remark: "",
  shipping_cost: 0,
  additional_discount: 0,
  vat_exempted_amount: 0,
  vat_0_amount: 0,
  vat_7_amount: 0,
  vat_amount: 0,
  net_amount: 0,
  withholding_tax: 0,
  total_amount: 0,
  pickup_date: null,
  consignee_name: "",
  attachment_list: [],
  attachment_remark: "",
  not_complete_reason: "",
};
