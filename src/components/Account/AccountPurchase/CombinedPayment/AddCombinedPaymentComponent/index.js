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
import AccountDateComponent from "../../../AccountDateComponent";
import AccountSplitButtonComponent from "../../../AccountSplitButtonComponent";
import AccountTemplateComponent from "../../../AccountTemplateComponent";
import AccountSummaryComponent from "../../../AccountSummaryComponent";
import AccountConfirmationComponent from "../../../AccountConfirmationComponent";
import { renderStatus } from "../../../renderStatus";
import { useParams, useLocation, useHistory } from "react-router-dom";
import {
  getRemarkTemplate,
  getCombinedPaymentById,
  updateCombinedPayment,
  postCombinedPayment,
  cancelCombinedPayment,
  postPaymentMadeFromCombinedPayment,
  getPurchaseInvoiceFromCombinedPayment,
  getContactOption,
} from "../../../../../adapter/Api";
import PaymentMadeTabComponent from "./PaymentMadeTabComponent";
import { initialValues, validationSchema } from "./payload";
import { useFormik } from "formik";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import { useDispatch } from "react-redux";
import { disabledStatus } from "./disabledStatus";
import PaymentHistory from "./PaymentHistory";
import PurchaseInvoiceTable from "./PurchaseInvoiceTable";
import {
  actionType,
  dateToUnix,
  unixToDate,
} from "../../../../../adapter/Utils";
import AccountVendorComponent from "../../../AccountVendorComponent";

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

const AddCombinedPaymentComponent = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const [combinedPaymentId, setCombinedPaymentId] = useState();
  const [combinedPaymentdocumentId, setCombinedPaymentdocumentId] =
    useState("-");
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
  const [combinedPaymentData, setCombinedPaymentData] = useState(initialValues);
  const [contacts, setContacts] = useState();
  const [allTemplate, setAllTemplate] = useState();
  const [purchaseInvoiceList, setPurchaseInvoiceList] = useState([]);
  const [selectedPurchaseInvoice, setSelectedPurchaseInvoice] = useState(false);
  const [selectedImportdocument, setSelectedImportdocument] = useState([]);
  const [purchaseInvoiceData, setPurchaseInvoiceData] = useState([]);
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
    const getContacts = getContactOption(["vendor"]);
    const getRemarks = getRemarkTemplate();
    if (id) {
      setIsLoading(true);
      setSelectedPurchaseInvoice(true);
      const getCombinedPayment = getCombinedPaymentById(id);
      Promise.all([getContacts, getRemarks, getCombinedPayment])
        .then((values) => {
          if (values[0].data.status === "success") {
            let myData = values[0].data.data;
            const filterContact = myData.filter(
              (contact) =>
                contact.contact_status !== "delete" &&
                contact.contact_is_vendor === 1
            );
            setContacts(filterContact);
          }
          if (values[1].data.status === "success") {
            let myData = values[1].data.data;
            setAllTemplate(myData);
          }
          if (values[2].data.status === "success") {
            let myData = values[2].data.data;
            // let allPurchaseInvoice = [];
            // myData.purchase_invoices.forEach((purchaseInvoice) =>
            //   purchaseInvoice.purchase_invoice_data.forEach((data) =>
            //     allPurchaseInvoice.push(data)
            //   )
            // );
            // const allNetAmount = myData.purchase_invoices.map(
            //   (purchaseInvoices) => purchaseInvoices.net_amount
            // );
            // setAllNetAmount(allNetAmount);
            // setPurchaseInvoiceData(allPurchaseInvoice);
            setCombinedPaymentData(myData);
            setStatus(myData.combined_payment_status);
            setCombinedPaymentId(myData.combined_payment_id);
            setCombinedPaymentdocumentId(myData.combined_payment_document_id);
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
            const filterContact = myData.filter(
              (contact) =>
                contact.contact_status !== "delete" &&
                contact.contact_is_vendor === 1
            );
            setContacts(filterContact);
          }
          if (values[1].data.status === "success") {
            let myData = values[1].data.data;
            setAllTemplate(myData);
          }
          setCombinedPaymentData((prev) => {
            return {
              ...prev,
              combined_payment_issue_date: moment().format(),
              combined_payment_due_date: moment().add(7, "days").format(),
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
      combinedPaymentData.combined_payment_issue_date &&
      combinedPaymentData.combined_payment_due_date
        ? {
            ...combinedPaymentData,
            combined_payment_issue_date: unixToDate(
              combinedPaymentData.combined_payment_issue_date
            ),
            combined_payment_due_date: unixToDate(
              combinedPaymentData.combined_payment_due_date
            ),
          }
        : combinedPaymentData,
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const postPayload = {
        ...values,
        combined_payment_id: combinedPaymentId,
        combined_payment_document_id: combinedPaymentdocumentId,
        combined_payment_issue_date: dateToUnix(
          values.combined_payment_issue_date
        ),
        combined_payment_due_date: dateToUnix(values.combined_payment_due_date),
      };

      delete postPayload.payment_made_list;
      delete postPayload.action;

      switch (values.action) {
        case actionType.saveToDraft:
          setIsLoading(true);
          if (combinedPaymentdocumentId !== "-") {
            console.log("updated", postPayload);
            updateCombinedPayment("", combinedPaymentdocumentId, postPayload)
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
            postCombinedPayment("", postPayload)
              .then((data) => {
                setStatus("draft");
                if (data.data.data.insertId && data.data.data.documentId) {
                  setCombinedPaymentId(data.data.data.insertId);
                  setCombinedPaymentdocumentId(data.data.data.documentId);
                  history.push(
                    `/expense/combined-payment/${data.data.data.documentId}`
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
          postCombinedPayment("approve", postPayload)
            .then((data) => {
              setStatus("wait_payment");
              dispatch(showSnackbar(data.data.status, "อนุมัติสำเร็จ"));
              history.push(
                `/expense/combined-payment/${data.data.data.documentId}`
              );
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
            postPayload.combined_payment_status = "wait_payment";
          }
          updateCombinedPayment("", combinedPaymentdocumentId, postPayload)
            .then((data) => {
              dispatch(showSnackbar(data.data.status, "บันทึกร่างสำเร็จ"));
              setIsLoading(false);
            })
            .catch(() => {
              dispatch(showSnackbar("error", "บันทึกร่างไม่สำเร็จ"));
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
    if (formik.values.vendor_info.contact_id) {
      getPurchaseInvoiceFromCombinedPayment(
        formik.values.vendor_info.contact_id
      )
        .then((data) => {
          let myData = data.data.data;
          if (myData.length > 0) {
            setPurchaseInvoiceList(myData);
          } else {
            setPurchaseInvoiceList([]);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }
  }, [formik.values.vendor_info.contact_id]);

  useEffect(() => {
    if (selectedImportdocument.length > 0) {
      const formatDocumentPurchaseInvoiceData = selectedImportdocument.map(
        (vendor) => vendor.purchase_invoice.purchase_invoice_data
      );
      let allPurchaseInvoice = [];
      formatDocumentPurchaseInvoiceData.forEach((purchaseInvoiceData) =>
        purchaseInvoiceData.forEach((data) => allPurchaseInvoice.push(data))
      );
      setPurchaseInvoiceData(allPurchaseInvoice);
      const allNetAmount = selectedImportdocument.map(
        (vendor) => vendor.purchase_invoice.net_amount
      );
      setAllNetAmount(allNetAmount);
    }
  }, [selectedImportdocument]);

  const handleStartDateChange = (newValue) => {
    formik.setFieldValue("combined_payment_issue_date", newValue);
  };

  const handleEndDateChange = (newValue) => {
    formik.setFieldValue("combined_payment_due_date", newValue);
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
    cancelCombinedPayment(combinedPaymentdocumentId)
      .then((data) => {
        console.log(data);
        setStatus("cancelled");
        dispatch(showSnackbar("success", "ยกเลิกใบรวมจ่ายสำเร็จ"));
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "ยกเลิกใบรวมจ่ายไม่สำเร็จ"));
        setIsLoading(false);
        console.log(err);
      });
  };

  const printItemsHandler = (_, index) => {
    if (index === 0) {
      setAnchorPrintEl(null);
      history.push(
        `/expense/combined-payment/${combinedPaymentdocumentId}/pdf`
      );
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
    getCombinedPaymentById(combinedPaymentdocumentId)
      .then((data) => {
        if (data.data.status === "success") {
          const myData = data.data.data;
          const currentTimestamp = moment().unix();
          const formatData = {
            ...myData,
            combined_payment_issue_date: unixToDate(
              myData.combined_payment_issue_date
            ),
            combined_payment_due_date: unixToDate(
              myData.combined_payment_due_date
            ),
            combined_payment_status:
              myData.combined_payment_due_date < currentTimestamp
                ? "expired"
                : myData.combined_payment_status,
          };
          formik.setValues(formatData);
          setStatus(formatData.combined_payment_status);
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

  const createPaymentMadeHandler = () => {
    setIsLoading(true);
    postPaymentMadeFromCombinedPayment(combinedPaymentdocumentId)
      .then((data) => {
        setStatus("closed");
        const formatData = {
          ...data.data.data,
          payment_made_data: data.data.data.payment_made_data.map(
            (payment) => ({
              ...payment,
              amount_to_pay: payment.received_amount,
            })
          ),
        };
        history.push("/expense/payment-made/add", formatData);
        dispatch(showSnackbar(data.data.status, "สร้างใบรับชำระสำเร็จ"));
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "สร้างใบรับชำระไม่สำเร็จ"));
        setIsLoading(false);
        console.log(err.response);
      });
  };

  const submitPurchaseInvoiceHandler = () => {
    const documentList = selectedImportdocument.map((document) => ({
      id: document.id,
      ...document.combined_payment_data,
    }));

    const purchaseInvoiceDocumentIdList = selectedImportdocument.map(
      (document) => document.purchase_invoice.purchase_invoice_document_id
    );

    setSelectedPurchaseInvoice(true);
    formik.setFieldValue("document_list", documentList);
    formik.setFieldValue(
      "purchase_invoice_document_id_list",
      purchaseInvoiceDocumentIdList
    );
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
        <BreadcrumbComponent name="รายจ่าย" to="/expense" />
        <BreadcrumbComponent name="ใบรวมจ่าย" to="/expense/combined-payment" />
        {combinedPaymentdocumentId !== "-" ? (
          <BreadcrumbComponent
            name={combinedPaymentdocumentId}
            to={"/expense/combined-payment/" + combinedPaymentdocumentId}
          />
        ) : (
          <BreadcrumbComponent
            name="เพิ่มใบรวมจ่าย"
            to="/expense/combined-payment/add"
          />
        )}
      </Breadcrumbs>
      {selectedPurchaseInvoice ? (
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
                  !combinedPaymentData.payment_made_list ||
                  combinedPaymentData.payment_made_list.length === 0
                    ? {
                        cursor: "not-allowed !important",
                        pointerEvents: "all !important",
                      }
                    : { color: "#419644 !important" }
                }
                label="รับชำระ"
                disabled={
                  !combinedPaymentData.payment_made_list ||
                  combinedPaymentData.payment_made_list.length === 0
                }
                {...a11yProps(1)}
              />
            </Tabs>
          </Box>
          <TabPanel value={tabValue} index={0}>
            <div className="account__formHeader-primary">
              <div className="account__formHeader-labelContainer">
                <h2 className="form-heading">ใบรวมจ่าย</h2>
                {renderStatus(status)}
                {dateToUnix(formik.values.combined_payment_due_date) <
                  currentTimestamp &&
                  formik.values.combined_payment_status !== "closed" &&
                  renderStatus("expired")}
              </div>
              <div className="account__buttonContainer">
                <AccountSplitButtonComponent
                  disabled={disabled.print}
                  defaultButtonValue="พิมพ์เอกสาร"
                  options={["พิมพ์ใบรวมจ่าย"]}
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
                {status === "wait_payment" && (
                  <Button
                    variant="contained"
                    onClick={createPaymentMadeHandler}
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
                  <p>{combinedPaymentdocumentId}</p>
                </div>
                <div className="account__formHeader-datetime">
                  <AccountDateComponent
                    disabled={disabled.edit}
                    startDateLabel="วันที่ออกเอกสาร"
                    endDateLabel="ใช้ได้ถึง"
                    startDateValue={formik.values.combined_payment_issue_date}
                    endDateValue={formik.values.combined_payment_due_date}
                    startDateName="combined_payment_issue_date"
                    endDateName="combined_payment_due_date"
                    handleStartDateChange={handleStartDateChange}
                    handleEndDateChange={handleEndDateChange}
                  />
                </div>
              </div>
              <AccountVendorComponent
                accountPurchase
                disabled={disabled.edit}
                formik={formik}
                contacts={contacts}
                contactId={formik.values.vendor_info.contact_id}
              />
              <Box sx={{ mb: 4 }}>
                <PaymentHistory
                  purchaseInvoiceList={formik.values.document_list}
                />
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <AccountTemplateComponent
                    disabled={disabled.edit}
                    remarkId={formik.values.combined_payment_template_remark_id}
                    formik={formik}
                    allTemplate={allTemplate}
                    id="combined_payment_template_remark_id"
                    detail="combined_payment_remark"
                    remark={formik.values.combined_payment_remark}
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
                    data={purchaseInvoiceData}
                    billingNoteNetAmount={allNetAmount}
                    billingNoteData={formik.values.document_list}
                    tableType="purchase"
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
                      type="submit"
                      variant="contained"
                      onClick={saveDraftHandler}
                    >
                      บันทึกร่าง
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
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
                      type="submit"
                      variant="contained"
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
                  title="ยืนยันการยกเลิกใบรวมจ่าย"
                  description="หากยกเลิกแล้วจะไม่สามารถเปลี่ยนแปลงรายการได้"
                />
              )}
            </form>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <PaymentMadeTabComponent
              paymentMadeList={combinedPaymentData.payment_made_list}
            />
          </TabPanel>
        </>
      ) : (
        <>
          <div className="account__formHeader-primary">
            <div className="account__formHeader-labelContainer">
              <h2 className="form-heading">ใบรวมจ่าย</h2>
            </div>
          </div>
          <AccountVendorComponent
            formik={formik}
            contacts={contacts}
            combinedPaymentContact
          />
          <PurchaseInvoiceTable
            purchaseInvoiceList={purchaseInvoiceList}
            setSelectedImportdocument={setSelectedImportdocument}
          />
          <Button
            sx={{ mt: "1rem" }}
            variant="contained"
            onClick={submitPurchaseInvoiceHandler}
          >
            ถัดไป
          </Button>
        </>
      )}
    </>
  );
};

export default AddCombinedPaymentComponent;
