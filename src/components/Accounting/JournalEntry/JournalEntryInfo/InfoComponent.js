import { Grid } from "@mui/material";
import React from "react";
import TextFieldCustom from "../../AccountReuseComponent/TextFieldCustom";
import SelectCustom from "../../AccountReuseComponent/SelectCustom";
import AutoCompleteCustom from "../../AccountReuseComponent/AutoCompleteCustom";

export default function InfoComponent({ disabled, values, formik }) {
  const handleChange = formik.handleChange;

  const options = [
    {
      name: "รายวันทั่วไป",
      id: "รายวันทั่วไป",
    },
    {
      name: "รายวันซื้อ",
      id: "รายวันซื้อ",
    },
    {
      name: "รายวันขาย",
      id: "รายวันขาย",
    },
    {
      name: "รายวันจ่าย",
      id: "รายวันจ่าย",
    },
    {
      name: "รายวันรับ",
      id: "รายวันรับ",
    },
  ];

  const accountJournalTypeValue = values.account_journal_ref_type || "";

  return (
    <>
      <h3>สมุดบัญชี</h3>
      <div className="accounting__container__full-field-layout">
        <Grid container spacing={2} marginBottom={2} marginTop={0.1}>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
            <SelectCustom
              id="account_journal_ref_type"
              name="account_journal_ref_type"
              label="สมุดบัญชี"
              disabled={disabled}
              options={options}
              value={accountJournalTypeValue}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
            <TextFieldCustom
              id="account_journal_ref_desciption"
              name="account_journal_ref_desciption"
              label="คำอธิบาย"
              disabled={disabled}
              values={values.account_journal_ref_desciption || ""}
            />
          </Grid>
        </Grid>
      </div>
      <h3>ผู้ติดต่อ</h3>
      <div className="accounting__container__full-field-layout">
        <Grid container spacing={2} marginBottom={0.5} marginTop={0.1}>
          <Grid item xs={12} sm={6} md={4} lg={3} xl={3}>
            <AutoCompleteCustom
              id="account_journal_ref_contact"
              name="account_journal_ref_contact"
              label="ผู้ติดต่อ"
              disabled={disabled}
              options={[]}
              values={values.account_journal_ref_contact || null}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </div>
    </>
  );
}
