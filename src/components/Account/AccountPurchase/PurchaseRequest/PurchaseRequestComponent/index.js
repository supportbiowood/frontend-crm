import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import { getPurchaseRequest } from "../../../../../adapter/Api";
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
    field: "purchase_request_document_id",
    flex: 1,
  },
  {
    headerName: "วันที่ออกเอกสาร",
    field: "purchase_request_issue_date",
    flex: 1,
  },
  {
    headerName: "ต้องการภายในวันที่",
    field: "purchase_request_due_date",
    flex: 1,
  },
  {
    headerName: "สถานะ",
    field: "purchase_request_status",
    flex: 1,
    renderCell: (params) =>
      mapStatusToRender(params.row.purchase_request_status),
    valueGetter: (params) =>
      mapStatusToFilter(params.row.purchase_request_status),
  },
];

export default function PurchaseRequestComponent() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [allPurchaseRequest, setAllPurchaseRequest] = useState([]);
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
    getPurchaseRequest()
      .then((data) => {
        if (data.data.status === "success") {
          console.log(data.data.data);
          let myData = data.data.data;
          const formatData = myData.map((ele, i) => {
            return {
              ...ele,
              id: i + 1,
              purchase_request_issue_date: unixToDateWithFormat(
                ele.purchase_request_issue_date
              ),
              purchase_request_due_date: unixToDateWithFormat(
                ele.purchase_request_due_date
              ),
            };
          });
          setAllPurchaseRequest(formatData);
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
      draftLength: allPurchaseRequest.filter(
        (data) => data.purchase_request_status === "draft"
      ).length,
      waitApproveLength: allPurchaseRequest.filter(
        (data) => data.purchase_request_status === "wait_approve"
      ).length,
      notApproveLength: allPurchaseRequest.filter(
        (data) => data.purchase_request_status === "not_approve"
      ).length,
      approvedLength: allPurchaseRequest.filter(
        (data) => data.purchase_request_status === "approved"
      ).length,
    });
  }, [allPurchaseRequest]);

  const filterByTab = (value) => {
    const newData = allPurchaseRequest.filter((data) => {
      return data.purchase_request_status === value;
    });
    setRows(newData);
  };

  const switchTabHandler = () => {
    switch (value) {
      case 0:
        setRows(allPurchaseRequest);
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
        const newData = allPurchaseRequest.filter((data) => {
          return (
            data.purchase_request_due_date < currentTimestamp &&
            data.purchase_request_status !== "fully_order"
          );
        });
        setRows(newData);
        break;
      case 6:
        filterByTab("ordering");
        break;
      case 7:
        filterByTab("fully_order");
        break;
      case 8:
        filterByTab("cancelled");
        break;
      default:
        setRows(allPurchaseRequest);
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
      label: "สั่งซื้อแล้วบางส่วน",
      color: "#333333",
    },
    {
      label: "สั่งซื้อแล้ว",
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
      name: "ใบขอซื้อ",
      to: "/expense/purchase-request",
    },
  ];

  const buttonWithLink = {
    to: "/expense/purchase-request/add",
    type: "button",
    text: "สร้างใบขอซื้อ",
    variant: "contained",
    color: "success",
  };

  const onRowDoubleClick = (params) => {
    let purchase_request_document_id = params.row.purchase_request_document_id;
    history.push("/expense/purchase-request/" + purchase_request_document_id);
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
        heading="ใบขอซื้อ"
        tableRows={allPurchaseRequest}
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
