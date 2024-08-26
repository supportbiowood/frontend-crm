import React, { useEffect, useState } from "react";
import moment from "moment";
import { useHistory } from "react-router-dom";
import AccountTableComponent from "../../../AccountTableComponent";
import { toLocaleWithTwoDigits } from "../../../../../adapter/Utils";

const columns = [
  {
    headerName: "เลขที่เอกสาร",
    field: "payment_made_document_id",
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
    field: "payment_issue_date",
    flex: 1,
    renderCell: (params) => {
      const payment_date = moment
        .unix(params.row.payment_date)
        .format("DD/MM/YYYY");
      return payment_date;
    },
  },
  {
    headerName: "ประเภท",
    field: "payment_channel_type",
    flex: 1,
    renderCell: (params) => {
      switch (params.row.payment_channel_type) {
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
    field: "payment_made_status",
    flex: 1,
    renderCell: (params) => {
      switch (params.row.payment_made_status) {
        case "draft":
          return <div className="account__box-draft">ร่าง</div>;
        case "payment_complete":
          return <div className="account__box-paid">ชำระแล้ว</div>;
        case "cancelled":
          return <div className="account__box-cancelled">ยกเลิก</div>;
        default:
          return;
      }
    },
  },
];

const PaymentTabComponent = ({ paymentMadeList }) => {
  const [allPaymentMade, setAllPaymentMade] = useState([]);
  const [rows, setRows] = useState([]);
  const history = useHistory();
  useEffect(() => {
    const formatData = paymentMadeList.map((paymentMade, index) => {
      return {
        id: index + 1,
        ...paymentMade,
      };
    });
    setAllPaymentMade(formatData);
    setRows(formatData);
  }, [paymentMadeList]);

  const onRowDoubleClick = (params) => {
    let payment_made_document_id = params.row.payment_made_document_id;
    history.push("/expense/payment-made/" + payment_made_document_id);
  };
  return (
    <>
      <AccountTableComponent
        tableRows={allPaymentMade}
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

export default PaymentTabComponent;
