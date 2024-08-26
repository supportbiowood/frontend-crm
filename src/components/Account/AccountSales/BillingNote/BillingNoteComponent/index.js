import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import { getBillingNote } from "../../../../../adapter/Api";
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
    field: "billing_note_document_id",
    flex: 1,
  },
  {
    headerName: "โครงการ",
    field: "project",
    flex: 1,
  },
  {
    headerName: "ลูกค้า",
    field: "contact_name",
    flex: 1,
  },
  {
    headerName: "วันที่ออกเอกสาร",
    field: "billing_note_issue_date",
    flex: 1,
  },
  {
    headerName: "วันที่ครบกำหนด",
    field: "billing_note_due_date",
    flex: 1,
  },
  {
    headerName: "มูลค่าสุทธิ",
    field: "total_amount",
    flex: 1,
  },
  {
    headerName: "สถานะ",
    field: "billing_note_status",
    flex: 1,
    renderCell: (params) => mapStatusToRender(params.row.billing_note_status),
    valueGetter: (params) => mapStatusToFilter(params.row.billing_note_status),
  },
];

export default function BillingNoteComponent() {
  const dispatch = useDispatch();
  const [allBillingNote, setAllBillingNote] = useState([]);
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
    getBillingNote()
      .then((data) => {
        if (data.data.status === "success") {
          console.log(data.data.data);
          let myData = data.data.data;
          const formatData = myData.map((ele, i) => {
            const project_list = ele.sales_invoice_project_list;
            const uniqueProjectList = [
              ...new Map(
                project_list.map((item, key) => [item[key], item])
              ).values(),
            ]
              .map((project) => project.project_name)
              .join(", ");
            return {
              ...ele,
              id: i + 1,
              project: uniqueProjectList ? uniqueProjectList : "-",
              contact_name: ele.billing_info?.contact_name,
              total_amount: toLocaleWithTwoDigits(ele.total_amount),
              billing_note_issue_date: unixToDateWithFormat(
                ele.billing_note_issue_date
              ),
              billing_note_due_date: unixToDateWithFormat(
                ele.billing_note_due_date
              ),
            };
          });
          setAllBillingNote(formatData);
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
      draftLength: allBillingNote.filter(
        (data) => data.billing_note_status === "draft"
      ).length,
      waitPayLength: allBillingNote.filter(
        (data) => data.billing_note_status === "wait_payment"
      ).length,
    });
  }, [allBillingNote]);

  const filterByTab = (value) => {
    const newData = allBillingNote.filter((data) => {
      return data.billing_note_status === value;
    });
    setRows(newData);
  };

  const switchTabHandler = () => {
    switch (value) {
      case 0:
        setRows(allBillingNote);
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
        const newData = allBillingNote.filter((data) => {
          return (
            data.billing_note_due_date < currentTimestamp &&
            data.billing_note_status !== "closed"
          );
        });
        setRows(newData);
        break;
      case 5:
        filterByTab("cancelled");
        break;
      default:
        setRows(allBillingNote);
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
      name: "รายรับ",
      to: "/income",
    },
    {
      name: "ใบวางบิล",
      to: "/income/billing-note",
    },
  ];

  const buttonWithLink = {
    to: "/income/billing-note/add",
    type: "button",
    text: "สร้างใบวางบิล",
    variant: "contained",
    color: "success",
  };

  const onRowDoubleClick = (params) => {
    let billing_note_document_id = params.row.billing_note_document_id;
    window.location.href = "/income/billing-note/" + billing_note_document_id;
  };
  return (
    <>
      <AccountTableComponent
        heading="ใบวางบิล"
        tableRows={allBillingNote}
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
