import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik, Form, getIn } from "formik";
import { getItemPropertyList } from "../../../adapter/Api/graphql";
import {
  Breadcrumbs,
  Button,
  TablePagination,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  createConfigItemProperty,
  updateConfigItemProperty,
  deleteConfigItemProperty,
} from "../../../adapter/Api/graphql";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../redux/actions/snackbarActions";

import BreadcrumbComponent from "../../BreadcrumbComponent";
import CloseIcon from "@mui/icons-material/Close";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ButtonComponent from "../../ButtonComponent";

const columnList = ["คุณสมบัติ", "ตัวย่อ", "ชนิดของข้อมูล", "คำอธิบาย", ""];

export default function PropertyComponent() {
  const [isLoading, setIsLoading] = useState(true);
  const [propertyList, setPropertyList] = useState([]);
  const deleteItem = [];
  const dispatch = useDispatch();

  const typeOption = [
    {
      id: "NUMBER",
      name: "ตัวเลข",
    },
    {
      id: "STRING",
      name: "ตัวอักษร",
    },
  ];

  //<================= get propertylist from api ==================>
  useEffect(() => {
    getItemPropertyList().then((data) => {
      if (data.data.data === null) return setIsLoading(false);
      let myData = data.data.data.listItemProperty.items;
      if (!myData) return;
      setPropertyList(myData);
      setIsLoading(false);
    });
  }, []);
  //<================= get propertylist from api ==================>

  //<================= page table control ==================>
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  //<================= page table control ==================>

  // const propertySchema = Yup.object().shape({
  //   name: Yup.string().required("กรุณาใส่ข้อมูล"),
  //   internalID: Yup.string().required("กรุณาใส่ข้อมูล"),
  //   description: Yup.string().required("กรุณาใส่ข้อมูล"),
  // });

  const propertySchema = Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("กรุณากรอกข้อมูล"),
      internalID: Yup.string().required("กรุณากรอกข้อมูล"),
      description: Yup.string().required("กรุณากรอกข้อมูล"),
    })
  );

  return (
    <div className="config">
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <BreadcrumbComponent name="ตั้งค่า" to="/config" />
        <BreadcrumbComponent name="คุณสมบัติ" to="#" />
      </Breadcrumbs>
      <Formik
        enableReinitialize
        initialValues={propertyList}
        validationSchema={propertySchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setIsLoading(true);
          setSubmitting(true);
          const createItem = [];
          const updateItem = [];
          values.forEach((item) => {
            if (item.id) return updateItem.push(item);
            if (!item.id) return createItem.push(item);
          });

          let arrayOfPromises = [];
          //create
          for (let i = 0; i < createItem.length; i++) {
            arrayOfPromises.push(
              createConfigItemProperty({ input: createItem[i] })
            );
          }
          //update
          for (let i = 0; i < updateItem.length; i++) {
            arrayOfPromises.push(
              updateConfigItemProperty({ input: updateItem[i] })
            );
          }
          //delete
          for (let i = 0; i < deleteItem.length; i++) {
            arrayOfPromises.push(
              deleteConfigItemProperty({ input: deleteItem[i] })
            );
          }

          Promise.all(arrayOfPromises).then((values) => {
            let successResult = [];
            let failResult = [];
            for (let i = 0; i < values.length; i++) {
              if (values[i].status === "error") failResult.push(values);
              else successResult.push(values);
            }
            if (failResult.length > 0) {
              setIsLoading(false);
              return dispatch(showSnackbar("error", "เกิดเหตุผิดพลาด"));
            } else {
              setIsLoading(false);
              dispatch(showSnackbar("success", "บันทึกสำเร็จ"));
              window.location.reload();
            }
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
          setSubmitting,
          setErrors,
          setFieldValue,
        }) => (
          <Form
            method="POST"
            onSubmit={handleSubmit}
            className={"inputGroup"}
            autoComplete="off"
          >
            <div className="header-layout">
              <h2>คุณสมบัติ</h2>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  const clone = values;
                  clone.push({
                    description: "",
                    internalID: "",
                    name: "",
                    type: "STRING",
                    value: null,
                  });
                  setFieldValue(clone);
                }}
              >
                เพิ่มคุณสมบัติ
              </Button>
            </div>
            <div className="inventory-container">
              <>
                <div className="table-container">
                  <table id="inventory" rules="none">
                    <thead>
                      {columnList.map((item, i) => {
                        return [<td>{item}</td>];
                      })}
                    </thead>
                    <tbody id="table-body">
                      {values &&
                        values.map((item, i) => {
                          return [
                            <>
                              <tr key={i}>
                                <td>
                                  <TextField
                                    onChange={(e) => {
                                      handleChange(e);
                                    }}
                                    size="small"
                                    type="text"
                                    name={`[${i}].name`}
                                    id="outlined-error-helper-text"
                                    label="คุณสมบัติ"
                                    value={item.name}
                                    error={Boolean(
                                      getIn(touched, `[${i}].name`) &&
                                        getIn(errors, `[${i}].name`)
                                    )}
                                    helperText={
                                      getIn(touched, `[${i}].name`) &&
                                      getIn(errors, `[${i}].name`)
                                    }
                                  />
                                </td>
                                <td>
                                  <TextField
                                    disabled={item.id}
                                    onChange={(e) => {
                                      handleChange(e);
                                    }}
                                    size="small"
                                    type="text"
                                    name={`[${i}].internalID`}
                                    id="outlined-error-helper-text"
                                    label="ตัวอักษรย่อ"
                                    value={item.internalID}
                                    error={Boolean(
                                      getIn(touched, `[${i}].internalID`) &&
                                        getIn(errors, `[${i}].internalID`)
                                    )}
                                    helperText={
                                      getIn(touched, `[${i}].internalID`) &&
                                      getIn(errors, `[${i}].internalID`)
                                    }
                                  />
                                </td>
                                <td>
                                  <FormControl fullWidth size="small">
                                    <InputLabel id="demo-simple-select-label">
                                      ชนิดของข้อมูล
                                    </InputLabel>
                                    <Select
                                      fullWidth
                                      labelId="demo-simple-select-label"
                                      id="demo-simple-select"
                                      size="small"
                                      name={`[${i}].type`}
                                      label="ชนิดของข้อมูล"
                                      value={item.type}
                                      onChange={(e) => {
                                        handleChange(e);
                                      }}
                                    >
                                      {typeOption.map((val, index) => (
                                        <MenuItem
                                          key={`${val.name} + ${index}`}
                                          value={val.id}
                                        >
                                          {val.name}
                                        </MenuItem>
                                      ))}
                                    </Select>
                                  </FormControl>
                                </td>
                                <td>
                                  <TextField
                                    onChange={(e) => {
                                      handleChange(e);
                                    }}
                                    size="small"
                                    type="text"
                                    name={`[${i}].description`}
                                    id="outlined-error-helper-text"
                                    label="คำอธิบาย"
                                    value={item.description}
                                    error={Boolean(
                                      getIn(touched, `[${i}].description`) &&
                                        getIn(errors, `[${i}].description`)
                                    )}
                                    helperText={
                                      getIn(touched, `[${i}].description`) &&
                                      getIn(errors, `[${i}].description`)
                                    }
                                  />
                                </td>
                                <td>
                                  <IconButton
                                    onClick={() => {
                                      const clone = values;
                                      clone.splice(i, 1);
                                      setFieldValue(clone);
                                      if (item.id)
                                        deleteItem.push({
                                          id: item.id,
                                          internalID: item.internalID,
                                        });
                                    }}
                                    className="inventory-add-icon"
                                  >
                                    <CloseIcon />
                                  </IconButton>
                                </td>
                              </tr>
                            </>,
                          ];
                        })}
                    </tbody>
                  </table>
                </div>
                <TablePagination
                  component="div"
                  count={100}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </>
            </div>
            <Button
              variant="outlined"
              type="reset"
              color="success"
              sx={{
                width: "130px",
                margin: "15px 20px 20px 0",
              }}
            >
              ยกเลิก
            </Button>
            <ButtonComponent
              type="submit"
              text="บันทึก"
              variant="contained"
              color="success"
              disabled={isSubmitting}
              sx={{
                width: "130px",
                backgroundColor: "rgba(65, 150, 68, 1)",
                margin: "15px 20px 20px 0",
              }}
            />
            {/* <Button
              variant="contained"
              type="submit"
              color="success"
              sx={{
                width: "130px",
                backgroundColor: "rgba(65, 150, 68, 1)",
                margin: "15px 20px 20px 0",
              }}
            >
              บันทึก
            </Button> */}
          </Form>
        )}
      </Formik>
    </div>
  );
}
