import React, { useState, useEffect } from "react";
import { Importer, ImporterField } from "react-csv-importer";
import "react-csv-importer/dist/index.css";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import BreadcrumbComponent from "../../../components/BreadcrumbComponent";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import axios from "axios";

import { DataGridPro } from "@mui/x-data-grid-pro";

import moment from "moment";
import "moment-timezone";
import "moment/locale/th";

import { useDispatch } from "react-redux";
import { showSnackbar } from "../../../redux/actions/snackbarActions";

export default function ImporterComponent() {
  moment.locale("th");
  const dispatch = useDispatch();
  const [selectedModule, setSelectedModule] = useState("contact");
  const [dataField, setDataField] = useState([]);
  const [log, setLog] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");
  console.log("Log", log);

  const handleChange = (event) => {
    setSelectedModule(event.target.value);
  };

  useEffect(() => {
    const dataConfig = {
      contact: [
        {
          name: "contact_is_customer",
          label: "เป็นลูกค้า (Customer)",
          required: true,
        },
        {
          name: "contact_is_vendor",
          label: "เป็นผู้ขาย (Vendor)",
          required: true,
        },
        {
          name: "contact_business_category",
          label: "ประเภทกิจการ",
          required: true,
        },
        {
          name: "contact_commercial_type",
          label: "ประเภทนิติบุคคล",
          required: true,
        },
        {
          name: "contact_commercial_name",
          label: "ชื่อกิจการ",
          required: true,
        },
        {
          name: "contact_individual_prefix_name",
          label: "คำนำหน้า",
          required: true,
        },
        {
          name: "contact_individual_first_name",
          label: "ชื่อจริง",
          required: true,
        },
        {
          name: "contact_individual_last_name",
          label: "นามสกุล",
          required: true,
        },
        {
          name: "contact_merchant_name",
          label: "ชื่อร้าน",
          required: true,
        },
        {
          name: "contact_tax_no",
          label: "เลขประจำตัวผู้เสียภาษี",
          required: true,
        },
        // {
        //   name: "contact_registration_address_id",
        //   label: "เลขที่ที่อยู่จดทะเบียน",
        // },
        {
          name: "lead_source_name",
          label: "แหล่งที่มาของผู้ติดต่อ",
        },
        {
          name: "contact_img_url",
          label: "รูปผู้ติดต่อ",
        },
        // {
        //   name: "account_receivable_id",
        //   label: "เลขที่บัญชีบันทึกลูกหนี้",
        // },
        // {
        //   name: "account_payable_id",
        //   label: "เลขที่บัญชีบันทึกเจ้าหนี้",
        // },
        {
          name: "contact_payment_type",
          label: "การชำระเงิน",
        },
        {
          name: "contact_is_credit_limit",
          label: "กำหนดวงเงินหรือไม่",
        },
        {
          name: "contact_credit_limit_amount",
          label: "จำนวนวงเงิน",
        },
      ],
      product: [
        {
          name: "name",
          label: "ชื่อ",
          required: true,
        },
        {
          name: "email",
          label: "อีเมล",
          required: true,
        },
        {
          name: "sex",
          label: "เพศ",
        },
      ],
    };

    setDataField(dataConfig[selectedModule]);
    console.log(dataConfig[selectedModule]);
  }, [selectedModule]);

  // const importToDatabase = async (importModule, importData) => {
  //   console.log("importModule", importModule, "importData", importData);
  //   importData.forEach(function (element) {
  //     // console.log(element.email);
  //     element.id = element.name;
  //     element.timestamp = moment().format("LLL");
  //     element.type = "เพิ่มข้อมูล";
  //     element.data = JSON.stringify(element);
  //     element.status = "สำเร็จ";
  //   });
  //   setLog((prev) => prev.concat(importData));
  //   return new Promise((resolve) => setTimeout(resolve, 1000));
  // };

  const columns = [
    { field: "timestamp", headerName: "วันที่ เวลา", width: 210 },
    { field: "type", headerName: "ประเภท", width: 140 },
    { field: "status", headerName: "สถานะ", width: 140 },
    { field: "data", headerName: "ข้อมูล", width: 500 },
  ];

  return (
    <div>
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <BreadcrumbComponent name="ตั้งค่า" to="/config" />
        <BreadcrumbComponent name="นำเข้าข้อมูล" to="/config/importer" />
      </Breadcrumbs>
      <div className="grid-container">
        <Stack spacing={2} direction="row">
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="demo-simple-select-label">
              ข้อมูลการนำเข้า
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedModule}
              label="ข้อมูลการนำเข้า"
              onChange={handleChange}
            >
              <MenuItem value={"contact"}>ผู้ติดต่อ</MenuItem>
              <MenuItem value={"product"}>สินค้า</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined">ดาวน์โหลด Template</Button>
        </Stack>
      </div>
      <Importer
        assumeNoHeaders={false}
        // restartable={true}
        onStart={({ file, fields, columns, skipHeaders }) => {
          console.log("starting import of file", file, "with fields", fields);
          setLog([]);
        }}
        processChunk={async (rows, { startIndex }) => {
          // may be called several times if file is large
          // const result = await importToDatabase(selectedModule, rows);
          try {
            const result = await axios.get("");
            console.log("result", result);
            setUploadStatus({
              status: "success",
              message: "อัพโหลดสำเร็จ",
            });
          } catch (error) {
            console.log("error", error);
            setUploadStatus({
              status: "error",
              message: "อัพโหลดล้มเหลว",
            });
          }
        }}
        onComplete={({ file, preview, fields, columnFields }) => {
          if (uploadStatus.status === "success")
            dispatch(showSnackbar("success", uploadStatus.message));
          else dispatch(showSnackbar("error", uploadStatus.message));
        }}
        onClose={({ file, preview, fields, columnFields }) => {
          // when user click finish
          // console.log("importer dismissed");
          window.location.replace("");
        }}

        // CSV options passed directly to PapaParse if specified:
        // delimiter={...}
        // newline={...}
        // quoteChar={...}
        // escapeChar={...}
        // comments={...}
        // skipEmptyLines={...}
        // delimitersToGuess={...}
        // chunkSize={...} // defaults to 10000
      >
        {dataField &&
          dataField.map((field) => {
            return (
              <ImporterField
                name={field.name}
                label={field.label}
                optional={!field.required}
              />
            );
          })}
      </Importer>

      <div>
        {log && log.length > 0 && (
          <>
            <h3 style={{ marginTop: "20px" }}>ข้อความจากระบบ</h3>
            <div className="myTable" style={{ marginTop: "unset" }}>
              <DataGridPro
                rows={log}
                columns={columns}
                pageSize={5}
                className="data-grid"
                pagination
                rowsPerPageOptions={[10, 30, 50, 100, 200]}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
