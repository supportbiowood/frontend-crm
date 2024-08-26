import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useState, useEffect } from "react";

import { DataGridPro } from "@mui/x-data-grid-pro";
import {
  getListUOMGroup,
  getUOMGroupUUIDByID,
} from "../../adapter/Api/graphql";

const columns = [
  {
    headerName: "ลำดับที่",
    field: "id",
    width: 170,
  },
  {
    headerName: "จำนวน",
    field: "baseQty",
    width: 170,
  },
  {
    headerName: "หน่วย",
    field: "name",
    width: 170,
  },
  {
    headerName: "ต่อจำนวน",
    field: "altQty",
    width: 170,
  },
  {
    headerName: "หน่วยหลัก",
    field: "baseUOMName",
    width: 170,
  },
];

export default function UnitComponent(props) {
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState([]);
  const [wareHouse, setWareHouse] = useState([]);

  useEffect(() => {
    getListUOMGroup()
      .then((data) => {
        setWareHouse(data.data.data.listUOMGroup.items);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    getUOMGroupUUIDByID({ getUomGroupUuidId: `${props.values.uomGroupID}` })
      .then((data) => {
        const clone = data.data.data.getUOMGroupUUID;
        const newValue = clone.listUOM.map((data, index) => {
          return {
            id: index + 1,
            altQty: data.altQty,
            name: data.name,
            baseQty: data.baseQty,
            uomID: data.uomID,
            baseUOMID: clone.baseUOMID,
            baseUOMName: clone.baseUOMName,
          };
        });
        props.setFieldValue("inventoryUOMID", clone.baseUOMName);
        setRows(newValue);
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.values.uomGroupID]);

  return (
    <div>
      <div className="grid-container-25">
        <FormControl
          fullWidth
          size="small"
          error={
            props.errors.uomGroupID &&
            props.touched.uomGroupID &&
            props.errors.uomGroupID
          }
        >
          <InputLabel>กลุ่มของหน่วย</InputLabel>
          <Select
            onChange={(e) => {
              props.handleChange(e);
            }}
            onBlur={props.handleBlur}
            type="text"
            label="กลุ่มของหน่วย"
            name="uomGroupID"
            id="demo-simple-select-error"
            value={props.values.uomGroupID || ""}
          >
            {wareHouse.map((unit, index) => (
              <MenuItem key={index} value={unit.id}>
                {unit.internalID}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {props.errors.uomGroupID &&
              props.touched.uomGroupID &&
              props.errors.uomGroupID}
          </FormHelperText>
        </FormControl>
      </div>
      <div className="grid-container-25">
        <TextField
          disabled
          onBlur={props.handleBlur}
          size="small"
          type="text"
          name="inventoryUOMID"
          id="outlined-error-helper-text"
          label="หน่วยเก็บ"
          value={props.values.inventoryUOMID || ""}
          error={
            props.errors.inventoryUOMID &&
            props.touched.inventoryUOMID &&
            props.errors.inventoryUOMID
          }
          helperText={
            props.errors.inventoryUOMID &&
            props.touched.inventoryUOMID &&
            props.errors.inventoryUOMID
          }
        />
        <FormControl
          fullWidth
          size="small"
          error={
            props.errors.purchaseUOMID &&
            props.touched.purchaseUOMID &&
            props.errors.purchaseUOMID
          }
        >
          <InputLabel>หน่วยซื้อ</InputLabel>
          <Select
            onChange={(e) => {
              props.handleChange(e);
            }}
            onBlur={props.handleBlur}
            type="text"
            label="หน่วยซื้อ"
            name="purchaseUOMID"
            id="demo-simple-select-error"
            value={props.values.purchaseUOMID || ""}
          >
            {rows.map((row, index) => (
              <MenuItem key={index} value={row.uomID}>
                {row.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {props.errors.purchaseUOMID &&
              props.touched.purchaseUOMID &&
              props.errors.purchaseUOMID}
          </FormHelperText>
        </FormControl>
        <FormControl
          fullWidth
          size="small"
          error={
            props.errors.saleUOMID &&
            props.touched.saleUOMID &&
            props.errors.saleUOMID
          }
        >
          <InputLabel>หน่วยขาย</InputLabel>
          <Select
            onChange={(e) => {
              props.handleChange(e);
            }}
            onBlur={props.handleBlur}
            type="text"
            label="หน่วยขาย"
            name="saleUOMID"
            id="demo-simple-select-error"
            value={props.values.saleUOMID || ""}
          >
            {rows.map((row, index) => (
              <MenuItem key={index} value={row.uomID}>
                {row.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {props.errors.saleUOMID &&
              props.touched.saleUOMID &&
              props.errors.saleUOMID}
          </FormHelperText>
        </FormControl>
      </div>
      <h3>กลุ่มของหน่วยสินค้าไม้</h3>
      <div className="myTable3">
        <DataGridPro
          rows={rows}
          columns={columns}
          pagination
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[10, 20, 30, 40, 50]}
          onRowDoubleClick={(params, event) => {
            let internalID = params.row.internalID;
            console.log(internalID);
            // console.log(employee_id);
            // window.location.href = "item-master/" + internalID;
          }}
        />
      </div>
    </div>
  );
}
