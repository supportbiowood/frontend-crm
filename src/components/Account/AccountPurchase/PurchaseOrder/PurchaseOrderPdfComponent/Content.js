import { Divider, Grid } from "@mui/material";
import PdfHeading from "../../../AccountPdfComponent/PdfHeading";
import PurchaseItemTable from "../../../AccountPdfComponent/PdfPurchaseTable/PurchaseItemTable";
import PdfRemark from "../../../AccountPdfComponent/PdfRemark";
import PdfSummary from "../../../AccountPdfComponent/PdfSummary";

const Content = ({ purchaseOrderData, isLoading }) => {
  let formatLeftInfo = [];
  let formatRightInfo = [];

  if (!isLoading) {
    const vendorInfo = purchaseOrderData.vendor_info;
    const formatAddress = `${vendorInfo.house_no} ${vendorInfo.building} ${vendorInfo.sub_district} ${vendorInfo.road} ${vendorInfo.district} ${vendorInfo.province} ${vendorInfo.postal_code} ${vendorInfo.country}`;

    formatLeftInfo = [
      vendorInfo.contact_name ? vendorInfo.contact_name : "-",
      vendorInfo.tax_no ? vendorInfo.tax_no : "-",
      vendorInfo.phone ? vendorInfo.phone : "-",
      vendorInfo.email ? vendorInfo.email : "-",
      purchaseOrderData.purchase_order_issue_date,
      purchaseOrderData.purchase_order_due_date,
    ];

    formatRightInfo = [
      purchaseOrderData.purchase_order_document_id,
      purchaseOrderData.purchase_request_document_id_list.join(", "),
      formatAddress,
    ];
  }

  return (
    <div>
      <PdfHeading
        type="purchase"
        stage="purchaseOrder"
        isLoading={isLoading}
        formatLeftInfo={formatLeftInfo}
        formatRightInfo={formatRightInfo}
      />
      <Divider sx={{ borderBottomWidth: 1, borderColor: "#9F9F9F" }} />
      <PurchaseItemTable
        data={purchaseOrderData.purchase_order_data}
        type="purchaseOrder"
      />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <PdfRemark remark={purchaseOrderData.purchase_order_remark} />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <PdfSummary summary={purchaseOrderData} />
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
