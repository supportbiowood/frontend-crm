import {
  FormControl,
  IconButton,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import React from "react";
import { toLocaleWithTwoDigits } from "../../../../../adapter/Utils";

const columnList = [
  { nameth: "", nameEng: "", width: "5%" },
  { nameth: "คำอธิบาย", nameEng: "Description", width: "70%" },
  { nameth: "ภาษี", nameEng: "Vat", width: "10%" },
  { nameth: "จำนวนเงิน", nameEng: "Received Amount", width: "30%" },
  { nameth: "", nameEng: "", width: "5%" },
];

const vatOption = [
  { name: "ไม่มี", value: "NONE" },
  { name: "0%", value: "ZERO" },
  { name: "7%", value: "SEVEN" },
];

const DepositInvoiceTable = ({
  disabled,
  formik,
  setVatExempted,
  setVatZero,
  setVatSeven,
}) => {
  const sumTotalAmount = () => {
    const allOfVatExempted = formik.values.deposit_invoice_data.filter(
      (deposit) => deposit.vat === "NONE"
    );
    const sumOfVatExempted = allOfVatExempted.reduce(
      (prev, curr) => prev + curr.pre_vat_amount,
      0
    );
    setVatExempted(sumOfVatExempted);
    const allOfVatZero = formik.values.deposit_invoice_data.filter(
      (deposit) => deposit.vat === "ZERO"
    );
    const sumOfVatZero = allOfVatZero.reduce(
      (prev, curr) => prev + curr.pre_vat_amount,
      0
    );
    setVatZero(sumOfVatZero);
    const allOfVatSeven = formik.values.deposit_invoice_data.filter(
      (deposit) => deposit.vat === "SEVEN"
    );
    const sumOfVatSeven = allOfVatSeven.reduce(
      (prev, curr) => prev + (curr.pre_vat_amount + curr.pre_vat_amount * 0.07),
      0
    );
    setVatSeven(sumOfVatSeven);
    return toLocaleWithTwoDigits(
      sumOfVatExempted + sumOfVatZero + sumOfVatSeven
    );
  };

  const removeItemHandler = (removedIndex) => {
    const removedItem = formik.values.deposit_invoice_data.filter(
      (_, index) => index !== removedIndex
    );
    formik.setFieldValue("deposit_invoice_data", removedItem);
  };

  const vatRender = (vat) => {
    if (vat === "ZERO") return "0%";
    if (vat === "SEVEN") return "7%";
    return `ไม่มี`;
  };

  return (
    <div className="table-container">
      <table id="tabledata" rules="none">
        <thead>
          <tr>
            {columnList.map((list, index) => {
              return (
                <th
                  key={index}
                  style={{ textAlign: "center" }}
                  width={list.width}
                >
                  <div>{list.nameth}</div>
                  <div>{list.nameEng}</div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody id="table-body">
          {!disabled &&
            formik.values.deposit_invoice_data.map((deposit, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="text"
                    size="small"
                    id={`deposit_invoice_data[${index}].description`}
                    name={`deposit_invoice_data[${index}].description`}
                    value={deposit.description}
                    onChange={formik.handleChange}
                  />
                </td>
                <td>
                  <FormControl fullWidth size="small">
                    <Select
                      fullWidth
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      size="small"
                      name={`deposit_invoice_data[${index}].vat`}
                      value={deposit.vat}
                      onChange={(e) => {
                        formik.handleChange(e);
                      }}
                    >
                      {vatOption.map((val, index) => (
                        <MenuItem
                          key={`${val.name} + ${index}`}
                          value={val.value}
                        >
                          {val.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </td>
                <td>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="number"
                    size="small"
                    InputProps={{
                      inputProps: {
                        style: { textAlign: "right" },
                      },
                    }}
                    id={`deposit_invoice_data[${index}].pre_vat_amount`}
                    name={`deposit_invoice_data[${index}].pre_vat_amount`}
                    value={parseFloat(deposit.pre_vat_amount)}
                    onChange={formik.handleChange}
                  />
                </td>
                <td>
                  <IconButton
                    size="small"
                    onClick={() => removeItemHandler(index)}
                  >
                    <ClearIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          {disabled &&
            formik.values.deposit_invoice_data.map((deposit, index) => (
              <tr
                key={index}
                style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.38)" }}
              >
                <td>{index + 1}</td>
                <td style={{ textAlign: "left" }}>{deposit.description}</td>
                <td>{vatRender(deposit.vat)}</td>
                <td>{deposit.pre_vat_amount}</td>
                <td></td>
              </tr>
            ))}
          <tr
            style={{
              backgroundColor: "rgba(233, 233, 233, 1)",
            }}
          >
            <td></td>
            <td></td>
            <th>มูลค่าชำระรวม</th>
            <th>{sumTotalAmount()}</th>
            <th>บาท</th>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DepositInvoiceTable;
