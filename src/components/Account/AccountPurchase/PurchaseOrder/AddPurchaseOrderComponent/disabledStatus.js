export const disabledStatus = (status, setDisabled, editButtonClick) => {
  switch (status) {
    case "create": {
      setDisabled({
        print: true,
        options: true,
        create: true,
        editButton: true,
        cancelButton: true,
        date: false,
        externalRef: false,
        target: false,
        vendor: false,
        items: false,
        remark: false,
        summary: false,
      });
      break;
    }
    case "draft":
      setDisabled({
        print: false,
        options: false,
        create: true,
        editButton: true,
        cancelButton: false,
        date: false,
        externalRef: false,
        target: false,
        vendor: false,
        items: false,
        remark: false,
        summary: false,
      });
      break;
    case "wait_approve": {
      if (editButtonClick) {
        setDisabled({
          print: false,
          options: false,
          create: true,
          editButton: true,
          cancelButton: false,
          date: false,
          externalRef: false,
          target: false,
          vendor: false,
          items: false,
          remark: false,
          summary: false,
        });
      } else {
        setDisabled({
          print: false,
          options: false,
          create: true,
          editButton: false,
          cancelButton: false,
          date: true,
          externalRef: true,
          target: true,
          vendor: true,
          items: true,
          remark: true,
          summary: true,
        });
      }
      break;
    }
    case "not_approve":
      setDisabled({
        print: false,
        options: false,
        create: true,
        editButton: true,
        cancelButton: false,
        date: false,
        externalRef: false,
        target: false,
        vendor: false,
        items: false,
        remark: false,
        summary: false,
      });
      break;
    case "approved":
      setDisabled({
        print: false,
        options: false,
        create: false,
        editButton: true,
        cancelButton: false,
        date: true,
        externalRef: true,
        target: true,
        vendor: true,
        items: true,
        remark: true,
        summary: true,
      });
      break;
    case "importing":
      setDisabled({
        print: false,
        options: false,
        create: false,
        editButton: true,
        cancelButton: true,
        date: true,
        externalRef: true,
        target: true,
        vendor: true,
        items: true,
        remark: true,
        summary: true,
      });
      break;
    case "fully_import":
      setDisabled({
        print: false,
        options: false,
        create: false,
        editButton: true,
        cancelButton: true,
        date: true,
        externalRef: true,
        target: true,
        vendor: true,
        items: true,
        remark: true,
        summary: true,
      });
      break;
    case "cancelled":
      setDisabled({
        print: false,
        options: false,
        create: true,
        editButton: true,
        cancelButton: true,
        date: true,
        externalRef: true,
        target: true,
        vendor: true,
        items: true,
        remark: true,
        summary: true,
      });
      break;
    default:
      setDisabled({
        print: false,
        options: true,
        create: true,
        editButton: true,
        cancelButton: true,
        date: true,
        externalRef: true,
        target: true,
        vendor: true,
        items: true,
        remark: true,
        summary: true,
      });
  }
};
