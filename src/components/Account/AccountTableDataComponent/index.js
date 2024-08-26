import React, { useState, useEffect, Fragment } from "react";
import {
  Autocomplete,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import { getIn } from "formik";

import AccountDiscountComponent from "../AccountDiscountComponent";
import AccountEditAmountComponent from "../AccountEditAmountComponent";
import ButtonComponent from "../../ButtonComponent";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ClearIcon from "@mui/icons-material/Clear";
import DotStatusComponent from "../../DotStatusComponent";
import { queryItemInventory } from "../../../adapter/Api/graphql";
import AccountConfirmationComponent from "../AccountConfirmationComponent";

export default function AccountTableDataComponent({
  data,
  formik,
  disabled,
  salesReturn,
  name,
  errors,
  touched,
}) {
  const [itemList, setItemList] = useState([]);
  const [confirmation, setConfirmation] = useState([false]);
  //header table
  const columnList = [
    { nameth: "รายการ", nameEng: "No." },
    { nameth: "ชื่อสินค้า", nameEng: "Name" },
    { nameth: "จำนวน", nameEng: "Qty" },
    { nameth: "หน่วย", nameEng: "Unit" },
    { nameth: "ราคา/หน่วย", nameEng: "Price/Unit" },
    { nameth: "ส่วนลด", nameEng: "Discount" },
    { nameth: "ภาษี", nameEng: "Vat" },
    { nameth: "ยอดก่อนภาษี", nameEng: "Pre-vat Amount" },
    { nameth: "หัก ณ ที่จ่าย", nameEng: "Withholding tax" },
    { nameth: "", nameEng: "" },
  ];

  const columnListSalesReturn = [
    { nameth: "รายการ", nameEng: "No." },
    { nameth: "ชื่อสินค้า", nameEng: "Name" },
    { nameth: "น้ำหนัก", nameEng: "Weight" },
    { nameth: "จำนวน", nameEng: "Qty" },
    { nameth: "ราคา/หน่วย", nameEng: "Price/Unit" },
    { nameth: "หน่วย", nameEng: "Unit" },
    { nameth: "จำนวนคืน", nameEng: "Returned" },
    { nameth: "", nameEng: "" },
  ];

  const columnListDisableEdit = [
    { nameth: "รายการ", nameEng: "No." },
    { nameth: "ชื่อสินค้า", nameEng: "Name" },
    { nameth: "จำนวน", nameEng: "Qty" },
    { nameth: "หน่วย", nameEng: "Unit" },
    { nameth: "ราคา/หน่วย", nameEng: "Price/Unit" },
    { nameth: "ส่วนลด", nameEng: "Discount" },
    { nameth: "ภาษี", nameEng: "Vat" },
    { nameth: "ยอดก่อนภาษี", nameEng: "Pre-vat Amount" },
    { nameth: "หัก ณ ที่จ่าย", nameEng: "Withholding tax" },
  ];

  //option select vat
  const vatOption = [
    { name: "ไม่มี", value: "NONE" },
    { name: "0%", value: "ZERO" },
    { name: "7%", value: "SEVEN" },
  ];

  //option selest withHoldingTax
  const withHoldingTaxOption = [
    { name: "ยังไม่ระบุ", value: "ยังไม่ระบุ" },
    { name: "ไม่มี", value: "ไม่มี" },
    { name: "0.75%", value: 0.0075 },
    { name: "1%", value: 0.01 },
    { name: "1.5%", value: 0.015 },
    { name: "2%", value: 0.02 },
    { name: "3%", value: 0.03 },
    { name: "5%", value: 0.05 },
    { name: "10%", value: 0.1 },
    { name: "15%", value: 0.15 },
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

  //if SR do function
  const getItemFromData = (data) => {
    const allItem = [];
    data.forEach((group) =>
      group.category_list.forEach((category) => {
        category.item_data.forEach((item) => {
          return allItem.push({
            ...item,
          });
        });
      })
    );
    const newAllItem = allItem.map((item, index) => {
      return { ...item, index: index + 1 };
    });
    return newAllItem;
  };

  const getIndexFromItem = (itemID) => {
    const newArr = getItemFromData(data);
    const findItem = newArr.find((item) => {
      return item.item_id === itemID;
    });
    if (findItem) return findItem.index;
    return null;
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
          description: getDescription(item),
          itemType: item.itemType,
          saleUnitPrice: item.saleUnitPrice,
          inventoryUOMID: item.inventoryUOMID,
          baseUOMID: item.baseUOMID,
          saleUOMID: item.saleUOMID,
          getSaleBaseUOMDimensions: item.getSaleBaseUOMDimensions,
          getUOMGroup: item.getUOMGroup,
        };
      });
      setItemList(usageData);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //render weightuom to display
  function renderWeight(weight) {
    if (weight === "kg") return "กิโลกรัม";
    return "กรัม";
  }

  function setWeigthValue(item, name) {
    if (item.getSaleBaseUOMDimensions && item.getSaleBaseUOMDimensions.weight) {
      formik.setFieldValue(
        `${name}.item_weight`,
        item.getSaleBaseUOMDimensions.weight
      );
      formik.setFieldValue(
        `${name}.item_weight_unit`,
        renderWeight(item.getSaleBaseUOMDimensions.weightUOM)
      );
    } else {
      formik.setFieldValue(`${name}.item_weight`, "");
      formik.setFieldValue(`${name}.item_weight_unit`, "");
    }
  }

  //setValue with mapping item
  const setValueFromItemId = (name, itemName, categoryName) => {
    const itemID = itemName.split("-")[0].replace(/\s+/g, "");
    const findItem = itemList.find((item) => item.id === itemID);
    formik.setFieldValue(`${name}.item_description`, findItem.description);
    formik.setFieldValue(`${name}.item_type`, findItem.itemType);
    formik.setFieldValue(`${name}.item_price`, findItem.saleUnitPrice);
    formik.setFieldValue(`${name}.item_id`, itemID);
    setWeigthValue(findItem, name);
    if (categoryName === "วัสดุ Biowood") {
      formik.setFieldValue(`${name}.item_unit`, findItem.inventoryUOMID);
      formik.setFieldValue(
        `${name}.item_display_unit`,
        findItem.inventoryUOMID
      );
    } else {
      if (findItem.getUOMGroup !== null && findItem.getUOMGroup !== undefined)
        return (
          formik.setFieldValue(
            `${name}.item_unit`,
            findItem.getUOMGroup.listUOM[0].name
          ) &
          formik.setFieldValue(
            `${name}.item_display_unit`,
            findItem.getUOMGroup.listUOM[0].name
          )
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
  const calWithholdingTax = (Item) => {
    if (
      Item.item_withholding_tax.tax !== "ยังไม่ระบุ" &&
      Item.item_withholding_tax.tax !== "ไม่มี"
    )
      if (Item.vat === "SEVEN") {
        const findOption = withHoldingTaxOption.find(
          (option) => option.name === Item.item_withholding_tax.tax
        );
        const sum = (0.93 * Item.pre_vat_amount * findOption.value).toFixed(2);
        Item.item_withholding_tax.withholding_tax_amount = sum;
        return Item.item_withholding_tax.withholding_tax_amount;
      } else {
        const findOption = withHoldingTaxOption.find(
          (option) => option.name === Item.item_withholding_tax.tax
        );
        const sum = (Item.pre_vat_amount * findOption.value).toFixed(2);
        Item.item_withholding_tax.withholding_tax_amount = sum;
        return Item.item_withholding_tax.withholding_tax_amount;
      }
    return;
  };

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

  //sum of groupPrevat
  const groupPreVatAmount = (group) => {
    const newData = group.category_list.reduce((sum, category) => {
      return (
        sum +
        category.item_data.reduce((sumItem, item) => {
          return sumItem + parseFloat(item.pre_vat_amount);
        }, 0)
      );
    }, 0);
    return newData;
  };

  //render string of vat
  const vatRender = (vat) => {
    if (vat === "ZERO") return "0%";
    if (vat === "SEVEN") return "7%";
    return `ไม่มี`;
  };

  //close popup delete
  const closeConfirmationHandler = (Index) => {
    const newConfimation = confirmation.filter((_, index) => {
      return index !== Index;
    });
    setConfirmation(newConfimation);
  };

  //display number to toLocaleString
  function toLocale(number) {
    if (!isNaN(number))
      return parseFloat(number).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
  }

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
                  {columnList.map((list, index) => {
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
                              <div style={{ textAlign: "left" }}>
                                <TextField
                                  variant="outlined"
                                  type="text"
                                  size="small"
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
                                    ) &&
                                    getIn(
                                      errors,
                                      `${name}[${groupIndex}].group_name`
                                    )
                                  }
                                />
                              </div>
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
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
                                description={`ยืนยันการลบ "${group.group_name}" ใช่หรือไม่ ? ถ้าลบแล้วจะไม่สามารถเปลี่ยนแปลงได้`}
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
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                      <IconButton
                                        size="small"
                                        onClick={() => {
                                          const clone = [...category.item_data];
                                          clone.push({
                                            item_id: "",
                                            item_name: "",
                                            item_description: "",
                                            item_unit: null,
                                            item_quantity: null,
                                            item_price: 0,
                                            item_type: null,
                                            item_display_unit: null,
                                            item_display_quantity: null,
                                            discount_list: [
                                              { percent: 0, amount: 0 },
                                            ],
                                            item_weight: "",
                                            item_weight_unit: "",
                                            item_group: groupIndex + 1,
                                            total_discount: 0,
                                            vat: "NONE",
                                            pre_vat_amount: 0,
                                            item_withholding_tax: {
                                              tax: "ยังไม่ระบุ",
                                              withholding_tax_amount: null,
                                            },
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
                                        <td
                                          sx={{
                                            display: "grid",
                                          }}
                                          // style={{ borderRight: "1px solid #bebebe" }}
                                        >
                                          <div className="account__tabledata__itemname-grid-layout">
                                            <Autocomplete
                                              disablePortal
                                              name={`${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_name`}
                                              options={optionItemsCategory(
                                                itemList,
                                                category.category_name
                                              )}
                                              value={item.item_name}
                                              sx={{ width: 350 }}
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
                                                  // error={formik.errors.item_name}
                                                  // helperText={
                                                  //   formik.errors.item_name &&
                                                  //   formik.errors.item_name
                                                  // }
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
                                            {item.item_name !== "" ? (
                                              <div>
                                                <DotStatusComponent
                                                  value={itemStatus(
                                                    item.item_name
                                                  )}
                                                />
                                              </div>
                                            ) : (
                                              <div></div>
                                            )}
                                            <TextField
                                              variant="outlined"
                                              label="คำอธิบายสินค้า"
                                              name={`${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_description`}
                                              type="text"
                                              size="small"
                                              fullWidth
                                              value={item.item_description}
                                              multiline
                                              onChange={(e) => {
                                                formik.handleChange(e);
                                              }}
                                              error={Boolean(
                                                getIn(
                                                  touched,
                                                  `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_description`
                                                ) &&
                                                  getIn(
                                                    errors,
                                                    `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_description`
                                                  )
                                              )}
                                              helperText={
                                                getIn(
                                                  touched,
                                                  `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_description`
                                                ) &&
                                                getIn(
                                                  errors,
                                                  `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_description`
                                                ) &&
                                                getIn(
                                                  errors,
                                                  `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_description`
                                                )
                                              }
                                            />
                                          </div>
                                        </td>
                                        <td>
                                          {categoryindex === 0 ? (
                                            <div>
                                              <AccountEditAmountComponent
                                                showQuantity
                                                itemQuantity={
                                                  item.item_display_quantity
                                                }
                                                itemUnit={item.item_unit}
                                                formik={formik}
                                                name={`${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}]`}
                                              />
                                              <FormHelperText>
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
                                        {categoryindex === 0 ? (
                                          <td>
                                            {item.item_unit === "ตัว" ? (
                                              ""
                                            ) : (
                                              <div>
                                                {item.item_display_unit}
                                                <FormHelperText>
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
                                            name={`${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_price`}
                                            type="number"
                                            size="small"
                                            inputProps={{ min: 0 }}
                                            value={parseFloat(item.item_price)}
                                            sx={{ width: "fit-content" }}
                                            onChange={(e) => {
                                              formik.handleChange(e);
                                            }}
                                            error={Boolean(
                                              getIn(
                                                touched,
                                                `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_price`
                                              ) &&
                                                getIn(
                                                  errors,
                                                  `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_price`
                                                )
                                            )}
                                            helperText={
                                              getIn(
                                                touched,
                                                `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_price`
                                              ) &&
                                              getIn(
                                                errors,
                                                `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_price`
                                              ) &&
                                              getIn(
                                                errors,
                                                `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_price`
                                              )
                                            }
                                          />
                                        </td>
                                        <td>
                                          <AccountDiscountComponent
                                            formik={formik}
                                            itemIndex={itemIndex}
                                            totalPrice={
                                              item.item_quantity *
                                              item.item_price
                                            }
                                            discountList={item.discount_list}
                                            name={`${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}]`}
                                          />
                                        </td>
                                        <td>
                                          <FormControl fullWidth size="small">
                                            <InputLabel id="demo-simple-select-label"></InputLabel>
                                            <Select
                                              fullWidth
                                              labelId="demo-simple-select-label"
                                              id="demo-simple-select"
                                              size="small"
                                              name={`${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].vat`}
                                              value={item.vat}
                                              onChange={(e) => {
                                                formik.handleChange(e);
                                              }}
                                            >
                                              {vatOption.map((val, index) => (
                                                <MenuItem
                                                  key={`${val.name} + ${index}`}
                                                  value={val.value}
                                                >
                                                  {val.name}
                                                </MenuItem>
                                              ))}
                                            </Select>
                                          </FormControl>
                                        </td>
                                        <td>
                                          {(item.pre_vat_amount =
                                            item.item_quantity *
                                              item.item_price -
                                            item.total_discount).toFixed(2) &&
                                            null}
                                          {toLocale(item.pre_vat_amount)}
                                        </td>
                                        <td>
                                          <FormControl fullWidth size="small">
                                            <InputLabel id="demo-simple-select-label"></InputLabel>
                                            <Select
                                              fullWidth
                                              labelId="demo-simple-select-label"
                                              id="demo-simple-select"
                                              size="small"
                                              name={`${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_withholding_tax.tax`}
                                              value={
                                                item.item_withholding_tax.tax
                                              }
                                              onChange={(e) => {
                                                formik.handleChange(e);
                                              }}
                                            >
                                              {withHoldingTaxOption.map(
                                                (val, index) => (
                                                  <MenuItem
                                                    key={`${val.name} + ${index}`}
                                                    value={val.name}
                                                  >
                                                    {val.name}
                                                  </MenuItem>
                                                )
                                              )}
                                            </Select>
                                            <FormHelperText>
                                              {toLocale(
                                                calWithholdingTax(item)
                                              )}
                                            </FormHelperText>
                                          </FormControl>
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
                          <tr
                            style={{
                              backgroundColor: "rgba(233, 233, 233, 1)",
                            }}
                          >
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <th style={{ textAlign: "right" }}>ยอดก่อนภาษี </th>
                            <th style={{ textAlign: "left" }}>
                              Pre-vat Amount
                            </th>
                            <th>{toLocale(groupPreVatAmount(group))} </th>
                            <th>บาท</th>
                          </tr>
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
                                    <td>{toLocale(item.item_price)}</td>
                                    <td>
                                      {toLocale(item.total_discount)}
                                      {`(${item.discount_list
                                        .map((discount) => {
                                          return discount.percent;
                                        })
                                        .join("/")}%)`}
                                    </td>
                                    <td>{vatRender(item.vat)}</td>
                                    <td>{toLocale(item.pre_vat_amount)}</td>
                                    <td>
                                      {item.item_withholding_tax.tax}
                                      {item.item_withholding_tax.tax !==
                                        "ยังไม่ระบุ" &&
                                        item.item_withholding_tax.tax !==
                                          "ไม่มี" &&
                                        `(${toLocale(
                                          calWithholdingTax(item)
                                        )})`}
                                    </td>
                                  </tr>
                                );
                              })}
                              <tr></tr>
                            </Fragment>
                          );
                        })}
                        <tr
                          style={{
                            backgroundColor: "rgba(233, 233, 233, 1)",
                          }}
                        >
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <th style={{ textAlign: "right" }}>ยอดก่อนภาษี </th>
                          <th style={{ textAlign: "left" }}>Pre-vat Amount</th>
                          <th>{toLocale(groupPreVatAmount(group))} </th>
                          <th>บาท</th>
                        </tr>
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

  const renderTableSalesReturn = () => {
    return (
      <div style={{ marginBottom: "38px", borderBottom: "1px solid #BEBEBE" }}>
        <div>
          <div className="table-container">
            <table id="tabledata" rules="none">
              <thead>
                {columnListSalesReturn.map((list, index) => {
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
                        {group.category_list.map((category, categoryindex) => {
                          return (
                            <Fragment key={categoryindex}>
                              {category.item_data.map((item, itemIndex) => {
                                return (
                                  <tr
                                    key={itemIndex}
                                    style={{
                                      borderBottom: "1px solid #BEBEBE",
                                    }}
                                  >
                                    <th>
                                      <p>{getIndexFromItem(item.item_id)}</p>
                                    </th>
                                    <td sx={{ display: "grid" }}>
                                      <div
                                        className="account__tabledata__itemname-grid-layout"
                                        style={{ textAlign: "left" }}
                                      >
                                        <div>{item.item_name}</div>
                                        <div></div>
                                        <div>{item.item_description}</div>
                                      </div>
                                    </td>
                                    <td>{item.item_weight}</td>
                                    <td>{item.item_quantity}</td>
                                    <td>{item.item_price}</td>
                                    <td>{item.item_unit}</td>
                                    {!disabled ? (
                                      <td>
                                        <TextField
                                          variant="outlined"
                                          type="number"
                                          size="small"
                                          inputProps={{ min: 0 }}
                                          id={`${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_returned`}
                                          name={`${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_returned`}
                                          value={item.item_returned}
                                          onChange={(e) => {
                                            formik.handleChange(e);
                                          }}
                                          error={
                                            Boolean(
                                              getIn(
                                                touched,
                                                `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_returned`
                                              ) &&
                                                getIn(
                                                  errors,
                                                  `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_returned`
                                                )
                                            ) ||
                                            item.item_returned >
                                              item.item_quantity
                                          }
                                          helperText={
                                            (getIn(
                                              touched,
                                              `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_returned`
                                            ) &&
                                              getIn(
                                                errors,
                                                `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_returned`
                                              ) &&
                                              getIn(
                                                touched,
                                                `${name}[${groupIndex}].category_list[${categoryindex}].item_data[${itemIndex}].item_returned`
                                              )) ||
                                            (item.item_returned >
                                              item.item_quantity &&
                                              `กรุณากรอกจำนวนน้อยกว่า ${item.item_quantity}`)
                                          }
                                        />
                                      </td>
                                    ) : (
                                      <td>{item.item_returned}</td>
                                    )}
                                    {!disabled ? (
                                      <td>
                                        <IconButton
                                          size="small"
                                          onClick={() => {
                                            const cloneConfirm = [
                                              ...confirmation,
                                            ];
                                            cloneConfirm[itemIndex] = true;
                                            setConfirmation(cloneConfirm);
                                          }}
                                        >
                                          <ClearIcon />
                                        </IconButton>
                                        <AccountConfirmationComponent
                                          open={confirmation[itemIndex]}
                                          handleSubmit={() =>
                                            deleteGroup(itemIndex)
                                          }
                                          handleClose={() =>
                                            closeConfirmationHandler(itemIndex)
                                          }
                                          title="ยืนยันการลบสินค้า?"
                                          description={`ยืนยันการลบ "${item.item_name}" ใช่หรือไม่ ? ถ้าลบแล้วจะไม่สามารถเปลี่ยนแปลงได้`}
                                        />
                                      </td>
                                    ) : (
                                      <td></td>
                                    )}
                                  </tr>
                                );
                              })}
                            </Fragment>
                          );
                        })}
                      </Fragment>,
                    ];
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {!salesReturn
        ? renderTableSales(disabled)
        : renderTableSalesReturn(disabled)}
    </div>
  );
}
