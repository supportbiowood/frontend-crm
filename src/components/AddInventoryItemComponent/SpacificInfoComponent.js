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
import { getItemPropertyList } from "../../adapter/Api/graphql";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import { getIn } from "formik";

export default function SpacificInfo({
  values,
  setFieldValue,
  touched,
  errors,
  handleChange,
  handleBlur,
}) {
  const [typeItem, setTypeItem] = useState([]);

  useEffect(() => {
    getItemPropertyList().then((data) => {
      const newValue = data.data.data.listItemProperty.items.map(
        (data, index) => {
          return {
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
      console.log("newValue", newValue);
    });
  }, [values.itemPropertyList]);

  useEffect(() => {
    if (values.itemType === "PRODUCT")
      setFieldValue("itemPropertyList", [
        {
          description: "Red",
          id: "7f7e29d5-4b39-44cd-aa21-bc42fb953b75",
          internalID: "CL",
          name: "สี",
          type: "STRING",
          value: null,
        },
        {
          description: "Matte",
          id: "a74a6375-d724-4721-a408-b06aefb2c12e",
          internalID: "SUR",
          name: "ผิว",
          type: "STRING",
          value: null,
        },
      ]);
    else return setFieldValue("itemPropertyList", []);
  }, [setFieldValue, values.itemType]);

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
            const clone = [...values.itemPropertyList];
            clone.push({
              id: "",
              name: "",
              internalID: null,
              type: "",
              description: "",
              value: "",
            });
            setFieldValue("itemPropertyList", clone);
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
        {values.itemPropertyList &&
          values.itemPropertyList.map((val, index) => {
            return (
              <div>
                <div className="inventory-spacificInfo-table-rows">
                  <FormControl
                    error={Boolean(
                      getIn(touched, `itemPropertyList[${index}].id`) &&
                        getIn(errors, `itemPropertyList[${index}].id`)
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
                        handleChange(e);
                        const find = typeItem.find((data) => {
                          return data.id === e.target.value;
                        });
                        setFieldValue(
                          `itemPropertyList[${index}].internalID`,
                          find.internalID
                        );
                        setFieldValue(
                          `itemPropertyList[${index}].type`,
                          find.type
                        );
                        setFieldValue(
                          `itemPropertyList[${index}].name`,
                          find.name
                        );
                        setFieldValue(
                          `itemPropertyList[${index}].description`,
                          find.description
                        );
                      }}
                      onBlur={handleBlur}
                      type="text"
                      name={`itemPropertyList[${index}].id`}
                      label="คุณสมบัติ"
                      id="demo-simple-select-error"
                      value={values.itemPropertyList[index].id || ""}
                    >
                      {typeItem.map((item, index) => (
                        <MenuItem key={index} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {getIn(touched, `itemPropertyList[${index}].id`) &&
                        getIn(errors, `itemPropertyList[${index}].id`)}
                    </FormHelperText>
                  </FormControl>
                  <p>{val.internalID}</p>
                  <TextField
                    fullWidth
                    label=""
                    size="small"
                    value={values.itemPropertyList[index].value || ""}
                    name={`itemPropertyList[${index}].value`}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    error={Boolean(
                      getIn(touched, `itemPropertyList[${index}].value`) &&
                        getIn(errors, `itemPropertyList[${index}].value`)
                    )}
                    helperText={
                      getIn(touched, `itemPropertyList[${index}].value`) &&
                      getIn(errors, `itemPropertyList[${index}].value`) &&
                      "กรุณากรอก"
                    }
                  />
                  <IconButton
                    onClick={() => {
                      const clone = [...values.itemPropertyList];
                      const newClone = clone.filter((data, i) => {
                        return `${i}` !== `${index}`;
                      });
                      setFieldValue("itemPropertyList", newClone);
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
