export const disabledStatus = (status, setDisabled, editButtonClick) => {
  switch (status) {
    case "create": {
      setDisabled({
        print: true,
        options: true,
        edit: false,
        cancelButton: true,
        editButton: true,
        depositInvoiceTab: true,
      });
      break;
    }
    case "draft":
      setDisabled({
        print: false,
        options: false,
        edit: false,
        cancelButton: false,
        editButton: true,
        depositInvoiceTab: true,
      });
      break;
    case "wait_payment":
      if (editButtonClick) {
        setDisabled({
          print: false,
          options: false,
          edit: false,
          cancelButton: false,
          editButton: true,
          depositInvoiceTab: true,
        });
      } else {
        setDisabled({
          print: false,
          options: false,
          edit: true,
          cancelButton: false,
          editButton: false,
          depositInvoiceTab: true,
        });
      }
      break;
    case "payment_complete":
      setDisabled({
        print: false,
        options: false,
        edit: true,
        cancelButton: false,
        editButton: true,
        depositInvoiceTab: false,
      });
      break;
    case "closed":
      setDisabled({
        print: false,
        options: false,
        edit: true,
        cancelButton: false,
        editButton: true,
        depositInvoiceTab: false,
      });
      break;
    case "cancelled":
      setDisabled({
        print: false,
        options: false,
        edit: true,
        cancelButton: true,
        editButton: true,
        depositInvoiceTab: true,
      });
      break;
    default:
      setDisabled({
        print: false,
        options: true,
        edit: true,
        cancelButton: true,
        editButton: true,
        depositInvoiceTab: true,
      });
  }
};
