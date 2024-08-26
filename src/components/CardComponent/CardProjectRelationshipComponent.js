import React, { useState } from "react";
import {
  Grid,
  Button,
  DialogContent,
  Select,
  Dialog,
  MenuItem,
  DialogActions,
  DialogTitle,
  FormControl,
  InputLabel,
  IconButton,
  TextField,
  FormControlLabel,
  Checkbox,
  Autocomplete,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Link } from "react-router-dom";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import Placeholder from "../../images/placeholder.jpeg";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import CloseIcon from "@mui/icons-material/Close";

export default function CardProjectRelationshipComponent(props) {
  const [open, setOpen] = useState(false);
  // const [role] = useState("");
  // const [filter, setFilter] = useState();
  // const [personID] = useState(null);

  // const myContactList = props.values && props.values.project_contact_list;
  // const myContact = props.ID && props.values.project_contact_list && props.values.project_contact_list[props.ID]
  const myContact = props.myContact;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

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
      name: "Mr",
      value: "mr",
    },
    {
      name: "Mrs",
      value: "mrs",
    },
    {
      name: "Ms",
      value: "ms",
    },
    {
      name: "ไม่ระบุ",
      value: "none",
    },
  ];

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const PositionList = [
    {
      name: "ผู้บริหาร",
      value: "ผู้บริหาร",
    },
    {
      name: "ฝ่ายบัญชี",
      value: "ฝ่ายบัญชี",
    },
    {
      name: "ฝ่ายจัดซื้อ",
      value: "ฝ่ายจัดซื้อ",
    },
    {
      name: "ฝ่ายจัดส่ง",
      value: "ฝ่ายจัดส่ง",
    },
    {
      name: "พนักงาน",
      value: "พนักงาน",
    },
    {
      name: "ฝ่ายประเมินราคา",
      value: "ฝ่ายประเมินราคา",
    },
    {
      name: "ผู้ติดต่อหน้างาน",
      value: "ผู้ติดต่อหน้างาน",
    },
    {
      name: "ผู้ออกแบบสถาปนิก",
      value: "ผู้ออกแบบสถาปนิก",
    },
    {
      name: "ผู้ออกแบบภายใน",
      value: "ผู้ออกแบบภายใน",
    },
    {
      name: "ผู้ออกแบบภูมิทัศน์",
      value: "ผู้ออกแบบภูมิทัศน์",
    },
    {
      name: "ผู้ติดต่อโครงการ",
      value: "ผู้ติดต่อโครงการ",
    },
  ];

  const ContactList = [
    {
      name: "เบอร์โทรศัพท์",
      value: "เบอร์โทรศัพท์",
    },
    {
      name: "อีเมล",
      value: "อีเมล",
    },
    {
      name: "Line",
      value: "Line",
    },
    {
      name: "Facebook",
      value: "Facebook",
    },
    {
      name: "Website",
      value: "Website",
    },
    {
      name: "Instagram",
      value: "Instagram",
    },
    {
      name: "อื่นๆ",
      value: "อื่นๆ",
    },
  ];

  const handleDelete = () => {
    const Clone = [...props.values.project_contact_list];
    const Delete = Clone.filter((val, index) => {
      return `${props.ID}` !== `${index}`;
    });
    props.setFieldValue("project_contact_list", Delete);
    handleClose();
  };

  function renderContact(data) {
    let contact_name = "";
    if (data.contact_business_category === "individual")
      contact_name =
        ((data.contact_individual_prefix_name !== "none" &&
          data.contact_individual_prefix_name) ||
          "") +
        (data.contact_individual_first_name || "") +
        " " +
        (data.contact_individual_last_name || "");
    else if (data.contact_business_category === "commercial")
      contact_name =
        (data.contact_commercial_type || "") +
        (data.contact_commercial_name || "");
    else if (data.contact_business_category === "merchant")
      contact_name = data.contact_merchant_name;
    return contact_name;
  }

  function renderPerson(data) {
    // console.log("data", data)
    if (!data.person_id) return "-";
    return data.person_first_name + " " + data.person_last_name;
  }

  console.log(myContact);

  return (
    <>
      <div>
        <div className="card-contact" onClick={handleClickOpen}>
          <div className="container">
            <div>
              <div
                className="img_display"
                style={{
                  backgroundImage: `url(${
                    myContact && myContact.contact_img_url
                      ? myContact.contact_img_url
                      : Placeholder
                  })`,
                }}
              />
            </div>
            <div className="right-side">
              <div className="topic">
                <div>{(myContact && myContact.role) || "-"}</div>
              </div>
              <div>
                <div>
                  <b>ผู้ติดต่อ</b>
                </div>
                {myContact && renderContact(myContact)}
                <div>
                  <b>บุคคลติดต่อ</b>
                </div>
                {myContact && renderPerson(myContact)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        fullScreen={fullScreen}
      >
        <DialogTitle>
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            รายชื่อผู้เกี่ยวข้อง
            <IconButton type="button" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </h2>
        </DialogTitle>
        <DialogContent>
          <div className="contact-add-person">
            <div className="header">
              <PersonIcon />
              <h3>ข้อมูลผู้ติดต่อ</h3>
            </div>

            <div className="grid-container-75">
              <div className="sale-add-contact__accordian1-left">
                <div style={{ display: "inline-flex" }}>
                  <div className="sale-add-contact__accordian6-list">
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="contact_is_customer"
                          color="success"
                          checked={myContact && myContact.contact_is_customer}
                          disabled
                          // onChange={(e) => {
                          //   props.handleChange(e);
                          // }}
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
                          checked={myContact && myContact.contact_is_vendor}
                          disabled
                          // onChange={(e) => {
                          //   props.handleChange(e);
                          // }}
                        />
                      }
                      label="ผู้ขาย (Vendor)"
                    />
                  </div>
                </div>
                <div className="grid-container-50">
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">
                      ประเภทกิจการ
                    </InputLabel>
                    <Select
                      fullWidth
                      size="small"
                      id="demo-simple-select"
                      name="contact_business_category"
                      value={myContact && myContact.contact_business_category}
                      label="ประเภทกิจการ"
                      disabled
                    >
                      {BusinessCategory.map((val, index) => (
                        <MenuItem key={index} value={val.value}>
                          {val.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-simple-select-label">
                      แหล่งที่มาของผู้ติดต่อ
                    </InputLabel>
                    <Select
                      fullWidth
                      size="small"
                      id="demo-simple-select"
                      value={myContact && myContact.lead_source_name}
                      name="lead_source_id"
                      label="แหล่งที่มาของผู้ติดต่อ"
                      disabled
                    >
                      <MenuItem value={myContact && myContact.lead_source_name}>
                        {myContact && myContact.lead_source_name}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>
                {myContact &&
                  myContact.contact_business_category === "commercial" && (
                    <div>
                      <div className="grid-container-50">
                        <TextField
                          fullWidth
                          label="เลขประจำตัวผู้เสียภาษี"
                          size="small"
                          value={myContact && myContact.contact_tax_no}
                          name="contact_tax_no"
                          disabled
                        />
                      </div>
                      <div className="grid-container-50">
                        <TextField
                          fullWidth
                          label="ชื่อกิจการ"
                          size="small"
                          value={myContact && myContact.contact_commercial_name}
                          name="contact_commercial_name"
                          disabled
                        />
                        <FormControl fullWidth size="small">
                          <InputLabel id="demo-simple-select-label">
                            นิติบุคคล
                          </InputLabel>
                          <Select
                            fullWidth
                            size="small"
                            id="demo-simple-select"
                            value={
                              myContact && myContact.contact_commercial_type
                            }
                            label="นิติบุคคล"
                            name="contact_commercial_type"
                            disabled
                          >
                            {BusinessType.map((val, index) => (
                              <MenuItem key={index} value={val.value}>
                                {val.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                  )}
                {myContact.contact_business_category === "individual" && (
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
                          value={
                            myContact &&
                            myContact.contact_individual_prefix_name
                          }
                          name="contact_individual_prefix_name"
                          label="คำนำหน้า"
                          disabled
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
                        value={
                          myContact && myContact.contact_individual_first_name
                        }
                        disabled
                      />
                      <TextField
                        fullWidth
                        label="นามสกุล"
                        name="contact_individual_last_name"
                        size="small"
                        value={
                          myContact && myContact.contact_individual_last_name
                        }
                        disabled
                      />
                    </div>
                  </div>
                )}
                {myContact &&
                  myContact.contact_business_category === "merchant" && (
                    <div className="grid-container-50">
                      <TextField
                        fullWidth
                        label="ชื่อร้าน"
                        size="small"
                        name="contact_merchant_name"
                        value={myContact && myContact.contact_merchant_name}
                        disabled
                      />
                    </div>
                  )}
              </div>
              <div className="sale-add-contact__accordian1-right">
                <div
                  className="img_display"
                  style={{
                    backgroundImage: `url(${
                      myContact && myContact.contact_img_url
                        ? myContact.contact_img_url
                        : Placeholder
                    })`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="header">
                <PhoneIphoneIcon />
                <h3>ช่องทางติดต่อ</h3>
              </div>
              <div
                className="contact-channel-wrapper"
                style={{ marginTop: "20px" }}
              >
                {myContact &&
                  myContact.contact_channel_list.map((value, index) => (
                    <>
                      <div className="grid-container-contact-channel-list">
                        <div>
                          <Autocomplete
                            disabled
                            value={value.contact_channel_name}
                            name={`contact_channel_list[${index}].contact_channel_name`}
                            onChange={(event, newValue) => {}}
                            selectOnFocus
                            clearOnBlur
                            handleHomeEndKeys
                            id="free-solo-with-text-demo"
                            options={ContactList}
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
                            sx={{ width: 140 }}
                            freeSolo
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                size="small"
                                label="เลือกช่องทางติดต่อ"
                              />
                            )}
                          />
                        </div>
                        <div>
                          {value.contact_channel_name === "เบอร์โทรศัพท์" ? (
                            <Grid item xs="auto">
                              <TextField
                                autoComplete="off"
                                id={`contact[${index}].contact_channel_detail`}
                                label="เบอร์โทรศัพท์"
                                value={value.contact_channel_detail}
                                size="small"
                                disabled
                              />
                            </Grid>
                          ) : (
                            <Grid item xs="auto">
                              <TextField
                                autoComplete="off"
                                id={`contact[${index}].contact_channel_detail`}
                                value={value.contact_channel_detail}
                                size="small"
                                disabled
                              />
                            </Grid>
                          )}
                        </div>
                        <div>
                          {value.contact_channel_name === "เบอร์โทรศัพท์" ? (
                            <Grid item xs={1}>
                              <TextField
                                autoComplete="off"
                                id={`contact[${index}].contact_channel_detail_2`}
                                label="ต่อ"
                                value={value.contact_channel_detail_2}
                                size="small"
                                sx={{ minWidth: "70px" }}
                                disabled
                              />
                            </Grid>
                          ) : (
                            <Grid item xs={1} />
                          )}
                        </div>
                      </div>
                      <hr
                        className="mobile"
                        style={{
                          borderTop: "1px solid #eee",
                          margin: "5px 0 ",
                        }}
                      />
                    </>
                  ))}
              </div>
            </div>

            <div style={{ margin: "25px 0 " }}>
              <Link
                to={`/sales/contact/${myContact.contact_id}`}
                className="myColor"
                target="_blank"
              >
                ดูข้อมูลเพิ่มเติม
              </Link>
            </div>

            <hr style={{ margin: "25px 0 " }} />

            {myContact.person_id && (
              <>
                <div className="header">
                  <PersonIcon />
                  <h3>ข้อมูลบุคคลติดต่อ</h3>
                </div>
                <div className="grid-container-50">
                  <div style={{ display: "grid", gap: "20px" }}>
                    <FormControl fullWidth size="small">
                      <InputLabel id="demo-simple-select-label">
                        ตำแหน่ง
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={myContact && myContact.person_position}
                        label="ตำแหน่ง"
                        disabled
                      >
                        {PositionList.map((val, index) => (
                          <MenuItem
                            key={`${val.value} + ${index}`}
                            value={val.value}
                          >
                            {val.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      id="firstname"
                      autoComplete="off"
                      label="ชื่อจริง"
                      required
                      size="small"
                      fullWidth
                      value={myContact && myContact.person_first_name}
                      disabled
                    />
                    <TextField
                      fullWidth
                      id="lastname"
                      autoComplete="off"
                      label="นามสกุล"
                      required
                      size="small"
                      value={myContact && myContact.person_last_name}
                      disabled
                    />
                    <TextField
                      fullWidth
                      autoComplete="off"
                      id="nickname"
                      label="ชื่อเล่น"
                      size="small"
                      value={myContact && myContact.person_nick_name}
                      disabled
                    />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="วันเกิด"
                        disabled
                        value={myContact && myContact.person_birthdate}
                        fullWidth
                        inputFormat="dd/MM/yyyy"
                        renderInput={(params) => (
                          <TextField fullWidth size="small" {...params} />
                        )}
                      />
                    </LocalizationProvider>
                  </div>
                  <div>
                    <div style={{ height: "100%", paddingLeft: "20%" }}>
                      <div
                        className="img_display"
                        style={{
                          backgroundImage: `url(${
                            myContact && myContact.person_img_url
                              ? myContact.person_img_url
                              : Placeholder
                          })`,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="header">
                    <PhoneIphoneIcon />
                    <h3>ช่องทางติดต่อ</h3>
                  </div>
                  <div style={{ marginTop: "20px" }}>
                    {myContact &&
                      myContact.person_contact_channel_list &&
                      myContact.person_contact_channel_list.map(
                        (value, index) => (
                          <>
                            <div className="grid-container-contact-channel-list">
                              <div>
                                <FormControl fullWidth size="small">
                                  <InputLabel id="เลือกช่องทางติดต่อ">
                                    เลือกช่องทางติดต่อ
                                  </InputLabel>
                                  <Select
                                    defaultValue="Phone"
                                    autoComplete="off"
                                    labelId="label"
                                    id="เลือกช่องทางติดต่อ"
                                    label="เลือกช่องทางติดต่อ"
                                    value={value.contact_channel_name}
                                    disabled
                                  >
                                    {ContactList.map((val, index) => (
                                      <MenuItem
                                        key={`${val.value} + ${index}`}
                                        value={val.value}
                                      >
                                        {val.name}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </div>
                              <div>
                                {value.contact_channel_name ===
                                "เบอร์โทรศัพท์" ? (
                                  <Grid item xs="auto">
                                    <TextField
                                      autoComplete="off"
                                      id={`contact[${index}].contact_channel_detail`}
                                      label="เบอร์โทรศัพท์"
                                      value={value.contact_channel_detail}
                                      size="small"
                                      disabled
                                    />
                                  </Grid>
                                ) : (
                                  <Grid item xs="auto">
                                    <TextField
                                      autoComplete="off"
                                      id={`contact[${index}].contact_channel_detail`}
                                      label=""
                                      value={value.contact_channel_detail}
                                      size="small"
                                      disabled
                                    />
                                  </Grid>
                                )}
                              </div>
                              <div>
                                {value.contact_channel_name ===
                                "เบอร์โทรศัพท์" ? (
                                  <Grid item xs={1}>
                                    <TextField
                                      autoComplete="off"
                                      id={`contact[${index}].contact_channel_detail_2`}
                                      label="ต่อ"
                                      value={value.contact_channel_detail_2}
                                      size="small"
                                      sx={{ minWidth: "70px" }}
                                      disabled
                                    />
                                  </Grid>
                                ) : (
                                  <Grid item xs={1} />
                                )}
                              </div>
                            </div>
                            <hr
                              className="mobile"
                              style={{
                                borderTop: "1px solid #eee",
                                margin: "5px 0 ",
                              }}
                            />
                          </>
                        )
                      )}
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              window.confirm("คุณต้องกานลบใช่หรือไม่") && handleDelete()
            }
            variant="outlined"
            type="submit"
            color="success"
          >
            ลบ
          </Button>
          {/* <div className="sale-crm-popupAddcontact__footer-button">
            <Button
              variant="contained"
              type="submit"
              color="success"
              
              sx={{ width: "130px", backgroundColor: "rgba(65, 150, 68, 1)" }}
              onClick={handleClick}
            >
              เพิ่มบุคคล
            </Button>
          </div> */}
        </DialogActions>
      </Dialog>
    </>
  );
}
