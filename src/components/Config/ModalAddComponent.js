import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  createConfigWarehouse,
  createConfigItemCategory,
  createConfigBinLocation,
  updateConfigWarehouse,
  updateConfigCategory,
  updateConfigBinLocation,
} from "../../adapter/Api/graphql";

import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/actions/snackbarActions";

export default function ModalAddComponent({
  open,
  label,
  location,
  textValue,
  setIsLoading,
  textHeader,
  handleClose,
  warehouse,
  binLocation,
  pallete,
  Category,
  category,
  createSubmit,
  updateSubmit,
}) {
  const [value, setValue] = useState("");
  const [errors, setErrors] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (textValue) return setValue(textValue);
  }, [textValue]);

  const handleSubmitWarehouse = () => {
    setIsLoading(true);
    if (createSubmit) {
      const input = {
        internalID: value,
        name: value,
      };
      createConfigWarehouse({ input: input }).then((data) => {
        if (data.data.data === null)
          return dispatch(showSnackbar("error", "เกิดเหตุผิดพลาด"));
        handleClose();
        setIsLoading(false);
      });
    }
    if (updateSubmit) {
      const input = {
        id: location[0].id,
        internalID: location[0].internalID,
        name: value,
      };
      updateConfigWarehouse({ input: input }).then((data) => {
        if (data.data.data === null)
          return dispatch(showSnackbar("error", "เกิดเหตุผิดพลาด"));
        handleClose();
        setIsLoading(false);
      });
    }
  };

  const handleSubmitBinLocation = () => {
    setIsLoading(true);
    if (createSubmit) {
      const input = {
        warehouseID: location[0].id,
        internalID: value,
        parentIDList: [],
        name: value,
      };
      createConfigBinLocation({ input: input }).then((data) => {
        if (data.data.data === null)
          return dispatch(showSnackbar("error", "เกิดเหตุผิดพลาด"));
        handleClose();
        setIsLoading(false);
      });
    }
    if (updateSubmit) {
      const input = {
        id: location[1].id,
        warehouseID: location[0].id,
        internalID: location[1].internalID,
        parentIDList: [],
        name: value,
      };
      updateConfigBinLocation({ input: input }).then((data) => {
        if (data.data.data === null)
          return dispatch(showSnackbar("error", "เกิดเหตุผิดพลาด"));
        handleClose();
        setIsLoading(false);
      });
    }
  };

  const handleSubmitPallete = () => {
    setIsLoading(true);
    if (createSubmit) {
      const input = {
        warehouseID: location[0].id,
        parentIDList: [location[1].id],
        internalID: value,
        name: value,
      };
      createConfigBinLocation({ input: input }).then((data) => {
        if (data.data.data === null)
          return dispatch(showSnackbar("error", "เกิดเหตุผิดพลาด"));
        handleClose();
        setIsLoading(false);
      });
    }
    if (updateSubmit) {
      const input = {
        id: location[2].id,
        warehouseID: location[0].id,
        parentIDList: [location[1].id],
        internalID: location[2].internalID,
        name: value,
      };
      updateConfigBinLocation({ input: input }).then((data) => {
        if (data.data.data === null)
          return dispatch(showSnackbar("error", "เกิดเหตุผิดพลาด"));
        handleClose();
        setIsLoading(false);
      });
    }
  };

  const handleSubmitCategory = () => {
    setIsLoading(true);
    let input = {
      id: value,
      internalID: value,
      name: value,
      parentIDList: [],
    };
    if (createSubmit) {
      if (!category)
        createConfigItemCategory({ input: input }).then((data) => {
          if (data.data.data === null)
            return dispatch(showSnackbar("error", "เกิดเหตุผิดพลาด"));
          handleClose();
          setIsLoading(false);
        });
      if (category.length === 1) {
        input = {
          id: value,
          internalID: value,
          name: value,
          parentIDList: [category[0].id],
        };
      }
      if (category.length === 2) {
        input = {
          id: value,
          internalID: value,
          name: value,
          parentIDList: [category[0].id, category[1].id],
        };
      }
      if (category.length === 3) {
        input = {
          id: value,
          internalID: value,
          name: value,
          parentIDList: [category[0].id, category[1].id, category[2].id],
        };
      }
      createConfigItemCategory({ input: input }).then((data) => {
        if (data.data.data === null)
          return dispatch(showSnackbar("error", "เกิดเหตุผิดพลาด"));
        handleClose();
        setIsLoading(false);
      });
    }
    if (updateSubmit) {
      if (!category)
        updateConfigCategory({ input: input }).then((data) => {
          if (data.data.data.updateItemCategory === null)
            return dispatch(showSnackbar("error", "เกิดเหตุผิดพลาด"));
          handleClose();
          setIsLoading(false);
        });
      if (category.length === 1) {
        input = {
          id: category[0].id,
          internalID: category[0].internalID,
          name: value,
          parentIDList: [],
        };
      }
      if (category.length === 2) {
        input = {
          id: category[1].id,
          internalID: category[1].internalID,
          name: value,
          parentIDList: [category[0].id],
        };
      }
      if (category.length === 3) {
        input = {
          id: category[2].id,
          internalID: category[2].internalID,
          name: value,
          parentIDList: [category[0].id, category[1].id],
        };
      }
      if (category.length === 4) {
        input = {
          id: category[3].id,
          internalID: category[3].internalID,
          name: value,
          parentIDList: [category[0].id, category[1].id, category[2].id],
        };
      }
      updateConfigCategory({ input: input }).then((data) => {
        if (data.data.data.updateItemCategory === null)
          return dispatch(showSnackbar("error", "เกิดเหตุผิดพลาด"));
        handleClose();
        setIsLoading(false);
      });
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="sm">
        <DialogTitle>
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {textHeader}
            <IconButton type="button" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </h2>
        </DialogTitle>
        <DialogContent>
          <div className="grid-container-50">
            <TextField
              autoComplete="off"
              error={errors && value === ""}
              helperText={errors && value === "" && "กรุณากรอก"}
              fullWidth
              value={value}
              label={label}
              size="small"
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            type="submit"
            color="success"
            onClick={() => handleClose()}
            sx={{
              width: "130px",
              margin: "15px 20px 20px 0",
            }}
          >
            ยกเลิก
          </Button>
          <Button
            variant="contained"
            type="submit"
            color="success"
            onClick={() => {
              if (value === "") return setErrors(true);
              if (warehouse) return handleSubmitWarehouse();
              if (Category) return handleSubmitCategory();
              if (binLocation) return handleSubmitBinLocation();
              if (pallete) return handleSubmitPallete();
            }}
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
