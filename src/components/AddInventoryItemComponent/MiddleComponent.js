import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Tabs, Tab } from "@mui/material";
import CommonComponent from "./CommonComponent";
import UnitComponent from "./UnitComponent";
import SaleComponent from "./SaleComponent";
import PurchaseComponent from "./PurchaseComponent";
import SpacificInfoComponent from "./SpacificInfoComponent";
import { styled } from "@mui/styles";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const CustomTabs = styled(Tabs)({
  "& .MuiTabs-indicator": {
    display: "none",
    backgroundColor: "unset",
  },
});

const CustomTabPanel = styled(TabPanel)({
  "& .MuiBox-root": {
    padding: "0px !important",
  },
});

const CustomTab = styled((props) => <Tab disableRipple {...props} />)(
  ({ theme }) => ({
    border: "1px solid rgba(190, 190, 190, 1) ",
    width: "139px !important",
    borderRadius: "5px 5px 0 0 !important",
    color: "rgba(190, 190, 190, 1) ",
    marginTop: "15px !important",
    padding: "12px 16px !important",
    "&.Mui-selected": {
      zIndex: 1,
      heigth: "120%",
      padding: "10px 20px",
      marginTop: "0px !important",
      boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.25)",
      borderRadius: "5px 5px 0 0 ",
      border: "1px solid black",
      fontWeight: "bold",
      fontSize: "16px",
      lineHeight: "26px",
      color: "black ",
    },
  })
);

export default function MiddleComponent(props) {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <CustomTabs
        value={value}
        onChange={handleChange}
        aria-label="basic tabs example"
      >
        <CustomTab
          sx={
            (props.errors.listSaleUOM &&
              props.touched.listSaleUOM && {
                borderColor: "#d32f2f !important",
                color: "#d32f2f !important",
              }) ||
            (props.errors.itemCategory &&
              props.touched.listSaleUOM && {
                borderColor: "#d32f2f !important",
                color: "#d32f2f !important",
              })
          }
          label="ทั่วไป"
          {...a11yProps(0)}
        />
        <CustomTab
          sx={
            (props.errors.uomGroupID &&
              props.touched.uomGroupID && {
                borderColor: "#d32f2f !important",
                color: "#d32f2f !important",
              },
            props.errors.purchaseUOMID &&
              props.touched.purchaseUOMID && {
                borderColor: "#d32f2f !important",
                color: "#d32f2f !important",
              },
            props.errors.saleUOMID &&
              props.touched.saleUOMID && {
                borderColor: "#d32f2f !important",
                color: "#d32f2f !important",
              })
          }
          label="หน่วย"
          {...a11yProps(1)}
        />
        <CustomTab
          sx={
            props.errors.saleUnitPrice &&
            props.touched.saleUnitPrice && {
              borderColor: "#d32f2f !important",
              color: "#d32f2f !important",
            }
          }
          label="ขาย"
          {...a11yProps(2)}
        />
        <CustomTab
          sx={
            props.errors.purchaseUnitPrice &&
            props.touched.purchaseUnitPrice && {
              borderColor: "#d32f2f !important",
              color: "#d32f2f !important",
            }
          }
          label="จัดซื้อ"
          {...a11yProps(3)}
        />
        <CustomTab
          sx={
            props.errors.itemPropertyList &&
            props.touched.itemPropertyList && {
              borderColor: "#d32f2f !important",
              color: "#d32f2f !important",
            }
          }
          label="ข้อมูลเฉพาะ"
          {...a11yProps(4)}
        />
      </CustomTabs>
      <TabPanel value={value} index={0}>
        <CommonComponent
          values={props.values}
          errors={props.errors}
          touched={props.touched}
          handleChange={props.handleChange}
          handleBlur={props.handleBlur}
          setFieldValue={props.setFieldValue}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <UnitComponent
          values={props.values}
          errors={props.errors}
          touched={props.touched}
          handleChange={props.handleChange}
          handleBlur={props.handleBlur}
          setFieldValue={props.setFieldValue}
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <SaleComponent
          values={props.values}
          errors={props.errors}
          touched={props.touched}
          handleChange={props.handleChange}
          handleBlur={props.handleBlur}
          setFieldValue={props.setFieldValue}
        />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <PurchaseComponent
          values={props.values}
          errors={props.errors}
          touched={props.touched}
          handleChange={props.handleChange}
          handleBlur={props.handleBlur}
          setFieldValue={props.setFieldValue}
        />
      </TabPanel>
      <CustomTabPanel value={value} index={4}>
        <SpacificInfoComponent
          values={props.values}
          errors={props.errors}
          touched={props.touched}
          handleChange={props.handleChange}
          handleBlur={props.handleBlur}
          setFieldValue={props.setFieldValue}
        />
      </CustomTabPanel>
    </div>
  );
}
