import React, { useState, useEffect } from "react";
import moment from "moment";
import AccountTableComponent from "../../../AccountTableComponent";

const columns = [
  {
    headerName: "เลขที่เอกสาร",
    field: "credit_note_document_id",
    flex: 1,
  },
  {
    headerName: "โครงการ",
    field: "project_name",
    flex: 1,
    renderCell: (params) => {
      const project_name = params.row.billing_info.project_name;
      if (project_name) {
        return project_name;
      } else {
        return "-";
      }
    },
  },
  {
    headerName: "ลูกค้า",
    field: "contact_name",
    flex: 1,
    renderCell: (params) => {
      const contact_name = params.row.billing_info.contact_name;
      return contact_name;
    },
  },
  {
    headerName: "วันที่ออกเอกสาร",
    field: "credit_note_issue_date",
    flex: 1,
    renderCell: (params) => {
      const credit_note_issue_date = moment
        .unix(params.row.credit_note_issue_date)
        .format("DD/MM/YYYY");
      return credit_note_issue_date;
    },
  },
  {
    headerName: "มูลค่าสุทธิ",
    field: "total_amount",
    flex: 1,
    renderCell: (params) => {
      const total_amount = params.row.total_amount;
      return total_amount;
    },
  },
  {
    headerName: "สถานะ",
    field: "credit_note_status",
    flex: 1,
    renderCell: (params) => {
      switch (params.row.credit_note_status) {
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

export default function ImporterTabComponent({ importerList }) {
  const [allImporter, setAllImporter] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const formatData = importerList.map((importer, index) => {
      return {
        id: index + 1,
        ...importer,
      };
    });
    setAllImporter(formatData);
    setRows(formatData);
  }, [importerList]);

  const onRowDoubleClick = (params) => {
    let credit_note_document_id = params.row.credit_note_document_id;
    window.location.href = "/income/credit-note/" + credit_note_document_id;
  };
  return (
    <>
      <h2 className="form-heading">ใบลดหนี้</h2>
      <AccountTableComponent
        tableRows={allImporter}
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
