import React from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";

export default function ButtonComponent(props) {
  return (
    <>
      <LoadingButton
        color={props.color}
        variant={props.variant}
        disabled={props.disabled}
        type={props.type}
        onClick={props.onClick}
        loading={props.disabled}
        loadingPosition={props.icon ? "start" : "center"}
        startIcon={props.icon ? <SaveIcon /> : ""}
        sx={props.sx}
        className={props.className}
      >
        {props.text}
      </LoadingButton>
    </>
  );
}
