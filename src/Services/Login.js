import http from "./Https";
const loginUrl = "otherauth/login";
const forgotpasswordLinkUrl = "otherauth/forgotpasswordLink";
const resetpasswordUrl = "otherauth/reset-password";

const Login = (data) => {
  return http.Post(loginUrl, data);
};
const ForgotPasswordLink = (data) => {
  return http.Post(forgotpasswordLinkUrl, data);
};
const ResetPassword = (data) => {
    return http.Post(resetpasswordUrl, data);
  };

export default {
  Login: Login,
  ResetPassword: ResetPassword,
  ForgotPasswordLink:ForgotPasswordLink
};
