import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { getItemCategoryList } from "../../adapter/Api/graphql";

export default function CommonComponent(props) {
  useEffect(() => {
    getItemCategoryList({ parentIdList: [] })
      .then((data) => {
        setCategoryItem(data.data.data.listItemCategory.items);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [categoryItem, setCategoryItem] = useState([]);

  const UnitCategory = [
    {
      name: "เมตร",
      value: "m",
    },
    {
      name: "เซนติเมตร",
      value: "cm",
    },
    {
      name: "มิลลิเมตร",
      value: "mm",
    },
    {
      name: "ฟุต",
      value: "ft",
    },
  ];

  const UnitCategory2 = [
    {
      name: "กรัม",
      value: "k",
    },
    {
      name: "กิโลกรัม",
      value: "kg",
    },
  ];

  const findIndexChildOne = (data) => {
    const find = categoryItem.find((val) => {
      return `${val.id}` === `${props.values.itemCategory}`;
    });

    if (find === undefined || find.listChild === undefined) return null;
    return (
      <FormControl
        fullWidth
        size="small"
        error={
          props.errors.itemCategory2 &&
          props.touched.itemCategory2 &&
          props.errors.itemCategory2
        }
      >
        <InputLabel>หมวดหมู่สินค้า 2</InputLabel>
        <Select
          onChange={(e) => {
            props.handleChange(e);
          }}
          onBlur={props.handleBlur}
          type="text"
          name={`itemCategory2`}
          label="หมวดหมู่สินค้า 2"
          id="demo-simple-select-error"
          value={props.values.itemCategory2 || ""}
        >
          {find &&
            find.listChild.items.map((list, index) => {
              return (
                <MenuItem key={index} value={list.id}>
                  {list.name}
                </MenuItem>
              );
            })}
        </Select>
        <FormHelperText>
          {props.errors.itemCategory2 &&
            props.touched.itemCategory2 &&
            props.errors.itemCategory2}
        </FormHelperText>
      </FormControl>
    );
  };

  const findIndexChildTwo = (data) => {
    const find = categoryItem.find((val) => {
      return val.id === `${props.values.itemCategory}`;
    });

    if (find === undefined || find.listChild === undefined) return null;

    const find2 = find.listChild.items.find((val) => {
      return `${val.id}` === `${props.values.itemCategory2}`;
    });

    if (find2 === undefined || find2.listChild.items.length === 0) return null;
    return (
      <FormControl
        fullWidth
        size="small"
        error={
          props.errors.itemCategory3 &&
          props.touched.itemCategory3 &&
          props.errors.itemCategory3
        }
      >
        <InputLabel>หมวดหมู่สินค้า 3</InputLabel>
        <Select
          onChange={(e) => {
            props.handleChange(e);
          }}
          onBlur={props.handleBlur}
          type="text"
          name={`itemCategory3`}
          label="หมวดหมู่สินค้า 3"
          id="demo-simple-select-error"
          value={props.values.itemCategory3 || ""}
        >
          {find2.listChild.items.map((list, index) => {
            return (
              <MenuItem key={index} value={list.id}>
                {list.name}
              </MenuItem>
            );
          })}
        </Select>
        <FormHelperText>
          {props.errors.itemCategory3 &&
            props.touched.itemCategory3 &&
            props.errors.itemCategory3}
        </FormHelperText>
      </FormControl>
    );
  };

  const findIndexChildThree = (data) => {
    const find = categoryItem.find((val) => {
      return `${val.id}` === `${props.values.itemCategory}`;
    });

    if (find === undefined || find.listChild === undefined) return null;

    const find2 = find.listChild.items.find((val) => {
      return `${val.id}` === `${props.values.itemCategory2}`;
    });

    if (find2 === undefined || find2.listChild.items.length === 0) return null;

    const find3 = find2.listChild.items.find((val) => {
      return `${val.id}` === `${props.values.itemCategory3}`;
    });

    if (find3 === undefined || find3.listChild.items.length === 0) return null;

    return (
      <FormControl
        fullWidth
        size="small"
        error={
          props.errors.itemCategory4 &&
          props.touched.itemCategory4 &&
          props.errors.itemCategory4
        }
      >
        <InputLabel>หมวดหมู่สินค้า 4</InputLabel>
        <Select
          onChange={(e) => {
            props.handleChange(e);
          }}
          onBlur={props.handleBlur}
          type="text"
          name={`itemCategory4`}
          label="หมวดหมู่สินค้า 4"
          id="demo-simple-select-error"
          value={props.values.itemCategory4 || ""}
        >
          {find3.listChild.items.map((list, index) => {
            return (
              <MenuItem key={index} value={list.id}>
                {list.name}
              </MenuItem>
            );
          })}
        </Select>
        <FormHelperText>
          {props.errors.itemCategory4 &&
            props.touched.itemCategory4 &&
            props.errors.itemCategory4}
        </FormHelperText>
      </FormControl>
    );
  };

  return (
    <div>
      <h3>หมวดหมู่</h3>
      <div className="grid-container-25">
        <FormControl
          fullWidth
          size="small"
          error={
            props.errors.itemCategory &&
            props.touched.itemCategory &&
            props.errors.itemCategory
          }
        >
          <InputLabel>หมวดหมู่สินค้า 1</InputLabel>
          <Select
            onChange={(e) => {
              props.handleChange(e);
            }}
            onBlur={props.handleBlur}
            type="text"
            name={`itemCategory`}
            label="หมวดหมู่สินค้า 1"
            id="demo-simple-select-error"
            value={props.values.itemCategory || ""}
          >
            {categoryItem.map((item, index) => (
              <MenuItem key={index} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {props.errors.itemCategory &&
              props.touched.itemCategory &&
              props.errors.itemCategory}
          </FormHelperText>
        </FormControl>
        {findIndexChildOne()}
        {findIndexChildTwo()}
        {findIndexChildThree()}
      </div>
      <h3>ขนาด</h3>
      <div className="grid-container-50">
        <div>
          <div className="grid-container-75">
            <TextField
              onChange={(e) => {
                props.handleChange(e);
              }}
              onBlur={props.handleBlur}
              step={0.5}
              type="number"
              size="small"
              name="listSaleUOM.width"
              id="outlined-error-helper-text"
              label="กว้าง"
              value={props.values.listSaleUOM.width || ""}
              error={
                props.errors.listSaleUOM?.width &&
                props.touched.listSaleUOM?.width &&
                props.errors.listSaleUOM?.width
              }
              helperText={
                props.errors.listSaleUOM?.width &&
                props.touched.listSaleUOM?.width &&
                props.errors.listSaleUOM?.width
              }
            />
            <FormControl fullWidth size="small">
              <InputLabel>หน่วย</InputLabel>
              <Select
                onChange={(e) => {
                  props.handleChange(e);
                }}
                onBlur={props.handleBlur}
                type="text"
                name="listSaleUOM.widthUOM"
                label="หน่วย"
                id="demo-simple-select-error"
                value={props.values.listSaleUOM.widthUOM || ""}
              >
                {UnitCategory.map((item, index) => (
                  <MenuItem key={index} value={item.value}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              onChange={(e) => {
                props.handleChange(e);
              }}
              onBlur={props.handleBlur}
              step={0.5}
              type="number"
              size="small"
              name="listSaleUOM.length"
              id="outlined-error-helper-text"
              label="หนา"
              value={props.values.listSaleUOM.length || ""}
              error={
                props.errors.listSaleUOM?.length &&
                props.touched.listSaleUOM?.length &&
                props.errors.listSaleUOM?.length
              }
              helperText={
                props.errors.listSaleUOM?.length &&
                props.touched.listSaleUOM?.length &&
                props.errors.listSaleUOM?.length
              }
            />
            <FormControl fullWidth size="small">
              <InputLabel>หน่วย</InputLabel>
              <Select
                onChange={(e) => {
                  props.handleChange(e);
                }}
                onBlur={props.handleBlur}
                type="text"
                name="listSaleUOM.lengthUOM"
                label="หน่วย"
                id="demo-simple-select-error"
                value={props.values.listSaleUOM.lengthUOM || ""}
              >
                {UnitCategory.map((item, index) => (
                  <MenuItem key={index} value={item.value}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              onChange={(e) => {
                props.handleChange(e);
              }}
              onBlur={props.handleBlur}
              step={0.5}
              type="number"
              size="small"
              name="listSaleUOM.height"
              id="outlined-error-helper-text"
              label="ยาว"
              value={props.values.listSaleUOM.height || ""}
              error={
                props.errors.listSaleUOM?.height &&
                props.touched.listSaleUOM?.height &&
                props.errors.listSaleUOM?.height
              }
              helperText={
                props.errors.listSaleUOM?.height &&
                props.touched.listSaleUOM?.height &&
                props.errors.listSaleUOM?.height
              }
            />
            <FormControl fullWidth size="small">
              <InputLabel>หน่วย</InputLabel>
              <Select
                onChange={(e) => {
                  props.handleChange(e);
                }}
                onBlur={props.handleBlur}
                type="text"
                name="listSaleUOM.heightUOM"
                label="หน่วย"
                id="demo-simple-select-error"
                value={props.values.listSaleUOM.heightUOM || ""}
              >
                {UnitCategory.map((item, index) => (
                  <MenuItem key={index} value={item.value}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              onChange={(e) => {
                props.handleChange(e);
              }}
              onBlur={props.handleBlur}
              step={0.5}
              type="number"
              size="small"
              name="listSaleUOM.weight"
              id="outlined-error-helper-text"
              label="น้ำหนัก"
              value={props.values.listSaleUOM.weight || ""}
              error={
                props.errors.listSaleUOM?.weight &&
                props.touched.listSaleUOM?.weight &&
                props.errors.listSaleUOM?.weight
              }
              helperText={
                props.errors.listSaleUOM?.weight &&
                props.touched.listSaleUOM?.weight &&
                props.errors.listSaleUOM?.weight
              }
            />
            <FormControl fullWidth size="small">
              <InputLabel>หน่วย</InputLabel>
              <Select
                onChange={(e) => {
                  props.handleChange(e);
                }}
                onBlur={props.handleBlur}
                type="text"
                name="listSaleUOM.weightUOM"
                label="หน่วย"
                id="demo-simple-select-error"
                value={props.values.listSaleUOM.weightUOM || ""}
              >
                {UnitCategory2.map((item, index) => (
                  <MenuItem key={index} value={item.value}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </div>
    </div>
  );
}
