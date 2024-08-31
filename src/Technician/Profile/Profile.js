import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Menus from "../../Screens/Customer/Home/Menus/Menus";
import { useNavigate } from "react-router-dom";
import Loader from "../../Reusable/Loader";

const Profile = () => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.userData);
  const [userRole, setUserRole] = useState("");
  const [loader,setLoader] = useState(false)
  // console.log("userRole", userData);


  const naivgate = useNavigate()
  const technicianId = userData._id;

  useEffect(()=>{
    const isLoggedIn = localStorage.getItem("login") === 'true'; 
    if (!isLoggedIn) {
      naivgate("/"); 
      return; 
    }


  },[])

  
  useEffect(() => {
    setLoader(true)
    const user = userData.role
    setUserRole(user)
    setLoader(false)
  }, [userData]);
  return (
    <>
{loader && (
      <Loader show={loader}/>
      
    )} 

      <Menus />
      <div className="container d-flex justify-content-center mt-5 ">
        <div className="profile p-3 py-4 mt-2">
          <div className="text-center">
            <h3> My Account </h3>
            <hr className="line" />
            <div className="col-12 d-flex flex-column mt-4">
              <>
                <div className="d-flex flex-row align-items-center ">
                  <h5
                    style={{ fontWeight: "bold" }}
                    className="col-5 fonts12 textLeft"
                  >
                    Name
                  </h5>
                  <h5 className="col-2 fonts12 justify-content-center">
                    -
                  </h5>
                  <div className="col-6">
                    <h5
                      className="col-12 fonts12 textLeft"
                      style={{
                        lineBreak: "anywhere",
                        lineHeight: "20px",
                      }}
                    >
                      {userData.firstName + userData.lastName}
                    </h5>
                  </div>
                </div>   

                <div className="d-flex flex-row align-items-center ">
                  <h5
                    style={{ fontWeight: "bold" }}
                    className="col-5 fonts12 textLeft"
                  >
                    Email
                  </h5>
                  <h5 className="col-2 fonts12 justify-content-center">
                    -
                  </h5>
                  <div className="col-5">
                    <h5
                      className="col-12 fonts12 textLeft"
                      style={{
                        lineBreak: "anywhere",
                        lineHeight: "20px",
                      }}
                    >
                      {userData.email}
                    </h5>
                  </div>
                </div>  

                 <div className="d-flex flex-row align-items-center ">
                  <h5
                    style={{ fontWeight: "bold" }}
                    className="col-5 fonts12 textLeft"
                  >
                    Phone Number
                  </h5>
                  <h5 className="col-2 fonts12 justify-content-center">
                    -
                  </h5>
                  <div className="col-6">
                    <h5
                      className="col-12 fonts12 textLeft"
                      style={{
                        lineBreak: "anywhere",
                        lineHeight: "20px",
                      }}
                    >
                      {userData.phoneNumber}
                    </h5>
                  </div>
                </div>              
              </>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
