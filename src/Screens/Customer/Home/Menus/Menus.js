import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import NavDropdown from "react-bootstrap/NavDropdown";
import "../../../../Assets/CSS/CustomerCss/Home/Home.css";
import pestlogo from "../../../../Assets/Images/Pest P.png";
import { useNavigate,useLocation } from "react-router-dom";
import Loader from "../../../../Reusable/Loader";

const Menus = () => {
  const location = useLocation();
  // Access user data from Redux store
  const userData = useSelector((state) => state.user.userData);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate()
  const [loader,setLoader] = useState(false)
  const [hideNav,setHideNav] = useState(false)
  // console.log("userRole",userData);
  useEffect(() => {
    const user = userData.role
    setUserRole(user)
  }, [userData]);


  const handleLogout = ()=>{
    setLoader(true)
    localStorage.clear()
    localStorage.setItem("login", 'false')
    navigate('/')
    setLoader(false)
  }

  const handlecompleteTask = ()=>{
    setLoader(true)
    navigate('/completed/Tasks')
    setLoader(false)
  }


  useEffect(()=>{
    const locationNav = location.pathname == '/start/task' ? false : location.pathname == '/chemical/list' ? false : location.pathname == '/signature/page' ? false : true;
    setHideNav(locationNav);
  },[location])


 return (
    <>
    {loader && (
      <Loader show={loader}/>
      
    )} 
       <Navbar expand="sm" className="mb-3 homeNav">
        <Container fluid>
          <Navbar.Brand href="#">
            <img className="mainlogo" src={pestlogo} alt="pest logo" />
          </Navbar.Brand>
          { hideNav && <><Navbar.Toggle aria-controls="offcanvasNavbar" /><Navbar.Offcanvas id="offcanvasNavbar" placement="end">
           <Offcanvas.Header closeButton>
             <Offcanvas.Title id="offcanvasNavbarLabel" style={{ fontSize: "16px" }}>
               {userRole === "Technician"
                 ? `${userData.firstName} ${userData.lastName}`
                 : `${userData.name}`}
             </Offcanvas.Title>
           </Offcanvas.Header>
           <Offcanvas.Body>
             <Nav className="justify-content-end flex-grow-1 pe-3 menus">
               {userRole === "Technician" ? (
                 <>
                   <Nav.Link href="/tech/home">Home</Nav.Link>
                   <NavDropdown title="My Tasks" id="basic-nav-dropdown">
                     <NavDropdown.Item
                       style={{ fontSize: "15px" }}
                       onClick={handlecompleteTask}
                     >
                       Completed Tasks
                     </NavDropdown.Item>
                   </NavDropdown>
                   <Nav.Link href="/tech/contactAdmin">Contact Admin</Nav.Link>
                   <Nav.Link href="/profile">My Account</Nav.Link>
                 </>
               ) : (
                 <>
                   <Nav.Link href="/home">Home</Nav.Link>
                   <Nav.Link href="/home/allservicesHistory">Services History</Nav.Link>
                   {/* <Nav.Link href="#action2">My Account</Nav.Link> */}
                 </>
               )}
               <Nav.Link onClick={handleLogout}>Log out</Nav.Link>
             </Nav>
           </Offcanvas.Body>
         </Navbar.Offcanvas></> }
        </Container>
      </Navbar>
     
    </>
  );
};

export default Menus;
