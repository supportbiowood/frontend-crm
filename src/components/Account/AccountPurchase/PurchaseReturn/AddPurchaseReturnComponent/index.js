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
import DebitNoteTabComponent from "./DebitNoteTabComponent";
import ExporterTabComponent from "./ExporterTabComponent";
import {
  cancelPurchaseReturn,
  copyPurchaseReturn,
  getRemarkTemplate,
  getPurchaseReturnById,
  postPurchaseReturn,
  updatePurchaseReturn,
  getContactOption,
} from "../../../../../adapter/Api";
import ReasonAccordian from "./ReasonAccordian";
import {
  actionType,
  dateToUnix,
  unixToDate,
} from "../../../../../adapter/Utils";
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

const AddPurchaseReturnComponent = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const [refDocumentId, setRefDocumentId] = useState();
  const [purchaseReturnDocumentId, setPurchaseReturnDocumentId] = useState("-");
  const [purchaseReturnId, setPurchaseReturnId] = useState();
  const [editButtonClick, setEditButtonClick] = useState(false);
  const [status, setStatus] = useState("create");
  const [disabled, setDisabled] = useState({
    reason: true,
    options: true,
    create: true,
    editButton: true,
    cancelButton: true,
    date: true,
    externalRef: true,
    vendor: true,
    items: true,
    remark: true,
  });
  const [purchaseReturnData, setPurchaseReturnData] = useState(initialValues);
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
    const getContacts = getContactOption(["vendor"]);
    const getRemarks = getRemarkTemplate();
    if (id) {
      setIsLoading(true);
      const getPurchaseReturn = getPurchaseReturnById(id);
      Promise.all([getContacts, getRemarks, getPurchaseReturn])
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
            setPurchaseReturnData(myData);
            setStatus(myData.purchase_return_status);
            setPurchaseReturnId(myData.purchase_return_id);
            setPurchaseReturnDocumentId(myData.purchase_return_document_id);
            setRefDocumentId(myData.purchase_order_document_id);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    } else if (location.state) {
      setIsLoading(true);
      // let itemData = [];
      const purchaseOrderList = location.state.purchase_order_data;
      // const purchaseOrderCategory =
      //   purchaseOrderList &&
      //   purchaseOrderList.map((list) => list.category_list);
      // purchaseOrderCategory.forEach((categoryGroup) => {
      //   categoryGroup.forEach((category) => {
      //     category.item_data.forEach((item) => {
      //       itemData.push(item);
      //     });
      //   });
      // });
      Promise.all([getContacts, getRemarks]).then((values) => {
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
        setPurchaseReturnData((prev) => {
          return {
            ...prev,
            vendor_info: location.state.vendor_info,
            external_ref_document_id: location.state.external_ref_document_id,
            purchase_return_issue_date: moment().format(),
            purchase_return_delivery_date: moment().add(7, "days").format(),
            purchase_return_data: purchaseOrderList,
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
          externalRef: true,
          vendor: true,
          items: false,
          remark: false,
        });
        setRefDocumentId(location.state.purchase_order_document_id);
        setIsLoading(false);
      });
    }
  }, [location.state, id]);

  const formik = useFormik({
    initialValues:
      id &&
      purchaseReturnData.purchase_return_issue_date &&
      purchaseReturnData.purchase_return_delivery_date
        ? {
            ...purchaseReturnData,
            purchase_return_issue_date: unixToDate(
              purchaseReturnData.purchase_return_issue_date
            ),
            purchase_return_delivery_date: unixToDate(
              purchaseReturnData.purchase_return_delivery_date
            ),
          }
        : purchaseReturnData,
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const postPayload = {
        ...formik.values,
        purchase_order_document_id: refDocumentId,
        purchase_return_id: purchaseReturnId,
        purchase_return_document_id: purchaseReturnDocumentId,
        purchase_return_issue_date: dateToUnix(
          formik.values.purchase_return_issue_date
        ),
        purchase_return_delivery_date: dateToUnix(
          formik.values.purchase_return_delivery_date
        ),
      };

      delete postPayload.debit_note_list;
      delete postPayload.action;

      switch (values.action) {
        case actionType.saveToDraft:
          setIsLoading(true);
          if (purchaseReturnDocumentId !== "-") {
            if (status === "not_approve") {
              postPayload.purchase_return_status = "draft";
            }
            console.log("updated", postPayload);
            updatePurchaseReturn("", purchaseReturnDocumentId, postPayload)
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
            postPurchaseReturn("", postPayload)
              .then((data) => {
                setStatus("draft");
                if (data.data.data.insertId && data.data.data.documentId) {
                  setPurchaseReturnId(data.data.data.insertId);
                  setPurchaseReturnDocumentId(data.data.data.documentId);
                  history.push(
                    `/expense/purchase-return/${data.data.data.documentId}`
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
          postPurchaseReturn("wait_approve", postPayload)
            .then((data) => {
              setStatus("wait_approve");
              if (data.data.data.insertId && data.data.data.documentId) {
                setPurchaseReturnId(data.data.data.insertId);
                setPurchaseReturnDocumentId(data.data.data.documentId);
                history.push(
                  `/expense/purchase-return/${data.data.data.documentId}`
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
          postPurchaseReturn("approve", postPayload)
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
          updatePurchaseReturn(
            "not_approve",
            purchaseReturnDocumentId,
            postPayload
          )
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
          postPurchaseReturn("wait_approve", postPayload)
            .then((data) => {
              setStatus("wait_approve");
              if (data.data.data.insertId && data.data.data.documentId) {
                setPurchaseReturnId(data.data.data.insertId);
                setPurchaseReturnDocumentId(data.data.data.documentId);
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

  const handleStartDateChange = (newValue) => {
    formik.setFieldValue("purchase_return_issue_date", newValue);
  };

  const handleSentDateChange = (newValue) => {
    formik.setFieldValue("purchase_return_delivery_date", newValue);
  };

  const postPayload = {
    ...formik.values,
    purchase_return_id: purchaseReturnId,
    purchase_return_document_id: purchaseReturnDocumentId,
    purchase_return_issue_date: dateToUnix(
      formik.values.purchase_return_issue_date
    ),
    purchase_return_delivery_date: dateToUnix(
      formik.values.purchase_return_delivery_date
    ),
  };

  delete postPayload.debit_note_list;

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
    cancelPurchaseReturn(purchaseReturnDocumentId)
      .then(() => {
        setStatus("cancelled");
        dispatch(showSnackbar("success", "ยกเลิกใบส่งคืนสำเร็จ"));
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "ยกเลิกใบส่งคืนไม่สำเร็จ"));
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
    copyPurchaseReturn(purchaseReturnDocumentId)
      .then((data) => {
        history.push("/expense/purchase-return/add");
        dispatch(showSnackbar(data.data.status, "คัดลอกใบส่งคืนสำเร็จ"));
        setStatus("create");
        setPurchaseReturnId();
        setPurchaseReturnDocumentId("-");
        setPurchaseReturnData({
          ...data.data.data,
          purchase_return_issue_date: moment().format(),
          purchase_return_delivery_date: moment().add(7, "days").format(),
        });
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "คัดลอกใบส่งคืนไม่สำเร็จ"));
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
      history.push("/expense/debit-note/add", postPayload);
    } else if (index === 1) {
      setAnchorCreateEl(null);
    }
  };

  const editCancelled = () => {
    setEditButtonClick(false);
    setIsLoading(true);
    getPurchaseReturnById(purchaseReturnDocumentId)
      .then((data) => {
        if (data.data.status === "success") {
          const myData = data.data.data;
          const formatData = {
            ...myData,
            purchase_return_issue_date: unixToDate(
              myData.purchase_return_issue_date
            ),
            purchase_return_delivery_date: unixToDate(
              myData.purchase_return_delivery_date
            ),
          };
          formik.setValues(formatData);
          setStatus(formatData.purchase_return_status);
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
        <BreadcrumbComponent name="รายจ่าย" to="/expense" />
        <BreadcrumbComponent name="ใบส่งคืน" to="/expense/purchase-return" />
        {purchaseReturnDocumentId !== "-" ? (
          <BreadcrumbComponent
            name={purchaseReturnDocumentId}
            to={"/expense/purchase-return/" + purchaseReturnDocumentId}
          />
        ) : (
          <BreadcrumbComponent
            name="เพิ่มใบส่งคืน"
            to="/expense/purchase-return/add"
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
              !purchaseReturnData.debit_note_list ||
              purchaseReturnData.debit_note_list.length === 0
                ? {
                    cursor: "not-allowed !important",
                    pointerEvents: "all !important",
                  }
                : { color: "#419644 !important" }
            }
            label="รับใบลดหนี้"
            disabled={
              !purchaseReturnData.debit_note_list ||
              purchaseReturnData.debit_note_list.length === 0
            }
            {...a11yProps(1)}
          />
          <Tab
            sx={
              !purchaseReturnData.exporter_list ||
              purchaseReturnData.exporter_list.length === 0
                ? {
                    cursor: "not-allowed !important",
                    pointerEvents: "all !important",
                  }
                : { color: "#419644 !important" }
            }
            label="ใบนำออก"
            disabled={
              !purchaseReturnData.exporter_list ||
              purchaseReturnData.exporter_list.length === 0
            }
            {...a11yProps(2)}
          />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <div className="account__formHeader-primary">
          <div className="account__formHeader-labelContainer">
            <h2 className="form-heading">ใบส่งคืน</h2>
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
              options={["รับใบลดหนี้", "ใบนำออก"]}
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
              <p>{purchaseReturnDocumentId}</p>
            </div>
            <div className="account__formHeader-datetime">
              <AccountDateComponent
                disabled={disabled.date}
                startDateLabel="วันที่ออกเอกสาร"
                sentDateLabel="วันกำหนดส่งของ"
                startDateValue={formik.values.purchase_return_issue_date}
                sentDateValue={formik.values.purchase_return_delivery_date}
                startDateName="purchase_return_issue_date"
                sentDateName="purchase_return_delivery_date"
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
                  pathname: `/expense/purchase-order/${refDocumentId}`,
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
          <ReasonAccordian formik={formik} disabled={disabled.reason} />
          <AccountVendorComponent
            accountPurchase
            disabled={disabled.vendor}
            formik={formik}
            contacts={contacts}
            contactId={formik.values.vendor_info.contact_id}
          />
          <AccountTableDataPurchaseComponent
            PurchaseReturn
            data={formik.values.purchase_return_data}
            formik={formik}
            name="purchase_return_data"
            disabled={disabled.items}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <AccountTemplateComponent
                disabled={disabled.remark}
                remarkId={formik.values.purchase_return_template_remark_id}
                formik={formik}
                allTemplate={allTemplate}
                id="purchase_return_template_remark_id"
                detail="purchase_return_remark"
                remark={formik.values.purchase_return_remark}
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
              title="ยืนยันการยกเลิกใบส่งคืน"
              description="หากยกเลิกแล้วจะไม่สามารถเปลี่ยนแปลงรายการได้"
            />
          )}
          {copyConfirmation && (
            <AccountConfirmationComponent
              open={copyConfirmation}
              handleClose={closeCopyConfirmationHandler}
              handleSubmit={submitCopyConfirmationHandler}
              title="ยืนยันการคัดลอกใบส่งคืน"
            />
          )}
          {notApproveConfirmation && (
            <AccountConfirmationComponent
              open={notApproveConfirmation}
              handleClose={closeNotApproveConfirmationHandler}
              handleSubmit={submitNotApproveConfirmationHandler}
              title="ไม่อนุมัติใบส่งคืน"
              description="กรุณาระบุหมายเหตุในการไม่อนุมัติใบส่งคืน"
              reason
              formik={formik}
            />
          )}
        </form>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <DebitNoteTabComponent
          debitNoteList={purchaseReturnData.debit_note_list}
        />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <ExporterTabComponent exporterList={purchaseReturnData.exporter_list} />
      </TabPanel>
    </>
  );
};

export default AddPurchaseReturnComponent;
