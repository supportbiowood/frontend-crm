import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../redux/actions/snackbarActions";
import { getAllEngineer } from "../../../adapter/Api";
import moment from "moment";
import EngineerTableComponent from "../EngineerTableComponent";
import { Backdrop, CircularProgress } from "@mui/material";
import { useHistory } from "react-router-dom";

const columns = [
  {
    headerName: "เลขที่เอกสาร",
    field: "engineer_document_id",
    flex: 1,
  },
  {
    headerName: "ประเภท",
    field: "job_type",
    flex: 1,
    renderCell: (params) => {
      let job_type = [];
      if (params.row.reproduction) {
        job_type.push("ถอดแบบ");
      }
      if (params.row.installation) {
        job_type.push("ติดตั้ง");
      }
      if (params.row.adjustment) {
        job_type.push("เพิ่ม/ลด");
      }
      return job_type.join("-");
    },
  },
  {
    headerName: "ความเร่งด่วน",
    field: "job_priority",
    flex: 1,
    renderCell: (params) => {
      switch (params.row.job_priority) {
        case "ด่วน":
          return <div className="engineer__status-assigned">ด่วน</div>;
        case "ทั่วไป":
          return <div className="engineer__status-closed">ทั่วไป</div>;
        default:
          return;
      }
    },
  },
  {
    headerName: "วันที่ออกเอกสาร",
    field: "engineer_issue_date",
    flex: 1,
    renderCell: (params) => {
      const engineer_issue_date = moment
        .unix(params.row.engineer_issue_date)
        .format("DD/MM/YYYY");
      return engineer_issue_date;
    },
  },
  {
    headerName: "วันที่จะเริ่มงาน",
    field: "engineer_start_date",
    flex: 1,
    renderCell: (params) => {
      const engineer_start_date = moment
        .unix(params.row.engineer_start_date)
        .format("DD/MM/YYYY");
      return engineer_start_date;
    },
  },
  {
    headerName: "วันที่กำหนดส่ง",
    field: "engineer_end_date",
    flex: 1,
    renderCell: (params) => {
      if (params.row.engineer_end_date) {
        const engineer_end_date = moment
          .unix(params.row.engineer_end_date)
          .format("DD/MM/YYYY");
        return engineer_end_date;
      } else {
        return "-";
      }
    },
  },
  {
    headerName: "โครงการ",
    field: "project_info",
    flex: 1,
    renderCell: (params) => {
      if (params.row.project_info.project_id) {
        const project =
          params.row.project_info.project_id +
          " " +
          params.row.project_info.project_name;
        return project;
      } else {
        return "-";
      }
    },
  },
  {
    headerName: "สร้างโดย",
    field: "created_by_employee",
    flex: 1,
    renderCell: (params) => {
      if (params.row.created_by_employee.employee_document_id) {
        const employee =
          params.row.created_by_employee.employee_firstname +
          " " +
          params.row.created_by_employee.employee_lastname;
        return employee;
      } else {
        return "-";
      }
    },
  },
  {
    headerName: "สถานะ",
    field: "engineer_status",
    flex: 1,
    renderCell: (params) => {
      switch (params.row.engineer_status) {
        case "draft":
          return <div className="engineer__status-draft">ร่าง</div>;
        case "wait_job_approve":
          return (
            <div className="engineer__status-wait_job_approve">
              งานถอดแบบใหม่
            </div>
          );
        case "job_approved":
          return (
            <div className="engineer__status-job_approved">ตรวจสอบแล้ว</div>
          );
        case "queue_accepted":
          return (
            <div className="engineer__status-queue_accepted">รับลงคิว</div>
          );
        case "assigned":
          return <div className="engineer__status-assigned">มอบหมาย</div>;
        case "in_progress":
          return <div className="engineer__status-in_progress">ดำเนินงาน</div>;
        case "wait_review":
          return <div className="engineer__status-wait_review">ตรวจรับงาน</div>;
        case "closed":
          return (
            <div className="engineer__status-closed">ใบสรุปประมาณถอดแบบ</div>
          );
        case "job_not_approve":
          return <div className="engineer__status-notApprove">ไม่อนุมัติ</div>;
        case "queue_declined":
          return <div className="engineer__status-notApprove">ไม่อนุมัติ</div>;
        case "work_declined":
          return <div className="engineer__status-notApprove">ไม่อนุมัติ</div>;
        default:
          return;
      }
    },
  },
];

export default function EngineerComponent() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [allEngineer, setAllEngineer] = useState([]);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [value, setValue] = useState(0);
  const [length, setLength] = useState({
    draftLength: 0,
    waitJobApproveLength: 0,
    jobApprovedLength: 0,
    queueAcceptedLength: 0,
    assignedLength: 0,
    inProgressLength: 0,
    waitReviewLength: 0,
  });

  useEffect(() => {
    setIsLoading(true);
    getAllEngineer()
      .then((data) => {
        if (data.data.status === "success") {
          let myData = data.data.data;
          const formatData = myData.map((ele, i) => {
            return {
              id: i + 1,
              ...ele,
            };
          });
          setAllEngineer(formatData);
          setRows(formatData);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        dispatch(showSnackbar("error", "ไม่สามารถเรียกข้อมูลได้"));
        setIsLoading(false);
      });
  }, [dispatch]);

  useEffect(() => {
    setLength({
      draftLength: allEngineer.filter(
        (data) => data.engineer_status === "draft"
      ).length,
      waitJobApproveLength: allEngineer.filter(
        (data) => data.engineer_status === "wait_job_approve"
      ).length,
      jobApprovedLength: allEngineer.filter(
        (data) => data.engineer_status === "job_approved"
      ).length,
      queueAcceptedLength: allEngineer.filter(
        (data) => data.engineer_status === "queue_accepted"
      ).length,
      assignedLength: allEngineer.filter(
        (data) => data.engineer_status === "assigned"
      ).length,
      inProgressLength: allEngineer.filter(
        (data) => data.engineer_status === "in_progress"
      ).length,
      waitReviewLength: allEngineer.filter(
        (data) => data.engineer_status === "wait_review"
      ).length,
    });
  }, [allEngineer]);

  const filterByTab = (value) => {
    const newData = allEngineer.filter((data) => {
      return data.engineer_status === value;
    });
    setRows(newData);
  };

  const switchTabHandler = () => {
    switch (value) {
      case 0:
        setRows(allEngineer);
        break;
      case 1:
        filterByTab("draft");
        break;
      case 2:
        filterByTab("wait_job_approve");
        break;
      case 3:
        filterByTab("job_approved");
        break;
      case 4:
        filterByTab("queue_accepted");
        break;
      case 5:
        filterByTab("assigned");
        break;
      case 6:
        filterByTab("in_progress");
        break;
      case 7:
        filterByTab("wait_review");
        break;
      case 8:
        filterByTab("closed");
        break;
      default:
        setRows(allEngineer);
    }
  };

  const customTabValue = [
    {
      label: "ทั้งหมด",
      color: "#333333",
    },
    {
      label: (
        <div className="engineer">
          <div>ร่าง</div>
          <div className="engineer__badge-draft">{length.draftLength}</div>
        </div>
      ),
      color: "#333333",
    },
    {
      label: (
        <div className="engineer">
          <div>งานถอดแบบใหม่</div>
          <div className="engineer__badge-wait_job_approve">
            {length.waitJobApproveLength}
          </div>
        </div>
      ),
      color: "#333333",
    },
    {
      label: (
        <div className="engineer">
          <div>ตรวจสอบแล้ว</div>
          <div className="engineer__badge-job_approved">
            {length.jobApprovedLength}
          </div>
        </div>
      ),
      color: "#1f5bb2",
    },
    {
      label: (
        <div className="engineer">
          <div>รับลงคิว</div>
          <div className="engineer__badge-queue_accepted">
            {length.queueAcceptedLength}
          </div>
        </div>
      ),
      color: "#C3762E",
    },
    {
      label: (
        <div className="engineer">
          <div>มอบหมาย</div>
          <div className="engineer__badge-assigned">
            {length.assignedLength}
          </div>
        </div>
      ),
      color: "#C3762E",
    },
    {
      label: (
        <div className="engineer">
          <div>ดำเนินงาน</div>
          <div className="engineer__badge-in_progress">
            {length.inProgressLength}
          </div>
        </div>
      ),
      color: "#C3762E",
    },
    {
      label: (
        <div className="engineer">
          <div>ตรวจรับงาน</div>
          <div className="engineer__badge-wait_review">
            {length.waitReviewLength}
          </div>
        </div>
      ),
      color: "#C3762E",
    },
    {
      label: "ใบสรุปประมาณถอดแบบ",
      color: "#246527",
    },
  ];

  const breadcrumbValue = [
    {
      name: "ถอดแบบ/ติดตั้ง",
      to: "/engineer",
    },
    {
      name: "ใบถอดแบบ/ติดตั้ง",
      to: "/engineer/estimate",
    },
  ];

  const buttonWithLink = {
    to: "/engineer/estimate/add",
    type: "button",
    text: "สร้างใบถอดแบบ/ติดตั้ง",
    variant: "contained",
    color: "success",
  };

  const onRowDoubleClick = (params) => {
    let engineer_document_id = params.row.engineer_document_id;
    history.push("/engineer/estimate/" + engineer_document_id);
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
      <EngineerTableComponent
        heading="ใบถอดแบบ/ติดตั้ง"
        tableRows={allEngineer}
        tableColumns={columns}
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
