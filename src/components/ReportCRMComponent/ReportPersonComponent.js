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
import { showSnackbar } from "../../redux/actions/snackbarActions";
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
import { getAllPerson } from "../../adapter/Api";

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
          fileName: "รายงานบุคคลติดต่อ",
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
    headerName: "เลขที่ผู้ติดต่อ",
    field: "contact_id",
  },
  {
    headerName: "เป็นลูกค้าหรือไม่",
    field: "contact_is_customer",
  },
  {
    headerName: "เป็นผู้ขายหรือไม่",
    field: "contact_is_vendor",
  },
  {
    headerName: "ประเภทกิจการ",
    field: "contact_business_category",
  },
  {
    headerName: "ชื่อผู้ติดต่อ",
    field: "contact_name",
  },
  {
    headerName: "เลขที่บุคคลติดต่อ",
    field: "person_id",
  },
  {
    headerName: "ตำแหน่ง",
    field: "person_position",
  },
  {
    headerName: "ชื่อจริง นามสกุล",
    field: "person_name",
  },
  {
    headerName: "ชื่อเล่น",
    field: "person_nick_name",
  },
  {
    headerName: "วันเกิด",
    field: "person_birthdate",
  },
  {
    headerName: "ช่องทางติดต่อ",
    field: "person_contact_channel",
  },
];

const getBusinessCategory = (category) => {
  if (category === "individual") return "นิติบุคคล";
  if (category === "commercial") return "บุคคลธรรมดา";
  return "ร้านค้า";
};

const getContactName = (category, contact) => {
  if (category === "individual") {
    return `${contact.contact_individual_first_name} ${contact.contact_individual_last_name}`;
  } else if (category === "commercial") {
    return `${contact.contact_commercial_name}`;
  } else {
    return `${contact.contact_merchant_name}`;
  }
};

const getContactChannel = (channelList) => {
  const newData = channelList.map((channel) => {
    const channelName = (data) => {
      if (data === "Phone") return "โทรศัพท์";
      return data;
    };
    let contact_channel = `${channelName(channel.contact_channel_name)}: ${
      channel.contact_channel_detail
    } ${channel.contact_channel_detail_2 || ""}`;
    return contact_channel;
  });
  return newData;
};

export default function ReportPersonComponent() {
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [cloneData, setCloneData] = useState();
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch();

  useEffect(() => {
    getAllPerson()
      .then((data) => {
        if (data.data.data !== null) {
          const result = data.data.data;
          console.log("result", result);
          const newData = result.map((person, index) => {
            return {
              ...person,
              id: index + 1,
              person_birthdate: person.person_birthdate
                ? moment
                    .unix(person.person_birthdate)
                    .format("DD/MM/YYYY, HH:mm")
                : "-",
              person_name: `${person.person_first_name} ${person.person_last_name}`,
              contact_is_customer:
                person.contact_info.contact_is_customer === 1
                  ? "ใช่"
                  : "ไม่ใช่",
              contact_is_vendor:
                person.contact_info.contact_is_vendor === 1 ? "ใช่" : "ไม่ใช่",
              contact_name: getContactName(
                person.contact_info[0].contact_business_category,
                person.contact_info[0]
              ),
              contact_business_category: getBusinessCategory(
                person.contact_info.contact_business_category
              ),
              person_contact_channel: getContactChannel(
                person.person_contact_channel_list
              ),
            };
          });
          setRows(newData);
          setCloneData(newData);
        }
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
          <BreadcrumbComponent name="รายงานบุคคลติดต่อ" key="3" to="#" />
        </Breadcrumbs>
      </Stack>
      <h1 style={{ margin: "15px 0 " }}>รายงานบุคคลติดต่อ</h1>
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
