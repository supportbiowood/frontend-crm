import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Autocomplete,
  TextField,
} from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TagComponent from "../TagComponent";
import { getContactTag } from "../../adapter/Api/index.js";

export default function GroupManage(props) {
  const [expanded, setExpanded] = useState("panel1");
  const [value] = useState();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const filter = createFilterOptions();

  const [menuValue, setMenuValue] = useState([]);

  useEffect(() => {
    getContactTag()
      .then((data) => {
        let myData = data.data.data;
        const newData = myData.map((tag) => {
          return {
            name: tag.tag_name,
            value: tag.tag_name,
          };
        });
        setMenuValue(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

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
          <h2>การจัดกลุ่ม</h2>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div className="sale-add-contact__accordian7-input-wrapper">
              <Autocomplete
                size="small"
                value={value}
                name="tag_list"
                onChange={(event, newValue) => {
                  props.setFieldError("tag_list", "");
                  if (newValue == null) return null;
                  if (typeof newValue === "string") {
                    const Clone = [...props.values.tag_list];
                    const check = Clone.find((val, index) => {
                      return `${val.tag_name}` === `${newValue}`;
                    });
                    if (check) return null;
                    Clone.push({ tag_name: newValue });
                    props.setFieldValue("tag_list", Clone);
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    const Clone = [...props.values.tag_list];
                    const check = Clone.find((val, index) => {
                      return `${val.tag_name}` === `${newValue.inputValue}`;
                    });
                    if (check) return null;
                    Clone.push({ tag_name: newValue.inputValue });
                    props.setFieldValue("tag_list", Clone);
                  } else {
                    const Clone = [...props.values.tag_list];
                    const check = Clone.find((val, index) => {
                      return `${val.tag_name}` === `${newValue.value}`;
                    });
                    if (check) return null;
                    Clone.push({ tag_name: newValue.value });
                    props.setFieldValue("tag_list", Clone);
                  }
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);
                  const { inputValue } = params;
                  // Suggest the creation of a new value
                  const isExisting = options.some(
                    (option) => inputValue === option.name
                  );
                  if (inputValue !== "" && !isExisting) {
                    filtered.push({
                      inputValue,
                      name: `เพิ่ม "${inputValue}"`,
                    });
                  }
                  return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                id="free-solo-with-text-demo"
                options={menuValue}
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
                  return option.name;
                }}
                renderOption={(props, option) => (
                  <li {...props}>{option.name}</li>
                )}
                sx={{ width: 200 }}
                freeSolo
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="ระบุกลุ่ม"
                    error={
                      props.errors.tag_list &&
                      props.touched.tag_list &&
                      props.errors.tag_list
                    }
                    helperText={
                      props.errors.tag_list &&
                      props.touched.tag_list &&
                      props.errors.tag_list
                    }
                  />
                )}
              />
            </div>
            <div className="sale-add-contact__accordian7-wrapper addproject__permission-tag">
              {props.values.tag_list.map((val, index) => {
                return (
                  <TagComponent
                    values={props.values.tag_list}
                    setFieldValue={props.setFieldValue}
                    key={`${val} + ${index}`}
                    label={`${val.tag_name}`}
                    ID={index}
                  />
                );
              })}
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
