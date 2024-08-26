import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Box,
  Typography,
  Autocomplete,
  createFilterOptions,
} from "@mui/material";
import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CartageMethodComponent from "./CartageMethodComponent";

const deliveryOptions = [
  "รับเอง",
  "บริษัทจัดส่งหน้างาน",
  "บริษัทจัดส่งโดยขนส่งเอกชน",
];

const filter = createFilterOptions();
const scaffoldByOptions = ["ผู้ว่าจ้าง", "ผู้รับจ้าง"];
const defaultValue = [
  { title: "กระเช้า" },
  { title: "ลิฟท์" },
  { title: "เครน" },
  { title: "คนงานยก" },
];

const InstallationAccordion = ({ formik, disabled }) => {
  const [expanded, setExpanded] = useState("panel1");
  const [cartage, setCartage] = useState("");

  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
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
        <h4>ข้อมูลการติดตั้ง</h4>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ mb: 1.5 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={5} lg={3} xl={3}>
              <FormControl fullWidth size="small" disabled={disabled}>
                <InputLabel id="delivery_method">การส่งของ</InputLabel>
                <Select
                  disabled={disabled}
                  labelId="delivery_method"
                  id="delivery_method"
                  name="delivery_method"
                  label="การส่งของ"
                  onChange={formik.handleChange}
                  value={formik.values.delivery_method}
                >
                  {deliveryOptions.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {formik.values.delivery_method === "บริษัทจัดส่งหน้างาน" && (
              <>
                <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                  <TextField
                    disabled={disabled}
                    name="delivery_count"
                    autoComplete="off"
                    fullWidth
                    type="number"
                    size="small"
                    label="จำนวนครั้งที่ส่ง"
                    onChange={formik.handleChange}
                    value={formik.values.delivery_count}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={1} lg={1} xl={1}>
                  <TextField
                    disabled={disabled}
                    name="delivery_floor"
                    autoComplete="off"
                    fullWidth
                    type="number"
                    size="small"
                    label="วางชั้น"
                    onChange={formik.handleChange}
                    value={formik.values.delivery_floor}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12} sm={12} md={5} lg={3} xl={3}>
              <FormControl fullWidth size="small" disabled={disabled}>
                <InputLabel id="delivery_scaffold">นั่งร้านโดย</InputLabel>
                <Select
                  disabled={disabled}
                  labelId="delivery_scaffold"
                  id="delivery_scaffold"
                  name="delivery_scaffold"
                  label="นั่งร้านโดย"
                  onChange={formik.handleChange}
                  value={formik.values.delivery_scaffold}
                >
                  {scaffoldByOptions.map((option, index) => (
                    <MenuItem key={index} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
        <Typography sx={{ fontWeight: "bold", mb: 1 }}>วิธีการขนของ</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={12} md={5} lg={3} xl={3}>
            <Autocomplete
              disabled={disabled}
              fullWidth
              size="small"
              value={cartage}
              onChange={(_, newValue) => {
                if (typeof newValue === "string") {
                  setCartage(newValue);
                } else if (newValue && newValue.inputValue) {
                  // Create a new value from the user input
                  setCartage(newValue.inputValue);
                } else {
                  setCartage(newValue?.title);
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
                <TextField
                  {...params}
                  label="ขนโดย"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value) {
                      const addedNewMethod =
                        formik.values.delivery_cartage_method.concat(
                          e.target.value
                        );
                      formik.setFieldValue(
                        "delivery_cartage_method",
                        addedNewMethod
                      );
                    }
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={5} lg={3} xl={3}>
            {formik.values.delivery_cartage_method.map((val, index) => (
              <CartageMethodComponent
                disabled={disabled}
                key={index}
                formik={formik}
                label={val}
                index={index}
              />
            ))}
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default InstallationAccordion;
