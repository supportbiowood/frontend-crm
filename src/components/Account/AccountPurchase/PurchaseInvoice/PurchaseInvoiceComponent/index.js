import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import { getPurchaseInvoice } from "../../../../../adapter/Api";
import moment from "moment";
import AccountTableComponent from "../../../AccountTableComponent";
import { Backdrop, CircularProgress } from "@mui/material";
import { useHistory } from "react-router-dom";
import {
  mapStatusToFilter,
  mapStatusToRender,
  unixToDateWithFormat,
} from "../../../../../adapter/Utils";

const columns = [
  {
    headerName: "เลขที่เอกสาร",
    field: "purchase_invoice_document_id",
    flex: 1,
  },
  {
    headerName: "วันที่ออกเอกสาร",
    field: "purchase_invoice_issue_date",
    flex: 1,
  },
  {
    headerName: "ต้องการภายในวันที่",
    field: "purchase_invoice_due_date",
    flex: 1,
  },
  {
    headerName: "ผู้ขาย",
    field: "vendor_name",
    flex: 1,
  },
  {
    headerName: "สถานะ",
    field: "purchase_invoice_status",
    flex: 1,
    renderCell: (params) =>
      mapStatusToRender(params.row.purchase_invoice_status),
    valueGetter: (params) =>
      mapStatusToFilter(params.row.purchase_invoice_status),
  },
];

export default function PurchaseInvoiceComponent() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [allPurchaseInvoice, setAllPurchaseInvoice] = useState([]);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState(0);
  const [length, setLength] = useState({
    draftLength: 0,
    waitPaymentLength: 0,
  });

  const options = ["ดูรายงาน", "ดูรายการ", "พิมพ์รายงาน"];

  useEffect(() => {
    setIsLoading(true);
    getPurchaseInvoice()
      .then((data) => {
        if (data.data.status === "success") {
          console.log(data.data.data);
          let myData = data.data.data;
          const formatData = myData.map((ele, i) => {
            return {
              ...ele,
              id: i + 1,
              vendor_name: ele.vendor_info?.contact_name,
              purchase_invoice_issue_date: unixToDateWithFormat(
                ele.purchase_invoice_issue_date
              ),
              purchase_invoice_due_date: unixToDateWithFormat(
                ele.purchase_invoice_due_date
              ),
            };
          });
          setAllPurchaseInvoice(formatData);
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
      draftLength: allPurchaseInvoice.filter(
        (data) => data.purchase_invoice_status === "draft"
      ).length,
      waitPaymentLength: allPurchaseInvoice.filter(
        (data) => data.purchase_invoice_status === "wait_payment"
      ).length,
    });
  }, [allPurchaseInvoice]);

  const filterByTab = (value) => {
    const newData = allPurchaseInvoice.filter((data) => {
      return data.purchase_invoice_status === value;
    });
    setRows(newData);
  };

  const switchTabHandler = () => {
    switch (value) {
      case 0:
        setRows(allPurchaseInvoice);
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
        filterByTab("partial_payment");
        break;
      case 5:
        const currentTimestamp = moment().unix();
        const newData = allPurchaseInvoice.filter((data) => {
          return (
            data.purchase_invoice_due_date < currentTimestamp &&
            data.purchase_invoice_status !== "payment_complete"
          );
        });
        setRows(newData);
        break;
      case 6:
        filterByTab("cancelled");
        break;
      default:
        setRows(allPurchaseInvoice);
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
          <div className="account__badge__waitPay">
            {length.waitPaymentLength}
          </div>
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
      name: "รายจ่าย",
      to: "/expense",
    },
    {
      name: "ใบบันทึกซื้อ",
      to: "/expense/purchase-invoice",
    },
  ];

  const buttonWithLink = {
    to: "/expense/purchase-invoice/add",
    type: "button",
    text: "สร้างใบบันทึกซื้อ",
    variant: "contained",
    color: "success",
  };

  const onRowDoubleClick = (params) => {
    let purchase_invoice_document_id = params.row.purchase_invoice_document_id;
    history.push("/expense/purchase-invoice/" + purchase_invoice_document_id);
  };
  return (
    <>
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <AccountTableComponent
        heading="ใบบันทึกซื้อ"
        tableRows={allPurchaseInvoice}
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
        rows={rows}
        searchable
        setRows={setRows}
        switchTabHandler={switchTabHandler}
      />
    </>
  );
}
