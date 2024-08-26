import React, { useState, useEffect } from "react";
import moment from "moment";
import AccountTableComponent from "../../../AccountTableComponent";
import { useHistory } from "react-router-dom";
import { toLocaleWithTwoDigits } from "../../../../../adapter/Utils";

const columns = [
  {
    headerName: "เลขที่เอกสาร",
    field: "debit_note_document_id",
    flex: 1,
  },
  {
    headerName: "ผู้ขาย",
    field: "contact_name",
    flex: 1,
    renderCell: (params) => {
      const contact_name = params.row.vendor_info.contact_name;
      return contact_name;
    },
  },
  {
    headerName: "วันที่ออกเอกสาร",
    field: "debit_note_issue_date",
    flex: 1,
    renderCell: (params) => {
      const debit_note_issue_date = moment
        .unix(params.row.debit_note_issue_date)
        .format("DD/MM/YYYY");
      return debit_note_issue_date;
    },
  },
  {
    headerName: "มูลค่าสุทธิ",
    field: "total_amount",
    flex: 1,
    renderCell: (params) => {
      const total_amount = params.row.total_amount;
      return toLocaleWithTwoDigits(total_amount);
    },
  },
  {
    headerName: "สถานะ",
    field: "debit_note_status",
    flex: 1,
    renderCell: (params) => {
      switch (params.row.debit_note_status) {
        case "draft":
          return <div className="account__box-draft">ร่าง</div>;
        case "wait_approve":
          return <div className="account__box-waitApprove">รออนุมัติ</div>;
        case "not_approve":
          return <div className="account__box-notApprove">ไม่อนุมัติ</div>;
        case "approved":
          return <div className="account__box-approved">อนุมัติแล้ว</div>;
        case "closed":
          return <div className="account__box-closed">เสร็จสิ้น</div>;
        case "cancelled":
          return <div className="account__box-cancelled">ยกเลิก</div>;
        default:
          return;
      }
    },
  },
];

export default function DebitNoteTabComponent({ debitNoteList }) {
  const [allDebitNote, setAllDebitNote] = useState([]);
  const [rows, setRows] = useState([]);
  const history = useHistory();
  useEffect(() => {
    const formatData = debitNoteList.map((debitNote, index) => {
      return {
        id: index + 1,
        ...debitNote,
      };
    });
    setAllDebitNote(formatData);
    setRows(formatData);
  }, [debitNoteList]);

  const onRowDoubleClick = (params) => {
    let debit_note_document_id = params.row.debit_note_document_id;
    history.push("/expense/debit-note/" + debit_note_document_id);
  };

  return (
    <>
      <AccountTableComponent
        tableRows={allDebitNote}
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
