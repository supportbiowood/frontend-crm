import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  TextField,
  Stack,
  Breadcrumbs,
  TablePagination,
  Autocomplete,
  Button,
  Select,
  InputLabel,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ProgressIndicatorComponent from "../ProgressIndicatorComponent";

import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/actions/snackbarActions";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import CloseIcon from "@mui/icons-material/Close";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import ButtonComponent from "../ButtonComponent";
import BreadcrumbComponent from "../BreadcrumbComponent";
import {
  getGoodreceiptItem,
  getItemMasterById,
  getListBinLocation,
  getListWareHouse,
  updateGoodReceiptItem,
} from "../../adapter/Api/graphql";
import {
  getPurchaseOrder,
  printBarcode,
  getSalesReturn,
} from "../../adapter/Api";

const columnList = [
  "ลำดับ",
  "รหัสสินค้า - ชื่อสินค้า",
  "จำนวนตั้งต้น",
  "จำนวนจริง",
  "ส่วนต่าง",
  "ราคาต่อหน่วย",
  "หน่วย",
  "คลังปลายทาง",
  "สถานที่จัดเก็บ",
  "",
  "",
  "หมายเลข Serial",
];

const columnListFinal = [
  "ลำดับ",
  "รหัสสินค้า - ชื่อสินค้า",
  "จำนวนตั้งต้น",
  "จำนวนจริง",
  "ส่วนต่าง",
  "ราคาต่อหน่วย",
  "หน่วย",
  "คลังปลายทาง",
  "สถานที่จัดเก็บ",
  "",
  "หมายเลข Serial",
];

export default function GoodsReceiptItemComponent() {
  const [myValue, setMyValue] = useState({
    stage: 0,
    txSeries: "0",
    id: "",
    receiptType: "purchase",
    documentID: "",
    documentDate: "",
    warehouseID: "W01",
    lineItem: [],
    remark: "",
  });
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const { txSeries } = useParams();
  const [errorCheck, setErrorCheck] = useState(false);
  const [errorCheck2, setErrorCheck2] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
            label: item2.id,
            id: item2.id,
          });
        });
      });
    });
    return newData;
  };

  const [warehouseOption, setWarehouseOption] = useState([]);
  const [allRefList, setAllRefList] = useState([]);
  const [allSRList, setAllSRList] = useState([]);

  const fetchPOData = () => {
    getPurchaseOrder()
      .then((data) => {
        if (data.data.status === "success") {
          let myData = data.data.data;
          setAllRefList((prev) => [...prev, ...myData]);
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(showSnackbar("error", "ไม่สามารถเรียกข้อมูลได้"));
      });
    return null;
  };

  const fetchSRData = () => {
    getSalesReturn()
      .then((data) => {
        if (data.data.status === "success") {
          let myData = data.data.data;
          setAllSRList((prev) => [...prev, ...myData]);
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(showSnackbar("error", "ไม่สามารถเรียกข้อมูลได้"));
      });
    return null;
  };

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
    fetchPOData();
    fetchSRData();
    fetchWarehouseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderList = (values) => {
    if (values.receiptType === "PURCHASE")
      return allRefList.map((val) => {
        return (
          <MenuItem
            key={`${val.purchase_order_document_id}`}
            value={val.purchase_order_document_id}
          >
            {val.purchase_order_document_id}
          </MenuItem>
        );
      });
    return allSRList.map((val) => {
      return (
        <MenuItem
          key={`${val.sales_return_document_id}`}
          value={val.sales_return_document_id}
        >
          {val.sales_return_document_id}
        </MenuItem>
      );
    });
  };

  const loginSchema = Yup.object().shape({
    // email: Yup.string().required("กรุณาเลือก"),
    // project_deal_value: Yup.number()
    //   .required("กรุณาใส่ค่า")
    //   .typeError("กรุณาใส่เป็นตัวเลข"),
    // contact_business_category: Yup.string().required("กรุณาเลือก"),
  });

  const stageCheck = (data) => {
    if (data === "DRAFT") return 0;
    if (data === "CLOSED" || data === "CANCELED") return 2;
  };

  const sumOfQuantity = (data) => {
    const newData = data.reduce((sum, item) => {
      if (isNaN(item.quantity)) return sum;
      return parseInt(sum) + item.quantity;
    }, 0);
    return newData || 0;
  };

  const updateDraftStage = (values, setSubmitting, number) => {
    const prepare_update_data = {
      status: values.status,
      txSeries: values.txSeries,
      id: values.id,
      receiptType: values.receiptType,
      lineItem: values.lineItem.map((val, index) => {
        return {
          lineID: `${index}`,
          sortNo: index,
          quantityReference: val.quantityReference,
          quantity: sumOfQuantity(val.transaction),
          perUnitPrice: val.perUnitPrice,
          itemID: val.itemID.split("-")[0].replace(/\s+/g, ""),
          uomID: val.uomID,
          warehouseID: values.warehouseID,
          serialBatchList: val.transaction.map((data) => {
            const binLocation = `${data.pallete.slice(
              4,
              6
            )}|${data.pallete.slice(7, 10)}`;
            return {
              quantity: data.quantity,
              serialBatchID: `ITEM|${data.itemID
                .split("-")[0]
                .replace(/\s+/g, "")}|${values.id}:${data.itemID
                .split("-")[0]
                .replace(/\s+/g, "")}:${data.pallete}`,
              binLocationID: `${binLocation}`,
            };
          }),
        };
      }),
    };
    const isEmptyNumber = values.lineItem.some((data) =>
      data.transaction.some((data2) => isNaN(data2.quantity))
    );
    if (isEmptyNumber) return setErrorCheck2(true);
    setErrorCheck2(false);
    const isEmpty = values.lineItem.some((data) =>
      data.transaction.some((data2) => data2.pallete === "")
    );
    if (isEmpty) return setErrorCheck(true);
    setErrorCheck(false);
    if (number === 0) {
      setIsLoading(true);
      updateGoodReceiptItem({ input: prepare_update_data }).then((data) => {
        dispatch(showSnackbar("success", "บันทึกแบบร่างสำเร็จ"));
        setSubmitting(false);
        setIsLoading(false);
      });
    } else {
      updateGoodReceiptItem({ input: prepare_update_data }).then((data) => {
        setSubmitting(false);
      });
    }
  };

  const updateCloseStage = (values, setSubmitting) => {
    const prepare_success_data = {
      txSeries: values.txSeries,
      id: values.id,
      status: "CLOSED",
    };

    updateGoodReceiptItem({ input: prepare_success_data }).then((data) => {
      if (data.data.data !== null) {
        dispatch(showSnackbar("success", "ยืนยันสำเร็จ"));
        setSubmitting(false);
        setIsLoading(false);
        window.location.reload();
      } else {
        dispatch(showSnackbar("error", "ยืนยันไม่สำเร็จ"));
      }
    });
  };

  const updateDeleteStage = (values, setSubmitting) => {
    const prepare_delete_data = {
      txSeries: values.txSeries,
      id: values.id,
      status: "CANCELED",
    };

    updateGoodReceiptItem({ input: prepare_delete_data }).then((data) => {
      if (data.data.data !== null) {
        dispatch(showSnackbar("success", "ยกเลิกสำเร็จ"));
        setSubmitting(false);
        setIsLoading(false);
        window.location.reload();
      } else {
        dispatch(showSnackbar("error", "ยกเลิกไม่สำเร็จ"));
      }
    });
  };

  useEffect(() => {
    const getBy = {
      txSeries: `${txSeries}`,
      getGoodsReceiptDocumentId: `${id}`,
    };
    getGoodreceiptItem(getBy).then(async (data) => {
      if (data.data.data.getGoodsReceiptDocument === null) return null;
      const myData = data.data.data.getGoodsReceiptDocument;
      await setMyValue((prev) => ({
        ...prev,
        stage: stageCheck(myData.status),
        status: myData.status !== null ? myData.status : "DRAFT",
        receiptType: myData.receiptType,
        id: myData.id,
        documentID:
          myData.listDocumentReference !== null &&
          myData.listDocumentReference.length !== 0
            ? myData.listDocumentReference[0].documentID
            : [],
        documentDate: new Date(myData.documentDate),
        lineItem: myData.lineItem.map((row) => {
          return {
            itemID: row.itemID.split("-")[0].replace(/\s+/g, ""),
            sortNo: row.sortNo,
            quantityReference: row.quantityReference || "",
            quantity: row.quantity,
            perUnitPrice: row.perUnitPrice || 0,
            uomID: row.uomID || "",
            warehouseID: row.warehouseID,
            name: row.item.name || "",
            transaction: row.serialBatchList
              ? row.serialBatchList.map((data, i) => {
                  const newData = data.serialBatchID.split(":")[2];
                  return {
                    lineID: parseInt(row.lineID),
                    sortNo: row.sortNo,
                    quantity: data.quantity || 0,
                    itemID: row.itemID.split("-")[0].replace(/\s+/g, ""),
                    uomID: row.uomID,
                    warehouseID: "W01",
                    binLocationID: data.binLocationID || "AA|001",
                    pallete: newData,
                  };
                })
              : [],
          };
        }),
        remark: myData.remark || "",
      }));
      setIsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const printBarcodeLog = (values, lineItem) => {
    const id = values.itemID.split("-")[0].replace(/\s+/g, "");
    const ById = {
      getItemUuidId: id,
      uomId: "",
    };
    getItemMasterById(ById).then((data) => {
      const myData = data.data.data.getItemUUID;
      const newData = {
        documentID: lineItem.id,
        warehouseID: values.warehouseID,
        id: myData.id,
        pallette: values.pallete,
        internalID: myData.internalID,
        name: myData.name,
        uomGroup: myData.getSaleBaseUOMDimensions,
        qty: values.quantity,
        property: myData.itemPropertyList,
        serialBatchID: `ITEM|${myData.id}|${lineItem.id}:${myData.id}:${values.pallete}`,
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

  const printItemBarcodeLog = async (values, item) => {
    let newData = [];
    await item.transaction.map((data) => {
      const id = data.itemID.split("-")[0].replace(/\s+/g, "");
      const ById = {
        getItemUuidId: id,
        uomId: "",
      };
      getItemMasterById(ById).then((itemData) => {
        const myData = itemData.data.data.getItemUUID;
        const itemValue = {
          documentID: values.id,
          warehouseID: "W01",
          id: myData.id,
          pallette: data.pallete,
          internalID: myData.internalID,
          name: myData.name,
          uomGroup: myData.getSaleBaseUOMDimensions,
          qty: data.quantity,
          property: myData.itemPropertyList,
          serialBatchID: `ITEM|${id}|${values.id}:${id}:${data.pallete}`,
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

  const printAllBarcodeLog = async (values) => {
    let newData = [];
    await values.lineItem.map((data) =>
      data.transaction.map((data2) => {
        const id = data.itemID.split("-")[0].replace(/\s+/g, "");
        const ById = {
          getItemUuidId: id,
          uomId: "",
        };
        getItemMasterById(ById).then((itemData) => {
          const myData = itemData.data.data.getItemUUID;
          const itemValue = {
            documentID: values.id,
            warehouseID: "W01",
            id: myData.id,
            pallette: data2.pallete,
            internalID: myData.internalID,
            name: myData.name,
            uomGroup: myData.getSaleBaseUOMDimensions,
            qty: data2.quantity,
            property: myData.itemPropertyList,
            serialBatchID: `ITEM|${id}|${values.id}:${id}:${data2.pallete}`,
          };
          newData.push(itemValue);
        });
        return null;
      })
    );
    await printBarcode(newData)
      .then((data) => {
        dispatch(showSnackbar("success", "พิมพ์สำเร็จ"));
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "ไม่สามารถติดต่อกับเครื่องพิมพ์ได้"));
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
        onSubmit={(values, { setSubmitting, resetForm }) => {
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
                  name="นำเข้า"
                  key="2"
                  to="/inventory/good-recieve"
                />
                <BreadcrumbComponent name={values.id} key="3" to="#" />
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
                      title="นำเข้าสินค้า"
                    />
                    <ProgressIndicatorComponent
                      isActive={false}
                      title="ยืนยัน"
                    />
                  </ul>
                </div>
                <div className="inventory-title-grid">
                  <h1>รายการนำเข้า</h1>
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
                      <p>รหัสนำเข้า</p>
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
                        label="วันที่นำเข้า"
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
                    <h3>ประเภทการนำเข้า</h3>
                  </div>
                  <div className="radio-layout">
                    <FormControl disabled component="fieldset">
                      <RadioGroup
                        row
                        aria-label="gender"
                        name="receiptType"
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        disabled
                        value={values.receiptType}
                      >
                        <FormControlLabel
                          value="PURCHASE"
                          control={<Radio />}
                          label="ซื้อ"
                        />
                        <FormControlLabel
                          value="SALES_RETURN"
                          control={<Radio />}
                          label="รับคืน"
                        />
                        <FormControlLabel
                          value="OTHER"
                          control={<Radio />}
                          label="อื่นๆ"
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <div className="grid-container-25">
                    <h3>ข้อมูล</h3>
                    <h3>สถานที่</h3>
                  </div>
                  <div className="grid-container-25">
                    {values.receiptType !== "OTHER" ? (
                      <FormControl fullWidth size="small">
                        <InputLabel id="demo-simple-select-label">
                          เลขที่เอกสารอ้างอิง
                        </InputLabel>
                        <Select
                          disabled
                          fullWidth
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          size="small"
                          name="documentID"
                          label="เลขที่เอกสารอ้างอิง"
                          defaultValue={1}
                          value={values.documentID}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        >
                          {renderList(values)}
                        </Select>
                      </FormControl>
                    ) : (
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
                    )}
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
                  <h2>รายการ</h2>
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
                          {columnList.map((item, i) => {
                            return [<td>{item} </td>];
                          })}
                        </thead>
                        <tbody id="table-body">
                          {values.lineItem &&
                            values.lineItem.map((item, i) => {
                              return [
                                <>
                                  <tr
                                    key={i}
                                    style={{
                                      backgroundColor: "rgba(195, 220, 167, 1)",
                                    }}
                                  >
                                    <td>{i + 1}</td>
                                    <td>
                                      {item.itemID} - {item.name}
                                    </td>
                                    <td>{item.quantityReference}</td>
                                    <td>{sumOfQuantity(item.transaction)}</td>
                                    <td
                                      style={{ color: "rgba(255, 0, 0, 0.87)" }}
                                    >
                                      {sumOfQuantity(item.transaction) -
                                        item.quantityReference}
                                    </td>
                                    <td>{item.perUnitPrice}</td>
                                    <td>{item.uomID}</td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                      <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => {
                                          printItemBarcodeLog(values, item);
                                        }}
                                      >
                                        พิมพ์ Barcode
                                      </Button>
                                    </td>
                                    <td>
                                      <ControlPointIcon
                                        onClick={() => {
                                          const clone = [...values.lineItem];
                                          clone[i].transaction.push({
                                            lineID:
                                              clone[i].transaction.length + 1,
                                            sortNo: Math.random() + 1,
                                            quantity: 1,
                                            itemID: item.itemID,
                                            uomID: item.uomID,
                                            warehouseID: values.warehouseID,
                                            pallete: "",
                                          });
                                          setFieldValue("lineItem", clone);
                                        }}
                                        className="inventory-add-icon"
                                      />
                                    </td>
                                    <td></td>
                                  </tr>
                                  {item.transaction.map((subItem, subIndex) => {
                                    return (
                                      <tr>
                                        <td></td>
                                        <td>
                                          {subItem.itemID} - {item.name}
                                        </td>
                                        <td></td>
                                        <td>
                                          <TextField
                                            error={
                                              isNaN(subItem.quantity) &&
                                              errorCheck2
                                            }
                                            helperText={
                                              isNaN(subItem.quantity) &&
                                              errorCheck2 &&
                                              "กรุณากรอก"
                                            }
                                            size="small"
                                            type="number"
                                            inputProps={{ min: 1 }}
                                            name={`lineItem[${i}].transaction[${subIndex}].quantity`}
                                            onChange={(e) => {
                                              if (
                                                e.target.value > 0 ||
                                                isNaN(e.target.value)
                                              )
                                                setFieldValue(
                                                  `lineItem[${i}].transaction[${subIndex}].quantity`,
                                                  parseInt(e.target.value)
                                                );
                                            }}
                                            value={subItem.quantity}
                                          />
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td>{subItem.uomID}</td>
                                        <td>{item.warehouseID}</td>
                                        <td>
                                          <Autocomplete
                                            disablePortal
                                            id="combo-box-demo"
                                            options={PalleteOption(
                                              values.warehouseID
                                            )}
                                            value={subItem.pallete}
                                            sx={{ width: 175 }}
                                            size="small"
                                            onChange={(e) => {
                                              setFieldValue(
                                                `lineItem[${i}].transaction[${subIndex}].pallete`,
                                                e.target.textContent
                                              );
                                            }}
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                label="สถานที่จัดเก็บ"
                                                error={
                                                  subItem.pallete === "" &&
                                                  errorCheck
                                                }
                                                helperText={
                                                  subItem.pallete === "" &&
                                                  errorCheck &&
                                                  "กรุณากรอก"
                                                }
                                              />
                                            )}
                                          />
                                        </td>
                                        <td>
                                          {subItem.pallete !== "" && (
                                            <Button
                                              variant="outlined"
                                              color="success"
                                              onClick={() => {
                                                printBarcodeLog(
                                                  values.lineItem[i]
                                                    .transaction[subIndex],
                                                  values
                                                );
                                              }}
                                            >
                                              พิมพ์ Barcode
                                            </Button>
                                          )}
                                        </td>
                                        <td>
                                          <CloseIcon
                                            className="inventory-add-icon"
                                            onClick={() => {
                                              const clone = [
                                                ...values.lineItem,
                                              ];
                                              const newValue = clone[
                                                i
                                              ].transaction.filter(
                                                (value, index) => {
                                                  return (
                                                    `${index}` !== `${subIndex}`
                                                  );
                                                }
                                              );
                                              setFieldValue(
                                                `lineItem[${i}].transaction`,
                                                newValue
                                              );
                                            }}
                                          />
                                        </td>
                                        <td>
                                          {subItem.pallete !== "" &&
                                            `ITEM|${subItem.itemID
                                              .split("-")[0]
                                              .replace(/\s+/g, "")}|${
                                              values.id
                                            }:${subItem.itemID
                                              .split("-")[0]
                                              .replace(/\s+/g, "")}:${
                                              subItem.pallete
                                            }`}
                                        </td>
                                      </tr>
                                    );
                                  })}
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
                      updateDraftStage(values, setSubmitting, 1);
                      if (
                        values.lineItem.some((data) => {
                          return data.transaction.length === 0;
                        })
                      )
                        return dispatch(
                          showSnackbar("error", "กรุณาเพิ่มรายการ")
                        );
                      if (
                        values.lineItem.some((data) => {
                          return data.transaction.some((secData) => {
                            return secData.pallete === "";
                          });
                        })
                      )
                        return null;
                      const isEmptyNumber = values.lineItem.some((data) =>
                        data.transaction.some((data2) => isNaN(data2.quantity))
                      );
                      if (isEmptyNumber) return null;
                      const isEmpty = values.lineItem.some((data) =>
                        data.transaction.some((data2) => data2.pallete === "")
                      );
                      if (isEmpty) return null;
                      setFieldValue("stage", values.stage + 1);
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
                      title="นำเข้าสินค้า"
                    />
                    <ProgressIndicatorComponent
                      isActive={false}
                      title="ยืนยัน"
                    />
                  </ul>
                </div>
                <div className="inventory__under-header-layout">
                  <div className="grid-container-50">
                    <div className="grid-container-50">
                      <p>รหัสนำเข้า</p>
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
                        label="วันที่นำเข้า"
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
                    <h3>ประเภทการนำเข้า</h3>
                  </div>
                  <div className="radio-layout">
                    <FormControl disabled component="fieldset">
                      <RadioGroup
                        row
                        aria-label="gender"
                        name="receiptType"
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        disabled
                        value={values.receiptType}
                      >
                        <FormControlLabel
                          value="PURCHASE"
                          control={<Radio />}
                          label="ซื้อ"
                        />
                        <FormControlLabel
                          value="SALES_RETURN"
                          control={<Radio />}
                          label="รับคืน"
                        />
                        <FormControlLabel
                          value="OTHER"
                          control={<Radio />}
                          label="อื่นๆ"
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <div className="grid-container-25">
                    <h3>ข้อมูล</h3>
                    <h3>สถานที่</h3>
                  </div>
                  <div className="grid-container-25">
                    {values.receiptType !== "OTHER" ? (
                      <FormControl fullWidth size="small">
                        <InputLabel id="demo-simple-select-label">
                          เลขที่เอกสารอ้างอิง
                        </InputLabel>
                        <Select
                          disabled
                          fullWidth
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          size="small"
                          name="documentID"
                          label="เลขที่เอกสารอ้างอิง"
                          defaultValue={1}
                          value={values.documentID}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        >
                          {renderList(values)}
                        </Select>
                      </FormControl>
                    ) : (
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
                    )}
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
                  <h2>รายการ</h2>
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
                          {values.lineItem &&
                            values.lineItem.map((item, i) => {
                              return [
                                <>
                                  <tr
                                    key={i}
                                    style={{
                                      backgroundColor: "rgba(195, 220, 167, 1)",
                                    }}
                                  >
                                    <td>{i + 1}</td>
                                    <td>
                                      {item.itemID} - {item.name}
                                    </td>
                                    <td>{item.quantityReference}</td>
                                    <td>{sumOfQuantity(item.transaction)}</td>
                                    <td
                                      style={{ color: "rgba(255, 0, 0, 0.87)" }}
                                    >
                                      {sumOfQuantity(item.transaction) -
                                        item.quantityReference}
                                    </td>
                                    <td>{item.perUnitPrice}</td>
                                    <td>{item.uomID}</td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                      <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => {
                                          printItemBarcodeLog(values, item);
                                        }}
                                      >
                                        พิมพ์ Barcode
                                      </Button>
                                    </td>
                                    <td></td>
                                  </tr>
                                  {item.transaction.map((subItem, subIndex) => {
                                    return (
                                      <tr>
                                        <td></td>
                                        <td>
                                          {subItem.itemID} - {item.name}
                                        </td>
                                        <td></td>
                                        <td>{subItem.quantity}</td>
                                        <td></td>
                                        <td></td>
                                        <td>{subItem.uomID}</td>
                                        <td>{item.warehouseID}</td>
                                        <td>{subItem.pallete}</td>
                                        <td>
                                          <Button
                                            variant="outlined"
                                            color="success"
                                            onClick={() => {
                                              printBarcodeLog(
                                                values.lineItem[i].transaction[
                                                  subIndex
                                                ],
                                                values
                                              );
                                            }}
                                          >
                                            พิมพ์ Barcode
                                          </Button>
                                        </td>
                                        <td>{`ITEM|${subItem.itemID
                                          .split("-")[0]
                                          .replace(/\s+/g, "")}|${
                                          values.id
                                        }:${subItem.itemID
                                          .split("-")[0]
                                          .replace(/\s+/g, "")}:${
                                          subItem.pallete
                                        }`}</td>
                                      </tr>
                                    );
                                  })}
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
                      title="นำเข้าสินค้า"
                    />
                    <ProgressIndicatorComponent
                      isActive={true}
                      title={values.status === "CLOSED" ? "ยืนยัน" : "ยกเลิก"}
                    />
                  </ul>
                </div>
                <div className="inventory-title-grid">
                  <h1>รายการนำเข้า</h1>
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
                      <p>รหัสนำเข้า</p>
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
                        label="วันที่นำเข้า"
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
                    <h3>ประเภทการนำเข้า</h3>
                  </div>
                  <div className="radio-layout">
                    <FormControl disabled component="fieldset">
                      <RadioGroup
                        row
                        aria-label="gender"
                        name="receiptType"
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        disabled
                        value={values.receiptType}
                      >
                        <FormControlLabel
                          value="PURCHASE"
                          control={<Radio />}
                          label="ซื้อ"
                        />
                        <FormControlLabel
                          value="SALES_RETURN"
                          control={<Radio />}
                          label="รับคืน"
                        />
                        <FormControlLabel
                          value="OTHER"
                          control={<Radio />}
                          label="อื่นๆ"
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <div className="grid-container-25">
                    <h3>ข้อมูล</h3>
                    <h3>สถานที่</h3>
                  </div>
                  <div className="grid-container-25">
                    {values.receiptType !== "OTHER" ? (
                      <FormControl fullWidth size="small">
                        <InputLabel id="demo-simple-select-label">
                          เลขที่เอกสารอ้างอิง
                        </InputLabel>
                        <Select
                          disabled
                          fullWidth
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          size="small"
                          name="documentID"
                          label="เลขที่เอกสารอ้างอิง"
                          defaultValue={1}
                          value={values.documentID}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        >
                          {renderList(values)}
                        </Select>
                      </FormControl>
                    ) : (
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
                    )}
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
                  <h2>รายการ</h2>
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
                          {values.lineItem &&
                            values.lineItem.map((item, i) => {
                              return [
                                <>
                                  <tr
                                    key={i}
                                    style={{
                                      backgroundColor: "rgba(195, 220, 167, 1)",
                                    }}
                                  >
                                    <td>{i + 1}</td>
                                    <td>
                                      {item.itemID} - {item.name}
                                    </td>
                                    <td>{item.quantityReference}</td>
                                    <td>{sumOfQuantity(item.transaction)}</td>
                                    <td
                                      style={{ color: "rgba(255, 0, 0, 0.87)" }}
                                    >
                                      {sumOfQuantity(item.transaction) -
                                        item.quantityReference}
                                    </td>
                                    <td>{item.perUnitPrice}</td>
                                    <td>{item.uomID}</td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                      <Button
                                        variant="contained"
                                        color="success"
                                        onClick={() => {
                                          printItemBarcodeLog(values, item);
                                        }}
                                      >
                                        พิมพ์ Barcode
                                      </Button>
                                    </td>
                                    <td></td>
                                  </tr>
                                  {item.transaction.map((subItem, subIndex) => {
                                    return (
                                      <tr>
                                        <td></td>
                                        <td>
                                          {subItem.itemID} - {item.name}
                                        </td>
                                        <td></td>
                                        <td>{subItem.quantity}</td>
                                        <td></td>
                                        <td></td>
                                        <td>{subItem.uomID}</td>
                                        <td>{item.warehouseID}</td>
                                        <td>{subItem.pallete}</td>
                                        <td>
                                          <Button
                                            variant="outlined"
                                            color="success"
                                            onClick={() => {
                                              printBarcodeLog(
                                                values.lineItem[i].transaction[
                                                  subIndex
                                                ],
                                                values
                                              );
                                            }}
                                          >
                                            พิมพ์ Barcode
                                          </Button>
                                        </td>
                                        <td>{`ITEM|${subItem.itemID
                                          .split("-")[0]
                                          .replace(/\s+/g, "")}|${
                                          values.id
                                        }:${subItem.itemID
                                          .split("-")[0]
                                          .replace(/\s+/g, "")}:${
                                          subItem.pallete
                                        }`}</td>
                                      </tr>
                                    );
                                  })}
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
