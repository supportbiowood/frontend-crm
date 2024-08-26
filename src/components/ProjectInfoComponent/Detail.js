import React, { useState } from "react";
import { Typography, TextField } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createFilterOptions } from "@mui/material/Autocomplete";
import {
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const filter = createFilterOptions();

export default function Detail(props) {
  const [expanded, setExpanded] = useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const ProjectCategory = [
    {
      name: "บ้านส่วนตัว",
      value: "บ้านส่วนตัว",
    },
    {
      name: "คอนโด",
      value: "คอนโด",
    },
    {
      name: "หมู่บ้าน",
      value: "หมู่บ้าน",
    },
    {
      name: "โรงแรม/รีสอร์ท",
      value: "โรงแรม/รีสอร์ท",
    },
    {
      name: "ห้างสรรพสินค้า",
      value: "ห้างสรรพสินค้า",
    },
    {
      name: "มหาวิทยาลัย",
      value: "มหาวิทยาลัย",
    },
    {
      name: "ราชการ(หน่วยงาน)",
      value: "ราชการ(หน่วยงาน)",
    },
    {
      name: "โรงงาน",
      value: "โรงงาน",
    },
    {
      name: "อื่นๆ",
      value: "อื่นๆ",
    },
  ];

  const ProjectStage = [
    {
      name: "ประมูล",
      value: "ประมูล",
    },
    {
      name: "สเปค",
      value: "สเปค",
    },
    {
      name: "ก่อสร้าง",
      value: "ก่อสร้าง",
    },
    {
      name: "อื่นๆ",
      value: "อื่นๆ",
    },
  ];

  const ProjectDealConfidence = [
    {
      name: "10%",
      value: "10%",
    },
    {
      name: "20%",
      value: "20%",
    },
    {
      name: "30%",
      value: "30%",
    },
    {
      name: "40%",
      value: "40%",
    },
    {
      name: "50%",
      value: "50%",
    },
    {
      name: "60%",
      value: "60%",
    },
    {
      name: "70%",
      value: "70%",
    },
    {
      name: "80%",
      value: "80%",
    },
    {
      name: "90%",
      value: "90%",
    },
    {
      name: "100%",
      value: "100%",
    },
  ];

  const ProjectStatus = [
    {
      name: "โครงการใหม่",
      value: "new",
    },
    {
      name: "กำลังดำเนินการ",
      value: "ongoing",
    },
    {
      name: "เสนอราคา",
      value: "quotation",
    },
    {
      name: "ปิดได้",
      value: "closed_success",
    },
    {
      name: "ปิดไม่ได้",
      value: "closed_fail",
    },
    {
      name: "จบโครงการ",
      value: "finished",
    },
    {
      name: "ดูแลงาน",
      value: "service",
    },
  ];

  const ProjectType = [
    {
      name: "วางสเปค",
      value: "วางสเปค",
    },
    {
      name: "เทียบสเปค",
      value: "เทียบสเปค",
    },
    {
      name: "รักษาสเปค",
      value: "รักษาสเปค",
    },
  ];

  return (
    <div>
      <div className="project-add__body-subheader">
        <div className="project-add__body-subheader-flex">
          <TextField
            fullWidth
            label="ชื่อโครงการ"
            size="small"
            name="project_name"
            value={props.values.project_name}
            onChange={(e) => {
              props.setFieldError("project_name", "");
              props.handleChange(e);
            }}
            error={
              props.errors.project_name &&
              props.touched.project_name &&
              props.errors.project_name
            }
            helperText={
              props.errors.project_name &&
              props.touched.project_name &&
              props.errors.project_name
            }
          />
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">สถานะ</InputLabel>
            <Select
              fullWidth
              size="small"
              id="demo-simple-select"
              name="project_status"
              value={props.values.project_status}
              label="สถานะ"
              onChange={(e) => {
                props.handleChange(e);
              }}
              sx={{ width: "250px" }}
            >
              {ProjectStatus.map((val, index) => (
                <MenuItem key={index} value={val.value}>
                  {val.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
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
          <Typography
            sx={{
              width: "33%",
              flexShrink: 0,
              fontWeight: "bold",
              fontSize: "24px",
              lineHeight: "28px",
              whiteSpace: "nowrap",
            }}
          >
            รายละเอียด
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="grid-container-33">
              <Autocomplete
                fullWidth
                disableClearable
                value={props.values.project_category || ""}
                name={`project_category`}
                onChange={(event, newValue) => {
                  props.setFieldError("project_category", "");
                  if (typeof newValue === "string") {
                    props.setFieldValue(`project_category`, newValue.value);
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    props.setFieldValue(
                      `project_category`,
                      newValue.inputValue
                    );
                    console.log(props.values.project_category);
                  } else {
                    if (newValue === null)
                      return props.setFieldValue(`project_category`, "");
                    props.setFieldValue(`project_category`, newValue.value);
                    console.log(props.values.project_category);
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
                      inputValue,
                      name: `เพิ่ม "${inputValue}"`,
                    });
                  }

                  return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                id="free-solo-with-text-demo"
                options={ProjectCategory}
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
                renderOption={(props, option) => (
                  <li {...props}>{option.name}</li>
                )}
                freeSolo
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label="ประเภทกิจการ"
                    error={
                      props.errors.project_category &&
                      props.touched.project_category &&
                      props.errors.project_category
                    }
                    helperText={
                      props.errors.project_category &&
                      props.touched.project_category &&
                      props.errors.project_category
                    }
                  />
                )}
              />
              <Autocomplete
                fullWidth
                disableClearable
                value={props.values.project_stage || ""}
                name={`project_stage`}
                onChange={(event, newValue) => {
                  props.setFieldError("project_stage", "");
                  if (typeof newValue === "string") {
                    props.setFieldValue(`project_stage`, newValue.value);
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    props.setFieldValue(`project_stage`, newValue.inputValue);
                    console.log(props.values.project_stage);
                  } else {
                    if (newValue === null)
                      return props.setFieldValue(`project_stage`, "");
                    props.setFieldValue(`project_stage`, newValue.value);
                    console.log(props.values.project_stage);
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
                      inputValue,
                      name: `เพิ่ม "${inputValue}"`,
                    });
                  }

                  return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                id="free-solo-with-text-demo"
                options={ProjectStage}
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
                renderOption={(props, option) => (
                  <li {...props}>{option.name}</li>
                )}
                freeSolo
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label="ขั้นตอนของงาน"
                    error={
                      props.errors.project_stage &&
                      props.touched.project_stage &&
                      props.errors.project_stage
                    }
                    helperText={
                      props.errors.project_stage &&
                      props.touched.project_stage &&
                      props.errors.project_stage
                    }
                  />
                )}
              />
              <Autocomplete
                fullWidth
                disableClearable
                value={props.values.project_type || ""}
                name={`project_type`}
                onChange={(event, newValue) => {
                  props.setFieldError("project_type", "");
                  if (typeof newValue === "string") {
                    props.setFieldValue(`project_type`, newValue.value);
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    props.setFieldValue(`project_type`, newValue.inputValue);
                    console.log(props.values.project_type);
                  } else {
                    if (newValue === null)
                      return props.setFieldValue(`project_type`, "");
                    props.setFieldValue(`project_type`, newValue.value);
                    console.log(props.values.project_type);
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
                      inputValue,
                      name: `เพิ่ม "${inputValue}"`,
                    });
                  }

                  return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                id="free-solo-with-text-demo"
                options={ProjectType}
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
                renderOption={(props, option) => (
                  <li {...props}>{option.name}</li>
                )}
                freeSolo
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    label="ลักษณะงาน"
                    error={
                      props.errors.project_type &&
                      props.touched.project_type &&
                      props.errors.project_type
                    }
                    helperText={
                      props.errors.project_type &&
                      props.touched.project_type &&
                      props.errors.project_type
                    }
                  />
                )}
              />

              <TextField
                fullWidth
                label="ข้อมูลลักษณะงาน"
                size="small"
                name="project_type_detail"
                value={props.values.project_type_detail}
                onChange={(e) => {
                  props.setFieldError("project_type_detail", "");
                  props.handleChange(e);
                }}
                error={
                  props.errors.project_type_detail &&
                  props.touched.project_type_detail &&
                  props.errors.project_type_detail
                }
                helperText={
                  props.errors.project_type_detail &&
                  props.touched.project_type_detail &&
                  props.errors.project_type_detail
                }
              />
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">
                  % โอกาสสำเร็จ
                </InputLabel>
                <Select
                  fullWidth
                  size="small"
                  id="demo-simple-select"
                  name="project_deal_confidence"
                  value={props.values.project_deal_confidence}
                  label="ประเภทกิจการ"
                  onChange={(e) => {
                    props.handleChange(e);
                  }}
                >
                  {ProjectDealConfidence.map((val, index) => (
                    <MenuItem key={index} value={val.value}>
                      {val.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="วันคาดการณ์ปิดดีล"
                  name="project_deal_target_date"
                  value={props.values.project_deal_target_date}
                  onChange={(e) => {
                    props.setFieldValue("project_deal_target_date", e);
                  }}
                  inputFormat="dd/MM/yyyy"
                  renderInput={(params) => (
                    <TextField size="small" {...params} />
                  )}
                />
              </LocalizationProvider>
              <TextField
                fullWidth
                label="มูลค่า"
                size="small"
                name="project_deal_value"
                // value={props.values.project_deal_value.toLocaleString()}
                value={
                  props.values.project_deal_value &&
                  Number(props.values.project_deal_value).toLocaleString()
                }
                onChange={(e) => {
                  // console.log(e.target.value)
                  e.target.value = Number(e.target.value.replace(/\D/g, ""));
                  // console.log("formatNumber", e.target.value)
                  props.handleChange(e);
                }}
                error={
                  props.errors.project_deal_value &&
                  props.touched.project_deal_value &&
                  props.errors.project_deal_value
                }
                helperText={
                  props.errors.project_deal_value &&
                  props.touched.project_deal_value &&
                  props.errors.project_deal_value
                }
              />
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
