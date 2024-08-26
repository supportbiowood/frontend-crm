import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { Autocomplete } from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import ButtonComponent from "../../components/ButtonComponent";
import TagComponent from "../../components/TagComponent";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Placeholder from "../../images/placeholder.jpeg";
import { postEmployee } from "../../adapter/Api";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/actions/snackbarActions";

import { uploadFileToS3 } from "../UploadImageToS3WithNativeSdk/UploadImageToS3WithNativeSdk";

const department_position = [
  {
    department: "ขาย",
    name: "ขาย",
    value: "ขาย",
    position_list: [
      {
        name: "ทำใบเสนอราคา",
        value: "ทำใบเสนอราคา",
      },
      {
        name: "หัวหน้าซัพพอตเซลล์",
        value: "หัวหน้าซัพพอตเซลล์",
      },
      {
        name: "ซัพพอตเซลล์",
        value: "ซัพพอตเซลล์",
      },
      {
        name: "เซลล์สเปค",
        value: "เซลล์สเปค",
      },
      {
        name: "เซลล์ต่างจังหวัด",
        value: "เซลล์ต่างจังหวัด",
      },
      {
        name: "หัวหน้าเซลล์ ต่างจังหวัด",
        value: "หัวหน้าเซลล์ ต่างจังหวัด",
      },
      {
        name: "ซุปเปอร์ไวเซอร์",
        value: "ซุปเปอร์ไวเซอร์",
      },
      {
        name: "เซลล์กรุงเทพ",
        value: "เซลล์กรุงเทพ",
      },
      {
        name: "หัวหน้าเซลล์ กรุงเทพ",
        value: "หัวหน้าเซลล์ กรุงเทพ",
      },
    ],
  },
  {
    department: "คลัง",
    name: "คลัง",
    value: "คลัง",
    position_list: [
      {
        name: "หัวหน้าคลัง",
        value: "หัวหน้าคลัง",
      },
    ],
  },
  {
    department: "บัญชี",
    name: "บัญชี",
    value: "บัญชี",
    position_list: [
      {
        name: "บัญชีรับ",
        value: "บัญชีรับ",
      },
      {
        name: "บัญชีจ่าย",
        value: "บัญชีจ่าย",
      },
      {
        name: "หัวหน้าบัญชี",
        value: "หัวหน้าบัญชี",
      },
    ],
  },
  {
    name: "ติดตั้ง/ถอดแบบ",
    value: "ติดตั้ง/ถอดแบบ",
    position_list: [
      {
        name: "ติดตั้ง",
        value: "ติดตั้ง",
      },
      {
        name: "ถอดแบบ",
        value: "ถอดแบบ",
      },
      {
        name: "หัวหน้าติดตั้ง/ถอดแบบ",
        value: "หัวหน้าติดตั้ง/ถอดแบบ",
      },
    ],
  },
  {
    department: "หัวหน้า",
    name: "หัวหน้า",
    value: "หัวหน้า",
    position_list: [
      {
        name: "กรรมการผู้จัดการ",
        value: "กรรมการผู้จัดการ",
      },
    ],
  },
  {
    department: "ผู้ดูแล",
    name: "ดูแลระบบ",
    value: "ดูแลระบบ",
    position_list: [
      {
        name: "ไอที",
        value: "ไอที",
      },
      {
        name: "ฝ่ายบุคคล",
        value: "ฝ่ายบุคคล",
      },
      {
        name: "ผู้ดูแลระบบ",
        value: "ผู้ดูแลระบบ",
      },
    ],
  },
];

export default function AddEmployeeComponent(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [myValue] = useState({
    employee_firstname: "",
    employee_lastname: "",
    employee_email: "",
    employee_phone: "",
    employee_img_url: "",
    employee_department: "",
    employee_position: "",
    employee_status: "ok",
    employee_tag_list: [],
  });

  const [myTag] = useState([
    {
      name: "สิทธิ 1",
      value: "tag1",
    },
    {
      name: "สิทธิ 2",
      value: "tag2",
    },
  ]);

  const dispatch = useDispatch();
  const filter = createFilterOptions();

  const employeeSchema = Yup.object().shape({
    employee_firstname: Yup.string().required("กรุณากรอก"),
    employee_lastname: Yup.string().required("กรุณากรอก"),
    employee_email: Yup.string()
      .email("รูปแบบอีเมลไม่ถูกต้อง")
      .required("กรุณากรอก"),
    employee_department: Yup.string().required("กรุณาเลือก"),
    employee_position: Yup.string().required("กรุณาเลือก"),
    password: Yup.string().required("กรุณากรอก"),
    repassword: Yup.string().when("password", {
      is: (value) => value !== undefined,
      then: Yup.string()
        .required("กรุณากรอก")
        .oneOf([Yup.ref("password")], "รหัสผ่านไม่ตรงกัน"),
    }),
  });

  const handleClickUploadFile = (files, setFieldValue, setSubmitting) => {
    if (files.length !== 0) {
      const file = files[0];
      setSubmitting(true);
      uploadFileToS3(file, "Employee", "test")
        .then((data) => {
          console.log(data);
          setFieldValue("employee_img_url", data.Location);
          dispatch(showSnackbar("success", "อัพโหลดสำเร็จ"));
          setSubmitting(false);
        })
        .catch((err) => {
          console.log(err);
          dispatch(showSnackbar("error", "อัพโหลดล้มเหลว"));
          setSubmitting(false);
        });
    }
  };

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
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <BreadcrumbComponent name="บัญชีผู้ใช้" key="1" to="/employee" />
        <BreadcrumbComponent
          name="เพิ่มบัญชีผู้ใช้"
          key="2"
          to="/employee/add"
        />
      </Breadcrumbs>
      <h2 className="form-heading">เพิ่มบัญชีผู้ใช้</h2>
      <Formik
        enableReinitialize
        initialValues={myValue}
        validationSchema={employeeSchema}
        validateOnChange={true}
        validateOnBlur={true}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          console.log("values", values);
          setSubmitting(true);
          setIsLoading(true);
          postEmployee(values)
            .then((data) => {
              if (data.data.status === "success") {
                console.log("success", data.data);
                dispatch(showSnackbar("success", "บันทึกข้อมูลสำเร็จ"));
              }
              setSubmitting(false);
              setIsLoading(false);
            })
            .catch((err) => {
              console.log(err.response);
              setSubmitting(false);
              setIsLoading(false);
              dispatch(
                showSnackbar(
                  "error",
                  (err.response.data.message && err.response.data.message) ||
                    "เกิดข้อผิดพลาด"
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
          setErrors,
          setSubmitting,
          setFieldValue,
        }) => (
          <Form
            method="POST"
            onSubmit={handleSubmit}
            className={"inputGroup"}
            autoComplete="off"
          >
            <div className="grid-container-50 myCard">
              <div>
                <div className="form-heading">ข้อมูลทั่วไป</div>
                <div className="grid-container-50">
                  <TextField
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    onBlur={handleBlur}
                    type="text"
                    size="small"
                    name="employee_firstname"
                    id="outlined-error-helper-text"
                    label="ชื่อจริง"
                    value={values.employee_firstname || ""}
                    error={
                      errors.employee_firstname &&
                      touched.employee_firstname &&
                      errors.employee_firstname
                    }
                    helperText={
                      errors.employee_firstname &&
                      touched.employee_firstname &&
                      errors.employee_firstname
                    }
                  />
                  <TextField
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    onBlur={handleBlur}
                    type="text"
                    size="small"
                    name="employee_lastname"
                    id="outlined-error-helper-text"
                    label="นามสกุล"
                    value={values.employee_lastname || ""}
                    error={
                      errors.employee_lastname &&
                      touched.employee_lastname &&
                      errors.employee_lastname
                    }
                    helperText={
                      errors.employee_lastname &&
                      touched.employee_lastname &&
                      errors.employee_lastname
                    }
                  />
                  <TextField
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    onBlur={handleBlur}
                    type="text"
                    size="small"
                    name="employee_email"
                    id="outlined-error-helper-text"
                    label="อีเมล"
                    value={values.employee_email || ""}
                    error={
                      errors.employee_email &&
                      touched.employee_email &&
                      errors.employee_email
                    }
                    helperText={
                      errors.employee_email &&
                      touched.employee_email &&
                      errors.employee_email
                    }
                  />
                  <TextField
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    onBlur={handleBlur}
                    type="text"
                    size="small"
                    name="employee_phone"
                    id="outlined-error-helper-text"
                    label="เบอร์โทรศัพท์"
                    value={values.employee_phone || ""}
                    error={
                      errors.employee_phone &&
                      touched.employee_phone &&
                      errors.employee_phone
                    }
                    helperText={
                      errors.employee_phone &&
                      touched.employee_phone &&
                      errors.employee_phone
                    }
                  />
                </div>
                <div>
                  <div className="form-heading">จัดการหน้าที่</div>
                  <div className="grid-container-50">
                    <FormControl
                      fullWidth
                      size="small"
                      error={
                        errors.employee_department &&
                        touched.employee_department &&
                        errors.employee_department
                      }
                    >
                      <InputLabel>แผนก</InputLabel>
                      <Select
                        onChange={(e) => {
                          handleChange(e);

                          //   setLoginError();
                        }}
                        onBlur={handleBlur}
                        type="text"
                        name="employee_department"
                        id="demo-simple-select-error"
                        value={values.employee_department || ""}
                        label="แผนก"
                      >
                        {department_position &&
                          department_position.map((data, index) => (
                            <MenuItem key={index} value={data.value}>
                              {data.name}
                            </MenuItem>
                          ))}
                      </Select>
                      <FormHelperText>
                        {errors.employee_department &&
                          touched.employee_department &&
                          errors.employee_department}
                      </FormHelperText>
                    </FormControl>
                    {values.employee_department && (
                      <FormControl
                        fullWidth
                        size="small"
                        error={
                          errors.employee_position &&
                          touched.employee_position &&
                          errors.employee_position
                        }
                      >
                        <InputLabel>ตำแหน่ง</InputLabel>
                        <Select
                          onChange={(e) => {
                            handleChange(e);

                            //   setLoginError();
                          }}
                          onBlur={handleBlur}
                          type="text"
                          name="employee_position"
                          id="demo-simple-select-error"
                          value={values.employee_position || ""}
                          label="พนักงาน"
                        >
                          {department_position &&
                            values.employee_department &&
                            department_position
                              .find(
                                (item) =>
                                  item.name === values.employee_department
                              )
                              .position_list.map((data, index) => (
                                <MenuItem key={index} value={data.value}>
                                  {data.name}
                                </MenuItem>
                              ))}
                        </Select>
                        <FormHelperText>
                          {errors.employee_position &&
                            touched.employee_position &&
                            errors.employee_position}
                        </FormHelperText>
                      </FormControl>
                    )}
                  </div>
                </div>

                <div>
                  <div>
                    <div className="sale-add-contact__accordian7-input-wrapper">
                      <Autocomplete
                        size="small"
                        name="employee_tag_list"
                        onChange={(event, newValue) => {
                          if (newValue == null) return null;
                          if (typeof newValue === "string") {
                            const Clone = values.employee_tag_list
                              ? [...values.employee_tag_list]
                              : [];
                            const check = Clone.find((val) => {
                              return `${val.tag_name}` === `${newValue}`;
                            });
                            if (check) return null;
                            Clone.push({ tag_name: newValue });
                            setFieldValue("employee_tag_list", Clone);
                          } else if (newValue && newValue.inputValue) {
                            // Create a new value from the user input
                            const Clone = values.employee_tag_list
                              ? [...values.employee_tag_list]
                              : [];
                            const check = Clone.find((val) => {
                              return (
                                `${val.tag_name}` === `${newValue.inputValue}`
                              );
                            });
                            if (check) return null;
                            Clone.push({ tag_name: newValue.inputValue });
                            setFieldValue("employee_tag_list", Clone);
                          } else {
                            const Clone = values.employee_tag_list
                              ? [...values.employee_tag_list]
                              : [];
                            const check = Clone.find((val) => {
                              return `${val.tag_name}` === `${newValue.value}`;
                            });
                            if (check) return null;
                            Clone.push({ tag_name: newValue.name });
                            setFieldValue("employee_tag_list", Clone);
                          }
                        }}
                        filterOptions={(options, params) => {
                          const filtered = filter(options, params);
                          const { inputValue } = params;
                          // Suggest the creation of a new value
                          const isExisting = options.some(
                            (option) => inputValue === option
                          );
                          if (inputValue !== "" && !isExisting) {
                            filtered.push({
                              inputValue,
                              name: `เพิ่ม "${inputValue}"`,
                            });
                          }
                          return filtered;
                        }}
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        id="free-solo-with-text-demo"
                        options={myTag}
                        getOptionLabel={(option) => {
                          // Value selected with enter, right from the input
                          if (typeof option === "string") {
                            return option;
                          }
                          // Add "xxx" option created dynamically
                          if (option.inputValue) {
                            return option.inputValue;
                          }
                          // Regular option
                          return option.name;
                        }}
                        renderOption={(props, option) => (
                          <li {...props}>{option.name}</li>
                        )}
                        sx={{ width: 200 }}
                        freeSolo
                        renderInput={(params) => (
                          <TextField {...params} label="สิทธิการเข้าถึง" />
                        )}
                      />
                    </div>
                    <div className="sale-add-contact__accordian7-wrapper addproject__permission-tag">
                      {values.employee_tag_list &&
                        values.employee_tag_list.map((val, index) => {
                          return (
                            <TagComponent
                              values={values.employee_tag_list}
                              setFieldValue={setFieldValue}
                              key={`${val} + ${index}`}
                              label={`${val.tag_name}`}
                              ID={index}
                            />
                          );
                        })}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="form-heading">ตั้งรหัสผ่าน</div>
                  <div className="grid-container-50">
                    <TextField
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      onBlur={handleBlur}
                      size="small"
                      type="password"
                      name="password"
                      id="outlined-error-helper-text"
                      label="รหัสผ่าน"
                      value={values.password || ""}
                      autoComplete="off"
                      inputProps={{
                        autocomplete: "new-password",
                        form: {
                          autocomplete: "off",
                        },
                      }}
                      error={errors.password && errors.password}
                      helperText={errors.password && errors.password}
                    />
                    <TextField
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      onBlur={handleBlur}
                      type="password"
                      size="small"
                      name="repassword"
                      id="outlined-error-helper-text"
                      label="ยืนยันรหัสผ่าน"
                      value={values.repassword || ""}
                      autoComplete="off"
                      inputProps={{
                        autoComplete: "new-password",
                        form: {
                          autoComplete: "off",
                        },
                      }}
                      error={errors.repassword && errors.repassword}
                      helperText={errors.repassword && errors.repassword}
                    />
                  </div>
                </div>
              </div>
              <div>
                <div className="form-heading">รูปโปรไฟล์</div>
                <div
                  className="img_display"
                  style={{
                    backgroundImage: `url(${
                      values.employee_img_url
                        ? values.employee_img_url
                        : Placeholder
                    })`,
                  }}
                >
                  {/* <img src={Placeholder} /> */}
                </div>
                <div className="fileUpload">
                  <input
                    type="file"
                    id="file"
                    className="upload"
                    accept=".jpg, .jpeg, .png, .gif"
                    onChange={(e) =>
                      handleClickUploadFile(
                        e.target.files,
                        setFieldValue,
                        setSubmitting
                      )
                    }
                  />
                  <span>อัพโหลด</span>
                </div>
                <div>
                  {errors.employee_img_url &&
                    touched.employee_img_url &&
                    errors.employee_img_url}
                </div>
              </div>
            </div>
            <ButtonComponent
              type="submit"
              text="บันทึก"
              variant="contained"
              color="success"
              disabled={isSubmitting}
            />
          </Form>
        )}
      </Formik>
    </>
  );
}
