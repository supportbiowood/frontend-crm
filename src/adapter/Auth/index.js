import jwt from "jwt-decode";

export const getUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);
  else return null;
};

export const getToken = () => {
  return localStorage.getItem("accessToken") || null;
};

export const getExp = () => {
  return localStorage.getItem("exp") || null;
};

export const setUserSession = (accessToken, user) => {
  localStorage.setItem("accessToken", accessToken);
  const user_jwt = jwt(accessToken);
  const exp = user_jwt.exp;
  localStorage.setItem("user", JSON.stringify(user));
  localStorage.setItem("exp", exp);
};

export const removeUserSession = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  localStorage.removeItem("exp");
};

export const isAllowed = (page) => {
  const user = getUser();
  const pathname = window.location.pathname;
  if (page === "/employee" && pathname !== `/employee/${user.employee_id}`) {
    const allowed_department = ["ดูแลระบบ", "หัวหน้า"];
    const allowed_position = [
      "ผู้ดูแลระบบ",
      "ไอที",
      "ฝ่ายบุคคล",
      "กรรมการผู้จัดการ",
    ];
    return (
      allowed_department.includes(user.employee_department) &&
      allowed_position.includes(user.employee_position)
    );
  }
  return true;
};
