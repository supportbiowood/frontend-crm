import { Divider, Grid } from '@mui/material'
import PdfHeading from '../../../AccountPdfComponent/PdfHeading'
import SalesPaymentTable from '../../../AccountPdfComponent/PdfSalesTable/SalesPaymentTable'
import PdfRemark from '../../../AccountPdfComponent/PdfRemark'
import { checkAddress } from '../../../../../adapter/Utils'

const Content = ({ deliveryOrder, isLoading }) => {
  const billingInfo = deliveryOrder.billing_info
  const checkBillingInfo = deliveryOrder.billing_info
  let formatAddress = checkAddress(checkBillingInfo)

  const formatLeftInfo = [
    billingInfo.contact_name ? billingInfo.contact_name : '-',
    billingInfo.tax_no ? billingInfo.tax_no : '-',
    billingInfo.email ? billingInfo.email : '-',
    deliveryOrder.delivery_note_issue_date
  ]

  const formatRightInfo = [
    deliveryOrder.delivery_note_document_id ? billingInfo.delivery_note_document_id : '-',
    deliveryOrder.sales_order_document_id_list.length > 0 ? deliveryOrder.sales_order_document_id_list.join(', ') : '-',
    billingInfo.phone ? billingInfo.phone : '-',
    formatAddress
  ]

  return (
    <div>
      <PdfHeading
        type="sales"
        stage="deliveryOrder"
        isLoading={isLoading}
        formatLeftInfo={formatLeftInfo}
        formatRightInfo={formatRightInfo}
      />
      <Divider sx={{ borderBottomWidth: 1, borderColor: '#9F9F9F' }} />
      <SalesPaymentTable data={deliveryOrder} type="deliveryOrder" />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <PdfRemark remark={deliveryOrder.delivery_note_remark ? deliveryOrder.delivery_note_remark : '-'} />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}></Grid>
      </Grid>
      <Divider sx={{ borderBottomWidth: 1, borderColor: '#9F9F9F' }} />
      <div className="pdf-payment-done">ได้รับสินค้าหรือบริการดังกล่าวไว้ถูกต้องในสภาพเรียบร้อยแล้ว</div>
      <div className="pdf-signature-billing-note-wrapper">
        <div className="pdf-signature-delivery-order">
          <div className="pdf-signature-left-title">
            <div className="pdf-signature-line">_________________</div>
            <div className="pdf-signature-date">_____/_____/_____</div>
            <div className="pdf-signature-left-subtitle">ผู้รับของ (Received By)</div>
          </div>
          <div className="pdf-signature-left-title">
            <div className="pdf-signature-line">_________________</div>
            <div className="pdf-signature-date">_____/_____/_____</div>
            <div className="pdf-signature-left-subtitle">ผู้ส่งสินค้า (Delivered By)</div>
          </div>
          <div className="pdf-signature-left-title">
            <div className="pdf-signature-line">_________________</div>
            <div className="pdf-signature-date">_____/_____/_____</div>
            <div className="pdf-signature-left-subtitle">ผู้ออกเอกสาร (Issueed By)</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Content
