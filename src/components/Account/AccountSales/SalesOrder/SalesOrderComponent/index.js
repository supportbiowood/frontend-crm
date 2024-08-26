import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getSalesOrder } from "../../../../../adapter/Api";
import moment from "moment";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import AccountTableComponent from "../../../AccountTableComponent";
import { useHistory } from "react-router-dom";
import {
  mapStatusToFilter,
  mapStatusToRender,
  toLocaleWithTwoDigits,
  unixToDateWithFormat,
} from "../../../../../adapter/Utils";

const columns = [
  {
    headerName: "เลขที่เอกสาร",
    field: "sales_order_document_id",
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
    field: "sales_order_issue_date",
    flex: 1,
  },
  {
    headerName: "ใช้ได้ถึง",
    field: "sales_order_due_date",
    flex: 1,
  },
  {
    headerName: "มูลค่าสุทธิ",
    field: "total_amount",
    flex: 1,
  },
  {
    headerName: "สถานะ",
    field: "sales_order_status",
    flex: 1,
    renderCell: (params) => mapStatusToRender(params.row.sales_order_status),
    valueGetter: (params) => mapStatusToFilter(params.row.sales_order_status),
  },
];

export default function SalesOrderComponent() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [allSalesOrder, setAllSalesOrder] = useState([]);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState(0);
  const [length, setLength] = useState({
    draftLength: 0,
    waitApproveLength: 0,
    notApproveLength: 0,
    approvedLength: 0,
  });

  const options = ["ดูรายงาน", "ดูรายการ", "พิมพ์รายงาน"];

  useEffect(() => {
    setIsLoading(true);
    getSalesOrder()
      .then((data) => {
        if (data.data.status === "success") {
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
              sales_order_issue_date: unixToDateWithFormat(
                ele.sales_order_issue_date
              ),
              sales_order_due_date: unixToDateWithFormat(
                ele.sales_order_due_date
              ),
            };
          });
          setAllSalesOrder(formatData);
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
      draftLength: allSalesOrder.filter(
        (data) => data.sales_order_status === "draft"
      ).length,
      waitApproveLength: allSalesOrder.filter(
        (data) => data.sales_order_status === "wait_approve"
      ).length,
      notApproveLength: allSalesOrder.filter(
        (data) => data.sales_order_status === "not_approve"
      ).length,
      approvedLength: allSalesOrder.filter(
        (data) => data.sales_order_status === "approved"
      ).length,
    });
  }, [allSalesOrder]);

  const filterByTab = (value) => {
    const newData = allSalesOrder.filter((data) => {
      return data.sales_order_status === value;
    });
    setRows(newData);
  };

  const switchTabHandler = () => {
    switch (value) {
      case 0:
        setRows(allSalesOrder);
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
        filterByTab("approved");
        break;
      case 5:
        const currentTimestamp = moment().unix();
        const newData = allSalesOrder.filter((data) => {
          return (
            data.sales_order_due_date < currentTimestamp &&
            data.sales_order_status !== "closed"
          );
        });
        setRows(newData);
        break;
      case 6:
        filterByTab("closed");
        break;
      case 7:
        filterByTab("cancelled");
        break;
      default:
        setRows(allSalesOrder);
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
          <div>อนุมัติแล้ว</div>
          <div className="account__badge__approved">
            {length.approvedLength}
          </div>
        </div>
      ),
      color: "#1F5BB2",
    },
    {
      label: "เกินเวลา",
      color: "#703600",
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
      name: "ใบสั่งขาย",
      to: "/income/sales-order",
    },
  ];

  const buttonWithLink = {
    to: "/income/sales-order/add",
    type: "button",
    text: "สร้างใบสั่งขาย",
    variant: "contained",
    color: "success",
  };

  const onRowDoubleClick = (params) => {
    let sales_order_document_id = params.row.sales_order_document_id;
    history.push("/income/sales-order/" + sales_order_document_id);
  };
  return (
    <>
      <AccountTableComponent
        heading="ใบสั่งขาย"
        tableRows={allSalesOrder}
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
