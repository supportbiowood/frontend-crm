import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import moment from "moment";
import "moment-timezone";
import { Link } from "react-router-dom";

export default function ProjectRelated(props) {
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
          aria-controls="panel1a-content"
          id="panela-header"
        >
          <h2>โครงการที่เกี่ยวข้อง</h2>
        </AccordionSummary>
        <AccordionDetails>
          <div className="grid-container-25">
            {props.values.project_list &&
            props.values.project_list.length !== 0 ? (
              props.values.project_list.map((val, index) => {
                return (
                  <Link to={`/sales/project/${val.project_id}`}>
                    <div className="badge__subcard-info-normal">
                      <p className="badge__card-header">{val.project_name}</p>
                      <p>ลูกค้า: {val.project_billing_individual_first_name}</p>
                      <p>
                        มูลค่า: {val.project_deal_value.toLocaleString("en-US")}
                      </p>
                      <p>ลักษณะงาน: {val.project_category}</p>
                      <p>
                        พนักงานขาย:{" "}
                        {val.employee_owner &&
                          val.employee_owner.employee_firstname}{" "}
                        {val.employee_owner &&
                          val.employee_owner.employee_lastname}
                      </p>
                      <p className="badge__subcard-info-lastupdate">
                        อัพเดทล่าสุด{" "}
                        {val._project_lastupdate
                          ? moment(val._project_lastupdate, "X")
                              .tz("Asia/Bangkok")
                              .format("MM/DD/YYYY, HH:MM")
                          : "-"}
                      </p>
                    </div>
                  </Link>
                );
              })
            ) : (
              <h3>ไม่มีโครงการที่เกี่ยวข้อง</h3>
            )}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
