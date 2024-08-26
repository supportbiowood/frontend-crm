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
import AccountTableDataComponent from "../../../AccountTableDataComponent";
import AccountTemplateComponent from "../../../AccountTemplateComponent";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import { useDispatch } from "react-redux";
import AccountConfirmationComponent from "../../../AccountConfirmationComponent";
import { disabledStatus } from "./disabledStatus";
import CreditNoteTabComponent from "./CreditNoteTabComponent";
import ImporterTabComponent from "./ImporterTabComponent";
import {
  cancelSalesReturn,
  copySalesReturn,
  getContactOption,
  getProjectOption,
  getRemarkTemplate,
  getSalesReturnById,
  postSalesReturn,
  updateSalesReturn,
} from "../../../../../adapter/Api";
import ReasonAccordian from "./ReasonAccordian";
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

const AddSalesReturnComponent = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const [refDocumentId, setRefDocumentId] = useState();
  const [salesReturnDocumentId, setSalesReturnDocumentId] = useState("-");
  const [salesReturnId, setSalesReturnId] = useState();
  const [editButtonClick, setEditButtonClick] = useState(false);
  const [status, setStatus] = useState("create");
  const [disabled, setDisabled] = useState({
    reason: true,
    options: true,
    create: true,
    editButton: true,
    cancelButton: true,
    date: true,
    customer: true,
    items: true,
    remark: true,
  });
  const [salesReturnData, setSalesReturnData] = useState(initialValues);
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

  const [anchorOptionEl, setAnchorOptionEl] = useState(null);
  const [anchorCreateEl, setAnchorCreateEl] = useState(null);

  const openOption = Boolean(anchorOptionEl);
  const openCreate = Boolean(anchorCreateEl);

  const handleOpenOptionMenu = (event) => {
    setAnchorOptionEl(event.currentTarget);
  };

  const handleOpenCreateMenu = (event) => {
    setAnchorCreateEl(event.currentTarget);
  };

  const handleCloseOptionMenu = () => {
    setAnchorOptionEl(null);
  };

  const handleCloseCreateMenu = () => {
    setAnchorCreateEl(null);
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
      const getSalesReturn = getSalesReturnById(id);
      Promise.all([getProjects, getContacts, getRemarks, getSalesReturn])
        .then((values) => {
          if (values[0].data.status === "success") {
            let myData = values[0].data.data;
            const filterProject = myData.filter(
              (project) => project.project_status !== "finished"
            );
            setProjects(filterProject);
          }
          if (values[1].data.status === "success") {
            let myData = values[1].data.data;
            const filterContact = myData.filter(
              (contact) =>
                contact.contact_status !== "delete" &&
                contact.contact_is_customer === 1
            );
            setContacts(filterContact);
          }
          if (values[2].data.status === "success") {
            let myData = values[2].data.data;
            setAllTemplate(myData);
          }
          if (values[3].data.status === "success") {
            let myData = values[3].data.data;
            setSalesReturnData(myData);
            setStatus(myData.sales_return_status);
            setSalesReturnId(myData.sales_return_id);
            setSalesReturnDocumentId(myData.sales_return_document_id);
            setRefDocumentId(myData.sales_order_document_id);
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
          const filterProject = myData.filter(
            (project) => project.project_status !== "finished"
          );
          setProjects(filterProject);
        }
        if (values[1].data.status === "success") {
          let myData = values[1].data.data;
          const filterContact = myData.filter(
            (contact) =>
              contact.contact_status !== "delete" &&
              contact.contact_is_customer === 1
          );
          setContacts(filterContact);
        }
        if (values[2].data.status === "success") {
          let myData = values[2].data.data;
          setAllTemplate(myData);
        }
        setSalesReturnData((prev) => {
          return {
            ...prev,
            billing_info: location.state.billing_info,
            sales_return_issue_date: moment().format(),
            sales_return_delivery_date: moment().add(7, "days").format(),
            sales_return_data: location.state.sales_order_data,
            additional_discount: location.state.additional_discount,
            net_amount: location.state.net_amount,
            shipping_cost: location.state.shipping_cost,
            total_amount: location.state.total_amount,
            vat_0_amount: location.state.vat_0_amount,
            vat_7_amount: location.state.vat_7_amount,
            vat_amount: location.state.vat_amount,
            vat_exempted_amount: location.state.vat_exempted_amount,
            withholding_tax: location.state.withholding_tax,
          };
        });
        setDisabled({
          reason: false,
          options: true,
          create: true,
          editButton: true,
          cancelButton: true,
          date: false,
          customer: true,
          items: false,
          remark: false,
        });
        setRefDocumentId(location.state.sales_order_document_id);
        setIsLoading(false);
      });
    }
  }, [location.state, id]);

  const formik = useFormik({
    initialValues:
      id &&
      salesReturnData.sales_return_issue_date &&
      salesReturnData.sales_return_delivery_date &&
      !isNaN(salesReturnData.sales_return_issue_date) &&
      !isNaN(salesReturnData.sales_return_delivery_date)
        ? {
            ...salesReturnData,
            sales_return_issue_date: unixToDate(
              salesReturnData.sales_return_issue_date
            ),
            sales_return_delivery_date: unixToDate(
              salesReturnData.sales_return_delivery_date
            ),
          }
        : salesReturnData,
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const postPayload = {
        ...formik.values,
        sales_order_document_id: refDocumentId,
        sales_return_id: salesReturnId,
        sales_return_document_id: salesReturnDocumentId,
        sales_return_issue_date: dateToUnix(
          formik.values.sales_return_issue_date
        ),
        sales_return_delivery_date: dateToUnix(
          formik.values.sales_return_delivery_date
        ),
      };

      delete postPayload.credit_note_list;
      delete postPayload.importer_list;
      delete postPayload.action;

      switch (values.action) {
        case actionType.saveToDraft:
          setIsLoading(true);
          if (salesReturnDocumentId !== "-") {
            if (status === "not_approve") {
              postPayload.sales_return_status = "draft";
            }
            updateSalesReturn("", salesReturnDocumentId, postPayload)
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
            postSalesReturn("", postPayload)
              .then((data) => {
                setStatus("draft");
                if (data.data.data.insertId && data.data.data.documentId) {
                  setSalesReturnId(data.data.data.insertId);
                  setSalesReturnDocumentId(data.data.data.documentId);
                  history.push(
                    `/income/sales-return/${data.data.data.documentId}`
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
          postSalesReturn("wait_approve", postPayload)
            .then((data) => {
              setStatus("wait_approve");
              if (data.data.data.insertId && data.data.data.documentId) {
                setSalesReturnId(data.data.data.insertId);
                setSalesReturnDocumentId(data.data.data.documentId);
                history.push(
                  `/income/sales-return/${data.data.data.documentId}`
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
          postSalesReturn("approve", postPayload)
            .then((data) => {
              console.log(data);
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
          updateSalesReturn("not_approve", salesReturnDocumentId, postPayload)
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
          postSalesReturn("wait_approve", postPayload)
            .then((data) => {
              setStatus("wait_approve");
              if (data.data.data.insertId && data.data.data.documentId) {
                setSalesReturnId(data.data.data.insertId);
                setSalesReturnDocumentId(data.data.data.documentId);
              }
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
    formik.setFieldValue("sales_return_issue_date", newValue);
  };

  const handleSentDateChange = (newValue) => {
    formik.setFieldValue("sales_return_delivery_date", newValue);
  };

  const postPayload = {
    ...formik.values,
    sales_order_document_id: refDocumentId,
    sales_return_id: salesReturnId,
    sales_return_document_id: salesReturnDocumentId,
    sales_return_issue_date: dateToUnix(formik.values.sales_return_issue_date),
    sales_return_delivery_date: dateToUnix(
      formik.values.sales_return_delivery_date
    ),
  };

  delete postPayload.credit_note_list;
  delete postPayload.importer_list;

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
    cancelSalesReturn(salesReturnDocumentId)
      .then(() => {
        setStatus("cancelled");
        dispatch(showSnackbar("success", "ยกเลิกใบเสนอราคาสำเร็จ"));
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "ยกเลิกใบเสนอราคาไม่สำเร็จ"));
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
    copySalesReturn(salesReturnDocumentId)
      .then((data) => {
        history.push("/income/sales-return/add");
        dispatch(showSnackbar(data.data.status, "คัดลอกใบเสนอราคาสำเร็จ"));
        setStatus("create");
        setSalesReturnId();
        setSalesReturnDocumentId("-");
        setSalesReturnData({
          ...data.data.data,
          sales_return_issue_date: moment().format(),
          sales_return_delivery_date: moment().add(7, "days").format(),
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
    } else if (index === 1) {
      setAnchorCreateEl(null);
      console.log("ใบนำเข้า");
    }
  };

  const editCancelled = () => {
    setEditButtonClick(false);
    setIsLoading(true);
    getSalesReturnById(salesReturnDocumentId)
      .then((data) => {
        setIsLoading(false);
        if (data.data.status === "success") {
          const myData = data.data.data;
          const formatData = {
            ...myData,
            sales_return_issue_date: unixToDate(myData.sales_return_issue_date),
            sales_return_delivery_date: unixToDate(
              myData.sales_return_delivery_date
            ),
          };
          formik.setValues(formatData);
          setStatus(formatData.sales_return_status);
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
        <BreadcrumbComponent name="ใบรับคืน" to="/income/sales-return" />
        {salesReturnDocumentId !== "-" ? (
          <BreadcrumbComponent
            name={salesReturnDocumentId}
            to={"/income/sales-return/" + salesReturnDocumentId}
          />
        ) : (
          <BreadcrumbComponent
            name="เพิ่มใบรับคืน"
            to="/income/sales-return/add"
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
              !salesReturnData.credit_note_list ||
              salesReturnData.credit_note_list.length === 0
                ? {
                    cursor: "not-allowed !important",
                    pointerEvents: "all !important",
                  }
                : { color: "#419644 !important" }
            }
            label="ใบลดหนี้"
            disabled={
              !salesReturnData.credit_note_list ||
              salesReturnData.credit_note_list.length === 0
            }
            {...a11yProps(1)}
          />
          <Tab
            sx={
              !salesReturnData.importer_list ||
              salesReturnData.importer_list.length === 0
                ? {
                    cursor: "not-allowed !important",
                    pointerEvents: "all !important",
                  }
                : { color: "#419644 !important" }
            }
            label="ใบนำเข้า"
            disabled={
              !salesReturnData.importer_list ||
              salesReturnData.importer_list.length === 0
            }
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <div className="account__formHeader-primary">
          <div className="account__formHeader-labelContainer">
            <h2 className="form-heading">ใบรับคืน</h2>
            {renderStatus(status)}
          </div>
          <div className="account__buttonContainer">
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
              options={["ใบลดหนี้", "ใบนำเข้า"]}
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
              <p>{salesReturnDocumentId}</p>
            </div>
            <div className="account__formHeader-datetime">
              <AccountDateComponent
                disabled={disabled.date}
                startDateLabel="วันที่ออกเอกสาร"
                sentDateLabel="วันกำหนดส่งของ"
                startDateValue={formik.values.sales_return_issue_date}
                sentDateValue={formik.values.sales_return_delivery_date}
                startDateName="sales_return_issue_date"
                sentDateName="sales_return_delivery_date"
                handleStartDateChange={handleStartDateChange}
                handleSentDateChange={handleSentDateChange}
              />
            </div>
          </div>
          {refDocumentId && (
            <div className="account__refDocument">
              <h4>อ้างอิงถึง</h4>
              <Link
                to={{
                  pathname: `/income/sales-order/${refDocumentId}`,
                }}
              >
                {refDocumentId}
              </Link>
            </div>
          )}
          <ReasonAccordian formik={formik} disabled={disabled.reason} />
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
            data={formik.values.sales_return_data}
            formik={formik}
            name="sales_return_data"
            disabled={disabled.items}
            salesReturn
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <AccountTemplateComponent
                disabled={disabled.remark}
                remarkId={formik.values.sales_return_template_remark_id}
                formik={formik}
                allTemplate={allTemplate}
                id="sales_return_template_remark_id"
                detail="sales_return_remark"
                remark={formik.values.sales_return_remark}
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
              title="ยืนยันการยกเลิกใบรับคืน"
              description="หากยกเลิกแล้วจะไม่สามารถเปลี่ยนแปลงรายการได้"
            />
          )}
          {copyConfirmation && (
            <AccountConfirmationComponent
              open={copyConfirmation}
              handleClose={closeCopyConfirmationHandler}
              handleSubmit={submitCopyConfirmationHandler}
              title="ยืนยันการคัดลอกใบรับคืน"
            />
          )}
          {notApproveConfirmation && (
            <AccountConfirmationComponent
              open={notApproveConfirmation}
              handleClose={closeNotApproveConfirmationHandler}
              handleSubmit={submitNotApproveConfirmationHandler}
              title="ไม่อนุมัติใบรับคืน"
              description="กรุณาระบุหมายเหตุในการไม่อนุมัติใบรับคืน"
              reason
              formik={formik}
            />
          )}
        </form>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <CreditNoteTabComponent
          creditNoteList={salesReturnData.credit_note_list}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <ImporterTabComponent importerList={salesReturnData.importer_list} />
      </TabPanel>
    </>
  );
};

export default AddSalesReturnComponent;
