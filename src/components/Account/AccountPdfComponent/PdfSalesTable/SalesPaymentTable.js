import React, { useEffect, Fragment } from 'react'
import { queryItemInventory } from '../../../../adapter/Api/graphql'
import THBText from 'thai-baht-text'
export default function SalesPaymentTable({ data, formik, disabled, type, name }) {
  const columnListSalesReturn = [
    { nameth: 'ลำกับที่', nameEng: 'No.' },
    { nameth: 'เลขที่เอกสาร', nameEng: 'ID no.' },
    { nameth: 'ยอดรวมสุทธิ', nameEng: 'Total Amount' },
    { nameth: 'จำนวนเงิน', nameEng: 'Recieved Amount' },
    {}
  ]

  const columnListDeliveryOrder = [
    { nameth: 'รายการ', nameEng: 'No.' },
    { nameth: 'ชื่อสินค้า', nameEng: 'Name' },
    { nameth: 'คำอธิบายสินค้า', nameEng: 'Description' },
    { nameth: 'น้ำหนัก', nameEng: 'Weight' },
    { nameth: 'จำนวน', nameEng: 'Qty' },
    { nameth: 'หน่วย', nameEng: 'Unit' }
  ]

  const checkNull = (data) => {
    if (data === null) return ''
    return data
  }

  const changeUOM = (uom) => {
    if (uom === null) return ''
    if (uom === 'cm') return 'ซม.'
    if (uom === 'm') return 'ม.'
  }

  function toLocale(number) {
    if (!isNaN(number))
      return parseFloat(number).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
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
      // setItemList(usageData)
      console.log('usageData', usageData)
    })
  }, [])

  const renderTablePaymentReceipt = (disabled) => {
    return (
      <div style={{ marginBottom: '38px' }}>
        <div>
          <div className="pdf-table-container">
            <table id="pdftable" rules="none">
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
                {data && (
                  <Fragment>
                    {data.payment_receipt_data.map((item, itemIndex) => {
                      return (
                        <Fragment key={itemIndex}>
                          <tr key={itemIndex}>
                            <th>
                              <p style={{ fontWeight: '400' }}>{itemIndex + 1}</p>
                            </th>
                            <td>{item.document_id}</td>
                            <td>{toLocale(item.total_amount)}</td>
                            <td>{toLocale(item.received_amount)}</td>
                            <td></td>
                          </tr>
                          <tr
                            style={{
                              backgroundColor: 'rgba(233, 233, 233, 1)'
                            }}>
                            <th>{THBText(item.received_amount)}</th>
                            <th style={{ padding: '5px 0' }}>จำนวนเงิน</th>
                            <th style={{ textAlign: 'left' }}>Received Amount</th>
                            <th>{toLocale(item.received_amount)} </th>
                            <th>บาท</th>
                          </tr>
                        </Fragment>
                      )
                    })}
                  </Fragment>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  const renderTableBillingNote = (disabled) => {
    return (
      <div style={{ marginBottom: '38px' }}>
        <div>
          <div className="pdf-table-container">
            <table id="pdftable" rules="none">
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
              <tbody id="pdftablePurchase">
                {data &&
                  data.document_list.map((group, groupIndex) => {
                    return [
                      <Fragment key={groupIndex}>
                        <tr key={groupIndex}>
                          <th>
                            <p>{groupIndex + 1}</p>
                          </th>
                          <td>{group.document_id}</td>
                          <td>{toLocale(group.total_amount)}</td>
                          <td>{toLocale(group.billing_amount)}</td>
                          <td></td>
                        </tr>
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

  const renderTableDepositInvoice = (disabled) => {
    return (
      <div style={{ marginBottom: '38px' }}>
        <div>
          <div className="pdf-table-container">
            <table id="pdftable" rules="none">
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
                  data.deposit_invoice_info.map((group, groupIndex) => {
                    return [
                      <Fragment key={groupIndex}>
                        <tr>
                          <th>
                            <p style={{ fontWeight: '400' }}>{groupIndex + 1}</p>
                          </th>
                          <td>{group.sales_invoice_document_id}</td>
                          <td>{toLocale(group.total_amount)}</td>
                          <td>{toLocale(group.deposit_invoice_amount)}</td>
                        </tr>
                        <tr
                          style={{
                            backgroundColor: 'rgba(233, 233, 233, 1)'
                          }}>
                          <th>{THBText(group.deposit_invoice_amount)}</th>
                          <th></th>
                          <th style={{ padding: '5px 0', textAlign: 'right' }}>จำนวนเงิน Received Amount</th>
                          <th>{toLocale(group.deposit_invoice_amount)} </th>
                          <th>บาท</th>
                        </tr>
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

  const renderTableDeliveryOrder = (disabled) => {
    return (
      <div style={{ marginBottom: '38px' }}>
        <div>
          <div className="pdf-table-container">
            <table className="pdf-table-wrapper" id="pdftable" rules="none">
              <thead>
                {columnListDeliveryOrder.map((list, index) => {
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
                  data.delivery_note_data.map((group, groupIndex) => {
                    return [
                      <Fragment key={groupIndex}>
                        <tr>
                          <th>
                            <p>{groupIndex + 1}</p>
                          </th>
                          <td>
                            {group.item_id} ชื่อสินค้า {group.item_name}
                          </td>
                          <td>{group.item_description}</td>
                          <td>
                            {group.item_weight} {group.item_weight_unit}
                          </td>
                          <td>{group.item_quantity}</td>
                          <td>{group.item_unit}</td>
                        </tr>
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

  return (
    <div>
      {type === 'paymentReceipt'
        ? renderTablePaymentReceipt(disabled)
        : type === 'billingNote'
        ? renderTableBillingNote(disabled)
        : type === 'depositInvoice'
        ? renderTableDepositInvoice(disabled)
        : type === 'deliveryOrder'
        ? renderTableDeliveryOrder(disabled)
        : ''}
    </div>
  )
}
