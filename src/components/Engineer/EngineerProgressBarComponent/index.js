import { useEffect, useState } from "react";
import ProgressIndicatorComponent from "../../ProgressIndicatorComponent";

const EngineerProgressBarComponent = ({ status, isOpenQuotation }) => {
  const [state, setState] = useState({
    wait_job_approve: {
      isActive: false,
      isFinish: false,
      isCancel: false,
    },
    job_approved: {
      isActive: false,
      isFinish: false,
      isCancel: false,
    },
    queue_accepted: {
      isActive: false,
      isFinish: false,
      isCancel: false,
    },
    assigned: {
      isActive: false,
      isFinish: false,
      isCancel: false,
    },
    in_progress: {
      isActive: false,
      isFinish: false,
      isCancel: false,
    },
    wait_review: {
      isActive: false,
      isFinish: false,
      isCancel: false,
    },
    closed: {
      isActive: false,
      isFinish: false,
      isCancel: false,
    },
    is_open_quotation: {
      isActive: false,
      isFinish: false,
      isCancel: false,
    },
  });

  useEffect(() => {
    if (isOpenQuotation && isOpenQuotation === 1) {
      setState((prev) => ({
        ...prev,
        wait_job_approve: {
          isActive: false,
          isFinish: true,
          isCancell: false,
        },
        job_approved: {
          isActive: false,
          isFinish: true,
          isCancel: false,
        },
        queue_accepted: {
          isActive: false,
          isFinish: true,
          isCancel: false,
        },
        assigned: {
          isActive: false,
          isFinish: true,
          isCancel: false,
        },
        in_progress: {
          isActive: false,
          isFinish: true,
          isCancel: false,
        },
        wait_review: {
          isActive: false,
          isFinish: true,
          isCancel: false,
        },
        closed: {
          isActive: false,
          isFinish: true,
          isCancel: false,
        },
        is_open_quotation: {
          isActive: false,
          isFinish: true,
          isCancel: false,
        },
      }));
    } else {
      switch (status) {
        case "create":
          setState((prev) => ({
            ...prev,
            wait_job_approve: {
              isActive: false,
              isFinish: false,
              isCancel: false,
            },
          }));
          break;
        case "draft":
          setState((prev) => ({
            ...prev,
            wait_job_approve: {
              isActive: true,
              isFinish: false,
              isCancel: false,
            },
          }));
          break;
        case "wait_job_approve":
          setState((prev) => ({
            ...prev,
            wait_job_approve: {
              isActive: false,
              isFinish: true,
              isCancel: false,
            },
            job_approved: {
              isActive: true,
              isFinish: false,
              isCancel: false,
            },
          }));
          break;
        case "job_approved":
          setState((prev) => ({
            ...prev,
            wait_job_approve: {
              isActive: false,
              isFinish: true,
              isCancel: false,
            },
            job_approved: {
              isActive: false,
              isFinish: true,
              isCancel: false,
            },
            queue_accepted: {
              isActive: true,
              isFinish: false,
              isCancel: false,
            },
          }));

          break;
        case "job_not_approve":
          setState((prev) => ({
            ...prev,
            wait_job_approve: {
              isActive: true,
              isFinish: false,
              isCancel: false,
            },
            job_approved: {
              isActive: false,
              isFinish: false,
              isCancel: true,
            },
          }));
          break;
        case "queue_accepted":
          setState((prev) => ({
            ...prev,
            wait_job_approve: {
              isActive: false,
              isFinish: true,
              isCancel: false,
            },
            job_approved: {
              isActive: false,
              isFinish: true,
              isCancel: false,
            },
            queue_accepted: {
              isActive: false,
              isFinish: true,
              isCancel: false,
            },
            assigned: {
              isActive: true,
              isFinish: false,
              isCancel: false,
            },
          }));
          break;
        case "queue_declined":
          setState((prev) => ({
            ...prev,
            wait_job_approve: {
              isActive: false,
              isFinish: true,
              isCancell: false,
            },
            job_approved: {
              isActive: true,
              isFinish: false,
              isCancel: false,
            },
            queue_accepted: {
              isActive: false,
              isFinish: false,
              isCancel: true,
            },
          }));
          break;
        case "assigned":
          setState((prev) => ({
            ...prev,
            wait_job_approve: {
              isActive: false,
              isFinish: true,
              isCancel: false,
            },
            job_approved: {
              isActive: false,
              isFinish: true,
              isCancel: false,
            },
            queue_accepted: {
              isActive: false,
              isFinish: true,
              isCancel: false,
            },
            assigned: {
              isActive: false,
              isFinish: true,
              isCancel: false,
            },
            in_progress: {
              isActive: true,
              isFinish: false,
              isCancel: false,
            },
          }));
          break;
        case "in_progress":
          setState((prev) => ({
            ...prev,
            wait_job_approve: {
              isActive: false,
              isFinish: true,
              isCancell: false,
            },
            job_approved: {
              isActive: false,
              isFinish: true,
              isCancel: false,
            },
            queue_accepted: {
              isActive: false,
              isFinish: true,
              isCancel: false,
            },
            assigned: {
              isActive: false,
              isFinish: true,
              isCancel: false,
            },
            in_progress: {
              isActive: false,
              isFinish: true,
              isCancel: false,
            },
            wait_review: {
              isActive: true,
              isFinish: false,
              isCancel: false,
            },
          }));
          break;
        case "wait_review":
          setState((prev) => ({
            ...prev,
            wait_job_approve: {
              isActive: false,
              isFinish: true,
              isCancell: false,
            },
            job_approved: {
              isActive: false,
              isFinish: true,
              isCancel: false,
            },
            queue_accepted: {
              isActive: false,
              isFinish: true,
              isCancel: false,
            },
            assigned: {
              isActive: false,
              isFinish: true,
              isCancel: false,
            },
            in_progress: {
              isActive: false,
              isFinish: true,
              isCancel: false,
            },
            wait_review: {
              isActive: false,
              isFinish: true,
              isCancel: false,
            },
            closed: {
              isActive: true,
              isFinish: false,
              isCancel: false,
            },
          }));
          break;
        case "work_declined":
          setState((prev) => ({
            ...prev,
            wait_job_approve: {
              isActive: false,
              isFinish: true,
              isCancell: false,
            },
            job_approved: {
              isActive: false,
              isFinish: true,
              isCancel: false,
            },
            queue_accepted: {
              isActive: false,
              isFinish: true,
              isCancel: false,
            },
            assigned: {
              isActive: false,
              isFinish: true,
              isCancel: false,
            },
            in_progress: {
              isActive: true,
              isFinish: false,
              isCancel: false,
            },
            wait_review: {
              isActive: false,
              isFinish: false,
              isCancel: true,
            },
          }));
          break;
        case "closed":
          setState((prev) => ({
            ...prev,
            wait_job_approve: {
              isActive: false,
              isFinish: true,
              isCancell: false,
            },
            job_approved: {
              isActive: false,
              isFinish: true,
              isCancel: false,
            },
            queue_accepted: {
              isActive: false,
              isFinish: true,
              isCancel: false,
            },
            assigned: {
              isActive: false,
              isFinish: true,
              isCancel: false,
            },
            in_progress: {
              isActive: false,
              isFinish: true,
              isCancel: false,
            },
            wait_review: {
              isActive: false,
              isFinish: true,
              isCancel: false,
            },
            closed: {
              isActive: false,
              isFinish: true,
              isCancel: false,
            },
          }));
          break;
        default:
          break;
      }
    }
  }, [status, isOpenQuotation]);
  return (
    <>
      <div>
        <ul className="account__progressbar-wrapper">
          <ProgressIndicatorComponent
            isActive={state.wait_job_approve.isActive}
            isFinish={state.wait_job_approve.isFinish}
            isCancell={state.wait_job_approve.isCancel}
            title="งานถอดแบบใหม่"
          />
          <ProgressIndicatorComponent
            isActive={state.job_approved.isActive}
            isFinish={state.job_approved.isFinish}
            isCancell={state.job_approved.isCancel}
            title="ตรวจสอบแล้ว"
          />
          <ProgressIndicatorComponent
            isActive={state.queue_accepted.isActive}
            isFinish={state.queue_accepted.isFinish}
            isCancell={state.queue_accepted.isCancel}
            title="รับลงคิว"
          />
          <ProgressIndicatorComponent
            isActive={state.assigned.isActive}
            isFinish={state.assigned.isFinish}
            isCancell={state.assigned.isCancel}
            title="มอบหมาย"
          />
          <ProgressIndicatorComponent
            isActive={state.in_progress.isActive}
            isFinish={state.in_progress.isFinish}
            isCancell={state.in_progress.isCancel}
            title="ดำเนินงาน"
          />
          <ProgressIndicatorComponent
            isActive={state.wait_review.isActive}
            isFinish={state.wait_review.isFinish}
            isCancell={state.wait_review.isCancel}
            title="ตรวจรับงาน"
          />
          <ProgressIndicatorComponent
            isActive={state.closed.isActive}
            isFinish={state.closed.isFinish}
            isCancell={state.closed.isCancel}
            title="ใบสรุปประมาณถอดแบบ"
          />
          <div className="engineer__status-wrapper">
            <div
              className={`engineer__status-icon${
                state.is_open_quotation.isFinish ? "-finish" : ""
              }`}
            />
            <div>ใบเสนอราคา</div>
          </div>
        </ul>
      </div>
    </>
  );
};

export default EngineerProgressBarComponent;
