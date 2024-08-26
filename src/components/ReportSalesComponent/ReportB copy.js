import React, { useState, useEffect } from "react";

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

function getFullName(params) {
  return `${params.getValue(params.id, "firstName") || ""} ${
    params.getValue(params.id, "lastName") || ""
  }`;
}

function setFullName(params) {
  console.log(params);
  const [firstName, lastName] = params.value.toString().split(" ");
  console.log(firstName, lastName);
  return { ...params.row, firstName, lastName };
}

const columns = [
  { field: "firstName", headerName: "First name", editable: true },
  {
    field: "lastName",
    headerName: "Last name",
    width: 130,
    editable: true,
    valueSetter: () => {
      console.log("AB");
    },
  },
  {
    field: "fullName",
    headerName: "Full name",
    width: 160,
    editable: true,
    valueGetter: getFullName,
    valueSetter: setFullName,
  },
  {
    field: "Role",
    headerName: "Role",
    width: 160,
    valueGetter: (params) => {
      return `${params.getValue(params.id, "meta").department || ""} ${
        params.getValue(params.id, "meta").position || ""
      }`;
    },
    renderCell: (params) => {
      return <strong>{params.getValue(params.id, "meta").department}</strong>;
    },
  },
];

export default function ReportB() {
  const data = [
    {
      id: 1,
      lastName: "Snow",
      firstName: "Jon",
      meta: { department: "Sales", position: "Manager" },
    },
    {
      id: 2,
      lastName: "Lannister",
      firstName: "Cersei",
      meta: { department: "Sales", position: "Supervisor" },
    },
    {
      id: 3,
      lastName: "Lannister",
      firstName: "Jaime",
      meta: { department: "Sales", position: "Supervisor" },
    },
    {
      id: 4,
      lastName: "Stark",
      firstName: "Arya",
      meta: { department: "Sales", position: "Supervisor" },
    },
    {
      id: 5,
      lastName: "Targaryen",
      firstName: "Daenerys",
      meta: { department: "Sales", position: "Supervisor" },
    },
  ];

  const [sortModel, setSortModel] = useState([
    {
      field: "firstName",
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
  const [rows, setRows] = useState(data);

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
    const filteredRows = data.filter((row) => {
      return Object.keys(row).some((field) => {
        if (typeof row[field] == "string")
          return searchRegex.test(row[field].toString());
        else return false;
      });
    });
    setRows(filteredRows);
  };

  return (
    <div>
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
  );
}
