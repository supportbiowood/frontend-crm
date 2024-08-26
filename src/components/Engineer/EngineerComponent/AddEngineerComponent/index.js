import {
  Backdrop,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import moment from "moment";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  deleteEngineer,
  getContactOption,
  getEngineerById,
  getProjectOption,
  postEngineer,
  updateEngineer,
} from "../../../../adapter/Api";
import { dateToUnix, unixToDate } from "../../../../adapter/Utils";
import BreadcrumbComponent from "../../../BreadcrumbComponent";
import EngineerProgressBarComponent from "../../EngineerProgressBarComponent";
import EngineerProjectComponent from "../../EngineerProjectComponent";
import EngineerDateComponent from "../../EngineerDateComponent";
import EngineerRemarkComponent from "../../EngineerRemarkComponent";
import EngineerSplitButtonComponent from "../../EngineerSplitButtonComponent";
import InformationAccordion from "./InformationAccordion";
import InstallationAccordion from "./InstallationAccordion";
import { initialValues, validationSchema } from "./payload";
import { disabledStatus } from "./disabledStatus";
import EngineerTableDataComponent from "../../EngineerTableDataComponent";
import EngineerStaffComponent from "../../EngineerStaffComponent";
import { showSnackbar } from "../../../../redux/actions/snackbarActions";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { actionType } from "../../../../adapter/Utils";
import { renderStatus } from "../../renderStatus";
import DocumentAccordion from "./DocumentAccordion";
import AccountConfirmationComponent from "../../../Account/AccountConfirmationComponent";

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

const AddEngineerComponent = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const [engineerId, setEngineerId] = useState();
  const [projects, setProjects] = useState();
  const [contacts, setContacts] = useState();
  const [engineerDocumentId, setEngineerDocumentId] = useState("-");
  const [engineerData, setEngineerData] = useState(initialValues);
  const [status, setStatus] = useState("create");
  const [tabValue, setTabValue] = useState(0);
  const [disabled, setDisabled] = useState({
    print: false,
    options: false,
    issueDate: false,
    startDate: false,
    sendDate: false,
    cancelButton: false,
    editButton: false,
    form: false,
    inputDocument: false,
    deliverDocument: false,
    staff: false,
    remark: false,
    remarkDocument: false,
  });
  const [isCancel, setIsCancel] = useState(false);
  const [cancelConfirmation, setCancelConfirmation] = useState(false);

  const [editButtonClick, setEditButtonClick] = useState(false);

  const [anchorOptionEl, setAnchorOptionEl] = useState(null);
  const [revisionId, setRevisionId] = useState(null);

  const openOption = Boolean(anchorOptionEl);

  const handleOpenOptionMenu = (event) => {
    setAnchorOptionEl(event.currentTarget);
  };

  const handleCloseOptionMenu = () => {
    setAnchorOptionEl(null);
  };

  const handleChange = (_, newValue) => {
    setTabValue(newValue);
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

  const openCancelConfirmationHandler = () => {
    setCancelConfirmation(true);
  };

  const closeCancelConfirmationHandler = () => {
    setCancelConfirmation(false);
  };

  const handleStartDateChange = (newValue) => {
    formik.setFieldValue("engineer_issue_date", newValue);
  };

  const handleEndDateChange = (newValue) => {
    formik.setFieldValue("engineer_start_date", newValue);
  };

  const handleSendDateChange = (newValue) => {
    formik.setFieldValue("engineer_end_date", newValue);
  };

  useEffect(() => {
    const getProjects = getProjectOption(["project_status"]);
    const getContacts = getContactOption(["customer"]);
    if (id) {
      setIsLoading(true);
      const getEngineer = getEngineerById(id);
      Promise.all([getProjects, getContacts, getEngineer])
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
            setEngineerData(myData);
            setStatus(myData.engineer_status);
            setEngineerId(myData.engineer_id);
            setEngineerDocumentId(myData.engineer_document_id);
            setRevisionId(myData.revision_id);
            if (myData.engineer_status === "cancelled") {
              setIsCancel(true);
            } else {
              setIsCancel(false);
            }
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
        });
    } else {
      setIsLoading(true);
      Promise.all([getProjects, getContacts])
        .then((values) => {
          if (values[0].data.status === "success") {
            let myData = values[0].data.data;
            setProjects(myData);
          }
          if (values[1].data.status === "success") {
            let myData = values[1].data.data;
            setContacts(myData);
          }
          setEngineerData((prev) => {
            return {
              ...prev,
              engineer_issue_date: moment().format(),
              engineer_start_date: moment().add(7, "days").format(),
              engineer_end_date: moment().add(7, "days").format(),
              engineer_in_date: moment().format(),
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

  useEffect(() => {
    disabledStatus(status, setDisabled, editButtonClick);
  }, [status, editButtonClick]);

  const formik = useFormik({
    initialValues:
      id &&
      engineerData.engineer_issue_date &&
      engineerData.engineer_start_date &&
      !isNaN(engineerData.engineer_issue_date) &&
      !isNaN(engineerData.engineer_start_date)
        ? {
            ...engineerData,
            engineer_issue_date: unixToDate(engineerData.engineer_issue_date),
            engineer_start_date: unixToDate(engineerData.engineer_start_date),
            engineer_end_date:
              engineerData.engineer_end_date &&
              unixToDate(engineerData.engineer_start_date),
          }
        : engineerData,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const postPayload = {
        ...values,
        engineer_id: engineerId,
        engineer_document_id: engineerDocumentId,
        engineer_issue_date: dateToUnix(values.engineer_issue_date),
        engineer_start_date: dateToUnix(values.engineer_start_date),
        engineer_end_date: dateToUnix(values.engineer_end_date),
        revision_id: revisionId,
      };

      delete postPayload.action;

      switch (values.action) {
        case actionType.saveToDraft:
          setIsLoading(true);
          if (engineerDocumentId === "-") {
            postPayload.engineer_status = "draft";
            postEngineer(null, postPayload)
              .then((data) => {
                setStatus("draft");
                if (
                  data.data.data.insertId &&
                  data.data.data.engineer_document_id
                ) {
                  setEngineerId(data.data.data.insertId);
                  setEngineerDocumentId(data.data.data.engineer_document_id);
                  history.push(
                    `/engineer/estimate/${data.data.data.engineer_document_id}`
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
          } else {
            if (
              status === "job_not_approve" ||
              status === "queue_declined" ||
              status === "work_declined"
            ) {
              postPayload.engineer_status = "draft";
              postEngineer(engineerDocumentId, postPayload)
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
              updateEngineer(engineerDocumentId, "", postPayload)
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
          }
          break;
        case actionType.waitJobApprove:
          setIsLoading(true);
          if (engineerDocumentId === "-") {
            postPayload.engineer_status = "wait_job_approve";
            postEngineer(null, postPayload)
              .then((data) => {
                setStatus("wait_job_approve");
                if (
                  data.data.data.insertId &&
                  data.data.data.engineer_document_id
                ) {
                  setEngineerId(data.data.data.insertId);
                  setEngineerDocumentId(data.data.data.engineer_document_id);
                  history.push(
                    `/engineer/estimate/${data.data.data.engineer_document_id}`
                  );
                }
                dispatch(
                  showSnackbar(data.data.status, "เปิดงานถอดแบบใหม่สำเร็จ")
                );
                if (id) setIsLoading(false);
              })
              .catch((err) => {
                console.log(err.response.data);
                dispatch(
                  showSnackbar(
                    "error",
                    `เปิดงานถอดแบบใหม่ไม่สำเร็จ`,
                    err.response.data.message.split(":")[1]
                  )
                );
                setIsLoading(false);
              });
          } else {
            if (status === "job_not_approve") {
              postPayload.engineer_status = "wait_job_approve";
              postEngineer(engineerDocumentId, postPayload)
                .then((data) => {
                  setStatus("wait_job_approve");
                  dispatch(
                    showSnackbar(data.data.status, "เปิดงานถอดแบบใหม่สำเร็จ")
                  );
                  setIsLoading(false);
                })
                .catch((err) => {
                  console.log(err.response.data);
                  dispatch(
                    showSnackbar(
                      "error",
                      `เปิดงานถอดแบบใหม่ไม่สำเร็จ`,
                      err.response.data.message.split(":")[1]
                    )
                  );
                  setIsLoading(false);
                });
            } else {
              postPayload.engineer_status = "wait_job_approve";
              updateEngineer(engineerDocumentId, "", postPayload)
                .then((data) => {
                  setStatus("wait_job_approve");
                  dispatch(
                    showSnackbar(data.data.status, "เปิดงานถอดแบบใหม่สำเร็จ")
                  );
                  setIsLoading(false);
                })
                .catch((err) => {
                  console.log(err.response.data);
                  dispatch(
                    showSnackbar(
                      "error",
                      `เปิดงานถอดแบบใหม่ไม่สำเร็จ`,
                      err.response.data.message.split(":")[1]
                    )
                  );
                  setIsLoading(false);
                });
            }
          }
          break;
        case actionType.notApprove:
          setIsLoading(true);
          if (status === "wait_job_approve") {
            postPayload.engineer_status = "job_not_approve";
            updateEngineer(engineerDocumentId, "", postPayload)
              .then((data) => {
                setStatus("job_not_approve");
                dispatch(showSnackbar(data.data.status, "ไม่อนุมัติสำเร็จ"));
                setIsLoading(false);
              })
              .catch((err) => {
                console.log(err.response.data);
                dispatch(
                  showSnackbar(
                    "error",
                    `ไม่อนุมัติไม่สำเร็จ`,
                    err.response.data.message.split(":")[1]
                  )
                );
                setIsLoading(false);
              });
          } else if (status === "job_approved") {
            postPayload.engineer_status = "queue_declined";
            updateEngineer(engineerDocumentId, "", postPayload)
              .then((data) => {
                setStatus("queue_declined");
                dispatch(showSnackbar(data.data.status, "ไม่อนุมัติสำเร็จ"));
                setIsLoading(false);
              })
              .catch((err) => {
                console.log(err.response.data);
                dispatch(
                  showSnackbar(
                    "error",
                    `ไม่อนุมัติไม่สำเร็จ`,
                    err.response.data.message.split(":")[1]
                  )
                );
                setIsLoading(false);
              });
          } else {
            postPayload.engineer_status = "work_declined";
            updateEngineer(engineerDocumentId, "", postPayload)
              .then((data) => {
                setStatus("work_declined");
                dispatch(showSnackbar(data.data.status, "ไม่อนุมัติสำเร็จ"));
                setIsLoading(false);
              })
              .catch((err) => {
                console.log(err.response.data);
                dispatch(
                  showSnackbar(
                    "error",
                    `ไม่อนุมัติไม่สำเร็จ`,
                    err.response.data.message.split(":")[1]
                  )
                );
                setIsLoading(false);
              });
          }
          break;
        case actionType.jobApproved:
          setIsLoading(true);
          postPayload.engineer_status = "job_approved";
          updateEngineer(engineerDocumentId, "job_approve", postPayload)
            .then((data) => {
              setStatus("job_approved");
              dispatch(showSnackbar(data.data.status, "อนุมัติสำเร็จ"));
              setIsLoading(false);
            })
            .catch((err) => {
              console.log(err.response.data);
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
        case actionType.queueAccepted:
          setIsLoading(true);
          postPayload.engineer_status = "queue_accepted";
          updateEngineer(engineerDocumentId, "", postPayload)
            .then((data) => {
              setStatus("queue_accepted");
              dispatch(showSnackbar(data.data.status, "อนุมัติสำเร็จ"));
              setIsLoading(false);
            })
            .catch((err) => {
              console.log(err.response.data);
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
        case actionType.assigned:
          setIsLoading(true);
          postPayload.engineer_status = "assigned";
          updateEngineer(engineerDocumentId, "", postPayload)
            .then((data) => {
              setStatus("assigned");
              dispatch(showSnackbar(data.data.status, "มอบหมายงานสำเร็จ"));
              setIsLoading(false);
            })
            .catch((err) => {
              console.log(err.response.data);
              dispatch(
                showSnackbar(
                  "error",
                  `มอบหมายงานไม่สำเร็จ`,
                  err.response.data.message.split(":")[1]
                )
              );
              setIsLoading(false);
            });
          break;
        case actionType.inProgress:
          setIsLoading(true);
          postPayload.engineer_status = "in_progress";
          updateEngineer(engineerDocumentId, "", postPayload)
            .then((data) => {
              setStatus("in_progress");
              dispatch(showSnackbar(data.data.status, "ดำเนินการต่อสำเร็จ"));
              setIsLoading(false);
            })
            .catch((err) => {
              console.log(err.response.data);
              dispatch(
                showSnackbar(
                  "error",
                  `ดำเนินการต่อไม่สำเร็จ`,
                  err.response.data.message.split(":")[1]
                )
              );
              setIsLoading(false);
            });
          break;
        case actionType.waitReview:
          setIsLoading(true);
          postPayload.engineer_status = "wait_review";
          updateEngineer(engineerDocumentId, "review_approve", postPayload)
            .then((data) => {
              setStatus("wait_review");
              dispatch(showSnackbar(data.data.status, "อนุมัติสำเร็จ"));
              setIsLoading(false);
            })
            .catch((err) => {
              console.log(err.response.data);
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
        case actionType.closed:
          setIsLoading(true);
          postPayload.engineer_status = "closed";
          updateEngineer(engineerDocumentId, "", postPayload)
            .then((data) => {
              setStatus("closed");
              dispatch(showSnackbar(data.data.status, "บันทึกสำเร็จ"));
              setIsLoading(false);
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
          break;
        case actionType.edit:
          setIsLoading(true);
          postEngineer(engineerDocumentId, postPayload)
            .then((data) => {
              dispatch(showSnackbar(data.data.status, "บันทึกสำเร็จ"));
              setIsLoading(false);
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
          break;
        default:
          break;
      }
    },
  });

  const saveDraftHandler = () => {
    formik.setFieldValue("action", actionType.saveToDraft);
  };

  const waitJobApprove = () => {
    formik.setFieldValue("action", actionType.waitJobApprove);
  };

  const jobApproved = () => {
    formik.setFieldValue("action", actionType.jobApproved);
  };

  const notApproveHandler = () => {
    formik.setFieldValue("action", actionType.notApprove);
  };

  const queueAccepted = () => {
    formik.setFieldValue("action", actionType.queueAccepted);
  };

  const assigned = () => {
    formik.setFieldValue("action", actionType.assigned);
  };

  const inProgress = () => {
    formik.setFieldValue("action", actionType.inProgress);
  };

  const waitReview = () => {
    formik.setFieldValue("action", actionType.waitReview);
  };

  const closed = () => {
    formik.setFieldValue("action", actionType.closed);
  };

  const editCancelled = () => {
    setEditButtonClick(false);
    setIsLoading(true);
    getEngineerById(engineerDocumentId)
      .then((data) => {
        if (data.data.status === "success") {
          const myData = data.data.data;
          const formatData = {
            ...myData,
            engineer_issue_date: unixToDate(engineerData.engineer_issue_date),
            engineer_start_date: unixToDate(engineerData.engineer_start_date),
            engineer_end_date: unixToDate(engineerData.engineer_end_date),
            engineer_in_date: unixToDate(engineerData.engineer_in_date),
          };
          formik.setValues(formatData);
          setStatus(formatData.engineer_status);
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

  const createQuotationHandler = () => {
    const formatPayload = {
      engineer_document_id: formik.values.engineer_document_id,
      project_info: formik.values.project_info,
      engineer_data: formik.values.engineer_data.map((data) => {
        return {
          ...data,
          category_list: data.category_list.map((category) => {
            return {
              ...category,
              item_data: category.item_data.map((item) => ({
                ...item,
                discount_list: [
                  {
                    amount: 0,
                    percent: 0,
                  },
                ],
                pre_vat_amount: 0,
                total_discount: 0,
                item_withholding_tax: {
                  tax: "ยังไม่ระบุ",
                  withholding_tax_amount: null,
                },
              })),
            };
          }),
        };
      }),
    };

    history.push("/income/quotation/add", formatPayload);
  };

  const submitCancelConfirmationHandler = () => {
    setCancelConfirmation(false);
    setIsLoading(true);
    deleteEngineer(engineerDocumentId)
      .then((data) => {
        setStatus("cancelled");
        dispatch(
          showSnackbar(data.data.status, "ยกเลิกใบถอดแบบ/ติดตั้งสำเร็จ")
        );
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(
          showSnackbar(
            "error",
            `ยกเลิกใบถอดแบบ/ติดตั้งไม่สำเร็จ`,
            err.response.data.message.split(":")[1]
          )
        );
        console.log(err.response.data);
        setIsLoading(false);
      });
  };

  console.log(formik.values);

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
        <BreadcrumbComponent name="ถอดแบบ/ติดตั้ง" to="/engineer" />
        <BreadcrumbComponent name="ใบถอดแบบ/ติดตั้ง" to="/engineer/estimate" />
        {engineerDocumentId !== "-" ? (
          <BreadcrumbComponent
            name={engineerDocumentId}
            to={"/engineer/estimate/" + engineerDocumentId}
          />
        ) : (
          <BreadcrumbComponent
            name="เพิ่มใบถอดแบบ/ติดตั้ง"
            to="/engineer/estimate/add"
          />
        )}
      </Breadcrumbs>
      <div className="engineer__heading-container">
        <h2>ใบถอดแบบ/ติดตั้ง</h2>
        {renderStatus(status)}
      </div>
      <div className="account__progressContainer">
        <EngineerProgressBarComponent
          status={status}
          isCancel={isCancel}
          isOpenQuotation={formik.values.is_open_quotation}
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
              true
                ? {
                    cursor: "not-allowed !important",
                    pointerEvents: "all !important",
                  }
                : { color: "#419644 !important" }
            }
            label="การเคลื่อนไหว"
            disabled={true}
            {...a11yProps(1)}
          />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <div className="account__buttonContainer">
          <EngineerSplitButtonComponent
            disabled={disabled.options}
            disabledCancelButton={disabled.cancelButton}
            disabledEditButton={disabled.editButton}
            defaultButtonValue="ตัวเลือก"
            options={["ยกเลิก", "แก้ไข"]}
            handleMenuItemClick={optionItemsHandler}
            open={openOption}
            anchorEl={anchorOptionEl}
            handleOpen={handleOpenOptionMenu}
            handleClose={handleCloseOptionMenu}
            variant="outlined"
          />
          {status === "closed" && (
            <Button variant="contained" onClick={createQuotationHandler}>
              สร้างใบเสนอราคา
            </Button>
          )}
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="account__formHeader-secondary">
            <h4>เลขที่เอกสาร {engineerDocumentId}</h4>
            <div className="account__formHeader-datetime">
              <EngineerDateComponent
                disabled={disabled.issueDate}
                name="engineer_issue_date"
                label="วันที่ออกเอกสาร"
                value={formik.values.engineer_issue_date}
                dateChangeHandler={handleStartDateChange}
              />
              <EngineerDateComponent
                disabled={disabled.startDate}
                name="engineer_start_date"
                label="วันที่จะเริ่มทำงาน"
                value={formik.values.engineer_start_date}
                dateChangeHandler={handleEndDateChange}
              />
              {(status === "queue_accepted" ||
                status === "assigned" ||
                status === "in_progress" ||
                status === "wait_review" ||
                status === "closed" ||
                status === "is_open_quotation") && (
                <EngineerDateComponent
                  disabled={disabled.sendDate}
                  name="engineer_end_date"
                  label="วันที่กำหนดส่ง"
                  value={formik.values.engineer_end_date}
                  dateChangeHandler={handleSendDateChange}
                />
              )}
              {(editButtonClick ||
                status === "job_not_approve" ||
                status === "queue_declined" ||
                status === "work_declined") && (
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
          <InformationAccordion formik={formik} disabled={disabled.form} />
          <InstallationAccordion formik={formik} disabled={disabled.form} />
          <EngineerProjectComponent
            formik={formik}
            disabled={disabled.form}
            projects={projects}
            contacts={contacts}
            projectId={formik.values.project_info.project_id}
            contactId={formik.values.project_info.contact_id}
          />
          <DocumentAccordion
            formik={formik}
            setIsLoading={setIsLoading}
            disabled={disabled.inputDocument}
            label="เอกสารเปิดงาน"
            name="input_attachments"
          />
          {(status === "assigned" ||
            status === "in_progress" ||
            status === "wait_review" ||
            status === "closed") && (
            <DocumentAccordion
              formik={formik}
              setIsLoading={setIsLoading}
              disabled={disabled.deliverDocument}
              label="เอกสารส่งกลับ"
              name="deliver_attachments"
            />
          )}
          {(status === "queue_accepted" ||
            status === "assigned" ||
            status === "in_progress" ||
            status === "wait_review" ||
            status === "closed" ||
            status === "is_open_quotation") && (
            <EngineerStaffComponent
              formik={formik}
              disabled={disabled.staff}
              error={formik.errors.engineer_list}
            />
          )}
          <EngineerTableDataComponent
            data={formik.values.engineer_data}
            formik={formik}
            name="engineer_data"
            error={formik.errors.engineer_data}
            status={status}
          />
          <EngineerRemarkComponent
            disabled={disabled.remark}
            formik={formik}
            name="engineer_remark"
            remark={formik.values.engineer_remark}
            status={status}
            setIsLoading={setIsLoading}
          />
          <Box
            sx={{
              mt: 3,
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
                  onClick={waitJobApprove}
                >
                  ดำเนินการต่อ
                </Button>
              </>
            )}
            {status === "wait_job_approve" &&
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
                  <Button
                    type="submit"
                    variant="contained"
                    onClick={notApproveHandler}
                  >
                    ไม่อนุมัติ
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    onClick={jobApproved}
                  >
                    อนุมัติ
                  </Button>
                </>
              ))}
            {status === "job_not_approve" && (
              <Button
                type="submit"
                variant="contained"
                onClick={waitJobApprove}
              >
                อนุมัติ
              </Button>
            )}
            {status === "queue_declined" && (
              <Button type="submit" variant="contained" onClick={jobApproved}>
                อนุมัติ
              </Button>
            )}
            {status === "job_approved" &&
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
                  <Button
                    type="submit"
                    variant="contained"
                    onClick={notApproveHandler}
                  >
                    ไม่อนุมัติ
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    onClick={queueAccepted}
                  >
                    อนุมัติ
                  </Button>
                </>
              ))}
            {status === "queue_accepted" &&
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
                <Button type="submit" variant="contained" onClick={assigned}>
                  ดำเนินการต่อ
                </Button>
              ))}
            {status === "assigned" &&
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
                <Button type="submit" variant="contained" onClick={inProgress}>
                  ดำเนินการต่อ
                </Button>
              ))}
            {status === "in_progress" &&
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
                  <Button
                    type="submit"
                    variant="contained"
                    onClick={notApproveHandler}
                  >
                    ไม่อนุมัติ
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    onClick={waitReview}
                  >
                    อนุมัติ
                  </Button>
                </>
              ))}
            {status === "wait_review" &&
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
                  <Button type="submit" variant="contained" onClick={closed}>
                    บันทึก
                  </Button>
                </>
              ))}
            {cancelConfirmation && (
              <AccountConfirmationComponent
                open={cancelConfirmation}
                handleClose={closeCancelConfirmationHandler}
                handleSubmit={submitCancelConfirmationHandler}
                title="ยืนยันการยกเลิกใบถอดแบบ/ติดตั้ง"
                description="หากยกเลิกแล้วจะไม่สามารถเปลี่ยนแปลงรายการได้"
              />
            )}
          </Box>
        </form>
      </TabPanel>
    </>
  );
};

export default AddEngineerComponent;
