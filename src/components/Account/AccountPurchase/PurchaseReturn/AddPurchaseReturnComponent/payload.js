import * as yup from "yup";

yup.addMethod(yup.array, "unique", function (message, mapper = (a) => a) {
  return this.test("unique", message, function (list) {
    return list.length === new Set(list.map(mapper)).size;
  });
});

export const validationSchema = yup.object({
  purchase_return_issue_date: yup.date().required("กรุณาระบุวันที่"),
  purchase_return_delivery_date: yup.date().required("กรุณาระบุวันที่"),
  billing_info: yup.object({
    project_name: yup.string(),
  }),
});

export const initialValues = {
  external_ref_document_id: "",
  purchase_return_issue_date: null,
  purchase_return_delivery_date: null,
  purchase_return_reason: "",
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
  purchase_return_status: "",
  purchase_return_template_remark_id: "",
  purchase_return_remark: "",
  shipping_cost: 0,
  additional_discount: 0,
  vat_exempted_amount: 0,
  vat_0_amount: 0,
  vat_7_amount: 0,
  vat_amount: 0,
  net_amount: 0,
  withholding_tax: 0,
  total_amount: 0,
  purchase_return_data: [],
};
