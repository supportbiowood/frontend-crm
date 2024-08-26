import React, { useState } from 'react'
import { TextField } from '@mui/material'
import Accordion from '@mui/material/Accordion'
import { Radio, FormControl, RadioGroup, FormControlLabel, AccordionDetails, AccordionSummary } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export default function BankSave(props) {
  const [expanded, setExpanded] = useState(false)

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  return (
    <div>
      <Accordion
        style={{ padding: '24px', marginBottom: '24px' }}
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
          <h2>
            บันทึกบัญชี
          </h2>
        </AccordionSummary>
        <AccordionDetails>
          <div className="grid-container-50">
            <div className="grid-container-30" style={{ justifyContent: 'center', alignItems: 'center' }}>
              <h3 style={{ paddingLeft: '30%' }}>บันทึกลูกหนี้</h3>
              <TextField
                fullWidth
                disabled
                name="account_receivable.account_description"
                label="รายการบัญชี"
                size="small"
                value={props.values.account_description}
                onChange={(e) => {
                  props.handleChange(e);
                }}
              />
              <h3 style={{ paddingLeft: '30%' }}>บันทึกเจ้าหนี้</h3>
              <TextField
                disabled
                fullWidth
                name="account_payable.account_description"
                label="รายการบัญชี"
                size="small"
                value={props.values.account_description}
                onChange={(e) => {
                  props.handleChange(e);
                }}
              />
            </div>
          </div>
          <h2 style={{ margin: '16px 0px' }}>
            การชำระเงิน
          </h2>
          <div className="grid-container-50" >
            <FormControl component="fieldset" >
              <RadioGroup
                row
                defaultValue="cash"
                aria-label="type"
                name='contact_payment_type'
                value={props.values.contact_payment_type}
                onChange={(event) => {
                  props.handleChange(event)
                }}
              >
                <FormControlLabel value="cash" control={<Radio color="success" />} label="เงินสด" />
                <FormControlLabel value="credit" control={<Radio color="success" />} label="วงเงินขายเชื่อ" />
              </RadioGroup>
              {props.values.contact_payment_type === "credit" &&
                <TextField
                  disabled
                  fullWidth
                  name="contact_is_credit_limit"
                  label="ระบุจำนวนเงิน"
                  size="small"
                  value={props.values.contact_is_credit_limit}
                  onChange={(e) => {
                    props.handleChange(e);
                  }}
                />}
            </FormControl>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

