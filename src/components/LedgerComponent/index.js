import React, { useState, useEffect } from "react";
import ItemInventoryCardComponent from "../ItemInventoryCardComponent";
import moment from "moment";
import "moment-timezone";
import {
  IconButton,
  Backdrop,
  CircularProgress,
  TextField,
  Stack,
  Breadcrumbs,
} from "@mui/material";
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
import BreadcrumbComponent from "../BreadcrumbComponent";
import { querylistInventoryJournal } from "../../adapter/Api/graphql";

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
          fileName: "รายงานการเคลื่อนไหวสินค้า",
          utf8WithBom: true,
        }}
      />
      <GridToolbarDensitySelector className={"export-button"} />
      <GridToolbarColumnsButton className={"export-button"} />
    </GridToolbarContainer>
  );
}

const columns = [
  {
    headerName: "รหัสสินค้า",
    field: "itemID",
    width: 150,
  },
  {
    headerName: "รหัสเอกสาร",
    field: "documentID",
    width: 150,
  },
  {
    headerName: "วันที่",
    field: "createdAt",
    width: 150,
  },
  {
    headerName: "ประเภทการเข้า/ออก",
    field: "changeType",
    width: 200,
    renderCell: (params) => (
      <div>
        {params.row.changeType === "นำเข้า" && (
          <div>
            <div style={{ color: "rgba(65, 150, 68, 1)" }}>นำเข้า</div>
          </div>
        )}
        {params.row.changeType === "นำออก" && (
          <div>
            <div style={{ color: "rgba(255, 86, 82, 1)" }}>นำออก</div>
          </div>
        )}
      </div>
    ),
  },
  {
    headerName: "จำนวน",
    field: "changeOnHand",
    width: 150,
  },
  {
    headerName: "อ้างอิง",
    field: "listDocumentReference",
    width: 150,
  },
  {
    headerName: "สถานะ",
    field: "status",
    width: 150,
    renderCell: (params) => (
      <div>
        {params.row.status === "สำเร็จ" && (
          <div className="inventoryMaster-active-cell">
            <div>สำเร็จ</div>
          </div>
        )}
        {params.row.status === "ยกเลิก" && (
          <div className="inventoryMaster-cancel-cell">
            <div>ยกเลิก</div>
          </div>
        )}
      </div>
    ),
  },
];

const changeType = (data) => {
  if (data === "IN") return "นำเข้า";
  if (data === "OUT") return "นำออก";
  if (data === "NONE") return "ไม่มี";
  if (data === "CLOSED") return "สำเร็จ";
  if (data === "CANCELED") return "ยกเลิก";
};

export default function LedgerComponent() {
  const [isLoading, setIsLoading] = useState(true);
  const [itemCount, setItemCount] = useState(null);
  const [rows, setRows] = useState([]);
  const [cloneData, setCloneData] = useState([]);
  const date = new Date();

  useEffect(() => {
    querylistInventoryJournal().then((data) => {
      const myData = data.data.data.listInventoryJournal.items;
      console.log("myData", myData);
      const newData = myData.map((data, index) => {
        return {
          id: index + 1,
          documentType: data.documentType || "",
          documentID: data.documentID,
          itemID: data.itemID || "",
          name: data.getItem || "",
          createdAt: moment(data.createdAt)
            .tz("Asia/Bangkok")
            .format("DD/MM/YYYY"),
          changeType: changeType(data.changeType) || "",
          changeOnHand: data.changeOnHand || "",
          listDocumentReference:
            (data.getDocument !== null &&
            data.getDocument.listDocumentReference &&
            data.getDocument.listDocumentReference.length !== 0
              ? data.getDocument.listDocumentReference[0].documentID
              : "") || "",
          status:
            data.getDocument !== null
              ? changeType(data.getDocument.status)
              : "",
        };
      });
      const sorting = newData.sort((a, b) => {
        return b.index - a.index;
      });
      setRows(sorting);
      setCloneData(sorting);
      setItemCount(myData.length);
      setIsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [searchText, setSearchText] = useState("");
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
        <Breadcrumbs separator=">" aria-label="breadcrumb">
          <BreadcrumbComponent name="คลังสินค้า" to="/inventory" />
          <BreadcrumbComponent name="รายงาน" to="/inventory/report" />
          <BreadcrumbComponent
            name="รายงานการเคลื่อนไหวสินค้า"
            key="2"
            to="/inventory/report/ledger"
          />
        </Breadcrumbs>
      </Stack>
      <h1 style={{ margin: "15px 0" }}>รายงานการเคลื่อนไหวสินค้า</h1>
      <div className="card-inventory-layout">
        <ItemInventoryCardComponent
          header="รายการเคลื่อนไหวสินค้าทั้งหมด"
          value={itemCount}
          update={`${moment(date).tz("Asia/Bangkok").format("DD/MM/YYYY")}`}
        />
      </div>
      <div className="myTable">
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
        />
      </div>
    </div>
  );
}
