export const disabledStatus = (status, setDisabled) => {
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
        delivery: false,
        items: false,
        remark: false,
        upload: true,
      });
      break;
    }
    case "draft":
      setDisabled({
        print: false,
        options: false,
        create: true,
        editButton: true,
        cancelButton: true,
        date: false,
        customer: false,
        delivery: false,
        items: false,
        remark: false,
        upload: true,
      });
      break;
    case "wait_delivery":
      setDisabled({
        print: false,
        options: false,
        create: true,
        cancelButton: false,
        editButton: true,
        date: true,
        customer: true,
        delivery: true,
        items: true,
        remark: true,
        upload: false,
      });
      break;
    case "not_complete":
      setDisabled({
        print: false,
        options: false,
        create: true,
        cancelButton: false,
        editButton: true,
        date: true,
        customer: true,
        delivery: true,
        items: true,
        remark: true,
        upload: false,
      });
      break;
    case "closed":
      setDisabled({
        print: false,
        options: false,
        create: false,
        delivery: true,
        cancelButton: true,
        editButton: true,
        upload: true,
        date: true,
        customer: true,
        items: true,
        remark: true,
      });
      break;
    case "cancelled":
      setDisabled({
        print: false,
        options: false,
        create: true,
        delivery: true,
        cancelButton: true,
        editButton: true,
        upload: true,
        date: true,
        customer: true,
        items: true,
        remark: true,
      });
      break;
    default:
      setDisabled({
        print: false,
        options: true,
        create: true,
        delivery: true,
        cancelButton: true,
        editButton: true,
        upload: true,
        date: true,
        customer: true,
        items: true,
        remark: true,
      });
  }
};
