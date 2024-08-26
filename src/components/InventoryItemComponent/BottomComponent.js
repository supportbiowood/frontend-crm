import React, { useState, useEffect } from "react";
import {
  // TextField,
  // IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
// import ClearIcon from "@mui/icons-material/Clear";
// import SearchIcon from "@mui/icons-material/Search";
import {
  DataGridPro,
  // GridToolbarContainer,
  // GridToolbarExport,
  // GridToolbarFilterButton,
  // GridToolbarDensitySelector,
  // GridToolbarColumnsButton,
} from "@mui/x-data-grid-pro";
// import { createTheme } from "@mui/material/styles";
// import { createStyles, makeStyles } from "@mui/styles";
import moment from "moment";

import {
  getUOMGroupUUIDByID,
  getItemMasterById,
} from "../../adapter/Api/graphql";

const columns = [
  {
    headerName: "ลำดับ",
    field: "id",
    width: 100,
  },
  {
    headerName: "ประเภท",
    field: "changeType",
    width: 150,
  },
  {
    headerName: "ประเภทการเข้าออก",
    field: "documentType",
    width: 150,
  },
  {
    headerName: "รหัสเอกสาร",
    field: "documentID",
    width: 150,
  },
  {
    headerName: "รหัสสินค้า",
    field: "itemID",
    width: 150,
  },
  {
    headerName: "ชื่อสินค้า",
    field: "name",
    width: 150,
  },
  {
    headerName: "วันที่",
    field: "createdAt",
    width: 150,
  },

  {
    headerName: "จำนวน",
    field: "changeOnHand",
    width: 150,
  },
  {
    headerName: "หน่วย",
    field: "uomID",
    width: 150,
  },
  {
    headerName: "อ้างอิง",
    field: "listDocumentReference",
    width: 150,
  },
  {
    headerName: "สถานะ",
    field: "status",
    width: 150,
    renderCell: (params) => (
      <div>
        {params.row.status === "CLOSED" && (
          <div className="inventoryMaster-active-cell">
            <div>สำเร็จ</div>
          </div>
        )}
        {params.row.status === "CANCELED" && (
          <div className="inventoryMaster-notActive-cell">
            <div>ยกเลิก</div>
          </div>
        )}
      </div>
    ),
  },
];

export default function BottomComponent(props) {
  const [rows, setRows] = useState([]);
  const [rows2, setRows2] = useState([]);
  const [rowsWarehouse, setRowsWarehouse] = useState([]);
  const [filterOption, setFilterOption] = useState([]);
  const [cloneListTransaction, setCloneListTransaction] = useState();
  const [cloneListItemCurrent, setCloneListItemCurrent] = useState();
  const [pageSize, setPageSize] = useState(10);
  const [pageSizeWH, setPageSizeWH] = useState(10);

  const fatchIteminWarehouse = () => {
    const warehouseID =
      props.values.listItemCurrentOnUOM &&
      props.values.listItemCurrentOnUOM[0] &&
      props.values.listItemCurrent[0].warehouseID;
    const newRowsWarehouse =
      props.values.listItemCurrent &&
      props.values.listItemCurrent[0] &&
      props.values.listItemCurrent[0].serialBatchCurrentList.items;
    const newData =
      newRowsWarehouse &&
      newRowsWarehouse.map((item, index) => {
        return {
          ...item,
          id: index,
          itemName: props.values.name,
          uomID: props.values.baseUOMName,
          warehouseID: warehouseID,
        };
      });
    newData && setRowsWarehouse(newData);
  };

  useEffect(() => {
    fatchIteminWarehouse();
    getUOMGroupUUIDByID({ getUomGroupUuidId: `${props.values.uomGroupID}` })
      .then((data) => {
        const clone = data.data.data.getUOMGroupUUID;
        const newValue = clone.listUOM.map((data, index) => {
          return {
            id: index + 1,
            altQty: data.altQty,
            name: data.name,
            baseQty: data.baseQty,
            uomID: data.uomID,
            baseUOMID: clone.baseUOMID,
            baseUOMName: clone.baseUOMName,
          };
        });
        setFilterOption(newValue);
      })
      .catch((err) => {
        console.log(err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getAvaliable(params) {
    return `${
      params.getValue(params.id, "onHandQty") -
      params.getValue(params.id, "committedQty") +
      params.getValue(params.id, "orderedQty")
    }`;
  }

  const columnsCount = [
    {
      headerName: "ซื้อ",
      field: "orderedQty",
      width: 300,
    },
    {
      headerName: "คงคลัง",
      field: "onHandQty",
      width: 300,
    },
    {
      headerName: "คงเหลือสุทธิ",
      field: "netBalance",
      width: 300,
      valueGetter: getAvaliable,
    },
    {
      headerName: "จอง",
      field: "committedQty",
      width: 300,
    },
  ];

  const columnsWarehouse = [
    {
      headerName: "รหัสสินค้า",
      field: "itemID",
      width: 150,
    },
    {
      headerName: "ชื่อสินค้า",
      field: "itemName",
      width: 150,
    },
    {
      headerName: "สถานที่",
      field: "warehouseID",
      width: 150,
    },
    {
      headerName: "จำนวน",
      field: "onHandQty",
      width: 150,
    },
    {
      headerName: "หน่วย",
      field: "uomID",
      width: 150,
    },
    {
      headerName: "หมายเลข Serial",
      field: "serialBatchID",
      width: 350,
    },
  ];

  const changeStatusType = (data) => {
    if (data === "IN") return "นำเข้า";
    if (data === "OUT") return "นำออก";
  };

  const changeDocumentType = (data, dataType) => {
    if (data === "PURCHASE") return "ซื้อ";
    if (data === "TRANSFER") return "โอนเข้า";
    if (data === "SALES_RETURN") return "รับคืน";
    if (data === "OTHER") return "อื่นๆ";
    if (data === "SALE") return "ขาย";
    if (data === "TRANSFER") return "โอนออก";
    if (data === "PURCHASE_RETURN") return "ส่งคืน";
    if (data === "SAMPLE") return "เบิกตัวอย่าง";
  };

  useEffect(() => {
    const newItemCurrentData =
      props.values.listItemCurrentOnUOM &&
      props.values.listItemCurrentOnUOM[0] !== null &&
      props.values.listItemCurrentOnUOM.map((data, index) => {
        return {
          id: index + 1,
          committedQty: data.committedQty || 0,
          itemID: data.itemID,
          onHandQty: data.onHandQty || 0,
          orderedQty: data.orderedQty || 0,
          warehouseID: data.warehouseID,
        };
      });
    setRows(
      newItemCurrentData && newItemCurrentData.length !== 0
        ? newItemCurrentData
        : [
            {
              id: 0,
              committedQty: 0,
              itemID: "-",
              onHandQty: 0,
              orderedQty: 0,
              warehouseID: 0,
            },
          ]
    );
    setCloneListItemCurrent(newItemCurrentData);
    const newTransactionData = props.values.listTransaction.map(
      (data, index) => {
        return {
          id: index + 1,
          documentID: data.documentID,
          changeOnHand: data.changeOnHand,
          documentType:
            data.documentType && data.documentType === "GOODS_RECEIPT"
              ? data.getDocument
                ? changeDocumentType(
                    data.getDocument.receiptType,
                    data.documentType
                  )
                : ""
              : data.getDocument
              ? changeDocumentType(
                  data.getDocument.issueType,
                  data.documentType
                )
              : "",
          itemID: data.getItem ? data.getItem.id : "",
          name: data.getItem ? data.getItem.name : "",
          createdAt: moment(data.createdAt)
            .tz("Asia/Bangkok")
            .format("DD/MM/YYYY"),
          changeType: changeStatusType(data.changeType),
          changeOrdered: data.changeOrdered,
          uomID: data.getItem ? data.getItem.getUOMGroup?.baseUOMName : "ชิ้น",
          listDocumentReference:
            (data.getDocument !== null &&
            data.getDocument.listDocumentReference &&
            data.getDocument.listDocumentReference.length !== 0
              ? data.getDocument.listDocumentReference[0].documentID
              : "") || "",
          status: data.getDocument ? data.getDocument.status : "",
        };
      }
    );
    setRows2(newTransactionData || []);
    setCloneListTransaction(newTransactionData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.values]);

  function filterTransactionList(e) {
    if (e === "ทั้งหมด") return setRows2(cloneListTransaction);
    const obj = [...cloneListTransaction];
    const newObj =
      obj &&
      obj.filter((a) => {
        return a.uomID === e;
      });
    setRows2(newObj);
  }

  function filterCurrentList(e) {
    if (e === "ทั้งหมด") return setRows(cloneListItemCurrent);
    const ById = {
      getItemUuidId: props.values.id,
      uomId: `${e}`,
    };
    getItemMasterById(ById).then((data) => {
      if (data.data.data !== null) {
        const myData = data.data.data.getItemUUID.listItemCurrentOnUOM.items;
        const newItemCurrentData =
          myData !== null &&
          myData.map((data, index) => {
            return {
              id: index + 1,
              committedQty: data.committedQty
                ? data.committedQty.toFixed(2)
                : 0,
              itemID: data.itemID,
              onHandQty: data.onHandQty ? data.onHandQty.toFixed(2) : 0,
              orderedQty: data.orderedQty ? data.orderedQty.toFixed(2) : 0,
              warehouseID: data.warehouseID,
            };
          });
        setRows(newItemCurrentData);
      }
    });
  }

  return (
    <div>
      <div className="inventory-container">
        <div>
          <h3>จำนวนสินค้า</h3>
          <div className="grid-container-25">
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">หน่วย</InputLabel>
              <Select
                fullWidth
                disabled={
                  props.values.listItemCurrent &&
                  props.values.listItemCurrent[0] === null
                    ? true
                    : false
                }
                size="small"
                id="demo-simple-select"
                label="หน่วย"
                onChange={(e) => {
                  filterCurrentList(e.target.value);
                }}
                defaultValue={"Wood-PC"}
              >
                {filterOption.map((option, i) => {
                  return (
                    <MenuItem value={option.uomID} key={i}>
                      {option.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
          <div className="tableCurrentItem">
            <DataGridPro rows={rows} columns={columnsCount} />
          </div>
        </div>
      </div>
      <div className="inventory-container">
        <div>
          <h3>จำนวนสินค้าคงคลังตามสถานที่</h3>
          {/* <div className="grid-container-25">
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">คลัง</InputLabel>
              <Select
                fullWidth
                disabled={
                  props.values.listItemCurrent &&
                  props.values.listItemCurrent[0] === null
                    ? true
                    : false
                }
                size="small"
                id="demo-simple-select"
                label="หน่วย"
                onChange={(e) => {
                  // filterCurrentList(e.target.value);
                }}
                defaultValue={1}
              >
                {filterWarehouseOption &&
                  filterWarehouseOption.map((option, i) => {
                    return (
                      <MenuItem value={option.id} key={i}>
                        {option.id}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </div> */}
          <div className="myTable2">
            <DataGridPro
              rows={rowsWarehouse}
              columns={columnsWarehouse}
              pagination
              pageSize={pageSizeWH}
              onPageSizeChange={(newPageSize) => setPageSizeWH(newPageSize)}
              rowsPerPageOptions={[10, 20, 30, 50, 100]}
            />
          </div>
        </div>
      </div>
      <div className="inventory-container">
        <h3>รายการนำเข้า/นำออก</h3>
        <div className="grid-container-25">
          <FormControl fullWidth size="small">
            <InputLabel id="demo-simple-select-label">หน่วย</InputLabel>
            <Select
              fullWidth
              size="small"
              id="demo-simple-select"
              label="หน่วย"
              onChange={(e) => {
                filterTransactionList(e.target.value);
              }}
              defaultValue={"แผ่น"}
            >
              {filterOption.map((option, i) => {
                return (
                  <MenuItem value={option.name} key={i}>
                    {option.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div className="myTable2">
          <DataGridPro
            rows={rows2}
            columns={columns}
            pagination
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={[10, 20, 30, 50, 100]}
            // sortModel={sortModel}
            // onSortModelChange={(model) => setSortModel(model)}
            // filterModel={filterModel}
            // className="data-grid"
            // onFilterModelChange={(model) => setFilterModel(model)}
            // components={{
            //   Toolbar: CustomToolbar,
            // }}
            // componentsProps={{
            //   toolbar: {
            //     value: searchText,
            //     onChange: (event) => requestSearch(event.target.value),
            //     clearSearch: () => requestSearch(""),
            //   },
            // }}
            // onRowDoubleClick={(params, event) => {
            //   let employee_id = params.row.employee_id;
            //   // console.log(employee_id);
            //   window.location.href = "employee/" + employee_id;
            // }}
          />
        </div>
      </div>
    </div>
  );
}
