import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Stack,
  Breadcrumbs,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ProgressIndicatorComponent from "../ProgressIndicatorComponent";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/actions/snackbarActions";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ButtonComponent from "../ButtonComponent";
import TablePagination from "@mui/material/TablePagination";
import BreadcrumbComponent from "../BreadcrumbComponent";
import {
  updateGoodIssueItem,
  getGoodIssueById,
  scanSerialBatch,
  getItemMasterById,
} from "../../adapter/Api/graphql";
import {
  getPurchaseReturn,
  getSalesOrder,
  printBarcode,
} from "../../adapter/Api";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

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
  "หมายเลข Serial",
];

export default function GoodsIssueItemComponent() {
  const [myValue, setMyValue] = useState({
    id: "",
    stage: 0,
    txSeries: "0",
    getDocumentCounter: "-",
    issueType: "purchase",
    documentID: "-",
    documentDate: new Date(),
    lineItem: [],
  });
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [errorCheck, setErrorCheck] = useState(false);
  // const [rows, setRows] = useState([]);
  const { id } = useParams();
  const { txSeries } = useParams();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sumOfQuantity = (data) => {
    const newData = data.reduce(
      (sum, item) => {
        return parseInt(sum) + item.quantity;
      },
      [0]
    );
    return newData || 0;
  };

  const scanSerial = (input, lineItem, values, setFieldValue) => {
    setIsLoading(true);
    const newData = lineItem.findIndex((item) => {
      return (
        input.split("|")[1] === item.itemID.split("-")[0].replace(/\s+/g, "")
      );
    });

    if (newData === -1) return dispatch(showSnackbar("error", "ไม่พบรายการ"));

    const inputSerial = {
      txSeries: values.txSeries,
      documentId: values.id.toString(),
      serialBatchId: input,
    };

    scanSerialBatch(inputSerial)
      .then((data) => {
        setIsLoading(false);
        const clone = [...values.lineItem];

        if (
          clone.some((data) => {
            return data.transaction.some((data2) => {
              return data2.serialBatchID === input;
            });
          })
        )
          return dispatch(showSnackbar("error", "หมายเลข serial มีอยู่แล้ว"));

        if (data.data.data === null)
          return dispatch(showSnackbar("error", "ไม่พบหมายเลข serial"));

        clone[newData].transaction.push({
          lineID: "0",
          sortNo: 0,
          quantityReference: 200,
          quantity: 0,
          perUnitPrice: 105.4,
          itemID: lineItem[newData].itemID,
          uomID: lineItem[newData].uomID,
          warehouseID: "W01",
          binLocationID: "AA|001",
          pallete: "",
          serialBatchList: [
            {
              serialBatchID: input,
              quantity: 0,
            },
          ],
        });
        setFieldValue("lineItem", clone);
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

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
        warehouseID: "W01",
        id: myData.id,
        internalID: myData.internalID,
        name: myData.name,
        uomGroup: myData.getSaleBaseUOMDimensions,
        qty: values.quantity,
        property: myData.itemPropertyList,
      };
      console.log("wิมพ์ barcode: ", newData);
      printBarcode(data)
        .then((data) => {
          // dispatch(showSnackbar("success", "ยืนยันสำเร็จ"));
        })
        .catch((err) => {
          // dispatch(showSnackbar("error", `${err}` || "เกิดเหตุผิดพลาด"));
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
          internalID: myData.internalID,
          name: myData.name,
          uomGroup: myData.getSaleBaseUOMDimensions,
          qty: data.quantity,
          property: myData.itemPropertyList,
          serialBatchID: data.serialBatchID,
        };
        newData.push(itemValue);
      });
      return null;
    });
    console.log("พิมพ์ barcode item: ", newData);
    await printBarcode(newData)
      .then((data) => {
        dispatch(showSnackbar("success", "พิมพ์สำเร็จ"));
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "ไม่สามารถติดต่อกับเครื่องพิมพ์ได้"));
      });
  };

  const printAllBarcodeLog = async (values) => {
    const newData = [];
    values.lineItem.map((data) =>
      data.transaction.map((data2) => {
        const ById = {
          getItemUuidId: data2.itemID,
          uomId: "",
        };
        getItemMasterById(ById).then((itemData) => {
          const myData = itemData.data.data.getItemUUID;
          const itemValue = {
            documentID: values.id,
            warehouseID: "W01",
            id: myData.id,
            internalID: myData.internalID,
            name: myData.name,
            uomGroup: myData.getSaleBaseUOMDimensions,
            qty: data2.quantity,
            property: myData.itemPropertyList,
            serialBatchID: data2.serialBatchID,
          };
          newData.push(itemValue);
        });
        return null;
      })
    );
    console.log("พิมพ์บาร์โค้ดทั้งหมด: ", newData);
    await printBarcode(newData)
      .then((data) => {
        dispatch(showSnackbar("success", "พิมพ์สำเร็จ"));
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "ไม่สามารถติดต่อกับเครื่องพิมพ์ได้"));
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

  const updateDraftStage = (values, setSubmitting, number) => {
    const prepare_update_data = {
      status: values.status,
      txSeries: values.txSeries,
      id: values.id,
      issueType: values.issueType,
      lineItem: values.lineItem.map((val, index) => {
        return {
          lineID: `${index}`,
          sortNo: index,
          quantityReference: val.quantityReference,
          quantity: sumOfQuantity(val.transaction),
          perUnitPrice: val.perUnitPrice,
          itemID: val.itemID.split("-")[0].replace(/\s+/g, ""),
          uomID: val.uomID,
          warehouseID: "W01",
          serialBatchList: val.transaction.map((data) => {
            return {
              quantity: data.quantity,
              serialBatchID: data.serialBatchID,
              // binLocationID: data.serialBatchList,
            };
          }),
        };
      }),
    };
    const isEmptyNumber = values.lineItem.some((data) =>
      data.transaction.some((data2) => isNaN(data2.quantity))
    );
    if (isEmptyNumber) return setErrorCheck(true);
    setErrorCheck(false);
    if (number === 0) {
      setIsLoading(true);
      updateGoodIssueItem({ input: prepare_update_data }).then((data) => {
        dispatch(showSnackbar("success", "บันทึกแบบร่างสำเร็จ"));
        setSubmitting(false);
        setIsLoading(false);
      });
    } else {
      updateGoodIssueItem({ input: prepare_update_data }).then((data) => {
        setSubmitting(false);
      });
    }
  };

  const updateDeleteStage = (values, setSubmitting) => {
    const prepare_delete_data = {
      txSeries: values.txSeries,
      id: values.id,
      status: "CANCELED",
    };

    updateGoodIssueItem({ input: prepare_delete_data }).then((data) => {
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

  const updateCloseStage = (values, setSubmitting) => {
    const prepare_success_data = {
      txSeries: values.txSeries,
      id: values.id,
      status: "CLOSED",
    };

    updateGoodIssueItem({ input: prepare_success_data }).then((data) => {
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
      getGoodsIssueDocumentId: `${id}`,
    };
    getGoodIssueById(getBy).then((data) => {
      const myData = data.data.data.getGoodsIssueDocument;

      setMyValue((prev) => ({
        ...prev,
        stage: stageCheck(myData.status),
        txSeries: myData.txSeries,
        status: myData.status,
        id: myData.id,
        issueType: myData.issueType,
        documentID:
          myData.listDocumentReference !== null &&
          myData.listDocumentReference.length !== 0
            ? myData.listDocumentReference[0].documentID
            : [],
        documentDate: new Date(myData.documentDate),
        lineItem: myData.lineItem.map((row) => {
          return {
            itemID: row.itemID,
            sortNo: row.sortNo,
            quantityReference: row.quantityReference || "",
            quantity: row.quantity,
            perUnitPrice: row.perUnitPrice || 0,
            uomID: row.uomID || "",
            warehouseID: "W01",
            name: row.item.name || "",
            transaction: row.serialBatchList
              ? row.serialBatchList.map((data, i) => {
                  // const newData = data.serialBatchID.split(':')[2]
                  return {
                    lineID: i,
                    sortNo: i + 1,
                    quantity: data.quantity || 0,
                    itemID: row.itemID,
                    uomID: row.uomID,
                    warehouseID: "W01",
                    name: row.item.name,
                    serialBatchID: data.serialBatchID,
                    // binLocationID: data.binLocationID || "AA|001",
                  };
                })
              : [],
          };
        }),
      }));
      setIsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const renderList = (values) => {
    if (values.issueType === "SALE")
      return allRefList.map((val) => {
        return (
          <MenuItem
            key={`${val.sales_order_document_id}`}
            value={val.sales_order_document_id}
          >
            {val.sales_order_document_id}
          </MenuItem>
        );
      });
    return allPRList.map((val) => {
      return (
        <MenuItem
          key={`${val.purchase_return_document_id}`}
          value={val.purchase_return_document_id}
        >
          {val.purchase_return_document_id}
        </MenuItem>
      );
    });
  };

  const [allRefList, setAllRefList] = useState([]);
  const [allPRList, setAllPRList] = useState([]);

  const fetchSOData = () => {
    getSalesOrder()
      .then((data) => {
        if (data.data.status === "success") {
          let myData = data.data.data;
          setAllRefList([...allRefList, ...myData]);
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(showSnackbar("error", "ไม่สามารถเรียกข้อมูลได้"));
      });
    return null;
  };

  const fetchPRData = () => {
    getPurchaseReturn()
      .then((data) => {
        if (data.data.status === "success") {
          let myData = data.data.data;
          setAllPRList([...allPRList, ...myData]);
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(showSnackbar("error", "ไม่สามารถเรียกข้อมูลได้"));
      });
    return null;
  };

  useEffect(() => {
    fetchSOData();
    fetchPRData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="good-receipt-main">
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
          const prepare_post_data = {
            listDocumentReference: [
              {
                txSeries: "0",
                documentID: values.documentID,
              },
            ],
            status: stageCheck(values.stage),
            lineItem: values.lineItem.map((val) => {
              return {
                binLocationID: `AA|${val.pallete}`,
              };
            }),
          };
          setIsLoading(true);
          setSubmitting(false);
          updateGoodIssueItem(prepare_post_data)
            .then((data) => {
              if (values.stage === 1) {
                dispatch(showSnackbar("success", "ยืนยันสำเร็จ"));
              } else {
                dispatch(showSnackbar("success", "บันทึกแบบร่างสำเร็จ"));
              }
              setSubmitting(false);
              setIsLoading(false);
            })
            .catch((err) => {
              dispatch(showSnackbar("error", `${err}` || "เกิดเหตุผิดพลาด"));
              setSubmitting(false);
              setIsLoading(false);
            });
          resetForm();
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
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                <BreadcrumbComponent
                  name="คลังสินค้า"
                  key="1"
                  ห
                  to="/inventory/"
                />
                <BreadcrumbComponent
                  name="นำออก"
                  key="2"
                  to="/inventory/good-issue/"
                />
                <BreadcrumbComponent
                  name="เพิ่มสินค้านำออก"
                  key="3"
                  to="/inventory/good-issue/add"
                />
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
                      title="สแกนสินค้า"
                    />
                    <ProgressIndicatorComponent
                      isActive={false}
                      title="ยืนยัน"
                    />
                  </ul>
                </div>
                <div className="inventory-title-grid">
                  <h1>สร้างรายการนำออก</h1>
                  <div className="inventoryMaster-notActive-cell">
                    <div>ร่าง</div>
                  </div>
                </div>
                <div className="inventory__under-header-layout">
                  <div className="grid-container-50">
                    <div className="grid-container-50">
                      <p>รหัสนำออก</p>
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
                        label="นำเข้าวันที่"
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
                  <h2 style={{ marginBottom: "16px" }}>ประเภทการนำออก</h2>
                  <div className="good-issue__radio">
                    <FormControl disabled component="fieldset">
                      <RadioGroup
                        className="good-issue__radio-wrapper"
                        row
                        aria-label="gender"
                        name="issueType"
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        value={values.issueType}
                      >
                        <FormControlLabel
                          value="SALE"
                          control={<Radio />}
                          label="ขาย"
                        />
                        <FormControlLabel
                          value="PURCHASE_RETURN"
                          control={<Radio />}
                          label="ส่งคืน"
                        />
                        <FormControlLabel
                          value="SAMPLE"
                          control={<Radio />}
                          label="เบิกตัวอย่าง"
                        />
                        <FormControlLabel
                          value="OTHER"
                          control={<Radio />}
                          label="อื่นๆ"
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <h2>ข้อมูล</h2>
                  <div className="grid-container-25">
                    {values.issueType !== "OTHER" &&
                    values.issueType !== "SAMPLE" ? (
                      <FormControl fullWidth size="small">
                        <InputLabel id="demo-simple-select-label">
                          เลขที่เอกสารอ้างอิง
                        </InputLabel>
                        <Select
                          fullWidth
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          size="small"
                          disabled
                          name="documentID"
                          label="เลขที่เอกสารอ้างอิง"
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
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    justifyContent: "end",
                  }}
                >
                  <ButtonComponent
                    type="button"
                    text="พิมพ์บาร์โค้ดทั้งหมด"
                    variant="contained"
                    onClick={() => {
                      if (window.confirm("คุณต้องการพิมพ์ใช่หรือไม่"))
                        printAllBarcodeLog(values);
                    }}
                  />
                </div>
                <h1 style={{ marginBottom: "8px" }}>รายการ</h1>
                <TextField
                  sx={{ marginBottom: "24px" }}
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
                                  <td style={{ color: "#FF0000DE" }}>
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
                                      <td>
                                        <div className="inventory-product-scan-success">
                                          สแกนแล้ว
                                        </div>
                                      </td>
                                      <td>
                                        {item.itemID} - {item.name}
                                      </td>
                                      <td></td>
                                      <td>
                                        <TextField
                                          inputProps={{ min: 1 }}
                                          size="small"
                                          type="number"
                                          value={subItem.quantity}
                                          name={`lineItem[${i}].transaction[${subIndex}].quantity`}
                                          onChange={(e) => {
                                            setFieldValue(
                                              `lineItem[${i}].transaction[${subIndex}].quantity`,
                                              parseInt(e.target.value)
                                            );
                                          }}
                                          error={
                                            isNaN(subItem.quantity) &&
                                            errorCheck
                                          }
                                          helperText={
                                            isNaN(subItem.quantity) &&
                                            errorCheck &&
                                            "กรุณากรอก"
                                          }
                                        />
                                      </td>
                                      <td></td>
                                      <td></td>
                                      <td></td>
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
                                      <td>{subItem.serialBatchID}</td>
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
                <div className="button-layout">
                  <Button
                    onClick={() => {
                      updateDeleteStage(values, setSubmitting);
                    }}
                    sx={{ marginRight: "20px" }}
                    type="button"
                    variant="outlined"
                    color="error"
                  >
                    ยกเลิก
                  </Button>
                  <ButtonComponent
                    sx={{ marginRight: "20px" }}
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
                      if (
                        values.lineItem.some((data) => {
                          return data.transaction.length === 0;
                        })
                      )
                        return dispatch(
                          showSnackbar("error", "กรุณาเพิ่มรายการ")
                        );
                      const isEmptyNumber = values.lineItem.some((data) =>
                        data.transaction.some((data2) => data2.quantity === "")
                      );
                      if (isEmptyNumber) return null;
                      updateDraftStage(values, setSubmitting, 1);
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
                      title="สแกนสินค้า"
                    />
                    <ProgressIndicatorComponent
                      isActive={false}
                      title="ยืนยัน"
                    />
                  </ul>
                </div>
                <div className="inventory-title-grid">
                  <h1>รายการนำออก</h1>
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
                      <p>รหัสนำออก</p>
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
                        label="นำเข้าวันที่"
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
                  <h2 style={{ marginBottom: "16px" }}>ประเภทการนำออก</h2>
                  <div className="good-issue__radio">
                    <FormControl disabled component="fieldset">
                      <RadioGroup
                        className="good-issue__radio-wrapper"
                        row
                        aria-label="gender"
                        name="issueType"
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        value={values.issueType}
                      >
                        <FormControlLabel
                          value="SALE"
                          control={<Radio />}
                          label="ขาย"
                        />
                        <FormControlLabel
                          value="PURCHASE_RETURN"
                          control={<Radio />}
                          label="ส่งคืน"
                        />
                        <FormControlLabel
                          value="SAMPLE"
                          control={<Radio />}
                          label="เบิกตัวอย่าง"
                        />
                        <FormControlLabel
                          value="OTHER"
                          control={<Radio />}
                          label="อื่นๆ"
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <h2>ข้อมูล</h2>
                  <div className="grid-container-25">
                    {values.issueType !== "OTHER" &&
                    values.issueType !== "SAMPLE" ? (
                      <FormControl fullWidth size="small">
                        <InputLabel id="demo-simple-select-label">
                          เลขที่เอกสารอ้างอิง
                        </InputLabel>
                        <Select
                          fullWidth
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          size="small"
                          disabled
                          name="documentID"
                          label="เลขที่เอกสารอ้างอิง"
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
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    justifyContent: "end",
                  }}
                >
                  <ButtonComponent
                    type="button"
                    text="พิมพ์บาร์โค้ดทั้งหมด"
                    variant="contained"
                    onClick={() => {
                      if (window.confirm("คุณต้องการพิมพ์ใช่หรือไม่"))
                        printAllBarcodeLog(values);
                    }}
                  />
                </div>
                <h1 style={{ marginBottom: "8px" }}>รายการ</h1>
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
                                <td style={{ color: "#FF0000DE" }}>
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
                                    <td>
                                      <div className="inventory-product-scan-success">
                                        สแกนแล้ว
                                      </div>
                                    </td>
                                    <td>
                                      {item.itemID} - {item.name}
                                    </td>
                                    <td></td>
                                    <td>{subItem.quantity}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
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
                                    <td>{subItem.serialBatchID}</td>
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
                <div className="button-layout">
                  <ButtonComponent
                    onClick={() => {
                      setFieldValue("stage", values.stage - 1);
                    }}
                    disabled={isSubmitting}
                    type="button"
                    text="ย้อนกลับ"
                    variant="contained"
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
                      title="สแกนสินค้า"
                    />
                    <ProgressIndicatorComponent
                      isActive={true}
                      title={values.status === "CLOSED" ? "ยืนยัน" : "ยกเลิก"}
                    />
                  </ul>
                </div>
                <div className="inventory-title-grid">
                  <h1>รายการนำออก</h1>
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
                      <p>รหัสนำออก</p>
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
                        label="นำเข้าวันที่"
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
                  <h2 style={{ marginBottom: "16px" }}>ประเภทการนำออก</h2>
                  <div className="good-issue__radio">
                    <FormControl disabled component="fieldset">
                      <RadioGroup
                        className="good-issue__radio-wrapper"
                        row
                        aria-label="gender"
                        name="issueType"
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        value={values.issueType}
                      >
                        <FormControlLabel
                          value="SALE"
                          control={<Radio />}
                          label="ขาย"
                        />
                        <FormControlLabel
                          value="PURCHASE_RETURN"
                          control={<Radio />}
                          label="ส่งคืน"
                        />
                        <FormControlLabel
                          value="SAMPLE"
                          control={<Radio />}
                          label="เบิกตัวอย่าง"
                        />
                        <FormControlLabel
                          value="OTHER"
                          control={<Radio />}
                          label="อื่นๆ"
                        />
                      </RadioGroup>
                    </FormControl>
                  </div>
                  <h2>ข้อมูล</h2>
                  <div className="grid-container-25">
                    {values.issueType !== "OTHER" &&
                    values.issueType !== "SAMPLE" ? (
                      <FormControl fullWidth size="small">
                        <InputLabel id="demo-simple-select-label">
                          เลขที่เอกสารอ้างอิง
                        </InputLabel>
                        <Select
                          fullWidth
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          size="small"
                          disabled
                          name="documentID"
                          label="เลขที่เอกสารอ้างอิง"
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
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "20px",
                    justifyContent: "end",
                  }}
                >
                  <ButtonComponent
                    type="button"
                    text="พิมพ์บาร์โค้ดทั้งหมด"
                    variant="contained"
                    onClick={() => {
                      if (window.confirm("คุณต้องการพิมพ์ใช่หรือไม่"))
                        printAllBarcodeLog(values);
                    }}
                  />
                </div>
                <h1 style={{ marginBottom: "8px" }}>รายการ</h1>
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
                                <td style={{ color: "#FF0000DE" }}>
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
                                    <td>
                                      <div className="inventory-product-scan-success">
                                        สแกนแล้ว
                                      </div>
                                    </td>
                                    <td>
                                      {item.itemID} - {item.name}
                                    </td>
                                    <td></td>
                                    <td>{subItem.quantity}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
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
                                    <td>{subItem.serialBatchID}</td>
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
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}
