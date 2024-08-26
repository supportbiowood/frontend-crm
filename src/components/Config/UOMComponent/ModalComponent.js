import React from "react";
import {
  Button,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  TextField,
  Grid,
  Box,
} from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";

import CloseIcon from "@mui/icons-material/Close";

export default function ModalComponent({
  title,
  openModal,
  selecedUom,
  onSubmit,
  handleCloseModal,
}) {
  const uomSchema = Yup.object().shape({
    id: Yup.string().required("กรุณากรอก").nullable(),
    name: Yup.string().required("กรุณากรอก").nullable(),
  });

  const formik = useFormik({
    initialValues: selecedUom || {
      id: "",
      name: "",
      description: "",
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: uomSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <Dialog
      open={openModal}
      onClose={handleCloseModal}
      fullWidth={true}
      maxWidth="sm"
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontWeight: "bold",
            fontSize: "1.5rem",
          }}
        >
          {title}
          <IconButton type="button" onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box my={1}>
            {!selecedUom && (
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    id="id"
                    name="id"
                    fullWidth
                    size={"small"}
                    label="รหัส"
                    onChange={(e) => {
                      formik.handleChange(e);
                    }}
                    helperText={formik.errors?.id}
                    error={Boolean(formik.errors.id)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="name"
                    name="name"
                    fullWidth
                    size={"small"}
                    label="ชื่อ"
                    onChange={(e) => {
                      formik.handleChange(e);
                    }}
                    helperText={formik.errors?.name}
                    error={Boolean(formik.errors.name)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="description"
                    name="description"
                    fullWidth
                    size={"small"}
                    rows={3}
                    multiline
                    label="คำอธิบาย"
                    onChange={(e) => {
                      formik.handleChange(e);
                    }}
                  />
                </Grid>
              </Grid>
            )}
            {selecedUom && title === "แก้ไขหน่วย" && (
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <TextField
                    size={"small"}
                    fullWidth
                    label="รหัส"
                    id="id"
                    name="id"
                    value={formik.values.id || ""}
                    onChange={(e) => {
                      formik.handleChange(e);
                    }}
                    helperText={formik.errors?.id}
                    error={Boolean(formik.errors.id)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    size={"small"}
                    fullWidth
                    label="ชื่อ"
                    id="name"
                    name="name"
                    value={formik.values.name || ""}
                    onChange={(e) => {
                      formik.handleChange(e);
                    }}
                    helperText={formik.errors?.name}
                    error={Boolean(formik.errors.name)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    size={"small"}
                    fullWidth
                    label="คำอธิบาย"
                    rows={3}
                    multiline
                    id="description"
                    name="description"
                    value={formik.values.description || ""}
                    onChange={(e) => {
                      formik.handleChange(e);
                    }}
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            type="submit"
            onClick={title !== "แก้ไขหน่วย" && onSubmit}
            color="success"
            sx={{
              width: "130px",
              backgroundColor: "rgba(65, 150, 68, 1)",
              margin: "5px 20px 20px 0",
            }}
          >
            {!selecedUom || title === "แก้ไขหน่วย" ? "บันทึก" : "ยืนยัน"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
