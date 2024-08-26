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
  cancelCreditNote,
  copyCreditNote,
  getRemarkTemplate,
  getCreditNoteById,
  postCreditNote,
  updateCreditNote,
  updateCreditNotePayment,
  getSalesInvoiceByContactId,
  getProjectOption,
  getContactOption,
} from "../../../../../adapter/Api";
import {
  dateToUnix,
  unixToDate,
  actionType,
} from "../../../../../adapter/Utils";
import CreditNoteReasonAccordian from "./CreditNoteReasonAccordian";
import AccountSummaryComponent from "../../../AccountSummaryComponent";
import CreditNoteTab from "./CreditNoteTab";
import AccountTableDataComponent from "../../../AccountTableDataComponent";

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

const AddCreditNoteComponent = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const [refDocumentId, setRefDocumentId] = useState();
  const [creditNoteDocumentId, setCreditNoteDocumentId] = useState("-");
  const [creditNoteId, setCreditNoteId] = useState();
  const [editButtonClick, setEditButtonClick] = useState(false);
  const [status, setStatus] = useState("create");
  const [disabled, setDisabled] = useState({
    reason: true,
    print: true,
    options: true,
    editButton: true,
    cancelButton: true,
    date: true,
    customer: true,
    items: true,
    remark: true,
    summary: true,
    creditNoteTab: true,
  });
  const [creditNoteData, setCreditNoteData] = useState(initialValues);
  const [projects, setProjects] = useState();
  const [contacts, setContacts] = useState();
  const [allTemplate, setAllTemplate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [cancelConfirmation, setCancelConfirmation] = useState(false);
  const [copyConfirmation, setCopyConfirmation] = useState(false);
  const [notApproveConfirmation, setNotApproveConfirmation] = useState(false);
  const [salesInvoiceDocumentIdList, setSalesInvoiceDocumentIdList] = useState(
    []
  );

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
    const getProjects = getProjectOption(["project_status"]);
    const getContacts = getContactOption(["customer"]);
    const getRemarks = getRemarkTemplate();
    if (id) {
      setIsLoading(true);
      const getCreditNote = getCreditNoteById(id);
      Promise.all([getProjects, getContacts, getRemarks, getCreditNote])
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
            setCreditNoteData(myData);
            setStatus(myData.credit_note_status);
            setCreditNoteId(myData.credit_note_id);
            setCreditNoteDocumentId(myData.credit_note_document_id);
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
        if (location.state.sales_invoice_document_id) {
          setCreditNoteData((prev) => {
            return {
              ...prev,
              ref_document_id: location.state.sales_invoice_document_id,
              ref_type: "sales_invoice",
              billing_info: location.state.billing_info,
              credit_note_issue_date: moment().format(),
              credit_note_data: location.state.sales_invoice_data,
              shipping_cost: location.state.shipping_cost,
              additional_discount: location.state.additional_discount,
            };
          });
          setRefDocumentId(location.state.sales_invoice_document_id);
        } else {
          setCreditNoteData((prev) => {
            return {
              ...prev,
              ref_document_id: location.state.sales_return_document_id,
              ref_type: "sales_return",
              billing_info: location.state.billing_info,
              credit_note_issue_date: moment().format(),
              credit_note_data: location.state.sales_return_data,
              shipping_cost: location.state.shipping_cost,
              additional_discount: location.state.additional_discount,
            };
          });
          setRefDocumentId(location.state.sales_return_document_id);
        }
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
          setCreditNoteData((prev) => {
            return {
              ...prev,
              credit_note_issue_date: moment().format(),
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
      creditNoteData.credit_note_issue_date &&
      !isNaN(creditNoteData.credit_note_issue_date)
        ? {
            ...creditNoteData,
            credit_note_issue_date: unixToDate(
              creditNoteData.credit_note_issue_date
            ),
          }
        : creditNoteData,
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const postPayload = {
        ...formik.values,
        credit_note_id: creditNoteId,
        credit_note_document_id: creditNoteDocumentId,
        credit_note_issue_date: dateToUnix(
          formik.values.credit_note_issue_date
        ),
      };

      delete postPayload.action;

      switch (values.action) {
        case actionType.saveToDraft:
          setIsLoading(true);
          if (creditNoteDocumentId !== "-") {
            if (status === "not_approve") {
              postPayload.credit_note_status = "draft";
            }
            console.log("updated", postPayload);
            updateCreditNote("", creditNoteDocumentId, postPayload)
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
            postCreditNote("", postPayload)
              .then((data) => {
                setStatus("draft");
                if (data.data.data.insertId && data.data.data.documentId) {
                  setCreditNoteId(data.data.data.insertId);
                  setCreditNoteDocumentId(data.data.data.documentId);
                  history.push(
                    `/income/credit-note/${data.data.data.documentId}`
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
          postCreditNote("wait_approve", postPayload)
            .then((data) => {
              setStatus("wait_approve");
              if (data.data.data.insertId && data.data.data.documentId) {
                setCreditNoteId(data.data.data.insertId);
                setCreditNoteDocumentId(data.data.data.documentId);
                history.push(
                  `/income/credit-note/${data.data.data.documentId}`
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
          postCreditNote("approve", postPayload)
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
          updateCreditNote("not_approve", creditNoteDocumentId, postPayload)
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
          postCreditNote("wait_approve", postPayload)
            .then((data) => {
              setStatus("wait_approve");
              if (data.data.data.insertId && data.data.data.documentId) {
                setCreditNoteId(data.data.data.insertId);
                setCreditNoteDocumentId(data.data.data.documentId);
              }
              dispatch(showSnackbar(data.data.status, "บันทึกสำเร็จ"));
              setIsLoading(false);
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
          setEditButtonClick(false);
          break;
        default:
          return;
      }
    },
  });

  const handleChange = (_, newValue) => {
    setTabValue(newValue);
    if (newValue !== 1 && status !== "closed") {
      formik.setFieldValue("sales_invoice_document_id", null);
      formik.setFieldValue("credit_note_info", null);
      formik.setFieldValue("credit_note_type", null);
    }
  };

  useEffect(() => {
    if (formik.values.billing_info.contact_id) {
      getSalesInvoiceByContactId(formik.values.billing_info.contact_id)
        .then((data) => {
          const myData = data.data.data;
          setSalesInvoiceDocumentIdList(myData);
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    }
  }, [formik.values.billing_info.contact_id]);

  const handleStartDateChange = (newValue) => {
    formik.setFieldValue("credit_note_issue_date", newValue);
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
    cancelCreditNote(creditNoteDocumentId)
      .then(() => {
        setStatus("cancelled");
        dispatch(showSnackbar("success", "ยกเลิกใบลดหนี้สำเร็จ"));
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "ยกเลิกใบลดหนี้ไม่สำเร็จ"));
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
    copyCreditNote(creditNoteDocumentId)
      .then((data) => {
        history.push("/income/credit-note/add");
        dispatch(showSnackbar(data.data.status, "คัดลอกใบลดหนี้สำเร็จ"));
        setStatus("create");
        setCreditNoteId();
        setCreditNoteDocumentId("-");
        setCreditNoteData({
          ...data.data.data,
          credit_note_issue_date: moment().format(),
        });
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "คัดลอกใบลดหนี้ไม่สำเร็จ"));
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

  const updateCreditNotePayload =
    formik.values.credit_note_info &&
    (formik.values.credit_note_type === "credit_note"
      ? {
          credit_note_type: formik.values.credit_note_type,
          sales_invoice_document_id: formik.values.sales_invoice_document_id,
          credit_note_info: formik.values.credit_note_info,
        }
      : {
          credit_note_type: formik.values.credit_note_type,
          sales_invoice_document_id: null,
          credit_note_info: formik.values.credit_note_info,
        });

  const updateCreditNoteTab = () => {
    setIsLoading(true);
    console.log("update payload", updateCreditNotePayload);
    updateCreditNotePayment(creditNoteDocumentId, updateCreditNotePayload)
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

  const printItemsHandler = (_, index) => {
    if (index === 0) {
      setAnchorPrintEl(null);
      history.push(`/income/credit-note/${id}/pdf`);
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
    getCreditNoteById(creditNoteDocumentId)
      .then((data) => {
        if (data.data.status === "success") {
          const myData = data.data.data;
          const formatData = {
            ...myData,
            credit_note_issue_date: unixToDate(myData.credit_note_issue_date),
          };
          formik.setValues(formatData);
          setStatus(formatData.credit_note_status);
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

  const switchRefLinkHanlder = (ref_type) => {
    switch (ref_type) {
      case "sales_invoice":
        return `/income/sales-invoice/${refDocumentId}`;
      case "sales_return":
        return `/income/sales-return/${refDocumentId}`;
      default:
        return;
    }
  };

  const cancelCreditNoteTab = () => {
    if (status !== "closed") {
      setTabValue(0);
      formik.setFieldValue("sales_invoice_document_id", null);
      formik.setFieldValue("credit_note_info", null);
      formik.setFieldValue("credit_note_type", null);
    }
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
        <BreadcrumbComponent name="รายรับ" to="/income" />
        <BreadcrumbComponent name="ใบลดหนี้" to="/income/credit-note" />
        {creditNoteDocumentId !== "-" ? (
          <BreadcrumbComponent
            name={creditNoteDocumentId}
            to={"/income/credit-note/" + creditNoteDocumentId}
          />
        ) : (
          <BreadcrumbComponent
            name="เพิ่มใบลดหนี้"
            to="/income/credit-note/add"
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
              disabled.creditNoteTab
                ? {
                    cursor: "not-allowed !important",
                    pointerEvents: "all !important",
                  }
                : { color: "#419644 !important" }
            }
            label="ใบลดหนี้"
            disabled={disabled.creditNoteTab}
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <div className="account__formHeader-primary">
          <div className="account__formHeader-labelContainer">
            <h2 className="form-heading">ใบลดหนี้</h2>
            {renderStatus(status)}
          </div>
          <div className="account__buttonContainer">
            <AccountSplitButtonComponent
              disabled={disabled.print}
              defaultButtonValue="พิมพ์เอกสาร"
              options={["พิมพ์ใบลดหนี้"]}
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
              <p>{creditNoteDocumentId}</p>
            </div>
            <div className="account__formHeader-datetime">
              <AccountDateComponent
                disabled={disabled.date}
                startDateLabel="วันที่ออกเอกสาร"
                startDateValue={formik.values.credit_note_issue_date}
                startDateName="credit_note_issue_date"
                handleStartDateChange={handleStartDateChange}
              />
            </div>
          </div>
          {refDocumentId && (
            <div className="account__refDocument">
              <h4>อ้างอิงถึง</h4>
              <Link
                to={{
                  pathname: switchRefLinkHanlder(
                    formik.values.ref_type ||
                      (location.state && location.state.ref_type)
                  ),
                }}
              >
                {refDocumentId}
              </Link>
            </div>
          )}
          <CreditNoteReasonAccordian
            formik={formik}
            disabled={disabled.reason}
          />
          <AccountCustomerComponent
            formik={formik}
            disabled={disabled.customer}
            projects={projects}
            contacts={contacts}
            projectId={formik.values.billing_info.project_id}
            contactId={formik.values.billing_info.contact_id}
            accountSales
          />
          <AccountTableDataComponent
            data={formik.values.credit_note_data}
            formik={formik}
            name="credit_note_data"
            disabled={disabled.items}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <AccountTemplateComponent
                disabled={disabled.remark}
                remarkId={formik.values.credit_note_template_remark_id}
                formik={formik}
                allTemplate={allTemplate}
                id="credit_note_template_remark_id"
                detail="credit_note_remark"
                remark={formik.values.credit_note_remark}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <AccountSummaryComponent
                noShipping
                summary
                disabled={disabled.summary}
                data={formik.values.credit_note_data}
                formik={formik}
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
              title="ยืนยันการยกเลิกใบลดหนี้"
              description="หากยกเลิกแล้วจะไม่สามารถเปลี่ยนแปลงรายการได้"
            />
          )}
          {copyConfirmation && (
            <AccountConfirmationComponent
              open={copyConfirmation}
              handleClose={closeCopyConfirmationHandler}
              handleSubmit={submitCopyConfirmationHandler}
              title="ยืนยันการคัดลอกใบลดหนี้"
            />
          )}
          {notApproveConfirmation && (
            <AccountConfirmationComponent
              open={notApproveConfirmation}
              handleClose={closeNotApproveConfirmationHandler}
              handleSubmit={submitNotApproveConfirmationHandler}
              title="ไม่อนุมัติใบลดหนี้"
              description="กรุณาระบุหมายเหตุในการไม่อนุมัติใบลดหนี้"
              reason
              formik={formik}
            />
          )}
        </form>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <CreditNoteTab
          salesInvoiceDocumentIdList={salesInvoiceDocumentIdList}
          disabled={status === "closed"}
          updateCreditNoteTab={updateCreditNoteTab}
          cancelCreditNoteTab={cancelCreditNoteTab}
          formik={formik}
        />
      </TabPanel>
    </>
  );
};

export default AddCreditNoteComponent;
