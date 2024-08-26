import React, { useEffect } from "react";
import NavLeftComponent from "../../components/NavLeftComponent";
import NavTopComponent from "../../components/NavTopComponent";
import MobileNavComponent from "../../components/MobileNavComponent";
import FooterComponent from "../../components/FooterComponent";
import {
  getToken,
  getUser,
  getExp,
  removeUserSession,
} from "../../adapter/Auth";
import moment from "moment";
import "moment-timezone";

import { useDispatch } from "react-redux";
import { showSnackbar } from "../../redux/actions/snackbarActions";

export default function HomeScreen() {
  const dispatch = useDispatch();

  function checkToken() {
    const user = getUser();
    const token = getToken();
    const exp = getExp();

    if (user == null || !user) {
      console.log("User not found");
      removeUserSession();
      window.location.href = "/login";
      return false;
    }

    if (token == null || !token) {
      console.log("Token not found");
      removeUserSession();
      window.location.href = "/login";
      return false;
    }

    if (exp == null || !exp) {
      console.log("Token not found");
      removeUserSession();
      window.location.href = "/login";
      return false;
    }

    if (exp && exp <= moment().tz("Asia/Bangkok").unix()) {
      console.log("Expired token");
      removeUserSession();
      window.location.href = "/login";
      return false;
    }

    return true;
  }

  useEffect(() => {
    dispatch(showSnackbar("info", "ยินดีต้อนรับสู่ Biowood ERP"));
  }, [dispatch]);

  useEffect(() => {
    if (!checkToken()) return;
  }, []);

  return (
    <>
      <NavLeftComponent />
      <div className={"whole-wrapper"}>
        <NavTopComponent />
        <main>
          {/* ยินดีต้อนรับสู่ Biowood ERP */}
          <MobileNavComponent />
        </main>
        <FooterComponent />
      </div>
    </>
  );
}
