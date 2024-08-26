import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CardAddPersonComponent from "../CardComponent/CardAddPersonComponent";
import CardPersonComponent from "../CardComponent/CardPersonComponent";

export default function ContactName(props) {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div>
      <Accordion
        style={{ padding: "24px", marginBottom: "24px" }}
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <h2>รายชื่อบุคคลติดต่อ</h2>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <div className="grid-container-33">
              {props.values.person_list?.map((val, index) => {
                return (
                  <CardPersonComponent
                    key={`${val.value} + ${index}`}
                    ID={index}
                    values={props.values}
                    errors={props.errors}
                    touched={props.touched}
                    handleChange={props.handleChange}
                    setErrors={props.setErrors}
                    setFieldValue={props.setFieldValue}
                  />
                );
              })}
              <CardAddPersonComponent
                owner="-"
                contact="__"
                values={props.values}
                errors={props.errors}
                touched={props.touched}
                handleChange={props.handleChange}
                setErrors={props.setErrors}
                setFieldValue={props.setFieldValue}
              />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
