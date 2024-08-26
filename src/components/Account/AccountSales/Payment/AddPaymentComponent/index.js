import {
  Backdrop,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Grid,
} from "@mui/material";
import moment from "moment";
import React, { useState, useEffect } from "react";
import BreadcrumbComponent from "../../../../BreadcrumbComponent";
import AccountCustomerComponent from "../../../AccountCustomerComponent";
import AccountDateComponent from "../../../AccountDateComponent";
import AccountSplitButtonComponent from "../../../AccountSplitButtonComponent";
import AccountProgressBarComponent from "../../../AccountProgressBarComponent";
import { renderStatus } from "../../../renderStatus";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import {
  getReceiptById,
  postReceipt,
  updateReceipt,
  cancelReceipt,
  getPaymentChannel,
  copyReceipt,
  getRemarkTemplate,
  getProjectOption,
  getContactOption,
} from "../../../../../adapter/Api";
import AccountPaymentMethodComponent from "../../../AccountPaymentMethodComponent";
import { initialValues, validationSchema } from "./payload";
import { useFormik } from "formik";
import PaymentHistory from "./PaymentHistory";
import { disabledStatus } from "./disabledStatus";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import { useDispatch } from "react-redux";
import PaymentEvidence from "./PaymentEvidence";
import AccountConfirmationComponent from "../../../AccountConfirmationComponent";
import { unixToDate, actionType } from "../../../../../adapter/Utils";
import PaymentDepositHistory from "./PaymentDepositHistory";
import AccountTemplateComponent from "../../../AccountTemplateComponent";
import AccountSummaryComponent from "../../../AccountSummaryComponent";

const AddPaymentComponent = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();
  const location = useLocation();
  const [paymentReceiptData, setPaymentReceiptData] = useState(initialValues);
  const [refDocumentId, setRefDocumentId] = useState();
  const [paymentReceiptId, setPaymentReceiptId] = useState();
  const [paymentReceiptDocumentId, setPaymentReceiptDocumentId] = useState("-");
  const [status, setStatus] = useState("create");
  const [cancel, setCancel] = useState(false);
  const [disabled, setDisabled] = useState({
    print: true,
    options: true,
    editButton: true,
    cancelButton: true,
    date: true,
    remark: true,
    payment: true,
    upload: true,
  });
  const [editButtonClick, setEditButtonClick] = useState(false);
  const [allPaymentChannel, setAllPaymentChannel] = useState();
  const [allTemplate, setAllTemplate] = useState();
  const [cancelConfirmation, setCancelConfirmation] = useState(false);
  const [copyConfirmation, setCopyConfirmation] = useState(false);
  const [projects, setProjects] = useState();
  const [contacts, setContacts] = useState();
  const [isLoading, setIsLoading] = useState(false);

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

  const printItemsHandler = (_, index) => {
    if (index === 0) {
      setAnchorPrintEl(null);
      history.push(`/income/payment-receipt/${id}/pdf`);
    }
  };

  useEffect(() => {
    disabledStatus(status, setDisabled, setCancel, editButtonClick);
  }, [editButtonClick, status]);

  useEffect(() => {
    const getProjects = getProjectOption(["project_status"]);
    const getContacts = getContactOption(["customer"]);
    const getAllPaymentChannel = getPaymentChannel();
    const getRemark = getRemarkTemplate();
    if (id) {
      setIsLoading(true);
      const getPaymentReceipt = getReceiptById(id);
      Promise.all([
        getProjects,
        getContacts,
        getPaymentReceipt,
        getAllPaymentChannel,
        getRemark,
      ])
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
            setPaymentReceiptData(myData);
            setStatus(myData.payment_receipt_status);
            setPaymentReceiptId(myData.payment_receipt_id);
            setPaymentReceiptDocumentId(myData.payment_receipt_document_id);
            setRefDocumentId(myData.ref_document_id);
          }
          if (values[3].data.status === "success") {
            let myData = values[3].data.data;
            setAllPaymentChannel(myData);
          }
          if (values[4].data.status === "success") {
            let myData = values[4].data.data;
            setAllTemplate(myData);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    } else if (location.state) {
      setIsLoading(true);
      Promise.all([
        getProjects,
        getContacts,
        getAllPaymentChannel,
        getRemark,
      ]).then((values) => {
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
          setAllPaymentChannel(myData);
        }
        if (values[3].data.status === "success") {
          let myData = values[3].data.data;
          setAllTemplate(myData);
        }
        setIsLoading(false);
      });
      setPaymentReceiptData((prev) => {
        return {
          ...prev,
          ...location.state,
          payment_receipt_data:
            location.state.ref_type === "deposit_invoice"
              ? new Array(location.state.payment_receipt_data)
              : location.state.payment_receipt_data,
          payment_receipt_issue_date: moment().format(),
          payment_date: moment().format(),
        };
      });
      setDisabled({
        print: true,
        options: true,
        editButton: true,
        cancelButton: true,
        date: false,
        remark: false,
        payment: false,
        upload: false,
      });
      setRefDocumentId(location.state.ref_document_id);
    }
  }, [id, location.state]);

  const formik = useFormik({
    initialValues:
      id &&
      paymentReceiptData.payment_receipt_issue_date &&
      paymentReceiptData.payment_date &&
      !isNaN(paymentReceiptData.payment_receipt_issue_date) &&
      !isNaN(paymentReceiptData.payment_date)
        ? {
            ...paymentReceiptData,
            payment_receipt_issue_date: unixToDate(
              paymentReceiptData.payment_receipt_issue_date
            ),
            payment_date: unixToDate(paymentReceiptData.payment_date),
            check_info: paymentReceiptData.check_info
              ? {
                  ...paymentReceiptData.check_info,
                  check_date: unixToDate(
                    paymentReceiptData.check_info.check_date
                  ),
                }
              : null,
          }
        : paymentReceiptData,
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const postPayload = {
        ...values,
        payment_channel_id: values.payment_channel_id ?? null,
        payment_receipt_id: paymentReceiptId,
        payment_receipt_document_id: paymentReceiptDocumentId,
        payment_receipt_issue_date: moment(
          values.payment_receipt_issue_date
        ).format("X"),
        payment_date: moment(values.payment_date).format("X"),
        payment_channel_info: values.payment_channel_info
          ? values.payment_channel_info
          : null,
        check_info: values.check_info
          ? {
              ...values.check_info,
              check_date: moment(values.check_info.check_date).format("X"),
            }
          : null,
        payment_receipt_data: paymentReceiptFormat,
        total_amount: parseFloat(sumTotalAmount),
      };

      delete postPayload.action;

      switch (values.action) {
        case actionType.saveToDraft:
          setIsLoading(true);
          console.log("postPayload", postPayload);
          if (paymentReceiptDocumentId !== "-") {
            updateReceipt(paymentReceiptDocumentId, postPayload)
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
            console.log("postPayload", postPayload);
            postReceipt("", postPayload)
              .then((data) => {
                setStatus("draft");
                if (data.data.data.insertId && data.data.data.documentId) {
                  setPaymentReceiptId(data.data.data.insertId);
                  setPaymentReceiptDocumentId(data.data.data.documentId);
                  history.push(
                    `/income/payment-receipt/${data.data.data.documentId}`
                  );
                }
                dispatch(showSnackbar(data.data.status, "บันทึกร่างสำเร็จ"));
                if (id) setIsLoading(false);
              })
              .catch((err) => {
                dispatch(showSnackbar("error", "บันทึกร่างไม่สำเร็จ"));
                setIsLoading(false);
                console.log(err.response.data);
              });
          }
          break;
        case actionType.approve:
          setIsLoading(true);
          postReceipt("approve", postPayload)
            .then((data) => {
              setStatus("payment_complete");
              if (data.data.data.insertId && data.data.data.documentId) {
                setPaymentReceiptId(data.data.data.insertId);
                setPaymentReceiptDocumentId(data.data.data.documentId);
                history.push(
                  `/income/payment-receipt/${data.data.data.documentId}`
                );
              }
              dispatch(showSnackbar(data.data.status, "อนุมัติสำเร็จ"));
              if (id) setIsLoading(false);
            })
            .catch((err) => {
              dispatch(showSnackbar("error", "อนุมัติไม่สำเร็จ"));
              setIsLoading(false);
              console.log(err.response.data);
            });
          break;
        case actionType.edit:
          setIsLoading(true);
          updateReceipt(paymentReceiptDocumentId, postPayload)
            .then((data) => {
              setStatus("payment_complete");
              dispatch(showSnackbar(data.data.status, "บันทึกสำเร็จ"));
              setIsLoading(false);
            })
            .catch(() => {
              setIsLoading(false);
              dispatch(showSnackbar("error", "บันทึกไม่สำเร็จ"));
            });
          setEditButtonClick(false);
          break;
        default:
          return;
      }
    },
  });

  const handlePaymentDateChange = (newValue) => {
    formik.setFieldValue("payment_receipt_issue_date", newValue);
  };

  const paymentReceiptFormat = formik.values.payment_receipt_data?.map(
    (payment) => ({
      ...payment,
      received_amount: parseFloat(payment.received_amount),
    })
  );

  const sumTotalAmount = formik.values.payment_receipt_data.reduce(
    (prev, curr) => {
      return prev + curr.received_amount;
    },
    0
  );

  const saveDraftHandler = () => {
    formik.setFieldValue("action", actionType.saveToDraft);
  };

  const paymentCompletedHandler = () => {
    formik.setFieldValue("action", actionType.approve);
  };

  const switchRefLinkHanlder = (ref_type) => {
    switch (ref_type) {
      case "sales_invoice":
        return `/income/sales-invoice/${refDocumentId}`;
      case "billing_note":
        return `/income/billing-note/${refDocumentId}`;
      case "deposit_invoice":
        return `/income/deposit-invoice/${refDocumentId}`;
      default:
        return;
    }
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
    cancelReceipt(paymentReceiptDocumentId)
      .then((data) => {
        console.log(data);
        setStatus("cancelled");
        dispatch(showSnackbar("success", "ยกเลิกใบรับชำระสำเร็จ"));
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "ยกเลิกใบรับชำระไม่สำเร็จ"));
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
    copyReceipt(paymentReceiptDocumentId)
      .then((data) => {
        history.push("/income/payment-receipt/add");
        dispatch(showSnackbar(data.data.status, "คัดลอกใบรับชำระสำเร็จ"));
        setStatus("create");
        setPaymentReceiptId();
        setPaymentReceiptDocumentId("-");
        setPaymentReceiptData({
          ...data.data.data,
          payment_receipt_issue_date: moment().format(),
        });
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "คัดลอกใบรับชำระไม่สำเร็จ"));
        setIsLoading(false);
        console.log(err);
      });
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
    getReceiptById(paymentReceiptDocumentId)
      .then((data) => {
        if (data.data.status === "success") {
          const myData = data.data.data;
          const formatData = {
            ...myData,
            payment_receipt_issue_date: unixToDate(
              myData.payment_receipt_issue_date
            ),
            payment_date: unixToDate(myData.payment_date),
            check_info: myData.check_info
              ? {
                  ...myData.check_info,
                  check_date: unixToDate(myData.check_info.check_date),
                }
              : null,
          };
          formik.setValues(formatData);
          setStatus(formatData.payment_receipt_status);
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
        <BreadcrumbComponent name="การรับชำระ" to="/income/payment-receipt" />
        {paymentReceiptDocumentId !== "-" ? (
          <BreadcrumbComponent
            name={paymentReceiptDocumentId}
            to={"/income/payment-receipt/" + paymentReceiptDocumentId}
          />
        ) : (
          <BreadcrumbComponent
            name="เพิ่มใบรับชำระ"
            to="/income/payment-receipt/add"
          />
        )}
      </Breadcrumbs>
      <div className="account__progressContainer">
        <AccountProgressBarComponent
          step="receipt"
          paymentCompleted={status === "payment_complete"}
          receiptCancelled={cancel}
        />
      </div>
      <div className="account__formHeader-primary">
        <div className="account__formHeader-labelContainer">
          <h2 className="form-heading">
            {location.state && location.state.ref_type === "deposit_invoice"
              ? "การรับชำระมัดจำ"
              : "การรับชำระ"}
          </h2>
          {renderStatus(status)}
        </div>
        <div className="account__buttonContainer">
          <AccountSplitButtonComponent
            disabled={disabled.print}
            defaultButtonValue="พิมพ์เอกสาร"
            options={["พิมพ์การรับชำระ"]}
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
            <p>{paymentReceiptDocumentId}</p>
          </div>
          <div className="account__formHeader-datetime">
            <AccountDateComponent
              disabled={disabled.date}
              startDateLabel="วันที่ชำระเงิน"
              startDateValue={formik.values.payment_receipt_issue_date}
              startDateName="payment_receipt_issue_date"
              handleStartDateChange={handlePaymentDateChange}
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
        <AccountCustomerComponent
          disabled={true}
          formik={formik}
          projects={projects}
          contacts={contacts}
          projectId={formik.values.billing_info.project_id}
          contactId={formik.values.billing_info.contact_id}
          accountSales
        />
        <AccountPaymentMethodComponent
          disabled={disabled.payment}
          formik={formik}
          allPaymentChannel={allPaymentChannel}
          billingNote={
            location.state && location.state.ref_type === "billing_note"
          }
        />
        {((location.state && location.state.ref_type !== "deposit_invoice") ||
          (formik.values.ref_type &&
            formik.values.ref_type !== "deposit_invoice")) && (
          <PaymentHistory
            paymentReceiptList={formik.values.payment_receipt_data}
            formik={formik}
            disabled={disabled.payment}
            billingNote={
              location.state && location.state.ref_type === "billing_note"
            }
          />
        )}
        {((location.state && location.state.ref_type === "deposit_invoice") ||
          (formik.values.ref_type &&
            formik.values.ref_type === "deposit_invoice")) && (
          <PaymentDepositHistory
            paymentReceiptData={formik.values.payment_receipt_data}
            formik={formik}
            disabled={disabled.payment}
          />
        )}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <AccountTemplateComponent
              disabled={disabled.remark}
              remarkId={formik.values.payment_receipt_template_remark_id}
              formik={formik}
              allTemplate={allTemplate}
              id="payment_receipt_template_remark_id"
              detail="payment_receipt_remark"
              remark={formik.values.payment_receipt_remark}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <AccountSummaryComponent
              formik={formik}
              data={formik.values.payment_receipt_data}
              OnlyWithHoldingTax
              tableType="sale"
              disabled={disabled}
              noDiscount
              noShipping
            />
          </Grid>
        </Grid>

        <PaymentEvidence
          setIsLoading={setIsLoading}
          disabled={disabled.upload}
          formik={formik}
        />
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
                onClick={paymentCompletedHandler}
              >
                อนุมัติ
              </Button>
            </>
          )}
          {status === "payment_complete" && editButtonClick && (
            <>
              <Button variant="contained" onClick={editCancelled}>
                ยกเลิก
              </Button>
              <Button variant="contained" type="submit" onClick={editFinished}>
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
            title="ยืนยันการยกเลิกใบชำระเงิน"
            description="หากยกเลิกแล้วจะไม่สามารถเปลี่ยนแปลงรายการได้"
          />
        )}
        {copyConfirmation && (
          <AccountConfirmationComponent
            open={copyConfirmation}
            handleClose={closeCopyConfirmationHandler}
            handleSubmit={submitCopyConfirmationHandler}
            title="ยืนยันการคัดลอกใบชำระเงิน"
          />
        )}
      </form>
    </>
  );
};

export default AddPaymentComponent;
