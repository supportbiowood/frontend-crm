import React, { useState, useEffect } from "react";
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Breadcrumbs,
  Autocomplete,
  FormHelperText,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ProgressIndicatorComponent from "../ProgressIndicatorComponent";

import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/actions/snackbarActions";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ButtonComponent from "../ButtonComponent";
import DotStatusComponent from "../DotStatusComponent";

// import { createTheme } from '@mui/material/styles'
// import { createStyles, makeStyles } from '@mui/styles'
import BreadcrumbComponent from "../BreadcrumbComponent";
import {
  createGoodIssueItem,
  scanSerialBatch,
  queryItemInventory,
  updateGoodIssueItem,
  queryGoodIssueItem,
  getItemMasterById,
} from "../../adapter/Api/graphql";
import moment from "moment";
import TablePagination from "@mui/material/TablePagination";
import {
  getPurchaseReturn,
  getSalesOrder,
  printBarcode,
} from "../../adapter/Api";
import { DataGridPro } from "@mui/x-data-grid-pro";

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

// const defaultTheme = createTheme()
// const useStyles = makeStyles(
//   (theme) =>
//     createStyles({
//       root: {
//         padding: theme.spacing(0.5, 0.5, 0),
//         justifyContent: 'space-between',
//         display: 'flex',
//         alignItems: 'flex-start',
//         flexWrap: 'wrap'
//       },
//       textField: {
//         [theme.breakpoints.down('xs')]: {
//           width: '100%'
//         },
//         margin: theme.spacing(1, 0.5, 1.5),
//         '& .MuiSvgIcon-root': {
//           marginRight: theme.spacing(0.5)
//         },
//         '& .MuiInput-underline:before': {
//           borderBottom: `1px solid ${theme.palette.divider}`
//         }
//       },
//       autocomplete: {
//         '& .MuiAutocomplete-endAdornment': {
//           top: 'unset !important'
//         }
//       }
//     }),
//   { defaultTheme }
// )

export default function AddGoodsIssueComponent() {
  const [myValue] = useState({
    id: "",
    stage: 0,
    txSeries: "0",
    remark: "",
    getDocumentCounter: "-",
    issueType: "SALE",
    documentID: "",
    documentDate: new Date(),
    lineItem: [],
  });
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [errorName, setErrorName] = useState(false);
  const [errorCheck, setErrorCheck] = useState(false);
  const [errorReference] = useState(false);
  const [errorQuantity, setErrorQuantity] = useState(false);
  const [errorRemark, setErrorRemark] = useState(false);
  const [checkBox, setCheckBox] = useState(false);
  const [columns] = useState([
    {
      headerName: "ลำดับ",
      field: "id",
      width: 150,
    },
    {
      headerName: "รหัสสินค้า - ชื่อสินค้า",
      field: "itemID",
      width: 200,
      renderCell: (params) => (
        <div>
          {params.row.itemID} - {params.row.name}
        </div>
      ),
    },
    {
      headerName: "จำนวน",
      field: "quantityReference",
      width: 120,
    },
    {
      headerName: "ราคาต่อหน่วย",
      field: "perUnitPrice",
      width: 200,
    },
    {
      headerName: "หน่วย",
      field: "uomID",
      width: 200,
    },
  ]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const [newRows, setNewRows] = useState([]);
  const setRowData = (lineItem, setFieldValue) => {
    setNewRows([]);
    lineItem.map((row) => {
      const check = newRows.some((data) => {
        return `${data.item}` === `${row.itemID}`;
      });

      if (!check) {
        return newRows.push({
          itemID: row.itemID,
          ref_qty: lineItem
            .filter((filter) => {
              return row.itemID === filter.itemID;
            })
            .reduce(
              (sum, inc) => {
                return parseInt(inc.ref_qty) + parseInt(sum);
              },
              [0]
            ),
          quantityReference: row.quantityReference || "-",
          quantity: row.quantity || "-",
          uomID: row.uomID || "-",
          name: row.name,
          perUnitPrice: row.perUnitPrice || "-",
          serialBatchList: [{ serialBatchID: row.serialBatchID, quantity: 0 }],
          transaction: [],
        });
      } else {
        return newRows
          .filter((value) => {
            return value.itemID === row.itemID;
          })[0]
          .transaction.push(row);
      }
    });

    setFieldValue("lineItem", newRows);
  };

  const getUOMID = (data, setFieldValue, index) => {
    const findItem = itemList.find((val) => {
      return `${data}` === `${val.id}`;
    });

    if (findItem === undefined) return null;
    setFieldValue(`lineItem[${index}].uomID`, findItem.inventoryUOMID);
    setFieldValue(`lineItem[${index}].name`, findItem.name);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sumOfQuantity = (data) => {
    const newData = data.reduce(
      (sum, item) => {
        if (isNaN(item.quantity)) return sum;
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
      documentId: input.split("|")[2].split(":")[0],
      serialBatchId: input,
    };

    scanSerialBatch(inputSerial)
      .then((data) => {
        setIsLoading(false);
        const clone = [...values.lineItem];

        if (
          clone.some((data) => {
            return data.transaction.some((data2) => {
              return data2.serialBatchList[0].serialBatchID === input;
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
          pallete: `${input.split("|")[2].split(":")[2]}`,
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

  const loginSchema = Yup.object().shape({
    // email: Yup.string().required("กรุณาเลือก"),
    // project_deal_value: Yup.number()
    //   .required("กรุณาใส่ค่า")
    //   .typeError("กรุณาใส่เป็นตัวเลข"),
    // contact_business_category: Yup.string().required("กรุณาเลือก"),
  });

  const printBarcodeLog = (values, lineItem) => {
    const id = values.itemID.split("-")[0].replace(/\s+/g, "");
    setIsLoading(true);
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
        serialBatchID: values.serialBatchList[0].serialBatchID,
      };
      setIsLoading(false);
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
          getItemUuidId: data2.itemID.split("-")[0].replace(/\s+/g, ""),
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
            serialBatchID: data2.serialBatchList[0].serialBatchID,
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

  // const typeChange = (data) => {
  //   if (data === "SALE") return "ขาย";
  //   if (data === "TRANSFER") return "โอนออก";
  //   if (data === "PURCHASE_RETURN") return "ส่งคืน";
  //   if (data === "SAMPLE") return "เบิกตัวอย่าง";
  //   return "อื่นๆ";
  // };

  const stageCheck = (data) => {
    if (data === 0 || data === 1) return "DRAFT";
    return "CLOSED";
  };

  const itemStatus = (itemName) => {
    const itemID = itemName.split("-")[0].replace(/\s+/g, "");
    const findName = itemList.find((item) => item.id === itemID);
    return (
      findName.listItemCurrent.items[0] || {
        orderedQty: 0,
        committedQty: 0,
        onHandQty: 0,
      }
    );
  };

  const errorQuantityRef = (itemName, QuantityRef) => {
    const itemID = itemName.split("-")[0].replace(/\s+/g, "");
    const findName = itemList.find((item) => item.id === itemID);
    if (findName === undefined) return false;
    const netBalance =
      findName.listItemCurrent.items[0].onHandQty -
      (findName.listItemCurrent.items[0].orderedQty +
        findName.listItemCurrent.items[0].committedQty);

    if (QuantityRef > netBalance) return true;
    return false;
  };

  const helperTextQuantityRef = (itemName) => {
    const itemID = itemName.split("-")[0].replace(/\s+/g, "");
    const findName = itemList.find((item) => item.id === itemID);

    return `กรุณาระบุจำนวนไม่เกินสินค้าคงคลัง ${findName.listItemCurrent.items[0].onHandQty}`;
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
        window.location.href =
          "/inventory/good-issue/" + values.txSeries + "&" + values.id;
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

    setIsLoading(true);
    updateGoodIssueItem({ input: prepare_success_data }).then((data) => {
      if (data.data.data !== null) {
        dispatch(showSnackbar("success", "ยืนยันสำเร็จ"));
        setSubmitting(false);
        setIsLoading(false);
        window.location.href =
          "/inventory/good-issue/" + values.txSeries + "&" + values.id;
      } else {
        dispatch(showSnackbar("error", "ยืนยันไม่สำเร็จ"));
      }
    });
  };

  const createDraftStage = (values, setSubmitting, setFieldValue, save) => {
    console.log("done");
    const prepare_post_data = {
      listDocumentAttachment: [],
      status: "DRAFT",
      txSeries: values.txSeries,
      documentDate: moment(values.documentDate)
        .tz("Asia/Bangkok")
        .format("YYYY-MM-DD"),
      // createdAt: moment(values.createdAt)
      //   .tz("Asia/Bangkok")
      //   .format("YYYY-MM-DD"),
      issueType: values.issueType,
      lineItem: values.lineItem.map((val, index) => {
        return {
          lineID: index + 1,
          sortNo: index,
          quantityReference: val.quantityReference,
          quantity: 0,
          perUnitPrice: 55.4,
          itemID: val.itemID.split("-")[0].replace(/\s+/g, ""),
          uomID: val.uomID,
          warehouseID: "W01",
        };
      }),
      listDocumentReference: [
        {
          txSeries: values.txSeries,
          documentID: values.documentID,
        },
      ],
    };

    const prepare_post_data_other = {
      listDocumentAttachment: [],
      status: "DRAFT",
      txSeries: values.txSeries,
      remark: values.remark,
      documentDate: moment(values.documentDate)
        .tz("Asia/Bangkok")
        .format("YYYY-MM-DD"),
      // createdAt: moment(values.createdAt)
      //   .tz("Asia/Bangkok")
      //   .format("YYYY-MM-DD"),
      issueType: values.issueType,
      lineItem: values.lineItem.map((val, index) => {
        return {
          lineID: index + 1,
          sortNo: index,
          quantityReference: val.quantityReference,
          quantity: 0,
          perUnitPrice: 55.4,
          itemID: val.itemID.split("-")[0].replace(/\s+/g, ""),
          uomID: val.uomID,
          warehouseID: "W01",
        };
      }),
      listDocumentReference: [],
    };

    setIsLoading(true);
    if (values.issueType === "OTHER" || values.issueType === "SAMPLE") {
      createGoodIssueItem({
        input: prepare_post_data_other,
      }).then((data) => {
        if (data.data.data !== null) {
          queryGoodIssueItem().then((data) => {
            const myData = data.data.data.listGoodsIssueDocument.items;
            setFieldValue("id", myData[myData.length - 1].id);
            if (!save) {
              setFieldValue("stage", values.stage + 1);
            }
            if (save) {
              dispatch(showSnackbar("success", "บันทึกแบบร่างสำเร็จ"));
            }
            setIsLoading(false);
          });
        } else {
          dispatch(showSnackbar("error", "บันทึกแบบร่างไม่สำเร็จ"));
          setIsLoading(false);
        }
      });
    } else {
      createGoodIssueItem({
        input: prepare_post_data,
      }).then((data) => {
        if (data.data.data !== null) {
          queryGoodIssueItem().then((data) => {
            const myData = data.data.data.listGoodsIssueDocument.items;
            setFieldValue("id", myData[myData.length - 1].id);
            if (!save) {
              setFieldValue("stage", values.stage + 1);
            }
            if (save) {
              dispatch(showSnackbar("success", "บันทึกแบบร่างสำเร็จ"));
            }
            setIsLoading(false);
          });
        } else {
          dispatch(showSnackbar("error", "บันทึกแบบร่างไม่สำเร็จ"));
          setIsLoading(false);
        }
      });
    }
  };

  const updateFirstDraftStage = (
    values,
    setSubmitting,
    setFieldValue,
    save
  ) => {
    const prepare_update_data = {
      listDocumentAttachment: [],
      status: stageCheck(values.stage),
      txSeries: values.txSeries,
      remark: values.remark,
      id: values.id,
      documentDate: moment(values.documentDate)
        .tz("Asia/Bangkok")
        .format("YYYY-MM-DD"),
      issueType: values.issueType,
      lineItem: values.lineItem.map((val, index) => {
        return {
          lineID: index + 1,
          sortNo: index,
          quantityReference: val.quantityReference,
          quantity: 0,
          perUnitPrice: val.perUnitPrice || 0,
          itemID: val.itemID.split("-")[0].replace(/\s+/g, ""),
          uomID: val.uomID,
          warehouseID: "W01",
        };
      }),
      listDocumentReference: [
        {
          txSeries: values.txSeries,
          documentID: values.documentID,
        },
      ],
    };

    const prepare_update_data_other = {
      listDocumentAttachment: [],
      status: stageCheck(values.stage),
      txSeries: values.txSeries,
      id: values.id,
      remark: values.remark,
      documentDate: moment(values.documentDate)
        .tz("Asia/Bangkok")
        .format("YYYY-MM-DD"),
      issueType: values.issueType,
      lineItem: values.lineItem.map((val, index) => {
        return {
          lineID: index + 1,
          sortNo: index,
          remark: val.remark,
          quantityReference: val.quantityReference,
          quantity: 0,
          perUnitPrice: val.perUnitPrice || 0,
          itemID: val.itemID.split("-")[0].replace(/\s+/g, ""),
          uomID: val.uomID,
          warehouseID: "W01",
        };
      }),
      listDocumentReference: [],
    };

    if (values.issueType === "OTHER") {
      updateGoodIssueItem({ input: prepare_update_data_other }).then((data) => {
        if (data.data.data !== null) {
          setSubmitting(false);
          setIsLoading(false);
          if (!save) {
            setFieldValue("stage", values.stage + 1);
          }
          if (save) {
            dispatch(showSnackbar("success", "บันทึกแบบร่างสำเร็จ"));
          }
        } else {
          if (save) {
            dispatch(showSnackbar("error", "บันทึกแบบร่างไม่สำเร็จ"));
          }
        }
      });
    } else {
      updateGoodIssueItem({ input: prepare_update_data }).then((data) => {
        if (data.data.data !== null) {
          setSubmitting(false);
          setIsLoading(false);
          if (!save) {
            setFieldValue("stage", values.stage + 1);
          }
          if (save) {
            dispatch(showSnackbar("success", "บันทึกแบบร่างสำเร็จ"));
          }
        } else {
          if (save) {
            dispatch(showSnackbar("error", "บันทึกแบบร่างไม่สำเร็จ"));
          }
        }
      });
    }
  };

  const updateDraftStage = (values, setSubmitting, number) => {
    const prepare_update_data = {
      status: "DRAFT",
      txSeries: values.txSeries,
      id: values.id,
      issueType: values.issueType,
      lineItem: values.lineItem.map((val, index) => {
        return {
          lineID: `${index}`,
          sortNo: index,
          quantityReference: val.quantityReference,
          quantity: sumOfQuantity(val.transaction),
          itemID: val.itemID.split("-")[0].replace(/\s+/g, ""),
          uomID: val.uomID,
          warehouseID: "W01",
          serialBatchList: val.transaction.map((data) => {
            return {
              quantity: data.quantity,
              serialBatchID: data.serialBatchList[0].serialBatchID,
            };
          }),
        };
      }),
    };

    const isEmptyNumber = values.lineItem.some((data) =>
      data.transaction.some((data2) => data2.quantity === "")
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
      setIsLoading(true);
      updateGoodIssueItem({ input: prepare_update_data }).then((data) => {
        setSubmitting(false);
        setIsLoading(false);
      });
    }
  };

  const getItemFromRef = (id) => {
    if (!id) return [];
    const findDoc = allRefList.find((data) => {
      return (
        data.sales_order_document_id === id ||
        data.sales_invoice_document_id === id
      );
    });
    const findDoc2 = allPRList.find((data) => {
      return data.purchase_return_document_id === id;
    });
    if (findDoc) {
      if (findDoc.sales_order_data) {
        const newData = [];
        findDoc.sales_order_data.forEach((group, groupIndex) => {
          group.category_list.forEach((category, categoryIndex) => {
            category.item_data.forEach((item, itemIndex) => {
              let name = item.item_name.split("-")[1].replace(/\s+/g, "");
              return newData.push({
                sortNo: Math.random(),
                quantityReference: item.item_display_quantity,
                quantity: 0,
                perUnitPrice: item.item_price,
                itemID: item.item_id,
                name: name,
                uomID: item.item_display_unit,
                warehouseID: "",
              });
            });
          });
        });
        const result = newData.map((item, index) => {
          return { ...item, id: index + 1 };
        });
        return result;
      }
    }
    if (findDoc2) {
      let newData =
        findDoc2 &&
        findDoc2.purchase_return_data.map((item, index) => {
          let name = item.item_name.split("-")[1].replace(/\s+/g, "");
          return {
            id: index + 1,
            sortNo: Math.random(),
            quantityReference: item.item_quantity,
            quantity: 0,
            perUnitPrice: item.item_price,
            itemID: item.item_id,
            name: name,
            uomID: item.item_display_unit,
            warehouseID: "",
          };
        });
      return newData ? newData : [];
    }
  };

  const renderAutocompleteList = (values) => {
    if (values.issueType === "SALE")
      return allRefList.map((val) => {
        return {
          ...val,
          label: val.sales_order_document_id,
          id: val.sales_order_document_id,
        };
      });
    return allPRList.map((val) => {
      return {
        ...val,
        label: val.purchase_return_document_id,
        id: val.purchase_return_document_id,
      };
    });
  };

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
  const [optionList, setOptionList] = useState([]);
  const [itemList, setItemList] = useState([]);

  const fetchItemFromInventory = () => {
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
      setItemList(data.data.data.listItem.items);
      setOptionList(usageData);
      setIsLoading(false);
    });
    return null;
  };

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
    fetchItemFromInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          createGoodIssueItem(prepare_post_data)
            .then((data) => {
              if (values.stage === 2) {
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
              <Breadcrumbs separator=">" aria-label="breadcrumb">
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
                      isActive={false}
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
                      <p>รหัสนำเข้า</p>
                      <p>-</p>
                    </div>
                  </div>
                  <div className="inventory__under-header-datepicker-layout">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
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
                        label="นำออกวันที่"
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
                    <FormControl component="fieldset">
                      <RadioGroup
                        className="good-issue__radio-wrapper"
                        row
                        aria-label="gender"
                        name="issueType"
                        onChange={(e) => {
                          handleChange(e);
                          setFieldValue("lineItem", []);
                          setFieldValue("documentID", "");
                          setCheckBox([]);
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
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={renderAutocompleteList(values)}
                        value={values.documentID}
                        size="small"
                        onChange={(e) => {
                          setFieldValue(`documentID`, e.target.textContent);
                          setFieldValue(`lineItem`, []);
                          setCheckBox([]);
                        }}
                        renderInput={(params) => (
                          <TextField {...params} label="เลขที่เอกสารอ้างอิง" />
                        )}
                      />
                    ) : (
                      <TextField
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        size="small"
                        type="text"
                        name="remark"
                        id="outlined-error-helper-text"
                        label="หมายเหตุ"
                        value={values.remark}
                        error={errorRemark}
                        helperText={errorRemark && "กรุณากรอก"}
                      />
                    )}
                  </div>
                </div>
                <div>
                  <h1>รายการ</h1>
                  <div className="inventory-container">
                    {values.issueType !== "OTHER" &&
                    values.issueType !== "SAMPLE" ? (
                      <div className="myTable">
                        <DataGridPro
                          rows={getItemFromRef(values.documentID)}
                          columns={columns}
                          checkboxSelection
                          onSelectionModelChange={(ids) => {
                            const selectedIDs = new Set(ids);
                            const selectedRows = getItemFromRef(
                              values.documentID
                            ).filter((row) => selectedIDs.has(row.id));
                            setFieldValue("lineItem", selectedRows);
                            setCheckBox(ids);
                          }}
                          selectionModel={checkBox}
                          pageSize={pageSize}
                          onPageSizeChange={(newPageSize) =>
                            setPageSize(newPageSize)
                          }
                          rowsPerPageOptions={[10, 30, 50, 100, 200]}
                        />
                      </div>
                    ) : (
                      <div>
                        <div
                          style={{
                            marginBottom: "10px",
                            justifyContent: "end",
                            display: "grid",
                          }}
                        >
                          <Button
                            variant="outlined"
                            color="success"
                            onClick={() => {
                              const clone = [...values.lineItem];
                              clone.push({
                                itemID: "",
                                serialBatchID: "",
                                quantityReference: 0,
                                perUnitPrice: "",
                                uomID: "ชิ้น",
                              });
                              setFieldValue("lineItem", clone);
                            }}
                          >
                            เพิ่มรายการ
                          </Button>
                        </div>
                        <table id="inventory" rules="none">
                          <thead>
                            <td>ลำดับ</td>
                            <td>รหัสสินค้า - ชื่อสินค้า</td>
                            <td>จำนวน</td>
                            <td>หน่วย</td>
                            <td></td>
                          </thead>
                          <tbody id="table-body">
                            {values.lineItem.map((item, i) => {
                              return [
                                <>
                                  <tr key={i}>
                                    <td>{i + 1}</td>
                                    <td
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "5px",
                                      }}
                                    >
                                      <Autocomplete
                                        options={optionList.map(
                                          (item) => `${item.id} - ${item.name}`
                                        )}
                                        sx={{ minWidth: "160px" }}
                                        disablePortal
                                        id="combo-box-demo"
                                        value={item.itemID}
                                        fullWidth
                                        type="text"
                                        size="small"
                                        onChange={(e) => {
                                          setFieldValue(
                                            `lineItem[${i}].itemID`,
                                            e.target.textContent
                                          );
                                          getUOMID(
                                            e.target.textContent,
                                            setFieldValue,
                                            i
                                          );
                                        }}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            label="รหัสสินค้า - ชื่อสินค้า"
                                            error={errorName}
                                            helperText={
                                              errorName && "กรุณากรอก"
                                            }
                                          />
                                        )}
                                      />
                                      {item.itemID !== "" && (
                                        <div>
                                          <DotStatusComponent
                                            value={itemStatus(item.itemID)}
                                          />
                                        </div>
                                      )}
                                    </td>

                                    <td>
                                      <TextField
                                        size="small"
                                        type="number"
                                        label="จำนวน"
                                        inputProps={{ min: 0 }}
                                        name={`lineItem[${i}].quantityReference`}
                                        value={parseInt(item.quantityReference)}
                                        onChange={(e) => {
                                          handleChange(e);
                                        }}
                                        error={
                                          (item.quantityReference === "" &&
                                            errorQuantity) ||
                                          errorQuantityRef(
                                            item.itemID,
                                            item.quantityReference
                                          )
                                        }
                                        helperText={
                                          (item.quantityReference === "" &&
                                            errorQuantity &&
                                            "กรุณาระบุจำนวน") ||
                                          (errorQuantityRef(
                                            item.itemID,
                                            item.quantityReference
                                          ) &&
                                            helperTextQuantityRef(item.itemID))
                                        }
                                      />
                                    </td>
                                    <td>{item.uomID}</td>
                                    <td style={{ textAlign: "center" }}>
                                      <CloseIcon
                                        className="inventory-add-icon"
                                        onClick={() => {
                                          const clone = [...values.lineItem];
                                          const newValue = clone.filter(
                                            (value, index) => {
                                              return `${index}` !== `${i}`;
                                            }
                                          );
                                          setFieldValue("lineItem", newValue);
                                        }}
                                      />
                                    </td>
                                  </tr>
                                </>,
                              ];
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
                <div className="button-layout">
                  <ButtonComponent
                    type="button"
                    text="บันทึกแบบร่าง"
                    variant="contained"
                    onClick={() => {
                      console.log("values: ", values);
                      if (values.lineItem.length === 0)
                        return dispatch(
                          showSnackbar("error", "กรุณาเพิ่มรายการ")
                        );
                      if (
                        values.issueType === "OTHER" ||
                        values.issueType === "SAMPLE"
                      ) {
                        if (
                          values.remark === "" ||
                          values.lineItem.some((data) => {
                            return (
                              data.itemID === "" ||
                              data.quantityReference === "" ||
                              errorQuantityRef(
                                data.itemID,
                                data.quantityReference
                              )
                            );
                          })
                        ) {
                          if (
                            values.lineItem.some((data) => {
                              return data.itemID === "";
                            })
                          ) {
                            setErrorName(true);
                          } else {
                            setErrorName(false);
                          }
                          if (
                            values.lineItem.some((data) => {
                              return data.quantityReference === "";
                            })
                          ) {
                            setErrorQuantity(true);
                          } else {
                            setErrorQuantity(false);
                          }
                          if (values.remark === "") {
                            setErrorRemark(true);
                          } else {
                            setErrorRemark(false);
                          }
                        } else {
                          if (values.id === "") {
                            createDraftStage(
                              values,
                              setSubmitting,
                              setFieldValue,
                              true
                            );
                          } else {
                            updateFirstDraftStage(
                              values,
                              setSubmitting,
                              setFieldValue,
                              true
                            );
                          }
                        }
                      } else {
                        if (
                          values.documentID === "" ||
                          values.lineItem.some((data) => {
                            return (
                              data.itemID === "" ||
                              data.quantityReference === "" ||
                              errorQuantityRef(
                                data.itemID,
                                data.quantityReference
                              )
                            );
                          })
                        ) {
                          if (
                            values.lineItem.some((data) => {
                              return errorQuantityRef(
                                data.itemID,
                                data.quantityReference
                              );
                            })
                          ) {
                            return dispatch(
                              showSnackbar(
                                "error",
                                "จำนวนที่จะนำออกมากกว่าจำนวนที่อยู่ในคลัง"
                              )
                            );
                          }
                          if (
                            values.lineItem.some((data) => {
                              return data.itemID === "";
                            })
                          ) {
                            setErrorName(true);
                          } else {
                            setErrorName(false);
                          }
                          if (
                            values.lineItem.some((data) => {
                              return data.quantityReference === "";
                            })
                          ) {
                            setErrorQuantity(true);
                          } else {
                            setErrorQuantity(false);
                          }
                        } else {
                          if (values.id === "") {
                            createDraftStage(
                              values,
                              setSubmitting,
                              setFieldValue,
                              true
                            );
                          } else {
                            updateFirstDraftStage(
                              values,
                              setSubmitting,
                              setFieldValue,
                              true
                            );
                          }
                        }
                      }
                    }}
                  />
                  <ButtonComponent
                    type="button"
                    text="ดำเนินการต่อ"
                    variant="contained"
                    onClick={() => {
                      if (values.lineItem.length === 0)
                        return dispatch(
                          showSnackbar("error", "กรุณาเพิ่มรายการ")
                        );
                      if (
                        values.issueType === "OTHER" ||
                        values.issueType === "SAMPLE"
                      ) {
                        if (
                          values.remark === "" ||
                          values.lineItem.some((data) => {
                            return (
                              data.itemID === "" ||
                              data.quantityReference === "" ||
                              errorQuantityRef(
                                data.itemID,
                                data.quantityReference
                              )
                            );
                          })
                        ) {
                          if (
                            values.lineItem.some((data) => {
                              return data.itemID === "";
                            })
                          ) {
                            setErrorName(true);
                          } else {
                            setErrorName(false);
                          }
                          if (
                            values.lineItem.some((data) => {
                              return data.quantityReference === "";
                            })
                          ) {
                            setErrorQuantity(true);
                          } else {
                            setErrorQuantity(false);
                          }
                          if (values.remark === "") {
                            setErrorRemark(true);
                          } else {
                            setErrorRemark(false);
                          }
                        } else {
                          if (values.id === "") {
                            createDraftStage(
                              values,
                              setSubmitting,
                              setFieldValue
                            );
                            setRowData(values.lineItem, setFieldValue);
                          } else {
                            updateFirstDraftStage(
                              values,
                              setSubmitting,
                              setFieldValue
                            );
                            setRowData(values.lineItem, setFieldValue);
                          }
                        }
                      } else {
                        if (
                          values.documentID === "" ||
                          values.lineItem.some((data) => {
                            return (
                              data.itemID === "" ||
                              data.quantityReference === "" ||
                              errorQuantityRef(
                                data.itemID,
                                data.quantityReference
                              )
                            );
                          })
                        ) {
                          if (
                            values.lineItem.some((data) => {
                              return errorQuantityRef(
                                data.itemID,
                                data.quantityReference
                              );
                            })
                          ) {
                            return dispatch(
                              showSnackbar(
                                "error",
                                "จำนวนที่จะนำออกมากกว่าจำนวนที่อยู่ในคลัง"
                              )
                            );
                          }
                          if (
                            values.lineItem.some((data) => {
                              return data.itemID === "";
                            })
                          ) {
                            setErrorName(true);
                          } else {
                            setErrorName(false);
                          }
                          if (
                            values.lineItem.some((data) => {
                              return data.quantityReference === "";
                            })
                          ) {
                            setErrorQuantity(true);
                          } else {
                            setErrorQuantity(false);
                          }
                        } else {
                          if (values.id === "") {
                            createDraftStage(
                              values,
                              setSubmitting,
                              setFieldValue
                            );
                            setFieldValue("stage", values.stage + 1);
                            setRowData(values.lineItem, setFieldValue);
                          } else {
                            updateFirstDraftStage(values, setSubmitting);
                            setFieldValue("stage", values.stage + 1);
                            setRowData(values.lineItem, setFieldValue);
                          }
                        }
                      }
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
                      <FormControl
                        fullWidth
                        size="small"
                        error={errorReference}
                      >
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
                          defaultValue={1}
                          value={values.documentID}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        >
                          {renderList(values)}
                        </Select>
                        <FormHelperText>
                          {errorReference && "กรุณากรอก"}
                        </FormHelperText>
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
                        error={errorRemark}
                        helperText={errorRemark && "กรุณากรอก"}
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
                                <td>{item.serialBatchList[0].serialBatchID}</td>
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
                                        size="small"
                                        type="number"
                                        label="จำนวนจริง"
                                        value={subItem.quantity}
                                        inputProps={{ min: 0 }}
                                        name={`lineItem[${i}].transaction[${subIndex}].quantity`}
                                        onChange={(e) => {
                                          setFieldValue(
                                            `lineItem[${i}].transaction[${subIndex}].quantity`,
                                            parseInt(e.target.value)
                                          );
                                        }}
                                        error={
                                          isNaN(subItem.quantity) && errorCheck
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
                                    <td>{subItem.warehouseID}</td>
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
                                    <td>
                                      {subItem.serialBatchList[0].serialBatchID}
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
                <div className="button-layout">
                  <ButtonComponent
                    sx={{ marginRight: "20px" }}
                    type="button"
                    text="ย้อนกลับ"
                    variant="contained"
                    onClick={() => {
                      setFieldValue("stage", values.stage - 1);
                      setFieldValue(
                        "lineItem",
                        values.lineItem.map((val) => {
                          return {
                            lineID: "",
                            sortNo: "",
                            quantityReference: val.quantityReference,
                            quantity: sumOfQuantity(val.transaction),
                            perUnitPrice: 0,
                            itemID: val.itemID,
                            uomID: val.uomID,
                            warehouseID: "W01",
                            binLocationID: val.serialBatchList.serialBatchID,
                            serialBatchList: val.serialBatchList,
                          };
                        })
                      );
                    }}
                  />
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
                      <FormControl
                        fullWidth
                        size="small"
                        error={errorReference}
                      >
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
                          defaultValue={1}
                          value={values.documentID}
                          onChange={(e) => {
                            handleChange(e);
                          }}
                        >
                          {renderList(values)}
                        </Select>
                        <FormHelperText>
                          {errorReference && "กรุณากรอก"}
                        </FormHelperText>
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
                        error={errorRemark}
                        helperText={errorRemark && "กรุณากรอก"}
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
                              <tr key={i}>
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
                                <td>{item.serialBatchList[0].serialBatchID}</td>
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
                                    <td>{subItem.warehouseID}</td>
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
                                    <td>
                                      {subItem.serialBatchList[0].serialBatchID}
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
                    onClick={() => {
                      updateCloseStage(values, setSubmitting);
                    }}
                    disabled={isSubmitting}
                    type="button"
                    text="ยืนยัน"
                    variant="contained"
                  />
                </div>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}
