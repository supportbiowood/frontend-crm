import React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function AccountSplitButtonComponent({
  options,
  defaultButtonValue,
  disabled,
  disabledCancelButton,
  disabledEditButton,
  handleMenuItemClick,
  anchorEl,
  open = false, // ตั้งค่า default เป็น false
  handleOpen,
  handleClose,
  variant,
}) {
  return (
    <>
      <Button
        disabled={disabled}
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant={variant}
        disableElevation
        onClick={handleOpen}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {defaultButtonValue ? defaultButtonValue : options[0]}
      </Button>
      <Menu
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open} // ใช้ prop open ที่รับค่า default เป็น false
        onClose={handleClose}
      >
        {options.map((option, index) =>
          option === "แก้ไข" ? (
            <MenuItem
              disabled={disabledEditButton}
              key={index}
              onClick={(event) => handleMenuItemClick(event, index)}
              disableRipple
            >
              {option}
            </MenuItem>
          ) : option === "ยกเลิก" ? (
            <MenuItem
              disabled={disabledCancelButton}
              key={index}
              onClick={(event) => handleMenuItemClick(event, index)}
              disableRipple
            >
              {option}
            </MenuItem>
          ) : (
            <MenuItem
              key={index}
              onClick={(event) => handleMenuItemClick(event, index)}
              disableRipple
            >
              {option}
            </MenuItem>
          )
        )}
      </Menu>
    </>
  );
}
