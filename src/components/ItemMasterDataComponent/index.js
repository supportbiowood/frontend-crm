import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Tabs,
  Tab,
  TextField,
  IconButton,
  Backdrop,
  CircularProgress,
  Button,
  Stack,
  Breadcrumbs,
} from "@mui/material";
import ItemInventoryCardComponent from "../ItemInventoryCardComponent";
import moment from "moment";
import "moment-timezone";
import { Link } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";

import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/actions/snackbarActions";
import {
  DataGridPro,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid-pro";

// import { getAllItem } from "../../adapter/Api/query";

import { createTheme } from "@mui/material/styles";
import { createStyles, makeStyles, styled } from "@mui/styles";
import { queryItemInventory } from "../../adapter/Api/graphql";
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

function getAvaliable(params) {
  if (params.row.inventoryUOMID === "")
    return `${
      params.getValue(params.id, "onHandQty") -
      params.getValue(params.id, "committedQty") +
      params.getValue(params.id, "orderedQty")
    }`;
  return `${
    params.getValue(params.id, "onHandQty") -
    params.getValue(params.id, "committedQty") +
    params.getValue(params.id, "orderedQty")
  } - ${params.getValue(params.id, "inventoryUOMID")}`;
}

const columns = [
  {
    headerName: "รหัสสินค้า",
    field: "id",
    flex: 1,
  },
  {
    headerName: "ชื่อสินค้า",
    field: "name",
    flex: 1,
  },
  {
    headerName: "ชื่อภายใน",
    field: "internalID",
    flex: 1,
  },
  {
    headerName: "ซื้อ",
    field: "orderedQty",
    width: 120,
    // แสดงผล
    renderCell: (params) => (
      <div>
        {params.row.inventoryUOMID === "" ? (
          <div>{params.value}</div>
        ) : (
          <div>
            {params.value} - {params.row.inventoryUOMID}
          </div>
        )}
      </div>
    ),
  },
  {
    headerName: "คงคลัง",
    field: "onHandQty",
    width: 120,
    renderCell: (params) => (
      <div>
        {params.row.inventoryUOMID === "" ? (
          <div>{params.value}</div>
        ) : (
          <div>
            {params.value} - {params.row.inventoryUOMID}
          </div>
        )}
      </div>
    ),
  },
  {
    headerName: "คงเหลือสุทธิ",
    field: "netBalance",
    width: 120,
    valueGetter: getAvaliable,
  },
  {
    headerName: "จอง",
    field: "committedQty",
    width: 120,
    renderCell: (params) => (
      <div>
        {params.row.inventoryUOMID === "" ? (
          <div>{params.value}</div>
        ) : (
          <div>
            {params.value} - {params.row.inventoryUOMID}
          </div>
        )}
      </div>
    ),
  },
  {
    headerName: "หมวดหมู่สินค้า 1",
    field: "itemCategory",
    flex: 1,
  },
  {
    headerName: "หมวดหมู่สินค้า 2",
    field: "itemCategory1",
    flex: 1,
  },
  {
    headerName: "หมวดหมู่สินค้า 3",
    field: "itemCategory2",
    width: 170,
  },
  {
    headerName: "หมวดหมู่สินค้า 4",
    field: "itemCategory3",
    width: 170,
  },
  {
    headerName: "สถานะ",
    field: "isActive",
    flex: 1,
    renderCell: (params) => (
      <div>
        {params.row.isActive === "ใช้งาน" ? (
          <div className="inventoryMaster-active-cell">
            <div>ใช้งาน</div>
          </div>
        ) : (
          <div className="inventoryMaster-cancel-cell">
            <div>ไม่ใช้งาน</div>
          </div>
        )}
      </div>
    ),
  },
];

export default function ItemMasterDataComponent() {
  const [value, setValue] = useState(0);
  const [allValue, setAllValue] = useState(0);
  const [allProduct, setAllProduct] = useState(0);
  const [allProductCombine, setAllProductCombine] = useState(0);
  const [allSupplies, setAllSupplies] = useState(0);
  const [allService, setAllService] = useState(0);
  const [allConsumer, setAllConsumer] = useState(0);
  const [allOther, setAllOther] = useState(0);
  const date = new Date();
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [cloneData, setCloneData] = useState();
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch();

  function changeStatus(data) {
    if (data === false) return "ไม่ใช้งาน";
    return "ใช้งาน";
  }

  useEffect(() => {
    const itemInventoryInput = {};
    queryItemInventory(itemInventoryInput)
      .then((data) => {
        const usageData = data.data.data.listItem.items.map((item, index) => {
          return {
            ...item,
            index: index + 1,
            id: item.id,
            name: item.name,
            createdAt: new Date(item.createdAt),
            internalID: item.internalID,
            itemCategory:
              item.getItemCategory !== null
                ? item.getItemCategory.parentList.length !== 0
                  ? item.getItemCategory.parentList[0].name
                  : item.getItemCategory.name
                : "",
            itemCategory1:
              item.getItemCategory !== null &&
              item.getItemCategory.parentList.length !== 0
                ? item.getItemCategory.parentList.length === 1
                  ? item.getItemCategory.name
                  : item.getItemCategory.parentList[1].name
                : "",
            itemCategory2:
              item.getItemCategory !== null &&
              item.getItemCategory.parentList.length !== 1
                ? item.getItemCategory.parentList.length <= 2
                  ? item.getItemCategory.name
                  : item.getItemCategory.parentList[2].name
                : "",
            itemCategory3:
              item.getItemCategory !== null &&
              item.getItemCategory.parentList.length !== 1
                ? item.getItemCategory.parentList.length <= 3
                  ? item.getItemCategory.name
                  : item.getItemCategory.parentList[3].name
                : "",
            onHandQty: item.listItemCurrent.items[0]?.onHandQty || 0,
            orderedQty: item.listItemCurrent.items[0]?.orderedQty || 0,
            committedQty: item.listItemCurrent.items[0]?.committedQty || 0,
            listItemCurrent: item.listItemCurrent,
            inventoryUOMID: item.inventoryUOMID,
            isActive: changeStatus(item.isActive),
            itemType: item.itemType,
          };
        });
        const sorting = usageData.sort((a, b) => {
          return b.createdAt - a.createdAt;
        });
        setRows(sorting);
        setCloneData(sorting);
        setAllValue(usageData.length);
        setAllProduct(
          usageData.filter((product) => {
            return product.itemType === "PRODUCT";
          }).length
        );
        setAllProductCombine(
          usageData.filter((product) => {
            return product.itemType === "PRODUCT_ASSEMBLY";
          }).length
        );
        setAllSupplies(
          usageData.filter((product) => {
            return product.itemType === "SUPPLIES";
          }).length
        );
        setAllService(
          usageData.filter((product) => {
            return product.itemType === "SERVICE";
          }).length
        );
        setAllConsumer(
          usageData.filter((product) => {
            return product.itemType === "CONSUMABLES";
          }).length
        );
        setAllOther(
          usageData.filter((product) => {
            return product.itemType === "CONSUMABLES";
          }).length
        );
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", `${err}` || "อ่านข้อมูลผิดพลาด"));
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      if (cloneData === undefined) return;
      if (value === 0) {
        setRows(cloneData);
      } else if (value === 1) {
        const newData = cloneData.filter((data) => {
          return data.itemType === "PRODUCT";
        });
        setRows(newData);
      } else if (value === 2) {
        const newData = cloneData.filter((data) => {
          return data.itemType === "PRODUCT_ASSEMBLY";
        });
        setRows(newData);
      } else if (value === 3) {
        const newData = cloneData.filter((data) => {
          return data.itemType === "SUPPLIES";
        });
        setRows(newData);
      } else if (value === 5) {
        const newData = cloneData.filter((data) => {
          return data.itemType === "SERVICE";
        });
        setRows(newData);
      } else if (value === 4) {
        const newData = cloneData.filter((data) => {
          return data.itemType === "CONSUMABLES";
        });
        setRows(newData);
      } else {
        const newData = cloneData.filter((data) => {
          return data.itemType === "OTHER";
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
          <BreadcrumbComponent name="คลังสินค้า" key="1" to="/inventory" />
          <BreadcrumbComponent name="สินค้า" key="2" to="#" />
        </Breadcrumbs>
      </Stack>
      <div className="card-inventory-layout">
        <ItemInventoryCardComponent
          header="ทั้งหมด"
          value={allValue}
          update={`${moment(date).tz("Asia/Bangkok").format("DD/MM/YYYY")}`}
        />
        <ItemInventoryCardComponent
          header="วัสดุไม้"
          value={allProduct}
          update={`${moment(date).tz("Asia/Bangkok").format("DD/MM/YYYY")}`}
        />
        <ItemInventoryCardComponent
          header="วัสดุประกอบ"
          value={allProductCombine}
          update={`${moment(date).tz("Asia/Bangkok").format("DD/MM/YYYY")}`}
        />
        <ItemInventoryCardComponent
          header="วัสดุอุปกรณ์หลัก"
          value={allSupplies}
          update={`${moment(date).tz("Asia/Bangkok").format("DD/MM/YYYY")}`}
        />
        <ItemInventoryCardComponent
          header="วัสดุสินเปลื้อง"
          value={allConsumer}
          update={`${moment(date).tz("Asia/Bangkok").format("DD/MM/YYYY")}`}
        />
        <ItemInventoryCardComponent
          header="บริการ"
          value={allService}
          update={`${moment(date).tz("Asia/Bangkok").format("DD/MM/YYYY")}`}
        />
        <ItemInventoryCardComponent
          header="อื่นๆ"
          value={allOther}
          update={`${moment(date).tz("Asia/Bangkok").format("DD/MM/YYYY")}`}
        />
      </div>
      <div style={{ textAlign: "end" }}>
        <Link to="/inventory/item-master/add">
          <Button
            type="text"
            label="เพิ่ม"
            variant="contained"
            color="success"
            sx={{ width: "130px" }}
          >
            เพิ่ม
          </Button>
        </Link>
      </div>
      <Box>
        <CustomTabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <CustomTab label="ทั้งหมด" {...a11yProps(0)} />
          <CustomTab label="วัสดุไม้" {...a11yProps(1)} />
          <CustomTab label="วัสดุประกอบ" {...a11yProps(2)} />
          <CustomTab label="วัสดุอุปกรณ์หลัก" {...a11yProps(3)} />
          <CustomTab label="วัสดุสิ้นเปลือง" {...a11yProps(4)} />
          <CustomTab label="บริการ" {...a11yProps(5)} />
          <CustomTab label="อื่นๆ" {...a11yProps(6)} />
        </CustomTabs>
      </Box>
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
          onRowDoubleClick={(params) => {
            let ID = params.row.id;
            window.location.href = "/inventory/item-master/" + ID;
          }}
        />
      </div>
    </div>
  );
}
