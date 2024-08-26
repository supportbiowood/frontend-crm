import React from 'react'
import ModalAddPersonComponent from '../ModalComponent/ModalAddPersonComponent'

export default function CardAddPersonComponent(props) {
  return (
    <div className="card-contact">
      <div className="container">
        <div>
          <div className="image-preview">
          </div>
        </div>
        <div className="right-side">
          <div className="topic-addbank">
            <h4>{props.owner}</h4>
          </div>
          <div>
            <ModalAddPersonComponent
              values={props.values}
              errors={props.errors}
              touched={props.touched}
              handleChange={props.handleChange}
              setErrors={props.setErrors}
              setFieldValue={props.setFieldValue}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
