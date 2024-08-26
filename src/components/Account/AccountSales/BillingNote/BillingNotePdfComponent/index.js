import React, { useRef, useEffect, useState } from 'react'
import { Backdrop, Button, CircularProgress } from '@mui/material'
import { getBillingNoteById } from '../../../../../adapter/Api'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { useReactToPrint } from 'react-to-print'
import Content from './Content'

export default function BillingNotePdfComponent() {
  const componentRef = useRef()
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  })
  const [billingNote, setBillingNote] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { id } = useParams()

  useEffect(() => {
    setIsLoading(true)
    getBillingNoteById(id)
      .then((data) => {
        let myData = data.data.data
        console.log('myData: ', myData)
        const formatData = {
          ...myData,
          billing_note_issue_date: moment.unix(myData.billing_note_issue_date).format('DD/MM/YYYY'),
          billing_note_due_date: moment.unix(myData.billing_note_due_date).format('DD/MM/YYYY')
        }
        setBillingNote(formatData)
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
          <h2>ใบวางบิล</h2>
          <div>เลขที่เอกสาร {billingNote.billing_note_document_id}</div>
        </div>
        <div className="account__buttonContainer">
          <Button variant="outlined" onClick={handlePrint}>
            พิมพ์เอกสาร
          </Button>
        </div>
      </div>
      <div ref={componentRef} className="printPdf">
        <div className="customPdf">{!isLoading && <Content billingNote={billingNote} isLoading={isLoading} />}</div>
      </div>
    </>
  )
}
