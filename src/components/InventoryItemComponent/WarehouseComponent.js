import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { getListWareHouse } from "../../adapter/Api/graphql";

export default function WarehouseComponent(props) {
  const [warehouse, setWarehouse] = useState([]);

  useEffect(() => {
    getListWareHouse()
      .then((data) => {
        setWarehouse(data.data.data.listWarehouse.items);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const Menu = [
    {
      name: "Standard Cost",
      value: "STD_COST",
    },
    {
      name: "Moving Average",
      value: "MOVING_AVG",
    },
  ];

  return (
    <div>
      <div className="grid-container-25">
        <FormControl
          fullWidth
          size="small"
          error={
            props.errors.itemValuation &&
            props.touched.itemValuation &&
            props.errors.itemValuation
          }
        >
          <InputLabel>การคิดมูลค่าสินค้า</InputLabel>
          <Select
            onChange={(e) => {
              props.handleChange(e);
            }}
            onBlur={props.handleBlur}
            type="text"
            label="การคิดมูลค่าสินค้า"
            name="itemValuation"
            id="demo-simple-select-error"
            value={props.values.itemValuation || ""}
          >
            {Menu.map((menu, index) => (
              <MenuItem key={index} value={menu.value}>
                {menu.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {props.errors.itemValuation &&
              props.touched.itemValuation &&
              props.errors.itemValuation}
          </FormHelperText>
        </FormControl>
      </div>
      <div className="grid-container-25">
        <TextField
          onChange={(e) => {
            props.handleChange(e);
          }}
          onBlur={props.handleBlur}
          size="small"
          type="text"
          name="inventoryMinQty"
          id="outlined-error-helper-text"
          label="สินค้าคงคลังขั้นต่ำ"
          value={props.values.inventoryMinQty || ""}
          error={
            props.errors.inventoryMinQty &&
            props.touched.inventoryMinQty &&
            props.errors.inventoryMinQty
          }
          helperText={
            props.errors.inventoryMinQty &&
            props.touched.inventoryMinQty &&
            props.errors.inventoryMinQty
          }
        />
      </div>
      <h3>กำหนดคลังเริ่มต้น</h3>
      <div className="grid-container-25">
        <FormControl
          fullWidth
          size="small"
          error={
            props.errors.defaultWarehouseID &&
            props.touched.defaultWarehouseID &&
            props.errors.defaultWarehouseID
          }
        >
          <InputLabel>คลัง</InputLabel>
          <Select
            onChange={(e) => {
              props.handleChange(e);
            }}
            onBlur={props.handleBlur}
            disabled
            type="text"
            label="คลัง"
            name="defaultWarehouseID"
            id="demo-simple-select-error"
            value={props.values.defaultWarehouseID || ""}
          >
            {warehouse.map((menu, index) => (
              <MenuItem key={index} value={menu.id}>
                {menu.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {props.errors.defaultWarehouseID &&
              props.touched.defaultWarehouseID &&
              props.errors.defaultWarehouseID}
          </FormHelperText>
        </FormControl>
      </div>
    </div>
  );
}
