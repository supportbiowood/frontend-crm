import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  IconButton,
  Backdrop,
  CircularProgress,
  Tabs,
  Tab,
  TextField,
  Breadcrumbs,
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
import { createStyles, makeStyles, styled } from "@mui/styles";
import { Box } from "@mui/system";
import BreadcrumbComponent from "../../BreadcrumbComponent";
import ButtonComponent from "../../ButtonComponent";
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

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  console.log(value);
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const CustomTabs = styled(Tabs)({
  "& .MuiTabs-indicator": {
    backgroundColor: "unset",
  },
});

const CustomTab = styled((props) => <Tab disableRipple {...props} />)(() => ({
  border: "1px solid rgba(190, 190, 190, 1)",
  width: "fut-content",
  borderRadius: "5px 5px 0 0",
  color: "rgba(190, 190, 190, 1)",
  marginTop: "15px",
  padding: "12px 16px",
  "&.Mui-selected": {
    zIndex: 1,
    heigth: "120%",
    padding: "10px 20px",
    marginTop: "0px",
    borderRadius: "5px 5px 0 0",
    border: "1px solid black",
    fontWeight: "bold",
    fontSize: "16px",
    lineHeight: "26px",
    color: "black",
  },
}));

export default function AccountTableComponent(props) {
  const {
    tableRows,
    tableColumns,
    customTabValue,
    breadcrumbValue,
    heading,
    onRowDoubleClick,
    buttonWithLink,
    isLoading,
    setIsLoading,
    value,
    setValue,
    rows,
    setRows,
    switchTabHandler,
    searchable,
    checkboxSelection,
    setSelectedImportdocument,
  } = props;

  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");

  const columns = tableColumns;

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
    const filteredRows = tableRows.filter((row) => {
      return Object.keys(row).some((field) => {
        if (typeof row[field] === "string")
          return searchRegex.test(row[field].toString());
        else return false;
      });
    });
    setRows(filteredRows);
  };

  useEffect(() => {
    if (setIsLoading) {
      setIsLoading(true);
      setTimeout(() => {
        if (tableRows.length === 0) return setIsLoading(false);
        switchTabHandler();
        setIsLoading(false);
      }, [1000]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (_, newValue) => {
    setValue(newValue);
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
      {breadcrumbValue && (
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          {breadcrumbValue.map((ele, index) => (
            <div key={index}>
              <BreadcrumbComponent name={ele.name} to={ele.to} />
            </div>
          ))}
        </Breadcrumbs>
      )}
      {heading && (
        <div className="grid-container-50">
          <div>
            <h2 className="form-heading">{heading}</h2>
          </div>
          <div className="account__buttonContainer">
            {buttonWithLink && (
              <Link to={buttonWithLink.to}>
                <ButtonComponent
                  type={buttonWithLink.type}
                  text={buttonWithLink.text}
                  variant={buttonWithLink.variant}
                  color={buttonWithLink.color}
                />
              </Link>
            )}
          </div>
        </div>
      )}
      {customTabValue && (
        <Box>
          <CustomTabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            {customTabValue.map((ele, index) => (
              <CustomTab
                key={index}
                style={{ color: ele.color }}
                label={ele.label}
                {...a11yProps(index)}
              />
            ))}
          </CustomTabs>
        </Box>
      )}
      <div style={{ height: 710, width: "100%" }}>
        <DataGridPro
          checkboxSelection={checkboxSelection}
          rows={rows}
          onSelectionModelChange={(ids) => {
            const selectedIDs = new Set(ids);
            console.log("row", rows);
            const selectedRowData = rows.filter((row) =>
              selectedIDs.has(row.id)
            );
            if (setSelectedImportdocument) {
              setSelectedImportdocument(selectedRowData);
            }
          }}
          columns={columns}
          pagination
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[10, 30, 50, 100, 200]}
          components={{
            Toolbar: searchable ? CustomToolbar : null,
          }}
          componentsProps={{
            toolbar: searchable
              ? {
                  value: searchText,
                  onChange: (event) => requestSearch(event.target.value),
                  clearSearch: () => requestSearch(""),
                }
              : null,
          }}
          onRowDoubleClick={(params) =>
            onRowDoubleClick ? onRowDoubleClick(params) : null
          }
        />
      </div>
    </>
  );
}
