import {
  Backdrop,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Chip,
  Divider,
  Grid,
  Tab,
  Tabs,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  getPurchaseRequestById,
  cancelPurchaseRequest,
  copyPurchaseRequest,
  postPurchaseRequest,
  updatePurchaseRequest,
  postPurchaseOrderFromPurchaseRequest,
} from "../../../../../adapter/Api";
import AccountTableDataPurchaseComponent from "../../../AccountTableDataPurchaseComponent";
import AccountTemplateComponent from "../../../AccountTemplateComponent";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import { useDispatch } from "react-redux";
import AccountConfirmationComponent from "../../../AccountConfirmationComponent";
import { disabledStatus } from "./disabledStatus.js";
import PurchaseOrderTabComponent from "./PurchaseOrderTabComponent";
import AccountImportComponent from "../../../AccountImportComponent";
import {
  actionType,
  dateToUnix,
  unixToDate,
} from "../../../../../adapter/Utils";
import { getListWareHouse } from "../../../../../adapter/Api/graphql";

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

const AddPurchaseRequestComponent = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const [purchaseRequestDocumentId, setPurchaseRequestDocumentId] =
    useState("-");
  const [purchaseRequestId, setPurchaseRequestId] = useState();
  const [purchaseRequestData, setPurchaseRequestData] = useState(initialValues);
  const [editButtonClick, setEditButtonClick] = useState(false);
  const [status, setStatus] = useState("create");
  const [disabled, setDisabled] = useState({
    print: true,
    options: true,
    create: true,
    editButton: true,
    cancelButton: true,
    date: true,
    target: true,
    items: true,
    remark: true,
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
    const getRemarks = getRemarkTemplate();
    const getWareHouse = getListWareHouse();
    if (id) {
      setIsLoading(true);
      const getPurchaseRequest = getPurchaseRequestById(id);
      Promise.all([getWareHouse, getRemarks, getPurchaseRequest])
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
            setPurchaseRequestData(myData);
            setStatus(myData.purchase_request_status);
            setPurchaseRequestId(myData.purchase_request_id);
            setPurchaseRequestDocumentId(myData.purchase_request_document_id);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    } else if (location.state) {
      if (location.state.sales_order_document_id) {
        let itemData = [];
        const salesOrderList = location.state.sales_order_data;
        const salesOrderCategory =
          salesOrderList && salesOrderList.map((list) => list.category_list);
        salesOrderCategory.forEach((categoryGroup) => {
          categoryGroup.forEach((category) => {
            category.item_data.forEach((item) => {
              itemData.push({
                ...item,
                qa_quantity: item.item_quantity,
                item_quantity: "",
              });
            });
          });
        });
        const salesOrderDocumentIdList = new Array(
          location.state.sales_order_document_id
        );
        const salesOrderProjectList = new Array({
          project_id: location.state.billing_info.project_id,
          project_name: location.state.billing_info.project_name,
        });
        const uniqueProjectList = [
          ...new Map(
            salesOrderProjectList.map((project) => [
              project["project_name"],
              project,
            ])
          ).values(),
        ];
        setIsLoading(true);
        Promise.all([getRemarks, getWareHouse]).then((values) => {
          if (values[0].data.status === "success") {
            let myData = values[0].data.data;
            setAllTemplate(myData);
          }
          if (values[1].status === 200) {
            let myData = values[1].data.data;
            const listWareHouse = myData.listWarehouse.items;
            setWareHouseList(listWareHouse);
          }
          setPurchaseRequestData((prev) => ({
            ...prev,
            sales_order_document_id_list: salesOrderDocumentIdList,
            sales_order_project_list: uniqueProjectList,
            purchase_request_issue_date: moment().format(),
            purchase_request_due_date: moment().add(7, "days").format(),
            purchase_request_data: itemData,
          }));
          setIsLoading(false);
        });
      }
    } else {
      setIsLoading(true);
      Promise.all([getRemarks, getWareHouse])
        .then((values) => {
          if (values[0].data.status === "success") {
            let myData = values[0].data.data;
            setAllTemplate(myData);
          }
          if (values[1].status === 200) {
            let myData = values[1].data.data;
            const listWareHouse = myData.listWarehouse.items;
            setWareHouseList(listWareHouse);
          }
          setPurchaseRequestData((prev) => {
            return {
              ...prev,
              purchase_request_issue_date: moment().format(),
              purchase_request_due_date: moment().add(7, "days").format(),
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
      purchaseRequestData.purchase_request_issue_date &&
      purchaseRequestData.purchase_request_due_date &&
      !isNaN(purchaseRequestData.purchase_request_issue_date) &&
      !isNaN(purchaseRequestData.purchase_request_due_date)
        ? {
            ...purchaseRequestData,
            purchase_request_issue_date: unixToDate(
              purchaseRequestData.purchase_request_issue_date
            ),
            purchase_request_due_date: unixToDate(
              purchaseRequestData.purchase_request_due_date
            ),
          }
        : purchaseRequestData,
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const postPayload = {
        ...values,
        purchase_request_id: purchaseRequestId,
        purchase_request_document_id: purchaseRequestDocumentId,
        purchase_request_issue_date: dateToUnix(
          values.purchase_request_issue_date
        ),
        purchase_request_due_date: dateToUnix(values.purchase_request_due_date),
      };

      delete postPayload.purchase_order_list;
      delete postPayload.action;

      switch (values.action) {
        case actionType.saveToDraft:
          setIsLoading(true);
          if (purchaseRequestDocumentId !== "-") {
            if (status === "not_approve") {
              postPayload.purchase_request_status = "draft";
            }
            updatePurchaseRequest("", purchaseRequestDocumentId, postPayload)
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
            postPurchaseRequest("", postPayload)
              .then((data) => {
                setStatus("draft");
                if (data.data.data.insertId && data.data.data.documentId) {
                  setPurchaseRequestId(data.data.data.insertId);
                  setPurchaseRequestDocumentId(data.data.data.documentId);
                  history.push(
                    `/expense/purchase-request/${data.data.data.documentId}`
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
          postPurchaseRequest("wait_approve", postPayload)
            .then((data) => {
              setStatus("wait_approve");
              if (data.data.data.insertId && data.data.data.documentId) {
                setPurchaseRequestId(data.data.data.insertId);
                setPurchaseRequestDocumentId(data.data.data.documentId);
                history.push(
                  `/expense/purchase-request/${data.data.data.documentId}`
                );
              }
              dispatch(showSnackbar(data.data.status, "ส่งอนุมัติสำเร็จ"));
              if (id) setIsLoading(false);
            })
            .catch((err) => {
              dispatch(
                showSnackbar(
                  "error",
                  `ส่งอนุมัติไม่สำเร็จ`,
                  err.response.data.message.split(":")[1]
                )
              );
              setIsLoading(false);
            });
          break;
        case actionType.approve:
          setIsLoading(true);
          postPurchaseRequest("approve", postPayload)
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
          updatePurchaseRequest(
            "not_approve",
            purchaseRequestDocumentId,
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
          postPurchaseRequest("wait_approve", postPayload)
            .then((data) => {
              setStatus("wait_approve");
              dispatch(showSnackbar(data.data.status, "บันทึกสำเร็จ"));
              if (data.data.data.insertId && data.data.data.documentId) {
                setPurchaseRequestId(data.data.data.insertId);
                setPurchaseRequestDocumentId(data.data.data.documentId);
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
    formik.setFieldValue("purchase_request_issue_date", newValue);
  };

  const handleEndDateChange = (newValue) => {
    formik.setFieldValue("purchase_request_due_date", newValue);
  };

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

  const openCancelConfirmationHandler = () => {
    setCancelConfirmation(true);
  };

  const closeCancelConfirmationHandler = () => {
    setCancelConfirmation(false);
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
    copyPurchaseRequest(purchaseRequestDocumentId)
      .then((data) => {
        history.push("/expense/purchase-request/add");
        dispatch(showSnackbar(data.data.status, "คัดลอกใบขอซื้อสำเร็จ"));
        setStatus("create");
        setPurchaseRequestId();
        setPurchaseRequestDocumentId("-");
        setPurchaseRequestData({
          ...data.data.data,
          purchase_request_issue_date: moment().format(),
          purchase_request_due_date: moment().add(7, "days").format(),
        });
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "คัดลอกใบขอซื้อไม่สำเร็จ"));
        console.log(err);
        setIsLoading(false);
      });
  };

  const openImportDocumentHandler = () => {
    setImportDocument(true);
  };

  const closeImportDocumentHandler = () => {
    setImportDocument(false);
  };

  const submitCancelConfirmationHandler = () => {
    setCancelConfirmation(false);
    setIsLoading(true);
    cancelPurchaseRequest(purchaseRequestDocumentId)
      .then((data) => {
        console.log(data);
        setStatus("cancelled");
        dispatch(showSnackbar("success", "ยกเลิกใบขอซื้อสำเร็จ"));
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "ยกเลิกใบขอซื้อไม่สำเร็จ"));
        setIsLoading(false);
        console.log(err);
      });
  };

  const submitImportDocumentHandler = () => {
    setImportDocument(false);

    const itemData = [];

    const existingDocumentId = [...formik.values.sales_order_document_id_list];
    const existingProjectList = [...formik.values.sales_order_project_list];
    const existingItems = [
      ...formik.values.purchase_request_data.filter(
        (data) => data.item_id.length !== 0
      ),
    ];

    const salesOrderDocumentIdList = selectedImportDocument.map(
      (document) => document.sales_order_document_id
    );

    const salesOrderProjectList = selectedImportDocument.map((document) => {
      return {
        project_id: document.billing_info.project_id,
        project_name: document.billing_info.project_name,
      };
    });

    const isSomeMatch = salesOrderDocumentIdList.some((element) => {
      return existingDocumentId.includes(element);
    });

    if (isSomeMatch) {
      dispatch(showSnackbar("error", "ไม่สามารถเลือกรายการซ้ำได้"));
    } else {
      selectedImportDocument.forEach((document) => {
        document.sales_order_data.forEach((list) => {
          list.category_list.forEach((categoryGroup) => {
            categoryGroup.item_data.forEach((category) => {
              itemData.push(category);
            });
          });
        });
      });

      const formatItemData = itemData.map((data) => ({
        discount_list: data.discount_list,
        item_description: data.item_description,
        item_id: data.item_id,
        item_name: data.item_name,
        item_price: data.item_price,
        qa_quantity: data.item_quantity,
        item_quantity: 0,
        item_unit: data.item_unit,
        item_withholding_tax: data.item_withholding_tax,
        tax: data.tax,
        withholding_tax_amount: data.withholding_tax_amount,
        pre_vat_amount: data.pre_vat_amount,
        total_discount: data.total_discount,
        vat: data.vat,
      }));

      const filterProjectList = salesOrderProjectList.filter(
        (project) =>
          project.project_id.length !== 0 && project.project_name !== 0
      );

      const allDocumentId = existingDocumentId.concat(salesOrderDocumentIdList);
      const allProjectList = existingProjectList.concat(filterProjectList);
      const allData = existingItems.concat(formatItemData);

      const uniqueProjectList = [
        ...new Map(
          allProjectList.map((project) => [project["project_name"], project])
        ).values(),
      ];

      formik.setFieldValue("sales_order_document_id_list", allDocumentId);
      formik.setFieldValue("sales_order_project_list", uniqueProjectList);
      formik.setFieldValue("purchase_request_data", allData);
    }
  };

  const printItemsHandler = (_, index) => {
    if (index === 0) {
      setAnchorPrintEl(null);
      history.push(
        `/expense/purchase-request/${purchaseRequestDocumentId}/pdf`
      );
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
      postPurchaseOrderFromPurchaseRequest(purchaseRequestDocumentId)
        .then((data) => {
          let myData = data.data.data;
          history.push(`/expense/purchase-order/add`, myData);
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    }
  };

  const editCancelled = () => {
    setEditButtonClick(false);
    setIsLoading(true);
    getPurchaseRequestById(purchaseRequestDocumentId)
      .then((data) => {
        if (data.data.status === "success") {
          const myData = data.data.data;
          const formatData = {
            ...myData,
            purchase_request_issue_date: unixToDate(
              myData.purchase_request_issue_date
            ),
            purchase_request_due_date: unixToDate(
              myData.purchase_request_due_date
            ),
          };
          formik.setValues(formatData);
          setStatus(formatData.purchase_request_status);
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
    history.push(`/income/sales-order/${documentId}`);
  };

  const deleteDocumentRefHandler = (documentId) => {
    console.log(documentId);
    const currentDocuments = formik.values.sales_order_document_id_list;
    const removedDocument = currentDocuments.filter(
      (document) => document !== documentId
    );
    formik.setFieldValue("sales_order_document_id_list", removedDocument);
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
      "purchase_request_data",
      formik.values.purchase_request_data.concat({
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
        <BreadcrumbComponent name="ใบขอซื้อ" to="/expense/purchase-request" />
        {purchaseRequestDocumentId !== "-" ? (
          <BreadcrumbComponent
            name={purchaseRequestDocumentId}
            to={"/expense/purchase-request/" + purchaseRequestDocumentId}
          />
        ) : (
          <BreadcrumbComponent
            name="เพิ่มใบขอซื้อ"
            to="/income/purchase-request/add"
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
              !purchaseRequestData.purchase_order_list ||
              purchaseRequestData.purchase_order_list.length === 0
                ? {
                    cursor: "not-allowed !important",
                    pointerEvents: "all !important",
                  }
                : { color: "#419644 !important" }
            }
            label="ใบสั่งซื้อ"
            disabled={
              !purchaseRequestData.purchase_order_list ||
              purchaseRequestData.purchase_order_list.length === 0
            }
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <div className="account__formHeader-primary">
          <div className="account__formHeader-labelContainer">
            <h2 className="form-heading">ใบขอซื้อ</h2>
            {renderStatus(status)}
            {dateToUnix(formik.values.purchase_request_due_date) <
              currentTimestamp &&
              formik.values.purchase_request_status !== "fully_order" &&
              !isLoading &&
              renderStatus("expired")}
          </div>
          <div className="account__buttonContainer">
            <AccountSplitButtonComponent
              disabled={disabled.print}
              defaultButtonValue="พิมพ์เอกสาร"
              options={["พิมพ์ใบขอซื้อ"]}
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
              options={["ใบสั่งซื้อ"]}
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
              <p>{purchaseRequestDocumentId}</p>
            </div>
            <div className="account__formHeader-datetime">
              <AccountDateComponent
                disabled={disabled.date}
                startDateLabel="วันที่ออกเอกสาร"
                endDateLabel="ต้องการภายในวันที่"
                startDateValue={formik.values.purchase_request_issue_date}
                endDateValue={formik.values.purchase_request_due_date}
                startDateName="purchase_request_issue_date"
                endDateName="purchase_request_due_date"
                handleStartDateChange={handleStartDateChange}
                handleEndDateChange={handleEndDateChange}
              />
            </div>
          </div>
          {formik.values.sales_order_document_id_list &&
            formik.values.sales_order_document_id_list.length > 0 && (
              <div className="account__refDocumentChip">
                <h4>อ้างอิงถึง</h4>
                {formik.values.sales_order_document_id_list.map((document) => (
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
                ))}
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
          <Grid container spacing={2}>
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
          <Box sx={{ my: 3.5 }}>
            <Divider />
          </Box>
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
              นำเข้าใบสั่งขาย
            </Button>
          </Box>
          <AccountTableDataPurchaseComponent
            data={formik.values.purchase_request_data}
            formik={formik}
            name="purchase_request_data"
            disabled={disabled.items}
            PRTable
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <AccountTemplateComponent
                disabled={disabled.remark}
                remarkId={formik.values.purchase_request_template_remark_id}
                formik={formik}
                allTemplate={allTemplate}
                id="purchase_request_template_remark_id"
                detail="purchase_request_remark"
                remark={formik.values.purchase_request_remark}
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
              title="ยืนยันการยกเลิกใบขอซื้อ"
              description="หากยกเลิกแล้วจะไม่สามารถเปลี่ยนแปลงรายการได้"
            />
          )}
          {copyConfirmation && (
            <AccountConfirmationComponent
              open={copyConfirmation}
              handleClose={closeCopyConfirmationHandler}
              handleSubmit={submitCopyConfirmationHandler}
              title="ยืนยันการคัดลอกใบขอซื้อ"
            />
          )}
          {notApproveConfirmation && (
            <AccountConfirmationComponent
              open={notApproveConfirmation}
              handleClose={closeNotApproveConfirmationHandler}
              handleSubmit={submitNotApproveConfirmationHandler}
              title="ไม่อนุมัติใบขอซื้อ"
              description="กรุณาระบุหมายเหตุในการไม่อนุมัติใบขอซื้อ"
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
          title="เลือกจากใบสั่งขาย"
          submitButtonLabel="นำเข้าใบสั่งขาย"
        />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <PurchaseOrderTabComponent
          purchaseOrderList={purchaseRequestData.purchase_order_list}
        />
      </TabPanel>
    </>
  );
};

export default AddPurchaseRequestComponent;
