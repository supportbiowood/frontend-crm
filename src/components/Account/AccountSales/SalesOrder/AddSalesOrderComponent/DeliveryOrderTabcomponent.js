import React, { useState, useEffect } from "react";
import moment from "moment";
import AccountTableComponent from "../../../AccountTableComponent";

const columns = [
  {
    headerName: "เลขที่เอกสาร",
    field: "delivery_note_document_id",
    flex: 1,
  },
  {
    headerName: "วันที่ออกเอกสาร",
    field: "delivery_note_issue_date",
    flex: 1,
    renderCell: (params) => {
      const delivery_note_issue_date = moment
        .unix(params.row.delivery_note_issue_date)
        .format("DD/MM/YYYY");
      return delivery_note_issue_date;
    },
  },
  {
    headerName: "วันที่ส่ง",
    field: "delivery_note_delivery_date",
    flex: 1,
    renderCell: (params) => {
      const delivery_note_delivery_date = moment
        .unix(params.row.delivery_note_delivery_date)
        .format("DD/MM/YYYY");
      return delivery_note_delivery_date;
    },
  },
  {
    headerName: "ผู้ส่ง",
    field: "sender",
    flex: 1,
    renderCell: (params) => {
      const sender =
        params.row.delivery_info.sender.employee_firstname +
        " " +
        params.row.delivery_info.sender.employee_lastname;
      return sender;
    },
  },
  {
    headerName: "สถานะ",
    field: "delivery_note_status",
    flex: 1,
    renderCell: (params) => {
      switch (params.row.delivery_note_status) {
        case "draft":
          return <div className="account__box-draft">ร่าง</div>;
        case "wait_delivery":
          return <div className="account__box-waitApprove">รอส่ง</div>;
        case "not_complete":
          return <div className="account__box-notApprove">ไม่สำเร็จ</div>;
        case "closed":
          return <div className="account__box-closed">เสร็จสิ้น</div>;
        case "return":
          return <div className="account__box-expired">คืนสินค้า</div>;
        case "cancelled":
          return <div className="account__box-cancelled">ยกเลิก</div>;
        default:
          return;
      }
    },
  },
];

export default function DeliveryOrderTabComponent({ deliveryOrderList }) {
  const [allDeliveryOrder, setAllDeliveryOrder] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const formatData = deliveryOrderList.map((deliveryOrder, index) => {
      return {
        id: index + 1,
        ...deliveryOrder,
      };
    });
    setAllDeliveryOrder(formatData);
    setRows(formatData);
  }, [deliveryOrderList]);

  const onRowDoubleClick = (params) => {
    let delivery_note_document_id = params.row.delivery_note_document_id;
    window.location.href =
      "/income/delivery-order/" + delivery_note_document_id;
  };
  return (
    <>
      <h2 className="form-heading">ใบส่งของ</h2>
      <AccountTableComponent
        tableRows={allDeliveryOrder}
        tableColumns={columns}
        onRowDoubleClick={onRowDoubleClick}
        rows={rows}
        setRows={setRows}
        short
        hideFooter
      />
    </>
  );
}
