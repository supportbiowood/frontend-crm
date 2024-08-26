export const disabledStatus = (status, setDisabled, editButtonClick) => {
  switch (status) {
    case "create": {
      setDisabled({
        print: true,
        options: true,
        create: true,
        cancelButton: true,
        editButton: true,
        date: false,
        target: false,
        items: false,
        remark: false,
      });
      break;
    }
    case "draft":
      setDisabled({
        print: false,
        options: false,
        create: true,
        cancelButton: true,
        editButton: true,
        date: false,
        target: false,
        items: false,
        remark: false,
      });
      break;
    case "wait_approve": {
      if (editButtonClick) {
        setDisabled({
          print: false,
          options: false,
          create: true,
          cancelButton: false,
          editButton: true,
          date: false,
          target: false,
          items: false,
          remark: false,
        });
      } else {
        setDisabled({
          print: false,
          options: false,
          create: true,
          cancelButton: false,
          editButton: false,
          date: true,
          target: true,
          items: true,
          remark: true,
        });
      }
      break;
    }
    case "not_approve":
      setDisabled({
        print: false,
        options: false,
        create: true,
        cancelButton: false,
        editButton: true,
        date: false,
        target: false,
        items: false,
        remark: false,
      });
      break;
    case "approved":
      setDisabled({
        print: false,
        options: false,
        create: false,
        cancelButton: false,
        editButton: true,
        date: true,
        target: true,
        items: true,
        remark: true,
      });
      break;
    case "ordering":
      setDisabled({
        print: false,
        options: false,
        create: true,
        cancelButton: true,
        editButton: true,
        date: true,
        target: true,
        items: true,
        remark: true,
      });
      break;
    case "fully_order":
      setDisabled({
        print: false,
        options: false,
        create: true,
        cancelButton: true,
        editButton: true,
        date: true,
        target: true,
        items: true,
        remark: true,
      });
      break;
    case "cancelled":
      setDisabled({
        print: false,
        options: false,
        create: true,
        cancelButton: true,
        editButton: true,
        date: true,
        target: true,
        items: true,
        remark: true,
      });
      break;
    case "expired":
      setDisabled({
        print: false,
        options: true,
        create: true,
        cancelButton: true,
        editButton: true,
        date: true,
        target: true,
        items: true,
        remark: true,
      });
      break;
    default:
      setDisabled({
        print: false,
        options: true,
        create: true,
        cancelButton: true,
        editButton: true,
        date: true,
        target: true,
        items: true,
        remark: true,
      });
  }
};
