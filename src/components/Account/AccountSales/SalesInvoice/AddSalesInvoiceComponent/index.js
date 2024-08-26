import {
  Backdrop,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Tab,
  Tabs,
  Grid,
} from "@mui/material";
import moment from "moment";
import React, { useState, useEffect } from "react";
import BreadcrumbComponent from "../../../../BreadcrumbComponent";
import AccountCustomerComponent from "../../../AccountCustomerComponent";
import AccountDateComponent from "../../../AccountDateComponent";
import AccountSplitButtonComponent from "../../../AccountSplitButtonComponent";
import AccountProgressBarComponent from "../../../AccountProgressBarComponent";
import AccountTableDataComponent from "../../../AccountTableDataComponent";
import AccountTemplateComponent from "../../../AccountTemplateComponent";
import AccountSummaryComponent from "../../../AccountSummaryComponent";
import AccountConfirmationComponent from "../../../AccountConfirmationComponent";
import { renderStatus } from "../../../renderStatus";
import { useParams, useLocation, Link, useHistory } from "react-router-dom";
import AccountStaffComponent from "../../../AccountStaffComponent";
import {
  getSalesInvoiceById,
  getRemarkTemplate,
  postSalesInvoice,
  updateSalesInvoice,
  cancelSalesInvoice,
  copySalesInvoice,
  postReceiptFromSalesInvoice,
  getProjectOption,
  getContactOption,
} from "../../../../../adapter/Api";
import ReceiptTabComponent from "./ReceiptTabComponent";
import { initialValues, validationSchema } from "./payload";
import { useFormik } from "formik";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import { useDispatch } from "react-redux";
import { disabledStatus } from "./disabledStatus";
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

const AddSalesInvoiceComponent = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const [salesInvoiceId, setSalesInvoiceId] = useState();
  const [salesInvoiceDocumentId, setSalesInvoiceDocumentId] = useState("-");
  const [salesOrderDocumentId, setSalesOrderDocumentId] = useState();
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
  const [tabValue, setTabValue] = useState(0);
  const [cancelConfirmation, setCancelConfirmation] = useState(false);
  const [copyConfirmation, setCopyConfirmation] = useState(false);
  const [notApproveConfirmation, setNotApproveConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [salesInvoiceData, setSalesInvoiceData] = useState(initialValues);
  const [projects, setProjects] = useState();
  const [contacts, setContacts] = useState();
  const [allTemplate, setAllTemplate] = useState();

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
    // Format Status from API
    // For view account detail
    const getProjects = getProjectOption(["project_status"]);
    const getContacts = getContactOption(["customer"]);
    const getRemarks = getRemarkTemplate();
    if (id) {
      setIsLoading(true);
      const getSalesInvoice = getSalesInvoiceById(id);
      Promise.all([getProjects, getContacts, getRemarks, getSalesInvoice])
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
            setSalesInvoiceData(myData);
            setStatus(myData.sales_invoice_status);
            setSalesInvoiceId(myData.sales_invoice_id);
            setSalesInvoiceDocumentId(myData.sales_invoice_document_id);
            setSalesOrderDocumentId(myData.sales_order_document_id);
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
        setSalesInvoiceData((prev) => {
          return {
            ...prev,
            sales_invoice_issue_date: moment().format(),
            sales_invoice_due_date: moment().add(7, "days").format(),
            billing_info: location.state.billing_info,
            sales_invoice_remark: location.state.sales_order_remark,
            sales_invoice_template_remark_id:
              location.state.sales_order_template_remark_id,
            sale_list: location.state.sale_list,
            sales_invoice_data: location.state.sales_order_data,
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
        setSalesOrderDocumentId(location.state.sales_order_document_id);
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
          setSalesInvoiceData((prev) => {
            return {
              ...prev,
              sales_invoice_issue_date: moment().format(),
              sales_invoice_due_date: moment().add(7, "days").format(),
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
      salesInvoiceData.sales_invoice_issue_date &&
      salesInvoiceData.sales_invoice_due_date &&
      !isNaN(salesInvoiceData.sales_invoice_issue_date) &&
      !isNaN(salesInvoiceData.sales_invoice_due_date)
        ? {
            ...salesInvoiceData,
            sales_invoice_issue_date: unixToDate(
              salesInvoiceData.sales_invoice_issue_date
            ),
            sales_invoice_due_date: unixToDate(
              salesInvoiceData.sales_invoice_due_date
            ),
          }
        : salesInvoiceData,
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const postPayload = {
        ...values,
        sales_order_document_id: salesOrderDocumentId,
        sales_invoice_id: salesInvoiceId,
        sales_invoice_document_id: salesInvoiceDocumentId,
        sales_invoice_issue_date: dateToUnix(values.sales_invoice_issue_date),
        sales_invoice_due_date: dateToUnix(values.sales_invoice_due_date),
      };

      delete postPayload.billing_note_list;
      delete postPayload.credit_note_list;
      delete postPayload.deposit_invoice_list;
      delete postPayload.payment_receipt_list;
      delete postPayload.action;

      switch (values.action) {
        case actionType.saveToDraft:
          setIsLoading(true);
          if (salesInvoiceDocumentId !== "-") {
            if (status === "not_approve") {
              postPayload.sales_invoice_status = "draft";
            }
            console.log("updated", postPayload);
            updateSalesInvoice("", salesInvoiceDocumentId, postPayload)
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
            postSalesInvoice("", postPayload)
              .then((data) => {
                setStatus("draft");
                if (data.data.data.insertId && data.data.data.documentId) {
                  setSalesInvoiceId(data.data.data.insertId);
                  setSalesInvoiceDocumentId(data.data.data.documentId);
                  history.push(
                    `/income/sales-invoice/${data.data.data.documentId}`
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
          postSalesInvoice("wait_approve", postPayload)
            .then((data) => {
              console.log("data.data.data: ", data.data.data);
              setStatus("wait_approve");
              if (data.data.data.insertId && data.data.data.documentId) {
                setSalesInvoiceId(data.data.data.insertId);
                setSalesInvoiceDocumentId(data.data.data.documentId);
                history.push(
                  `/income/sales-invoice/${data.data.data.documentId}`
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
          postSalesInvoice("approve", postPayload)
            .then((data) => {
              setStatus("wait_payment");
              dispatch(showSnackbar(data.data.status, "อนุมัติสำเร็จ"));
              setIsLoading(false);
            })
            .catch((err) => {
              dispatch(showSnackbar("error", "อนุมัติไม่สำเร็จ"));
              setIsLoading(false);
            });
          break;
        case actionType.notApprove:
          setIsLoading(true);
          updateSalesInvoice("not_approve", salesInvoiceDocumentId, postPayload)
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
          postSalesInvoice("wait_approve", postPayload)
            .then((data) => {
              setStatus("wait_approve");
              dispatch(showSnackbar(data.data.status, "บันทึกสำเร็จ"));
              if (data.data.data.insertId && data.data.data.documentId) {
                setSalesInvoiceId(data.data.data.insertId);
                setSalesInvoiceDocumentId(data.data.data.documentId);
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
        case actionType.editWaitPayment:
          setIsLoading(true);
          if (status === "wait_payment") {
            postPayload.sales_invoice_status = "wait_payment";
          }
          console.log("update", postPayload);
          updateSalesInvoice("", salesInvoiceDocumentId, postPayload)
            .then((data) => {
              dispatch(showSnackbar(data.data.status, "บันทึกสำเร็จ"));
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
    formik.setFieldValue("sales_invoice_issue_date", newValue);
  };

  const handleEndDateChange = (newValue) => {
    formik.setFieldValue("sales_invoice_due_date", newValue);
  };

  const postPayload = {
    ...formik.values,
    sales_order_document_id: salesOrderDocumentId,
    sales_invoice_id: salesInvoiceId,
    sales_invoice_document_id: salesInvoiceDocumentId,
    sales_invoice_issue_date: dateToUnix(
      formik.values.sales_invoice_issue_date
    ),
    sales_invoice_due_date: dateToUnix(formik.values.sales_invoice_due_date),
  };

  delete postPayload.billing_note_list;
  delete postPayload.credit_note_list;
  delete postPayload.deposit_invoice_list;
  delete postPayload.payment_receipt_list;

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
    cancelSalesInvoice(salesInvoiceDocumentId)
      .then((data) => {
        setStatus("cancelled");
        dispatch(showSnackbar(data.data.status, "ยกเลิกใบแจ้งหนี้สำเร็จ"));
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "ยกเลิกใบแจ้งหนี้ไม่สำเร็จ"));
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
    copySalesInvoice(salesInvoiceDocumentId)
      .then((data) => {
        history.push("/income/sales-invoice/add");
        dispatch(showSnackbar(data.data.status, "คัดลอกใบเสนอราคาสำเร็จ"));
        setStatus("create");
        setSalesInvoiceId();
        setSalesInvoiceDocumentId("-");
        setSalesInvoiceData({
          ...data.data.data,
          sales_invoice_issue_date: moment().format(),
          sales_invoice_due_date: moment().add(7, "days").format(),
        });
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "คัดลอกใบเสนอราคาไม่สำเร็จ"));
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
      history.push(`/income/sales-invoice/${id}/pdf`);
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
      history.push("/income/credit-note/add", postPayload);
    }
  };

  const editCancelled = () => {
    setEditButtonClick(false);
    setIsLoading(true);
    getSalesInvoiceById(salesInvoiceDocumentId)
      .then((data) => {
        if (data.data.status === "success") {
          const myData = data.data.data;
          const formatData = {
            ...myData,
            sales_invoice_issue_date: unixToDate(
              myData.sales_invoice_issue_date
            ),
            sales_invoice_due_date: unixToDate(myData.sales_invoice_due_date),
          };
          formik.setValues(formatData);
          setStatus(formatData.sales_invoice_status);
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

  const editWaitPayment = () => {
    formik.setFieldValue("action", actionType.editWaitPayment);
  };

  const createPaymentReceiptHandler = () => {
    setIsLoading(true);
    postReceiptFromSalesInvoice(salesInvoiceDocumentId)
      .then((data) => {
        console.log("sales_invoice", data.data.data);
        setStatus("closed");
        history.push("/income/payment-receipt/add", data.data.data);
        dispatch(showSnackbar(data.data.status, "สร้างใบรับชำระสำเร็จ"));
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "สร้างใบรับชำระไม่สำเร็จ"));
        setIsLoading(false);
        console.log(err.response.data);
      });
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
        <BreadcrumbComponent name="ใบแจ้งหนี้" to="/income/sales-invoice" />
        {salesInvoiceDocumentId !== "-" ? (
          <BreadcrumbComponent
            name={salesInvoiceDocumentId}
            to={"/income/sales-invoice/" + salesInvoiceDocumentId}
          />
        ) : (
          <BreadcrumbComponent
            name="เพิ่มใบแจ้งหนี้"
            to="/income/sales-invoice/add"
          />
        )}
      </Breadcrumbs>
      <div className="account__progressContainer">
        <AccountProgressBarComponent
          step="salesInvoice"
          paymentCompleted={status === "payment_complete"}
          partialPayment={status === "partial_payment"}
          salesInvoiceCancelled={cancel}
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
              !salesInvoiceData.payment_receipt_list ||
              salesInvoiceData.payment_receipt_list.length === 0
                ? {
                    cursor: "not-allowed !important",
                    pointerEvents: "all !important",
                  }
                : { color: "#419644 !important" }
            }
            label="รับชำระ"
            disabled={
              !salesInvoiceData.payment_receipt_list ||
              salesInvoiceData.payment_receipt_list.length === 0
            }
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <div className="account__formHeader-primary">
          <div className="account__formHeader-labelContainer">
            <h2 className="form-heading">ใบแจ้งหนี้</h2>
            {renderStatus(status)}
            {dateToUnix(formik.values.sales_invoice_due_date) <
              currentTimestamp &&
              formik.values.sales_invoice_status !== "closed" &&
              renderStatus("expired")}
          </div>
          <div className="account__buttonContainer">
            <AccountSplitButtonComponent
              disabled={disabled.print}
              defaultButtonValue="พิมพ์เอกสาร"
              options={["พิมพ์ใบแจ้งหนี้"]}
              handleMenuItemClick={printItemsHandler}
              open={openPrint}
              anchorEl={anchorPrintEl}
              handleOpen={handleOpenPrintMenu}
              handleClose={handleClosePrintMenu}
              variant="outlined"
            />
            <AccountSplitButtonComponent
              disabled={disabled.options}
              disabledEditButton={disabled.editButton}
              disabledCancelButton={disabled.cancelButton}
              defaultButtonValue="ตัวเลือก"
              options={["ยกเลิก", "แก้ไข", "คัดลอก"]}
              handleMenuItemClick={optionItemsHandler}
              open={openOption}
              anchorEl={anchorOptionEl}
              handleOpen={handleOpenOptionMenu}
              handleClose={handleCloseOptionMenu}
              variant="outlined"
            />
            {(status === "wait_payment" || status === "partial_payment") && (
              <Button variant="contained" onClick={createPaymentReceiptHandler}>
                รับชำระเงิน
              </Button>
            )}
            <AccountSplitButtonComponent
              disabled={disabled.create}
              defaultButtonValue="สร้าง"
              options={["ใบลดหนี้"]}
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
              <p>{salesInvoiceDocumentId}</p>
            </div>
            <div className="account__formHeader-datetime">
              <AccountDateComponent
                disabled={disabled.date}
                startDateLabel="วันที่ออกเอกสาร"
                endDateLabel="ใช้ได้ถึง"
                startDateValue={formik.values.sales_invoice_issue_date}
                endDateValue={formik.values.sales_invoice_due_date}
                startDateName="sales_invoice_issue_date"
                endDateName="sales_invoice_due_date"
                handleStartDateChange={handleStartDateChange}
                handleEndDateChange={handleEndDateChange}
                startDateError={formik.errors.sales_invoice_issue_date}
                endDateError={formik.errors.sales_invoice_due_date}
              />
            </div>
          </div>
          {salesOrderDocumentId && (
            <div className="account__refDocument">
              <h4>อ้างอิงถึง</h4>
              <Link
                to={{
                  pathname: `/income/sales-order/${salesOrderDocumentId}`,
                }}
              >
                {salesOrderDocumentId}
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
            data={formik.values.sales_invoice_data}
            formik={formik}
            name="sales_invoice_data"
            disabled={disabled.items}
            error={formik.errors.sales_invoice_data}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <AccountTemplateComponent
                disabled={disabled.remark}
                remarkId={formik.values.sales_invoice_template_remark_id}
                formik={formik}
                allTemplate={allTemplate}
                id="sales_invoice_template_remark_id"
                detail="sales_invoice_remark"
                remark={formik.values.sales_invoice_remark}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <AccountSummaryComponent
                noShipping
                summary
                formik={formik}
                disabled={disabled.summary}
                data={formik.values.sales_invoice_data}
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
            {status === "wait_payment" && editButtonClick && (
              <>
                <Button variant="contained" onClick={editCancelled}>
                  ยกเลิก
                </Button>
                <Button variant="contained" onClick={editWaitPayment}>
                  บันทึก
                </Button>
              </>
            )}
          </Box>
          {cancelConfirmation && (
            <AccountConfirmationComponent
              open={cancelConfirmation}
              handleClose={closeCancelConfirmationHandler}
              handleSubmit={submitCancelConfirmationHandler}
              title="ยืนยันการยกเลิกใบแจ้งหนี้"
              description="หากยกเลิกแล้วจะไม่สามารถเปลี่ยนแปลงรายการได้"
            />
          )}
          {copyConfirmation && (
            <AccountConfirmationComponent
              open={copyConfirmation}
              handleClose={closeCopyConfirmationHandler}
              handleSubmit={submitCopyConfirmationHandler}
              title="ยืนยันการคัดลอกใบแจ้งหนี้"
            />
          )}
          {notApproveConfirmation && (
            <AccountConfirmationComponent
              open={notApproveConfirmation}
              handleClose={closeNotApproveConfirmationHandler}
              handleSubmit={submitNotApproveConfirmationHandler}
              title="ไม่อนุมัติใบแจ้งหนี้"
              description="กรุณาระบุหมายเหตุในการไม่อนุมัติใบแจ้งหนี้"
              reason
              formik={formik}
            />
          )}
        </form>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <ReceiptTabComponent
          paymentReceiptList={salesInvoiceData.payment_receipt_list}
        />
      </TabPanel>
    </>
  );
};

export default AddSalesInvoiceComponent;
