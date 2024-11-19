import React, { useState, useEffect } from "react";
import ButtonComponent from "../../components/ButtonComponent";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/actions/snackbarActions";

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
import Chip from "@mui/material/Chip";

import {
  DataGridPro,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid-pro";

import { getAllContact, getTotalContact } from "../../adapter/Api";

import { createTheme } from "@mui/material/styles";
import { createStyles, makeStyles, styled } from "@mui/styles";
import { Box } from "@mui/system";
import useDebounce from "../../hooks/useDebounce";

//utf8WithBom={true}

// function escapeRegExp(value) {
//   return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
// }

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

function renderName(data) {
  if (data === "mr") {
    return "นาย";
  } else if (data === "mrs") {
    return "นาง";
  } else if (data === "ms") {
    return "นางสาว";
  } else if (data === "individual") {
    return "บุคคลธรรมดา";
  } else if (data === "commercial") {
    return "นิติบุคคล";
  } else if (data === "merchant") {
    return "ร้านค้า";
  }
}

const columns = [
  {
    field: "contact_type",
    headerName: "ประเภทผู้ติดต่อ",
  },
  {
    headerName: "ผู้ติดต่อ",
    field: "contact_name",
    width: 150,
  },
  {
    headerName: "ประเภทกิจการ",
    field: "contact_business_category",
    width: 170,
    type: "singleSelect",
    valueOptions: [
      {
        label: "นิติบุคคล",
        value: "commercial",
      },
      {
        label: "บุคคลธรรมดา",
        value: "individual",
      },
      {
        label: "ร้านค้า",
        value: "merchant",
      },
    ],
    valueGetter: (params) => {
      return renderName(params.row.contact_business_category);
    },
  },
  {
    headerName: "ช่องทางติดต่อ",
    field: "contact_channel_list",
    width: 250,
    renderCell: (params) => {
      if (params.value) {
        const trimValue = params.value.trim();
        const splitType = trimValue.split("***");
        const removedComma = splitType
          .filter((channel) => channel.length > 0)
          .map((channelMap) => channelMap.replace(",", ""));
        return removedComma.map((channel, index) => {
          return (
            <Chip
            key={index}
              label={channel}
              color="success"
              variant="outlined"
              style={{ marginRight: "5px" }}
            />
          );
        });
      }
    },
  },
  {
    headerName: "จำนวนโครงการ",
    field: "project_count",
    width: 170,
    renderCell: (params) => {
      if (!params.value) {
        return 0;
      }
      return params.value;
    },
  },
  {
    headerName: "การจัดกลุ่ม",
    field: "tag_name",
    renderCell: (params) => {
      return (
        params.value &&
        params.value.split(",").map((tag,index) => {
          return (
            <Chip
              key={index}
              label={tag}
              color="success"
              variant="outlined"
              style={{ marginRight: "5px" }}
            />
          );
        })
      );
    },
    width: 300,
  },
  {
    headerName: "สถานะ",
    field: "contact_status",
    type: "singleSelect",
    valueOptions: [
      {
        label: "ใช้งาน",
        value: "ok",
      },
      {
        label: "ไม่ใช้งาน",
        value: "delete",
      },
    ],
    renderCell: (params) => (
      <div>
        {params.value === "ok" ? (
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
    width: 300,
  },
];

export default function ContactComponent() {
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebounce(searchText, 500);
  const [rows, setRows] = useState([]);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(30);
  const [sortModel, setSortModel] = useState([]);
  const [filterModel, setFilterModel] = useState();
  const [value, setValue] = useState(0);
  const [totalContact, setTotalContact] = useState(0);

  useEffect(() => {
    setIsLoading(true);
    const getAllData = async () => {
      const checkIsNotFilterModel =
        filterModel &&
        filterModel.items &&
        filterModel.items.some(
          (item) =>
            item.value === undefined ||
            item.value === null ||
            item.value === "" ||
            item.value.length === 0
        );

      try {
        const formatPayload = {
          filterModel: checkIsNotFilterModel ? undefined : filterModel,
          search: debouncedSearch,
          sortModel: sortModel,
          pageModel: {
            page: page,
            pageSize: pageSize,
          },
        };

        const {
          data: { data: contactData, status: contactStatus },
        } = await getAllContact(formatPayload);
        const {
          data: {
            data: { total },
            status: totalStatus,
          },
        } = await getTotalContact(formatPayload);
        if (contactStatus === "success" && totalStatus === "success") {
          let myData = contactData.map((item, i) => {
            return {
              ...item,
              id: i + 1,
            };
          });
          myData.sort((a, b) =>
            b.contact_status.localeCompare(a.contact_status)
          );
          setRows(myData);
          setTotalContact(total);
          setIsLoading(false);
        }
      } catch (err) {
        dispatch(showSnackbar("error", "ไม่สามารถเรียกข้อมูลได้"));
        setIsLoading(false);
      }
    };
    getAllData();
  }, [dispatch, filterModel, page, pageSize, sortModel, debouncedSearch]);

  const handleChange = (_, newValue) => {
    setValue(newValue);
    setFilterModel((prev, index) => {
      let items = [];
      const prevItems = prev?.items || [];
      if (newValue === 1) {
        items = [
          ...prevItems.filter((item) => item.columnField !== "contact_type"),
          {
            columnField: "contact_type",
            id: index,
            operatorValue: "contains",
            value: "ลูกค้า",
          },
        ];
      } else if (newValue === 2) {
        items = [
          ...prevItems.filter((item) => item.columnField !== "contact_type"),
          {
            columnField: "contact_type",
            id: index,
            operatorValue: "contains",
            value: "ผู้ขาย",
          },
        ];
      }
      return {
        items: items,
        linkOperation: prev?.linkOperation || "and",
      };
    });
  };

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    // const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
    // const filteredRows = cloneData.filter((row) => {
    //   return Object.keys(row).some((field) => {
    //     if (typeof row[field] == "string")
    //       return searchRegex.test(row[field].toString());
    //     else return false;
    //   });
    // });
    // setRows(filteredRows);
  };

  const onFilterModelChange = (filterModel) => {
    setFilterModel({ ...filterModel });
  };

  const onSortModelChange = (sortModel) => {
    setSortModel([...sortModel]);
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
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <BreadcrumbComponent name="การขาย" to="/sales" />
        <BreadcrumbComponent name="ผู้ติดต่อ" to="/sales/contact" />
      </Breadcrumbs>
      <div className="grid-container-50">
        <div>
        </div>
        <div style={{ textAlign: "right", alignSelf: "center" }}>
          <Link to="/sales/contact/add">
            <ButtonComponent
              type="button"
              text="เพิ่มผู้ติดต่อ"
              variant="contained"
              color="success"
            />
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
          <CustomTab label="ลูกค้า" {...a11yProps(1)} />
          <CustomTab label="ผู้ขาย" {...a11yProps(2)} />
        </CustomTabs>
      </Box>
      <div className="myTable" style={{ marginTop: "unset" }}>
        <DataGridPro
          rows={rows}
          columns={columns}
          rowCount={totalContact}
          sortModel={sortModel}
          onSortModelChange={onSortModelChange}
          filterModel={filterModel}
          className="data-grid"
          onFilterModelChange={onFilterModelChange}
          pagination
          page={page}
          onPageChange={(newPage) => setPage(newPage)}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          paginationMode="server"
          filterMode="server"
          sortingMode="server"
          rowsPerPageOptions={[10, 30, 50, 100, 200]}
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
          onRowDoubleClick={(params) => {
            let contact_id = params.row.contact_id;
            window.location.href = "/sales/contact/" + contact_id;
          }}
        />
      </div>
    </>
  );
}
