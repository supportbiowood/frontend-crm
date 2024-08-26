// reducers/uiReducer.js
const uiReducer = (state = {}, action) => {
  switch (action.type) {
    case "SNACKBAR":
      return {
        ...state,
        snackbarOpen: true,
        snackbarMessage: action.message,
        snackbarDescription: action.description,
        snackbarType: action.is_success,
      };
    case "SNACKBAR_CLEAR":
      return {
        ...state,
        snackbarOpen: false,
        infoSnackbarOpen: false,
      };
    default:
      return state;
  }
};

export default uiReducer;
