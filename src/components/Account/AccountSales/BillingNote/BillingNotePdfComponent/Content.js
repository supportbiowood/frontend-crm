import { Divider, Grid } from '@mui/material'
import PdfHeading from '../../../AccountPdfComponent/PdfHeading'
import SalesPaymentTable from '../../../AccountPdfComponent/PdfSalesTable/SalesPaymentTable'
import PdfRemark from '../../../AccountPdfComponent/PdfRemark'
import { checkAddress } from '../../../../../adapter/Utils'

const Content = ({ billingNote, isLoading }) => {
  console.log('billingNote: ', billingNote)
  const billingInfo = billingNote.billing_info
  const checkBillingInfo = billingNote.billing_info
  let formatAddress = checkAddress(checkBillingInfo)

  const creditNoteProjectId = billingNote.sales_invoice_project_list.map((data) => {
    return data.project_id ? data.project_id : '-'
  })

  const creditNoteProjectName = billingNote.sales_invoice_project_list.map((data) => {
    return data.project_name ? data.project_name : '-'
  })

  const formatLeftInfo = [
    creditNoteProjectId ? creditNoteProjectId : '-',
    creditNoteProjectName ? creditNoteProjectName : '-',
    billingInfo.contact_name ? billingInfo.contact_name : '-',
    billingInfo.tax_no ? billingInfo.tax_no : '-',
    billingNote.billing_note_issue_date,
    billingNote.billing_note_due_date
  ]

  const formatRightInfo = [billingNote.billing_note_document_id, formatAddress]

  return (
    <div>
      <PdfHeading
        type="sales"
        stage="billingNote"
        isLoading={isLoading}
        formatLeftInfo={formatLeftInfo}
        formatRightInfo={formatRightInfo}
      />
      <Divider sx={{ borderBottomWidth: 1, borderColor: '#9F9F9F' }} />
      <SalesPaymentTable data={billingNote} type="billingNote" />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <div className="pdf-payment-title">โปรดจ่ายเช็คในนาม บริษัท จีอาร์เอ็ม(ประเทศไทย) จำกัด</div>
          <PdfRemark remark={billingNote.billingNote_remark ? billingNote.billingNote_remark : '-'} />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          {/* <AccountSummaryComponent
            summary
            disabled
            data={billingNote.quotation_data}
            tableType="sale"
          /> */}
        </Grid>
      </Grid>
      <Divider sx={{ borderBottomWidth: 1, borderColor: '#9F9F9F' }} />
      <div className="pdf-signature-billing-note-wrapper">
          <div className="pdf-signature-left-title">
            <div className="pdf-signature-line">_________________</div>
            <div className="pdf-signature-date">_____/_____/_____</div>
            <div className="pdf-signature-left-subtitle">ผู้รับวางบิล (Accepted by)</div>
          </div>
      </div>
    </div>
  )
}

export default Content
