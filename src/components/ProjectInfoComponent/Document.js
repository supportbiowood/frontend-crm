import React from "react";
import Typography from "@mui/material/Typography";
import CardContactAttachment from "../CardComponent/CardContactAttachment";
import moment from "moment";
import "moment-timezone";

export default function Document(props) {
  return (
    <div>
      <Typography
        sx={{
          width: "33%",
          flexShrink: 0,
          fontWeight: "bold",
          fontSize: "24px",
          lineHeight: "28px",
          marginBottom: "24px",
          whiteSpace: "nowrap",
        }}
      >
        เอกสารที่เกี่ยวข้อง
      </Typography>
      <div className="grid-container-33">
        {props.values.project_document_list.length === 0 ? (
          <h3>ไม่มีเอกสารที่เกี่ยวข้อง</h3>
        ) : (
          props.values.project_document_list?.map((val, index) => {
            return (
              <CardContactAttachment
                key={"AttachmentFile =" + val.attachment_file_name}
                topic={val.attachment_file_name}
                name={val._attachment_createdby}
                date={moment(val._attachment_created, "X")
                  .tz("Asia/Bangkok")
                  .format("MM/DD/YYYY, HH:MM")}
                size="style.small"
                ID={index}
                values={props.values}
                setFieldValue={props.setFieldValue}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
