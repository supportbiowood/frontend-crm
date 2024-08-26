import React, { useEffect, useState } from "react";
import ButtonComponent from "../ButtonComponent";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import Stack from "@mui/material/Stack";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import EventNoteIcon from "@mui/icons-material/EventNote";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SegmentIcon from "@mui/icons-material/Segment";
import {
  postEvent,
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
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import * as Yup from "yup";
import { Formik, Form } from "formik";

import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/actions/snackbarActions";

import moment from "moment";
import "moment-timezone";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

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

export default function ModalAddScheduleComponent({
  reload,
  setReload,
  open,
  setOpen,
  project,
  setProject,
  contact,
  setContact,
  optionProjects,
  optionContacts,
  optionPersons,
  setOptionContacts,
  setOptionPersons,
  setFilteredEvent,
}) {
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

  const [myLoading, setMyLoading] = useState(false);
  const [myValue] = useState({
    contact_id: "",
    event_dest_google_map_link: "",
    event_dest_location_name: "",
    event_project_stage: "",
    event_remark: "",
    event_status: "planned",
    event_plan_start_date: moment().startOf("hour").add(1, "hour"),
    event_plan_end_date: moment().startOf("hour").add(2, "hour"),
    event_schedule_start_date: moment().startOf("hour").add(1, "hour"),
    event_schedule_end_date: moment().startOf("hour").add(2, "hour"),
    // event_checkin_start_date: moment().startOf("hour").add(1, "hour"),
    // event_checkin_dest_date: moment().startOf("hour").add(2, "hour"),
    event_topic: "",
    person_id: "",
    project_id: "",
  });

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

  const handleClose = (resetForm) => {
    setOpen(false);
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

  const dispatch = useDispatch();
  const filter = createFilterOptions();

  return (
    <>
      {myLoading && (
        <Backdrop sx={{ color: "#fff", zIndex: 999999 }} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Formik
        enableReinitialize
        initialValues={myValue}
        validationSchema={eventSchema}
        validateOnChange={true}
        validateOnBlur={true}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          let payload = {
            ...values,
            event_plan_start_date: moment(values.event_plan_start_date).unix(),
            event_plan_end_date: moment(values.event_plan_end_date).unix(),
            event_schedule_start_date: moment(
              values.event_schedule_start_date
            ).unix(),
            event_schedule_end_date: moment(
              values.event_schedule_end_date
            ).unix(),
          };
          setSubmitting(true);
          setMyLoading(true);
          postEvent(payload)
            .then((data) => {
              if (data.data.status === "success") {
                // const event_status = values.event_status;
                // let start;
                // let end;
                // if (event_status === "planned") {
                //   start = values.event_plan_start_date;
                //   end = values.event_plan_end_date;
                // } else if (event_status === "scheduled") {
                //   start = values.event_schedule_start_date;
                //   end = values.event_schedule_end_date;
                // }
                // start = new Date(moment(start, "X").tz("Asia/Bangkok"));
                // end = new Date(moment(end, "X").tz("Asia/Bangkok"));
                // setFilteredEvent((prev) => [
                //   ...prev,
                //   {
                //     ...values,
                //     event_id: data.data.data.insertId,
                //     title: values.event_topic,
                //     start: start,
                //     end: end,
                //   },
                // ]);
                // dispatch(showSnackbar("success", "บันทึกข้อมูลสำเร็จ"));
              }
              resetForm();
              setSubmitting(false);
              setReload(!reload);
              setMyLoading(false);
              handleClose(resetForm);
              window.location.reload();
            })
            .catch((err) => {
              setSubmitting(false);
              setReload(!reload);
              setMyLoading(false);
              dispatch(
                showSnackbar(
                  "error",
                  (err.response.data.message && err.response.data.message) ||
                    "เกิดข้อผิดพลาด"
                )
              );
            });
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
                เพิ่มแผนการทำงาน
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
                        <div className="form-heading">
                          <Stack direction="row" spacing={1}>
                            <EventNoteIcon />
                            <div>ข้อมูลแผนการทำงาน</div>
                          </Stack>
                        </div>
                        <div className="grid-container-50">
                          <TextField
                            onChange={(e) => {
                              handleChange(e);
                            }}
                            onBlur={handleBlur}
                            type="text"
                            size="small"
                            name="event_topic"
                            id="outlined-error-helper-text"
                            label="เรื่อง"
                            value={values.event_topic || ""}
                            error={
                              errors.event_topic &&
                              touched.event_topic &&
                              errors.event_topic
                            }
                            helperText={
                              errors.event_topic &&
                              touched.event_topic &&
                              errors.event_topic
                            }
                          />
                          <FormControl
                            fullWidth
                            size="small"
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
                              }}
                              onBlur={handleBlur}
                              type="text"
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
                        </div>
                      </div>
                      <div>
                        <div className="form-heading">
                          <Stack direction="row" spacing={1}>
                            <AccessTimeIcon />
                            <div>วันที่และเวลา</div>
                          </Stack>
                        </div>
                        <div className="grid-container-50-50">
                          {values.event_status &&
                            values.event_status === "planned" && (
                              <>
                                <div>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDateFns}
                                  >
                                    <DateTimePicker
                                      label="วันที่เริ่ม (วางแผน)"
                                      value={values.event_plan_start_date}
                                      onChange={(e) => {
                                        setFieldValue(
                                          "event_plan_start_date",
                                          e
                                        );
                                        setFieldValue(
                                          "event_plan_end_date",
                                          moment(e).add(2, "hour")
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
                                      minDate={values.event_plan_start_date}
                                      label="วันที่สิ้นสุด (วางแผน)"
                                      value={values.event_plan_end_date}
                                      onChange={(e) => {
                                        if (e > values.event_plan_start_date)
                                          setFieldValue(
                                            "event_plan_end_date",
                                            e
                                          );
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
                              </>
                            )}
                          {values.event_status &&
                            values.event_status === "scheduled" && (
                              <>
                                <div>
                                  <LocalizationProvider
                                    dateAdapter={AdapterDateFns}
                                  >
                                    <DateTimePicker
                                      label="วันที่เริ่ม (นัดหมาย)"
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
                                      minDate={values.event_schedule_start_date}
                                      label="วันที่สิ้นสุด (นัดหมาย)"
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
                              </>
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
                                  try {
                                    const {
                                      data: { data, status },
                                    } = await getProjectById(value.value);
                                    if (status === "success") {
                                      setProject(data);
                                      setMyLoading(false);
                                    }
                                  } catch (err) {
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
                                return option.value.toString() === value.value;
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
                                  target="_blank"
                                  className="myColor"
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
                              freeSolo
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
                                    <Button variant="outlined">ดูข้อมูล</Button>
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
              <Button color="success" onClick={() => handleClose(resetForm)}>
                ปิด
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Formik>
    </>
  );
}
