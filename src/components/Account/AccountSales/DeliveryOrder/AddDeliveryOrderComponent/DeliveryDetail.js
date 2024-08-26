import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Autocomplete,
  createFilterOptions,
} from "@mui/material";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { uploadFileToS3 } from "../../../../UploadImageToS3WithNativeSdk/UploadImageToS3WithNativeSdk";
import AttachmentCardComponent from "../../../AccountAttachmentComponent";
import moment from "moment";
import { getUser } from "../../../../../adapter/Auth";

const defaultValue = [
  { title: "ลายเซ็นลูกค้า" },
  {
    title: "รูปถ่าย",
  },
];

const allStatus = [
  {
    status: "closed",
    label: "เสร็จสิ้น",
  },
  {
    status: "not_complete",
    label: "ไม่สำเร็จ",
  },
  {
    status: "cancelled",
    label: "ยกเลิก",
  },
];

const filter = createFilterOptions();

const DeliveryDetail = ({
  setIsLoading,
  disabled,
  formik,
  status,
  changeStatusWhenApproved,
}) => {
  const user = getUser();
  const [expanded, setExpanded] = useState("panel1");
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleUploadFile = (event) => {
    if (event.target.files.length !== 0) {
      setIsLoading(true);
      const file = event.target.files[0];
      uploadFileToS3(file, "DeliveryOrder", user.employee_id)
        .then((data) => {
          setIsLoading(false);
          formik.setFieldValue(
            "attachment_list",
            formik.values.attachment_list.concat({
              attachment_file_name: file.name,
              attachment_file_type: file.type,
              attachment_url: data.Location,
              _attachment_created: moment().unix(),
              _attachment_createdby_employee: {
                ...user,
              },
            })
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const deleteAttachmentHandler = (deletedIndex) => {
    formik.setFieldValue(
      "attachment_list",
      formik.values.attachment_list.filter((_, index) => index !== deletedIndex)
    );
  };

  console.log("status", formik.values.delivery_note_status);

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
          <Typography component="div">
            <h4>รายละเอียดการส่ง</h4>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <Typography>วันที่</Typography>
              <Typography>สถานะจัดส่ง</Typography>
              {formik.values.delivery_note_status === "not_complete" && (
                <Typography sx={{ mb: "13rem" }}>หมายเหตุ</Typography>
              )}
              <Typography>หลักฐานอ้างอิง</Typography>
              <Typography>ชื่อผู้รับ</Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  name="pickup_date"
                  label="วันที่รับ"
                  disabled={disabled}
                  inputFormat="dd/MM/yyyy"
                  value={formik.values.pickup_date}
                  onChange={(newValue) =>
                    formik.setFieldValue("pickup_date", newValue)
                  }
                  renderInput={(params) => (
                    <TextField sx={{ width: 155 }} size="small" {...params} />
                  )}
                />
              </LocalizationProvider>
              <FormControl sx={{ width: 300 }} size="small">
                <Select
                  disabled={disabled}
                  labelId="delivery_note_status"
                  id="delivery_note_status"
                  name="delivery_note_status"
                  value={
                    formik.values.delivery_note_status === "wait_delivery"
                      ? ""
                      : formik.values.delivery_note_status
                  }
                  onChange={formik.handleChange}
                >
                  {allStatus.map((status, index) => (
                    <MenuItem key={index} value={status.status}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {formik.values.delivery_note_status === "not_complete" && (
                <TextField
                  disabled={disabled}
                  margin="normal"
                  size="small"
                  multiline
                  id="not_complete_reason"
                  name="not_complete_reason"
                  onChange={formik.handleChange}
                  value={formik.values.not_complete_reason}
                  minRows={9}
                  maxRows={9}
                />
              )}
              <Autocomplete
                disabled={disabled}
                size="small"
                value={formik.values.attachment_remark}
                onChange={(_, newValue) => {
                  if (typeof newValue === "string") {
                    formik.setFieldValue("attachment_remark", newValue);
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    formik.setFieldValue(
                      "attachment_remark",
                      newValue.inputValue
                    );
                  } else {
                    formik.setFieldValue(
                      "attachment_remark",
                      newValue?.title || ""
                    );
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
                sx={{ width: 300 }}
                freeSolo
                renderInput={(params) => <TextField {...params} />}
              />
              <TextField
                sx={{ width: 300 }}
                autoComplete="off"
                type="text"
                id="consignee_name"
                name="consignee_name"
                value={formik.values.consignee_name}
                onChange={formik.handleChange}
                disabled={disabled}
                size="small"
              />
            </Box>
          </Box>
          {!disabled && (
            <Box sx={{ my: "1rem" }}>
              <label htmlFor="file" className="account__attachment">
                เพิ่มไฟล์
              </label>
              <input
                id="file"
                name="file"
                type="file"
                hidden
                onChange={handleUploadFile}
              />
            </Box>
          )}
          <Grid container spacing={2} sx={{ mt: "1rem" }}>
            {formik.values.attachment_list &&
              formik.values.attachment_list.length > 0 &&
              formik.values.attachment_list.map((attachment, index) => (
                <AttachmentCardComponent
                  key={index}
                  index={index}
                  filename={attachment.attachment_file_name}
                  name={user.employee_firstname + " " + user.employee_lastname}
                  url={attachment.attachment_url}
                  datetime={moment
                    .unix(attachment._attachment_created)
                    .format("DD/MM/YYYY HH:mm")}
                  formik={formik}
                  disabled={disabled}
                  deleteAttachmentHandler={deleteAttachmentHandler}
                />
              ))}
          </Grid>
          {(status === "wait_delivery" || status === "not_complete") && (
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" onClick={changeStatusWhenApproved}>
                บันทึก
              </Button>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default DeliveryDetail;
