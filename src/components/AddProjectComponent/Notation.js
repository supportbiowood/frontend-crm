import React, { useState } from 'react'
import { Typography, Accordion, AccordionDetails, AccordionSummary, TextField } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export default function Notation(props) {
  const [expanded, setExpanded] = useState(false)
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  return (
    <div>
      <Accordion
        style={{ padding: '24px', marginBottom: '24px' }}
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
          <Typography
            sx={{
              width: '33%',
              flexShrink: 0,
              fontWeight: 'bold',
              fontSize: '24px',
              lineHeight: '28px',
              whiteSpace: 'nowrap'
            }}>
            หมายเหตุ
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div>
              <TextField
                style={{ width: '70%' }}
                multiline
                rows={4}
                id="note"
                label="หมายเหตุ"
                name="project_remark"
                value={props.values.project_remark}
                onChange={(e) => {
                  props.handleChange(e)
                }}
              />
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}
