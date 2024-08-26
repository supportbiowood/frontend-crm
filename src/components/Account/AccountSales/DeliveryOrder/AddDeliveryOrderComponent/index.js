import {
  Backdrop,
  Breadcrumbs,
  Button,
  Chip,
  CircularProgress,
  Grid,
} from "@mui/material";
import moment from "moment";
import React, { useState, useEffect } from "react";
import BreadcrumbComponent from "../../../../BreadcrumbComponent";
import AccountCustomerComponent from "../../../AccountCustomerComponent";
import AccountDateComponent from "../../../AccountDateComponent";
import AccountSplitButtonComponent from "../../../AccountSplitButtonComponent";
import { renderStatus } from "../../../renderStatus";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { initialValues, validationSchema } from "./payload";
import { useFormik } from "formik";
import {
  getAllEmployee,
  getDeliveryNoteById,
  getRemarkTemplate,
  postDeliveryNote,
  updateDeliveryNote,
  postDeliveryNoteWithId,
  cancelDeliveryNote,
  copyDeliveryNote,
  getContactOption,
} from "../../../../../adapter/Api";
import AccountTemplateComponent from "../../../AccountTemplateComponent";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import { useDispatch } from "react-redux";
import AccountConfirmationComponent from "../../../AccountConfirmationComponent";
import { disabledStatus } from "./disabledStatus";
import { Box } from "@mui/system";
import DeliveryDestination from "./DeliveryDestination";
import DeliveryDetail from "./DeliveryDetail";
import AccountImportComponent from "../../../AccountImportComponent";
import AccountTableDataPurchaseComponent from "../../../AccountTableDataPurchaseComponent";
import {
  dateToUnix,
  unixToDate,
  actionType,
} from "../../../../../adapter/Utils";

const AddDeliveryOrderComponent = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();
  const location = useLocation();
  const [deliveryOrderDocumentId, setDeliveryOrderDocumentId] = useState("-");
  const [deliveryOrderId, setDeliveryOrderId] = useState();
  const [status, setStatus] = useState("create");
  const [disabled, setDisabled] = useState({
    print: true,
    options: true,
    create: true,
    editButton: true,
    cancelButton: true,
    date: true,
    customer: true,
    delivery: true,
    items: true,
    remark: true,
    upload: true,
  });
  const [deliveryOrderData, setDeliveryOrderData] = useState(initialValues);
  const [contacts, setContacts] = useState();
  const [employees, setEmployees] = useState();
  const [allTemplate, setAllTemplate] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [cancelConfirmation, setCancelConfirmation] = useState(false);
  const [copyConfirmation, setCopyConfirmation] = useState(false);
  const [importDocument, setImportDocument] = useState(false);
  const [selectedImportDocument, setSelectedImportdocument] = useState([]);

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
    disabledStatus(status, setDisabled);
  }, [status]);

  useEffect(() => {
    const getContacts = getContactOption(["customer"]);
    const getRemarks = getRemarkTemplate();
    const getEmployees = getAllEmployee();
    if (id) {
      setIsLoading(true);
      const getDeliveryNote = getDeliveryNoteById(id);
      Promise.all([getContacts, getRemarks, getEmployees, getDeliveryNote])
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
            setEmployees(myData);
          }
          if (values[3].data.status === "success") {
            let myData = values[3].data.data;
            const formatData = {
              ...myData,
              pickup_date: unixToDate(myData.pickup_date),
            };
            setDeliveryOrderData(formatData);
            setStatus(formatData.delivery_note_status);
            setDeliveryOrderId(formatData.delivery_note_id);
            setDeliveryOrderDocumentId(formatData.delivery_note_document_id);
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    } else if (location.state) {
      let itemData = [];
      const salesOrderList = location.state.sales_order_data;
      const salesOrderCategory =
        salesOrderList && salesOrderList.map((list) => list.category_list);
      salesOrderCategory.forEach((categoryGroup) => {
        categoryGroup.forEach((category) => {
          category.item_data.forEach((item) => {
            itemData.push(item);
          });
        });
      });
      const salesOrderDocumentIdList = new Array(
        location.state.sales_order_document_id
      );
      const salesOrderProjectList = new Array({
        project_id: location.state.billing_info.project_id,
        project_name: location.state.billing_info.project_name,
      });
      const uniqueProjectList = [
        ...new Map(
          salesOrderProjectList.map((project) => [
            project["project_name"],
            project,
          ])
        ).values(),
      ];
      setIsLoading(true);
      Promise.all([getContacts, getRemarks, getEmployees]).then((values) => {
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
          setEmployees(myData);
        }
        setDeliveryOrderData((prev) => {
          return {
            ...prev,
            delivery_note_issue_date: moment().format(),
            delivery_note_delivery_date: moment().add(7, "days").format(),
            pickup_date: moment().add(7, "days").format(),
            billing_info: location.state.billing_info,
            sales_order_document_id_list: salesOrderDocumentIdList,
            sales_order_project_list: uniqueProjectList,
            delivery_note_data: itemData,
            shipping_cost: location.state.shipping_cost,
            additional_discount: location.state.additional_discount,
          };
        });
        setDisabled({
          print: true,
          options: true,
          create: true,
          editButton: true,
          cancelButton: true,
          date: false,
          customer: true,
          delivery: false,
          items: true,
          remark: false,
          upload: true,
        });
        setIsLoading(false);
      });
    } else {
      setIsLoading(true);
      Promise.all([getContacts, getRemarks, getEmployees])
        .then((values) => {
          if (values[0].data.status === "success") {
            let myData = values[0].data.data;
            const filterContact = myData.filter(
              (contact) =>
                contact.contact_status !== "delete" &&
                contact.contact_is_customer === 1
            );
            setContacts(filterContact);
          }
          if (values[1].data.status === "success") {
            let myData = values[1].data.data;
            setAllTemplate(myData);
          }
          if (values[2].data.status === "success") {
            let myData = values[2].data.data;
            setEmployees(myData);
          }
          setDeliveryOrderData((prev) => {
            return {
              ...prev,
              delivery_note_issue_date: moment().format(),
              delivery_note_delivery_date: moment().add(7, "days").format(),
              pickup_date: moment().add(7, "days").format(),
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
      deliveryOrderData.delivery_note_issue_date &&
      deliveryOrderData.delivery_note_delivery_date &&
      !isNaN(deliveryOrderData.delivery_note_issue_date) &&
      !isNaN(deliveryOrderData.delivery_note_delivery_date)
        ? {
            ...deliveryOrderData,
            delivery_note_issue_date: unixToDate(
              deliveryOrderData.delivery_note_issue_date
            ),
            delivery_note_delivery_date: unixToDate(
              deliveryOrderData.delivery_note_delivery_date
            ),
          }
        : deliveryOrderData,
    enableReinitialize: true,
    validateOnChange: false,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const postPayload = {
        ...values,
        delivery_note_id: deliveryOrderId,
        delivery_note_document_id: deliveryOrderDocumentId,
        delivery_note_issue_date: dateToUnix(values.delivery_note_issue_date),
        delivery_note_delivery_date: dateToUnix(
          values.delivery_note_delivery_date
        ),
        pickup_date: dateToUnix(values.pickup_date),
      };
      switch (values.action) {
        case actionType.saveToDraft:
          setIsLoading(true);
          if (deliveryOrderDocumentId !== "-") {
            console.log("updated");
            updateDeliveryNote(deliveryOrderDocumentId, postPayload)
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
                    "บันทึกร่างไม่สำเร็จ",
                    err.response.data.message.split(":")[1]
                  )
                );
                setIsLoading(false);
              });
          } else {
            console.log("post", postPayload);
            postDeliveryNote("", postPayload)
              .then((data) => {
                setStatus("draft");
                if (data.data.data.insertId && data.data.data.documentId) {
                  setDeliveryOrderId(data.data.data.insertId);
                  setDeliveryOrderDocumentId(data.data.data.documentId);
                  history.push(
                    `/income/delivery-order/${data.data.data.documentId}`
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
        case actionType.sendToApprove:
          setIsLoading(true);
          postDeliveryNote("approve", postPayload)
            .then((data) => {
              setStatus("wait_delivery");
              if (data.data.data.insertId && data.data.data.documentId) {
                setDeliveryOrderId(data.data.data.insertId);
                setDeliveryOrderDocumentId(data.data.data.documentId);
                history.push(
                  `/income/delivery-order/${data.data.data.documentId}`
                );
              }
              dispatch(showSnackbar(data.data.status, "อนุมัติสำเร็จ"));
              if (id) setIsLoading(false);
            })
            .catch((err) => {
              console.log(err.response.data);
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
        case actionType.changeStatus:
          setIsLoading(true);
          postDeliveryNoteWithId(
            deliveryOrderDocumentId,
            "change_status",
            postPayload
          )
            .then((data) => {
              setStatus(formik.values.delivery_note_status);
              dispatch(
                showSnackbar(data.data.status, "บันทึกรายละเอียดการส่งสำเร็จ")
              );
              setIsLoading(false);
            })
            .catch((err) => {
              console.log(err);
              dispatch(
                showSnackbar(
                  "error",
                  "บันทึกรายละเอียดการส่งไม่สำเร็จ",
                  err.response.data.message.split(":")[1]
                )
              );
              setIsLoading(false);
            });
          break;
        // case actionType.edit:
        //   setIsLoading(true);
        //   postQuotation("wait_approve", postPayload)
        //     .then((data) => {
        //       setStatus("wait_approve");
        //       dispatch(showSnackbar(data.data.status, "บันทึกสำเร็จ"));
        //       if (data.data.data.insertId && data.data.data.documentId) {
        //         setQuotationId(data.data.data.insertId);
        //         setQuotationDocumentId(data.data.data.documentId);
        //       }
        //       setIsLoading(false);
        //     })
        //     .catch(() => {
        //       dispatch(showSnackbar("error", "บันทึกไม่สำเร็จ"));
        //       setIsLoading(false);
        //     });
        //   setEditButtonClick(false);
        //   break;
        default:
          return;
      }
    },
  });

  const handleStartDateChange = (newValue) => {
    formik.setFieldValue("delivery_note_issue_date", newValue);
  };

  const handleSentDateChange = (newValue) => {
    formik.setFieldValue("delivery_note_delivery_date", newValue);
  };

  const saveDraftHandler = () => {
    formik.setFieldValue("action", actionType.saveToDraft);
  };

  const sendToApprove = () => {
    formik.setFieldValue("action", actionType.sendToApprove);
  };

  const changeStatusWhenApproved = () => {
    formik.setFieldValue("action", actionType.changeStatus);
    formik.submitForm();
  };

  const openImportDocumentHandler = () => {
    setImportDocument(true);
  };

  const closeImportDocumentHandler = () => {
    setImportDocument(false);
  };

  const openCancelConfirmationHandler = () => {
    setCancelConfirmation(true);
  };

  const closeCancelConfirmationHandler = () => {
    setCancelConfirmation(false);
  };

  const submitCancelConfirmationHandler = () => {
    setCancelConfirmation(false);
    cancelDeliveryNote(deliveryOrderDocumentId)
      .then((data) => {
        setStatus("cancelled");
        dispatch(showSnackbar(data.data.status, "ยกเลิกใบส่งของสำเร็จ"));
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        dispatch(showSnackbar("error", "ยกเลิกใบส่งของไม่สำเร็จ"));
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
    copyDeliveryNote(deliveryOrderDocumentId)
      .then((data) => {
        history.push("/income/delivery-order/add");
        dispatch(showSnackbar(data.data.status, "ตัดลอกใบส่งของสำเร็จ"));
        setStatus("create");
        setDeliveryOrderId();
        setDeliveryOrderDocumentId("-");
        setDeliveryOrderData({
          ...data.data.data,
          attachment_list: [],
          attachment_remark: "",
          consignee_name: "",
          delivery_note_issue_date: moment().format(),
          delivery_note_delivery_date: moment().add(7, "days").format(),
        });
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "ตัดลอกใบส่งของไม่สำเร็จ"));
        setIsLoading(false);
        console.log(err);
      });
  };

  const submitImportDocumentHandler = () => {
    setImportDocument(false);
    const itemData = [];

    const existingDocumentId = [...formik.values.sales_order_document_id_list];
    const existingProjectList = [...formik.values.sales_order_project_list];
    const existingItems = [
      ...formik.values.delivery_note_data.filter(
        (data) => data.item_id.length !== 0
      ),
    ];

    const salesOrderDocumentIdList = selectedImportDocument.map(
      (document) => document.sales_order_document_id
    );

    const salesOrderProjectList = selectedImportDocument.map((document) => {
      return {
        project_id: document.billing_info.project_id,
        project_name: document.billing_info.project_name,
      };
    });

    const isSomeMatch = salesOrderDocumentIdList.some((element) => {
      return existingDocumentId.includes(element);
    });

    if (isSomeMatch) {
      dispatch(showSnackbar("error", "ไม่สามารถเลือกรายการซ้ำได้"));
    } else {
      selectedImportDocument.forEach((document) => {
        document.sales_order_data.forEach((list) => {
          list.category_list.forEach((categoryGroup) => {
            categoryGroup.item_data.forEach((category) => {
              itemData.push(category);
            });
          });
        });
      });

      const filterProjectList = salesOrderProjectList.filter(
        (project) =>
          project.project_id.length !== 0 && project.project_name !== 0
      );

      const allDocumentId = existingDocumentId.concat(salesOrderDocumentIdList);
      const allProjectList = existingProjectList.concat(filterProjectList);
      const allData = existingItems.concat(itemData);

      const uniqueProjectList = [
        ...new Map(
          allProjectList.map((project) => [project["project_name"], project])
        ).values(),
      ];

      formik.setFieldValue("sales_order_document_id_list", allDocumentId);
      formik.setFieldValue("sales_order_project_list", uniqueProjectList);
      formik.setFieldValue("delivery_note_data", allData);
    }
  };

  const printItemsHandler = (_, index) => {
    if (index === 0) {
      setAnchorPrintEl(null);
      history.push(`/income/delivery-order/${deliveryOrderDocumentId}/pdf`);
    }
  };

  const optionItemsHandler = (_, index) => {
    if (index === 0) {
      setAnchorOptionEl(null);
      openCancelConfirmationHandler();
    } else if (index === 1) {
      setAnchorOptionEl(null);
      setStatus("wait_delivery");
    } else {
      setAnchorOptionEl(null);
      openCopyConfirmationHandler();
    }
  };

  const clickDocumentRefHandler = (documentId) => {
    history.push(`/income/sales-order/${documentId}`);
  };

  const deleteDocumentRefHandler = (documentId) => {
    console.log(documentId);
    const currentDocuments = formik.values.sales_order_document_id_list;
    const removedDocument = currentDocuments.filter(
      (document) => document !== documentId
    );
    formik.setFieldValue("sales_order_document_id_list", removedDocument);
  };

  const clickProjectRefHandler = (projectId) => {
    history.push(`/sales/project/${projectId}`);
  };

  const deleteProjectRefHandler = (projectId) => {
    const currentProjects = formik.values.sales_order_project_list;
    const removedProject = currentProjects.filter(
      (projects) => projects.project_id !== projectId
    );
    formik.setFieldValue("sales_order_project_list", removedProject);
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
        <BreadcrumbComponent name="ใบส่งของ" to="/income/delivery-order" />
        {deliveryOrderDocumentId !== "-" ? (
          <BreadcrumbComponent
            name={deliveryOrderDocumentId}
            to={"/income/delivery-order/" + deliveryOrderId}
          />
        ) : (
          <BreadcrumbComponent
            name="เพิ่มใบส่งของ"
            to="/income/delivery-order/add"
          />
        )}
      </Breadcrumbs>
      <div className="account__formHeader-primary">
        <div className="account__formHeader-labelContainer">
          <h2 className="form-heading">ใบส่งของ</h2>
          {renderStatus(status)}
        </div>
        <div className="account__buttonContainer">
          <AccountSplitButtonComponent
            disabled={disabled.print}
            defaultButtonValue="พิมพ์เอกสาร"
            options={["พิมพ์ใบส่งของ"]}
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
            <p>{deliveryOrderDocumentId}</p>
          </div>
          <div className="account__formHeader-datetime">
            <AccountDateComponent
              disabled={disabled.edit}
              startDateLabel="วันที่ออกเอกสาร"
              sentDateLabel="วันกำหนดส่งของ"
              startDateValue={formik.values.delivery_note_issue_date}
              sentDateValue={formik.values.delivery_note_delivery_date}
              startDateName="delivery_note_issue_date"
              endDateName="delivery_note_delivery_date"
              handleStartDateChange={handleStartDateChange}
              handleSentDateChange={handleSentDateChange}
            />
          </div>
        </div>
        {formik.values.sales_order_document_id_list &&
          formik.values.sales_order_document_id_list.length > 0 && (
            <div className="account__refDocumentChip">
              <h4>อ้างอิงถึง</h4>
              {formik.values.sales_order_document_id_list.map((document) => (
                <Chip
                  key={document}
                  sx={{ fontSize: "1rem", padding: ".25rem" }}
                  color="success"
                  label={document}
                  variant="outlined"
                  onClick={() => clickDocumentRefHandler(document)}
                  onDelete={
                    status === "create" || status === "draft"
                      ? () => deleteDocumentRefHandler(document)
                      : null
                  }
                />
              ))}
            </div>
          )}
        {formik.values.sales_order_project_list &&
          formik.values.sales_order_project_list.length > 0 && (
            <div className="account__refDocumentChip">
              <h4>โครงการที่เกี่ยวข้อง</h4>
              {formik.values.sales_order_project_list.map((document) => (
                <Chip
                  key={document.project_id}
                  sx={{ fontSize: "1rem", padding: ".25rem" }}
                  color="success"
                  label={document.project_name}
                  variant="outlined"
                  onClick={() => clickProjectRefHandler(document.project_id)}
                  onDelete={
                    status === "create" || status === "draft"
                      ? () => deleteProjectRefHandler(document.project_id)
                      : null
                  }
                />
              ))}
            </div>
          )}
        <AccountCustomerComponent
          formik={formik}
          disabled={disabled.customer}
          contacts={contacts}
          contactId={formik.values.billing_info.contact_id}
          deliveryOrder
        />
        <DeliveryDestination
          disabled={disabled.delivery}
          formik={formik}
          employees={employees}
        />
        <Box sx={{ mb: "1rem" }}>
          <Button
            disabled={
              disabled.items ||
              formik.values.billing_info.contact_id.length === 0
            }
            variant="contained"
            onClick={openImportDocumentHandler}
          >
            นำเข้าใบสั่งขาย
          </Button>
        </Box>
        <AccountTableDataPurchaseComponent
          DOTable
          disabled={disabled.items}
          data={formik.values.delivery_note_data}
          formik={formik}
          name={`delivery_note_data`}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <AccountTemplateComponent
              disabled={disabled.remark}
              remarkId={formik.values.delivery_note_template_remark_id}
              formik={formik}
              allTemplate={allTemplate}
              id="delivery_note_template_remark_id"
              detail="delivery_note_remark"
              remark={formik.values.delivery_note_remark}
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
              <Button variant="contained" type="submit" onClick={sendToApprove}>
                ส่ง
              </Button>
            </>
          )}
        </Box>
        {status !== "create" && status !== "draft" && (
          <>
            <DeliveryDetail
              setIsLoading={setIsLoading}
              disabled={disabled.upload}
              formik={formik}
              status={status}
              changeStatusWhenApproved={changeStatusWhenApproved}
            />
          </>
        )}
        {cancelConfirmation && (
          <AccountConfirmationComponent
            open={cancelConfirmation}
            handleClose={closeCancelConfirmationHandler}
            handleSubmit={submitCancelConfirmationHandler}
            title="ยืนยันการยกเลิกใบส่งของ"
            description="หากยกเลิกแล้วจะไม่สามารถเปลี่ยนแปลงรายการได้"
          />
        )}
        {copyConfirmation && (
          <AccountConfirmationComponent
            open={copyConfirmation}
            handleClose={closeCopyConfirmationHandler}
            handleSubmit={submitCopyConfirmationHandler}
            title="ยืนยันการคัดลอกใบส่งของ"
          />
        )}
      </form>
      <AccountImportComponent
        contact_id={formik.values.billing_info.contact_id}
        open={importDocument}
        setSelectedImportdocument={setSelectedImportdocument}
        handleClose={closeImportDocumentHandler}
        handleSubmit={submitImportDocumentHandler}
        title="เลือกจากใบสั่งขาย"
        submitButtonLabel="นำเข้าใบสั่งขาย"
      />
    </>
  );
};

export default AddDeliveryOrderComponent;
