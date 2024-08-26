import { Route, Redirect } from "react-router-dom";

import { getToken, isAllowed } from "../../adapter/Auth";

const ProtectedRoute = (props) => {
  const accessToken = getToken();
  const permission = isAllowed(props.path);
  console.log("PATH", props.path);
  if (accessToken) {
    if (permission) return <Route {...props}></Route>;
    else return <div>คุณไม่มีสิทธิในการเข้าถึงหน้านี้</div>;
  } else {
    return <Redirect to="/login" />;
  }
};

export default ProtectedRoute;
