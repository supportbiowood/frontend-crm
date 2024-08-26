import React, { useState } from "react";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  Box,
  Grid,
  TextField,
  Select,
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
} from "@mui/material";
import EngineerDateComponent from "../../EngineerDateComponent";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

const filter = createFilterOptions();

const taskDescription = [
  "ประมูล",
  "ประมาณการซื้อ",
  "สเปค",
  "ก่อสร้าง",
  "อื่นๆ",
];

const jobOption = [
  {
    label: "พื้นภายใน",
    value: "พื้นภายใน",
  },
  {
    label: "พื้นภายนอก",
    value: "พื้นภายนอก",
  },
  {
    label: "ฝ้าภายใน",
    value: "ฝ้าภายใน",
  },
  {
    label: "ฝ้าภายนอก",
    value: "ฝ้าภายนอก",
  },
  {
    label: "ผนังภายใน",
    value: "ผนังภายใน",
  },
  {
    label: "ผนังภายนอก",
    value: "ผนังภายนอก",
  },
  {
    label: "บันไดภายใน",
    value: "บันไดภายใน",
  },
  {
    label: "บันไดภายนอก",
    value: "บันไดภายนอก",
  },
  {
    label: "ราวจับภายใน",
    value: "ราวจับภายใน",
  },
  {
    label: "ราวจับภายนอก",
    value: "ราวจับภายนอก",
  },
  {
    label: "ระเเนงภายใน",
    value: "ระเเนงภายใน",
  },
  {
    label: "ระเเนงภายนอก",
    value: "ระเเนงภายนอก",
  },
  {
    label: "เสาภายใน",
    value: "เสาภายใน",
  },
  {
    label: "เสาภายนอก",
    value: "เสาภายนอก",
  },
  {
    label: "ประตู",
    value: "ประตู",
  },
  {
    label: "วงกบ",
    value: "วงกบ",
  },
  {
    label: "หน้าต่าง",
    value: "หน้าต่าง",
  },
  {
    label: "บานเกล็ด louver",
    value: "บานเกล็ด louver",
  },
  {
    label: "Facade อาคาร",
    value: "Facade อาคาร",
  },
];

export default function InformationAccordion({ formik, disabled }) {
  const [expanded, setExpanded] = useState("panel1");
  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const checkReproductionHandler = () => {
    formik.setFieldValue("reproduction", !formik.values.reproduction);
  };

  const checkInstallationHandler = () => {
    formik.setFieldValue("installation", !formik.values.installation);
  };

  const checkadjustmentHandler = () => {
    formik.setFieldValue("adjustment", !formik.values.adjustment);
  };

  const handleInDateChange = (newValue) => {
    formik.setFieldValue("engineer_in_date", newValue);
  };

  return (
    <Accordion
      sx={{ p: "24px", mb: "24px" }}
      expanded={expanded === "panel1"}
      onChange={handleChange("panel1")}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1bh-content"
        id="panel1bh-header"
      >
        <h4>ข้อมูลเบื้องต้น/ข้อมูลงาน</h4>
      </AccordionSummary>
      <AccordionDetails>
        <FormControl
          sx={{ mb: 1.5 }}
          component="fieldset"
          variant="standard"
          disabled={disabled}
        >
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  disabled={disabled}
                  checked={formik.values.reproduction}
                  onChange={checkReproductionHandler}
                  name="reproduction"
                  sx={{
                    "&.Mui-checked": {
                      color: "#419644",
                    },
                  }}
                />
              }
              label="ถอดแบบ"
            />
            <FormControlLabel
              control={
                <Checkbox
                  disabled={disabled}
                  checked={formik.values.installation}
                  onChange={checkInstallationHandler}
                  name="installation"
                  sx={{
                    "&.Mui-checked": {
                      color: "#419644",
                    },
                  }}
                />
              }
              label="ติดตั้ง"
            />
            <FormControlLabel
              control={
                <Checkbox
                  disabled={disabled}
                  checked={formik.values.adjustment}
                  onChange={checkadjustmentHandler}
                  name="adjustment"
                  sx={{
                    "&.Mui-checked": {
                      color: "#419644",
                    },
                  }}
                />
              }
              label="งานเพิ่ม/ลด"
            />
          </FormGroup>
        </FormControl>
        <Box sx={{ mb: 1.5 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="job_project_type">ข้อมูลลักษณะงาน</InputLabel>
                <Select
                  disabled={disabled}
                  labelId="job_project_type"
                  id="job_project_type"
                  name="job_project_type"
                  label="ข้อมูลลักษณะงาน"
                  onChange={formik.handleChange}
                  value={formik.values.job_project_type}
                >
                  {taskDescription.map((task, index) => (
                    <MenuItem key={index} value={task}>
                      {task}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3} xl={3}>
              <Autocomplete
                value={formik.values.job_description}
                onChange={(event, newValue) => {
                  if (typeof newValue === "string") {
                    formik.setFieldValue(`job_description`, newValue);
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    formik.setFieldValue(
                      `job_description`,
                      newValue.inputValue
                    );
                  } else {
                    if (newValue !== null)
                      return formik.setFieldValue(
                        `job_description`,
                        newValue.value
                      );
                    formik.setFieldValue(`job_description`, "");
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
                      label: `เพิ่ม "${inputValue}"`,
                    });
                  }

                  return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                id="free-solo-with-text-demo"
                options={jobOption}
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
                  return option.label;
                }}
                renderOption={(props, option) => (
                  <li {...props}>{option.label}</li>
                )}
                fullWidth
                disabled={disabled}
                freeSolo
                renderInput={(params) => (
                  <TextField
                    {...params}
                    autoComplete="off"
                    size="small"
                    label="ลักษณะงาน"
                  />
                )}
              />
            </Grid>
          </Grid>
        </Box>
        <FormControl component="fieldset" fullWidth disabled={disabled}>
          <FormLabel
            sx={{
              "&, &.Mui-focused": {
                color: "black",
                fontWeight: "bold",
              },
            }}
            component="legend"
          >
            ความเร่งด่วน
          </FormLabel>
          <Grid container>
            <Grid item>
              {" "}
              <RadioGroup
                disabled={disabled}
                row
                aria-label="type"
                name="job_priority"
                onChange={formik.handleChange}
                value={formik.values.job_priority}
              >
                <FormControlLabel
                  value="ด่วน"
                  control={
                    <Radio
                      sx={{
                        "&, &.Mui-checked": {
                          color: "#419644",
                        },
                      }}
                      disableRipple
                    />
                  }
                  label="ด่วน"
                />
                <FormControlLabel
                  value="ทั่วไป"
                  control={
                    <Radio
                      sx={{
                        "&, &.Mui-checked": {
                          color: "#419644",
                        },
                      }}
                      disableRipple
                    />
                  }
                  label="ทั่วไป"
                />
              </RadioGroup>
            </Grid>
            <Grid item>
              <EngineerDateComponent
                disabled={disabled.inDate}
                name="engineer_in_date"
                label="ภายในวันที่"
                value={formik.values.engineer_in_date}
                dateChangeHandler={handleInDateChange}
              />
            </Grid>
          </Grid>
        </FormControl>
      </AccordionDetails>
    </Accordion>
  );
}
