import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  payment_receipt_issue_date: Yup.date().required("กรุณาระบุวันที่"),
  payment_date: Yup.date().required("กรุณาระบุวันที่"),
  billing_info: Yup.object().shape({
    contact_id: Yup.string().required("กรุณาระบุลูกค้า"),
  }),
  payment_channel_type: Yup.string().required("กรุณาเลือกช่องทางการจ่ายเงิน"),
  // payment_channel_info: Yup.object().test(
  //   "payment_channel_type",
  //   "test",
  //   (_, validationContext) => {
  //     const {
  //       parent: { payment_channel_type },
  //     } = validationContext;
  //     if (payment_channel_type === "cash") {
  //       return "กรุณาระบุชื่อเงินสด";
  //     }
  //   }
  // ),
});

// Yup.object().shape({
//   cash_name: Yup.string().required("กรุณาระบุชื่อเงินสด"),
// }),

export const initialValues = {
  payment_receipt_document_id: "",
  ref_type: "",
  ref_document_id: "",
  payment_receipt_issue_date: null,
  payment_date: null,
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
  payment_receipt_template_remark_id: "",
  payment_receipt_remark: "",
  payment_channel_id: null,
  payment_channel_type: "",
  payment_channel_info: null,
  check_info: null,
  withholding_tax: null,
  payment_receipt_data: [
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
