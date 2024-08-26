import React, { useState, useEffect, Fragment } from 'react'
import { IconButton, TextField } from '@mui/material'

import AccountEditAmountComponent from '../../AccountEditAmountComponent'
import ClearIcon from '@mui/icons-material/Clear'
import { queryItemInventory } from '../../../../adapter/Api/graphql'
import AccountConfirmationComponent from '../../AccountConfirmationComponent'

export default function SalesItemTable({ data, formik, disabled, salesReturn, name }) {
  // const [itemList, setItemList] = useState([]);
  const [confirmation, setConfirmation] = useState([false])
  //header table
  const columnListSalesReturn = [
    { nameth: 'รายการ', nameEng: 'No.' },
    { nameth: 'ชื่อสินค้า', nameEng: 'Name' },
    { nameth: 'น้ำหนัก', nameEng: 'Weight' },
    { nameth: 'จำนวน', nameEng: 'Qty' },
    { nameth: 'ราคา/หน่วย', nameEng: 'Price/Unit' },
    { nameth: 'หน่วย', nameEng: 'Unit' },
    { nameth: 'จำนวนคืน', nameEng: 'Returned' },
    { nameth: '', nameEng: '' }
  ]

  const columnListDisableEdit = [
    { nameth: 'รายการ', nameEng: 'No.' },
    { nameth: 'ชื่อสินค้า', nameEng: 'Name' },
    { nameth: 'จำนวน', nameEng: 'Qty' },
    { nameth: 'หน่วย', nameEng: 'Unit' },
    { nameth: 'ราคา/หน่วย', nameEng: 'Price/Unit' },
    { nameth: 'ส่วนลด', nameEng: 'Discount' },
    { nameth: 'ภาษี', nameEng: 'Vat' },
    { nameth: 'ยอดก่อนภาษี', nameEng: 'Pre-vat Amount' },
    { nameth: 'หัก ณ ที่จ่าย', nameEng: 'Withholding tax' }
  ]

  //option selest withHoldingTax
  const withHoldingTaxOption = [
    { name: 'ยังไม่ระบุ', value: 'ยังไม่ระบุ' },
    { name: 'ไม่มี', value: 'ไม่มี' },
    { name: '0.75%', value: 0.0075 },
    { name: '1%', value: 0.01 },
    { name: '1.5%', value: 0.015 },
    { name: '2%', value: 0.02 },
    { name: '3%', value: 0.03 },
    { name: '5%', value: 0.05 },
    { name: '10%', value: 0.1 },
    { name: '15%', value: 0.15 }
  ]

  //function delete group
  const deleteGroup = (groupIndex) => {
    const clone = [...data]
    const newData = clone.filter((_, index) => {
      return index !== groupIndex
    })
    const newConfimation = confirmation.filter((_, index) => {
      return index !== groupIndex
    })
    formik.setFieldValue(`${name}`, newData)
    setConfirmation(newConfimation)
    return
  }

  const checkNull = (data) => {
    if (data === null) return ''
    return data
  }

  const changeUOM = (uom) => {
    if (uom === null) return ''
    if (uom === 'cm') return 'ซม.'
    if (uom === 'm') return 'ม.'
  }

  //call api to get ItemList
  useEffect(() => {
    const itemInventoryInput = {}
    const getDescription = (Item) => {
      const dimentions = Item.getSaleBaseUOMDimensions
      if (dimentions === null) return Item.description
      return `${Item.description} ${checkNull(dimentions.width)}${changeUOM(dimentions.widthUOM)}${
        dimentions.width !== null ? 'x' : ''
      }${checkNull(dimentions.length)}${changeUOM(dimentions.lengthUOM)}${
        dimentions.length !== null ? 'x' : ''
      }${checkNull(dimentions.height)}${changeUOM(dimentions.heightUOM)}`
    }
    queryItemInventory(itemInventoryInput).then((data) => {
      const myData = data.data.data.listItem.items.filter((data) => data.isActive !== false)
      const myDataIsStock = myData.filter((data) => data.isSale !== false)
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
          getUOMGroup: item.getUOMGroup
        }
      })
      // setItemList(usageData);
      console.log('usageData', usageData)
    })
  }, [])

  const calWithholdingTax = (Item) => {
    if (Item.item_withholding_tax.tax !== 'ยังไม่ระบุ' && Item.item_withholding_tax.tax !== 'ไม่มี')
      if (Item.vat === 'SEVEN') {
        const findOption = withHoldingTaxOption.find((option) => option.name === Item.item_withholding_tax.tax)
        const sum = (0.93 * Item.pre_vat_amount * findOption.value).toFixed(2)
        Item.item_withholding_tax.withholding_tax_amount = sum
        return Item.item_withholding_tax.withholding_tax_amount
      } else {
        const findOption = withHoldingTaxOption.find((option) => option.name === Item.item_withholding_tax.tax)
        const sum = (Item.pre_vat_amount * findOption.value).toFixed(2)
        Item.item_withholding_tax.withholding_tax_amount = sum
        return Item.item_withholding_tax.withholding_tax_amount
      }
    return
  }

  //sum of groupPrevat
  const groupPreVatAmount = (group) => {
    const newData = group.category_list.reduce((sum, category) => {
      return (
        sum +
        category.item_data.reduce((sumItem, item) => {
          return sumItem + parseFloat(item.pre_vat_amount)
        }, 0)
      )
    }, 0)
    return newData
  }

  //render string of vat
  const vatRender = (vat) => {
    if (vat === 'ZERO') return '0%'
    if (vat === 'SEVEN') return '7%'
    return `ไม่มี`
  }

  //close popup delete
  const closeConfirmationHandler = (Index) => {
    const newConfimation = confirmation.filter((_, index) => {
      return index !== Index
    })
    setConfirmation(newConfimation)
  }

  //display number to toLocaleString
  function toLocale(number) {
    if (!isNaN(number))
      return parseFloat(number).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
  }

  const renderTableSales = (disabled) => {
    return (
      <div style={{ marginBottom: '38px' }}>
        <div className="pdf-table-container">
          <table id="pdftable" rules="none">
            <thead>
              {columnListDisableEdit.map((list, index) => {
                return [
                  <th key={index} style={{ textAlign: 'center' }}>
                    <div>{list.nameth}</div>
                    <div>{list.nameEng}</div>
                  </th>
                ]
              })}
            </thead>
            <tbody id="pdftable">
              {data &&
                data.map((group, groupIndex) => {
                  return [
                    <Fragment key={groupIndex}>
                      <tr
                        key={groupIndex}
                        style={{
                          backgroundColor: 'rgba(195, 220, 167, 1)'
                        }}>
                        <th>
                          <div
                            style={{
                              fontSize: '12px',
                              fontWeight: 'bold',
                              paddingLeft: '10px'
                            }}>
                            กลุ่มที่ {groupIndex + 1}
                          </div>
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
                                backgroundColor: 'rgba(233, 246, 234, 1)',
                                borderBottom: '8px white solid'
                              }}>
                              <td></td>
                              <th
                                style={{
                                  padding: '6px 0 4px 0',
                                  textAlign: 'left'
                                }}>
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
                                    borderBottom: '8px white solid'
                                  }}>
                                  <td>{itemIndex + 1}</td>
                                  <td sx={{ display: 'grid' }}>
                                    <div className="pdf-item-name" style={{ textAlign: 'left' }}>
                                      <div>{item.item_name}</div>
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
                                        return discount.percent
                                      })
                                      .join('/')}%)`}
                                  </td>
                                  <td>{vatRender(item.vat)}</td>
                                  <td>{toLocale(item.pre_vat_amount)}</td>
                                  <td>
                                    {item.item_withholding_tax.tax}
                                    {item.item_withholding_tax.tax !== 'ยังไม่ระบุ' &&
                                      item.item_withholding_tax.tax !== 'ไม่มี' &&
                                      `(${toLocale(calWithholdingTax(item))})`}
                                  </td>
                                </tr>
                              )
                            })}
                            <tr></tr>
                          </Fragment>
                        )
                      })}
                      <tr
                        style={{
                          backgroundColor: 'rgba(233, 233, 233, 1)'
                        }}>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <th style={{ padding: '5px 0' }}>ยอดก่อนภาษี </th>
                        <th style={{ textAlign: 'left' }}>Pre-vat Amount</th>
                        <th>{toLocale(groupPreVatAmount(group))} </th>
                        <th>บาท</th>
                      </tr>
                    </Fragment>
                  ]
                })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const renderTableSalesReturn = (disabled) => {
    return (
      <div style={{ marginBottom: '38px' }}>
        <div>
          <div className="table-container">
            <table id="tabledata" rules="none">
              <thead>
                {columnListSalesReturn.map((list, index) => {
                  return [
                    <th key={index} style={{ textAlign: 'center' }}>
                      <div>{list.nameth}</div>
                      <div>{list.nameEng}</div>
                    </th>
                  ]
                })}
              </thead>
              <tbody id="pdftable">
                {data &&
                  data.map((group, groupIndex) => {
                    return [
                      <Fragment key={groupIndex}>
                        {group.category_list.map((category, categoryindex) => {
                          return (
                            <Fragment key={categoryindex}>
                              {category.item_data.map((item, itemIndex) => {
                                return (
                                  <tr key={itemIndex}>
                                    <th>
                                      <p>{itemIndex + 1}</p>
                                    </th>
                                    <td>{item.item_name}</td>
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
                                          id={`${name}[${itemIndex}].item_returned`}
                                          name={`${name}[${itemIndex}].item_returned`}
                                          value={item.item_returned}
                                          onChange={(e) => {
                                            formik.handleChange(e)
                                          }}
                                        />
                                        <AccountEditAmountComponent
                                          itemQuantity={item.item_returned}
                                          itemUnit={item.item_unit}
                                          formik={formik}
                                          name={`${name}[${itemIndex}].item_returned`}
                                        />
                                      </td>
                                    ) : (
                                      <td></td>
                                    )}
                                    {!disabled ? (
                                      <td>
                                        <IconButton
                                          size="small"
                                          onClick={() => {
                                            const cloneConfirm = [...confirmation]
                                            cloneConfirm[itemIndex] = true
                                            setConfirmation(cloneConfirm)
                                          }}>
                                          <ClearIcon />
                                        </IconButton>
                                        <AccountConfirmationComponent
                                          open={confirmation[itemIndex]}
                                          handleSubmit={() => deleteGroup(itemIndex)}
                                          handleClose={() => closeConfirmationHandler(itemIndex)}
                                          title="ยืนยันการลบสินค้า?"
                                          description={`ยืนยันการลบ "${item.item_name}" ใช่หรือไม่ ? ถ้าลบแล้วจะไม่สามารถเปลี่ยนแปลงได้`}
                                        />
                                      </td>
                                    ) : (
                                      <td></td>
                                    )}
                                  </tr>
                                )
                              })}
                            </Fragment>
                          )
                        })}
                      </Fragment>
                    ]
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  return <div>{!salesReturn ? renderTableSales(disabled) : renderTableSalesReturn(disabled)}</div>
}
