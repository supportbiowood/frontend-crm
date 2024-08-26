import { Divider } from "@mui/material";
import { useState, useEffect } from "react";

const AccountSummaryComponent = ({ data, formik, summary }) => {
  const [sumOfVat0Debits, setSumOfVat0Debits] = useState(0);
  const [sumOfVat7Debits, setSumOfVat7Debits] = useState(0);
  const [sumOfVatExemptedDebits, setSumOfVatExemptedDebits] = useState(0);
  const [sumOfVat0Credits, setSumOfVat0Credits] = useState(0);
  const [sumOfVat7Credits, setSumOfVat7Credits] = useState(0);
  const [sumOfVatExemptedCredits, setSumOfVatExemptedCredits] = useState(0);
  const [sumOfCredits, setSumOfCredits] = useState(0);
  const [sumOfDebits, setSumOfDebits] = useState(0);
  // const [debits0Amount, setDebits0Amount] = useState(0);
  // const [debits7Amount, setDebits7Amount] = useState(0);
  // const [debitsExemptedAmount, setDebitsExemptedAmount] = useState(0);
  // const [credits0Amount, setCredits0Amount] = useState(0);
  // const [credits7Amount, setCredits7Amount] = useState(0);
  // const [creditsExemptedAmount, setCreditsExemptedAmount] = useState(0);

  const sumOfAmountDebits = (allData, setVatAmount) => {
    const sum = allData.reduce((sum, data) => {
      return sum + parseFloat(data.account_transaction_debits);
    }, 0);
    setVatAmount(sum);
  };

  const sumOfAmountCredits = (allData, setVatAmount) => {
    const sum = allData.reduce((sum, data) => {
      return sum + parseFloat(data.account_transaction_credits);
    }, 0);
    setVatAmount(sum);
  };

  //function get item vat from data
  const filterVatAmountCredits = (summaryData, setSumOfVatAmount, Vat) => {
    const newVatAmount = [];
    const filterData = summaryData.filter((item) => {
      return item.vat === Vat;
    });
    filterData.forEach((filterItem) => {
      return newVatAmount.push(filterItem);
    });
    sumOfAmountCredits(newVatAmount, setSumOfVatAmount);
  };

  //function get item vat from data
  const filterVatAmountDebits = (summaryData, setSumOfVatAmount, Vat) => {
    const newVatAmount = [];
    const filterData = summaryData.filter((item) => {
      return item.vat === Vat;
    });
    filterData.forEach((filterItem) => {
      return newVatAmount.push(filterItem);
    });
    sumOfAmountDebits(newVatAmount, setSumOfVatAmount);
  };

  // const checkNull = (value) => {
  //   if (isNaN(value) || value === "" || value === null) return 0;
  //   return value;
  // };

  useEffect(() => {
    sumOfAmountDebits(data, setSumOfDebits);
    sumOfAmountCredits(data, setSumOfCredits);
    filterVatAmountCredits(data, setSumOfVat0Credits, "ZERO");
    filterVatAmountCredits(data, setSumOfVat7Credits, "SEVEN");
    filterVatAmountCredits(data, setSumOfVatExemptedCredits, "NONE");
    filterVatAmountDebits(data, setSumOfVat0Debits, "ZERO");
    filterVatAmountDebits(data, setSumOfVat7Debits, "SEVEN");
    filterVatAmountDebits(data, setSumOfVatExemptedDebits, "NONE");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  function toLocale(number) {
    return parseFloat(number).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  const summaryItemPrimary = [
    {
      title: "รวม",
      detailDebits: toLocale(sumOfDebits),
      detailCredits: toLocale(sumOfCredits),
    },
  ];

  const summaryItemSecondary = [
    {
      title: "มูลค่ารายการยกเว้นภาษี / VAT Exempted Amount",
      detailDebits: toLocale(sumOfVatExemptedDebits) || 0.0,
      detailCredits: toLocale(sumOfVatExemptedCredits) || 0.0,
    },
    {
      title: "มูลค่ารายการภาษี 0% / VAT 0% Amount",
      detailDebits: toLocale(sumOfVat0Debits) || 0.0,
      detailCredits: toLocale(sumOfVat0Credits) || 0.0,
    },
    {
      title: "มูลค่ารายการภาษี 7% / VAT 7% Amount",
      detailDebits: toLocale(sumOfVat7Debits * 0.07) || 0.0,
      detailCredits: toLocale(sumOfVat7Credits * 0.07) || 0.0,
    },
    {
      title: "ค่าความต่าง / Difference",
      detailDebits: "",
      detailCredits: toLocale(
        Math.abs(
          sumOfDebits +
            sumOfVat7Debits * 0.07 -
            (sumOfCredits + sumOfVat7Credits * 0.07)
        )
      ),
    },
  ];

  // const summaryItemTertiary = [
  //   {
  //     title: "ยอดรวมสุทธิ / Net Amount",
  //     detailDebits: toLocale(formik.values.net_amount) || 0.0,
  //     detailCredits: "",
  //   },
  //   {
  //     title: "มูลค่าที่ชำระแล้ว / Paid Amount",
  //     detailDebits: toLocale(formik.values.paid_amount) || 0.0,
  //     detailCredits: "",
  //   },
  //   {
  //     title: "ภาษี ณ ที่จ่าย / Withholding Tax",
  //     detailDebits:
  //       formik.values.withholding_tax?.withholding_tax_amount || 0.0,

  //     detailCredits: "",
  //   },
  // ];

  return (
    <div>
      <div className="account__summaryContainer">
        {summary && (
          <>
            <div className="account__summaryContainer-summaryPrimary">
              {summaryItemPrimary.map((item, index) => (
                <div className="accounting__summaryItem" key={item.title}>
                  <p>{item.title}</p>
                  <p>{item.detailDebits}</p>
                  <p>{item.detailCredits}</p>
                </div>
              ))}
            </div>
            <div className="account__summaryContainer-summarySecondary">
              {summaryItemSecondary.map((item, index) =>
                index !== 3 ? (
                  <div className="accounting__summaryItem" key={item.title}>
                    <p>{item.title}</p>
                    <p>{item.detailDebits}</p>
                    <p>{item.detailCredits}</p>
                  </div>
                ) : (
                  <div className="accounting__summaryItem" key={item.title}>
                    <p>{item.title}</p>
                    <p></p>
                    <p>{item.detailCredits}</p>
                  </div>
                )
              )}
            </div>
            {/* <div className="account__summaryContainer-summaryTertiary">
              {summaryItemTertiary.map((item, i) => (
                <div className="account__summaryItem" key={item.title}>
                  <p>{item.title}</p>
                  <p>{item.detailDebits}</p>
                  <p>{item.detailCredits}</p>
                </div>
              ))}
            </div> */}
            <Divider />
          </>
        )}
        <div className="accounting__summaryItem">
          <p>จำนวนเงินรวมทั้งสิ้น (บาท) / Total Amount</p>
          <p>
            {toLocale(parseFloat(sumOfDebits + sumOfVat7Debits * 0.07) || 0)}
          </p>
          <p>
            {toLocale(parseFloat(sumOfCredits + sumOfVat7Credits * 0.07) || 0)}
          </p>
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
