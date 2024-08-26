import { Divider, Grid } from '@mui/material'
import PdfHeading from '../../../AccountPdfComponent/PdfHeading'
import PurchasePaymentTable from '../../../AccountPdfComponent/PdfPurchaseTable/PurchasePaymentTable'
import PdfRemark from '../../../AccountPdfComponent/PdfRemark'

const Content = ({ combinedPaymentData, isLoading }) => {
  console.log('combinedPaymentData: ', combinedPaymentData)
  let formatLeftInfo = []
  let formatRightInfo = []

  if (!isLoading) {
    const vendorInfo = combinedPaymentData.vendor_info
    const formatAddress = `${vendorInfo.house_no} ${vendorInfo.building} ${vendorInfo.sub_district} ${vendorInfo.road} ${vendorInfo.district} ${vendorInfo.province} ${vendorInfo.postal_code} ${vendorInfo.country}`

    formatLeftInfo = [
      vendorInfo.contact_name ? vendorInfo.contact_name : '-',
      vendorInfo.tax_no ? vendorInfo.tax_no : '-',
      vendorInfo.phone ? vendorInfo.phone : '-',
      vendorInfo.email ? vendorInfo.email : '-',
      combinedPaymentData.combined_payment_issue_date,
      combinedPaymentData.combined_payment_due_date
    ]

    formatRightInfo = [combinedPaymentData.combined_payment_document_id, formatAddress]
  }

  return (
    <div>
      <PdfHeading
        type="purchase"
        stage="combinedPayment"
        isLoading={isLoading}
        formatLeftInfo={formatLeftInfo}
        formatRightInfo={formatRightInfo}
      />
      <Divider sx={{ borderBottomWidth: 1, borderColor: '#9F9F9F' }} />
      <PurchasePaymentTable data={combinedPaymentData} type="combinedPayment" />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <PdfRemark remark={combinedPaymentData.purchase_order_remark} />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}></Grid>
      </Grid>
      <Divider sx={{ borderBottomWidth: 1, borderColor: '#9F9F9F' }} />
      <div className="pdf-signature-sales-order-wrapper">
        <div className="pdf-signature-left-title">
          <div className="pdf-signature-line">_________________</div>
          <div className="pdf-signature-date">_____/_____/_____</div>
          <div className="pdf-signature-left-subtitle">ผู้วางบิล (Accepted by)</div>
        </div>
      </div>
    </div>
  )
}

export default Content
