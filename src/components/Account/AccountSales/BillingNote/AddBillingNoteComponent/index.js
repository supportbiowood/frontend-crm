import {
  Backdrop,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Tab,
  Tabs,
  Grid,
  Chip,
} from "@mui/material";
import moment from "moment";
import React, { useState, useEffect } from "react";
import BreadcrumbComponent from "../../../../BreadcrumbComponent";
import AccountCustomerComponent from "../../../AccountCustomerComponent";
import AccountDateComponent from "../../../AccountDateComponent";
import AccountSplitButtonComponent from "../../../AccountSplitButtonComponent";
import AccountTemplateComponent from "../../../AccountTemplateComponent";
import AccountSummaryComponent from "../../../AccountSummaryComponent";
import AccountConfirmationComponent from "../../../AccountConfirmationComponent";
import { renderStatus } from "../../../renderStatus";
import { useParams, useLocation, useHistory } from "react-router-dom";
import {
  getRemarkTemplate,
  getBillingNoteById,
  updateBillingNote,
  postBillingNote,
  cancelBillingNote,
  postReceiptFromBillingNote,
  getSalesInvoiceFromBillingNote,
  getContactOption,
  getContactById,
} from "../../../../../adapter/Api";
import ReceiptTabComponent from "./ReceiptTabComponent";
import { initialValues, validationSchema } from "./payload";
import { useFormik } from "formik";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import { useDispatch } from "react-redux";
import { disabledStatus } from "./disabledStatus";
import PaymentHistory from "./PaymentHistory";
import SalesInvoiceTable from "./SalesInvoiceTable";
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

const AddBillingNoteComponent = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const [billingNoteId, setBillingNoteId] = useState();
  const [billingNoteDocumentId, setBillingNoteDocumentId] = useState("-");
  const [editButtonClick, setEditButtonClick] = useState(false);
  const [status, setStatus] = useState("create");
  const [disabled, setDisabled] = useState({
    print: true,
    options: true,
    edit: true,
    editButton: true,
    cancelButton: true,
  });
  const [tabValue, setTabValue] = useState(0);
  const [cancelConfirmation, setCancelConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [billingNoteData, setBillingNoteData] = useState(initialValues);
  const [contacts, setContacts] = useState();
  const [allTemplate, setAllTemplate] = useState();
  const [salesInvoiceList, setSalesInvoiceList] = useState([]);
  const [allBillingInfo, setAllBillingInfo] = useState([]);
  const [selectedSalesInvoice, setSelectedSalesInvoice] = useState(false);
  const [selectedImportdocument, setSelectedImportdocument] = useState([]);
  const [selectedContact, setSelectedContact] = useState();
  const [salesInvoiceData, setSalesInvoiceData] = useState([]);
  const [allNetAmount, setAllNetAmount] = useState([]);

  const handleChange = (_, newValue) => {
    setTabValue(newValue);
  };

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
    // Format Status from API
    // For view account detail
    const getContacts = getContactOption(["customer"]);
    const getRemarks = getRemarkTemplate();
    if (id) {
      setIsLoading(true);
      setSelectedSalesInvoice(true);
      const getBillingNote = getBillingNoteById(id);
      Promise.all([getContacts, getRemarks, getBillingNote])
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
            const allBillingInfo = myData.sales_invoices.map(
              (salesInvoice) => salesInvoice.billing_info
            );
            let allSalesInvoice = [];
            myData.sales_invoices.forEach((salesInvoice) =>
              salesInvoice.sales_invoice_data.forEach((data) =>
                allSalesInvoice.push(data)
              )
            );
            const allNetAmount = myData.sales_invoices.map(
              (salesInvoice) => salesInvoice.net_amount
            );
            setAllNetAmount(allNetAmount);
            setSalesInvoiceData(allSalesInvoice);
            setAllBillingInfo(allBillingInfo);
            setBillingNoteData(myData);
            setStatus(myData.billing_note_status);
            setBillingNoteId(myData.billing_note_id);
            setBillingNoteDocumentId(myData.billing_note_document_id);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
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
          setBillingNoteData((prev) => {
            return {
              ...prev,
              billing_note_issue_date: moment().format(),
              billing_note_due_date: moment().add(7, "days").format(),
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
      billingNoteData.billing_note_issue_date &&
      billingNoteData.billing_note_due_date &&
      !isNaN(billingNoteData.billing_note_issue_date) &&
      !isNaN(billingNoteData.billing_note_due_date)
        ? {
            ...billingNoteData,
            billing_note_issue_date: unixToDate(
              billingNoteData.billing_note_issue_date
            ),
            billing_note_due_date: unixToDate(
              billingNoteData.billing_note_due_date
            ),
          }
        : billingNoteData,
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const postPayload = {
        ...values,
        billing_note_id: billingNoteId,
        billing_note_document_id: billingNoteDocumentId,
        billing_note_issue_date: dateToUnix(values.billing_note_issue_date),
        billing_note_due_date: dateToUnix(values.billing_note_due_date),
      };

      delete postPayload.payment_receipt_list;
      delete postPayload.sales_invoices;
      delete postPayload.action;

      switch (values.action) {
        case actionType.saveToDraft:
          setIsLoading(true);
          if (billingNoteDocumentId !== "-") {
            console.log("updated", postPayload);
            updateBillingNote("", billingNoteDocumentId, postPayload)
              .then((data) => {
                setStatus("draft");
                dispatch(showSnackbar(data.data.status, "บันทึกร่างสำเร็จ"));
                setIsLoading(false);
              })
              .catch((err) => {
                console.log(err.response.data);
                dispatch(showSnackbar("error", "บันทึกร่างไม่สำเร็จ"));
                setIsLoading(false);
              });
          } else {
            postBillingNote("", postPayload)
              .then((data) => {
                setStatus("draft");
                if (data.data.data.insertId && data.data.data.documentId) {
                  setBillingNoteId(data.data.data.insertId);
                  setBillingNoteDocumentId(data.data.data.documentId);
                  history.push(
                    `/income/billing-note/${data.data.data.documentId}`
                  );
                }
                dispatch(showSnackbar(data.data.status, "บันทึกร่างสำเร็จ"));
                if (id) setIsLoading(false);
              })
              .catch((err) => {
                console.log(err.response.data);
                dispatch(showSnackbar("error", "บันทึกร่างไม่สำเร็จ"));
                setIsLoading(false);
              });
          }
          break;
        case actionType.approve:
          setIsLoading(true);
          postBillingNote("approve", postPayload)
            .then((data) => {
              setStatus("wait_payment");
              if (data.data.data.insertId && data.data.data.documentId) {
                setBillingNoteId(data.data.data.insertId);
                setBillingNoteDocumentId(data.data.data.documentId);
                history.push(
                  `/income/billing-note/${data.data.data.documentId}`
                );
              }
              dispatch(showSnackbar(data.data.status, "อนุมัติสำเร็จ"));
              if (id) setIsLoading(false);
            })
            .catch(() => {
              dispatch(showSnackbar("error", "อนุมัติไม่สำเร็จ"));
              setIsLoading(false);
            });
          break;
        case actionType.editWaitPayment:
          setIsLoading(true);
          if (status === "wait_payment") {
            postPayload.billing_note_status = "wait_payment";
          }
          console.log("update", postPayload);
          updateBillingNote("", billingNoteDocumentId, postPayload)
            .then((data) => {
              dispatch(showSnackbar(data.data.status, "บันทึกสำเร็จ"));
              setIsLoading(false);
            })
            .catch(() => {
              dispatch(showSnackbar("error", "บันทึกไม่สำเร็จ"));
              setIsLoading(false);
            });
          setEditButtonClick(false);
          break;
        default:
          return;
      }
    },
  });

  useEffect(() => {
    setIsLoading(true);
    if (formik.values.billing_info.contact_id) {
      const getSalesInvFromBill = getSalesInvoiceFromBillingNote(
        formik.values.billing_info.contact_id
      );
      const getContactWithId = getContactById(
        formik.values.billing_info.contact_id
      );
      Promise.all([getSalesInvFromBill, getContactWithId]).then((values) => {
        if (values[0].data.status === "success") {
          let myData = values[0].data.data;
          if (myData.length > 0) {
            setSalesInvoiceList(myData);
          } else {
            setSalesInvoiceList([]);
          }
        }
        if (values[1].data.status === "success") {
          let myData = values[1].data.data;
          setSelectedContact(myData);
        }
        setIsLoading(false);
      });
    }
  }, [formik.values.billing_info.contact_id]);

  useEffect(() => {
    if (selectedImportdocument.length > 0) {
      const formatDocumentBillingInfo = selectedImportdocument.map(
        (billing) => billing.sales_invoice.billing_info
      );
      const formatDocumentSalesInvoiceData = selectedImportdocument.map(
        (billing) => billing.sales_invoice.sales_invoice_data
      );
      setAllBillingInfo(formatDocumentBillingInfo);
      let allSalesInvoice = [];
      formatDocumentSalesInvoiceData.forEach((salesInvoiceData) =>
        salesInvoiceData.forEach((data) => allSalesInvoice.push(data))
      );
      setSalesInvoiceData(allSalesInvoice);
      const allNetAmount = selectedImportdocument.map(
        (vendor) => vendor.sales_invoice.net_amount
      );
      setAllNetAmount(allNetAmount);
    }
  }, [selectedImportdocument]);

  const handleStartDateChange = (newValue) => {
    formik.setFieldValue("billing_note_issue_date", newValue);
  };

  const handleEndDateChange = (newValue) => {
    formik.setFieldValue("billing_note_due_date", newValue);
  };

  const saveDraftHandler = () => {
    formik.setFieldValue("action", actionType.saveToDraft);
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
    cancelBillingNote(billingNoteDocumentId)
      .then((data) => {
        console.log(data);
        setStatus("cancelled");
        dispatch(showSnackbar("success", "ยกเลิกใบวางบิลสำเร็จ"));
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "ยกเลิกใบวางบิลไม่สำเร็จ"));
        setIsLoading(false);
        console.log(err);
      });
  };

  const printItemsHandler = (_, index) => {
    if (index === 0) {
      setAnchorPrintEl(null);
      history.push(`/income/billing-note/${id}/pdf`);
    }
  };

  const optionItemsHandler = (_, index) => {
    if (index === 0) {
      setAnchorOptionEl(null);
      openCancelConfirmationHandler();
    } else if (index === 1) {
      setAnchorOptionEl(null);
      setEditButtonClick(true);
    }
  };

  const editCancelled = () => {
    setEditButtonClick(false);
    setIsLoading(true);
    getBillingNoteById(billingNoteDocumentId)
      .then((data) => {
        if (data.data.status === "success") {
          const myData = data.data.data;
          const formatData = {
            ...myData,
            billing_note_issue_date: unixToDate(myData.billing_note_issue_date),
            billing_note_due_date: unixToDate(myData.billing_note_due_date),
          };
          formik.setValues(formatData);
          setStatus(formatData.billing_note_status);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err.response.data);
      });
  };

  const editWaitPayment = () => {
    formik.setFieldValue("action", actionType.editWaitPayment);
  };

  const createPaymentReceiptHandler = () => {
    setIsLoading(true);
    postReceiptFromBillingNote(billingNoteDocumentId)
      .then((data) => {
        console.log("sales_invoice", data.data.data);
        setStatus("closed");
        const formatData = {
          ...data.data.data,
          payment_receipt_data: data.data.data.payment_receipt_data.map(
            (payment) => ({
              ...payment,
              amount_to_pay: payment.received_amount,
            })
          ),
        };
        history.push("/income/payment-receipt/add", formatData);
        dispatch(showSnackbar(data.data.status, "สร้างใบรับชำระสำเร็จ"));
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "สร้างใบรับชำระไม่สำเร็จ"));
        setIsLoading(false);
        console.log(err.response.data);
      });
  };

  const submitSalesInvoiceHandler = () => {
    const documentList = selectedImportdocument.map((document) => ({
      id: document.id,
      ...document.billing_note_data,
    }));
    const salesInvoiceDocumentIdList = selectedImportdocument.map(
      (document) => document.sales_invoice.sales_invoice_document_id
    );
    const sales_invoice_project_list = selectedImportdocument.map(
      (document) => ({
        project_id: document.sales_invoice.billing_info.project_id,
        project_name: document.sales_invoice.billing_info.project_name,
      })
    );
    setSelectedSalesInvoice(true);
    formik.setFieldValue("document_list", documentList);
    formik.setFieldValue(
      "sales_invoice_document_id_list",
      salesInvoiceDocumentIdList
    );
    formik.setFieldValue(
      "sales_invoice_project_list",
      sales_invoice_project_list
    );
  };

  const allProjectList = allBillingInfo.map((info) => {
    return {
      project_id: info.project_id,
      project_name: info.project_name,
    };
  });

  const filterProjectList = allProjectList.filter(
    (project) => project.project_id.length !== 0 && project.project_name !== 0
  );

  const uniqueProjectList = [
    ...new Map(
      filterProjectList.map((item) => [item["project_name"], item])
    ).values(),
  ];

  const clickProjectRefHandler = (projectId) => {
    window.open(`/sales/project/${projectId}`, "_blank");
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
        <BreadcrumbComponent name="ใบวางบิล" to="/income/billing-note" />
        {billingNoteDocumentId !== "-" ? (
          <BreadcrumbComponent
            name={billingNoteDocumentId}
            to={"/income/billing-note/" + billingNoteDocumentId}
          />
        ) : (
          <BreadcrumbComponent
            name="เพิ่มใบวางบิล"
            to="/income/billing-note/add"
          />
        )}
      </Breadcrumbs>
      {selectedSalesInvoice ? (
        <>
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
                  !billingNoteData.payment_receipt_list ||
                  billingNoteData.payment_receipt_list.length === 0
                    ? {
                        cursor: "not-allowed !important",
                        pointerEvents: "all !important",
                      }
                    : { color: "#419644 !important" }
                }
                label="รับชำระ"
                disabled={
                  !billingNoteData.payment_receipt_list ||
                  billingNoteData.payment_receipt_list.length === 0
                }
                {...a11yProps(1)}
              />
            </Tabs>
          </Box>
          <TabPanel value={tabValue} index={0}>
            <div className="account__formHeader-primary">
              <div className="account__formHeader-labelContainer">
                <h2 className="form-heading">ใบวางบิล</h2>
                {renderStatus(status)}
                {dateToUnix(formik.values.billing_note_due_date) <
                  currentTimestamp &&
                  formik.values.billing_note_status !== "closed" &&
                  renderStatus("expired")}
              </div>
              <div className="account__buttonContainer">
                <AccountSplitButtonComponent
                  disabled={disabled.print}
                  defaultButtonValue="พิมพ์เอกสาร"
                  options={["พิมพ์ใบวางบิล"]}
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
                  options={["ยกเลิก", "แก้ไข"]}
                  handleMenuItemClick={optionItemsHandler}
                  open={openOption}
                  anchorEl={anchorOptionEl}
                  handleOpen={handleOpenOptionMenu}
                  handleClose={handleCloseOptionMenu}
                  variant="outlined"
                />
                {status === "wait_payment" && (
                  <Button
                    variant="contained"
                    onClick={createPaymentReceiptHandler}
                  >
                    รับชำระเงิน
                  </Button>
                )}
              </div>
            </div>
            <form onSubmit={formik.handleSubmit}>
              <div className="account__formHeader-secondary">
                <div className="account__formHeader-document">
                  <h4>เลขที่เอกสาร</h4>
                  <p>{billingNoteDocumentId}</p>
                </div>
                <div className="account__formHeader-datetime">
                  <AccountDateComponent
                    disabled={disabled.edit}
                    startDateLabel="วันที่ออกเอกสาร"
                    endDateLabel="ใช้ได้ถึง"
                    startDateValue={formik.values.billing_note_issue_date}
                    endDateValue={formik.values.billing_note_due_date}
                    startDateName="billing_note_issue_date"
                    endDateName="billing_note_due_date"
                    handleStartDateChange={handleStartDateChange}
                    handleEndDateChange={handleEndDateChange}
                    startDateError={formik.errors.billing_note_issue_date}
                    endDateError={formik.errors.billing_note_due_date}
                  />
                </div>
              </div>
              {allProjectList && uniqueProjectList.length > 0 && (
                <div className="account__refDocumentChip">
                  <h4>โครงการที่เกี่ยวข้อง</h4>
                  {uniqueProjectList.map((document) => (
                    <Chip
                      key={document.project_id}
                      sx={{ fontSize: "1rem", padding: ".25rem" }}
                      color="success"
                      label={document.project_name}
                      variant="outlined"
                      onClick={() =>
                        clickProjectRefHandler(document.project_id)
                      }
                      onDelete={null}
                    />
                  ))}
                </div>
              )}
              <AccountCustomerComponent
                selectedContact={selectedContact}
                formik={formik}
                disabled={disabled.edit}
                allBillingInfo={allBillingInfo}
                contacts={contacts}
                contactId={formik.values.billing_info.contact_id}
                error={formik.errors.billing_info?.contact_id}
                billingNote
              />
              <Box sx={{ mb: 4 }}>
                <PaymentHistory
                  salesInvoiceList={formik.values.document_list}
                />
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <AccountTemplateComponent
                    disabled={disabled.edit}
                    remarkId={formik.values.billing_note_template_remark_id}
                    formik={formik}
                    allTemplate={allTemplate}
                    id="billing_note_template_remark_id"
                    detail="billing_note_remark"
                    remark={formik.values.billing_note_remark}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <AccountSummaryComponent
                    isLoading={isLoading}
                    summary
                    noShipping
                    noDiscount
                    formik={formik}
                    disabled={disabled.edit}
                    data={salesInvoiceData}
                    billingNoteNetAmount={allNetAmount}
                    billingNoteData={formik.values.document_list}
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
                {(status === "create" || status === "draft") && (
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
                      onClick={approveHandler}
                    >
                      อนุมัติ
                    </Button>
                  </>
                )}
                {status === "wait_payment" && editButtonClick && (
                  <>
                    <Button variant="contained" onClick={editCancelled}>
                      ยกเลิก
                    </Button>
                    <Button
                      variant="contained"
                      type="submit"
                      onClick={editWaitPayment}
                    >
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
                  title="ยืนยันการยกเลิกใบวางบิล"
                  description="หากยกเลิกแล้วจะไม่สามารถเปลี่ยนแปลงรายการได้"
                />
              )}
            </form>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <ReceiptTabComponent
              paymentReceiptList={billingNoteData.payment_receipt_list}
            />
          </TabPanel>
        </>
      ) : (
        <>
          <div className="account__formHeader-primary">
            <div className="account__formHeader-labelContainer">
              <h2 className="form-heading">ใบวางบิล</h2>
            </div>
          </div>
          <AccountCustomerComponent
            formik={formik}
            contacts={contacts}
            billingNoteContact
          />
          <SalesInvoiceTable
            salesInvoiceList={salesInvoiceList}
            setSelectedImportdocument={setSelectedImportdocument}
          />
          <Button
            disabled={selectedImportdocument.length === 0}
            sx={{ mt: "1rem" }}
            variant="contained"
            onClick={submitSalesInvoiceHandler}
          >
            ถัดไป
          </Button>
        </>
      )}
    </>
  );
};

export default AddBillingNoteComponent;
