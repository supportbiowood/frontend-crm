import React, { useState, useEffect } from "react";
import {
  TextField,
  IconButton,
  Backdrop,
  CircularProgress,
  Stack,
  Breadcrumbs,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
// import moment from "moment";
// import "moment-timezone";

import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../redux/actions/snackbarActions";
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
import { queryItemInventory } from "../../../adapter/Api/graphql";
import BreadcrumbComponent from "../../BreadcrumbComponent";

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
      <GridToolbarExport
        className={"export-button"}
        csvOptions={{
          fileName: "รายงานการเปลี่ยนสถานะโครงการ",
          utf8WithBom: true,
        }}
      />
      <GridToolbarDensitySelector />
      <GridToolbarColumnsButton className={"export-button"} />
    </GridToolbarContainer>
  );
}

const columns = [
  {
    headerName: "ชื่อไทย",
    field: "id",
    flex: 1,
  },
  {
    headerName: "เลขที่โครงการ",
    field: "name",
    flex: 1,
  },
  {
    headerName: "ชื่อโครงการ",
    field: "internalID",
    flex: 1,
  },

  {
    headerName: "ประเภทโครงการ",
    field: "itemType",
    flex: 1,
  },
  {
    headerName: "สถานะงาน",
    field: "orderedQty",
    width: 120,
  },
  {
    headerName: "ลักษณะงาน",
    field: "onHandQty",
    width: 120,
  },
  {
    headerName: "สถานะเดิม",
    field: "netBalance",
    width: 120,
  },
  {
    headerName: "สถานะใหม่",
    field: "committedQty",
    width: 120,
  },
  {
    headerName: "วันที่เปลี่ยน",
    field: "itemCategory",
    flex: 1,
  },
  {
    headerName: "ผู้เปลี่ยน",
    field: "itemCategory1",
    flex: 1,
  },
];

export default function ReportMovementProjectComponent() {
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [cloneData, setCloneData] = useState();
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch();

  useEffect(() => {
    const itemInventoryInput = {};
    queryItemInventory(itemInventoryInput)
      .then((data) => {
        setCloneData([]);
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", `${err}` || "อ่านข้อมูลผิดพลาด"));
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [searchText, setSearchText] = useState("");

  const [filterModel, setFilterModel] = useState({
    items: [],
  });

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
    const filteredRows = cloneData.filter((row) => {
      return Object.keys(row).some((field) => {
        if (typeof row[field] === "string" || typeof row[field] === "number")
          return searchRegex.test(row[field].toString());
        else return false;
      });
    });
    setRows(filteredRows);
  };

  return (
    <div>
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Stack spacing={2}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <BreadcrumbComponent name="การขาย" key="1" to="/sales" />
          <BreadcrumbComponent name="รายงาน" key="2" to="/sales/report" />
          <BreadcrumbComponent
            name="รายงานการเปลี่ยนสถานะโครงการ"
            key="3"
            to="#"
          />
        </Breadcrumbs>
      </Stack>
      <h1 style={{ margin: "15px 0 " }}>รายงานการเปลี่ยนสถานะโครงการ</h1>
      <div className="myTable3">
        <DataGridPro
          rows={rows}
          columns={columns}
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
          pagination
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[10, 20, 30, 40, 50]}
        />
      </div>
    </div>
  );
}
