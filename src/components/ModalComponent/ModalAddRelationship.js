import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  Backdrop,
  CircularProgress,
} from "@mui/material";

import ButtonComponent from "../ButtonComponent";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { getContactById } from "../../adapter/Api";
import { Autocomplete } from "@mui/material";
import * as Yup from "yup";
import { Formik } from "formik";
import { Link } from "react-router-dom";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { onKeyDown } from "../../adapter/Utils";

const filter = createFilterOptions();
export default function ModalAddRelationShip({
  contact,
  setContact,
  optionContacts,
  optionPersons,
  setOptionPersons,
  setFieldValueProps,
  values: valuesProps,
}) {
  const [open, setOpen] = useState(false);

  const [selectedRole, setSelectedRole] = useState(null);

  const [selectedContact, setSelectedContact] = useState({
    name: "ไม่ระบุ",
    value: "",
  });

  const [selectedPerson, setSelectedPerson] = useState({
    name: "ไม่ระบุ",
    value: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (resetForm) => {
    setOpen(false);
    setSelectedContact({
      name: "ไม่ระบุ",
      value: "",
    });
    setSelectedPerson({
      name: "ไม่ระบุ",
      value: "",
    });
    resetForm();
  };

  useEffect(() => {
    if (contact && contact.person_list) {
      const formatPersonOptions = contact.person_list.map((person) => ({
        name: person.person_first_name + " " + person.person_last_name,
        value: person.person_id,
      }));
      setOptionPersons([
        { name: "ไม่ระบุ", value: "" },
        ...formatPersonOptions,
      ]);
    } else {
      setOptionPersons([{ name: "ไม่ระบุ", value: "" }]);
    }
  }, [contact, setOptionPersons]);

  const rolelist = [
    {
      name: "ผู้จัดการโครงการ",
      value: "ผู้จัดการโครงการ",
    },
    {
      name: "วิศวกรโครงการ",
      value: "วิศวกรโครงการ",
    },
    {
      name: "วิศกรสนาม",
      value: "วิศกรสนาม",
    },
    {
      name: "สภาปนิกโครงการ",
      value: "สภาปนิกโครงการ",
    },
    {
      name: "โฟร์แมน",
      value: "โฟร์แมน",
    },
    {
      name: "จัดซื้อโครงการ",
      value: "จัดซื้อโครงการ",
    },
    {
      name: "การเงินโครงการ",
      value: "การเงินโครงการ",
    },
    {
      name: "แอดมินโครงการ",
      value: "แอดมินโครงการ",
    },
    {
      name: "ผู้ช่วยผู้จัดการโครงการ",
      value: "ผู้ช่วยผู้จัดการโครงการ",
    },
    {
      name: "ผู้ประสานงาน",
      value: "ผู้ประสานงาน",
    },
    {
      name: "ที่ปรึกษาโครงการ",
      value: "ที่ปรึกษาโครงการ",
    },
  ];

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const checkSchema = Yup.object().shape({
    role: Yup.string().required("กรุณากรอก"),
    contact_id: Yup.string().required("กรุณากรอก"),
    // person_id: Yup.string().required("กรุณากรอก"),
  });

  const [myValue] = useState({
    role: "",
    contact_id: "",
    person_id: "",
  });

  return (
    <>
      {isLoading && (
        <Backdrop sx={{ color: "#fff", zIndex: 999999 }} open={true}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Button variant="outlined" color="success" onClick={handleClickOpen}>
        เพิ่มผู้เกี่ยวข้อง
      </Button>
      <Formik
        enableReinitialize
        initialValues={myValue}
        validationSchema={checkSchema}
        validateOnChange={true}
        validateOnBlur={true}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(false);
          const myPerson =
            contact &&
            contact.person_list.find((val) => {
              return val.person_id === values.person_id;
            });
          valuesProps.project_contact_list.push({
            role: values.role,
            contact_id: contact.contact_id,
            contact_is_customer: contact.contact_is_customer || "",
            contact_is_vendor: contact.contact_is_vendor || "",
            contact_business_category: contact.contact_business_category || "",
            contact_commercial_type: contact.contact_commercial_type || "",
            contact_commercial_name: contact.contact_commercial_name || "",
            contact_individual_prefix_name:
              contact.contact_individual_prefix_name || "",
            contact_individual_first_name:
              contact.contact_individual_first_name || "",
            contact_individual_last_name:
              contact.contact_individual_last_name || "",
            contact_merchant_name: contact.contact_merchant_name || "",
            contact_tax_no: contact.contact_tax_no || "",
            contact_registration_address_id:
              contact.contact_registration_address_id || "",
            contact_address_list: contact.contact_address_list || "",
            lead_source_id: contact.lead_source_id || "",
            contact_img_url: contact.contact_img_url || "",
            account_receivable_id: contact.account_receivable_id || "",
            account_payable_id: contact.account_payable_id || "",
            contact_payment_type: contact.contact_payment_type || "",
            contact_is_credit_limit: contact.contact_is_credit_limit || "",
            contact_credit_limit_amount:
              contact.contact_credit_limit_amount || "",
            _contact_created: contact._contact_created || "",
            _contact_createdby: contact._contact_createdby || "",
            _contact_lastupdate: contact._contact_lastupdate || "",
            _contact_lastupdateby: contact._contact_lastupdateby || "",
            contact_channel_list: contact.contact_channel_list || [],
            person_id: values.person_id || null,
            person_position:
              (values.person_id && myPerson.person_position) || "",
            person_first_name:
              (values.person_id && myPerson.person_first_name) || "",
            person_last_name:
              (values.person_id && myPerson.person_last_name) || "",
            person_nick_name:
              (values.person_id && myPerson.person_nick_name) || "",
            person_birthdate:
              (values.person_id && myPerson.person_birthdate) || "",
            person_img_url: (values.person_id && myPerson.person_img_url) || "",
            person_remark: (values.person_id && myPerson.person_remark) || "",
            person_contact_channel_list:
              (values.person_id && myPerson.person_contact_channel_list) || [],
          });
          setFieldValueProps(
            "project_contact_list",
            valuesProps.project_contact_list
          );
          resetForm();
          setOpen(false);
          return;
        }}
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          setErrors,
          setSubmitting,
          setFieldValue,
          resetForm,
        }) => (
          <Dialog
            open={open}
            onClose={() => handleClose(resetForm)}
            fullWidth
            fullScreen={fullScreen}
          >
            <DialogTitle>
              <h2
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                เพิ่มผู้เกี่ยวข้อง
                <IconButton
                  type="button"
                  onClick={() => handleClose(resetForm)}
                >
                  <CloseIcon />
                </IconButton>
              </h2>
            </DialogTitle>
            <DialogContent>
              <form onKeyDown={onKeyDown}>
                <DialogContentText>
                  <div className="grid-container-50">
                    <Autocomplete
                      value={selectedRole}
                      onChange={(_, newValue) => {
                        if (newValue !== null && newValue.value) {
                          if (typeof newValue.value === "string") {
                            setSelectedRole({
                              name: newValue.value,
                              value: newValue.value,
                            });
                            setFieldValue("role", newValue.value);
                          } else if (newValue && newValue.inputValue) {
                            // Create a new value from the user input
                            setSelectedRole({
                              name: newValue.inputValue,
                              value: newValue.inputValue,
                            });
                            setFieldValue("role", newValue.inputValue);
                          } else {
                            setSelectedRole(newValue);
                            setFieldValue("role", newValue);
                          }
                        } else {
                          setSelectedRole(null);
                          setFieldValue("role", "");
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
                            value: inputValue,
                            name: `เพิ่ม "${inputValue}"`,
                          });
                        }

                        return filtered;
                      }}
                      selectOnFocus
                      clearOnBlur
                      handleHomeEndKeys
                      id="free-solo-with-text-demo"
                      options={rolelist}
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
                      sx={{ width: 300 }}
                      freeSolo
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          name="role"
                          size="small"
                          label="ตำแหน่งในโครงการ"
                          error={errors.role && touched.role && errors.role}
                          helperText={
                            errors.role && touched.role && errors.role
                          }
                        />
                      )}
                    />
                    <FormControl
                      fullWidth
                      size="small"
                      error={
                        errors.contact_id &&
                        touched.contact_id &&
                        errors.contact_id
                      }
                    >
                      <Autocomplete
                        name="contact_id"
                        id="combo-box-demo"
                        options={optionContacts}
                        getOptionLabel={(option) =>
                          option.name ? option.name : ""
                        }
                        onChange={async (_, value) => {
                          if (value !== null && value.value) {
                            setSelectedContact({
                              name: value.name,
                              value: value.value.toString(),
                            });
                            setFieldValue("contact_id", value.value);
                            setFieldValue("person_id", "");
                            setIsLoading(true);
                            const {
                              data: { data, status },
                            } = await getContactById(value.value);
                            console.log("contact", data);
                            if (status === "success") {
                              setContact(data);
                              setIsLoading(false);
                            }
                          } else {
                            if (value !== null && value.name === "ไม่ระบุ") {
                              setSelectedContact({
                                name: "ไม่ระบุ",
                                value: "",
                              });
                            } else {
                              setSelectedContact(null);
                            }

                            setSelectedPerson({
                              name: "ไม่ระบุ",
                              value: "",
                            });
                            setOptionPersons([
                              {
                                name: "ไม่ระบุ",
                                value: "",
                              },
                            ]);
                            setFieldValue("contact_id", "");
                          }
                        }}
                        value={selectedContact}
                        renderOption={(props, option) => (
                          <li {...props} key={option.value}>
                            {option.name}
                          </li>
                        )}
                        isOptionEqualToValue={(option, value) => {
                          return option.value.toString() === value.value;
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            name="contact_id"
                            size="small"
                            label="ผู้ติดต่อ"
                            error={
                              errors.contact_id &&
                              touched.contact_id &&
                              errors.contact_id
                            }
                          />
                        )}
                      />
                      <FormHelperText>
                        {errors.contact_id &&
                          touched.contact_id &&
                          errors.contact_id}
                      </FormHelperText>
                    </FormControl>
                    {values.contact_id &&
                      optionPersons &&
                      optionPersons.length > 0 && (
                        <FormControl
                          fullWidth
                          size="small"
                          error={
                            errors.person_id &&
                            touched.person_id &&
                            errors.person_id
                          }
                        >
                          <Autocomplete
                            disablePortal
                            name="person_id"
                            onBlur={handleBlur}
                            id="combo-box-demo"
                            options={optionPersons}
                            getOptionLabel={(option) =>
                              option.name ? option.name : ""
                            }
                            onChange={(e, value) => {
                              if (value !== null) {
                                setSelectedPerson({
                                  name: value.name,
                                  value: value.value.toString(),
                                });
                                setFieldValue("person_id", value.value);
                              } else {
                                if (
                                  value !== null &&
                                  value.name === "ไม่ระบุ"
                                ) {
                                  setSelectedPerson({
                                    name: "ไม่ระบุ",
                                    value: "",
                                  });
                                } else {
                                  setSelectedPerson(null);
                                }
                                setFieldValue("person_id", "");
                              }
                            }}
                            value={selectedPerson}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                name="person_id"
                                label="
                      บุคคลติดต่อ"
                                error={
                                  errors.person_id &&
                                  touched.person_id &&
                                  errors.person_id
                                }
                              />
                            )}
                          />
                          <FormHelperText>
                            {errors.person_id &&
                              touched.person_id &&
                              errors.person_id}
                          </FormHelperText>
                        </FormControl>
                      )}
                  </div>
                  <div>
                    <Link to={"/sales/contact"} target="_blank">
                      <ButtonComponent
                        type="button"
                        text="เพิ่มผู้ติดต่อ"
                        color="success"
                        variant="outlined"
                      />
                    </Link>
                  </div>
                </DialogContentText>
              </form>
            </DialogContent>
            <DialogActions>
              <ButtonComponent
                type="submit"
                text="เพิ่ม"
                color="success"
                variant="outlined"
                // onClick={handleClick}
                disabled={isSubmitting}
                onClick={handleSubmit}
              />
              <Button
                color="success"
                onClick={() => {
                  handleClose(resetForm);
                }}
              >
                ปิด
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Formik>
    </>
  );
}
