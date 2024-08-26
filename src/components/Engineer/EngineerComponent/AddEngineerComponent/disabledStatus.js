export const disabledStatus = (status, setDisabled, editButtonClick) => {
  switch (status) {
    case "create":
      setDisabled({
        startDate: true,
        options: true,
        issueDate: false,
        sendDate: false,
        cancelButton: true,
        editButton: false,
        form: false,
        inputDocument: false,
        deliverDocument: false,
        staff: false,
        remark: false,
        remarkDocument: false,
      });
      break;
    case "draft":
      setDisabled({
        startDate: true,
        editButton: true,
        options: false,
        issueDate: false,
        sendDate: false,
        cancelButton: false,
        form: false,
        inputDocument: false,
        deliverDocument: false,
        staff: false,
        remark: false,
        remarkDocument: false,
      });
      break;
    case "wait_job_approve":
      setDisabled({
        issueDate: true,
        startDate: true,
        editButton: true,
        options: false,
        sendDate: false,
        cancelButton: false,
        form: false,
        inputDocument: false,
        deliverDocument: false,
        staff: false,
        remark: false,
        remarkDocument: false,
      });
      break;
    case "job_approved":
      if (editButtonClick) {
        setDisabled({
          issueDate: false,
          startDate: false,
          form: false,
          inputDocument: false,
          options: false,
          sendDate: false,
          cancelButton: false,
          editButton: true,
          deliverDocument: false,
          staff: false,
          remark: false,
          remarkDocument: false,
        });
      } else {
        setDisabled({
          issueDate: true,
          startDate: false,
          form: true,
          inputDocument: true,
          options: false,
          sendDate: false,
          cancelButton: false,
          editButton: false,
          deliverDocument: false,
          staff: false,
          remark: false,
          remarkDocument: false,
        });
      }
      break;
    case "queue_accepted":
      if (editButtonClick) {
        setDisabled({
          issueDate: false,
          startDate: false,
          form: false,
          inputDocument: false,
          options: false,
          sendDate: false,
          cancelButton: false,
          editButton: true,
          deliverDocument: false,
          staff: false,
          remark: false,
          remarkDocument: false,
        });
      } else {
        setDisabled({
          form: true,
          issueDate: true,
          startDate: true,
          inputDocument: true,
          options: false,
          sendDate: false,
          cancelButton: false,
          editButton: false,
          deliverDocument: false,
          staff: false,
          remark: false,
          remarkDocument: false,
        });
      }
      break;
    case "assigned":
      if (editButtonClick) {
        setDisabled({
          issueDate: false,
          startDate: false,
          form: false,
          inputDocument: false,
          options: false,
          sendDate: false,
          cancelButton: false,
          editButton: true,
          deliverDocument: false,
          staff: false,
          remark: false,
          remarkDocument: false,
        });
      } else {
        setDisabled({
          form: true,
          issueDate: true,
          startDate: true,
          sendDate: true,
          inputDocument: true,
          staff: true,
          options: false,
          cancelButton: false,
          editButton: false,
          deliverDocument: false,
          remark: false,
          remarkDocument: false,
        });
      }
      break;
    case "in_progress":
      if (editButtonClick) {
        setDisabled({
          issueDate: false,
          startDate: false,
          form: false,
          inputDocument: false,
          options: false,
          sendDate: false,
          cancelButton: false,
          editButton: true,
          deliverDocument: false,
          staff: false,
          remark: false,
          remarkDocument: false,
        });
      } else {
        setDisabled({
          form: true,
          issueDate: true,
          startDate: true,
          sendDate: true,
          inputDocument: true,
          staff: true,
          options: false,
          cancelButton: false,
          editButton: false,
          deliverDocument: false,
          remark: false,
          remarkDocument: false,
        });
      }
      break;
    case "wait_review":
      if (editButtonClick) {
        setDisabled({
          issueDate: false,
          startDate: false,
          form: false,
          inputDocument: false,
          options: false,
          sendDate: false,
          cancelButton: false,
          editButton: true,
          deliverDocument: false,
          staff: false,
          remark: false,
          remarkDocument: false,
        });
      } else {
        setDisabled({
          form: true,
          issueDate: true,
          startDate: true,
          sendDate: true,
          inputDocument: true,
          deliverDocument: true,
          staff: true,
          options: false,
          cancelButton: false,
          editButton: false,
          remark: false,
          remarkDocument: false,
        });
      }
      break;
    case "closed":
      if (editButtonClick) {
        setDisabled({
          issueDate: false,
          startDate: false,
          form: false,
          inputDocument: false,
          options: false,
          sendDate: false,
          cancelButton: false,
          editButton: true,
          deliverDocument: false,
          staff: false,
          remark: false,
          remarkDocument: false,
        });
      } else {
        setDisabled({
          form: true,
          issueDate: true,
          startDate: true,
          sendDate: true,
          inputDocument: true,
          deliverDocument: true,
          staff: true,
          options: true,
          cancelButton: true,
          editButton: true,
          remark: false,
          remarkDocument: false,
        });
      }
      break;
    case "cancelled":
      if (editButtonClick) {
        setDisabled({
          issueDate: false,
          startDate: false,
          form: false,
          inputDocument: false,
          options: false,
          sendDate: false,
          cancelButton: false,
          editButton: true,
          deliverDocument: false,
          staff: false,
          remark: false,
          remarkDocument: false,
        });
      } else {
        setDisabled({
          form: true,
          issueDate: true,
          startDate: true,
          sendDate: true,
          inputDocument: true,
          deliverDocument: true,
          staff: true,
          options: false,
          cancelButton: true,
          editButton: false,
          remark: false,
          remarkDocument: false,
        });
      }
      break;
    default:
      return;
  }
};
