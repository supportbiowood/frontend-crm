import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { Stack, Breadcrumbs } from "@mui/material";
import BreadcrumbComponent from "../BreadcrumbComponent";
import ButtonComponent from "../ButtonComponent";
import Detail from "./Detail";
import Location from "./Location";
import RelationshipList from "./RelationshipList";
import Payment from "./Payment";
import Warranty from "./Warranty";
import Custodian from "./Custodian";
import Notation from "./Notation";
import Attachment from "./Attachment";
import GroupManage from "./GroupManage";
import { showSnackbar } from "../../redux/actions/snackbarActions";
import { useDispatch } from "react-redux";
import {
  getAllEmployee,
  getContactOption,
  postProject,
} from "../../adapter/Api";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import moment from "moment";
import "moment-timezone";
import { getUser } from "../../adapter/Auth";
import { useHistory } from "react-router-dom";

export default function ProjectAddComponent() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);

  const user = getUser();

  const [myValue, setMyValue] = useState({
    project_name: "",
    project_category: "",
    project_stage: "",
    project_type: "",
    project_type_detail: "",
    project_deal_confidence: "",
    project_deal_target_date: moment(new Date()).add(1, "months"),
    project_deal_value: "",
    project_address: {
      address_name: "",
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
    project_billing_business_category: "individual",
    project_billing_commercial_type: "",
    project_billing_commercial_name: "",
    project_billing_individual_prefix: "",
    project_billing_individual_first_name: "",
    project_billing_individual_last_name: "",
    project_billing_merchant_name: "",
    project_billing_tax_no: null,
    project_billing_branch: "",
    project_billing_address: {
      address_name: "",
      building: "",
      house_no: null,
      road: "",
      village_no: null,
      sub_district: "",
      district: "",
      province: "",
      country: null,
      postal_code: null,
    },
    project_remark: "",
    project_status: "new",
    project_installment_status: "",
    project_shipment_status: "",
    project_payment_status: "",
    project_approval_status: "",
    project_approver: null,
    project_contact_list: [],
    project_employee_list: [
      {
        project_employee_id: user.project_employee_id,
        role: "ผู้รับผิดชอบหลัก",
        employee_id: user.employee_id,
        employee_firstname: user.employee_firstname,
        employee_lastname: user.employee_lastname,
        employee_email: user.employee_email,
        employee_phone: user.employee_phone,
        employee_img_url: user.employee_img_url,
        employee_password: user.employee_password,
        employee_department: user.employee_department,
        employee_position: user.employee_position,
        employee_status: user.employee_status,
        _employee_created: user._employee_created,
        _employee_createdby: user._employee_createdby,
        _employee_lastupdate: user._employee_lastupdate,
        _employee_lastupdateby: user._employee_lastupdateby,
        _employee_lastlogin: user._employee_lastlogin,
      },
    ],
    tag_list: [],
    warranty_list: [],
    attachment_list: [],
  });

  const formValidation = Yup.object().shape({
    project_name: Yup.string().required("กรุณากรอก"),
    project_category: Yup.string().required("กรุณาเลือก"),
    project_stage: Yup.string().required("กรุณาเลือก"),
    project_type: Yup.string().required("กรุณาเลือก"),
    project_type_detail: Yup.string().required("กรุณากรอก"),
    project_deal_value: Yup.number().typeError("กรุณากรอกตัวเลข"),
    tag_list: Yup.array().min(1, "กรุณาระบุการจัดกลุ่ม"),
    // project_address: Yup.object().shape({
    //   building: Yup.string().required("กรุณากรอก"),
    //   house_no: Yup.string().required("กรุณากรอก"),
    //   road: Yup.string().required("กรุณากรอก"),
    //   village_no: Yup.string().required("กรุณากรอก"),
    //   sub_district: Yup.string().required("กรุณากรอก"),
    //   district: Yup.string().required("กรุณากรอก"),
    //   province: Yup.string().required("กรุณาเลือก"),
    //   country: Yup.string().required("กรุณาเลือก"),
    //   postal_code: Yup.string().required("กรุณากรอก"),
    // }),
  });

  const [contact, setContact] = useState();
  const [employee, setEmployee] = useState();

  const [optionContacts, setOptionContacts] = useState([]);
  const [optionPersons, setOptionPersons] = useState([]);

  useEffect(() => {
    const getAllData = async () => {
      setIsLoading(true);
      try {
        const {
          data: { data: contactData },
        } = await getContactOption(["person_list"]);
        console.log("contact data", contactData);
        const {
          data: { data: employeeData },
        } = await getAllEmployee();
        setEmployee(employeeData);
        const formatContactOptions = await contactData.map((contact) => ({
          name:
            contact.contact_commercial_name ||
            contact.contact_individual_first_name ||
            contact.contact_merchant_name,
          value: contact.contact_id,
        }));
        setOptionContacts([
          { name: "ไม่ระบุ", value: "" },
          ...formatContactOptions,
        ]);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
      }
    };
    getAllData();
  }, []);

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
      <div className="project-info">
        <Stack spacing={2}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <BreadcrumbComponent name="การขาย" to="/sales" />
            <BreadcrumbComponent name="โครงการ" to="/sales/project" />
            <BreadcrumbComponent
              name="เพิ่มโครงการ"
              to={`/sales/project/add`}
            />
          </Breadcrumbs>
        </Stack>
        <h2 className="project-add__title">เพิ่มโครงการ</h2>
        <Formik
          enableReinitialize
          initialValues={myValue}
          validationSchema={formValidation}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setIsLoading(true);
            setMyValue(values);
            const prepare_post_data = {
              project_name: values.project_name,
              project_category: values.project_category,
              project_stage: values.project_stage,
              project_type: values.project_type,
              project_type_detail: values.project_type_detail,
              project_deal_confidence: values.project_deal_confidence,
              project_deal_target_date: moment(values.project_deal_target_date)
                .tz("Asia/Bangkok")
                .unix(),
              project_deal_value: Number(values.project_deal_value),
              project_address: values.project_address,
              project_billing_business_category:
                values.project_billing_business_category,
              project_billing_commercial_type:
                values.project_billing_commercial_type,
              project_billing_commercial_name:
                values.project_billing_commercial_name,
              project_billing_individual_prefix:
                values.project_billing_individual_prefix,
              project_billing_individual_first_name:
                values.project_billing_individual_first_name,
              project_billing_individual_last_name:
                values.project_billing_individual_last_name,
              project_billing_merchant_name:
                values.project_billing_merchant_name,
              project_billing_tax_no: values.project_billing_tax_no,
              project_billing_branch: values.project_billing_branch,
              project_billing_address: values.project_billing_address,
              project_remark: values.project_remark,
              project_status: values.project_status,
              project_installment_status: values.project_installment_status,
              project_shipment_status: values.project_shipment_status,
              project_payment_status: values.project_payment_status,
              project_approval_status: values.project_approval_status,
              project_approver: values.project_approver,
              project_contact_list: values.project_contact_list,
              project_employee_list: values.project_employee_list,
              tag_list: values.tag_list,
              warranty_list: values.warranty_list,
              attachment_list: values.attachment_list,
            };
            postProject(prepare_post_data)
              .then((data) => {
                if (data.data.status === "success") {
                  // console.log('success', data.data)
                  setIsLoading(false);
                  setSubmitting(false);
                  history.push(`/sales/project/${data.data.data.insertId}`);
                  dispatch(showSnackbar("success", "บันทึกสำเร็จ"));
                }
              })
              .catch((err) => {
                console.log(err.response);
                setSubmitting(false);
                setIsLoading(false);
                dispatch(
                  showSnackbar(
                    "error",
                    err.response.data.message || "บันทึกล้มเหลว"
                  )
                );
              });
            console.log(values);
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
              <Detail
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
              <RelationshipList
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                setFieldError={setFieldError}
                setFieldValue={setFieldValue}
                contact={contact}
                setContact={setContact}
                optionContacts={optionContacts}
                optionPersons={optionPersons}
                setOptionContacts={setOptionContacts}
                setOptionPersons={setOptionPersons}
              />
              <Location
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                setFieldError={setFieldError}
                setFieldValue={setFieldValue}
              />
              <Payment
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                setFieldError={setFieldError}
                setFieldValue={setFieldValue}
              />
              <Warranty
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                setFieldError={setFieldError}
                setFieldValue={setFieldValue}
              />
              <Notation
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                setFieldError={setFieldError}
                setFieldValue={setFieldValue}
              />
              <Attachment
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                setFieldError={setFieldError}
                setFieldValue={setFieldValue}
              />
              <Custodian
                values={values}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                setFieldError={setFieldError}
                setFieldValue={setFieldValue}
                employeeList={employee}
              />
              <div className="project-info__file-btn-wrapper">
                <ButtonComponent
                  type="submit"
                  text="ยกเลิก"
                  variant="outlined"
                  color="success"
                />
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
    </>
  );
}
