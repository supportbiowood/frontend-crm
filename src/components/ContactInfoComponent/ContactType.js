import React from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import { Checkbox, FormControlLabel } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export default function ContactType(props) {
  const [expanded, setExpanded] = React.useState('panel1')

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false)
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
            ประเภทผู้ติดต่อ
          </h2>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            <div style={{ display: 'inline-flex' }}>
              <div className="sale-add-contact__accordian6-list">
                <FormControlLabel
                  control={
                    <Checkbox
                      name="contact_is_customer"
                      color="success"
                      checked={props.values.contact_is_customer}
                      onChange={(e) => {
                        props.handleChange(e)
                      }}
                    />
                  }
                  label="ลูกค้า (Customer)"
                />
              </div>
              <div className="sale-add-contact__accordian6-list">
                <FormControlLabel
                  control={
                    <Checkbox
                      name="contact_is_vendor"
                      color="success"
                      checked={props.values.contact_is_vendor}
                      onChange={(e) => {
                        props.handleChange(e)
                      }}
                    />
                  }
                  label="ผู้ขาย (Vendor)"
                />
              </div>
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}
