import {
  Backdrop,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Form, Formik } from "formik";
import React, { useState, useEffect } from "react";
import ButtonComponent from "../ButtonComponent";
import { uploadFileToS3 } from "../UploadImageToS3WithNativeSdk/UploadImageToS3WithNativeSdk";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/actions/snackbarActions";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import moment from "moment";
import "moment-timezone";
import { getProjectActivityById, postProjectActivity } from "../../adapter/Api";
import { Link } from "react-router-dom";

export default function MovementComponent(props) {
  const checkImage = ["image/png", "image/jpg", "image/jpeg", "image/gif"];
  const [myValue, setMyValue] = useState([]);
  const [data, setData] = useState();
  const [sortType, setSortType] = useState("จากเก่าไปใหม่");
  const [cloneData, setClonedata] = useState();
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorDes, setErrorDes] = useState(false);
  const dispatch = useDispatch();

  const handleClickUploadFile = (files) => {
    if (files.length !== 0) {
      const file = files[0];
      setIsLoading(true);
      uploadFileToS3(file, "CRM", "test")
        .then((data) => {
          const Clone = [...myValue];
          Clone.push({
            file_name: file.name,
            file_url: data.Location,
            file_type: file.type,
          });
          setMyValue(Clone);
          dispatch(showSnackbar("success", "อัพโหลดสำเร็จ"));
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          dispatch(showSnackbar("error", "อัพโหลดล้มเหลว"));
          setIsLoading(false);
        });
    }
  };

  function renderActivity(data) {
    if (data.activity_type === "memo") {
      return (
        <div>
          <div className="activity-log">
            <div className="header">
              วันที่{" "}
              {moment(data._project_activity_created, "X")
                .tz("Asia/Bangkok")
                .format("DD/MM/YYYY เวลา HH:mm")}{" "}
              - โดย{" "}
              {data._project_activity_createdby_employee.employee_firstname}{" "}
              {data._project_activity_createdby_employee.employee_lastname}
            </div>
            <div className="body">
              {data.activity_data.text}
              <div className="grid-container-25">
                {data.activity_data.file_list &&
                  data.activity_data.file_list.map((val) => {
                    if (!checkImage.includes(val.file_type)) {
                      return (
                        <a href={val.file_url} target="_blank" rel="noreferrer">
                          <div className="attachment-card-container">
                            <div className="icon">
                              <DescriptionOutlinedIcon style={style.medium} />
                            </div>
                            <div className="right-side">
                              <div className="topic">{val.file_name}</div>
                              <div className="content">
                                <div>
                                  โดย{" "}
                                  {
                                    val._file_createdby_employee
                                      .employee_firstname
                                  }
                                </div>
                                <div>
                                  วันที่{" "}
                                  {moment(val._file_createdby_employee.iat, "X")
                                    .tz("Asia/Bangkok")
                                    .format("DD/MM/YYYY, HH:MM")}
                                </div>
                              </div>
                            </div>
                          </div>
                        </a>
                      );
                    } else return null;
                  })}
              </div>
              <div className="grid-container-25">
                {data.activity_data.file_list &&
                  data.activity_data.file_list.map((val) => {
                    if (checkImage.includes(val.file_type)) {
                      return (
                        <a href={val.file_url} target="_blank" rel="noreferrer">
                          <div
                            className="img_display"
                            style={{ backgroundImage: `url(${val.file_url})` }}
                          />
                        </a>
                      );
                    } else return null;
                  })}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (data.activity_type === "event") {
      return (
        <div>
          <div className="activity-log">
            <div className="header">
              วันที่{" "}
              {moment(data._project_activity_created, "X")
                .tz("Asia/Bangkok")
                .format("DD/MM/YYYY, HH:mm")}{" "}
              - โดย{" "}
              {data._project_activity_createdby_employee.employee_firstname}{" "}
              {data._project_activity_createdby_employee.employee_lastname}
            </div>
            <div className="body">
              <h4>{data.activity_data.description}</h4>
              <div className="grid-container-50 ">
                {data.activity_data.event_status === "planned" && (
                  <div className="event-container">
                    <div className="grid-container-30">
                      <div className="header-event">วางแผน </div>
                      <div>
                        {moment(data.activity_data.event_plan_start_date, "X")
                          .tz("Asia/Bangkok")
                          .format("DD/MM/YYYY, HH:mm")}{" "}
                        -{" "}
                        {moment(data.activity_data.event_plan_end_date, "X")
                          .tz("Asia/Bangkok")
                          .format("DD/MM/YYYY, HH:MM")}
                      </div>
                      <div className="header-event">ผู้ติดต่อ</div>
                      <div style={{ display: "flex", gap: "20px" }}>
                        {data.activity_data.event.contact_id &&
                          data.activity_data.event.contact
                            .contact_individual_first_name}{" "}
                        {data.activity_data.event.contact_id &&
                          data.activity_data.event.contact
                            .contact_individual_last_name}
                        <div className="header-event">
                          {data.activity_data.event.contact_id &&
                            data.activity_data.event.contact
                              .contact_channel_list[0].contact_channel_name}
                        </div>
                        {data.activity_data.event.contact_id &&
                          data.activity_data.event.contact
                            .contact_channel_list[0].contact_channel_detail}
                      </div>
                      <div className="header-event">หัวข้อนัดหมาย </div>
                      <div>{data.activity_data.event.event_topic}</div>
                    </div>
                  </div>
                )}
                {data.activity_data.event_status === "scheduled" && (
                  <div className="event-container">
                    <div className="grid-container-30">
                      {data.activity_data.event_plan_start_date !== null &&
                        data.activity_data.event_plan_end_date !== null && (
                          <>
                            <div className="header-event">วางแผน</div>
                            <div>
                              {" "}
                              {moment(
                                data.activity_data.event_plan_start_date,
                                "X"
                              )
                                .tz("Asia/Bangkok")
                                .format("DD/MM/YYYY, HH:mm")}{" "}
                              -{" "}
                              {moment(
                                data.activity_data.event_plan_end_date,
                                "X"
                              )
                                .tz("Asia/Bangkok")
                                .format("DD/MM/YYYY, HH:MM")}
                            </div>
                          </>
                        )}
                      {data.activity_data.event_schedule_start_date !== null &&
                        data.activity_data.event_schedule_end_date !== null && (
                          <>
                            <div className="header-event">นัดหมาย</div>
                            <div>
                              {" "}
                              {moment(
                                data.activity_data.event_schedule_start_date,
                                "X"
                              )
                                .tz("Asia/Bangkok")
                                .format("DD/MM/YYYY, HH:mm")}{" "}
                              -{" "}
                              {moment(
                                data.activity_data.event_schedule_end_date,
                                "X"
                              )
                                .tz("Asia/Bangkok")
                                .format("DD/MM/YYYY, HH:mm")}
                            </div>
                          </>
                        )}
                    </div>
                  </div>
                )}
                {data.activity_data.event_status === "checkin" && (
                  <div className="event-container">
                    <div className="grid-container-30">
                      {data.activity_data.event_plan_start_date !== null &&
                        data.activity_data.event_plan_end_date !== null && (
                          <>
                            <div className="header-event">วางแผน</div>
                            <div>
                              {" "}
                              {moment(
                                data.activity_data.event_plan_start_date,
                                "X"
                              )
                                .tz("Asia/Bangkok")
                                .format("DD/MM/YYYY, HH:mm")}{" "}
                              -{" "}
                              {moment(
                                data.activity_data.event_plan_end_date,
                                "X"
                              )
                                .tz("Asia/Bangkok")
                                .format("DD/MM/YYYY, HH:MM")}
                            </div>
                          </>
                        )}
                      {data.activity_data.event_schedule_start_date !== null &&
                        data.activity_data.event_schedule_end_date !== null && (
                          <>
                            <div className="header-event">นัดหมาย</div>
                            <div>
                              {" "}
                              {moment(
                                data.activity_data.event_schedule_start_date,
                                "X"
                              )
                                .tz("Asia/Bangkok")
                                .format("DD/MM/YYYY, HH:mm")}{" "}
                              -{" "}
                              {moment(
                                data.activity_data.event_schedule_end_date,
                                "X"
                              )
                                .tz("Asia/Bangkok")
                                .format("DD/MM/YYYY, HH:mm")}
                            </div>
                          </>
                        )}
                      <div className="header-event">เช็คอิน</div>
                      <div
                        style={{
                          color: "rgba(36, 101, 39, 1)",
                          fontWeight: "bold",
                        }}
                      >
                        {moment(
                          data.activity_data.event_checkin_start_date,
                          "X"
                        )
                          .tz("Asia/Bangkok")
                          .format("DD/MM/YYYY, HH:mm")}
                      </div>
                    </div>
                  </div>
                )}
                {data.activity_data.event_status === "finished" && (
                  <div className="event-container">
                    <div className="grid-container-30">
                      {data.activity_data.event_plan_start_date !== null &&
                        data.activity_data.event_plan_end_date !== null && (
                          <>
                            <div className="header-event">วางแผน</div>
                            <div>
                              {" "}
                              {moment(
                                data.activity_data.event_plan_start_date,
                                "X"
                              )
                                .tz("Asia/Bangkok")
                                .format("DD/MM/YYYY, HH:mm")}{" "}
                              -{" "}
                              {moment(
                                data.activity_data.event_plan_end_date,
                                "X"
                              )
                                .tz("Asia/Bangkok")
                                .format("DD/MM/YYYY, HH:MM")}
                            </div>
                          </>
                        )}
                      {data.activity_data.event_schedule_start_date !== null &&
                        data.activity_data.event_schedule_end_date !== null && (
                          <>
                            <div className="header-event">นัดหมาย</div>
                            <div>
                              {" "}
                              {moment(
                                data.activity_data.event_schedule_start_date,
                                "X"
                              )
                                .tz("Asia/Bangkok")
                                .format("DD/MM/YYYY, HH:mm")}{" "}
                              -{" "}
                              {moment(
                                data.activity_data.event_schedule_end_date,
                                "X"
                              )
                                .tz("Asia/Bangkok")
                                .format("DD/MM/YYYY, HH:mm")}
                            </div>
                          </>
                        )}
                      <div className="header-event">เช็คอิน</div>
                      <div
                        style={{
                          color: "rgba(36, 101, 39, 1)",
                          fontWeight: "bold",
                        }}
                      >
                        {moment(
                          data.activity_data.event_checkin_start_date,
                          "X"
                        )
                          .tz("Asia/Bangkok")
                          .format("DD/MM/YYYY, HH:mm")}{" "}
                        {data.activity_data.event_checkin_dest_date !==
                          null && (
                          <>
                            -{" "}
                            {moment(
                              data.activity_data.event_checkin_dest_date,
                              "X"
                            )
                              .tz("Asia/Bangkok")
                              .format("DD/MM/YYYY, HH:mm")}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {data.activity_data.event_status === "cancelled" && (
                  <div className="event-container">
                    <div className="grid-container-30">
                      <div className="header-event">หัวข้อนัดหมาย </div>
                      <div>{data.activity_data.event.event_topic}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (data.activity_type === "contact_change") {
      return (
        <div>
          <div className="activity-log">
            <div className="header">
              วันที่{" "}
              {moment(data._project_activity_created, "X")
                .tz("Asia/Bangkok")
                .format("DD/MM/YYYY เวลา HH:mm")}{" "}
              - โดย{" "}
              {data._project_activity_createdby_employee.employee_firstname}{" "}
              {data._project_activity_createdby_employee.employee_lastname}
            </div>
            <div className="body">
              <h3>{data.activity_data.description}</h3>
              <div>รายละเอียด : {data.activity_data.description}</div>
              <div className="grid-container-30">
                <div className="card-contact">
                  <div className="container">
                    <div className="left-side">
                      <div className="image-preview">
                        <img
                          className="image-user"
                          src={data.activity_data.employee.employee_img_url}
                          alt=""
                          srcSet=""
                        />
                      </div>
                    </div>
                    <div className="right-side">
                      <div className="topic">
                        <div>{data.activity_data.employee.role}</div>
                      </div>
                      <div>
                        ชื่อ นามสกุล:{" "}
                        {`${data.activity_data.employee.employee_firstname}  ${data.activity_data.employee.employee_lastname}`}
                      </div>
                      <div>
                        ตำแหน่ง: {data.activity_data.employee.employee_position}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (data.activity_type === "status_change") {
      return (
        <div>
          <div className="activity-log">
            <div className="header">
              วันที่{" "}
              {moment(data._project_activity_created, "X")
                .tz("Asia/Bangkok")
                .format("DD/MM/YYYY เวลา HH:mm")}{" "}
              - โดย{" "}
              {data._project_activity_createdby_employee.employee_firstname}{" "}
              {data._project_activity_createdby_employee.employee_lastname}
            </div>
            <div className="body">
              <h3>เปลี่ยนแปลงสถานะโครงการ</h3>
              <div>
                รายละเอียด : {data.activity_data.description} เมื่อวันที่{" "}
                {moment(
                  data.activity_data.project_status_log
                    ._project_status_log_created,
                  "X"
                )
                  .tz("Asia/Bangkok")
                  .format("DD/MM/YYYY เวลา HH:mm")}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (data.activity_type === "document") {
      return (
        <div>
          <div className="activity-log">
            <div className="header">
              วันที่{" "}
              {moment(data._project_activity_created, "X")
                .tz("Asia/Bangkok")
                .format("DD/MM/YYYY HH:MM")}{" "}
              - โดย{" "}
              {data._project_activity_createdby_employee.employee_firstname}{" "}
              {data._project_activity_createdby_employee.employee_lastname}
            </div>
            <div className="body">
              <h3>เอกสารการขาย</h3>
              <div>รายละเอียด : {data.activity_data.description}</div>
              <div className="grid-container-25">
                <Link
                  to={`/income/${data.activity_data.document_type}/${data.activity_data.ref_document_id}`}
                  target="_blank"
                >
                  <div className="attachment-card-container">
                    <div className="icon">
                      <DescriptionOutlinedIcon />
                    </div>
                    <div className="right-side">
                      <p className="topic">
                        {data.activity_data.document_name}
                      </p>
                      <div className="content">
                        <div>โดย {data.activity_data.employee_firstname} </div>
                        <div>
                          วันที่{" "}
                          {moment(data.activity_data._created)
                            .tz("Asia/Bangkok")
                            .format("DD/MM/YYYY, HH:mm")}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  const setValue = () => {
    setText("");
    setMyValue([]);
  };

  const postData = (setSubmitting, resetForm) => {
    const prepare_update_data = {
      project_id: props.project_id,
      activity_type: "memo",
      activity_data: {
        text: text,
        file_list: myValue,
      },
    };
    if (text === "") return null;
    setIsLoading(true);
    postProjectActivity(prepare_update_data)
      .then((data) => {
        if (data.data.status === "success") {
          dispatch(showSnackbar("success", "บันทึกสำเร็จ"));
          setIsLoading(false);
          setSubmitting(false);
          setValue();
          resetForm();
        }
      })
      .catch((err) => {
        dispatch(showSnackbar("error", `${err.response}` || "เกิดเหตุผิดพลาด"));
        setIsLoading(false);
        setSubmitting(false);
        setValue();
        resetForm();
      });
  };

  useEffect(() => {
    getProjectActivityById(props.project_id)
      .then((data) => {
        if (data.data.status === "success") {
          const myData = data.data.data;
          setData(myData);
          setClonedata(myData);
          if (sortType === "จากใหม่ไปเก่า")
            return sorting("จากใหม่ไปเก่า", myData);
        }
      })
      .catch((err) => {
        dispatch(showSnackbar("error", err));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setData, isLoading]);

  function sorting(e, data) {
    setSortType(e);
    if (e === "จากเก่าไปใหม่") {
      const obj = [...data];
      obj &&
        obj.sort((a, b) => {
          return a._project_activity_created - b._project_activity_created;
        });
      setClonedata(obj);
      setData(obj);
    } else if (e === "จากใหม่ไปเก่า") {
      const obj = [...data];
      obj &&
        obj.sort((a, b) => {
          return b._project_activity_created - a._project_activity_created;
        });
      setClonedata(obj);
      setData(obj);
    }
  }

  function filter(e) {
    if (e === "all") return setData(cloneData);
    const obj = [...cloneData];
    const newObj =
      obj &&
      obj.filter((a) => {
        return a.activity_type === e;
      });
    setData(newObj);
  }

  const options = [
    {
      name: "จากเก่าไปใหม่",
    },
    {
      name: "จากใหม่ไปเก่า",
    },
  ];

  const optionstwo = [
    {
      name: "ทั้งหมด",
      value: "all",
    },
    {
      name: "บันทึก",
      value: "memo",
    },
    {
      name: "แผนการทำงาน",
      value: "event",
    },
    {
      name: "เปลี่ยนแปลงผู้ติดต่อ",
      value: "contact_change",
    },
    {
      name: "เปลี่ยนแปลงสถานะ",
      value: "status_change",
    },
    {
      name: "เอกสาร",
      value: "document",
    },
  ];

  return (
    <Formik
      enableReinitialize
      initialValues={data}
      validateOnChange={true}
      validateOnBlur={true}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        return resetForm();
      }}
    >
      {({
        values,
        isSubmitting,
        handleSubmit,
        setFieldValue,
        setSubmitting,
        resetForm,
      }) => (
        <Form
          method="POST"
          onSubmit={handleSubmit}
          className={"inputGroup"}
          autoComplete="off"
        >
          {isLoading && (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer - 1 }}
              open={true}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          )}
          <div style={{ gap: "10px", display: "flex", justifyContent: "end" }}>
            <ButtonComponent
              text="สร้างใบถอดแบบ"
              variant="contained"
              color="success"
            />
            <ButtonComponent
              text="สร้างใบเสนอราคา"
              variant="contained"
              color="success"
            />
          </div>
          <h2 style={{ marginBottom: "16px", marginTop: "20px" }}>
            การเคลื่อนไหว
          </h2>
          <div className="grid-container-75">
            <TextField
              error={errorDes}
              helperText={errorDes && "กรุณากรอก"}
              fullWidth
              placeholder="รายละเอียด"
              multiline
              rows={3}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
            />
            <div>
              <div className="fileUpload">
                <input
                  type="file"
                  id="file"
                  className="upload"
                  onChange={(e) =>
                    handleClickUploadFile(e.target.files, setFieldValue)
                  }
                />
                <div>เพิ่มไฟล์</div>
              </div>

              <ButtonComponent
                text="บันทึก"
                type="button"
                variant="contained"
                color="success"
                onClick={() => {
                  if (text === "") return setErrorDes(true);
                  setErrorDes(false);
                  postData(setSubmitting, resetForm);
                }}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {myValue && (
            <div>
              <div className="flex-container" style={{ marginTop: "10px" }}>
                {myValue &&
                  myValue.map((val) => {
                    if (checkImage.includes(val.file_type)) {
                      return (
                        <a href={val.file_url} target="_blank" rel="noreferrer">
                          <div
                            className="img_display"
                            style={{ backgroundImage: `url(${val.file_url})` }}
                          />
                        </a>
                      );
                    } else {
                      return <></>;
                    }
                  })}
              </div>
              {/* <div style={{marginTop: '10px'}}>ไฟล์แนบ:</div> */}
              <div className="grid-container-33" style={{ marginTop: "10px" }}>
                {myValue &&
                  myValue.map((val) => {
                    if (!checkImage.includes(val.file_type)) {
                      return (
                        <a href={val.file_url} target="_blank" rel="noreferrer">
                          <div className="attachment-card-container">
                            <div className="icon">
                              <DescriptionOutlinedIcon style={style.medium} />
                            </div>
                            <div className="right-side">
                              {/* {JSON.stringify(val)} */}
                              <div className="topic">{val.file_name}</div>
                              <div className="content">
                                <div>โดย -</div>
                                <div>
                                  วันที่{" "}
                                  {moment(new Date(), "X")
                                    .tz("Asia/Bangkok")
                                    .format("DD/MM/YYYY, HH:MM")}
                                </div>
                              </div>
                            </div>
                          </div>
                        </a>
                      );
                    } else {
                      return <></>;
                    }
                  })}
              </div>
            </div>
          )}

          <div className="grid-container-50">
            <div className="grid-container-50">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">
                  การเรียงลำดับ
                </InputLabel>
                <Select
                  fullWidth
                  defaultValue="จากเก่าไปใหม่"
                  size="small"
                  id="demo-simple-select"
                  label="การเรียงลำดับ"
                  onChange={(e) => {
                    sorting(e.target.value, values);
                  }}
                >
                  {options.map((option, i) => {
                    return (
                      <MenuItem value={option.name} key={i}>
                        {option.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">
                  ประเภทการเคลื่อนไหว
                </InputLabel>
                <Select
                  fullWidth
                  size="small"
                  id="demo-simple-select"
                  label="ประเภทการเคลื่อนไหว"
                  defaultValue="all"
                  onChange={(e) => {
                    filter(e.target.value);
                  }}
                >
                  {optionstwo.map((option, i) => {
                    return (
                      <MenuItem value={option.value} key={i}>
                        {option.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </div>
          </div>

          <div>
            {values &&
              values.map((val, index) => {
                return renderActivity(val);
              })}
            {values && values.length === 0 && <h3>"ไม่พบรายการ"</h3>}
          </div>
        </Form>
      )}
    </Formik>
  );
}

const style = {
  small: {
    width: 30,
    height: 30,
  },
  medium: {
    width: 40,
    height: 40,
  },
  large: {
    width: 60,
    height: 60,
  },
};
