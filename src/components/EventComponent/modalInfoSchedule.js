import React, { useEffect, useState } from "react";
import ButtonComponent from "../ButtonComponent";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { Backdrop, CircularProgress, Divider, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import SegmentIcon from "@mui/icons-material/Segment";
import { Link } from "react-router-dom";
import {
  updateCheckInStart,
  updateCheckInDest,
  updateEvent,
  getEventById,
  cancelEvent,
  finishEvent,
  getProjectById,
  getContactById,
  getContactOption,
} from "../../adapter/Api";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import * as Yup from "yup";
import { Formik, Form } from "formik";

import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/actions/snackbarActions";

import moment from "moment";
import "moment-timezone";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";

import { Autocomplete } from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";

const event_stage = [
  {
    name: "ไม่ระบุ",
    value: "",
  },
  {
    name: "ลูกค้าเก่า",
    value: "ลูกค้าเก่า",
  },
  {
    name: "ลูกค้าใหม่",
    value: "ลูกค้าใหม่",
  },
  {
    name: "ลูกค้าโยน",
    value: "ลูกค้าโยน",
  },
];

const event_status = [
  {
    name: "วางแผน",
    value: "planned",
  },
  {
    name: "นัดหมาย",
    value: "scheduled",
  },
];

export default function ModalInfoSchedule({
  open,
  setOpen,
  data,
  reload,
  setReload,
  project,
  contact,
  setProject,
  setContact,
  optionProjects,
  optionContacts,
  optionPersons,
  setOptionContacts,
  setOptionPersons,
  isLoading,
  setIsLoading,
  setFilteredEvent,
  setSelectedEvent,
}) {
  const dispatch = useDispatch();
  const [selectedProject, setSelectedProject] = useState({
    name: "ไม่ระบุ",
    value: "",
  });
  const [selectedProjectStage, setSelectedProjectStage] = useState({
    name: "ไม่ระบุ",
    value: "",
  });
  const [selectedContact, setSelectedContact] = useState({
    name: "ไม่ระบุ",
    value: "",
  });
  const [selectedPerson, setSelectedPerson] = useState({
    name: "ไม่ระบุ",
    value: "",
  });
  const [myReload, setMyReload] = useState(false);
  const [myLoading, setMyLoading] = useState(false);
  const [myValue, setMyValue] = useState({
    contact_id: "",
    event_dest_google_map_link: "",
    event_dest_location_name: "",
    event_project_stage: "",
    event_remark: "",
    event_status: "",
    event_plan_start_date: "",
    event_plan_end_date: "",
    event_schedule_start_date: "",
    event_schedule_end_date: "",
    event_checkin_start_date: "",
    event_checkin_dest_date: "",
    event_topic: "",
    event_id: "",
    person_id: "",
    project_id: "",
    event_checkin_start_location_name: "",
    event_checkin_start_latitude: "",
    event_checkin_start_longitude: "",
    event_checkin_dest_location_name: "",
    event_checkin_dest_latitude: "",
    event_checkin_dest_longitude: "",
    event_distance_value: "",
    event_distance_text: "",
    event_duration_value: "",
    event_duration_text: "",
    _event_created: "",
    _event_createdby: "",
    _event_lastupdate: "",
  });

  const [showScheduled, setShowScheduled] = useState(false);

  useEffect(() => {
    if (data.event_id) {
      setIsLoading(true);
      getEventById(data.event_id)
        .then((data) => {
          if (data.data.status === "success") {
            const selectedEvent = data.data.data;
            if (selectedEvent.contact_id)
              setSelectedContact({
                name:
                  selectedEvent.contact.contact_commercial_name ||
                  selectedEvent.contact.contact_individual_first_name ||
                  selectedEvent.contact.contact_merchant_name,
                value: selectedEvent.contact_id.toString(),
              });
            if (selectedEvent.project_id)
              setSelectedProject({
                name: selectedEvent.project.project_name,
                value: selectedEvent.project_id.toString(),
              });
            if (selectedEvent.person_id)
              setSelectedPerson({
                name:
                  selectedEvent.person.person_first_name +
                  " " +
                  selectedEvent.person.person_last_name,
                value: selectedEvent.person_id.toString(),
              });
            setSelectedProjectStage({
              name: selectedEvent.event_project_stage,
              value: selectedEvent.event_project_stage,
            });
            setMyValue({
              contact_id: selectedEvent.contact_id || "",
              event_dest_google_map_link:
                selectedEvent.event_dest_google_map_link || "",
              event_dest_location_name:
                selectedEvent.event_dest_location_name || "",
              event_project_stage: selectedEvent.event_project_stage || "",
              event_remark: selectedEvent.event_remark || "",
              event_status: selectedEvent.event_status || "",
              event_plan_start_date: selectedEvent.event_plan_start_date
                ? new Date(
                    moment(selectedEvent.event_plan_start_date, "X").tz(
                      "Asia/Bangkok"
                    )
                  )
                : "",
              event_plan_end_date: selectedEvent.event_plan_end_date
                ? new Date(
                    moment(selectedEvent.event_plan_end_date, "X").tz(
                      "Asia/Bangkok"
                    )
                  )
                : "",
              event_schedule_start_date: selectedEvent.event_schedule_start_date
                ? new Date(
                    moment(selectedEvent.event_schedule_start_date, "X").tz(
                      "Asia/Bangkok"
                    )
                  )
                : "",
              event_schedule_end_date: selectedEvent.event_schedule_end_date
                ? new Date(
                    moment(selectedEvent.event_schedule_end_date, "X").tz(
                      "Asia/Bangkok"
                    )
                  )
                : "",
              event_checkin_start_date: selectedEvent.event_checkin_start_date
                ? new Date(
                    moment(selectedEvent.event_checkin_start_date, "X").tz(
                      "Asia/Bangkok"
                    )
                  )
                : "",
              event_checkin_dest_date: selectedEvent.event_checkin_dest_date
                ? new Date(
                    moment(selectedEvent.event_checkin_dest_date, "X").tz(
                      "Asia/Bangkok"
                    )
                  )
                : "",
              event_topic: selectedEvent.event_topic || "",
              event_id: selectedEvent.event_id || "",
              person_id: selectedEvent.person_id || "",
              project_id: selectedEvent.project_id || "",
              event_checkin_start_location_name:
                selectedEvent.event_checkin_start_location_name || "",
              event_checkin_start_latitude:
                selectedEvent.event_checkin_start_latitude || "",
              event_checkin_start_longitude:
                selectedEvent.event_checkin_start_longitude || "",
              event_checkin_dest_location_name:
                selectedEvent.event_checkin_dest_location_name || "",
              event_checkin_dest_latitude:
                selectedEvent.event_checkin_dest_latitude || "",
              event_checkin_dest_longitude:
                selectedEvent.event_checkin_dest_longitude || "",
              event_distance_value: selectedEvent.event_distance_value || "",
              event_distance_text: selectedEvent.event_distance_text || "",
              event_duration_value: selectedEvent.event_duration_value || "",
              event_duration_text: selectedEvent.event_duration_text || "",
              _event_created: selectedEvent._event_created || "",
              _event_createdby: selectedEvent._event_createdby || "",
              _event_lastupdate: selectedEvent._event_lastupdate || "",
              employee_firstname:
                selectedEvent.event_employee.employee_firstname || "",
              employee_lastname:
                selectedEvent.event_employee.employee_lastname || "",
            });
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          dispatch(
            showSnackbar(
              "error",
              (err.response &&
                err.response.data.message &&
                err.response.data.message) ||
                "เกิดข้อผิดพลาด"
            )
          );
        });
    }
  }, [
    data.event_id,
    dispatch,
    setIsLoading,
    setSelectedContact,
    setSelectedPerson,
    setSelectedProject,
  ]);

  const handleClose = (resetForm) => {
    setOpen(false);
    setSelectedEvent({});
    setSelectedProject({
      name: "ไม่ระบุ",
      value: "",
    });
    setSelectedContact({
      name: "ไม่ระบุ",
      value: "",
    });
    setSelectedPerson({
      name: "ไม่ระบุ",
      value: "",
    });
    setSelectedProjectStage({
      name: "ไม่ระบุ",
      value: "",
    });
    resetForm();
  };

  const handleCancel = (values, setSubmitting, resetForm) => {
    let payload = {
      contact_id: values.contact_id,
      person_id: values.person_id,
      project_id: values.project_id,
      event_dest_google_map_link: values.event_dest_google_map_link,
      event_dest_location_name: values.event_dest_location_name,
      event_project_stage: values.event_project_stage,
      event_remark: values.event_remark,
      event_schedule_start_date: moment(
        values.event_schedule_start_date
      ).unix(),
      event_schedule_end_date: moment(values.event_schedule_end_date).unix(),
      event_plan_start_date: moment(values.event_plan_start_date).unix(),
      event_plan_end_date: moment(values.event_plan_end_date).unix(),
      event_topic: values.event_topic,
    };

    setSubmitting(true);
    setIsLoading(true);
    cancelEvent(payload, myValue.event_id)
      .then((data) => {
        if (data.data.status === "success") {
          setMyValue((prev) => ({
            ...prev,
            ...values,
            event_status: "cancelled",
          }));
          setFilteredEvent((prev) => {
            const index = prev.findIndex(
              (event) => event.event_id === myValue.event_id
            );
            prev[index].event_status = "cancelled";
            return [...prev];
          });
          dispatch(showSnackbar("success", "บันทึกข้อมูลสำเร็จ"));
        }
        setSubmitting(false);
        setIsLoading(false);
        setReload(!reload);
        setMyReload(!myReload);
        handleClose(resetForm);
      })
      .catch((err) => {
        console.log(err.response);
        dispatch(
          showSnackbar(
            "error",
            (err.response.data.message && err.response.data.message) ||
              "เกิดข้อผิดพลาด"
          )
        );
        setSubmitting(false);
        setIsLoading(false);
        setReload(!reload);
        setMyReload(!myReload);
        handleClose(resetForm);
      });
    console.log("cancelled event", myValue.event_id);
  };

  const handleFinish = (values, setSubmitting, resetForm) => {
    let payload = {
      contact_id: values.contact_id,
      person_id: values.person_id,
      project_id: values.project_id,
      event_dest_google_map_link: values.event_dest_google_map_link,
      event_dest_location_name: values.event_dest_location_name,
      event_project_stage: values.event_project_stage,
      event_remark: values.event_remark,
      event_schedule_start_date: moment(
        values.event_schedule_start_date
      ).unix(),
      event_schedule_end_date: moment(values.event_schedule_end_date).unix(),
      event_plan_start_date: moment(values.event_plan_start_date).unix(),
      event_plan_end_date: moment(values.event_plan_end_date).unix(),
      event_topic: values.event_topic,
    };

    setSubmitting(true);
    setIsLoading(true);
    finishEvent(payload, myValue.event_id)
      .then((data) => {
        if (data.data.status === "success") {
          setMyValue((prev) => ({
            ...prev,
            ...values,
            event_status: "finished",
          }));
          setFilteredEvent((prev) => {
            const index = prev.findIndex(
              (event) => event.event_id === myValue.event_id
            );
            prev[index].event_status = "finished";
            return [...prev];
          });
          dispatch(showSnackbar("success", "บันทึกข้อมูลสำเร็จ"));
        }
        setSubmitting(false);
        setIsLoading(false);
        setReload(!reload);
        setMyReload(!myReload);
        handleClose(resetForm);
      })
      .catch((err) => {
        console.log(err.response);
        dispatch(
          showSnackbar(
            "error",
            (err.response.data.message && err.response.data.message) ||
              "เกิดข้อผิดพลาด"
          )
        );
        setSubmitting(false);
        setIsLoading(false);
        setReload(!reload);
        setMyReload(!myReload);
        handleClose(resetForm);
      });
    setSubmitting(false);
    console.log("finish event", myValue.event_id);
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (contact && contact.person_list) {
      const formatPersonOptions = contact.person_list.map((person) => ({
        name: person.person_first_name + " " + person.person_last_name,
        value: person.person_id,
      }));
      setOptionPersons([
        { name: "ไม่ระบุ", value: "" },
        ...formatPersonOptions,
      ]);
    } else {
      setOptionPersons([{ name: "ไม่ระบุ", value: "" }]);
    }
  }, [contact, setOptionPersons]);

  useEffect(() => {
    if (project && project.project_contact_list) {
      const contact_list = project.project_contact_list.filter(
        (contact) => contact.contact_status !== "delete"
      );
      if (contact_list && contact_list.length > 0) {
        setOptionContacts(
          [{ name: "ไม่ระบุ", value: "" }].concat(
            contact_list.map((contact) => ({
              name:
                contact.contact_commercial_name ||
                contact.contact_individual_first_name ||
                contact.contact_merchant_name,
              value: contact.contact_id,
            }))
          )
        );
      } else {
        setOptionContacts([{ name: "ไม่ระบุ", value: "" }]);
      }
    }
  }, [contact, project, setOptionContacts]);

  const filter = createFilterOptions();

  const checkInStart = (setSubmitting) => {
    setSubmitting(true);
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log(position);
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
      updateCheckInStart(
        myValue.event_id,
        position.coords.latitude,
        position.coords.longitude
      )
        .then((data) => {
          if (data.data.status === "success") {
            console.log("success", data.data);
            dispatch(showSnackbar("success", "บันทึกข้อมูลสำเร็จ"));
          }
          setSubmitting(false);
          setReload(!reload);
          setMyReload(!myReload);
          setMyValue((prev) => {
            return {
              ...prev,
              event_checkin_start_location_name:
                data.data.data.event_checkin_start_location_name,
              event_checkin_start_latitude: position.coords.latitude,
              event_checkin_start_longitude: position.coords.longitude,
            };
          });
          return;
        })
        .catch((err) => {
          console.log(err);
          dispatch(
            showSnackbar(
              "error",
              (err.response.data.message && err.response.data.message) ||
                "เกิดข้อผิดพลาด"
            )
          );
          setSubmitting(false);
          setReload(!reload);
          setMyReload(!myReload);
          return;
        });
    });
  };

  const checkInDest = (setSubmitting) => {
    setSubmitting(true);
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log("Check-in dest");
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
      updateCheckInDest(
        myValue.event_id,
        position.coords.latitude,
        position.coords.longitude
      )
        .then((data) => {
          console.log(data);
          if (data.data.status === "success") {
            console.log("success", data.data);
            dispatch(showSnackbar("success", "บันทึกข้อมูลสำเร็จ"));
          }
          setSubmitting(false);
          setReload(!reload);
          setMyReload(!myReload);
          setMyValue((prev) => {
            return {
              ...prev,
              event_checkin_dest_location_name:
                data.data.data.event_checkin_dest_location_name,
              event_checkin_dest_latitude: position.coords.latitude,
              event_checkin_dest_longitude: position.coords.longitude,
            };
          });
          return;
        })
        .catch((err) => {
          console.log(err);
          dispatch(
            showSnackbar(
              "error",
              (err.response.data.message && err.response.data.message) ||
                "เกิดข้อผิดพลาด"
            )
          );
          setSubmitting(false);
          setReload(!reload);
          setMyReload(!myReload);
          // console.log("RELOAD B");
          return;
        });
    });
  };

  const eventSchema = Yup.object().shape({
    event_topic: Yup.string().required("กรุณากรอก"),
    event_status: Yup.string().required("กรุณากรอก"),
    // event_project_stage: Yup.string().required("กรุณากรอก"),
    event_dest_location_name: Yup.string().required("กรุณากรอก"),
    // contact_id: Yup.string().required("กรุณากรอก"),
    contact_id: Yup.string().when("project_id", {
      is: (value) => !value && optionContacts.length > 1,
      then: Yup.string().required("กรุณากรอก"),
    }),
    event_plan_start_date: Yup.string().when("event_status", {
      is: (value) => value === "planned",
      then: Yup.string().required("กรุณากรอก"),
    }),
    event_plan_end_date: Yup.string().when("event_status", {
      is: (value) => value === "planned",
      then: Yup.string().required("กรุณากรอก"),
    }),
    event_schedule_start_date: Yup.string().when("event_status", {
      is: (value) => value === "scheduled",
      then: Yup.string().required("กรุณากรอก"),
    }),
    event_schedule_end_date: Yup.string().when("event_status", {
      is: (value) => value === "scheduled",
      then: Yup.string().required("กรุณากรอก"),
    }),
  });

  return (
    <>
      {myLoading && (
        <Backdrop sx={{ color: "#fff", zIndex: 999999 }} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {!isLoading && (
        <Formik
          enableReinitialize
          initialValues={myValue}
          validationSchema={eventSchema}
          validateOnChange={true}
          validateOnBlur={true}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            let payload = {
              contact_id: values.contact_id,
              person_id: values.person_id,
              project_id: values.project_id,
              event_dest_google_map_link: values.event_dest_google_map_link,
              event_dest_location_name: values.event_dest_location_name,
              event_project_stage: values.event_project_stage,
              event_remark: values.event_remark,
              event_schedule_start_date: moment(
                values.event_schedule_start_date
              ).unix(),
              event_schedule_end_date: moment(
                values.event_schedule_end_date
              ).unix(),
              event_plan_start_date: moment(
                values.event_plan_start_date
              ).unix(),
              event_plan_end_date: moment(values.event_plan_end_date).unix(),
              event_topic: values.event_topic,
            };
            setSubmitting(true);
            updateEvent(payload, myValue.event_id)
              .then((data) => {
                if (data.data.status === "success") {
                  console.log("success", data.data);
                  dispatch(showSnackbar("success", "บันทึกข้อมูลสำเร็จ"));
                }
                setSubmitting(false);
                setReload(!reload);
                handleClose(resetForm);
              })
              .catch((err) => {
                dispatch(
                  showSnackbar(
                    "error",
                    (err.response.data.message && err.response.data.message) ||
                      "เกิดข้อผิดพลาด"
                  )
                );
                setSubmitting(false);
                setReload(!reload);
                handleClose(resetForm);
              });
            setSubmitting(false);
            return;
          }}
        >
          {({
            values,
            errors,
            touched,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
            setErrors,
            setSubmitting,
            setFieldValue,
            resetForm,
          }) => (
            <Dialog
              open={open}
              onClose={() => handleClose(resetForm)}
              fullScreen={fullScreen}
            >
              <DialogTitle>
                <h2
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  แผนการทำงาน
                  <IconButton
                    type="button"
                    onClick={() => handleClose(resetForm)}
                  >
                    <CloseIcon />
                  </IconButton>
                </h2>
              </DialogTitle>

              <DialogContent>
                <DialogContentText>
                  <Form
                    method="POST"
                    onSubmit={handleSubmit}
                    className={"inputGroup"}
                    autoComplete="off"
                  >
                    <div>
                      <div>
                        <div>
                          <div className="grid-container-50">
                            <h2 className="myColor">{values.event_topic}</h2>
                            <FormControl
                              fullWidth
                              size="small"
                              style={{ display: "none" }}
                              error={
                                errors.event_status &&
                                touched.event_status &&
                                errors.event_status
                              }
                            >
                              <InputLabel>สถานะ</InputLabel>
                              <Select
                                onChange={(e) => {
                                  handleChange(e);

                                  //   setLoginError();
                                }}
                                onBlur={handleBlur}
                                type="text"
                                disabled={true}
                                name="event_status"
                                id="demo-simple-select-error"
                                value={values.event_status || ""}
                                label="สถานะ"
                              >
                                {event_status.map((data, index) => (
                                  <MenuItem key={index} value={data.value}>
                                    {data.name}
                                  </MenuItem>
                                ))}
                              </Select>
                              <FormHelperText>
                                {errors.event_status &&
                                  touched.event_status &&
                                  errors.event_status}
                              </FormHelperText>
                            </FormControl>
                            <div style={{ textAlign: "right" }}>
                              {values.event_status &&
                                values.event_status === "planned" && (
                                  <Chip
                                    label="วางแผน"
                                    color="primary"
                                    variant="outlined"
                                  />
                                )}
                              {values.event_status &&
                                values.event_status === "scheduled" && (
                                  <Chip
                                    label="นัดหมาย"
                                    color="secondary"
                                    variant="outlined"
                                  />
                                )}
                              {values.event_status &&
                                values.event_status === "checkin" && (
                                  <Chip
                                    label="เช็คอิน"
                                    color="warning"
                                    variant="outlined"
                                  />
                                )}
                              {values.event_status &&
                                values.event_status === "cancelled" && (
                                  <Chip
                                    label="ยกเลิก"
                                    color="error"
                                    variant="outlined"
                                  />
                                )}
                              {values.event_status &&
                                values.event_status === "finished" && (
                                  <Chip
                                    label="เสร็จสิ้น"
                                    color="success"
                                    variant="outlined"
                                  />
                                )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="form-heading">
                            <Stack direction="row" spacing={1}>
                              <AccessTimeIcon />
                              <div>วันที่และเวลา</div>
                            </Stack>
                          </div>

                          {values.event_plan_start_date &&
                            values.event_plan_end_date && (
                              <div className="grid-container-50-50">
                                <div>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDateFns}
                                  >
                                    <DateTimePicker
                                      label="วันที่เริ่ม (วางแผน)"
                                      disabled={true}
                                      value={values.event_plan_start_date}
                                      onChange={(e) => {
                                        setFieldValue(
                                          "event_plan_start_date",
                                          e
                                        );
                                      }}
                                      ampm={false}
                                      inputFormat="dd/MM/yyyy HH:mm"
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          name="event_plan_start_date"
                                        />
                                      )}
                                    />
                                  </LocalizationProvider>
                                </div>
                                <div>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDateFns}
                                  >
                                    <DateTimePicker
                                      label="วันที่สิ้นสุด (วางแผน)"
                                      disabled={true}
                                      value={values.event_plan_end_date}
                                      onChange={(e) => {
                                        setFieldValue("event_plan_end_date", e);
                                      }}
                                      ampm={false}
                                      inputFormat="dd/MM/yyyy HH:mm"
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          name="event_plan_end_date"
                                        />
                                      )}
                                    />
                                  </LocalizationProvider>
                                </div>
                              </div>
                            )}

                          {values.event_status === "planned"
                            ? showScheduled && (
                                <div className="grid-container-50-50">
                                  <div>
                                    <LocalizationProvider
                                      dateAdapter={AdapterDateFns}
                                    >
                                      <DateTimePicker
                                        label="วันที่เริ่ม (นัดหมาย)"
                                        disabled={
                                          values.event_status === "scheduled" ||
                                          values.event_status === "checkin" ||
                                          values.event_status === "cancelled" ||
                                          values.event_status === "finished"
                                        }
                                        value={values.event_schedule_start_date}
                                        onChange={(e) => {
                                          setFieldValue(
                                            "event_schedule_start_date",
                                            e
                                          );
                                          setFieldValue(
                                            "event_schedule_end_date",
                                            moment(e).add(2, "hour")
                                          );
                                        }}
                                        ampm={false}
                                        inputFormat="dd/MM/yyyy HH:mm"
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            name="event_schedule_start_date"
                                          />
                                        )}
                                      />
                                    </LocalizationProvider>
                                  </div>
                                  <div>
                                    <LocalizationProvider
                                      dateAdapter={AdapterDateFns}
                                    >
                                      <DateTimePicker
                                        minDate={
                                          values.event_schedule_start_date
                                        }
                                        label="วันที่สิ้นสุด (นัดหมาย)"
                                        disabled={
                                          values.event_status === "scheduled" ||
                                          values.event_status === "checkin" ||
                                          values.event_status === "cancelled" ||
                                          values.event_status === "finished"
                                        }
                                        value={values.event_schedule_end_date}
                                        onChange={(e) => {
                                          if (
                                            e > values.event_schedule_start_date
                                          )
                                            setFieldValue(
                                              "event_schedule_end_date",
                                              e
                                            );
                                        }}
                                        ampm={false}
                                        inputFormat="dd/MM/yyyy HH:mm"
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            name="event_schedule_end_date"
                                          />
                                        )}
                                      />
                                    </LocalizationProvider>
                                  </div>
                                </div>
                              )
                            : values.event_schedule_end_date && (
                                <div className="grid-container-50-50">
                                  <div>
                                    <LocalizationProvider
                                      dateAdapter={AdapterDateFns}
                                    >
                                      <DateTimePicker
                                        label="วันที่เริ่ม (นัดหมาย)"
                                        disabled={
                                          values.event_status === "scheduled" ||
                                          values.event_status === "checkin" ||
                                          values.event_status === "cancelled" ||
                                          values.event_status === "finished"
                                        }
                                        value={values.event_schedule_start_date}
                                        onChange={(e) => {
                                          setFieldValue(
                                            "event_schedule_start_date",
                                            e
                                          );
                                          setFieldValue(
                                            "event_schedule_end_date",
                                            moment(e).add(2, "hour")
                                          );
                                        }}
                                        ampm={false}
                                        inputFormat="dd/MM/yyyy HH:mm"
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            name="event_schedule_start_date"
                                          />
                                        )}
                                      />
                                    </LocalizationProvider>
                                  </div>
                                  <div>
                                    <LocalizationProvider
                                      dateAdapter={AdapterDateFns}
                                    >
                                      <DateTimePicker
                                        minDate={
                                          values.event_schedule_start_date
                                        }
                                        label="วันที่สิ้นสุด (นัดหมาย)"
                                        disabled={
                                          values.event_status === "scheduled" ||
                                          values.event_status === "checkin" ||
                                          values.event_status === "cancelled" ||
                                          values.event_status === "finished"
                                        }
                                        value={values.event_schedule_end_date}
                                        onChange={(e) => {
                                          if (
                                            e > values.event_schedule_start_date
                                          )
                                            setFieldValue(
                                              "event_schedule_end_date",
                                              e
                                            );
                                        }}
                                        ampm={false}
                                        inputFormat="dd/MM/yyyy HH:mm"
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            name="event_schedule_end_date"
                                          />
                                        )}
                                      />
                                    </LocalizationProvider>
                                  </div>
                                </div>
                              )}

                          {values.event_status &&
                            values.event_status === "planned" && (
                              <div>
                                <Button
                                  className="myColor"
                                  variant="outlined"
                                  onClick={() => {
                                    setShowScheduled(!showScheduled);
                                    setFieldValue(
                                      "event_schedule_start_date",
                                      ""
                                    );
                                  }}
                                >
                                  {showScheduled ? "ซ่อน" : "นัดหมาย"}
                                </Button>
                              </div>
                            )}
                          <div className="grid-container-50-50">
                            {values.event_checkin_start_date && (
                              <div>
                                <LocalizationProvider
                                  dateAdapter={AdapterDateFns}
                                >
                                  <DateTimePicker
                                    label="วันที่เริ่ม (เช็คอิน)"
                                    disabled={true}
                                    value={values.event_checkin_start_date}
                                    onChange={(e) => {
                                      setFieldValue(
                                        "event_checkin_start_date",
                                        e
                                      );
                                      setFieldValue(
                                        "event_checkin_dest_date",
                                        moment(e).add(2, "hour")
                                      );
                                    }}
                                    ampm={false}
                                    inputFormat="dd/MM/yyyy HH:mm"
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        name="event_checkin_start_date"
                                      />
                                    )}
                                  />
                                </LocalizationProvider>
                              </div>
                            )}
                            {values.event_checkin_dest_date && (
                              <div>
                                <LocalizationProvider
                                  dateAdapter={AdapterDateFns}
                                >
                                  <DateTimePicker
                                    minDate={values.event_checkin_start_date}
                                    label="วันที่สิ้นสุด (เช็คอิน)"
                                    value={values.event_checkin_start_date}
                                    disabled={true}
                                    onChange={(e) => {
                                      if (e > values.event_schedule_start_date)
                                        setFieldValue(
                                          "event_checkin_dest_date",
                                          e
                                        );
                                    }}
                                    ampm={false}
                                    inputFormat="dd/MM/yyyy HH:mm"
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        name="event_checkin_dest_date"
                                      />
                                    )}
                                  />
                                </LocalizationProvider>
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="form-heading">
                            <Stack direction="row" spacing={1}>
                              <PeopleAltIcon />
                              <div>รายละเอียดโครงการ</div>
                            </Stack>
                          </div>
                          <div className="grid-container-50">
                            <FormControl
                              fullWidth
                              size="small"
                              error={
                                errors.project_id &&
                                touched.project_id &&
                                errors.project_id
                              }
                            >
                              <Autocomplete
                                disablePortal
                                onBlur={handleBlur}
                                id="combo-box-demo"
                                options={optionProjects}
                                getOptionLabel={(option) => option.name}
                                onChange={async (_, value) => {
                                  if (value !== null && value.value) {
                                    setMyLoading(true);
                                    setSelectedProject({
                                      name: value.name,
                                      value: value.value.toString(),
                                    });
                                    setFieldValue("project_id", value.value);
                                    setFieldValue("contact_id", "");
                                    setFieldValue("person_id", "");
                                    setSelectedContact({
                                      name: "ไม่ระบุ",
                                      value: "",
                                    });
                                    setSelectedPerson({
                                      name: "ไม่ระบุ",
                                      value: "",
                                    });
                                    const {
                                      data: { data, status },
                                    } = await getProjectById(value.value);
                                    if (status === "success") {
                                      setProject(data);
                                      setMyLoading(false);
                                    }
                                  } else {
                                    setMyLoading(true);
                                    if (
                                      value !== null &&
                                      value.name === "ไม่ระบุ"
                                    ) {
                                      setSelectedProject({
                                        name: "ไม่ระบุ",
                                        value: "",
                                      });
                                    } else {
                                      setSelectedProject(null);
                                    }
                                    setProject(null);
                                    setSelectedContact({
                                      name: "ไม่ระบุ",
                                      value: "",
                                    });
                                    setSelectedPerson({
                                      name: "ไม่ระบุ",
                                      value: "",
                                    });
                                    const {
                                      data: {
                                        data: contactData,
                                        status: contactStatus,
                                      },
                                    } = await getContactOption(["person_list"]);
                                    const formatContactOptions =
                                      await contactData.map((contact) => ({
                                        name:
                                          contact.contact_commercial_name ||
                                          contact.contact_individual_first_name ||
                                          contact.contact_merchant_name,
                                        value: contact.contact_id,
                                      }));
                                    if (contactStatus === "success") {
                                      setMyLoading(false);
                                      setOptionContacts([
                                        {
                                          name: "ไม่ระบุ",
                                          value: "",
                                        },
                                        ...formatContactOptions,
                                      ]);
                                    }
                                    setOptionPersons([
                                      {
                                        name: "ไม่ระบุ",
                                        value: "",
                                      },
                                    ]);
                                    setFieldValue("project_id", "");
                                    setFieldValue("contact_id", "");
                                    setFieldValue("person_id", "");
                                  }
                                }}
                                value={selectedProject}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="โครงการ"
                                    error={
                                      errors.project_id &&
                                      touched.project_id &&
                                      errors.project_id
                                    }
                                  />
                                )}
                                renderOption={(props, option) => (
                                  <li {...props} key={option.value}>
                                    {option.name}
                                  </li>
                                )}
                                isOptionEqualToValue={(option, value) => {
                                  return (
                                    option.value.toString() === value.value
                                  );
                                }}
                                disabled={
                                  values.event_status === "cancelled" ||
                                  values.event_status === "finished"
                                }
                              />
                              <FormHelperText>
                                {errors.project_id &&
                                  touched.project_id &&
                                  errors.project_id}
                              </FormHelperText>
                              {values.project_id && (
                                <span>
                                  <Link
                                    to={`/sales/project/${values.project_id}`}
                                    className="myColor"
                                    target="_blank"
                                  >
                                    <Button variant="outlined">ดูข้อมูล</Button>
                                  </Link>
                                </span>
                              )}
                            </FormControl>
                            <FormControl
                              fullWidth
                              size="small"
                              error={
                                errors.event_project_stage &&
                                touched.event_project_stage &&
                                errors.event_project_stage
                              }
                            >
                              <Autocomplete
                                value={selectedProjectStage}
                                onChange={(_, newValue) => {
                                  if (newValue !== null && newValue.value) {
                                    setSelectedProjectStage({
                                      name: newValue.name,
                                      value: newValue.value,
                                    });
                                    setFieldValue(
                                      "event_project_stage",
                                      newValue.value
                                    );
                                  } else {
                                    if (
                                      newValue !== null &&
                                      newValue.name === "ไม่ระบุ"
                                    ) {
                                      setSelectedProjectStage({
                                        name: "ไม่ระบุ",
                                        value: "",
                                      });
                                    } else {
                                      setSelectedProjectStage(null);
                                    }
                                    setFieldValue("event_project_stage", "");
                                  }
                                }}
                                filterOptions={(options, params) => {
                                  const filtered = filter(options, params);
                                  const { inputValue } = params;
                                  // Suggest the creation of a new value
                                  const isExisting = options.some(
                                    (option) => inputValue === option.name
                                  );
                                  if (inputValue !== "" && !isExisting) {
                                    filtered.push({
                                      name: "เพิ่ม " + inputValue,
                                      value: inputValue,
                                    });
                                  }
                                  return filtered;
                                }}
                                selectOnFocus
                                clearOnBlur
                                handleHomeEndKeys
                                id="free-solo-with-text-demo"
                                options={event_stage}
                                getOptionLabel={(option) => {
                                  // Value selected with enter, right from the input
                                  if (typeof option === "string") {
                                    return option;
                                  }
                                  // Add "xxx" option created dynamically
                                  if (option.inputValue) {
                                    return option.inputValue;
                                  }
                                  // Regular option
                                  return option.name;
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    name="event_project_stage"
                                    label="สถานะงาน"
                                    error={
                                      errors.event_project_stage &&
                                      touched.event_project_stage &&
                                      errors.event_project_stage
                                    }
                                  />
                                )}
                                isOptionEqualToValue={(option, value) => {
                                  return option.value === value.value;
                                }}
                              />
                              <FormHelperText>
                                {errors.event_project_stage &&
                                  touched.event_project_stage &&
                                  errors.event_project_stage}
                              </FormHelperText>
                            </FormControl>
                            {optionContacts && optionContacts.length > 0 && (
                              <FormControl
                                fullWidth
                                size="small"
                                error={
                                  errors.contact_id &&
                                  touched.contact_id &&
                                  errors.contact_id
                                }
                              >
                                <Autocomplete
                                  disablePortal
                                  onBlur={handleBlur}
                                  id="combo-box-demo"
                                  options={optionContacts}
                                  getOptionLabel={(option) => option.name}
                                  onChange={async (_, value) => {
                                    if (value !== null && value.value) {
                                      setMyLoading(true);
                                      setSelectedContact({
                                        name: value.name,
                                        value: value.value.toString(),
                                      });
                                      setFieldValue("contact_id", value.value);
                                      setFieldValue("person_id", "");
                                      const {
                                        data: { data, status },
                                      } = await getContactById(value.value);
                                      if (status === "success") {
                                        setContact(data);
                                        setMyLoading(false);
                                      }
                                    } else {
                                      if (
                                        value !== null &&
                                        value.name === "ไม่ระบุ"
                                      ) {
                                        setSelectedContact({
                                          name: "ไม่ระบุ",
                                          value: "",
                                        });
                                      } else {
                                        setSelectedContact(null);
                                      }
                                      setContact(null);
                                      setSelectedPerson({
                                        name: "ไม่ระบุ",
                                        value: "",
                                      });
                                      setOptionPersons([
                                        {
                                          name: "ไม่ระบุ",
                                          value: "",
                                        },
                                      ]);
                                      setFieldValue("contact_id", "");
                                    }
                                  }}
                                  value={selectedContact}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="ผู้ติดต่อ"
                                      error={
                                        errors.project_id &&
                                        touched.project_id &&
                                        errors.project_id
                                      }
                                    />
                                  )}
                                  renderOption={(props, option) => (
                                    <li {...props} key={option.value}>
                                      {option.name}
                                    </li>
                                  )}
                                  isOptionEqualToValue={(option, value) => {
                                    return (
                                      option.value.toString() === value.value
                                    );
                                  }}
                                  disabled={
                                    values.event_status === "cancelled" ||
                                    values.event_status === "finished"
                                  }
                                />
                                <FormHelperText>
                                  {errors.contact_id &&
                                    touched.contact_id &&
                                    errors.contact_id}
                                </FormHelperText>
                                {values.contact_id && (
                                  <span>
                                    <Link
                                      to={`/sales/contact/${values.contact_id}`}
                                      className="myColor"
                                      target="_blank"
                                    >
                                      <Button variant="outlined">
                                        ดูข้อมูล
                                      </Button>
                                    </Link>
                                  </span>
                                )}
                              </FormControl>
                            )}
                            {values.contact_id &&
                              optionPersons &&
                              optionPersons.length > 0 && (
                                <FormControl
                                  fullWidth
                                  size="small"
                                  error={
                                    errors.person_id &&
                                    touched.person_id &&
                                    errors.person_id
                                  }
                                >
                                  <Autocomplete
                                    disablePortal
                                    onBlur={handleBlur}
                                    id="combo-box-demo"
                                    options={optionPersons}
                                    getOptionLabel={(option) => option.name}
                                    onChange={async (_, value) => {
                                      if (value !== null) {
                                        setSelectedPerson({
                                          name: value.name,
                                          value: value.value.toString(),
                                        });
                                        setFieldValue("person_id", value.value);
                                      } else {
                                        if (
                                          value !== null &&
                                          value.name === "ไม่ระบุ"
                                        ) {
                                          setSelectedPerson({
                                            name: "ไม่ระบุ",
                                            value: "",
                                          });
                                        } else {
                                          setSelectedPerson(null);
                                        }
                                        setFieldValue("person_id", "");
                                      }
                                    }}
                                    value={selectedPerson}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="บุคคลติดต่อ"
                                        error={
                                          errors.person_id &&
                                          touched.person_id &&
                                          errors.person_id
                                        }
                                      />
                                    )}
                                    renderOption={(props, option) => (
                                      <li {...props} key={option.value}>
                                        {option.name}
                                      </li>
                                    )}
                                    isOptionEqualToValue={(option, value) => {
                                      return (
                                        option.value.toString() === value.value
                                      );
                                    }}
                                    disabled={
                                      values.event_status === "cancelled" ||
                                      values.event_status === "finished"
                                    }
                                  />
                                  <FormHelperText>
                                    {errors.person_id &&
                                      touched.person_id &&
                                      errors.person_id}
                                  </FormHelperText>
                                </FormControl>
                              )}
                          </div>
                        </div>

                        <div>
                          <div className="form-heading">
                            <Stack direction="row" spacing={1}>
                              <LocationOnIcon />
                              <div>สถานที่</div>
                            </Stack>
                          </div>
                          <div className="grid-container-50">
                            <TextField
                              onChange={(e) => {
                                handleChange(e);
                              }}
                              onBlur={handleBlur}
                              disabled={
                                values.event_status === "cancelled" ||
                                values.event_status === "finished"
                              }
                              type="text"
                              size="small"
                              name="event_dest_location_name"
                              id="outlined-error-helper-text"
                              label="สถานที่"
                              value={values.event_dest_location_name || ""}
                              error={
                                errors.event_dest_location_name &&
                                touched.event_dest_location_name &&
                                errors.event_dest_location_name
                              }
                              helperText={
                                errors.event_dest_location_name &&
                                touched.event_dest_location_name &&
                                errors.event_dest_location_name
                              }
                            />
                            <TextField
                              onChange={(e) => {
                                handleChange(e);
                              }}
                              onBlur={handleBlur}
                              disabled={
                                values.event_status === "cancelled" ||
                                values.event_status === "finished"
                              }
                              type="text"
                              size="small"
                              name="event_dest_google_map_link"
                              id="outlined-error-helper-text"
                              label="Link Google map"
                              value={values.event_dest_google_map_link || ""}
                              error={
                                errors.event_dest_google_map_link &&
                                touched.event_dest_google_map_link &&
                                errors.event_topic
                              }
                              helperText={
                                errors.event_dest_google_map_link &&
                                touched.event_dest_google_map_link &&
                                errors.event_dest_google_map_link
                              }
                            />
                            {values.event_dest_google_map_link && (
                              <>
                                <div></div>
                                <div>
                                  <Link
                                    to={{
                                      pathname:
                                        values.event_dest_google_map_link,
                                    }}
                                    target="_blank"
                                  >
                                    <ButtonComponent
                                      type="button"
                                      text="นำทาง"
                                      color="success"
                                      variant="outlined"
                                    />
                                  </Link>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="form-heading">
                            <Stack direction="row" spacing={1}>
                              <MyLocationIcon />
                              <div>เช็คอิน</div>
                            </Stack>
                          </div>
                          <div className="grid-container-max">
                            <div className="myColor">จุดเริ่มต้น</div>
                            <div>
                              <div>
                                {myValue.event_checkin_start_location_name && (
                                  <>
                                    {myValue.event_checkin_start_location_name}{" "}
                                    <Divider />
                                  </>
                                )}

                                <div>
                                  {myValue.event_checkin_start_latitude &&
                                    myValue.event_checkin_start_longitude &&
                                    `พิกัด: (${myValue.event_checkin_start_latitude}, ${myValue.event_checkin_start_longitude})`}
                                </div>
                              </div>
                              {!myValue.event_checkin_start_latitude &&
                                values.event_status !== "cancelled" &&
                                values.event_status !== "finished" && (
                                  <ButtonComponent
                                    type="button"
                                    text="เช็คอิน จุดเริ่มต้น"
                                    color="success"
                                    variant="outlined"
                                    disabled={isSubmitting}
                                    onClick={() => checkInStart(setSubmitting)}
                                  />
                                )}
                            </div>
                            <div className="myColor">จุดหมาย</div>
                            <div>
                              <div>
                                {myValue.event_checkin_dest_location_name && (
                                  <>
                                    {myValue.event_checkin_dest_location_name}{" "}
                                    <Divider />
                                  </>
                                )}

                                <div>
                                  {myValue.event_checkin_dest_latitude &&
                                    myValue.event_checkin_dest_longitude &&
                                    `พิกัด: (${myValue.event_checkin_dest_latitude}, ${myValue.event_checkin_dest_longitude})`}
                                </div>
                              </div>
                              {!myValue.event_checkin_dest_latitude &&
                                myValue.event_checkin_start_latitude &&
                                values.event_status !== "cancelled" &&
                                values.event_status !== "finished" && (
                                  <ButtonComponent
                                    type="button"
                                    text="เช็คอิน จุดหมาย"
                                    color="success"
                                    variant="outlined"
                                    disabled={isSubmitting}
                                    onClick={() => checkInDest(setSubmitting)}
                                  />
                                )}
                            </div>
                            {myValue.event_distance_text &&
                              myValue.event_duration_text && (
                                <>
                                  <div className="myColor">รายละเอียด</div>
                                  <div>
                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      className="myChip"
                                    >
                                      {values.event_distance_text && (
                                        <Chip
                                          label={`ระยะทาง: ${values.event_distance_text}`}
                                          variant="outlined"
                                        />
                                      )}
                                      {values.event_duration_text && (
                                        <Chip
                                          label={`ระยะเวลา: ${values.event_duration_text}`}
                                          variant="outlined"
                                        />
                                      )}
                                    </Stack>
                                  </div>
                                </>
                              )}
                          </div>
                        </div>

                        <div>
                          <div className="form-heading">
                            <Stack direction="row" spacing={1}>
                              <SegmentIcon />
                              <div>หมายเหตุ</div>
                            </Stack>
                          </div>
                          <div className="grid-container">
                            <TextField
                              onChange={(e) => {
                                handleChange(e);
                              }}
                              onBlur={handleBlur}
                              type="text"
                              size="small"
                              name="event_remark"
                              // id="outlined-multiline-static"
                              id="outlined-error-helper-text"
                              multiline
                              rows={4}
                              label="หมายเหตุ"
                              value={values.event_remark || ""}
                              error={
                                errors.event_remark &&
                                touched.event_remark &&
                                errors.event_remark
                              }
                              helperText={
                                errors.event_remark &&
                                touched.event_remark &&
                                errors.event_remark
                              }
                            />
                            <Stack
                              direction="row"
                              spacing={1}
                              className="myChip"
                            >
                              <Chip
                                label={`วันที่สร้าง: ${moment(
                                  values._event_created,
                                  "X"
                                )
                                  .tz("Asia/Bangkok")
                                  .format("DD/MM/YYYY, HH:MM")}`}
                                variant="outlined"
                              />
                              <Chip
                                label={
                                  values._event_lastupdate
                                    ? `วันที่อัพเดทล่าสุด: ${moment(
                                        values._event_lastupdate,
                                        "X"
                                      )
                                        .tz("Asia/Bangkok")
                                        .format("DD/MM/YYYY, HH:MM")}`
                                    : "วันที่อัพเดทล่าสุด: -"
                                }
                                variant="outlined"
                              />
                            </Stack>
                            <Stack
                              direction="row"
                              spacing={1}
                              className="myChip"
                            >
                              <Chip
                                label={`ผู้สร้าง: ${
                                  values.employee_firstname &&
                                  values.employee_firstname
                                } ${
                                  values.employee_lastname &&
                                  values.employee_lastname
                                }`}
                                variant="outlined"
                              />
                            </Stack>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                </DialogContentText>
              </DialogContent>

              <DialogActions>
                <ButtonComponent
                  type="submit"
                  text="บันทึก"
                  color="success"
                  variant="outlined"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                />
                {values.event_status &&
                  values.event_status !== "cancelled" &&
                  values.event_status !== "finished" && (
                    <ButtonComponent
                      type="submit"
                      text="เสร็จสิ้น"
                      color="success"
                      variant="outlined"
                      disabled={isSubmitting}
                      onClick={() => {
                        if (
                          window.confirm("คุณต้องการเปลี่ยนสถานะเป็นเสร็จสิ้น?")
                        )
                          handleFinish(values, setSubmitting, resetForm);
                      }}
                    />
                  )}
                {values.event_status &&
                  values.event_status !== "cancelled" &&
                  values.event_status !== "finished" && (
                    <ButtonComponent
                      type="submit"
                      text="ยกเลิก"
                      color="error"
                      variant="outlined"
                      disabled={isSubmitting}
                      onClick={() => {
                        if (window.confirm("คุณต้องการยกเลิก?"))
                          handleCancel(values, setSubmitting, resetForm);
                      }}
                    />
                  )}
                <Button color="success" onClick={() => handleClose(resetForm)}>
                  ปิด
                </Button>
              </DialogActions>
            </Dialog>
          )}
        </Formik>
      )}
    </>
  );
}
