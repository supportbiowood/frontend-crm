import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ItemInventoryCardComponent from "../ItemInventoryCardComponent";
import moment from "moment";
import "moment-timezone";
import {
  IconButton,
  Button,
  Backdrop,
  CircularProgress,
  Tabs,
  Tab,
  TextField,
  Breadcrumbs,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Box } from "@mui/system";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/actions/snackbarActions";
import { queryGoodreceiptItem } from "../../adapter/Api/graphql";
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

const renderReceiptType = (data) => {
  if (data === "PURCHASE") {
    return "ซื้อ";
  } else if (data === "TRANSFER") {
    return "โอนเข้า";
  } else if (data === "SALES_RETURN") {
    return "รับคืน";
  } else {
    return "อื่นๆ";
  }
};

const columns = [
  {
    headerName: "รหัสนำเข้า",
    field: "id",
    width: 150,
  },
  {
    headerName: "วันที่นำเข้า",
    field: "documentDate",
    width: 120,
  },
  {
    headerName: "วันที่ออกเอกสาร",
    field: "createdAt",
    width: 120,
  },
  {
    headerName: "ประเภทการนำเข้า",
    field: "receiptType",
    width: 200,
    renderCell: (params) => <div>{params.row.receiptType}</div>,
  },
  {
    headerName: "เลขที่เอกสารอ้างอิง",
    field: "listDocumentReference",
    width: 200,
  },
  {
    headerName: "คลังปลายทาง",
    field: "warehouseID",
    width: 120,
  },
  {
    headerName: "นำเข้าโดย",
    field: "employeeName",
    width: 120,
  },
  {
    headerName: "สถานะ",
    field: "status",
    width: 150,
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

export default function GoodsReceiptComponent() {
  const [isLoading, setIsLoading] = useState(true);
  const [itemCount, setItemCount] = useState(1);
  const [value, setValue] = useState(0);
  const [rows, setRows] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [cloneData, setCloneData] = useState([]);
  const dispatch = useDispatch();
  const date = new Date();

  useEffect(() => {
    queryGoodreceiptItem()
      .then((data) => {
        const setData = data.data.data.listGoodsReceiptDocument.items.map(
          (data, index) => {
            return {
              ...data,
              index: index + 1,
              documentDate: moment(data.documentDate)
                .tz("Asia/Bangkok")
                .format("DD/MM/YYYY"),
              createdAt: moment(data.createdAt)
                .tz("Asia/Bangkok")
                .format("DD/MM/YYYY"),
              status: data.status !== null ? data.status : "DRAFT",
              receiptType: renderReceiptType(data.receiptType),
              listDocumentReference:
                data.listDocumentReference !== null &&
                data.listDocumentReference.length !== 0
                  ? data.listDocumentReference[0].documentID
                  : "",
            };
          }
        );
        const sorting = setData.sort((a, b) => {
          return b.index - a.index;
        });
        setRows(sorting);
        setCloneData(sorting);
        setItemCount(data.data.data.listGoodsReceiptDocument.items.length);
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", `${err}` || "โหลดข้อมูลผิดพลาด"));
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      if (cloneData.length === 0) return setIsLoading(false);
      if (value === 0) {
        setRows(cloneData);
      } else if (value === 1) {
        const newData = cloneData.filter((data) => {
          return data.status === "DRAFT";
        });
        setRows(newData);
      } else if (value === 2) {
        const newData = cloneData.filter((data) => {
          return data.status === "CLOSED";
        });
        setRows(newData);
      } else {
        const newData = cloneData.filter((data) => {
          return data.status === "CANCELED";
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
    <div className="good-receipt-main">
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <BreadcrumbComponent name="คลังสินค้า" key="1" to="/inventory" />
        <BreadcrumbComponent name="นำเข้า" key="2" to="#" />
      </Breadcrumbs>
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <h2 style={{ margin: "15px 0" }}>รายการเอกสารนำเข้า</h2>
      <div className="card-inventory-layout">
        <ItemInventoryCardComponent
          header="รายการทั้งหมด"
          value={itemCount}
          update={`${moment(date).tz("Asia/Bangkok").format("MM/DD/YYYY")}`}
        />
      </div>
      <div className="grid-container-50">
        <div className="button-left-layout"></div>
        <div className="button-right-layout">
          <Link to="/inventory/good-recieve/add">
            <Button variant="contained" type="text">
              สร้าง
            </Button>
          </Link>
        </div>
      </div>
      <Box>
        <CustomTabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <CustomTab label="ทั้งหมด" {...a11yProps(0)} />
          <CustomTab label="ร่าง" {...a11yProps(1)} />
          <CustomTab label="สำเร็จ" {...a11yProps(2)} />
          <CustomTab label="ยกเลิก" {...a11yProps(3)} />
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
            console.log(params.row);
            window.location.href =
              "/inventory/good-recieve/" + txSeries + "&" + ID;
          }}
        />
      </div>
    </div>
  );
}
