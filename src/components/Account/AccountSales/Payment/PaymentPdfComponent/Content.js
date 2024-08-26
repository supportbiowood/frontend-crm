import { Divider, Grid } from '@mui/material'
import PdfHeading from '../../../AccountPdfComponent/PdfHeading'
import SalesPaymentTable from '../../../AccountPdfComponent/PdfSalesTable/SalesPaymentTable'
import { checkAddress } from '../../../../../adapter/Utils'

const Content = ({ paymentReceipt, isLoading }) => {
  const billingInfo = paymentReceipt.billing_info
  const checkBillingInfo = paymentReceipt.billing_info
  let formatAddress = checkAddress(checkBillingInfo)

  const formatLeftInfo = [
    billingInfo.project_id ? billingInfo.project_id : '-',
    billingInfo.project_name ? billingInfo.project_name : '-',
    billingInfo.contact_name ? billingInfo.contact_name : '-',
    billingInfo.tax_no ? billingInfo.tax_no : '-',
    paymentReceipt.payment_receipt_issue_date
  ]

  const formatRightInfo = [
    paymentReceipt.payment_receipt_document_id ? billingInfo.payment_receipt_document_id : '-',
    paymentReceipt.ref_document_id ? paymentReceipt.ref_document_id : '-',
    formatAddress
  ]

  function toLocale(number) {
    if (!isNaN(number))
      return parseFloat(number).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
  }

  return (
    <div>
      <PdfHeading
        type="sales"
        stage="paymentReceipt"
        isLoading={isLoading}
        formatLeftInfo={formatLeftInfo}
        formatRightInfo={formatRightInfo}
      />
      <Divider sx={{ borderBottomWidth: 1, borderColor: '#9F9F9F' }} />
      <SalesPaymentTable data={paymentReceipt} type="paymentReceipt" />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <div className="pdf-payment-title">ช่องทางการชำระเงิน</div>
          <div className="pdf-payment-grid">
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
              {paymentReceipt.payment_receipt_data.map((item, itemIndex) => {
                return (
                  <div key={itemIndex}>
                    <div>{paymentReceipt.payment_channel_type}</div>
                    <div>ธนาคารผู้ออกเช็ค</div>
                    <div>เลขที่เช็ค</div>
                    <div>เลขที่สาขา</div>
                    <div>เลขที่บัญชี</div>
                    <div>{paymentReceipt.payment_date}</div>
                    <div>{toLocale(paymentReceipt.total_amount)}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}></Grid>
      </Grid>
      <Divider sx={{ borderBottomWidth: 1, borderColor: '#9F9F9F' }} />
      <div className="pdf-payment-done">การชำระเงินด้วยเช็คจะสมบูรณ์เมื่อบริษัทฯได้รับเงินตามเช็คเรียบร้อยแล้ว</div>
      <div className="pdf-payment-done">This receipt will be valid only when the cheque has been honoured by bank</div>
      <div className="pdf-signature-payment-receipt-wrapper">
        <div className="pdf-signature-payment-receipt-left">
          <div className="pdf-signature-left-title">
            <div className="pdf-signature-line">_________________</div>
            <div className="pdf-signature-date">_____/_____/_____</div>
            <div className="pdf-signature-left-subtitle">ผู้รับเงิน / (Bill collector)</div>
          </div>
          <div className="pdf-signature-left-title">
            <div className="pdf-signature-line">_________________</div>
            <div className="pdf-signature-date">_____/_____/_____</div>
            <div className="pdf-signature-left-subtitle">ผู้มีอำนาจ (Authorized)</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Content
