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
import { getContactById, getProjectById } from "../../../adapter/Api";

export default function SalesForm({
  disabled,
  formik,
  projects,
  contacts,
  projectId,
  error,
}) {
  const [allPhone, setAllPhone] = useState([]);
  const [allEmail, setAllEmail] = useState([]);
  const [selectedProject, setSelectedProject] = useState();
  const [selectedContact, setSelectedContact] = useState();
  const [allContactAddress, setAllContactAddress] = useState([]);
  const [allProjectAddress, setAllProjectAddress] = useState([]);
  const [allAddress, setAllAddress] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [contactOptions, setContactOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Scroll to error field
  useEffect(() => {
    if (!formik.isSubmitting) return;
    let keys = Object.keys(formik.errors);
    if (keys.length > 0) {
      const selector = `[name=${keys[0]}]`;
      const errorElement = document.querySelector(selector);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        errorElement.focus({ preventScroll: true });
      }
    }
  }, [formik.errors, formik.isSubmitting]);

  useEffect(() => {
    if (selectedProject) {
      const filterContacts = selectedProject.project_contact_list.filter(
        (contact) =>
          contact.contact_status !== "delete" &&
          contact.contact_is_customer === 1
      );

      const contactOptions = filterContacts.map((contact) => {
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
      setContactOptions(contactOptions);
    } else {
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
      setContactOptions(contactOptions);
    }
    if (selectedContact) {
      const filterProjects = selectedContact.project_list.filter(
        (project) =>
          project.project_status !== "finished" &&
          project.project_status !== "delete"
      );
      const projectOptions = filterProjects.map((project) => {
        return {
          project_id: project.project_id,
          project_name:
            project.project_document_id + " " + project.project_name,
        };
      });
      setProjectOptions(projectOptions);
    } else {
      const projectOptions = projects?.map((project) => {
        return {
          project_id: project.project_id,
          project_name:
            project.project_document_id + " " + project.project_name,
        };
      });
      setProjectOptions(projectOptions);
    }
  }, [contacts, projects, selectedContact, selectedProject]);

  useEffect(() => {
    if (selectedProject) {
      const addressList = [
        selectedProject.project_address,
        selectedProject.project_billing_address,
      ];
      setAllProjectAddress(addressList);
    }
    if (selectedContact) {
      const contactList = selectedContact.contact_channel_list;
      const filterPhoneContactList = contactList.filter(
        (contact) => contact.contact_channel_name === "เบอร์โทรศัพท์"
      );
      const filterEmailContactList = contactList.filter(
        (contact) => contact.contact_channel_name === "อีเมล"
      );
      const addressList = selectedContact.contact_address_list;
      setAllPhone(filterPhoneContactList);
      setAllEmail(filterEmailContactList);
      setAllContactAddress(addressList);
    }
  }, [projectId, projects, selectedContact, selectedProject]);

  useEffect(() => {
    if (
      allProjectAddress.length > 0 &&
      allProjectAddress.some(
        (address) => address.address_name.trim().length > 0
      ) &&
      allContactAddress.length === 0
    ) {
      setAllAddress(allProjectAddress);
    }
    if (
      allContactAddress.length > 0 &&
      allContactAddress.some(
        (address) => address.address_name.trim().length > 0
      ) &&
      allProjectAddress.length === 0
    ) {
      setAllAddress(allContactAddress);
    }
    if (allProjectAddress.length > 0 && allContactAddress.length > 0) {
      setAllAddress([...allProjectAddress, ...allContactAddress]);
    }
    if (allProjectAddress.length === 0 && allContactAddress.length === 0) {
      setAllAddress([]);
    }
  }, [allProjectAddress, allContactAddress]);

  const getProjectInformation = (project_id) => {
    setIsLoading(true);
    getProjectById(project_id).then((data) => {
      const project = data.data.data;
      const addressList = [
        project.project_address,
        project.project_billing_address,
      ];
      setAllProjectAddress(addressList);
      formik.setFieldValue("billing_info.project_id", project.project_id);
      formik.setFieldValue(
        "billing_info.project_document_id",
        project.project_document_id
      );
      formik.setFieldValue("billing_info.project_name", project.project_name);
      formik.setFieldValue("sale_list", project.project_employee_list);
      setSelectedProject(project);
      setIsLoading(false);
    });
  };

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
      const filterEmailContactList = contactList.filter(
        (contact) => contact.contact_channel_name === "อีเมล"
      );
      const addressList = formatContact.contact_address_list;
      setAllPhone(filterPhoneContactList);
      setAllEmail(filterEmailContactList);
      setAllContactAddress(addressList);

      formik.setFieldValue("billing_info.contact_id", formatContact.contact_id);
      formik.setFieldValue(
        "billing_info.contact_name",
        formatContact.contact_name
      );
      formik.setFieldValue("billing_info.tax_no", formatContact.contact_tax_no);
      formik.setFieldValue("billing_info.fax", "");
      formik.setFieldValue("billing_info.email", "");
      formik.setFieldValue("billing_info.phone", "");
      formik.setFieldValue("billing_info.address_name", "");
      formik.setFieldValue("billing_info.building", "");
      formik.setFieldValue("billing_info.house_no", "");
      formik.setFieldValue("billing_info.village_no", "");
      formik.setFieldValue("billing_info.road", "");
      formik.setFieldValue("billing_info.country", "");
      formik.setFieldValue("billing_info.postal_code", "");
      formik.setFieldValue("billing_info.province", "");
      formik.setFieldValue("billing_info.sub_district", "");
      formik.setFieldValue("billing_info.district", "");
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

  const projectValue = formik.values.billing_info.project_id
    ? {
        project_id: formik.values.billing_info.project_id,
        project_name:
          formik.values.billing_info.project_document_id +
          " " +
          formik.values.billing_info.project_name,
      }
    : {
        project_id: "",
        project_name: "",
      };

  const contactValue = formik.values.billing_info.contact_id
    ? {
        contact_id: formik.values.billing_info.contact_id,
        contact_name: formik.values.billing_info.contact_name,
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
              disablePortal
              disabled={disabled}
              id="billing_info.project_id"
              name="billing_info.project_id"
              size="small"
              options={projectOptions}
              freeSolo
              value={projectValue}
              onChange={(_, value) => {
                if (value !== null) {
                  getProjectInformation(parseInt(value.project_id));
                } else {
                  formik.setFieldValue("billing_info.project_id", "");
                  formik.setFieldValue("billing_info.project_name", "");
                  formik.setFieldValue("billing_info.contact_id", "");
                  formik.setFieldValue("billing_info.contact_name", "");
                  formik.setFieldValue("billing_info.phone", "");
                  formik.setFieldValue("billing_info.email", "");
                  formik.setFieldValue("billing_info.fax", "");
                  formik.setFieldValue("billing_info.tax_no", "");
                  formik.setFieldValue("billing_info.address_name", "");
                  formik.setFieldValue("billing_info.building", "");
                  formik.setFieldValue("billing_info.house_no", "");
                  formik.setFieldValue("billing_info.village_no", "");
                  formik.setFieldValue("billing_info.road", "");
                  formik.setFieldValue("billing_info.country", "");
                  formik.setFieldValue("billing_info.postal_code", "");
                  formik.setFieldValue("billing_info.province", "");
                  formik.setFieldValue("billing_info.sub_district", "");
                  formik.setFieldValue("billing_info.district", "");
                  formik.setFieldValue("sale_list", []);
                  setAllProjectAddress([]);
                  setAllContactAddress([]);
                  setAllPhone([]);
                  setAllEmail([]);
                }
              }}
              sx={{ width: "100%" }}
              getOptionLabel={(option) => option.project_name}
              isOptionEqualToValue={(option, value) =>
                option.project_id === value.project_id
              }
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.project_id}>
                    {option.project_name}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField {...params} label="เลือกโครงการ" />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4} xl={4}>
            <Autocomplete
              id="billing_info"
              name="billing_info"
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
              onChange={(_, value) => {
                formik.setErrors({});
                if (value !== null) {
                  getContactInformation(parseInt(value.contact_id));
                } else {
                  formik.setFieldValue("billing_info.contact_id", "");
                  formik.setFieldValue("billing_info.contact_name", "");
                  formik.setFieldValue("billing_info.tax_no", "");
                  formik.setFieldValue("billing_info.email", "");
                  formik.setFieldValue("billing_info.phone", "");
                  formik.setFieldValue("billing_info.fax", "");
                  formik.setFieldValue("billing_info.address_name", "");
                  formik.setFieldValue("billing_info.building", "");
                  formik.setFieldValue("billing_info.house_no", "");
                  formik.setFieldValue("billing_info.village_no", "");
                  formik.setFieldValue("billing_info.road", "");
                  formik.setFieldValue("billing_info.country", "");
                  formik.setFieldValue("billing_info.postal_code", "");
                  formik.setFieldValue("billing_info.province", "");
                  formik.setFieldValue("billing_info.sub_district", "");
                  formik.setFieldValue("billing_info.district", "");
                  setAllPhone([]);
                  setAllEmail([]);
                  setAllContactAddress([]);
                }
              }}
              sx={{ width: "100%" }}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.contact_id}>
                    {option.contact_name}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  error={error}
                  helperText={error}
                  {...params}
                  label="เลือกลูกค้า *"
                />
              )}
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
              id="billing_info.project_name"
              name="billing_info.project_name"
              value={formik.values.billing_info.project_name}
              onChange={formik.handleChange}
              disabled={true}
              size="small"
              label="ชื่อโครงการ"
              fullWidth
            />
          </Grid>
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
                  {allEmail.map((email) => (
                    <MenuItem
                      key={email.contact_channel_id}
                      value={email.contact_channel_detail}
                    >
                      {email.contact_channel_detail}
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
        </Grid>
      </Box>
      <Box
        sx={{
          mb: ".5rem",
        }}
      >
        <Grid container spacing={2}>
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
                id="billing_info.address_name"
                name="billing_info.address_name"
                value={formik.values.billing_info.address_name}
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
}
