import React, { useCallback, useEffect, useState } from "react";
import BreadcrumbComponent from "../../BreadcrumbComponent";
import * as Yup from "yup";
import { Formik, Form } from "formik";
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
  getListUOMGroup,
  createConfigUOMGroup,
  updateConfigUOMGroup,
  deleteConfigUOMGroup,
  getAllUom,
} from "../../../adapter/Api/graphql";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import CloseIcon from "@mui/icons-material/Close";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../redux/actions/snackbarActions";

const columnList = ["ชื่อกลุุ่ม", "หน่วยหลัก", "คำอธิบาย", ""];

export default function UOMComponent() {
  const [isLoading, setIsLoading] = useState(true);
  const [uomGroupList, setGroupUomList] = useState([]);
  const [uomList, setUomList] = useState([]);
  const deleteItem = [];
  const dispatch = useDispatch();

  const fetchData = useCallback(() => {
    getListUOMGroup().then((data) => {
      if (data.data.data === null) return setIsLoading(false);
      let myData = data.data.data.listUOMGroup.items;
      if (!myData) return;
      setGroupUomList(myData);
      setIsLoading(false);
    });
  }, []);

  const fetchUOMList = useCallback(() => {
    getAllUom().then((data) => {
      if (data.data.data !== null) {
        const result = data.data.data.listUOM.items;
        setUomList(result);
      } else {
        dispatch(showSnackbar("error", "โหลดหน่วยผิดพลาด"));
      }
    });
  }, [dispatch]);

  useEffect(() => {
    fetchData();
    fetchUOMList();
  }, [fetchData, fetchUOMList, isLoading]);

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

  const createData = async (createItem) => {
    setIsLoading(true);
    await createItem.map((item) => {
      const Input = {
        ...item,
        internalID: item.name,
        listUOM: {
          uomID: item.baseUOMID,
          altQty: 20,
          baseQty: 1,
        },
      };
      return createConfigUOMGroup({ input: Input }).then((data) => {
        return setIsLoading(false);
      });
    });
  };

  const updateData = async (updateItem) => {
    setIsLoading(true);
    await updateItem.map((item) => {
      const Input = {
        baseUOMID: item.baseUOMID,
        description: item.description,
        id: item.id,
        internalID: item.internalID,
        listUOM: item.listUOM,
        name: item.name,
      };
      return updateConfigUOMGroup({ input: Input }).then((data) => {
        return setIsLoading(false);
      });
    });
  };

  const deleteData = async (deleteItem) => {
    setIsLoading(true);
    await deleteItem.map((item) => {
      return deleteConfigUOMGroup({ input: item }).then((data) => {
        return setIsLoading(false);
      });
    });
  };

  const uomSchema = Yup.object().shape({});

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
        <BreadcrumbComponent name="การแปลงหน่วย" to="#" />
      </Breadcrumbs>
      <Formik
        enableReinitialize
        initialValues={uomGroupList}
        validationSchema={uomSchema}
        validateOnChange={true}
        validateOnBlur={true}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          const createItem = [];
          const updateItem = [];
          values.forEach((item) => {
            if (item.id) return updateItem.push(item);
            if (!item.id) return createItem.push(item);
          });
          createData(createItem);
          updateData(updateItem);
          deleteData(deleteItem);
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
                  const clone = values;
                  clone.push({
                    description: "",
                    name: "",
                    internalID: "",
                    baseUOMID: "PC",
                    listUOM: [],
                  });
                  setFieldValue(clone);
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
                                    label="ชื่อกลุ่ม"
                                    value={item.name}
                                  />
                                </td>
                                <td>
                                  {item.id ? (
                                    <div>{item.baseUOMName}</div>
                                  ) : (
                                    <FormControl fullWidth size="small">
                                      <InputLabel id="demo-simple-select-label">
                                        หน่วยหลัก
                                      </InputLabel>
                                      <Select
                                        fullWidth
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        size="small"
                                        name={`[${i}].baseUOMID`}
                                        label="หน่วยหลัก"
                                        defaultValue={1}
                                        value={item.baseUOMID}
                                        onChange={(e) => {
                                          handleChange(e);
                                        }}
                                      >
                                        {uomList.map((val, index) => (
                                          <MenuItem
                                            key={`${val.name} + ${index}`}
                                            value={val.id}
                                          >
                                            {val.name}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  )}
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
                                  />
                                </td>
                                <td>
                                  {item.id ? (
                                    <Link
                                      to={`/config/uomConversion/` + item.id}
                                    >
                                      <IconButton>
                                        <EditOutlinedIcon />
                                      </IconButton>
                                    </Link>
                                  ) : (
                                    <div></div>
                                  )}
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
            <Button
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
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
