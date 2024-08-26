import React from 'react'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import moment from 'moment'
import 'moment-timezone'

const style = {
  small: {
    width: 30,
    height: 30,
  },
  medium: {
    width: 40,
    height: 40,
  },
  large: {
    width: 60,
    height: 60,
  },
}

export default function CardWarrantyAttachment(props) {

  const deleteData = () => {
    if (props.delete) {
      const Clone = [...props.values]
      const deleteValue = Clone.filter((val, index) => {
        return `${props.ID}` !== `${index}`
      })
      props.values = deleteValue
    }
  }

  return (
    <div
      className='attachment-card-container'
      onClick={deleteData}
    >
      <div className="icon">
        <DescriptionOutlinedIcon style={style.medium} />
      </div>
      <div className="right-side">
        <p className="topic">{props.topic}</p>
        {props.values[props.ID]._attachment_created === undefined ?
          null
          :
          <div className="content">
            <div>โดย {props.values[props.ID]._attachment_createdby} </div>
            <div>วันที่ {moment(props.values[props.ID]._attachment_created, 'X').tz('Asia/Bangkok').format('MM/DD/YYYY, HH:mm')}</div>
          </div>
        }
      </div>
    </div>
  )
}