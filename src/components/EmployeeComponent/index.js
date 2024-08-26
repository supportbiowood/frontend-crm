import React, { useState, useEffect } from "react";
import ButtonComponent from "../../components/ButtonComponent";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import BreadcrumbComponent from "../../components/BreadcrumbComponent";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/actions/snackbarActions";

import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import { Tabs, Tab, Box } from "@mui/material";

import {
  DataGridPro,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid-pro";

import { getAllEmployee } from "../../adapter/Api";

import moment from "moment";
import "moment-timezone";

import Placeholder from "../../images/placeholder.jpeg";
import Avatar from "@mui/material/Avatar";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { createTheme } from "@mui/material/styles";
import { createStyles, makeStyles, styled } from "@mui/styles";

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

const columns = [
  {
    field: "employee_document_id",
    headerName: "รหัสพนักงาน",
    width: 120,
    renderCell: (params) => {
      return (
        <div>
          {params.value === null ? (
            "ไม่พบรหัสพนักงาน"
          ) : (
            <a href={"/employee/" + params.value}>{params.value}</a>
          )}
        </div>
      );
    },
  },
  {
    field: "employee_img_url",
    headerName: "รูป",
    renderCell: (params) => {
      return <Avatar src={params.value ? params.value : Placeholder} />;
    },
    width: 60,
  },
  { field: "employee_firstname", headerName: "ชื่อจริง", width: 200 },
  { field: "employee_lastname", headerName: "นามสกุล", width: 200 },
  { field: "employee_department", headerName: "แผนก" },
  { field: "employee_position", headerName: "ตำแหน่ง" },
  {
    field: "_employee_lastlogin",
    headerName: "วันที่ใช้งานล่าสุด",
    width: 150,
    renderCell: (params) => {
      return (
        <div>
          {params.value === null
            ? "ไม่พบวันที่ใช้งาน"
            : moment(params.value, "X")
                .tz("Asia/Bangkok")
                .format("DD/MM/YYYY, HH:MM")}
        </div>
      );
    },
  },
  {
    field: "_employee_created",
    headerName: "วันที่สร้าง",
    width: 150,
    renderCell: (params) => {
      return (
        <div>
          {params.value === 0
            ? "-"
            : moment(params.value, "X")
                .tz("Asia/Bangkok")
                .format("DD/MM/YYYY, HH:MM")}
        </div>
      );
    },
  },
  {
    field: "employee_status",
    headerName: "สถานะ",
    width: 120,
    renderCell: (params) => (
      <div>
        {params.value === "active" ? (
          <div className="inventoryMaster-active-cell">
            <div>ใช้งาน</div>
          </div>
        ) : (
          <div className="inventoryMaster-cancel-cell">
            <div>ยกเลิก</div>
          </div>
        )}
      </div>
    ),
  },
];

export default function EmployeeComponent() {
  const [allEmployees, setAllEmployees] = useState([]);
  const [cloneRows, setCloneRows] = useState([]);
  const [value, setValue] = useState(0);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    setIsLoading(true);
    getAllEmployee()
      .then((data) => {
        if (data.data.status === "success") {
          console.log("Employee", data.data.data);
          let myData = data.data.data;
          setAllEmployees(myData);
          myData.forEach((item, i) => {
            item.id = i + 1;
          });
          setRows(myData);
          setCloneRows(myData);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(showSnackbar("error", "ไม่สามารถเรียกข้อมูลได้"));
        setIsLoading(false);
      });
  }, [dispatch]);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      if (cloneRows.length === 0) return setIsLoading(false);
      if (value === 0) {
        setRows(cloneRows);
        setIsLoading(false);
      } else if (value === 1) {
        const newData = cloneRows.filter((data) => {
          return data.employee_department === "ขาย";
        });
        setRows(newData);
      } else if (value === 2) {
        const newData = cloneRows.filter((data) => {
          return data.employee_department === "คลัง";
        });
        setRows(newData);
      } else if (value === 3) {
        const newData = cloneRows.filter((data) => {
          return data.employee_department === "ติดตั้ง/ถอดแบบ";
        });
        setRows(newData);
      } else if (value === 4) {
        const newData = cloneRows.filter((data) => {
          return data.employee_department === "บัญชี";
        });
        setRows(newData);
      } else if (value === 5) {
        const newData = cloneRows.filter((data) => {
          return data.employee_department === "จัดซื้อ";
        });
        setRows(newData);
      } else if (value === 6) {
        const newData = cloneRows.filter((data) => {
          return data.employee_department === "หัวหน้า";
        });
        setRows(newData);
      } else {
        const newData = cloneRows.filter((data) => {
          return data.employee_department === "ดูแลระบบ";
        });
        setRows(newData);
      }
      setIsLoading(false);
    }, [1000]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const [sortModel, setSortModel] = useState([
    {
      field: "id",
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
  const [rows, setRows] = useState([]);

  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
    const filteredRows = allEmployees.filter((row) => {
      return Object.keys(row).some((field) => {
        if (typeof row[field] == "string")
          return searchRegex.test(row[field].toString());
        else return false;
      });
    });
    setRows(filteredRows);
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
        <BreadcrumbComponent name="บัญชีผู้ใช้" to="/employee" />
      </Breadcrumbs>
      <div className="grid-container-50">
        <div>
          <h2 className="form-heading">บัญชีผู้ใช้</h2>
        </div>
        <div style={{ textAlign: "right" }}>
          <Link to="/employee/add">
            <ButtonComponent
              type="button"
              text="เพิ่มบัญชีผู้ใช้"
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
          <CustomTab label="ขาย" {...a11yProps(1)} />
          <CustomTab label="คลัง" {...a11yProps(2)} />
          <CustomTab label="ติดตั้ง/ถอดแบบ" {...a11yProps(3)} />
          <CustomTab label="บัญชี" {...a11yProps(4)} />
          <CustomTab label="จัดซื้อ" {...a11yProps(5)} />
          <CustomTab label="หัวหน้า" {...a11yProps(6)} />
          <CustomTab label="ดูแลระบบ" {...a11yProps(7)} />
        </CustomTabs>
      </Box>
      <div className="myTable3">
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
          onRowDoubleClick={(params, event) => {
            let employee_id = params.row.employee_document_id;
            // console.log(employee_id);
            window.location.href = "employee/" + employee_id;
          }}
        />
      </div>
    </>
  );
}
