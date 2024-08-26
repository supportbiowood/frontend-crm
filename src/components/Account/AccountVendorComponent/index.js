import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import PurchaseForm from "./PurchaseForm";
import CombinedPaymentContactForm from "./CombinedPaymentContactForm";

export default function AccountVendorComponent({
  disabled,
  formik,
  contacts,
  contactId,
  accountPurchase,
  combinedPaymentContact,
}) {
  const [expanded, setExpanded] = useState("panel1");

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
          <Typography component="div">
            <h4>รายละเอียดผู้ขาย</h4>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {accountPurchase && (
            <PurchaseForm
              disabled={disabled}
              formik={formik}
              contacts={contacts}
              contactId={contactId}
            />
          )}
          {combinedPaymentContact && (
            <CombinedPaymentContactForm formik={formik} contacts={contacts} />
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
