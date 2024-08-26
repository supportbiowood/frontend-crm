import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Box, IconButton, TextField } from "@mui/material";
import {
  DataGridPro,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid-pro";
// import { useDemoData } from "@mui/x-data-grid-generator";

import PropTypes from "prop-types";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";

CustomToolbar.propTypes = {
  clearSearch: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function CustomToolbar(props) {
  return (
    <GridToolbarContainer>
      <div>
        <TextField
          type="text"
          size="small"
          id="outlined-error-helper-text"
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

const mockupRow = [
  {
    id: 1,
    hierarchy: ["ฝ่ายขาย 1", "EP220300001"],
    employee_rank: "หัวหน้า",
    employee_name: "ชื่อ นามสกุล",
    employee_email: "email",
    employee_department: "Mocking",
    employee_position: "Mocking",
    employee_status: "active",
    _employee_created: new Date(),
    _employee_lastlogin: new Date(),
  },
  {
    id: 2,
    hierarchy: ["ฝ่ายขาย 1", "EP220300002"],
    employee_rank: "พนักงาน",
    employee_name: "ชื่อ นามสกุล",
    employee_email: "email",
    employee_department: "Mocking",
    employee_position: "Mocking",
    employee_status: "active",
    _employee_created: new Date(),
    _employee_lastlogin: new Date(),
  },
  {
    id: 3,
    hierarchy: ["ฝ่ายขาย 2", "EP220300003"],
    employee_rank: "หัวหน้า",
    employee_name: "ชื่อ นามสกุล",
    employee_email: "email",
    employee_department: "Mocking",
    employee_position: "Mocking",
    employee_status: "active",
    _employee_created: new Date(),
    _employee_lastlogin: new Date(),
  },
  {
    id: 4,
    hierarchy: ["ฝ่ายขาย 2", "EP220300004"],
    employee_rank: "พนักงาน",
    employee_name: "ชื่อ นามสกุล",
    employee_email: "email",
    employee_department: "Mocking",
    employee_position: "Mocking",
    employee_status: "active",
    _employee_created: new Date(),
    _employee_lastlogin: new Date(),
  },
];

const columns = [
  {
    headerName: "ระดับ",
    field: "employee_rank",
    flex: 1,
  },
  {
    headerName: "ชื่อ นามสกุล",
    field: "employee_name",
    flex: 1,
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
    field: "_employee_created",
    type: "date",
    flex: 1,
  },
  {
    headerName: "สมัครเมื่อ",
    field: "_employee_lastlogin",
    type: "date",
    flex: 1,
  },
];

const getTreeDataPath = (row) => row.hierarchy;

export default function EmployeeTeamTable() {
  // Example Payload
  //   const { data } = useDemoData({
  //     dataSet: "Employee",
  //     rowLength: 1000,
  //     treeData: { maxDepth: 2, groupingField: "name", averageChildren: 200 },
  //   });
  //   console.log(data);
  const history = useHistory();
  const [pageSize, setPageSize] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [rows, setRows] = useState(mockupRow);

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
    const filteredRows = mockupRow.filter((row) => {
      return Object.keys(row).some((field) => {
        return searchRegex.test(row[field].toString());
      });
    });
    setRows(filteredRows);
  };

  const onRowDoubleClick = (params) => {
    let team_document_id = params.row.team_document_id;
    history.push("/employee/team/" + team_document_id);
  };

  return (
    <Box
      sx={{
        height: 800,
        width: "100%",
        "& .team-header": {
          bgcolor: "#E9F6EA",
          "&:hover": {
            backgroundColor: "#E9F6EA !important",
          },
          "&.Mui-selected": {
            backgroundColor: "#E9F6EA !important",
          },
        },
      }}
    >
      <DataGridPro
        treeData
        rows={rows}
        columns={columns}
        pagination
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[5, 10, 20, 30, 50]}
        groupingColDef={{
          headerName: "รหัสพนักงาน",
          flex: 1,
        }}
        getTreeDataPath={getTreeDataPath}
        defaultGroupingExpansionDepth={1}
        getRowClassName={(params) => {
          const uniqueClassName = Object.keys(params.row).length;
          if (uniqueClassName === 0) {
            return `team-header`;
          }
        }}
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
    </Box>
  );
}
