import React, { useState, useEffect } from "react";
import ProgressIndicatorComponent from "../../ProgressIndicatorComponent";

const AccountProgressBarComponent = ({
  step,
  quotationAccepted,
  quotationCancelled,
  salesOrderAccepted,
  paymentCompleted,
  partialPayment,
}) => {
  const [state, setState] = useState({
    quotation: {
      isActive: false,
      isFinish: false,
      isCancell: false,
    },
    salesOrder: {
      isActive: false,
      isFinish: false,
      isCancell: false,
    },
    salesInvoice: {
      isActive: false,
      isFinish: false,
      isCancell: false,
    },
    receipt: {
      isActive: false,
      isFinish: false,
      isCancell: false,
    },
  });
  useEffect(() => {
    switch (step) {
      case "quotation":
        if (quotationAccepted) {
          setState({
            quotation: {
              isActive: false,
              isFinish: true,
              isCancell: false,
            },
            salesOrder: {
              isActive: false,
              isFinish: false,
              isCancell: false,
            },
            salesInvoice: {
              isActive: false,
              isFinish: false,
              isCancell: false,
            },
            receipt: {
              isActive: false,
              isFinish: false,
              isCancell: false,
            },
          });
        } else if (quotationCancelled) {
          setState({
            quotation: {
              isActive: false,
              isFinish: false,
              isCancell: true,
            },
            salesOrder: {
              isActive: false,
              isFinish: false,
              isCancell: false,
            },
            salesInvoice: {
              isActive: false,
              isFinish: false,
              isCancell: false,
            },
            receipt: {
              isActive: false,
              isFinish: false,
              isCancell: false,
            },
          });
        } else {
          setState({
            quotation: {
              isActive: true,
              isFinish: false,
              isCancell: false,
            },
            salesOrder: {
              isActive: false,
              isFinish: false,
              isCancell: false,
            },
            salesInvoice: {
              isActive: false,
              isFinish: false,
              isCancell: false,
            },
            receipt: {
              isActive: false,
              isFinish: false,
              isCancell: false,
            },
          });
        }
        break;
      case "salesOrder":
        if (salesOrderAccepted) {
          setState({
            quotation: {
              isActive: false,
              isFinish: true,
              isCancell: false,
            },
            salesOrder: {
              isActive: false,
              isFinish: true,
              isCancell: false,
            },
            salesInvoice: {
              isActive: false,
              isFinish: false,
              isCancell: false,
            },
            receipt: {
              isActive: false,
              isFinish: false,
              isCancell: false,
            },
          });
        } else {
          setState({
            quotation: {
              isActive: false,
              isFinish: true,
              isCancell: false,
            },
            salesOrder: {
              isActive: true,
              isFinish: false,
              isCancell: false,
            },
            salesInvoice: {
              isActive: false,
              isFinish: false,
              isCancell: false,
            },
            receipt: {
              isActive: false,
              isFinish: false,
              isCancell: false,
            },
          });
        }
        break;
      case "salesInvoice":
        if (paymentCompleted) {
          setState({
            quotation: {
              isActive: false,
              isFinish: true,
              isCancell: false,
            },
            salesOrder: {
              isActive: false,
              isFinish: true,
              isCancell: false,
            },
            salesInvoice: {
              isActive: false,
              isFinish: true,
              isCancell: false,
            },
            receipt: {
              isActive: false,
              isFinish: true,
              isCancell: false,
            },
          });
        } else if (partialPayment) {
          setState({
            quotation: {
              isActive: false,
              isFinish: true,
              isCancell: false,
            },
            salesOrder: {
              isActive: false,
              isFinish: true,
              isCancell: false,
            },
            salesInvoice: {
              isActive: false,
              isFinish: true,
              isCancell: false,
            },
            receipt: {
              isActive: true,
              isFinish: false,
              isCancell: false,
            },
          });
        } else {
          setState({
            quotation: {
              isActive: false,
              isFinish: true,
              isCancell: false,
            },
            salesOrder: {
              isActive: false,
              isFinish: true,
              isCancell: false,
            },
            salesInvoice: {
              isActive: true,
              isFinish: false,
              isCancell: false,
            },
            receipt: {
              isActive: false,
              isFinish: false,
              isCancell: false,
            },
          });
        }
        break;
      case "receipt":
        if (paymentCompleted) {
          setState({
            quotation: {
              isActive: false,
              isFinish: true,
              isCancell: false,
            },
            salesOrder: {
              isActive: false,
              isFinish: true,
              isCancell: false,
            },
            salesInvoice: {
              isActive: false,
              isFinish: true,
              isCancell: false,
            },
            receipt: {
              isActive: false,
              isFinish: true,
              isCancell: false,
            },
          });
        } else {
          setState({
            quotation: {
              isActive: false,
              isFinish: true,
              isCancell: false,
            },
            salesOrder: {
              isActive: false,
              isFinish: true,
              isCancell: false,
            },
            salesInvoice: {
              isActive: false,
              isFinish: true,
              isCancell: false,
            },
            receipt: {
              isActive: true,
              isFinish: false,
              isCancell: false,
            },
          });
        }
        break;
      default:
        setState({});
    }
  }, [
    step,
    quotationAccepted,
    quotationCancelled,
    salesOrderAccepted,
    paymentCompleted,
    partialPayment,
  ]);
  return (
    <div>
      <ul className="account__progressbar-wrapper">
        <ProgressIndicatorComponent
          isActive={state.quotation.isActive}
          isFinish={state.quotation.isFinish}
          isCancell={state.quotation.isCancell}
          title="ใบเสนอราคา"
        />
        <ProgressIndicatorComponent
          isActive={state.salesOrder.isActive}
          isFinish={state.salesOrder.isFinish}
          isCancell={state.salesOrder.isCancell}
          title="ใบสั่งขาย"
        />
        <ProgressIndicatorComponent
          isActive={state.salesInvoice.isActive}
          isFinish={state.salesInvoice.isFinish}
          isCancell={state.salesInvoice.isCancell}
          title="ใบแจ้งหนี้"
        />
        <ProgressIndicatorComponent
          isActive={state.receipt.isActive}
          isFinish={state.receipt.isFinish}
          isCancell={state.receipt.isCancell}
          title="การรับชำระ"
        />
        <ProgressIndicatorComponent
          isActive={false}
          isFinish={false}
          isCancell={false}
          title="ใบกำกับภาษี"
        />
      </ul>
    </div>
  );
};

export default AccountProgressBarComponent;
