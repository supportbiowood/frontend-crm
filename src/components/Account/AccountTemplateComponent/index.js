import { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { TextField } from "@mui/material";

export default function AccountTemplateComponent({
  disabled,
  formik,
  remarkId,
  allTemplate,
  id,
  detail,
  remark,
}) {
  const [selectedTemplate, setSelectedTemplate] = useState("");

  useEffect(() => {
    if (remarkId && allTemplate) {
      const seletedTemplateDetail = allTemplate.find(
        (template) => template.remark_template_id === remarkId
      );
      setSelectedTemplate(seletedTemplateDetail.remark_template_name);
    }
  }, [allTemplate, remarkId]);

  const selectTemplateHandler = (event) => {
    setSelectedTemplate(event.target.value);
    const seletedTemplateDetail = allTemplate.find(
      (template) => template.remark_template_name === event.target.value
    );
    formik.setFieldValue(id, seletedTemplateDetail?.remark_template_id || "");
    formik.setFieldValue(detail, seletedTemplateDetail?.template || "");
  };

  const templateDetailChangeHandler = (event) => {
    formik.setFieldValue(detail, event.target.value);
  };

  return (
    <FormControl fullWidth size="small">
      <InputLabel id="demo-simple-select-autowidth-label">
        รูปแบบหมายเหตุ
      </InputLabel>
      <Select
        disabled={disabled}
        labelId="demo-simple-select-autowidth-label"
        id="demo-simple-select-autowidth"
        value={selectedTemplate}
        onChange={selectTemplateHandler}
        fullWidth
        label="รูปแบบหมายเหตุ"
      >
        {allTemplate &&
          allTemplate.map((template) => (
            <MenuItem
              key={template.remark_template_id}
              value={template.remark_template_name}
            >
              {template.remark_template_name}
            </MenuItem>
          ))}
      </Select>
      <TextField
        disabled={disabled}
        margin="normal"
        size="small"
        id="outlined-multiline-flexible"
        multiline
        onChange={templateDetailChangeHandler}
        value={remark}
        minRows={9}
        maxRows={9}
      />
    </FormControl>
  );
}
