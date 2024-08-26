import React from "react";
import ModalAddCustodianComponent from "../ModalComponent/ModalAddCustodianComponent";

export default function CardAddCustodianComponent(props) {
  return (
    <div className="card-contact">
      <div className="container">
        <div className="left-side">
          <div className="image-preview">
            <img className="image-user" src={props.image} alt="" srcSet="" />
          </div>
        </div>
        <div className="right-side">
          <div className="topic">
            <h4>{props.owner}</h4>
          </div>
          <div>
            <ModalAddCustodianComponent
              values={props.values}
              errors={props.errors}
              touched={props.touched}
              handleChange={props.handleChange}
              setErrors={props.setErrors}
              setFieldValue={props.setFieldValue}
              employeeList={props.employeeList}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
