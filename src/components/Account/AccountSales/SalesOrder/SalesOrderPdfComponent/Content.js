import { Divider, Grid } from "@mui/material";
import PdfHeading from "../../../AccountPdfComponent/PdfHeading";
import SalesItemTable from "../../../AccountPdfComponent/PdfSalesTable/SalesItemTable";
import PdfRemark from "../../../AccountPdfComponent/PdfRemark";
import PdfSummary from "../../../AccountPdfComponent/PdfSummary";
import { checkAddress } from "../../../../../adapter/Utils";

const Content = ({ salesOrderData, isLoading }) => {
  const billingInfo = salesOrderData.billing_info;
  let formatAddress = checkAddress(billingInfo);
  const formatSaleList =
    salesOrderData.sale_list[0].employee_firstname +
    " " +
    salesOrderData.sale_list[0].employee_lastname;

  const formatLeftInfo = [
    billingInfo.project_id ? billingInfo.project_id : "-",
    billingInfo.project_name ? billingInfo.project_name : "-",
    billingInfo.contact_name ? billingInfo.contact_name : "-",
    billingInfo.tax_no ? billingInfo.tax_no : "-",
    billingInfo.email ? billingInfo.email : "-",
    salesOrderData.sales_order_issue_date,
    salesOrderData.sales_order_due_date,
    salesOrderData.sales_order_expect_date,
  ];

  const formatRightInfo = [
    salesOrderData.sales_order_document_id,
    salesOrderData.quotation_document_id,
    formatSaleList,
    billingInfo.phone ? billingInfo.phone : "-",
    billingInfo.fax ? billingInfo.fax : "-",
    formatAddress,
  ];

  return (
    <div>
      <PdfHeading
        type="sales"
        stage="salesOrder"
        isLoading={isLoading}
        formatLeftInfo={formatLeftInfo}
        formatRightInfo={formatRightInfo}
      />
      <Divider sx={{ borderBottomWidth: 1, borderColor: "#9F9F9F" }} />
      <SalesItemTable data={salesOrderData.sales_order_data} />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <PdfRemark remark={salesOrderData.sales_order_remark} />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <PdfSummary summary={salesOrderData} />
        </Grid>
      </Grid>
      <Divider sx={{ borderBottomWidth: 1, borderColor: "#9F9F9F" }} />
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
