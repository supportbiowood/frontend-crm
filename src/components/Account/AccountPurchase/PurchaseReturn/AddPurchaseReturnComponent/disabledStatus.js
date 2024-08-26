export const disabledStatus = (status, setDisabled, editButtonClick) => {
  switch (status) {
    case "create":
      setDisabled({
        reason: false,
        options: false,
        create: true,
        editButton: true,
        cancelButton: false,
        date: false,
        externalRef: false,
        vendor: false,
        items: false,
        remark: false,
      });
      break;
    case "draft":
      setDisabled({
        reason: false,
        options: false,
        create: true,
        editButton: true,
        cancelButton: false,
        date: false,
        externalRef: false,
        vendor: false,
        items: false,
        remark: false,
      });
      break;
    case "wait_approve": {
      if (editButtonClick) {
        setDisabled({
          reason: false,
          options: false,
          create: true,
          editButton: true,
          cancelButton: false,
          date: false,
          externalRef: false,
          vendor: false,
          items: false,
          remark: false,
        });
      } else {
        setDisabled({
          reason: true,
          options: false,
          create: true,
          editButton: false,
          cancelButton: false,
          date: true,
          externalRef: true,
          vendor: true,
          items: true,
          remark: true,
        });
      }
      break;
    }
    case "not_approve":
      setDisabled({
        reason: false,
        options: false,
        create: true,
        editButton: true,
        cancelButton: false,
        date: false,
        externalRef: false,
        vendor: false,
        items: false,
        remark: false,
      });
      break;
    case "approved":
      setDisabled({
        reason: true,
        options: false,
        create: false,
        editButton: true,
        cancelButton: false,
        date: true,
        externalRef: true,
        vendor: true,
        items: true,
        remark: true,
      });
      break;
    case "closed":
      setDisabled({
        reason: true,
        options: false,
        create: false,
        editButton: true,
        cancelButton: true,
        date: true,
        externalRef: true,
        vendor: true,
        items: true,
        remark: true,
      });
      break;
    case "cancelled":
      setDisabled({
        reason: true,
        options: false,
        create: true,
        editButton: true,
        cancelButton: true,
        date: true,
        externalRef: true,
        vendor: true,
        items: true,
        remark: true,
      });
      break;
    default:
      setDisabled({
        reason: true,
        options: true,
        create: true,
        editButton: true,
        cancelButton: true,
        date: true,
        externalRef: true,
        vendor: true,
        items: true,
        remark: true,
      });
  }
};
