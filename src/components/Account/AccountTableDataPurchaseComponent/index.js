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

import ClearIcon from "@mui/icons-material/Clear";
import DotStatusComponent from "../../DotStatusComponent";
import { queryItemInventory } from "../../../adapter/Api/graphql";
import AccountConfirmationComponent from "../AccountConfirmationComponent";
// import AccountEditAmountComponent from "../AccountEditAmountComponent";

export default function AccountTableDataPurchaseComponent({
  data,
  formik,
  disabled,
  name,
  PRTable,
  PurchaseReturn,
  ExpenseNote,
  DOTable,
  errors,
  touched,
}) {
  const [itemList, setItemList] = useState([]);
  const [confirmation, setConfirmation] = useState([false]);
  //header table
  const columnList = [
    { nameth: "รายการ", nameEng: "No." },
    { nameth: "ชื่อสินค้า", nameEng: "Name" },
    { nameth: "บัญชี", nameEng: "Account" },
    { nameth: "จำนวน", nameEng: "Qty" },
    { nameth: "หน่วย", nameEng: "Unit" },
    { nameth: "ราคา/หน่วย", nameEng: "Price/Unit" },
    { nameth: "ส่วนลด", nameEng: "Discount" },
    { nameth: "ภาษี", nameEng: "Vat" },
    { nameth: "ยอดก่อนภาษี", nameEng: "Pre-vat Amount" },
    { nameth: "หัก ณ ที่จ่าย", nameEng: "Withholding tax" },
    { nameth: "", nameEng: "" },
  ];

  const columnListDisableEdit = [
    { nameth: "รายการ", nameEng: "No." },
    { nameth: "ชื่อสินค้า", nameEng: "Name" },
    { nameth: "บัญชี", nameEng: "Account" },
    { nameth: "จำนวน", nameEng: "Qty" },
    { nameth: "หน่วย", nameEng: "Unit" },
    { nameth: "ราคา/หน่วย", nameEng: "Price/Unit" },
    { nameth: "ส่วนลด", nameEng: "Discount" },
    { nameth: "ภาษี", nameEng: "Vat" },
    { nameth: "ยอดก่อนภาษี", nameEng: "Pre-vat Amount" },
    { nameth: "หัก ณ ที่จ่าย", nameEng: "Withholding tax" },
  ];

  const columnListSecoundType = [
    { nameth: "รายการ", nameEng: "No." },
    { nameth: "ชื่อสินค้า", nameEng: "Name" },
    { nameth: "จำนวนสั่งขาย", nameEng: "QA Qty" },
    { nameth: "จำนวนขอซื้อ", nameEng: "Qty" },
    { nameth: "หน่วย", nameEng: "Unit" },
    { nameth: "หมายเหตุ", nameEng: "Remarks" },
    { nameth: "", nameEng: "" },
  ];

  const columnListSecoundTypeDisableEdit = [
    { nameth: "รายการ", nameEng: "No." },
    { nameth: "ชื่อสินค้า", nameEng: "Name" },
    { nameth: "จำนวนสั่งขาย", nameEng: "QA Qty" },
    { nameth: "จำนวนขอซื้อ", nameEng: "Qty" },
    { nameth: "หน่วย", nameEng: "Unit" },
    { nameth: "หมายเหตุ", nameEng: "Remarks" },
  ];

  const columnListPurchaseReturn = [
    { nameth: "รายการ", nameEng: "No." },
    { nameth: "ชื่อสินค้า", nameEng: "Name" },
    { nameth: "น้ำหนัก", nameEng: "Weight" },
    { nameth: "จำนวน", nameEng: "Qty" },
    { nameth: "ราคา/หน่วย", nameEng: "Price/Unit" },
    { nameth: "หน่วย", nameEng: "Unit" },
    { nameth: "จำนวนคืน", nameEng: "Returned" },
    { nameth: "", nameEng: "" },
  ];

  const columnListDOType = [
    { nameth: "รายการ", nameEng: "No." },
    { nameth: "ชื่อสินค้า", nameEng: "Name" },
    { nameth: "น้ำหนัก", nameEng: "Weight" },
    { nameth: "จำนวน", nameEng: "Qty" },
    { nameth: "หน่วย", nameEng: "Unit" },
    { nameth: "", nameEng: "" },
  ];

  const columnListExpenseNote = [
    { nameth: "รายการ", nameEng: "No." },
    { nameth: "บัญชีค่าใช้จ่าย", nameEng: "Expense Account" },
    { nameth: "คำอธิบาย", nameEng: "Description" },
    { nameth: "จำนวน", nameEng: "Qty" },
    { nameth: "ราคา/หน่วย", nameEng: "Price/Unit" },
    { nameth: "ส่วนลด", nameEng: "Discount" },
    { nameth: "ภาษี", nameEng: "Vat" },
    { nameth: "มูลค่าก่อนภาษี", nameEng: "Pre-vat Amount" },
    { nameth: "หัก ณ ที่จ่าย", nameEng: "Withholding tax" },
    { nameth: "", nameEng: "" },
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

  //option account mockup
  const accountOption = [
    { name: "Account 1", value: "000001" },
    { name: "Account 2", value: "000002" },
    { name: "Account 3", value: "000003" },
    { name: "Account 4", value: "000004" },
  ];

  //function delete group
  const deleteItem = (itemIndex) => {
    const clone = [...data];
    const newData = clone.filter((_, index) => {
      return index !== itemIndex;
    });
    const newConfimation = confirmation.filter((_, index) => {
      return index !== itemIndex;
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
      const myDataIsStock = myData.filter((data) => data.isPurchase !== false);
      const usageData = myDataIsStock.map((item) => {
        return {
          ...item,
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
  const setValueFromItemId = (name, itemName) => {
    const itemID = itemName.split("-")[0].replace(/\s+/g, "");
    const findItem = itemList.find((item) => item.id === itemID);
    formik.setFieldValue(`${name}.item_id`, itemID);
    formik.setFieldValue(`${name}.item_price`, findItem.saleUnitPrice);
    formik.setFieldValue(`${name}.item_description`, findItem.description);
    setWeigthValue(findItem, name);
    if (findItem.getUOMGroup !== null && findItem.getUOMGroup !== undefined)
      return formik.setFieldValue(
        `${name}.item_unit`,
        findItem.getUOMGroup.listUOM[0].name
      );
    return null;
  };

  //getWeight by itemID
  const getWeight = (itemID) => {
    const findItem = itemList.find((item) => item.id === itemID);
    if (findItem && findItem.getSaleBaseUOMDimensions)
      if (findItem.getSaleBaseUOMDimensions.weight)
        return `${findItem.getSaleBaseUOMDimensions.weight} ${renderWeight(
          findItem.getSaleBaseUOMDimensions.weightUOM
        )}`;
    return "-";
  };

  const purchaseMinOrderQty = (itemID) => {
    const findItem = itemList.find((item) => item.id === itemID);
    if (findItem && findItem.purchaseMinOrderQty)
      return findItem.purchaseMinOrderQty;
    else return null;
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
      { name: "เมตร", value: "เมตร" },
      { name: "ตร.ม", value: "ตร.ม" },
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
  const groupPreVatAmount = () => {
    const newData = data.reduce((sum, item) => {
      return sum + parseFloat(item.pre_vat_amount);
    }, 0);
    return newData.toFixed(2);
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

  function tableDataPurchase() {
    return (
      <div style={{ marginBottom: "38px" }}>
        {!disabled ? (
          <div className="table-container">
            <table id="tabledata" rules="none">
              <thead>
                {columnList.map((list) => {
                  return [
                    <th style={{ textAlign: "center" }}>
                      <div>{list.nameth}</div>
                      <div>{list.nameEng}</div>
                    </th>,
                  ];
                })}
              </thead>
              <tbody id="table-body">
                {data &&
                  data.map((item, itemIndex) => {
                    return [
                      <>
                        <tr
                          key={itemIndex}
                          style={{
                            borderBottom: "1px rgba(190, 190, 190, 1) solid",
                          }}
                        >
                          <td>{itemIndex + 1}</td>
                          <td>
                            <div className="account__tabledata__itemname-grid-layout">
                              <Autocomplete
                                disablePortal
                                name={`${name}[${itemIndex}].item_name`}
                                options={itemList.map(
                                  (item) => `${item.id} - ${item.name}`
                                )}
                                value={item.item_name}
                                sx={{ width: 250 }}
                                disableClearable
                                type="text"
                                size="small"
                                onChange={(_, v) => {
                                  formik.setFieldValue(
                                    `${name}[${itemIndex}].item_name`,
                                    v
                                  );
                                  setValueFromItemId(
                                    `${name}[${itemIndex}]`,
                                    v
                                  );
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    fullWidth
                                    {...params}
                                    label="ชื่อสินค้า"
                                  />
                                )}
                                error={Boolean(
                                  getIn(
                                    touched,
                                    `${name}[${itemIndex}].item_name`
                                  ) &&
                                    getIn(
                                      errors,
                                      `${name}[${itemIndex}].item_name`
                                    )
                                )}
                                helperText={
                                  getIn(
                                    touched,
                                    `${name}[${itemIndex}].item_name`
                                  ) &&
                                  getIn(
                                    errors,
                                    `${name}[${itemIndex}].item_name`
                                  ) &&
                                  getIn(
                                    touched,
                                    `${name}[${itemIndex}].item_name`
                                  )
                                }
                              />
                              {item.item_name !== "" ? (
                                <div>
                                  <DotStatusComponent
                                    value={itemStatus(
                                      item.item_name,
                                      `${name}[${itemIndex}]`
                                    )}
                                  />
                                </div>
                              ) : (
                                <div></div>
                              )}
                              <TextField
                                variant="outlined"
                                label="คำอธิบายสินค้า"
                                name={`${name}[${itemIndex}].item_description`}
                                type="text"
                                size="small"
                                fullWidth
                                value={item.item_description}
                                multiline
                                onChange={(e) => {
                                  formik.handleChange(e);
                                }}
                              />
                            </div>
                          </td>
                          <td>
                            <FormControl fullWidth size="small">
                              <InputLabel id="demo-simple-select-label">
                                บัญชี
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                size="small"
                                name={`${name}[${itemIndex}].item_account`}
                                label="บัญชี"
                                value={item.item_account}
                                onChange={(e) => {
                                  formik.handleChange(e);
                                }}
                              >
                                {accountOption.map((option) => {
                                  return (
                                    <MenuItem
                                      key={`${option.name} + ${item.item_account}`}
                                      value={option.value}
                                    >
                                      {option.name}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                          </td>
                          <td>
                            <TextField
                              variant="outlined"
                              name={`${name}[${itemIndex}].item_quantity`}
                              type="number"
                              inputProps={{ min: 0 }}
                              sx={{ minWidth: "85px" }}
                              size="small"
                              value={item.item_quantity}
                              onChange={(e) => {
                                formik.handleChange(e);
                              }}
                              error={Boolean(
                                getIn(
                                  touched,
                                  `${name}[${itemIndex}].item_quantity`
                                ) &&
                                  getIn(
                                    errors,
                                    `${name}[${itemIndex}].item_quantity`
                                  )
                              )}
                              helperText={
                                getIn(
                                  touched,
                                  `${name}[${itemIndex}].item_quantity`
                                ) &&
                                getIn(
                                  errors,
                                  `${name}[${itemIndex}].item_quantity`
                                ) &&
                                getIn(
                                  touched,
                                  `${name}[${itemIndex}].item_quantity`
                                )
                              }
                            />
                          </td>
                          <td>
                            <FormControl
                              fullWidth
                              size="small"
                              error={Boolean(
                                getIn(
                                  touched,
                                  `${name}[${itemIndex}].item_unit`
                                ) &&
                                  getIn(
                                    errors,
                                    `${name}[${itemIndex}].item_unit`
                                  )
                              )}
                            >
                              <InputLabel id="demo-simple-select-label">
                                หน่วย
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                size="small"
                                name={`${name}[${itemIndex}].item_unit`}
                                label="หน่วย"
                                value={item.item_unit}
                                onChange={(e) => {
                                  formik.handleChange(e);
                                }}
                              >
                                {getListUnitByID(item.item_name)}
                              </Select>
                              <FormHelperText>
                                {getIn(
                                  touched,
                                  `${name}[${itemIndex}].item_unit`
                                ) &&
                                  getIn(
                                    errors,
                                    `${name}[${itemIndex}].item_unit`
                                  ) &&
                                  getIn(
                                    touched,
                                    `${name}[${itemIndex}].item_unit`
                                  )}
                              </FormHelperText>
                            </FormControl>
                          </td>
                          <td>
                            <TextField
                              variant="outlined"
                              name={`${name}[${itemIndex}].item_price`}
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
                                  `${name}[${itemIndex}].item_price`
                                ) &&
                                  getIn(
                                    errors,
                                    `${name}[${itemIndex}].item_price`
                                  )
                              )}
                              helperText={
                                getIn(
                                  touched,
                                  `${name}[${itemIndex}].item_price`
                                ) &&
                                getIn(
                                  errors,
                                  `${name}[${itemIndex}].item_price`
                                ) &&
                                getIn(
                                  touched,
                                  `${name}[${itemIndex}].item_price`
                                )
                              }
                            />
                          </td>
                          <td>
                            <TextField
                              variant="outlined"
                              name={`${name}[${itemIndex}].total_discount`}
                              type="number"
                              size="small"
                              inputProps={{ min: 0 }}
                              value={parseFloat(item.total_discount)}
                              onChange={(e) => {
                                formik.handleChange(e);
                              }}
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
                                name={`${name}[${itemIndex}].vat`}
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
                              item.item_quantity * item.item_price -
                              item.total_discount).toFixed(2) && null}
                            <TextField
                              disabled
                              variant="outlined"
                              name={`${name}[${itemIndex}].pre_vat_amount`}
                              type="number"
                              size="small"
                              inputProps={{ min: 0 }}
                              value={parseFloat(item.pre_vat_amount)}
                              sx={{ width: "fit-content" }}
                              onChange={(e) => {
                                formik.handleChange(e);
                              }}
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
                                name={`${name}[${itemIndex}].item_withholding_tax.tax`}
                                value={item.item_withholding_tax.tax}
                                onChange={(e) => {
                                  formik.handleChange(e);
                                }}
                              >
                                {withHoldingTaxOption.map((val, index) => (
                                  <MenuItem
                                    key={`${val.name} + ${index}`}
                                    value={val.name}
                                  >
                                    {val.name}
                                  </MenuItem>
                                ))}
                              </Select>
                              <FormHelperText>
                                {toLocale(calWithholdingTax(item))}
                              </FormHelperText>
                            </FormControl>
                          </td>
                          <td>
                            <IconButton
                              size="small"
                              onClick={() => {
                                const cloneConfirm = [...confirmation];
                                cloneConfirm[itemIndex] = true;
                                setConfirmation(cloneConfirm);
                              }}
                            >
                              <ClearIcon />
                            </IconButton>
                            <AccountConfirmationComponent
                              open={confirmation[itemIndex]}
                              handleSubmit={() => deleteItem(itemIndex)}
                              handleClose={() =>
                                closeConfirmationHandler(itemIndex)
                              }
                              title="ยืนยันการลบกลุ่ม?"
                              description={`ยืนยันการลบ "${item.item_name}" ใช่หรือไม่ ? ถ้าลบแล้วจะไม่สามารถเปลี่ยนแปลงได้`}
                            />
                          </td>
                        </tr>
                      </>,
                    ];
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
                  <td></td>
                  <td></td>
                  <th style={{ textAlign: "right" }}>ยอดก่อนภาษี </th>
                  <th style={{ textAlign: "left" }}>Pre-vat Amount</th>
                  <th>{toLocale(groupPreVatAmount())} </th>
                  <th>บาท</th>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="table-container">
            <table id="tabledata" rules="none">
              <thead>
                {columnListDisableEdit.map((list) => {
                  return [
                    <th style={{ textAlign: "center" }}>
                      <div>{list.nameth}</div>
                      <div>{list.nameEng}</div>
                    </th>,
                  ];
                })}
              </thead>
              <tbody id="table-body">
                {data &&
                  data.map((item, itemIndex) => {
                    return [
                      <tr
                        style={{
                          borderBottom: "1px rgba(190, 190, 190, 1) solid",
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
                        <td>
                          <FormControl fullWidth size="small">
                            <InputLabel id="demo-simple-select-label">
                              บัญชี
                            </InputLabel>
                            <Select
                              disabled
                              fullWidth
                              labelId="demo-simple-select-label"
                              id="demo-simple-select"
                              size="small"
                              name={`${name}[${itemIndex}].item_account`}
                              label="บัญชี"
                              value={item.item_account}
                              onChange={(e) => {
                                formik.handleChange(e);
                              }}
                            >
                              {accountOption.map((option) => {
                                return (
                                  <MenuItem
                                    key={`${option.name} + ${item.item_account}`}
                                    value={option.value}
                                  >
                                    {option.name}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </td>
                        <td style={{ padding: "15px 20px" }}>
                          {item.item_quantity}
                        </td>
                        <td>{item.item_unit}</td>
                        <td>{toLocale(item.item_price)}</td>
                        <td>{toLocale(item.total_discount)}</td>
                        <td>{vatRender(item.vat)}</td>
                        <td>{toLocale(item.pre_vat_amount)}</td>
                        <td>
                          {item.item_withholding_tax.tax}
                          {item.item_withholding_tax.tax !== "ยังไม่ระบุ" &&
                            item.item_withholding_tax.tax !== "ไม่มี" &&
                            `(${toLocale(calWithholdingTax(item))})`}
                        </td>
                      </tr>,
                    ];
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
                  <td></td>
                  <th style={{ textAlign: "right" }}>ยอดก่อนภาษี </th>
                  <th style={{ textAlign: "left" }}>Pre-vat Amount</th>
                  <th>{toLocale(groupPreVatAmount())} </th>
                  <th>บาท</th>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  function tableDataPurchasePR() {
    return (
      <div style={{ marginBottom: "38px" }}>
        {!disabled ? (
          <div>
            <table id="tabledata" rules="none">
              <thead>
                {columnListSecoundType.map((list) => {
                  return [
                    <th style={{ textAlign: "center" }}>
                      <div>{list.nameth}</div>
                      <div>{list.nameEng}</div>
                    </th>,
                  ];
                })}
              </thead>
              <tbody id="table-body">
                {data &&
                  data.map((item, itemIndex) => {
                    return [
                      <>
                        <tr
                          key={itemIndex}
                          style={{
                            borderBottom: "1px rgba(190, 190, 190, 1) solid",
                          }}
                        >
                          <td>{itemIndex + 1}</td>
                          <td>
                            <div className="account__tabledata__itemname-grid-layout">
                              <Autocomplete
                                disablePortal
                                name={`${name}[${itemIndex}].item_name`}
                                options={itemList.map(
                                  (item) => `${item.id} - ${item.name}`
                                )}
                                value={item.item_name}
                                sx={{ width: 250 }}
                                disableClearable
                                type="text"
                                size="small"
                                onChange={(_, v) => {
                                  formik.setFieldValue(
                                    `${name}[${itemIndex}].item_name`,
                                    v
                                  );
                                  setValueFromItemId(
                                    `${name}[${itemIndex}]`,
                                    v
                                  );
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    fullWidth
                                    {...params}
                                    label="ชื่อสินค้า"
                                  />
                                )}
                                error={Boolean(
                                  getIn(
                                    touched,
                                    `${name}[${itemIndex}].item_name`
                                  ) &&
                                    getIn(
                                      errors,
                                      `${name}[${itemIndex}].item_name`
                                    )
                                )}
                                helperText={
                                  getIn(
                                    touched,
                                    `${name}[${itemIndex}].item_name`
                                  ) &&
                                  getIn(
                                    errors,
                                    `${name}[${itemIndex}].item_name`
                                  ) &&
                                  getIn(
                                    touched,
                                    `${name}[${itemIndex}].item_name`
                                  )
                                }
                              />
                              {item.item_name !== "" ? (
                                <div>
                                  <DotStatusComponent
                                    value={itemStatus(
                                      item.item_name,
                                      `${name}[${itemIndex}]`
                                    )}
                                  />
                                </div>
                              ) : (
                                <div></div>
                              )}
                              <TextField
                                variant="outlined"
                                label="คำอธิบายสินค้า"
                                name={`${name}[${itemIndex}].item_description`}
                                type="text"
                                size="small"
                                fullWidth
                                value={item.item_description}
                                multiline
                                onChange={(e) => {
                                  formik.handleChange(e);
                                }}
                              />
                            </div>
                          </td>
                          <td style={{ padding: "25px 0" }}>
                            {toLocale(item.qa_quantity)}
                          </td>
                          <td>
                            <TextField
                              variant="outlined"
                              name={`${name}[${itemIndex}].item_quantity`}
                              type="number"
                              inputProps={{ min: 0 }}
                              sx={{ minWidth: "150px" }}
                              size="small"
                              value={item.item_quantity}
                              onChange={(e) => {
                                formik.handleChange(e);
                              }}
                              error={
                                Boolean(
                                  getIn(
                                    touched,
                                    `${name}[${itemIndex}].item_name`
                                  ) &&
                                    getIn(
                                      errors,
                                      `${name}[${itemIndex}].item_name`
                                    )
                                ) ||
                                item.item_quantity <
                                  purchaseMinOrderQty(item.item_id)
                              }
                              helperText={
                                (getIn(
                                  touched,
                                  `${name}[${itemIndex}].item_name`
                                ) &&
                                  getIn(
                                    errors,
                                    `${name}[${itemIndex}].item_name`
                                  ) &&
                                  getIn(
                                    touched,
                                    `${name}[${itemIndex}].item_name`
                                  )) ||
                                (item.item_quantity <
                                  purchaseMinOrderQty(item.item_id) &&
                                  `สั่งซื้อขั้นต่ำ ${purchaseMinOrderQty(
                                    item.item_id
                                  )} ชิ้น`)
                              }
                            />
                          </td>
                          <td>
                            <FormControl
                              fullWidth
                              size="small"
                              error={Boolean(
                                getIn(
                                  touched,
                                  `${name}[${itemIndex}].item_unit`
                                ) &&
                                  getIn(
                                    errors,
                                    `${name}[${itemIndex}].item_unit`
                                  )
                              )}
                            >
                              <InputLabel id="demo-simple-select-label">
                                หน่วย
                              </InputLabel>
                              <Select
                                fullWidth
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                size="small"
                                sx={{ minWidth: "50px" }}
                                name={`${name}[${itemIndex}].item_unit`}
                                label="หน่วย"
                                value={item.item_unit}
                                onChange={(e) => {
                                  formik.handleChange(e);
                                }}
                              >
                                {getListUnitByID(item.item_name)}
                              </Select>
                              <FormHelperText>
                                {getIn(
                                  touched,
                                  `${name}[${itemIndex}].item_unit`
                                ) &&
                                  getIn(
                                    errors,
                                    `${name}[${itemIndex}].item_unit`
                                  ) &&
                                  getIn(
                                    errors,
                                    `${name}[${itemIndex}].item_unit`
                                  )}
                              </FormHelperText>
                            </FormControl>
                          </td>
                          <td>
                            <TextField
                              variant="outlined"
                              name={`${name}[${itemIndex}].remark`}
                              type="text"
                              size="small"
                              value={item.remark}
                              onChange={(e) => {
                                formik.handleChange(e);
                              }}
                            />
                          </td>
                          <td>
                            <IconButton
                              size="small"
                              onClick={() => {
                                const cloneConfirm = [...confirmation];
                                cloneConfirm[itemIndex] = true;
                                setConfirmation(cloneConfirm);
                              }}
                            >
                              <ClearIcon />
                            </IconButton>
                            <AccountConfirmationComponent
                              open={confirmation[itemIndex]}
                              handleSubmit={() => deleteItem(itemIndex)}
                              handleClose={() =>
                                closeConfirmationHandler(itemIndex)
                              }
                              title="ยืนยันการลบกลุ่ม?"
                              description={`ยืนยันการลบ "${item.item_name}" ใช่หรือไม่ ? ถ้าลบแล้วจะไม่สามารถเปลี่ยนแปลงได้`}
                            />
                          </td>
                        </tr>
                      </>,
                    ];
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="table-container">
            <table id="tabledata" rules="none">
              <thead>
                {columnListSecoundTypeDisableEdit.map((list) => {
                  return [
                    <th style={{ textAlign: "center" }}>
                      <div>{list.nameth}</div>
                      <div>{list.nameEng}</div>
                    </th>,
                  ];
                })}
              </thead>
              <tbody id="table-body">
                {data &&
                  data.map((item, itemIndex) => {
                    return [
                      <tr
                        style={{
                          borderBottom: "1px rgba(190, 190, 190, 1) solid",
                        }}
                      >
                        <td>{itemIndex + 1}</td>
                        <td>
                          <div
                            className="account__tabledata__itemname-grid-layout"
                            style={{ textAlign: "left" }}
                          >
                            <div>{item.item_name}</div>
                            <div></div>
                            <div>{item.item_description}</div>
                          </div>
                        </td>
                        <td style={{ padding: "20px 0" }}>
                          {toLocale(item.qa_quantity)}
                        </td>
                        <td>{toLocale(item.item_quantity)}</td>
                        <td>{item.item_unit}</td>
                        <td>{item.remark}</td>
                      </tr>,
                    ];
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  function tableDataDO() {
    return (
      <div style={{ marginBottom: "38px" }}>
        {!disabled ? (
          <div>
            <table id="tabledata" rules="none">
              <thead>
                {columnListDOType.map((list) => {
                  return [
                    <th style={{ textAlign: "center" }}>
                      <div>{list.nameth}</div>
                      <div>{list.nameEng}</div>
                    </th>,
                  ];
                })}
              </thead>
              <tbody id="table-body">
                {data &&
                  data.map((item, itemIndex) => {
                    return [
                      <>
                        <tr
                          key={itemIndex}
                          style={{
                            borderBottom: "1px rgba(190, 190, 190, 1) solid",
                          }}
                        >
                          <td>{itemIndex + 1}</td>
                          <td>
                            <div className="account__tabledata__itemname-grid-layout">
                              <Autocomplete
                                disablePortal
                                name={`${name}[${itemIndex}].item_name`}
                                options={itemList.map(
                                  (item) => `${item.id} - ${item.name}`
                                )}
                                value={item.item_name}
                                sx={{ width: 250 }}
                                disableClearable
                                type="text"
                                size="small"
                                onChange={(_, v) => {
                                  formik.setFieldValue(
                                    `${name}[${itemIndex}].item_name`,
                                    v
                                  );
                                  setValueFromItemId(
                                    `${name}[${itemIndex}]`,
                                    v
                                  );
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    fullWidth
                                    {...params}
                                    label="ชื่อสินค้า"
                                  />
                                )}
                              />
                              {item.item_name !== "" ? (
                                <div>
                                  <DotStatusComponent
                                    value={itemStatus(
                                      item.item_name,
                                      `${name}[${itemIndex}]`
                                    )}
                                  />
                                </div>
                              ) : (
                                <div></div>
                              )}
                              <TextField
                                variant="outlined"
                                label="คำอธิบายสินค้า"
                                name={`${name}[${itemIndex}].item_description`}
                                type="text"
                                size="small"
                                fullWidth
                                value={item.item_description}
                                multiline
                                onChange={(e) => {
                                  formik.handleChange(e);
                                }}
                              />
                            </div>
                          </td>
                          <td style={{ padding: "25px 0" }}>
                            {getWeight(item.item_id)}
                          </td>
                          <td>
                            <TextField
                              variant="outlined"
                              name={`${name}[${itemIndex}].item_quantity`}
                              type="number"
                              inputProps={{ min: 0 }}
                              size="small"
                              value={item.item_quantity}
                              onChange={(e) => {
                                formik.handleChange(e);
                              }}
                            />
                          </td>
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
                                name={`${name}[${itemIndex}].item_unit`}
                                label="หน่วย"
                                value={item.item_unit}
                                onChange={(e) => {
                                  formik.handleChange(e);
                                }}
                              >
                                {getListUnitByID(item.item_name)}
                              </Select>
                            </FormControl>
                          </td>
                          <td>
                            <IconButton
                              size="small"
                              onClick={() => {
                                const cloneConfirm = [...confirmation];
                                cloneConfirm[itemIndex] = true;
                                setConfirmation(cloneConfirm);
                              }}
                            >
                              <ClearIcon />
                            </IconButton>
                            <AccountConfirmationComponent
                              open={confirmation[itemIndex]}
                              handleSubmit={() => deleteItem(itemIndex)}
                              handleClose={() =>
                                closeConfirmationHandler(itemIndex)
                              }
                              title="ยืนยันการลบกลุ่ม?"
                              description={`ยืนยันการลบ "${item.item_name}" ใช่หรือไม่ ? ถ้าลบแล้วจะไม่สามารถเปลี่ยนแปลงได้`}
                            />
                          </td>
                        </tr>
                      </>,
                    ];
                  })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="table-container">
            <table id="tabledata" rules="none">
              <thead>
                {columnListDOType.map((list, index) => {
                  if (index !== columnListPurchaseReturn.length - 1)
                    return [
                      <th style={{ textAlign: "center" }}>
                        <div>{list.nameth}</div>
                        <div>{list.nameEng}</div>
                      </th>,
                    ];
                  return null;
                })}
              </thead>
              <tbody id="table-body">
                {data &&
                  data.map((item, itemIndex) => {
                    return [
                      <tr
                        style={{
                          borderBottom: "1px rgba(190, 190, 190, 1) solid",
                        }}
                      >
                        <td>{itemIndex + 1}</td>
                        <td style={{ maxWidth: "300px" }}>
                          <div
                            className="account__tabledata__itemname-grid-layout"
                            style={{
                              textAlign: "left",
                              padding: "10px 15px",
                            }}
                          >
                            <div>{item.item_name}</div>
                            <div></div>
                            <div>{item.item_description}</div>
                          </div>
                        </td>
                        <td style={{ padding: "20px 0" }}>
                          {getWeight(item.item_id)}
                        </td>
                        <td>{toLocale(item.item_quantity)}</td>
                        <td>{item.item_unit}</td>
                      </tr>,
                    ];
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  const renderTablePurchaseReturn = () => {
    return (
      <div style={{ marginBottom: "38px" }}>
        {!disabled ? (
          <div>
            <div className="table-container">
              <table id="tabledata" rules="none">
                <thead>
                  {columnListPurchaseReturn.map((list, index) => {
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
                    data.map((item, itemIndex) => {
                      return [
                        <Fragment key={itemIndex}>
                          <tr key={itemIndex}>
                            <th>
                              <p>{itemIndex + 1}</p>
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
                            <td>{getWeight(item.item_id)}</td>
                            <td>{item.item_quantity}</td>
                            <td>{item.item_price}</td>
                            <td>{item.item_unit}</td>
                            <td>
                              <TextField
                                variant="outlined"
                                type="number"
                                size="small"
                                inputProps={{ min: 0 }}
                                id={`${name}[${itemIndex}].item_returned`}
                                name={`${name}[${itemIndex}].item_returned`}
                                value={item.item_returned}
                                onChange={(e) => {
                                  formik.handleChange(e);
                                }}
                                error={Boolean(
                                  getIn(
                                    touched,
                                    `${name}[${itemIndex}].item_returned`
                                  ) &&
                                    getIn(
                                      errors,
                                      `${name}[${itemIndex}].item_returned`
                                    )
                                )}
                                helperText={
                                  getIn(
                                    touched,
                                    `${name}[${itemIndex}].item_returned`
                                  ) &&
                                  getIn(
                                    errors,
                                    `${name}[${itemIndex}].item_returned`
                                  ) &&
                                  getIn(
                                    errors,
                                    `${name}[${itemIndex}].item_returned`
                                  )
                                }
                              />
                            </td>
                            <td>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  const cloneConfirm = [...confirmation];
                                  cloneConfirm[itemIndex] = true;
                                  setConfirmation(cloneConfirm);
                                }}
                              >
                                <ClearIcon />
                              </IconButton>
                            </td>
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
                {columnListPurchaseReturn.map((list, index) => {
                  if (index !== columnListPurchaseReturn.length - 1)
                    return [
                      <th key={index} style={{ textAlign: "center" }}>
                        <div>{list.nameth}</div>
                        <div>{list.nameEng}</div>
                      </th>,
                    ];
                  return null;
                })}
              </thead>
              <tbody id="table-body">
                {data &&
                  data.map((item, itemIndex) => {
                    return [
                      <Fragment key={itemIndex}>
                        <tr key={itemIndex}>
                          <th>
                            <p>{itemIndex + 1}</p>
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
                          <td>{getWeight(item.item_id)}</td>
                          <td>{item.item_quantity}</td>
                          <td>{item.item_price}</td>
                          <td>{item.item_unit}</td>
                          <td>{item.item_returned}</td>
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

  const renderTableExpenseNote = () => {
    return (
      <div style={{ marginBottom: "38px" }}>
        {!disabled ? (
          <div>
            <div className="table-container">
              <table id="tabledata" rules="none">
                <thead>
                  {columnListExpenseNote.map((list, index) => {
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
                    data.map((item, itemIndex) => {
                      return [
                        <Fragment key={itemIndex}>
                          <tr key={itemIndex}>
                            <th>
                              <p>{itemIndex + 1}</p>
                            </th>
                            <td sx={{ display: "grid" }}>
                              <FormControl
                                fullWidth
                                size="small"
                                error={Boolean(
                                  getIn(
                                    touched,
                                    `${name}[${itemIndex}].item_account`
                                  ) &&
                                    getIn(
                                      errors,
                                      `${name}[${itemIndex}].item_account`
                                    )
                                )}
                              >
                                <InputLabel id="demo-simple-select-label"></InputLabel>
                                <Select
                                  fullWidth
                                  labelId="demo-simple-select-label"
                                  id="demo-simple-select"
                                  size="small"
                                  name={`${name}[${itemIndex}].item_account`}
                                  value={item.item_account}
                                  onChange={(e) => {
                                    formik.handleChange(e);
                                  }}
                                >
                                  {accountOption.map((option) => {
                                    return (
                                      <MenuItem
                                        key={`${option.name} + ${item.item_account}`}
                                        value={option.value}
                                      >
                                        {option.name}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                                <FormHelperText>
                                  {getIn(
                                    touched,
                                    `${name}[${itemIndex}].item_account`
                                  ) &&
                                    getIn(
                                      errors,
                                      `${name}[${itemIndex}].item_account`
                                    ) &&
                                    getIn(
                                      touched,
                                      `${name}[${itemIndex}].item_account`
                                    )}
                                </FormHelperText>
                              </FormControl>
                            </td>
                            <td>
                              <TextField
                                variant="outlined"
                                name={`${name}[${itemIndex}].item_description`}
                                size="small"
                                value={item.item_description}
                                onChange={(e) => {
                                  formik.handleChange(e);
                                }}
                              />
                            </td>
                            <td>
                              <TextField
                                variant="outlined"
                                name={`${name}[${itemIndex}].item_quantity`}
                                type="number"
                                size="small"
                                inputProps={{ min: 0 }}
                                value={item.item_quantity}
                                onChange={(e) => {
                                  formik.handleChange(e);
                                }}
                                error={Boolean(
                                  getIn(
                                    touched,
                                    `${name}[${itemIndex}].item_quantity`
                                  ) &&
                                    getIn(
                                      errors,
                                      `${name}[${itemIndex}].item_quantity`
                                    )
                                )}
                                helperText={
                                  getIn(
                                    touched,
                                    `${name}[${itemIndex}].item_quantity`
                                  ) &&
                                  getIn(
                                    errors,
                                    `${name}[${itemIndex}].item_quantity`
                                  ) &&
                                  getIn(
                                    errors,
                                    `${name}[${itemIndex}].item_quantity`
                                  )
                                }
                              />
                            </td>
                            <td>
                              <TextField
                                variant="outlined"
                                name={`${name}[${itemIndex}].item_price`}
                                type="number"
                                size="small"
                                inputProps={{ min: 0 }}
                                value={parseFloat(item.item_price)}
                                onChange={(e) => {
                                  formik.handleChange(e);
                                }}
                                error={Boolean(
                                  getIn(
                                    touched,
                                    `${name}[${itemIndex}].item_price`
                                  ) &&
                                    getIn(
                                      errors,
                                      `${name}[${itemIndex}].item_price`
                                    )
                                )}
                                helperText={
                                  getIn(
                                    touched,
                                    `${name}[${itemIndex}].item_price`
                                  ) &&
                                  getIn(
                                    errors,
                                    `${name}[${itemIndex}].item_price`
                                  ) &&
                                  getIn(
                                    errors,
                                    `${name}[${itemIndex}].item_price`
                                  )
                                }
                              />
                            </td>
                            <td>
                              <TextField
                                variant="outlined"
                                name={`${name}[${itemIndex}].total_discount`}
                                type="number"
                                size="small"
                                inputProps={{ min: 0 }}
                                value={parseFloat(item.total_discount)}
                                onChange={(e) => {
                                  formik.handleChange(e);
                                }}
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
                                  name={`${name}[${itemIndex}].vat`}
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
                              <TextField
                                disabled
                                variant="outlined"
                                name={`${name}[${itemIndex}].pre_vat_amount`}
                                type="number"
                                size="small"
                                inputProps={{ min: 0 }}
                                value={parseFloat(item.pre_vat_amount)}
                                sx={{ width: "fit-content" }}
                                onChange={(e) => {
                                  formik.handleChange(e);
                                }}
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
                                  name={`${name}[${itemIndex}].item_withholding_tax.tax`}
                                  value={item.item_withholding_tax.tax}
                                  onChange={(e) => {
                                    formik.handleChange(e);
                                  }}
                                >
                                  {withHoldingTaxOption.map((val, index) => (
                                    <MenuItem
                                      key={`${val.name} + ${index}`}
                                      value={val.name}
                                    >
                                      {val.name}
                                    </MenuItem>
                                  ))}
                                </Select>
                                <FormHelperText>
                                  {toLocale(calWithholdingTax(item))}
                                </FormHelperText>
                              </FormControl>
                            </td>
                            <td>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  const cloneConfirm = [...confirmation];
                                  cloneConfirm[itemIndex] = true;
                                  setConfirmation(cloneConfirm);
                                }}
                              >
                                <ClearIcon />
                              </IconButton>
                            </td>
                          </tr>
                        </Fragment>,
                      ];
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
                    <td></td>
                    <th style={{ textAlign: "right" }}>ยอดก่อนภาษี </th>
                    <th style={{ textAlign: "left" }}>Pre-vat Amount</th>
                    <th>{toLocale(groupPreVatAmount())} </th>
                    <th>บาท</th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="table-container">
            <table id="tabledata" rules="none">
              <thead>
                {columnListExpenseNote.map((list, index) => {
                  if (index !== columnListExpenseNote.length - 1)
                    return [
                      <th key={index} style={{ textAlign: "center" }}>
                        <div>{list.nameth}</div>
                        <div>{list.nameEng}</div>
                      </th>,
                    ];
                  return null;
                })}
              </thead>
              <tbody id="table-body">
                {data &&
                  data.map((item, itemIndex) => {
                    return [
                      <Fragment key={itemIndex}>
                        <tr key={itemIndex}>
                          <th>
                            <p>{itemIndex + 1}</p>
                          </th>
                          <td>{item.item_account}</td>
                          <td>{item.item_description}</td>
                          <td>{item.item_quantity}</td>
                          <td>{item.item_price}</td>
                          <td>{item.total_discount}</td>
                          <td>{item.item_vat}</td>
                          <td>{item.item_pre_vat_amount}</td>
                          <td>{item.item_withholding_tax.tax}</td>
                        </tr>
                      </Fragment>,
                    ];
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
                  <td></td>
                  <th style={{ textAlign: "right" }}>ยอดก่อนภาษี </th>
                  <th style={{ textAlign: "left" }}>Pre-vat Amount</th>
                  <th>{toLocale(groupPreVatAmount())} </th>
                  <th>บาท</th>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {DOTable
        ? tableDataDO()
        : PRTable
        ? tableDataPurchasePR()
        : !PurchaseReturn
        ? !ExpenseNote
          ? tableDataPurchase()
          : renderTableExpenseNote()
        : renderTablePurchaseReturn()}
    </div>
  );
}
