import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../../../redux/actions/snackbarActions";
import { getQuotation } from "../../../../../adapter/Api";
import moment from "moment";
import AccountTableComponent from "../../../AccountTableComponent";
import { Backdrop, CircularProgress } from "@mui/material";
import { useHistory } from "react-router-dom";
import {
  mapStatusToFilter,
  mapStatusToRender,
  toLocaleWithTwoDigits,
  unixToDateWithFormat,
} from "../../../../../adapter/Utils";
// import { all } from "async";
// import { date } from "yup";
// import { all } from "async";

const columns = [
  {
    headerName: "เลขที่เอกสาร",
    field: "quotation_document_id",
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
    field: "quotation_issue_date",
    flex: 1,
  },
  {
    headerName: "ใช้ได้ถึง",
    field: "quotation_valid_until_date",
    flex: 1,
  },
  {
    headerName: "มูลค่าสุทธิ",
    field: "total_amount",
    flex: 1,
  },
  {
    headerName: "สถานะ",
    field: "quotation_status",
    flex: 1,
    sortable: false,
    renderCell: (params) => mapStatusToRender(params.row.quotation_status),
    valueGetter: (params) => mapStatusToFilter(params.row.quotation_status),
  },
];

export default function QuotationComponent() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [allQuotation, setAllQuotation] = useState([]);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState(0);
  const [length, setLength] = useState({
    draftLength: 0,
    waitApproveLength: 0,
    notApproveLength: 0,
    waitAcceptLength: 0,
    acceptedLength: 0,
  });

  const options = ["ดูรายงาน", "ดูรายการ", "พิมพ์รายงาน"];

  useEffect(() => {
    setIsLoading(true);
    getQuotation()
      .then((data) => {
        if (data.data.status === "success") {
          let myData = data.data.data;
          const formatData = myData.map((ele, i) => {
            return {
              ...ele,
              id: i + 1,
              project_document_id: ele.billing_info?.project_document_id || "-",
                // ? ele.billing_info?.project_document_id
                // : "-",
              contact_name: ele.billing_info?.contact_name,
              total_amount: toLocaleWithTwoDigits(ele.total_amount),
              quotation_issue_date: unixToDateWithFormat(
                ele.quotation_issue_date
              ),
              quotation_valid_until_date: unixToDateWithFormat(
                ele.quotation_valid_until_date
              ),
            };
          });
          setAllQuotation(formatData);
          setRows(formatData);
          setIsLoading(false);
        } else{
          dispatch(showSnackbar("error", "ไม่สามารถดึงข้อมูลได้")); 
        }
      })
      .catch((err) => {
        console.log(err);
        dispatch(showSnackbar("error", "ไม่สามารถเรียกข้อมูลได้"));
        setIsLoading(false);
      });
  }, [dispatch]);

  useEffect(() => {
    if (allQuotation.length > 0 ) {
      setLength({
        draftLength: allQuotation.filter(
          (data) => data.quotation_status === "draft"
        ).length,
        waitApproveLength: allQuotation.filter(
          (data) => data.quotation_status === "wait_approve"
        ).length,
        notApproveLength: allQuotation.filter(
          (data) => data.quotation_status === "not_approve"
        ).length,
        waitAcceptLength: allQuotation.filter(
          (data) => data.quotation_status === "wait_accept"
        ).length,
        acceptedLength: allQuotation.filter(
          (data) => data.quotation_status === "accepted"
        ).length,
      });
    }
  }, [allQuotation]);

  const filterByTab = (value) => {
    const newData = allQuotation.filter((data) => {
      return data.quotation_status === value;
    });
    setRows(newData);
  }; // eslint-disable-line no-unused-vars
  

  const switchTabHandler = () => {
    // let newData = [];
    switch (value) {
      case 0:
        // newData = allQuotation;
        setRows(allQuotation);
        break;
      case 1:
        // newData = allQuotation.filter((data) => data.quotation_status === "draft");
        filterByTab("draft");
        break;
      case 2:
        // newData = allQuotation.filter((data) => data.quotation_status === "wait_approve");
        filterByTab("wait_approve");
        break;
      case 3:
        // newData = allQuotation.filter((data) => data.quotation_status === "not_approve");
        filterByTab("not_approve");
        break;
      case 4:
        // newData = allQuotation.filter((data) => data.quotation_status === "wait_accept");
        filterByTab("wait_accept");
        break;
      case 5:
        // newData = allQuotation.filter((data) => data.quotation_status === "accepted");
        filterByTab("accepted");
        break;
      case 6:
        const currentTimestamp = moment().unix();
      setRows(
        allQuotation.filter(
          (data) => data.quotation_valid_until_date < currentTimestamp && data.quotation_status !== "closed"
        )
      );
        break;
      case 7:
        // newData = allQuotation.filter((data) => data.quotation_status === "closed");
        filterByTab("closed");
        break;
      case 8:
        // newData = allQuotation.filter((data) => data.quotation_status === "cancelled");
        filterByTab("cancelled");
        break;
      default:
        setRows(allQuotation);
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
          <div>รอตอบรับ</div>
          <div className="account__badge__waitAccept">
            {length.waitAcceptLength}
          </div>
        </div>
      ),
      color: "#C3762E",
    },
    {
      label: (
        <div className="account">
          <div>ตอบรับแล้ว</div>
          <div className="account__badge__accepted">
            {length.acceptedLength}
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
      name: "ใบเสนอราคา",
      to: "/income/quotation",
    },
  ];

  const buttonWithLink = {
    to: "/income/quotation/add",
    type: "button",
    text: "สร้างใบเสนอราคา",
    variant: "contained",
    color: "success",
  };

  const onRowDoubleClick = (params) => {
    if (params.row.quotation_document_id) {
      history.push(`/income/quotation/${params.row.quotation_document_id}`);
    } else {
      dispatch(showSnackbar("error", "ไม่พบเอกสารใบเสนอราคา"))
    }
    // let quotation_document_id = params.row.quotation_document_id;
    
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
        heading="ใบเสนอราคา"
        tableRows={allQuotation}
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
