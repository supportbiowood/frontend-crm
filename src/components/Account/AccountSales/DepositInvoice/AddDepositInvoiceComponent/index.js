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
import AccountStaffComponent from "../../../AccountStaffComponent";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { initialValues, validationSchema } from "./payload";
import { useFormik } from "formik";
import {
  cancelDepositInvoice,
  copyDepositInvoice,
  getRemarkTemplate,
  getDepositInvoiceById,
  postDepositInvoice,
  updateDepositInvoice,
  postReceiptFromDepositInvoice,
  getSalesInvoiceByContactId,
  applyDepositToSalesInvoice,
  getProjectOption,
  getContactOption,
} from "../../../../../adapter/Api";
import AccountTemplateComponent from "../../../AccountTemplateComponent";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import { useDispatch } from "react-redux";
import AccountConfirmationComponent from "../../../AccountConfirmationComponent";
import { disabledStatus } from "./disabledStatus";
import {
  actionType,
  dateToUnix,
  unixToDate,
} from "../../../../../adapter/Utils";
import PaymentTabComponent from "./PaymentTabComponent";
import DepositInvoiceTable from "./DepositInvoiceTable";
import DepositInvoiceSummary from "./DepositInvoiceSummary";
import DepositTabComponent from "./DepositTabComponent";

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

const AddDepositInvoiceComponent = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const [depositInvoiceDocumentId, setDepositInvoiceDocumentId] = useState("-");
  const [depositInvoiceId, setDepositInvoiceId] = useState();
  const [editButtonClick, setEditButtonClick] = useState(false);
  const [status, setStatus] = useState("create");
  const [disabled, setDisabled] = useState({
    print: true,
    options: true,
    edit: true,
    editButton: true,
    cancelButton: true,
    depositInvoiceTab: true,
  });
  const [depositInvoiceData, setDepositInvoiceData] = useState(initialValues);
  const [projects, setProjects] = useState();
  const [contacts, setContacts] = useState();
  const [allTemplate, setAllTemplate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [cancelConfirmation, setCancelConfirmation] = useState(false);
  const [copyConfirmation, setCopyConfirmation] = useState(false);
  const [vatExempted, setVatExempted] = useState(0);
  const [vatZero, setVatZero] = useState(0);
  const [vatSeven, setVatSeven] = useState(0);

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
      const getDepositInvoice = getDepositInvoiceById(id);
      Promise.all([getProjects, getContacts, getRemarks, getDepositInvoice])
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
            setDepositInvoiceData(myData);
            setStatus(myData.deposit_invoice_status);
            setDepositInvoiceId(myData.deposit_invoice_id);
            setDepositInvoiceDocumentId(myData.deposit_invoice_document_id);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
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
          setDepositInvoiceData((prev) => {
            return {
              ...prev,
              deposit_invoice_issue_date: moment().format(),
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
      depositInvoiceData.deposit_invoice_issue_date &&
      !isNaN(depositInvoiceData.deposit_invoice_issue_date)
        ? {
            ...depositInvoiceData,
            deposit_invoice_issue_date: unixToDate(
              depositInvoiceData.deposit_invoice_issue_date
            ),
          }
        : depositInvoiceData,
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const postPayload = {
        ...values,
        vat_exempted_amount: vatExempted,
        vat_0_amount: vatZero,
        vat_7_amount: vatSeven,
        total_amount: vatExempted + vatZero + vatSeven,
        deposit_invoice_id: depositInvoiceId,
        deposit_invoice_document_id: depositInvoiceDocumentId,
        deposit_invoice_issue_date: dateToUnix(
          values.deposit_invoice_issue_date
        ),
      };

      delete postPayload.action;

      switch (values.action) {
        case actionType.saveToDraft:
          setIsLoading(true);
          if (depositInvoiceDocumentId !== "-") {
            if (status === "not_approve") {
              postPayload.deposit_invoice_status = "draft";
            }
            updateDepositInvoice("", depositInvoiceDocumentId, postPayload)
              .then((data) => {
                setStatus("draft");
                dispatch(showSnackbar(data.data.status, "บันทึกร่างสำเร็จ"));
                setIsLoading(false);
              })
              .catch(() => {
                dispatch(showSnackbar("error", "บันทึกร่างไม่สำเร็จ"));
                setIsLoading(false);
              });
            // }
          } else {
            postDepositInvoice("", postPayload)
              .then((data) => {
                setStatus("draft");
                if (data.data.data.insertId && data.data.data.documentId) {
                  setDepositInvoiceId(data.data.data.insertId);
                  setDepositInvoiceDocumentId(data.data.data.documentId);
                  history.push(
                    `/income/deposit-invoice/${data.data.data.documentId}`
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
                    "บันทึกร่างไม่สำเร็จ",
                    err.response.data.message.split(":")[1]
                  )
                );
                setIsLoading(false);
              });
            // }
          }
          break;
        case actionType.approve:
          setIsLoading(true);
          postDepositInvoice("approve", postPayload)
            .then((data) => {
              setStatus("wait_payment");
              if (data.data.data.insertId && data.data.data.documentId) {
                setDepositInvoiceId(data.data.data.insertId);
                setDepositInvoiceDocumentId(data.data.data.documentId);
                history.push(
                  `/income/deposit-invoice/${data.data.data.documentId}`
                );
              }
              dispatch(showSnackbar(data.data.status, "อนุมัติสำเร็จ"));
              if (id) setIsLoading(false);
            })
            .catch((err) => {
              dispatch(
                showSnackbar(
                  "error",
                  "อนุมัติไม่สำเร็จ",
                  err.response.data.message.split(":")[1]
                )
              );
              setIsLoading(false);
            });
          break;
        case actionType.editWaitPayment:
          setIsLoading(true);
          if (status === "wait_payment") {
            postPayload.deposit_invoice_status = "wait_payment";
          }
          console.log("update", postPayload);
          updateDepositInvoice("", depositInvoiceDocumentId, postPayload)
            .then((data) => {
              dispatch(showSnackbar(data.data.status, "บันทึกร่างสำเร็จ"));
              setIsLoading(false);
            })
            .catch(() => {
              dispatch(showSnackbar("error", "บันทึกร่างไม่สำเร็จ"));
              setIsLoading(false);
            });
          setDisabled({
            print: true,
            options: false,
            create: true,
            edit: true,
            cancelButton: false,
            editButton: false,
            paymentTab: true,
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
    if (newValue !== 2 && status !== "closed") {
      formik.setFieldValue("sales_invoice_document_id", null);
      formik.setFieldValue("deposit_invoice_info", null);
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
    formik.setFieldValue("deposit_invoice_issue_date", newValue);
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
    cancelDepositInvoice(depositInvoiceDocumentId)
      .then(() => {
        setStatus("cancelled");
        dispatch(showSnackbar("success", "ยกเลิกใบแจ้งหนี้มัดจำสำเร็จ"));
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "ยกเลิกใบแจ้งหนี้มัดจำไม่สำเร็จ"));
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
    copyDepositInvoice(depositInvoiceDocumentId)
      .then((data) => {
        history.push("/income/deposit-invoice/add");
        dispatch(showSnackbar(data.data.status, "คัดลอกใบแจ้งหนี้มัดจำสำเร็จ"));
        setStatus("create");
        setDepositInvoiceId();
        setDepositInvoiceDocumentId("-");
        setDepositInvoiceData({
          ...data.data.data,
          deposit_invoice_issue_date: moment().format(),
        });
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "คัดลอกใบแจ้งหนี้มัดจำไม่สำเร็จ"));
        setIsLoading(false);
        console.log(err);
      });
  };

  const createPaymentReceiptHandler = () => {
    setIsLoading(true);
    postReceiptFromDepositInvoice(depositInvoiceDocumentId)
      .then((data) => {
        setStatus("closed");
        history.push("/income/payment-receipt/add", data.data.data);
        dispatch(showSnackbar(data.data.status, "สร้างใบรับชำระมัดจำสำเร็จ"));
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "สร้างใบรับชำระมัดจำไม่สำเร็จ"));
        setIsLoading(false);
        console.log(err);
      });
  };

  const printItemsHandler = (_, index) => {
    if (index === 0) {
      setAnchorPrintEl(null);
      history.push(`/income/deposit-invoice/${id}/pdf`);
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
    getDepositInvoiceById(depositInvoiceDocumentId)
      .then((data) => {
        if (data.data.status === "success") {
          const myData = data.data.data;
          const formatData = {
            ...myData,
            deposit_invoice_issue_date: unixToDate(
              myData.deposit_invoice_issue_date
            ),
          };
          formik.setValues(formatData);
          setStatus(formatData.deposit_invoice_status);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err.response.data);
      });
    setDisabled({
      print: true,
      options: false,
      create: true,
      edit: true,
      cancelButton: false,
      editButton: false,
      paymentTab: true,
    });
  };

  const editWaitPayment = () => {
    formik.setFieldValue("action", actionType.editWaitPayment);
  };

  const addItemHandler = () => {
    formik.setFieldValue(
      "deposit_invoice_data",
      formik.values.deposit_invoice_data.concat({
        vat: "NONE",
        description: "",
        pre_vat_amount: 0,
      })
    );
  };

  const applyPayload = {
    sales_invoice_document_id: formik.values.sales_invoice_document_id,
    deposit_invoice_info: formik.values.deposit_invoice_info,
  };

  const applyToSalesInvoice = () => {
    setIsLoading(true);
    applyDepositToSalesInvoice(depositInvoiceDocumentId, applyPayload)
      .then((data) => {
        setStatus("closed");
        dispatch(showSnackbar(data.data.status, "บันทึกการมัดจำสำเร็จ"));
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "บันทึกการมัดจำไม่สำเร็จ"));
        console.log(err.response.data);
        setIsLoading(false);
      });
  };
  const cancelSalesInvoice = () => {
    if (status !== "closed") {
      setTabValue(1);
      formik.setFieldValue("sales_invoice_document_id", null);
      formik.setFieldValue("deposit_invoice_info", null);
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
        <BreadcrumbComponent
          name="ใบแจ้งหนี้มัดจำ"
          to="/income/deposit-invoice"
        />
        {depositInvoiceDocumentId !== "-" ? (
          <BreadcrumbComponent
            name={depositInvoiceDocumentId}
            to={"/income/deposit-invoice/" + depositInvoiceDocumentId}
          />
        ) : (
          <BreadcrumbComponent
            name="เพิ่มใบแจ้งหนี้มัดจำ"
            to="/income/deposit-invoice/add"
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
              !depositInvoiceData.payment_channel_list ||
              depositInvoiceData.payment_channel_list.length === 0
                ? {
                    cursor: "not-allowed !important",
                    pointerEvents: "all !important",
                  }
                : { color: "#419644 !important" }
            }
            label="รับชำระ"
            disabled={
              !depositInvoiceData.payment_channel_list ||
              depositInvoiceData.payment_channel_list.length === 0
            }
            {...a11yProps(1)}
          />
          <Tab
            sx={
              disabled.depositInvoiceTab
                ? {
                    cursor: "not-allowed !important",
                    pointerEvents: "all !important",
                  }
                : { color: "#419644 !important" }
            }
            label="มัดจำ"
            disabled={disabled.depositInvoiceTab}
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <div className="account__formHeader-primary">
          <div className="account__formHeader-labelContainer">
            <h2 className="form-heading">ใบแจ้งหนี้มัดจำ</h2>
            {renderStatus(status)}
          </div>
          <div className="account__buttonContainer">
            <AccountSplitButtonComponent
              disabled={disabled.print}
              defaultButtonValue="พิมพ์เอกสาร"
              options={["พิมพ์ใบแจ้งหนี้มัดจำ"]}
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
            {status === "wait_payment" && (
              <Button variant="contained" onClick={createPaymentReceiptHandler}>
                รับชำระเงิน
              </Button>
            )}
          </div>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="account__formHeader-secondary">
            <div className="account__formHeader-document">
              <h4>เลขที่เอกสาร</h4>
              <p>{depositInvoiceDocumentId}</p>
            </div>
            <div className="account__formHeader-datetime">
              <AccountDateComponent
                disabled={disabled.edit}
                startDateLabel="วันที่ออกเอกสาร"
                startDateValue={formik.values.deposit_invoice_issue_date}
                startDateName="deposit_invoice_issue_date"
                handleStartDateChange={handleStartDateChange}
              />
            </div>
          </div>
          <AccountCustomerComponent
            formik={formik}
            disabled={disabled.edit}
            projects={projects}
            contacts={contacts}
            projectId={formik.values.billing_info.project_id}
            contactId={formik.values.billing_info.contact_id}
            accountSales
          />
          <AccountStaffComponent disabled={disabled.edit} formik={formik} />
          {status === "create" ||
            (status === "draft" && (
              <Button
                variant="contained"
                onClick={addItemHandler}
                sx={{ mb: "1.5rem" }}
              >
                เพิ่มแถว
              </Button>
            ))}

          <DepositInvoiceTable
            disabled={disabled.edit}
            formik={formik}
            setVatExempted={setVatExempted}
            setVatZero={setVatZero}
            setVatSeven={setVatSeven}
          />
          <Grid container spacing={2} sx={{ mt: "1.5rem" }}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <AccountTemplateComponent
                disabled={disabled.edit}
                remarkId={formik.values.deposit_invoice_template_remark_id}
                formik={formik}
                allTemplate={allTemplate}
                id="deposit_invoice_template_remark_id"
                detail="deposit_invoice_remark"
                remark={formik.values.deposit_invoice_remark}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <DepositInvoiceSummary
                vatExempted={vatExempted}
                vatZero={vatZero}
                vatSeven={vatSeven}
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
              title="ยืนยันการยกเลิกใบแจ้งหนี้มัดจำ"
              description="หากยกเลิกแล้วจะไม่สามารถเปลี่ยนแปลงรายการได้"
            />
          )}
          {copyConfirmation && (
            <AccountConfirmationComponent
              open={copyConfirmation}
              handleClose={closeCopyConfirmationHandler}
              handleSubmit={submitCopyConfirmationHandler}
              title="ยืนยันการคัดลอกใบแจ้งหนี้มัดจำ"
            />
          )}
        </form>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <PaymentTabComponent
          paymentReceiptList={depositInvoiceData.payment_channel_list}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <DepositTabComponent
          salesInvoiceDocumentIdList={salesInvoiceDocumentIdList}
          disabled={status === "closed"}
          applyToSalesInvoice={applyToSalesInvoice}
          cancelSalesInvoice={cancelSalesInvoice}
          formik={formik}
        />
      </TabPanel>
    </>
  );
};

export default AddDepositInvoiceComponent;
