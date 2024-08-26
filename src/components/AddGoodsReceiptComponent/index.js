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
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ProgressIndicatorComponent from "../ProgressIndicatorComponent";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";

import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/actions/snackbarActions";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ButtonComponent from "../ButtonComponent";

// import { DataGridPro } from "@mui/x-data-grid-pro";
import BreadcrumbComponent from "../BreadcrumbComponent";
import {
  createGoodReceiptItem,
  getItemMasterById,
  getListBinLocation,
  getListWareHouse,
  queryItemInventory,
  updateGoodReceiptItem,
} from "../../adapter/Api/graphql";
import {
  getPurchaseOrder,
  printBarcode,
  getSalesReturn,
} from "../../adapter/Api";
import TablePagination from "@mui/material/TablePagination";
import DotStatusComponent from "../DotStatusComponent";
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

export default function AddGoodsReceiptComponent() {
  const [myValue] = useState({
    stage: 0,
    txSeries: "0",
    id: "",
    remark: "",
    receiptType: "PURCHASE",
    documentID: "",
    documentDate: new Date(),
    createdAt: new Date(),
    lineItem: [],
    warehouseID: "W01",
  });
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [errorCheck, setErrorCheck] = useState(false);
  const [checkBox, setCheckBox] = useState(false);
  const [errorCheck2, setErrorCheck2] = useState(false);
  const [errorRemark, setErrorRemark] = useState(false);
  const [errorName, setErrorName] = useState(false);
  const [errorQuantity, setErrorQuantity] = useState(false);
  const [errorPerUnitPrice, setErrorPerUnitPrice] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const loginSchema = Yup.object().shape({
    receiptType: Yup.string().required("กรุณากรอก"),
    remark: Yup.string().required("กรุณากรอก"),
  });

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

  const [newRows, setNewRows] = useState([]);
  const setRowData = (lineItem, setFieldValue, values) => {
    setNewRows([]);
    lineItem.map((row) => {
      const check = newRows.some((data) => {
        return `${data.item}` === `${row.itemID}`;
      });

      if (!check) {
        return newRows.push({
          itemID: row.itemID,
          quantityReference: row.quantityReference || "",
          quantity: 0,
          perUnitPrice: row.perUnitPrice || 0,
          uomID: row.uomID || "",
          warehouseID: values.warehouseID,
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
    console.log("newRows", newRows);
    setFieldValue("lineItem", newRows);
  };

  const [optionList, setOptionList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [warehouseOption, setWarehouseOption] = useState([]);
  const [allRefList, setAllRefList] = useState([]);
  const [allSRList, setAllSRList] = useState([]);

  const fetchPOData = () => {
    getPurchaseOrder()
      .then((data) => {
        if (data.data.status === "success") {
          let myData = data.data.data;
          setAllRefList((prev) => [...prev, ...myData]);
          console.log(myData);
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
      setItemList(usageData);
      setOptionList(usageData);
    });
    return null;
  };

  useEffect(() => {
    fetchPOData();
    fetchSRData();
    fetchWarehouseData();
    fetchItemFromInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getItemFromRef = (id) => {
    if (!id) return [];
    const findDoc = allRefList.find((data) => {
      return data.purchase_order_document_id === id;
    });
    const findDoc2 = allSRList.find((data) => {
      return data.sales_return_document_id === id;
    });
    if (findDoc && findDoc.purchase_order_document_id) {
      let newData = findDoc.purchase_order_data.map((item, index) => {
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
    if (findDoc2) {
      const newData = [];
      findDoc2.sales_return_data.forEach((group, groupIndex) => {
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
  };

  const renderAutocompleteList = (values) => {
    if (values.receiptType === "PURCHASE")
      return allRefList.map((val) => {
        return {
          ...val,
          label: val.purchase_order_document_id,
          id: val.purchase_order_document_id,
        };
      });
    return allSRList.map((val) => {
      return {
        ...val,
        label: val.sales_return_document_id,
        id: val.sales_return_document_id,
      };
    });
  };

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

  const PalleteOption = (warehouse) => {
    let newData = [];
    const getListBinLocationInput = {
      warehouseId: warehouse,
      parentIdList: [],
    };
    getListBinLocation(getListBinLocationInput)
      .then((data) => {
        data.data.data.listBinLocation.items.map((item1) => {
          return item1.listBinLocation.items.map((item2) => {
            return newData.push({
              label: item2.name,
              id: item2.id,
            });
          });
        });
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
      });
    return newData;
  };

  const createDraftStage = (values, setSubmitting, setFieldValue, save) => {
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
      receiptType: values.receiptType,
      lineItem: values.lineItem.map((val, index) => {
        return {
          lineID: index + 1,
          sortNo: index,
          quantityReference: val.quantityReference,
          quantity: 0,
          perUnitPrice: val.perUnitPrice,
          itemID: val.itemID.split("-")[0].replace(/\s+/g, ""),
          uomID: val.uomID,
          warehouseID: values.warehouseID,
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
      receiptType: values.receiptType,
      lineItem: values.lineItem.map((val, index) => {
        return {
          lineID: index + 1,
          sortNo: index,
          quantityReference: val.quantityReference,
          quantity: 0,
          perUnitPrice: val.perUnitPrice,
          itemID: val.itemID.split("-")[0].replace(/\s+/g, ""),
          uomID: val.uomID,
          warehouseID: values.warehouseID,
        };
      }),
      listDocumentReference: [],
    };

    setIsLoading(true);
    if (values.receiptType === "OTHER") {
      createGoodReceiptItem({
        input: prepare_post_data_other,
      }).then((data) => {
        if (data.data.data !== null) {
          const myData = data.data.data.createGoodsReceiptDocument;
          setFieldValue("id", myData.id);
          if (!save) {
            setFieldValue("stage", values.stage + 1);
          }
          if (save) {
            dispatch(showSnackbar("success", "บันทึกแบบร่างสำเร็จ"));
          }
          setIsLoading(false);
          setSubmitting(false);
        } else {
          dispatch(showSnackbar("error", "บันทึกแบบร่างไม่สำเร็จ"));
          setIsLoading(false);
        }
      });
    } else {
      createGoodReceiptItem({
        input: prepare_post_data,
      }).then((data) => {
        if (data.data.data !== null) {
          const myData = data.data.data.createGoodsReceiptDocument;
          setFieldValue("id", myData.id);
          if (!save) {
            setFieldValue("stage", values.stage + 1);
          }
          if (save) {
            dispatch(showSnackbar("success", "บันทึกแบบร่างสำเร็จ"));
          }
          setIsLoading(false);
          setSubmitting(false);
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
      id: values.id,
      documentDate: moment(values.documentDate)
        .tz("Asia/Bangkok")
        .format("YYYY-MM-DD"),
      // createdAt: moment(values.createdAt)
      //   .tz("Asia/Bangkok")
      //   .format("YYYY-MM-DD"),
      receiptType: values.receiptType,
      lineItem: values.lineItem.map((val, index) => {
        return {
          lineID: index + 1,
          sortNo: val.sortNo,
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
      // createdAt: moment(values.createdAt)
      //   .tz("Asia/Bangkok")
      //   .format("YYYY-MM-DD"),
      receiptType: values.receiptType,
      lineItem: values.lineItem.map((val, index) => {
        return {
          lineID: index + 1,
          sortNo: val.sortNo,
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

    if (values.receiptType === "OTHER") {
      updateGoodReceiptItem({ input: prepare_update_data_other }).then(
        (data) => {
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
        }
      );
    } else {
      updateGoodReceiptItem({ input: prepare_update_data }).then((data) => {
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
      txSeries: values.txSeries,
      id: values.id,
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
            const palleteData = PalleteOption(values.warehouseID);
            const pallete = palleteData.filter((pallete) => {
              return pallete.lebel === data.pallete;
            });
            const binLocation = `${pallete.id.slice(4, 6)}|${pallete.id.slice(
              7,
              10
            )}`;
            return {
              quantity: data.quantity,
              serialBatchID: `ITEM|${data.itemID
                .split("-")[0]
                .replace(/\s+/g, "")}|${values.id}:${data.itemID
                .split("-")[0]
                .replace(/\s+/g, "")}:${pallete.id}`,
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
        window.location.href =
          "/inventory/good-recieve/" + values.txSeries + "&" + values.id;
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
    updateGoodReceiptItem({ input: prepare_success_data }).then((data) => {
      if (data.data.data !== null) {
        dispatch(showSnackbar("success", "ยืนยันสำเร็จ"));
        setSubmitting(false);
        setIsLoading(false);
        window.location.href =
          "/inventory/good-recieve/" + values.txSeries + "&" + values.id;
      } else {
        dispatch(showSnackbar("error", "ยืนยันไม่สำเร็จ"));
      }
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
        pallette: data.pallete,
        internalID: myData.internalID,
        name: myData.name,
        uomGroup: myData.getSaleBaseUOMDimensions,
        qty: values.quantity,
        property: myData.itemPropertyList,
        serialBatchID: `ITEM|${myData.id}|${lineItem.id}:${myData.id}:${data.pallete}`,
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
    const newData = [];
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
            pallette: data.pallete,
            internalID: myData.internalID,
            name: myData.name,
            uomGroup: myData.getSaleBaseUOMDimensions,
            qty: data2.quantity,
            property: myData.itemPropertyList,
            serialBatchID: `ITEM|${myData.id}|${values.id}:${myData.id}:${data.pallete}`,
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

  const getUOMID = (data, setFieldValue, index) => {
    const findItem = itemList.find((val) => {
      return `${data}` === `${val.id} - ${val.name}`;
    });
    if (findItem === undefined) return null;
    setFieldValue(`lineItem[${index}].uomID`, findItem.inventoryUOMID);
    setFieldValue(`lineItem[${index}].name`, findItem.name);
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
                  name="นำเข้า"
                  key="2"
                  to="/inventory/good-recieve"
                />
                <BreadcrumbComponent
                  name="เพิ่มสินค้านำเข้า"
                  key="3"
                  to="/inventory/good-recieve/add"
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
                      title="นำเข้าสินค้า"
                    />
                    <ProgressIndicatorComponent
                      isActive={false}
                      title="ยืนยัน"
                    />
                  </ul>
                </div>
                <div className="inventory-title-grid">
                  <h1>สร้างรายการนำเข้า</h1>
                  <div>
                    <div className="inventoryMaster-notActive-cell">
                      <div>ร่าง</div>
                    </div>
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
                  <h3>ประเภทการนำเข้า</h3>
                  <div className="radio-layout">
                    <FormControl component="fieldset">
                      <RadioGroup
                        row
                        aria-label="gender"
                        name="receiptType"
                        onChange={(e) => {
                          handleChange(e);
                          setFieldValue("lineItem", []);
                          setFieldValue("documentID", "");
                          setCheckBox([]);
                        }}
                        defaultValue="purchase"
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
                        error={values.remark === "" && errorRemark}
                        helperText={values.remark && errorRemark && "กรุณากรอก"}
                      />
                    )}
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-simple-select-label">
                        คลังปลายทาง
                      </InputLabel>
                      <Select
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
                <h2>รายการ</h2>
                <div className="inventory-container">
                  {values.receiptType !== "OTHER" ? (
                    <div>
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
                          sx={{ textAlign: "end" }}
                          onClick={() => {
                            const clone = [...values.lineItem];
                            clone.push({
                              itemID: "",
                              name: "",
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
                          <td>ราคาต่อหน่วย</td>
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
                                      disablePortal
                                      id="combo-box-demo"
                                      options={optionList.map(
                                        (item) => `${item.id} - ${item.name}`
                                      )}
                                      value={item.itemID}
                                      sx={{ width: 250 }}
                                      disableClearable
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
                                          fullWidth
                                          {...params}
                                          label="รหัสสินค้า"
                                          error={
                                            item.itemID === "" && errorName
                                          }
                                          helperText={
                                            item.itemID === "" &&
                                            errorName &&
                                            "กรุณาเลือก"
                                          }
                                        />
                                      )}
                                    />
                                    {item.itemID !== "" && (
                                      <DotStatusComponent
                                        value={itemStatus(item.itemID)}
                                      />
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
                                        item.quantityReference === "" &&
                                        errorQuantity
                                      }
                                      helperText={
                                        item.quantityReference === "" &&
                                        errorQuantity &&
                                        "กรุณาระบุจำนวน"
                                      }
                                    />
                                  </td>
                                  <td>
                                    <TextField
                                      size="small"
                                      type="number"
                                      label="ราคาต่อหน่วย"
                                      inputProps={{ min: 0 }}
                                      name={`lineItem[${i}].perUnitPrice`}
                                      value={parseInt(item.perUnitPrice)}
                                      onChange={(e) => {
                                        handleChange(e);
                                      }}
                                      error={
                                        item.perUnitPrice === "" &&
                                        errorPerUnitPrice
                                      }
                                      helperText={
                                        item.perUnitPrice === "" &&
                                        errorPerUnitPrice &&
                                        "กรุณาระบุจำนวน"
                                      }
                                    />
                                  </td>
                                  <td>{item.uomID}</td>
                                  <td>
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
                <div className="button-layout">
                  <ButtonComponent
                    isSubmitting={isSubmitting}
                    type="submit"
                    text="บันทึกแบบร่าง"
                    variant="contained"
                    onClick={() => {
                      if (values.lineItem.length === 0)
                        return dispatch(
                          showSnackbar("error", "กรุณาเพิ่มรายการ")
                        );
                      if (values.receiptType === "OTHER") {
                        if (
                          values.remark === "" ||
                          values.lineItem.some((data) => {
                            return (
                              data.itemID === "" ||
                              data.quantityReference === ""
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
                          if (
                            values.lineItem.some((data) => {
                              return data.perUnitPrice === "";
                            })
                          ) {
                            setErrorPerUnitPrice(true);
                          } else {
                            setErrorPerUnitPrice(false);
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
                              data.quantityReference === ""
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
                          if (
                            values.lineItem.some((data) => {
                              return data.perUnitPrice === "";
                            })
                          ) {
                            setErrorPerUnitPrice(true);
                          } else {
                            setErrorPerUnitPrice(false);
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
                    isSubmitting={isSubmitting}
                    type="submit"
                    text="ดำเนินการต่อ"
                    variant="contained"
                    onClick={() => {
                      if (values.lineItem.length === 0)
                        return dispatch(
                          showSnackbar("error", "กรุณาเพิ่มรายการ")
                        );
                      if (values.receiptType === "OTHER") {
                        if (
                          values.remark === "" ||
                          values.lineItem.some((data) => {
                            return (
                              data.itemID === "" ||
                              data.quantityReference === ""
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
                          if (
                            values.lineItem.some((data) => {
                              return data.perUnitPrice === "";
                            })
                          ) {
                            setErrorPerUnitPrice(true);
                          } else {
                            setErrorPerUnitPrice(false);
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
                            setRowData(values.lineItem, setFieldValue, values);
                          } else {
                            updateFirstDraftStage(
                              values,
                              setSubmitting,
                              setFieldValue
                            );
                            setRowData(values.lineItem, setFieldValue, values);
                          }
                        }
                      } else {
                        if (
                          values.documentID === "" ||
                          values.lineItem.some((data) => {
                            return (
                              data.itemID === "" ||
                              data.quantityReference === ""
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
                          if (
                            values.lineItem.some((data) => {
                              return data.perUnitPrice === "";
                            })
                          ) {
                            setErrorPerUnitPrice(true);
                          } else {
                            setErrorPerUnitPrice(false);
                          }
                        } else {
                          if (values.id === "") {
                            createDraftStage(
                              values,
                              setSubmitting,
                              setFieldValue
                            );
                            setRowData(values.lineItem, setFieldValue, values);
                          } else {
                            updateFirstDraftStage(
                              values,
                              setSubmitting,
                              setFieldValue
                            );
                            setRowData(values.lineItem, setFieldValue, values);
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
                      title="นำเข้าสินค้า"
                    />
                    <ProgressIndicatorComponent
                      isActive={false}
                      title="ยืนยัน"
                    />
                  </ul>
                </div>
                <div className="inventory-title-grid">
                  <h1>สร้างรายการนำเข้า</h1>
                  <div>
                    <div className="inventoryMaster-notActive-cell">
                      <div>ร่าง</div>
                    </div>
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
                        error={values.remark === "" && errorRemark}
                        helperText={values.remark && errorRemark && "กรุณากรอก"}
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
                                  <td>{item.itemID}</td>
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
                                          lineID: i,
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
                                      <td>{subItem.itemID}</td>
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
                                      <td>{values.warehouseID}</td>
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
                                                values.lineItem[i].transaction[
                                                  subIndex
                                                ],
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
                                            const clone = [...values.lineItem];
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
                  <ButtonComponent
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
                            binLocationID: `AA|${val.pallete}`,
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
                        data.transaction.some((data2) => data2.quantity === "")
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
                      isActive={false}
                      title="ยืนยัน"
                    />
                  </ul>
                </div>
                <div className="inventory-title-grid">
                  <h1>สร้างรายการนำเข้า</h1>
                  <div>
                    <div className="inventoryMaster-notActive-cell">
                      <div>ร่าง</div>
                    </div>
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
                  <div className="radio-layout">
                    <FormControl component="fieldset">
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
                        error={values.remark === "" && errorRemark}
                        helperText={values.remark && errorRemark && "กรุณากรอก"}
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
                                <tr
                                  key={i}
                                  style={{
                                    backgroundColor: "rgba(195, 220, 167, 1)",
                                  }}
                                >
                                  <td>{i + 1}</td>
                                  <td>{item.itemID}</td>
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
                                      <td>{subItem.itemID}</td>
                                      <td></td>
                                      <td>{subItem.quantity}</td>
                                      <td></td>
                                      <td></td>
                                      <td>{subItem.uomID}</td>
                                      <td>{values.warehouseID}</td>
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
          </Form>
        )}
      </Formik>
    </div>
  );
}
