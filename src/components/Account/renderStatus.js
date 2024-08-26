export const renderStatus = (status) => {
  switch (status) {
    case "draft":
      return <div className="account__status-draft">ร่าง</div>;
    case "wait_approve":
      return <div className="account__status-waitApprove">รออนุมัติ</div>;
    case "wait_delivery":
      return <div className="account__status-waitApprove">รอส่ง</div>;
    case "not_approve":
      return <div className="account__status-notApprove">ไม่อนุมัติ</div>;
    case "not_complete":
      return <div className="account__status-notApprove">ไม่สำเร็จ</div>;
    case "approved":
      return <div className="account__status-approved">อนุมัติแล้ว</div>;
    case "wait_payment":
      return <div className="account__status-waitPay">รอชำระ</div>;
    case "payment_complete":
      return <div className="account__status-paid">ชำระแล้ว</div>;
    case "partial_payment":
      return <div className="account__status-paid">ชำระแล้วบางส่วน</div>;
    case "wait_accept":
      return <div className="account__status-waitAccept">รอตอบรับ</div>;
    case "accepted":
      return <div className="account__status-accepted">ตอบรับแล้ว</div>;
    case "closed":
      return <div className="account__status-closed">เสร็จสิ้น</div>;
    case "ordering":
      return <div className="account__status-closed">สั่งซื้อแล้วบางส่วน</div>;
    case "fully_order":
      return <div className="account__status-closed">สั่งซื้อแล้ว</div>;
    case "importing":
      return <div className="account__status-closed">นำเข้าแล้วบางส่วน</div>;
    case "fully_import":
      return <div className="account__status-closed">นำเข้าแล้ว</div>;
    case "expired":
      return <div className="account__status-expired">เกินเวลา</div>;
    case "return":
      return <div className="account__status-expired">คืนสินค้า</div>;
    case "cancelled":
      return <div className="account__status-cancelled">ยกเลิก</div>;
    default:
      return;
  }
};
