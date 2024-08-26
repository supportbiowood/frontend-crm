import React from "react";

export default function KitScreen(props) {
  return (
    <>
      <div className={"loginContainer"}>
        <div className={"loginBar"}>
          {/* <ProjectInfoComponent /> */}
          {/* <Formik
            enableReinitialize
            initialValues={myvalue}
            validationSchema={loginSchema}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              console.log('values: ', values)
            }}>
            {({ values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, setErrors }) => (
              <Form method="POST" onSubmit={handleSubmit} className={'inputGroup'} autoComplete="off">
                <h1>เข้าสู่ระบบ</h1>
                {loginError ? (
                  <div className="alert alert-danger p-1" role="alert">
                    <p className="m-0">{loginError}</p>
                  </div>
                ) : null}
                <div>
                  <ProjectContactTypeComponent
                    values={values}
                    errors={errors}
                    touched={touched}
                    isSubmitting={isSubmitting}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    handleSubmit={handleSubmit}
                    setErrors={setErrors}
                  />
                </div>
                <div>
                  <TextField
                    onChange={(e) => {
                      handleChange(e)
                      setErrors({})
                      setLoginError()
                    }}
                    onBlur={handleBlur}
                    type="password"
                    name="password"
                    id="outlined-error-helper-text"
                    label="รหัสผ่าน"
                    value={values.password || ''}
                    error={errors.password && touched.password && errors.password}
                    helperText={errors.password && touched.password && errors.password}
                  />
                </div>
                <ButtonComponent
                  type="submit"
                  text="เข้าสู่ระบบ"
                  variant="contained"
                  color="success"
                  disabled={isSubmitting}
                />
              </Form>
            )}
          </Formik> */}
        </div>
      </div>
    </>
  );
}
