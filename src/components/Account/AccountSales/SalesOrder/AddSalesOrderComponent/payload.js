import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  sales_order_issue_date: Yup.date().required("กรุณาระบุวันที่"),
  sales_order_due_date: Yup.date().required("กรุณาระบุวันที่"),
  sales_order_expect_date: Yup.date().required("กรุณาระบุวันที่"),
  billing_info: Yup.object().shape({
    contact_id: Yup.string().required("กรุณาระบุลูกค้า"),
  }),
  sale_list: Yup.array().min(1, "กรุณาระบุพนักงานขาย"),
  sales_order_data: Yup.array().of(
    Yup.object().shape({
      category_list: Yup.array().of(
        Yup.object().shape({
          item_data: Yup.array().of(
            Yup.object().shape({
              item_id: Yup.string().required("กรุณาเลือกสินค้า"),
              item_quantity: Yup.number()
                .typeError("กรุณาระบุจำนวน")
                .required("กรุณาระบุจำนวน"),
              item_unit: Yup.string().required("กรุณาระบุหน่วย"),
              item_price: Yup.number().required("กรุณาระบุราคา"),
            })
          ),
        })
      ),
    })
  ),
});

export const initialValues = {
  sales_order_issue_date: null,
  sales_order_due_date: null,
  sales_order_expect_date: null,
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
  sale_list: [],
  sales_order_status: "",
  sales_order_template_remark_id: "",
  sales_order_remark: "",
  shipping_cost: 0,
  additional_discount: 0,
  vat_exempted_amount: 0,
  vat_0_amount: 0,
  vat_7_amount: 0,
  vat_amount: 0,
  net_amount: 0,
  withholding_tax: 0,
  total_amount: 0,
  sales_order_data: [
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
  not_approve_reason: "",
};
