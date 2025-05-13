import {
  Backdrop,         // สำหรับแสดงพื้นหลังแบบโปร่งใสในระหว่างโหลด
  Breadcrumbs,      // ใช้สำหรับสร้าง breadcrumbs (แสดงเส้นทางนำทาง)
  CircularProgress, // ใช้แสดงวงกลมหมุนระหว่างการโหลด
  Tab,              // สำหรับสร้างแท็บ (Tab) ที่เปลี่ยนเนื้อหาได้
  Tabs,
} from "@mui/material";
import React, { useState, useEffect } from "react";     // useState: ใช้สร้างตัวแปร state, useEffect: ใช้จัดการ side effect เช่น การโหลดข้อมูล
import { useParams } from "react-router-dom";           // นำเข้า useParams จาก React Router: ใช้ดึง parameters จาก URL เช่น id
import BreadcrumbComponent from "../../../BreadcrumbComponent";         // นำเข้าคอมโพเนนต์ BreadcrmbComponent: ใช้สร้าง breadcrumbs (เส้นทางนำทาง) แบบกำหนดเอง
import AccountDetailComponent from "../../AccountDetailComponent";      // นำเข้า AccountDetailComponent: ใช้แสเงหรือแก้ไขรายละเอียดบัญชี
import { useFormik } from "formik";                                     // นำเข้า Formik: ใช้จัดการฟอร์ม (Forms) เช่น ค่าฟอร์ม การตรวจสอบ
import { initialValues, validationSchema } from "./payload";            // initialValues: ค่าเริ่มต้นของฟอร์ม, validationSchema: โครงสร้างการตรวจสอบฟอร์มด้วย Yup
import { useDispatch } from "react-redux";                              // นำเข้า useDispatch จาก Redux: ใช้ส่ง action ไปยังRedux store
import ButtonOptionComponent from "../../AccountReuseComponent/ButtonOptionComponent";      // นำเข้า BottonOptionComponent: ใช้สร้างปุ่มตัวเลือก เช่น ปุ่มแก้ไขหรือปิด
import { Box } from "@mui/system";                                      // นำเข้า Box จาก Material-UI: ใช้สำหรับจัดวาง loyout
import LatestTransactionComponent from "./LatestTransactionComponent";  // นำเข้า LatestTransactionComponent: ใช้แสดงรายการธุรกรรมล่าสุด
import { postAccount, updateAccount, getAccountById } from "../../../../adapter/Api"; // postAccount: ใช้สำหรับเพิ่มบัญชีใหม่, updateAccount: ใช้สำหรับแก้ไขข้อมูลบัญชีที่มีอยู่, getAccountById: ใช้ดึงข้อมูลบัญชีโดยระบุ ID
import { showSnackbar } from "../../../../redux/actions/snackbarActions";   // นำเข้า showSnackbar: ใช้แสดงข้อความแจ้งเตือน (Snackbar)

export default function ChartofAccountsInfo({ add }) {        // สร้างฟังก์ชัน React Component ชื่อ chartoAccountsInfo: รับ add เป็น prop: add = true: สร้างบัญชีใหม่, add = false: ดูหรือแก้ไขบัญชีที่มีอยู่
  const [isLoading, setIsLoading] = useState(true);           // สร้าง state ชื่อ isLoading : ใช้ควบคุมสถานะการโหลดข้อมูล (true = กำลังโหลด)
  const [disabled, setDisabled] = useState({                  // สร้าง state ชื่อ disabled: เก็บสถานะการเปิด/ปิดปุ่มต่างๆ
    options: false,           // เปิด/ปิดปุ่มตัวเลือก
    editButton: false,        // ปุ่มแก้ไข
    deleteButton: true,       // ปุ่มลบ
    cancelButton: false,
    info: true,
  });
  const [chartOfAccountData, setChartOfAccount] = useState(initialValues);    // สร้าง state ชื่อ chartOfAccountData: เก็บข้อมูลบัญชีที่ดึงมาจาก API หรือฟอร์ม ค่าเริ่มต้นมาจาก initialValues
  const { id } = useParams();    // ดึง id จาก URL: ใช้สำหรับโหลดข้อมูลบัญชีเมื่อเป็นโหมดแก้ไข
  const dispatch = useDispatch();   // เรียกใช้ Redux Dispatch: สำหรับส่ง action เช่น showSnackbar

  useEffect(() => {       // ใช้ useEffect เพื่อโหลดข้อมูลเมื่อคอมโพเนนต์ถูกสร้างขึ้น หรือเมื่อค่า add หรือ id เปลี่ยนแปลง
    if (!add && id) {     // เช็คว่า ไม่ใช่โหมดเพิ่ม (add = false) และมี id (หมายถึงโหมดแก้ไข)
      // โหลดข้อมูลบัญชีจาก API
      getAccountById(id)   // เรียกฟังก์ชัน getAccountById: ส่ง id เพื่อดึงข้อมูลบัญชีจาก API
        .then((data) => {   // เมื่อโหลดสำเร็จ
          setChartOfAccount(data); // อัปเดตข้อมูลบัญชี, อัปเดต chartOfAccountData ด้วยข้อมูลที่โหลดมา (setChartOfAccount)
          setIsLoading(false); // หยุดโหลด, เปลี่ยนสถานะการโหลดเป็น false เพราะข้อมูลโหลดเสร็จแล้ว
        })
        .catch((err) => {       // ถ้าเกิดข้อผิดพลาด
          console.error(err);   // แสดง error บน console
          dispatch(showSnackbar("error", "ไม่สามารถโหลดข้อมูลได้"));    // ใช้ showSnackbar แจ้งเตือนผู้ใช้
          setIsLoading(false); // หยุดโหลดแม้เจอข้อผิดพลาด, เปลี่ยน isLoading เป็น false
        });
    } else {                // ถ้าเป็นโหมดเพิ่ม (add = true)
      setIsLoading(false); // ถ้าเป็นโหมด add ไม่ต้องโหลดข้อมูล, ไม่ต้องโหลดข้อมูล และหยุดการโหลด (isLoading = false)
    }
  }, [add, id,dispatch]);     // คอยสังเกตการเปลี่ยนแปลงของ add, id, และ dispatch

  const formik = useFormik({    // สร้างอินสแตนซ์ formik
    initialValues: chartOfAccountData, // ตั้งค่าให้ตรงกับข้อมูลที่โหลดมา, กำหนดค่าเริ่มต้นจาก chartOfAccountData
    enableReinitialize: true, // อนุญาตให้รีเซ็ตค่าของ form เมื่อค่า chartOfAccountData เปลี่ยน, เปิดใช้งาน enableReinitialize: ให้ฟอร์มโหลดค่าใหม่เมื่อ chartOfAccountData เปลี่ยน
    validateOnChange: false,  // ปิดการตรวจสอบฟอร์มขณะเปลี่ยนค่า (validateOnChange)
    validateOnBlur: false,    // ปิดการตรวจสอบเมื่อคลิกนอกฟอร์ม (validateOnBlur)
    validationSchema: validationSchema,   // กำหนดการตรวจสอบฟอร์มด้วย validationSchema จากไฟล์ payload.js
    onSubmit: (values) => {               // เมื่อผู้ใช้กดส่งฟอร์ม (onSubmit)
      setIsLoading(true);                 // เปลี่ยนสถานะการโหลดเป็น true
      const postPayload = { ...values };  // คัดลอกค่าฟอร์มไปที่ postPayload
      if (id) {        // ถ้ามี id (โหมดแก้ไข)
        updateAccount(id, postPayload)    // เรียก API updateAccount เพื่อแก้ไขบัญชี
          .then((data) => {               // เมื่อสำเร็จ
            console.log(data);            // แสดงข้อมูลบน console
            setIsLoading(false);          
            dispatch(showSnackbar("success", "บันทึกข้อมูลสำเร็จ"));      // แจ้งเตือนผู้ใช้ด้วยข้อความ "บันทึกข้อมูลสำเร็จ"
          })
          .catch((err) => {       // ถ้าเกิดข้อผิดพลาด
            console.error(err);
            dispatch(showSnackbar("error", "บันทึกร่างไม่สำเร็จ"));       // แสดง error บน console และแจ้งเตือนด้วยข้อความ "บันทึกร่างไม่สำเร็จ"
            setIsLoading(false);
          });
      } else {    // ถ้าไม่มี id , ถ้าไม่มี id (โหมดเพิ่ม)
        postAccount(postPayload)           //เรียก api postAccount, เรียก API postAccount เพื่อสร้างบัญชีใหม่
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
  const [tabValue, setTabValue] = useState(0);    // เก็บสถานะแท็บปัจจุบัน, สร้าง state ชื่อ tabValue: เก็บค่าแท็บปัจจุบัน (0 = แท็บแรก)
  const handleChange = (_, newValue) => {         // เปลี่ยนแท็บเมื่อผู้ใช้กด, ฟังก์ชัน handleChange 
    setTabValue(newValue);                        // อัปเดตค่าแท็บเมื่อผู้ใช้เลือกแท็บใหม่
  };
  function a11yProps(index) {                     // ฟังก์ชัน a11yProps: สร้าง props สำหรับการเข้าถึง (accessibility)
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  const tabSx = {                                 // สร้าง style สำหรับแท็บที่กำลังแสดงผล
    color: "#419644 !important",
    cursor: "not-allowed !important",
    pointerEvents: "all !important",
  };
  //<================= Change Tab ===============>

  //<================= ButtonOption ==================>
  const [anchorOptionEl, setAnchorOptionEl] = useState(null);     // สร้าง state ชื่อ anchorOptionEl: ใช้เก็บตำแหน่งของเมนู (Dropdown) ที่จะแสดง
  const openOption = Boolean(anchorOptionEl);                     // แปลงค่า anchorOptionEl เป็น Boolean: ใช้สำหรับเปิด-ปิดเมนูตัวเลือก
  const handleOpenOptionMenu = (event) => {                       // ฟังก์ชัน handleOpenOptionMenu 
    setAnchorOptionEl(event.currentTarget);                       // เรียกเมื่อผู้ใช้คลิกปุ่มตัวเลือก เพื่อเก็บตำแหน่งเมนูปัจจุบัน
  };
  const handleCloseOptionMenu = () => {                           // ฟังก์ชัน handleCloseOptionMenu
    setAnchorOptionEl(null);                                      // ปิดเมนูตัวเลือกโดยตั้งค่า anchorOptionEl เป็น null
  };
  const optionItemsHandler = (_, index) => {                      // ฟังก์ชัน optionItemsHandler
    if (index === 0) {                                            // ตัวเลือกแรก (index 0): เปิด/ปิดโหมดการแก้ไขข้อมูล
      setAnchorOptionEl(null);
      setDisabled((prev) => ({
        ...prev,
        info: !prev.info,
      }));
    } else if (index === 1) {                                     // ตัวเลือกที่เหลือ (index 1, 2): ปิดเมนูโดยไม่ทำอะไรเพิ่มเติม
      setAnchorOptionEl(null);
    } else {
      setAnchorOptionEl(null);
    }
  };
  //<================= ButtonOption ==================>

  return (
    <>
      {isLoading && (                                                         // แสดง Backdropพร้อมวงกลมโหลดถ้า isLoading = ture, หาก isLoading เป็น true
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}                       
        >                                         
          <CircularProgress color="inherit" />          
        </Backdrop> //แสดง Backdrop พร้อมวงกลมโหลด (CircularProgress) เพื่อบอกผู้ใช้ว่ากำลังโหลดข้อมูล
      )}
      <Breadcrumbs separator="›" aria-label="breadcrumb"  // แสดง Breadcrumbs
      >
        <BreadcrumbComponent name="บัญชี" to="/accounting"    // ใช้บอกตำแหน่งของหน้าปัจจุบัน
        />
        <BreadcrumbComponent name="ผังบัญชี" to="/accounting/chart" />
        {add ? (          //ถ้าเป็นโหมดเพิ่ม (add): แสดง "สร้างบัญชี"
          <BreadcrumbComponent name="สร้างบัญชี" to="/accounting/chart/add" />
        ) : (             // ถ้าเป็นโหมดแก้ไข: แสดง "ลูกหนี้"
          <BreadcrumbComponent name="ลูกหนี้" to="/accounting/chart/ลูกหนี้"      
          />
        )}
      </Breadcrumbs>
      {add ? (    //หาก add = true (โหมดเพิ่ม)
        <div>       
          <h1 className="accounting__header__title"   // แสดงหัวข้อ "สร้างบัญชี"
          >
            สร้างบัญชี
            </h1>      
          <div>
            <AccountDetailComponent formik={formik} values={formik.values}        // แสดง AccountDetailComponent พร้อมส่ง formik และค่าจากฟอร์มไป
            />    
          </div>
        </div>
      ) : (             // หาก add = false (โหมดแก้ไข)
        <div>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "#419644",
              width: "fit-content",
              margin: "0 auto",
            }}
          >
            <Tabs               // แสดง Tabs สำหรับสลับเนื้อหาระหว่าง "รายละเอียด" และ "รายการบัญชี"
              value={tabValue}  // ใช้ tabValue ในการระบุแท็บปัจจุบัน
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
                sx={tabValue === 0 ? tabSx : undefined}
                {...a11yProps(0)}
              />
              <Tab
                label="รายการบัญชี"
                sx={tabValue === 1 ? tabSx : undefined}
                {...a11yProps(1)}
              />
            </Tabs>
          </Box>
          <div className="accounting__header">
            <h1 className="accounting__header__title">ลูกหนี้</h1>
            <div>
              <ButtonOptionComponent                          // แสดง ButtonOptionComponent
                    // ส่งค่าที่จำเป็น เช่นสถานะของปุ่ม (disabled) และฟังก์ชันจัดการคลิก (handleMenuItemClick)
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
            <AccountDetailComponent           // แสดง AccountDetailComponent ในโหมดอ่าน (view) หรือแก้ไข (ขึ้นกับ disabled.info)
              view
              formik={formik}
              disabled={disabled.info}
              values={formik.values}
              errors={formik.errors}
            />
          </div>
          <LatestTransactionComponent         // แสดง LatestTransactionComponent ด้านล่าง
           />              
        </div>
      )}
    </>
  );
}
