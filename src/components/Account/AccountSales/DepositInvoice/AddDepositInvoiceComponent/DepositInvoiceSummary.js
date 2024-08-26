import { Divider } from "@mui/material";
import React from "react";
import { toLocaleWithTwoDigits } from "../../../../../adapter/Utils";

const DepositInvoiceSummary = ({ vatExempted, vatZero, vatSeven }) => {
  const items = [
    {
      title: "มูลค่ารายการยกเว้นภาษี / VAT Exempted Amount",
      detail: toLocaleWithTwoDigits(vatExempted) || 0.0,
      unit: "บาท",
    },
    {
      title: "มูลค่ารายการภาษี 0% / VAT 0% Amount",
      detail: toLocaleWithTwoDigits(vatZero) || 0.0,
      unit: "บาท",
    },
    {
      title: "มูลค่ารายการภาษี 7% / VAT 7% Amount",
      detail: toLocaleWithTwoDigits(vatSeven) || 0.0,
      unit: "บาท",
    },
  ];

  return (
    <div className="account__summaryContainer">
      <div className="account__summaryContainer-summaryPrimary">
        {items.map((item) => (
          <div className="account__summaryItem" key={item.title}>
            <p>{item.title}</p>
            <p>{item.detail}</p>
            <p>{item.unit}</p>
          </div>
        ))}
      </div>
      <Divider />
      <div className="account__summaryItem">
        <p>จำนวนเงินรวมทั้งสิ้น (บาท) / Total Amount</p>
        <p>{toLocaleWithTwoDigits(vatExempted + vatZero + vatSeven)}</p>
        <p>บาท</p>
      </div>
      <div>
        <Divider />
        <Divider />
      </div>
    </div>
  );
};

export default DepositInvoiceSummary;
