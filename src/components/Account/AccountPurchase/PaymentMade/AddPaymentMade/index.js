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
import AccountDateComponent from "../../../AccountDateComponent";
import AccountSplitButtonComponent from "../../../AccountSplitButtonComponent";
import { renderStatus } from "../../../renderStatus";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import {
  getEmployeeById,
  getPaymentChannel,
  getPaymentMadeById,
  updatePaymentMade,
  postPaymentMade,
  cancelPaymentMade,
  getContactOption,
  getRemarkTemplate,
  copyPaymentMade,
} from "../../../../../adapter/Api";
import AccountPaymentMethodComponent from "../../../AccountPaymentMethodComponent";
import { initialValues, validationSchema } from "./payload";
import { useFormik } from "formik";
import { disabledStatus } from "./disabledStatus";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import { useDispatch } from "react-redux";
import PaymentMadeEvidence from "./PaymentMadeEvidence";
import { getUser } from "../../../../../adapter/Auth";
import AccountConfirmationComponent from "../../../AccountConfirmationComponent";
import AccountVendorComponent from "../../../AccountVendorComponent";
import PaymentMadeHistory from "./PaymentMadeHisory";
import {
  actionType,
  dateToUnix,
  unixToDate,
} from "../../../../../adapter/Utils";
import AccountTemplateComponent from "../../../AccountTemplateComponent";
import AccountSummaryComponent from "../../../AccountSummaryComponent";

const AddPaymentMadeComponent = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const user = getUser();
  const [defaultUser, setDefaultUser] = useState({});
  const { id } = useParams();
  const location = useLocation();
  const [paymentMadeData, setPaymentMadeData] = useState(initialValues);
  const [allTemplate, setAllTemplate] = useState();
  const [refDocumentId, setRefDocumentId] = useState();
  const [paymentMadeId, setPaymentMadeId] = useState();
  const [paymentMadeDocumentId, setPaymentMadeDocumentId] = useState("-");
  const [status, setStatus] = useState("create");
  const [disabled, setDisabled] = useState({
    print: true,
    options: true,
    editButton: true,
    cancelButton: true,
    date: true,
    externalRef: true,
    remark: true,
    payment: true,
    upload: true,
  });
  const [allPaymentChannel, setAllPaymentChannel] = useState();
  const [editButtonClick, setEditButtonClick] = useState(false);
  const [cancelConfirmation, setCancelConfirmation] = useState(false);
  const [copyConfirmation, setCopyConfirmation] = useState(false);

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
      history.push(`/expense/payment-made/${paymentMadeDocumentId}/pdf`);
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
    cancelPaymentMade(paymentMadeDocumentId)
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
    copyPaymentMade(paymentMadeDocumentId)
      .then((data) => {
        history.push("/expense/payment-made/add");
        dispatch(showSnackbar(data.data.status, "คัดลอกใบชำระเงินสำเร็จ"));
        setStatus("create");
        setPaymentMadeId();
        setPaymentMadeDocumentId("-");
        setPaymentMadeData({
          ...data.data.data,
          payment_made_issue_date: moment().format(),
        });
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "คัดลอกใบชำระเงินไม่สำเร็จ"));
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

  useEffect(() => {
    disabledStatus(status, setDisabled, editButtonClick);
  }, [editButtonClick, status]);

  useEffect(() => {
    const getContacts = getContactOption(["vendor"]);
    const getEmployee = getEmployeeById(user.employee_document_id);
    const getAllPaymentChannel = getPaymentChannel();
    const getRemark = getRemarkTemplate();
    if (id) {
      setIsLoading(true);
      const getPaymentMade = getPaymentMadeById(id);
      Promise.all([
        getContacts,
        getPaymentMade,
        getEmployee,
        getAllPaymentChannel,
        getRemark,
      ])
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
            setPaymentMadeData(myData);
            setStatus(myData.payment_made_status);
            setPaymentMadeId(myData.payment_made_id);
            setPaymentMadeDocumentId(myData.payment_made_document_id);
            setRefDocumentId(myData.ref_document_id);
          }
          if (values[2].data.status === "success") {
            let myData = values[2].data.data;
            setDefaultUser(myData);
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
        getContacts,
        getEmployee,
        getAllPaymentChannel,
        getRemark,
      ]).then((values) => {
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
          setDefaultUser(myData);
        }
        if (values[2].data.status === "success") {
          let myData = values[2].data.data;
          setAllPaymentChannel(myData);
        }
        if (values[3].data.status === "success") {
          let myData = values[3].data.data;
          setAllTemplate(myData);
        }
        setPaymentMadeData((prev) => {
          return {
            ...prev,
            ...location.state,
            payment_made_issue_date: moment().format(),
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
        setIsLoading(false);
      });
    }
  }, [id, location.state, user.employee_document_id]);

  const formik = useFormik({
    initialValues:
      id &&
      paymentMadeData.payment_made_issue_date &&
      paymentMadeData.payment_date
        ? {
            ...paymentMadeData,
            payment_made_issue_date: unixToDate(
              paymentMadeData.payment_made_issue_date
            ),
            payment_date: unixToDate(paymentMadeData.payment_date),
            check_info: paymentMadeData.check_info
              ? {
                  ...paymentMadeData.check_info,
                  check_date: unixToDate(paymentMadeData.check_info.check_date),
                }
              : null,
          }
        : paymentMadeData,
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const postPayload = {
        ...values,
        payment_channel_id: values.payment_channel_id ?? null,
        payment_made_id: paymentMadeId,
        payment_made_document_id: paymentMadeDocumentId,
        payment_made_issue_date: dateToUnix(values.payment_made_issue_date),
        payment_date: dateToUnix(values.payment_date),
        payment_channel_info: values.payment_channel_info
          ? values.payment_channel_info
          : null,
        check_info: values.check_info
          ? {
              ...values.check_info,
              check_date: dateToUnix(values.check_info.check_date),
            }
          : null,
        total_amount: values.payment_made_data[0].received_amount,
      };

      delete postPayload.action;

      switch (values.action) {
        case actionType.saveToDraft:
          setIsLoading(true);
          console.log("postPayload", postPayload);
          if (paymentMadeDocumentId !== "-") {
            updatePaymentMade(paymentMadeDocumentId, postPayload)
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
            postPaymentMade("", postPayload)
              .then((data) => {
                setStatus("draft");
                if (data.data.data.insertId && data.data.data.documentId) {
                  setPaymentMadeId(data.data.data.insertId);
                  setPaymentMadeDocumentId(data.data.data.documentId);
                  history.push(
                    `/expense/payment-made/${data.data.data.documentId}`
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
          postPaymentMade("approve", postPayload)
            .then((data) => {
              setStatus("payment_complete");
              if (data.data.data.insertId && data.data.data.documentId) {
                setPaymentMadeId(data.data.data.insertId);
                setPaymentMadeDocumentId(data.data.data.documentId);
                history.push(
                  `/expense/payment-made/${data.data.data.documentId}`
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
          updatePaymentMade(paymentMadeDocumentId, postPayload)
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
    formik.setFieldValue("payment_made_issue_date", newValue);
  };

  const saveDraftHandler = () => {
    formik.setFieldValue("action", actionType.saveToDraft);
  };

  const paymentCompletedHandler = () => {
    formik.setFieldValue("action", actionType.approve);
  };

  const editCancelled = () => {
    setEditButtonClick(false);
    setIsLoading(true);
    getPaymentMadeById(paymentMadeDocumentId)
      .then((data) => {
        if (data.data.status === "success") {
          const myData = data.data.data;
          const formatData = {
            ...myData,
            payment_made_issue_date: unixToDate(myData.payment_made_issue_date),
            payment_date: unixToDate(myData.payment_date),
            check_info: myData.check_info
              ? {
                  ...myData.check_info,
                  check_date: unixToDate(myData.check_info.check_date),
                }
              : null,
          };
          formik.setValues(formatData);
          setStatus(formatData.payment_made_status);
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
      case "purchase_invoice":
        return `/expense/purchase-invoice/${refDocumentId}`;
      case "combined_payment":
        return `/expense/combined-payment/${refDocumentId}`;
      default:
        return;
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
        <BreadcrumbComponent name="รายจ่าย" to="/expense" />
        <BreadcrumbComponent name="การชำระเงิน" to="/expense/payment-made" />
        {paymentMadeDocumentId !== "-" ? (
          <BreadcrumbComponent
            name={paymentMadeDocumentId}
            to={"/expense/payment-made/" + paymentMadeDocumentId}
          />
        ) : (
          <BreadcrumbComponent
            name="เพิ่มใบชำระเงิน"
            to="/expense/payment-made/add"
          />
        )}
      </Breadcrumbs>
      <form onSubmit={formik.handleSubmit}>
        <div className="account__formHeader-primary">
          <div className="account__formHeader-labelContainer">
            <h2 className="form-heading">การชำระเงิน</h2>
            {renderStatus(status)}
          </div>
          <div className="account__buttonContainer">
            <AccountSplitButtonComponent
              disabled={disabled.print}
              defaultButtonValue="พิมพ์เอกสาร"
              options={["พิมพ์การชำระเงิน"]}
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
        <div className="account__formHeader-secondary">
          <div className="account__formHeader-document">
            <h4>เลขที่เอกสาร</h4>
            <p>{paymentMadeDocumentId}</p>
          </div>
          <div className="account__formHeader-datetime">
            <AccountDateComponent
              disabled={disabled.edit}
              startDateLabel="วันที่ออกเอกสาร"
              startDateValue={formik.values.payment_made_issue_date}
              startDateName="payment_made_issue_date"
              handleStartDateChange={handlePaymentDateChange}
            />
          </div>
        </div>
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
        <AccountVendorComponent
          accountPurchase
          disabled={true}
          formik={formik}
          contacts={contacts}
          contactId={formik.values.vendor_info.contact_id}
        />
        <AccountPaymentMethodComponent
          disabled={disabled.payment}
          formik={formik}
          allPaymentChannel={allPaymentChannel}
        />
        <PaymentMadeHistory
          paymentMadeList={formik.values.payment_made_data}
          formik={formik}
          disabled={disabled.payment}
          combinedPayment={
            location.state && location.state.ref_type === "combined_payment"
          }
        />
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
              data={formik.values.payment_made_data}
              OnlyWithHoldingTax
              tableType="purchase"
              disabled={disabled}
              noDiscount
              noShipping
            />
          </Grid>
        </Grid>
        <PaymentMadeEvidence
          setIsLoading={setIsLoading}
          disabled={disabled.upload}
          formik={formik}
          defaultUser={defaultUser}
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
                type="submit"
                variant="contained"
                onClick={saveDraftHandler}
              >
                บันทึกร่าง
              </Button>
              <Button
                type="submit"
                variant="contained"
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

export default AddPaymentMadeComponent;
