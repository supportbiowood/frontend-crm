import React, { useRef, useEffect, useState } from 'react'
import { Backdrop, Button, CircularProgress } from '@mui/material'
import { getSalesOrderById } from '../../../../../adapter/Api'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { useReactToPrint } from 'react-to-print'
import Content from './Content'

export default function SalesOrderPdfComponent() {
  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  })
  const [salesOrderData, setsalesOrderData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { id } = useParams()
  console.log('params:', id)

  useEffect(() => {
    getSalesOrderById(id)
      .then((data) => {
        let myData = data.data.data
        const formatData = {
          ...myData,
          sales_order_issue_date: moment.unix(myData.sales_order_issue_date).format('DD/MM/YYYY'),
          sales_order_due_date: moment.unix(myData.sales_order_due_date).format('DD/MM/YYYY'),
          sales_order_expect_date: moment.unix(myData.sales_order_expect_date).format('DD/MM/YYYY')
        }
        setsalesOrderData(formatData)
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
          <h2>ใบสั่งขาย/Sale Order</h2>
          <div>เลขที่เอกสาร {salesOrderData.sales_order_document_id}</div>
        </div>
        <div className="account__buttonContainer">
          <Button variant="outlined" onClick={handlePrint}>
            พิมพ์เอกสาร
          </Button>
        </div>
      </div>
      <div ref={componentRef} className="printPdf">
        <div className="customPdf">
          {!isLoading && <Content salesOrderData={salesOrderData} isLoading={isLoading} />}
        </div>
      </div>
    </>
  )
}
