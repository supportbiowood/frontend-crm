import * as yup from "yup";

yup.addMethod(yup.array, "unique", function (message, mapper = (a) => a) {
  return this.test("unique", message, function (list) {
    return list.length === new Set(list.map(mapper)).size;
  });
});

export const validationSchema = yup.object({
  sales_return_issue_date: yup.date().required("กรุณาระบุวันที่"),
  sales_return_delivery_date: yup.date().required("กรุณาระบุวันที่"),
  billing_info: yup.object({
    project_name: yup.string(),
  }),
});

export const initialValues = {
  sales_return_issue_date: null,
  sales_return_delivery_date: null,
  sales_return_reason: "",
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
    village_no: "",
    postal_code: "",
    address_name: "",
    contact_name: "",
    project_name: "",
    sub_district: "",
  },
  sales_return_status: "",
  sales_return_template_remark_id: "",
  sales_return_remark: "",
  shipping_cost: 0,
  additional_discount: 0,
  vat_exempted_amount: 0,
  vat_0_amount: 0,
  vat_7_amount: 0,
  vat_amount: 0,
  net_amount: 0,
  withholding_tax: 0,
  total_amount: 0,
  sales_return_data: [],
};
