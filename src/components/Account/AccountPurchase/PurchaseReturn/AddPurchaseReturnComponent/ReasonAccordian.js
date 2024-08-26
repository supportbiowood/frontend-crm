import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useState } from "react";

const ReasonAccordian = ({ formik, disabled }) => {
  const [expanded, setExpanded] = useState("panel1");

  const handleChange = (panel) => (_, isExpanded) => {
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
          <Typography component="div">
            <h4>เหตุผลการคืนของ</h4>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
              <TextField
                autoComplete="off"
                type="text"
                id="purchase_return_reason"
                name="purchase_return_reason"
                value={formik.values.purchase_return_reason}
                onChange={formik.handleChange}
                disabled={disabled}
                size="small"
                label="เหตุผลการคืนของ"
                fullWidth
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default ReasonAccordian;
