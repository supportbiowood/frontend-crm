import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import { getCombinedPayment } from "../../../../../adapter/Api";
import moment from "moment";
import AccountTableComponent from "../../../AccountTableComponent";
import {
  mapStatusToFilter,
  mapStatusToRender,
  toLocaleWithTwoDigits,
  unixToDateWithFormat,
} from "../../../../../adapter/Utils";

const columns = [
  {
    headerName: "เลขที่เอกสาร",
    field: "combined_payment_document_id",
    flex: 1,
  },
  {
    headerName: "ผู้ขาย",
    field: "vendor_name",
    flex: 1,
  },
  {
    headerName: "วันที่ออกเอกสาร",
    field: "combined_payment_issue_date",
    flex: 1,
  },
  {
    headerName: "วันที่ครบกำหนด",
    field: "combined_payment_due_date",
    flex: 1,
  },
  {
    headerName: "มูลค่าสุทธิ",
    field: "total_amount",
    flex: 1,
  },
  {
    headerName: "สถานะ",
    field: "combined_payment_status",
    flex: 1,
    renderCell: (params) =>
      mapStatusToRender(params.row.combined_payment_status),
    valueGetter: (params) =>
      mapStatusToFilter(params.row.combined_payment_status),
  },
];

export default function CombinedPaymentComponent() {
  const dispatch = useDispatch();
  const [allCombinedPayment, setAllCombinedPayment] = useState([]);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState(0);
  const [length, setLength] = useState({
    draftLength: 0,
    waitPayLength: 0,
  });

  const options = ["ดูรายงาน", "ดูรายการ", "พิมพ์รายงาน"];

  useEffect(() => {
    setIsLoading(true);
    getCombinedPayment()
      .then((data) => {
        if (data.data.status === "success") {
          console.log(data.data.data);
          let myData = data.data.data;
          const formatData = myData.map((ele, i) => {
            return {
              ...ele,
              id: i + 1,
              vendor_name: ele.vendor_info?.contact_name,
              total_amount: toLocaleWithTwoDigits(ele.total_amount),
              combined_payment_issue_date: unixToDateWithFormat(
                ele.combined_payment_issue_date
              ),
              combined_payment_due_date: unixToDateWithFormat(
                ele.combined_payment_due_date
              ),
            };
          });
          setAllCombinedPayment(formatData);
          setRows(formatData);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(showSnackbar("error", "ไม่สามารถเรียกข้อมูลได้"));
        setIsLoading(false);
      });
  }, [dispatch]);

  useEffect(() => {
    setLength({
      draftLength: allCombinedPayment.filter(
        (data) => data.combined_payment_status === "draft"
      ).length,
      waitPayLength: allCombinedPayment.filter(
        (data) => data.combined_payment_status === "wait_payment"
      ).length,
    });
  }, [allCombinedPayment]);

  const filterByTab = (value) => {
    const newData = allCombinedPayment.filter((data) => {
      return data.combined_payment_status === value;
    });
    setRows(newData);
  };

  const switchTabHandler = () => {
    switch (value) {
      case 0:
        setRows(allCombinedPayment);
        break;
      case 1:
        filterByTab("draft");
        break;
      case 2:
        filterByTab("wait_payment");
        break;
      case 3:
        filterByTab("payment_complete");
        break;
      case 4:
        const currentTimestamp = moment().unix();
        const newData = allCombinedPayment.filter((data) => {
          return (
            data.combined_payment_due_date < currentTimestamp &&
            data.combined_payment_status !== "closed"
          );
        });
        setRows(newData);
        break;
      case 5:
        filterByTab("cancelled");
        break;
      default:
        setRows(allCombinedPayment);
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
      label: (
        <div className="account">
          <div>รอชำระ</div>
          <div className="account__badge__waitPay">{length.waitPayLength}</div>
        </div>
      ),
      color: "#C3762E",
    },
    {
      label: "ชำระแล้ว",
      color: "#246527",
    },
    {
      label: "เกินเวลา",
      color: "#703600",
    },
    {
      label: "ยกเลิก",
      color: "#333333",
    },
  ];

  const breadcrumbValue = [
    {
      name: "รายจ่าย",
      to: "/expense",
    },
    {
      name: "ใบรวมจ่าย",
      to: "/expense/combined-payment",
    },
  ];

  const buttonWithLink = {
    to: "/expense/combined-payment/add",
    type: "button",
    text: "สร้างใบรวมจ่าย",
    variant: "contained",
    color: "success",
  };

  const onRowDoubleClick = (params) => {
    let combined_payment_document_id = params.row.combined_payment_document_id;
    window.location.href =
      "/expense/combined-payment/" + combined_payment_document_id;
  };
  return (
    <>
      <AccountTableComponent
        heading="ใบรวมจ่าย"
        tableRows={allCombinedPayment}
        tableColumns={columns}
        splitButtonOptions={options}
        customTabValue={customTabValue}
        breadcrumbValue={breadcrumbValue}
        onRowDoubleClick={onRowDoubleClick}
        buttonWithLink={buttonWithLink}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        value={value}
        setValue={setValue}
        searchable
        rows={rows}
        setRows={setRows}
        switchTabHandler={switchTabHandler}
      />
    </>
  );
}
