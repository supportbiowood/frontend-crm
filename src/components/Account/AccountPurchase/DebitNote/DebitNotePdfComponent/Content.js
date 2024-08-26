import { Divider, Grid } from "@mui/material";
import PdfHeading from "../../../AccountPdfComponent/PdfHeading";
import PurchasePaymentTable from "../../../AccountPdfComponent/PdfPurchaseTable/PurchasePaymentTable";
import PdfRemark from "../../../AccountPdfComponent/PdfRemark";
import PdfSummary from "../../../AccountPdfComponent/PdfSummary";

const Content = ({ debitNoteData, isLoading }) => {
  let formatLeftInfo = [];
  let formatRightInfo = [];

  if (!isLoading) {
    const vendorInfo = debitNoteData.vendor_info;
    const formatAddress = `${vendorInfo.house_no} ${vendorInfo.building} ${vendorInfo.sub_district} ${vendorInfo.road} ${vendorInfo.district} ${vendorInfo.province} ${vendorInfo.postal_code} ${vendorInfo.country}`;

    formatLeftInfo = [
      vendorInfo.contact_name ? vendorInfo.contact_name : "-",
      vendorInfo.tax_no ? vendorInfo.tax_no : "-",
      vendorInfo.phone ? vendorInfo.phone : "-",
      vendorInfo.email ? vendorInfo.email : "-",
      debitNoteData.debit_note_issue_date,
    ];

    formatRightInfo = [
      debitNoteData.debit_note_document_id,
      debitNoteData.purchase_return_document_id
        ? debitNoteData.purchase_return_document_id
        : "-",
      formatAddress,
    ];
  }

  console.log("debitNoteData", debitNoteData);

  return (
    <div>
      <PdfHeading
        type="purchase"
        stage="debitNote"
        isLoading={isLoading}
        formatLeftInfo={formatLeftInfo}
        formatRightInfo={formatRightInfo}
      />
      <Divider sx={{ borderBottomWidth: 1, borderColor: "#9F9F9F" }} />
      <PurchasePaymentTable data={debitNoteData} type="debitNote" />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <div>
            <div className="pdf-payment-done">ประเภทของการลดหนี้: </div>
            <div className="pdf-remark-subtitle">
              {debitNoteData.debit_note_reason}
            </div>
          </div>
          <PdfRemark remark={debitNoteData.debitNote_remark} />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <PdfSummary summary={debitNoteData} />
        </Grid>
      </Grid>
      <Divider sx={{ borderBottomWidth: 1, borderColor: "#9F9F9F" }} />
      <div className="pdf-payment-done">ช่องทางการชำระเงิน</div>
      <div className="pdf-payment-grid" style={{ width: "50%" }}>
        <div className="pdf-payment-subtitle1">
          <div>ประเภทช่องทางการเงิน</div>
          <div>ธนาคารผู้ออกเช็ค</div>
          <div>เลขที่เช็ค</div>
          <div>เลขที่สาขา</div>
          <div>เลขที่บัญชี</div>
          <div>ลงวันที่</div>
          <div>จำนวนเงิน</div>
        </div>
        <div className="pdf-payment-subtitle2">
          <div>ประเภทช่องทางการเงิน</div>
          <div>ธนาคารผู้ออกเช็ค</div>
          <div>เลขที่เช็ค</div>
          <div>เลขที่สาขา</div>
          <div>เลขที่บัญชี</div>
          <div>ลงวันที่</div>
          <div>จำนวนเงิน</div>
        </div>
      </div>
      <div className="pdf-signature-sales-order-wrapper">
        <div className="pdf-signature-sales-order-left">
          <div className="pdf-signature-left-title">
            <div className="pdf-signature-line">_________________</div>
            <div className="pdf-signature-date">_____/_____/_____</div>
            <div className="pdf-signature-left-subtitle">
              ผู้ออกเอกสาร (Issueed By)
            </div>
          </div>
          <div className="pdf-signature-left-title">
            <div className="pdf-signature-line">_________________</div>
            <div className="pdf-signature-date">_____/_____/_____</div>
            <div className="pdf-signature-left-subtitle">
              ผู้มีอำนาจ (Authorized)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
