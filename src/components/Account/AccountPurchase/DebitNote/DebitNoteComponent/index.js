import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getDebitNote } from "../../../../../adapter/Api";
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
    field: "debit_note_document_id",
    flex: 1,
  },
  {
    headerName: "ผู้ขาย",
    field: "vendor_name",
    flex: 1,
  },
  {
    headerName: "วันที่ออกเอกสาร",
    field: "debit_note_issue_date",
    flex: 1,
  },
  {
    headerName: "มูลค่าสุทธิ",
    field: "total_amount",
    flex: 1,
  },
  {
    headerName: "สถานะ",
    field: "debit_note_status",
    flex: 1,
    renderCell: (params) => mapStatusToRender(params.row.debit_note_status),
    valueGetter: (params) => mapStatusToFilter(params.row.debit_note_status),
  },
];

export default function DebitNoteComponent() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [allDebitNote, setAllDebitNote] = useState([]);
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
    getDebitNote()
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
              debit_note_issue_date: unixToDateWithFormat(
                ele.debit_note_issue_date
              ),
            };
          });
          setAllDebitNote(formatData);
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
      draftLength: allDebitNote.filter(
        (data) => data.debit_note_status === "draft"
      ).length,
      waitApproveLength: allDebitNote.filter(
        (data) => data.debit_note_status === "wait_approve"
      ).length,
      notApproveLength: allDebitNote.filter(
        (data) => data.debit_note_status === "not_approve"
      ).length,
      approvedLength: allDebitNote.filter(
        (data) => data.debit_note_status === "approved"
      ).length,
    });
  }, [allDebitNote]);

  const filterByTab = (value) => {
    const newData = allDebitNote.filter((data) => {
      return data.debit_note_status === value;
    });
    setRows(newData);
  };

  const switchTabHandler = () => {
    switch (value) {
      case 0:
        setRows(allDebitNote);
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
        setRows(allDebitNote);
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

  const buttonWithLink = {
    to: "/expense/debit-note/add",
    type: "button",
    text: "สร้างรับใบลดหนี้",
    variant: "contained",
    color: "success",
  };

  const breadcrumbValue = [
    {
      name: "รายจ่าย",
      to: "/expense",
    },
    {
      name: "รับใบลดหนี้",
      to: "/expense/debit-note",
    },
  ];

  const onRowDoubleClick = (params) => {
    let debit_note_document_id = params.row.debit_note_document_id;
    history.push("/expense/debit-note/" + debit_note_document_id);
  };
  return (
    <>
      <AccountTableComponent
        heading="รับใบลดหนี้"
        tableRows={allDebitNote}
        tableColumns={columns}
        buttonWithLink={buttonWithLink}
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
