import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";

import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { createTheme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";

import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  gridClasses,
} from "@mui/x-data-grid";

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) =>
    createStyles({
      root: {
        padding: theme.spacing(0.5, 0.5, 0),
      },
      textField: {
        [theme.breakpoints.down("xs")]: {
          width: "100%",
        },
        margin: theme.spacing(1, 0.5, 1.5),
        "& .MuiSvgIcon-root": {
          marginRight: theme.spacing(1),
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
    <GridToolbarContainer className={gridClasses.toolbarContainer}>
      <div>
        <TextField
          type="text"
          size="small"
          id="outlined-error-helper-text"
          // variant="standard"
          value={props.value}
          onChange={props.onChange}
          placeholder="ค้นหา"
          className={classes.textField}
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
      <GridToolbarExport className={"export-button"} />
    </GridToolbarContainer>
  );
}

export default function TableComponent(props) {
  const [data, setData] = useState([
    {
      id: 1,
      col1: "Hello",
      col2: "World",
      col3: { a: "Q" },
      col4: "A",
    },
    {
      id: 2,
      col1: "DataGrid",
      col2: "is Awesome",
      col3: { a: "W" },
      col4: "B",
    },
    {
      id: 3,
      col1: "ABC",
      col2: "is Awesome",
      col3: { a: "E" },
      col4: "C",
    },
  ]);

  const columns = [
    { field: "col1", headerName: "Column 1", width: 200 },
    { field: "col2", headerName: "Column 2" },
    {
      field: "col3",
      headerName: "Column 3",
      renderCell: (params) => {
        return <strong>{params.value.a}</strong>;
      },
    },
    { field: "col4", headerName: "Column 4" },
  ];

  const [rows, setRows] = useState(data);

  const [sortModel, setSortModel] = useState([
    {
      field: "col1",
      sort: "asc",
    },
  ]);

  const [filterModel, setFilterModel] = useState({
    items: [],
  });

  const [searchText, setSearchText] = useState("");


const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
    const filteredRows = data.filter((row) => {
      return Object.keys(row).some((field) => {
        if(typeof row[field] == "string") return searchRegex.test(row[field].toString());
        else return false
      });
    });
    setRows(filteredRows);
  };

  useEffect(() => {
    setRows(rows);
  }, [rows]);

  return (
    <>
      <div className="myTable">
        <DataGrid
          rows={rows}
          columns={columns}
          sortModel={sortModel}
          onSortModelChange={(model) => setSortModel(model)}
          filterModel={filterModel}
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
