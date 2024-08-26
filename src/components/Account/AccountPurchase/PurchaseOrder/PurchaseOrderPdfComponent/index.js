import React, { useRef, useEffect, useState } from 'react'
import { Backdrop, Button, CircularProgress } from '@mui/material'
import { getPurchaseOrderById } from '../../../../../adapter/Api'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { useReactToPrint } from 'react-to-print'
import Content from './Content'

export default function PurchaseOrderPdfComponent() {
  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  })
  const [purchaseOrderData, setPurchaseOrderData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { id } = useParams()
  console.log('params:', id)

  useEffect(() => {
    getPurchaseOrderById(id)
      .then((data) => {
        let myData = data.data.data
        const formatData = {
          ...myData,
          purchase_order_issue_date: moment.unix(myData.purchase_order_issue_date).format('DD/MM/YYYY'),
          purchase_order_due_date: moment.unix(myData.purchase_order_due_date).format('DD/MM/YYYY'),
          purchase_order_expect_date: moment.unix(myData.purchase_order_expect_date).format('DD/MM/YYYY')
        }
        setPurchaseOrderData(formatData)
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
          <h2>ใบสั่งซื้อ/Purchase Order</h2>
          <div>เลขที่เอกสาร {purchaseOrderData.purchase_order_document_id}</div>
        </div>
        <div className="account__buttonContainer">
          <Button variant="outlined" onClick={handlePrint}>
            พิมพ์เอกสาร
          </Button>
        </div>
      </div>
      <div ref={componentRef} className="printPdf">
        <div className="customPdf">
          {!isLoading && <Content purchaseOrderData={purchaseOrderData} isLoading={isLoading} />}
        </div>
      </div>
    </>
  )
}
