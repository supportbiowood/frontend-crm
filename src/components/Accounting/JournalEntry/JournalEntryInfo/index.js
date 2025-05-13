import { Backdrop, Breadcrumbs, CircularProgress, Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BreadcrumbComponent from "../../../BreadcrumbComponent";
import { useFormik } from "formik";
import { initialValues, validationSchema } from "./payload";
import InfoComponent from "./InfoComponent";
import HeaderInfoComponent from "./HeaderInfoComponent";
import JournalTableComponent from "./JournalTableComponent";
import AccountSummaryComponent from "./JournalSummaryComponent";
import JournalTemplateComponent from "./JournalTemplateComponent";
import { getRemarkTemplate } from "../../../../adapter/Api";
// import { TurnLeft } from "@mui/icons-material";

export default function JournalEntryInfo({ add }) {
  const [isLoading, setIsLoading] = useState(true);
  const [disabled, setDisabled] = useState({
    options: false,
    editButton: false,
    deleteButton: true,
    cancelButton: false,
    info: false,
  });
  const [journalAccount, setJournalAccount] = useState(initialValues);
  const [allTemplate, setAllTemplate] = useState([]);
  const { id } = useParams();
  // const history = useHistory();
  // const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;
    
    const getRemarks = getRemarkTemplate();
    Promise.all([getRemarks])
      .then((values) => {
        if (isMounted && values[0].data.status === "success") {
          let myData = values[0].data.data;
          setAllTemplate(myData);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.log(err);
          setIsLoading(false);
        }
      });
    if (!add) {
      if (isMounted) {
        setIsLoading(false);
        setJournalAccount(initialValues);
      }
    }
    setIsLoading(false);
    return () => {
      isMounted = false;
    }
  }, [add]);

  const formik = useFormik({
    initialValues: id
      ? {
          ...journalAccount,
        }
      : journalAccount,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setIsLoading(true);
      // const postPayload = {
      //   ...values,
      // };
      if (id) {
      } else {
      }
    },
  });

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
        <BreadcrumbComponent name="บันทึกบัญชี" to="/accounting/journal" />
        {add ? (
          <BreadcrumbComponent
            name="สร้างบันทึกบัญชี"
            to="/accounting/journal/add"
          />
        ) : (
          <BreadcrumbComponent
            name="ลูกหนี้"
            to="/accounting/journal/ลูกหนี้"
          />
        )}
      </Breadcrumbs>
      {add && (
        <div>
          <HeaderInfoComponent
            formik={formik}
            values={formik.values}
            disabled={disabled}
            setDisabled={setDisabled}
            add
          />
          <div className="accounting__container">
            <InfoComponent
              formik={formik}
              values={formik.values}
              disabled={disabled.info}
            />
          </div>
          <div>
            <JournalTableComponent
              formik={formik}
              data={formik.values.transactions}
              disabled={disabled.info}
            />
          </div>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
              <JournalTemplateComponent
                disabled={disabled.info}
                remarkId={formik.values.account_journal_template_remark_id}
                formik={formik}
                allTemplate={allTemplate}
                id="account_journal_template_remark_id"
                detail="account_journal_template_remark"
                remark={formik.values.account_journal_template_remark}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
              <AccountSummaryComponent
                summary
                formik={formik}
                data={formik.values.transactions}
              />
            </Grid>
          </Grid>
        </div>
      )}
      {!add && (
        <div>
          <h1 className="accounting__header__title">บันทึกบัญชี</h1>
          <div className="accounting__container">
            <InfoComponent
              formik={formik}
              values={formik.values}
              disabled={disabled.info}
            />
          </div>
        </div>
      )}
    </>
  );
}
