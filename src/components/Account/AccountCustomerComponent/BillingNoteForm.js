import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const BillingNoteForm = ({
  formik,
  disabled,
  allBillingInfo,
  contacts,
  contactId,
  selectedContact,
}) => {
  const [allEmail, setAllEmail] = useState([]);
  const [allPhone, setAllPhone] = useState([]);
  const [allFax, setAllFax] = useState([]);
  const [allAddress, setAllAddress] = useState([]);

  useEffect(() => {
    if (allBillingInfo) {
      const emailFromInfo = allBillingInfo.map((info) => info.email);
      const removedEmptyEmail = emailFromInfo.filter((e) => e);
      const uniqueEmail = [...new Set(removedEmptyEmail)];
      const phoneFromInfo = allBillingInfo.map((info) => info.phone);
      const removedEmptyPhone = phoneFromInfo.filter((e) => e);
      const uniquePhone = [...new Set(removedEmptyPhone)];
      const faxFromInfo = allBillingInfo.map((info) => info.fax);
      const removedEmptyFax = faxFromInfo.filter((e) => e);
      const uniqueFax = [...new Set(removedEmptyFax)];
      setAllEmail(uniqueEmail);
      setAllPhone(uniquePhone);
      setAllFax(uniqueFax);
    }
  }, [allBillingInfo]);

  useEffect(() => {
    if (selectedContact) {
      const addressFromInfo = allBillingInfo.map((info) => {
        if (info.project_name.length > 0) {
          return {
            road: info.road,
            country: info.country,
            building: info.building,
            district: info.district,
            house_no: info.house_no,
            province: info.province,
            village_no: info.village_no,
            postal_code: info.postal_code,
            address_name: `${info.address_name} - ${info.project_name}`,
            sub_district: info.sub_district,
          };
        } else {
          return {
            road: info.road,
            country: info.country,
            building: info.building,
            district: info.district,
            house_no: info.house_no,
            province: info.province,
            village_no: info.village_no,
            postal_code: info.postal_code,
            address_name: `${info.address_name}`,
            sub_district: info.sub_district,
          };
        }
      });
      const removedEmptyAddress = addressFromInfo.filter((e) => e);
      const uniqueAddress = [
        ...new Map(
          removedEmptyAddress.map((item) => [item["address_name"], item])
        ).values(),
      ];
      setAllAddress([...uniqueAddress]);
    }
  }, [allBillingInfo, contactId, contacts, selectedContact]);

  const getAddressInformation = (event) => {
    const findAddress = allAddress.find(
      (address) => address.address_name === event.target.value
    );
    formik.setFieldValue("billing_info.address_name", findAddress.address_name);
    formik.setFieldValue("billing_info.building", findAddress.building);
    formik.setFieldValue("billing_info.house_no", findAddress.house_no);
    formik.setFieldValue("billing_info.village_no", findAddress.village_no);
    formik.setFieldValue("billing_info.road", findAddress.road);
    formik.setFieldValue("billing_info.country", findAddress.country);
    formik.setFieldValue("billing_info.postal_code", findAddress.postal_code);
    formik.setFieldValue("billing_info.province", findAddress.province);
    formik.setFieldValue("billing_info.sub_district", findAddress.sub_district);
    formik.setFieldValue("billing_info.district", findAddress.district);
  };

  return (
    <>
      <Box
        sx={{
          mb: "2.5rem",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              autoComplete="off"
              type="text"
              id="billing_info.contact_name"
              name="billing_info.contact_name"
              value={formik.values.billing_info.contact_name}
              onChange={formik.handleChange}
              disabled={true}
              size="small"
              label="ชื่อลูกค้า"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            {allEmail.length > 0 ? (
              <FormControl fullWidth size="small">
                <InputLabel disabled={disabled} id="billing_info.email">
                  E-mail
                </InputLabel>
                <Select
                  disabled={disabled}
                  labelId="billing_info.email"
                  id="billing_info.email"
                  name="billing_info.email"
                  value={formik.values.billing_info.email}
                  label="E-mail"
                  onChange={formik.handleChange}
                >
                  {allEmail.map((email, index) => (
                    <MenuItem key={index} value={email}>
                      {email}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                autoComplete="off"
                type="text"
                id="billing_info.email"
                name="billing_info.email"
                value={formik.values.billing_info.email}
                onChange={formik.handleChange}
                disabled={disabled}
                size="small"
                label="E-mail"
                fullWidth
              />
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <TextField
              autoComplete="off"
              type="text"
              id="billing_info.tax_no"
              name="billing_info.tax_no"
              value={formik.values.billing_info.tax_no}
              onChange={formik.handleChange}
              disabled={true}
              size="small"
              label="เลขประจำตัวผู้เสียภาษี"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            {allPhone.length > 0 ? (
              <FormControl fullWidth size="small">
                <InputLabel disabled={disabled} id="billing_info.phone">
                  เบอร์โทรศัพท์
                </InputLabel>
                <Select
                  disabled={disabled}
                  labelId="billing_info.phone"
                  id="billing_info.phone"
                  name="billing_info.phone"
                  value={formik.values.billing_info.phone}
                  label="เบอร์โทรศัพท์"
                  onChange={formik.handleChange}
                >
                  {allPhone.map((phone, index) => (
                    <MenuItem key={index} value={phone}>
                      {phone}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                autoComplete="off"
                type="text"
                id="billing_info.phone"
                name="billing_info.phone"
                value={formik.values.billing_info.phone}
                onChange={formik.handleChange}
                disabled={disabled}
                size="small"
                label="เบอร์โทรศัพท์"
                fullWidth
              />
            )}
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            {allFax.length > 0 ? (
              <FormControl fullWidth size="small">
                <InputLabel disabled={disabled} id="billing_info.fax">
                  โทรสาร
                </InputLabel>
                <Select
                  disabled={disabled}
                  labelId="billing_info.fax"
                  id="billing_info.fax"
                  name="billing_info.fax"
                  value={formik.values.billing_info.fax}
                  label="โทรสาร"
                  onChange={formik.handleChange}
                >
                  {allFax.map((fax, index) => (
                    <MenuItem key={index} value={fax}>
                      {fax}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                autoComplete="off"
                type="text"
                id="billing_info.fax"
                name="billing_info.fax"
                value={formik.values.billing_info.fax}
                onChange={formik.handleChange}
                disabled={disabled}
                size="small"
                label="โทรสาร"
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
            <FormControl fullWidth size="small">
              <InputLabel disabled={disabled} id="billing_info.address_name">
                ที่อยู่
              </InputLabel>
              <Select
                disabled={disabled}
                labelId="billing_info.address_name"
                id="billing_info.address_name"
                name="billing_info.address_name"
                value={formik.values.billing_info.address_name}
                label="ที่อยู่"
                onChange={getAddressInformation}
              >
                {allAddress.length > 0 &&
                  allAddress.map((address, index) => (
                    <MenuItem key={index} value={address.address_name}>
                      {address.address_name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
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
              id="billing_info.building"
              name="billing_info.building"
              value={formik.values.billing_info.building}
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
              id="billing_info.house_no"
              name="billing_info.house_no"
              value={formik.values.billing_info.house_no}
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
              id="billing_info.village_no"
              name="billing_info.village_no"
              value={formik.values.billing_info.village_no}
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
              id="billing_info.road"
              name="billing_info.road"
              value={formik.values.billing_info.road}
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
              id="billing_info.country"
              name="billing_info.country"
              value={formik.values.billing_info.country}
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
              id="billing_info.postal_code"
              name="billing_info.postal_code"
              value={formik.values.billing_info.postal_code}
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
              id="billing_info.province"
              name="billing_info.province"
              value={formik.values.billing_info.province}
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
              id="billing_info.sub_district"
              name="billing_info.sub_district"
              value={formik.values.billing_info.sub_district}
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
              id="billing_info.district"
              name="billing_info.district"
              value={formik.values.billing_info.district}
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
};

export default BillingNoteForm;
