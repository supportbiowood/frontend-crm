import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment-timezone";
import ButtonComponent from "../ButtonComponent";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";
import ModalAddScheduleComponent from "./modalAddSchedule";
import ModalInfoScheduleComponent from "./modalInfoSchedule";

import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";

import {
  getAllEmployee,
  getContactOption,
  getEventByEmployeeId,
  getProjectOption,
} from "../../adapter/Api";
import { getUser } from "../../adapter/Auth";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/actions/snackbarActions";
// import { createFilterOptions } from "@mui/material/Autocomplete";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { dateToUnix } from "../../adapter/Utils";

moment.locale("th-TH", {
  week: {
    dow: 1,
    doy: 1,
  },
});

const localizer = momentLocalizer(moment);

export default function EventComponent() {
  const user = getUser();
  const [isLoading, setIsLoading] = useState(false);
  const [allEvents, setAllEvents] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
  const [filteredEvent, setFilteredEvent] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [selectedEmployee, setSelectedEmployee] = useState(
    user.employee_document_id
  );
  const [selectedEventStatus, setSelectedEventStatus] = useState("planned");
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const [reload, setReload] = useState(false);

  const [open, setOpen] = useState(false);
  const [openModalInfo, setOpenModalInfo] = useState(false);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const dispatch = useDispatch();

  const [project, setProject] = useState();
  const [contact, setContact] = useState();

  const [optionProjects, setOptionProjects] = useState([]);
  const [optionContacts, setOptionContacts] = useState([]);
  const [optionPersons, setOptionPersons] = useState([]);
  const [startDate, setStartDate] = useState(
    dateToUnix(moment().startOf("month").subtract(1, "week"))
  );
  const [endDate, setEndDate] = useState(
    dateToUnix(moment().endOf("month").add(1, "week"))
  );

  useEffect(() => {
    const getAllData = async () => {
      setIsLoading(true);
      try {
        const {
          data: { data: employeeData, status: employeeStatus },
        } = await getAllEmployee();
        const {
          data: { data: eventData, status: eventStatus },
        } = await getEventByEmployeeId(selectedEmployee, startDate, endDate);
        const {
          data: { data: projectData, status: projectStatus },
        } = await getProjectOption(["project_status"]);
        const {
          data: { data: contactData, status: contactStatus },
        } = await getContactOption(["person_list"]);
        const formatEmployee = employeeData.filter((employee) => {
          return (
            employee.employee_department === "หัวหน้า" ||
            employee.employee_department === "ขาย" ||
            employee.employee_department === "ดูแลระบบ"
          );
        });

        const formatProjectOptions = await projectData.map((project) => ({
          name: project.project_name,
          value: project.project_id,
        }));
        const formatContactOptions = await contactData.map((contact) => ({
          name:
            contact.contact_commercial_name ||
            contact.contact_individual_first_name ||
            contact.contact_merchant_name,
          value: contact.contact_id,
        }));
        if (
          employeeStatus === "success" &&
          eventStatus === "success" &&
          projectStatus === "success" &&
          contactStatus === "success"
        ) {
          setAllEmployees(formatEmployee);
          setAllEvents(eventData);
          setOptionProjects([
            { name: "ไม่ระบุ", value: "" },
            ...formatProjectOptions,
          ]);
          setOptionContacts([
            { name: "ไม่ระบุ", value: "" },
            ...formatContactOptions,
          ]);
        }
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        if (err.response)
          dispatch(
            showSnackbar(
              "error",
              (err.response.data.message && err.response.data.message) ||
                "เกิดข้อผิดพลาด"
            )
          );
      }
    };
    getAllData();
  }, [dispatch, endDate, selectedEmployee, startDate]);

  useEffect(() => {
    //'planned','scheduled','checkin','cancelled','finished'
    let filterEvents = allEvents;
    filterEvents = allEvents.filter((event) => {
      if (selectedEventStatus === "planned")
        return event.event_plan_end_date != null;
      else if (selectedEventStatus === "scheduled")
        return (
          (event.event_status === "scheduled" &&
            event.event_schedule_end_date) ||
          (event.event_status === "checkin" &&
            event.event_checkin_start_date) ||
          (event.event_status === "finished" &&
            event.event_checkin_dest_date) ||
          (event.event_status === "cancelled" && event.event_cancel_date)
        );
      else if (selectedEventStatus === "checkin")
        return (
          (event.event_status === "checkin" &&
            event.event_checkin_start_date) ||
          (event.event_status === "finished" &&
            event.event_checkin_dest_date) ||
          (event.event_status === "cancelled" && event.event_cancel_date)
        );
      else if (selectedEventStatus === "finished")
        return (
          event.event_status === "finished" && event.event_checkin_dest_date
        );
      else if (selectedEventStatus === "cancelled")
        return event.event_status === "cancelled" && event.event_cancel_date;
      else {
        return null;
      }
    });
    if (selectedEmployee) {
      filterEvents = filterEvents.filter((event) => {
        return event.event_employee_document_id === selectedEmployee;
      });
    }
    let start = new Date();
    let end = new Date();

    const formatFiltered = filterEvents.map((event) => {
      if (selectedEventStatus === "planned") {
        start = event.event_plan_start_date;
        end = event.event_plan_end_date;
      } else if (selectedEventStatus === "scheduled") {
        start = event.event_schedule_start_date;
        end = event.event_schedule_end_date;
      } else if (selectedEventStatus === "checkin") {
        start = event.event_checkin_start_date;
        end = event.event_checkin_start_date;
      } else if (selectedEventStatus === "cancelled") {
        start = event.event_cancel_date;
        end = event.event_cancel_date;
      } else if (selectedEventStatus === "finished") {
        start = event.event_checkin_start_date;
        end = event.event_checkin_dest_date || event.event_checkin_start_date;
      }
      start = new Date(moment(start, "X").tz("Asia/Bangkok"));
      end = new Date(moment(end, "X").tz("Asia/Bangkok"));
      return {
        title: event.event_topic,
        // allDay: true,
        start: start,
        end: end,
        ...event,
      };
    });
    setFilteredEvent(formatFiltered);
  }, [allEvents, selectedEmployee, selectedEventStatus]);

  const CustomEvent = (event) => {
    return (
      <div>
        <b>{event["event"].title}</b>
      </div>
    );
  };

  const customDayPropGetter = (date) => {
    if (date.getMonth() !== selectedMonth.getMonth())
      return {
        className: "not-this-month",
      };
    if (date.toDateString() === new Date().toDateString())
      return {
        className: "today",
      };
    if (date.getUTCDay() === 5 || date.getUTCDay() === 6)
      return {
        className: "weekend",
      };
    else return {};
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
        <BreadcrumbComponent name="การขาย" key="1" to="/sales" />
        <BreadcrumbComponent name="แผนการทำงาน" key="2" to="/sales/event" />
      </Breadcrumbs>
      <div className="grid-container-50">
        <div>
          <h2 className="form-heading">แผนการทำงาน</h2>
        </div>
        <div className="myPagebar">
          <div className="myForm">
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">พนักงาน</InputLabel>
              <Select
                fullWidth
                size="small"
                id="demo-simple-select"
                label="พนักงาน"
                value={
                  selectedEmployee
                    ? selectedEmployee
                    : user && user.employee_document_id
                }
                onChange={(e) => {
                  setSelectedEmployee(e.target.value);
                }}
              >
                {allEmployees &&
                  allEmployees.map((val, index) => (
                    <MenuItem key={index} value={val.employee_document_id}>
                      {val.employee_firstname} {val.employee_lastname} (
                      {val.employee_position})
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">สถานะ</InputLabel>
              <Select
                fullWidth
                size="small"
                id="demo-simple-select"
                label="สถานะ"
                value={selectedEventStatus && selectedEventStatus}
                onChange={(e) => {
                  setSelectedEventStatus(e.target.value);
                }}
              >
                <MenuItem key={1} value={"planned"}>
                  วางแผน
                </MenuItem>
                <MenuItem key={2} value={"scheduled"}>
                  นัดหมาย
                </MenuItem>
                <MenuItem key={3} value={"checkin"}>
                  เช็คอิน
                </MenuItem>
                <MenuItem key={4} value={"finished"}>
                  เสร็จสิ้น
                </MenuItem>
                <MenuItem key={5} value={"cancelled"}>
                  ยกเลิก
                </MenuItem>
              </Select>
            </FormControl>
            <ButtonComponent
              onClick={() => setOpen(true)}
              variant="contained"
              text="เพิ่มแผนการทำงาน"
              color="success"
            />
          </div>
        </div>
      </div>
      <div className="sales-schedule">
        <Calendar
          localizer={localizer}
          events={filteredEvent}
          startAccessor="start"
          endAccessor="end"
          className="schedule"
          onSelectEvent={(event) => {
            setOpenModalInfo(true);
            setSelectedEvent(event);
          }}
          eventPropGetter={(event) => {
            if (selectedEventStatus === event.event_status)
              return { className: "schedule-event" };
            else return { className: "schedule-event event-not-active" };
          }}
          dayPropGetter={customDayPropGetter}
          components={{
            month: {
              event: CustomEvent,
              header: function Test(props) {
                return (
                  <div className="schedule-col-header">
                    {daysOfWeek[props.date.getDay()]}
                  </div>
                );
              },
            },
            // toolbar: customToolbar,
          }}
          onView={(view) => {
            console.log("view", view);
          }}
          onNavigate={(date, view) => {
            let start, end;
            if (view === "month" || view === "agenda") {
              setSelectedMonth(date);
              start = moment(date).startOf("month").startOf("week");
              end = moment(date).endOf("month").endOf("week");
            } else if (view === "week") {
              start = moment(date).startOf("week");
              end = moment(date).endOf("week");
            } else if (view === "day") {
              start = moment(date).startOf("day");
              end = moment(date).endOf("day");
            }
            setStartDate(dateToUnix(start));
            setEndDate(dateToUnix(end));
          }}
        />
      </div>
      <ModalAddScheduleComponent
        open={open}
        setOpen={setOpen}
        setReload={setReload}
        reload={reload}
        project={project}
        contact={contact}
        setProject={setProject}
        setContact={setContact}
        optionProjects={optionProjects}
        optionContacts={optionContacts}
        optionPersons={optionPersons}
        setOptionContacts={setOptionContacts}
        setOptionPersons={setOptionPersons}
        setFilteredEvent={setFilteredEvent}
      />
      <ModalInfoScheduleComponent
        open={openModalInfo}
        setOpen={setOpenModalInfo}
        data={selectedEvent}
        setReload={setReload}
        reload={reload}
        project={project}
        contact={contact}
        setProject={setProject}
        setContact={setContact}
        optionProjects={optionProjects}
        optionContacts={optionContacts}
        optionPersons={optionPersons}
        setOptionContacts={setOptionContacts}
        setOptionPersons={setOptionPersons}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setFilteredEvent={setFilteredEvent}
        setSelectedEvent={setSelectedEvent}
      />
    </>
  );
}
