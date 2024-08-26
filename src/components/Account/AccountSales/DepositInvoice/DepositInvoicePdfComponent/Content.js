import { Divider, Grid } from "@mui/material";
import PdfHeading from "../../../AccountPdfComponent/PdfHeading";
import SalesPaymentTable from "../../../AccountPdfComponent/PdfSalesTable/SalesPaymentTable";
import PdfRemark from "../../../AccountPdfComponent/PdfRemark";
import { checkAddress } from "../../../../../adapter/Utils";

const Content = ({ depositInvoice, isLoading }) => {
  const billingInfo = depositInvoice.billing_info;
  const checkBillingInfo = depositInvoice.billing_info;
  let formatAddress = checkAddress(checkBillingInfo);

  const formatLeftInfo = [
    billingInfo.contact_name ? billingInfo.contact_name : "-",
    billingInfo.tax_no ? billingInfo.tax_no : "-",
    depositInvoice.deposit_invoice_issue_date
      ? depositInvoice.deposit_invoice_issue_date
      : "-",
  ];

  const formatRightInfo = [
    depositInvoice.sales_invoice_document_id
      ? depositInvoice.sales_invoice_document_id
      : "-",
    formatAddress,
  ];

  function toLocale(number) {
    return parseFloat(number).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  const vatRender = (vat) => {
    if (vat === "ZERO") return vat;
    if (vat === "SEVEN") return vat * 1.07;
    return 0;
  };

  // const vatTotal = (vat) => {
  //   if (vat === 'ZERO') return vat
  //   if (vat === 'SEVEN') return vat * 1.07
  //   return vat
  // }

  return (
    <div>
      <PdfHeading
        type="sales"
        stage="depositInvoice"
        isLoading={isLoading}
        formatLeftInfo={formatLeftInfo}
        formatRightInfo={formatRightInfo}
      />
      <Divider sx={{ borderBottomWidth: 1, borderColor: "#9F9F9F" }} />
      <SalesPaymentTable data={depositInvoice} type="depositInvoice" />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <PdfRemark
            remark={
              depositInvoice.deposit_invoice_remark
                ? depositInvoice.deposit_invoice_remark
                : "-"
            }
          />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <div className="pdf-summary-container">
            <div className="pdf-summary-title">
              <div>ภาษี / VAT</div>
              <div>
                {vatRender(
                  toLocale(depositInvoice.deposit_invoice_data.pre_vat_amount)
                )}
              </div>
              <div>บาท</div>
            </div>
            <div className="pdf-summary-title">
              <div>ยอดรวมสุทธิ / Net amount</div>
              <div>{toLocale(depositInvoice.total_amount)}</div>
              <div>บาท</div>
            </div>
            <hr style={{ position: "absolute", width: "90%", right: "0" }} />
            <div className="pdf-summary-title">
              <div>จำนวนเงินรวมทั้งสิ้น (บาท) / Total Amount</div>
              <div>{toLocale(depositInvoice.total_amount)}</div>
              <div>บาท</div>
            </div>
            <hr style={{ position: "absolute", width: "90%", right: "0" }} />
            <hr
              style={{
                position: "absolute",
                width: "90%",
                right: "0",
                marginTop: "2px",
              }}
            />
          </div>
        </Grid>
      </Grid>
      <Divider sx={{ borderBottomWidth: 1, borderColor: "#9F9F9F" }} />
      <div className="pdf-signature-billing-note-wrapper">
        <div className="pdf-signature-billing-note-left">
          <div className="pdf-signature-left-title">
            <div className="pdf-signature-line">_________________</div>
            <div className="pdf-signature-date">_____/_____/_____</div>
            <div className="pdf-signature-left-subtitle">
              ผู้รับเงิน / (Bill collector)
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
