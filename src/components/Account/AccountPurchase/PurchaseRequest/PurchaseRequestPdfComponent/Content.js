import { Divider, Grid } from '@mui/material'
import PdfHeading from '../../../AccountPdfComponent/PdfHeading'
import PurchaseItemTable from '../../../AccountPdfComponent/PdfPurchaseTable/PurchaseItemTable'
import PdfRemark from '../../../AccountPdfComponent/PdfRemark'

const Content = ({ purchaseRequestData, isLoading }) => {
  let formatLeftInfo = []
  let formatRightInfo = []

  if (!isLoading) {
    const projectId = purchaseRequestData.sales_order_project_list.map((data) => {
      return data.project_id
    })

    const projectName = purchaseRequestData.sales_order_project_list.map((data) => {
      return data.project_name
    })

    formatLeftInfo = [
      projectId,
      projectName,
      purchaseRequestData.purchase_request_issue_date,
      purchaseRequestData.purchase_request_due_date
    ]

    formatRightInfo = [
      purchaseRequestData.purchase_request_document_id,
      purchaseRequestData.sales_order_document_id_list.join(', ')
    ]
  }

  return (
    <div>
      <PdfHeading
        type="purchase"
        stage="purchaseRequest"
        isLoading={isLoading}
        formatLeftInfo={formatLeftInfo}
        formatRightInfo={formatRightInfo}
      />
      <Divider sx={{ borderBottomWidth: 1, borderColor: '#9F9F9F' }} />
      <PurchaseItemTable data={purchaseRequestData.purchase_request_data} type='purchaseRequest' />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <PdfRemark remark={purchaseRequestData.purchase_request_remark} />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          {/* <AccountSummaryComponent summary disabled data={quotation_data} tableType="sale" /> */}
        </Grid>
      </Grid>
      <Divider sx={{ borderBottomWidth: 1, borderColor: '#9F9F9F' }} />
      <div className="pdf-signature-sales-order-wrapper">
        <div className="pdf-signature-sales-order-left">
          <div className="pdf-signature-left-title">
            <div className="pdf-signature-line">_________________</div>
            <div className="pdf-signature-date">_____/_____/_____</div>
            <div className="pdf-signature-left-subtitle">ผู้ออกเอกสาร (Issueed By)</div>
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
