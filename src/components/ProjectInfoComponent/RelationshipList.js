import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CardAddRelationshipComponent from "../CardComponent/CardAddRelationshipComponent";
import CardProjectRelationshipComponent from "../CardComponent/CardProjectRelationshipComponent";

export default function ContactName(props) {
  const [expanded, setExpanded] = useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
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
          <Typography
            sx={{
              width: "33%",
              flexShrink: 0,
              fontWeight: "bold",
              fontSize: "24px",
              lineHeight: "28px",
              whiteSpace: "nowrap",
            }}
          >
            ผู้เกี่ยวข้องในโครงการ
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div>
              <CardAddRelationshipComponent
                contact={props.contact}
                values={props.values}
                errors={props.errors}
                touched={props.touched}
                handleChange={props.handleChange}
                setErrors={props.setErrors}
                setFieldValue={props.setFieldValue}
                setContact={props.setContact}
                optionContacts={props.optionContacts}
                optionPersons={props.optionPersons}
                setOptionContacts={props.setOptionContacts}
                setOptionPersons={props.setOptionPersons}
              />
            </div>
            <div className="grid-container-33">
              {props.values.project_contact_list?.map((val, index) => {
                return (
                  <>
                    <CardProjectRelationshipComponent
                      key={`${val.value} + ${index}`}
                      ID={index}
                      myContact={val}
                      values={props.values}
                      setFieldValue={props.setFieldValue}
                    />
                  </>
                );
              })}
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
