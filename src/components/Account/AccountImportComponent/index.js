import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import PurchaseRequestTable from "./PurchaseRequestTable";
import SalesOrderTable from "./SalesOrderTable";

const AccountImportComponent = ({
  open,
  handleClose,
  title,
  submitButtonLabel,
  handleSubmit,
  contact_id,
  setSelectedImportdocument,
  purchaseRequest,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {purchaseRequest ? (
            <PurchaseRequestTable
              setSelectedImportdocument={setSelectedImportdocument}
            />
          ) : (
            <SalesOrderTable
              contact_id={contact_id}
              setSelectedImportdocument={setSelectedImportdocument}
            />
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} autoFocus>
          {submitButtonLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccountImportComponent;
