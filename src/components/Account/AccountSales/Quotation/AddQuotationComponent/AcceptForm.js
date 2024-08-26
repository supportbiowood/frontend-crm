import React, { useState } from "react";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  Autocomplete,
  Box,
  createFilterOptions,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { uploadFileToS3 } from "../../../../UploadImageToS3WithNativeSdk/UploadImageToS3WithNativeSdk";
import moment from "moment";
import AttachmentCardComponent from "../../../AccountAttachmentComponent";
import { getUser } from "../../../../../adapter/Auth";

const filter = createFilterOptions();

const defaultValue = [{ title: "ใบสั่งซื้อจากลูกค้า" }];

export default function AcceptForm({
  setIsLoading,
  disabled,
  formik,
  handleAcceptDateChange,
}) {
  const user = getUser();
  const [expanded, setExpanded] = useState("panel1");
  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleUploadFile = (event) => {
    if (event.target.files.length !== 0) {
      setIsLoading(true);
      const file = event.target.files[0];
      uploadFileToS3(file, "QuotationAttachment", user.employee_id)
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
          <h4>ยอบรับใบเสนอราคา</h4>
        </AccordionSummary>
        <AccordionDetails>
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: ".5rem",
              }}
            >
              <Typography sx={{ mr: "1rem" }}>ลูกค้ายอมรับเมื่อ</Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                  disabled={disabled}
                  inputFormat="dd/MM/yyyy"
                  value={formik.values.quotation_accept_date}
                  onChange={handleAcceptDateChange}
                  renderInput={(params) => (
                    <TextField sx={{ width: 150 }} size="small" {...params} />
                  )}
                />
              </LocalizationProvider>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: "1rem",
              }}
            >
              <Typography sx={{ mr: "2rem" }}>เอกสารอ้างอิง</Typography>
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
                sx={{ width: 200 }}
                freeSolo
                renderInput={(params) => (
                  <TextField {...params} label="เลือกเอกสารอ้างอิง" />
                )}
              />
            </Box>
            {!disabled && (
              <Box sx={{ mb: "1rem" }}>
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
            <Grid container spacing={2}>
              {formik.values.attachment_list &&
                formik.values.attachment_list.length > 0 &&
                formik.values.attachment_list.map((attachment, index) => (
                  <AttachmentCardComponent
                    key={index}
                    index={index}
                    filename={attachment.attachment_file_name}
                    name={
                      user.employee_firstname + " " + user.employee_lastname
                    }
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
          </Box>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
