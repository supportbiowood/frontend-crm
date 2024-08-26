import moment from "moment";
import "moment-timezone";

export const toThaiDate = (dateUnix) => {
  let date = moment(dateUnix, "DD/MM/YYYY");
  if (date.isValid()) {
    date.add(543, "years");
    return date.format("DD/MM/YYYY");
  }
  return date;
};

export const thaiToUnix = (dateStr) => {
  let date = moment(dateStr, "DD/MM/YYYY");
  if (date.isValid()) {
    date.subtract(543, "years");
    return date.unix();
  }
  return date;
};

export const unixToDate = (unix) => {
  return moment.unix(unix).format();
};

export const unixToDateWithFormat = (unix) => {
  return moment.unix(unix).format("DD/MM/YYYY");
};

export const dateToUnix = (date) => {
  return moment(date).format("X");
};

export const toLocaleWithTwoDigits = (num) => {
  return num.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const actionType = {
  saveToDraft: "saveToDraft",
  sendToApprove: "sendToApprove",
  notApprove: "notApprove",
  approve: "approve",
  accept: "accept",
  edit: "edit",
  editWaitPayment: "editWaitPayment",
  changeStatus: "changeStatus",
  waitJobApprove: "waitJobApprove",
  jobApproved: "jobApprove",
  queueAccepted: "queueAccepted",
  assigned: "assigned",
  inProgress: "inProgress",
  waitReview: "waitReview",
  closed: "closed",
  cancel: "cancel",
};

export const createOption = (options) => {
  let params = "";
  options.forEach((option) => {
    if (option === "project_status") {
      return (params += option + "=ongoing&");
    } else if (option === "customer") {
      return (params += "type=customer&");
    } else if (option === "vendor") {
      return (params += "type=vendor&");
    } else {
      return (params += option + "=1&");
    }
  });
  params = "?" + params.slice(0, -1);
  return params;
};

export const mapStatusToRender = (status) => {
  switch (status) {
    case "draft":
      return <div className="account__box-draft">ร่าง</div>;
    case "wait_approve":
      return <div className="account__box-waitApprove">รออนุมัติ</div>;
    case "wait_delivery":
      return <div className="account__box-waitApprove">รอส่ง</div>;
    case "not_approve":
      return <div className="account__box-notApprove">ไม่อนุมัติ</div>;
    case "not_complete":
      return <div className="account__box-notApprove">ไม่สำเร็จ</div>;
    case "approved":
      return <div className="account__box-approved">อนุมัติแล้ว</div>;
    case "wait_payment":
      return <div className="account__box-waitPay">รอชำระ</div>;
    case "payment_complete":
      return <div className="account__box-paid">ชำระแล้ว</div>;
    case "partial_payment":
      return <div className="account__box-paid">ชำระแล้วบางส่วน</div>;
    case "wait_accept":
      return <div className="account__box-waitAccept">รอตอบรับ</div>;
    case "accepted":
      return <div className="account__box-accepted">ตอบรับแล้ว</div>;
    case "closed":
      return <div className="account__box-closed">เสร็จสิ้น</div>;
    case "ordering":
      return <div className="account__box-expired">สั่งซื้อแล้วบางส่วน</div>;
    case "fully_order":
      return <div className="account__box-closed">สั่งซื้อแล้ว</div>;
    case "importing":
      return <div className="account__box-expired">นำเข้าแล้วบางส่วน</div>;
    case "fully_import":
      return <div className="account__box-closed">นำเข้าแล้ว</div>;
    case "expired":
      return <div className="account__box-expired">เกินเวลา</div>;
    case "return":
      return <div className="account__box-expired">คืนสินค้า</div>;
    case "cancelled":
      return <div className="account__box-cancelled">ยกเลิก</div>;
    default:
      return;
  }
};

export const mapStatusToFilter = (status) => {
  switch (status) {
    case "draft":
      return "ร่าง";
    case "wait_approve":
      return "รออนุมัติ";
    case "wait_delivery":
      return "รอส่ง";
    case "not_approve":
      return "ไม่อนุมัติ";
    case "not_complete":
      return "ไม่สำเร็จ";
    case "approved":
      return "อนุมัติแล้ว";
    case "wait_payment":
      return "รอชำระ";
    case "payment_complete":
      return "ชำระแล้ว";
    case "partial_payment":
      return "ชำระแล้วบางส่วน";
    case "wait_accept":
      return "รอตอบรับ";
    case "accepted":
      return "ตอบรับแล้ว";
    case "closed":
      return "เสร็จสิ้น";
    case "ordering":
      return "สั่งซื้อแล้วบางส่วน";
    case "fully_order":
      return "สั่งซื้อแล้ว";
    case "importing":
      return "นำเข้าแล้วบางส่วน";
    case "fully_import":
      return "นำเข้าแล้ว";
    case "expired":
      return "เกินเวลา";
    case "return":
      return "คืนสินค้า";
    case "cancelled":
      return "ยกเลิก";
    default:
      return;
  }
};

export const mapPaymentChannelType = (payment_channel_type) => {
  switch (payment_channel_type) {
    case "cash":
      return "เงินสด";
    case "bank":
      return "ธนาคาร";
    case "e_wallet":
      return "e-wallet";
    case "receiver":
      return "สำรองรับ-จ่าย";
    case "check":
      return "เช็ค";
    default:
      return "-";
  }
};

export const mapPaymentRefType = (ref_type) => {
  switch (ref_type) {
    case "sales_invoice":
      return "การรับชำระ";
    case "billing_note":
      return "การรับชำระ";
    case "deposit_invoice":
      return "การรับชำระมัดจำ";
    default:
      return "-";
  }
};

export const deleteMultipleAttribute = (attributes, obj) => {
  attributes.forEach((e) => delete obj[e]);
};

export const checkAddress = (billingInfo) => {
  deleteMultipleAttribute(
    [
      "contact_id",
      "contact_name",
      "email",
      "fax",
      "phone",
      "project_id",
      "project_name",
      "tax_no",
    ],
    billingInfo
  );
  const hasAddress = Object.values(billingInfo).every(
    (element) => element.length > 0
  );
  if (hasAddress) {
    return `${billingInfo.house_no.replace(
      "-",
      " "
    )} ${billingInfo.building.replace(
      "-",
      " "
    )} ${billingInfo.sub_district.replace("-", " ")} ${billingInfo.road.replace(
      "-",
      " "
    )} ${billingInfo.district.replace("-", " ")} ${billingInfo.province.replace(
      "-",
      " "
    )} ${billingInfo.postal_code.replace(
      "-",
      " "
    )} ${billingInfo.country.replace("-", " ")}`;
  } else {
    return "-";
  }
};

export const onKeyDown = (keyEvent) => {
  if (keyEvent.key === "Enter" || keyEvent.key === "NumpadEnter") {
    keyEvent.preventDefault();
  }
};
