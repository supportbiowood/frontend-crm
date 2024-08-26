import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Autocomplete,
  FormControlLabel,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormHelperText,
  Checkbox,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Placeholder from "../../images/placeholder.jpeg";
import { uploadFileToS3 } from "../UploadImageToS3WithNativeSdk/UploadImageToS3WithNativeSdk";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { createFilterOptions } from "@mui/material/Autocomplete";

import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/actions/snackbarActions";
import ButtonComponent from "../ButtonComponent";
import addressData from "../../data/address.json";

const filter = createFilterOptions();

export default function BusinessInfo(props) {
  const [profileImg, setProfileImg] = useState("");
  const [isLocationInput, setIsLocationInput] = useState([false]);
  const [expanded, setExpanded] = useState("panel1");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const [optionProvince, setOptionProvince] = useState([]);
  const [optionSubdistrict, setOptionSubdistrict] = useState([]);
  const [optionDistrict, setOptionDistrict] = useState([]);

  const [searchSubdistrict, setSearchSubdistrict] = useState();
  const [searchDistrict, setSearchDistrict] = useState();
  const [searchProvince, setSearchProvince] = useState();

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

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const BusinessCategory = [
    {
      name: "นิติบุคคล",
      value: "commercial",
    },
    {
      name: "บุคคลธรรมดา",
      value: "individual",
    },
    {
      name: "ร้านค้า",
      value: "merchant",
    },
  ];

  const BusinessType = [
    {
      name: "บริษัท",
      value: "บริษัท",
    },
    {
      name: "บริษัทมหาชนจำกัด",
      value: "บริษัทมหาชนจำกัด",
    },
    {
      name: "ห้างหุ้นส่วนจำกัด",
      value: "ห้างหุ้นส่วนจำกัด",
    },
    {
      name: "ห้างหุ้นส่วนสามัญนิติบุคคล",
      value: "ห้างหุ้นส่วนสามัญนิติบุคคล",
    },
    {
      name: "สมาคม",
      value: "สมาคม",
    },
    {
      name: "อื่นๆ",
      value: "อื่นๆ",
    },
  ];

  const [leadsource] = useState([
    {
      name: "Facebook",
      value: "Facebook",
    },
    {
      name: "Line",
      value: "Line",
    },
    {
      name: "Instragram",
      value: "Instragram",
    },
    {
      name: "Website",
      value: "Website",
    },
    {
      name: "Email",
      value: "Email",
    },
    {
      name: "Line@",
      value: "Line@",
    },
    {
      name: "โทรศัพท์ call in",
      value: "โทรศัพท์ call in",
    },
    {
      name: "Sales",
      value: "Sales",
    },
    {
      name: "Marketplace",
      value: "Marketplace",
    },
    {
      name: "Noc Noc",
      value: "Noc Noc",
    },
    {
      name: "คนรู้จัก",
      value: "คนรู้จัก",
    },
    {
      name: "งานสถาปนิก",
      value: "งานสถาปนิก",
    },
  ]);

  const PrefixName = [
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
      value: "mr",
    },
    {
      name: "Mrs.",
      value: "mrs",
    },
    {
      name: "Ms.",
      value: "ms",
    },
    {
      name: "ไม่ระบุ",
      value: "none",
    },
  ];
  const AddressOption = [
    {
      label: "ที่อยู่จดทะเบียน",
      value: "ที่อยู่จดทะเบียน",
    },
    {
      label: "ที่อยู่ส่งเอกสาร",
      value: "ที่อยู่ส่งเอกสาร",
    },
    {
      label: "ที่อยู่ผู้ติดต่อ",
      value: "ที่อยู่ผู้ติดต่อ",
    },
  ];
  const countryOption = [
    {
      label: "ไทย",
      value: "ไทย",
    },
  ];

  useEffect(() => {
    props.setFieldValue("contact_commercial_type", "บริษัท");
    props.setFieldValue("contact_commercial_name", "");
    props.setFieldValue("contact_individual_prefix_name", "mr");
    props.setFieldValue("contact_individual_first_name", "");
    props.setFieldValue("contact_individual_last_name", "");
    props.setFieldValue("contact_merchant_name", "");
    props.setFieldValue("contact_tax_no", "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.values.contact_business_category]);

  const handleClickUploadLogo = (files) => {
    if (files.length !== 0) {
      const file = files[0];
      setIsLoading(true);
      uploadFileToS3(file, "CRM", "test")
        .then((data) => {
          setProfileImg(data.Location);
          props.setFieldValue("contact_img_url", data.Location);
          setIsLoading(false);
          dispatch(showSnackbar("success", "อัพโหลดสำเร็จ"));
        })
        .catch((err) => {
          console.log(err);
          setIsLoading(false);
          dispatch(showSnackbar("error", "อัพโหลดล้มเหลว"));
        });
    }
  };

  const addAddress = () => {
    const Clone = [...props.values.contact_address_list];
    Clone.push({
      address_name: "",
      building: "",
      house_no: "",
      road: "",
      village_no: "",
      sub_district: "",
      district: "",
      province: "",
      country: null,
      postal_code: "",
    });
    props.setFieldValue("contact_address_list", Clone);
    setIsLocationInput((prev) => {
      return [...prev, false];
    });
    setSearchSubdistrict();
    setSearchDistrict();
    setSearchProvince();
  };

  if (isLoading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer - 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

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
          <h2>ข้อมูลกิจการ</h2>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <div className="grid-container-75">
              <div className="sale-add-contact__accordian1-left">
                <h3>ประเภทผู้ติดต่อ</h3>
                <div style={{ display: "inline-flex" }}>
                  <div className="sale-add-contact__accordian6-list">
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="contact_is_customer"
                          color="success"
                          checked={props.values.contact_is_customer}
                          onChange={(e) => {
                            props.handleChange(e);
                          }}
                        />
                      }
                      label="ลูกค้า (Customer)"
                    />
                  </div>
                  <div className="sale-add-contact__accordian6-list">
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="contact_is_vendor"
                          color="success"
                          checked={props.values.contact_is_vendor}
                          onChange={(e) => {
                            props.handleChange(e);
                          }}
                        />
                      }
                      label="ผู้ขาย (Vendor)"
                    />
                  </div>
                </div>
                <div className="grid-container-50">
                  <FormControl
                    fullWidth
                    size="small"
                    error={
                      props.errors.contact_business_category &&
                      props.touched.contact_business_category &&
                      props.errors.contact_business_category
                    }
                  >
                    <InputLabel id="demo-simple-select-label">
                      ประเภทกิจการ
                    </InputLabel>
                    <Select
                      fullWidth
                      size="small"
                      id="demo-simple-select"
                      name="contact_business_category"
                      value={props.values.contact_business_category}
                      label="ประเภทกิจการ"
                      onChange={(e) => {
                        props.handleChange(e);
                      }}
                    >
                      {BusinessCategory.map((val, index) => (
                        <MenuItem key={index} value={val.value}>
                          {val.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {props.errors.contact_business_category &&
                        props.touched.contact_business_category &&
                        props.errors.contact_business_category}
                    </FormHelperText>
                  </FormControl>
                  <Autocomplete
                    fullWidth
                    disableClearable
                    value={props.values.lead_source_name || ""}
                    name={`lead_source_name`}
                    onChange={(event, newValue) => {
                      if (typeof newValue === "string") {
                        props.setFieldValue(`lead_source_name`, newValue.value);
                      } else if (newValue && newValue.inputValue) {
                        // Create a new value from the user input
                        props.setFieldValue(
                          `lead_source_name`,
                          newValue.inputValue
                        );
                      } else {
                        if (newValue === null)
                          return props.setFieldValue(`lead_source_name`, "");
                        props.setFieldValue(`lead_source_name`, newValue.value);
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
                    options={leadsource}
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
                        label="แหล่งที่มาของผู้ติดต่อ"
                      />
                    )}
                  />
                </div>
                {props.values.contact_business_category === "commercial" && (
                  <div>
                    <div className="grid-container-50">
                      <TextField
                        fullWidth
                        label="เลขประจำตัวผู้เสียภาษี"
                        size="small"
                        inputProps={{
                          maxLength: 13,
                        }}
                        value={props.values.contact_tax_no}
                        name="contact_tax_no"
                        onChange={(e) => {
                          props.setFieldError("contact_tax_no", "");
                          props.handleChange(e);
                        }}
                        error={
                          props.errors.contact_tax_no &&
                          props.touched.contact_tax_no &&
                          props.errors.contact_tax_no
                        }
                        helperText={
                          props.errors.contact_tax_no &&
                          props.touched.contact_tax_no &&
                          props.errors.contact_tax_no
                        }
                      />
                    </div>
                    <div className="grid-container-50">
                      <TextField
                        fullWidth
                        label="ชื่อกิจการ"
                        size="small"
                        value={props.values.contact_commercial_name}
                        name="contact_commercial_name"
                        onChange={(e) => {
                          props.setFieldError("contact_commercial_name", "");
                          props.handleChange(e);
                        }}
                        error={
                          props.errors.contact_commercial_name &&
                          props.touched.contact_commercial_name &&
                          props.errors.contact_commercial_name
                        }
                        helperText={
                          props.errors.contact_commercial_name &&
                          props.touched.contact_commercial_name &&
                          props.errors.contact_commercial_name
                        }
                      />
                      <FormControl
                        fullWidth
                        size="small"
                        error={
                          props.errors.contact_commercial_type &&
                          props.touched.contact_commercial_type &&
                          props.errors.contact_commercial_type
                        }
                      >
                        <InputLabel id="demo-simple-select-label">
                          นิติบุคคล
                        </InputLabel>
                        <Select
                          fullWidth
                          size="small"
                          id="demo-simple-select"
                          value={props.values.contact_commercial_type}
                          label="นิติบุคคล"
                          name="contact_commercial_type"
                          onChange={(e) => {
                            props.handleChange(e);
                          }}
                        >
                          {BusinessType.map((val, index) => (
                            <MenuItem key={index} value={val.value}>
                              {val.name}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText>
                          {props.errors.contact_commercial_type &&
                            props.touched.contact_commercial_type &&
                            props.errors.contact_commercial_type}
                        </FormHelperText>
                      </FormControl>
                    </div>
                  </div>
                )}
                {props.values.contact_business_category === "individual" && (
                  <div className="sale-add-contact__accordian1-individual-wrapper">
                    <div className="grid-container-50">
                      <FormControl fullWidth size="small">
                        <InputLabel id="demo-simple-select-label">
                          คำนำหน้า
                        </InputLabel>
                        <Select
                          fullWidth
                          size="small"
                          id="contact_individual_prefix_name"
                          value={props.values.contact_individual_prefix_name}
                          name="contact_individual_prefix_name"
                          label="คำนำหน้า"
                          onChange={(e) => {
                            props.handleChange(e);
                          }}
                        >
                          {PrefixName.map((val, index) => (
                            <MenuItem key={index} value={val.value}>
                              {val.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div className="grid-container-50">
                      <TextField
                        fullWidth
                        label="ชื่อจริง"
                        name="contact_individual_first_name"
                        size="small"
                        value={props.values.contact_individual_first_name}
                        onChange={(e) => {
                          props.handleChange(e);
                        }}
                        error={
                          props.errors.contact_individual_first_name &&
                          props.touched.contact_individual_first_name &&
                          props.errors.contact_individual_first_name
                        }
                        helperText={
                          props.errors.contact_individual_first_name &&
                          props.touched.contact_individual_first_name &&
                          props.errors.contact_individual_first_name
                        }
                      />
                      <TextField
                        fullWidth
                        label="นามสกุล"
                        name="contact_individual_last_name"
                        size="small"
                        value={props.values.contact_individual_last_name}
                        onChange={(e) => {
                          props.handleChange(e);
                        }}
                        error={
                          props.errors.contact_individual_last_name &&
                          props.touched.contact_individual_last_name &&
                          props.errors.contact_individual_last_name
                        }
                        helperText={
                          props.errors.contact_individual_last_name &&
                          props.touched.contact_individual_last_name &&
                          props.errors.contact_individual_last_name
                        }
                      />
                    </div>
                  </div>
                )}
                {props.values.contact_business_category === "merchant" && (
                  <div className="grid-container-50">
                    <TextField
                      fullWidth
                      label="ชื่อร้าน"
                      size="small"
                      name="contact_merchant_name"
                      value={props.values.contact_merchant_name}
                      onChange={(e) => {
                        props.handleChange(e);
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="sale-add-contact__accordian1-right">
                <h3>รูปผู้ติดต่อ</h3>
                <div
                  className="img_display"
                  style={{
                    backgroundImage: `url(${
                      profileImg ? profileImg : Placeholder
                    })`,
                    marginBottom: "16px",
                  }}
                />
                <div className="fileUpload">
                  <input
                    type="file"
                    id="file"
                    className="upload"
                    accept=".jpg, .jpeg, .png, .gif"
                    onChange={(e) => handleClickUploadLogo(e.target.files)}
                  />
                  <span>อัพโหลด</span>
                </div>
              </div>
            </div>
            <div>
              <h2>ที่อยู่</h2>
              <h3>ที่อยู่จดทะเบียน</h3>
              <div className="grid-container-33">
                <TextField
                  label="อาคาร/หมู่บ้าน"
                  size="small"
                  value={props.values.contact_registration_address.building}
                  name="contact_registration_address.building"
                  onChange={(e) => {
                    props.handleChange(e);
                  }}
                />
                <TextField
                  label="เลขที่"
                  size="small"
                  value={props.values.contact_registration_address.house_no}
                  name="contact_registration_address.house_no"
                  onChange={(e) => {
                    props.handleChange(e);
                  }}
                />
                <TextField
                  label="หมู่"
                  size="small"
                  name="contact_registration_address.village_no"
                  value={props.values.contact_registration_address.village_no}
                  onChange={(e) => {
                    props.handleChange(e);
                  }}
                />
                <TextField
                  label="ถนน"
                  size="small"
                  name="contact_registration_address.road"
                  value={props.values.contact_registration_address.road}
                  onChange={(e) => {
                    props.handleChange(e);
                  }}
                />
                <Autocomplete
                  fullWidth
                  value={
                    props.values.contact_registration_address.sub_district || ""
                  }
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
                  name="contact_registration_address.sub_district"
                  onChange={(event, newValue) => {
                    if (typeof newValue === "string") {
                      props.setFieldValue(
                        `contact_registration_address.sub_district`,
                        newValue
                      );
                      setSearchSubdistrict(newValue);
                      const filter = addressData.filter((adddress) => {
                        return `${adddress.sub_district}` === `${newValue}`;
                      });
                      if (filter && filter.length !== 0) {
                        props.setFieldValue(
                          `contact_registration_address.district`,
                          filter[0].district
                        );
                        props.setFieldValue(
                          `contact_registration_address.province`,
                          filter[0].province
                        );
                        props.setFieldValue(
                          `contact_registration_address.postal_code`,
                          filter[0].postal_code
                        );
                      }
                    } else if (newValue && newValue.inputValue) {
                      // Create a new value from the user input
                      props.setFieldValue(
                        `contact_registration_address.sub_district`,
                        newValue.inputValue
                      );
                      setSearchSubdistrict(newValue.inputValue);
                    } else {
                      if (newValue === null)
                        return props.setFieldValue(
                          `contact_registration_address.sub_district`,
                          ""
                        );
                      props.setFieldValue(
                        `contact_registration_address.sub_district`,
                        newValue
                      );
                      setSearchSubdistrict(newValue);
                      const filter = addressData.filter((adddress) => {
                        return `${adddress.sub_district}` === `${newValue}`;
                      });
                      if (filter && filter.length !== 0) {
                        props.setFieldValue(
                          `contact_registration_address.district`,
                          filter[0].district
                        );
                        props.setFieldValue(
                          `contact_registration_address.province`,
                          filter[0].province
                        );
                        props.setFieldValue(
                          `contact_registration_address.postal_code`,
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
                  value={
                    props.values.contact_registration_address.district || ""
                  }
                  onInputChange={(event, newInputValue, reason) => {
                    if (reason === "reset") {
                      return;
                    } else {
                      setSearchSubdistrict();
                      setSearchDistrict();
                      return;
                    }
                  }}
                  name="contact_registration_address.district"
                  onChange={(event, newValue) => {
                    if (typeof newValue === "string") {
                      props.setFieldValue(
                        `contact_registration_address.district`,
                        newValue
                      );
                      setSearchDistrict(newValue);
                      const filter = addressData.filter((adddress) => {
                        return `${adddress.district}` === `${newValue}`;
                      });
                      if (filter && filter.length !== 0) {
                        props.setFieldValue(
                          `contact_registration_address.province`,
                          filter[0].province
                        );
                      }
                    } else if (newValue && newValue.inputValue) {
                      // Create a new value from the user input
                      props.setFieldValue(
                        `contact_registration_address.district`,
                        newValue.inputValue
                      );
                      setSearchDistrict(newValue.inputValue);
                    } else {
                      if (newValue === null)
                        return props.setFieldValue(
                          `contact_registration_address.district`,
                          ""
                        );
                      props.setFieldValue(
                        `contact_registration_address.district`,
                        newValue
                      );
                      setSearchDistrict(newValue);
                      const filter = addressData.filter((adddress) => {
                        return `${adddress.district}` === `${newValue}`;
                      });
                      if (filter && filter.length !== 0) {
                        props.setFieldValue(
                          `contact_registration_address.province`,
                          filter[0].province
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
                  value={
                    props.values.contact_registration_address.province || ""
                  }
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
                  name="contact_registration_address.province"
                  onChange={(event, newValue) => {
                    if (typeof newValue === "string") {
                      props.setFieldValue(
                        `contact_registration_address.province`,
                        newValue
                      );
                      setSearchProvince(newValue);
                    } else if (newValue && newValue.inputValue) {
                      // Create a new value from the user input
                      props.setFieldValue(
                        `contact_registration_address.province`,
                        newValue.inputValue
                      );
                      setSearchProvince(newValue.inputValue);
                    } else {
                      if (newValue === null)
                        return props.setFieldValue(
                          `contact_registration_address.province`,
                          ""
                        );
                      props.setFieldValue(
                        `contact_registration_address.province`,
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
                  name="contact_registration_address.postal_code"
                  value={props.values.contact_registration_address.postal_code}
                  onChange={(e) => {
                    props.handleChange(e);
                  }}
                />
                <Autocomplete
                  fullWidth
                  value={props.values.contact_registration_address.country}
                  name="contact_registration_address.country"
                  onChange={(event, newValue) => {
                    if (typeof newValue === "string") {
                      props.setFieldValue(
                        `contact_registration_address.country`,
                        newValue.value
                      );
                    } else if (newValue && newValue.inputValue) {
                      // Create a new value from the user input
                      props.setFieldValue(
                        `contact_registration_address.country`,
                        newValue.inputValue
                      );
                    } else {
                      if (newValue === null)
                        return props.setFieldValue(
                          `contact_registration_address.country`,
                          ""
                        );
                      props.setFieldValue(
                        `contact_registration_address.country`,
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
              <hr style={{ margin: "25px 0px" }} />
              {props.values.contact_address_list.map((val, index) => {
                return (
                  <div>
                    <div>
                      <div className="grid-container-25">
                        <Autocomplete
                          value={val.address_name || ""}
                          name={`contact_address_list[${index}].address_name`}
                          onInputChange={(event, newInputValue, reason) => {
                            if (reason === "reset") {
                              setSearchSubdistrict();
                              setSearchDistrict();
                              setSearchProvince();
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
                                `contact_address_list[${index}].address_name`,
                                newValue.value
                              );
                            } else if (newValue && newValue.inputValue) {
                              // Create a new value from the user input
                              props.setFieldValue(
                                `contact_address_list[${index}].address_name`,
                                newValue.inputValue
                              );
                            } else {
                              if (newValue === null)
                                return props.setFieldValue(
                                  `contact_address_list[${index}].address_name`,
                                  ""
                                );
                              props.setFieldValue(
                                `contact_address_list[${index}].address_name`,
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
                          options={AddressOption}
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
                          sx={{ width: 300 }}
                          freeSolo
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              label="ชื่อที่อยู่"
                            />
                          )}
                        />
                        <div>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={isLocationInput[index]}
                                onChange={() => {
                                  const cloneConfirm = [...isLocationInput];
                                  cloneConfirm[index] = !isLocationInput[index];
                                  setIsLocationInput(cloneConfirm);
                                  if (!isLocationInput[index]) {
                                    const value = {
                                      address_name:
                                        props.values.contact_address_list[index]
                                          .address_name,
                                      building:
                                        props.values
                                          .contact_registration_address
                                          .building,
                                      house_no:
                                        props.values
                                          .contact_registration_address
                                          .house_no,
                                      village_no:
                                        props.values
                                          .contact_registration_address
                                          .village_no,
                                      road: props.values
                                        .contact_registration_address.road,
                                      country:
                                        props.values
                                          .contact_registration_address.country,
                                      postal_code:
                                        props.values
                                          .contact_registration_address
                                          .postal_code,
                                      province:
                                        props.values
                                          .contact_registration_address
                                          .province,
                                      district:
                                        props.values
                                          .contact_registration_address
                                          .district,
                                      sub_district:
                                        props.values
                                          .contact_registration_address
                                          .sub_district,
                                    };
                                    props.setFieldValue(
                                      `contact_address_list[${index}]`,
                                      value
                                    );
                                  }
                                }}
                                color="success"
                              />
                            }
                            label="เหมือนที่อยู่จดทะเบียน"
                          />
                          {index !== 0 && (
                            <ButtonComponent
                              text="ลบ"
                              color="success"
                              variant="outlined"
                              type="button"
                              sx={{ width: "20px" }}
                              onClick={() => {
                                const newContact =
                                  props.values.contact_address_list.filter(
                                    (val, i) => index !== i
                                  );
                                props.setFieldValue(
                                  "contact_address_list",
                                  newContact
                                );
                                const cloneConfirm = [...isLocationInput];
                                const newConfirm = cloneConfirm.filter(
                                  (val, i) => index !== i
                                );
                                setIsLocationInput(newConfirm);
                                setSearchSubdistrict();
                                setSearchDistrict();
                                setSearchProvince();
                              }}
                            />
                          )}
                        </div>
                      </div>
                      <div className="grid-container-33">
                        <TextField
                          disabled={isLocationInput[index]}
                          label="อาคาร/หมู่บ้าน"
                          size="small"
                          name={`contact_address_list[${index}].building`}
                          value={val.building}
                          onChange={(e) => {
                            props.handleChange(e);
                          }}
                        />
                        <TextField
                          disabled={isLocationInput[index]}
                          label="เลขที่"
                          size="small"
                          name={`contact_address_list[${index}].house_no`}
                          value={val.house_no}
                          onChange={(e) => {
                            props.handleChange(e);
                          }}
                        />
                        <TextField
                          disabled={isLocationInput[index]}
                          label="หมู่"
                          size="small"
                          name={`contact_address_list[${index}].village_no`}
                          value={val.village_no}
                          onChange={(e) => {
                            props.handleChange(e);
                          }}
                        />
                        <TextField
                          disabled={isLocationInput[index]}
                          label="ถนน"
                          size="small"
                          name={`contact_address_list[${index}].road`}
                          value={val.road}
                          onChange={(e) => {
                            props.handleChange(e);
                          }}
                        />
                        <Autocomplete
                          fullWidth
                          disabled={isLocationInput[index]}
                          value={val.sub_district}
                          name={`contact_address_list[${index}].sub_district`}
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
                                `contact_address_list[${index}].sub_district`,
                                newValue
                              );
                              setSearchSubdistrict(newValue);
                              const filter = addressData.filter((adddress) => {
                                return (
                                  `${adddress.sub_district}` === `${newValue}`
                                );
                              });
                              if (filter && filter.length !== 0) {
                                props.setFieldValue(
                                  `contact_address_list[${index}].district`,
                                  filter[0].district
                                );
                                props.setFieldValue(
                                  `contact_address_list[${index}].province`,
                                  filter[0].province
                                );
                                props.setFieldValue(
                                  `contact_address_list[${index}].postal_code`,
                                  filter[0].postal_code
                                );
                              }
                            } else if (newValue && newValue.inputValue) {
                              // Create a new value from the user input
                              props.setFieldValue(
                                `contact_address_list[${index}].sub_district`,
                                newValue.inputValue
                              );
                              setSearchSubdistrict(newValue.inputValue);
                            } else {
                              if (newValue === null)
                                return props.setFieldValue(
                                  `contact_address_list[${index}].sub_district`,
                                  ""
                                );
                              props.setFieldValue(
                                `contact_address_list[${index}].sub_district`,
                                newValue
                              );
                              setSearchSubdistrict(newValue);
                              const filter = addressData.filter((adddress) => {
                                return (
                                  `${adddress.sub_district}` === `${newValue}`
                                );
                              });
                              if (filter && filter.length !== 0) {
                                props.setFieldValue(
                                  `contact_address_list[${index}].district`,
                                  filter[0].district
                                );
                                props.setFieldValue(
                                  `contact_address_list[${index}].province`,
                                  filter[0].province
                                );
                                props.setFieldValue(
                                  `contact_address_list[${index}].postal_code`,
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
                          renderOption={(props, option) => (
                            <li {...props}>{option}</li>
                          )}
                          freeSolo
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              label="แขวง / ตำบล"
                            />
                          )}
                        />
                        <Autocomplete
                          fullWidth
                          disabled={isLocationInput[index]}
                          value={val.district || ""}
                          onInputChange={(event, newInputValue, reason) => {
                            if (reason === "reset") {
                              return;
                            } else {
                              setSearchSubdistrict();
                              setSearchDistrict();
                              return;
                            }
                          }}
                          name={`contact_address_list[${index}].district`}
                          onChange={(event, newValue) => {
                            if (typeof newValue === "string") {
                              props.setFieldValue(
                                `contact_address_list[${index}].district`,
                                newValue
                              );
                              setSearchDistrict(newValue);
                              const filter = addressData.filter((adddress) => {
                                return `${adddress.district}` === `${newValue}`;
                              });
                              if (filter && filter.length !== 0) {
                                props.setFieldValue(
                                  `contact_address_list[${index}].province`,
                                  filter[0].province
                                );
                              }
                            } else if (newValue && newValue.inputValue) {
                              // Create a new value from the user input
                              props.setFieldValue(
                                `contact_address_list[${index}].district`,
                                newValue.inputValue
                              );
                              setSearchDistrict(newValue.inputValue);
                            } else {
                              if (newValue === null)
                                return props.setFieldValue(
                                  `contact_address_list[${index}].district`,
                                  ""
                                );
                              props.setFieldValue(
                                `contact_address_list[${index}].district`,
                                newValue
                              );
                              setSearchDistrict(newValue);
                              const filter = addressData.filter((adddress) => {
                                return `${adddress.district}` === `${newValue}`;
                              });
                              if (filter && filter.length !== 0) {
                                props.setFieldValue(
                                  `contact_address_list[${index}].province`,
                                  filter[0].province
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
                          renderOption={(props, option) => (
                            <li {...props}>{option}</li>
                          )}
                          freeSolo
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              label="เขต / อำเภอ"
                            />
                          )}
                        />
                        <Autocomplete
                          fullWidth
                          disabled={isLocationInput[index]}
                          value={val.province || ""}
                          name={`contact_address_list[${index}].province`}
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
                                `contact_address_list[${index}].province`,
                                newValue
                              );
                              setSearchProvince(newValue);
                            } else if (newValue && newValue.inputValue) {
                              // Create a new value from the user input
                              props.setFieldValue(
                                `contact_address_list[${index}].province`,
                                newValue.inputValue
                              );
                              setSearchProvince(newValue.inputValue);
                            } else {
                              if (newValue === null)
                                return props.setFieldValue(
                                  `contact_address_list[${index}].province`,
                                  ""
                                );
                              props.setFieldValue(
                                `contact_address_list[${index}].province`,
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
                          renderOption={(props, option) => (
                            <li {...props}>{option}</li>
                          )}
                          freeSolo
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              label="จังหวัด"
                            />
                          )}
                        />
                        <TextField
                          disabled={isLocationInput[index]}
                          label="รหัสไปรษณีย์"
                          size="small"
                          name={`contact_address_list[${index}].postal_code`}
                          value={val.postal_code}
                          onChange={(e) => {
                            props.handleChange(e);
                          }}
                        />
                        <Autocomplete
                          disabled={isLocationInput[index]}
                          fullWidth
                          value={val.country}
                          name="contact_registration_address.country"
                          onChange={(event, newValue) => {
                            if (typeof newValue === "string") {
                              props.setFieldValue(
                                `contact_address_list[${index}].country`,
                                newValue.value
                              );
                            } else if (newValue && newValue.inputValue) {
                              // Create a new value from the user input
                              props.setFieldValue(
                                `contact_address_list[${index}].country`,
                                newValue.inputValue
                              );
                            } else {
                              if (newValue === null)
                                return props.setFieldValue(
                                  `contact_address_list[${index}].country`,
                                  ""
                                );
                              props.setFieldValue(
                                `contact_address_list[${index}].country`,
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
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              <ButtonComponent
                text="เพิ่มที่อยู่"
                variant="outlined"
                color="success"
                type="button"
                onClick={addAddress}
              />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
