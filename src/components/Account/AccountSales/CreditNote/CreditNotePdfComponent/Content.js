import { Divider, Grid } from "@mui/material";
import PdfHeading from "../../../AccountPdfComponent/PdfHeading";
import SalesItemTable from "../../../AccountPdfComponent/PdfSalesTable/SalesItemTable";
import PdfRemark from "../../../AccountPdfComponent/PdfRemark";
import PdfSummary from "../../../AccountPdfComponent/PdfSummary";
import { checkAddress } from "../../../../../adapter/Utils";

const Content = ({ creditNote, isLoading }) => {
  const billingInfo = creditNote.billing_info;
  const checkBillingInfo = creditNote.billing_info;
  let formatAddress = checkAddress(checkBillingInfo);

  const formatLeftInfo = [
    billingInfo.project_id ? billingInfo.project_id : "-",
    billingInfo.project_name ? billingInfo.project_name : "-",
    billingInfo.contact_name ? billingInfo.contact_name : "-",
    billingInfo.tax_no ? billingInfo.tax_no : "-",
    creditNote.credit_note_issue_date,
  ];

  const formatRightInfo = [
    creditNote.billing_note_document_id
      ? billingInfo.billing_note_document_id
      : "-",
    creditNote.sales_invoice_document_id
      ? creditNote.sales_invoice_document_id
      : "-",
    formatAddress,
  ];

  return (
    <div>
      <PdfHeading
        type="sales"
        stage="creditNote"
        isLoading={isLoading}
        formatLeftInfo={formatLeftInfo}
        formatRightInfo={formatRightInfo}
      />
      <Divider sx={{ borderBottomWidth: 1, borderColor: "#9F9F9F" }} />
      <SalesItemTable data={creditNote.credit_note_data} />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <PdfRemark remark={creditNote.credit_note_remark} />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <PdfSummary summary={creditNote} />
        </Grid>
      </Grid>
      <Divider sx={{ borderBottomWidth: 1, borderColor: "#9F9F9F" }} />
      <div className="pdf-signature-billing-note-wrapper">
        <div className="pdf-signature-billing-note-left">
          <div className="pdf-signature-left-title">
            <div className="pdf-signature-line">_________________</div>
            <div className="pdf-signature-date">_____/_____/_____</div>
            <div className="pdf-signature-left-subtitle">
              ผู้รับใบลดหนี้ (Recipient)
            </div>
          </div>
          <div className="pdf-signature-left-title">
            <div className="pdf-signature-line">_________________</div>
            <div className="pdf-signature-date">_____/_____/_____</div>
            <div className="pdf-signature-left-subtitle">
              อนุมัติโดย (Approved By)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
