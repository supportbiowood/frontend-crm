import React, { useState, useEffect } from "react";
import ButtonComponent from "../ButtonComponent";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Stack from "@mui/material/Stack";
import BreadcrumbComponent from "../BreadcrumbComponent";
import { Form, Formik } from "formik";
import { Link } from "react-router-dom";
import { getAllContact } from "../../adapter/Api";
import TagComponent from "../../components/TagComponent";

import TextField from "@mui/material/TextField";
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";

import { createTheme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import {
  DataGridPro,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid-pro";

export default function ContactComponent(props) {
  const [allContacts, setAllContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageSize, setPageSize] = useState(30);

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

  const columns = [
    {
      headerName: "ลำดับ",
      field: "contact_id",
      width: 120,
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
    },
    {
      headerName: "ช่องทางติดต่อ",
      field: "contact_channel_list",
      width: 250,
    },
    {
      headerName: "จำนวนโครงการ",
      field: "project_count",
      width: 170,
    },
    {
      headerName: "การจัดกลุ่ม",
      field: "tag_list",
      // renderCell: (params) => {
      //   return (
      //     <div className="grid-container-50">
      //       <TagComponent
      //         label={`${params.value}`}
      //         ID={params.value}
      //       />
      //     </div>
      //   )
      // },
      width: 170,
    },
  ];

  const [sortModel, setSortModel] = useState([
    {
      field: "contact_id",
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
    const filteredRows = allContacts.filter((row) => {
      return Object.keys(row).some((field) => {
        if (typeof row[field] == "string")
          return searchRegex.test(row[field].toString());
        else return false;
      });
    });
    console.log(filteredRows);
    setRows(filteredRows);
  };

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

  useEffect(() => {
    getAllContact()
      .then((data) => {
        // console.log(data.data.data)
        if (data.data.status === "success") {
          const myData = data.data.data.map((contact, index) => {
            return {
              contact_id: contact.contact_id,
              contact_name:
                contact.contact_commercial_name ||
                contact.contact_individual_first_name ||
                contact.contact_merchant_name,
              contact_business_category: contact.contact_business_category,
              contact_channel_list:
                contact.contact_channel_list.map((channel) => {
                  return `${channel.contact_channel_name}: ${channel.contact_channel_detail
                    } ${channel.contact_channel_detail_2 || ""}`;
                }) || [],
              project_count: 0,
              tag_list:
                contact.tag_list.map((tag) => {
                  return tag.tag_name;
                }) || [],
              id: index + 1,
            };
          });
          console.log(myData);
          setIsLoading(false);
          setAllContacts(myData);
          setRows(myData);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
      <Stack spacing={2}>
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          <BreadcrumbComponent name="การขาย" to="/sales" />
          <BreadcrumbComponent name="ผู้ติดต่อ" to="/sales/contact" />
        </Breadcrumbs>
      </Stack>
      <div className="grid-container-50">
        <h2 className="sales-contact-list__header">รายชื่อผู้ติดต่อ</h2>
        <div style={{ textAlign: "right" }}>
          <Link className="sales-contact-list__btn" to="/sales/contact/add">
            <ButtonComponent
              variant="contained"
              text="เพิ่มผู้ติดต่อ"
              color="success"
            />
          </Link>
        </div>
      </div>
      <div className="myTable">
        <DataGridPro
          rows={rows}
          columns={columns}
          // sortModel={sortModel}
          // onSortModelChange={(model) => setSortModel(model)}
          filterModel={filterModel}
          onFilterModelChange={(model) => setFilterModel(model)}
          className="data-grid"
          pagination
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
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
          onRowDoubleClick={(params, event) => {
            let contact_id = params.row.contact_id;
            // console.log(contact_id);
            window.location.href = "/sales/contact/" + contact_id;
          }}
        />
      </div>
    </>
  );
}
