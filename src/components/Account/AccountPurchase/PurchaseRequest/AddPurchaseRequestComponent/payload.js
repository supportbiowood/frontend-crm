import * as yup from "yup";

export const validationSchema = yup.object({
  purchase_request_issue_date: yup.date().required("กรุณาระบุวันที่"),
  purchase_request_due_date: yup.date().required("กรุณาระบุวันที่"),
});

export const initialValues = {
  purchase_request_issue_date: null,
  purchase_request_due_date: null,
  sales_order_document_id_list: [],
  sales_order_project_list: [],
  inventory_target: "",
  purchase_request_data: [
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
      qa_quantity: 0,
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
  purchase_request_template_remark_id: "",
  purchase_request_remark: "",
  purchase_request_status: "",
};
