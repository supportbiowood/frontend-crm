import React, { useRef, useEffect, useState } from 'react'
import { Backdrop, Button, CircularProgress } from '@mui/material'
import { getReceiptById } from '../../../../../adapter/Api'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { useReactToPrint } from 'react-to-print'
import Content from './Content'

export default function PaymentPdfComponent() {
  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  })
  const [paymentReceipt, setPaymentReceipt] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { id } = useParams()

  useEffect(() => {
    setIsLoading(true)
    getReceiptById(id)
      .then((data) => {
        let myData = data.data.data
        console.log('myData: ', myData)
        const formatData = {
          ...myData,
          payment_receipt_issue_date: moment.unix(myData.payment_receipt_issue_date).format('DD/MM/YYYY'),
          payment_date: moment.unix(myData.payment_date).format('DD/MM/YYYY'),
        }
        setPaymentReceipt(formatData)
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
          <h2>ใบเสร็จรับเงิน</h2>
          <div>เลขที่เอกสาร {paymentReceipt.payment_receipt_document_id}</div>
        </div>
        <div className="account__buttonContainer">
          <Button variant="outlined" onClick={handlePrint}>
            พิมพ์เอกสาร
          </Button>
        </div>
      </div>
      <div ref={componentRef} className="printPdf">
        <div className="customPdf">{!isLoading && <Content paymentReceipt={paymentReceipt} isLoading={isLoading} />}</div>
      </div>
    </>
  )
}
