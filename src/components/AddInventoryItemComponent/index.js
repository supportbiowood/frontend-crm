import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import ButtonComponent from "../ButtonComponent";
import BreadcrumbComponent from "../BreadcrumbComponent";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import "moment-timezone";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/actions/snackbarActions";
import { createItemMaster } from "../../adapter/Api/graphql";

import { Stack } from "@mui/material";
import TopComponent from "./TopComponent";
import MiddleComponent from "./MiddleComponent";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function AddItemInventoryComponent(props) {
  const [myValue] = useState({
    id: "",
    name: "",
    internalID: "",
    itemType: "PRODUCT",
    tagList: [],
    description: "",
    imageURLList: [""],
    isActive: true,
    remark: "",
    isPurchase: true,
    isSales: true,
    isInventory: true,
    itemCategory: "",
    itemCategory2: "",
    itemCategory3: "",
    itemCategory4: "",
    listSaleUOM: {
      uomID: "PC",
      width: undefined,
      height: undefined,
      weight: undefined,
      length: undefined,
      widthUOM: "cm",
      heightUOM: "cm",
      weightUOM: "kg",
      lengthUOM: "cm",
    },
    uomGroupID: "",
    inventoryUOMID: "",
    purchaseUOMID: "",
    saleUOMID: "",
    saleUnitPrice: undefined,
    saleMaximumDiscount: undefined,
    taxType: "NONE",
    preferredVendorID: "",
    purchaseUnitPrice: undefined,
    purchaseMinOrderQty: undefined,
    itemValuation: "MOVING_AVG",
    defaultWarehouseID: "W01",
    inventoryMinQty: 0,
    itemPropertyList: [],
  });

  const itemMasterSchema = Yup.object().shape({
    name: Yup.string().required("กรุณากรอก"),
    remark: Yup.string().when("isActive", {
      is: (value) => value === false,
      then: Yup.string().required("กรุณากรอก"),
    }),
    listSaleUOM: Yup.object().shape({
      width: Yup.number()
        .typeError("กรุณากรอกเป็นตัวเลข")
        .required("กรุณากรอก"),
      height: Yup.number()
        .typeError("กรุณากรอกเป็นตัวเลข")
        .required("กรุณากรอก"),
      weight: Yup.number()
        .typeError("กรุณากรอกเป็นตัวเลข")
        .required("กรุณากรอก"),
      length: Yup.number()
        .typeError("กรุณากรอกเป็นตัวเลข")
        .required("กรุณากรอก"),
    }),
    itemCategory: Yup.string().required("กรุณาเลือกข้อมูล"),
    uomGroupID: Yup.string().required("กรุณาเลือกข้อมูล"),
    purchaseUOMID: Yup.string().required("กรุณาเลือกข้อมูล"),
    saleUOMID: Yup.string().required("กรุณาเลือกข้อมูล"),
    saleUnitPrice: Yup.number()
      .typeError("กรุณากรอกเป็นตัวเลข")
      .required("กรุณากรอก"),
    purchaseUnitPrice: Yup.number()
      .typeError("กรุณากรอกเป็นตัวเลข")
      .required("กรุณากรอก"),
    itemPropertyList: Yup.array().of(
      Yup.object().shape({
        id: Yup.string().required("กรุณาเลือกข้อมูล"),
        value: Yup.string().when("id", {
          is: (value) => value !== undefined || value !== null,
          then: Yup.string().required("กรุณากรอก"),
        }),
      })
    ),
  });

  // useEffect(() => {
  //   setMyValue()
  // }, [])

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  function categoryPayload(category, category1, category2, category3) {
    if (category1 === "") return category;
    if (category2 === "") return `${category}|${category1}`;
    if (category3 === "") return `${category}|${category1}|${category2}`;
    return `${category}|${category1}|${category2}|${category3}`;
  }

  return (
    <div>
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      <Formik
        enableReinitialize
        initialValues={myValue}
        validationSchema={itemMasterSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          const itemCategory = categoryPayload(
            values.itemCategory,
            values.itemCategory2,
            values.itemCategory3,
            values.itemCategory4
          );
          const prepare_post_data = {
            internalID: values.internalID,
            isInventory: values.isInventory,
            isSales: values.isSales,
            isPurchase: values.isPurchase,
            name: values.name,
            description: values.description,
            itemType: values.itemType,
            imageURLList: values.imageURLList,
            tagList: values.tagList,
            itemCategoryID: itemCategory,
            remark: values.remark,
            isActive: values.isActive,
            listSaleUOMCustom: values.listSaleUOM,
            uomGroupID: values.uomGroupID,
            inventoryUOMID: values.inventoryUOMID,
            purchaseUOMID: values.purchaseUOMID,
            saleUOMID: values.saleUOMID,
            saleUnitPrice: values.saleUnitPrice,
            saleMaximumDiscount: values.saleMaximumDiscount,
            purchaseUnitPrice: values.purchaseUnitPrice,
            preferredVendorID: values.preferredVendorID,
            purchaseMinOrderQty: values.purchaseMinOrderQty,
            itemValuation: values.itemValuation,
            defaultWarehouseID: values.defaultWarehouseID,
            inventoryMinQty: parseInt(values.inventoryMinQty),
            itemPropertyList: values.itemPropertyList,
          };
          setIsLoading(true);
          if (!values.isSales && !values.Purchase && !values.isInventory)
            return (
              setIsLoading(false) &
              dispatch(showSnackbar("error", "เกิดเหตุผิดพลาด"))
            );
          createItemMaster({ input: prepare_post_data })
            .then((data) => {
              if (data.data.data === null) {
                dispatch(showSnackbar("error", "เกิดเหตุผิดพลาด"));
                setSubmitting(false);
                setIsLoading(false);
              } else {
                const id = data.data.data.createItem.id;
                dispatch(showSnackbar("success", "บันทึกสำเร็จ"));
                setSubmitting(false);
                setIsLoading(false);
                window.location.href = "/inventory/item-master/" + id;
              }
            })
            .catch((err) => {
              dispatch(
                showSnackbar("error", `${err.message}` || "เกิดเหตุผิดพลาด")
              );
              setSubmitting(false);
              setIsLoading(false);
            });
          return;
        }}
      >
        {({
          values,
          errors,
          touched,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          setErrors,
          setFieldValue,
          setSubmitting,
        }) => (
          <Form
            method="POST"
            onSubmit={handleSubmit}
            className={"inputGroup"}
            autoComplete="off"
          >
            <div>
              <Stack spacing={2}>
                <Breadcrumbs separator=">" aria-label="breadcrumb">
                  <BreadcrumbComponent
                    name="คลังสินค้า"
                    key="1"
                    to="/inventory/"
                  />
                  <BreadcrumbComponent
                    name="สินค้า"
                    key="2"
                    to="/inventory/item-master"
                  />
                  <BreadcrumbComponent name="เพิ่มสินค้า" key="3" to="#" />
                </Breadcrumbs>
              </Stack>
              <div className="inventory-container">
                <TopComponent
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                />
                <MiddleComponent
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                />
              </div>
              <div className="sale-add-contact__btn-wrapper">
                <ButtonComponent
                  type="submit"
                  text="บันทึก"
                  variant="contained"
                  color="success"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
