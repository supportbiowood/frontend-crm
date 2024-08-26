export const disabledStatus = (status, setDisabled, editButtonClick) => {
  switch (status) {
    case "create":
      setDisabled({
        print: true,
        options: false,
        editButton: true,
        cancelButton: false,
        date: false,
        externalRef: false,
        remark: false,
        payment: false,
        upload: false,
      });
      break;
    case "draft":
      setDisabled({
        print: false,
        options: false,
        editButton: true,
        cancelButton: false,
        date: false,
        externalRef: false,
        remark: false,
        payment: false,
        upload: false,
      });
      break;
    case "payment_complete":
      if (editButtonClick) {
        setDisabled({
          print: false,
          options: false,
          editButton: true,
          cancelButton: false,
          date: false,
          externalRef: false,
          remark: false,
          payment: false,
          upload: false,
        });
      } else {
        setDisabled({
          print: false,
          options: false,
          editButton: false,
          cancelButton: false,
          date: true,
          externalRef: true,
          remark: true,
          payment: true,
          upload: true,
        });
      }
      break;
    case "cancelled":
      setDisabled({
        print: false,
        options: true,
        editButton: true,
        cancelButton: true,
        date: false,
        externalRef: false,
        remark: false,
        payment: false,
        upload: false,
      });
      break;
    default:
      setDisabled({
        print: false,
        options: true,
        editButton: true,
        cancelButton: true,
        date: true,
        externalRef: true,
        remark: true,
        payment: true,
        upload: true,
      });
  }
};
