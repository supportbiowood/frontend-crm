import React, { useState } from "react";
import ButtonOptionComponent from "../../AccountReuseComponent/ButtonOptionComponent";
import { useHistory } from "react-router-dom";
import TextFieldCustom from "../../AccountReuseComponent/TextFieldCustom";
import { Grid } from "@mui/material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

export default function HeaderInfoComponent({
  disabled,
  setDisabled,
  values,
  formik,
  add,
  id,
}) {
  //<================= ButtonOption ==================>
  const [anchorOptionEl, setAnchorOptionEl] = useState(null);
  const [anchorPrintEl, setAnchorPrintEl] = useState(null);
  const openOption = Boolean(anchorOptionEl);
  const openPrint = Boolean(anchorPrintEl);
  const history = useHistory();

  const handleOpenOptionMenu = (event) => {
    setAnchorOptionEl(event.currentTarget);
  };
  const handleCloseOptionMenu = () => {
    setAnchorOptionEl(null);
  };
  const optionItemsHandler = (_, index) => {
    if (index === 0) {
      setAnchorOptionEl(null);
      setDisabled((prev) => ({
        ...prev,
        info: !prev.info,
      }));
    } else if (index === 1) {
      setAnchorOptionEl(null);
    } else {
      setAnchorOptionEl(null);
    }
  };

  const printItemsHandler = (_, index) => {
    if (index === 0) {
      history.push(`/่accounting/journal/${id}/pdf`);
      setAnchorPrintEl(null);
    }
  };
  const handleOpenPrintMenu = (event) => {
    setAnchorPrintEl(event.currentTarget);
  };

  const handleClosePrintMenu = () => {
    setAnchorPrintEl(null);
  };
  //<================= ButtonOption ==================>

  //<================ Change Date =================>
  const handleChangeDate = (newValue) => {
    formik.setFieldValue("account_journal_ref_document_date", newValue);
  };

  return (
    <>
      <div className="accounting__header">
        {add ? (
          <h1 className="accounting__header__title">สร้างบันทึกบัญชี</h1>
        ) : (
          <h1 className="accounting__header__title">บันทึกบัญชี</h1>
        )}
        <div className="accounting__button-layout">
          <ButtonOptionComponent
            disabled={add || disabled.print}
            defaultButtonValue="พิมพ์เอกสาร"
            options={["พิมพ์ใบเสนอราคา"]}
            handleMenuItemClick={printItemsHandler}
            open={openPrint}
            anchorEl={anchorPrintEl}
            handleOpen={handleOpenPrintMenu}
            handleClose={handleClosePrintMenu}
            variant="outlined"
          />
          <ButtonOptionComponent
            disabled={add}
            disabledCancelButton={disabled.cancelButton}
            disabledEditButton={disabled.editButton}
            disabledDeleteButton={disabled.deleteButton}
            defaultButtonValue="ตัวเลือก"
            options={["แก้ไข", "ลบ", "ปิดใช้งาน"]}
            handleMenuItemClick={optionItemsHandler}
            open={openOption}
            anchorEl={anchorOptionEl}
            handleOpen={handleOpenOptionMenu}
            handleClose={handleCloseOptionMenu}
            variant="outlined"
          />
        </div>
      </div>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item>
          <h3>เลขที่เอกสาร</h3>
        </Grid>
        <Grid item>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              name="account_journal_ref_document_date"
              disabled={!add && disabled.info}
              label="วันที่ออกเอกสาร"
              inputFormat="dd/MM/yyyy"
              value={values.account_journal_ref_document_date}
              onChange={handleChangeDate}
              renderInput={(params) => (
                <TextFieldCustom sx={{ width: 150 }} {...params} />
              )}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} sm={6} md={3} lg={3} xl={3} marginY={2}>
          <TextFieldCustom
            id="account_journal_ref_document_id"
            name="account_journal_ref_document_id"
            label="หมายเลขอ้างอิง/เลขที่ใบเสนอราคา"
            disabled={!add && disabled.info}
            value={values.account_journal_ref_document_id}
          />
        </Grid>
      </Grid>
    </>
  );
}
