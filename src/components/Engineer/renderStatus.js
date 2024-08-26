export const renderStatus = (status) => {
  switch (status) {
    case "draft":
      return <div className="engineer__status-draft">ร่าง</div>;
    case "job_not_approve":
      return <div className="engineer__status-notApprove">ไม่อนุมัติ</div>;
    case "queue_declined":
      return <div className="engineer__status-notApprove">ไม่อนุมัติ</div>;
    case "work_declined":
      return <div className="engineer__status-notApprove">ไม่อนุมัติ</div>;
    case "closed":
      return <div className="engineer__status-closed">สำเร็จ</div>;
    default:
      return;
  }
};
