import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  MenuItem,
  DialogTitle,
  DialogContent,
  InputLabel,
  Select,
  FormControl,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export default function ModalAddCustodianComponent(props) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState();
  const [errors, setErrors] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function filterEmployee(e) {
    const obj = props.employeeList;
    const newObj =
      obj &&
      obj.filter((a) => {
        return a.employee_id === e;
      });
    setFilter(newObj);
  }

  const handleClick = () => {
    const isDuplicate =
      props.values.project_employee_list.filter(
        (data) => data.employee_id === filter[0].employee_id
      ).length > 0;
    if (isDuplicate) return setErrors(true);
    const Clone = [...props.values.project_employee_list];
    Clone.push(filter[0]);
    props.setFieldValue("project_employee_list", Clone);
    handleClose();
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen} color="success">
        เพิ่มผู้รับผิดชอบ
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            ผู้รับผิดชอบ
            <IconButton type="button" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </h2>
        </DialogTitle>
        <DialogContent>
          <FormControl errors={errors} fullWidth size="small">
            <InputLabel id="demo-simple-select-label">ชื่อ นามสกุล</InputLabel>
            <Select
              fullWidth
              size="small"
              id="demo-simple-select"
              sx={{ width: "250px" }}
              label="ชื่อ นามสกุล"
              onChange={(e) => {
                filterEmployee(e.target.value);
              }}
            >
              {props.employeeList &&
                props.employeeList.map((employee, i) => {
                  return (
                    <MenuItem value={employee.employee_id} key={i}>
                      <div>{`${employee.employee_firstname} ${employee.employee_lastname}`}</div>
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <div className="sale-crm-popupAddcontact__footer-button">
            <Button
              variant="contained"
              type="submit"
              color="success"
              sx={{ width: "130px", backgroundColor: "rgba(65, 150, 68, 1)" }}
              onClick={handleClick}
            >
              เพิ่มผู้รับผิดชอบ
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}
