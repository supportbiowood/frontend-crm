import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import { getPurchaseRequest } from "../../../adapter/Api";
import { showSnackbar } from "../../../redux/actions/snackbarActions";
import AccountTableComponent from "../AccountTableComponent";
import { useHistory } from "react-router-dom";

const columns = [
  {
    headerName: "เลขที่ใบสั่งขาย",
    field: "purchase_request_document_id",
    flex: 1,
  },
  {
    headerName: "วันที่ออก",
    field: "purchase_request_issue_date",
    flex: 1,
    renderCell: (params) => {
      const purchase_request_issue_date = moment
        .unix(params.row.purchase_request_issue_date)
        .format("DD/MM/YYYY");
      return purchase_request_issue_date;
    },
  },
];

export default function PurchaseRequestTable({ setSelectedImportdocument }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [allPurchaseRequest, setAllPurchaseRequest] = useState([]);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPurchaseRequest()
      .then((data) => {
        if (data.data.status === "success") {
          let myData = data.data.data;
          const formatData = myData.map((ele, i) => {
            return {
              id: i + 1,
              ...ele,
            };
          });
          setAllPurchaseRequest(formatData);
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

  const onRowDoubleClick = (params) => {
    let purchase_request_document_id = params.row.purchase_request_document_id;
    history.push("/income/purchase-request/" + purchase_request_document_id);
  };
  return (
    <>
      <AccountTableComponent
        checkboxSelection
        tableRows={allPurchaseRequest}
        tableColumns={columns}
        onRowDoubleClick={onRowDoubleClick}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        rows={rows}
        setRows={setRows}
        setSelectedImportdocument={setSelectedImportdocument}
        short
      />
    </>
  );
}
