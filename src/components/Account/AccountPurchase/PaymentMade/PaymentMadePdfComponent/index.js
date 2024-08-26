import React, { useRef, useEffect, useState } from "react";
import { Backdrop, Button, CircularProgress } from "@mui/material";
import { getPaymentMadeById } from "../../../../../adapter/Api";
import { useParams } from "react-router-dom";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import Content from "./Content";

export default function PaymentMadePdfComponent() {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [paymentMadeData, setPaymentMadeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    getPaymentMadeById(id)
      .then((data) => {
        let myData = data.data.data;
        const formatData = {
          ...myData,
          payment_made_issue_date: moment
            .unix(myData.payment_made_issue_date)
            .format("DD/MM/YYYY"),
          payment_date: moment.unix(myData.payment_date).format("DD/MM/YYYY"),
        };
        setPaymentMadeData(formatData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, [id]);

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
      <div className="grid-container-50" style={{ marginBottom: "20px" }}>
        <div>
          <h2>การชำระเงิน/Payment Made</h2>
          <div>เลขที่เอกสาร {paymentMadeData.payment_made_document_id}</div>
        </div>
        <div className="account__buttonContainer">
          <Button variant="outlined" onClick={handlePrint}>
            พิมพ์เอกสาร
          </Button>
        </div>
      </div>
      <div ref={componentRef} className="printPdf">
        <div className="customPdf">
          {!isLoading && (
            <Content paymentMadeData={paymentMadeData} isLoading={isLoading} />
          )}
        </div>
      </div>
    </>
  );
}
