import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Breadcrumbs,
  Button,
  FormControl,
  Autocomplete,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TablePagination,
  TextField,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ProgressIndicatorComponent from "../ProgressIndicatorComponent";
import moment from "moment";

import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/actions/snackbarActions";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import ButtonComponent from "../ButtonComponent";
import BreadcrumbComponent from "../BreadcrumbComponent";
import {
  updateInventoryCountingItem,
  getInventoryCountingById,
  scanSerialBatch,
  queryItemInventory,
  getListWareHouse,
} from "../../adapter/Api/graphql";
import { getUser } from "../../adapter/Auth";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const filter = createFilterOptions();

const columnList = [
  "รหัสสินค้า - ชื่อสินค้า",
  "จำนวนสินค้าคงคลัง",
  "จำนวนจริง",
  "ส่วนต่าง",
  "หน่วย",
  "คลัง",
  "ที่จัดเก็บ",
  "หมายเหตุ",
  "หมายเลข Serial",
  "",
];

export default function StockCountItemComponent() {
  const [myValue, setMyValue] = useState({
    stage: 0,
    documentName: "",
    status: "",
    txSeries: "0",
    id: "",
    documentID: "",
    documentDate: "",
    lineItem: [],
    inventoryCountingType: "QUANTITY",
  });
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const { txSeries } = useParams();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [itemList, setItemList] = useState([]);
  const user = getUser();

  const remarkOption = [
    {
      value: "ชำรุด",
      name: "ชำรุด",
    },
    {
      value: "สติ๊กเกอร์ผิด",
      name: "สติ๊กเกอร์ผิด",
    },
    {
      value: "ตั้งต้นผิด",
      name: "ตั้งต้นผิด",
    },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const sumOfQuantity = (data) => {
  //   const newData = data.reduce((sum, item) => {
  //     if (isNaN(item.quantity)) return sum;
  //     return parseInt(sum) + item.totalCountedQty;
  //   }, 0);
  //   return newData || 0;
  // };

  const stageCheck = (data) => {
    if (data === "DRAFT") return 0;
    if (data === "WAIT_APPROVE") return 1;
    return 2;
  };

  const loginSchema = Yup.object().shape({
    // email: Yup.string().required("กรุณาเลือก"),
    // project_deal_value: Yup.number()
    //   .required("กรุณาใส่ค่า")
    //   .typeError("กรุณาใส่เป็นตัวเลข"),
    // contact_business_category: Yup.string().required("กรุณาเลือก"),
  });

  useEffect(() => {
    fetchWarehouseData();
    const itemInventoryInput = {};
    queryItemInventory(itemInventoryInput)
      .then((data) => {
        const myData = data.data.data.listItem.items.filter(
          (data) => data.isActive !== false
        );
        const myDataIsStock = myData.filter(
          (data) => data.isInventory !== false
        );
        setItemList(myDataIsStock);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", `${err}` || "อ่านข้อมูลผิดพลาด"));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [warehouseOption, setWarehouseOption] = useState([]);

  const fetchWarehouseData = () => {
    getListWareHouse().then((data) => {
      let myData = data.data.data.listWarehouse.items;
      myData.forEach((item) => {
        return {
          id: item.id,
          internalID: item.internalID,
          name: item.name,
          listBinLocation: item.listBinLocation,
        };
      });
      setWarehouseOption(myData);
    });
    return null;
  };

  useEffect(() => {
    const ById = {
      txSeries: `${txSeries}`,
      getInventoryCountingDocumentId: `${id}`,
    };
    getInventoryCountingById(ById).then((data) => {
      if (data.data.data.getGoodsReceiptDocument === null) return null;
      const myData = data.data.data.getInventoryCountingDocument;
      setMyValue((prev) => ({
        ...prev,
        stage: stageCheck(myData.status),
        status: myData.status !== null ? myData.status : "DRAFT",
        inventoryCountingType: myData.inventoryCountingType,
        id: myData.id,
        documentID:
          myData.listDocumentReference !== null &&
          myData.listDocumentReference.length !== 0
            ? myData.listDocumentReference[0].documentID
            : [],
        warehouseID: myData.warehouseID,
        remark: myData.remark,
        documentDate: new Date(myData.documentDate),
        lineItem: myData.lineItem.map((row) => {
          return {
            itemID: row.itemID.split("-")[0].replace(/\s+/g, ""),
            sortNo: row.sortNo,
            quantityReference: row.quantityReference || "",
            quantity: row.quantity,
            perUnitPrice: row.perUnitPrice || 0,
            uomID: row.uomID || "",
            warehouseID: "W01",
            name: row.item.name || "",
            remark: row.remark,
          };
        }),
      }));
      setIsLoading(false);
    });
  }, [id, txSeries]);

  const updateDraftStage = (values, setSubmitting, number, save) => {
    const prepare_update_data = {
      txSeries: values.txSeries,
      status: "DRAFT",
      inventoryCountingType: "QUANTITY",
      id: values.id,
      warehouseID: values.warehouseID,
      documentDate: moment(values.documentDate)
        .tz("Asia/Bangkok")
        .format("YYYY-MM-DD"),
      remark: values.remark,
      lineItem: values.lineItem.map((val, index) => {
        return {
          lineID: `${index}`,
          sortNo: index,
          quantityReference: val.quantityReference,
          quantity: val.quantity,
          perUnitPrice: val.perUnitPrice,
          itemID: val.itemID.split("-")[0].replace(/\s+/g, ""),
          uomID: val.uomID,
          warehouseID: values.warehouseID,
          // remark: val.remark,
        };
      }),
    };

    const prepare_update_data_WAIT_APPROVE = {
      txSeries: values.txSeries,
      status: "WAIT_APPROVE",
      inventoryCountingType: "QUANTITY",
      id: values.id,
      warehouseID: values.warehouseID,
      documentDate: moment(values.documentDate)
        .tz("Asia/Bangkok")
        .format("YYYY-MM-DD"),
      remark: values.remark,
      lineItem: values.lineItem.map((val, index) => {
        return {
          lineID: `${index}`,
          sortNo: index,
          quantityReference: val.quantityReference,
          quantity: val.quantity,
          perUnitPrice: val.perUnitPrice,
          itemID: val.itemID.split("-")[0].replace(/\s+/g, ""),
          uomID: val.uomID,
          warehouseID: values.warehouseID,
          // remark: val.remark,
        };
      }),
    };

    if (number === 0) {
      setIsLoading(true);
      updateInventoryCountingItem({ input: prepare_update_data }).then(
        (data) => {
          if (data.data.data !== null) {
            if (save) {
              dispatch(showSnackbar("success", "บันทึกแบบร่างสำเร็จ"));
            } else {
              dispatch(showSnackbar("success", "ยืนยันสำเร็จ"));
            }
            setSubmitting(false);
            setIsLoading(false);
          } else {
            dispatch(showSnackbar("error", "ยืนยันไม่สำเร็จ"));
            setIsLoading(false);
          }
          // window.location.href = "/inventory/stock-count";
        }
      );
    } else {
      setIsLoading(true);
      updateInventoryCountingItem({
        input: prepare_update_data_WAIT_APPROVE,
      }).then((data) => {
        if (data.data.data !== null) {
          if (save) {
            dispatch(showSnackbar("success", "บันทึกแบบร่างสำเร็จ"));
          } else {
            dispatch(showSnackbar("success", "ยืนยันสำเร็จ"));
          }
          setSubmitting(false);
          setIsLoading(false);
        } else {
          dispatch(showSnackbar("error", "ยืนยันไม่สำเร็จ"));
          setIsLoading(false);
        }
      });
    }
  };

  const updateDeleteStage = (values, setSubmitting) => {
    const prepare_delete_data = {
      txSeries: values.txSeries,
      id: values.id,
      status: "CANCELED",
    };

    updateInventoryCountingItem({ input: prepare_delete_data }).then((data) => {
      if (data.data.data === null)
        return dispatch(showSnackbar("error", "เกิดเหตุผิดพลาด"));
      dispatch(showSnackbar("success", "ไม่อนุมัติสำเร็จ"));
      setSubmitting(false);
      setIsLoading(false);
      window.location.href = "/inventory/stock-count";
    });
  };

  const updateCloseStage = (values, setSubmitting) => {
    console.log(values);
    const prepare_success_data = {
      txSeries: values.txSeries,
      id: values.id,
      warehouseID: values.warehouseID,
      documentDate: moment(values.documentDate)
        .tz("Asia/Bangkok")
        .format("YYYY-MM-DD"),
      remark: values.remark,
      status: "CLOSED",
      lineItem: values.lineItem.map((val, index) => {
        return {
          lineID: `${index}`,
          sortNo: index,
          quantityReference: val.quantityReference,
          quantity: val.quantity,
          itemID: val.itemID.split("-")[0].replace(/\s+/g, ""),
          uomID: val.uomID,
          warehouseID: values.warehouseID,
          // serialBatchList: val.transaction.map((data) => {
          //   return {
          //     quantity: val.quantity,
          //     totalCountedQty: data.totalCountedQty,
          //     changedQty: val.quantity - data.totalCountedQty,
          //     remark: val.remark,
          //   };
          // }),
        };
      }),
    };

    setIsLoading(true);
    updateInventoryCountingItem({ input: prepare_success_data }).then(
      (data) => {
        if (data.data.data !== null) {
          dispatch(showSnackbar("success", "อนุมัติสำเร็จ"));
          setSubmitting(false);
          setIsLoading(false);
          window.location.href = "/inventory/stock-count";
        } else {
          dispatch(showSnackbar("error", "เกิดเหตุผิดพลาด"));
        }
      }
    );
  };

  const getItemDetail = (itemID) => {
    const findItem = itemList.find((val) => {
      return `${itemID}` === `${val.id}`;
    });
    if (!findItem) return null;
    return findItem;
  };

  const scanSerial = (input, lineItem, values, setFieldValue) => {
    const clone = [...values.lineItem];
    if (clone.some((Item) => Item.serialBatchID === input))
      return dispatch(showSnackbar("error", "หมายเลข serial มีอยู่แล้ว"));

    const docID = input.split("|")[2].split(":")[0];
    const pallete = input.split(":")[2];
    const itemID = input.split("|")[1];
    setIsLoading(true);

    const inputSerial = {
      txSeries: values.txSeries,
      documentId: docID,
      serialBatchId: input,
    };

    scanSerialBatch(inputSerial).then((data) => {
      setIsLoading(false);
      if (data.data.data === null)
        return dispatch(showSnackbar("error", "สแกนไม่สำเร็จ"));

      const itemData = getItemDetail(itemID);
      if (!itemData)
        return dispatch(showSnackbar("error", "ไม่พบสินค้านี้ในระบบ"));

      clone.push({
        lineID: clone.length,
        sortNo: Math.random,
        quantityReference: itemData.listItemCurrent.items[0].onHandQty,
        quantity: 1,
        itemID: itemData.id,
        name: itemData.name,
        uomID: itemData.inventoryUOMID,
        warehouseID: values.warehouseID,
        pallete: pallete,
        serialBatchID: input,
        remark: "",
      });
      setFieldValue("lineItem", clone);
    });
  };

  return (
    <div className="good-receipt-add-main">
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Formik
        enableReinitialize
        initialValues={myValue}
        validationSchema={loginSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
          setFieldValue,
          setSubmitting,
        }) => (
          <Form
            method="POST"
            onSubmit={handleSubmit}
            className={"inputGroup"}
            autoComplete="off"
          >
            <Stack spacing={2}>
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                <BreadcrumbComponent
                  name="คลังสินค้า"
                  key="1"
                  to="/inventory"
                />
                <BreadcrumbComponent
                  name="ปรับลดยอด"
                  key="2"
                  to="/inventory/stock-count"
                />
                <BreadcrumbComponent name={values.id} key="2" to="#" />
              </Breadcrumbs>
            </Stack>
            {values.stage === 0 && (
              <div>
                <div>
                  <ul className="progressbar__wrapper">
                    <ProgressIndicatorComponent
                      isActive={true}
                      title="สร้างเอกสาร"
                    />
                    <ProgressIndicatorComponent
                      isActive={false}
                      title="สแกนสินค้า"
                    />
                    <ProgressIndicatorComponent
                      isActive={false}
                      title="อนุมัติ"
                    />
                  </ul>
                </div>
                <div className="inventory-title-grid">
                  <h1>ปรับลดยอด</h1>
                  <div>
                    {values.status === "CLOSED" && (
                      <div className="inventoryMaster-active-cell">
                        <div>สำเร็จ</div>
                      </div>
                    )}
                    {values.status === "DRAFT" && (
                      <div className="inventoryMaster-notActive-cell">
                        <div>ร่าง</div>
                      </div>
                    )}
                    {values.status === "CANCELED" && (
                      <div className="inventoryMaster-cancel-cell">
                        <div>ยกเลิก</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="inventory__under-header-layout">
                  <div className="grid-container-50">
                    <div className="grid-container-50">
                      <p>เลขที่เอกสาร</p>
                      <p>{values.id}</p>
                    </div>
                  </div>
                  <div className="inventory__under-header-datepicker-layout">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        disabled
                        label="วันที่ออกเอกสาร"
                        onChange={(e, value) => {
                          setFieldValue("createdAt", e);
                        }}
                        value={values.createdAt}
                        inputFormat="dd/MM/yyyy"
                        renderInput={(params) => (
                          <TextField
                            sx={{ width: 160, justifySelf: "right" }}
                            size="small"
                            {...params}
                          />
                        )}
                      />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        disabled
                        // label="วันที่ปรับลดยอด"
                        onChange={(e, value) => {
                          setFieldValue("documentDate", e);
                        }}
                        value={values.documentDate}
                        inputFormat="dd/MM/yyyy"
                        renderInput={(params) => (
                          <TextField
                            sx={{ width: 160, justifySelf: "right" }}
                            size="small"
                            {...params}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </div>
                </div>
                <div className="inventory-container">
                  <div className="grid-container-25">
                    <h3>ข้อมูล</h3>
                    <h3>สถานที่</h3>
                  </div>
                  <div className="grid-container-25">
                    <TextField
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      disabled
                      size="small"
                      type="text"
                      name="remark"
                      id="outlined-error-helper-text"
                      label="หมายเหตุ"
                      value={values.remark}
                    />
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-simple-select-label">
                        คลังปลายทาง
                      </InputLabel>
                      <Select
                        disabled
                        fullWidth
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        size="small"
                        name="warehouseID"
                        label="คลังปลายทาง"
                        defaultValue={1}
                        value={values.warehouseID}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                      >
                        {warehouseOption.map((val, index) => (
                          <MenuItem
                            key={`${val.name} + ${index}`}
                            value={val.id}
                          >
                            {val.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <div className="grid-container-50">
                  <h1>รายการ</h1>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{
                      justifySelf: "right",
                      width: "max-content",
                      height: "fit-content",
                    }}
                  >
                    พิมพ์ทั้งหมด
                  </Button>
                </div>
                <TextField
                  label="สแกนหมายเลข Serial"
                  size="small"
                  onChange={(e) => {
                    if (e.target.value.length >= 29) {
                      scanSerial(
                        e.target.value,
                        values.lineItem,
                        values,
                        setFieldValue
                      );
                      setTimeout(() => {
                        e.target.value = "";
                      }, [500]);
                    }
                  }}
                />
                <div className="inventory-container">
                  <>
                    <div className="table-container">
                      <table id="inventory" rules="none">
                        <thead>
                          {columnList.map((item, i) => {
                            return [<td>{item} </td>];
                          })}
                        </thead>
                        <tbody id="table-body">
                          {values.lineItem?.map((item, i) => {
                            return [
                              <>
                                <tr key={i}>
                                  <td>
                                    {item.itemID} - {item.name}
                                  </td>
                                  <td>{item.quantityReference}</td>
                                  <td>
                                    <TextField
                                      size="small"
                                      type="number"
                                      name={`lineItem[${i}].quantity`}
                                      onChange={(e) => {
                                        handleChange(e);
                                      }}
                                      value={item.quantity}
                                      InputProps={{
                                        inputProps: { min: 0 },
                                      }}
                                    />
                                  </td>
                                  <td
                                    style={{ color: "rgba(255, 0, 0, 0.87)" }}
                                  >
                                    {item.quantity - item.quantityReference}
                                  </td>
                                  <td>{item.uomID}</td>
                                  <td>{item.warehouseID}</td>
                                  <td>{item.pallete}</td>
                                  <td>
                                    <Autocomplete
                                      size="small"
                                      value={item.remark}
                                      name={`lineItem[${i}].remark`}
                                      onChange={(event, newValue) => {
                                        if (newValue == null) return null;
                                        if (typeof newValue === "string") {
                                          setFieldValue(
                                            `lineItem[${i}].remark`,
                                            newValue.inputValue
                                          );
                                        } else if (
                                          newValue &&
                                          newValue.inputValue
                                        ) {
                                          setFieldValue(
                                            `lineItem[${i}].remark`,
                                            newValue.inputValue
                                          );
                                          // Create a new value from the user input
                                        } else {
                                          setFieldValue(
                                            `lineItem[${i}].remark`,
                                            newValue.value
                                          );
                                        }
                                      }}
                                      filterOptions={(options, params) => {
                                        const filtered = filter(
                                          options,
                                          params
                                        );

                                        const { inputValue } = params;
                                        // Suggest the creation of a new value
                                        const isExisting = options.some(
                                          (option) => inputValue === option.name
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
                                      options={remarkOption}
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
                                      sx={{ width: 160 }}
                                      freeSolo
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          label="หมายเหตุ"
                                        />
                                      )}
                                    />
                                  </td>
                                  <td>{item.serialBatchID}</td>
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
                <div className="button-layout">
                  <ButtonComponent
                    isSubmitting={isSubmitting}
                    type="button"
                    text="บันทึกแบบร่าง"
                    variant="outlined"
                    onClick={() => {
                      updateDraftStage(values, setSubmitting, 0, true);
                    }}
                  />
                  <ButtonComponent
                    type="button"
                    text="ยืนยัน"
                    variant="contained"
                    onClick={() => {
                      if (user.employee_position !== "ผู้ดูแลระบบ") {
                        //call api update
                        updateDraftStage(values, setSubmitting, 0);
                        // relocation
                        window.location.href = "/inventory/stock-count";
                      } else {
                        //call api update
                        updateDraftStage(values, setSubmitting, 1);
                        //go next component
                        setFieldValue("stage", values.stage + 1);
                        // setIsLoading(true);
                      }
                    }}
                  />
                </div>
              </div>
            )}
            {values.stage === 1 && (
              <div>
                <div>
                  <ul className="progressbar__wrapper">
                    <ProgressIndicatorComponent
                      isActive={true}
                      title="สร้างเอกสาร"
                    />
                    <ProgressIndicatorComponent
                      isActive={true}
                      title="สแกนสินค้า"
                    />
                    <ProgressIndicatorComponent
                      isActive={false}
                      title="อนุมัติ"
                    />
                  </ul>
                </div>
                <div className="inventory-title-grid">
                  <h1>ปรับลดยอด</h1>
                  <div>
                    {values.status === "CLOSED" && (
                      <div className="inventoryMaster-active-cell">
                        <div>สำเร็จ</div>
                      </div>
                    )}
                    {values.status === "DRAFT" && (
                      <div className="inventoryMaster-notActive-cell">
                        <div>ร่าง</div>
                      </div>
                    )}
                    {values.status === "CANCELED" && (
                      <div className="inventoryMaster-cancel-cell">
                        <div>ยกเลิก</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="inventory__under-header-layout">
                  <div className="grid-container-50">
                    <div className="grid-container-50">
                      <p>เลขที่เอกสาร</p>
                      <p>{values.id}</p>
                    </div>
                  </div>
                  <div className="inventory__under-header-datepicker-layout">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        disabled
                        label="วันที่ออกเอกสาร"
                        onChange={(e, value) => {
                          setFieldValue("createdAt", e);
                        }}
                        value={values.createdAt}
                        inputFormat="dd/MM/yyyy"
                        renderInput={(params) => (
                          <TextField
                            sx={{ width: 160, justifySelf: "right" }}
                            size="small"
                            {...params}
                          />
                        )}
                      />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        disabled
                        label="วันที่ปรับลดยอด"
                        onChange={(e, value) => {
                          setFieldValue("documentDate", e);
                        }}
                        value={values.documentDate}
                        inputFormat="dd/MM/yyyy"
                        renderInput={(params) => (
                          <TextField
                            sx={{ width: 160, justifySelf: "right" }}
                            size="small"
                            {...params}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </div>
                </div>
                <div className="inventory-container">
                  <div className="grid-container-25">
                    <h3>ข้อมูล</h3>
                    <h3>สถานที่</h3>
                  </div>
                  <div className="grid-container-25">
                    <TextField
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      disabled
                      size="small"
                      type="text"
                      name="remark"
                      id="outlined-error-helper-text"
                      label="หมายเหตุ"
                      value={values.remark}
                    />
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-simple-select-label">
                        คลังปลายทาง
                      </InputLabel>
                      <Select
                        disabled
                        fullWidth
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        size="small"
                        name="warehouseID"
                        label="คลังปลายทาง"
                        defaultValue={1}
                        value={values.warehouseID}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                      >
                        {warehouseOption.map((val, index) => (
                          <MenuItem
                            key={`${val.name} + ${index}`}
                            value={val.id}
                          >
                            {val.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <div className="grid-container-50">
                  <h1>รายการ</h1>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{
                      justifySelf: "right",
                      width: "max-content",
                      height: "fit-content",
                    }}
                  >
                    พิมพ์ทั้งหมด
                  </Button>
                </div>
                <div className="inventory-container">
                  <>
                    <div className="table-container">
                      <table id="inventory" rules="none">
                        <thead>
                          {columnList.map((item, i) => {
                            return [<td>{item} </td>];
                          })}
                        </thead>
                        <tbody id="table-body">
                          {values.lineItem.map((item, i) => {
                            return [
                              <>
                                <tr key={i}>
                                  <td>
                                    {item.itemID} - {item.name}
                                  </td>
                                  <td>{item.quantityReference}</td>
                                  <td>
                                    <TextField
                                      size="small"
                                      type="number"
                                      name={`lineItem[${i}].quantity`}
                                      onChange={(e) => {
                                        handleChange(e);
                                      }}
                                      value={item.quantity}
                                      InputProps={{
                                        inputProps: { min: 1 },
                                      }}
                                    />
                                  </td>
                                  <td
                                    style={{ color: "rgba(255, 0, 0, 0.87)" }}
                                  >
                                    {item.quantity - item.quantityReference}
                                  </td>
                                  <td>{item.uomID}</td>
                                  <td>{item.warehouseID}</td>
                                  <td>{item.pallete}</td>
                                  <td>
                                    <Autocomplete
                                      size="small"
                                      value={item.remark}
                                      name={`lineItem[${i}].remark`}
                                      onChange={(event, newValue) => {
                                        if (newValue == null) return null;
                                        if (typeof newValue === "string") {
                                          setFieldValue(
                                            `lineItem[${i}].remark`,
                                            newValue.inputValue
                                          );
                                        } else if (
                                          newValue &&
                                          newValue.inputValue
                                        ) {
                                          setFieldValue(
                                            `lineItem[${i}].remark`,
                                            newValue.inputValue
                                          );
                                          // Create a new value from the user input
                                        } else {
                                          setFieldValue(
                                            `lineItem[${i}].remark`,
                                            newValue.value
                                          );
                                        }
                                      }}
                                      filterOptions={(options, params) => {
                                        const filtered = filter(
                                          options,
                                          params
                                        );

                                        const { inputValue } = params;
                                        // Suggest the creation of a new value
                                        const isExisting = options.some(
                                          (option) => inputValue === option.name
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
                                      options={remarkOption}
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
                                      sx={{ width: 160 }}
                                      freeSolo
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          label="หมายเหตุ"
                                        />
                                      )}
                                    />
                                  </td>
                                  <td>{item.serialBatchID}</td>
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
                {user.employee_position === "ผู้ดูแลระบบ" && (
                  <div className="button-layout">
                    <ButtonComponent
                      type="button"
                      text="ไม่อนุมัติ"
                      variant="outlined"
                      color="error"
                      onClick={async () => {
                        //call api update
                        await updateDeleteStage(values, setSubmitting);
                        //go next component
                        window.location.href = "/inventory/stock-count";
                        // setIsLoading(true);
                      }}
                    />
                    <ButtonComponent
                      type="button"
                      text="อนุมัติ"
                      variant="contained"
                      onClick={() => {
                        console.log("done");
                        //call api update
                        updateCloseStage(values, setSubmitting);
                        //go next component
                        setFieldValue("stage", values.stage + 1);
                        // setIsLoading(true);
                      }}
                    />
                  </div>
                )}
              </div>
            )}
            {values.stage === 2 && (
              <div>
                <div>
                  <ul className="progressbar__wrapper">
                    <ProgressIndicatorComponent
                      isActive={true}
                      title="สร้างเอกสาร"
                    />
                    <ProgressIndicatorComponent
                      isActive={true}
                      title="สแกนสินค้า"
                    />
                    <ProgressIndicatorComponent
                      isActive={true}
                      title="อนุมัติ"
                    />
                  </ul>
                </div>
                <div className="inventory-title-grid">
                  <h1>ปรับลดยอด</h1>
                  <div>
                    {values.status === "CLOSED" && (
                      <div className="inventoryMaster-active-cell">
                        <div>สำเร็จ</div>
                      </div>
                    )}
                    {values.status === "DRAFT" && (
                      <div className="inventoryMaster-notActive-cell">
                        <div>ร่าง</div>
                      </div>
                    )}
                    {values.status === "CANCELED" && (
                      <div className="inventoryMaster-cancel-cell">
                        <div>ยกเลิก</div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="inventory__under-header-layout">
                  <div className="grid-container-50">
                    <div className="grid-container-50">
                      <p>เลขที่เอกสาร</p>
                      <p>{values.id}</p>
                    </div>
                  </div>
                  <div className="inventory__under-header-datepicker-layout">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        disabled
                        label="วันที่ออกเอกสาร"
                        onChange={(e, value) => {
                          setFieldValue("createdAt", e);
                        }}
                        value={values.createdAt}
                        inputFormat="dd/MM/yyyy"
                        renderInput={(params) => (
                          <TextField
                            sx={{ width: 160, justifySelf: "right" }}
                            size="small"
                            {...params}
                          />
                        )}
                      />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        disabled
                        label="วันที่ปรับลดยอด"
                        onChange={(e, value) => {
                          setFieldValue("documentDate", e);
                        }}
                        value={values.documentDate}
                        inputFormat="dd/MM/yyyy"
                        renderInput={(params) => (
                          <TextField
                            sx={{ width: 160, justifySelf: "right" }}
                            size="small"
                            {...params}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </div>
                </div>
                <div className="inventory-container">
                  <div className="grid-container-25">
                    <h3>ข้อมูล</h3>
                    <h3>สถานที่</h3>
                  </div>
                  <div className="grid-container-25">
                    <TextField
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      disabled
                      size="small"
                      type="text"
                      name="remark"
                      id="outlined-error-helper-text"
                      label="หมายเหตุ"
                      value={values.remark}
                    />
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-simple-select-label">
                        คลังปลายทาง
                      </InputLabel>
                      <Select
                        disabled
                        fullWidth
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        size="small"
                        name="warehouseID"
                        label="คลังปลายทาง"
                        defaultValue={1}
                        value={values.warehouseID}
                        onChange={(e) => {
                          handleChange(e);
                        }}
                      >
                        {warehouseOption.map((val, index) => (
                          <MenuItem
                            key={`${val.name} + ${index}`}
                            value={val.id}
                          >
                            {val.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <div className="grid-container-50">
                  <h1>รายการ</h1>
                  <Button
                    variant="contained"
                    color="success"
                    sx={{
                      justifySelf: "right",
                      width: "max-content",
                      height: "fit-content",
                    }}
                  >
                    พิมพ์ทั้งหมด
                  </Button>
                </div>
                <div className="inventory-container">
                  <>
                    <div className="table-container">
                      <table id="inventory" rules="none">
                        <thead>
                          {columnList.map((item, i) => {
                            return [<td>{item} </td>];
                          })}
                        </thead>
                        <tbody id="table-body">
                          {values.lineItem &&
                            values.lineItem.map((item, i) => {
                              return [
                                <>
                                  <tr key={i}>
                                    <td>
                                      {item.itemID} - {item.name}
                                    </td>
                                    <td>{item.quantityReference}</td>
                                    <td>{item.quantity}</td>
                                    <td
                                      style={{ color: "rgba(255, 0, 0, 0.87)" }}
                                    >
                                      {item.quantity - item.quantityReference}
                                    </td>
                                    <td>{item.uomID}</td>
                                    <td>{item.warehouseID}</td>
                                    <td>{item.pallete}</td>
                                    <td>{item.remark}</td>
                                    <td>{item.serialBatchID}</td>
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
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}
