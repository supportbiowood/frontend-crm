import React, { useRef, useEffect, useState } from 'react'
import { Backdrop, Button, CircularProgress } from '@mui/material'
import { getSalesInvoiceById } from '../../../../../adapter/Api'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { useReactToPrint } from 'react-to-print'
import Content from './Content'

export default function SalesInvoicePdfComponent() {
  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  })
  const [salesInvoiceData, setsalesInvoiceData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { id } = useParams()
  console.log('params:', id)

  useEffect(() => {
    getSalesInvoiceById(id)
      .then((data) => {
        let myData = data.data.data
        const formatData = {
          ...myData,
          sales_invoice_issue_date: moment.unix(myData.sales_invoice_issue_date).format('DD/MM/YYYY'),
          sales_invoice_due_date: moment.unix(myData.sales_invoice_due_date).format('DD/MM/YYYY')
        }
        setsalesInvoiceData(formatData)
        setIsLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setIsLoading(false)
      })
  }, [id])

  return (
    <>
      {isLoading && (
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <div className="grid-container-50" style={{ marginBottom: '20px' }}>
        <div>
          <h2>ใบแจ้งหนี้/Sale Invoice</h2>
          <div>เลขที่เอกสาร {salesInvoiceData.sales_invoice_document_id}</div>
        </div>
        <div className="account__buttonContainer">
          <Button variant="outlined" onClick={handlePrint}>
            พิมพ์เอกสาร
          </Button>
        </div>
      </div>
      <div ref={componentRef} className="printPdf">
        <div className="customPdf">
          {!isLoading && <Content salesInvoiceData={salesInvoiceData} isLoading={isLoading} />}
        </div>
      </div>
    </>
  )
}
