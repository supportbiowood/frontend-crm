export const showSnackbar = (is_success, message, description) => {
  return (dispatch) => {
    dispatch({ type: "SNACKBAR", is_success, message, description });
  };
};

export const clearSnackbar = () => {
  return (dispatch) => {
    dispatch({ type: "SNACKBAR_CLEAR" });
  };
};
