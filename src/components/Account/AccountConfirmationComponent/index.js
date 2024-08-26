import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";

export default function AccountConfirmationComponent({
  open,
  handleClose,
  handleSubmit,
  title,
  description,
  reason,
  formik,
}) {
  return (
    <Dialog
      open={open}
      fullWidth={true}
      maxWidth="xs"
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{ m: 0, p: 2 }}>
        {title}
        {handleClose ? (
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
      {description && (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {description}
          </DialogContentText>
          {reason && (
            <TextField
              fullWidth
              name="not_approve_reason"
              margin="normal"
              size="small"
              id="outlined-multiline-flexible"
              multiline
              onChange={formik.handleChange}
              value={formik.values.not_approve_reason}
              minRows={3}
              maxRows={6}
            />
          )}
        </DialogContent>
      )}
      <DialogActions sx={description ? null : { mt: 4 }}>
        <Button variant="outlined" onClick={handleClose}>
          ยกเลิก
        </Button>
        <Button
          variant="contained"
          type="submit"
          onClick={handleSubmit}
          autoFocus
        >
          ยืนยัน
        </Button>
      </DialogActions>
    </Dialog>
  );
}
