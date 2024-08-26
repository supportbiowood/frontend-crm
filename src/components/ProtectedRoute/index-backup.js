// import React, { useState, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Route,
//   Switch,
//   Redirect,
// } from "react-router-dom";
// import { verifyToken } from "../../adapter/Api";
// import {
//   getToken,
//   setUserSession,
//   getUser,
//   getExp,
//   removeUserSession,
//   isAllowed
// } from "../../adapter/Auth";

// import moment from "moment";
// import "moment-timezone";

// import Backdrop from "@mui/material/Backdrop";
// import CircularProgress from "@mui/material/CircularProgress";

// const ProtectedRoute = (props) => {
//   const [authLoading, setAuthLoading] = useState(true);
//   const [currentUser, setCurrentUser] = useState();

//   const permission = isAllowed(props.path);

//   console.log("PATH", props.path);

//   useEffect(() => {
//     const user = getUser();
//     const token = getToken();
//     const exp = getExp();

//     if(token == null || !token) {
//       console.log("Token not found")
//       removeUserSession();
//       setAuthLoading(false);
//     } else if(exp && exp <= moment().tz("Asia/Bangkok").unix()) {
//       console.log("Token expired")
//       verifyToken(token)
//       .then((data) => {
//         console.log("Check token", data);
//         if(data.data.status == "error") {
//           console.log("Verify token error", data.data.message)
//           removeUserSession();
//         } else {
//           setUserSession(data.data.data.access_token, data.data.data.user);
//           setCurrentUser(getUser());
//         }
//         setAuthLoading(false);
//       })
//       .catch((err) => {
//         console.log("Check token err", err);
//         if (err.response) {
//           console.log(err.response);
//           console.log(err.response.data);
//         }
//         console.log("Remove session")
//         removeUserSession();
//         setAuthLoading(false);
//       });
//     }
//   }, []);

//   if (authLoading && getToken()) {
//     return (
//       <Backdrop
//         sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
//         open={true}
//       >
//         <CircularProgress color="inherit" />
//       </Backdrop>
//     );
//   }

  

//   if(!currentUser || currentUser == null) return <Redirect to="/login" />;

//   if (!permission) return <div>You're not allowed</div>;

//   return <Route {...props}></Route>;
    
// };

// export default ProtectedRoute;
