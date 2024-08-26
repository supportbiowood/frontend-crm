import {
  Backdrop,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import moment from "moment";
import React, { useState, useEffect } from "react";
import BreadcrumbComponent from "../../../../BreadcrumbComponent";
import AccountDateComponent from "../../../AccountDateComponent";
import AccountSplitButtonComponent from "../../../AccountSplitButtonComponent";
import { renderStatus } from "../../../renderStatus";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { initialValues, validationSchema } from "./payload";
import { useFormik } from "formik";
import {
  getRemarkTemplate,
  getPurchaseOrderById,
  updatePurchaseOrder,
  postPurchaseOrder,
  cancelPurchaseOrder,
  postPurchaseInvoiceFromPurchaseOrder,
  getContactOption,
  copyPurchaseOrder,
} from "../../../../../adapter/Api";
import AccountTableDataPurchaseComponent from "../../../AccountTableDataPurchaseComponent";
import AccountTemplateComponent from "../../../AccountTemplateComponent";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import { useDispatch } from "react-redux";
import AccountConfirmationComponent from "../../../AccountConfirmationComponent";
import { disabledStatus } from "./disabledStatus.js";
import ImportTabComponent from "./ImportTabComponent";
import AccountImportComponent from "../../../AccountImportComponent";
import AccountSummaryComponent from "../../../AccountSummaryComponent";
import AccountVendorComponent from "../../../AccountVendorComponent";
import {
  actionType,
  dateToUnix,
  unixToDate,
} from "../../../../../adapter/Utils";
import {
  createGoodReceiptItem,
  getListWareHouse,
} from "../../../../../adapter/Api/graphql";
import PurchaseInvoiceTab from "./PurchaseInvoiceTab";
import PurchaseReturnTab from "./PurchaseReturnTab";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const AddPurchaseOrderComponent = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const [purchaseOrderDocumentId, setPurchaseOrderDocumentId] = useState("-");
  const [purchaseOrderId, setPurchaseOrderId] = useState();
  const [purchaseOrderData, setPurchaseOrderData] = useState(initialValues);
  const [editButtonClick, setEditButtonClick] = useState(false);
  const [status, setStatus] = useState("create");
  const [disabled, setDisabled] = useState({
    print: true,
    options: true,
    create: true,
    editButton: true,
    cancelButton: true,
    date: true,
    externalRef: true,
    target: true,
    vendor: true,
    items: true,
    remark: true,
    summary: true,
  });
  const [allTemplate, setAllTemplate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [cancelConfirmation, setCancelConfirmation] = useState(false);
  const [copyConfirmation, setCopyConfirmation] = useState(false);
  const [notApproveConfirmation, setNotApproveConfirmation] = useState(false);
  const [importDocument, setImportDocument] = useState(false);
  const [selectedImportDocument, setSelectedImportdocument] = useState([]);
  const [wareHouseList, setWareHouseList] = useState([]);
  const [contacts, setContacts] = useState([]);

  const handleChange = (_, newValue) => {
    setTabValue(newValue);
  };

  const [anchorPrintEl, setAnchorPrintEl] = useState(null);
  const [anchorOptionEl, setAnchorOptionEl] = useState(null);
  const [anchorCreateEl, setAnchorCreateEl] = useState(null);

  const openPrint = Boolean(anchorPrintEl);
  const openOption = Boolean(anchorOptionEl);
  const openCreate = Boolean(anchorCreateEl);

  const handleOpenPrintMenu = (event) => {
    setAnchorPrintEl(event.currentTarget);
  };

  const handleOpenOptionMenu = (event) => {
    setAnchorOptionEl(event.currentTarget);
  };

  const handleOpenCreateMenu = (event) => {
    setAnchorCreateEl(event.currentTarget);
  };

  const handleClosePrintMenu = () => {
    setAnchorPrintEl(null);
  };

  const handleCloseOptionMenu = () => {
    setAnchorOptionEl(null);
  };

  const handleCloseCreateMenu = () => {
    setAnchorCreateEl(null);
  };

  useEffect(() => {
    disabledStatus(status, setDisabled, editButtonClick);
  }, [status, editButtonClick]);

  useEffect(() => {
    const getWareHouse = getListWareHouse();
    const getRemarks = getRemarkTemplate();
    const getContacts = getContactOption(["vendor"]);
    if (id) {
      setIsLoading(true);
      const getPurchaseOrder = getPurchaseOrderById(id);
      Promise.all([getWareHouse, getRemarks, getContacts, getPurchaseOrder])
        .then((values) => {
          if (values[0].status === 200) {
            let myData = values[0].data.data;
            const listWareHouse = myData.listWarehouse.items;
            setWareHouseList(listWareHouse);
          }
          if (values[1].data.status === "success") {
            let myData = values[1].data.data;
            setAllTemplate(myData);
          }
          if (values[2].data.status === "success") {
            let myData = values[2].data.data;
            setContacts(myData);
          }
          if (values[3].data.status === "success") {
            let myData = values[3].data.data;
            setPurchaseOrderData(myData);
            setStatus(myData.purchase_order_status);
            setPurchaseOrderId(myData.purchase_order_id);
            setPurchaseOrderDocumentId(myData.purchase_order_document_id);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    } else if (location.state) {
      let itemData = [];
      const purchaseOrderList = location.state.purchase_order_data;
      purchaseOrderList.forEach((document) => {
        itemData.push(document);
      });
      setIsLoading(true);
      Promise.all([getRemarks, getContacts, getWareHouse]).then((values) => {
        if (values[0].data.status === "success") {
          let myData = values[0].data.data;
          setAllTemplate(myData);
        }
        if (values[1].data.status === "success") {
          let myData = values[1].data.data;
          setContacts(myData);
        }
        if (values[2].status === 200) {
          let myData = values[2].data.data;
          const listWareHouse = myData.listWarehouse.items;
          setWareHouseList(listWareHouse);
        }
        setPurchaseOrderData((prev) => {
          return {
            ...prev,
            purchase_request_document_id_list:
              location.state.purchase_request_document_id_list,
            sales_order_project_list: location.state.sales_order_project_list,
            inventory_target: location.state.inventory_target,
            purchase_order_data: location.state.purchase_order_data,
            purchase_order_issue_date: moment().format(),
            purchase_order_due_date: moment().add(7, "days").format(),
            purchase_order_expect_date: moment().add(7, "days").format(),
          };
        });
        setIsLoading(false);
      });
    } else {
      setIsLoading(true);
      Promise.all([getRemarks, getContacts, getWareHouse])
        .then((values) => {
          if (values[0].data.status === "success") {
            let myData = values[0].data.data;
            setAllTemplate(myData);
          }
          if (values[1].data.status === "success") {
            let myData = values[1].data.data;
            setContacts(myData);
          }
          if (values[2].status === 200) {
            let myData = values[2].data.data;
            const listWareHouse = myData.listWarehouse.items;
            setWareHouseList(listWareHouse);
          }
          setPurchaseOrderData((prev) => {
            return {
              ...prev,
              purchase_order_issue_date: moment().format(),
              purchase_order_due_date: moment().add(7, "days").format(),
              purchase_order_expect_date: moment().add(7, "days").format(),
            };
          });
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }
  }, [location.state, id]);

  const formik = useFormik({
    initialValues:
      id &&
      purchaseOrderData.purchase_order_issue_date &&
      purchaseOrderData.purchase_order_due_date &&
      purchaseOrderData.purchase_order_expect_date
        ? {
            ...purchaseOrderData,
            purchase_order_issue_date: unixToDate(
              purchaseOrderData.purchase_order_issue_date
            ),
            purchase_order_due_date: unixToDate(
              purchaseOrderData.purchase_order_due_date
            ),
            purchase_order_expect_date: unixToDate(
              purchaseOrderData.purchase_order_expect_date
            ),
          }
        : purchaseOrderData,
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const postPayload = {
        ...formik.values,
        purchase_order_id: purchaseOrderId,
        purchase_order_document_id: purchaseOrderDocumentId,
        purchase_order_issue_date: dateToUnix(
          formik.values.purchase_order_issue_date
        ),
        purchase_order_due_date: dateToUnix(
          formik.values.purchase_order_due_date
        ),
        purchase_order_expect_date: dateToUnix(
          formik.values.purchase_order_expect_date
        ),
      };

      delete postPayload.importer_list;
      delete postPayload.purchase_invoice_list;
      delete postPayload.purchase_return_list;
      delete postPayload.action;

      switch (values.action) {
        case actionType.saveToDraft:
          setIsLoading(true);
          if (purchaseOrderDocumentId !== "-") {
            console.log("updated");
            updatePurchaseOrder("", purchaseOrderDocumentId, postPayload)
              .then((data) => {
                setStatus("draft");
                dispatch(showSnackbar(data.data.status, "บันทึกร่างสำเร็จ"));
                setIsLoading(false);
              })
              .catch((err) => {
                dispatch(
                  showSnackbar(
                    "error",
                    `บันทึกร่างไม่สำเร็จ`,
                    err.response.data.message.split(":")[1]
                  )
                );
                setIsLoading(false);
              });
          } else {
            postPurchaseOrder("", postPayload)
              .then((data) => {
                setStatus("draft");
                if (data.data.data.insertId && data.data.data.documentId) {
                  setPurchaseOrderId(data.data.data.insertId);
                  setPurchaseOrderDocumentId(data.data.data.documentId);
                  history.push(
                    `/expense/purchase-order/${data.data.data.documentId}`
                  );
                }
                dispatch(showSnackbar(data.data.status, "บันทึกร่างสำเร็จ"));
                if (id) setIsLoading(false);
              })
              .catch((err) => {
                dispatch(
                  showSnackbar(
                    "error",
                    `บันทึกร่างไม่สำเร็จ`,
                    err.response.data.message.split(":")[1]
                  )
                );
                setIsLoading(false);
              });
          }
          break;
        case actionType.sendToApprove:
          setIsLoading(true);
          postPurchaseOrder("wait_approve", postPayload)
            .then((data) => {
              setStatus("wait_approve");
              if (data.data.data.insertId && data.data.data.documentId) {
                setPurchaseOrderId(data.data.data.insertId);
                setPurchaseOrderDocumentId(data.data.data.documentId);
                history.push(
                  `/expense/purchase-order/${data.data.data.documentId}`
                );
              }
              dispatch(showSnackbar(data.data.status, "ส่งอนุมัติสำเร็จ"));
              if (id) setIsLoading(false);
            })
            .catch((err) => {
              dispatch(
                showSnackbar(
                  "error",
                  `อนุมัติไม่สำเร็จ`,
                  err.response.data.message.split(":")[1]
                )
              );
              setIsLoading(false);
            });
          break;
        case actionType.approve:
          setIsLoading(true);
          postPurchaseOrder("approve", postPayload)
            .then((data) => {
              setStatus("approved");
              dispatch(showSnackbar(data.data.status, "อนุมัติสำเร็จ"));
              setIsLoading(false);
            })
            .catch(() => {
              dispatch(showSnackbar("error", "อนุมัติไม่สำเร็จ"));
              setIsLoading(false);
            });
          break;
        case actionType.notApprove:
          setIsLoading(true);
          updatePurchaseOrder(
            "not_approve",
            purchaseOrderDocumentId,
            postPayload
          )
            .then((data) => {
              setStatus("not_approve");
              dispatch(showSnackbar(data.data.status, "ไม่อนุมัติสำเร็จ"));
              setIsLoading(false);
            })
            .catch((err) => {
              console.log(err.response.data);
              dispatch(showSnackbar("error", "ไม่อนุมัติไม่สำเร็จ"));
              setIsLoading(false);
            });
          break;
        case actionType.edit:
          setIsLoading(true);
          postPurchaseOrder("wait_approve", postPayload)
            .then((data) => {
              setStatus("wait_approve");
              if (data.data.data.insertId && data.data.data.documentId) {
                setPurchaseOrderId(data.data.data.insertId);
                setPurchaseOrderDocumentId(data.data.data.documentId);
              }
              setIsLoading(false);
              setEditButtonClick(false);
            })
            .catch((err) => {
              dispatch(
                showSnackbar(
                  "error",
                  `บันทึกไม่สำเร็จ`,
                  err.response.data.message.split(":")[1]
                )
              );
              setIsLoading(false);
            });
          break;
        default:
          return;
      }
    },
  });

  const handleStartDateChange = (newValue) => {
    formik.setFieldValue("purchase_order_issue_date", newValue);
  };

  const handleEndDateChange = (newValue) => {
    formik.setFieldValue("purchase_order_due_date", newValue);
  };

  const handleSentDateChange = (newValue) => {
    formik.setFieldValue("purchase_order_expect_date", newValue);
  };

  const postPayload = {
    ...formik.values,
    purchase_order_id: purchaseOrderId,
    purchase_order_document_id: purchaseOrderDocumentId,
    purchase_order_issue_date: dateToUnix(
      formik.values.purchase_order_issue_date
    ),
    purchase_order_due_date: dateToUnix(formik.values.purchase_order_due_date),
    purchase_order_expect_date: dateToUnix(
      formik.values.purchase_order_expect_date
    ),
  };

  delete postPayload.importer_list;
  delete postPayload.purchase_invoice_list;
  delete postPayload.purchase_return_list;

  const saveDraftHandler = () => {
    formik.setFieldValue("action", actionType.saveToDraft);
  };

  const sendToApprove = () => {
    formik.setFieldValue("action", actionType.sendToApprove);
  };

  const approveHandler = () => {
    formik.setFieldValue("action", actionType.approve);
  };

  const notApproveHandler = () => {
    openNotApproveConfirmationHandler();
  };

  const openNotApproveConfirmationHandler = () => {
    setNotApproveConfirmation(true);
  };

  const closeNotApproveConfirmationHandler = () => {
    setNotApproveConfirmation(false);
  };

  const submitNotApproveConfirmationHandler = () => {
    setNotApproveConfirmation(false);
    formik.setFieldValue("action", actionType.notApprove);
    formik.submitForm();
  };

  const openImportDocumentHandler = () => {
    setImportDocument(true);
  };

  const closeImportDocumentHandler = () => {
    setImportDocument(false);
  };

  const openCopyConfirmationHandler = () => {
    setCopyConfirmation(true);
  };

  const closeCopyConfirmationHandler = () => {
    setCopyConfirmation(false);
  };

  const submitCopyConfirmationHandler = () => {
    setCopyConfirmation(false);
    setIsLoading(true);
    copyPurchaseOrder(purchaseOrderDocumentId)
      .then((data) => {
        history.push("/expense/purchase-order/add");
        dispatch(showSnackbar(data.data.status, "ตัดลอกใบสั่งซื้อสำเร็จ"));
        setStatus("create");
        setPurchaseOrderId();
        setPurchaseOrderDocumentId("-");
        setPurchaseOrderData({
          ...data.data.data,
          purchase_order_issue_date: moment().format(),
          purchase_order_due_date: moment().add(7, "days").format(),
          purchase_order_expect_date: moment().add(7, "days").format(),
        });
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "ตัดลอกใบสั่งซื้อไม่สำเร็จ"));
        console.log(err.response.data);
        setIsLoading(false);
      });
  };

  const openCancelConfirmationHandler = () => {
    setCancelConfirmation(true);
  };

  const closeCancelConfirmationHandler = () => {
    setCancelConfirmation(false);
  };

  const submitCancelConfirmationHandler = () => {
    setCancelConfirmation(false);
    setIsLoading(true);
    cancelPurchaseOrder(purchaseOrderDocumentId)
      .then((data) => {
        console.log(data);
        setStatus("cancelled");
        dispatch(showSnackbar("success", "ยกเลิกใบสั่งซื้อสำเร็จ"));
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(
          showSnackbar(
            "error",
            `ยกเลิกใบสั่งซื้อไม่สำเร็จ`,
            err.response.data.message.split(":")[1]
          )
        );
        setIsLoading(false);
        console.log(err);
      });
  };

  const submitImportDocumentHandler = () => {
    setImportDocument(false);
    const itemData = [];
    const projectList = [];
    const existingDocumentId = [
      ...formik.values.purchase_request_document_id_list,
    ];
    const existingProjectList = [...formik.values.sales_order_project_list];
    const existingItems = [
      ...formik.values.purchase_order_data.filter(
        (data) => data.item_id.length !== 0
      ),
    ];

    const purchaseRequestDocumentIdList = selectedImportDocument.map(
      (document) => document.purchase_request_document_id
    );

    const isSomeMatch = purchaseRequestDocumentIdList.some((element) => {
      return existingDocumentId.includes(element);
    });

    if (isSomeMatch) {
      dispatch(showSnackbar("error", "ไม่สามารถเลือกรายการซ้ำได้"));
    } else {
      selectedImportDocument.forEach((document) => {
        document.purchase_request_data.forEach((list) => {
          itemData.push(list);
        });
      });

      selectedImportDocument.forEach((document) => {
        document.sales_order_project_list.forEach((list) => {
          projectList.push(list);
        });
      });

      const filterProjectList = projectList.filter(
        (project) =>
          project.project_id.length !== 0 && project.project_name !== 0
      );

      const allDocumentId = existingDocumentId.concat(
        purchaseRequestDocumentIdList
      );
      const allProjectList = existingProjectList.concat(filterProjectList);
      const allData = existingItems.concat(itemData);

      const uniqueProjectList = [
        ...new Map(
          allProjectList.map((project) => [project["project_name"], project])
        ).values(),
      ];

      formik.setFieldValue("purchase_request_document_id_list", allDocumentId);
      formik.setFieldValue("sales_order_project_list", uniqueProjectList);
      formik.setFieldValue("purchase_order_data", allData);
    }
  };

  const printItemsHandler = (_, index) => {
    if (index === 0) {
      setAnchorPrintEl(null);
      history.push(`/expense/purchase-order/${purchaseOrderDocumentId}/pdf`);
    }
  };

  const optionItemsHandler = (_, index) => {
    if (index === 0) {
      setAnchorOptionEl(null);
      openCancelConfirmationHandler();
    } else if (index === 1) {
      setAnchorOptionEl(null);
      if (status === "not_approve") {
        setStatus("wait_approve");
        setEditButtonClick(true);
      } else {
        setEditButtonClick(true);
      }
    } else {
      setAnchorOptionEl(null);
      openCopyConfirmationHandler();
    }
  };

  const createItemsHandler = (_, index) => {
    if (index === 0) {
      setAnchorCreateEl(null);
      const payload = {
        listDocumentAttachment: [],
        status: "DRAFT",
        txSeries: 0,
        documentDate: moment().tz("Asia/Bangkok").format("YYYY-MM-DD"),
        // createdAt: moment(values.createdAt)
        //   .tz("Asia/Bangkok")
        //   .format("YYYY-MM-DD"),
        receiptType: "PURCHASE",
        lineItem: formik.values.purchase_order_data.map((val, index) => {
          return {
            lineID: index + 1,
            sortNo: index,
            quantityReference: val.item_quantity,
            quantity: 0,
            perUnitPrice: val.item_price,
            itemID: val.item_id,
            uomID: val.item_unit,
            warehouseID: formik.values.inventory_target,
          };
        }),
        listDocumentReference: [
          {
            txSeries: 0,
            documentID: purchaseOrderDocumentId,
          },
        ],
      };
      createGoodReceiptItem({
        input: payload,
      }).then((data) => {
        const formatData = data.data.data.createGoodsReceiptDocument;
        if (formatData !== null) {
          const txSeries = formatData.txSeries;
          const id = formatData.id;
          window.open(`/inventory/good-recieve/${txSeries}&${id}`);
        } else {
          dispatch(showSnackbar("error", "สร้างใบนำเข้าไม่สำเร็จ"));
        }
      });
    } else if (index === 1) {
      postPurchaseInvoiceFromPurchaseOrder(purchaseOrderDocumentId)
        .then((data) => {
          let myData = data.data.data;
          history.push(`/expense/purchase-invoice/add`, myData);
        })
        .catch((err) => {
          console.log(err.data.response);
        });
      setAnchorCreateEl(null);
    } else if (index === 2) {
      history.push(`/expense/purchase-return/add`, postPayload);
      setAnchorCreateEl(null);
    }
  };

  const editCancelled = () => {
    setEditButtonClick(false);
    setIsLoading(true);
    getPurchaseOrderById(purchaseOrderDocumentId)
      .then((data) => {
        if (data.data.status === "success") {
          const myData = data.data.data;
          const currentTimestamp = moment().unix();
          const formatData = {
            ...myData,
            purchase_order_issue_date: unixToDate(
              myData.purchase_order_issue_date
            ),
            purchase_order_due_date: unixToDate(myData.purchase_order_due_date),
            purchase_order_expect_date: unixToDate(
              myData.purchase_order_expect_date
            ),
            purchase_order_status:
              myData.purchase_order_due_date < currentTimestamp &&
              myData.purchase_order_status !== "closed"
                ? "expired"
                : myData.purchase_order_status,
          };
          formik.setValues(formatData);
          setStatus(formatData.purchase_order_status);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err.response.data);
      });
  };

  const editFinished = () => {
    formik.setFieldValue("action", actionType.edit);
  };

  const clickDocumentRefHandler = (documentId) => {
    history.push(`/expense/purchase-request/${documentId}`);
  };

  const deleteDocumentRefHandler = (documentId) => {
    const currentDocuments = formik.values.purchase_request_document_id_list;
    const removedDocument = currentDocuments.filter(
      (document) => document !== documentId
    );
    formik.setFieldValue("purchase_request_document_id_list", removedDocument);
  };

  const clickProjectRefHandler = (projectId) => {
    history.push(`/sales/project/${projectId}`);
  };

  const deleteProjectRefHandler = (projectId) => {
    const currentProjects = formik.values.sales_order_project_list;
    const removedProject = currentProjects.filter(
      (projects) => projects.project_id !== projectId
    );
    formik.setFieldValue("sales_order_project_list", removedProject);
  };

  const currentTimestamp = moment().unix();

  const addItemHandler = () => {
    formik.setFieldValue(
      "purchase_order_data",
      formik.values.purchase_order_data.concat({
        vat: "NONE",
        item_id: "",
        item_name: "",
        item_unit: "",
        item_price: 0,
        discount_list: [
          {
            amount: 0,
            percent: 0,
          },
        ],
        qa_quantity: 0,
        item_quantity: 0,
        pre_vat_amount: 0,
        total_discount: 0,
        item_description: "",
        item_withholding_tax: {
          tax: "ยังไม่ระบุ",
          withholding_tax_amount: "0",
        },
        item_account: "",
      })
    );
  };

  return (
    <>
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <BreadcrumbComponent name="รายจ่าย" to="/expense" />
        <BreadcrumbComponent name="ใบสั่งซื้อ" to="/expense/purchase-order" />
        {purchaseOrderDocumentId !== "-" ? (
          <BreadcrumbComponent
            name={purchaseOrderDocumentId}
            to={"/expense/purchase-order/" + purchaseOrderDocumentId}
          />
        ) : (
          <BreadcrumbComponent
            name="เพิ่มใบสั่งซื้อ"
            to="/income/purchase-order/add"
          />
        )}
      </Breadcrumbs>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "#419644",
          width: "fit-content",
          margin: "0 auto",
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleChange}
          TabIndicatorProps={{
            sx: {
              backgroundColor: "#419644",
            },
          }}
          aria-label="basic tabs example"
        >
          <Tab
            sx={{ color: "#419644 !important" }}
            label="ข้อมูลเอกสาร"
            {...a11yProps(0)}
          />
          <Tab
            sx={
              !purchaseOrderData.importer_list ||
              purchaseOrderData.importer_list.length === 0
                ? {
                    cursor: "not-allowed !important",
                    pointerEvents: "all !important",
                  }
                : { color: "#419644 !important" }
            }
            label="การนำเข้า"
            disabled={
              !purchaseOrderData.importer_list ||
              purchaseOrderData.importer_list.length === 0
            }
            {...a11yProps(1)}
          />
          <Tab
            sx={
              !purchaseOrderData.purchase_invoice_list ||
              purchaseOrderData.purchase_invoice_list.length === 0
                ? {
                    cursor: "not-allowed !important",
                    pointerEvents: "all !important",
                  }
                : { color: "#419644 !important" }
            }
            label="บันทึกซื้อ"
            disabled={
              !purchaseOrderData.purchase_invoice_list ||
              purchaseOrderData.purchase_invoice_list.length === 0
            }
            {...a11yProps(2)}
          />
          <Tab
            sx={
              !purchaseOrderData.purchase_return_list ||
              purchaseOrderData.purchase_return_list.length === 0
                ? {
                    cursor: "not-allowed !important",
                    pointerEvents: "all !important",
                  }
                : { color: "#419644 !important" }
            }
            label="ใบส่งคืน"
            disabled={
              !purchaseOrderData.purchase_return_list ||
              purchaseOrderData.purchase_return_list.length === 0
            }
            {...a11yProps(3)}
          />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <div className="account__formHeader-primary">
          <div className="account__formHeader-labelContainer">
            <h2 className="form-heading">ใบสั่งซื้อ</h2>
            {renderStatus(status)}
            {dateToUnix(formik.values.purchase_order_due_date) <
              currentTimestamp &&
              formik.values.purchase_order_status !== "fully_import" &&
              !isLoading &&
              renderStatus("expired")}
          </div>
          <div className="account__buttonContainer">
            <AccountSplitButtonComponent
              disabled={disabled.print}
              defaultButtonValue="พิมพ์เอกสาร"
              options={["พิมพ์ใบสั่งซื้อ"]}
              handleMenuItemClick={printItemsHandler}
              open={openPrint}
              anchorEl={anchorPrintEl}
              handleOpen={handleOpenPrintMenu}
              handleClose={handleClosePrintMenu}
              variant="outlined"
            />
            <AccountSplitButtonComponent
              disabled={disabled.options}
              disabledCancelButton={disabled.cancelButton}
              disabledEditButton={disabled.editButton}
              defaultButtonValue="ตัวเลือก"
              options={["ยกเลิก", "แก้ไข", "คัดลอก"]}
              handleMenuItemClick={optionItemsHandler}
              open={openOption}
              anchorEl={anchorOptionEl}
              handleOpen={handleOpenOptionMenu}
              handleClose={handleCloseOptionMenu}
              variant="outlined"
            />
            <AccountSplitButtonComponent
              disabled={disabled.create}
              defaultButtonValue="สร้าง"
              options={["ใบนำเข้า", "ใบบันทึกซื้อ", "ใบส่งคืน"]}
              handleMenuItemClick={createItemsHandler}
              open={openCreate}
              anchorEl={anchorCreateEl}
              handleOpen={handleOpenCreateMenu}
              handleClose={handleCloseCreateMenu}
              variant="contained"
            />
          </div>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="account__formHeader-secondary">
            <div className="account__formHeader-document">
              <h4>เลขที่เอกสาร</h4>
              <p>{purchaseOrderDocumentId}</p>
            </div>
            <div className="account__formHeader-datetime">
              <AccountDateComponent
                disabled={disabled.date}
                startDateLabel="วันที่ออกเอกสาร"
                endDateLabel="ต้องการภายในวันที่"
                sentDateLabel="วันประมาณการณ์สินค้าเข้า"
                startDateValue={formik.values.purchase_order_issue_date}
                endDateValue={formik.values.purchase_order_due_date}
                sentDateValue={formik.values.purchase_order_expect_date}
                startDateName="purchase_order_issue_date"
                endDateName="purchase_order_due_date"
                sentDateName="purchase_order_expect_date"
                handleStartDateChange={handleStartDateChange}
                handleEndDateChange={handleEndDateChange}
                handleSentDateChange={handleSentDateChange}
              />
            </div>
          </div>
          {formik.values.purchase_request_document_id_list &&
            formik.values.purchase_request_document_id_list.length > 0 && (
              <div className="account__refDocumentChip">
                <h4>อ้างอิงถึง</h4>
                {formik.values.purchase_request_document_id_list.map(
                  (document) => (
                    <Chip
                      key={document}
                      sx={{ fontSize: "1rem", padding: ".25rem" }}
                      color="success"
                      label={document}
                      variant="outlined"
                      onClick={() => clickDocumentRefHandler(document)}
                      onDelete={
                        status === "create" || status === "draft"
                          ? () => deleteDocumentRefHandler(document)
                          : null
                      }
                    />
                  )
                )}
              </div>
            )}
          {formik.values.sales_order_project_list &&
            formik.values.sales_order_project_list.length > 0 && (
              <div className="account__refDocumentChip">
                <h4>โครงการที่เกี่ยวข้อง</h4>
                {formik.values.sales_order_project_list.map((document) => (
                  <Chip
                    key={document.project_id}
                    sx={{ fontSize: "1rem", padding: ".25rem" }}
                    color="success"
                    label={document.project_name}
                    variant="outlined"
                    onClick={() => clickProjectRefHandler(document.project_id)}
                    onDelete={
                      status === "create" || status === "draft"
                        ? () => deleteProjectRefHandler(document.project_id)
                        : null
                    }
                  />
                ))}
              </div>
            )}
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                <TextField
                  autoComplete="off"
                  type="text"
                  id="external_ref_document_id"
                  name="external_ref_document_id"
                  value={formik.values.external_ref_document_id}
                  onChange={formik.handleChange}
                  disabled={disabled.externalRef}
                  size="small"
                  label="หมายเลขอ้างอิง/เลขที่ใบเสนอราคา"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                <FormControl fullWidth size="small">
                  <InputLabel
                    disabled={disabled.target}
                    id="demo-simple-select-label"
                  >
                    คลังปลายทาง
                  </InputLabel>
                  <Select
                    disabled={disabled.target}
                    name="inventory_target"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={formik.values.inventory_target}
                    label="คลังปลายทาง"
                    onChange={formik.handleChange}
                    required
                  >
                    {wareHouseList.map((value) => (
                      <MenuItem key={value.id} value={value.id}>
                        {value.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
          <AccountVendorComponent
            accountPurchase
            disabled={disabled.vendor}
            formik={formik}
            contacts={contacts}
            contactId={formik.values.vendor_info.contact_id}
          />
          <Box sx={{ display: "flex", mb: 3, gap: ".5rem" }}>
            <Button
              disabled={disabled.items}
              variant="contained"
              onClick={addItemHandler}
            >
              เพิ่มสินค้า
            </Button>
            <Button
              disabled={disabled.items}
              variant="contained"
              onClick={openImportDocumentHandler}
            >
              นำเข้าใบขอซื้อ
            </Button>
          </Box>
          <AccountTableDataPurchaseComponent
            data={formik.values.purchase_order_data}
            formik={formik}
            name="purchase_order_data"
            disabled={disabled.items}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <AccountTemplateComponent
                disabled={disabled.remark}
                remarkId={formik.values.purchase_order_template_remark_id}
                formik={formik}
                allTemplate={allTemplate}
                id="purchase_order_template_remark_id"
                detail="purchase_order_remark"
                remark={formik.values.purchase_order_remark}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <AccountSummaryComponent
                summary
                disabled={disabled.summary}
                data={formik.values.purchase_order_data}
                formik={formik}
                tableType="purchase"
                noShipping
              />
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              gap: "1rem",
            }}
          >
            {(status === "create" ||
              status === "draft" ||
              status === "not_approve") && (
              <>
                <Button
                  type="submit"
                  variant="contained"
                  onClick={saveDraftHandler}
                >
                  บันทึกร่าง
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  onClick={sendToApprove}
                >
                  ส่ง
                </Button>
              </>
            )}
            {status === "wait_approve" &&
              (editButtonClick ? (
                <>
                  <Button variant="contained" onClick={editCancelled}>
                    ยกเลิก
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    onClick={editFinished}
                  >
                    บันทึก
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="contained" onClick={notApproveHandler}>
                    ไม่อนุมัติ
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    onClick={approveHandler}
                  >
                    อนุมัติ
                  </Button>
                </>
              ))}
          </Box>
          {cancelConfirmation && (
            <AccountConfirmationComponent
              open={cancelConfirmation}
              handleClose={closeCancelConfirmationHandler}
              handleSubmit={submitCancelConfirmationHandler}
              title="ยืนยันการยกเลิกใบสั่งซื้อ"
              description="หากยกเลิกแล้วจะไม่สามารถเปลี่ยนแปลงรายการได้"
            />
          )}
          {copyConfirmation && (
            <AccountConfirmationComponent
              open={copyConfirmation}
              handleClose={closeCopyConfirmationHandler}
              handleSubmit={submitCopyConfirmationHandler}
              title="ยืนยันการคัดลอกใบสั่งซื้อ"
            />
          )}
          {notApproveConfirmation && (
            <AccountConfirmationComponent
              open={notApproveConfirmation}
              handleClose={closeNotApproveConfirmationHandler}
              handleSubmit={submitNotApproveConfirmationHandler}
              title="ไม่อนุมัติใบสั่งซื้อ"
              description="กรุณาระบุหมายเหตุในการไม่อนุมัติใบสั่งซื้อ"
              reason
              formik={formik}
            />
          )}
        </form>
        <AccountImportComponent
          open={importDocument}
          setSelectedImportdocument={setSelectedImportdocument}
          handleClose={closeImportDocumentHandler}
          handleSubmit={submitImportDocumentHandler}
          title="เลือกจากใบขอซื้อ"
          submitButtonLabel="นำเข้าใบขอซื้อ"
          purchaseRequest
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <ImportTabComponent importerList={purchaseOrderData.importer_list} />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <PurchaseInvoiceTab
          purchaseInvoiceList={purchaseOrderData.purchase_invoice_list}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <PurchaseReturnTab
          purchaseReturnList={purchaseOrderData.purchase_return_list}
        />
      </TabPanel>
    </>
  );
};

export default AddPurchaseOrderComponent;
