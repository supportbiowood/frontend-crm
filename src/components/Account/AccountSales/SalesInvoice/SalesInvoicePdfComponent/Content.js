import { Divider, Grid } from "@mui/material";
import PdfHeading from "../../../AccountPdfComponent/PdfHeading";
import SalesItemTable from "../../../AccountPdfComponent/PdfSalesTable/SalesItemTable";
import PdfRemark from "../../../AccountPdfComponent/PdfRemark";
import PdfSummary from "../../../AccountPdfComponent/PdfSummary";
import { checkAddress } from "../../../../../adapter/Utils";

const Content = ({ salesInvoiceData, isLoading }) => {
  const billingInfo = salesInvoiceData.billing_info;
  let formatAddress = checkAddress(billingInfo);
  const formatSaleList =
    salesInvoiceData.sale_list[0].employee_firstname +
    " " +
    salesInvoiceData.sale_list[0].employee_lastname;

  const formatLeftInfo = [
    billingInfo.project_id ? billingInfo.project_id : "-",
    billingInfo.project_name ? billingInfo.project_name : "-",
    billingInfo.contact_name ? billingInfo.contact_name : "-",
    billingInfo.tax_no ? billingInfo.tax_no : "-",
    billingInfo.email ? billingInfo.email : "-",
    salesInvoiceData.sales_invoice_issue_date,
    salesInvoiceData.sales_invoice_due_date,
  ];

  const formatRightInfo = [
    salesInvoiceData.sales_invoice_document_id,
    salesInvoiceData.sales_order_document_id,
    formatSaleList,
    billingInfo.phone ? billingInfo.phone : "-",
    billingInfo.fax ? billingInfo.fax : "-",
    formatAddress,
  ];

  return (
    <div>
      <PdfHeading
        type="sales"
        stage="salesInvoice"
        isLoading={isLoading}
        formatLeftInfo={formatLeftInfo}
        formatRightInfo={formatRightInfo}
      />
      <Divider sx={{ borderBottomWidth: 1, borderColor: "#9F9F9F" }} />
      <SalesItemTable data={salesInvoiceData.sales_invoice_data} />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <PdfRemark remark={salesInvoiceData.sales_invoice_remark} />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <PdfSummary summary={salesInvoiceData} />
        </Grid>
      </Grid>
      <Divider sx={{ borderBottomWidth: 1, borderColor: "#9F9F9F" }} />
      <div className="pdf-signature-sales-invoice-wrapper">
        <div className="pdf-signature-sales-invoice-left">
          <div className="pdf-signature-left-title">
            <div className="pdf-signature-line">_________________</div>
            <div className="pdf-signature-date">_____/_____/_____</div>
            <div className="pdf-signature-left-subtitle">
              ผู้รับของ (Received By)
            </div>
          </div>
          <div className="pdf-signature-left-title">
            <div className="pdf-signature-line">_________________</div>
            <div className="pdf-signature-date">_____/_____/_____</div>
            <div className="pdf-signature-left-subtitle">
              ผู้ส่งสินค้า (Delivered By)
            </div>
          </div>
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
              ผู้ตรวจสอบ (Checked By)
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
