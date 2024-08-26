import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { postContact } from "../../adapter/Api";
import ButtonComponent from "../../components/ButtonComponent";
import BreadcrumbComponent from "../BreadcrumbComponent";
import Attachment from "./Attachment";
import GroupManage from "./GroupManage";
import BankSave from "./BankSave";
import BankContactInfo from "./BankContactInfo";
import Contact from "./Contact";
import BusinessInfo from "./BusinessInfo";
import ContactName from "./ContactName";
import { Stack, Breadcrumbs } from "@mui/material";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/actions/snackbarActions";
import { getUser } from "../../adapter/Auth";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function AddContactComponent(props) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const user = getUser();

  const [myValue, setMyValue] = useState({
    contact_is_customer: true,
    contact_is_vendor: false,
    contact_business_category: "commercial",
    contact_commercial_type: "co_ltd",
    contact_commercial_name: "",
    contact_individual_prefix_name: "mr",
    contact_individual_first_name: "",
    contact_individual_last_name: "",
    contact_merchant_name: "",
    contact_tax_no: 0,
    contact_registration_address: {
      address_name: "",
      building: "",
      house_no: "",
      road: "",
      village_no: "",
      sub_district: "",
      district: "",
      province: "",
      country: "ไทย",
      postal_code: "",
    },
    contact_address_list: [
      {
        address_name: "",
        building: "",
        house_no: "",
        road: "",
        village_no: "",
        sub_district: "",
        district: "",
        province: "",
        country: "ไทย",
        postal_code: "",
      },
    ],
    lead_source_name: "",
    contact_img_url: null,
    bank_account_list: [],
    account_receivable_id: 2,
    account_payable_id: 1,
    contact_payment_type: "cash",
    contact_is_credit_limit: null,
    contact_credit_limit_amount: null,
    person_list: [],
    attachment_list: [],
    contact_channel_list: [
      {
        contact_channel_name: "เบอร์โทรศัพท์",
        contact_channel_detail: "",
        contact_channel_detail_2: null,
      },
    ],
    tag_list: [],
    account_receivable: {
      account_id: 0,
      account_no: 0,
      account_type: "",
      account_name: "",
      account_description: "",
    },
    account_payable: {
      account_id: 0,
      account_no: 0,
      account_type: "",
      account_name: "",
      account_description: "",
    },
    lead_source: { contact_lead_source_id: "", lead_source_name: "" },
  });

  const contactSchema = Yup.object().shape({
    contact_business_category: Yup.string().required("กรุณาเลือก"),
    contact_commercial_type: Yup.string().when("contact_business_category", {
      is: (value) => value === "commercial",
      then: Yup.string().required("กรุณากรอก"),
    }),
    contact_commercial_name: Yup.string().when("contact_business_category", {
      is: (value) => value === "commercial",
      then: Yup.string().required("กรุณากรอก"),
    }),
    contact_tax_no: Yup.number().when("contact_business_category", {
      is: (value) => value === "commercial",
      then: Yup.number().required("กรุณากรอก").min(12, "กรุณากรอกให้ครบ"),
    }),
    contact_individual_prefix_name: Yup.string().when(
      "contact_business_category",
      {
        is: (value) => value === "individual",
        then: Yup.string().required("กรุณากรอก"),
      }
    ),
    contact_individual_first_name: Yup.string().when(
      "contact_business_category",
      {
        is: (value) => value === "individual",
        then: Yup.string().required("กรุณากรอก"),
      }
    ),
    contact_individual_last_name: Yup.string().when(
      "contact_business_category",
      {
        is: (value) => value === "individual",
        then: Yup.string().required("กรุณากรอก"),
      }
    ),
    contact_merchant_name: Yup.string().when("contact_business_category", {
      is: (value) => value === "merchant",
      then: Yup.string().required("กรุณากรอก"),
    }),
    contact_channel_list: Yup.array().of(
      Yup.object().shape({
        contact_channel_name: Yup.string().required("กรุณาเลือก"),
        contact_channel_detail: Yup.string().when("contact_channel_name", {
          is: (value) => value !== undefined,
          then: Yup.string().required("กรุณากรอก"),
        }),
      })
    ),
    tag_list: Yup.array().min(1, "กรุณาระบุการจัดกลุ่ม"),
  });

  return (
    <>
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <div>
        <div>
          <Formik
            enableReinitialize
            validationSchema={contactSchema}
            initialValues={myValue}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={(values, { setSubmitting, resetForm, errors }) => {
              setMyValue(values);
              const prepare_post_data = {
                contact_is_customer: values.contact_is_customer,
                contact_is_vendor: values.contact_is_vendor,
                contact_business_category: values.contact_business_category,
                contact_commercial_type: values.contact_commercial_type,
                contact_commercial_name: values.contact_commercial_name,
                contact_individual_prefix_name:
                  values.contact_individual_prefix_name,
                contact_individual_first_name:
                  values.contact_individual_first_name,
                contact_individual_last_name:
                  values.contact_individual_last_name,
                contact_merchant_name: values.contact_merchant_name,
                contact_tax_no: values.contact_tax_no,
                contact_registration_address:
                  values.contact_registration_address,
                contact_address_list: values.contact_address_list,
                lead_source_name: values.lead_source_name,
                contact_img_url: values.contact_img_url,
                bank_account_list: values.bank_account_list,
                account_receivable_id: values.account_receivable_id,
                account_receivable: values.account_receivable,
                account_payable_id: values.account_payable_id,
                account_payable: values.account_payable,
                contact_payment_type: values.contact_payment_type,
                contact_is_credit_limit: values.contact_is_credit_limit,
                contact_credit_limit_amount: values.contact_credit_limit_amount,
                person_list: values.person_list,
                attachment_list: values.attachment_list,
                contact_channel_list: values.contact_channel_list,
                tag_list: values.tag_list,
              };
              setIsLoading(true);
              postContact(prepare_post_data)
                .then((data) => {
                  if (data.data.status === "success") {
                    const id = data.data.data.insertId;
                    dispatch(showSnackbar("success", "บันทึกสำเร็จ"));
                    setSubmitting(false);
                    setIsLoading(false);
                    window.location.href = "/sales/contact/" + id;
                  }
                })
                .catch((err) => {
                  setSubmitting(false);
                  setIsLoading(false);
                  dispatch(
                    showSnackbar(
                      "error",
                      err.response.data.message || "บันทึกล้มเหลว"
                    )
                  );
                });
              setSubmitting(false);
              return;
            }}
          >
            {({
              values,
              errors,
              touched,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldError,
              setFieldValue,
            }) => (
              <Form
                method="POST"
                onSubmit={handleSubmit}
                className={"inputGroup"}
                autoComplete="off"
              >
                <Stack spacing={2}>
                  <Breadcrumbs separator="›" aria-label="breadcrumb">
                    <BreadcrumbComponent name="การขาย" to="/sales" />
                    <BreadcrumbComponent
                      name="ข้อมูลผู้ติดต่อ"
                      to="/sales/contact"
                    />
                    <BreadcrumbComponent
                      name="เพิ่มผู้ติดต่อ"
                      to="/sales/contact/add"
                    />
                  </Breadcrumbs>
                </Stack>
                <h1 style={{ margin: "20px 0 " }}>ข้อมูลผู้ติดต่อ</h1>
                <div className="sale-add-contact__body">
                  <BusinessInfo
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    setFieldError={setFieldError}
                    setFieldValue={setFieldValue}
                  />
                  <Contact
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    setFieldError={setFieldError}
                    setFieldValue={setFieldValue}
                  />
                  <ContactName
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    setFieldError={setFieldError}
                    setFieldValue={setFieldValue}
                  />
                  <BankContactInfo
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    setFieldError={setFieldError}
                    setFieldValue={setFieldValue}
                  />
                  {user.employee_position !== "Sale" && (
                    <BankSave
                      values={values}
                      errors={errors}
                      touched={touched}
                      handleChange={handleChange}
                      setFieldError={setFieldError}
                      setFieldValue={setFieldValue}
                    />
                  )}
                  <Attachment
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    setFieldError={setFieldError}
                    setFieldValue={setFieldValue}
                  />
                  <GroupManage
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    setFieldError={setFieldError}
                    setFieldValue={setFieldValue}
                  />
                </div>
                <div style={{ textAlign: "center" }}>
                  <ButtonComponent
                    type="submit"
                    text="บันทึก"
                    variant="contained"
                    color="success"
                    disabled={isSubmitting}
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
