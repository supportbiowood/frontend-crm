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
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";

import {
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid-pro";

import { createTheme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";

export default function History(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState();

  const defaultTheme = createTheme();
  const useStyles = makeStyles(
    (theme) =>
      createStyles({
        root: {
          padding: theme.spacing(0.5, 0.5, 0),
          justifyContent: "space-between",
          display: "flex",
          alignItems: "flex-start",
          flexWrap: "wrap",
        },
        textField: {
          [theme.breakpoints.down("xs")]: {
            width: "100%",
          },
          margin: theme.spacing(1, 0.5, 1.5),
          "& .MuiSvgIcon-root": {
            marginRight: theme.spacing(0.5),
          },
          "& .MuiInput-underline:before": {
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
        },
      }),
    { defaultTheme }
  );

  const translateStatus = (data) => {
    if (data === "cancelled") return "ยกเลิกนัด";
    if (data === "planned") return "วางแผน";
    if (data === "scheduled") return "นัดหมาย";
    if (data === "checkin") return "เช็คอิน";
    if (data === "finished") return "เสร็จสิ้น";
    return "-";
  };

  useEffect(() => {
    const myData =
      props.values.event_list !== [] &&
      props.values.event_list.map((event, index) => {
        if (event.event_status === "cancelled") {
          return {
            id: index + 1,
            date:
              event.event_plan_start_date && event.event_plan_end_date
                ? `ยกเลิก: ${moment(event.event_plan_start_date, "X")
                    .tz("Asia/Bangkok")
                    .format("DD/MM/YYYY, HH:mm")} - ${moment(
                    event.event_plan_end_date,
                    "X"
                  )
                    .tz("Asia/Bangkok")
                    .format("DD/MM/YYYY, HH:mm")}`
                : "-",
            location: event.event_dest_location_name,
            name: `${event._event_createdby_employee.employee_firstname} ${event._event_createdby_employee.employee_lastname}`,
            topic: event.event_topic,
            status: event.event_status,
          };
        } else if (event.event_status === "planned") {
          return {
            id: index + 1,
            date:
              event.event_plan_start_date && event.event_plan_end_date
                ? `นัดหมาย: ${moment(event.event_plan_start_date, "X")
                    .tz("Asia/Bangkok")
                    .format("DD/MM/YYYY, HH:mm")} - ${moment(
                    event.event_plan_end_date,
                    "X"
                  )
                    .tz("Asia/Bangkok")
                    .format("DD/MM/YYYY, HH:mm")}`
                : "-",
            location: event.event_dest_location_name,
            name: `${event._event_createdby_employee.employee_firstname} ${event._event_createdby_employee.employee_lastname}`,
            topic: event.event_topic,
            status: event.event_status,
          };
        } else if (event.event_status === "scheduled") {
          return {
            id: index + 1,
            date:
              event.event_schedule_start_date && event.event_schedule_end_date
                ? `วางแผน: ${moment(event.event_schedule_start_date, "X")
                    .tz("Asia/Bangkok")
                    .format("DD/MM/YYYY, HH:mm")} -
          ${moment(event.event_schedule_end_date, "X")
            .tz("Asia/Bangkok")
            .format("DD/MM/YYYY, HH:mm")}`
                : "-",
            location: event.event_dest_location_name,
            name: `${event._event_createdby_employee.employee_firstname} ${event._event_createdby_employee.employee_lastname}`,
            topic: event.event_topic,
            status: event.event_status,
          };
        } else if (event.event_status === "checkin") {
          return {
            id: index + 1,
            date: event.event_checkin_start_date
              ? `เช็คอิน: ${moment(event.event_checkin_start_date, "X")
                  .tz("Asia/Bangkok")
                  .format("DD/MM/YYYY, HH:mm")}`
              : "-",
            location: event.event_dest_location_name,
            name: `${event._event_createdby_employee.employee_firstname} ${event._event_createdby_employee.employee_lastname}`,
            topic: event.event_topic,
            status: event.event_status,
          };
        } else if (event.event_status === "finished") {
          return {
            id: index + 1,
            date:
              event.event_checkin_start_date && event.event_checkin_dest_date
                ? `เสร็จสิ้น: ${moment(event.event_checkin_start_date, "X")
                    .tz("Asia/Bangkok")
                    .format("DD/MM/YYYY, HH:mm")} -
          ${moment(event.event_checkin_dest_date, "X")
            .tz("Asia/Bangkok")
            .format("DD/MM/YYYY, HH:mm")}`
                : "-",
            location: event.event_dest_location_name,
            name: `${event._event_createdby_employee.employee_firstname} ${event._event_createdby_employee.employee_lastname}`,
            topic: event.event_topic,
            status: event.event_status,
          };
        } else {
          return {};
        }
      });
    setIsLoading(false);
    setRows(myData);
  }, [props.values]);

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

  CustomToolbar.propTypes = {
    clearSearch: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
  };

  function CustomToolbar(props) {
    const classes = useStyles();
    return (
      <GridToolbarContainer>
        <div className={classes.root}>
          <TextField
            type="text"
            size="small"
            id="outlined-error-helper-text"
            // variant="standard"
            value={props.value}
            onChange={props.onChange}
            placeholder="ค้นหา"
            className={"search-input-table"}
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" />,
              endAdornment: (
                <IconButton
                  title="Clear"
                  aria-label="Clear"
                  size="small"
                  style={{ visibility: props.value ? "visible" : "hidden" }}
                  onClick={props.clearSearch}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              ),
            }}
          />
        </div>
        <GridToolbarFilterButton className={"export-button"} />
        <GridToolbarExport className={"export-button"} />
        <GridToolbarDensitySelector className={"export-button"} />
        <GridToolbarColumnsButton className={"export-button"} />
      </GridToolbarContainer>
    );
  }

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
        ประวัติการประชุม
      </Typography>
      <Typography style={{ marginBottom: "24px" }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#8fcbb1" }}>
                <TableCell align="left">ครั้งที่</TableCell>
                <TableCell align="left">วันที่ประชุม</TableCell>
                <TableCell align="left">สถานที่</TableCell>
                <TableCell align="left">ชื่อ - นามสกุล</TableCell>
                <TableCell align="left">หัวข้อ</TableCell>
                <TableCell align="left">สถานะ</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows &&
                rows.map((row) => (
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
                    <TableCell align="left">{row.location}</TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">{row.topic}</TableCell>
                    <TableCell align="left">
                      {translateStatus(row.status)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Typography>
    </div>
  );
}
