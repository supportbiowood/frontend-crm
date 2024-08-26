import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getPurchaseReturn } from "../../../../../adapter/Api";
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
    field: "purchase_return_document_id",
    flex: 1,
  },
  {
    headerName: "ผู้ขาย",
    field: "vendor_name",
    flex: 1,
  },
  {
    headerName: "วันที่ออกเอกสาร",
    field: "purchase_return_issue_date",
    flex: 1,
  },
  {
    headerName: "วันที่ส่ง",
    field: "purchase_return_delivery_date",
    flex: 1,
  },
  {
    headerName: "มูลค่าสุทธิ",
    field: "total_amount",
    flex: 1,
  },
  {
    headerName: "สถานะ",
    field: "purchase_return_status",
    flex: 1,
    renderCell: (params) =>
      mapStatusToRender(params.row.purchase_return_status),
    valueGetter: (params) =>
      mapStatusToFilter(params.row.purchase_return_status),
  },
];

export default function PurchaseReturnComponent() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [allPurchaseReturn, setAllPurchaseReturn] = useState([]);
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
    getPurchaseReturn()
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
              purchase_return_issue_date: unixToDateWithFormat(
                ele.purchase_return_issue_date
              ),
              purchase_return_delivery_date: unixToDateWithFormat(
                ele.purchase_return_delivery_date
              ),
            };
          });
          setAllPurchaseReturn(formatData);
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
      draftLength: allPurchaseReturn.filter(
        (data) => data.purchase_return_status === "draft"
      ).length,
      waitApproveLength: allPurchaseReturn.filter(
        (data) => data.purchase_return_status === "wait_approve"
      ).length,
      notApproveLength: allPurchaseReturn.filter(
        (data) => data.purchase_return_status === "not_approve"
      ).length,
      approvedLength: allPurchaseReturn.filter(
        (data) => data.purchase_return_status === "approved"
      ).length,
    });
  }, [allPurchaseReturn]);

  const filterByTab = (value) => {
    const newData = allPurchaseReturn.filter((data) => {
      return data.purchase_return_status === value;
    });
    setRows(newData);
  };

  const switchTabHandler = () => {
    switch (value) {
      case 0:
        setRows(allPurchaseReturn);
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
        filterByTab("closed");
        break;
      case 6:
        filterByTab("cancelled");
        break;
      default:
        setRows(allPurchaseReturn);
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
      name: "รายจ่าย",
      to: "/expense",
    },
    {
      name: "ใบส่งคืน",
      to: "/expense/purchase-return",
    },
  ];

  const onRowDoubleClick = (params) => {
    let purchase_return_document_id = params.row.purchase_return_document_id;
    history.push("/expense/purchase-return/" + purchase_return_document_id);
  };
  return (
    <>
      <AccountTableComponent
        heading="ใบส่งคืน"
        tableRows={allPurchaseReturn}
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
