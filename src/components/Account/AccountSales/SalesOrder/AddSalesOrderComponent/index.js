import {
  Backdrop,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Grid,
  Tab,
  Tabs,
} from "@mui/material";
import moment from "moment";
import React, { useState, useEffect } from "react";
import BreadcrumbComponent from "../../../../BreadcrumbComponent";
import AccountCustomerComponent from "../../../AccountCustomerComponent";
import AccountDateComponent from "../../../AccountDateComponent";
import AccountSplitButtonComponent from "../../../AccountSplitButtonComponent";
import AccountProgressBarComponent from "../../../AccountProgressBarComponent";
import { renderStatus } from "../../../renderStatus";
import AccountStaffComponent from "../../../AccountStaffComponent";
import SalesinvoiceTabComponent from "./SalesInvoiceTabComponent";
import { useParams, useLocation, Link, useHistory } from "react-router-dom";
import { initialValues, validationSchema } from "./payload";
import { useFormik } from "formik";
import {
  cancelSalesOrder,
  copySalesOrder,
  getContactOption,
  getProjectOption,
  getRemarkTemplate,
  getSalesOrderById,
  postSalesOrder,
  updateSalesOrder,
} from "../../../../../adapter/Api";
import AccountTableDataComponent from "../../../AccountTableDataComponent";
import AccountTemplateComponent from "../../../AccountTemplateComponent";
import AccountSummaryComponent from "../../../AccountSummaryComponent";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import { useDispatch } from "react-redux";
import AccountConfirmationComponent from "../../../AccountConfirmationComponent";
import { disabledStatus } from "./disabledStatus";
import DeliveryOrderTabComponent from "./DeliveryOrderTabcomponent";
import SalesReturnTabComponent from "./SalesReturnTabComponent";
import {
  dateToUnix,
  unixToDate,
  actionType,
} from "../../../../../adapter/Utils";

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

const AddSalesOrderComponent = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const [quotationDocumentId, setQuotationDocumentId] = useState();
  const [salesOrderDocumentId, setSalesOrderDocumentId] = useState("-");
  const [salesOrderId, setSalesOrderId] = useState();
  const [editButtonClick, setEditButtonClick] = useState(false);
  const [cancel, setCancel] = useState(false);
  const [status, setStatus] = useState("create");
  const [disabled, setDisabled] = useState({
    print: true,
    options: true,
    create: true,
    editButton: true,
    cancelButton: true,
    date: true,
    customer: true,
    staff: true,
    items: true,
    remark: true,
    summary: true,
  });
  const [salesOrderData, setSalesOrderData] = useState(initialValues);
  const [projects, setProjects] = useState();
  const [contacts, setContacts] = useState();
  const [allTemplate, setAllTemplate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [cancelConfirmation, setCancelConfirmation] = useState(false);
  const [copyConfirmation, setCopyConfirmation] = useState(false);
  const [notApproveConfirmation, setNotApproveConfirmation] = useState(false);

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
    disabledStatus(status, setDisabled, setCancel, editButtonClick);
  }, [status, editButtonClick]);

  useEffect(() => {
    const getProjects = getProjectOption(["project_status"]);
    const getContacts = getContactOption(["customer"]);
    const getRemarks = getRemarkTemplate();
    if (id) {
      setIsLoading(true);
      const getSalesOrder = getSalesOrderById(id);
      Promise.all([getProjects, getContacts, getRemarks, getSalesOrder])
        .then((values) => {
          if (values[0].data.status === "success") {
            let myData = values[0].data.data;
            setProjects(myData);
          }
          if (values[1].data.status === "success") {
            let myData = values[1].data.data;
            setContacts(myData);
          }
          if (values[2].data.status === "success") {
            let myData = values[2].data.data;
            setAllTemplate(myData);
          }
          if (values[3].data.status === "success") {
            let myData = values[3].data.data;
            setSalesOrderData(myData);
            setStatus(myData.sales_order_status);
            setSalesOrderId(myData.sales_order_id);
            setSalesOrderDocumentId(myData.sales_order_document_id);
            setQuotationDocumentId(myData.quotation_document_id);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    } else if (location.state) {
      setIsLoading(true);
      Promise.all([getProjects, getContacts, getRemarks]).then((values) => {
        if (values[0].data.status === "success") {
          let myData = values[0].data.data;
          setProjects(myData);
        }
        if (values[1].data.status === "success") {
          let myData = values[1].data.data;
          setContacts(myData);
        }
        if (values[2].data.status === "success") {
          let myData = values[2].data.data;
          setAllTemplate(myData);
        }
        setSalesOrderData((prev) => {
          return {
            ...prev,
            sales_order_issue_date: moment().format(),
            sales_order_due_date: moment().add(7, "days").format(),
            sales_order_expect_date: moment().add(7, "days").format(),
            sales_order_remark: location.state.sales_order_remark,
            sales_order_template_remark_id:
              location.state.sales_order_template_remark_id,
            billing_info: location.state.billing_info,
            sale_list: location.state.sale_list,
            sales_order_data: location.state.sales_order_data,
            shipping_cost: location.state.shipping_cost,
            additional_discount: location.state.additional_discount,
          };
        });
        setDisabled({
          print: true,
          options: true,
          create: true,
          editButton: true,
          cancelButton: true,
          date: false,
          customer: true,
          staff: true,
          items: true,
          remark: false,
          summary: true,
        });
        setQuotationDocumentId(location.state.quotation_document_id);
        setIsLoading(false);
      });
    } else {
      setIsLoading(true);
      Promise.all([getProjects, getContacts, getRemarks])
        .then((values) => {
          if (values[0].data.status === "success") {
            let myData = values[0].data.data;
            setProjects(myData);
          }
          if (values[1].data.status === "success") {
            let myData = values[1].data.data;
            setContacts(myData);
          }
          if (values[2].data.status === "success") {
            let myData = values[2].data.data;
            setAllTemplate(myData);
          }
          setSalesOrderData((prev) => {
            return {
              ...prev,
              sales_order_issue_date: moment().format(),
              sales_order_due_date: moment().add(7, "days").format(),
              sales_order_expect_date: moment().add(7, "days").format(),
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
      salesOrderData.sales_order_issue_date &&
      salesOrderData.sales_order_due_date &&
      salesOrderData.sales_order_expect_date &&
      !isNaN(salesOrderData.sales_order_issue_date) &&
      !isNaN(salesOrderData.sales_order_due_date) &&
      !isNaN(salesOrderData.sales_order_expect_date)
        ? {
            ...salesOrderData,
            sales_order_issue_date: unixToDate(
              salesOrderData.sales_order_issue_date
            ),
            sales_order_due_date: unixToDate(
              salesOrderData.sales_order_due_date
            ),
            sales_order_expect_date: unixToDate(
              salesOrderData.sales_order_expect_date
            ),
          }
        : salesOrderData,
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const postPayload = {
        ...values,
        quotation_document_id: quotationDocumentId,
        sales_order_id: salesOrderId,
        sales_order_document_id: salesOrderDocumentId,
        sales_order_issue_date: dateToUnix(values.sales_order_issue_date),
        sales_order_due_date: dateToUnix(values.sales_order_due_date),
        sales_order_expect_date: dateToUnix(values.sales_order_expect_date),
      };

      delete postPayload.sales_invoice_list;
      delete postPayload.delivery_note_list;
      delete postPayload.sales_return_list;
      delete postPayload.action;

      switch (values.action) {
        case actionType.saveToDraft:
          setIsLoading(true);
          if (salesOrderDocumentId !== "-") {
            if (status === "not_approve") {
              postPayload.sales_order_status = "draft";
            }
            updateSalesOrder("", salesOrderDocumentId, postPayload)
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
            postSalesOrder("", postPayload)
              .then((data) => {
                setStatus("draft");
                if (data.data.data.insertId && data.data.data.documentId) {
                  setSalesOrderId(data.data.data.insertId);
                  setSalesOrderDocumentId(data.data.data.documentId);
                  history.push(
                    `/income/sales-order/${data.data.data.documentId}`
                  );
                }
                dispatch(showSnackbar(data.data.status, "บันทึกร่างสำเร็จ"));
                if (id) setIsLoading(false);
              })
              .catch((err) => {
                console.log(err.response.data);
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
          postSalesOrder("wait_approve", postPayload)
            .then((data) => {
              setStatus("wait_approve");
              if (data.data.data.insertId && data.data.data.documentId) {
                setSalesOrderId(data.data.data.insertId);
                setSalesOrderDocumentId(data.data.data.documentId);
                history.push(
                  `/income/sales-order/${data.data.data.documentId}`
                );
              }
              dispatch(showSnackbar(data.data.status, "ส่งอนุมัติสำเร็จ"));
              if (id) setIsLoading(false);
            })
            .catch((err) => {
              console.log(err.response.data);
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
          postSalesOrder("approve", postPayload)
            .then((data) => {
              setStatus("approved");
              dispatch(showSnackbar(data.data.status, "อนุมัติสำเร็จ"));
              setIsLoading(false);
            })
            .catch((err) => {
              console.log(err.response.data);
              dispatch(showSnackbar("error", "อนุมัติไม่สำเร็จ"));
              setIsLoading(false);
            });
          break;
        case actionType.notApprove:
          setIsLoading(true);
          updateSalesOrder("not_approve", salesOrderDocumentId, postPayload)
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
          postSalesOrder("wait_approve", postPayload)
            .then((data) => {
              setStatus("wait_approve");
              dispatch(showSnackbar(data.data.status, "บันทึกสำเร็จ"));
              if (data.data.data.insertId && data.data.data.documentId) {
                setSalesOrderId(data.data.data.insertId);
                setSalesOrderDocumentId(data.data.data.documentId);
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

  const postPayload = {
    ...formik.values,
    quotation_document_id: quotationDocumentId,
    sales_order_id: salesOrderId,
    sales_order_document_id: salesOrderDocumentId,
    sales_order_issue_date: dateToUnix(formik.values.sales_order_issue_date),
    sales_order_due_date: dateToUnix(formik.values.sales_order_due_date),
    sales_order_expect_date: dateToUnix(formik.values.sales_order_expect_date),
  };

  delete postPayload.sales_invoice_list;
  delete postPayload.delivery_note_list;
  delete postPayload.sales_return_list;

  const handleStartDateChange = (newValue) => {
    formik.setFieldValue("sales_order_issue_date", newValue);
  };

  const handleEndDateChange = (newValue) => {
    formik.setFieldValue("sales_order_due_date", newValue);
  };

  const handleSentDateChange = (newValue) => {
    formik.setFieldValue("sales_order_expect_date", newValue);
  };

  const saveDraftHandler = () => {
    formik.setFieldValue("action", actionType.saveToDraft);
  };

  const sendToApprove = () => {
    formik.setFieldValue("action", actionType.sendToApprove);
  };

  const notApproveHandler = () => {
    openNotApproveConfirmationHandler();
  };

  const approveHandler = () => {
    formik.setFieldValue("action", actionType.approve);
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
    cancelSalesOrder(salesOrderDocumentId)
      .then((data) => {
        setStatus("cancelled");
        dispatch(showSnackbar(data.data.status, "ยกเลิกใบสั่งขายสำเร็จ"));
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "ยกเลิกใบสั่งขายไม่สำเร็จ"));
        setIsLoading(false);
        console.log(err.response.data);
      });
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
    copySalesOrder(salesOrderDocumentId)
      .then((data) => {
        history.push("/income/sales-order/add");
        dispatch(showSnackbar(data.data.status, "คัดลอกใบสั่งขายสำเร็จ"));
        setStatus("create");
        setSalesOrderId();
        setSalesOrderDocumentId("-");
        setSalesOrderData({
          ...data.data.data,
          sales_order_issue_date: moment().format(),
          sales_order_due_date: moment().add(7, "days").format(),
          sales_order_expect_date: moment().add(7, "days").format(),
        });
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "คัดลอกใบสั่งขายไม่สำเร็จ"));
        setIsLoading(false);
        console.log(err);
      });
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

  const printItemsHandler = (_, index) => {
    if (index === 0) {
      setAnchorPrintEl(null);
      history.push(`/income/sales-order/${id}/pdf`);
    }
  };

  const optionItemsHandler = (_, index) => {
    if (index === 0) {
      setAnchorOptionEl(null);
      openCancelConfirmationHandler();
    } else if (index === 1) {
      setAnchorOptionEl(null);
      setEditButtonClick(true);
    } else {
      setAnchorOptionEl(null);
      openCopyConfirmationHandler();
    }
  };

  const createItemsHandler = (_, index) => {
    if (index === 0) {
      setAnchorCreateEl(null);
      history.push("/income/sales-invoice/add", postPayload);
    } else if (index === 1) {
      setAnchorCreateEl(null);
      history.push("/expense/purchase-request/add", postPayload);
    } else if (index === 2) {
      setAnchorCreateEl(null);
      history.push("/income/delivery-order/add", postPayload);
    } else {
      setAnchorCreateEl(null);
      history.push("/income/sales-return/add", postPayload);
    }
  };

  const editCancelled = () => {
    setEditButtonClick(false);
    setIsLoading(true);
    getSalesOrderById(salesOrderDocumentId)
      .then((data) => {
        if (data.data.status === "success") {
          const myData = data.data.data;
          const formatData = {
            ...myData,
            sales_order_issue_date: unixToDate(myData.sales_order_issue_date),
            sales_order_due_date: unixToDate(myData.sales_order_due_date),
            sales_order_expect_date: unixToDate(myData.sales_order_expect_date),
          };
          formik.setValues(formatData);
          setStatus(formatData.sales_order_status);
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

  const currentTimestamp = moment().unix();

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
        <BreadcrumbComponent name="รายรับ" to="/income" />
        <BreadcrumbComponent name="ใบสั่งขาย" to="/income/sales-order" />
        {salesOrderDocumentId !== "-" ? (
          <BreadcrumbComponent
            name={salesOrderDocumentId}
            to={"/income/sales-order/" + salesOrderDocumentId}
          />
        ) : (
          <BreadcrumbComponent
            name="เพิ่มใบสั่งขาย"
            to="/income/sales-order/add"
          />
        )}
      </Breadcrumbs>
      <div className="account__progressContainer">
        <AccountProgressBarComponent
          step="salesOrder"
          salesOrderCancelled={cancel}
        />
      </div>
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
              !salesOrderData.sales_invoice_list ||
              salesOrderData.sales_invoice_list.length === 0
                ? {
                    cursor: "not-allowed !important",
                    pointerEvents: "all !important",
                  }
                : { color: "#419644 !important" }
            }
            label="ใบแจ้งหนี้"
            disabled={
              !salesOrderData.sales_invoice_list ||
              salesOrderData.sales_invoice_list.length === 0
            }
            {...a11yProps(1)}
          />
          <Tab
            sx={
              !salesOrderData.delivery_note_list ||
              salesOrderData.delivery_note_list.length === 0
                ? {
                    cursor: "not-allowed !important",
                    pointerEvents: "all !important",
                  }
                : { color: "#419644 !important" }
            }
            label="ใบส่งของ"
            disabled={
              !salesOrderData.delivery_note_list ||
              salesOrderData.delivery_note_list.length === 0
            }
            {...a11yProps(2)}
          />
          <Tab
            sx={
              !salesOrderData.sales_return_list ||
              salesOrderData.sales_return_list.length === 0
                ? {
                    cursor: "not-allowed !important",
                    pointerEvents: "all !important",
                  }
                : { color: "#419644 !important" }
            }
            label="ใบรับคืน"
            disabled={
              !salesOrderData.sales_return_list ||
              salesOrderData.sales_return_list.length === 0
            }
            {...a11yProps(3)}
          />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <div className="account__formHeader-primary">
          <div className="account__formHeader-labelContainer">
            <h2 className="form-heading">ใบสั่งขาย</h2>
            {renderStatus(status)}
            {dateToUnix(formik.values.sales_order_due_date) <
              currentTimestamp &&
              formik.values.sales_order_status !== "closed" &&
              renderStatus("expired")}
          </div>
          <div className="account__buttonContainer">
            <AccountSplitButtonComponent
              disabled={disabled.print}
              defaultButtonValue="พิมพ์เอกสาร"
              options={["พิมพ์ใบสั่งขาย"]}
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
              options={["ใบแจ้งหนี้", "ใบขอซื้อ", "ใบส่งของ", "ใบรับคืน"]}
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
              <p>{salesOrderDocumentId}</p>
            </div>
            <div className="account__formHeader-datetime">
              <AccountDateComponent
                disabled={disabled.date}
                startDateLabel="วันที่ออกเอกสาร"
                endDateLabel="ใช้ได้ถึง"
                sentDateLabel="วันกำหนดส่งของ"
                startDateValue={formik.values.sales_order_issue_date}
                endDateValue={formik.values.sales_order_due_date}
                sentDateValue={formik.values.sales_order_expect_date}
                startDateName="sales_order_issue_date"
                endDateName="sales_order_due_date"
                sentDateName="sales_order_expect_date"
                handleStartDateChange={handleStartDateChange}
                handleEndDateChange={handleEndDateChange}
                handleSentDateChange={handleSentDateChange}
                startDateError={formik.errors.sales_order_issue_date}
                endDateError={formik.errors.sales_order_due_date}
                sentDateError={formik.errors.sales_order_expect_date}
              />
            </div>
          </div>
          {quotationDocumentId && (
            <div className="account__refDocument">
              <h4>อ้างอิงถึง</h4>
              <Link
                to={{
                  pathname: `/income/quotation/${quotationDocumentId}`,
                }}
              >
                {quotationDocumentId}
              </Link>
            </div>
          )}
          <AccountCustomerComponent
            formik={formik}
            disabled={disabled.customer}
            projects={projects}
            contacts={contacts}
            projectId={formik.values.billing_info.project_id}
            contactId={formik.values.billing_info.contact_id}
            error={formik.errors.billing_info?.contact_id}
            accountSales
          />
          <AccountStaffComponent
            disabled={disabled.staff}
            formik={formik}
            error={formik.errors.sale_list}
          />
          <AccountTableDataComponent
            data={formik.values.sales_order_data}
            formik={formik}
            name="sales_order_data"
            disabled={disabled.items}
            error={formik.errors.sales_order_data}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <AccountTemplateComponent
                disabled={disabled.remark}
                remarkId={formik.values.sales_order_template_remark_id}
                formik={formik}
                allTemplate={allTemplate}
                id="sales_order_template_remark_id"
                detail="sales_order_remark"
                remark={formik.values.sales_order_remark}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <AccountSummaryComponent
                noShipping
                summary
                formik={formik}
                disabled={disabled.summary}
                data={formik.values.sales_order_data}
                tableType="sale"
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
                  variant="contained"
                  type="submit"
                  onClick={saveDraftHandler}
                >
                  บันทึกร่าง
                </Button>
                <Button
                  variant="contained"
                  type="submit"
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
                    variant="contained"
                    type="submit"
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
                    variant="contained"
                    type="submit"
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
              title="ยืนยันการยกเลิกใบสั่งขาย"
              description="หากยกเลิกแล้วจะไม่สามารถเปลี่ยนแปลงรายการได้"
            />
          )}
          {copyConfirmation && (
            <AccountConfirmationComponent
              open={copyConfirmation}
              handleClose={closeCopyConfirmationHandler}
              handleSubmit={submitCopyConfirmationHandler}
              title="ยืนยันการคัดลอกใบสั่งขาย"
            />
          )}
          {notApproveConfirmation && (
            <AccountConfirmationComponent
              open={notApproveConfirmation}
              handleClose={closeNotApproveConfirmationHandler}
              handleSubmit={submitNotApproveConfirmationHandler}
              title="ไม่อนุมัติใบสั่งขาย"
              description="กรุณาระบุหมายเหตุในการไม่อนุมัติใบสั่งขาย"
              reason
              formik={formik}
            />
          )}
        </form>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <SalesinvoiceTabComponent
          salesInvoiceList={salesOrderData.sales_invoice_list}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <DeliveryOrderTabComponent
          deliveryOrderList={salesOrderData.delivery_note_list}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <SalesReturnTabComponent
          salesReturnList={salesOrderData.sales_return_list}
        />
      </TabPanel>
    </>
  );
};

export default AddSalesOrderComponent;
