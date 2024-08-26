import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import ButtonComponent from "../ButtonComponent";
import BreadcrumbComponent from "../BreadcrumbComponent";
import { Breadcrumbs } from "@mui/material";
import "moment-timezone";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/actions/snackbarActions";

import { Stack } from "@mui/material";
import TopComponent from "./TopComponent";
import MiddleComponent from "./MiddleComponent";
import BottomComponent from "./BottomComponent";

import {
  getItemMasterById,
  updateMasterDataItem,
} from "../../adapter/Api/graphql";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function InventoryItemComponent(props) {
  const { id } = useParams();
  const [myValue, setMyValue] = useState({
    id: "",
    name: "",
    internalID: "",
    itemType: "",
    tagList: [],
    description: "",
    imageURLList: [],
    isActive: true,
    remark: "",
    isPurchase: false,
    isSales: false,
    isInventory: false,
    itemCategory: "",
    itemCategory2: "",
    itemCategory3: "",
    itemCategory4: "",
    listSaleUOM: {
      uomID: "PC",
      width: "",
      height: "",
      weight: "",
      length: "",
      widthUOM: "",
      heightUOM: "",
      weightUOM: "",
      lengthUOM: "",
    },
    uomGroupID: "",
    inventoryUOMID: "",
    purchaseUOMID: "",
    saleUOMID: "",
    saleUnitPrice: null,
    saleMaximumDiscount: null,
    taxType: "NONE",
    purchaseUnitPrice: "",
    preferredVendorID: "",
    purchaseMinOrderQty: "",
    itemValuation: "MOVING_AVG",
    defaultWarehouseID: "W01",
    inventoryMinQty: 0,
    itemPropertyList: [],
    listItemCurrent: [],
    listTransaction: [],
  });
  const [displayBottom, setDisplayBottom] = useState(true);

  useEffect(() => {
    const ById = {
      getItemUuidId: `${id}`,
      uomId: "Wood-PC",
    };
    getItemMasterById(ById)
      .then((data) => {
        const myData = data.data.data.getItemUUID;
        setDisplayBottom(myData.isInventory);
        console.log(myData);
        setMyValue((prev) => ({
          ...prev,
          id: myData.id,
          name: myData.name,
          internalID: myData.internalID,
          itemType: myData.itemType,
          tagList: myData.tagList,
          description: myData.description,
          imageURLList: myData.imageURLList,
          isActive: myData.isActive,
          remark: myData.remark,
          isPurchase: myData.isPurchase,
          isSales: myData.isSales,
          isInventory: myData.isInventory,
          itemCategory: myData.getItemCategory
            ? myData.getItemCategory.parentList[0].id
            : "",
          itemCategory2: myData.getItemCategory
            ? myData.getItemCategory.parentList.length === 1
              ? myData.getItemCategory.id
              : myData.getItemCategory.parentList[1].id
            : "",
          itemCategory3: myData.getItemCategory
            ? myData.getItemCategory.parentList.length === 2
              ? myData.getItemCategory.id
              : myData.getItemCategory.parentList.length > 2
              ? myData.getItemCategory.parentList[2].id
              : ""
            : "",
          itemCategory4: myData.getItemCategory
            ? myData.getItemCategory.parentList.length === 3
              ? myData.getItemCategory.id
              : ""
            : "",
          listSaleUOM: myData.getSaleBaseUOMDimensions || {
            uomID: "PC",
            width: null,
            height: null,
            weight: null,
            length: null,
            widthUOM: "cm",
            heightUOM: "cm",
            weightUOM: "kg",
            lengthUOM: "cm",
          },
          uomGroupID: myData.getUOMGroup !== null ? myData.getUOMGroup.id : "",
          inventoryUOMID:
            myData.getInventoryUOM !== null ? myData.getInventoryUOM.id : "",
          purchaseUOMID:
            myData.getPurchaseUOM !== null ? myData.getPurchaseUOM.id : "",
          saleUOMID: myData.getSaleUOM !== null ? myData.getSaleUOM.id : "",
          saleUnitPrice: myData.saleUnitPrice,
          saleMaximumDiscount: myData.saleMaximumDiscount,
          taxType: myData.taxType,
          purchaseUnitPrice: myData.purchaseUnitPrice,
          preferredVendorID: myData.preferredVendorID,
          purchaseMinOrderQty: myData.purchaseMinOrderQty,
          itemValuation: myData.itemValuation,
          defaultWarehouseID: myData.defaultWarehouseID,
          inventoryMinQty: myData.inventoryMinQty,
          itemPropertyList: myData.itemPropertyList,
          listItemCurrentOnUOM:
            myData.listItemCurrentOnUOM && myData.listItemCurrentOnUOM.items,
          listItemCurrent:
            myData.listItemCurrent && myData.listItemCurrent.items,
          listTransaction: myData.listTransaction.items,
        }));
        setIsLoading(false);
      })
      .catch((err) => {
        dispatch(showSnackbar("error", `${err}` || "เกิดเหตุผิดพลาด"));
        setIsLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          is: (value) => value !== undefined,
          then: Yup.string().required("กรุณากรอก"),
        }),
      })
    ),
  });

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

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
          const prepare_update_data = {
            id: values.id,
            internalID: values.internalID,
            isInventory: values.isInventory,
            isSales: values.isSales,
            isPurchase: values.isPurchase,
            name: values.name,
            remark: values.remark,
            description: values.description,
            itemType: values.itemType,
            imageURLList: values.imageURLList,
            tagList: values.tagList,
            itemCategoryID: itemCategory,
            isActive: values.isActive,
            uomGroupID: values.uomGroupID,
            inventoryUOMID: values.inventoryUOMID,
            purchaseUOMID: values.purchaseUOMID,
            saleUOMID: values.saleUOMID,
            saleUnitPrice: values.saleUnitPrice,
            taxType: values.taxType,
            inventoryMinQty: parseInt(values.inventoryMinQty),
            saleMaximumDiscount: parseInt(values.saleMaximumDiscount),
            purchaseUnitPrice: values.purchaseUnitPrice,
            preferredVendorID: values.preferredVendorID,
            purchaseMinOrderQty: values.purchaseMinOrderQty,
            itemValuation: values.itemValuation,
            defaultWarehouseID: values.defaultWarehouseID,
            listSaleUOMCustom: values.listSaleUOM,
            itemPropertyList: values.itemPropertyList,
          };
          const myValue = {
            input: prepare_update_data,
          };
          updateMasterDataItem(myValue)
            .then((data) => {
              if (data.data.data === null) {
                setSubmitting(false);
                setIsLoading(false);
                dispatch(showSnackbar("error", "เกิดเหตุผิดพลาด"));
              } else {
                dispatch(showSnackbar("success", "บันทึกสำเร็จ"));
                setSubmitting(false);
                setIsLoading(false);
                window.location.reload();
              }
            })
            .catch((err) => {
              dispatch(showSnackbar("error", `${err}` || "เกิดเหตุผิดพลาด"));
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
                <Breadcrumbs separator="›" aria-label="breadcrumb">
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
                  <BreadcrumbComponent name={values.id} key="3" to="#" />
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
              {displayBottom && (
                <BottomComponent
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                />
              )}
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
