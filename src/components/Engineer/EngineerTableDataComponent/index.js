import React, { useState, useEffect, Fragment } from "react";
import {
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import { getIn } from "formik";

import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import ButtonComponent from "../../ButtonComponent";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ClearIcon from "@mui/icons-material/Clear";
import DotStatusComponent from "../../DotStatusComponent";
import { queryItemInventory } from "../../../adapter/Api/graphql";
import EngineerEditAmountComponent from "../EngineerEditAmountComponent";
import AccountConfirmationComponent from "../../Account/AccountConfirmationComponent";

const filter = createFilterOptions();

export default function EngineerTableDataComponent({
  data,
  formik,
  disabled,
  name,
  errors,
  touched,
  status,
}) {
  const [itemList, setItemList] = useState([]);
  const [confirmation, setConfirmation] = useState([false]);
  //header table

  const columnList = [
    { nameth: "รายการ", nameEng: "No." },
    { nameth: "ชื่อสินค้า", nameEng: "Name" },
    { nameth: "จำนวน", nameEng: "Qty" },
    status === "wait_review" ||
    status === "closed" ||
    status === "is_open_quotation"
      ? {
          nameth: "จำนวนเผื่อ",
          nameEng: "Reserved Qty",
        }
      : null,
    { nameth: "หน่วย", nameEng: "Unit" },
    { nameth: "หมายเหตุ", nameEng: "Remark" },
    { nameth: "", nameEng: "" },
  ];

  const filterColumn = columnList.filter(function (el) {
    return el != null;
  });

  const columnListDisableEdit = [
    { nameth: "รายการ", nameEng: "No." },
    { nameth: "ชื่อสินค้า", nameEng: "Name" },
    { nameth: "จำนวน", nameEng: "Qty" },
    { nameth: "หน่วย", nameEng: "Unit" },
    { nameth: "หมายเหตุ", nameEng: "Remark" },
  ];

  const uomOption = [
    {
      label: "ซม.",
      value: "ซม.",
    },
    {
      label: "ม.",
      value: "ม.",
    },
    {
      label: "ตร.ม.",
      value: "ตร.ม.",
    },
  ];

  //function delete group
  const deleteGroup = (groupIndex) => {
    const clone = [...data];
    const newData = clone.filter((_, index) => {
      return index !== groupIndex;
    });
    const newConfimation = confirmation.filter((_, index) => {
      return index !== groupIndex;
    });
    formik.setFieldValue(`${name}`, newData);
    setConfirmation(newConfimation);
    return;
  };

  const checkNull = (data) => {
    if (data === null) return "";
    return data;
  };

  const changeUOM = (uom) => {
    if (uom === null) return "";
    if (uom === "cm") return "ซม.";
    if (uom === "m") return "ม.";
  };

  //filter Item By Category
  const optionItemsCategory = (Items, Category) => {
    if (Category === "วัสดุไม้") {
      const newCategoryItems = Items.filter((item) => {
        return item.itemType === "PRODUCT";
      });
      return newCategoryItems.map((item) => `${item.id} - ${item.name}`);
    } else if (Category === "วัสดุประกอบ") {
      const newCategoryItems = Items.filter((item) => {
        return item.itemType === "PRODUCT_ASSEMBLY";
      });
      return newCategoryItems.map((item) => `${item.id} - ${item.name}`);
    } else if (Category === "วัสดุอุปกรณ์หลัก") {
      const newCategoryItems = Items.filter((item) => {
        return item.itemType === "SUPPLIES";
      });
      return newCategoryItems.map((item) => `${item.id} - ${item.name}`);
    } else if (Category === "บริการ") {
      const newCategoryItems = Items.filter((item) => {
        return item.itemType === "SERVICE";
      });
      return newCategoryItems.map((item) => `${item.id} - ${item.name}`);
    } else if (Category === "วัสดุสิ้นเปลือง") {
      const newCategoryItems = Items.filter((item) => {
        return item.itemType === "CONSUMABLES";
      });
      return newCategoryItems.map((item) => `${item.id} - ${item.name}`);
    } else {
      const newCategoryItems = Items.filter((item) => {
        return item.itemType === "OTHER";
      });
      return newCategoryItems.map((item) => `${item.id} - ${item.name}`);
    }
  };

  //call api to get ItemList
  useEffect(() => {
    const itemInventoryInput = {};
    const getDescription = (Item) => {
      const dimentions = Item.getSaleBaseUOMDimensions;
      if (dimentions === null) return Item.description;
      return `${Item.description} ${checkNull(dimentions.width)}${changeUOM(
        dimentions.widthUOM
      )}${dimentions.width !== null ? "x" : ""}${checkNull(
        dimentions.length
      )}${changeUOM(dimentions.lengthUOM)}${
        dimentions.length !== null ? "x" : ""
      }${checkNull(dimentions.height)}${changeUOM(dimentions.heightUOM)}`;
    };
    queryItemInventory(itemInventoryInput).then((data) => {
      const myData = data.data.data.listItem.items.filter(
        (data) => data.isActive !== false
      );
      const myDataIsStock = myData.filter((data) => data.isSales !== false);
      const usageData = myDataIsStock.map((item) => {
        return {
          id: item.id,
          name: item.name,
          listItemCurrent: item.listItemCurrent,
          purchaseUnitPrice: item.purchaseUnitPrice,
          itemPropertyList: item.itemPropertyList,
          description: getDescription(item),
          itemType: item.itemType,
          saleUnitPrice: item.saleUnitPrice,
          inventoryUOMID: item.inventoryUOMID,
          baseUOMID: item.baseUOMID,
          saleUOMID: item.saleUOMID,
          getSaleBaseUOMDimensions: item.getSaleBaseUOMDimensions, // Length
          getUOMGroup: item.getUOMGroup, // Unit
        };
      });
      setItemList(usageData);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //setValue with mapping item
  const setValueFromItemId = (name, itemName, categoryName) => {
    const itemID = itemName.split("-")[0].replace(/\s+/g, "");
    const findItem = itemList.find((item) => item.id === itemID);
    formik.setFieldValue(`${name}.item_description`, findItem.description);
    formik.setFieldValue(`${name}.item_type`, findItem.itemType);
    formik.setFieldValue(`${name}.item_price`, findItem.saleUnitPrice);
    formik.setFieldValue(`${name}.item_id`, itemID);
    const filterItemColor = findItem.itemPropertyList.filter(
      (item) => item.name === "สี"
    );
    const filterItemSurface = findItem.itemPropertyList.filter(
      (item) => item.name === "ผิว"
    );
    const mapItemColor = filterItemColor
      .map((item) => item.description)
      .join(", ");
    const mapItemSurface = filterItemSurface
      .map((item) => item.description)
      .join(", ");
    formik.setFieldValue(`${name}.item_color`, mapItemColor);
    formik.setFieldValue(`${name}.item_surface`, mapItemSurface);
    if (findItem.getSaleBaseUOMDimensions) {
      formik.setFieldValue(
        `${name}.item_length`,
        findItem.getSaleBaseUOMDimensions.length
      );
    }
    if (categoryName === "วัสดุ Biowood") {
      formik.setFieldValue(`${name}.item_unit`, findItem.inventoryUOMID);
      formik.setFieldValue(
        `${name}.item_display_unit`,
        findItem.inventoryUOMID
      );
    } else {
      if (findItem.getUOMGroup !== null && findItem.getUOMGroup !== undefined)
        return formik.setFieldValue(
          `${name}.item_unit`,
          findItem.getUOMGroup.listUOM[0].name
        );
      return null;
    }
  };

  //get item onhands from mapping item
  const itemStatus = (itemName) => {
    const itemID = itemName.split("-")[0].replace(/\s+/g, "");
    const findItem = itemList.find((item) => item.id === itemID);
    if (findItem === undefined)
      return {
        orderedQty: 0,
        committedQty: 0,
        onHandQty: 0,
      };
    return (
      findItem.listItemCurrent.items[0] || {
        orderedQty: 0,
        committedQty: 0,
        onHandQty: 0,
      }
    );
  };

  //

  const getListUnitByID = (itemName, name) => {
    const unitOption = [
      { name: "ตัว", value: "ตัว" },
      { name: "ชั่วโมง", value: "ชั่วโมง" },
      { name: "ชิ้น", value: "ชิ้น" },
    ];
    const itemID = itemName.split("-")[0].replace(/\s+/g, "");
    const findItem = itemList.find((item) => item.id === itemID);
    if (
      findItem === undefined ||
      findItem.getUOMGroup === undefined ||
      findItem.getUOMGroup === null
    )
      return unitOption.map((option) => {
        return (
          <MenuItem key={`${option.name} + ${itemName}`} value={option.value}>
            {option.name}
          </MenuItem>
        );
      });

    return findItem.getUOMGroup.listUOM.map((item) => {
      return (
        <MenuItem key={`${item.name} + ${itemName}`} value={item.name}>
          {item.name}
        </MenuItem>
      );
    });
  };

  //close popup delete
  const closeConfirmationHandler = (Index) => {
    const newConfimation = confirmation.filter((_, index) => {
      return index !== Index;
    });
    setConfirmation(newConfimation);
  };

  const renderTableSales = (disabled) => {
    return (
      <div style={{ marginBottom: "38px" }}>
        {!disabled ? (
          <div>
            <ButtonComponent
              variant="contained"
              text="เพิ่มกลุ่ม"
              type="button"
              color="success"
              sx={{ width: 130, marginBottom: 3.3 }}
              onClick={() => {
                formik.setFieldValue(
                  name,
                  data.concat({
                    group_name: "",
                    category_list: [
                      { category_name: "วัสดุไม้", item_data: [] },
                      { category_name: "วัสดุประกอบ", item_data: [] },
                      { category_name: "วัสดุอุปกรณ์หลัก", item_data: [] },
                      { category_name: "วัสดุสิ้นเปลือง", item_data: [] },
                      { category_name: "บริการ", item_data: [] },
                      { category_name: "อื่นๆ", item_data: [] },
                    ],
                  })
                );
              }}
            />
            <div className="table-container">
              <table id="tabledata" rules="none">
                <thead>
                  {filterColumn.map((list, index) => {
                    return [
                      <th key={index} style={{ textAlign: "center" }}>
                        <div>{list.nameth}</div>
                        {list.nameEng && <div>{list.nameEng}</div>}
                      </th>,
                    ];
                  })}
                </thead>
                <tbody id="table-body">
                  {data &&
                    data.map((group, groupIndex) => {
                      return [
                        <Fragment key={groupIndex}>
                          <tr
                            key={groupIndex}
                            style={{
                              backgroundColor: "rgba(195, 220, 167, 1)",
                            }}
                          >
                            <th>
                              <p>กลุ่มที่ {groupIndex + 1}</p>
                            </th>
                            <td>
                              <Box
                                display={"flex"}
                                gap={1}
                                style={{ textAlign: "left" }}
                              >
                                <TextField
                                  variant="outlined"
                                  type="text"
                                  size="small"
                                  style={{ width: 140 }}
                                  id={`${name}[${groupIndex}].group_name`}
                                  name={`${name}[${groupIndex}].group_name`}
                                  value={group.group_name}
                                  onChange={(e) => {
                                    formik.handleChange(e);
                                  }}
                                  error={Boolean(
                                    getIn(
                                      touched,
                                      `${name}[${groupIndex}].group_name`
                                    ) &&
                                      getIn(
                                        errors,
                                        `${name}[${groupIndex}].group_name`
                                      )
                                  )}
                                  helperText={
                                    getIn(
                                      touched,
                                      `${name}[${groupIndex}].group_name`
                                    ) &&
                                    getIn(
                                      errors,
                                      `${name}[${groupIndex}].group_name`
                                    )
                                  }
                                />
                                <TextField
                                  variant="outlined"
                                  type="text"
                                  size="small"
                                  style={{
                                    width: "80px",
                                  }}
                                  id={`${name}[${groupIndex}].area`}
                                  name={`${name}[${groupIndex}].area`}
                                  value={group.area}
                                  onChange={(e) => {
                                    formik.handleChange(e);
                                  }}
                                  error={Boolean(
                                    getIn(
                                      touched,
                                      `${name}[${groupIndex}].area`
                                    ) &&
                                      getIn(
                                        errors,
                                        `${name}[${groupIndex}].area`
                                      )
                                  )}
                                  helperText={
                                    getIn(
                                      touched,
                                      `${name}[${groupIndex}].area`
                                    ) &&
                                    getIn(errors, `${name}[${groupIndex}].area`)
                                  }
                                />
                                <Autocomplete
                                  value={group.area_uom}
                                  onChange={(event, newValue) => {
                                    if (typeof newValue === "string") {
                                      formik.setFieldValue(
                                        `${name}[${groupIndex}].area_uom`,
                                        newValue.value
                                      );
                                    } else if (
                                      newValue &&
                                      newValue.inputValue
                                    ) {
                                      // Create a new value from the user input
                                      formik.setFieldValue(
                                        `${name}[${groupIndex}].area_uom`,
                                        newValue.inputValue
                                      );
                                    } else {
                                      formik.setFieldValue(
                                        `${name}[${groupIndex}].area_uom`,
                                        newValue
                                      );
                                    }
                                  }}
                                  filterOptions={(options, params) => {
                                    const filtered = filter(options, params);

                                    const { inputValue } = params;
                                    // Suggest the creation of a new value
                                    const isExisting = options.some(
                                      (option) => inputValue === option.title
                                    );
                                    if (inputValue !== "" && !isExisting) {
                                      filtered.push({
                                        inputValue,
                                        label: `เพิ่ม "${inputValue}"`,
                                      });
                                    }

                                    return filtered;
                                  }}
                                  selectOnFocus
                                  clearOnBlur
                                  handleHomeEndKeys
                                  id="free-solo-with-text-demo"
                                  options={uomOption}
                                  getOptionLabel={(option) => {
                                    // Value selected with enter, right from the input
                                    if (typeof option === "string") {
                                      return option;
                                    }
                                    // Add "xxx" option created dynamically
                                    if (option.inputValue) {
                                      return option.inputValue;
                                    }
                                    // Regular option
                                    return option.label;
                                  }}
                                  renderOption={(props, option) => (
                                    <li {...props}>{option.label}</li>
                                  )}
                                  sx={{ width: 100 }}
                                  size={"small"}
                                  freeSolo
                                  renderInput={(params) => (
                                    <TextField {...params} />
                                  )}
                                />
                              </Box>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            {(status === "wait_review" ||
                              status === "closed" ||
                              status === "is_open_quotation") && <td></td>}
                            <td>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  const cloneConfirm = [...confirmation];
                                  cloneConfirm[groupIndex] = true;
                                  setConfirmation(cloneConfirm);
                                }}
                              >
                                <ClearIcon />
                              </IconButton>
                              <AccountConfirmationComponent
                                open={confirmation[groupIndex]}
                                handleSubmit={() => deleteGroup(groupIndex)}
                                handleClose={() =>
                                  closeConfirmationHandler(groupIndex)
                                }
                                title="ยืนยันการลบกลุ่ม?"
                                description={`ยืนยันการลบ "กลุ่มที่ ${groupIndex + 1}" ใช่หรือไม่ ? ถ้าลบแล้วจะไม่สามารถเปลี่ยนแปลงได้`}
                              />
                            </td>
                          </tr>
                          {group.category_list.map(
                            (category, categoryindex) => {
                              return (
                                <Fragment key={categoryindex}>
                                  <tr
                                    style={{
                                      backgroundColor: "rgba(233, 246, 234, 1)",
                                      borderBottom: "8px white solid",
                                    }}
                                  >
                                    <td></td>
                                    <th style={{ textAlign: "left" }}>
                                      ประเภท: {category.category_name}
                                    </th>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    {(status === "wait_review" ||
                                      status === "closed" ||
                                      status === "is_open_quotation") && (
                                      <td></td>
                                    )}
                                    <td>
                                      <IconButton
                                        size="small"
                                        onClick={() => {
                                          const clone = [...category.item_data];
                                          clone.push({
                                            item_id: "",
                                            item_name: "",
                                            item_color: "",
                                            item_surface: "",
                                            item_length: "",
                                            item_reserved_quantity: 0,
                                            item_quantity: 0,
                                            item_display_unit: null,
                                            item_display_quantity: null,
                                            item_display_reserved_quantity:
                                              null,
                                            item_unit: null,
                                            item_price: 0,
                                            item_type: null,
                                            item_remark: "",
                                            vat: "NONE",
                                          });
                                          formik.setFieldValue(
                                            `${name}[${groupIndex}].category_list[${categoryindex}.item_data`,
                                            clone
                                          );
                                        }}
                                      >
                                        <AddCircleOutlineIcon />
                                      </IconButton>
                                    </td>
                                  </tr>
                                  {category.item_data.map((item, itemIndex) => {
                                    return (
                                      <tr
                                        key={itemIndex}
                                        style={{
                                          borderBottom: "8px white solid",
                                        }}
                                      >
                                        <td>{itemIndex + 1}</td>
                                        <td>
                                          <div>
                                            <Autocomplete
                                              disablePortal
                                              name={`${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_name`}
                                              options={optionItemsCategory(
                                                itemList,
                                                category.category_name
                                              )}
                                              value={item.item_name}
                                              disableClearable
                                              type="text"
                                              size="small"
                                              onChange={(_, v) => {
                                                formik.setFieldValue(
                                                  `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_name`,
                                                  v
                                                );
                                                setValueFromItemId(
                                                  `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}]`,
                                                  v,
                                                  category.category_name
                                                );
                                              }}
                                              renderInput={(params) => (
                                                <TextField
                                                  fullWidth
                                                  {...params}
                                                  label="ชื่อสินค้า"
                                                  error={Boolean(
                                                    getIn(
                                                      touched,
                                                      `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_name`
                                                    ) &&
                                                      getIn(
                                                        errors,
                                                        `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_name`
                                                      )
                                                  )}
                                                  helperText={
                                                    getIn(
                                                      touched,
                                                      `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_name`
                                                    ) &&
                                                    getIn(
                                                      errors,
                                                      `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_name`
                                                    ) &&
                                                    getIn(
                                                      errors,
                                                      `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_name`
                                                    )
                                                  }
                                                />
                                              )}
                                            />
                                          </div>
                                        </td>
                                        <td>
                                          {categoryindex === 0 ? (
                                            <div>
                                              <EngineerEditAmountComponent
                                                showQuantity
                                                itemQuantity={
                                                  item.item_display_quantity
                                                }
                                                itemUnit={item.item_unit}
                                                formik={formik}
                                                name={`${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}]`}
                                                type="item_quantity"
                                              />
                                              <FormHelperText
                                                sx={{ textAlign: "center" }}
                                              >
                                                {item.item_display_quantity !==
                                                  item.item_quantity && (
                                                  <div>
                                                    <p>{item.item_quantity}</p>
                                                  </div>
                                                )}
                                              </FormHelperText>
                                            </div>
                                          ) : (
                                            <div>
                                              <TextField
                                                variant="outlined"
                                                sx={{ width: 100 }}
                                                name={`${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_quantity`}
                                                type="number"
                                                inputProps={{ min: 0 }}
                                                size="small"
                                                value={item.item_quantity}
                                                onChange={(e) => {
                                                  formik.handleChange(e);
                                                }}
                                                error={Boolean(
                                                  getIn(
                                                    touched,
                                                    `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_quantity`
                                                  ) &&
                                                    getIn(
                                                      errors,
                                                      `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_quantity`
                                                    )
                                                )}
                                                helperText={
                                                  getIn(
                                                    touched,
                                                    `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_quantity`
                                                  ) &&
                                                  getIn(
                                                    errors,
                                                    `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_quantity`
                                                  ) &&
                                                  getIn(
                                                    errors,
                                                    `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_quantity`
                                                  )
                                                }
                                              />
                                            </div>
                                          )}
                                        </td>
                                        {(status === "wait_review" ||
                                          status === "closed" ||
                                          status === "is_open_quotation") && (
                                          <td>
                                            {categoryindex === 0 && (
                                              // (
                                              //   <div>
                                              //     <EngineerEditAmountComponent
                                              //       showQuantity
                                              //       itemQuantity={
                                              //         item.item_display_reserved_quantity
                                              //       }
                                              //       itemUnit={item.item_unit}
                                              //       formik={formik}
                                              //       name={`${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}]`}
                                              //       type="item_reserved_quantity"
                                              //     />
                                              //     <FormHelperText
                                              //       sx={{ textAlign: "center" }}
                                              //     >
                                              //       {item.item_display_reserved_quantity !==
                                              //         item.item_reserved_quantity && (
                                              //         <div>
                                              //           <p>
                                              //             {
                                              //               item.item_reserved_quantity
                                              //             }
                                              //           </p>
                                              //         </div>
                                              //       )}
                                              //     </FormHelperText>
                                              //   </div>
                                              // ) :
                                              <div>
                                                <TextField
                                                  variant="outlined"
                                                  sx={{ width: 100 }}
                                                  name={`${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_reserved_quantity`}
                                                  type="number"
                                                  inputProps={{ min: 0 }}
                                                  size="small"
                                                  value={
                                                    item.item_reserved_quantity
                                                  }
                                                  onChange={(e) => {
                                                    formik.handleChange(e);
                                                  }}
                                                  error={Boolean(
                                                    getIn(
                                                      touched,
                                                      `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_reserved_quantity`
                                                    ) &&
                                                      getIn(
                                                        errors,
                                                        `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_reserved_quantity`
                                                      )
                                                  )}
                                                  helperText={
                                                    getIn(
                                                      touched,
                                                      `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_reserved_quantity`
                                                    ) &&
                                                    getIn(
                                                      errors,
                                                      `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_reserved_quantity`
                                                    ) &&
                                                    getIn(
                                                      errors,
                                                      `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_reserved_quantity`
                                                    )
                                                  }
                                                />
                                              </div>
                                            )}
                                          </td>
                                        )}
                                        {categoryindex === 0 ? (
                                          <td>
                                            {item.item_unit === "ตัว" ? (
                                              ""
                                            ) : (
                                              <div>
                                                {item.item_display_unit}
                                                <FormHelperText
                                                  sx={{ textAlign: "center" }}
                                                >
                                                  {item.item_display_unit !==
                                                    item.item_unit && (
                                                    <div>
                                                      <p>{item.item_unit}</p>
                                                    </div>
                                                  )}
                                                </FormHelperText>
                                              </div>
                                            )}
                                          </td>
                                        ) : (
                                          <td>
                                            <FormControl fullWidth size="small">
                                              <InputLabel id="demo-simple-select-label">
                                                หน่วย
                                              </InputLabel>
                                              <Select
                                                fullWidth
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                size="small"
                                                name={`${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_unit`}
                                                label="หน่วย"
                                                value={item.item_unit}
                                                onChange={(e) => {
                                                  formik.handleChange(e);
                                                }}
                                              >
                                                {getListUnitByID(
                                                  item.item_name
                                                )}
                                              </Select>
                                            </FormControl>
                                          </td>
                                        )}
                                        <td>
                                          <TextField
                                            variant="outlined"
                                            fullWidth
                                            name={`${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_remark`}
                                            type="text"
                                            inputProps={{ min: 0 }}
                                            size="small"
                                            value={item.item_remark}
                                            onChange={(e) => {
                                              formik.handleChange(e);
                                            }}
                                            error={Boolean(
                                              getIn(
                                                touched,
                                                `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_remark`
                                              ) &&
                                                getIn(
                                                  errors,
                                                  `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_remark`
                                                )
                                            )}
                                            helperText={
                                              getIn(
                                                touched,
                                                `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_remark`
                                              ) &&
                                              getIn(
                                                errors,
                                                `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_remark`
                                              ) &&
                                              getIn(
                                                errors,
                                                `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_remark`
                                              )
                                            }
                                          />
                                        </td>
                                        <td>
                                          <IconButton
                                            size="small"
                                            onClick={() => {
                                              const clone = [...data];
                                              const newData = clone[
                                                groupIndex
                                              ].category_list[
                                                categoryindex
                                              ].item_data.filter((_, index) => {
                                                return index !== itemIndex;
                                              });
                                              formik.setFieldValue(
                                                `${name}[${groupIndex}].category_list[${categoryindex}.item_data`,
                                                newData
                                              );
                                            }}
                                          >
                                            <ClearIcon />
                                          </IconButton>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </Fragment>
                              );
                            }
                          )}
                        </Fragment>,
                      ];
                    })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="table-container">
            <table id="tabledata" rules="none">
              <thead>
                {columnListDisableEdit.map((list, index) => {
                  return [
                    <th key={index} style={{ textAlign: "center" }}>
                      <div>{list.nameth}</div>
                      <div>{list.nameEng}</div>
                    </th>,
                  ];
                })}
              </thead>
              <tbody id="table-body">
                {data &&
                  data.map((group, groupIndex) => {
                    return [
                      <Fragment key={groupIndex}>
                        <tr
                          key={groupIndex}
                          style={{
                            backgroundColor: "rgba(195, 220, 167, 1)",
                          }}
                        >
                          <th>
                            <p>กลุ่มที่ {groupIndex + 1}</p>
                          </th>
                          <td>
                            <div>{group.group_name}</div>
                          </td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                        {group.category_list.map((category, categoryindex) => {
                          return (
                            <Fragment key={categoryindex}>
                              <tr
                                style={{
                                  backgroundColor: "rgba(233, 246, 234, 1)",
                                  borderBottom: "8px white solid",
                                }}
                              >
                                <td></td>
                                <th style={{ textAlign: "left" }}>
                                  ประเภท: {category.category_name}
                                </th>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                              </tr>
                              {category.item_data.map((item, itemIndex) => {
                                return (
                                  <tr
                                    key={itemIndex}
                                    style={{
                                      borderBottom: "8px white solid",
                                    }}
                                  >
                                    <td>{itemIndex + 1}</td>
                                    <td sx={{ display: "grid" }}>
                                      <div
                                        className="account__tabledata__itemname-grid-layout"
                                        style={{ textAlign: "left" }}
                                      >
                                        <div>{item.item_name}</div>
                                        <DotStatusComponent
                                          value={itemStatus(item.item_name)}
                                        />
                                        <div>{item.item_description}</div>
                                      </div>
                                    </td>
                                    <td>{item.item_quantity}</td>
                                    <td>{item.item_unit}</td>
                                    <td></td>
                                    <td></td>
                                  </tr>
                                );
                              })}
                              <tr></tr>
                            </Fragment>
                          );
                        })}
                      </Fragment>,
                    ];
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return <div>{renderTableSales(disabled)}</div>;
}
