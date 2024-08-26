import { Autocomplete, Box, Grid, TextField } from "@mui/material";
import React from "react";

const CombinedPaymentContactForm = ({ formik, contacts }) => {
  const contactValue = formik.values.vendor_info.contact_id
    ? {
        contact_id: formik.values.vendor_info.contact_id,
        contact_name: formik.values.vendor_info.contact_name,
      }
    : {
        contact_id: "",
        contact_name: "",
      };

  const contactOptions = contacts?.map((contact) => {
    return {
      contact_id: contact.contact_id,
      contact_name:
        contact.contact_commercial_name.length > 0
          ? contact.contact_commercial_name
          : contact.contact_individual_first_name +
            " " +
            contact.contact_individual_last_name,
    };
  });
  return (
    <Box
      sx={{
        mb: "2.5rem",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
          <Autocomplete
            disablePortal
            size="small"
            freeSolo
            options={contactOptions}
            value={contactValue}
            getOptionLabel={(option) => option.contact_name}
            isOptionEqualToValue={(option, value) =>
              option.contact_id === value.contact_id
            }
            onChange={(_, value) => {
              const formatContact =
                contacts?.map((contact) => {
                  return {
                    ...contact,
                    contact_name:
                      contact.contact_commercial_name.length > 0
                        ? contact.contact_commercial_name
                        : contact.contact_individual_first_name +
                          " " +
                          contact.contact_individual_last_name,
                  };
                }) ?? [];
              const findContact = formatContact.find(
                (contact) => contact.contact_id === value.contact_id
              );
              formik.setFieldValue(
                "vendor_info.contact_id",
                findContact.contact_id
              );
              formik.setFieldValue(
                "vendor_info.contact_name",
                findContact.contact_name
              );
              formik.setFieldValue(
                "vendor_info.tax_no",
                findContact.contact_tax_no
              );
            }}
            renderInput={(params) => (
              <TextField {...params} required label="เลือกผู้ขาย" />
            )}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.contact_id}>
                  {option.contact_name}
                </li>
              );
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CombinedPaymentContactForm;
