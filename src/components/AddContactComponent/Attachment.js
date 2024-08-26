import React, { useState, useRef } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import CardContactAttachment from "../CardComponent/CardContactAttachment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ButtonComponent from "../ButtonComponent";
import { uploadFileToS3 } from "../UploadImageToS3WithNativeSdk/UploadImageToS3WithNativeSdk";
import { Link } from "react-router-dom";

export default function Attachment(props) {
  const uploadFileRef = useRef();
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);

  console.log(open);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const onButtonClickLogo = () => {
    uploadFileRef.current.click();
  };

  const handleClickUploadFile = (files) => {
    if (files.length !== 0) {
      const file = files[0];
      uploadFileToS3(file, "CRM", "test")
        .then((data) => {
          const Clone = props.values.attachment_list;
          Clone.push({
            attachment_file_name: file.name,
            attachment_file_type: file.type,
            attachment_url: data.Location,
          });
          props.setFieldValue("attachment_list", Clone);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const deleteData = (ID) => {
    const Clone = [...props.values.attachment_list];
    const deleteValue = Clone.filter((val, index) => {
      return `${ID}` !== `${index}`;
    });
    props.setFieldValue("attachment_list", deleteValue);
    setOpen(false);
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
          aria-controls="panel1a-content"
          id="panela-header"
        >
          <h2>ไฟล์แนบ (Attachment)</h2>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <div className="attachment-card__upload-btn">
              {/* <input id="fileUpload" name="fileUpload" onChange={handleInputFile} ref={inputFile} hidden type="file" /> */}
              <input
                type="file"
                id="file"
                ref={uploadFileRef}
                onChange={(e) => handleClickUploadFile(e.target.files)}
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
            <div className="grid-container-25">
              {props.values.attachment_list?.map((val, index) => (
                <div key={`${val.attachment_url + val.index}`}>
                  <Link to={{ pathname: val.attachment_url }} target="_blank">
                    <CardContactAttachment
                      key={"AttachmentFile =" + val.attachment_file_name}
                      topic={val.attachment_file_name}
                      size="style.small"
                      ID={index}
                      values={props.values}
                      setFieldValue={props.setFieldValue}
                    />
                  </Link>
                  <div
                    className="attachment-delete-btn"
                    onClick={(e) => {
                      if (window.confirm("ต้องการลบไฟล์นี้ใช่หรือไม่"))
                        deleteData(index);
                    }}
                  >
                    ลบ
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
