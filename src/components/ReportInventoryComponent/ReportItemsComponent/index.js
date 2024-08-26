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
import moment from "moment";
import "moment-timezone";

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
import ItemInventoryCardComponent from "../../ItemInventoryCardComponent";

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
          fileName: "รายงานสินค้า",
          utf8WithBom: true,
        }}
      />
      <GridToolbarDensitySelector className={"export-button"} />
      <GridToolbarColumnsButton className={"export-button"} />
    </GridToolbarContainer>
  );
}

// function getAvaliable(params) {
//   if (params.row.inventoryUOMID === "")
//     return `${
//       params.getValue(params.id, "onHandQty") -
//       params.getValue(params.id, "committedQty") +
//       params.getValue(params.id, "orderedQty")
//     }`;
//   return `${
//     params.getValue(params.id, "onHandQty") -
//     params.getValue(params.id, "committedQty") +
//     params.getValue(params.id, "orderedQty")
//   } - ${params.getValue(params.id, "inventoryUOMID")}`;
// }

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
    headerName: "รายละเอียด",
    field: "description",
    flex: 1,
  },
  {
    headerName: "ซื้อได้",
    field: "isPurchase",
    flex: 1,
  },
  {
    headerName: "ขายได้",
    field: "isSales",
    flex: 1,
  },
  {
    headerName: "สต๊อกได้",
    field: "isInventory",
    flex: 1,
  },
  {
    headerName: "ประเภทสินค้า",
    field: "itemType",
    flex: 1,
  },
  {
    headerName: "ซื้อ",
    field: "orderedQty",
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
    // valueGetter: getAvaliable,
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
    headerName: "หมวดหมู่สินค้า",
    field: "itemCategory",
    flex: 1,
  },
  {
    headerName: "หมวดหมู่สินค้า 1",
    field: "itemCategory1",
    flex: 1,
  },
  {
    headerName: "หมวดหมู่สินค้า 2",
    field: "itemCategory2",
    width: 170,
  },
  {
    headerName: "หมวดหมู่สินค้า 3",
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

export default function ReportItemsComponent() {
  const [isLoading, setIsLoading] = useState(true);
  const [allValue, setAllValue] = useState(0);
  const [rows, setRows] = useState([]);
  const [cloneData, setCloneData] = useState();
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch();

  function changeStatus(data) {
    if (data === false) return "ไม่ใช้งาน";
    return "ใช้งาน";
  }

  function changeฺBoolean(data) {
    if (data) return "ใช่";
    return "ไม่";
  }

  function changeType(data) {
    if (data === "PRODUCT") return "วัสดุ Biowood";
    if (data === "SUPPLIES") return "สินค้าวัสดุอุปกรณ์";
    if (data === "SERVICE") return "รายการบริการ";
    if (data === "CONSUMABLES") return "วัสดุสิ้นเปลือง";
    return "อื่นๆ";
  }

  useEffect(() => {
    const itemInventoryInput = {};
    queryItemInventory(itemInventoryInput)
      .then((data) => {
        const usageData = data.data.data.listItem.items.map((item, index) => {
          return {
            index: index + 1,
            id: item.id,
            name: item.name,
            createdAt: new Date(item.createdAt),
            description: item.description,
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
              item.getItemCategory.parentList.length !== 0
                ? item.getItemCategory.parentList.length <= 2
                  ? item.getItemCategory.name
                  : item.getItemCategory.parentList[2].name
                : "",
            itemCategory3:
              item.getItemCategory !== null &&
              item.getItemCategory.parentList.length !== 0
                ? item.getItemCategory.parentList.length <= 3
                  ? item.getItemCategory.name
                  : item.getItemCategory.parentList[3].name
                : "",
            onHandQty: item.listItemCurrent.items[0]?.onHandQty || 0,
            orderedQty: item.listItemCurrent.items[0]?.orderedQty || 0,
            committedQty: item.listItemCurrent.items[0]?.committedQty || 0,
            listItemCurrent: item.listItemCurrent,
            inventoryUOMID: item.inventoryUOMID,
            netBalance:
              item.listItemCurrent.items[0]?.onHandQty ||
              0 - item.listItemCurrent.items[0]?.orderedQty ||
              0 + item.listItemCurrent.items[0]?.committedQty ||
              0,
            isSales: changeฺBoolean(item.isSales),
            isInventory: changeฺBoolean(item.isInventory),
            isPurchase: changeฺBoolean(item.isPurchase),
            isActive: changeStatus(item.isActive),
            itemType: changeType(item.itemType),
          };
        });
        const sorting = usageData.sort((a, b) => {
          return b.createdAt - a.createdAt;
        });
        console.log("usageData", usageData);
        setAllValue(usageData.length);
        setRows(sorting);
        setCloneData(sorting);
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
          <BreadcrumbComponent name="คลังสินค้า" key="1" to="/inventory" />
          <BreadcrumbComponent name="รายงาน" key="2" to="/inventory/report" />
          <BreadcrumbComponent name="รายงานสินค้า" key="3" to="#" />
        </Breadcrumbs>
      </Stack>
      <h1 style={{ margin: "15px 0 " }}>รายงานสินค้า</h1>
      <div className="card-inventory-layout">
        <ItemInventoryCardComponent
          header="รายการสินค้าทั้งหมด"
          value={allValue}
          update={`${moment(new Date())
            .tz("Asia/Bangkok")
            .format("DD/MM/YYYY")}`}
        />
      </div>
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
