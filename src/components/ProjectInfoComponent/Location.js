import React, { useState, useEffect } from "react";
import { Typography, TextField } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import {
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getIn } from "formik";
import addressData from "../../data/address.json";
import { createFilterOptions } from "@mui/material/Autocomplete";

const filter = createFilterOptions();

export default function Location(props) {
  const [expanded, setExpanded] = useState("panel1");
  const [optionProvince, setOptionProvince] = useState([]);
  const [optionSubdistrict, setOptionSubdistrict] = useState([]);
  const [optionDistrict, setOptionDistrict] = useState([]);

  const [searchSubdistrict, setSearchSubdistrict] = useState();
  const [searchDistrict, setSearchDistrict] = useState();
  const [searchProvince, setSearchProvince] = useState();
  const [searchPostal] = useState();

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
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

  const countryOption = [
    {
      label: "ไทย",
      value: "ไทย",
    },
  ];

  // const ProvinceList = [
  //   {
  //     name: "กรุงเทพ",
  //     value: "H",
  //   },
  //   {
  //     name: "เชียงใหม่",
  //     value: "Chaingmai",
  //   },
  // ];

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
            สถานที่ตั้งโครงการ
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="grid-container-33">
              <TextField
                label="อาคาร/หมู่บ้าน"
                size="small"
                name="project_address.building"
                value={props.values.project_address ? props.values.project_address.building : ''}
                onChange={(e) => {
                  props.handleChange(e);
                }}
                error={Boolean(
                  getIn(props.touched, "project_address.building") &&
                    getIn(props.errors, "project_address.building")
                )}
                helperText={
                  getIn(props.touched, "project_address.building") &&
                  getIn(props.errors, "project_address.building")
                }
              />
              <TextField
                label="เลขที่"
                size="small"
                name="project_address.house_no"
                value={props.values.project_address?.house_no || ''}
                onChange={(e) => {
                  props.handleChange(e);
                }}
                error={Boolean(
                  getIn(props.touched, "project_address.house_no") &&
                    getIn(props.errors, "project_address.house_no")
                )}
                helperText={
                  getIn(props.touched, "project_address.house_no") &&
                  getIn(props.errors, "project_address.house_no")
                }
              />
              <TextField
                label="หมู่"
                size="small"
                name="project_address.village_no"
                value={props.values.project_address?.village_no || ''}
                onChange={(e) => {
                  props.handleChange(e);
                }}
                error={Boolean(
                  getIn(props.touched, "project_address.village_no") &&
                    getIn(props.errors, "project_address.village_no")
                )}
                helperText={
                  getIn(props.touched, "project_address.village_no") &&
                  getIn(props.errors, "project_address.village_no")
                }
              />
              <TextField
                label="ถนน"
                size="small"
                name="project_address.road"
                value={props.values.project_address?.road || ''}
                onChange={(e) => {
                  props.handleChange(e);
                }}
                error={Boolean(
                  getIn(props.touched, "project_address.road") &&
                    getIn(props.errors, "project_address.road")
                )}
                helperText={
                  getIn(props.touched, "project_address.road") &&
                  getIn(props.errors, "project_address.road")
                }
              />
              <Autocomplete
                fullWidth
                value={props.values.project_address?.sub_district || ""}
                name="project_address.sub_district"
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
                      `project_address.sub_district`,
                      newValue
                    );
                    setSearchSubdistrict(newValue);
                    const filter = addressData.filter((adddress) => {
                      return `${adddress.sub_district}` === `${newValue}`;
                    });
                    if (filter && filter.length !== 0) {
                      props.setFieldValue(
                        `project_address.district`,
                        filter[0].district
                      );
                      props.setFieldValue(
                        `project_address.province`,
                        filter[0].province
                      );
                      props.setFieldValue(
                        `project_address.postal_code`,
                        filter[0].postal_code
                      );
                    }
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    props.setFieldValue(
                      `project_address.sub_district`,
                      newValue.inputValue
                    );
                    setSearchSubdistrict(newValue.inputValue);
                  } else {
                    if (newValue === null)
                      return props.setFieldValue(
                        `project_address.district`,
                        ""
                      );
                    props.setFieldValue(
                      `project_address.sub_district`,
                      newValue
                    );
                    setSearchSubdistrict(newValue);
                    const filter = addressData.filter((adddress) => {
                      return `${adddress.sub_district}` === `${newValue}`;
                    });
                    if (filter && filter.length !== 0) {
                      props.setFieldValue(
                        `project_address.district`,
                        filter[0].district
                      );
                      props.setFieldValue(
                        `project_address.province`,
                        filter[0].province
                      );
                      props.setFieldValue(
                        `project_address.postal_code`,
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
                  <TextField
                    {...params}
                    size="small"
                    label="แขวง / ตำบล"
                    error={Boolean(
                      getIn(props.touched, "project_address.sub_district") &&
                        getIn(props.errors, "project_address.sub_district")
                    )}
                    helperText={
                      getIn(props.touched, "project_address.sub_district") &&
                      getIn(props.errors, "project_address.sub_district")
                    }
                  />
                )}
              />
              <Autocomplete
                fullWidth
                value={props.values.project_address?.district || ""}
                name="project_address.district"
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
                    props.setFieldValue(`project_address.district`, newValue);
                    setSearchDistrict(newValue);
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    props.setFieldValue(
                      `project_address.district`,
                      newValue.inputValue
                    );
                    setSearchDistrict(newValue.inputValue);
                  } else {
                    if (newValue === null)
                      return props.setFieldValue(
                        `project_address.district`,
                        ""
                      );
                    props.setFieldValue(`project_address.district`, newValue);
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
                  <TextField
                    {...params}
                    size="small"
                    label="เขต / อำเภอ"
                    error={Boolean(
                      getIn(props.touched, "project_address.district") &&
                        getIn(props.errors, "project_address.district")
                    )}
                    helperText={
                      getIn(props.touched, "project_address.district") &&
                      getIn(props.errors, "project_address.district")
                    }
                  />
                )}
              />

              <Autocomplete
                fullWidth
                value={props.values.project_address?.province || ""}
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
                name="project_address.province"
                onChange={(event, newValue) => {
                  if (typeof newValue === "string") {
                    props.setFieldValue(`project_address.province`, newValue);
                    setSearchProvince(newValue);
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    props.setFieldValue(
                      `project_address.province`,
                      newValue.inputValue
                    );
                    setSearchProvince(newValue.inputValue);
                  } else {
                    if (newValue === null)
                      return props.setFieldValue(
                        `project_address.province`,
                        ""
                      );
                    props.setFieldValue(`project_address.province`, newValue);
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
                  <TextField
                    {...params}
                    size="small"
                    label="จังหวัด"
                    error={Boolean(
                      getIn(props.touched, "project_address.province") &&
                        getIn(props.errors, "project_address.province")
                    )}
                    helperText={
                      getIn(props.touched, "project_address.province") &&
                      getIn(props.errors, "project_address.province")
                    }
                  />
                )}
              />

              <TextField
                label="รหัสไปรษณีย์"
                size="small"
                name="project_address.postal_code"
                value={props.values.project_address?.postal_code || ''}
                onChange={(e) => {
                  props.handleChange(e);
                }}
                error={Boolean(
                  getIn(props.touched, "project_address.postal_code") &&
                    getIn(props.errors, "project_address.postal_code")
                )}
                helperText={
                  getIn(props.touched, "project_address.postal_code") &&
                  getIn(props.errors, "project_address.postal_code")
                }
              />
              <Autocomplete
                fullWidth
                value={props.values.project_address?.country || ''}
                name="project_address.country"
                onChange={(event, newValue) => {
                  if (typeof newValue === "string") {
                    props.setFieldValue(
                      `project_address.country`,
                      newValue.value
                    );
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    props.setFieldValue(
                      `project_address.country`,
                      newValue.inputValue
                    );
                  } else {
                    if (newValue === null)
                      return props.setFieldValue(`project_address.country`, "");
                    props.setFieldValue(
                      `project_address.country`,
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
                  <TextField
                    {...params}
                    size="small"
                    label="ประเทศ"
                    error={Boolean(
                      getIn(props.touched, "project_address.country") &&
                        getIn(props.errors, "project_address.country")
                    )}
                    helperText={
                      getIn(props.touched, "project_address.country") &&
                      getIn(props.errors, "project_address.country")
                    }
                  />
                )}
              />
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
