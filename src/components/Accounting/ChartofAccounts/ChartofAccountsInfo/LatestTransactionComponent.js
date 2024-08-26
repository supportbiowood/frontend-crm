import React, { Fragment } from "react";
import { Link } from "react-router-dom";

export default function LatestTransactionComponent({ data }) {
  const columnList = [
    { nameth: "วันที่", nameEng: "Date" },
    { nameth: "รายละเอียด", nameEng: "Info" },
    { nameth: "ประเภท", nameEng: "Type" },
    { nameth: "เดบิต", nameEng: "Debit" },
    { nameth: "เครดิต", nameEng: "Credit" },
  ];

  return (
    <div>
      <h3 className="accounting__header__title">รายการล่าสุด</h3>
      <div style={{ marginBottom: "38px" }}>
        <div className="table-container">
          <table id="tabledata" rules="none">
            <thead>
              {columnList.map((list, index) => {
                return [
                  <th key={index} style={{ textAlign: "center" }}>
                    <div>{list.nameth}</div>
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
                        <td>{item.item_name}</td>
                        <td>{item.item_name}</td>
                        <td>{item.item_quantity}</td>
                        <td>{item.item_price}</td>
                        <td>{item.item_unit}</td>
                        <td></td>
                        <td></td>
                      </tr>
                    </Fragment>,
                  ];
                })}
            </tbody>
          </table>
        </div>
      </div>
      <Link to="/accounting/chart/view/transaction">
        <div className="accounting__link-text">รายการบัญชีเพิ่มเติม</div>
      </Link>
    </div>
  );
}
