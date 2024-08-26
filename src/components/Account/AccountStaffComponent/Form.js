import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {
  Grid,
  Box,
  Card,
  Button,
  CardContent,
  Typography,
  CardActions,
} from "@mui/material";
import { useState, useEffect } from "react";
import { getAllEmployee } from "../../../adapter/Api";

export default function Form({ disabled, formik, errorFromFormik }) {
  const [allEmployee, setAllEmployee] = useState([]);
  const [error, setError] = useState();
  const [helperText, setHelperText] = useState();

  useEffect(() => {
    getAllEmployee()
      .then((data) => {
        if (data.data.status === "success") {
          let myData = data.data.data;
          setAllEmployee(myData);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (errorFromFormik) {
      setError(true);
      setHelperText(errorFromFormik);
    }
  }, [errorFromFormik]);

  const [personInput, setPersonInput] = useState("");

  const employeeOption = allEmployee.map(
    (employee) => employee.employee_firstname + " " + employee.employee_lastname
  );

  const selectedPerson = allEmployee.find(
    (employee) =>
      employee.employee_firstname + " " + employee.employee_lastname ===
      personInput
  );

  const addPersonHandler = () => {
    if (!selectedPerson) {
      setError(true);
      setHelperText("กรุณาเลือกพนักงาน");
    } else {
      const existingPerson = formik.values.sale_list.includes(selectedPerson);
      if (existingPerson) {
        setError(true);
        setHelperText("กรุณาเลือกพนักงานคนอื่น");
      } else {
        formik.setFieldValue(
          "sale_list",
          formik.values.sale_list.concat(selectedPerson)
        );
      }
    }
  };

  const deletePersonHandler = (id) => {
    formik.setFieldValue(
      "sale_list",
      formik.values.sale_list.filter((employee) => employee.employee_id !== id)
    );
  };

  return (
    <>
      <Box
        sx={{
          mb: "2.5rem",
        }}
      >
        <Grid container spacing={2}>
          {!disabled && (
            <>
              <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
                <Autocomplete
                  disablePortal
                  size="small"
                  options={employeeOption}
                  inputValue={personInput}
                  onInputChange={(_, newInputValue) => {
                    setPersonInput(newInputValue);
                    setError(false);
                    setHelperText(null);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={error}
                      helperText={helperText}
                      label="เลือกพนักงานขาย"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={9} xl={9}>
                <Button variant="outlined" onClick={addPersonHandler}>
                  เพิ่ม
                </Button>
              </Grid>{" "}
            </>
          )}

          {formik.values.sale_list.length > 0 &&
            formik.values.sale_list.map((person, index) => (
              <Grid item key={index} xs={12} sm={12} md={6} lg={3} xl={3}>
                <Card sx={{ height: "100%" }}>
                  <CardContent
                    sx={{
                      display: "flex",
                      gap: ".5rem",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        width: "100%",
                        backgroundColor: "#E4E7EB",
                        color: "#425A70",
                      }}
                    >
                      {index === 0 ? "ผู้รับผิดชอบหลัก" : "ผู้รับผิดชอบร่วม"}
                    </Box>
                    <Typography>
                      ชื่อ-นามสกุล:{" "}
                      {person.employee_firstname +
                        " " +
                        person.employee_lastname}
                    </Typography>
                    <Typography>ตำแหน่ง: {person.employee_position}</Typography>
                  </CardContent>
                  {!disabled &&
                    (index !== 0 ||
                      formik.values.billing_info.project_id.length === 0) && (
                      <CardActions
                        sx={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <Button
                          variant="text"
                          onClick={() =>
                            deletePersonHandler(person.employee_id)
                          }
                        >
                          ลบ
                        </Button>
                      </CardActions>
                    )}
                </Card>
              </Grid>
            ))}
        </Grid>
      </Box>
    </>
  );
}
