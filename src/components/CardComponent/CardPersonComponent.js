import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  Button,
  TextField,
  Dialog,
  MenuItem,
  Select,
  DialogActions,
  DialogTitle,
  InputLabel,
  FormControl,
  IconButton,
  Input,
} from "@mui/material";
import moment from "moment";
import "moment-timezone";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import { DialogContent } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CloseIcon from "@mui/icons-material/Close";
import { uploadFileToS3 } from "../UploadImageToS3WithNativeSdk/UploadImageToS3WithNativeSdk";
import Placeholder from "../../images/placeholder.jpeg";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/actions/snackbarActions";

import { createFilterOptions } from "@mui/material/Autocomplete";
const filter = createFilterOptions();

export default function CardPersonComponent(props) {
  const [profileImg, setProfileImg] = useState("");
  const [position, setPosition] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [NickName, setNickName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [remark, setRemark] = useState("");
  const [contact, setContact] = useState([
    {
      contact_channel_name: "เบอร์โทรศัพท์",
      contact_channel_detail: "",
      contact_channel_detail_2: "",
    },
  ]);
  const [errorsFirstName, setErrorsFirstName] = useState(false);
  const [errorsLastName, setErrorsLastName] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setErrorsFirstName(false);
    setErrorsLastName(false);
  };

  const handleClickUploadLogo = (files) => {
    if (files.length !== 0) {
      setIsLoading(true);
      const file = files[0];
      uploadFileToS3(file, "CRM", "test")
        .then((data) => {
          setProfileImg(data.Location);
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

  useEffect(() => {
    setPosition(props.values.person_list[props.ID].person_position);
    setFirstName(props.values.person_list[props.ID].person_first_name);
    setLastName(props.values.person_list[props.ID].person_last_name);
    setNickName(props.values.person_list[props.ID].person_nick_name);
    const date = moment(
      props.values.person_list[props.ID].person_birthdate,
      "X"
    )
      .tz("Asia/Bangkok")
      .format("MM/DD/YYYY, HH:MM");
    setBirthDate(date);
    setContact(props.values.person_list[props.ID].person_contact_channel_list);
    setProfileImg(props.values.person_list[props.ID].person_img_url);
    setRemark(props.values.person_list[props.ID].person_remark);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleDelete = () => {
    const Clone = [...props.values.person_list];
    const Delete = Clone.filter((val, index) => {
      return `${props.ID}` !== `${index}`;
    });
    props.setFieldValue("person_list", Delete);
    handleClose();
  };

  const handleClick = () => {
    if (firstName === "") {
      setErrorsFirstName(true);
    }
    if (lastName === "") {
      setErrorsLastName(true);
    }
    if (position === "" || firstName === "" || lastName === "") return null;
    if (props.values.person_list[props.ID].contact_id !== undefined) {
      props.values.person_list[props.ID] = {
        person_id: props.values.person_list[props.ID].person_id,
        contact_id: props.values.person_list[props.ID].contact_id,
        person_position: position,
        person_first_name: firstName,
        person_last_name: lastName,
        person_nick_name: NickName,
        person_birthdate: moment(birthDate).tz("Asia/Bangkok").unix(),
        person_img_url: profileImg,
        person_contact_channel_list: contact,
        person_remark: remark,
      };
    } else {
      props.values.person_list[props.ID] = {
        person_position: position,
        person_first_name: firstName,
        person_last_name: lastName,
        person_nick_name: NickName,
        person_birthdate: moment(birthDate).tz("Asia/Bangkok").unix(),
        person_img_url: profileImg,
        person_contact_channel_list: contact,
        person_remark: remark,
      };
    }
    handleClose();
  };

  const PositionList = [
    {
      name: "เจ้าของโครงการ",
      value: "เจ้าของโครงการ",
    },
    {
      name: "เจ้าของบ้าน",
      value: "เจ้าของบ้าน",
    },
    {
      name: "ผู้บริหาร",
      value: "ผู้บริหาร",
    },
    {
      name: "ผู้จัดการฝ่ายบัญชี",
      value: "ผู้จัดการฝ่ายบัญชี",
    },
    {
      name: "ฝ่ายบัญชี",
      value: "ฝ่ายบัญชี",
    },
    {
      name: "ผู้จัดการฝ่ายจัดซื้อ",
      value: "ผู้จัดการฝ่ายจัดซื้อ",
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
      name: "ฝ่ายประเมินราคา",
      value: "ฝ่ายประเมินราคา",
    },
    {
      name: "ฝ่ายสเปคกลาง",
      value: "ฝ่ายสเปคกลาง",
    },
    {
      name: "ผู้บริหารโครงการ (PM)",
      value: "ผู้บริหารโครงการ (PM)",
    },
    {
      name: "ผู้ออกแบบภายนอก",
      value: "ผู้ออกแบบภายนอก",
    },
    {
      name: "ผู้ออกแบบภายใน",
      value: "ผู้ออกแบบภายใน",
    },
    {
      name: "ผู้ออกแบบภูมิสถาปัตย์",
      value: "ผู้ออกแบบภูมิสถาปัตย์",
    },
    {
      name: "ผู้ออกแบบผังเมือง",
      value: "ผู้ออกแบบผังเมือง",
    },
    {
      name: "ผู้ออกแบบอุตสาหกรรม",
      value: "ผู้ออกแบบอุตสาหกรรม",
    },
    {
      name: "ผู้ออกแบบและผู้รับเหมา (Turn Key)",
      value: "ผู้ออกแบบและผู้รับเหมา (Turn Key)",
    },
    {
      name: "ผู้ช่วยผู้ออกแบบ",
      value: "ผู้ช่วยผู้ออกแบบ",
    },
    {
      name: "ช่างหน้างาน",
      value: "ช่างหน้างาน",
    },
  ];

  const ContactList = [
    {
      name: "เบอร์โทรศัพท์",
      value: "Phone",
    },
    {
      name: "อีเมล",
      value: "Email",
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
      name: "LinkedIn",
      value: "LinkedIn",
    },
    {
      name: "อื่นๆ",
      value: "อื่นๆ",
    },
  ];

  return (
    <div>
      <div className="card-contact" onClick={handleClickOpen}>
        <div className="container">
          <div>
            {/* <div
              className={
                props.values.person_list[props.ID].person_img_url === null
                  ? "image-preview"
                  : "image-item-2"
              }
              style={{
                backgroundImage: `url(${
                  props.values.person_list[props.ID].person_img_url
                })`,
              }}
            /> */}
            <div
              className="img_display"
              style={{
                backgroundImage: `url(${
                  props.values &&
                  props.values.person_list[props.ID].person_img_url
                    ? props.values.person_list[props.ID].person_img_url
                    : Placeholder
                })`,
              }}
            />
          </div>
          <div className="right-side">
            <div className="topic">
              <h4>{props.values.person_list[props.ID].person_position}</h4>
            </div>
            <div>
              <h4>{props.values.person_list[props.ID].person_first_name}</h4>
            </div>
            {props.values.person_list[props.ID]
              .person_contact_channel_list[0] &&
            props.values.person_list[props.ID].person_contact_channel_list[0]
              .contact_channel_name === "เบอร์โทรศัพท์" ? (
              <div>
                <h4>
                  {
                    props.values.person_list[props.ID]
                      .person_contact_channel_list[0].contact_channel_detail
                  }
                </h4>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        {isLoading && (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
        <DialogTitle>
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            เพิ่มบุคคล
            <IconButton type="button" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </h2>
        </DialogTitle>
        <DialogContent>
          <div className="contact-add-person">
            <div className="header">
              <PersonIcon />
              <h3>ข้อมูลส่วนบุคคล</h3>
            </div>
            <div className="grid-container-50">
              <div style={{ gap: "20px", display: "grid" }}>
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">ตำแหน่ง</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={position}
                    label="ตำแหน่ง"
                    onChange={(e) => {
                      setPosition(e.target.value);
                    }}
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
                  autoComplete="off"
                  required
                  error={errorsFirstName}
                  helperText={errorsFirstName && "กรุณากรอก"}
                  id="firstname"
                  label="ชื่อจริง"
                  size="small"
                  value={firstName}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                />
                <TextField
                  autoComplete="off"
                  required
                  id="lastname"
                  error={errorsLastName}
                  helperText={errorsLastName && "กรุณากรอก"}
                  label="นามสกุล"
                  value={lastName}
                  size="small"
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                />
                <TextField
                  autoComplete="off"
                  id="nickname"
                  label="ชื่อเล่น"
                  size="small"
                  value={NickName}
                  onChange={(e) => {
                    setNickName(e.target.value);
                  }}
                />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="วันเกิด"
                    onChange={(e) => {
                      setBirthDate(e);
                    }}
                    value={birthDate}
                    inputFormat="dd/MM/yyyy"
                    mask="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField size="small" {...params} />
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
                        profileImg ? profileImg : Placeholder
                      })`,
                      marginBottom: "10px",
                    }}
                  />
                  <label htmlFor="contained-button-file">
                    <Input
                      accept="image/*"
                      id="contained-button-file"
                      multiple
                      type="file"
                      onChange={(e) => handleClickUploadLogo(e.target.files)}
                    />
                    <Button variant="outlined" component="span">
                      อัพโหลดนามบัตร
                    </Button>
                  </label>
                </div>
              </div>
            </div>
            <hr style={{ margin: "25px 0 " }} />
            <div>
              <div className="header">
                <PhoneIphoneIcon />
                <h3>ช่องทางติดต่อ</h3>
              </div>
              <Button
                variant="outlined"
                color="success"
                sx={{ margin: "20px 0px" }}
                onClick={() => {
                  setContact([
                    ...contact,
                    {
                      contact_channel_name: "เบอร์โทรศัพท์",
                      contact_channel_detail: "",
                      contact_channel_detail_2: "",
                    },
                  ]);
                }}
              >
                เพิ่มช่องทาง
              </Button>
              <div className="contact-channel-wrapper">
                {contact?.map((value, index) => (
                  <>
                    <div
                      className="grid-container-contact-channel-list"
                      key={`${value.contact_channel_name} + ${index}`}
                    >
                      <div>
                        <Autocomplete
                          value={contact[index].contact_channel_name || ""}
                          name={`contact_channel_list[${index}].contact_channel_name`}
                          onChange={(event, newValue) => {
                            if (typeof newValue === "string") {
                              if (newValue.value === undefined) return null;
                              const edit = [...contact];
                              edit[index].contact_channel_name = newValue.value;
                              setContact(edit);
                              console.log(contact);
                            } else if (newValue && newValue.inputValue) {
                              // Create a new value from the user input
                              if (newValue.inputValue === undefined)
                                return null;
                              const edit = [...contact];
                              edit[index].contact_channel_name =
                                newValue.inputValue;
                              setContact(edit);
                            } else {
                              const edit = [...contact];
                              if (newValue === null) {
                                edit[index].contact_channel_name = "";
                                setContact(edit);
                              } else {
                                edit[index].contact_channel_name =
                                  newValue.value;
                                setContact(edit);
                                console.log(contact);
                              }
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
                                name: `เพิ่ม "${inputValue}"`,
                              });
                            }

                            return filtered;
                          }}
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
                        {contact[index].contact_channel_name ===
                        "เบอร์โทรศัพท์" ? (
                          <TextField
                            autoComplete="off"
                            id={`contact[${index}].contact_channel_detail`}
                            label="เบอร์โทรศัพท์"
                            value={contact[index].contact_channel_detail}
                            size="small"
                            onChange={(e) => {
                              const edit = [...contact];
                              edit[index].contact_channel_detail =
                                e.target.value;
                              setContact(edit);
                            }}
                          />
                        ) : (
                          <TextField
                            autoComplete="off"
                            id={`contact[${index}].contact_channel_detail`}
                            label=""
                            value={contact[index].contact_channel_detail}
                            size="small"
                            onChange={(e) => {
                              const edit = [...contact];
                              edit[index].contact_channel_detail =
                                e.target.value;
                              setContact(edit);
                            }}
                          />
                        )}
                      </div>

                      <div>
                        {contact[index].contact_channel_name ===
                          "เบอร์โทรศัพท์" && (
                          <TextField
                            autoComplete="off"
                            id={`contact[${index}].contact_channel_detail_2`}
                            label="ต่อ"
                            sx={{ maxWidth: "70px" }}
                            value={contact[index].contact_channel_detail_2}
                            size="small"
                            onChange={(e) => {
                              const edit = [...contact];
                              edit[index].contact_channel_detail_2 =
                                e.target.value;
                              setContact(edit);
                            }}
                          />
                        )}
                      </div>

                      <div>
                        {index !== 0 ? (
                          <IconButton
                            type="button"
                            onClick={() => {
                              const newContact = contact.filter(
                                (val, i) => index !== i
                              );
                              setContact(newContact);
                            }} // remove a friend from the list
                          >
                            <CloseIcon />
                          </IconButton>
                        ) : null}
                      </div>
                    </div>
                    <hr
                      className="mobile"
                      style={{ borderTop: "1px solid #eee", margin: "5px 0 " }}
                    />
                  </>
                ))}
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  id={`person_list${[props.ID]}.person_remark`}
                  label="หมายเหตุ"
                  size="small"
                  value={remark}
                  onChange={(e) => {
                    setRemark(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <div className="sale-crm-popupAddcontact__footer-button">
            <Button
              onClick={handleDelete}
              variant="outlined"
              type="submit"
              color="success"
              sx={{ width: "130px", marginRight: "16px" }}
            >
              ลบ
            </Button>
            <Button
              variant="contained"
              type="submit"
              color="success"
              sx={{ width: "130px", backgroundColor: "rgba(65, 150, 68, 1)" }}
              onClick={handleClick}
            >
              บันทึก
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}
