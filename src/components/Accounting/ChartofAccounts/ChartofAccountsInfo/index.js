import {
  Backdrop,
  Breadcrumbs,
  CircularProgress,
  Tab,
  Tabs,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BreadcrumbComponent from "../../../BreadcrumbComponent";
import AccountDetailComponent from "../../AccountDetailComponent";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./payload";
import { useDispatch } from "react-redux";
import ButtonOptionComponent from "../../AccountReuseComponent/ButtonOptionComponent";
import { Box } from "@mui/system";
import LatestTransactionComponent from "./LatestTransactionComponent";
import { postAccount, updateAccount, getAccountById } from "../../../../adapter/Api";
import { showSnackbar } from "../../../../redux/actions/snackbarActions";

export default function ChartofAccountsInfo({ add }) {
  const [isLoading, setIsLoading] = useState(true);
  const [disabled, setDisabled] = useState({
    options: false,
    editButton: false,
    deleteButton: true,
    cancelButton: false,
    info: true,
  });
  const [chartOfAccountData, setChartOfAccount] = useState(initialValues);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!add && id) {
      // โหลดข้อมูลบัญชีจาก API
      getAccountById(id)
        .then((data) => {
          setChartOfAccount(data); // อัปเดตข้อมูลบัญชี
          setIsLoading(false); // หยุดโหลด
        })
        .catch((err) => {
          console.error(err);
          dispatch(showSnackbar("error", "ไม่สามารถโหลดข้อมูลได้"));
          setIsLoading(false); // หยุดโหลดแม้เจอข้อผิดพลาด
        });
    } else {
      setIsLoading(false); // ถ้าเป็นโหมด add ไม่ต้องโหลดข้อมูล
    }
  }, [add, id,dispatch]);

  const formik = useFormik({
    initialValues: chartOfAccountData, // ตั้งค่าให้ตรงกับข้อมูลที่โหลดมา
    enableReinitialize: true, // อนุญาตให้รีเซ็ตค่าของ form เมื่อค่า chartOfAccountData เปลี่ยน
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setIsLoading(true);
      const postPayload = { ...values };
      if (id) {
        updateAccount(id, postPayload)
          .then((data) => {
            console.log(data);
            setIsLoading(false);
            dispatch(showSnackbar("success", "บันทึกข้อมูลสำเร็จ"));
          })
          .catch((err) => {
            console.error(err);
            dispatch(showSnackbar("error", "บันทึกร่างไม่สำเร็จ"));
            setIsLoading(false);
          });
      } else {
        postAccount(postPayload)
          .then((data) => {
            console.log(data);
            setIsLoading(false);
            dispatch(showSnackbar("success", "บันทึกข้อมูลสำเร็จ"));
          })
          .catch((err) => {
            console.error(err);
            dispatch(showSnackbar("error", "บันทึกร่างไม่สำเร็จ"));
            setIsLoading(false);
          });
      }
    },
  });

  //<================= Change Tab ===============>
  const [tabValue, setTabValue] = useState(0);
  const handleChange = (_, newValue) => {
    setTabValue(newValue);
  };
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  const tabSx = {
    color: "#419644 !important",
    cursor: "not-allowed !important",
    pointerEvents: "all !important",
  };
  //<================= Change Tab ===============>

  //<================= ButtonOption ==================>
  const [anchorOptionEl, setAnchorOptionEl] = useState(null);
  const openOption = Boolean(anchorOptionEl);
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
  //<================= ButtonOption ==================>

  return (
    <>
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        <BreadcrumbComponent name="บัญชี" to="/accounting" />
        <BreadcrumbComponent name="ผังบัญชี" to="/accounting/chart" />
        {add ? (
          <BreadcrumbComponent name="สร้างบัญชี" to="/accounting/chart/add" />
        ) : (
          <BreadcrumbComponent name="ลูกหนี้" to="/accounting/chart/ลูกหนี้" />
        )}
      </Breadcrumbs>
      {add ? (
        <div>
          <h1 className="accounting__header__title">สร้างบัญชี</h1>
          <div>
            <AccountDetailComponent formik={formik} values={formik.values} />
          </div>
        </div>
      ) : (
        <div>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "#419644",
              width: "fit-content",
              margin: "0 auto",
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleChange}
              TabIndicatorProps={{
                sx: {
                  backgroundColor: "#419644",
                },
              }}
              aria-label="basic tabs example"
            >
              <Tab
                label="รายละเอียด"
                sx={tabValue === 0 && tabSx}
                {...a11yProps(0)}
              />
              <Tab
                label="รายการบัญชี"
                sx={tabValue === 1 && tabSx}
                {...a11yProps(1)}
              />
            </Tabs>
          </Box>
          <div className="accounting__header">
            <h1 className="accounting__header__title">ลูกหนี้</h1>
            <div>
              <ButtonOptionComponent
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
          <div>
            <AccountDetailComponent
              view
              formik={formik}
              disabled={disabled.info}
              values={formik.values}
              errors={formik.errors}
            />
          </div>
          <LatestTransactionComponent />
        </div>
      )}
    </>
  );
}
