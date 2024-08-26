import React, { useState } from "react";
import {
  Autocomplete,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createFilterOptions } from "@mui/material/Autocomplete";

const filter = createFilterOptions();

export default function ModalAddBankComponent(props) {
  const [bankName, setBankName] = useState("ธ.กรุงเทพ");
  const [type, setType] = useState("บัญชีกระแสรายวัน");
  const [name, setName] = useState("");
  const [no, setNo] = useState("");
  const [branch, setBranch] = useState("");
  const [description, setDescription] = useState("");
  const [errorsBank, setErrorsBank] = useState(false);
  const [errorsType, setErrorsType] = useState(false);
  const [errorsName, setErrorsName] = useState(false);
  const [errorsNo, setErrorsNo] = useState(false);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setStateValue();
  };

  const setStateValue = () => {
    setBankName("ธ.กรุงเทพ");
    setType("บัญชีกระแสรายวัน");
    setName("");
    setNo("");
    setBranch("");
    setDescription("");
    setErrorsBank(false);
    setErrorsType(false);
    setErrorsName(false);
    setErrorsNo(false);
  };

  const handleClick = () => {
    if (name === "") {
      setErrorsName(true);
    }
    if (no === "") {
      setErrorsNo(true);
    }
    if (bankName === "") {
      setErrorsBank(true);
    }
    if (type === "") {
      setErrorsType(true);
    }
    if (bankName === "" || type === "" || name === "" || no === "") return null;
    const Clone = [...props.values.bank_account_list];
    Clone.push({
      bank_account_no: no,
      bank_account_bank_name: bankName,
      bank_account_type: type,
      bank_account_name: name,
      bank_account_branch: branch,
      bank_account_description: description,
    });
    props.setFieldValue("bank_account_list", Clone);
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
      <Button variant="outlined" color="success" onClick={handleClickOpen}>
        เพิ่มบัญชีธนาคาร
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="sm">
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
              value={bankName || ""}
              onChange={(event, newValue) => {
                if (typeof newValue === "string") {
                  setBankName(newValue.value);
                } else if (newValue && newValue.inputValue) {
                  // Create a new value from the user input
                  setBankName(newValue.inputValue);
                } else {
                  if (newValue === null) return setBankName("");
                  setBankName(newValue.value);
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
              value={type || ""}
              onChange={(event, newValue) => {
                if (typeof newValue === "string") {
                  setType(newValue.value);
                } else if (newValue && newValue.inputValue) {
                  // Create a new value from the user input
                  setType(newValue.inputValue);
                } else {
                  if (newValue === null) return setType("");
                  setType(newValue.value);
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
              required
              fullWidth
              label="ชื่อบัญชีธนาคาร"
              size="small"
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <TextField
              error={errorsNo}
              helperText={errorsNo && "กรุณากรอก"}
              isRequired="true"
              required
              fullWidth
              label="เลขที่บัญชีธนาคาร"
              size="small"
              onChange={(e) => {
                setNo(e.target.value);
              }}
            />
            <TextField
              fullWidth
              label="สาขา"
              size="small"
              onChange={(e) => {
                setBranch(e.target.value);
              }}
            />
            <TextField
              fullWidth
              label="คำอธิบาย"
              size="small"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
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
            เพิ่มธนาคาร
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
