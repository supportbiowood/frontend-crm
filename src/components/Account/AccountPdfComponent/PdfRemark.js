import React from 'react'

const PdfRemark = ({ remark }) => {
  return (
    <>
      <div className="pdf-remark-title">หมายเหตุ/Note: </div>
      <div className="pdf-remark-subtitle">{remark}</div>
    </>
  )
}

export default PdfRemark
