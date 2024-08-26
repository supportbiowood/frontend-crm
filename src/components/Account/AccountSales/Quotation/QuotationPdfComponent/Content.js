import { Divider, Grid } from "@mui/material";
import PdfHeading from "../../../AccountPdfComponent/PdfHeading";
import SalesItemTable from "../../../AccountPdfComponent/PdfSalesTable/SalesItemTable";
import PdfRemark from "../../../AccountPdfComponent/PdfRemark";
import PdfSummary from "../../../AccountPdfComponent/PdfSummary";
import { checkAddress } from "../../../../../adapter/Utils";

const Content = ({ quotationData, isLoading }) => {
  const billingInfo = quotationData.billing_info;
  let formatAddress = checkAddress(billingInfo);

  const formatSaleList =
    quotationData.sale_list[0].employee_firstname +
    " " +
    quotationData.sale_list[0].employee_lastname;

  const formatLeftInfo = [
    billingInfo.project_id ? billingInfo.project_id : "-",
    billingInfo.project_name ? billingInfo.project_name : "-",
    billingInfo.contact_name ? billingInfo.contact_name : "-",
    billingInfo.tax_no ? billingInfo.tax_no : "-",
    billingInfo.email ? billingInfo.email : "-",
    quotationData.quotation_issue_date,
    quotationData.quotation_valid_until_date,
  ];

  const formatRightInfo = [
    quotationData.quotation_document_id,
    formatSaleList,
    billingInfo.phone ? billingInfo.phone : "-",
    billingInfo.fax ? billingInfo.fax : "-",
    formatAddress,
  ];

  return (
    <div className="print">
      <PdfHeading
        type="sales"
        stage="quotation"
        isLoading={isLoading}
        formatLeftInfo={formatLeftInfo}
        formatRightInfo={formatRightInfo}
      />
      <Divider sx={{ borderBottomWidth: 1, borderColor: "#9F9F9F" }} />
      <SalesItemTable data={quotationData.quotation_data} />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <PdfRemark remark={quotationData.quotation_remark} />
        </Grid>
        <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
          <PdfSummary summary={quotationData} />
        </Grid>
      </Grid>
      <Divider sx={{ borderBottomWidth: 1, borderColor: "#9F9F9F" }} />
      <div className="pdf-signature-wrapper">
        <div className="pdf-signature-left">
          <div className="pdf-signature-left-title">
            <div className="pdf-signature-line">_________________</div>
            <div className="pdf-signature-date">_____/_____/_____</div>
            <div className="pdf-signature-left-subtitle">
              ลูกค้า(For customer)
            </div>
          </div>
          <div className="pdf-signature-left-title">
            <div className="pdf-signature-line">_________________</div>
            <div className="pdf-signature-date">_____/_____/_____</div>
            <div className="pdf-signature-left-subtitle">ผู้เสนอราคา</div>
          </div>
        </div>
        <Divider
          sx={{ borderColor: "#9F9F9F", margin: "0 10px" }}
          orientation="vertical"
          variant="middle"
          flexItem
        />
        <div className="pdf-signature-right">
          <div className="pdf-signature-right-title">กรุณาโอนเงินเข้าบัญชี</div>
          <div className="pdf-signature-right-subtitle">
            ธ.ไทยพาณิชย์ สาขาประชานิเวศน์ 1 บจก.จีอาร์เอ็ม (ประเทศไทย)
            เลขที่บัญชี 085-247548-5 ออมทรัพย์
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
