import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import ButtonComponent from "../../components/ButtonComponent";
import Attachment from "./Attachment";
import GroupManage from "./GroupManage";
import BankSave from "./BankSave";
import BankContactInfo from "./BankContactInfo";
import Contact from "./Contact";
import BusinessInfo from "./BusinessInfo";
import ContactName from "./ContactName";
import ProjectRelated from "./ProjectRelated";
import {
  getContactById,
  updateContact,
  deleteContactById,
} from "../../adapter/Api";
import { useParams } from "react-router-dom";
import BreadcrumbComponent from "../BreadcrumbComponent";
import { Breadcrumbs, Stack } from "@mui/material";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/actions/snackbarActions";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { getUser } from "../../adapter/Auth";

export default function ContactInfoComponent(props) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("");
  const user = getUser();
  const [myValue, setMyValue] = useState({
    contact_id: null,
    contact_is_customer: false,
    contact_is_vendor: false,
    contact_business_category: "",
    contact_commercial_type: "",
    contact_commercial_name: "",
    contact_individual_prefix_name: "",
    contact_individual_first_name: "",
    contact_individual_last_name: "",
    contact_merchant_name: "",
    contact_tax_no: null,
    contact_registration_address: {
      building: "",
      house_no: "",
      road: "",
      village_no: "",
      sub_district: "",
      district: "",
      province: "",
      country: "",
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
        country: null,
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
        contact_channel_name: "",
        contact_channel_detail: "",
        contact_channel_detail_2: null,
      },
    ],
    project_list: [],
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
  });
  const loginSchema = Yup.object().shape({
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

  const { id } = useParams();

  useEffect(() => {
    getContactById(id)
      .then((data) => {
        setIsLoading(false);
        if (data.data.status === "success") {
          setStatus(data.data.data.contact_status);
          setMyValue((prev) => ({
            ...prev,
            contact_id: data.data.data.contact_id,
            contact_business_category: data.data.data.contact_business_category,
            contact_commercial_type: data.data.data.contact_commercial_type,
            contact_commercial_name: data.data.data.contact_commercial_name,
            contact_individual_prefix_name:
              data.data.data.contact_individual_prefix_name,
            contact_individual_first_name:
              data.data.data.contact_individual_first_name,
            contact_individual_last_name:
              data.data.data.contact_individual_last_name,
            contact_merchant_name: data.data.data.contact_merchant_name,
            contact_tax_no: data.data.data.contact_tax_no,
            contact_registration_address_id:
              data.data.data.contact_registration_address,
            contact_address_list_id: data.data.data.contact_address_list,
            lead_source_name: data.data.data.lead_source_name,
            contact_img_url: data.data.data.contact_img_url,
            account_receivable_id: data.data.data.account_receivable_id,
            account_payable_id: data.data.data.account_payable_id,
            contact_payment_type: data.data.data.contact_payment_type,
            contact_is_credit_limit: data.data.data.contact_is_credit_limit,
            contact_credit_limit_amount:
              data.data.data.contact_credit_limit_amount,
            project_list: data.data.data.project_list,
            tag_list: data.data.data.tag_list,
            person_list: data.data.data.person_list,
            contact_channel_list: data.data.data.contact_channel_list,
            account_receivable: data.data.data.account_receivable,
            account_payable: data.data.data.account_payable,
            bank_account_list: data.data.data.bank_account_list,
            attachment_list: data.data.data.attachment_list,
          }));
          if (data.data.data.contact_registration_address_id !== null) {
            setMyValue((prev) => ({
              ...prev,
              contact_registration_address:
                data.data.data.contact_registration_address,
            }));
          }
          if (data.data.data.contact_address_list !== []) {
            setMyValue((prev) => ({
              ...prev,
              contact_address_list: data.data.data.contact_address_list,
            }));
          }
          if (data.data.data.contact_is_customer === 1) {
            setMyValue((prev) => ({
              ...prev,
              contact_is_customer: true,
            }));
          } else {
            setMyValue((prev) => ({
              ...prev,
              contact_is_customer: false,
            }));
          }
          if (data.data.data.contact_is_vendor === 1) {
            setMyValue((prev) => ({
              ...prev,
              contact_is_vendor: true,
            }));
          } else {
            setMyValue((prev) => ({
              ...prev,
              contact_is_vendor: false,
            }));
          }
        }
      })
      .catch((err) => {
        setIsLoading(false);
        dispatch(showSnackbar("error", err || "เกิดเหตุผิดพลาด"));
      });
  }, [dispatch, id, isLoading]);

  function displayPrefix(data) {
    if (data === null) return "";
    if (data === "mr" || data === "นาย") {
      return "นาย";
    } else if (data === "mrs" || data === "นาง") {
      return "นาง";
    } else if (data === "ms" || data === "นางสาว") {
      return "นางสาว";
    } else if (data === "none") {
      return "";
    }
  }

  const deleteContactData = () => {
    setIsLoading(true);
    deleteContactById(id)
      .then((data) => {
        if (data.data.status === "success") {
          setIsLoading(false);
          dispatch(showSnackbar("success", "ลบสำเร็จ"));
          window.location.href = "/sales/contact";
        }
      })
      .catch((err) => {
        setIsLoading(false);
        dispatch(showSnackbar("error", "เกิดเหตุผิดพลาด"));
      });
  };

  return (
    <>
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer - 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <div>
        <Formik
          enableReinitialize
          initialValues={myValue}
          validationSchema={loginSchema}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            const prepare_update_data = {
              contact_id: values.contact_id,
              contact_is_customer: values.contact_is_customer,
              contact_is_vendor: values.contact_is_vendor,
              contact_business_category: values.contact_business_category,
              contact_commercial_type: values.contact_commercial_type,
              contact_commercial_name: values.contact_commercial_name,
              contact_individual_prefix_name:
                values.contact_individual_prefix_name,
              contact_individual_first_name:
                values.contact_individual_first_name,
              contact_individual_last_name: values.contact_individual_last_name,
              contact_merchant_name: values.contact_merchant_name,
              contact_tax_no: values.contact_tax_no,
              contact_registration_address: values.contact_registration_address,
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
            updateContact(prepare_update_data, values.contact_id)
              .then((data) => {
                if (data.data.status === "success") {
                  dispatch(showSnackbar("success", "บันทึกสำเร็จ"));
                  setSubmitting(false);
                  setIsLoading(false);
                }
              })
              .catch((err) => {
                console.log("err", err);
                dispatch(
                  showSnackbar("error", `${err.response}` || "เกิดเหตุผิดพลาด")
                );
                setSubmitting(false);
                setIsLoading(false);
              });
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
            setErrors,
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
                  <BreadcrumbComponent name="ผู้ติดต่อ" to="/sales/contact" />
                  {values.contact_business_category === "commercial" && (
                    <BreadcrumbComponent
                      name={`${myValue.contact_commercial_type} ${myValue.contact_commercial_name}`}
                      to="#"
                    />
                  )}
                  {values.contact_business_category === "individual" && (
                    <BreadcrumbComponent
                      name={`${displayPrefix(
                        myValue.contact_individual_prefix_name
                      )}${myValue.contact_individual_first_name} ${
                        myValue.contact_individual_last_name
                      }`}
                      to="#"
                    />
                  )}
                  {values.contact_business_category === "merchant" && (
                    <BreadcrumbComponent
                      name={`${myValue.contact_merchant_name}`}
                      to="#"
                    />
                  )}
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
                <ProjectRelated
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  setFieldError={setFieldError}
                  setFieldValue={setFieldValue}
                />
              </div>
              {status !== "delete" && (
                <div className="project-info__file-btn-wrapper">
                  <ButtonComponent
                    text="ลบ"
                    variant="outlined"
                    color="success"
                    type="button"
                    onClick={(e) => {
                      if (window.confirm("ต้องการลบผู้ติดต่อนี้ใช่หรือไม่"))
                        deleteContactData();
                    }}
                    disabled={isSubmitting}
                  />
                  <ButtonComponent
                    text="บันทึก"
                    variant="contained"
                    color="success"
                    type="submit"
                    disabled={isSubmitting}
                  />
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}
