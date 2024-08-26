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
import { getContactOption } from "../../adapter/Api";

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
          fileName: "รายงานผู้ติดต่อ",
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
    headerName: "เลขที่ผู้ติดต่อ",
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
    headerName: "เลขภาษีมูลค่าเพิ่ม",
    field: "contact_tax_no",
  },
  {
    headerName: "URL โลโก้องค์กร",
    field: "contact_img_url",
  },
  {
    headerName: "ที่อยู่จดทะเบียน",
    field: "contact_registration_address",
  },
  {
    headerName: "ที่อยู่จัดส่งเอกสาร",
    field: "contact_address",
  },
  {
    headerName: "แหล่งที่มาของผู้ติดต่อ",
    field: "lead_source_name",
  },
  // {
  //   headerName: "เลขที่บัญชีบันทึกลูกหนี้",
  //   field: "isActive",
  // },
  // {
  //   headerName: "เลขที่บัญชีบันทึกเจ้าหนี้",
  //   field: "isActive",
  // },
  {
    headerName: "การชำระเงิน",
    field: "contact_payment_type",
  },
  // {
  //   headerName: "จำกัดเครดิตหรือไม่",
  //   field: "isActive",
  // },
  {
    headerName: "เครดิต",
    field: "contact_credit_limit_amount",
  },
  {
    headerName: "วันที่สร้าง",
    field: "_contact_created",
  },
  {
    headerName: "เลขที่ผู้สร้าง",
    field: "_contact_createdby",
  },
  {
    headerName: "ข้อมูลผู้สร้าง",
    field: "_contact_createdby_employee",
  },
  // {
  //   headerName: "รายการบุคคลติดต่อ",
  //   field: "isActive",
  // },
  {
    headerName: "การจัดกลุ่ม",
    field: "group",
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

const getGroup = (groupList) => {
  const result = groupList
    .map((tag) => {
      return tag.tag_name;
    })
    .join(",");
  return result;
};

const getPaymentType = (type) => {
  if (type === "cash") return "เงินสด";
  if (type === "credit") return "วงเงินขายเชื่อ";
};

const getAddress = (address) => {
  return `อาคาร/หมู่บ้าน:${address.address_id} เลขที่:${address.house_no} หมู่:${address.village_no} แขวง/ตำบล:${address.sub_district} เขต/อำเภอ:${address.district} จังหวัด:${address.province} รหัสไปรษณีย์:${address.postal_code} ประเทศ:${address.country}`;
};

export default function ReportContact() {
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [cloneData, setCloneData] = useState();
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch();

  useEffect(() => {
    getContactOption([
      "contact_registration_address",
      "contact_address_list",
      "account_receivable",
      "account_payable",
      "bank_account_list",
      "tag_list",
    ])
      .then((data) => {
        if (data.data.status === "success") {
          const result = data.data.data;
          const newData = result.map((contact, index) => {
            return {
              ...contact,
              id: index + 1,
              contact_name: getContactName(
                contact.contact_business_category,
                contact
              ),
              contact_business_category: getBusinessCategory(
                contact.contact_business_category
              ),
              contact_is_customer:
                contact.contact_is_customer === 1 ? "ใช่" : "ไม่ใช่",
              contact_is_vendor:
                contact.contact_is_vendor === 1 ? "ใช่" : "ไม่ใช่",
              _contact_created: contact._contact_created
                ? moment
                    .unix(contact._contact_created)
                    .format("DD/MM/YYYY, HH:mm")
                : "-",
              contact_payment_type: getPaymentType(
                contact.contact_payment_type
              ),
              contact_address: getAddress(contact.contact_address_list[0]),
              contact_registration_address: getAddress(
                contact.contact_registration_address
              ),
              _contact_createdby_employee:
                contact._contact_createdby_employee &&
                `${contact._contact_createdby_employee.employee_firstname} ${contact._contact_createdby_employee?.employee_lastname}`,
              group: getGroup(contact.tag_list),
            };
          });
          setRows(newData);
          setCloneData(newData);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        dispatch(showSnackbar("error", `${err}` || "อ่านข้อมูลผิดพลาด"));
        setIsLoading(false);
      });
  }, [dispatch]);

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
          <BreadcrumbComponent name="รายงานผู้ติดต่อ" key="3" to="#" />
        </Breadcrumbs>
      </Stack>
      <h1 style={{ margin: "15px 0 " }}>รายงานผู้ติดต่อ</h1>
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
