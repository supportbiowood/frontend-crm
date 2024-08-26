import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
  account_journal_ref_document_id: Yup.string().required(
    "กรุณากรอกเลขที่เอกสาร"
  ),
  account_journal_ref_type: Yup.string().required("กรุณาเลือกสมุดบัญชี"),
  account_journal_ref_document_date: Yup.date().required("กรุณาระบุวันที่"),
  transactions: Yup.array().of(
    Yup.object().shape({
      account_transaction_credits: Yup.number().required("กรุณากรอกจำนวนเดบิต"),
      account_transaction_debits: Yup.number().required("กรุณากรอกจำนวนเครดิต"),
      account_id: Yup.string().required("กรุณาเลือกสมุดบัญชี"),
      account_transaction_detail: "",
      vat: Yup.string().required("กรุณาเลือกภาษี"),
    })
  ),
});

export const initialValues = {
  account_journal_ref_document_id: "",
  account_journal_ref_document_date: new Date(),
  account_journal_ref_type: "รายวันทั่วไป",
  account_journal_template_remark_id: "",
  account_journal_template_remark: "",
  transactions: [
    {
      account_transaction_type: "",
      account_transaction_credits: 0,
      account_transaction_debits: 0,
      account_id: null,
      amount: null,
      account_transaction_detail: "",
      vat: "NONE",
    },
    {
      account_transaction_type: "",
      account_transaction_credits: 0,
      account_transaction_debits: 0,
      account_id: null,
      amount: null,
      account_transaction_detail: "",
      vat: "NONE",
    },
  ],
};
