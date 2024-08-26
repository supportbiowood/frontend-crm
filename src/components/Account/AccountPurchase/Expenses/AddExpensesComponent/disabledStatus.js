export const disabledStatus = (status, setDisabled, editButtonClick) => {
  switch (status) {
    case "create": {
      setDisabled({
        print: true,
        options: true,
        create: true,
        edit: false,
        cancelButton: true,
        editButton: true,
        paymentTab: true,
      });
      break;
    }
    case "draft":
      setDisabled({
        print: false,
        options: false,
        create: true,
        edit: false,
        cancelButton: true,
        editButton: true,
        paymentTab: true,
      });
      break;
    case "wait_payment":
      if (editButtonClick) {
        setDisabled({
          print: false,
          options: false,
          create: true,
          edit: false,
          cancelButton: false,
          editButton: true,
          paymentTab: true,
        });
      } else {
        setDisabled({
          print: false,
          options: false,
          create: false,
          edit: true,
          cancelButton: false,
          editButton: false,
          paymentTab: true,
        });
      }
      break;
    case "payment_complete":
      setDisabled({
        print: false,
        options: false,
        create: true,
        edit: true,
        cancelButton: true,
        editButton: true,
        paymentTab: true,
      });
      break;
    case "cancelled":
      setDisabled({
        print: false,
        options: false,
        create: true,
        edit: true,
        cancelButton: true,
        editButton: true,
        paymentTab: true,
      });
      break;
    case "expired":
      setDisabled({
        print: false,
        options: true,
        create: true,
        cancelButton: true,
        edit: true,
        editButton: true,
        paymentTab: true,
      });
      break;
    default:
      setDisabled({
        print: false,
        options: true,
        create: true,
        edit: true,
        cancelButton: true,
        editButton: true,
        paymentTab: true,
      });
  }
};
