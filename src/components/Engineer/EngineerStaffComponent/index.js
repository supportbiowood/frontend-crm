import React, { useState } from "react";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails } from "@mui/material";
import Form from "./Form";

export default function EngineerStaffComponent({ disabled, formik, error }) {
  const [expanded, setExpanded] = useState("panel1");

  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
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
        <h4>ผู้รับผิดชอบ</h4>
      </AccordionSummary>
      <AccordionDetails>
        <Form disabled={disabled} formik={formik} errorFromFormik={error} />
      </AccordionDetails>
    </Accordion>
  );
}
