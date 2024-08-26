import React, { useState, useEffect } from "react";
import {
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Breadcrumbs,
  Autocomplete,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ProgressIndicatorComponent from "../../ProgressIndicatorComponent";
import CloseIcon from "@mui/icons-material/Close";

import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../redux/actions/snackbarActions";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ButtonComponent from "../../ButtonComponent";

// import { DataGridPro } from "@mui/x-data-grid-pro";
import BreadcrumbComponent from "../../BreadcrumbComponent";
import {
  scanSerialBatch,
  getItemMasterById,
  queryItemInventory,
  updateGoodsTransferItem,
  getListBinLocation,
  getListWareHouse,
  getGoodsTransferById,
} from "../../../adapter/Api/graphql";
import TablePagination from "@mui/material/TablePagination";
import { printBarcode } from "../../../adapter/Api";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

// const columns = [
//   { field: "sortNo", headerName: "ลำดับ", width: 200 },
//   { field: "itemID", headerName: "รหัสสินค้า", width: 200 },
//   { field: "quantityReference", headerName: "จำนวนจากเอกสาร", width: 200 },
//   { field: "uomID", headerName: "หน่วย ", width: 200 },
// ];

const columnList = [
  "รหัสสินค้า - ชื่อสินค้า",
  "จำนวนสินค้าคงคลัง",
  "จำนวนที่ย้าย",
  "หน่วย",
  "จากคลัง",
  "จากที่จัดเก็บ",
  "ไปคลัง",
  "ไปที่จัดเก็บ",
  "",
  "",
];

const columnListFinal = [
  "รหัสสินค้า - ชื่อสินค้า",
  "จำนวนสินค้าคงคลัง",
  "จำนวนที่ย้าย",
  "หน่วย",
  "จากคลัง",
  "จากที่จัดเก็บ",
  "ไปคลัง",
  "ไปที่จัดเก็บ",
  "",
];

export default function GoodsTransferItemComponent() {
  const [myValue, setMyValue] = useState({
    stage: 0,
    txSeries: "0",
    id: "",
    remark: "",
    documentID: "PO0001",
    documentDate: new Date(),
    createdAt: new Date(),
    lineItem: [],
    fromWarehouseID: "",
    toWarehouseID: "",
  });
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  // const [pageSize, setPageSize] = useState(10);
  // const [rows] = useState([]);
  const [errorQuantity, setErrorQuantity] = useState(false);
  const [errorbinLocation, setErrorbinLocation] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { id } = useParams();
  const { txSeries } = useParams();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const stageCheck = (data) => {
    if (data === "DRAFT") return 0;
    if (data === "CLOSED" || data === "CANCELED") return 2;
  };

  const loginSchema = Yup.object().shape({
    receiptType: Yup.string().required("กรุณากรอก"),
    remark: Yup.string().required("กรุณากรอก"),
  });

  useEffect(() => {
    const input = {
      getGoodsTransferDocumentId: id,
      txSeries: txSeries,
    };
    getGoodsTransferById(input).then((data) => {
      if (!data.data.data)
        return dispatch(showSnackbar("error", "เกิดเหตุผิดพลาด"));
      let myData = {
        ...data.data.data.getGoodsTransferDocument,
        stage: stageCheck(data.data.data.getGoodsTransferDocument.status),
      };
      console.log("myData", myData);
      setMyValue(myData);
      setIsLoading(false);
      // setItemList(usageData);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    const itemInventoryInput = {};
    queryItemInventory(itemInventoryInput).then((data) => {
      const myData = data.data.data.listItem.items.filter(
        (data) => data.isActive !== false
      );
      const myDataIsStock = myData.filter((data) => data.isInventory !== false);
      const usageData = myDataIsStock.map((item, index) => {
        return {
          id: item.id,
          name: item.name,
          inventoryUOMID: item.inventoryUOMID,
          listItemCurrent: item.listItemCurrent,
          purchaseUnitPrice: item.purchaseUnitPrice,
          description: item.description,
          itemType: item.itemType,
          saleUnitPrice: item.saleUnitPrice,
          saleUOMID: item.saleUOMID,
        };
      });
      setItemList(usageData);
      setIsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //<============ fetch warehouse and pallete ============>

  const [warehouseOption, setWarehouseOption] = useState([]);

  useEffect(() => {
    getListWareHouse().then((data) => {
      let myData = data.data.data.listWarehouse.items;
      myData.forEach((item) => {
        return {
          id: item.id,
          internalID: item.internalID,
          listBinLocation: item.listBinLocation,
        };
      });
      setWarehouseOption(myData);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const PalleteOption = (warehouse) => {
    let newData = [];
    const getListBinLocationInput = {
      warehouseId: warehouse,
      parentIdList: [],
    };
    getListBinLocation(getListBinLocationInput).then((data) => {
      data.data.data.listBinLocation.items.map((item1) => {
        return item1.listBinLocation.items.map((item2) => {
          return newData.push({
            parentID: item1.internalID,
            label: item2.name,
            id: item2.id,
          });
        });
      });
    });
    return newData;
  };

  const updateDraftStage = (values, setSubmitting, number, setFieldValue) => {
    const prepare_update_data = {
      txSeries: values.txSeries,
      id: values.id,
      fromWarehouseID: values.fromWarehouseID,
      toWarehouseID: values.toWarehouseID,
      lineItem: values.lineItem.map((val, index) => {
        return {
          lineID: `${index}`,
          sortNo: index,
          quantityReference: val.quantityReference,
          quantity: val.quantity,
          itemID: val.itemID.split("-")[0].replace(/\s+/g, ""),
          uomID: val.uomID,
          binLocationID: val.binLocationID,
        };
      }),
    };
    if (values.lineItem.length === 0)
      return dispatch(showSnackbar("error", "กรุณาสแกนสินค้า"));
    const isEmpty = values.lineItem.some((data) => data.binLocationID === "");
    if (isEmpty) return setErrorbinLocation(true);
    const isEmptyNumber = values.lineItem.some((data) => data.quantity === "");
    if (isEmptyNumber) return setErrorQuantity(true);
    setErrorbinLocation(false);
    setErrorQuantity(false);
    if (number === 0) {
      setIsLoading(true);
      updateGoodsTransferItem({ input: prepare_update_data }).then((data) => {
        if (data.data.data)
          dispatch(showSnackbar("success", "บันทึกแบบร่างสำเร็จ"));
        setSubmitting(false);
        setIsLoading(false);
      });
    } else {
      updateGoodsTransferItem({ input: prepare_update_data }).then((data) => {
        setSubmitting(false);
        setFieldValue("stage", values.stage + 1);
      });
    }
  };

  const updateDeleteStage = (values, setSubmitting) => {
    const prepare_delete_data = {
      txSeries: values.txSeries,
      id: values.id,
      fromWarehouseID: values.fromWarehouseID,
      toWarehouseID: values.toWarehouseID,
      status: "CANCELED",
      lineItem: values.lineItem.map((val, index) => {
        return {
          lineID: `${index}`,
          sortNo: index,
          quantityReference: val.quantityReference,
          quantity: val.quantity,
          itemID: val.itemID.split("-")[0].replace(/\s+/g, ""),
          uomID: val.uomID,
          binLocationID: val.binLocationID,
        };
      }),
    };
    updateGoodsTransferItem({ input: prepare_delete_data }).then((data) => {
      if (data.data.data) dispatch(showSnackbar("success", "ยกเลิกสำเร็จ"));
      setSubmitting(false);
      setIsLoading(false);
    });
  };

  const updateCloseStage = (values, setSubmitting) => {
    setIsLoading(true);
    const prepare_success_data = {
      txSeries: values.txSeries,
      id: values.id,
      status: "CLOSED",
      fromWarehouseID: values.fromWarehouseID,
      toWarehouseID: values.toWarehouseID,
      lineItem: values.lineItem.map((val, index) => {
        return {
          lineID: `${index}`,
          sortNo: index,
          quantityReference: val.quantityReference,
          quantity: val.quantity,
          itemID: val.itemID.split("-")[0].replace(/\s+/g, ""),
          uomID: val.uomID,
          binLocationID: val.binLocationID,
        };
      }),
    };
    updateGoodsTransferItem({ input: prepare_success_data }).then((data) => {
      if (!data.data.data) return null;
      dispatch(showSnackbar("success", "ยืนยันสำเร็จ"));
      setSubmitting(false);
      setIsLoading(false);
      // window.location.href =
      //   "/inventory/good-transfer/" + values.txSeries + "&" + values.id;
    });
  };

  const printBarcodeLog = (item, values) => {
    const id = item.itemID.split("-")[0].replace(/\s+/g, "");
    const ById = {
      getItemUuidId: id,
      uomId: "",
    };
    getItemMasterById(ById).then((data) => {
      const myData = data.data.data.getItemUUID;
      const newData = {
        documentID: values.id,
        fromWarehouseID: values.fromWarehouseID,
        toWarehouseID: values.toWarehouseID,
        id: myData.id,
        pallette: item.id,
        internalID: myData.internalID,
        name: myData.name,
        uomGroup: myData.getSaleBaseUOMDimensions,
        qty: values.quantity,
        property: myData.itemPropertyList,
      };
      printBarcode(newData)
        .then((data) => {
          dispatch(showSnackbar("success", "พิมพ์สำเร็จ"));
        })
        .catch((err) => {
          dispatch(showSnackbar("error", "ไม่สามารถติดต่อกับเครื่องพิมพ์ได้"));
        });
    });
  };

  const printAllBarcodeLog = async (values) => {
    const newData = [];
    await values.lineItem.map((data) => {
      const id = data.itemID.split("-")[0].replace(/\s+/g, "");
      const ById = {
        getItemUuidId: id,
        uomId: "",
      };
      getItemMasterById(ById).then((itemData) => {
        const myData = itemData.data.data.getItemUUID;
        const itemValue = {
          documentID: values.id,
          fromWarehouseID: values.fromWarehouseID,
          toWarehouseID: values.toWarehouseID,
          id: myData.id,
          internalID: myData.internalID,
          name: myData.name,
          uomGroup: myData.getSaleBaseUOMDimensions,
          qty: data.quantity,
          property: myData.itemPropertyList,
        };
        newData.push(itemValue);
      });
      return null;
    });
    await printBarcode(newData)
      .then((data) => {
        dispatch(showSnackbar("success", "พิมพ์สำเร็จ"));
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "ไม่สามารถติดต่อกับเครื่องพิมพ์ได้"));
      });
  };

  const scanSerial = (input, values, setFieldValue) => {
    setIsLoading(true);
    const inputItemID = input.split("|")[1];

    const newData = itemList.find((item) => {
      return item.id === inputItemID;
    });

    const inputSerial = {
      txSeries: values.txSeries,
      documentId: input.split("|")[2].split(":")[0],
      serialBatchId: input,
    };

    scanSerialBatch(inputSerial).then((data) => {
      setIsLoading(false);
      const clone = [...values.lineItem];
      const itemPallete = input.split(":")[2];

      if (
        clone.some((data) => {
          return data.itemID === inputItemID && data.pallete === itemPallete;
        })
      )
        return dispatch(showSnackbar("error", "หมายเลข Serial นี้มีอยู่แล้ว"));

      if (data.data.data === null)
        return dispatch(showSnackbar("error", "ไม่พบหมายเลข serial"));

      clone.push({
        lineID: clone.length,
        sortNo: Math.random(),
        quantityReference: newData.listItemCurrent.items[0].onHandQty,
        quantity: 0,
        itemID: newData.id,
        item: {
          name: newData.name,
        },
        uomID: newData.inventoryUOMID,
        fromWarehouseID: values.fromWarehouseID,
        toWarehouseID: values.toWarehouseID,
        pallete: itemPallete,
        binLocationID: "",
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
        onSubmit={(values, { setSubmitting, resetForm }, setFieldValue) => {
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
              <Breadcrumbs separator=">" aria-label="breadcrumb">
                <BreadcrumbComponent
                  name="คลังสินค้า"
                  key="1"
                  to="/inventory/"
                />
                <BreadcrumbComponent
                  name="เคลื่อนย้าย"
                  key="2"
                  to="/inventory/good-transfer"
                />
                <BreadcrumbComponent name="รายการเคลื่อนย้าย" key="3" to="#" />
              </Breadcrumbs>
            </Stack>
            {values.stage === 0 && (
              <div>
                <div>
                  <ul className="progressbar__wrapper inventory-progress-bar">
                    <ProgressIndicatorComponent
                      isActive={true}
                      title="สร้างเอกสาร"
                    />
                    <ProgressIndicatorComponent
                      isActive={false}
                      title="สแกนเอกสาร"
                    />
                    <ProgressIndicatorComponent
                      isActive={false}
                      title="ยืนยัน"
                    />
                  </ul>
                </div>
                <div className="inventory-title-grid">
                  <h1>รายการเคลื่อนย้าย</h1>
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
                      <p>เลขที่เคลื่อนย้าย</p>
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
                        label="เคลื่อนย้ายวันที่"
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
                      disabled
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      size="small"
                      type="text"
                      name="remark"
                      id="outlined-error-helper-text"
                      label="หมายเหตุ"
                      value={values.remark}
                    />
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-simple-select-label">จาก</InputLabel>
                      <Select
                        fullWidth
                        disabled
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        size="small"
                        name="fromWarehouseID"
                        label="จาก"
                        defaultValue={1}
                        value={values.fromWarehouseID}
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
                  <div className="grid-container-25">
                    <div></div>
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-simple-select-label">ไป</InputLabel>
                      <Select
                        fullWidth
                        disabled
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        size="small"
                        name="toWarehouseID"
                        label="ไป"
                        defaultValue={1}
                        value={values.toWarehouseID}
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
                    onClick={() => {
                      if (window.confirm("คุณต้องการพิมพ์ใช่หรือไม่"))
                        printAllBarcodeLog(values);
                    }}
                  >
                    พิมพ์ทั้งหมด
                  </Button>
                </div>
                <TextField
                  sx={{ marginBottom: "24px" }}
                  label="สแกนหมายเลข Serial"
                  size="small"
                  onChange={(e) => {
                    if (e.target.value.length >= 29) {
                      scanSerial(e.target.value, values, setFieldValue);
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
                          {values.lineItem.map((item, i) => {
                            return [
                              <>
                                <tr key={i}>
                                  <td>
                                    {item.itemID} - {item.item.name}
                                  </td>
                                  <td>{item.quantityReference}</td>
                                  <td>
                                    <TextField
                                      type="number"
                                      inputProps={{ min: 0 }}
                                      size="small"
                                      name={`lineItem[${i}].quantity`}
                                      value={item.quantity}
                                      onChange={(e) => {
                                        console.log(item.quantity);
                                        handleChange(e);
                                      }}
                                      error={
                                        item.quantity === "" && errorQuantity
                                      }
                                      helperText={
                                        item.quantity === "" &&
                                        errorQuantity &&
                                        "กรุณาใส่จำนวน"
                                      }
                                    />
                                  </td>
                                  <td>{item.uomID}</td>
                                  <td>{values.fromWarehouseID}</td>
                                  <td>{item.pallete}</td>
                                  <td>
                                    {warehouseOption.length !== 0 &&
                                      warehouseOption.find(
                                        (warehouse) =>
                                          warehouse.id === values.toWarehouseID
                                      ).name}
                                  </td>
                                  <td>
                                    <Autocomplete
                                      disablePortal
                                      id="combo-box-demo"
                                      options={PalleteOption(
                                        values.toWarehouseID
                                      )}
                                      name={`lineItem[${i}].binLocationID`}
                                      value={item.binLocationID}
                                      sx={{ width: 175 }}
                                      size="small"
                                      onChange={(e, value) => {
                                        setFieldValue(
                                          `lineItem[${i}].binLocationID`,
                                          value.id
                                        );
                                      }}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          label="ไปที่จัดเก็บ"
                                          error={
                                            item.binLocationID === "" &&
                                            errorbinLocation
                                          }
                                          helperText={
                                            item.binLocationID === "" &&
                                            errorbinLocation &&
                                            "กรุณากรอกข้อมูล"
                                          }
                                        />
                                      )}
                                    />
                                  </td>
                                  <td>
                                    <Button
                                      variant="contained"
                                      color="success"
                                      onClick={() => {
                                        printBarcodeLog(item, values);
                                      }}
                                    >
                                      พิมพ์ Barcode
                                    </Button>
                                  </td>
                                  <td>
                                    <CloseIcon
                                      onClick={() => {
                                        const clone = [...values.lineItem];
                                        const newValue = clone.filter(
                                          (_, index) => {
                                            return i !== index;
                                          }
                                        );
                                        setFieldValue("lineItem", newValue);
                                      }}
                                      className="inventory-add-icon"
                                    />
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
                <div className="button-layout">
                  <ButtonComponent
                    type="button"
                    text="ย้อนกลับ"
                    variant="contained"
                    onClick={() => {
                      setFieldValue("stage", values.stage - 1);
                    }}
                  />
                  <Button
                    onClick={() => {
                      updateDeleteStage(values, setSubmitting);
                    }}
                    type="button"
                    variant="outlined"
                    color="error"
                  >
                    ยกเลิก
                  </Button>
                  <ButtonComponent
                    isSubmitting={isSubmitting}
                    type="button"
                    text="บันทึกแบบร่าง"
                    variant="outlined"
                    onClick={() => {
                      updateDraftStage(values, setSubmitting, 0);
                    }}
                  />
                  <ButtonComponent
                    type="button"
                    text="ดำเนินการต่อ"
                    variant="contained"
                    onClick={() => {
                      updateDraftStage(values, setSubmitting, 1, setFieldValue);
                    }}
                  />
                </div>
              </div>
            )}
            {values.stage === 1 && (
              <div>
                <div>
                  <ul className="progressbar__wrapper inventory-progress-bar">
                    <ProgressIndicatorComponent
                      isActive={true}
                      title="สร้างเอกสาร"
                    />
                    <ProgressIndicatorComponent
                      isActive={true}
                      title="สแกนเอกสาร"
                    />
                    <ProgressIndicatorComponent
                      isActive={false}
                      title="ยืนยัน"
                    />
                  </ul>
                </div>
                <div className="inventory-title-grid">
                  <h1>รายการเคลื่อนย้าย</h1>
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
                      <p>เลขที่เคลื่อนย้าย</p>
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
                        label="เคลื่อนย้ายวันที่"
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
                      size="small"
                      type="text"
                      name="remark"
                      disabled
                      id="outlined-error-helper-text"
                      label="หมายเหตุ"
                      value={values.remark}
                    />
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-simple-select-label">จาก</InputLabel>
                      <Select
                        fullWidth
                        disabled
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        size="small"
                        name="fromWarehouseID"
                        label="จาก"
                        defaultValue={1}
                        value={values.fromWarehouseID}
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
                  <div className="grid-container-25">
                    <div></div>
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-simple-select-label">ไป</InputLabel>
                      <Select
                        fullWidth
                        disabled
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        size="small"
                        name="toWarehouseID"
                        label="ไป"
                        defaultValue={1}
                        value={values.toWarehouseID}
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
                    onClick={() => {
                      if (window.confirm("คุณต้องการพิมพ์ใช่หรือไม่"))
                        printAllBarcodeLog(values);
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
                          {columnListFinal.map((item, i) => {
                            return [<td>{item} </td>];
                          })}
                        </thead>
                        <tbody id="table-body">
                          {values.lineItem.map((item, i) => {
                            return [
                              <>
                                <tr key={i}>
                                  <td>
                                    {item.itemID} - {item.item.name}
                                  </td>
                                  <td>{item.quantityReference}</td>
                                  <td>{item.quantity}</td>
                                  <td>{item.uomID}</td>
                                  <td>
                                    {warehouseOption.length !== 0 &&
                                      warehouseOption.find(
                                        (warehouse) =>
                                          warehouse.id ===
                                          values.fromWarehouseID
                                      ).name}
                                  </td>
                                  <td>{item.pallete}</td>
                                  <td>
                                    {warehouseOption.length !== 0 &&
                                      warehouseOption.find(
                                        (warehouse) =>
                                          warehouse.id === values.toWarehouseID
                                      ).name}
                                  </td>
                                  <td>{item.binLocationID}</td>
                                  <td>
                                    <Button
                                      variant="contained"
                                      color="success"
                                      onClick={() => {
                                        printBarcodeLog(item, values);
                                      }}
                                    >
                                      พิมพ์ Barcode
                                    </Button>
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
                <div className="button-layout">
                  <ButtonComponent
                    type="button"
                    text="ย้อนกลับ"
                    variant="contained"
                    onClick={() => {
                      setFieldValue("stage", values.stage - 1);
                    }}
                  />
                  <ButtonComponent
                    disabled={isSubmitting}
                    type="button"
                    text="ยืนยัน"
                    variant="contained"
                    onClick={() => {
                      updateCloseStage(values, setSubmitting);
                    }}
                  />
                </div>
              </div>
            )}
            {values.stage === 2 && (
              <div>
                <div>
                  <ul className="progressbar__wrapper inventory-progress-bar">
                    <ProgressIndicatorComponent
                      isActive={true}
                      title="สร้างเอกสาร"
                    />
                    <ProgressIndicatorComponent
                      isActive={true}
                      title="สแกนเอกสาร"
                    />
                    <ProgressIndicatorComponent
                      isActive={false}
                      title="ยืนยัน"
                    />
                  </ul>
                </div>
                <div className="inventory-title-grid">
                  <h1>รายการเคลื่อนย้าย</h1>
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
                      <p>เลขที่เคลื่อนย้าย</p>
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
                        label="เคลื่อนย้ายวันที่"
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
                      size="small"
                      type="text"
                      name="remark"
                      disabled
                      id="outlined-error-helper-text"
                      label="หมายเหตุ"
                      value={values.remark}
                    />
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-simple-select-label">จาก</InputLabel>
                      <Select
                        fullWidth
                        disabled
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        size="small"
                        name="fromWarehouseID"
                        label="จาก"
                        defaultValue={1}
                        value={values.fromWarehouseID}
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
                  <div className="grid-container-25">
                    <div></div>
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-simple-select-label">ไป</InputLabel>
                      <Select
                        fullWidth
                        disabled
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        size="small"
                        name="toWarehouseID"
                        label="ไป"
                        defaultValue={1}
                        value={values.toWarehouseID}
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
                    onClick={() => {
                      if (window.confirm("คุณต้องการพิมพ์ใช่หรือไม่"))
                        printAllBarcodeLog(values);
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
                          {columnListFinal.map((item, i) => {
                            return [<td>{item} </td>];
                          })}
                        </thead>
                        <tbody id="table-body">
                          {values.lineItem.map((item, i) => {
                            return [
                              <>
                                <tr key={i}>
                                  <td>
                                    {item.itemID} - {item.item.name}
                                  </td>
                                  <td>{item.quantityReference}</td>
                                  <td>{item.quantity}</td>
                                  <td>{item.uomID}</td>
                                  <td>
                                    {warehouseOption.length !== 0 &&
                                      warehouseOption.find(
                                        (warehouse) =>
                                          warehouse.id ===
                                          values.fromWarehouseID
                                      ).name}
                                  </td>
                                  <td>{item.pallete}</td>
                                  <td>
                                    {warehouseOption.length !== 0 &&
                                      warehouseOption.find(
                                        (warehouse) =>
                                          warehouse.id === values.toWarehouseID
                                      ).name}
                                  </td>
                                  <td>{item.binLocationID}</td>
                                  <td>
                                    <Button
                                      variant="contained"
                                      color="success"
                                      onClick={() => {
                                        printBarcodeLog(item, values);
                                      }}
                                    >
                                      พิมพ์ Barcode
                                    </Button>
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
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}
