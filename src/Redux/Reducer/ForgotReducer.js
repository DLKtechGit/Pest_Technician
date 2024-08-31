// reducers/userReducer.js

const initialState = {
    forgotEmail: "",
  };
  
  const ForgotReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SET_FORGOT_DATA":
        return {
          ...state,
          forgotEmail: action.payload,
        };
      case "CLEAR_FORGOT_DATA":
        return {
          ...state,
          forgotEmail: "",
        };
      default:
        return state;
    }
  };
  
  export default ForgotReducer;
  