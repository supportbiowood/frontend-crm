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
import { getAllProject } from "../../adapter/Api";
import BreadcrumbComponent from "../BreadcrumbComponent";

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
          fileName: "รายงานโครงการ",
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
    headerName: "เลขที่โครงการ",
    field: "project_id",
  },
  {
    headerName: "ชื่อโครงการ",
    field: "project_name",
  },
  {
    headerName: "ประเภทโครงการ",
    field: "project_category",
  },
  {
    headerName: "สถานะงาน",
    field: "project_stage",
  },
  {
    headerName: "ลักษณะงาน",
    field: "project_type",
  },
  {
    headerName: "% โอกาสสำเร็จ",
    field: "project_deal_confidence",
  },
  {
    headerName: "วันคาดการณ์ปิดดีล",
    field: "project_deal_target_date",
  },
  {
    headerName: "มูลค่า",
    field: "project_deal_value",

    renderCell: (params) => {
      if (params.value != null) {
        return params.value.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
     
      });
    }
    return "-";
    },
  },
  {
    headerName: "สถานที่ตั้งโครงการ",
    field: "project_address",
    width: 100,
  },
  {
    headerName: "ประเภทกิจการ - การเรียกเก็บเงิน",
    field: "project_billing_business_category",
  },
  {
    headerName: "ชื่อ - การเรียกเก็บเงิน",
    field: "project_billing_name",
  },
  {
    headerName: "เลขภาษีมูลค่าเพิ่ม",
    field: "project_billing_tax_no",
  },
  {
    headerName: "สาขา - การเรียกเก็บเงิน",
    field: "project_billing_branch",
  },
  {
    headerName: "หมายเหตุ",
    field: "project_remark",
  },
  {
    headerName: "สถานะโครงการ",
    field: "project_status",
  },
  {
    headerName: "สถานะถอดแบบ/ติดตั้ง",
    field: "project_installment_status",
  },
  {
    headerName: "สถานะขนส่ง",
    field: "project_shipment_status",
  },
  {
    headerName: "สถานะชำระเงิน",
    field: "project_payment_status",
  },
  {
    headerName: "อนุมัติการสร้างโครงการ",
    field: "project_approver",
  },
  {
    headerName: "เลขที่ผู้อนุมัติโครงการ",
    field: "project_approver_id",
  },
  {
    headerName: "วันที่อนุมัติโครงการ",
    field: "_project_approved",
  },
  {
    headerName: "ชื่อผู้อนุมัติโครงการ",
    field: "_project_approvedby",
  },
  {
    headerName: "วันที่สร้างโครงการ",
    field: "_project_created",
  },
  {
    headerName: "รายชื่อผู้เกี่ยวข้อง",
    field: "project_contact",
  },
  {
    headerName: "รายชื่อผู้รับผิดชอบ",
    field: "project_employee",
  },
  {
    headerName: "รายการวารันตี",
    field: "project_warranty",
  },
  {
    headerName: "การจัดกลุ่ม",
    field: "group",
  },
  {
    headerName: "เอกสารที่เกี่ยวข้อง",
    field: "attachment",
  },
];

const getProjectStatus = (status) => {
  if (status === "new") return "โครงการใหม่";
  if (status === "ongoing") return "กำลังดำเนินการ";
  if (status === "quotation") return "เสนอราคา";
  if (status === "closed_success") return "ปิดได้";
  if (status === "closed_fail") return "ปิดไม่ได้";
  if (status === "finished") return "จบโครงการ";
  return "ดูแลงาน";
};

const getBusinessCategory = (category) => {
  if (category === "individual") return "นิติบุคคล";
  if (category === "commercial") return "บุคคลธรรมดา";
  return "ร้านค้า";
};

const getBranch = (branch) => {
  if (branch === "") return "-";
  if (branch === "main") return "สำนักงานใหญ่";
  return "อื่นๆ";
};

const getBillingName = (category, project) => {
  if (category === "individual") {
    return `${project.project_billing_individual_first_name} ${project.project_billing_individual_last_name}`;
  } else if (category === "commercial") {
    return `${project.project_billing_commercial_type} ${project.project_billing_commercial_name}`;
  } else {
    return `${project.project_billing_merchant_name}`;
  }
};

const getEmployee = (employeeList) => {
  if (employeeList.length === 0) return "-";
  const result = employeeList.map((employee) => {
    if (employee.role)
      return `${employee.role}: ${employee.employee_firstname} ${employee.employee_lastname} (${employee.employee_position})`;
    return `${employee.employee_firstname} ${employee.employee_lastname} (${employee.employee_position})`;
  });
  return result;
};

const getContact = (contactList) => {
  const result = contactList
    .map((contact) => {
      if (contact.person_first_name && contact.person_last_name && contact.role)
        return (
          contact.person_first_name +
          " " +
          contact.person_last_name +
          "(" +
          contact.role +
          ")"
        );
      return null;
    })
    .join(",");
  return result;
};

const getGroup = (groupList) => {
  const result = groupList
    .map((tag) => {
      return tag.tag_name;
    })
    .join(",");
  return result;
};

const getAttachment = (attachment) => {
  const result = attachment
    .map((attachment) => {
      return `${attachment.attachment_file_name}:${attachment.attachment_url}`;
    })
    .join(",");
  return result;
};

const getWarrantyType = (warranty) => {
  if (warranty === "submitted") return "รออนุมัติ";
  if (warranty === "approved") return "อนุมัติ";
  if (warranty === "expired") return "หมด Warranty";
  if (warranty === "product") return "สินค้า";
  if (warranty === "installment") return "งานติดตั้ง";
  if (warranty === "service") return "บริการ";
};

const getWarranty = (warrantyList) => {
  const result = warrantyList
    .map((warranty) => {
      const startDate = moment
        .unix(warranty.warranty_start_date)
        .format("DD/MM/YYYY, HH:mm");
      const endDate = moment
        .unix(warranty.warranty_end_date)
        .format("DD/MM/YYYY, HH:mm");
      const status = getWarrantyType(warranty.warranty_status);
      const type = getWarrantyType(warranty.warranty_type);
      return `ประเภท:${type} ชื่อการรับประกัน:${warranty.warranty_name} วันที่เริ่ม:${startDate} วันทีสิ้นสุด:${endDate} สถานะ:${status} `;
    })
    .join(",");
  return result;
};

const getAddress = (address) => {
  if (!address) return "-";
  return `อาคาร/หมู่บ้าน:${address.address_id || "-"} เลขที่:${address.house_no || "-"} หมู่:${address.village_no || "-"} แขวง/ตำบล:${address.sub_district || "-"} เขต/อำเภอ:${address.district || "-"} จังหวัด:${address.province || "-"} รหัสไปรษณีย์:${address.postal_code || "-"} ประเทศ:${address.country || "-"}`;
};

export default function ReportProjectComponent() {
  const [isLoading, setIsLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [cloneData, setCloneData] = useState();
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch();

  useEffect(() => {
    getAllProject()
      .then((data) => {
        if (data.data.data !== null) {
          const result = data.data.data;
          const newData = result.map((project, index) => {
            return {
              ...project,
              id: index + 1,
              project_status: getProjectStatus(project.project_status),
              project_billing_name: getBillingName(
                project.project_billing_business_category,
                project
              ),
              project_billing_business_category: getBusinessCategory(
                project.project_billing_business_category
              ),
              project_billing_branch: getBranch(project.project_billing_branch),
              project_deal_target_date: project.project_deal_target_date
                ? moment
                    .unix(project.project_deal_target_date)
                    .format("DD/MM/YYYY, HH:mm")
                : "-",
              project_employee: getEmployee(project.project_employee_list),
              _project_created: project._project_created
                ? moment
                    .unix(project._project_created)
                    .format("DD/MM/YYYY, HH:mm")
                : "-",
              project_contact: getContact(project.project_contact_list),
              project_address: getAddress(project.project_address),
              group: getGroup(project.tag_list),
              attachment: getAttachment(project.attachment_list),
              project_warranty: getWarranty(project.warranty_list),
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
          <BreadcrumbComponent name="รายงานโครงการ" key="3" to="#" />
        </Breadcrumbs>
      </Stack>
      <h1 style={{ margin: "15px 0 " }}>รายงานโครงการ</h1>
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
