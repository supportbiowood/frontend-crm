import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  createFilterOptions,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const filter = createFilterOptions();

const defaultValue = [
  { title: "ลูกค้ามารับเอง" },
  { title: "ขนส่งเอกชน" },
  { title: "ส่งหน้างานลูกค้า" },
];

const DeliveryDestination = ({ disabled, formik, employees }) => {
  const [expanded, setExpanded] = useState("panel1");

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const employeeOptions = employees?.map((employee) => {
    return {
      employee_id: employee.employee_id,
      employee_name:
        employee.employee_firstname + " " + employee.employee_lastname,
    };
  });

  const employeeValue = formik.values.delivery_info.sender.employee_id
    ? {
        employee_id: formik.values.delivery_info.sender.employee_id,
        employee_name:
          formik.values.delivery_info.sender.employee_firstname +
          " " +
          formik.values.delivery_info.sender.employee_lastname,
      }
    : {
        employee_id: "",
        employee_name: "",
      };

  return (
    <div>
      <Accordion
        style={{ padding: "24px", marginBottom: "24px" }}
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography component="div">
            <h4>การจัดส่ง</h4>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
              <Autocomplete
                fullWidth
                disabled={disabled}
                size="small"
                value={formik.values.delivery_info.delivery_type}
                onChange={(_, newValue) => {
                  if (typeof newValue === "string") {
                    formik.setFieldValue(
                      "delivery_info.delivery_type",
                      newValue
                    );
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    formik.setFieldValue(
                      "delivery_info.delivery_type",
                      newValue.inputValue
                    );
                  } else {
                    formik.setFieldValue(
                      "delivery_info.delivery_type",
                      newValue?.title || ""
                    );
                  }
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);
                  const { inputValue } = params;
                  // Suggest the creation of a new value
                  const isExisting = options.some(
                    (option) => inputValue === option.title
                  );
                  if (inputValue !== "" && !isExisting) {
                    filtered.push({
                      inputValue,
                      title: `เพิ่ม "${inputValue}"`,
                    });
                  }
                  return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                id="free-solo-with-text-demo"
                options={defaultValue}
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
                  return option.title;
                }}
                renderOption={(props, option) => (
                  <li {...props}>{option.title}</li>
                )}
                freeSolo
                renderInput={(params) => (
                  <TextField {...params} label="รูปแบบการจัดส่ง" />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
              <Autocomplete
                id="delivery_info.sender.employee_id"
                name="delivery_info.sender.employee_id"
                disablePortal
                disabled={disabled}
                size="small"
                freeSolo
                options={employeeOptions}
                value={employeeValue}
                getOptionLabel={(option) => option.employee_name}
                isOptionEqualToValue={(option, value) =>
                  option.employee_name === value.employee_name
                }
                onChange={(_, value) => {
                  if (value !== null) {
                    const filterEmployee = employees.find(
                      (employee) =>
                        employee.employee_id === parseInt(value.employee_id)
                    );
                    formik.setFieldValue(
                      "delivery_info.sender",
                      filterEmployee
                    );
                  }
                }}
                sx={{ width: "100%" }}
                renderInput={(params) => (
                  <TextField {...params} required label="ชื่อผู้ส่ง" />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
              <TextField
                autoComplete="off"
                type="text"
                id="delivery_info.ref_no"
                name="delivery_info.ref_no"
                value={formik.values.delivery_info.ref_no}
                onChange={formik.handleChange}
                disabled={disabled}
                size="small"
                label="เลขอ้างอิง"
                fullWidth
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default DeliveryDestination;
