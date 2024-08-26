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
        customer: false,
        items: false,
        remark: false,
        summary: false,
        creditNoteTab: true,
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
        customer: false,
        items: false,
        remark: false,
        summary: false,
        creditNoteTab: true,
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
          customer: false,
          items: false,
          remark: false,
          summary: false,
          creditNoteTab: true,
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
          customer: true,
          items: true,
          remark: true,
          summary: true,
          creditNoteTab: true,
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
        customer: false,
        items: false,
        remark: false,
        summary: false,
        creditNoteTab: true,
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
        customer: true,
        items: true,
        remark: true,
        summary: true,
        creditNoteTab: false,
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
        customer: true,
        items: true,
        remark: true,
        creditNoteTab: false,
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
        customer: true,
        items: true,
        remark: true,
        summary: true,
        creditNoteTab: true,
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
        customer: true,
        items: true,
        remark: true,
        summary: true,
        creditNoteTab: true,
      });
  }
};
