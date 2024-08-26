import React, { useEffect, useState } from "react";
import BreadcrumbComponent from "../../BreadcrumbComponent";
import * as Yup from "yup";
import { Formik, Form, getIn } from "formik";
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
import { getAllUom, updateConfigUOMGroup } from "../../../adapter/Api/graphql";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../redux/actions/snackbarActions";

import CloseIcon from "@mui/icons-material/Close";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams } from "react-router-dom";
import { getUOMGroupUUIDByID } from "../../../adapter/Api/graphql";

const columnList = ["จำนวน", "หน่วย", "จำนวน", "หน่วยหลัก", ""];

export default function UOMGroupEditComponent() {
  const [isLoading, setIsLoading] = useState(true);
  const [uomList, setUomList] = useState([]);
  const [uomOption, setUomOption] = useState([]);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
    fetchUOMList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const fetchData = () => {
    getUOMGroupUUIDByID({ getUomGroupUuidId: id }).then((data) => {
      if (data.data.data === null) return setIsLoading(false);
      let myData = data.data.data.getUOMGroupUUID;
      setUomList(myData);
      setIsLoading(false);
    });
  };

  const fetchUOMList = () => {
    getAllUom().then((data) => {
      if (data.data.data !== null) {
        const result = data.data.data.listUOM.items;
        setUomOption(result);
      } else {
        dispatch(showSnackbar("error", "โหลดหน่วยผิดพลาด"));
      }
    });
  };

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

  const uomSchema = Yup.object().shape({
    listUOM: Yup.array().of(
      Yup.object().shape({
        altQty: Yup.number()
          .typeError("กรุณากรอกเป็นตัวเลข")
          .required("กรุณากรอกข้อมูล"),
        baseQty: Yup.number()
          .typeError("กรุณากรอกเป็นตัวเลข")
          .required("กรุณากรอกข้อมูล"),
        uomID: Yup.string().required("กรุณาเลือกข้อมูล"),
      })
    ),
  });

  const updateAPI = (uom) => {
    setIsLoading(true);
    const input = {
      id: id,
      internalID: uom.internalID,
      name: uom.name,
      description: uom.description,
      baseUOMID: uom.baseUOMID,
      listUOM: uom.listUOM,
    };
    updateConfigUOMGroup({ input: input }).then((data) => {
      if (!data.data.data) return setIsLoading(false);
      setIsLoading(false);
    });
  };

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
        <BreadcrumbComponent name="การแปลงหน่วย" to="/config/uomConversion" />
        <BreadcrumbComponent name={uomList.internalID} to="#" />
      </Breadcrumbs>
      <Formik
        enableReinitialize
        initialValues={uomList}
        validationSchema={uomSchema}
        validateOnChange={true}
        validateOnBlur={true}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          updateAPI(values);
          return resetForm();
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
              <h2>การแปลงหน่วย</h2>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  const clone = [...values.listUOM];
                  clone.push({
                    altQty: 1,
                    baseQty: 1,
                    uomID: "PC",
                  });
                  setFieldValue("listUOM", clone);
                }}
              >
                เพิ่มกลุ่มของหน่วย
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
                      {values.listUOM &&
                        values.listUOM.map((item, i) => {
                          return [
                            <>
                              {i === 0 ? (
                                <tr key={i}>
                                  <td>1</td>
                                  <td>
                                    <FormControl fullWidth size="small">
                                      <InputLabel id="demo-simple-select-label">
                                        หน่วย
                                      </InputLabel>
                                      <Select
                                        fullWidth
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        size="small"
                                        name="baseUOMID"
                                        label="หน่วย"
                                        defaultValue={1}
                                        value={values.baseUOMID}
                                        onChange={(e) => {
                                          handleChange(e);
                                        }}
                                      >
                                        {uomOption.map((val, index) => (
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
                                  <td>1</td>
                                  <td>{values.baseUOMName}</td>
                                  <td></td>
                                </tr>
                              ) : (
                                <tr key={i}>
                                  <td>
                                    <TextField
                                      onChange={(e) => {
                                        handleChange(e);
                                      }}
                                      size="small"
                                      type="number"
                                      inputProps={{ min: 0 }}
                                      name={`listUOM[${i}].altQty`}
                                      id="outlined-error-helper-text"
                                      label="จำนวน"
                                      value={item.altQty}
                                      error={Boolean(
                                        getIn(
                                          touched,
                                          `listUOM[${i}].altQty`
                                        ) &&
                                          getIn(errors, `listUOM[${i}].altQty`)
                                      )}
                                      helperText={
                                        getIn(
                                          touched,
                                          `listUOM[${i}].altQty`
                                        ) &&
                                        getIn(errors, `listUOM[${i}].altQty`)
                                      }
                                    />
                                  </td>
                                  <td>
                                    <FormControl fullWidth size="small">
                                      <InputLabel id="demo-simple-select-label">
                                        หน่วย
                                      </InputLabel>
                                      <Select
                                        fullWidth
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        size="small"
                                        name={`listUOM[${i}].uomID`}
                                        label="หน่วย"
                                        defaultValue={1}
                                        value={item.uomID}
                                        onChange={(e) => {
                                          handleChange(e);
                                        }}
                                      >
                                        {uomOption.map((val, index) => (
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
                                      type="number"
                                      // inputProps={{ min: 0 }}
                                      name={`listUOM[${i}].baseQty`}
                                      id="outlined-error-helper-text"
                                      label="จำนวน"
                                      value={item.baseQty}
                                      error={Boolean(
                                        getIn(
                                          touched,
                                          `listUOM[${i}].baseQty`
                                        ) &&
                                          getIn(errors, `listUOM[${i}].baseQty`)
                                      )}
                                      helperText={
                                        getIn(
                                          touched,
                                          `listUOM[${i}].baseQty`
                                        ) &&
                                        getIn(errors, `listUOM[${i}].baseQty`)
                                      }
                                    />
                                  </td>
                                  <td>{values.baseUOMName}</td>
                                  {i !== 0 && (
                                    <td className="inventory-add-icon">
                                      <IconButton
                                        onClick={() => {
                                          const clone = [...values.listUOM];
                                          clone.splice(i, 1);
                                          setFieldValue("listUOM", clone);
                                        }}
                                        className="inventory-add-icon"
                                      >
                                        <CloseIcon />
                                      </IconButton>
                                    </td>
                                  )}
                                </tr>
                              )}
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
            <Button
              variant="contained"
              type="submit"
              color="success"
              sx={{
                width: "130px",
                backgroundColor: "rgba(65, 150, 68, 1)",
                margin: "15px 20px 20px 0",
              }}
              onClick={() => console.log(errors)}
            >
              บันทึก
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
