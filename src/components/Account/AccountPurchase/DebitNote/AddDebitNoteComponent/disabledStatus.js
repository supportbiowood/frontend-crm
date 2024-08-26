export const disabledStatus = (status, setDisabled, editButtonClick) => {
  switch (status) {
    case "create": {
      setDisabled({
        reason: false,
        print: true,
        options: true,
        editButton: true,
        cancelButton: true,
        date: false,
        externalRef: false,
        vendor: false,
        items: false,
        remark: false,
        summary: false,
        debitNoteTab: true,
      });
      break;
    }
    case "draft":
      setDisabled({
        reason: false,
        print: false,
        options: false,
        editButton: true,
        cancelButton: false,
        date: false,
        externalRef: false,
        vendor: false,
        items: false,
        remark: false,
        summary: false,
        debitNoteTab: true,
      });
      break;
    case "wait_approve": {
      if (editButtonClick) {
        setDisabled({
          reason: false,
          print: false,
          options: false,
          editButton: true,
          cancelButton: false,
          date: false,
          externalRef: false,
          vendor: false,
          items: false,
          remark: false,
          summary: false,
          debitNoteTab: true,
        });
      } else {
        setDisabled({
          reason: true,
          print: false,
          options: false,
          create: true,
          editButton: false,
          cancelButton: false,
          date: true,
          externalRef: true,
          vendor: true,
          items: true,
          remark: true,
          summary: true,
          debitNoteTab: true,
        });
      }
      break;
    }
    case "not_approve":
      setDisabled({
        reason: false,
        print: false,
        options: false,
        create: true,
        editButton: true,
        cancelButton: false,
        date: false,
        externalRef: false,
        vendor: false,
        items: false,
        remark: false,
        summary: false,
        debitNoteTab: true,
      });
      break;
    case "approved":
      setDisabled({
        reason: true,
        print: false,
        options: false,
        create: false,
        editButton: true,
        cancelButton: false,
        date: true,
        externalRef: true,
        vendor: true,
        items: true,
        remark: true,
        summary: true,
        debitNoteTab: false,
      });
      break;
    case "closed":
      setDisabled({
        reason: true,
        print: false,
        options: false,
        create: false,
        editButton: true,
        cancelButton: true,
        date: true,
        externalRef: true,
        vendor: true,
        items: true,
        remark: true,
        debitNoteTab: false,
      });
      break;
    case "cancelled":
      setDisabled({
        reason: true,
        print: false,
        options: false,
        create: true,
        editButton: true,
        cancelButton: true,
        date: true,
        externalRef: true,
        vendor: true,
        items: true,
        remark: true,
        summary: true,
        debitNoteTab: true,
      });
      break;
    default:
      setDisabled({
        reason: true,
        print: false,
        options: true,
        editButton: true,
        cancelButton: true,
        date: true,
        externalRef: true,
        vendor: true,
        items: true,
        remark: true,
        summary: true,
        debitNoteTab: true,
      });
  }
};
