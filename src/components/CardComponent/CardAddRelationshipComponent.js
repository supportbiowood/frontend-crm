import React from "react";
import ModalAddRelationship from "../ModalComponent/ModalAddRelationship";

export default function CardAddRelationshipComponent(props) {
  return (
    <ModalAddRelationship
      contact={props.contact}
      setContact={props.setContact}
      optionContacts={props.optionContacts}
      optionPersons={props.optionPersons}
      setOptionContacts={props.setOptionContacts}
      setOptionPersons={props.setOptionPersons}
      values={props.values}
      errors={props.errors}
      touched={props.touched}
      handleChange={props.handleChange}
      setErrors={props.setErrors}
      setFieldValueProps={props.setFieldValue}
    />
  );
}
