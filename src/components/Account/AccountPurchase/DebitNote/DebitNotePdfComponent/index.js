import React, { useRef, useEffect, useState } from "react";
import { Backdrop, Button, CircularProgress } from "@mui/material";
import { getDebitNoteById } from "../../../../../adapter/Api";
import { useParams } from "react-router-dom";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import Content from "./Content";

export default function DebitNotePdfComponent() {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [debitNoteData, setDebitNoteData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    getDebitNoteById(id)
      .then((data) => {
        let myData = data.data.data;
        const formatData = {
          ...myData,
          debit_note_issue_date: moment
            .unix(myData.debit_note_issue_date)
            .format("DD/MM/YYYY"),
        };
        setDebitNoteData(formatData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }, [id]);

  console.log("debitNoteData", debitNoteData);

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
          <h2>รับใบลดหนี้/Debit Note</h2>
          <div>เลขที่เอกสาร {debitNoteData.debit_note_document_id}</div>
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
            <Content debitNoteData={debitNoteData} isLoading={isLoading} />
          )}
        </div>
      </div>
    </>
  );
}
