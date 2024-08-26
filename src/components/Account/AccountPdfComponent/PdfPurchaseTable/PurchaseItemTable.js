import React from "react";

export default function PurchaseItemTable({ data, disabled, type }) {
  //header table
  const columnListPurchaseRequest = [
    { nameth: "รายการ", nameEng: "No." },
    { nameth: "ชื่อสินค้า", nameEng: "Name" },
    { nameth: "จำนวนสั่งขาย", nameEng: "QA Qty" },
    { nameth: "จำนวนขอซื้อ", nameEng: "Qty" },
    { nameth: "สั่งซื้อแล้ว", nameEng: "Ordered Qty" },
    { nameth: "หน่วย", nameEng: "Unit" },
    { nameth: "หมายเหตุ", nameEng: "Remarks" },
  ];

  const columnListPurchaseOrder = [
    { nameth: "รายการ", nameEng: "No." },
    { nameth: "ชื่อสินค้า", nameEng: "Name" },
    { nameth: "จำนวน", nameEng: "Qty" },
    { nameth: "หน่วย", nameEng: "Unit" },
    { nameth: "ราคา/หน่วย", nameEng: "Price/Unit" },
    { nameth: "ส่วนลด", nameEng: "Discount" },
    { nameth: "ภาษี", nameEng: "Vat" },
    { nameth: "ยอดก่อนภาษี", nameEng: "Pre-vat Amount" },
  ];

  //sum of groupPrevat
  const groupPreVatAmount = () => {
    const newData = data.reduce((sum, item) => {
      return sum + parseFloat(item.pre_vat_amount);
    }, 0);
    return newData.toFixed(2);
  };

  const vatRender = (vat) => {
    if (vat === "ZERO") return "0%";
    if (vat === "SEVEN") return "7%";
    return `ไม่มี`;
  };

  function toLocale(number) {
    if (!isNaN(number))
      return parseFloat(number).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
  }

  function renderTablePurchaseRequest() {
    return (
      <div style={{ marginBottom: "38px" }}>
        <div className="pdf-table-container">
          <table id="pdftable" rules="none">
            <thead>
              {columnListPurchaseRequest.map((list) => {
                return [
                  <th style={{ textAlign: "center" }}>
                    <div>{list.nameth}</div>
                    <div>{list.nameEng}</div>
                  </th>,
                ];
              })}
            </thead>
            <tbody id="purchase-table-body">
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
                          className="pdf-purchase-itemname-grid"
                          style={{ textAlign: "left" }}
                        >
                          <div>{item.item_name}</div>

                          <div>{item.item_description}</div>
                        </div>
                      </td>
                      <td>{item.qa_quantity}</td>
                      <td style={{ padding: "15px 20px" }}>
                        {item.item_quantity}
                      </td>
                      <td>{item.item_quantity}</td>
                      <td>{item.item_unit}</td>
                      <td>-</td>
                    </tr>,
                  ];
                })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function renderTablePurchaseOrder() {
    return (
      <div style={{ marginBottom: "38px" }}>
        <div className="pdf-table-container">
          <table id="pdftable" rules="none">
            <thead>
              {columnListPurchaseOrder.map((list) => {
                return [
                  <th style={{ textAlign: "center" }}>
                    <div>{list.nameth}</div>
                    <div>{list.nameEng}</div>
                  </th>,
                ];
              })}
            </thead>
            <tbody id="purchase-table-body">
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
                          className="pdf-purchase-itemname-grid"
                          style={{ textAlign: "left" }}
                        >
                          <div>{item.item_name}</div>
                          <div>{item.item_description}</div>
                        </div>
                      </td>
                      <td>{item.qa_quantity}</td>
                      <td style={{ padding: "15px 20px" }}>{item.item_unit}</td>
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
                <th>ยอดก่อนภาษี </th>
                <th style={{ textAlign: "left" }}>Pre-vat Amount</th>
                <th>{toLocale(groupPreVatAmount())} </th>
                <th>บาท</th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const renderTablePurchaseInvoice = () => {
    return (
      <div style={{ marginBottom: "38px" }}>
        <div className="pdf-table-container">
          <table id="pdftable" rules="none">
            <thead>
              {columnListPurchaseOrder.map((list) => {
                return [
                  <th style={{ textAlign: "center" }}>
                    <div>{list.nameth}</div>
                    <div>{list.nameEng}</div>
                  </th>,
                ];
              })}
            </thead>
            <tbody id="purchase-table-body">
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
                          className="pdf-purchase-itemname-grid"
                          style={{ textAlign: "left" }}
                        >
                          <div>{item.item_name}</div>
                          <div>{item.item_description}</div>
                        </div>
                      </td>
                      <td>{item.qa_quantity}</td>
                      <td style={{ padding: "15px 20px" }}>{item.item_unit}</td>
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
                <th>ยอดก่อนภาษี </th>
                <th style={{ textAlign: "left" }}>Pre-vat Amount</th>
                <th>{toLocale(groupPreVatAmount())} </th>
                <th>บาท</th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div>
      {type === "purchaseRequest"
        ? renderTablePurchaseRequest(disabled)
        : type === "purchaseOrder"
        ? renderTablePurchaseOrder(disabled)
        : type === "purchaseInvoice"
        ? renderTablePurchaseInvoice(disabled)
        : ""}
    </div>
  );
}
