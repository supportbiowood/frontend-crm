import { Box } from "@mui/material";
import React from "react";

const PdfSummary = ({ summary }) => {
  function toLocale(number) {
    return parseFloat(number).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return (
    <Box>
      <div className="pdf-summary-title">
        <div>ส่วนลดเพิ่มเติม / Additional Discount</div>
        <div>{toLocale(summary.additional_discount)}</div>
        <div>บาท</div>
      </div>
      <div className="pdf-summary-title">
        <div>มูลค่ารายการภาษี 0% / VAT 0% Amount</div>
        <div>{toLocale(summary.vat_0_amount)}</div>
        <div>บาท</div>
      </div>
      <div className="pdf-summary-title">
        <div>ภาษีมูลค่าเพิ่ม 7% / VAT</div>
        <div>{toLocale(summary.vat_7_amount)}</div>
        <div>บาท</div>
      </div>
      <div className="pdf-summary-title">
        <div>ยอดรวมสุทธิ / Net Amount</div>
        <div>{toLocale(summary.net_amount)}</div>
        <div>บาท</div>
      </div>
      <hr />
      <div className="pdf-summary-title pdf-summary-title-total">
        <div>จำนวนเงินรวมทั้งสิ้น (บาท) / Total Amount</div>
        <div>{toLocale(summary.total_amount)}</div>
        <div>บาท</div>
      </div>
      <hr />
      <hr />
    </Box>
  );
};

export default PdfSummary;
