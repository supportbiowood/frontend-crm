import { Divider, TextField } from "@mui/material";
import { useState, useEffect } from "react";

const AccountSummaryComponent = ({
  isLoading,
  name,
  data,
  formik,
  summary,
  disabled,
  tableType,
  billingNoteData,
  billingNoteNetAmount,
  noDiscount,
  noShipping,
  summaryType,
  OnlyWithHoldingTax,
}) => {
  const [sumOfVat0Amount, setSumOfVat0Amount] = useState(0);
  const [sumOfVat7Amount, setSumOfVat7Amount] = useState(0);
  const [sumOfVatExemptedAmount, setSumOfVatExemptedAmount] = useState(0);
  const [sumOfWithholdingTax, setSumOfWithholdingTax] = useState(0);
  const [sumOfAmount, setSumOfAmount] = useState(0);
  const [sumOfAmountToPay, setSumOfAmountToPay] = useState(0);
  const [sumOfBillingAmount, setSumOfBillingAmount] = useState(0);

  // const withHoldingTaxOption = [
  //   { name: "ยังไม่ระบุ", value: "ยังไม่ระบุ" },
  //   { name: "ไม่มี", value: "ไม่มี" },
  //   { name: "0.75%", value: 0.0075 },
  //   { name: "1%", value: 0.01 },
  //   { name: "1.5%", value: 0.015 },
  //   { name: "2%", value: 0.02 },
  //   { name: "3%", value: 0.03 },
  //   { name: "5%", value: 0.05 },
  //   { name: "10%", value: 0.1 },
  //   { name: "15%", value: 0.15 },
  // ];

  //function cal sum of vat
  const sumOfVat = (vatAmount, setVatAmount) => {
    const sum = vatAmount.reduce((sum, itemVat) => {
      return sum + parseFloat(itemVat.pre_vat_amount);
    }, 0);
    setVatAmount(sum);
    setFormikValue();
  };

  const sumOfAmountPayment = (allData, setVatAmount) => {
    const sum = allData.reduce((sum, data) => {
      return sum + parseFloat(data.received_amount);
    }, 0);
    setVatAmount(sum);
    setFormikValuePayment();
  };

  //function cal sum of withhoing Tax
  const sumOfTax = (allItem, setWithholddingTaxAmount) => {
    const sum = allItem.reduce((sum, item) => {
      const ItemValue = item.item_withholding_tax.withholding_tax_amount;
      if (ItemValue !== null) return sum + parseFloat(ItemValue);
      return sum;
    }, 0);
    setWithholddingTaxAmount(sum);
  };

  //function get item vat from data
  const filterVatAmount = (summaryData, setSumOfVatAmount, Vat) => {
    const newVatAmount = [];
    summaryData.forEach((group) => {
      group.category_list.forEach((category) => {
        const filterData = category.item_data.filter(
          (item) => item.vat === Vat
        );
        filterData.forEach((filterItem) => {
          return newVatAmount.push(filterItem);
        });
      });
    });
    sumOfVat(newVatAmount, setSumOfVatAmount);
  };

  const filterVatAmountPurchase = (summaryData, setSumOfVatAmount, Vat) => {
    const newVatAmount = [];
    const filterData = summaryData.filter((item) => {
      return item.vat === Vat;
    });
    filterData.forEach((filterItem) => {
      return newVatAmount.push(filterItem);
    });
    sumOfVat(newVatAmount, setSumOfVatAmount);
  };

  //get all item to sum withhholding tax
  const getAllItem = (summaryData, setSumOfWithholdingTax) => {
    const allItem = [];
    summaryData.forEach((group) => {
      group.category_list.forEach((category) => {
        category.item_data.forEach((filterItem) => {
          return allItem.push(filterItem);
        });
      });
    });
    sumOfTax(allItem, setSumOfWithholdingTax);
  };

  const getAllItemPurchase = (summaryData, setSumOfWithholdingTax) => {
    const allItem = [];
    summaryData.forEach((Item) => {
      return allItem.push(Item);
    });
    sumOfTax(allItem, setSumOfWithholdingTax);
  };

  const checkNull = (value) => {
    if (isNaN(value) || value === "" || value === null) return 0;
    return value;
  };

  useEffect(() => {
    if (!summary) {
      sumOfAmountPayment(data, setSumOfAmount);
    } else {
      if (summaryType === "payment") {
        sumOfAmountPayment(data, setSumOfAmount);
        sumOfAmountPayment(data, setSumOfAmountToPay);
        sumOfAmountPayment(data, setSumOfBillingAmount);
      } else {
        if (tableType === "sale") {
          filterVatAmount(data, setSumOfVat0Amount, "ZERO");
          filterVatAmount(data, setSumOfVat7Amount, "SEVEN");
          filterVatAmount(data, setSumOfVatExemptedAmount, "NONE");
          getAllItem(data, setSumOfWithholdingTax);
        } else if (tableType === "purchase") {
          filterVatAmountPurchase(data, setSumOfVat0Amount, "ZERO");
          filterVatAmountPurchase(data, setSumOfVat7Amount, "SEVEN");
          filterVatAmountPurchase(data, setSumOfVatExemptedAmount, "NONE");
          getAllItemPurchase(data, setSumOfWithholdingTax);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data,
    formik.values.shipping_cost,
    formik.values.additional_discount,
    sumOfAmount,
    sumOfVat0Amount,
    sumOfVat7Amount,
    sumOfVatExemptedAmount,
    sumOfWithholdingTax,
    isLoading,
  ]);

  const renderData = (data, field) => {
    const sum = data.reduce((sum, billingNote) => {
      if (field === "net_amount") return sum + parseFloat(billingNote);
      if (field === "paid_amount")
        return sum - parseFloat(billingNote.paid_amount);
      return sum + parseFloat(billingNote.billing_amount);
    }, 0);
    return sum || 0;
  };

  function setFormikValue() {
    formik.setFieldValue(`vat_0_amount`, sumOfVat0Amount.toFixed(2));
    formik.setFieldValue(`vat_7_amount`, sumOfVat7Amount.toFixed(2));
    formik.setFieldValue(
      `vat_exempted_amount`,
      sumOfVatExemptedAmount.toFixed(2)
    );
    formik.setFieldValue(`vat_amount`, (sumOfVat7Amount * 0.07).toFixed(2));
    if (noShipping) {
      if (noDiscount) {
        if (billingNoteData) {
          formik.setFieldValue(
            `net_amount`,
            renderData(billingNoteNetAmount, "net_amount")
          );
          formik.setFieldValue(
            `paid_amount`,
            renderData(billingNoteData, "paid_amount")
          );
          formik.setFieldValue(
            `total_amount`,
            renderData(billingNoteNetAmount, "net_amount") +
              renderData(billingNoteData, "paid_amount") +
              sumOfWithholdingTax
          );
        } else {
          formik.setFieldValue(
            `net_amount`,
            (
              sumOfVatExemptedAmount +
              sumOfVat0Amount +
              sumOfVat7Amount +
              parseFloat(sumOfVat7Amount * 0.07)
            ).toFixed(2)
          );
          formik.setFieldValue(
            `total_amount`,
            (
              sumOfVatExemptedAmount +
              sumOfVat0Amount +
              sumOfVat7Amount +
              parseFloat(sumOfVat7Amount * 0.07) +
              sumOfWithholdingTax
            ).toFixed(2)
          );
        }
      } else {
        if (billingNoteData) {
          formik.setFieldValue(
            `net_amount`,
            renderData(billingNoteNetAmount, "net_amount")
          );
          formik.setFieldValue(
            `paid_amount`,
            renderData(billingNoteData, "paid_amount")
          );
          formik.setFieldValue(
            `total_amount`,
            renderData(billingNoteNetAmount, "net_amount") +
              renderData(billingNoteData, "paid_amount") +
              sumOfWithholdingTax
          );
        } else {
          formik.setFieldValue(
            `net_amount`,
            (
              sumOfVatExemptedAmount +
              sumOfVat0Amount +
              sumOfVat7Amount +
              parseFloat(sumOfVat7Amount * 0.07) -
              checkNull(formik.values.additional_discount)
            ).toFixed(2)
          );
          formik.setFieldValue(
            `total_amount`,
            (
              sumOfVatExemptedAmount +
              sumOfVat0Amount +
              sumOfVat7Amount +
              parseFloat(sumOfVat7Amount * 0.07) +
              sumOfWithholdingTax -
              checkNull(formik.values.additional_discount)
            ).toFixed(2)
          );
        }
      }
    } else {
      if (noDiscount) {
        formik.setFieldValue(
          `net_amount`,
          (
            checkNull(formik.values.shipping_cost) +
            sumOfVatExemptedAmount +
            sumOfVat0Amount +
            sumOfVat7Amount +
            parseFloat(sumOfVat7Amount * 0.07)
          ).toFixed(2)
        );
        formik.setFieldValue(
          `total_amount`,
          (
            checkNull(formik.values.shipping_cost) +
            sumOfVatExemptedAmount +
            sumOfVat0Amount +
            sumOfVat7Amount +
            parseFloat(sumOfVat7Amount * 0.07) +
            sumOfWithholdingTax
          ).toFixed(2)
        );
      } else {
        formik.setFieldValue(
          `net_amount`,
          (
            checkNull(formik.values.shipping_cost) +
            sumOfVatExemptedAmount +
            sumOfVat0Amount +
            sumOfVat7Amount +
            parseFloat(sumOfVat7Amount * 0.07) -
            checkNull(formik.values.additional_discount)
          ).toFixed(2)
        );
        formik.setFieldValue(
          `total_amount`,
          (
            checkNull(formik.values.shipping_cost) +
            sumOfVatExemptedAmount +
            sumOfVat0Amount +
            sumOfVat7Amount +
            parseFloat(sumOfVat7Amount * 0.07) +
            sumOfWithholdingTax -
            checkNull(formik.values.additional_discount)
          ).toFixed(2)
        );
      }
    }
    formik.setFieldValue(`withholding_tax`, sumOfWithholdingTax.toFixed(2));
    return null;
  }

  function setFormikValuePayment() {
    if (!summary) {
      formik.setFieldValue(`total_amount`, sumOfAmount.toFixed(2));
    } else {
      formik.setFieldValue(`total_amount`, sumOfAmount.toFixed(2));
      formik.setFieldValue(
        `${name}.amount_to_pay`,
        sumOfAmountToPay.toFixed(2)
      );
      formik.setFieldValue(
        `${name}.billing_amount`,
        sumOfBillingAmount.toFixed(2)
      );
      formik.setFieldValue(
        `net_amount`,
        (
          sumOfVatExemptedAmount +
          sumOfVat0Amount +
          sumOfVat7Amount +
          parseFloat(sumOfVat7Amount * 0.07)
        ).toFixed(2)
      );
      formik.setFieldValue(`total_amount`, sumOfAmount.toFixed(2));
      formik.setFieldValue(`vat_0_amount`, sumOfVat0Amount.toFixed(2));
      formik.setFieldValue(`vat_7_amount`, sumOfVat7Amount.toFixed(2));
      formik.setFieldValue(
        `vat_exempted_amount`,
        sumOfVatExemptedAmount.toFixed(2)
      );
      formik.setFieldValue(`vat_amount`, (sumOfVat7Amount * 0.07).toFixed(2));
      formik.setFieldValue(`withholding_tax`, sumOfWithholdingTax.toFixed(2));
    }
    return null;
  }

  function toLocale(number) {
    return parseFloat(number).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  const summaryItemPrimary = [
    {
      title: "ค่าส่ง / Shipping cost",
      detail: (
        <TextField
          disabled={disabled}
          name={`shipping_cost`}
          value={formik.values.shipping_cost}
          InputLabelProps={{ shrink: false }}
          InputProps={{
            inputProps: {
              style: { textAlign: "right" },
              min: 0,
            },
          }}
          onChange={(e) => {
            formik.handleChange(e);
          }}
          size="small"
          fullWidth
          type="number"
        />
      ),
      unit: "บาท",
    },
    {
      title: "ส่วนลดเพิ่มเติม / Additional Discount",
      detail: (
        <TextField
          disabled={disabled}
          name={`additional_discount`}
          value={formik.values.additional_discount}
          InputLabelProps={{ shrink: false }}
          InputProps={{
            inputProps: {
              style: { textAlign: "right" },
              min: 0,
            },
          }}
          onChange={(e) => {
            formik.handleChange(e);
          }}
          size="small"
          fullWidth
          type="number"
        />
      ),
      unit: "บาท",
    },
  ];

  const summaryItemSecondary = [
    {
      title: "มูลค่ารายการยกเว้นภาษี / VAT Exempted Amount",
      detail: toLocale(formik.values.vat_exempted_amount) || 0.0,
      unit: "บาท",
    },
    {
      title: "มูลค่ารายการภาษี 0% / VAT 0% Amount",
      detail: toLocale(formik.values.vat_0_amount) || 0.0,
      unit: "บาท",
    },
    {
      title: "มูลค่ารายการภาษี 7% / VAT 7% Amount",
      detail: toLocale(formik.values.vat_7_amount) || 0.0,
      unit: "บาท",
    },
    {
      title: "ภาษีมูลค่าเพิ่มรวม / VAT Amount",
      detail: toLocale(formik.values.vat_amount) || 0.0,
      unit: "บาท",
    },
  ];

  const summaryItemTertiary = [
    {
      title: "ยอดรวมสุทธิ / Net Amount",
      detail: toLocale(formik.values.net_amount) || 0.0,
      unit: "บาท",
    },
    {
      title: "มูลค่าที่ชำระแล้ว / Paid Amount",
      detail: toLocale(formik.values.paid_amount) || 0.0,
      unit: "บาท",
    },
    {
      title: "ภาษี ณ ที่จ่าย / Withholding Tax",
      detail: OnlyWithHoldingTax
        ? toLocale(formik.values.withholding_tax?.withholding_tax_amount || 0)
        : toLocale(formik.values.withholding_tax || 0),
      unit: "บาท",
    },
  ];

  return (
    <div className="account__summaryMainContainer">
      <div className="account__summaryContainer">
        {summary && (
          <>
            <div className="account__summaryContainer-summaryPrimary">
              {summaryItemPrimary.map((item, index) =>
                !noShipping ? (
                  <div className="account__summaryItem" key={item.title}>
                    <p>{item.title}</p>
                    <p>{item.detail}</p>
                    <p>{item.unit}</p>
                  </div>
                ) : (
                  index !== 0 &&
                  !noDiscount && (
                    <div className="account__summaryItem" key={item.title}>
                      <p>{item.title}</p>
                      <p>{item.detail}</p>
                      <p>{item.unit}</p>
                    </div>
                  )
                )
              )}
            </div>
            <div className="account__summaryContainer-summarySecondary">
              {summaryItemSecondary.map((item) => (
                <div className="account__summaryItem" key={item.title}>
                  <p>{item.title}</p>
                  <p>{item.detail}</p>
                  <p>{item.unit}</p>
                </div>
              ))}
            </div>
            <div className="account__summaryContainer-summaryTertiary">
              {summaryItemTertiary.map((item, i) =>
                !billingNoteData ? (
                  i !== 1 && (
                    <div className="account__summaryItem" key={item.title}>
                      <p>{item.title}</p>
                      <p>{item.detail}</p>
                      <p>{item.unit}</p>
                    </div>
                  )
                ) : (
                  <div className="account__summaryItem" key={item.title}>
                    <p>{item.title}</p>
                    <p>{item.detail}</p>
                    <p>{item.unit}</p>
                  </div>
                )
              )}
            </div>
            <Divider />
          </>
        )}
        {OnlyWithHoldingTax &&
          summaryItemTertiary.map(
            (item, i) =>
              i === 2 && (
                <div>
                  <div className="account__summaryItem" key={item.title}>
                    <p>{item.title}</p>
                    <p>{item.detail}</p>
                    <p>{item.unit}</p>
                  </div>
                  <Divider />
                </div>
              )
          )}
        <div className="account__summaryItem">
          <p>จำนวนเงินรวมทั้งสิ้น (บาท) / Total Amount</p>
          <p>{toLocale(parseFloat(formik.values.total_amount) || 0)}</p>
          <p>บาท</p>
        </div>
        <div>
          <Divider />
          <Divider />
        </div>
      </div>
    </div>
  );
};

export default AccountSummaryComponent;
