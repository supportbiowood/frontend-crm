import React, { useState, useEffect } from "react";
import {
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Formik, Form } from "formik";

import ButtonComponent from "../ButtonComponent";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";

import { createTheme } from "@mui/material/styles";
import { createStyles, makeStyles } from "@mui/styles";
import {
  DataGridPro,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid-pro";
import TablePagination from "@mui/material/TablePagination";

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
      <GridToolbarExport className={"export-button"} />
      <GridToolbarDensitySelector className={"export-button"} />
      <GridToolbarColumnsButton className={"export-button"} />
    </GridToolbarContainer>
  );
}

const option = [
  {
    id: 1,
    name: "OPTION 1",
  },
  {
    id: 2,
    name: "OPTION 2",
  },
];
let mockRows = [
  {
    item: "A",
    ref_qty: 30,
    batch_id: "",
    qty: 10,
    location_id: "a1",
    employee_id: "",
    scan_date: "",
    status: "scanned",
  },
  {
    item: "A",
    ref_qty: 40,
    batch_id: "",
    qty: 20,
    location_id: "a2",
    employee_id: "",
    scan_date: "",
    status: "scanned",
  },
  {
    item: "B",
    ref_qty: 20,
    batch_id: "",
    qty: 10,
    location_id: "b1",
    employee_id: "",
    scan_date: "",
    status: "scanned",
  },
  {
    item: "B",
    ref_qty: 20,
    batch_id: "",
    qty: 10,
    location_id: "b2",
    employee_id: "",
    scan_date: "",
    status: "scanned",
  },
  {
    item: "C",
    ref_qty: 20,
    batch_id: "",
    qty: 10,
    location_id: "b1",
    employee_id: "",
    scan_date: "",
    status: "scanned",
  },
  {
    item: "E",
    ref_qty: 20,
    batch_id: "",
    qty: 10,
    location_id: "e1",
    employee_id: "",
    scan_date: "",
    status: "scanned",
  },
  {
    item: "E",
    ref_qty: 20,
    batch_id: "",
    qty: 10,
    location_id: "e2",
    employee_id: "",
    scan_date: "",
    status: "scanned",
  },
  {
    item: "E",
    ref_qty: 20,
    batch_id: "",
    qty: 10,
    location_id: "e3",
    employee_id: "",
    scan_date: "",
    status: "scanned",
  },
];

const newRows = [];
const setNewRows = () => {
  mockRows.map((row) => {
    const check = newRows.some((data) => {
      return `${data.item}` === `${row.item}`;
    });

    if (!check) {
      return newRows.push({
        item: row.item,
        ref_qty: mockRows
          .filter((filter) => {
            return row.item === filter.item;
          })
          .reduce(
            (sum, inc) => {
              return parseInt(inc.ref_qty) + parseInt(sum);
            },
            [0]
          ),
        quantityReference: null,
        quantity: null,
        val_diff: null,
        uomID: "แผ่น",
        transaction: [row],
      });
    } else {
      return newRows
        .filter((value) => {
          return value.item === row.item;
        })[0]
        .transaction.push(row);
    }
  });
  console.log("newRows", newRows);
};
export default function TestTableCell() {
  const [myValue] = useState({
    stage: 0,
    receiptType: "purchase",
    documentID: 1,
    recieveDate: new Date(),
    lineitem: [],
    testrows: newRows,
  });

  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [rows, setRows] = useState([
    {
      id: 0,
      sortNo: 1,
      itemID: "1",
      quantityReference: 0,
      uomID: "เมตร",
      testSelectData: "",
      testTextFieldData: "",
    },
    {
      id: 1,
      sortNo: 2,
      itemID: "1",
      quantityReference: 0,
      uomID: "เมตร",
      testSelectData: "",
      testTextFieldData: "",
    },
  ]);

  const columns = [
    { field: "sortNo", headerName: "ลำดับ", width: 200 },
    { field: "itemID", headerName: "รหัสสินค้า", width: 200 },
    { field: "quantityReference", headerName: "จำนวนตั้งต้น", width: 200 },
    {
      field: "quantityReal",
      headerName: "จำนวนจริง",
      width: 200,
      renderCell: (params) => (
        <TextField
          fullWidth
          label="textText"
          size="small"
          value={params.value}
          name=""
          onChange={(e) => {
            rows[params.id].quantityReal = e.target.value;
          }}
        />
      ),
    },
    { field: "uomID", headerName: "หน่วย ", width: 200 },
    {
      field: "testSelectData",
      headerName: "testSelect",
      width: 200,
      renderCell: (params) => (
        <FormControl fullWidth size="small">
          <InputLabel id="demo-simple-select-label">คลัง</InputLabel>
          <Select
            fullWidth
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            size="small"
            sx={{ width: "200px" }}
            label="คลัง"
            defaultValue={1}
            value={params.value}
            onChange={(e) => {
              rows[params.id].testSelectData = e.target.value;
            }}
          >
            {option.map((val, index) => (
              <MenuItem key={`${val.name} + ${index}`} value={val.name}>
                {val.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ),
    },
    {
      field: "testTextFieldData",
      headerName: "testTextField",
      width: 200,
      renderCell: (params) => (
        <TextField
          fullWidth
          label="textText"
          size="small"
          value={params.value}
          name="contact_tax_no"
          onChange={(e) => {
            rows[params.id].testTextFieldData = e.target.value;
          }}
        />
      ),
    },
  ];

  const [searchText, setSearchText] = useState("");
  const requestSearch = (searchValue) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
    const filteredRows = rows.filter((row) => {
      return Object.keys(row).some((field) => {
        if (typeof row[field] == "string")
          return searchRegex.test(row[field].toString());
        else return false;
      });
    });
    setRows(filteredRows);
  };

  useEffect(() => {
    setNewRows();
    console.log("newRows", newRows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newRows]);

  const columnList = [
    "ลำดับ",
    "รหัสสินค้า",
    "สแกนสินค้า",
    "จำนวนตั้งต้น",
    "จำนวนจริง",
    "ส่วนต่าง",
    "หน่วย",
    "Pallete",
    "ผู้สแกน",
    "วันที่สแกน",
    "",
    "หมายเลข Serial",
    "",
  ];

  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={myValue}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          const prepare_rows = [];
          values.testrows.map((row) => {
            return row.transaction.map((item) => {
              return prepare_rows.push(item);
            });
          });
          console.log("testrows", prepare_rows);
          return;
        }}
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          setErrors,
          setFieldValue,
          setSubmitting,
        }) => (
          <Form
            method="POST"
            onSubmit={handleSubmit}
            className={"inputGroup"}
            autoComplete="off"
          >
            <div className="myTable">
              <DataGridPro
                rows={rows}
                columns={columns}
                checkboxSelection
                onSelectionModelChange={(ids) => {
                  const selectedIDs = new Set(ids);
                  const selectedRows = rows.filter((row) =>
                    selectedIDs.has(row.id)
                  );
                  values.lineitem = selectedRows;
                }}
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
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[10, 30, 50, 100, 200]}
              />
            </div>
            <ButtonComponent
              text="submit"
              type="submit"
              variant="outlined"
              color="success"
            />
            <div>
              {/* {values.testrows.map((data, index) => {
                return (
                  <div>
                    <div>
                      {data.transaction.length > 1 && (
                        <div style={{ display: 'flex' }}>
                          <div>{index}</div>
                          <div>{data.item}</div>
                          <div className="inventory-product-scan-waiting">รอสแกน</div>
                          <div>{data.ref_qty}</div>,
                          <TextField size="small" type="text" name="id" id="outlined-error-helper-text" value={90} />
                          <div className="inventory-difference">-10</div>
                          <div>แผ่น</div>
                          <TextField
                            size="small"
                            type="text"
                            name="id"
                            id="outlined-error-helper-text"
                            value="PalleteA"
                          />
                          <div>ชื่อผู้ดำเนินการ</div>
                          <div>26/10/2021 14:20</div>
                          <button className="inventory-barcode">พิมพ์ BARCODE</button>,<div>11111111</div>
                          <img
                            // onClick={() => setAddActive(rowList.code)}
                            className="inventory-add-icon"
                            src="icons/add-button.svg"
                          />
                        </div>
                      )}
                    </div>
                    {data.transaction.map((value, i) => {
                      return (
                        <div className="table-customrows-test">
                          <div>{value.item}</div>
                          <div>{value.ref_qty}</div>
                          <div>{value.batch_id}</div>
                          <TextField
                            onChange={(e) => {
                              const clone = [...values.testrows]
                              clone[index].transaction[i].qty = parseInt(e.target.value)
                              console.log('clone', clone)
                              setFieldValue('testrows', clone)
                            }}
                            size="small"
                            type="text"
                            name="id"
                            id="outlined-error-helper-text"
                            label="รหัสสินค้า"
                            value={value.qty || ''}
                          />
                          <div>{value.location_id}</div>
                          <div>{value.employee_id}</div>
                          <div>{value.scan_date}</div>
                          <div>{value.status}</div>
                        </div>
                      )
                    })}
                  </div>
                )
              })} */}
              {/* {values.testrows.map((data, index) => {
                return (
                  <div className="table-customrows-test">
                    <div>{index}</div>
                    <div>{data.item}</div>
                    <div>{data.ref_qty}</div>
                    <div>{data.batch_id}</div>
                    <div>{data.qty}</div>
                    <div>{data.location_id}</div>
                    <div>{data.employee_id}</div>
                    <div>{data.scan_date}</div>
                    <div>{data.status}</div>
                  </div>
                );
              })} */}
            </div>
            <>
              <div className="table-container">
                <table id="inventory" rules="none">
                  <thead>
                    {columnList.map((item, i) => {
                      return [<td>{item} </td>];
                    })}
                  </thead>
                  <tbody id="table-body">
                    {newRows.map((item, i) => {
                      return [
                        <>
                          <tr key={i}>
                            <td>{item.item}</td>
                            <td>{item.ref_qty}</td>
                            <td>
                              <div className="inventory-product-scan-waiting">
                                รอสแกน
                              </div>
                            </td>
                            <td>{item.quantityReference}</td>
                            <td>
                              <TextField
                                size="small"
                                type="text"
                                name="id"
                                id="outlined-error-helper-text"
                                value={item.quantity}
                              />
                            </td>
                            <td>{item.val_diff}</td>
                            <td>{item.uomID}</td>
                            <td>
                              <TextField
                                size="small"
                                type="text"
                                name="id"
                                id="outlined-error-helper-text"
                                value="PalleteA"
                              />
                            </td>
                            <td>{item.name}</td>
                            <td>{item.date}</td>
                            <td>
                              <button className="inventory-barcode">
                                พิมพ์ BARCODE
                              </button>
                            </td>
                            <td>{item.serial_no}</td>
                            <td>
                              <img
                                // onClick={() => setAddActive(rowList.code)}
                                alt="inventory-add-icon"
                                className="inventory-add-icon"
                                src="icons/add-button.svg"
                              />
                            </td>
                          </tr>
                          {item.transaction.map((subItem, subIndex) => {
                            return (
                              <tr
                              // className={
                              //   addActive === item.code ? 'inventory-sub-row-selected' : 'inventory-sub-row'
                              // }
                              >
                                <td></td>
                                <td>{subItem.item}</td>
                                <td></td>
                                <td></td>
                                <td>
                                  <TextField
                                    size="small"
                                    type="text"
                                    name="id"
                                    id="outlined-error-helper-text"
                                    value={subItem.ref_qty}
                                  />
                                </td>
                                <td></td>
                                <td></td>
                                <td>
                                  <TextField
                                    size="small"
                                    type="text"
                                    name="id"
                                    id="outlined-error-helper-text"
                                    value={subItem.batch_id}
                                  />
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                              </tr>
                            );
                          })}
                        </>,
                      ];
                    })}
                  </tbody>
                </table>
              </div>
              <TablePagination
                component="div"
                count={100}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          </Form>
        )}
      </Formik>
    </div>
  );
}
