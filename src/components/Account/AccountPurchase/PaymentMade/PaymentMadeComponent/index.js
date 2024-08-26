import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import { getPaymentMade } from "../../../../../adapter/Api";
import AccountTableComponent from "../../../AccountTableComponent";
import { useHistory } from "react-router-dom";
import {
  mapPaymentChannelType,
  mapStatusToFilter,
  mapStatusToRender,
  toLocaleWithTwoDigits,
  unixToDateWithFormat,
} from "../../../../../adapter/Utils";

const columns = [
  {
    headerName: "เลขที่เอกสาร",
    field: "payment_made_document_id",
    flex: 1,
  },
  {
    headerName: "ผู้ขาย",
    field: "vendor_name",
    flex: 1,
  },
  {
    headerName: "วันที่ออกเอกสาร",
    field: "payment_made_issue_date",
    flex: 1,
  },
  {
    headerName: "ประเภท",
    field: "payment_channel_type",
    flex: 1,
  },
  {
    headerName: "มูลค่าสุทธิ",
    field: "total_amount",
    flex: 1,
  },
  {
    headerName: "สถานะ",
    field: "payment_made_status",
    flex: 1,
    renderCell: (params) => mapStatusToRender(params.row.payment_made_status),
    valueGetter: (params) => mapStatusToFilter(params.row.payment_made_status),
  },
];

export default function PaymentMadeComponent() {
  const dispatch = useDispatch();
  const [allPaymentMade, setAllPaymentMade] = useState([]);
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
    getPaymentMade()
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
              payment_made_issue_date: unixToDateWithFormat(
                ele.payment_made_issue_date
              ),
              payment_channel_type: mapPaymentChannelType(
                ele.payment_channel_type
              ),
            };
          });
          setAllPaymentMade(formatData);
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
      draftLength: allPaymentMade.filter(
        (data) => data.payment_made_status === "draft"
      ).length,
    });
  }, [allPaymentMade]);

  const filterByTab = (value) => {
    const newData = allPaymentMade.filter((data) => {
      return data.payment_made_status === value;
    });
    setRows(newData);
  };

  const switchTabHandler = () => {
    switch (value) {
      case 0:
        setRows(allPaymentMade);
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
        setRows(allPaymentMade);
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
      name: "รายจ่าย",
      to: "/expense",
    },
    {
      name: "การชำระเงิน",
      to: "/expense/payment-made",
    },
  ];

  const onRowDoubleClick = (params) => {
    let payment_made_document_id = params.row.payment_made_document_id;
    history.push("/expense/payment-made/" + payment_made_document_id);
  };
  return (
    <>
      <AccountTableComponent
        heading="การชำระเงิน"
        tableRows={allPaymentMade}
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
