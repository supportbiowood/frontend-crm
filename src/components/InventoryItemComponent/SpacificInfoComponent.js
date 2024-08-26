import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import { getItemPropertyList } from "../../adapter/Api/graphql";
import { getIn } from "formik";

export default function SpacificInfo(props) {
  const [typeItem, setTypeItem] = useState([]);

  useEffect(() => {
    getItemPropertyList()
      .then((data) => {
        const newValue = data.data.data.listItemProperty.items.map(
          (data, index) => {
            return {
              sortID: index + 1,
              id: data.id,
              internalID: data.internalID,
              type: data.type,
              value: data.value,
              description: data.description,
              name: data.name,
            };
          }
        );
        setTypeItem(newValue);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [props.values.itemPropertyList]);

  return (
    <div style={{ padding: "24px" }}>
      <h3>ข้อมูลเฉพาะ</h3>
      <div style={{ textAlign: "end" }}>
        <Button
          sx={{ margin: "8px 0 " }}
          type="button"
          variant="contained"
          color="success"
          onClick={() => {
            const clone = [...props.values.itemPropertyList];
            clone.push({
              id: "",
              name: "",
              internalID: null,
              type: "",
              description: "",
              value: "",
            });
            props.setFieldValue("itemPropertyList", clone);
          }}
        >
          เพิ่ม
        </Button>
      </div>
      <div>
        <div className="inventory-spacificInfo-table">
          <p>คุณสมบัติ</p>
          <p>ตัวย่อ</p>
          <p>ค่าข้อมูล</p>
        </div>
        {props.values.itemPropertyList &&
          props.values.itemPropertyList.map((val, index) => {
            return (
              <div>
                <div className="inventory-spacificInfo-table-rows">
                  <FormControl
                    error={Boolean(
                      getIn(props.touched, `itemPropertyList[${index}].id`) &&
                        getIn(props.errors, `itemPropertyList[${index}].id`)
                    )}
                    sx={{ width: "200px" }}
                    fullWidth
                    size="small"
                  >
                    <InputLabel>คุณสมบัติ</InputLabel>
                    <Select
                      fullWidth
                      size="small"
                      onChange={(e) => {
                        props.handleChange(e);
                        const find = typeItem.find((data) => {
                          return data.id === e.target.value;
                        });
                        props.setFieldValue(
                          `itemPropertyList[${index}].internalID`,
                          find.internalID
                        );
                        props.setFieldValue(
                          `itemPropertyList[${index}].type`,
                          find.type
                        );
                      }}
                      onBlur={props.handleBlur}
                      type="text"
                      name={`itemPropertyList[${index}].id`}
                      label="คุณสมบัติ"
                      id="demo-simple-select-error"
                      value={props.values.itemPropertyList[index].id || ""}
                    >
                      {typeItem.map((item, index) => (
                        <MenuItem key={index} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {getIn(props.touched, `itemPropertyList[${index}].id`) &&
                        getIn(props.errors, `itemPropertyList[${index}].id`)}
                    </FormHelperText>
                  </FormControl>
                  <p>{val.internalID}</p>
                  <TextField
                    fullWidth
                    label=""
                    size="small"
                    value={props.values.itemPropertyList[index].value || ""}
                    name={`itemPropertyList[${index}].value`}
                    onChange={(e) => {
                      props.handleChange(e);
                    }}
                  />
                  <IconButton
                    onClick={() => {
                      const clone = [...props.values.itemPropertyList];
                      const newClone = clone.filter((data, i) => {
                        return `${i}` !== `${index}`;
                      });
                      props.setFieldValue("itemPropertyList", newClone);
                    }}
                    aria-label="add an alarm"
                  >
                    <ClearIcon />
                  </IconButton>
                </div>
                <hr />
              </div>
            );
          })}
      </div>
    </div>
  );
}
