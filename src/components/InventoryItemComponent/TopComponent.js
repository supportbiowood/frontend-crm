import React, { useEffect } from "react";
import {
  TextField,
  Autocomplete,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Checkbox,
  FormHelperText,
  FormGroup,
} from "@mui/material";
import TagComponent from "../TagComponent";
import Placeholder from "../../images/placeholder.jpeg";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/actions/snackbarActions";
import { createFilterOptions } from "@mui/material/Autocomplete";

import { uploadFileToS3 } from "../UploadImageToS3WithNativeSdk/UploadImageToS3WithNativeSdk";

const myTag = [
  {
    name: "ภายใน",
    value: "ภายใน",
  },
  {
    name: "ภายนอก",
    value: "ภายนอก",
  },
];

const filter = createFilterOptions();

export default function TopComponent(props) {
  const dispatch = useDispatch();

  const handleClickUploadFile = (files, setFieldValue, id) => {
    if (files.length !== 0) {
      const file = files[0];
      // setSubmitting(true);
      uploadFileToS3(file, "CRM", "test")
        .then((data) => {
          setFieldValue(`imageURLList[${id}]`, data.Location);
          dispatch(showSnackbar("success", "อัพโหลดสำเร็จ"));
          // setSubmitting(false);
        })
        .catch((err) => {
          dispatch(showSnackbar("error", "อัพโหลดล้มเหลว"));
          // setSubmitting(false);
        });
    }
  };

  useEffect(() => {
    if (props.values.itemType === "SERVICE") {
      props.setFieldValue("isInventory", false);
    } else {
      props.setFieldValue("isInventory", true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.values.itemType]);

  const error =
    [
      props.values.isInventory,
      props.values.isSales,
      props.values.isPurchase,
    ].filter((v) => v).length < 1;

  const color = {
    color: "#2e7d32",
    "&.Mui-checked": {
      color: "#2e7d32",
    },
  };

  return (
    <div>
      <div className="grid-container-60">
        <div>
          <h3 className="sales-contact-list__header">ประเภทสินค้า</h3>
          <FormControl disabled component="fieldset">
            <RadioGroup
              row
              aria-labelledby="demo-radio-buttons-group-label"
              name="itemType"
              onChange={(e) => {
                props.handleChange(e);
              }}
              value={props.values.itemType}
            >
              <FormControlLabel
                value="PRODUCT"
                control={<Radio sx={color} />}
                label="วัสดุไม้"
              />
              <FormControlLabel
                value="PRODUCT_ASSEMBLY"
                control={<Radio sx={color} />}
                label="วัสดุประกอบ"
              />
              <FormControlLabel
                value="SUPPLIES"
                control={<Radio sx={color} />}
                label="วัสดุอุปกรณ์หลัก"
              />
              <FormControlLabel
                value="CONSUMABLES"
                control={<Radio sx={color} />}
                label="วัสดุสิ้นเปลือง"
              />
              <FormControlLabel
                value="SERVICE"
                control={<Radio sx={color} />}
                label="บริการ"
              />
              <FormControlLabel
                value="OTHER"
                control={<Radio sx={color} />}
                label="อื่นๆ"
              />
            </RadioGroup>
          </FormControl>
          <h3 className="sales-contact-list__header">สินค้า</h3>
          <div className="grid-container-50">
            <TextField
              disabled
              onChange={(e) => {
                props.handleChange(e);
              }}
              onBlur={props.handleBlur}
              size="small"
              type="text"
              name="id"
              id="outlined-error-helper-text"
              label="รหัสสินค้า"
              value={props.values.id || ""}
              error={props.errors.id && props.touched.id && props.errors.id}
              helperText={
                props.errors.id && props.touched.id && props.errors.id
              }
            />
            <TextField
              onChange={(e) => {
                props.handleChange(e);
              }}
              onBlur={props.handleBlur}
              type="text"
              size="small"
              name="name"
              id="outlined-error-helper-text"
              label="ชื่อสินค้า"
              value={props.values.name || ""}
              error={
                props.errors.name && props.touched.name && props.errors.name
              }
              helperText={
                props.errors.name && props.touched.name && props.errors.name
              }
            />
            <TextField
              onChange={(e) => {
                props.handleChange(e);
              }}
              onBlur={props.handleBlur}
              type="text"
              size="small"
              name="internalID"
              id="outlined-error-helper-text"
              label="ชื่อสินค้าภายใน"
              value={props.values.internalID || ""}
              error={
                props.errors.internalID &&
                props.touched.internalID &&
                props.errors.internalID
              }
              helperText={
                props.errors.internalID &&
                props.touched.internalID &&
                props.errors.internalID
              }
            />
          </div>
          <TextField
            onChange={(e) => {
              props.handleChange(e);
            }}
            onBlur={props.handleBlur}
            type="description"
            fullWidth
            size="small"
            name="description"
            id="outlined-error-helper-text"
            label="รายละเอียด"
            value={props.values.description || ""}
            error={
              props.errors.description &&
              props.touched.description &&
              props.errors.description
            }
            helperText={
              props.errors.description &&
              props.touched.description &&
              props.errors.description
            }
          />
          <FormControl error={error} component="fieldset">
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    name="isPurchase"
                    checked={props.values.isPurchase}
                    onChange={(e) => {
                      props.handleChange(e);
                    }}
                    sx={color}
                  />
                }
                label="ซื้อได้"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    name="isSales"
                    checked={props.values.isSales}
                    onChange={(e) => {
                      props.handleChange(e);
                    }}
                    sx={color}
                  />
                }
                label="ขายได้"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    disabled
                    name="isInventory"
                    checked={props.values.isInventory}
                    onChange={(e) => {
                      props.handleChange(e);
                    }}
                    sx={color}
                  />
                }
                label="สต๊อกได้"
              />
            </FormGroup>
            <FormHelperText>{error && "กรุณาเลือก"}</FormHelperText>
          </FormControl>
          <h3>การจัดกลุ่ม</h3>
          <div className="grid-container-50">
            <Autocomplete
              size="small"
              name="tagList"
              sx={{ alignSelf: "center" }}
              onChange={(event, newValue) => {
                if (newValue == null) return null;
                if (typeof newValue === "string") {
                  const Clone = props.values.tagList
                    ? [...props.values.tagList]
                    : [];
                  const check = Clone.find((val) => {
                    return `${val.tag_name}` === `${newValue}`;
                  });
                  if (check) return null;
                  Clone.push(newValue);
                  props.setFieldValue("tagList", Clone);
                } else if (newValue && newValue.inputValue) {
                  // Create a new value from the user input
                  const Clone = props.values.tagList
                    ? [...props.values.tagList]
                    : [];
                  const check = Clone.find((val) => {
                    return `${val.tag_name}` === `${newValue.inputValue}`;
                  });
                  if (check) return null;
                  Clone.push(newValue.inputValue);
                  props.setFieldValue("tagList", Clone);
                } else {
                  const Clone = props.values.tagList
                    ? [...props.values.tagList]
                    : [];
                  const check = Clone.find((val) => {
                    return `${val.tag_name}` === `${newValue.value}`;
                  });
                  if (check) return null;
                  Clone.push(newValue.name);
                  props.setFieldValue("tagList", Clone);
                }
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);
                const { inputValue } = params;
                // Suggest the creation of a new value
                const isExisting = options.some(
                  (option) => inputValue === option
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
              options={myTag}
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
                <TextField {...params} label="การจัดกลุ่ม" />
              )}
            />
            <div>
              {props.values.tagList &&
                props.values.tagList.map((val, index) => {
                  return (
                    <TagComponent
                      values={props.values.tagList}
                      setFieldValue={props.setFieldValue}
                      key={`${val} + ${index}`}
                      label={`${val}`}
                      ID={index}
                    />
                  );
                })}
            </div>
          </div>
        </div>
        <div>
          <div className="grid-container-50">
            <div>
              <h3 className="form-heading">รูปสินค้า 1</h3>
              <div
                className="img_display"
                style={{
                  backgroundImage: `url(${
                    props.values.imageURLList[0]
                      ? props.values.imageURLList[0]
                      : Placeholder
                  })`,
                }}
              ></div>
              <div class="fileUpload">
                <input
                  type="file"
                  id="file"
                  className="upload"
                  accept=".jpg, .jpeg, .png, .gif"
                  onChange={(e) =>
                    handleClickUploadFile(
                      e.target.files,
                      props.setFieldValue,
                      0
                    )
                  }
                />
                <span>อัพโหลด</span>
              </div>
              <div>
                {props.errors.imageURLList &&
                  props.touched.imageURLList &&
                  props.errors.imageURLList}
              </div>
            </div>
            <div>
              <h3 className="form-heading">รูปสินค้า 2</h3>
              <div
                className="img_display"
                style={{
                  backgroundImage: `url(${
                    props.values.imageURLList[1]
                      ? props.values.imageURLList[1]
                      : Placeholder
                  })`,
                }}
              >
                {/* <img src={Placeholder} /> */}
              </div>
              <div class="fileUpload">
                <input
                  type="file"
                  id="file"
                  className="upload"
                  accept=".jpg, .jpeg, .png, .gif"
                  onChange={(e) =>
                    handleClickUploadFile(
                      e.target.files,
                      props.setFieldValue,
                      1
                    )
                  }
                />
                <span>อัพโหลด</span>
              </div>
              <div>
                {props.errors.imageURLList &&
                  props.touched.imageURLList &&
                  props.errors.imageURLList}
              </div>
            </div>
          </div>
          <div className="grid-container-50">
            <div>
              <h3 className="form-heading">รูปสินค้า 3</h3>
              <div
                className="img_display"
                style={{
                  backgroundImage: `url(${
                    props.values.imageURLList[2]
                      ? props.values.imageURLList[2]
                      : Placeholder
                  })`,
                }}
              >
                {/* <img src={Placeholder} /> */}
              </div>
              <div class="fileUpload">
                <input
                  type="file"
                  id="file"
                  className="upload"
                  accept=".jpg, .jpeg, .png, .gif"
                  onChange={(e) =>
                    handleClickUploadFile(
                      e.target.files,
                      props.setFieldValue,
                      2
                    )
                  }
                />
                <span>อัพโหลด</span>
              </div>
              <div>
                {props.errors.imageURLList &&
                  props.touched.imageURLList &&
                  props.errors.imageURLList}
              </div>
            </div>
            <div>
              <h3 className="form-heading">รูปสินค้า 4</h3>
              <div
                className="img_display"
                style={{
                  backgroundImage: `url(${
                    props.values.imageURLList[3]
                      ? props.values.imageURLList[3]
                      : Placeholder
                  })`,
                }}
              >
                {/* <img src={Placeholder} /> */}
              </div>
              <div class="fileUpload">
                <input
                  type="file"
                  id="file"
                  className="upload"
                  accept=".jpg, .jpeg, .png, .gif"
                  onChange={(e) =>
                    handleClickUploadFile(
                      e.target.files,
                      props.setFieldValue,
                      3
                    )
                  }
                />
                <span>อัพโหลด</span>
              </div>
              <div>
                {props.errors.imageURLList &&
                  props.touched.imageURLList &&
                  props.errors.imageURLList}
              </div>
            </div>
          </div>
          <div>
            <h3>สถานะ</h3>
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="gender"
                name="isActive"
                onChange={(e) => {
                  if (e.target.value === "true")
                    return props.setFieldValue("isActive", true);
                  props.setFieldValue("isActive", false);
                }}
                value={props.values.isActive}
              >
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label="ใช้งาน"
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="หยุดใช้งาน"
                />
              </RadioGroup>
            </FormControl>
          </div>
          {props.values.isActive ? null : (
            <TextField
              onChange={(e) => {
                props.handleChange(e);
              }}
              onBlur={props.handleBlur}
              type="text"
              size="small"
              name="remark"
              id="outlined-error-helper-text"
              label="หมายเหตุสถานะ"
              value={props.values.remark || ""}
              error={
                props.errors.remark &&
                props.touched.remark &&
                props.errors.remark
              }
              helperText={
                props.errors.remark &&
                props.touched.remark &&
                props.errors.remark
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
