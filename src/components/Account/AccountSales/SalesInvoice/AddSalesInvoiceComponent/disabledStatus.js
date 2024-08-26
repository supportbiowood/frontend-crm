export const disabledStatus = (
  status,
  setDisabled,
  setCancel,
  editButtonClick
) => {
  switch (status) {
    case "create": {
      setDisabled({
        print: true,
        options: true,
        create: true,
        editButton: true,
        cancelButton: true,
        date: false,
        customer: false,
        staff: false,
        items: false,
        remark: false,
        summary: false,
      });
      setCancel(false);
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
        customer: false,
        staff: false,
        items: false,
        remark: false,
        summary: false,
      });
      setCancel(false);
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
          customer: false,
          staff: false,
          items: false,
          remark: false,
          summary: false,
        });
        setCancel(false);
      } else {
        setDisabled({
          print: false,
          options: false,
          create: true,
          editButton: false,
          cancelButton: false,
          date: true,
          customer: true,
          staff: true,
          items: true,
          remark: true,
          summary: true,
        });
        setCancel(false);
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
        customer: false,
        staff: false,
        items: false,
        remark: false,
        summary: false,
      });
      setCancel(true);
      break;
    case "wait_payment":
      if (editButtonClick) {
        setDisabled({
          print: false,
          options: false,
          create: true,
          editButton: true,
          cancelButton: false,
          date: false,
          customer: false,
          staff: false,
          items: false,
          remark: false,
          summary: false,
        });
        setCancel(false);
      } else {
        setDisabled({
          print: false,
          options: false,
          create: true,
          editButton: false,
          cancelButton: false,
          date: true,
          customer: true,
          staff: true,
          items: true,
          remark: true,
          summary: true,
        });
      }
      setCancel(false);
      break;
    case "payment_complete":
      setDisabled({
        print: false,
        options: false,
        create: false,
        editButton: true,
        cancelButton: true,
        date: true,
        customer: true,
        staff: true,
        items: true,
        remark: true,
        summary: true,
      });
      setCancel(false);
      break;
    case "partial_payment":
      setDisabled({
        print: false,
        options: false,
        create: false,
        editButton: true,
        cancelButton: true,
        date: true,
        customer: true,
        staff: true,
        items: true,
        remark: true,
        summary: true,
      });
      setCancel(false);
      break;
    case "cancelled":
      setDisabled({
        print: false,
        options: false,
        create: true,
        editButton: true,
        cancelButton: true,
        date: true,
        customer: true,
        staff: true,
        items: true,
        remark: true,
        summary: true,
      });
      setCancel(true);
      break;
    default:
      setDisabled({
        print: false,
        options: true,
        create: true,
        editButton: true,
        cancelButton: true,
        date: true,
        customer: true,
        staff: true,
        items: true,
        remark: true,
        summary: true,
      });
      setCancel(false);
  }
};
