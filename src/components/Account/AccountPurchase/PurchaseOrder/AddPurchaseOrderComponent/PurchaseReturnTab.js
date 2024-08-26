import React, { useEffect, useState } from "react";
import moment from "moment";
import { useHistory } from "react-router-dom";
import AccountTableComponent from "../../../AccountTableComponent";
import { toLocaleWithTwoDigits } from "../../../../../adapter/Utils";

const columns = [
  {
    headerName: "เลขที่เอกสาร",
    field: "purchase_return_document_id",
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
    field: "purchase_return_issue_date",
    flex: 1,
    renderCell: (params) => {
      const purchase_return_issue_date = moment
        .unix(params.row.purchase_return_issue_date)
        .format("DD/MM/YYYY");
      return purchase_return_issue_date;
    },
  },
  {
    headerName: "วันที่ส่ง",
    field: "purchase_return_delivery_date",
    flex: 1,
    renderCell: (params) => {
      const purchase_return_delivery_date = moment
        .unix(params.row.purchase_return_delivery_date)
        .format("DD/MM/YYYY");
      return purchase_return_delivery_date;
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
    field: "purchase_return_status",
    flex: 1,
    renderCell: (params) => {
      switch (params.row.purchase_return_status) {
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

const PurchaseReturnTab = ({ purchaseReturnList }) => {
  const [allPurchaseReturn, setAllPurchaseReturn] = useState([]);
  const [rows, setRows] = useState([]);
  const history = useHistory();
  useEffect(() => {
    const formatData = purchaseReturnList.map((purchaseReturn, index) => {
      return {
        id: index + 1,
        ...purchaseReturn,
      };
    });
    setAllPurchaseReturn(formatData);
    setRows(formatData);
  }, [purchaseReturnList]);

  const onRowDoubleClick = (params) => {
    let purchase_return_document_id = params.row.purchase_return_document_id;
    history.push("/expense/purchase-return/" + purchase_return_document_id);
  };
  return (
    <>
      <AccountTableComponent
        tableRows={allPurchaseReturn}
        tableColumns={columns}
        onRowDoubleClick={onRowDoubleClick}
        rows={rows}
        setRows={setRows}
        short
        hideFooter
      />
    </>
  );
};

export default PurchaseReturnTab;
