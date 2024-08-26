import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import { getDepositInvoice } from "../../../../../adapter/Api";
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
    field: "deposit_invoice_document_id",
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
    field: "deposit_invoice_issue_date",
    flex: 1,
  },
  {
    headerName: "มูลค่าสุทธิ",
    field: "total_amount",
    flex: 1,
  },
  {
    headerName: "สถานะ",
    field: "deposit_invoice_status",
    flex: 1,
    renderCell: (params) =>
      mapStatusToRender(params.row.deposit_invoice_status),
    valueGetter: (params) =>
      mapStatusToFilter(params.row.deposit_invoice_status),
  },
];

export default function DepositInvoiceComponent() {
  const dispatch = useDispatch();
  const [allDepositInvoice, setAllDepositInvoice] = useState([]);
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
    getDepositInvoice()
      .then((data) => {
        if (data.data.status === "success") {
          console.log(data.data.data);
          let myData = data.data.data;
          const formatData = myData.map((ele, i) => {
            return {
              id: i + 1,
              ...ele,
              project_document_id: ele.billing_info?.project_document_id
                ? ele.billing_info?.project_document_id
                : "-",
              contact_name: ele.billing_info?.contact_name,
              total_amount: toLocaleWithTwoDigits(ele.total_amount),
              deposit_invoice_issue_date: unixToDateWithFormat(
                ele.deposit_invoice_issue_date
              ),
            };
          });
          setAllDepositInvoice(formatData);
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
      draftLength: allDepositInvoice.filter(
        (data) => data.deposit_invoice_status === "draft"
      ).length,
      waitPayLength: allDepositInvoice.filter(
        (data) => data.deposit_invoice_status === "wait_payment"
      ).length,
    });
  }, [allDepositInvoice]);

  const filterByTab = (value) => {
    const newData = allDepositInvoice.filter((data) => {
      return data.deposit_invoice_status === value;
    });
    setRows(newData);
  };

  const switchTabHandler = () => {
    switch (value) {
      case 0:
        setRows(allDepositInvoice);
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
        filterByTab("closed");
        break;
      case 5:
        filterByTab("cancelled");
        break;
      default:
        setRows(allDepositInvoice);
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
      label: "เสร็จสิ้น",
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
      name: "ใบแจ้งหนี้มัดจำ",
      to: "/income/deposit-invoice",
    },
  ];

  const buttonWithLink = {
    to: "/income/deposit-invoice/add",
    type: "button",
    text: "สร้างใบแจ้งหนี้มัดจำ",
    variant: "contained",
    color: "success",
  };

  const onRowDoubleClick = (params) => {
    let deposit_invoice_document_id = params.row.deposit_invoice_document_id;
    window.location.href =
      "/income/deposit-invoice/" + deposit_invoice_document_id;
  };
  return (
    <>
      <AccountTableComponent
        heading="ใบแจ้งหนี้มัดจำ"
        tableRows={allDepositInvoice}
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
