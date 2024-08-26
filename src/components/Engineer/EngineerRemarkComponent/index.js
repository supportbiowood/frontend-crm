import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  TextField,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useState } from "react";
import { getUser } from "../../../adapter/Auth";
import { uploadFileToS3 } from "../../UploadImageToS3WithNativeSdk/UploadImageToS3WithNativeSdk";
import moment from "moment";
import EngineerAttachmentComponent from "../EngineerAttachmentComponent";

const EngineerRemarkComponent = ({
  disabled,
  formik,
  name,
  remark,
  status,
  setIsLoading,
}) => {
  const user = getUser();
  const [expanded, setExpanded] = useState("panel1");
  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const remarkChangeHandler = (event) => {
    formik.setFieldValue(name, event.target.value);
  };

  const handleUploadFile = (event) => {
    if (event.target.files.length !== 0) {
      setIsLoading(true);
      const file = event.target.files[0];
      uploadFileToS3(file, "EngineerAttachment", user.employee_id)
        .then((data) => {
          setIsLoading(false);
          formik.setFieldValue(
            "remark_attachments",
            formik.values.remark_attachments.concat({
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
      "remark_attachments",
      formik.values.remark_attachments.filter(
        (_, index) => index !== deletedIndex
      )
    );
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
        <h4>หมายเหตุ</h4>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              fullWidth
              disabled={disabled}
              margin="normal"
              size="small"
              id="outlined-multiline-flexible"
              multiline
              onChange={remarkChangeHandler}
              value={remark}
              minRows={5}
              maxRows={5}
            />
          </Grid>
        </Grid>
        {(status === "assigned" ||
          status === "in_progress" ||
          status === "wait_review" ||
          status === "closed") && (
          <Box sx={{ my: "1rem" }}>
            <label htmlFor="closeDocument" className="account__attachment">
              เพิ่มไฟล์
            </label>
            <input
              id="closeDocument"
              name="closeDocument"
              type="file"
              hidden
              onChange={handleUploadFile}
            />
          </Box>
        )}
        <Grid container spacing={2}>
          {formik.values.remark_attachments &&
            formik.values.remark_attachments.length > 0 &&
            formik.values.remark_attachments.map((attachment, index) => (
              <EngineerAttachmentComponent
                key={index}
                index={index}
                filename={attachment.attachment_file_name}
                name={user.employee_firstname + " " + user.employee_lastname}
                url={attachment.attachment_url}
                datetime={moment
                  .unix(attachment._attachment_created)
                  .format("DD/MM/YYYY HH:mm")}
                disabled={disabled}
                deleteAttachmentHandler={deleteAttachmentHandler}
              />
            ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default EngineerRemarkComponent;
