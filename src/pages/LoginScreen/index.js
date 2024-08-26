import React, { useState } from "react";
import { setUserSession } from "../../adapter/Auth";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { login, forgetPassword } from "../../adapter/Api";

import ButtonComponent from "../../components/ButtonComponent";
import TextField from "@mui/material/TextField";

import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/actions/snackbarActions";

import loginBg from "../../images/loginBg.svg";
import loginBiowood from "../../images/loginBiowood.png";

export default function LoginScreen(props) {
  const [isShowLogin, setIsShowLogin] = useState(true);

  return (
    <>
      <div className={"loginContainer"}>
        <div className={"loginBar"}>
          {isShowLogin ? (
            <LoginFormScreen {...props} setIsShowLogin={setIsShowLogin} />
          ) : (
            <ForgetPasswordScreen {...props} setIsShowLogin={setIsShowLogin} />
          )}
        </div>
        <div className="login-right">
          <img alt="login" src={loginBg} />
        </div>
      </div>
    </>
  );
}

function LoginFormScreen(props) {
  const dispatch = useDispatch();
  const loginSchema = Yup.object().shape({
    email: Yup.string().email("อีเมลไม่ถูกต้อง").required("กรุณากรอกอีเมล"),
    password: Yup.string().required("กรุณากรอกรหัสผ่าน"),
  });
  const { history } = props;
  return (
    <Formik
      enableReinitialize
      initialValues={{
        email: "",
        password: "",
      }}
      validationSchema={loginSchema}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        //before submit
        console.table(values);
        setSubmitting(true);
        //submit
        login(values.email, values.password)
          .then((data) => {
            if (data.data.status === "success") {
              console.log("success", data.data);
              setUserSession(data.data.data.access_token, data.data.data.user);
              resetForm({});
              history.push("/");
            } else {
              dispatch(showSnackbar("error", data.data.message));
            }
            setSubmitting(false);
          })
          .catch((err) => {
            console.log(err.response);
            setSubmitting(false);
            dispatch(showSnackbar("error", err.response.data.message));
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
      }) => (
        <Form
          method="POST"
          onSubmit={handleSubmit}
          className={"inputGroup"}
          autoComplete="off"
        >
          {/* <img src="/logos/biowood-logo.png" /> */}
          <img alt="biowood-logo" src={loginBiowood} />
          <h1>เข้าสู่ระบบ</h1>
          <div>
            <TextField
              onChange={(e) => {
                handleChange(e);
                setErrors({});
              }}
              onBlur={handleBlur}
              type="text"
              name="email"
              size="small"
              id="outlined-error-helper-text"
              label="อีเมล"
              value={values.email || ""}
              error={errors.email && touched.email && errors.email}
              helperText={errors.email && touched.email && errors.email}
            />
          </div>
          <div>
            <TextField
              onChange={(e) => {
                handleChange(e);
                setErrors({});
              }}
              onBlur={handleBlur}
              type="password"
              name="password"
              size="small"
              id="outlined-error-helper-text"
              label="รหัสผ่าน"
              value={values.password || ""}
              error={errors.password && touched.password && errors.password}
              helperText={
                errors.password && touched.password && errors.password
              }
            />
          </div>

          <div className="login-button">
            <ButtonComponent
              type="submit"
              text="เข้าสู่ระบบ"
              variant="contained"
              color="success"
              disabled={isSubmitting}
            />
            {/* <div
              className="forget-password"
              onClick={() => props.setIsShowLogin(false)}
            >
              ลืมรหัสผ่าน
            </div> */}
          </div>
        </Form>
      )}
    </Formik>
  );
}

function ForgetPasswordScreen(props) {
  const dispatch = useDispatch();
  const loginSchema = Yup.object().shape({
    email: Yup.string().email("อีเมลไม่ถูกต้อง").required("กรุณากรอกอีเมล"),
  });
  const [success, setSuccess] = useState(false);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        email: "",
      }}
      validationSchema={loginSchema}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        //before submit
        console.table(values);
        setSubmitting(true);
        forgetPassword(values.email)
          .then((data) => {
            if (data.data.status === "success") {
              console.log("success", data.data);
              resetForm({});
              // props.setIsShowLogin(true)
              setSuccess(true);
            } else {
              dispatch(showSnackbar("error", data.data.message));
            }
            setSubmitting(false);
          })
          .catch((err) => {
            console.log(err.response);
            setSubmitting(false);
            dispatch(showSnackbar("error", err.response.data.message));
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
      }) => (
        <Form
          method="POST"
          onSubmit={handleSubmit}
          className={"inputGroup"}
          autoComplete="off"
        >
          {/* <img src="/logos/biowood-logo.png" /> */}
          <img alt="login" src={loginBiowood} />
          <h1>ลืมรหัสผ่าน</h1>
          {success ? (
            <ForgetPasswordSuccessScreen
              email={values.email}
              setIsShowLogin={props.setIsShowLogin}
            />
          ) : (
            <>
              <div style={{ marginBottom: "20px" }}>
                กรุณาระบุอีเมลของคุณ เพื่อการตั้งรหัสผ่านใหม่
              </div>
              <div>
                <TextField
                  onChange={(e) => {
                    handleChange(e);
                    setErrors({});
                  }}
                  onBlur={handleBlur}
                  type="text"
                  name="email"
                  size="small"
                  id="outlined-error-helper-text"
                  label="อีเมล"
                  value={values.email || ""}
                  error={errors.email && touched.email && errors.email}
                  helperText={errors.email && touched.email && errors.email}
                />
              </div>
              <div className="login-button">
                <ButtonComponent
                  type="submit"
                  text="รีเซ็ตรหัสผ่าน"
                  variant="contained"
                  color="success"
                  disabled={isSubmitting}
                />
                <div
                  className="forget-password"
                  onClick={() => props.setIsShowLogin(true)}
                >
                  เข้าสู่ระบบ
                </div>
              </div>
            </>
          )}
        </Form>
      )}
    </Formik>
  );
}

function ForgetPasswordSuccessScreen(props) {
  return (
    <>
      <div style={{ padding: "0 40px" }}>
        ระบบจะทำการส่งลิงค์ไปที่อีเมล <b>{props.email && props.email}</b>{" "}
        พร้อมกับวิธีการขั้นตอนการดำเนินการสำหรับการเปลี่ยนแปลงรหัสผ่าน
        กรุณาตรวจสอบอีเมล
      </div>
      <div
        className="forget-password-2"
        onClick={() => props.setIsShowLogin(true)}
      >
        เข้าสู่ระบบ
      </div>
    </>
  );
}
