import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import { getReceipt } from "../../../../../adapter/Api";
import AccountTableComponent from "../../../AccountTableComponent";
import { useHistory } from "react-router-dom";
import {
  mapPaymentChannelType,
  mapPaymentRefType,
  mapStatusToFilter,
  mapStatusToRender,
  toLocaleWithTwoDigits,
  unixToDateWithFormat,
} from "../../../../../adapter/Utils";

const columns = [
  {
    headerName: "เลขที่เอกสาร",
    field: "payment_receipt_document_id",
    flex: 1,
  },
  {
    headerName: "โครงการ",
    field: "project_document_id",
    flex: 1,
  },
  {
    headerName: "ลูกค้า",
    field: "contact_name",
    flex: 1,
  },
  {
    headerName: "วันที่ออกเอกสาร",
    field: "payment_receipt_issue_date",
    flex: 1,
  },
  {
    headerName: "ประเภท",
    field: "payment_channel_type",
    flex: 1,
  },
  {
    headerName: "รูปแบบการชำระ",
    field: "ref_type",
    flex: 1,
  },
  {
    headerName: "มูลค่าสุทธิ",
    field: "total_amount",
    flex: 1,
  },
  {
    headerName: "สถานะ",
    field: "payment_receipt_status",
    flex: 1,
    renderCell: (params) =>
      mapStatusToRender(params.row.payment_receipt_status),
    valueGetter: (params) =>
      mapStatusToFilter(params.row.payment_receipt_status),
  },
];

export default function PaymentComponent() {
  const dispatch = useDispatch();
  const [allReceipt, setAllReceipt] = useState([]);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState(0);
  const [length, setLength] = useState({
    draftLength: 0,
  });

  const history = useHistory();

  const options = ["ดูรายงาน", "ดูรายการ", "พิมพ์รายงาน"];

  useEffect(() => {
    setIsLoading(true);
    getReceipt()
      .then((data) => {
        if (data.data.status === "success") {
          console.log(data.data.data);
          let myData = data.data.data;
          const formatData = myData.map((ele, i) => {
            return {
              ...ele,
              id: i + 1,
              project_document_id: ele.billing_info?.project_document_id
                ? ele.billing_info?.project_document_id
                : "-",
              contact_name: ele.billing_info?.contact_name,
              total_amount: toLocaleWithTwoDigits(ele.total_amount),
              payment_receipt_issue_date: unixToDateWithFormat(
                ele.payment_receipt_issue_date
              ),
              payment_channel_type: mapPaymentChannelType(
                ele.payment_channel_type
              ),
              ref_type: mapPaymentRefType(ele.ref_type),
            };
          });
          setAllReceipt(formatData);
          setRows(formatData);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err.response.data);
        dispatch(showSnackbar("error", "ไม่สามารถเรียกข้อมูลได้"));
        setIsLoading(false);
      });
  }, [dispatch]);

  useEffect(() => {
    setLength({
      draftLength: allReceipt.filter(
        (data) => data.payment_receipt_status === "draft"
      ).length,
    });
  }, [allReceipt]);

  const filterByTab = (value) => {
    const newData = allReceipt.filter((data) => {
      return data.payment_receipt_status === value;
    });
    setRows(newData);
  };

  const switchTabHandler = () => {
    switch (value) {
      case 0:
        setRows(allReceipt);
        break;
      case 1:
        filterByTab("draft");
        break;
      case 2:
        filterByTab("payment_complete");
        break;
      case 3:
        filterByTab("cancelled");
        break;
      default:
        setRows(allReceipt);
    }
  };

  const customTabValue = [
    {
      label: "ทั้งหมด",
      color: "#333333",
    },
    {
      label: (
        <div className="account">
          <div>ร่าง</div>
          <div className="account__badge__draft">{length.draftLength}</div>
        </div>
      ),
      color: "#333333",
    },
    {
      label: "ชำระแล้ว",
      color: "#246527",
    },
    {
      label: "ยกเลิก",
      color: "#333333",
    },
  ];

  const breadcrumbValue = [
    {
      name: "รายรับ",
      to: "/income",
    },
    {
      name: "การรับชำระ",
      to: "/income/payment-receipt",
    },
  ];

  const onRowDoubleClick = (params) => {
    let payment_receipt_document_id = params.row.payment_receipt_document_id;
    history.push("/income/payment-receipt/" + payment_receipt_document_id);
  };
  return (
    <>
      <AccountTableComponent
        heading="การรับชำระ"
        tableRows={allReceipt}
        tableColumns={columns}
        splitButtonOptions={options}
        customTabValue={customTabValue}
        breadcrumbValue={breadcrumbValue}
        onRowDoubleClick={onRowDoubleClick}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        value={value}
        setValue={setValue}
        rows={rows}
        searchable
        setRows={setRows}
        switchTabHandler={switchTabHandler}
      />
    </>
  );
}
