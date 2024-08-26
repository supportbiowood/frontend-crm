import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import {
  getImportSalesOrderByContact,
  getSalesOrder,
} from "../../../adapter/Api";
import { showSnackbar } from "../../../redux/actions/snackbarActions";
import AccountTableComponent from "../AccountTableComponent";
import { useHistory } from "react-router-dom";

const columns = [
  {
    headerName: "เลขที่ใบสั่งขาย",
    field: "sales_order_document_id",
    flex: 1,
  },
  {
    headerName: "ชื่อผู้ติดต่อ",
    field: "contact_name",
    flex: 1,
    renderCell: (params) => {
      const contact_name = params.row.billing_info.contact_name;
      return contact_name;
    },
  },
  {
    headerName: "วันที่ออก",
    field: "sales_order_issue_date",
    flex: 1,
    renderCell: (params) => {
      const sales_order_issue_date = moment
        .unix(params.row.sales_order_issue_date)
        .format("DD/MM/YYYY");
      return sales_order_issue_date;
    },
  },
];

export default function SalesOrderTable({
  contact_id,
  setSelectedImportdocument,
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [allSalesOrder, setAllSalesOrder] = useState([]);
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (contact_id) {
      getImportSalesOrderByContact(contact_id)
        .then((data) => {
          if (data.data.status === "success") {
            let myData = data.data.data;
            const formatData = myData.map((ele, i) => {
              return {
                id: i + 1,
                ...ele,
              };
            });
            setAllSalesOrder(formatData);
            setRows(formatData);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          dispatch(showSnackbar("error", "ไม่สามารถเรียกข้อมูลได้"));
          setIsLoading(false);
        });
    } else {
      getSalesOrder()
        .then((data) => {
          if (data.data.status === "success") {
            let myData = data.data.data;
            const formatData = myData.map((ele, i) => {
              return {
                id: i + 1,
                ...ele,
              };
            });
            setAllSalesOrder(formatData);
            setRows(formatData);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          dispatch(showSnackbar("error", "ไม่สามารถเรียกข้อมูลได้"));
          setIsLoading(false);
        });
    }
  }, [dispatch, contact_id]);

  const onRowDoubleClick = (params) => {
    let sales_order_document_id = params.row.sales_order_document_id;
    history.push("/income/sales-order/" + sales_order_document_id);
  };
  return (
    <>
      <AccountTableComponent
        checkboxSelection
        tableRows={allSalesOrder}
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
