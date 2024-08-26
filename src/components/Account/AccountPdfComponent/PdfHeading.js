import React from "react";
import { Divider } from "@mui/material";

export default function PdfHeading({
  stage,
  formatLeftInfo,
  formatRightInfo,
  isLoading,
  type,
}) {
  const dueDateCases = () => {
    switch (stage) {
      case "quotation":
        return "ใช้ได้ถึง / Due Date";
      case "salesOrder":
        return "ใช้ได้ถึง / Due Date";
      case "salesInvoice":
        return "วันที่ครบกำหนด / Due Date";
      case "billingNote":
        return "วันที่นัดชำระเงิน/ Due Date";
      case "creditNote":
        return "วันที่นัดชำระเงิน/ Due Date";
      case "purchaseRequest":
        return "ต้องการภายในวันที่ / Due Date";
      case "purchaseOrder":
        return "วันที่ครบกำหนด / Due Date";
      case "purchaseInvoice":
        return "วันที่ครบกำหนด / Due Date";
      case "expenses":
        return "วันที่ครบกำหนด / Due Date";
      case "combinedPayment":
        return "ต้องการภายในวันที่/ Due Date";
      default:
        return "";
    }
  };

  const stageTitle = () => {
    switch (stage) {
      case "quotation":
        return "ใบเสนอราคา/Quotation";
      case "salesOrder":
        return "ใบสั่งขาย/Sale Order";
      case "salesInvoice":
        return "ใบแจ้งหนี้/Sale Invoice";
      case "paymentReceipt":
        return "ใบเสร็จรับเงิน/Receipt";
      case "billingNote":
        return "ใบวางบิล/Billing Note";
      case "creditNote":
        return "ใบลดหนี้/Credit Note";
      case "depositInvoice":
        return "ใบเสร็จรับเงินมัดจำ/Deposit Invoice";
      case "deliveryOrder":
        return "ใบส่งของ/Delivery order";
      case "purchaseRequest":
        return "ใบขอซื้อ/Purchase Request";
      case "purchaseOrder":
        return "ใบสั่งซื้อ/Purchase Order";
      case "purchaseInvoice":
        return "บันทึกซื้อ/Purchase Invoice";
      case "combinedPayment":
        return "ใบรวมจ่าย/Combined Payment";
      case "paymentMade":
        return "การชำระเงิน/Payment Made";
      case "expenses":
        return "บันทึกค่าใช้จ่าย/Expense Note";
      case "debitNote":
        return "รับใบลดหนี้/Debit Note";
      default:
        return "";
    }
  };

  return (
    <>
      {!isLoading && (
        <>
          <div className="pdf-header-wrapper">
            <div className="pdf-header-left">
              <img
                width="200"
                alt="biowood-logo"
                src="/logos/biowood-logo.png"
              />
              <div>
                <div className="pdf-header-left-title">
                  บริษัท จีอาร์เอ็ม (ประเทศไทย) จำกัด
                </div>
                <div className="pdf-header-left-title">
                  55/32 ซอย หมู่บ้านกลางเมืองเดอะปารีส รัชวิภา
                </div>
                <div className="pdf-header-left-title">
                  แขวง ลาดยาว เขต จตุจักร กรุงเทพมหานคร 10900
                </div>
                <div className="pdf-header-left-title">
                  เลขประจำตัวผู้เสียภาษีอากร 1234567890112
                </div>
                <div className="pdf-header-left-title">
                  โทรศัพท์ 0900000000 / 0800000000
                </div>
              </div>
            </div>
            <div>
              <div className="pdf-header-title">(ต้นฉบับ/Original)</div>
              <div className="pdf-header-subtitle">{stageTitle()}</div>
            </div>
          </div>
          <Divider sx={{ borderBottomWidth: 1, borderColor: "#9F9F9F" }} />
          {type === "sales" && (
            <div className="pdf-header-info-wrapper ">
              <div className="pdf-header-info">
                <div>
                  {stage !== "depositInvoice" && stage !== "deliveryOrder" && (
                    <>
                      <div className="pdf-info-title">
                        รหัสโปรเจค / Project No.
                      </div>
                      <div className="pdf-info-title">
                        ชื่อโปรเจค / Project Name
                      </div>
                    </>
                  )}
                  <div className="pdf-info-title">
                    ชื่อลูกค้า / Customer Name
                  </div>
                  {stage !== "paymentReceipt" && (
                    <div className="pdf-info-title">
                      เลขผู้เสียภาษี / Tax ID
                    </div>
                  )}
                  {stage !== "paymentReceipt" &&
                    stage !== "creditNote" &&
                    stage !== "depositInvoice" &&
                    stage !== "billingNote" && (
                      <div className="pdf-info-title">อีเมล / Email</div>
                    )}
                  <div className="pdf-info-title">วันที่/ Date</div>
                  {stage !== "paymentReceipt" && (
                    <div className="pdf-info-title">{dueDateCases()}</div>
                  )}
                  {stage === "salesOrder" && (
                    <div className="pdf-info-title">
                      วันกำหนดส่งของ / Expected Shipment Date
                    </div>
                  )}
                </div>
                <div>
                  {formatLeftInfo.map((info, index) => (
                    <div key={index} className="pdf-info-subtitle">
                      {info}
                    </div>
                  ))}
                </div>
              </div>
              <div className="pdf-header-info">
                <div>
                  <div className="pdf-info-title">
                    เลขที่เอกสาร / Document No.
                  </div>
                  {stage !== "quotation" &&
                    stage !== "billingNote" &&
                    stage !== "depositInvoice" && (
                      <div className="pdf-info-title">อ้างอิงถึง / Ref</div>
                    )}
                  {stage !== "paymentReceipt" &&
                    stage !== "billingNote" &&
                    stage !== "creditNote" &&
                    stage !== "depositInvoice" &&
                    stage !== "deliveryOrder" && (
                      <>
                        <div className="pdf-info-title">พนักงานขาย / Sale</div>
                        <div className="pdf-info-title">
                          เบอร์โทรศัพท์ / Phone
                        </div>
                        <div className="pdf-info-title">เบอร์โทรสาร / Fax</div>
                      </>
                    )}
                  {stage === "deliveryOrder" && (
                    <>
                      {" "}
                      <div className="pdf-info-title">
                        เบอร์โทรศัพท์ / Phone
                      </div>
                    </>
                  )}
                  <>
                    <div className="pdf-info-title">ที่อยู่ / Address</div>{" "}
                  </>
                </div>
                <div>
                  {formatRightInfo.map((info, index) => (
                    <div key={index} className="pdf-info-subtitle">
                      {info}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {type === "purchase" && (
            <div className="pdf-header-info-wrapper ">
              <div className="pdf-header-info">
                <div>
                  {stage === "purchaseRequest" && (
                    <>
                      <div className="pdf-info-title">
                        รหัสโปรเจค / Project No.
                      </div>
                      <div className="pdf-info-title">
                        ชื่อโปรเจค / Project Name
                      </div>
                    </>
                  )}
                  {stage !== "purchaseRequest" && (
                    <>
                      <div className="pdf-info-title">ผู้ขาย / Vendor</div>
                      <div className="pdf-info-title">
                        เลขผู้เสียภาษี / Tax ID
                      </div>
                      <div className="pdf-info-title">
                        เบอร์โทรศัพท์ / Phone
                      </div>
                      <div className="pdf-info-title">อีเมล / Email</div>
                    </>
                  )}
                  <div className="pdf-info-title">วันที่/ Date</div>
                  <div className="pdf-info-title">{dueDateCases()}</div>
                </div>
                <div>
                  {formatLeftInfo.map((info, index) => (
                    <div key={index} className="pdf-info-subtitle">
                      {info}
                    </div>
                  ))}
                </div>
              </div>
              <div className="pdf-header-info">
                <div>
                  <div className="pdf-info-title">
                    เลขที่เอกสาร / Document No.
                  </div>
                  {stage !== "expenses" && (
                    <div className="pdf-info-title">อ้างอิงถึง / Ref</div>
                  )}
                  {stage !== "purchaseRequest" && (
                    <div className="pdf-info-title">ที่อยู่ / Address</div>
                  )}
                </div>
                <div>
                  {formatRightInfo.map((info, index) => (
                    <div key={index} className="pdf-info-subtitle">
                      {info}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
