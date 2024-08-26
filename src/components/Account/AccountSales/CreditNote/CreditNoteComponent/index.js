import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCreditNote } from "../../../../../adapter/Api";
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
    field: "credit_note_document_id",
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
    field: "credit_note_issue_date",
    flex: 1,
  },
  {
    headerName: "มูลค่าสุทธิ",
    field: "total_amount",
    flex: 1,
  },
  {
    headerName: "สถานะ",
    field: "credit_note_status",
    flex: 1,
    renderCell: (params) => mapStatusToRender(params.row.credit_note_status),
    valueGetter: (params) => mapStatusToFilter(params.row.credit_note_status),
  },
];

export default function CreditNoteComponent() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [allCreditNote, setAllCreditNote] = useState([]);
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
    getCreditNote()
      .then((data) => {
        if (data.data.status === "success") {
          console.log(data.data.data);
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
              credit_note_issue_date: unixToDateWithFormat(
                ele.credit_note_issue_date
              ),
            };
          });
          setAllCreditNote(formatData);
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
      draftLength: allCreditNote.filter(
        (data) => data.credit_note_status === "draft"
      ).length,
      waitApproveLength: allCreditNote.filter(
        (data) => data.credit_note_status === "wait_approve"
      ).length,
      notApproveLength: allCreditNote.filter(
        (data) => data.credit_note_status === "not_approve"
      ).length,
      approvedLength: allCreditNote.filter(
        (data) => data.credit_note_status === "approved"
      ).length,
    });
  }, [allCreditNote]);

  const filterByTab = (value) => {
    const newData = allCreditNote.filter((data) => {
      return data.credit_note_status === value;
    });
    setRows(newData);
  };

  const switchTabHandler = () => {
    switch (value) {
      case 0:
        setRows(allCreditNote);
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
        setRows(allCreditNote);
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
      name: "รายรับ",
      to: "/income",
    },
    {
      name: "ใบลดหนี้",
      to: "/income/credit-note",
    },
  ];

  const buttonWithLink = {
    to: "/income/credit-note/add",
    type: "button",
    text: "สร้างใบลดหนี้",
    variant: "contained",
    color: "success",
  };

  const onRowDoubleClick = (params) => {
    let credit_note_document_id = params.row.credit_note_document_id;
    history.push("/income/credit-note/" + credit_note_document_id);
  };
  return (
    <>
      <AccountTableComponent
        heading="ใบลดหนี้"
        tableRows={allCreditNote}
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
