import { Chip } from "@mui/material";
import React from "react";

const CartageMethodComponent = ({ label, index, formik, disabled }) => {
  const deleteHandler = (deletedIndex) => {
    formik.setFieldValue(
      "delivery_cartage_method",
      formik.values.delivery_cartage_method.filter(
        (_, currIndex) => currIndex !== deletedIndex
      )
    );
  };
  return (
    <Chip
      sx={{ mr: 1, alignSelf: "center" }}
      label={label}
      variant="outlined"
      onDelete={disabled ? null : () => deleteHandler(index)}
    />
  );
};

export default CartageMethodComponent;
