import { Button, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import MovementFilter from "./MovementFilter";
import AccountAttachmentComponent from "../AccountAttachmentComponent";
import moment from "moment";

const filterByDateOptions = [
  {
    label: "จากเก่าไปใหม่",
    value: "asc",
  },
  {
    label: "จากใหม่ไปเก่า",
    value: "desc",
  },
];

const filterByTypeOptions = [
  {
    label: "สร้าง",
    value: "create",
  },
  {
    label: "แก้ไข",
    value: "edit",
  },
  {
    label: "บันทึก",
    value: "save",
  },
  {
    label: "คัดลอก",
    value: "copy",
  },
  {
    label: "เปลี่ยนสถานะ",
    value: "change_status",
  },
  {
    label: "เพิ่มไฟล์",
    value: "add_file",
  },
  {
    label: "เพิ่มผู้รับผิดชอบร่วม",
    value: "add_staff",
  },
  {
    label: "ลบผู้รับผิดชอบร่วม",
    value: "delete_staff",
  },
  {
    label: "ยอมรับใบเสนอราคา",
    value: "accept",
  },
];

const MovementHeader = ({
  movementDescription,
  movementDescriptionChangeHandler,
  files,
  uploadFileHandler,
  deleteFileHandler,
  saveMovementHandler,
  sortMethodChangeHandler,
  user,
}) => {
  const [filteredDate, setFilteredDate] = useState("asc");
  const [filteredActivityType, setFilteredActivityType] = useState("");

  const filterByDateHandler = (event) => {
    setFilteredDate(event.target.value);
    sortMethodChangeHandler(event.target.value);
  };

  const filterByTypeHandler = (event) => {
    setFilteredActivityType(event.target.value);
  };

  return (
    <>
      <div className="grid-container-75">
        <TextField
          fullWidth
          placeholder="รายละเอียด"
          multiline
          rows={3}
          value={movementDescription}
          onChange={movementDescriptionChangeHandler}
        />
        <div>
          <div className="fileUpload">
            <input
              type="file"
              id="file"
              className="upload"
              onChange={uploadFileHandler}
            />
            <div>เพิ่มไฟล์</div>
          </div>

          <Button variant="contained" onClick={saveMovementHandler}>
            บันทึก
          </Button>
        </div>
      </div>
      <Grid container spacing={2}>
        {files &&
          files.map((file, index) => (
            <AccountAttachmentComponent
              key={index}
              index={index}
              filename={file.attachment_file_name}
              name={user.employee_firstname + " " + user.employee_lastname}
              url={file.attachment_url}
              datetime={moment
                .unix(file._attachment_created)
                .format("DD/MM/YYYY HH:mm")}
              // disabled={disabled}
              deleteAttachmentHandler={deleteFileHandler}
            />
          ))}
      </Grid>
      <div className="grid-container-50">
        <div className="grid-container-50">
          <MovementFilter
            filterType="date"
            label="การเรียงลำดับ"
            options={filterByDateOptions}
            value={filteredDate}
            filterFunc={filterByDateHandler}
          />
          <MovementFilter
            filterType="activityType"
            label="ประเภทการเคลื่อนไหว"
            options={filterByTypeOptions}
            value={filteredActivityType}
            filterFunc={filterByTypeHandler}
          />
        </div>
      </div>
    </>
  );
};

export default MovementHeader;
