import {
  Backdrop,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Grid,
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
import { useParams, useLocation, Link, useHistory } from "react-router-dom";
import { initialValues, validationSchema } from "./payload";
import { useFormik } from "formik";
import AccountTemplateComponent from "../../../AccountTemplateComponent";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import { useDispatch } from "react-redux";
import AccountConfirmationComponent from "../../../AccountConfirmationComponent";
import { disabledStatus } from "./disabledStatus";
import {
  cancelDebitNote,
  copyDebitNote,
  getRemarkTemplate,
  getDebitNoteById,
  postDebitNote,
  updateDebitNote,
  getContactOption,
  updateDebitNotePayment,
  getPurchaseInvoiceByContactId,
} from "../../../../../adapter/Api";
import {
  actionType,
  dateToUnix,
  unixToDate,
} from "../../../../../adapter/Utils";
import DebitNoteReasonAccordian from "./DebitNoteReasonAccordian";
import AccountSummaryComponent from "../../../AccountSummaryComponent";
import DebitNoteTab from "./DebitNoteTab";
import AccountVendorComponent from "../../../AccountVendorComponent";
import AccountTableDataPurchaseComponent from "../../../AccountTableDataPurchaseComponent";

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

const AddDebitNoteComponent = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const [refDocumentId, setRefDocumentId] = useState();
  const [debitNoteDocumentId, setDebitNoteDocumentId] = useState("-");
  const [debitNoteId, setDebitNoteId] = useState();
  const [editButtonClick, setEditButtonClick] = useState(false);
  const [status, setStatus] = useState("create");
  const [disabled, setDisabled] = useState({
    reason: true,
    print: true,
    options: true,
    editButton: true,
    cancelButton: true,
    date: true,
    externalRef: true,
    vendor: true,
    items: true,
    remark: true,
    summary: true,
    debitNoteTab: true,
  });
  const [debitNoteData, setDebitNoteData] = useState(initialValues);
  const [contacts, setContacts] = useState();
  const [allTemplate, setAllTemplate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [cancelConfirmation, setCancelConfirmation] = useState(false);
  const [copyConfirmation, setCopyConfirmation] = useState(false);
  const [notApproveConfirmation, setNotApproveConfirmation] = useState(false);
  const [purchaseInvoiceDocumentIdList, setPurchaseInvoiceDocumentIdList] =
    useState([]);

  const [anchorPrintEl, setAnchorPrintEl] = useState(null);
  const [anchorOptionEl, setAnchorOptionEl] = useState(null);

  const openPrint = Boolean(anchorPrintEl);
  const openOption = Boolean(anchorOptionEl);

  const handleOpenPrintMenu = (event) => {
    setAnchorPrintEl(event.currentTarget);
  };

  const handleOpenOptionMenu = (event) => {
    setAnchorOptionEl(event.currentTarget);
  };

  const handleClosePrintMenu = () => {
    setAnchorPrintEl(null);
  };

  const handleCloseOptionMenu = () => {
    setAnchorOptionEl(null);
  };

  useEffect(() => {
    disabledStatus(status, setDisabled, editButtonClick);
  }, [status, editButtonClick]);

  useEffect(() => {
    const getContacts = getContactOption(["vendor"]);
    const getRemarks = getRemarkTemplate();
    if (id) {
      setIsLoading(true);
      const getDebitNote = getDebitNoteById(id);
      Promise.all([getContacts, getRemarks, getDebitNote])
        .then((values) => {
          if (values[0].data.status === "success") {
            let myData = values[0].data.data;
            setContacts(myData);
          }
          if (values[1].data.status === "success") {
            let myData = values[1].data.data;
            setAllTemplate(myData);
          }
          if (values[2].data.status === "success") {
            let myData = values[2].data.data;
            setDebitNoteData(myData);
            setStatus(myData.debit_note_status);
            setDebitNoteId(myData.debit_note_id);
            setDebitNoteDocumentId(myData.debit_note_document_id);
            setRefDocumentId(myData.ref_document_id);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    } else if (location.state) {
      setIsLoading(true);
      Promise.all([getContacts, getRemarks]).then((values) => {
        if (values[0].data.status === "success") {
          let myData = values[0].data.data;
          setContacts(myData);
        }
        if (values[1].data.status === "success") {
          let myData = values[1].data.data;
          setAllTemplate(myData);
        }
        if (location.state.purchase_invoice_document_id) {
          setDebitNoteData((prev) => {
            return {
              ...prev,
              external_ref_document_id: location.state.external_ref_document_id,
              ref_document_id: location.state.purchase_invoice_document_id,
              ref_type: "purchase_invoice",
              vendor_info: location.state.vendor_info,
              debit_note_issue_date: moment().format(),
              debit_note_data: location.state.purchase_invoice_data,
              additional_discount: location.state.additional_discount,
            };
          });
          setRefDocumentId(location.state.purchase_invoice_document_id);
        } else {
          setDebitNoteData((prev) => {
            return {
              ...prev,
              external_ref_document_id: location.state.external_ref_document_id,
              ref_document_id: location.state.purchase_return_document_id,
              ref_type: "purchase_return",
              vendor_info: location.state.vendor_info,
              debit_note_issue_date: moment().format(),
              debit_note_data: location.state.purchase_return_data,
              additional_discount: location.state.additional_discount,
            };
          });
          setRefDocumentId(location.state.purchase_return_document_id);
        }
        setDisabled({
          print: true,
          options: true,
          create: true,
          cancelButton: true,
          editButton: true,
          externalRef: true,
          reason: false,
          date: false,
          vendor: true,
          items: true,
          remark: false,
          summary: false,
          debitNoteTab: true,
        });
        setIsLoading(false);
      });
    } else {
      Promise.all([getContacts, getRemarks])
        .then((values) => {
          if (values[0].data.status === "success") {
            let myData = values[0].data.data;
            setContacts(myData);
          }
          if (values[1].data.status === "success") {
            let myData = values[1].data.data;
            setAllTemplate(myData);
          }
          setDebitNoteData((prev) => {
            return {
              ...prev,
              debit_note_issue_date: moment().format(),
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
      id && debitNoteData.debit_note_issue_date
        ? {
            ...debitNoteData,
            debit_note_issue_date: unixToDate(
              debitNoteData.debit_note_issue_date
            ),
          }
        : debitNoteData,
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const postPayload = {
        ...formik.values,
        debit_note_id: debitNoteId,
        debit_note_document_id: debitNoteDocumentId,
        debit_note_issue_date: dateToUnix(formik.values.debit_note_issue_date),
      };

      delete postPayload.action;

      switch (values.action) {
        case actionType.saveToDraft:
          setIsLoading(true);
          if (debitNoteDocumentId !== "-") {
            if (status === "not_approve") {
              postPayload.debit_note_status = "draft";
            }
            console.log("updated", postPayload);
            updateDebitNote("", debitNoteDocumentId, postPayload)
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
            postDebitNote("", postPayload)
              .then((data) => {
                setStatus("draft");
                if (data.data.data.insertId && data.data.data.documentId) {
                  setDebitNoteId(data.data.data.insertId);
                  setDebitNoteDocumentId(data.data.data.documentId);
                  history.push(
                    `/expense/debit-note/${data.data.data.documentId}`
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
          postDebitNote("wait_approve", postPayload)
            .then((data) => {
              setStatus("wait_approve");
              if (data.data.data.insertId && data.data.data.documentId) {
                setDebitNoteId(data.data.data.insertId);
                setDebitNoteDocumentId(data.data.data.documentId);
                history.push(
                  `/expense/debit-note/${data.data.data.documentId}`
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
          postDebitNote("approve", postPayload)
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
          updateDebitNote("not_approve", debitNoteDocumentId, postPayload)
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
          postDebitNote("wait_approve", postPayload)
            .then((data) => {
              setStatus("wait_approve");
              if (data.data.data.insertId && data.data.data.documentId) {
                setDebitNoteId(data.data.data.insertId);
                setDebitNoteDocumentId(data.data.data.documentId);
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

  const handleChange = (_, newValue) => {
    setTabValue(newValue);
    if (newValue !== 1 && status !== "closed") {
      formik.setFieldValue("purchase_invoice_document_id", null);
      formik.setFieldValue("debit_note_info", null);
      formik.setFieldValue("debit_note_type", null);
    }
  };

  useEffect(() => {
    if (formik.values.vendor_info.contact_id) {
      getPurchaseInvoiceByContactId(formik.values.vendor_info.contact_id)
        .then((data) => {
          const myData = data.data.data;
          setPurchaseInvoiceDocumentIdList(myData);
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    }
  }, [formik.values.vendor_info.contact_id]);

  const handleStartDateChange = (newValue) => {
    formik.setFieldValue("debit_note_issue_date", newValue);
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
    cancelDebitNote(debitNoteDocumentId)
      .then(() => {
        setStatus("cancelled");
        dispatch(showSnackbar("success", "ยกเลิกรับรับใบลดหนี้สำเร็จ"));
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "ยกเลิกรับรับใบลดหนี้ไม่สำเร็จ"));
        setIsLoading(false);
        console.log(err);
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
    copyDebitNote(debitNoteDocumentId)
      .then((data) => {
        history.push("/expense/debit-note/add");
        dispatch(showSnackbar(data.data.status, "คัดลอกรับรับใบลดหนี้สำเร็จ"));
        setStatus("create");
        setDebitNoteId();
        setDebitNoteDocumentId("-");
        setDebitNoteData({
          ...data.data.data,
          debit_note_issue_date: moment().format(),
        });
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "คัดลอกรับรับใบลดหนี้ไม่สำเร็จ"));
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
      history.push(`/expense/debit-note/${debitNoteDocumentId}/pdf`);
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

  const editCancelled = () => {
    setEditButtonClick(false);
    setIsLoading(true);
    getDebitNoteById(debitNoteDocumentId)
      .then((data) => {
        if (data.data.status === "success") {
          const myData = data.data.data;
          const formatData = {
            ...myData,
            debit_note_issue_date: unixToDate(myData.debit_note_issue_date),
          };
          formik.setValues(formatData);
          setStatus(formatData.debit_note_status);
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

  const updateDebitNotePayload =
    formik.values.debit_note_info &&
    (formik.values.debit_note_type === "debit_note"
      ? {
          debit_note_type: formik.values.debit_note_type,
          purchase_invoice_document_id:
            formik.values.purchase_invoice_document_id,
          debit_note_info: formik.values.debit_note_info,
        }
      : {
          debit_note_type: formik.values.debit_note_type,
          purchase_invoice_document_id: null,
          debit_note_info: formik.values.debit_note_info,
        });

  const updateDebitNoteTab = () => {
    setIsLoading(true);
    setStatus("closed");
    updateDebitNotePayment(debitNoteDocumentId, updateDebitNotePayload)
      .then(() => {
        dispatch(showSnackbar("success", "ลดหนี้สำเร็จ"));
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "ลดหนี้ไม่สำเร็จ"));
        setIsLoading(false);
        console.log(err.response.data);
      });
  };

  const cancelDebitNoteTab = () => {
    if (status !== "closed") {
      setTabValue(0);
      formik.setFieldValue("purchase_invoice_document_id", null);
      formik.setFieldValue("debit_note_info", null);
      formik.setFieldValue("debit_note_type", null);
    }
  };

  const addItemHandler = () => {
    formik.setFieldValue(
      "debit_note_data",
      formik.values.debit_note_data.concat({
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
        <BreadcrumbComponent name="รับใบลดหนี้" to="/expense/debit-note" />
        {debitNoteDocumentId !== "-" ? (
          <BreadcrumbComponent
            name={debitNoteDocumentId}
            to={"/expense/debit-note/" + debitNoteDocumentId}
          />
        ) : (
          <BreadcrumbComponent
            name="เพิ่มรับใบลดหนี้"
            to="/expense/debit-note/add"
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
              disabled.debitNoteTab
                ? {
                    cursor: "not-allowed !important",
                    pointerEvents: "all !important",
                  }
                : { color: "#419644 !important" }
            }
            label="รับใบลดหนี้"
            disabled={disabled.debitNoteTab}
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <div className="account__formHeader-primary">
          <div className="account__formHeader-labelContainer">
            <h2 className="form-heading">รับใบลดหนี้</h2>
            {renderStatus(status)}
          </div>
          <div className="account__buttonContainer">
            <AccountSplitButtonComponent
              disabled={disabled.print}
              defaultButtonValue="พิมพ์เอกสาร"
              options={["พิมพ์รับใบลดหนี้"]}
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
          </div>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="account__formHeader-secondary">
            <div className="account__formHeader-document">
              <h4>เลขที่เอกสาร</h4>
              <p>{debitNoteDocumentId}</p>
            </div>
            <div className="account__formHeader-datetime">
              <AccountDateComponent
                disabled={disabled.date}
                startDateLabel="วันที่ออกเอกสาร"
                startDateValue={formik.values.debit_note_issue_date}
                startDateName="debit_note_issue_date"
                handleStartDateChange={handleStartDateChange}
              />
            </div>
          </div>
          {refDocumentId && (
            <div className="account__refDocument">
              <h4>อ้างอิงถึง</h4>
              <Link
                to={{
                  pathname: `/expense/purchase-invoice/${refDocumentId}`,
                }}
              >
                {refDocumentId}
              </Link>
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
            </Grid>
          </Box>
          <DebitNoteReasonAccordian
            formik={formik}
            disabled={disabled.reason}
          />
          <AccountVendorComponent
            accountPurchase
            disabled={disabled.vendor}
            formik={formik}
            contacts={contacts}
            contactId={formik.values.vendor_info.contact_id}
          />
          <Box sx={{ mb: 3 }}>
            <Button
              disabled={disabled.items}
              variant="contained"
              onClick={addItemHandler}
            >
              เพิ่มสินค้า
            </Button>
          </Box>
          <AccountTableDataPurchaseComponent
            data={formik.values.debit_note_data}
            formik={formik}
            name="debit_note_data"
            disabled={disabled.items}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <AccountTemplateComponent
                disabled={disabled.remark}
                remarkId={formik.values.debit_note_template_remark_id}
                formik={formik}
                allTemplate={allTemplate}
                id="debit_note_template_remark_id"
                detail="debit_note_remark"
                remark={formik.values.debit_note_remark}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <AccountSummaryComponent
                summary
                disabled={disabled.summary}
                data={formik.values.debit_note_data}
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
              title="ยืนยันการยกเลิกรับใบลดหนี้"
              description="หากยกเลิกแล้วจะไม่สามารถเปลี่ยนแปลงรายการได้"
            />
          )}
          {copyConfirmation && (
            <AccountConfirmationComponent
              open={copyConfirmation}
              handleClose={closeCopyConfirmationHandler}
              handleSubmit={submitCopyConfirmationHandler}
              title="ยืนยันการคัดลอกรับใบลดหนี้"
            />
          )}
          {notApproveConfirmation && (
            <AccountConfirmationComponent
              open={notApproveConfirmation}
              handleClose={closeNotApproveConfirmationHandler}
              handleSubmit={submitNotApproveConfirmationHandler}
              title="ไม่อนุมัติรับใบลดหนี้"
              description="กรุณาระบุหมายเหตุในการไม่อนุมัติรับใบลดหนี้"
              reason
              formik={formik}
            />
          )}
        </form>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <DebitNoteTab
          disabled={status === "closed"}
          formik={formik}
          purchaseInvoiceDocumentIdList={purchaseInvoiceDocumentIdList}
          updateDebitNoteTab={updateDebitNoteTab}
          cancelDebitNoteTab={cancelDebitNoteTab}
        />
      </TabPanel>
    </>
  );
};

export default AddDebitNoteComponent;
