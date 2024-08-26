import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import { getPurchaseOrder } from "../../../../../adapter/Api";
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
    field: "purchase_order_document_id",
    flex: 1,
  },
  {
    headerName: "วันที่ออกเอกสาร",
    field: "purchase_order_issue_date",
    flex: 1,
  },
  {
    headerName: "ต้องการภายในวันที่",
    field: "purchase_order_due_date",
    flex: 1,
  },
  {
    headerName: "วันประมาณการณ์สินค้าเข้า",
    field: "purchase_order_expect_date",
    flex: 1,
  },
  {
    headerName: "ผู้ขาย",
    field: "vendor_name",
    flex: 1,
  },
  {
    headerName: "สถานะ",
    field: "purchase_order_status",
    flex: 1,
    renderCell: (params) => mapStatusToRender(params.row.purchase_order_status),
    valueGetter: (params) =>
      mapStatusToFilter(params.row.purchase_order_status),
  },
];

export default function PurchaseOrderComponent() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [allPurchaseOrder, setAllPurchaseOrder] = useState([]);
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
    getPurchaseOrder()
      .then((data) => {
        if (data.data.status === "success") {
          let myData = data.data.data;
          const formatData = myData.map((ele, i) => {
            return {
              ...ele,
              id: i + 1,
              vendor_name: ele.vendor_info?.contact_name,
              purchase_order_issue_date: unixToDateWithFormat(
                ele.purchase_order_issue_date
              ),
              purchase_order_due_date: unixToDateWithFormat(
                ele.purchase_order_due_date
              ),
              purchase_order_expect_date: unixToDateWithFormat(
                ele.purchase_order_expect_date
              ),
            };
          });
          setAllPurchaseOrder(formatData);
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
      draftLength: allPurchaseOrder.filter(
        (data) => data.purchase_order_status === "draft"
      ).length,
      waitApproveLength: allPurchaseOrder.filter(
        (data) => data.purchase_order_status === "wait_approve"
      ).length,
      notApproveLength: allPurchaseOrder.filter(
        (data) => data.purchase_order_status === "not_approve"
      ).length,
      approvedLength: allPurchaseOrder.filter(
        (data) => data.purchase_order_status === "approved"
      ).length,
    });
  }, [allPurchaseOrder]);

  const filterByTab = (value) => {
    const newData = allPurchaseOrder.filter((data) => {
      return data.purchase_order_status === value;
    });
    setRows(newData);
  };

  const switchTabHandler = () => {
    switch (value) {
      case 0:
        setRows(allPurchaseOrder);
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
        const newData = allPurchaseOrder.filter((data) => {
          return (
            data.purchase_order_due_date < currentTimestamp &&
            data.purchase_order_status !== "fully_import"
          );
        });
        setRows(newData);
        break;
      case 6:
        filterByTab("importing");
        break;
      case 7:
        filterByTab("finished");
        break;
      case 8:
        filterByTab("cancelled");
        break;
      default:
        setRows(allPurchaseOrder);
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
      label: "นำเข้าแล้วบางส่วน",
      color: "#333333",
    },
    {
      label: "นำเข้าแล้ว",
      color: "#246527",
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
      name: "ใบสั่งซื้อ",
      to: "/expense/purchase-order",
    },
  ];

  const buttonWithLink = {
    to: "/expense/purchase-order/add",
    type: "button",
    text: "สร้างใบสั่งซื้อ",
    variant: "contained",
    color: "success",
  };

  const onRowDoubleClick = (params) => {
    let purchase_order_document_id = params.row.purchase_order_document_id;
    history.push("/expense/purchase-order/" + purchase_order_document_id);
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
        heading="ใบสั่งซื้อ"
        tableRows={allPurchaseOrder}
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
