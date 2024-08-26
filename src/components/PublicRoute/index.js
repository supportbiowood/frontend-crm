import { Route, Redirect } from "react-router-dom";

import { getToken } from "../../adapter/Auth";

const PublicRoute = (props) => {
  const accessToken = getToken();
  if (!accessToken) {
    return <Route {...props}></Route>;
  } else {
    return <Redirect to="/" />;
  }
};

export default PublicRoute;
