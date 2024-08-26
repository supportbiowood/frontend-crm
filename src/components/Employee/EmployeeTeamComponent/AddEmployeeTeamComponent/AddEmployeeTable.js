import React, { useState, useEffect } from "react";

import {
  IconButton,
  Backdrop,
  CircularProgress,
  TextField,
  Button,
} from "@mui/material";
import PropTypes from "prop-types";
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

import { createTheme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
//utf8WithBom={true}

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) =>
    createStyles({
      root: {
        padding: theme.spacing(0.5, 0.5, 0),
        justifyContent: "space-between",
        display: "flex",
        alignItems: "flex-start",
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

const tableRows = [
  {
    id: 1,
    employee_id: 1,
    employee_document_id: "EP220300001",
    employee_firstname: "ABC5",
    employee_lastname: "DEF",
    employee_img_url: "",
    employee_position: "หัวหน้า",
    employee_department: "ดูแลระบบ",
    employee_phone: "0828959525",
    employee_status: "active",
    team_document_id: "TM220400018",
    employee_level: 4,
    is_in_charge: 0,
  },
  {
    id: 2,
    employee_id: 2,
    employee_document_id: "EP220300002",
    employee_firstname: "นาย ธนวินทร์",
    employee_lastname: "หล่อบรรจงสุข",
    employee_img_url:
      "https://biowood-bucket.s3.ap-southeast-1.amazonaws.com/CRM/CRM2022-02-03T01%3A24%3A50.501Ztest",
    employee_position: "เซลล์สเปค",
    employee_department: "ขาย",
    employee_phone: "091-7370857",
    employee_status: "active",
    team_document_id: "TM220400018",
    employee_level: 4,
    is_in_charge: 0,
  },
  {
    id: 3,
    employee_id: 10,
    employee_document_id: "EP220300010",
    employee_firstname: "นาย ไพรัตน์",
    employee_lastname: "ยิ้มแก้ว",
    employee_img_url: null,
    employee_position: "เซลล์ต่างจังหวัด",
    employee_department: "ขาย",
    employee_phone: "090-9054479",
    employee_status: "active",
    team_document_id: "TM220400018",
    employee_level: 7,
    is_in_charge: 1,
  },
];

export default function AddEmployeeTable() {
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [isLoading] = useState(false);
  const [selectedImportDocument, setSelectedImportDocument] = useState([]);
  const [rows, setRows] = useState(tableRows);

  useEffect(() => {
    setRows(tableRows);
  }, []);

  // to be continued
  const removeEmployeeHandler = () => {
    setRows((rows) =>
      rows.filter((r) => !selectedImportDocument.includes(r.id))
    );
  };

  const columns = [
    {
      headerName: "รหัสพนักงาน",
      field: "employee_document_id",
      flex: 1,
    },
    {
      headerName: "ระดับ",
      field: "employee_level",
      flex: 1,
      renderCell: (params) => {
        if (params.row.is_in_charge === 1) {
          return "หัวหน้า";
        } else {
          return "พนักงาน";
        }
      },
    },
    {
      headerName: "ชื่อ นามสกุล",
      field: "empoyee_name",
      flex: 1,
      renderCell: (params) => {
        const empoyee_name =
          params.row.employee_firstname + " " + params.row.employee_lastname;
        return empoyee_name;
      },
    },
    {
      headerName: "อีเมล",
      field: "employee_email",
      flex: 1,
    },
    {
      headerName: "แผนก",
      field: "employee_department",
      flex: 1,
    },
    {
      headerName: "ตำแหน่ง",
      field: "employee_position",
      flex: 1,
    },
    {
      headerName: "สถานะ",
      field: "employee_status",
      flex: 1,
    },
    {
      headerName: "ใช้งานล่าสุด",
      field: "employee_last_login",
      flex: 1,
    },
    {
      headerName: "สมัครเมื่อ",
      field: "emplyee_created",
      flex: 1,
    },
  ];

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
    console.log(searchRegex);
    const filteredRows = tableRows.filter((row) => {
      return Object.keys(row).some((field) => {
        if (typeof row[field] === "string")
          return searchRegex.test(row[field].toString());
        else return false;
      });
    });
    setRows(filteredRows);
  };

  const onRowDoubleClick = () => {
    console.log("Employee detial clicked!");
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
      <Button variant="outlined" onClick={removeEmployeeHandler}>
        ลบพนักงาน
      </Button>
      <div style={{ height: 710, width: "100%" }}>
        <DataGridPro
          checkboxSelection
          rows={rows}
          onSelectionModelChange={(ids) => {
            const selectedIDs = new Set(ids);
            const selectedRowData = rows.filter((row) =>
              selectedIDs.has(row.id)
            );
            setSelectedImportDocument(selectedRowData);
          }}
          columns={columns}
          pagination
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[10, 30, 50, 100, 200]}
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
          onRowDoubleClick={(params) => onRowDoubleClick(params)}
        />
      </div>
    </>
  );
}
