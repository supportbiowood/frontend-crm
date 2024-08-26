import {
  Backdrop,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
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
import {
  getRemarkTemplate,
  getPurchaseInvoiceById,
  updatePurchaseInvoice,
  postPurchaseInvoice,
  cancelPurchaseInvoice,
  postPaymentMadeFromPurchaseInvoice,
  copyPurchaseInvoice,
  getContactOption,
} from "../../../../../adapter/Api";
import AccountTableDataPurchaseComponent from "../../../AccountTableDataPurchaseComponent";
import AccountTemplateComponent from "../../../AccountTemplateComponent";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import { useDispatch } from "react-redux";
import AccountConfirmationComponent from "../../../AccountConfirmationComponent";
import { disabledStatus } from "./disabledStatus.js";
import PaymentTabComponent from "./PaymentTabComponent";
import AccountSummaryComponent from "../../../AccountSummaryComponent";
import AccountVendorComponent from "../../../AccountVendorComponent";
import {
  actionType,
  dateToUnix,
  unixToDate,
} from "../../../../../adapter/Utils";
import { getListWareHouse } from "../../../../../adapter/Api/graphql";

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

const AddPurchaseInvoiceComponent = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();
  const location = useLocation();
  const [purchaseInvoiceDocumentId, setPurchaseInvoiceDocumentId] =
    useState("-");
  const [purchaseInvoiceId, setPurchaseInvoiceId] = useState();
  const [purchaseOrderDocumentId, setPurchaseOrderDocumentId] = useState();
  const [purchaseInvoiceData, setPurchaseInvoiceData] = useState(initialValues);
  const [editButtonClick, setEditButtonClick] = useState(false);
  const [status, setStatus] = useState("create");
  const [disabled, setDisabled] = useState({
    print: true,
    options: true,
    create: true,
    editButton: true,
    cancelButton: true,
    date: true,
    externalRef: true,
    target: true,
    vendor: true,
    items: true,
    remark: true,
    summary: true,
  });

  const [allTemplate, setAllTemplate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [cancelConfirmation, setCancelConfirmation] = useState(false);
  const [copyConfirmation, setCopyConfirmation] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [wareHouseList, setWareHouseList] = useState([]);

  const handleChange = (_, newValue) => {
    setTabValue(newValue);
  };

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
    disabledStatus(status, setDisabled, editButtonClick);
  }, [status, editButtonClick]);

  useEffect(() => {
    const getWareHouse = getListWareHouse();
    const getRemarks = getRemarkTemplate();
    const getContacts = getContactOption(["vendor"]);
    if (id) {
      setIsLoading(true);
      const getPurchaseInvoice = getPurchaseInvoiceById(id);
      Promise.all([getWareHouse, getRemarks, getContacts, getPurchaseInvoice])
        .then((values) => {
          if (values[0].status === 200) {
            let myData = values[0].data.data;
            const listWareHouse = myData.listWarehouse.items;
            setWareHouseList(listWareHouse);
          }
          if (values[1].data.status === "success") {
            let myData = values[1].data.data;
            setAllTemplate(myData);
          }
          if (values[2].data.status === "success") {
            let myData = values[2].data.data;
            setContacts(myData);
          }
          if (values[3].data.status === "success") {
            let myData = values[3].data.data;
            setPurchaseInvoiceData(myData);
            setStatus(myData.purchase_invoice_status);
            setPurchaseInvoiceId(myData.purchase_invoice_id);
            setPurchaseInvoiceDocumentId(myData.purchase_invoice_document_id);
            setPurchaseOrderDocumentId(myData.purchase_order_document_id);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    } else if (location.state) {
      setIsLoading(true);
      Promise.all([getRemarks, getContacts, getWareHouse]).then((values) => {
        if (values[0].data.status === "success") {
          let myData = values[0].data.data;
          setAllTemplate(myData);
        }
        if (values[1].data.status === "success") {
          let myData = values[1].data.data;
          setContacts(myData);
        }
        if (values[2].status === 200) {
          let myData = values[2].data.data;
          const listWareHouse = myData.listWarehouse.items;
          setWareHouseList(listWareHouse);
        }
        setPurchaseInvoiceData((prev) => {
          return {
            ...prev,
            purchase_order_document_id:
              location.state.purchase_order_document_id,
            inventory_target: location.state.inventory_target,
            external_ref_document_id: location.state.external_ref_document_id,
            vendor_info: location.state.vendor_info,
            additional_discount: location.state.additional_discount,
            purchase_invoice_data: location.state.purchase_invoice_data,
            purchase_order_data: location.state.purchase_order_data,
            purchase_invoice_issue_date: moment().format(),
            purchase_invoice_due_date: moment().add(7, "days").format(),
          };
        });
        setPurchaseOrderDocumentId(location.state.purchase_order_document_id);
        setIsLoading(false);
      });
    } else {
      setIsLoading(true);
      Promise.all([getRemarks, getContacts, getWareHouse])
        .then((values) => {
          if (values[0].data.status === "success") {
            let myData = values[0].data.data;
            setAllTemplate(myData);
          }
          if (values[1].data.status === "success") {
            let myData = values[1].data.data;
            setContacts(myData);
          }
          if (values[2].status === 200) {
            let myData = values[2].data.data;
            const listWareHouse = myData.listWarehouse.items;
            setWareHouseList(listWareHouse);
          }
          setPurchaseInvoiceData((prev) => {
            return {
              ...prev,
              purchase_invoice_issue_date: moment().format(),
              purchase_invoice_due_date: moment().add(7, "days").format(),
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
      purchaseInvoiceData.purchase_invoice_issue_date &&
      purchaseInvoiceData.purchase_invoice_due_date
        ? {
            ...purchaseInvoiceData,
            purchase_invoice_issue_date: unixToDate(
              purchaseInvoiceData.purchase_invoice_issue_date
            ),
            purchase_invoice_due_date: unixToDate(
              purchaseInvoiceData.purchase_invoice_due_date
            ),
          }
        : purchaseInvoiceData,
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const postPayload = {
        ...formik.values,
        purchase_invoice_id: purchaseInvoiceId,
        purchase_invoice_document_id: purchaseInvoiceDocumentId,
        purchase_invoice_issue_date: dateToUnix(
          formik.values.purchase_invoice_issue_date
        ),
        purchase_invoice_due_date: dateToUnix(
          formik.values.purchase_invoice_due_date
        ),
      };

      delete postPayload.payment_made_list;
      delete postPayload.action;

      switch (values.action) {
        case actionType.saveToDraft:
          setIsLoading(true);
          console.log(postPayload);
          if (purchaseInvoiceDocumentId !== "-") {
            console.log("updated");
            updatePurchaseInvoice("", purchaseInvoiceDocumentId, postPayload)
              .then((data) => {
                setStatus("draft");
                dispatch(showSnackbar(data.data.status, "บันทึกร่างสำเร็จ"));
                setIsLoading(false);
              })
              .catch((err) => {
                dispatch(
                  showSnackbar(
                    "error",
                    "บันทึกร่างไม่สำเร็จ",
                    err.response.data.message.split(":")[1]
                  )
                );
                setIsLoading(false);
              });
          } else {
            postPurchaseInvoice("", postPayload)
              .then((data) => {
                setStatus("draft");
                if (data.data.data.insertId && data.data.data.documentId) {
                  setPurchaseInvoiceId(data.data.data.insertId);
                  setPurchaseInvoiceDocumentId(data.data.data.documentId);
                  history.push(
                    `/expense/purchase-invoice/${data.data.data.documentId}`
                  );
                }
                dispatch(showSnackbar(data.data.status, "บันทึกร่างสำเร็จ"));
                if (id) setIsLoading(false);
              })
              .catch((err) => {
                dispatch(
                  showSnackbar(
                    "error",
                    "บันทึกร่างไม่สำเร็จ",
                    err.response.data.message.split(":")[1]
                  )
                );
                setIsLoading(false);
              });
          }
          break;
        case actionType.approve:
          setIsLoading(true);
          postPurchaseInvoice("approve", postPayload)
            .then((data) => {
              setStatus("wait_payment");
              if (data.data.data.insertId && data.data.data.documentId) {
                setPurchaseInvoiceId(data.data.data.insertId);
                setPurchaseInvoiceDocumentId(data.data.data.documentId);
                history.push(
                  `/expense/purchase-invoice/${data.data.data.documentId}`
                );
              }
              dispatch(showSnackbar(data.data.status, "อนุมัติสำเร็จ"));
              if (id) setIsLoading(false);
            })
            .catch((err) => {
              dispatch(
                showSnackbar(
                  "error",
                  `อนุมัติไม่สำเร็จ`,
                  err.response.data.message.split(":")[1]
                )
              );
              setIsLoading(false);
            });
          break;
        case actionType.editWaitPayment:
          setIsLoading(true);
          if (status === "wait_payment") {
            postPayload.purchase_invoice_status = "wait_payment";
          }
          updatePurchaseInvoice("", purchaseInvoiceDocumentId, postPayload)
            .then((data) => {
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
    formik.setFieldValue("purchase_invoice_issue_date", newValue);
  };

  const handleEndDateChange = (newValue) => {
    formik.setFieldValue("purchase_invoice_due_date", newValue);
  };

  const postPayload = {
    ...formik.values,
    purchase_invoice_id: purchaseInvoiceId,
    purchase_invoice_document_id: purchaseInvoiceDocumentId,
    purchase_invoice_issue_date: dateToUnix(
      formik.values.purchase_invoice_issue_date
    ),
    purchase_invoice_due_date: dateToUnix(
      formik.values.purchase_invoice_due_date
    ),
  };

  delete postPayload.payment_made_list;

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
    cancelPurchaseInvoice(purchaseInvoiceDocumentId)
      .then((data) => {
        console.log(data);
        setStatus("cancelled");
        dispatch(showSnackbar("success", "ยกเลิกใบบันทึกซื้อสำเร็จ"));
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "ยกเลิกใบบันทึกซื้อไม่สำเร็จ"));
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
    copyPurchaseInvoice(purchaseInvoiceDocumentId)
      .then((data) => {
        history.push("/expense/purchase-invoice/add");
        dispatch(showSnackbar(data.data.status, "ตัดลอกใบบันทึกซื้อสำเร็จ"));
        setStatus("create");
        setPurchaseInvoiceId();
        setPurchaseInvoiceDocumentId("-");
        setPurchaseInvoiceData({
          ...data.data.data,
          purchase_invoice_issue_date: moment().format(),
          purchase_invoice_due_date: moment().add(7, "days").format(),
        });
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "ตัดลอกใบบันทึกซื้อไม่สำเร็จ"));
        setIsLoading(false);
        console.log(err.response.data);
      });
  };

  const editCancelled = () => {
    setEditButtonClick(false);
    setIsLoading(true);
    getPurchaseInvoiceById(purchaseInvoiceDocumentId)
      .then((data) => {
        if (data.data.status === "success") {
          const myData = data.data.data;
          const formatData = {
            ...myData,
            purchase_invoice_issue_date: unixToDate(
              myData.purchase_invoice_issue_date
            ),
            purchase_invoice_due_date: unixToDate(
              myData.purchase_invoice_due_date
            ),
          };
          formik.setValues(formatData);
          setStatus(formatData.purchase_invoice_status);
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

  const printItemsHandler = (_, index) => {
    if (index === 0) {
      setAnchorPrintEl(null);
      history.push(
        `/expense/purchase-invoice/${purchaseInvoiceDocumentId}/pdf`
      );
    }
  };

  const optionItemsHandler = (_, index) => {
    if (index === 0) {
      setAnchorOptionEl(null);
      openCancelConfirmationHandler();
    } else if (index === 1) {
      setAnchorOptionEl(null);
      if (status === "not_approve") {
        setStatus("wait_approve");
        setEditButtonClick(true);
      } else {
        setEditButtonClick(true);
      }
    } else {
      setAnchorOptionEl(null);
      openCopyConfirmationHandler();
    }
  };

  const createItemsHandler = (_, index) => {
    if (index === 0) {
      history.push(`/expense/debit-note/add`, postPayload);
      setAnchorCreateEl(null);
    }
  };

  const createPaymentMadeHandler = () => {
    setIsLoading(true);
    postPaymentMadeFromPurchaseInvoice(purchaseInvoiceDocumentId)
      .then((data) => {
        console.log("purchase_invoice", data.data.data);
        setStatus("closed");
        history.push("/expense/payment-made/add", data.data.data);
        dispatch(showSnackbar(data.data.status, "สร้างใบรับชำระสำเร็จ"));
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "สร้างใบรับชำระไม่สำเร็จ"));
        setIsLoading(false);
        console.log(err.response.data);
      });
  };

  const currentTimestamp = moment().unix();

  const addItemHandler = () => {
    formik.setFieldValue(
      "purchase_invoice_data",
      formik.values.purchase_invoice_data.concat({
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
        item_account: "",
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
        <BreadcrumbComponent
          name="ใบบันทึกซื้อ"
          to="/expense/purchase-invoice"
        />
        {purchaseInvoiceDocumentId !== "-" ? (
          <BreadcrumbComponent
            name={purchaseInvoiceDocumentId}
            to={"/expense/purchase-invoice/" + purchaseInvoiceDocumentId}
          />
        ) : (
          <BreadcrumbComponent
            name="เพิ่มใบบันทึกซื้อ"
            to="/expense/purchase-invoice/add"
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
              !purchaseInvoiceData.payment_made_list ||
              purchaseInvoiceData.payment_made_list.length === 0
                ? {
                    cursor: "not-allowed !important",
                    pointerEvents: "all !important",
                  }
                : { color: "#419644 !important" }
            }
            label="ชำระเงิน"
            disabled={
              !purchaseInvoiceData.payment_made_list ||
              purchaseInvoiceData.payment_made_list.length === 0
            }
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <div className="account__formHeader-primary">
          <div className="account__formHeader-labelContainer">
            <h2 className="form-heading">บันทึกซื้อ</h2>
            {renderStatus(status)}
            {dateToUnix(formik.values.purchase_invoice_due_date) <
              currentTimestamp &&
              formik.values.purchase_invoice_status !== "closed" &&
              renderStatus("expired")}
          </div>
          <div className="account__buttonContainer">
            <AccountSplitButtonComponent
              disabled={disabled.print}
              defaultButtonValue="พิมพ์เอกสาร"
              options={["พิมพ์ใบบันทึกซื้อ"]}
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
            {(status === "wait_payment" || status === "partial_payment") && (
              <Button variant="contained" onClick={createPaymentMadeHandler}>
                รับชำระเงิน
              </Button>
            )}
            <AccountSplitButtonComponent
              disabled={disabled.create}
              defaultButtonValue="สร้าง"
              options={["รับใบลดหนี้"]}
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
              <p>{purchaseInvoiceDocumentId}</p>
            </div>
            <div className="account__formHeader-datetime">
              <AccountDateComponent
                disabled={disabled.date}
                startDateLabel="วันที่ออกเอกสาร"
                endDateLabel="ต้องการภายในวันที่"
                startDateValue={formik.values.purchase_invoice_issue_date}
                endDateValue={formik.values.purchase_invoice_due_date}
                startDateName="purchase_invoice_issue_date"
                endDateName="purchase_invoice_due_date"
                handleStartDateChange={handleStartDateChange}
                handleEndDateChange={handleEndDateChange}
              />
            </div>
          </div>
          {purchaseOrderDocumentId && (
            <div className="account__refDocument">
              <h4>อ้างอิงถึง</h4>
              <Link
                to={{
                  pathname: `/expense/purchase-order/${purchaseOrderDocumentId}`,
                }}
              >
                {purchaseOrderDocumentId}
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
              <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                <FormControl fullWidth size="small">
                  <InputLabel
                    disabled={disabled.target}
                    id="demo-simple-select-label"
                  >
                    คลังปลายทาง
                  </InputLabel>
                  <Select
                    disabled={disabled.target}
                    name="inventory_target"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={formik.values.inventory_target}
                    label="คลังปลายทาง"
                    onChange={formik.handleChange}
                    required
                  >
                    {wareHouseList.map((value) => (
                      <MenuItem key={value.id} value={value.id}>
                        {value.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
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
            data={formik.values.purchase_invoice_data}
            formik={formik}
            name="purchase_invoice_data"
            disabled={disabled.items}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <AccountTemplateComponent
                disabled={disabled.remark}
                remarkId={formik.values.purchase_invoice_template_remark_id}
                formik={formik}
                allTemplate={allTemplate}
                id="purchase_invoice_template_remark_id"
                detail="purchase_invoice_remark"
                remark={formik.values.purchase_invoice_remark}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <AccountSummaryComponent
                noShipping
                summary
                disabled={disabled.summary}
                data={formik.values.purchase_invoice_data}
                formik={formik}
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
              title="ยืนยันการยกเลิกใบบันทึกซื้อ"
              description="หากยกเลิกแล้วจะไม่สามารถเปลี่ยนแปลงรายการได้"
            />
          )}
          {copyConfirmation && (
            <AccountConfirmationComponent
              open={copyConfirmation}
              handleClose={closeCopyConfirmationHandler}
              handleSubmit={submitCopyConfirmationHandler}
              title="ยืนยันการคัดลอกใบบันทึกซื้อ"
            />
          )}
        </form>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <PaymentTabComponent
          paymentMadeList={purchaseInvoiceData.payment_made_list}
        />
      </TabPanel>
    </>
  );
};

export default AddPurchaseInvoiceComponent;
