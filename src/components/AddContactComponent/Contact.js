import React, { useState } from "react";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ButtonComponent from "../ButtonComponent";
import CloseIcon from "@mui/icons-material/Close";
import {
  Accordion,
  AccordionDetails,
  Autocomplete,
  IconButton,
  TextField,
} from "@mui/material";
import { getIn } from "formik";
import { createFilterOptions } from "@mui/material/Autocomplete";
const filter = createFilterOptions();

export default function Contact(props) {
  const [expanded, setExpanded] = useState("panel1");

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const pushValue = () => {
    const Clone = [...props.values.contact_channel_list];
    Clone.push({
      contact_channel_name: "เบอร์โทรศัพท์",
      contact_channel_detail: "",
      contact_channel_detail_2: null,
    });
    props.setFieldValue("contact_channel_list", Clone);
  };

  const deleteChannel = (index) => {
    const newContact = props.values.contact_channel_list.filter(
      (val, i) => index !== i
    );
    props.setFieldValue("contact_channel_list", newContact);
  };

  const ContactList = [
    {
      name: "เบอร์โทรศัพท์",
      value: "เบอร์โทรศัพท์",
    },
    {
      name: "อีเมล",
      value: "อีเมล",
    },
    {
      name: "Line",
      value: "Line",
    },
    {
      name: "Facebook",
      value: "Facebook",
    },
    {
      name: "Website",
      value: "Website",
    },
    {
      name: "Instagram",
      value: "Instagram",
    },
    {
      name: "LinkedIn",
      value: "LinkedIn",
    },
    {
      name: "อื่นๆ",
      value: "อื่นๆ",
    },
  ];

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
          <h2>ช่องทางติดต่อ</h2>
        </AccordionSummary>
        <AccordionDetails>
          <div
            className="sale-add-contact__accordian2-add-btn"
            style={{ marginBottom: "30px" }}
          >
            <ButtonComponent
              text="เพิ่มช่องทาง"
              variant="outlined"
              color="success"
              type="button"
              onClick={() => pushValue()}
            />
          </div>
          <div className="contact-channel-wrapper">
            {props.values.contact_channel_list.map((value, index) => (
              <div
                className="grid-container-contact-channel-list"
                key={`${value.contact_channel_name} + ${index}`}
              >
                <div>
                  <Autocomplete
                    value={value.contact_channel_name || ""}
                    name={`contact_channel_list[${index}].contact_channel_name`}
                    onChange={(event, newValue) => {
                      if (typeof newValue === "string") {
                        props.setFieldValue(
                          `contact_channel_list[${index}].contact_channel_name`,
                          newValue.value
                        );
                      } else if (newValue && newValue.inputValue) {
                        // Create a new value from the user input
                        props.setFieldValue(
                          `contact_channel_list[${index}].contact_channel_name`,
                          newValue.inputValue
                        );
                      } else {
                        if (newValue === null)
                          return props.setFieldValue(
                            `contact_channel_list[${index}].contact_channel_name`,
                            ""
                          );
                        props.setFieldValue(
                          `contact_channel_list[${index}].contact_channel_name`,
                          newValue.value
                        );
                      }
                    }}
                    filterOptions={(options, params) => {
                      const filtered = filter(options, params);

                      const { inputValue } = params;
                      // Suggest the creation of a new value
                      const isExisting = options.some(
                        (option) => inputValue === option.label
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
                    options={ContactList}
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
                    sx={{ width: 140 }}
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        label="เลือกช่องทางติดต่อ"
                      />
                    )}
                  />
                </div>
                {props.values.contact_channel_list[index]
                  .contact_channel_name === "เบอร์โทรศัพท์" ? (
                  <div>
                    <TextField
                      id={`contact[${index}].Value`}
                      label="เบอร์โทรศัพท์"
                      size="small"
                      name={`contact_channel_list[${index}].contact_channel_detail`}
                      value={value.contact_channel_detail}
                      onChange={(e) => {
                        props.setFieldError(
                          `contact_channel_list[${index}].contact_channel_detail`,
                          ""
                        );
                        props.handleChange(e);
                      }}
                      error={Boolean(
                        getIn(
                          props.touched,
                          `contact_channel_list[${index}].contact_channel_detail`
                        ) &&
                          getIn(
                            props.errors,
                            `contact_channel_list[${index}].contact_channel_detail`
                          )
                      )}
                      helperText={
                        getIn(
                          props.touched,
                          `contact_channel_list[${index}].contact_channel_detail`
                        ) &&
                        getIn(
                          props.errors,
                          `contact_channel_list[${index}].contact_channel_detail`
                        )
                      }
                    />
                  </div>
                ) : (
                  <div>
                    <TextField
                      required
                      id={`contact[${index}].Value`}
                      label=""
                      size="small"
                      name={`contact_channel_list[${index}].contact_channel_detail`}
                      value={value.contact_channel_detail}
                      onChange={(e) => {
                        props.setFieldError(
                          `contact_channel_list[${index}].contact_channel_detail`,
                          ""
                        );
                        props.handleChange(e);
                      }}
                      error={Boolean(
                        getIn(
                          props.touched,
                          `contact_channel_list[${index}].contact_channel_detail`
                        ) &&
                          getIn(
                            props.errors,
                            `contact_channel_list[${index}].contact_channel_detail`
                          )
                      )}
                      helperText={
                        getIn(
                          props.touched,
                          `contact_channel_list[${index}].contact_channel_detail`
                        ) &&
                        getIn(
                          props.errors,
                          `contact_channel_list[${index}].contact_channel_detail`
                        )
                      }
                    />
                  </div>
                )}
                {props.values.contact_channel_list[index]
                  .contact_channel_name === "เบอร์โทรศัพท์" ? (
                  <div>
                    <TextField
                      id={`contact[${index}].Value`}
                      label="ต่อ"
                      size="small"
                      sx={{ maxWidth: "70px" }}
                      name={`contact_channel_list[${index}].contact_channel_detail_2`}
                      value={value.contact_channel_detail_2}
                      onChange={(e) => {
                        if (
                          e.target.value === "" ||
                          e.target.value === undefined
                        )
                          return null;
                        props.handleChange(e);
                      }}
                    />
                  </div>
                ) : (
                  <div />
                )}
                <div>
                  {index !== 0 ? (
                    <IconButton
                      type="button"
                      onClick={() => deleteChannel(index)} // remove item from the list
                    >
                      <CloseIcon />
                    </IconButton>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
