import React, { Fragment } from "react";
import THBText from "thai-baht-text";
import { unixToDateWithFormat } from "../../../../adapter/Utils";
export default function PurchasePaymentTable({ data, disabled, type }) {
  const columnListCombinedPayment = [
    { nameth: "ลำกับที่", nameEng: "No." },
    { nameth: "เลขที่เอกสาร", nameEng: "ID no." },
    { nameth: "ยอดรวมสุทธิ", nameEng: "Total Amount" },
    { nameth: "จำนวนเงิน", nameEng: "Recieved Amount" },
    {},
  ];

  const columnListExpenses = [
    { nameth: "รายการ", nameEng: "No." },
    { nameth: "ชื่อสินค้า", nameEng: "Name" },
    { nameth: "คำอธิบายสินค้า", nameEng: "Description" },
    { nameth: "จำนวน", nameEng: "Qty" },
    { nameth: "ราคา/หน่วย", nameEng: "Price/Unit" },
    { nameth: "ส่วนลด", nameEng: "Discount" },
    { nameth: "ภาษี", nameEng: "Vat" },
    { nameth: "ยอดก่อนภาษี", nameEng: "Pre-vat Amount" },
    {},
  ];

  const columnListPaymentMade = [
    { nameth: "เลขที่เอกสาร", nameEng: "Document Id" },
    { nameth: "วันที่ออก", nameEng: "Issue Date" },
    { nameth: "วันที่ครบกำหนด", nameEng: "Due Date" },
    { nameth: "ยอดรวมสุทธิ", nameEng: "Total Amount" },
    { nameth: "รอรับชำระ", nameEng: "Amount to Pay" },
    { nameth: "จำนวนเงิน", nameEng: "Received Amount" },
    {},
  ];

  const columnListDebitNote = [
    { nameth: "รายการ", nameEng: "No." },
    { nameth: "ชื่อสินค้า", nameEng: "Name" },
    { nameth: "จำนวน", nameEng: "Qty" },
    { nameth: "หน่วย", nameEng: "Unit" },
    { nameth: "ราคา/หน่วย", nameEng: "Price/Unit" },
    { nameth: "ส่วนลด", nameEng: "Discount" },
    { nameth: "ภาษี", nameEng: "Vat" },
    { nameth: "ยอดก่อนภาษี", nameEng: "Pre-vat Amount" },
    {},
  ];

  function toLocale(number) {
    if (!isNaN(number))
      return parseFloat(number).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
  }

  const vatRender = (vat) => {
    if (vat === "ZERO") return "0%";
    if (vat === "SEVEN") return "7%";
    return "ไม่มี";
  };

  // const groupPreVatAmount = (group) => {
  //   const newData = group.category_list.reduce((sum, category) => {
  //     return (
  //       sum +
  //       category.item_data.reduce((sumItem, item) => {
  //         return sumItem + parseFloat(item.pre_vat_amount);
  //       }, 0)
  //     );
  //   }, 0);
  //   return newData;
  // };

  const renderTableCombinedPayment = () => {
    return (
      <div style={{ marginBottom: "38px" }}>
        <div>
          <div className="pdf-table-container">
            <table id="pdftable" rules="none">
              <thead>
                {columnListCombinedPayment.map((list, index) => {
                  return [
                    <th key={index} style={{ textAlign: "center" }}>
                      <div>{list.nameth}</div>
                      <div>{list.nameEng}</div>
                    </th>,
                  ];
                })}
              </thead>
              <tbody id="pdftable">
                {data && (
                  <Fragment>
                    {data.document_list.map((item, itemIndex) => {
                      return (
                        <Fragment key={itemIndex}>
                          <tr key={itemIndex}>
                            <th>
                              <p>{itemIndex + 1}</p>
                            </th>
                            <td>{item.document_id}</td>
                            <td>{toLocale(item.total_amount)}</td>
                            <td>{toLocale(item.billing_amount)}</td>
                            <td></td>
                          </tr>
                        </Fragment>
                      );
                    })}
                  </Fragment>
                )}
                <tr
                  style={{
                    backgroundColor: "rgba(233, 233, 233, 1)",
                  }}
                >
                  <th>{THBText(data.total_amount)}</th>
                  <th style={{ padding: "5px 0" }}>จำนวนเงิน</th>
                  <th style={{ textAlign: "left" }}>Received Amount</th>
                  <th>{toLocale(data.total_amount)} </th>
                  <th>บาท</th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderTablePaymentMade = () => {
    return (
      <div style={{ marginBottom: "38px" }}>
        <div>
          <div className="pdf-table-container">
            <table id="pdftable" rules="none">
              <thead>
                {columnListPaymentMade.map((list, index) => {
                  return [
                    <th key={index} style={{ textAlign: "center" }}>
                      <div>{list.nameth}</div>
                      <div>{list.nameEng}</div>
                    </th>,
                  ];
                })}
              </thead>
              <tbody id="pdftable">
                {data && (
                  <Fragment>
                    {data.payment_made_data.map((item, itemIndex) => {
                      return (
                        <Fragment key={itemIndex}>
                          <tr key={itemIndex}>
                            <th>{item.document_id}</th>
                            <td>{unixToDateWithFormat(item.issue_date)}</td>
                            <td>{unixToDateWithFormat(item.due_date)}</td>
                            <td>{toLocale(item.total_amount)}</td>
                            <td>{toLocale(item.amount_to_pay)}</td>
                            <td>{toLocale(item.received_amount)}</td>
                          </tr>
                        </Fragment>
                      );
                    })}
                  </Fragment>
                )}
                <tr
                  style={{
                    backgroundColor: "rgba(233, 233, 233, 1)",
                  }}
                >
                  <th></th>
                  <th>{THBText(data.total_amount)}</th>
                  <th style={{ padding: "5px 0" }}>จำนวนเงิน</th>
                  <th style={{ textAlign: "left" }}>Received Amount</th>
                  <th>{toLocale(data.total_amount)} </th>
                  <th>บาท</th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderTableExpense = () => {
    return (
      <div style={{ marginBottom: "38px" }}>
        <div>
          <div className="pdf-table-container">
            <table id="pdftable" rules="none">
              <thead>
                {columnListExpenses.map((list, index) => {
                  return [
                    <th key={index} style={{ textAlign: "center" }}>
                      <div>{list.nameth}</div>
                      <div>{list.nameEng}</div>
                    </th>,
                  ];
                })}
              </thead>
              <tbody id="pdftablePurchase">
                {data &&
                  data.expenses_data.map((item, itemIndex) => {
                    return (
                      <Fragment key={itemIndex}>
                        <tr
                          key={itemIndex}
                          style={{
                            borderBottom: "8px white solid",
                          }}
                        >
                          <td>{itemIndex + 1}</td>
                          <td>
                            {item.item_id} - {item.item_name}
                          </td>
                          <td>{item.item_description}</td>
                          <td>{item.item_quantity}</td>
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
                        </tr>
                      </Fragment>
                    );
                  })}
                <Fragment>
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
                    <th style={{ padding: "5px 0" }}>ยอดก่อนภาษี </th>
                    <th style={{ textAlign: "left" }}>Pre-vat Amount</th>
                    <th>
                      {toLocale(
                        data.expenses_data.reduce(
                          (sum, curr) => sum + curr.pre_vat_amount,
                          0
                        )
                      )}
                    </th>
                    <th>บาท</th>
                  </tr>
                </Fragment>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderTableDebitNote = () => {
    return (
      <div style={{ marginBottom: "38px" }}>
        <div>
          <div className="pdf-table-container">
            <table id="pdftable" rules="none">
              <thead>
                {columnListDebitNote.map((list, index) => {
                  return [
                    <th key={index} style={{ textAlign: "center" }}>
                      <div>{list.nameth}</div>
                      <div>{list.nameEng}</div>
                    </th>,
                  ];
                })}
              </thead>
              <tbody id="pdftable">
                {data &&
                  data.debit_note_data.map((group, groupIndex) => {
                    return [
                      <Fragment key={groupIndex}>
                        <tr>
                          <th>
                            <p>{groupIndex + 1}</p>
                          </th>
                          <td>
                            <div style={{ textAlign: "left" }}>
                              {group.item_name}
                            </div>
                            <div style={{ textAlign: "left" }}>
                              {group.item_description}
                            </div>
                          </td>
                          <td>{toLocale(group.qa_quantity)}</td>
                          <td>{group.item_unit}</td>
                          <td>{toLocale(group.item_price)}</td>
                          <td>
                            {toLocale(group.total_discount)}
                            {`(${group.discount_list
                              .map((discount) => {
                                return discount.percent;
                              })
                              .join("/")}%)`}
                          </td>
                          <td>{vatRender(group.vat)}</td>
                          <td>{toLocale(group.pre_vat_amount)}</td>
                        </tr>
                        <tr
                          style={{
                            backgroundColor: "rgba(233, 233, 233, 1)",
                          }}
                        >
                          {/* <th>{THBText(group.deposit_invoice_amount)}</th>
                          <th></th>
                          <th style={{ padding: '5px 0', textAlign: 'right' }}>จำนวนเงิน Received Amount</th>
                          <th>{toLocale(group.deposit_invoice_amount)} </th>
                          <th>บาท</th> */}
                        </tr>
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
      {type === "combinedPayment"
        ? renderTableCombinedPayment(disabled)
        : type === "expenses"
        ? renderTableExpense(disabled)
        : type === "debitNote"
        ? renderTableDebitNote(disabled)
        : type === "paymentMade"
        ? renderTablePaymentMade(disabled)
        : ""}
    </div>
  );
}
