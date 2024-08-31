import React, { useRef, useState, useEffect } from "react";
import "../../Assets/CSS/Login/Login.css";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import pestlogo from "../../Assets/Images/pestlogo.png";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Apiservice from "../../Services/Login";
import { useSelector } from "react-redux";
import Loader from "../../Reusable/Loader";

const ResetPassword = () => {
  const userData = useSelector((state) => state);
  const [confirmpassword, setConfirmpassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const formRef = useRef(null);
  const [loader,setLoader] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const email = urlParams.get('email');
    if(email)
    {
      setForgotEmail(email);
    }
  }, []);

  const onFinish = async () => {
    setLoader(true)
    try {
      if(confirmpassword == newPassword)
      {
        let res = await Apiservice.ResetPassword({
          confirmpassword: confirmpassword,
          newPassword: newPassword,
          email:forgotEmail
        });
        if (res?.status === 200) {
          toast.success("Reset Password Successfully");
          navigate("/");
        } else {
          toast.error(res.message || "Reset Password failed.");
        }
        
      }
      else
      {
        toast.error("Passwords do not match. Please try again.");
      }
      
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while Reset Password.");
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
                  <img src={pestlogo} className="img-fluid LoginLogo mb-4" />
                </div>
                <h6 className="mb-3">Forgot Password</h6>
                <Form
                  name="normal_login"
                  className="col-12 login-form"
                  initialValues={{
                    remember: true,
                  }}
                  onFinish={onFinish}
                >
                  <Form.Item
                    name="newpassword"
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
                      placeholder="Enter a New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item
                    name="confirmpassword"
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
                      placeholder="Enter a Confirm Password"
                      value={confirmpassword}
                      onChange={(e) => setConfirmpassword(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="col-12 login-form-button"
                    >
                      Reset Password
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
    </>
  );
};

export default ResetPassword;
