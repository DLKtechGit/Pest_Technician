import React, { useRef, useState, useEffect } from "react";
// import Modal from 'react-bootstrap/Modal';
import "../../Assets/CSS/Login/Login.css";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Modal } from "antd";
import pestlogo from "../../Assets/Images/pestlogo.png";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Apiservice from "../../Services/Login";
import { useDispatch } from "react-redux";
import Loader from "../../Reusable/Loader";
import { setUserData, setForgotEmails } from "../../Redux/Action/Action";

const Signin = () => {
  const [loginEmail, setLoginEmail] = useState(""); 
  const [forgotEmail, setForgotEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] =
    useState(false);
    const [loader,setLoader] = useState(false)

  const formRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(()=>{
    const user_data = JSON.parse(localStorage.getItem("userData"));
    const location = localStorage.getItem("location");
    if(user_data)
    {
      const role = user_data?.role;
      if(role == 'Technician')
      {
        if(location)
        {
          if(location == '/taskdetails')
          {
            navigate("/tech/home");
          }
          else
          {
            navigate(location);
          }
          
        }
        else
        {
          navigate("/tech/home");
        }
      }
      else if(role == 'Customer')
      {
        navigate("/home");
      }
    }
  },[]);

  const onFinish = async () => {
    setLoader(true)
    try {
      
      let res = await Apiservice.Login({
        email: loginEmail, // Changed to loginEmail
        password: password,
      });
      if (res?.data?.status === 200) {
        dispatch(setUserData(res.data.result));
        if (res?.data?.result.role === "Technician") {
          localStorage.setItem("login", 'true')
          toast.success("Technician Login Successfully");
          navigate("/tech/home");
        } else {
          localStorage.setItem("login", 'true')
          toast.success("Customer Login Successfully");
          navigate("/home");
        }
      } else {
        toast.error(res.message || "Incorrect email or Password.");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while logging in.");
    }
    finally{
      setLoader(false)
    }
  };

  const handleForgotPasswordClick = () => {
    setForgotPasswordModalVisible(true);
  };

  const handleForgot = async () => {
    setLoader(true)
    try {
      let res = await Apiservice.ForgotPasswordLink({
        email: forgotEmail,
      });
      if (res?.status === 200) {
        localStorage.setItem("forgotEmail", JSON.stringify(forgotEmail));
        localStorage.setItem('otpVerified', true);
        toast.success("Reset Password Link Sent Successfully");
        setForgotEmail("");
        setForgotPasswordModalVisible(false);
      } else {
        toast.error(res.message || "Reset Password Link Sent Failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while Reset Password Link generating.");
    }
    finally{
      setLoader(false)
    }
  };

  return (
    <>
    {loader && (
      <Loader show={loader}/>
      
    )} 
    <section className="login-block">
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <div className="auth-box">
              <div className="card-block login-form-box checkout-page-style">
                <div className="col-12 d-flex justify-content-center ">
                  <img src={pestlogo} className="img-fluid LoginLogo mb-5" />
                </div>
                <Form
                  name="normal_login"
                  className="col-12 login-form"
                  initialValues={{
                    remember: true,
                  }}
                  onFinish={onFinish}
                >
                  <Form.Item
                    className="loginInput"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Email!",
                      },
                    ]}
                  >
                    <Input
                      prefix={<UserOutlined className="site-form-item-icon" />}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                      }}
                      value={loginEmail}
                      placeholder="Email"
                    />
                  </Form.Item>
                  <Form.Item
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please input your Password!",
                      },
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined className="site-form-item-icon" />}
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                      <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="col-12 login-form-button"
                    >
                      Log in
                    </Button>
                  </Form.Item>
                  <Form.Item>
                    <div
                      className="login-form-forgot"
                      onClick={handleForgotPasswordClick}
                    >
                      Forgot password?
                    </div>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
          <Modal
            title="Forgot Password"
            open={forgotPasswordModalVisible}
            onCancel={() => setForgotPasswordModalVisible(false)}
            footer={null}
          >
            <Form
              name="normal_login"
              className="col-12 login-form"
              initialValues={{
                remember: true,
              }}
              onFinish={handleForgot}
            >
              <Form.Item
                className="loginInput mt-3"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please input your Email!",
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  onChange={(e) => {
                    setForgotEmail(e.target.value);
                  }}
                  value={forgotEmail}
                  placeholder="Email"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="col-12 login-form-button"
                >
                  Reset Link
                </Button>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
      <ToastContainer />
    </section>
    </>
  );
};

export default Signin;
