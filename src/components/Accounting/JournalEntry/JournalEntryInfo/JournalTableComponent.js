import { IconButton } from "@mui/material";
import React, { Fragment } from "react";
import ClearIcon from "@mui/icons-material/Clear";
import TextFieldCustom from "../../AccountReuseComponent/TextFieldCustom";
import SelectCustom from "../../AccountReuseComponent/SelectCustom";
import AutoCompleteCustom from "../../AccountReuseComponent/AutoCompleteCustom";

export default function JournalTableComponent({ data, formik, disabled }) {
  const handleChange = formik.handleChange;

  const columnList = [
    { nameth: "รายการ", nameEng: "No." },
    { nameth: "บัญชี", nameEng: "Account" },
    { nameth: "คำอธิบาย", nameEng: "Description" },
    { nameth: "ภาษี", nameEng: "Vat" },
    { nameth: "เดบิต", nameEng: "Debits" },
    { nameth: "เครดิต", nameEng: "Credits" },
    { nameth: "", nameEng: "" },
  ];

  const VatOption = [
    {
      id: "NONE",
      name: "ไม่มี",
    },
    {
      id: "ZERO",
      name: "0%",
    },
    {
      id: "SEVEN",
      name: "7%",
    },
  ];

  const Border = "1px rgba(190, 190, 190, 1) solid";

  return (
    <div
      style={{
        marginBottom: "38px",
        borderBottom: Border,
      }}
    >
      {!disabled ? (
        <div>
          <div className="table-container">
            <table id="tableAccountingdata" rules="none">
              <thead>
                {columnList.map((list, index) => {
                  if (disabled && index === 6) return null;
                  return [
                    <th key={index} style={{ textAlign: "center" }}>
                      <div>{list.nameth}</div>
                      <div>{list.nameEng}</div>
                    </th>,
                  ];
                })}
              </thead>
              <tbody id="table-body">
                {data &&
                  data.map((item, itemIndex) => {
                    return [
                      <Fragment key={itemIndex}>
                        <tr
                          key={itemIndex}
                          style={{
                            borderBottom: Border,
                          }}
                        >
                          <th>
                            <p>{itemIndex + 1}</p>
                          </th>
                          <td>
                            <AutoCompleteCustom
                              id={`transactions[${itemIndex}].account_id`}
                              name={`transactions[${itemIndex}].account_id`}
                              disabled={disabled}
                              options={[]}
                              values={item.account_id}
                              onChange={handleChange}
                            />
                          </td>
                          <td>
                            <TextFieldCustom
                              id={`transactions[${itemIndex}].account_transaction_detail`}
                              name={`transactions[${itemIndex}].account_transaction_detail`}
                              values={item.account_transaction_detail}
                              onChange={handleChange}
                            />
                          </td>
                          <td>
                            <SelectCustom
                              id={`transactions[${itemIndex}].vat`}
                              name={`transactions[${itemIndex}].vat`}
                              values={item.vat}
                              options={VatOption}
                              onChange={handleChange}
                            />
                          </td>
                          <td>
                            <TextFieldCustom
                              id={`transactions[${itemIndex}].account_transaction_debits`}
                              name={`transactions[${itemIndex}].account_transaction_debits`}
                              values={
                                item.account_transaction_debits &&
                                Number(
                                  item.account_transaction_debits
                                ).toLocaleString()
                              }
                              onChange={(e) => {
                                e.target.value = Number(
                                  e.target.value.replace(/\D/g, "")
                                );
                                handleChange(e);
                              }}
                              inputProps={{ style: { textAlign: "end" } }}
                            />
                          </td>
                          <td>
                            <TextFieldCustom
                              id={`transactions[${itemIndex}].account_transaction_credits`}
                              name={`transactions[${itemIndex}].account_transaction_credits`}
                              values={
                                item.account_transaction_credits &&
                                Number(
                                  item.account_transaction_credits
                                ).toLocaleString()
                              }
                              onChange={(e) => {
                                e.target.value = Number(
                                  e.target.value.replace(/\D/g, "")
                                );
                                handleChange(e);
                              }}
                              inputProps={{ style: { textAlign: "end" } }}
                            />
                          </td>

                          <td>
                            <IconButton size="small" onClick={() => {}}>
                              <ClearIcon />
                            </IconButton>
                          </td>
                        </tr>
                      </Fragment>,
                    ];
                  })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
          <div className="table-container">
            <table id="tableAccountingdata" rules="none">
              <thead>
                {columnList.map((list, index) => {
                  if (disabled && index === 6) return null;
                  return [
                    <th key={index} style={{ textAlign: "center" }}>
                      <div>{list.nameth}</div>
                      <div>{list.nameEng}</div>
                    </th>,
                  ];
                })}
              </thead>
              <tbody id="table-body">
                {data &&
                  data.map((item, itemIndex) => {
                    return [
                      <Fragment key={itemIndex}>
                        <tr
                          key={itemIndex}
                          style={{
                            borderBottom: Border,
                          }}
                        >
                          <th>
                            <p>{itemIndex + 1}</p>
                          </th>
                          <td>{item.account_id}</td>
                          <td>{item.account_transaction_detail}</td>
                          <td>{item.vat}</td>
                          <td>
                            {item.account_transaction_debits &&
                              Number(
                                item.account_transaction_debits
                              ).toLocaleString()}
                          </td>
                          <td>
                            {item.account_transaction_credits &&
                              Number(
                                item.account_transaction_credits
                              ).toLocaleString()}
                          </td>
                        </tr>
                      </Fragment>,
                    ];
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
