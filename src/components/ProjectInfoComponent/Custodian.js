import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CardAddCustodianComponent from "../CardComponent/CardAddCustodianComponent";
import CardProjectCustodianComponent from "../CardComponent/CardProjectCustodianComponent";

export default function Custodian(props) {
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
            รายชื่อผู้รับผิดชอบ
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div
              className="grid-container-33"
              style={{ overflow: "auto", padding: "10px" }}
            >
              {props.values.project_employee_list &&
                props.values.project_employee_list.map((val, index) => {
                  return (
                    <CardProjectCustodianComponent
                      key={`${val.value} + ${index}`}
                      ID={index}
                      values={props.values}
                      setFieldValue={props.setFieldValue}
                      employeeList={props.employeeList}
                    />
                  );
                })}
              <CardAddCustodianComponent
                values={props.values}
                errors={props.errors}
                touched={props.touched}
                handleChange={props.handleChange}
                setErrors={props.setErrors}
                setFieldValue={props.setFieldValue}
                employeeList={props.employeeList}
              />
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
