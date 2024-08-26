import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getDeliveryNote } from "../../../../../adapter/Api";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import AccountTableComponent from "../../../AccountTableComponent";
import { useHistory } from "react-router-dom";
import {
  mapStatusToFilter,
  mapStatusToRender,
  unixToDateWithFormat,
} from "../../../../../adapter/Utils";

const columns = [
  {
    headerName: "เลขที่เอกสาร",
    field: "delivery_note_document_id",
    flex: 1,
  },
  {
    headerName: "วันที่ออกเอกสาร",
    field: "delivery_note_issue_date",
    flex: 1,
  },
  {
    headerName: "วันที่ส่ง",
    field: "delivery_note_delivery_date",
    flex: 1,
  },
  {
    headerName: "ผู้ส่ง",
    field: "sender",
    flex: 1,
  },
  {
    headerName: "สถานะ",
    field: "delivery_note_status",
    flex: 1,
    renderCell: (params) => mapStatusToRender(params.row.delivery_note_status),
    valueGetter: (params) => mapStatusToFilter(params.row.delivery_note_status),
  },
];

export default function DeliveryOrderComponent() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [allDeliveryOrder, setAllDeliveryOrder] = useState([]);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState(0);
  const [length, setLength] = useState({
    draftLength: 0,
    waitDeliveryLength: 0,
    notCompleteLength: 0,
  });

  const options = ["ดูรายงาน", "ดูรายการ", "พิมพ์รายงาน"];

  useEffect(() => {
    setIsLoading(true);
    getDeliveryNote()
      .then((data) => {
        if (data.data.status === "success") {
          console.log(data.data.data);
          let myData = data.data.data;
          const formatData = myData.map((ele, i) => {
            return {
              ...ele,
              id: i + 1,
              sender:
                ele.delivery_info?.sender?.employee_firstname +
                " " +
                ele.delivery_info?.sender?.employee_lastname,
              delivery_note_issue_date: unixToDateWithFormat(
                ele.delivery_note_issue_date
              ),
              delivery_note_delivery_date: unixToDateWithFormat(
                ele.delivery_note_delivery_date
              ),
            };
          });
          setAllDeliveryOrder(formatData);
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
      draftLength: allDeliveryOrder.filter(
        (data) => data.delivery_note_status === "draft"
      ).length,
      waitDeliveryLength: allDeliveryOrder.filter(
        (data) => data.delivery_note_status === "wait_delivery"
      ).length,
      notCompleteLength: allDeliveryOrder.filter(
        (data) => data.delivery_note_status === "not_complete"
      ).length,
    });
  }, [allDeliveryOrder]);

  const filterByTab = (value) => {
    const newData = allDeliveryOrder.filter((data) => {
      return data.delivery_note_status === value;
    });
    setRows(newData);
  };

  const switchTabHandler = () => {
    switch (value) {
      case 0:
        setRows(allDeliveryOrder);
        break;
      case 1:
        filterByTab("draft");
        break;
      case 2:
        filterByTab("wait_delivery");
        break;
      case 3:
        filterByTab("not_complete");
        break;
      case 4:
        filterByTab("closed");
        break;
      case 5:
        filterByTab("cancelled");
        break;
      default:
        setRows(allDeliveryOrder);
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
          <div>รอส่ง</div>
          <div className="account__badge__waitApprove">
            {length.waitDeliveryLength}
          </div>
        </div>
      ),
      color: "#C3762E",
    },
    {
      label: (
        <div className="account">
          <div>ไม่สำเร็จ</div>
          <div className="account__badge__notApprove">
            {length.notCompleteLength}
          </div>
        </div>
      ),
      color: "#B54839",
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
      name: "ใบส่งของ",
      to: "/income/delivery-order",
    },
  ];

  const buttonWithLink = {
    to: "/income/delivery-order/add",
    type: "button",
    text: "สร้างใบส่งของ",
    variant: "contained",
    color: "success",
  };

  const onRowDoubleClick = (params) => {
    let delivery_note_document_id = params.row.delivery_note_document_id;
    history.push("/income/delivery-order/" + delivery_note_document_id);
  };
  return (
    <>
      <AccountTableComponent
        heading="ใบส่งของ"
        tableRows={allDeliveryOrder}
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
