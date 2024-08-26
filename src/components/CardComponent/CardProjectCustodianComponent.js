import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  MenuItem,
  DialogTitle,
  InputLabel,
  Select,
  FormControl,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { DialogContent } from "@mui/material";
import Placeholder from "../../images/placeholder.jpeg";

export default function CardProjectCustodianComponent(props) {
  const [filter, setFilter] = useState();
  const [open, setOpen] = useState(false);
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
    console.log(newObj);
  }

  const handleClick = () => {
    const Clone = [...props.values.project_employee_list];
    Clone[props.ID] = filter[0];
    props.setFieldValue("project_employee_list", Clone);
    handleClose();
  };

  const handleDelete = (id) => {
    const Clone = [...props.values.project_employee_list];
    const filter = Clone.filter((_, index) => {
      return index !== id;
    });
    props.setFieldValue("project_employee_list", filter);
  };

  return (
    <>
      <div className="card-contact" onClick={handleClickOpen}>
        <div className="container">
          <div className="left-side">
            {/* <div className="image-preview">
              <img
                className="image-user"
                src={props.values.project_employee_list[props.ID].employee_img_url}
                alt=""
                srcSet=""
              />
            </div> */}
            <div
              className="img_display"
              style={{
                backgroundImage: `url(${
                  props.values.project_employee_list[props.ID] &&
                  props.values.project_employee_list[props.ID].employee_img_url
                    ? props.values.project_employee_list[props.ID]
                        .employee_img_url
                    : Placeholder
                })`,
              }}
            />
          </div>
          <div className="right-side">
            <div className="topic">
              {props.ID === 0 && <div>ผู้รับผิดชอบหลัก</div>}
              {props.ID >= 1 && <div>ผู้รับผิดชอบร่วม</div>}
            </div>
            <div>
              ชื่อ นามสกุล:{" "}
              {`${
                props.values.project_employee_list[props.ID].employee_firstname
              }  ${
                props.values.project_employee_list[props.ID].employee_lastname
              }`}
            </div>
            <div>
              ตำแหน่ง:{" "}
              {props.values.project_employee_list[props.ID].employee_position}
            </div>
          </div>
        </div>
      </div>
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
          <FormControl fullWidth size="small">
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
            {props.ID >= 1 && (
              <Button
                variant="outlined"
                type="submit"
                color="success"
                sx={{ width: "130px", marginRight: "16px" }}
                onClick={() => handleDelete(props.ID)}
              >
                ลบ
              </Button>
            )}
            <Button
              variant="contained"
              type="submit"
              color="success"
              sx={{ width: "130px", backgroundColor: "rgba(65, 150, 68, 1)" }}
              onClick={handleClick}
            >
              บันทึก
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}
