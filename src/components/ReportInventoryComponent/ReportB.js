import React, { useState, useEffect } from "react";
import ButtonComponent from "../../components/ButtonComponent";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/actions/snackbarActions";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";

import {
  DataGridPro,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid-pro";

import { getAllEmployee } from "../../adapter/Api";

import moment from "moment";
import "moment-timezone";

import Placeholder from "../../images/placeholder.jpeg";
import Avatar from "@mui/material/Avatar";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

CustomToolbar.propTypes = {
  clearSearch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

function CustomToolbar(props) {
  return (
    <GridToolbarContainer>
      <div>
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

const columns = [
  { field: "employee_id", headerName: "ID", width: 100 },
  {
    field: "employee_img_url",
    headerName: "รูปภาพ",
    renderCell: (params) => {
      return <Avatar src={params.value ? params.value : Placeholder} />;
    },
  },
  { field: "employee_firstname", headerName: "ชื่อจริง" },
  { field: "employee_lastname", headerName: "นามสกุล" },
  { field: "employee_department", headerName: "แผนก" },
  { field: "employee_position", headerName: "ตำแหน่ง" },
  {
    field: "_employee_lastupdate",
    headerName: "วันที่ใช้งานล่าสุด",
    renderCell: (params) => {
      return (
        <div>
          {params.value == 0
            ? "-"
            : moment(params.value, "X")
                .tz("Asia/Bangkok")
                .format("MM/DD/YYYY, HH:MM")}
        </div>
      );
    },
  },
  {
    field: "_employee_created",
    headerName: "วันที่สร้าง",
    renderCell: (params) => {
      return (
        <div>
          {params.value == 0
            ? "-"
            : moment(params.value, "X")
                .tz("Asia/Bangkok")
                .format("MM/DD/YYYY, HH:MM")}
        </div>
      );
    },
  },
  { field: "employee_status", headerName: "สถานะ" },
];

export default function ReportB() {
  const [allEmployees, setAllEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    getAllEmployee()
      .then((data) => {
        if (data.data.status == "success") {
          console.log("Employee", data.data.data);
          let myData = data.data.data;
          setAllEmployees(myData);
          myData.forEach((item, i) => {
            // console.log(item);
            item.id = i + 1;
          });
          console.log("myData", myData);
          setRows(myData);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(showSnackbar("error", "ไม่สามารถเรียกข้อมูลได้"));
        setIsLoading(false);
      });
  }, []);

  const [sortModel, setSortModel] = useState([
    {
      field: "employee_id",
      sort: "asc",
    },
  ]);

  const [filterModel, setFilterModel] = React.useState({
    items: [
      //   {
      //     id: 1,
      //     columnField: "lastName",
      //     operatorValue: "contains",
      //     value: "Lannister",
      //   },
    ],
  });

  const [searchText, setSearchText] = useState("");
  const [rows, setRows] = useState([]);

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
    const filteredRows = allEmployees.filter((row) => {
      return Object.keys(row).some((field) => {
        if (typeof row[field] == "string")
          return searchRegex.test(row[field].toString());
        else return false;
      });
    });
    setRows(filteredRows);
  };

  return (
    <>
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <BreadcrumbComponent name="การขาย" to="/sales" />
        <BreadcrumbComponent name="รายงาน" to="/sales/report" />
        <BreadcrumbComponent name="บุคคลติดต่อ" to="/sales/report/5" />
      </Breadcrumbs>
      <div className="myTable">
        <DataGridPro
          rows={rows}
          columns={columns}
          sortModel={sortModel}
          onSortModelChange={(model) => setSortModel(model)}
          filterModel={filterModel}
          className="data-grid"
          onFilterModelChange={(model) => setFilterModel(model)}
          components={{
            Toolbar: CustomToolbar,
          }}
          componentsProps={{
            toolbar: {
              value: searchText,
              onChange: (event) => requestSearch(event.target.value),
              clearSearch: () => requestSearch(""),
            },
          }}
        />
      </div>
    </>
  );
}
