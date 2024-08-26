import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import ButtonComponent from "../ButtonComponent";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Stack from "@mui/material/Stack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import BreadcrumbComponent from "../BreadcrumbComponent";
import SalesProjectCardComponent from "../CardComponent/SalesProjectCardComponent";
import { getProjectOption, getAllEmployee } from "../../adapter/Api";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";

export default function ProjectComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [allProjects, setAllProjects] = useState([]);
  const [cloneData, setCloneData] = useState();
  const [myValue] = useState({
    dataList: allProjects,
    statusList: [
      {
        name: "โครงการใหม่",
        key: "new",
        color: "badge__card-bg1",
        colorCircle: "badge__number-bg1",
      },
      {
        name: "กำลังดำเนินการ",
        key: "ongoing",
        color: "badge__card-bg2",
        colorCircle: "badge__number-bg2",
      },
      {
        name: "เสนอราคา",
        key: "quotation",
        color: "badge__card-bg3",
        colorCircle: "badge__number-bg3",
      },
      {
        name: "ปิดได้",
        key: "closed_success",
        color: "badge__card-bg5",
        colorCircle: "badge__number-bg5",
      },
      {
        name: "จบโครงการ",
        key: "finished",
        color: "badge__card-bg1",
        colorCircle: "badge__number-bg1",
      },
      {
        name: "ดูแลงาน",
        key: "service",
        color: "badge__card-bg2",
        colorCircle: "badge__number-bg2",
      },
      {
        name: "ปิดไม่ได้",
        key: "closed_fail",
        color: "badge__card-bg4",
        colorCircle: "badge__number-bg4",
      },
    ],
    isOpen: [true, true, true, true, true, true, true],
  });

  // console.log('values', values)

  // const userSpecialInfo = JSON.parse(
  //   localStorage.getItem("userSpecialInfo") || ""
  // );
  // const [selectedEmployee, setSelectedEmployee] = useState<any>(userSpecialInfo && userSpecialInfo.employee_id)
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [allEmployees, setAllEmployees] = useState([]);
  const [filteredProject, setFilteredProject] = useState([]);

  useEffect(() => {
    let filteredProject = allProjects;
    if (selectedEmployee === "all") {
      filteredProject = allProjects;
    } else if (selectedEmployee) {
      filteredProject = allProjects.filter((project) => {
        return (
          project.project_employee_list.filter(
            (e) => e.employee_id === selectedEmployee
          ).length > 0
        );
      });
    }
    setFilteredProject(filteredProject);
  }, [selectedEmployee, allProjects]);

  useEffect(() => {
    setIsLoading(true);
    const getProjects = getProjectOption([
      "project_employee_list",
      "project_contact_list",
    ]);
    const getEmployee = getAllEmployee();
    Promise.all([getProjects, getEmployee])
      .then((values) => {
        // console.log(values);
        if (values[0].data.status === "success") {
          let myData = values[0].data.data;
          setCloneData(myData);
          setAllProjects(myData);
        }
        if (values[1].data.status === "success") {
          let myData = values[1].data.data;
          const filtered = myData.filter((item) => {
            return (
              item.employee_department === "หัวหน้า" ||
              item.employee_department === "ขาย" ||
              item.employee_department === "ดูแลระบบ"
            );
          });
          setAllEmployees(filtered);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, [selectedEmployee]);

  // useEffect(() => {
  //   console.log("selectedEmployee", selectedEmployee);
  //   console.log("allProjects", allProjects);
  //   setFilteredProject(allProjects || []);
  // }, [selectedEmployee, allProjects]);

  // useEffect(() => {
  //   setIsLoading(true);
  //   getAllEmployee()
  //     .then((data) => {
  //       setIsLoading(true);
  //       if (data.data.status === "success") {
  //         setIsLoading(false);
  //         // console.log("Employee", data.data.data);
  //         setAllEmployees(
  //           data.data.data.filter((item) => {
  //             return (
  //               item.employee_department === "หัวหน้า" ||
  //               item.employee_department === "ขาย" ||
  //               item.employee_department === "ดูแลระบบ"
  //             );
  //           })
  //         );
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, [selectedEmployee]);

  // useEffect(() => {
  //   setIsLoading(true);
  //   getAllProject()
  //     .then((data) => {
  //       setIsLoading(true);
  //       if (data.data.status === "success") {
  //         setCloneData(data.data.data);
  //         setAllProjects(data.data.data);
  //         setIsLoading(false);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  function filter(newValue) {
    if (newValue === "") return setAllProjects(cloneData);
    console.log(cloneData);
    const newObj =
      cloneData &&
      cloneData.filter((project) => {
        const filterByName = project.project_name
          .toLowerCase()
          .includes(newValue);
        const filterByEmyployee = project.project_employee_list.some(
          (employee) =>
            employee.employee_firstname.toLowerCase().includes(newValue)
        );
        const filterByContactList = project.project_contact_list.some(
          (contact) =>
            contact.contact_commercial_name.toLowerCase().includes(newValue)
        );
        return filterByName || filterByEmyployee || filterByContactList;
      });
    setAllProjects(newObj);
  }

  return (
    <>
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer - 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <div className="sale-crm-main">
        <Stack spacing={2} sx={{ marginBottom: "24px" }}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <BreadcrumbComponent name="การขาย" key="1" to="/sales" />
            <BreadcrumbComponent name="โครงการ" key="2" to="/sales/project" />
          </Breadcrumbs>
        </Stack>
        <div className="grid-container-50">
          <h2>โครงการ</h2>
          <div className="sale-crm-main__header">
            <div className="sale-crm-main__groupBtn">
              <Link to="/sales/project/add">
                <ButtonComponent
                  type="submit"
                  text="เพิ่มโครงการ"
                  variant="contained"
                  color="success"
                />
              </Link>
              <Link to="/sales/contact">
                <ButtonComponent
                  type="submit"
                  text="ผู้ติดต่อ"
                  variant="contained"
                  color="success"
                />
              </Link>
              <Link to="/sales/event">
                <ButtonComponent
                  type="submit"
                  text="ตารางทำงาน"
                  variant="contained"
                  color="success"
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="grid-container-50" style={{ marginTop: "20px" }}>
          <FormControl fullWidth size="small" sx={{ padding: "2px 4px" }}>
            <InputLabel id="demo-simple-select-label">พนักงาน</InputLabel>
            <Select
              fullWidth
              size="small"
              id="demo-simple-select"
              label="พนักงาน"
              // value={selectedEmployee ? selectedEmployee : userSpecialInfo && userSpecialInfo.employee_id}
              value={selectedEmployee ? selectedEmployee : "all"}
              onChange={(e) => {
                setSelectedEmployee(e.target.value);
              }}
              sx={{
                width: "250px",
                "@media screen and (max-width: 600px)": {
                  width: "100%",
                },
              }}
              // value={selectedEmployee ? selectedEmployee.employee_id : userSpecialInfo && userSpecialInfo.employee_id}
            >
              <MenuItem key={0} value={"all"}>
                ทั้งหมด
              </MenuItem>
              {allEmployees.map((val, index) => (
                <MenuItem key={index} value={val.employee_id}>
                  {val.employee_firstname} {val.employee_lastname} (
                  {val.employee_position})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Paper
            component="form"
            sx={{ p: "2px 4px", display: "flex", alignItems: "center" }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="ค้นหาโดย โครงการ, ลูกค้า, พนักงาน"
              inputProps={{ "aria-label": "search google maps" }}
              onChange={(e) => {
                filter(e.target.value.toLowerCase());
              }}
            />
            <IconButton type="submit" aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </div>
        <div className="sale-crm-main__wapper">
          <Formik
            enableReinitialize
            initialValues={myValue}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={(values, { setSubmitting, resetForm }) => {
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
              setFieldValue,
            }) => (
              <Form
                method="POST"
                onSubmit={handleSubmit}
                className={"inputGroup"}
                autoComplete="off"
              >
                <SalesProjectCardComponent
                  data={filteredProject}
                  datalist={myValue}
                  setFieldValue={setFieldValue}
                />
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
