import React, { useState } from "react";
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
  DialogContent,
  Input,
} from "@mui/material";
import moment from "moment";
import "moment-timezone";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { uploadFileToS3 } from "../UploadImageToS3WithNativeSdk/UploadImageToS3WithNativeSdk";
import Placeholder from "../../images/placeholder.jpeg";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/actions/snackbarActions";

import { createFilterOptions } from "@mui/material/Autocomplete";
const filter = createFilterOptions();

export default function ModalAddPersonComponent(props) {
  const [profileImg, setProfileImg] = useState("");
  const [position, setPosition] = useState("ผู้บริหาร");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [NickName, setNickName] = useState("");
  const [remark, setRemark] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [contact, setContact] = useState([
    {
      contact_channel_name: "เบอร์โทรศัพท์",
      contact_channel_detail: "",
      contact_channel_detail_2: "",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorsFirstName, setErrorsFirstName] = useState(false);
  const [errorsLastName, setErrorsLastName] = useState(false);

  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setValue();
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

  const setValue = () => {
    setPosition("ผู้บริหาร");
    setFirstName("");
    setLastName("");
    setNickName("");
    setBirthDate(new Date());
    setRemark("");
    setProfileImg("");
    setContact([
      {
        contact_channel_name: "เบอร์โทรศัพท์",
        contact_channel_detail: "",
        contact_channel_detail_2: "",
      },
    ]);
    setErrorsFirstName(false);
    setErrorsLastName(false);
  };

  const handleClick = () => {
    if (firstName === "") {
      setErrorsFirstName(true);
    }
    if (lastName === "") {
      setErrorsLastName(true);
    }
    if (position === "" || firstName === "" || lastName === "") return null;
    const Clone = [...props.values.person_list];
    Clone.push({
      person_position: position,
      person_first_name: firstName,
      person_last_name: lastName,
      person_nick_name: NickName,
      person_birthdate: moment(birthDate).tz("Asia/Bangkok").unix(),
      person_img_url: profileImg,
      person_contact_channel_list: contact,
      person_remark: remark,
    });
    props.setFieldValue("person_list", Clone);
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
      <Button variant="outlined" onClick={handleClickOpen} color="success">
        เพิ่มบุคคลติดต่อ
      </Button>
      <Dialog open={open} onClose={handleClose} fullScreen={fullScreen}>
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
              <div style={{ display: "grid", gap: "20px" }}>
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
                  id="firstname"
                  autoComplete="off"
                  label="ชื่อจริง"
                  error={errorsFirstName}
                  helperText={errorsFirstName && "กรุณากรอก"}
                  required
                  size="small"
                  fullWidth
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                />
                <TextField
                  fullWidth
                  id="lastname"
                  error={errorsLastName}
                  helperText={errorsLastName && "กรุณากรอก"}
                  autoComplete="off"
                  label="นามสกุล"
                  required
                  size="small"
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                />
                <TextField
                  fullWidth
                  autoComplete="off"
                  id="nickname"
                  label="ชื่อเล่น"
                  size="small"
                  onChange={(e) => {
                    setNickName(e.target.value);
                  }}
                />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="วันเกิด"
                    onChange={(e, value) => {
                      console.log(e);
                      setBirthDate(e);
                    }}
                    value={birthDate}
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
                onClick={() =>
                  setContact([
                    ...contact,
                    {
                      contact_channel_name: "เบอร์โทรศัพท์",
                      contact_channel_detail: "",
                      contact_channel_detail_2: null,
                    },
                  ])
                }
              >
                เพิ่มช่องทาง
              </Button>
              <div className="contact-channel-wrapper">
                {contact.map((value, index) => (
                  <>
                    <div className="grid-container-contact-channel-list">
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
                            value={contact[index].contact_channel_detail_2}
                            size="small"
                            sx={{ maxWidth: "70px" }}
                            onChange={(e) => {
                              const edit = [...contact];
                              edit[index].contact_channel_detail_2 =
                                e.target.value;
                              setContact(edit);
                              console.log(contact);
                            }}
                          />
                        )}
                      </div>
                      {index !== 0 ? (
                        <div>
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
                        </div>
                      ) : null}
                    </div>
                    <hr
                      className="mobile"
                      style={{ borderTop: "1px solid #eee", margin: "5px 0 " }}
                    />
                  </>
                ))}
              </div>
              <div>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  id="remark"
                  label="หมายเหตุ"
                  size="small"
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
              variant="contained"
              type="submit"
              color="success"
              sx={{ width: "130px", backgroundColor: "rgba(65, 150, 68, 1)" }}
              onClick={handleClick}
            >
              เพิ่มบุคคล
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}
