import {
  Autocomplete,
  TextField,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getContactById } from "../../../adapter/Api";

export default function PurchaseForm({
  disabled,
  formik,
  contacts,
  contactId,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [allPhone, setAllPhone] = useState([]);
  const [allContactAddress, setAllContactAddress] = useState([]);
  const [allAddress, setAllAddress] = useState([]);
  const [selectedContact, setSelectedContact] = useState();

  const getContactInformation = (contact_id) => {
    setIsLoading(true);
    getContactById(contact_id).then((data) => {
      const contact = data.data.data;
      const formatContact = {
        ...contact,
        contact_name:
          contact.contact_commercial_name.length > 0
            ? contact.contact_commercial_name
            : contact.contact_individual_first_name +
              " " +
              contact.contact_individual_last_name,
      };
      const contactList = formatContact.contact_channel_list;
      const filterPhoneContactList = contactList.filter(
        (contact) => contact.contact_channel_name === "เบอร์โทรศัพท์"
      );
      const addressList = formatContact.contact_address_list;
      setAllPhone(filterPhoneContactList);
      setAllContactAddress(addressList);

      formik.setFieldValue("vendor_info.contact_id", formatContact.contact_id);
      formik.setFieldValue(
        "vendor_info.contact_name",
        formatContact.contact_name
      );
      formik.setFieldValue("vendor_info.tax_no", formatContact.contact_tax_no);
      formik.setFieldValue("vendor_info.phone", "");
      formik.setFieldValue("vendor_info.address_name", "");
      formik.setFieldValue("vendor_info.building", "");
      formik.setFieldValue("vendor_info.house_no", "");
      formik.setFieldValue("vendor_info.village_no", "");
      formik.setFieldValue("vendor_info.road", "");
      formik.setFieldValue("vendor_info.country", "");
      formik.setFieldValue("vendor_info.postal_code", "");
      formik.setFieldValue("vendor_info.province", "");
      formik.setFieldValue("vendor_info.sub_district", "");
      formik.setFieldValue("vendor_info.district", "");
      setSelectedContact(formatContact);
      setIsLoading(false);
    });
  };

  for (const obj of allAddress) {
    if (typeof obj !== "object") continue;
    for (const k in obj) {
      if (!obj.hasOwnProperty(k)) continue;
      let v = obj[k];
      if (v === null || v === undefined) {
        obj[k] = "";
      }
    }
  }

  useEffect(() => {
    if (selectedContact) {
      const contactList = selectedContact.contact_channel_list;
      const filterPhoneContactList = contactList.filter(
        (contact) => contact.contact_channel_name === "เบอร์โทรศัพท์"
      );
      const addressList = selectedContact.contact_address_list;
      setAllPhone(filterPhoneContactList);
      setAllContactAddress(addressList);
    }
  }, [contactId, contacts, selectedContact]);

  useEffect(() => {
    if (
      allContactAddress.length > 0 &&
      allContactAddress.some(
        (address) => address.address_name.trim().length > 0
      )
    ) {
      setAllAddress([...allContactAddress]);
    }
  }, [allContactAddress]);

  const getAddressInformation = (event) => {
    const filterAddress = allAddress.find(
      (address) => address.address_name === event.target.value
    );
    formik.setFieldValue(
      "vendor_info.address_name",
      filterAddress.address_name
    );
    formik.setFieldValue("vendor_info.building", filterAddress.building);
    formik.setFieldValue("vendor_info.house_no", filterAddress.house_no);
    formik.setFieldValue("vendor_info.village_no", filterAddress.village_no);
    formik.setFieldValue("vendor_info.road", filterAddress.road);
    formik.setFieldValue("vendor_info.country", filterAddress.country);
    formik.setFieldValue("vendor_info.postal_code", filterAddress.postal_code);
    formik.setFieldValue("vendor_info.province", filterAddress.province);
    formik.setFieldValue(
      "vendor_info.sub_district",
      filterAddress.sub_district
    );
    formik.setFieldValue("vendor_info.district", filterAddress.district);
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

  const contactValue = formik.values.vendor_info.contact_id
    ? {
        contact_id: formik.values.vendor_info.contact_id,
        contact_name: formik.values.vendor_info.contact_name,
      }
    : {
        contact_id: "",
        contact_name: "",
      };

  return (
    <>
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Box
        sx={{
          mb: "2.5rem",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <Autocomplete
              id="vendor_info.contact_id"
              name="vendor_info.contact_id"
              disablePortal
              disabled={disabled}
              size="small"
              freeSolo
              options={contactOptions}
              value={contactValue}
              getOptionLabel={(option) => option.contact_name}
              isOptionEqualToValue={(option, value) =>
                option.contact_id === value.contact_id
              }
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.contact_id}>
                    {option.contact_name}
                  </li>
                );
              }}
              onChange={(_, value) => {
                if (value !== null) {
                  getContactInformation(parseInt(value.contact_id));
                } else {
                  formik.setFieldValue("vendor_info.contact_id", "");
                  formik.setFieldValue("vendor_info.contact_name", "");
                  formik.setFieldValue("vendor_info.tax_no", "");
                  formik.setFieldValue("vendor_info.email", "");
                  formik.setFieldValue("vendor_info.phone", "");
                  formik.setFieldValue("vendor_info.fax", "");
                  formik.setFieldValue("vendor_info.address_name", "");
                  formik.setFieldValue("vendor_info.building", "");
                  formik.setFieldValue("vendor_info.house_no", "");
                  formik.setFieldValue("vendor_info.village_no", "");
                  formik.setFieldValue("vendor_info.road", "");
                  formik.setFieldValue("vendor_info.country", "");
                  formik.setFieldValue("vendor_info.postal_code", "");
                  formik.setFieldValue("vendor_info.province", "");
                  formik.setFieldValue("vendor_info.sub_district", "");
                  formik.setFieldValue("vendor_info.district", "");
                  setAllPhone([]);
                  setAllContactAddress([]);
                }
              }}
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField {...params} required label="เลือกผู้ขาย" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            {allPhone.length > 0 ? (
              <FormControl fullWidth size="small">
                <InputLabel disabled={disabled} id="vendor_info.phone">
                  เบอร์โทรศัพท์
                </InputLabel>
                <Select
                  disabled={disabled}
                  labelId="vendor_info.phone"
                  id="vendor_info.phone"
                  name="vendor_info.phone"
                  value={formik.values.vendor_info.phone}
                  label="เบอร์โทรศัพท์"
                  onChange={formik.handleChange}
                >
                  {allPhone.map((phone) => (
                    <MenuItem
                      key={phone.contact_channel_id}
                      value={phone.contact_channel_detail}
                    >
                      {phone.contact_channel_detail}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                autoComplete="off"
                type="text"
                id="vendor_info.phone"
                name="vendor_info.phone"
                value={formik.values.vendor_info.phone}
                onChange={formik.handleChange}
                disabled={disabled}
                size="small"
                label="เบอร์โทรศัพท์"
                fullWidth
              />
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              autoComplete="off"
              type="text"
              id="vendor_info.tax_no"
              name="vendor_info.tax_no"
              value={formik.values.vendor_info.tax_no}
              onChange={formik.handleChange}
              disabled={disabled}
              size="small"
              label="เลขประจำตัวผู้เสียภาษี"
              fullWidth
            />
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          mb: ".5rem",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            {allAddress &&
            allAddress.some(
              (address) => address.address_name.trim().length > 0
            ) ? (
              <FormControl fullWidth size="small">
                <InputLabel disabled={disabled} id="vendor_info.address_name">
                  ที่อยู่
                </InputLabel>
                <Select
                  disabled={disabled}
                  labelId="vendor_info.address_name"
                  id="vendor_info.address_name"
                  name="vendor_info.address_name"
                  value={formik.values.vendor_info.address_name}
                  label="ที่อยู่"
                  onChange={getAddressInformation}
                >
                  {allAddress.map((address) => (
                    <MenuItem
                      key={address.address_id}
                      value={address.address_name}
                    >
                      {address.address_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                autoComplete="off"
                type="text"
                id="vendor_info.address_name"
                name="vendor_info.address_name"
                value={formik.values.vendor_info.address_name}
                onChange={formik.handleChange}
                disabled={disabled}
                size="small"
                label="ที่อยู่"
                fullWidth
              />
            )}
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          mb: ".5rem",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              autoComplete="off"
              type="text"
              id="vendor_info.building"
              name="vendor_info.building"
              value={formik.values.vendor_info.building}
              onChange={formik.handleChange}
              disabled={true}
              size="small"
              label="อาคาร / หมู่บ้าน"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              autoComplete="off"
              type="text"
              id="vendor_info.house_no"
              name="vendor_info.house_no"
              value={formik.values.vendor_info.house_no}
              onChange={formik.handleChange}
              disabled={true}
              size="small"
              label="เลขที่"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              autoComplete="off"
              type="text"
              id="vendor_info.village_no"
              name="vendor_info.village_no"
              value={formik.values.vendor_info.village_no}
              onChange={formik.handleChange}
              disabled={true}
              size="small"
              label="หมู่"
              fullWidth
            />
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          mb: ".5rem",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              autoComplete="off"
              type="text"
              id="vendor_info.road"
              name="vendor_info.road"
              value={formik.values.vendor_info.road}
              onChange={formik.handleChange}
              disabled={true}
              size="small"
              label="ถนน"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              autoComplete="off"
              type="text"
              id="vendor_info.country"
              name="vendor_info.country"
              value={formik.values.vendor_info.country}
              onChange={formik.handleChange}
              disabled={true}
              size="small"
              label="ประเทศ"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              autoComplete="off"
              type="text"
              id="vendor_info.postal_code"
              name="vendor_info.postal_code"
              value={formik.values.vendor_info.postal_code}
              onChange={formik.handleChange}
              disabled={true}
              size="small"
              label="รหัสไปรษณีย์"
              fullWidth
            />
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          mb: ".5rem",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              autoComplete="off"
              type="text"
              id="vendor_info.province"
              name="vendor_info.province"
              value={formik.values.vendor_info.province}
              onChange={formik.handleChange}
              disabled={true}
              size="small"
              label="จังหวัด"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              autoComplete="off"
              type="text"
              id="vendor_info.sub_district"
              name="vendor_info.sub_district"
              value={formik.values.vendor_info.sub_district}
              onChange={formik.handleChange}
              disabled={true}
              size="small"
              label="แขวง / ตำบล"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              autoComplete="off"
              type="text"
              id="vendor_info.district"
              name="vendor_info.district"
              value={formik.values.vendor_info.district}
              onChange={formik.handleChange}
              disabled={true}
              size="small"
              label="เขต / อำเภอ"
              fullWidth
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
