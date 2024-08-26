import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { Stack, Breadcrumbs, Box } from "@mui/material";
import { useParams } from "react-router-dom";
import BreadcrumbComponent from "../BreadcrumbComponent";
import ButtonComponent from "../ButtonComponent";
import ProgressIndicatorComponent from "../ProgressIndicatorComponent";
import Detail from "./Detail";
import Location from "./Location";
import RelationshipList from "./RelationshipList";
import Payment from "./Payment";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Warranty from "./Warranty";
import Custodian from "./Custodian";
import Notation from "./Notation";
import Attachment from "./Attachment";
import GroupManage from "./GroupManage";
import Status from "./Status";
import History from "./History";
import Document from "./Document";
import { showSnackbar } from "../../redux/actions/snackbarActions";
import { useDispatch } from "react-redux";
import {
  getProjectById,
  updateProject,
  deleteProjectById,
  getContactOption,
  getAllEmployee,
} from "../../adapter/Api";
import MovementComponent from "../MovementComponent";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";

export default function ProjectInfoComponent(props) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState("1");
  const [myValue, setMyValue] = useState({
    project_id: 0,
    project_name: "",
    project_category: "",
    project_stage: "",
    project_type: "",
    project_type_detail: "",
    project_deal_confidence: "",
    project_deal_target_date: null,
    project_deal_value: 0,
    project_address_id: 0,
    person_list: [],
    project_billing_business_category: "",
    project_billing_commercial_type: "",
    project_billing_commercial_name: null,
    project_billing_individual_prefix: "",
    project_billing_individual_first_name: "",
    project_billing_individual_last_name: "",
    project_billing_merchant_name: null,
    project_billing_tax_no: null,
    project_billing_branch: null,
    project_billing_address_id: 0,
    project_remark: null,
    project_status: "",
    project_installment_status: "",
    project_shipment_status: "",
    project_payment_status: "",
    project_approval_status: "",
    project_approver: null,
    _project_created: null,
    _project_createdby: null,
    _project_lastupdate: 0,
    _project_lastupdateby: null,
    tag_list: [],
    project_employee_list: [],
    project_address: {
      address_id: 0,
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
    project_billing_address: {
      address_id: 0,
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
    attachment_list: [],
    event_list: [],
    warranty_list: [],
    project_contact_list: [],
    person_channel_list: [],
    project_status_log_list: [],
    project_document_list: [],
    digit1: "",
    digit2: "",
    digit3: "",
    digit4: "",
    digit5: "",
    digit6: "",
    digit7: "",
    digit8: "",
    digit9: "",
    digit10: "",
    digit11: "",
    digit12: "",
  });

  const [contact, setContact] = useState();
  const [employee, setEmployee] = useState();

  const [optionContacts, setOptionContacts] = useState([]);
  const [optionPersons, setOptionPersons] = useState([]);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const formValidation = Yup.object().shape({
    project_category: Yup.string().required("กรุณาเลือก"),
    project_stage: Yup.string().required("กรุณาเลือก"),
    project_type: Yup.string().required("กรุณาเลือก"),
    project_type_detail: Yup.string().required("กรุณากรอก"),
    project_deal_value: Yup.number().typeError("กรุณากรอกตัวเลข"),
    tag_list: Yup.array().min(1, "กรุณาเพิ่มการจัดกลุ่ม"),
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

  useEffect(() => {
    const getAllData = async () => {
      try {
        const {
          data: { data: projectData },
        } = await getProjectById(id);
        setMyValue(projectData);
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
  }, [id]);

  const renderProgress = (data) => {
    if (data.project_status === "new") {
      return (
        <ul className="progressbar__wrapper">
          <ProgressIndicatorComponent isActive={true} title="โครงการใหม่" />
          <ProgressIndicatorComponent isActive={false} title="กำลังดำเนินการ" />
          <ProgressIndicatorComponent isActive={false} title="เสนอราคา" />
          <ProgressIndicatorComponent isActive={false} title="ปิดได้" />
          <ProgressIndicatorComponent isActive={false} title="จบโครงการ" />
          <ProgressIndicatorComponent isActive={false} title="ดูแลงาน" />
        </ul>
      );
    } else if (data.project_status === "ongoing") {
      return (
        <ul className="progressbar__wrapper">
          <ProgressIndicatorComponent isActive={true} title="โครงการใหม่" />
          <ProgressIndicatorComponent isActive={true} title="กำลังดำเนินการ" />
          <ProgressIndicatorComponent isActive={false} title="เสนอราคา" />
          <ProgressIndicatorComponent isActive={false} title="ปิดได้" />
          <ProgressIndicatorComponent isActive={false} title="จบโครงการ" />
          <ProgressIndicatorComponent isActive={false} title="ดูแลงาน" />
        </ul>
      );
    } else if (data.project_status === "quotation") {
      return (
        <ul className="progressbar__wrapper">
          <ProgressIndicatorComponent isActive={true} title="โครงการใหม่" />
          <ProgressIndicatorComponent isActive={true} title="กำลังดำเนินการ" />
          <ProgressIndicatorComponent isActive={true} title="เสนอราคา" />
          <ProgressIndicatorComponent isActive={false} title="ปิดได้" />
          <ProgressIndicatorComponent isActive={false} title="จบโครงการ" />
          <ProgressIndicatorComponent isActive={false} title="ดูแลงาน" />
        </ul>
      );
    } else if (
      data.project_status === "closed_success" ||
      data.project_status === "closed_fail"
    ) {
      return (
        <ul className="progressbar__wrapper">
          <ProgressIndicatorComponent isActive={true} title="โครงการใหม่" />
          <ProgressIndicatorComponent isActive={true} title="กำลังดำเนินการ" />
          <ProgressIndicatorComponent isActive={true} title="เสนอราคา" />
          {data.project_status === "closed_success" ? (
            <ProgressIndicatorComponent isActive={true} title="ปิดได้" />
          ) : (
            <ProgressIndicatorComponent isActive={true} title="ปิดไม่ได้" />
          )}
          <ProgressIndicatorComponent isActive={false} title="จบโครงการ" />
          <ProgressIndicatorComponent isActive={false} title="ดูแลงาน" />
        </ul>
      );
    } else if (data.project_status === "finished") {
      return (
        <ul className="progressbar__wrapper">
          <ProgressIndicatorComponent isActive={true} title="โครงการใหม่" />
          <ProgressIndicatorComponent isActive={true} title="กำลังดำเนินการ" />
          <ProgressIndicatorComponent isActive={true} title="เสนอราคา" />
          <ProgressIndicatorComponent isActive={true} title="ปิดได้" />
          <ProgressIndicatorComponent isActive={true} title="จบโครงการ" />
          <ProgressIndicatorComponent isActive={false} title="ดูแลงาน" />
        </ul>
      );
    } else if (
      data.project_status === "service" ||
      data.project_status === "service_ended"
    ) {
      return (
        <ul className="progressbar__wrapper">
          <ProgressIndicatorComponent isActive={true} title="โครงการใหม่" />
          <ProgressIndicatorComponent isActive={true} title="กำลังดำเนินการ" />
          <ProgressIndicatorComponent isActive={true} title="เสนอราคา" />
          <ProgressIndicatorComponent isActive={true} title="ปิดได้" />
          <ProgressIndicatorComponent isActive={true} title="จบโครงการ" />
          <ProgressIndicatorComponent isActive={true} title="ดูแลงาน" />
        </ul>
      );
    } else if (data.project_status === "closed_fail") {
      return (
        <ul className="progressbar__wrapper">
          <ProgressIndicatorComponent isActive={false} title="โครงการใหม่" />
          <ProgressIndicatorComponent isActive={false} title="กำลังดำเนินการ" />
          <ProgressIndicatorComponent isActive={false} title="เสนอราคา" />
          <ProgressIndicatorComponent isActive={false} title="ปิดได้" />
          <ProgressIndicatorComponent isActive={false} title="จบโครงการ" />
          <ProgressIndicatorComponent isActive={false} title="ดูแลงาน" />
        </ul>
      );
    }
  };

  const CustomTabs = styled(TabList)({
    "& .MuiTabs-indicator": {
      backgroundColor: "unset",
    },
    "& .MuiTabs-flexContainer": {
      justifyContent: "center",
    },
  });

  const CustomTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
      padding: "10px 20px",
      border: "1px solid #bdbdbd",
      borderRadius: "15px",
      marginRight: "-15px",
      fontWeight: "bold",
      fontSize: "22px",
      lineHeight: "26px",
      color: "#737475",
      "&.Mui-selected": {
        zIndex: "1",
        padding: "10px 20px",
        background: "#cbe9cc",
        borderRadius: "15px",
        border: "none !important",
        fontWeight: "bold",
        fontSize: "22px",
        lineHeight: "26px",

        color: "#246527 !important",
      },
      "&.Mui-focusVisible": {
        backgroundColor: "#d1eaff",
      },
    })
  );

  const delteProject = () => {
    deleteProjectById(id)
      .then((data) => {
        if (data.data.status === "success") {
          setIsLoading(false);
          dispatch(showSnackbar("success", "ลบสำเร็จ"));
          window.location.href = "/sales/project";
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
      <Formik
        enableReinitialize
        initialValues={myValue}
        validationSchema={formValidation}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          const prepare_update_data = {
            project_id: values.project_id,
            project_name: values.project_name,
            project_category: values.project_category,
            project_stage: values.project_stage,
            project_type: values.project_type,
            project_type_detail: values.project_type_detail,
            project_deal_confidence: values.project_deal_confidence,
            project_deal_target_date: values.project_deal_target_date,
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
            project_billing_merchant_name: values.project_billing_merchant_name,
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
          console.log("prepare_update_data", prepare_update_data);
          setIsLoading(true);
          updateProject(prepare_update_data, values.project_id)
            .then((data) => {
              if (data.data.status === "success") {
                dispatch(showSnackbar("success", "บันทึกสำเร็จ"));
              }
              setSubmitting(false);
              setIsLoading(false);
            })
            .catch((err) => {
              setSubmitting(false);
              setIsLoading(false);
              dispatch(showSnackbar("error", `${err}` || "บันทึกล้มเหลว"));
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
          setFieldError,
          setFieldValue,
        }) => (
          <Form
            method="POST"
            onSubmit={handleSubmit}
            className={"inputGroup"}
            autoComplete="off"
          >
            <div className="project-info">
              <Stack spacing={2} sx={{ marginBottom: "32px" }}>
                <Breadcrumbs separator="›" aria-label="breadcrumb">
                  <BreadcrumbComponent name="การขาย" to="/sales" />
                  <BreadcrumbComponent
                    name="โครงการ"
                    key="2"
                    to="/sales/project"
                  />
                  <BreadcrumbComponent
                    name={values.project_name}
                    to={`/sales/project/${id}`}
                  />
                </Breadcrumbs>
              </Stack>
              <div className="progressbar progressbar__project">
                {renderProgress(values)}
                <div className="project-info__status-wrapper">
                  <div className="project-info__status">
                    <div className="project-info__status-icon"></div>
                    <div className="project-info__status-title">
                      ถอดแบบ/ติดตั้ง
                    </div>
                  </div>
                  <div className="project-info__status">
                    <div className="project-info__status-icon"></div>
                    <div className="project-info__status-title">ขนส่ง</div>
                  </div>
                  <div className="project-info__status">
                    <div className="project-info__status-icon"></div>
                    <div className="project-info__status-title">ชำระเงิน</div>
                  </div>
                </div>
              </div>
              <div className="project-info__body">
                <Box sx={{ width: "100%", typography: "body1" }}>
                  <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                      <CustomTabs
                        style={{ marginBottom: "20px" }}
                        onChange={handleChangeTab}
                        aria-label="lab API tabs example"
                      >
                        <CustomTab label="ข้อมูลโครงการ" value="1" />
                        <CustomTab label="การเคลื่อนไหว" value="2" />
                      </CustomTabs>
                      <TabPanel value="1" sx={{ padding: "24px 0 !important" }}>
                        <div className="project-info__body-header">
                          <ButtonComponent
                            type="button"
                            text="สร้างใบถอดแบบ"
                            variant="contained"
                            color="success"
                          />
                          <ButtonComponent
                            type="button"
                            text="สร้างใบเสนอราคา"
                            variant="contained"
                            color="success"
                          />
                        </div>
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
                          {/* <ButtonComponent
                            type="button"
                            text="ลบ"
                            variant="outlined"
                            color="success"
                            onClick={() => setOpen(true)}
                            disabled={isSubmitting}
                          /> */}
                          <ButtonComponent
                            type="button"
                            text="ลบ"
                            variant="outlined"
                            color="success"
                            onClick={(e) => {
                              if (
                                window.confirm("ต้องการลบโครงการนี้ใช่หรือไม่")
                              )
                                delteProject();
                            }}
                            disabled={isSubmitting}
                          />
                          {/* <PopUpAlertComponent
                            status={open}
                            handleClose={() => setOpen(false)}
                            setOpen={setOpen}
                            title="ต้องการลบโปรเจคนี้ใช่หรือไม่"
                            deleteButtonOnClick={() => delteProject()}
                          /> */}
                          <ButtonComponent
                            type="submit"
                            text="บันทึก"
                            variant="contained"
                            color="success"
                            disabled={isSubmitting}
                          />
                        </div>
                        <Status
                          values={values}
                          errors={errors}
                          touched={touched}
                          handleChange={handleChange}
                          setFieldError={setFieldError}
                          setFieldValue={setFieldValue}
                        />
                        <History
                          values={values}
                          errors={errors}
                          touched={touched}
                          handleChange={handleChange}
                          setFieldError={setFieldError}
                          setFieldValue={setFieldValue}
                        />
                        <Document
                          values={values}
                          errors={errors}
                          touched={touched}
                          handleChange={handleChange}
                          setFieldError={setFieldError}
                          setFieldValue={setFieldValue}
                        />
                      </TabPanel>
                      <TabPanel value="2" sx={{ padding: "24px 0 !important" }}>
                        <MovementComponent project_id={myValue.project_id} />
                      </TabPanel>
                    </Box>
                  </TabContext>
                </Box>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
