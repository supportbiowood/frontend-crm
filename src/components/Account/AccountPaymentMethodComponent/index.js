import React, { useState } from "react";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails } from "@mui/material";
import PaymentReceipt from "./PaymentReceipt";
import CreditNotePayment from "./CreditNotePayment";
import DebitNotePayment from "./DebitNotePayment";

export default function AccountPaymentMethodComponent({
  disabled,
  formik,
  allPaymentChannel,
  billingNote,
  creditNote,
  debitNote,
  error,
}) {
  const [expanded, setExpanded] = useState("panel1");
  const handleChange = (panel) => (_, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <div>
      {creditNote && (
        <CreditNotePayment
          formik={formik}
          disabled={disabled}
          allPaymentChannel={allPaymentChannel}
        />
      )}
      {debitNote && (
        <DebitNotePayment
          formik={formik}
          disabled={disabled}
          allPaymentChannel={allPaymentChannel}
        />
      )}
      {!creditNote && !debitNote && (
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
            <h4>ช่องทางการชำระเงิน</h4>
          </AccordionSummary>
          <AccordionDetails>
            <PaymentReceipt
              formik={formik}
              disabled={disabled}
              allPaymentChannel={allPaymentChannel}
              billingNote={billingNote}
              error={error}
            />
          </AccordionDetails>
        </Accordion>
      )}
    </div>
  );
}
