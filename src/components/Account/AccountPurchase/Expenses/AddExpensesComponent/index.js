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
import { useParams, useHistory } from "react-router-dom";
import { initialValues, validationSchema } from "./payload";
import { useFormik } from "formik";
import {
  getRemarkTemplate,
  getExpensesById,
  updateExpenses,
  postExpenses,
  postPaymentMadeFromExpenses,
  copyExpenses,
  getContactOption,
  cancelExpenses,
} from "../../../../../adapter/Api";
// import AccountTableDataPurchaseComponent from "../../../AccountTableDataPurchaseComponent";
import AccountTemplateComponent from "../../../AccountTemplateComponent";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import { useDispatch } from "react-redux";
import AccountConfirmationComponent from "../../../AccountConfirmationComponent";
import { disabledStatus } from "./disabledStatus.js";
import PaymentTabComponent from "./PaymentTabComponent";
import AccountSummaryComponent from "../../../AccountSummaryComponent";
import AccountVendorComponent from "../../../AccountVendorComponent";
import { dateToUnix, unixToDate } from "../../../../../adapter/Utils";
import { getListWareHouse } from "../../../../../adapter/Api/graphql";
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

const AddExpensesComponent = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();
  const [expensesDocumentId, setExpensesDocumentId] = useState("-");
  const [expensesId, setExpensesId] = useState();
  const [expensesData, setExpensesData] = useState(initialValues);
  const [editButtonClick, setEditButtonClick] = useState(false);
  const [status, setStatus] = useState("create");
  const [disabled, setDisabled] = useState({
    print: true,
    options: true,
    create: true,
    edit: true,
    editButton: true,
    cancelButton: true,
    paymentTab: true,
  });
  const formik = useFormik({
    initialValues:
      id && expensesData.expenses_issue_date && expensesData.expenses_due_date
        ? {
            ...expensesData,
            expenses_issue_date: unixToDate(expensesData.expenses_issue_date),
            expenses_due_date: unixToDate(expensesData.expenses_due_date),
          }
        : expensesData,
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: validationSchema,
  });
  const [allTemplate, setAllTemplate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [confirmation, setConfimation] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [wareHouseList, setWareHouseList] = useState([]);

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
    const getWareHouse = getListWareHouse();
    const getRemarks = getRemarkTemplate();
    const getContacts = getContactOption(["vendor"]);
    if (id) {
      setIsLoading(true);
      const getPurchaseInvoice = getExpensesById(id);
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
            setExpensesData(myData);
            setStatus(myData.expenses_status);
            setExpensesId(myData.expenses_id);
            setExpensesDocumentId(myData.expenses_document_id);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
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
          setExpensesData((prev) => {
            return {
              ...prev,
              expenses_issue_date: moment().format(),
              expenses_due_date: moment().add(7, "days").format(),
            };
          });
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    }
  }, [id]);

  const handleStartDateChange = (newValue) => {
    formik.setFieldValue("expenses_issue_date", newValue);
  };

  const handleEndDateChange = (newValue) => {
    formik.setFieldValue("expenses_due_date", newValue);
  };

  const postPayload = {
    ...formik.values,
    expenses_id: expensesId,
    expenses_document_id: expensesDocumentId,
    expenses_issue_date: dateToUnix(formik.values.expenses_issue_date),
    expenses_due_date: dateToUnix(formik.values.expenses_due_date),
  };

  const saveDraftHandler = () => {
    setIsLoading(true);
    console.log(postPayload);
    if (expensesDocumentId !== "-") {
      console.log("updated");
      updateExpenses("", expensesDocumentId, postPayload)
        .then((data) => {
          setStatus("draft");
          dispatch(showSnackbar(data.data.status, "บันทึกร่างสำเร็จ"));
          setIsLoading(false);
        })
        .catch((err) => {
          dispatch(
            showSnackbar("error", err.response.data.message.split(":")[1])
          );
          setIsLoading(false);
        });
    } else {
      console.log(postPayload);
      postExpenses("", postPayload)
        .then((data) => {
          setStatus("draft");
          setExpensesId(data.data.data.insertId);
          setExpensesDocumentId(data.data.data.documentId);
          dispatch(showSnackbar(data.data.status, "บันทึกร่างสำเร็จ"));
          history.push(`/expense/expenses/${data.data.data.documentId}`);
          setIsLoading(false);
        })
        .catch((err) => {
          dispatch(
            showSnackbar("error", err.response.data.message.split(":")[1])
          );
          setIsLoading(false);
        });
    }
  };

  const approveHandler = () => {
    setIsLoading(true);
    postExpenses("approve", postPayload)
      .then((data) => {
        setExpensesDocumentId(data.data.data.documentId);
        setStatus("wait_payment");
        dispatch(showSnackbar(data.data.status, "อนุมัติสำเร็จ"));
        history.push(`/expense/expenses/${data.data.data.documentId}`);
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(
          showSnackbar("error", err.response.data.message.split(":")[1])
        );
        setIsLoading(false);
      });
  };

  const openConfirmationHandler = () => {
    setConfimation(true);
  };

  const closeConfirmationHandler = () => {
    setConfimation(false);
  };

  const editCancelled = () => {
    setEditButtonClick(false);
    setIsLoading(true);
    getExpensesById(expensesDocumentId)
      .then((data) => {
        if (data.data.status === "success") {
          const myData = data.data.data;
          const formatData = {
            ...myData,
            expenses_issue_date: unixToDate(myData.expenses_issue_date),
            expenses_due_date: unixToDate(myData.expenses_due_date),
          };
          formik.setValues(formatData);
          setStatus(formatData.expenses_status);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        console.log(err.response.data);
      });
  };

  const editWaitPayment = () => {
    setIsLoading(true);
    if (status === "wait_payment") {
      postPayload.expenses_status = "wait_payment";
    }
    console.log("update", postPayload);
    updateExpenses("", expensesDocumentId, postPayload)
      .then((data) => {
        dispatch(showSnackbar(data.data.status, "บันทึกสำเร็จ"));
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(
          showSnackbar("error", err.response.data.message.split(":")[1])
        );
        setIsLoading(false);
      });
    setEditButtonClick(false);
  };

  const submitConfirmationHandler = () => {
    setConfimation(false);
    setIsLoading(true);
    cancelExpenses(expensesDocumentId)
      .then((data) => {
        console.log(data);
        setStatus("cancelled");
        dispatch(showSnackbar("success", "ยกเลิกใบบันทึกค่าใช้จ่ายสำเร็จ"));
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "ยกเลิกใบบันทึกค่าใช้จ่ายไม่สำเร็จ"));
        setIsLoading(false);
        console.log(err);
      });
  };

  const printItemsHandler = (_, index) => {
    if (index === 0) {
      setAnchorPrintEl(null);
      history.push(`/expense/expenses/${expensesDocumentId}/pdf`);
    }
  };

  const optionItemsHandler = (_, index) => {
    if (index === 0) {
      setAnchorOptionEl(null);
      openConfirmationHandler();
      console.log("here");
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
      setIsLoading(true);
      copyExpenses(expensesDocumentId)
        .then((data) => {
          dispatch(
            showSnackbar(data.data.status, "ตัดลอกใบบันทึกค่าใช้จ่ายสำเร็จ")
          );
          setIsLoading(false);
        })
        .catch((err) => {
          dispatch(showSnackbar("error", "ตัดลอกใบบันทึกค่าใช้จ่ายไม่สำเร็จ"));
          setIsLoading(false);
          console.log(err.response.data);
        });
    }
  };

  const createPaymentMadeHandler = () => {
    setIsLoading(true);
    postPaymentMadeFromExpenses(expensesDocumentId)
      .then((data) => {
        console.log("expenses", data.data.data);
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
      "expenses_data",
      formik.values.expenses_data.concat({
        vat: "NONE",
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
        <BreadcrumbComponent name="บันทึกค่าใช้จ่าย" to="/expense/expenses" />
        {expensesDocumentId !== "-" ? (
          <BreadcrumbComponent
            name={expensesDocumentId}
            to={"/expense/expenses/" + expensesDocumentId}
          />
        ) : (
          <BreadcrumbComponent
            name="เพิ่มบันทึกค่าใช้จ่าย"
            to="/expense/expenses/add"
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
              disabled.paymentTab
                ? {
                    cursor: "not-allowed !important",
                    pointerEvents: "all !important",
                  }
                : { color: "#419644 !important" }
            }
            label="ชำระเงิน"
            disabled={disabled.paymentTab}
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <div className="account__formHeader-primary">
          <div className="account__formHeader-labelContainer">
            <h2 className="form-heading">บันทึกค่าใช้จ่าย</h2>
            {renderStatus(status)}
            {dateToUnix(formik.values.expenses_due_date) < currentTimestamp &&
              formik.values.expenses_status !== "closed" &&
              renderStatus("expired")}
          </div>
          <div className="account__buttonContainer">
            <AccountSplitButtonComponent
              disabled={disabled.print}
              defaultButtonValue="พิมพ์เอกสาร"
              options={["พิมพ์ใบบันทึกค่าใช้จ่าย"]}
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
          </div>
        </div>
        <form>
          <div className="account__formHeader-secondary">
            <div className="account__formHeader-document">
              <h4>เลขที่เอกสาร</h4>
              <p>{expensesDocumentId}</p>
            </div>
            <div className="account__formHeader-datetime">
              <AccountDateComponent
                disabled={disabled.edit}
                startDateLabel="วันที่ออกเอกสาร"
                endDateLabel="ต้องการภายในวันที่"
                startDateValue={formik.values.expenses_issue_date}
                endDateValue={formik.values.expenses_due_date}
                startDateName="expenses_issue_date"
                endDateName="expenses_due_date"
                handleStartDateChange={handleStartDateChange}
                handleEndDateChange={handleEndDateChange}
              />
            </div>
          </div>
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
                  disabled={disabled.edit}
                  size="small"
                  label="หมายเลขอ้างอิง/เลขที่ใบเสนอราคา"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
                <FormControl fullWidth size="small">
                  <InputLabel
                    disabled={disabled.edit}
                    id="demo-simple-select-label"
                  >
                    คลังปลายทาง
                  </InputLabel>
                  <Select
                    disabled={disabled.edit}
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
            disabled={disabled.edit}
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
              เพิ่มแถว
            </Button>
          </Box>
          <AccountTableDataPurchaseComponent
            ExpenseNote
            data={formik.values.expenses_data}
            formik={formik}
            name="expenses_data"
            disabled={disabled.items}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <AccountTemplateComponent
                disabled={disabled.edit}
                remarkId={formik.values.expenses_template_remark_id}
                formik={formik}
                allTemplate={allTemplate}
                id="expenses_template_remark_id"
                detail="expenses_remark"
                remark={formik.values.expenses_remark}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <AccountSummaryComponent
                noShipping
                summary
                disabled={disabled.edit}
                data={formik.values.expenses_data}
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
                <Button variant="contained" onClick={saveDraftHandler}>
                  บันทึกร่าง
                </Button>
                <Button variant="contained" onClick={approveHandler}>
                  อนุมัติ
                </Button>
              </>
            )}
            {status === "wait_payment" && editButtonClick && (
              <>
                <Button variant="contained" onClick={editCancelled}>
                  ยกเลิก
                </Button>
                <Button variant="contained" onClick={editWaitPayment}>
                  บันทึก
                </Button>
              </>
            )}
          </Box>
          <AccountConfirmationComponent
            open={confirmation}
            handleClose={closeConfirmationHandler}
            handleSubmit={submitConfirmationHandler}
            title="ยกเลิกใบบันทึกค่าใช้จ่าย?"
            description="คุณยืนยันที่จะยกเลิกใบขอซื้อ ถ้ายกเลิกแล้วจะไม่สามารถเปลี่ยนแปลงได้"
          />
        </form>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <PaymentTabComponent />
      </TabPanel>
    </>
  );
};

export default AddExpensesComponent;
