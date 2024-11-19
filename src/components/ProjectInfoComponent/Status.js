import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import moment from "moment";
import "moment-timezone";

export default function Status(props) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const projectList = props.values.project_status_log_list || [];
      const myData = projectList.length > 0
        ? projectList.map((project, index) => ({
            id: index + 1,
            oldStatus: project.old_status || "-",
            newStatus: project.new_status || "-",
            date: moment(project._project_status_log_created, "X")
              .tz("Asia/Bangkok")
              .format("MM/DD/YYYY, HH:MM") || "-",
            updateName: `${project._project_status_log_createdby_employee?.employee_firstname || ""} ${project._project_status_log_createdby_employee?.employee_lastname || ""}` || "-",
          }))
        : [];
      setRows(myData);
    }, 1000);

    // Cleanup function to clear timeout when component unmounts
    return () => clearTimeout(timer);
  }, [props.values]);

  const translateStatus = (data) => {
    const statusTranslations = {
      new: "โครงการใหม่",
      ongoing: "กำลังดำเนินการ",
      quotation: "เสนอราคา",
      closed_success: "ปิดได้",
      closed_fail: "ปิดไม่ได้",
      quotation_accepted: "ยอมรับใบเสนอราคา",
      finished: "จบโครงการ",
      service: "ดูแลงาน",
      service_ended: "ดูแลงานเสร็จสิ้น",
    };
    return statusTranslations[data] || "-";
  };

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
        สถานะ
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#8fcbb1" }}>
              <TableCell align="left">ครั้งที่</TableCell>
              <TableCell align="left">วันที่เปลี่ยน</TableCell>
              <TableCell align="left">อัพเดตโดย</TableCell>
              <TableCell align="left">สถานะเดิม</TableCell>
              <TableCell align="left">สถานะใหม่</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  cursor: "pointer",
                }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="left">{row.date}</TableCell>
                <TableCell align="left">{row.updateName}</TableCell>
                <TableCell align="left">{translateStatus(row.oldStatus)}</TableCell>
                <TableCell align="left">{translateStatus(row.newStatus)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
