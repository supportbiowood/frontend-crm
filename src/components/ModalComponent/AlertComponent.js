import React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import AlertSVG from "../../images/alert.svg";
import { Button } from "@mui/material";

export default function PopUpAlertComponent({ ...props }) {
  return (
    <Modal
      className="pop-up-alert"
      open={props.status}
      onClose={props.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="pop-up-alert__header">
          <div className="pop-up-alert__header-text">
            <img src={AlertSVG} alt="AlertSVG" />
            {props.title}
          </div>
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            style={{ position: "absolute", top: "15px", right: "10px" }}
            onClick={() => {
              props.setOpen(false);
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </div>
        <div className="pop-up-alert__btn-wrapper">
          <Button
            sx={{ marginRight: "16px" }}
            variant="outlined"
            color="success"
            type="button"
            onClick={props.deleteButtonOnClick}
          >
            ลบ
          </Button>
          <Button
            variant="contained"
            color="success"
            type="button"
            onClick={() => {
              props.setOpen(false);
            }}
          >
            ทวนอีกครั้ง
          </Button>
        </div>
      </Box>
    </Modal>
  );
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  borderRadius: "20px",
  boxShadow: 24,
  p: 4,
  padding: "30px 32px 32px 32px",
};
