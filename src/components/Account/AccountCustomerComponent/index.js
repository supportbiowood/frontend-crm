import React, { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import SalesForm from "./SalesForm";
import DeliveryOrderForm from "./DeliveryOrderForm";
import BillingNoteContactForm from "./BillingNoteContactForm";
import BillingNoteForm from "./BillingNoteForm";

export default function AccountCustomerComponent({
  disabled,
  formik,
  projects,
  contacts,
  projectId,
  contactId,
  accountSales,
  deliveryOrder,
  billingNote,
  billingNoteContact,
  allBillingInfo,
  selectedContact,
  error,
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
            <h4>รายละเอียดลูกค้า</h4>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {accountSales && (
            <SalesForm
              disabled={disabled}
              formik={formik}
              projects={projects}
              contacts={contacts}
              projectId={projectId}
              contactId={contactId}
              error={error}
            />
          )}
          {deliveryOrder && (
            <DeliveryOrderForm
              disabled={disabled}
              formik={formik}
              contacts={contacts}
              contactId={contactId}
              error={error}
            />
          )}
          {billingNoteContact && (
            <BillingNoteContactForm
              formik={formik}
              contacts={contacts}
              error={error}
            />
          )}
          {billingNote && (
            <BillingNoteForm
              formik={formik}
              disabled={disabled}
              allBillingInfo={allBillingInfo}
              contacts={contacts}
              contactId={contactId}
              error={error}
              selectedContact={selectedContact}
            />
          )}
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
