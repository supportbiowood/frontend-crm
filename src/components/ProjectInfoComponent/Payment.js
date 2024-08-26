import React, { useState, useEffect } from "react";
import { Form } from "formik";
import {
  Typography,
  TextField,
  Accordion,
  FormControl,
  AccordionDetails,
  AccordionSummary,
  RadioGroup,
  FormControlLabel,
  InputLabel,
  Select,
  Radio,
  MenuItem,
  Autocomplete,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import addressData from "../../data/address.json";
import { createFilterOptions } from "@mui/material/Autocomplete";

const filter = createFilterOptions();

export default function Payment(props) {
  const [expanded, setExpanded] = useState(false);
  const [optionProvince, setOptionProvince] = useState([]);
  const [optionSubdistrict, setOptionSubdistrict] = useState([]);
  const [optionDistrict, setOptionDistrict] = useState([]);

  const [searchSubdistrict, setSearchSubdistrict] = useState();
  const [searchDistrict, setSearchDistrict] = useState();
  const [searchProvince, setSearchProvince] = useState();
  const [searchPostal] = useState();
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    // setOptionAddress(addressData.slice(0, 50))
    let filterAddressData = addressData;
    if (searchSubdistrict) {
      filterAddressData = addressData.filter((item) =>
        item.sub_district.includes(searchSubdistrict)
      );
    }
    if (searchDistrict) {
      filterAddressData = addressData.filter((item) =>
        item.district.includes(searchDistrict)
      );
    }
    if (searchProvince) {
      filterAddressData = addressData.filter((item) =>
        item.province.includes(searchProvince)
      );
    }
    if (searchPostal) {
      filterAddressData = addressData.filter((item) =>
        item.postal_code.includes(searchPostal)
      );
    }
    let filterProvince = [];
    for (let i = 0; i < filterAddressData.length; i++) {
      const data = filterAddressData[i].province;
      if (!filterProvince.includes(data)) filterProvince.push(data);
    }
    setOptionProvince(filterProvince);
    let filterdistrict = [];
    for (let i = 0; i < filterAddressData.length; i++) {
      const data = filterAddressData[i].district;
      if (!filterdistrict.includes(data)) filterdistrict.push(data);
    }
    setOptionDistrict(filterdistrict);
    let filterSubdistrict = [];
    for (let i = 0; i < filterAddressData.length; i++) {
      const data = filterAddressData[i].sub_district;
      if (!filterSubdistrict.includes(data)) filterSubdistrict.push(data);
    }
    setOptionSubdistrict(filterSubdistrict);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchSubdistrict, searchDistrict, searchProvince]);

  const prefixName = [
    {
      name: "นาย",
      value: "นาย",
    },
    {
      name: "นาง",
      value: "นาง",
    },
    {
      name: "นางสาว",
      value: "นางสาว",
    },
    {
      name: "Mr.",
      value: "Mr.",
    },
    {
      name: "Ms.",
      value: "Ms.",
    },
    {
      name: "Mrs.",
      value: "Mrs.",
    },
    {
      name: "ไม่ระบุ",
      value: "ไม่ระบุ",
    },
  ];

  const BranchName = [
    {
      name: "สำนักงานใหญ่",
      value: "main",
    },
    {
      name: "อื่นๆ",
      value: "others%",
    },
  ];

  const countryOption = [
    {
      label: "ไทย",
      value: "ไทย",
    },
  ];

  // const ProvinceList = [
  //   {
  //     name: 'กรุงเทพ',
  //     value: 'H'
  //   },
  //   {
  //     name: 'เชียงใหม่',
  //     value: 'Chaingmai'
  //   }
  // ]

  // const mockUpDigit = [
  //   {
  //     name: 'digit1'
  //   },
  //   {
  //     name: 'digit2'
  //   },
  //   {
  //     name: 'digit3'
  //   },
  //   {
  //     name: 'digit4'
  //   },
  //   {
  //     name: 'digit5'
  //   },
  //   {
  //     name: 'digit6'
  //   },
  //   {
  //     name: 'digit7'
  //   },
  //   {
  //     name: 'digit8'
  //   },
  //   {
  //     name: 'digit9'
  //   },
  //   {
  //     name: 'digit10'
  //   },
  //   {
  //     name: 'digit11'
  //   },
  //   {
  //     name: 'digit12'
  //   }
  // ]

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
            การเรียกเก็บเงิน
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div>
              <div>
                {/* <ButtonComponent type="submit" text="เรียกจากเจ้าของโปรเจ็ค" variant="outlined" color="success" /> */}
                {/* <br /> */}
                <FormControl
                  component="fieldset"
                  style={{ marginBottom: "24px" }}
                >
                  <RadioGroup
                    row
                    aria-label="type"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel
                      value="individual"
                      control={
                        <Radio
                          color="success"
                          name="project_billing_business_category"
                          checked={
                            props.values.project_billing_business_category ===
                            "individual"
                          }
                          onChange={(e) => {
                            props.handleChange(e);
                          }}
                        />
                      }
                      label="นิติบุคคล"
                    />
                    <FormControlLabel
                      value="commercial"
                      control={
                        <Radio
                          color="success"
                          name="project_billing_business_category"
                          checked={
                            props.values.project_billing_business_category ===
                            "commercial"
                          }
                          onChange={(e) => {
                            props.handleChange(e);
                          }}
                        />
                      }
                      label="บุคคลธรรมดา"
                    />
                    <FormControlLabel
                      value="merchant"
                      control={
                        <Radio
                          color="success"
                          name="project_billing_business_category"
                          checked={
                            props.values.project_billing_business_category ===
                            "merchant"
                          }
                          onChange={(e) => {
                            props.handleChange(e);
                          }}
                        />
                      }
                      label="ร้านค้า"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
              {props.values.project_billing_business_category ===
                "individual" && (
                <div>
                  <Form>
                    <div className="grid-container-50">
                      <TextField
                        fullWidth
                        label="เลขประจำตัวผู้เสียภาษี"
                        size="small"
                        value={props.values.project_billing_tax_no}
                        name="project_billing_tax_no"
                        inputProps={{
                          maxLength: 12,
                        }}
                        onChange={(e) => {
                          props.handleChange(e);
                        }}
                      />
                    </div>
                  </Form>
                  <div className="project-info__billing-wrapper">
                    <TextField
                      label="ชื่อกิจการ"
                      size="small"
                      name="project_name"
                      value={props.values.project_name}
                      onChange={(e) => {
                        props.handleChange(e);
                      }}
                    />
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-simple-select-label">
                        ชื่อสาขา
                      </InputLabel>
                      <Select
                        fullWidth
                        size="small"
                        id="demo-simple-select"
                        name="project_billing_branch"
                        value={props.values.project_billing_branch}
                        label="ชื่อสาขา"
                        onChange={(e) => {
                          props.handleChange(e);
                        }}
                      >
                        {BranchName.map((val, index) => (
                          <MenuItem key={index} value={val.value}>
                            {val.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
              )}
              {props.values.project_billing_business_category ===
                "commercial" && (
                <div className="project-info__billing-wrapper">
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">
                      คำนำหน้า
                    </InputLabel>
                    <Select
                      fullWidth
                      size="small"
                      id="demo-simple-select"
                      name="project_billing_individual_prefix"
                      value={props.values.project_billing_individual_prefix}
                      label="ชื่อสาขา"
                      onChange={(e) => {
                        props.handleChange(e);
                      }}
                    >
                      {prefixName.map((val, index) => (
                        <MenuItem key={index} value={val.value}>
                          {val.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    label="ชื่อจริง"
                    size="small"
                    name="project_billing_individual_first_name"
                    value={props.values.project_billing_individual_first_name}
                    onChange={(e) => {
                      props.handleChange(e);
                    }}
                  />
                  <TextField
                    label="นามสกุล"
                    size="small"
                    name="project_billing_individual_last_name"
                    value={props.values.project_billing_individual_last_name}
                    onChange={(e) => {
                      props.handleChange(e);
                    }}
                  />
                </div>
              )}
              {props.values.project_billing_business_category ===
                "merchant" && (
                <div className="project-info__billing-wrapper">
                  <TextField
                    label="ชื่อร้าน"
                    size="small"
                    name="project_billing_merchant_name"
                    value={props.values.project_billing_merchant_name}
                    onChange={(e) => {
                      props.handleChange(e);
                    }}
                  />
                </div>
              )}
            </div>
            <Typography
              sx={{
                width: "33%",
                flexShrink: 0,
                fontWeight: "bold",
                fontSize: "24px",
                lineHeight: "28px",
                marginBottom: "32px",
              }}
            >
              ที่อยู่จดทะเบียน
            </Typography>
            <div className="grid-container-33">
              <TextField
                label="อาคาร/หมู่บ้าน"
                size="small"
                name="project_billing_address.building"
                value={props.values.project_billing_address.building}
                onChange={(e) => {
                  props.handleChange(e);
                }}
              />
              <TextField
                label="เลขที่"
                size="small"
                name="project_billing_address.house_no"
                value={props.values.project_billing_address.house_no}
                onChange={(e) => {
                  props.handleChange(e);
                }}
              />
              <TextField
                label="หมู่"
                size="small"
                name="project_billing_address.village_no"
                value={props.values.project_billing_address.village_no}
                onChange={(e) => {
                  props.handleChange(e);
                }}
              />
              <TextField
                label="ถนน"
                size="small"
                name="project_billing_address.road"
                value={props.values.project_billing_address.road}
                onChange={(e) => {
                  props.handleChange(e);
                }}
              />
              <Autocomplete
                fullWidth
                value={props.values.project_billing_address.sub_district || ""}
                name="project_billing_address.sub_district"
                onInputChange={(event, newInputValue, reason) => {
                  if (reason === "reset") {
                    return;
                  } else {
                    setSearchSubdistrict();
                    setSearchDistrict();
                    setSearchProvince();
                    return;
                  }
                }}
                onChange={(event, newValue) => {
                  if (typeof newValue === "string") {
                    props.setFieldValue(
                      `project_billing_address.sub_district`,
                      newValue
                    );
                    setSearchSubdistrict(newValue);
                    const filter = addressData.filter((adddress) => {
                      return `${adddress.sub_district}` === `${newValue}`;
                    });
                    if (filter && filter.length !== 0) {
                      props.setFieldValue(
                        `project_billing_address.district`,
                        filter[0].district
                      );
                      props.setFieldValue(
                        `project_billing_address.province`,
                        filter[0].province
                      );
                      props.setFieldValue(
                        `project_billing_address.postal_code`,
                        filter[0].postal_code
                      );
                    }
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    props.setFieldValue(
                      `project_billing_address.sub_district`,
                      newValue.inputValue
                    );
                    setSearchSubdistrict(newValue.inputValue);
                  } else {
                    if (newValue === null)
                      return props.setFieldValue(
                        `project_billing_address.sub_district`,
                        ""
                      );
                    props.setFieldValue(
                      `project_billing_address.sub_district`,
                      newValue
                    );
                    setSearchSubdistrict(newValue);
                    const filter = addressData.filter((adddress) => {
                      return `${adddress.sub_district}` === `${newValue}`;
                    });
                    if (filter && filter.length !== 0) {
                      props.setFieldValue(
                        `project_billing_address.district`,
                        filter[0].district
                      );
                      props.setFieldValue(
                        `project_billing_address.province`,
                        filter[0].province
                      );
                      props.setFieldValue(
                        `project_billing_address.postal_code`,
                        filter[0].postal_code
                      );
                    }
                  }
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);

                  const { inputValue } = params;
                  // Suggest the creation of a new value
                  const isExisting = options.some(
                    (option) => inputValue === option
                  );
                  if (inputValue !== "" && !isExisting) {
                    filtered.push(inputValue);
                  }

                  return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                id="free-solo-with-text-demo"
                options={optionSubdistrict}
                getOptionLabel={(option) => {
                  // Value selected with enter, right from the input
                  if (typeof option === "string") {
                    return option;
                  }
                  // Add "xxx" option created dynamically
                  if (option.inputValue) {
                    return `เพิ่ม ${option.inputValue}`;
                  }
                  // Regular option
                  return option;
                }}
                renderOption={(props, option) => <li {...props}>{option}</li>}
                freeSolo
                renderInput={(params) => (
                  <TextField {...params} size="small" label="แขวง / ตำบล" />
                )}
              />
              <Autocomplete
                fullWidth
                value={props.values.project_billing_address.district || ""}
                name="project_billing_address.district"
                onInputChange={(event, newInputValue, reason) => {
                  if (reason === "reset") {
                    return;
                  } else {
                    setSearchSubdistrict();
                    setSearchDistrict();
                    return;
                  }
                }}
                onChange={(event, newValue) => {
                  if (typeof newValue === "string") {
                    props.setFieldValue(
                      `project_billing_address.district`,
                      newValue
                    );
                    setSearchDistrict(newValue);
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    props.setFieldValue(
                      `project_billing_address.district`,
                      newValue.inputValue
                    );
                    setSearchDistrict(newValue.inputValue);
                  } else {
                    if (newValue === null)
                      return props.setFieldValue(
                        `project_billing_address.district`,
                        ""
                      );
                    props.setFieldValue(
                      `project_billing_address.district`,
                      newValue
                    );
                    setSearchDistrict(newValue);
                  }
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);

                  const { inputValue } = params;
                  // Suggest the creation of a new value
                  const isExisting = options.some(
                    (option) => inputValue === option
                  );
                  if (inputValue !== "" && !isExisting) {
                    filtered.push(inputValue);
                  }

                  return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                id="free-solo-with-text-demo"
                options={optionDistrict}
                getOptionLabel={(option) => {
                  // Value selected with enter, right from the input
                  if (typeof option === "string") {
                    return option;
                  }
                  // Add "xxx" option created dynamically
                  if (option.inputValue) {
                    return `เพิ่ม ${option.inputValue}`;
                  }
                  // Regular option
                  return option;
                }}
                renderOption={(props, option) => <li {...props}>{option}</li>}
                freeSolo
                renderInput={(params) => (
                  <TextField {...params} size="small" label="เขต / อำเภอ" />
                )}
              />
              <Autocomplete
                fullWidth
                value={props.values.project_billing_address.province || ""}
                name="project_billing_address.province"
                onInputChange={(event, newInputValue, reason) => {
                  if (reason === "reset") {
                    return;
                  } else {
                    setSearchSubdistrict();
                    setSearchDistrict();
                    setSearchProvince();
                    return;
                  }
                }}
                onChange={(event, newValue) => {
                  if (typeof newValue === "string") {
                    props.setFieldValue(
                      `project_billing_address.province`,
                      newValue
                    );
                    setSearchProvince(newValue);
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    props.setFieldValue(
                      `project_billing_address.province`,
                      newValue.inputValue
                    );
                    setSearchProvince(newValue.inputValue);
                  } else {
                    if (newValue === null)
                      return props.setFieldValue(
                        `project_billing_address.province`,
                        ""
                      );
                    props.setFieldValue(
                      `project_billing_address.province`,
                      newValue
                    );
                    setSearchProvince(newValue);
                  }
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);

                  const { inputValue } = params;
                  // Suggest the creation of a new value
                  const isExisting = options.some(
                    (option) => inputValue === option
                  );
                  if (inputValue !== "" && !isExisting) {
                    filtered.push(inputValue);
                  }

                  return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                id="free-solo-with-text-demo"
                options={optionProvince}
                getOptionLabel={(option) => {
                  // Value selected with enter, right from the input
                  if (typeof option === "string") {
                    return option;
                  }
                  // Add "xxx" option created dynamically
                  if (option.inputValue) {
                    return `เพิ่ม ${option.inputValue}`;
                  }
                  // Regular option
                  return option;
                }}
                renderOption={(props, option) => <li {...props}>{option}</li>}
                freeSolo
                renderInput={(params) => (
                  <TextField {...params} size="small" label="จังหวัด" />
                )}
              />
              <TextField
                label="รหัสไปรษณีย์"
                size="small"
                name="project_billing_address.postal_code"
                value={props.values.project_billing_address.postal_code}
                onChange={(e) => {
                  props.handleChange(e);
                }}
              />
              <Autocomplete
                fullWidth
                value={props.values.project_billing_address.country}
                name="project_billing_address.country"
                onChange={(event, newValue) => {
                  if (typeof newValue === "string") {
                    props.setFieldValue(
                      `project_billing_address.country`,
                      newValue.value
                    );
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    props.setFieldValue(
                      `project_billing_address.country`,
                      newValue.inputValue
                    );
                  } else {
                    if (newValue === null)
                      return props.setFieldValue(
                        `project_billing_address.country`,
                        ""
                      );
                    props.setFieldValue(
                      `project_billing_address.country`,
                      newValue.value
                    );
                  }
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);

                  const { inputValue } = params;
                  // Suggest the creation of a new value
                  const isExisting = options.some(
                    (option) => inputValue === option.label
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
                options={countryOption}
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
                freeSolo
                renderInput={(params) => (
                  <TextField {...params} size="small" label="ประเทศ" />
                )}
              />
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
