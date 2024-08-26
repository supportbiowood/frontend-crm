import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ButtonComponent from "../ButtonComponent";
import {
  IconButton,
  Backdrop,
  CircularProgress,
  Tabs,
  Tab,
  TextField,
  Breadcrumbs,
} from "@mui/material";
import { Box } from "@mui/system";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import moment from "moment";
import "moment-timezone";

import {
  DataGridPro,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid-pro";

import { queryInventoryCountingItem } from "../../adapter/Api/graphql";

import { createTheme } from "@mui/material/styles";
import { createStyles, makeStyles, styled } from "@mui/styles";
import { Link } from "react-router-dom";
import BreadcrumbComponent from "../BreadcrumbComponent";

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

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

const CustomTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    border: "1px solid rgba(190, 190, 190, 1) !important",
    width: "139px !important",
    borderRadius: "5px 5px 0 0 !important",
    color: "rgba(190, 190, 190, 1) !important",
    marginTop: "15px !important",
    padding: "12px 16px !important",
    "&.Mui-selected": {
      zIndex: 1,
      heigth: "120%",
      padding: "10px 20px",
      marginTop: "0px !important",
      borderRadius: "5px 5px 0 0 ",
      border: "1px solid black",
      fontWeight: "bold",
      fontSize: "16px",
      lineHeight: "26px",
      color: "black !important",
    },
  })
);

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
      <GridToolbarExport className={"export-button"} />
      <GridToolbarDensitySelector className={"export-button"} />
      <GridToolbarColumnsButton className={"export-button"} />
    </GridToolbarContainer>
  );
}

const columns = [
  {
    headerName: "เลขที่เอกสาร",
    field: "id",
    width: "200",
  },
  {
    headerName: "คลังที่ปรับลดยอด",
    field: "warehouseID",
    width: "120",
  },
  {
    headerName: "วันที่ปรับลดยอด",
    field: "documentDate",
    width: "120",
  },
  {
    headerName: "วันที่ออกเอกสาร",
    field: "createdAt",
    width: "120",
  },
  {
    headerName: "วันที่ยืนยัน",
    field: "name",
    width: "120",
  },
  {
    headerName: "จำนวนจริง",
    field: "quantityReference",
    width: "120",
  },
  {
    headerName: "ส่วนต่าง",
    field: "quantityDiff",
    width: "120",
  },
  {
    headerName: "ปรับลดยอดโดย",
    field: "createBy",
    width: "120",
  },
  {
    headerName: "อนุมัติโดย",
    field: "approveBy",
    width: "150",
  },
  {
    headerName: "สถานะ",
    field: "status",
    width: "150",
    renderCell: (params) => (
      <div>
        {params.row.status === "CLOSED" && (
          <div className="inventoryMaster-active-cell">
            <div>สำเร็จ</div>
          </div>
        )}
        {params.row.status === "DRAFT" && (
          <div className="inventoryMaster-notActive-cell">
            <div>ร่าง</div>
          </div>
        )}
        {params.row.status === "CANCELED" && (
          <div className="inventoryMaster-cancel-cell">
            <div>ยกเลิก</div>
          </div>
        )}
      </div>
    ),
  },
];

export default function StockCountComponent() {
  const [rows, setRows] = useState([]);
  const [cloneData, setCloneData] = useState([]);
  const [value, setValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    queryInventoryCountingItem().then((data) => {
      console.log(data.data.data.listInventoryCountingDocument.items);
      const myData = data.data.data.listInventoryCountingDocument.items.map(
        (doc, index) => {
          return {
            ...doc,
            index: index,
            documentDate: moment(doc.documentDate)
              .tz("Asia/Bangkok")
              .format("DD/MM/YYYY"),
            createdAt: moment(doc.createdAt)
              .tz("Asia/Bangkok")
              .format("DD/MM/YYYY"),
            status: doc.status !== null ? doc.status : "DRAFT",
          };
        }
      );
      const sorting = myData.sort((a, b) => {
        return b.index - a.index;
      });
      setRows(sorting);
      setCloneData(sorting);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      if (cloneData.length === 0) return setIsLoading(false);
      if (value === 0) {
        setRows(cloneData);
        setIsLoading(false);
      } else if (value === 1) {
        const newData = cloneData.filter((data) => {
          return data.status === "DRAFT";
        });
        setRows(newData);
      } else if (value === 2) {
        const newData = cloneData.filter((data) => {
          return data.status === "WAIT_APPROVE";
        });
        setRows(newData);
      } else {
        const newData = cloneData.filter((data) => {
          return data.status === "CLOSED";
        });
        setRows(newData);
      }
      setIsLoading(false);
    }, [1000]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [searchText, setSearchText] = useState("");
  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
    const filteredRows = cloneData.filter((row) => {
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
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <BreadcrumbComponent name="คลังสินค้า" key="1" to="/inventory" />
        <BreadcrumbComponent name="ปรับลดยอด" key="2" to="#" />
      </Breadcrumbs>
      <h2 style={{ margin: "15px 0" }}>ปรับลดยอด</h2>
      <div style={{ textAlign: "end" }}>
        <Link to="stock-count/add">
          <ButtonComponent
            text="สร้าง"
            type="button"
            variant="contained"
            color="success"
          />
        </Link>
      </div>
      <Box>
        <CustomTabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <CustomTab label="ทั้งหมด" {...a11yProps(0)} />
          <CustomTab label="ร่าง" {...a11yProps(1)} />
          <CustomTab label="รออนุมัติ" {...a11yProps(2)} />
          <CustomTab label="อนุมัติ" {...a11yProps(3)} />
        </CustomTabs>
      </Box>
      <div className="myTable3">
        <DataGridPro
          rows={rows}
          columns={columns}
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
          onRowDoubleClick={(params, event) => {
            let ID = params.row.id;
            let txSeries = params.row.txSeries;
            window.location.href = "stock-count/" + txSeries + "&" + ID;
          }}
        />
      </div>
    </div>
  );
}
