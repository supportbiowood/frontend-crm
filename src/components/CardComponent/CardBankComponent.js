import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Autocomplete,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createFilterOptions } from "@mui/material/Autocomplete";

const filter = createFilterOptions();
export default function CardBankComponent(props) {
  const [fieldValue, setFieldValue] = useState({});
  const [openCard, setOpenCard] = useState(false);
  const [errorsBank, setErrorsBank] = useState(false);
  const [errorsType, setErrorsType] = useState(false);
  const [errorsName, setErrorsName] = useState(false);
  const [errorsNo, setErrorsNo] = useState(false);

  const handleClickOpen = () => {
    setOpenCard(true);
  };

  const handleClose = () => {
    setOpenCard(false);
    setErrorsBank(false);
    setErrorsType(false);
    setErrorsName(false);
    setErrorsNo(false);
  };

  useEffect(() => {
    setFieldValue(props.values.bank_account_list[props.ID]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = () => {
    const Filter = props.values.bank_account_list.filter((val, index) => {
      return `${props.ID}` !== `${index}`;
    });
    props.setFieldValue("bank_account_list", Filter);
    handleClose();
  };

  const handleClick = async () => {
    if (fieldValue.bank_account_name === "") {
      setErrorsName(true);
    }
    if (fieldValue.bank_account_no === "") {
      setErrorsNo(true);
    }
    if (fieldValue.bank_account_bank_name === "") {
      setErrorsBank(true);
    }
    if (fieldValue.bank_account_type === "") {
      setErrorsType(true);
    }
    if (
      fieldValue.bank_account_bank_name === "" ||
      fieldValue.bank_account_type === "" ||
      fieldValue.bank_account_name === "" ||
      fieldValue.bank_account_no === ""
    )
      return null;
    props.values.bank_account_list[props.ID] = fieldValue;
    handleClose();
  };

  const BankList = [
    {
      name: "ธ.กรุงเทพ",
      value: "ธ.กรุงเทพ",
    },
    {
      name: "ธ.กสิกรไทย",
      value: "ธ.กสิกรไทย",
    },
    {
      name: "ธ.กรุงไทย",
      value: "ธ.กรุงไทย",
    },
    {
      name: "ธ.ไทยพาณฺิชย์",
      value: "ธ.ไทยพาณฺิชย์",
    },
    {
      name: "ธ.เกียรตินาคินภัทร",
      value: "ธ.เกียรตินาคินภัทร",
    },
    {
      name: "ธ.ซีไอเอ็มบี",
      value: "ธ.ซีไอเอ็มบี",
    },
    {
      name: "ธ.ทีเอ็มบีธนชาต",
      value: "ธ.ทีเอ็มบีธนชาต",
    },
    {
      name: "ธ.ทิสโก้",
      value: "ธ.ทิสโก้",
    },
    {
      name: "ธ.ไทยเครดิต",
      value: "ธ.ไทยเครดิต",
    },
    {
      name: "ธ.ธนชาต",
      value: "ธ.ธนชาต",
    },
    {
      name: "ธ.ธกส",
      value: "ธ.ธกส",
    },
    {
      name: "ธ.แลนด์ แอนด์ เฮ้าส์",
      value: "ธ.แลนด์ แอนด์ เฮ้าส์",
    },
    {
      name: "ธ.ออมสิน",
      value: "ธ.ออมสิน",
    },
    {
      name: "ธ.อื่นๆ",
      value: "ธ.อื่นๆ",
    },
  ];

  const BankTypeList = [
    {
      name: "บัญชีกระแสรายวัน",
      value: "บัญชีกระแสรายวัน",
    },
    {
      name: "บัญชีออมทรัพย์",
      value: "บัญชีออมทรัพย์",
    },
    {
      name: "บัญชีประจำ",
      value: "บัญชีประจำ",
    },
  ];

  return (
    <div>
      <div className="card-contact" onClick={handleClickOpen}>
        <div className="bank-container">
          <div className="bank">
            <div className="bank-title">
              {props.values.bank_account_list[props.ID].bank_account_bank_name}
            </div>
            <div className="bank-account">
              <div className="title ">ประเภทบัญชี </div>
              <div className="subtitle">
                {props.values.bank_account_list[props.ID].bank_account_type}
              </div>
            </div>
            <div className="bank-account-id">
              <div className="id-title">เลขที่บัญชี </div>
              <div className="id-subtitle">
                {props.values.bank_account_list[props.ID].bank_account_no}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog
        open={openCard}
        onClose={handleClose}
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle>
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            เพิ่มธนาคาร
            <IconButton type="button" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </h2>
        </DialogTitle>
        <DialogContent>
          <div className="grid-container-50">
            <Autocomplete
              fullWidth
              error={errorsBank}
              helperText={errorsBank && "กรุณากรอก"}
              disableClearable
              value={fieldValue.bank_account_bank_name || ""}
              onChange={(event, newValue) => {
                if (typeof newValue === "string") {
                  setFieldValue((datas) => ({
                    ...datas,
                    bank_account_bank_name: newValue.value,
                  }));
                } else if (newValue && newValue.inputValue) {
                  // Create a new value from the user input
                  setFieldValue((datas) => ({
                    ...datas,
                    bank_account_bank_name: newValue.inputValue,
                  }));
                } else {
                  if (newValue === null)
                    return setFieldValue((datas) => ({
                      ...datas,
                      bank_account_bank_name: "",
                    }));
                  setFieldValue((datas) => ({
                    ...datas,
                    bank_account_bank_name: newValue.value,
                  }));
                }
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);

                const { inputValue } = params;
                // Suggest the creation of a new value
                const isExisting = options.some(
                  (option) => inputValue === option.name
                );
                if (inputValue !== "" && !isExisting) {
                  filtered.push({
                    inputValue,
                    name: `เพิ่ม "${inputValue}"`,
                  });
                }

                return filtered;
              }}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              id="free-solo-with-text-demo"
              options={BankList}
              getOptionLabel={(option) => {
                // Value selected with enter, right from the input
                if (typeof option === "string") {
                  return option;
                }
                // Add "xxx" option created dynamically
                if (option.inputValue) {
                  return option.inputValue;
                }
                // Regular option
                return option.name;
              }}
              renderOption={(props, option) => (
                <li {...props}>{option.name}</li>
              )}
              freeSolo
              renderInput={(params) => (
                <TextField {...params} size="small" label="ชื่อธนาคาร" />
              )}
            />
            <Autocomplete
              fullWidth
              error={errorsType}
              helperText={errorsType && "กรุณากรอก"}
              disableClearable
              value={fieldValue.bank_account_type || ""}
              onChange={(event, newValue) => {
                if (typeof newValue === "string") {
                  setFieldValue((datas) => ({
                    ...datas,
                    bank_account_type: newValue.value,
                  }));
                } else if (newValue && newValue.inputValue) {
                  // Create a new value from the user input
                  setFieldValue((datas) => ({
                    ...datas,
                    bank_account_type: newValue.inputValue,
                  }));
                } else {
                  if (newValue === null)
                    return setFieldValue((datas) => ({
                      ...datas,
                      bank_account_type: "",
                    }));
                  setFieldValue((datas) => ({
                    ...datas,
                    bank_account_type: newValue.value,
                  }));
                }
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);

                const { inputValue } = params;
                // Suggest the creation of a new value
                const isExisting = options.some(
                  (option) => inputValue === option.name
                );
                if (inputValue !== "" && !isExisting) {
                  filtered.push({
                    inputValue,
                    name: `เพิ่ม "${inputValue}"`,
                  });
                }

                return filtered;
              }}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              id="free-solo-with-text-demo"
              options={BankTypeList}
              getOptionLabel={(option) => {
                // Value selected with enter, right from the input
                if (typeof option === "string") {
                  return option;
                }
                // Add "xxx" option created dynamically
                if (option.inputValue) {
                  return option.inputValue;
                }
                // Regular option
                return option.name;
              }}
              renderOption={(props, option) => (
                <li {...props}>{option.name}</li>
              )}
              freeSolo
              renderInput={(params) => (
                <TextField {...params} size="small" label="ประเภทบัญชี" />
              )}
            />
            <TextField
              error={errorsName}
              helperText={errorsName && "กรุณากรอก"}
              fullWidth
              required
              label="ชื่อบัญชีธนาคาร"
              value={fieldValue.bank_account_name}
              size="small"
              onChange={(e) => {
                setFieldValue((datas) => ({
                  ...datas,
                  bank_account_name: e.target.value,
                }));
              }}
            />
            <TextField
              fullWidth
              error={errorsNo}
              helperText={errorsNo && "กรุณากรอก"}
              required
              label="เลขที่บัญชีธนาคาร"
              value={fieldValue.bank_account_no}
              size="small"
              onChange={(e) => {
                setFieldValue((datas) => ({
                  ...datas,
                  bank_account_no: e.target.value,
                }));
              }}
            />
            <TextField
              fullWidth
              label="สาขา"
              value={fieldValue.bank_account_branch}
              size="small"
              onChange={(e) => {
                setFieldValue((datas) => ({
                  ...datas,
                  bank_account_branch: e.target.value,
                }));
              }}
            />
            <TextField
              fullWidth
              label="คำอธิบาย"
              value={fieldValue.bank_account_description}
              size="small"
              onChange={(e) => {
                setFieldValue((datas) => ({
                  ...datas,
                  bank_account_description: e.target.value,
                }));
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            type="submit"
            color="success"
            onClick={handleDelete}
            sx={{ width: "130px", margin: "15px 20px 20px 0" }}
          >
            ลบ
          </Button>
          <Button
            variant="contained"
            type="submit"
            color="success"
            onClick={handleClick}
            sx={{
              width: "130px",
              backgroundColor: "rgba(65, 150, 68, 1)",
              margin: "15px 20px 20px 0",
            }}
          >
            บันทึก
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
