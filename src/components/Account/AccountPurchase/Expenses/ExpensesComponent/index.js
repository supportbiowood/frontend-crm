import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import { getExpenses } from "../../../../../adapter/Api";
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
    field: "expenses_document_id",
    flex: 1,
  },
  {
    headerName: "ผู้ขาย",
    field: "vendor_name",
    flex: 1,
  },
  {
    headerName: "วันที่ออกเอกสาร",
    field: "expenses_issue_date",
    flex: 1,
  },
  {
    headerName: "ต้องการภายในวันที่",
    field: "expenses_due_date",
    flex: 1,
  },
  {
    headerName: "มูลค่าสุทธิ",
    field: "total_amount",
    flex: 1,
  },
  {
    headerName: "สถานะ",
    field: "expenses_status",
    flex: 1,
    renderCell: (params) => mapStatusToRender(params.row.expenses_status),
    valueGetter: (params) => mapStatusToFilter(params.row.expenses_status),
  },
];

export default function ExpensesComponent() {
  const dispatch = useDispatch();
  const [expenses, setExpenses] = useState([]);
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
    getExpenses()
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
              expenses_issue_date: unixToDateWithFormat(
                ele.expenses_issue_date
              ),
              expenses_due_date: unixToDateWithFormat(ele.expenses_due_date),
            };
          });
          setExpenses(formatData);
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
      draftLength: expenses.filter((data) => data.expenses_status === "draft")
        .length,
      waitPayLength: expenses.filter(
        (data) => data.expenses_status === "wait_payment"
      ).length,
    });
  }, [expenses]);

  const filterByTab = (value) => {
    const newData = expenses.filter((data) => {
      return data.expenses_status === value;
    });
    setRows(newData);
  };

  const switchTabHandler = () => {
    switch (value) {
      case 0:
        setRows(expenses);
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
        const newData = expenses.filter((data) => {
          return (
            data.expenses_due_date < currentTimestamp &&
            data.expenses_status !== "closed"
          );
        });
        setRows(newData);
        break;
      case 5:
        filterByTab("cancelled");
        break;
      default:
        setRows(expenses);
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
      name: "บันทึกค่าใช้จ่าย",
      to: "/expense/expenses",
    },
  ];

  const buttonWithLink = {
    to: "/expense/expenses/add",
    type: "button",
    text: "สร้างบันทึกค่าใช้จ่าย",
    variant: "contained",
    color: "success",
  };

  const onRowDoubleClick = (params) => {
    let expenses_document_id = params.row.expenses_document_id;
    window.location.href = "/expense/expenses/" + expenses_document_id;
  };
  return (
    <>
      <AccountTableComponent
        heading="บันทึกค่าใช้จ่าย"
        tableRows={expenses}
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
