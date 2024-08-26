import React, { useState } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CardBankComponent from '../CardComponent/CardBankComponent'
import ModalAddBankComponent from '../ModalComponent/ModalAddBankComponent'

export default function BankContactInfo(props) {
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
            ข้อมูลธนาคาร
          </h2>
        </AccordionSummary>
        <AccordionDetails>
          <div className="sale-add-contact__accordian2-add-btn">
            <ModalAddBankComponent
              values={props.values}
              errors={props.errors}
              touched={props.touched}
              handleChange={props.handleChange}
              setErrors={props.setErrors}
              setFieldValue={props.setFieldValue}
            />
          </div>
          <div>
            <div className="grid-container-33">
              {props.values.bank_account_list.map((val, index) => {
                return <CardBankComponent
                  key={index++ + val.bank_account_name}
                  ID={index}
                  values={props.values}
                  errors={props.errors}
                  touched={props.touched}
                  handleChange={props.handleChange}
                  setErrors={props.setErrors}
                  setFieldValue={props.setFieldValue}
                />
              })}
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

