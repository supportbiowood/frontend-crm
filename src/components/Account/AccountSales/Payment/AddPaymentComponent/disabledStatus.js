export const disabledStatus = (
  status,
  setDisabled,
  setCancel,
  editButtonClick
) => {
  switch (status) {
    case "create":
      setDisabled({
        print: true,
        options: false,
        editButton: true,
        cancelButton: false,
        date: false,
        remark: false,
        payment: false,
        upload: false,
      });
      setCancel(false);
      break;
    case "draft":
      setDisabled({
        print: false,
        options: false,
        editButton: true,
        cancelButton: false,
        date: false,
        remark: false,
        payment: false,
        upload: false,
      });
      setCancel(false);
      break;
    case "payment_complete":
      if (editButtonClick) {
        setDisabled({
          print: false,
          options: false,
          editButton: true,
          cancelButton: false,
          date: false,
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
          remark: true,
          payment: true,
          upload: true,
        });
      }
      setCancel(false);
      break;
    case "cancelled":
      setDisabled({
        print: false,
        options: true,
        editButton: true,
        cancelButton: true,
        date: false,
        remark: false,
        payment: false,
        upload: false,
      });
      setCancel(true);
      break;
    default:
      setDisabled({
        print: false,
        options: true,
        editButton: true,
        cancelButton: true,
        date: true,
        remark: true,
        payment: true,
        upload: true,
      });
      setCancel(false);
  }
};
