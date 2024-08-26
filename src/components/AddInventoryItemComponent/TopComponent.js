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
import TagComponent from "../../components/TagComponent";
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

export default function TopComponent({
  values,
  setFieldValue,
  touched,
  errors,
  handleChange,
  handleBlur,
}) {
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
    if (values.itemType === "PRODUCT") {
      setFieldValue("itemPropertyList", [
        {
          description: "Red",
          id: "7f7e29d5-4b39-44cd-aa21-bc42fb953b75",
          internalID: "CL",
          name: "สี",
          type: "STRING",
          value: null,
        },
        {
          description: "Matte",
          id: "e679093f-8cd5-4254-b915-db94576bfb27",
          internalID: "MT",
          name: "ผิว",
          type: "STRING",
          value: null,
        },
      ]);
    }
    if (values.itemType === "SERVICE") {
      setFieldValue("isInventory", false);
    } else {
      setFieldValue("isInventory", true);
    }
  }, [setFieldValue, values.itemType]);

  const error =
    [values.isInventory, values.isSales, values.isPurchase].filter((v) => v)
      .length < 1;

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
          <FormControl>
            <RadioGroup
              row
              aria-labelledby="demo-radio-buttons-group-label"
              name="itemType"
              onChange={(e) => {
                handleChange(e);
              }}
              value={values.itemType}
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
              onChange={(e) => {
                handleChange(e);
              }}
              onBlur={handleBlur}
              type="text"
              size="small"
              name="name"
              id="outlined-error-helper-text"
              label="ชื่อสินค้า"
              value={values.name || ""}
              error={errors.name && touched.name && errors.name}
              helperText={errors.name && touched.name && errors.name}
            />
            <div></div>
            <TextField
              onChange={(e) => {
                handleChange(e);
              }}
              onBlur={handleBlur}
              type="text"
              size="small"
              name="internalID"
              id="outlined-error-helper-text"
              label="ชื่อสินค้าภายใน"
              value={values.internalID || ""}
              error={
                errors.internalID && touched.internalID && errors.internalID
              }
              helperText={
                errors.internalID && touched.internalID && errors.internalID
              }
            />
          </div>
          <TextField
            onChange={(e) => {
              handleChange(e);
            }}
            onBlur={handleBlur}
            type="description"
            fullWidth
            size="small"
            name="description"
            id="outlined-error-helper-text"
            label="รายละเอียด"
            value={values.description}
            error={
              errors.description && touched.description && errors.description
            }
            helperText={
              errors.description && touched.description && errors.description
            }
          />
          <FormControl error={error} component="fieldset">
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    name="isPurchase"
                    checked={values.isPurchase}
                    onChange={(e) => {
                      handleChange(e);
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
                    checked={values.isSales}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    sx={color}
                  />
                }
                label="ขายได้"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    disabled={values.itemType === "SERVICE"}
                    name="isInventory"
                    checked={values.isInventory}
                    onChange={(e) => {
                      handleChange(e);
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
                  const Clone = values.tagList ? [...values.tagList] : [];
                  const check = Clone.find((val) => {
                    return `${val.tag_name}` === `${newValue}`;
                  });
                  if (check) return null;
                  Clone.push(newValue);
                  setFieldValue("tagList", Clone);
                } else if (newValue && newValue.inputValue) {
                  // Create a new value from the user input
                  const Clone = values.tagList ? [...values.tagList] : [];
                  const check = Clone.find((val) => {
                    return `${val.tag_name}` === `${newValue.inputValue}`;
                  });
                  if (check) return null;
                  Clone.push(newValue.inputValue);
                  setFieldValue("tagList", Clone);
                } else {
                  const Clone = values.tagList ? [...values.tagList] : [];
                  const check = Clone.find((val) => {
                    return `${val.tag_name}` === `${newValue.value}`;
                  });
                  if (check) return null;
                  Clone.push(newValue.name);
                  setFieldValue("tagList", Clone);
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
              {values.tagList &&
                values.tagList.map((val, index) => {
                  return (
                    <TagComponent
                      values={values.tagList}
                      setFieldValue={setFieldValue}
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
                    values.imageURLList[0]
                      ? values.imageURLList[0]
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
                    handleClickUploadFile(e.target.files, setFieldValue, 0)
                  }
                />
                <span>อัพโหลด</span>
              </div>
              <div>
                {errors.imageURLList &&
                  touched.imageURLList &&
                  errors.imageURLList}
              </div>
            </div>
            <div>
              <h3 className="form-heading">รูปสินค้า 2</h3>
              <div
                className="img_display"
                style={{
                  backgroundImage: `url(${
                    values.imageURLList[1]
                      ? values.imageURLList[1]
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
                    handleClickUploadFile(e.target.files, setFieldValue, 1)
                  }
                />
                <span>อัพโหลด</span>
              </div>
              <div>
                {errors.imageURLList &&
                  touched.imageURLList &&
                  errors.imageURLList}
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
                    values.imageURLList[2]
                      ? values.imageURLList[2]
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
                    handleClickUploadFile(e.target.files, setFieldValue, 2)
                  }
                />
                <span>อัพโหลด</span>
              </div>
              <div>
                {errors.imageURLList &&
                  touched.imageURLList &&
                  errors.imageURLList}
              </div>
            </div>
            <div>
              <h3 className="form-heading">รูปสินค้า 4</h3>
              <div
                className="img_display"
                style={{
                  backgroundImage: `url(${
                    values.imageURLList[3]
                      ? values.imageURLList[3]
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
                    handleClickUploadFile(e.target.files, setFieldValue, 3)
                  }
                />
                <span>อัพโหลด</span>
              </div>
              <div>
                {errors.imageURLList &&
                  touched.imageURLList &&
                  errors.imageURLList}
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
                    return setFieldValue("isActive", true);
                  setFieldValue("isActive", false);
                }}
                defaultValue={true}
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
          {values.isActive ? null : (
            <TextField
              onChange={(e) => {
                handleChange(e);
              }}
              onBlur={handleBlur}
              type="text"
              size="small"
              name="remark"
              id="outlined-error-helper-text"
              label="หมายเหตุสถานะ"
              value={values.remark || ""}
              error={errors.remark && touched.remark && errors.remark}
              helperText={errors.remark && touched.remark && errors.remark}
            />
          )}
        </div>
      </div>
    </div>
  );
}
