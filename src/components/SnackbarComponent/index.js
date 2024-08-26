// components/Snackbar.js or whatever you wanna call it
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import { clearSnackbar } from "../../redux/actions/snackbarActions";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SnackbarComponent() {
  const dispatch = useDispatch();

  const { snackbarMessage, snackbarDescription, snackbarOpen, snackbarType } =
    useSelector((state) => state.content);

  function handleClose() {
    dispatch(clearSnackbar());
  }

  const checkingSnackbarType = (checkSnackbarType) => {
    switch (checkSnackbarType) {
      case "success":
        return (
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            <p>{snackbarMessage}</p>
            {snackbarDescription && <p>{snackbarDescription}</p>}
          </Alert>
        );
      case "error":
        return (
          <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
            <p>{snackbarMessage}</p>
            {snackbarDescription && <p>{snackbarDescription}</p>}
          </Alert>
        );
      case "info":
        return (
          <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
            <p>{snackbarMessage}</p>
            {snackbarDescription && <p>{snackbarDescription}</p>}
          </Alert>
        );
      default:
        return (
          <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
            <p>{snackbarMessage}</p>
            {snackbarDescription && <p>{snackbarDescription}</p>}
          </Alert>
        );
    }
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      open={snackbarOpen}
      autoHideDuration={4000}
      onClose={handleClose}
    >
      {checkingSnackbarType(snackbarType)}
    </Snackbar>
  );
}
