import React, { useState } from "react";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, Box, Grid } from "@mui/material";
import { uploadFileToS3 } from "../../../UploadImageToS3WithNativeSdk/UploadImageToS3WithNativeSdk";
import moment from "moment";
import EngineerAttachmentComponent from "../../EngineerAttachmentComponent";
import { getUser } from "../../../../adapter/Auth";

export default function DocumentAccordion({
  setIsLoading,
  disabled,
  formik,
  name,
  label,
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
      uploadFileToS3(file, "EngineerAttachment", user.employee_id)
        .then((data) => {
          console.log("s3 data", data);
          setIsLoading(false);
          formik.setFieldValue(
            name,
            formik.values[name].concat({
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
      name,
      formik.values[name].filter((_, index) => index !== deletedIndex)
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
          <h4>{label}</h4>
        </AccordionSummary>
        <AccordionDetails>
          {!disabled && (
            <Box sx={{ mb: "1rem" }}>
              <label htmlFor={name} className="account__attachment">
                เพิ่มไฟล์
              </label>
              <input
                id={name}
                name={name}
                type="file"
                hidden
                onChange={handleUploadFile}
              />
            </Box>
          )}
          <Grid container spacing={2}>
            {formik.values[name] &&
              formik.values[name].length > 0 &&
              formik.values[name].map((attachment, index) => {
                return (
                  <EngineerAttachmentComponent
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
                    disabled={disabled}
                    deleteAttachmentHandler={deleteAttachmentHandler}
                  />
                );
              })}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
