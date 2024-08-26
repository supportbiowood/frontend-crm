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
import AccountCustomerComponent from "../../../AccountCustomerComponent";
import AccountDateComponent from "../../../AccountDateComponent";
import AccountSplitButtonComponent from "../../../AccountSplitButtonComponent";
import AccountProgressBarComponent from "../../../AccountProgressBarComponent";
import { renderStatus } from "../../../renderStatus";
import SalesOrderTabComponent from "./SalesOrderTabComponent";
import { useParams, useHistory } from "react-router-dom";
import {
  getQuotationById,
  postQuotation,
  updateQuotation,
  postQuotationDocument,
  cancelQuotation,
  copyQuotation,
  postSalesOrderFromQuotation,
  getRemarkTemplate,
  getAttachment,
  getContactOption,
  getProjectOption,
  postQuotationRevision,
} from "../../../../../adapter/Api";
import AccountStaffComponent from "../../../AccountStaffComponent";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./payload";
import AccountSummaryComponent from "../../../AccountSummaryComponent";
import AccountTemplateComponent from "../../../AccountTemplateComponent";
import AccountTableDataComponent from "../../../AccountTableDataComponent";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import AcceptForm from "./AcceptForm";
import AccountConfirmationComponent from "../../../AccountConfirmationComponent";
import { disabledStatus } from "./disabledStatus";
import {
  dateToUnix,
  unixToDate,
  actionType,
} from "../../../../../adapter/Utils";
import AccountActivityLogs from "../../../AccountActivityLogs";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

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

const AddQuotationComponent = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { id } = useParams();
  const [quotationId, setQuotationId] = useState();
  const [quotationDocumentId, setQuotationDocumentId] = useState("-");
  const [refDocumentid, setRefDocumentId] = useState();
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
    upload: true,
  });
  const [quotationData, setQuotationData] = useState(initialValues);
  const [cancel, setCancel] = useState(false);
  const [editButtonClick, setEditButtonClick] = useState(false);
  const [cancelConfirmation, setCancelConfirmation] = useState(false);
  const [copyConfirmation, setCopyConfirmation] = useState(false);
  const [notApproveConfirmation, setNotApproveConfirmation] = useState(false);
  const [projects, setProjects] = useState();
  const [contacts, setContacts] = useState();
  const [allTemplate, setAllTemplate] = useState([]);
  const [revisionId, setRevisionId] = useState(null);
  const handleChange = (_, newValue) => {
    setTabValue(newValue);
  };
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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
      const getQuotation = getQuotationById(id);
      Promise.all([getProjects, getContacts, getRemarks, getQuotation])
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
            console.log(myData);
            const formatData = {
              ...myData,
              quotation_accept_date: unixToDate(myData.quotation_accept_date),
            };
            getAttachment("quotation", formatData.quotation_id).then((data) => {
              const attachmentList = data.data.data;
              setQuotationData({
                ...formatData,
                attachment_remark: attachmentList[0]?.attachment_remark ?? "",
                attachment_list: attachmentList ?? [],
              });
              setRefDocumentId(formatData.ref_document_id);
              setStatus(formatData.quotation_status);
              setQuotationId(formatData.quotation_id);
              setQuotationDocumentId(formatData.quotation_document_id);
              setRevisionId(formatData.revision_id);
              setIsLoading(false);
            });
          }
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
        setQuotationData((prev) => {
          return {
            ...prev,
            quotation_issue_date: moment().format(),
            quotation_valid_until_date: moment().add(7, "days").format(),
            quotation_accept_date: moment().add(7, "days").format(),
            billing_info: location.state.project_info,
            quotation_data: location.state.engineer_data,
          };
        });
        setRefDocumentId(location.state.engineer_document_id);
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
          setQuotationData((prev) => {
            return {
              ...prev,
              quotation_issue_date: moment().format(),
              quotation_valid_until_date: moment().add(7, "days").format(),
              quotation_accept_date: moment().add(7, "days").format(),
            };
          });
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }
  }, [id, location.state]);

  const formik = useFormik({
    initialValues:
      id &&
      quotationData.quotation_issue_date &&
      quotationData.quotation_valid_until_date &&
      !isNaN(quotationData.quotation_issue_date) &&
      !isNaN(quotationData.quotation_valid_until_date)
        ? {
            ...quotationData,
            quotation_issue_date: unixToDate(
              quotationData.quotation_issue_date
            ),
            quotation_valid_until_date: unixToDate(
              quotationData.quotation_valid_until_date
            ),
          }
        : quotationData,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const postPayload = {
        ...values,
        quotation_id: quotationId,
        quotation_document_id: quotationDocumentId,
        quotation_issue_date: dateToUnix(values.quotation_issue_date),
        quotation_valid_until_date: dateToUnix(
          values.quotation_valid_until_date
        ),
        quotation_accept_date: dateToUnix(values.quotation_accept_date),
        revision_id: revisionId,
      };

      delete postPayload.sales_order_list;
      delete postPayload.action;

      switch (values.action) {
        case actionType.saveToDraft:
          setIsLoading(true);
          if (quotationDocumentId !== "-") {
            if (status === "not_approve") {
              postPayload.revision_id = null;
              postPayload.quotation_status = "draft";
              postQuotationRevision(quotationDocumentId, postPayload)
                .then((data) => {
                  setStatus("draft");
                  dispatch(showSnackbar(data.data.status, "บันทึกร่างสำเร็จ"));
                  setIsLoading(false);
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
            } else {
              updateQuotation(quotationDocumentId, revisionId, postPayload)
                .then((data) => {
                  setStatus("draft");
                  dispatch(showSnackbar(data.data.status, "บันทึกร่างสำเร็จ"));
                  setIsLoading(false);
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
          } else {
            postQuotation("", postPayload)
              .then((data) => {
                setStatus("draft");
                if (data.data.data.insertId && data.data.data.documentId) {
                  setQuotationId(data.data.data.insertId);
                  setQuotationDocumentId(data.data.data.documentId);
                  history.push(
                    `/income/quotation/${data.data.data.documentId}`
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
          if (status === "not_approve") {
            postPayload.revision_id = null;
            postQuotationRevision(quotationDocumentId, postPayload)
              .then((data) => {
                setStatus("draft");
                dispatch(showSnackbar(data.data.status, "ส่งอนุมัติสำเร็จ"));
                setIsLoading(false);
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
          } else {
            postQuotation("wait_approve", postPayload)
              .then((data) => {
                setStatus("wait_approve");
                if (data.data.data.insertId && data.data.data.documentId) {
                  setQuotationId(data.data.data.insertId);
                  setQuotationDocumentId(data.data.data.documentId);
                  history.push(
                    `/income/quotation/${data.data.data.documentId}`
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
          }
          break;
        case actionType.approve:
          setIsLoading(true);
          postQuotation("approve", postPayload)
            .then((data) => {
              setStatus("wait_accept");
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
          postPayload.quotation_status = "not_approve";
          updateQuotation(quotationDocumentId, revisionId, postPayload)
            .then((data) => {
              setStatus("not_approve");
              dispatch(showSnackbar(data.data.status, "ไม่อนุมัติสำเร็จ"));
              setIsLoading(false);
            })
            .catch(() => {
              dispatch(showSnackbar("error", "ไม่อนุมัติไม่สำเร็จ"));
              setIsLoading(false);
            });
          break;
        case actionType.accept:
          setIsLoading(true);
          postQuotationDocument(quotationId, postPayload)
            .then((data) => {
              setStatus("accepted");
              dispatch(
                showSnackbar(data.data.status, "ยอมรับใบเสนอราคาสำเร็จ")
              );
              setIsLoading(false);
            })
            .catch((err) => {
              dispatch(showSnackbar("error", "ยอมรับใบเสนอราคาไม่สำเร็จ"));
              console.log(err.response.data);
              setIsLoading(false);
            });
          break;
        case actionType.edit:
          setIsLoading(true);
          if (editButtonClick) {
            postPayload.revision_id = null;
            postQuotationRevision(quotationDocumentId, postPayload)
              .then((data) => {
                setStatus("wait_approve");
                dispatch(showSnackbar(data.data.status, "บันทึกสำเร็จ"));
                setIsLoading(false);
                setEditButtonClick(false);
              })
              .catch((err) => {
                console.log(err.response.data);
                dispatch(
                  showSnackbar(
                    "error",
                    `บันทึกไม่สำเร็จ`,
                    err.response.data.message.split(":")[1]
                  )
                );
                setIsLoading(false);
              });
          } else {
            postQuotation("wait_approve", postPayload)
              .then((data) => {
                setStatus("wait_approve");
                dispatch(showSnackbar(data.data.status, "บันทึกสำเร็จ"));
                if (data.data.data.insertId && data.data.data.documentId) {
                  setQuotationId(data.data.data.insertId);
                  setQuotationDocumentId(data.data.data.documentId);
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
          }

          break;
        default:
          return;
      }
    },
  });

  const handleStartDateChange = (newValue) => {
    formik.setFieldValue("quotation_issue_date", newValue);
  };

  const handleEndDateChange = (newValue) => {
    formik.setFieldValue("quotation_valid_until_date", newValue);
  };

  const handleAcceptDateChange = (newValue) => {
    formik.setFieldValue("quotation_accept_date", newValue);
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

  const acceptHandler = () => {
    formik.setFieldValue("action", actionType.accept);
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
    cancelQuotation(quotationId)
      .then((data) => {
        setStatus("cancelled");
        dispatch(showSnackbar(data.data.status, "ยกเลิกใบเสนอราคาสำเร็จ"));
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "ยกเลิกใบเสนอราคาไม่สำเร็จ"));
        console.log(err.response.data);
        setIsLoading(false);
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
    copyQuotation(quotationId)
      .then((data) => {
        history.push("/income/quotation/add");
        dispatch(showSnackbar(data.data.status, "คัดลอกใบเสนอราคาสำเร็จ"));
        setStatus("create");
        setQuotationId();
        setQuotationDocumentId("-");
        setQuotationData({
          ...data.data.data,
          quotation_issue_date: moment().format(),
          quotation_valid_until_date: moment().add(7, "days").format(),
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
      history.push(`/income/quotation/${id}/pdf`);
      setAnchorPrintEl(null);
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
      setIsLoading(true);
      postSalesOrderFromQuotation(quotationId)
        .then((data) => {
          setStatus("closed");
          history.push("/income/sales-order/add", data.data.data);
          dispatch(showSnackbar(data.data.status, "สร้างใบสั่งขายสำเร็จ"));
        })
        .catch((err) => {
          dispatch(showSnackbar("error", "สร้างใบสั่งขายไม่สำเร็จ"));
          console.log(err.response.data);
          setIsLoading(false);
        });
    }
  };

  const editCancelled = () => {
    setEditButtonClick(false);
    setIsLoading(true);
    getQuotationById(quotationDocumentId)
      .then((data) => {
        if (data.data.status === "success") {
          const myData = data.data.data;
          const formatData = {
            ...myData,
            quotation_issue_date: unixToDate(myData.quotation_issue_date),
            quotation_valid_until_date: unixToDate(
              myData.quotation_valid_until_date
            ),
            quotation_accept_date: moment().format(),
          };
          formik.setValues(formatData);
          setStatus(formatData.quotation_status);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err.response.data);
        setIsLoading(false);
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
        <BreadcrumbComponent name="ใบเสนอราคา" to="/income/quotation" />
        {quotationDocumentId !== "-" ? (
          <BreadcrumbComponent
            name={quotationDocumentId}
            to={"/income/quotation/" + quotationDocumentId}
          />
        ) : (
          <BreadcrumbComponent
            name="เพิ่มใบเสนอราคา"
            to="/income/quotation/add"
          />
        )}
      </Breadcrumbs>
      <div className="account__progressContainer">
        <AccountProgressBarComponent
          step="quotation"
          quotationCancelled={cancel}
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
              !quotationData.sales_order_list ||
              quotationData.sales_order_list.length === 0
                ? {
                    cursor: "not-allowed !important",
                    pointerEvents: "all !important",
                  }
                : { color: "#419644 !important" }
            }
            label="ใบสั่งขาย"
            disabled={
              !quotationData.sales_order_list ||
              quotationData.sales_order_list.length === 0
            }
            {...a11yProps(1)}
          />
          <Tab
            sx={
              status === "create"
                ? {
                    cursor: "not-allowed !important",
                    pointerEvents: "all !important",
                  }
                : { color: "#419644 !important" }
            }
            label="การเคลื่อนไหว"
            disabled={status === "create"}
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <div className="account__formHeader-primary">
          <div className="account__formHeader-labelContainer">
            <h2 className="form-heading">ใบเสนอราคา</h2>
            {renderStatus(status)}
            {formik.values.quotation_valid_until_date < moment().unix() &&
              formik.values.quotation_status !== "closed" &&
              !isLoading &&
              renderStatus("expired")}
          </div>
          <div className="account__buttonContainer">
            <AccountSplitButtonComponent
              disabled={disabled.print}
              defaultButtonValue="พิมพ์เอกสาร"
              options={["พิมพ์ใบเสนอราคา"]}
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
              options={["ใบสั่งขาย"]}
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
            <h4>เลขที่เอกสาร {quotationDocumentId}</h4>
            <div className="account__formHeader-datetime">
              <AccountDateComponent
                disabled={disabled.date}
                startDateLabel="วันที่ออกเอกสาร"
                endDateLabel="ใช้ได้ถึง"
                startDateValue={formik.values.quotation_issue_date}
                endDateValue={formik.values.quotation_valid_until_date}
                startDateName="quotation_issue_date"
                endDateName="quotation_valid_until_date"
                handleStartDateChange={handleStartDateChange}
                handleEndDateChange={handleEndDateChange}
                startDateError={formik.errors.quotation_issue_date}
                endDateError={formik.errors.quotation_valid_until_date}
              />
              {(editButtonClick || status === "not_approve") && (
                <TextField
                  sx={{ width: 155 }}
                  autoComplete="off"
                  type="text"
                  id="revision_name"
                  name="revision_name"
                  value={formik.values.revision_name}
                  onChange={formik.handleChange}
                  size="small"
                  label="Revise"
                />
              )}
            </div>
          </div>
          {refDocumentid && (
            <div className="account__refDocument">
              <h4>อ้างอิงถึง</h4>
              <Link
                to={{
                  pathname: `/engineer/estimate/${refDocumentid}`,
                }}
              >
                {refDocumentid}
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
            data={formik.values.quotation_data}
            formik={formik}
            name="quotation_data"
            disabled={disabled.items}
            error={formik.errors.quotation_data}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <AccountTemplateComponent
                disabled={disabled.remark}
                remarkId={formik.values.quotation_template_remark_id}
                formik={formik}
                allTemplate={allTemplate}
                id="quotation_template_remark_id"
                detail="quotation_remark"
                remark={formik.values.quotation_remark}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <AccountSummaryComponent
                noShipping
                summary
                disabled={disabled.summary}
                data={formik.values.quotation_data}
                formik={formik}
                tableType="sale"
              />
            </Grid>
          </Grid>
          {(status === "wait_accept" ||
            status === "accepted" ||
            status === "closed") && (
            <AcceptForm
              setIsLoading={setIsLoading}
              disabled={disabled.upload}
              formik={formik}
              handleAcceptDateChange={handleAcceptDateChange}
            />
          )}
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
                    variant="contained"
                    type="submit"
                    onClick={approveHandler}
                  >
                    อนุมัติ
                  </Button>
                </>
              ))}
            {status === "wait_accept" && (
              <>
                <Button
                  type="submit"
                  variant="contained"
                  onClick={acceptHandler}
                >
                  ยอมรับ
                </Button>
              </>
            )}
          </Box>
          {cancelConfirmation && (
            <AccountConfirmationComponent
              open={cancelConfirmation}
              handleClose={closeCancelConfirmationHandler}
              handleSubmit={submitCancelConfirmationHandler}
              title="ยืนยันการยกเลิกใบเสนอราคา"
              description="หากยกเลิกแล้วจะไม่สามารถเปลี่ยนแปลงรายการได้"
            />
          )}
          {copyConfirmation && (
            <AccountConfirmationComponent
              open={copyConfirmation}
              handleClose={closeCopyConfirmationHandler}
              handleSubmit={submitCopyConfirmationHandler}
              title="ยืนยันการคัดลอกใบเสนอราคา"
            />
          )}
          {notApproveConfirmation && (
            <AccountConfirmationComponent
              open={notApproveConfirmation}
              handleClose={closeNotApproveConfirmationHandler}
              handleSubmit={submitNotApproveConfirmationHandler}
              title="ไม่อนุมัติใบเสนอราคา"
              description="กรุณาระบุหมายเหตุในการไม่อนุมัติใบเสนอราคา"
              reason
              formik={formik}
            />
          )}
        </form>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <SalesOrderTabComponent
          salesOrderList={quotationData.sales_order_list}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <AccountActivityLogs documentId={quotationDocumentId} />
      </TabPanel>
    </>
  );
};

export default AddQuotationComponent;
