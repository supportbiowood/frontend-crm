import React, { useState, useEffect, useRef } from "react";
import ButtonComponent from "../ButtonComponent";
import {
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  TextField,
  Dialog,
  MenuItem,
  Select,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";
import "moment-timezone";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CardWarrantyAttachment from "../CardComponent/CardWarrantyAttachment";
import { uploadFileToS3 } from "../UploadImageToS3WithNativeSdk/UploadImageToS3WithNativeSdk";
import { Link } from "react-router-dom";
import PopUpAlertComponent from "../ModalComponent/AlertComponent";

export default function Warranty(props) {
  const uploadFileRef = useRef();
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState();
  const [expanded, setExpanded] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [warrantyName, setWarrantyName] = useState("");
  const [warrantyStatus, setWarrantyStatus] = useState("");
  const [warrantyAttachment, setWarrantyAttachment] = useState([]);
  const [rowNumber, setRowNumber] = useState();
  const [errorWarrantyType, setErrorWarrantyType] = useState(false);
  const [errorWarrantyName, setErrorWarrantyName] = useState(false);
  const [errorWarrantyStatus, setErrorWarrantyStatus] = useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const [openPopUp, setOpenPopUp] = useState(false);

  const [open, setOpen] = useState(false);
  const [openTable, setOpenTable] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickTableOpen = (id) => {
    setRowNumber(id);
    setOpenTable(true);
  };

  const handleClose = async () => {
    await setOpen(false);
    await resetValue();
  };

  const handleCloseTable = async () => {
    await setOpenTable(false);
    await resetValue();
  };

  const resetValue = () => {
    setValue("");
    setWarrantyName("");
    setWarrantyStatus("");
    setWarrantyAttachment([]);
    const dateStart = moment(new Date(), "X")
      .tz("Asia/Bangkok")
      .format("MM/DD/YYYY, HH:MM");
    const dateEnd = moment(new Date(), "X")
      .tz("Asia/Bangkok")
      .format("MM/DD/YYYY, HH:MM");
    setStartDate(dateStart);
    setEndDate(dateEnd);
    setErrorWarrantyType(false);
    setErrorWarrantyName(false);
    setErrorWarrantyStatus(false);
  };

  const filter = createFilterOptions();

  const handleClick = () => {
    if (value === "") {
      setErrorWarrantyType(true);
    }
    if (warrantyName === "") {
      setErrorWarrantyName(true);
    }
    if (warrantyStatus === "") {
      setErrorWarrantyStatus(true);
    }
    if (value === "" || warrantyName === "" || warrantyStatus === "")
      return null;
    const CloneFieldValue = props.values.warranty_list;
    CloneFieldValue?.push({
      warranty_type: value?.value,
      warranty_name: warrantyName,
      warranty_start_date: moment(startDate).tz("Asia/Bangkok").unix(),
      warranty_end_date: moment(endDate).tz("Asia/Bangkok").unix(),
      warranty_approver_name: warrantyStatus,
      warranty_attachment_list: warrantyAttachment,
      warranty_status: warrantyStatus,
    });
    props.setFieldValue("FieldValue", CloneFieldValue);
    setWarrantyAttachment([]);
    handleClose();
  };

  const handleUpdate = () => {
    if (props.values.warranty_list[rowNumber].warranty_id !== undefined) {
      props.values.warranty_list[rowNumber] = {
        warranty_id: props.values.warranty_list[rowNumber].warranty_id,
        project_id: props.values.warranty_list[rowNumber].project_id,
        warranty_type: value?.value,
        warranty_name: warrantyName,
        warranty_start_date: moment(startDate).tz("Asia/Bangkok").unix(),
        warranty_end_date: moment(endDate).tz("Asia/Bangkok").unix(),
        warranty_approver_name:
          props.values.warranty_list[rowNumber].warranty_approver_name,
        warranty_attachment_list: warrantyAttachment,
        warranty_status: warrantyStatus,
      };
    } else {
      props.values.warranty_list[rowNumber] = {
        warranty_type: value?.value,
        warranty_name: warrantyName,
        warranty_start_date: moment(startDate).tz("Asia/Bangkok").unix(),
        warranty_end_date: moment(endDate).tz("Asia/Bangkok").unix(),
        warranty_approver_name:
          props.values.warranty_list[rowNumber].warranty_approver_name,
        warranty_attachment_list: warrantyAttachment,
        warranty_status: warrantyStatus,
      };
    }
    setWarrantyAttachment([]);
    handleCloseTable();
  };
  const onButtonClickLogo = () => {
    uploadFileRef.current.click();
  };

  const handleClickUploadFile = (files) => {
    if (files.length !== 0) {
      const file = files[0];
      uploadFileToS3(file, "CRM", "test")
        .then((data) => {
          const clone = [...warrantyAttachment];
          clone.push({
            attachment_file_name: file.name,
            attachment_file_type: file.type,
            attachment_url: data.Location,
          });
          setWarrantyAttachment(clone);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const deleteData = (ID) => {
    const Clone = [...props.values.warranty_list];
    const deleteValue = Clone[rowNumber].warranty_attachment_list.filter(
      (val, index) => {
        return `${ID}` !== `${index}`;
      }
    );
    props.setFieldValue("warranty_list", deleteValue);
    resetValue();
    setOpen(false);
  };

  const deleteFile = (id) => {
    const clone = [...warrantyAttachment];

    const deleteFile = clone.filter((val, index) => {
      return `${index}` !== `${id}`;
    });
    setWarrantyAttachment(deleteFile);
    setOpenPopUp(false);
  };

  const WarrantyType = [
    { name: "สินค้า", value: "product" },
    { name: "งานติดตั้ง", value: "installment" },
    { name: "บริการ", value: "service" },
  ];

  const status = [
    {
      name: "รออนุมัติ",
      value: "submitted",
    },
    {
      name: "อนุมัติ",
      value: "approved",
    },
    {
      name: "หมด Warranty(กรณีเลยวันที่สิ้นสุด)",
      value: "expired",
    },
  ];

  useEffect(() => {
    if (props.values.warranty_list.length === 0) {
      setRows(undefined);
    } else {
      const myData = props.values.warranty_list.map((warranty, index) => {
        return {
          id: index + 1,
          category: valueType(warranty.warranty_type) || "-",
          name: warranty.warranty_name,
          dateStart: moment(warranty.warranty_start_date, "X")
            .tz("Asia/Bangkok")
            .format("MM/DD/YYYY, HH:MM"),
          dateEnd: moment(warranty.warranty_end_date, "X")
            .tz("Asia/Bangkok")
            .format("MM/DD/YYYY, HH:MM"),
          file:
            warranty.warranty_attachment_list &&
            warranty.warranty_attachment_list.map((val) => {
              return `${val.attachment_file_name}`;
            }),
          status: valueType(warranty.warranty_status),
        };
      });
      setRows(myData);
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.values, open, openTable]);

  const valueType = (data) => {
    if (data === "installment") {
      return "งานติดตั้ง";
    } else if (data === "product") {
      return "สินค้า";
    } else if (data === "service") {
      return "บริการ";
    } else if (data === "approved") {
      return "อนุมัติ";
    } else if (data === "submitted") {
      return "รออนุมัติ";
    } else if (data === "expired") {
      return "หมด Warranty";
    }
  };

  useEffect(() => {
    if (rowNumber !== undefined) {
      setValue(
        valueType(props.values.warranty_list[rowNumber].warranty_type) || ""
      );
      setWarrantyName(
        props.values.warranty_list[rowNumber].warranty_name || ""
      );
      setWarrantyStatus(
        props.values.warranty_list[rowNumber].warranty_status || ""
      );
      setWarrantyAttachment(
        props.values.warranty_list[rowNumber].warranty_attachment_list || []
      );
      const dateStart = moment(
        props.values.warranty_list[rowNumber].warranty_start_date,
        "X"
      )
        .tz("Asia/Bangkok")
        .format("MM/DD/YYYY, HH:MM");
      const dateEnd = moment(
        props.values.warranty_list[rowNumber].warranty_end_date,
        "X"
      )
        .tz("Asia/Bangkok")
        .format("MM/DD/YYYY, HH:MM");
      setStartDate(dateStart);
      setEndDate(dateEnd);
    } else return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openTable]);

  if (isLoading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
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
            การรับประกัน
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className="project-info__btn-wrapper">
            <Button
              variant="outlined"
              onClick={handleClickOpen}
              color="success"
            >
              {" "}
              เพิ่มการรับประกัน
            </Button>
            <Dialog open={open} onClose={handleClose}>
              <DialogContent>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "16px",
                  }}
                >
                  การรับประกัน
                  <IconButton type="button" onClick={handleClose}>
                    <CloseIcon />
                  </IconButton>
                </Typography>
                <div className="sale-crm-popupAddcontact__form-layout">
                  <div className="grid-container-50">
                    <Autocomplete
                      onChange={(event, newValue) => {
                        if (typeof newValue === "string") {
                          setValue({
                            name: newValue,
                          });
                        } else if (newValue && newValue.inputValue) {
                          // Create a new value from the user input
                          console.log(newValue);
                          setValue({
                            name: newValue.inputValue,
                          });
                        } else {
                          console.log(newValue);
                          setValue(newValue);
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
                      style={{ marginBottom: "16px" }}
                      selectOnFocus
                      clearOnBlur
                      handleHomeEndKeys
                      id="ประเภท"
                      options={WarrantyType}
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
                      size="small"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="ประเภท"
                          error={errorWarrantyType}
                          helperText={errorWarrantyType && "กรุณากรอก"}
                        />
                      )}
                    />
                    <TextField
                      style={{ marginBottom: "16px" }}
                      error={errorWarrantyName}
                      helperText={errorWarrantyName && "กรุณากรอก"}
                      label="ชื่อ Warranty"
                      size="small"
                      onChange={(e) => {
                        setWarrantyName(e.target.value);
                      }}
                    />
                  </div>

                  <div
                    className="grid-container-50"
                    style={{ marginBottom: "16px" }}
                  >
                    <div className="grid-container-50">
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          onChange={(e) => {
                            setStartDate(e);
                          }}
                          value={startDate}
                          label="วันที่เริ่ม"
                          inputFormat="dd/MM/yyyy"
                          renderInput={(params) => (
                            <TextField size="small" {...params} />
                          )}
                        />
                      </LocalizationProvider>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          onChange={(e) => {
                            setEndDate(e);
                          }}
                          label="วันที่สิ้นสุด"
                          value={endDate}
                          inputFormat="dd/MM/yyyy"
                          renderInput={(params) => (
                            <TextField size="small" {...params} />
                          )}
                        />
                      </LocalizationProvider>
                    </div>
                    <FormControl
                      fullWidth
                      size="small"
                      sx={{ margin: "10px 0" }}
                      error={errorWarrantyStatus}
                    >
                      <InputLabel id="demo-simple-select-label">
                        สถานะ
                      </InputLabel>
                      <Select
                        fullWidth
                        size="small"
                        id="demo-simple-select"
                        name="project_address.country"
                        value={warrantyStatus}
                        label="สถานะ"
                        onChange={(e) => {
                          setWarrantyStatus(e.target.value);
                        }}
                      >
                        {status.map((val, index) => (
                          <MenuItem key={index} value={val.value}>
                            {val.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText sx={{ color: "#d32f2f" }}>
                        {errorWarrantyStatus && "กรุณากรอก"}
                      </FormHelperText>
                    </FormControl>
                  </div>

                  <div className="sale-crm-popupAddcontact__footer-button"></div>
                </div>
                <div>
                  <Typography
                    sx={{
                      width: "33%",
                      flexShrink: 0,
                      fontWeight: "bold",
                      fontSize: "24px",
                      lineHeight: "28px",
                      whiteSpace: "nowrap",
                      marginBottom: "16px",
                    }}
                  >
                    เอกสารแนบ
                  </Typography>
                  <Typography>
                    <div>
                      <div className="attachment-card__upload-btn">
                        <input
                          type="file"
                          id="file"
                          ref={uploadFileRef}
                          onChange={(e) =>
                            handleClickUploadFile(e.target.files)
                          }
                          style={{ display: "none" }}
                        />
                        <ButtonComponent
                          onClick={onButtonClickLogo}
                          text="เพิ่มไฟล์"
                          variant="outlined"
                          color="success"
                          type="button"
                          sx={{ width: "130px", marginRight: "26px" }}
                        />
                      </div>
                      <div className="grid-container-50">
                        {warrantyAttachment.map((val, index) => (
                          <div>
                            <Link
                              to={{ pathname: val.attachment_url }}
                              target="_blank"
                            >
                              <CardWarrantyAttachment
                                key={
                                  "AttachmentFile =" + val.attachment_file_name
                                }
                                topic={val.attachment_file_name}
                                size="style.small"
                                ID={index}
                                delete={deleteData}
                                values={warrantyAttachment}
                              />
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Typography>
                </div>
              </DialogContent>
              <DialogActions>
                <Button
                  variant="contained"
                  type="submit"
                  color="success"
                  onClick={handleClick}
                  sx={{
                    width: "130px",
                    backgroundColor: "rgba(65, 150, 68, 1)",
                  }}
                >
                  เพิ่ม
                </Button>
              </DialogActions>
            </Dialog>
          </div>
          {props.values.warranty_list[0] === undefined ? (
            ""
          ) : (
            <Typography style={{ marginBottom: "24px" }}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="right">ลำดับที่</TableCell>
                      <TableCell align="right">ประเภท</TableCell>
                      <TableCell align="right">ชื่อการรับประกัน</TableCell>
                      <TableCell align="right">วันที่เริ่ม</TableCell>
                      <TableCell align="right">วันที่สิ้นสุด</TableCell>
                      <TableCell align="right">เอกสาร</TableCell>
                      <TableCell align="right">สถานะ</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows &&
                      rows.map((row, index) => (
                        <TableRow
                          onClick={() => handleClickTableOpen(index)}
                          key={row.id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                            cursor: "pointer",
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {row.id}
                          </TableCell>
                          <TableCell align="right">{row.category}</TableCell>
                          <TableCell align="right">{row.name}</TableCell>
                          <TableCell align="right">{row.dateStart}</TableCell>
                          <TableCell align="right">{row.dateEnd}</TableCell>
                          <TableCell align="right">{row.file}</TableCell>
                          <TableCell align="right">{row.status}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Dialog open={openTable} onClose={handleCloseTable}>
                <DialogContent>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "16px",
                    }}
                  >
                    การรับประกัน
                    <IconButton type="button" onClick={handleCloseTable}>
                      <CloseIcon />
                    </IconButton>
                  </Typography>
                  <div className="sale-crm-popupAddcontact__form-layout">
                    <div className="grid-container-50">
                      <Autocomplete
                        value={value}
                        onChange={(event, newValue) => {
                          if (typeof newValue === "string") {
                            setValue({
                              name: newValue,
                            });
                          } else if (newValue && newValue.inputValue) {
                            // Create a new value from the user input
                            setValue({
                              name: newValue.inputValue,
                            });
                          } else {
                            console.log(newValue);
                            setValue(newValue);
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
                        style={{ marginBottom: "16px" }}
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        id="ประเภท"
                        options={WarrantyType}
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
                        size="small"
                        renderInput={(params) => (
                          <TextField {...params} label="ประเภท" />
                        )}
                      />
                      <TextField
                        style={{ marginBottom: "16px" }}
                        label="ชื่อ Warranty"
                        value={warrantyName}
                        size="small"
                        onChange={(e) => {
                          setWarrantyName(e.target.value);
                        }}
                      />
                    </div>

                    <div
                      className="grid-container-50"
                      style={{ marginBottom: "16px" }}
                    >
                      <div className="grid-container-50">
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            onChange={(e) => {
                              setStartDate(e);
                            }}
                            value={startDate}
                            label="วันที่เริ่ม"
                            inputFormat="dd/MM/yyyy"
                            renderInput={(params) => (
                              <TextField size="small" {...params} />
                            )}
                          />
                        </LocalizationProvider>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <DatePicker
                            onChange={(e) => {
                              setEndDate(e);
                            }}
                            label="วันที่สิ้นสุด"
                            value={endDate}
                            inputFormat="dd/MM/yyyy"
                            renderInput={(params) => (
                              <TextField size="small" {...params} />
                            )}
                          />
                        </LocalizationProvider>
                      </div>
                      <FormControl
                        fullWidth
                        size="small"
                        sx={{ margin: "10px 0" }}
                      >
                        <InputLabel id="demo-simple-select-label">
                          สถานะ
                        </InputLabel>
                        <Select
                          fullWidth
                          size="small"
                          id="demo-simple-select"
                          name="project_address.country"
                          value={warrantyStatus}
                          label="สถานะ"
                          onChange={(e) => {
                            setWarrantyStatus(e.target.value);
                          }}
                        >
                          {status.map((val, index) => (
                            <MenuItem key={index} value={val.value}>
                              {val.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>

                    <div className="sale-crm-popupAddcontact__footer-button"></div>
                  </div>
                  <div>
                    <Typography
                      sx={{
                        width: "33%",
                        flexShrink: 0,
                        fontWeight: "bold",
                        fontSize: "24px",
                        lineHeight: "28px",
                        whiteSpace: "nowrap",
                        marginBottom: "16px",
                      }}
                    >
                      เอกสารแนบ
                    </Typography>
                    <Typography>
                      <div>
                        <div className="attachment-card__upload-btn">
                          <input
                            type="file"
                            id="file"
                            ref={uploadFileRef}
                            onChange={(e) =>
                              handleClickUploadFile(e.target.files)
                            }
                            style={{ display: "none" }}
                          />
                          <ButtonComponent
                            onClick={onButtonClickLogo}
                            text="เพิ่มไฟล์"
                            variant="outlined"
                            color="success"
                            type="button"
                            sx={{ width: "130px", marginRight: "26px" }}
                          />
                        </div>
                        <div className="grid-container-50">
                          {warrantyAttachment.map((val, index) => (
                            <div>
                              <CardWarrantyAttachment
                                key={
                                  "AttachmentFile =" + val.attachment_file_name
                                }
                                topic={val.attachment_file_name}
                                size="style.small"
                                ID={index}
                                values={warrantyAttachment}
                              />
                              <div
                                className="attachment-delete-btn"
                                onClick={() => setOpenPopUp(true)}
                              >
                                ลบ
                              </div>
                              <PopUpAlertComponent
                                status={openPopUp}
                                handleClose={() => setOpenPopUp(false)}
                                setOpen={setOpenPopUp}
                                title="ต้องการลบข้อมูลใช่หรือไม่"
                                deleteButtonOnClick={() => deleteFile(index)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </Typography>
                  </div>
                </DialogContent>

                <DialogActions>
                  {warrantyAttachment.map((val, index) => (
                    <ButtonComponent
                      onClick={() => deleteData(index)}
                      text="ลบ"
                      variant="outlined"
                      color="success"
                      type="button"
                      sx={{ width: "130px", marginRight: "26px" }}
                    />
                  ))}
                  <Button
                    variant="contained"
                    type="submit"
                    color="success"
                    onClick={handleUpdate}
                    sx={{
                      width: "130px",
                      backgroundColor: "rgba(65, 150, 68, 1)",
                    }}
                  >
                    บันทึก
                  </Button>
                </DialogActions>
              </Dialog>
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
