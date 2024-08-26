import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  createFilterOptions,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useState } from "react";

const filter = createFilterOptions();

const defaultValue = [
  {
    title:
      "ลดราคาสินค้า - เนื่องจากผิดจากที่ตกลงกัน ชำรุดเสียหาย ไม่ครบ หรือคำนวณราคาผิด",
  },
  {
    title:
      "ลดราคาค่าบริการ - เนื่องจากผิดจากที่ตกลงกัน ให้บริการไม่ครบ หรือคำนวณราคาผิด",
  },
  {
    title:
      "ลดราคาค่าบริการ - เนื่องจากผิดจากชำรุดเสียหาย ไม่ครบ ไม่ตรงตามตัวอย่าง หรือไม่ตรงตามคำบรรยาย",
  },
  {
    title:
      "จ่ายเงินชดเชย - ให้แก่ผู้ซื้อสินค้า หรือผู้รับบริการตามข้อผู้กพัน/ข้อตกลงกัน",
  },
  {
    title:
      "จ่ายเงินคืนเงินล่วงหน้า เงินมัดจำ เงินประกัน เงินจอง - ให้แก่ผู้ซื้อสินค้า หรือผู้รับบริการตามข้อผูกพัน/ข้อตกลงกัน",
  },
  {
    title:
      "ได้รับคืนสินค้า หรือแลกเปลี่ยนสินค้า - ระหว่างผู้ประกอบการ VAT ด้วยกัน",
  },
  {
    title:
      "ได้รับคืนสินค้า หรือแลกเปลี่ยนสินค้า - ระหว่างผู้ขายกับลูกค้า (เฉพาะภายในเวลาอันเหมาะสม)",
  },
  {
    title: "บอกเลิกบริการ - เนื่องจากผิดจากที่ตกลงกัน",
  },
  {
    title: "บอกเลิกบริการ - เนื่องจากไม่ได้มีการให้บริการตามสัญญา",
  },
];

const DebitNoteReasonAccordian = ({ formik, disabled }) => {
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
            <h4>ประเภทของการลดหนี้</h4>
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
              <Autocomplete
                disabled={disabled}
                size="small"
                value={formik.values.debit_note_reason}
                onChange={(_, newValue) => {
                  if (typeof newValue === "string") {
                    formik.setFieldValue("debit_note_reason", newValue);
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    formik.setFieldValue(
                      "debit_note_reason",
                      newValue.inputValue
                    );
                  } else {
                    formik.setFieldValue(
                      "debit_note_reason",
                      newValue?.title || ""
                    );
                  }
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);
                  const { inputValue } = params;
                  // Suggest the creation of a new value
                  const isExisting = options.some(
                    (option) => inputValue === option.title
                  );
                  if (inputValue !== "" && !isExisting) {
                    filtered.push({
                      inputValue,
                      title: `เพิ่ม "${inputValue}"`,
                    });
                  }
                  return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                id="free-solo-with-text-demo"
                options={defaultValue}
                getOptionLabel={(option) => {
                  // Value selected with enter, right from the input
                  if (typeof option === "string") {
                    return option;
                  }
                  // Add "xxx" option created dynamically
                  if (option.inputValue) {
                    return option.inputValue;
                  }
                  // Regular option
                  return option.title;
                }}
                renderOption={(props, option) => (
                  <li {...props}>{option.title}</li>
                )}
                freeSolo
                renderInput={(params) => (
                  <TextField {...params} label="เลือกประเภท" />
                )}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default DebitNoteReasonAccordian;
