import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import { getSalesInvoice } from "../../../../../adapter/Api";
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
    field: "sales_invoice_document_id",
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
    field: "sales_invoice_issue_date",
    flex: 1,
  },
  {
    headerName: "วันที่ครบกำหนด",
    field: "sales_invoice_due_date",
    flex: 1,
  },
  {
    headerName: "มูลค่าสุทธิ",
    field: "total_amount",
    flex: 1,
  },
  {
    headerName: "สถานะ",
    field: "sales_invoice_status",
    flex: 1,
    renderCell: (params) => mapStatusToRender(params.row.sales_invoice_status),
    valueGetter: (params) => mapStatusToFilter(params.row.sales_invoice_status),
  },
];

export default function SalesInvoiceComponent() {
  const dispatch = useDispatch();
  const [allSalesInvoice, setAllSalesInvoice] = useState([]);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState(0);
  const [length, setLength] = useState({
    draftLength: 0,
    waitApproveLength: 0,
    notApproveLength: 0,
    waitPayLength: 0,
  });

  const options = ["ดูรายงาน", "ดูรายการ", "พิมพ์รายงาน"];

  useEffect(() => {
    setIsLoading(true);
    getSalesInvoice()
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
              sales_invoice_issue_date: unixToDateWithFormat(
                ele.sales_invoice_issue_date
              ),
              sales_invoice_due_date: unixToDateWithFormat(
                ele.sales_invoice_due_date
              ),
            };
          });
          setAllSalesInvoice(formatData);
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
      draftLength: allSalesInvoice.filter(
        (data) => data.sales_invoice_status === "draft"
      ).length,
      waitApproveLength: allSalesInvoice.filter(
        (data) => data.sales_invoice_status === "wait_approve"
      ).length,
      notApproveLength: allSalesInvoice.filter(
        (data) => data.sales_invoice_status === "not_approve"
      ).length,
      waitPayLength: allSalesInvoice.filter(
        (data) => data.sales_invoice_status === "wait_payment"
      ).length,
    });
  }, [allSalesInvoice]);

  const filterByTab = (value) => {
    const newData = allSalesInvoice.filter((data) => {
      return data.sales_invoice_status === value;
    });
    setRows(newData);
  };

  const switchTabHandler = () => {
    switch (value) {
      case 0:
        setRows(allSalesInvoice);
        break;
      case 1:
        filterByTab("draft");
        break;
      case 2:
        filterByTab("wait_approve");
        break;
      case 3:
        filterByTab("not_approve");
        break;
      case 4:
        filterByTab("wait_payment");
        break;
      case 5:
        filterByTab("payment_complete");
        break;
      case 6:
        filterByTab("partial_payment");
        break;
      case 7:
        const currentTimestamp = moment().unix();
        const newData = allSalesInvoice.filter((data) => {
          return (
            data.sales_invoice_due_date < currentTimestamp &&
            data.sales_invoice_status !== "closed"
          );
        });
        setRows(newData);
        break;
      case 8:
        filterByTab("cancelled");
        break;
      default:
        setRows(allSalesInvoice);
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
          <div>รออนุมัติ</div>
          <div className="account__badge__waitApprove">
            {length.waitApproveLength}
          </div>
        </div>
      ),
      color: "#C3762E",
    },
    {
      label: (
        <div className="account">
          <div>ไม่อนุมัติ</div>
          <div className="account__badge__notApprove">
            {length.notApproveLength}
          </div>
        </div>
      ),
      color: "#B54839",
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
      label: "ชำระแล้วบางส่วน",
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
      name: "รายรับ",
      to: "/income",
    },
    {
      name: "ใบแจ้งหนี้",
      to: "/income/sales-invoice",
    },
  ];

  const buttonWithLink = {
    to: "/income/sales-invoice/add",
    type: "button",
    text: "สร้างใบแจ้งหนี้",
    variant: "contained",
    color: "success",
  };

  const onRowDoubleClick = (params) => {
    let sales_invoice_document_id = params.row.sales_invoice_document_id;
    window.location.href = "/income/sales-invoice/" + sales_invoice_document_id;
  };
  return (
    <>
      <AccountTableComponent
        heading="ใบแจ้งหนี้"
        tableRows={allSalesInvoice}
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
