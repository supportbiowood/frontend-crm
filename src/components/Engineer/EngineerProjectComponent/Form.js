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
      formik.setFieldValue("project_info.project_id", project.project_id);
      formik.setFieldValue(
        "project_info.project_document_id",
        project.project_document_id
      );
      formik.setFieldValue("project_info.project_name", project.project_name);
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

      formik.setFieldValue("project_info.contact_id", formatContact.contact_id);
      formik.setFieldValue(
        "project_info.contact_name",
        formatContact.contact_name
      );
      formik.setFieldValue("project_info.tax_no", formatContact.contact_tax_no);
      formik.setFieldValue("project_info.fax", "");
      formik.setFieldValue("project_info.email", "");
      formik.setFieldValue("project_info.phone", "");
      formik.setFieldValue("project_info.address_name", "");
      formik.setFieldValue("project_info.building", "");
      formik.setFieldValue("project_info.house_no", "");
      formik.setFieldValue("project_info.village_no", "");
      formik.setFieldValue("project_info.road", "");
      formik.setFieldValue("project_info.country", "");
      formik.setFieldValue("project_info.postal_code", "");
      formik.setFieldValue("project_info.province", "");
      formik.setFieldValue("project_info.sub_district", "");
      formik.setFieldValue("project_info.district", "");
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
    formik.setFieldValue("project_info.address_name", findAddress.address_name);
    formik.setFieldValue("project_info.building", findAddress.building);
    formik.setFieldValue("project_info.house_no", findAddress.house_no);
    formik.setFieldValue("project_info.village_no", findAddress.village_no);
    formik.setFieldValue("project_info.road", findAddress.road);
    formik.setFieldValue("project_info.country", findAddress.country);
    formik.setFieldValue("project_info.postal_code", findAddress.postal_code);
    formik.setFieldValue("project_info.province", findAddress.province);
    formik.setFieldValue("project_info.sub_district", findAddress.sub_district);
    formik.setFieldValue("project_info.district", findAddress.district);
  };

  const projectValue = formik.values.project_info.project_id
    ? {
        project_id: formik.values.project_info.project_id,
        project_name:
          formik.values.project_info.project_document_id +
          " " +
          formik.values.project_info.project_name,
      }
    : {
        project_id: "",
        project_name: "",
      };

  const contactValue = formik.values.project_info.contact_id
    ? {
        contact_id: formik.values.project_info.contact_id,
        contact_name: formik.values.project_info.contact_name,
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
              id="project_info.project_id"
              name="project_info.project_id"
              size="small"
              options={projectOptions}
              freeSolo
              value={projectValue}
              onChange={(_, value) => {
                if (value !== null) {
                  getProjectInformation(parseInt(value.project_id));
                } else {
                  formik.setFieldValue("project_info.project_id", "");
                  formik.setFieldValue("project_info.project_name", "");
                  formik.setFieldValue("project_info.contact_id", "");
                  formik.setFieldValue("project_info.contact_name", "");
                  formik.setFieldValue("project_info.phone", "");
                  formik.setFieldValue("project_info.email", "");
                  formik.setFieldValue("project_info.fax", "");
                  formik.setFieldValue("project_info.tax_no", "");
                  formik.setFieldValue("project_info.address_name", "");
                  formik.setFieldValue("project_info.building", "");
                  formik.setFieldValue("project_info.house_no", "");
                  formik.setFieldValue("project_info.village_no", "");
                  formik.setFieldValue("project_info.road", "");
                  formik.setFieldValue("project_info.country", "");
                  formik.setFieldValue("project_info.postal_code", "");
                  formik.setFieldValue("project_info.province", "");
                  formik.setFieldValue("project_info.sub_district", "");
                  formik.setFieldValue("project_info.district", "");
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
              id="project_info.contact_id"
              name="project_info.contact_id"
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
                  formik.setFieldValue("project_info.contact_id", "");
                  formik.setFieldValue("project_info.contact_name", "");
                  formik.setFieldValue("project_info.tax_no", "");
                  formik.setFieldValue("project_info.email", "");
                  formik.setFieldValue("project_info.phone", "");
                  formik.setFieldValue("project_info.fax", "");
                  formik.setFieldValue("project_info.address_name", "");
                  formik.setFieldValue("project_info.building", "");
                  formik.setFieldValue("project_info.house_no", "");
                  formik.setFieldValue("project_info.village_no", "");
                  formik.setFieldValue("project_info.road", "");
                  formik.setFieldValue("project_info.country", "");
                  formik.setFieldValue("project_info.postal_code", "");
                  formik.setFieldValue("project_info.province", "");
                  formik.setFieldValue("project_info.sub_district", "");
                  formik.setFieldValue("project_info.district", "");
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
              id="project_info.project_name"
              name="project_info.project_name"
              value={formik.values.project_info.project_name}
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
              id="project_info.contact_name"
              name="project_info.contact_name"
              value={formik.values.project_info.contact_name}
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
              id="project_info.tax_no"
              name="project_info.tax_no"
              value={formik.values.project_info.tax_no}
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
                <InputLabel disabled={disabled} id="project_info.email">
                  E-mail
                </InputLabel>
                <Select
                  disabled={disabled}
                  labelId="project_info.email"
                  id="project_info.email"
                  name="project_info.email"
                  value={formik.values.project_info.email}
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
                id="project_info.email"
                name="project_info.email"
                value={formik.values.project_info.email}
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
                <InputLabel disabled={disabled} id="project_info.phone">
                  เบอร์โทรศัพท์
                </InputLabel>
                <Select
                  disabled={disabled}
                  labelId="project_info.phone"
                  id="project_info.phone"
                  name="project_info.phone"
                  value={formik.values.project_info.phone}
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
                id="project_info.phone"
                name="project_info.phone"
                value={formik.values.project_info.phone}
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
              id="project_info.fax"
              name="project_info.fax"
              value={formik.values.project_info.fax}
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
                <InputLabel disabled={disabled} id="project_info.address_name">
                  ที่อยู่
                </InputLabel>
                <Select
                  disabled={disabled}
                  labelId="project_info.address_name"
                  id="project_info.address_name"
                  name="project_info.address_name"
                  value={formik.values.project_info.address_name}
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
                id="project_info.address_name"
                name="project_info.address_name"
                value={formik.values.project_info.address_name}
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
              id="project_info.building"
              name="project_info.building"
              value={formik.values.project_info.building}
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
              id="project_info.house_no"
              name="project_info.house_no"
              value={formik.values.project_info.house_no}
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
              id="project_info.village_no"
              name="project_info.village_no"
              value={formik.values.project_info.village_no}
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
              id="project_info.road"
              name="project_info.road"
              value={formik.values.project_info.road}
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
              id="project_info.country"
              name="project_info.country"
              value={formik.values.project_info.country}
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
              id="project_info.postal_code"
              name="project_info.postal_code"
              value={formik.values.project_info.postal_code}
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
              id="project_info.province"
              name="project_info.province"
              value={formik.values.project_info.province}
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
              id="project_info.sub_district"
              name="project_info.sub_district"
              value={formik.values.project_info.sub_district}
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
              id="project_info.district"
              name="project_info.district"
              value={formik.values.project_info.district}
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
