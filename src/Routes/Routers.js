import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../Screens/Customer/Home/Home";
import Login from "../Screens/Login/Login";
import AllServicesHistory from "../Screens/Customer/Services/ServiceHistory/AllServicesHistory/AllServicesHistory";
import SpecificHistory from "../Screens/Customer/Services/ServiceHistory/SpecificHistory/SpecificHistory";
import InsideServices from "../Screens/Customer/Services/OurServices/InsideServices/InsideServices";
import MyTaskList from "../Technician/Task/MyTaskList";
import TaskDetails from "../Technician/TaskDetails/TaskDetails";
import ScanQrCode from "../Technician/ScanQrCode/ScanQrCode";
import StartTask from "../Technician/StartTask/StartTask";
import SignnaturePage from "../Technician/SignaturePage/SignnaturePage";
import Chemicals from "../Technician/chemicalspage/Chemicals";
import Profile from "../Technician/Profile/Profile";
// =============== Technician ==================
import TechnicianHome from "../Technician/Home";
import Customerlist from "../Technician/Customerllist/CustomerList";
import CompletedTasks from "../Technician/Task/CompletedTasks";
import ResetPassword from "../Technician/ResetPassword/ResetPassword";
import ContactAdmin from "../Technician/ContactAdmin/ContactAdmin";

const Routers = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ======================== Customers route ===============================  */}

        <Route exact path="/" element={<Login />} />
        <Route exact path="/home" element={<Home />} />
        <Route
          exact
          path="/home/allservicesHistory"
          element={<AllServicesHistory />}
        />
        <Route exact path="/specificHistory" element={<SpecificHistory />} />
        <Route exact path="/insideServices" element={<InsideServices />} />

        {/* ======================= Technician route ========================== */}

        <Route exact path="/tech/home" element={<TechnicianHome />} />
        <Route exact path="/tasklist/:id" element={<MyTaskList />} />
        <Route exact path="/tech/contactAdmin" element={<ContactAdmin />} />
        {/* <Route exact path="/taskdetails/:taskId" element={<TaskDetails/>} /> */}
        <Route exact path="/taskdetails" element={<TaskDetails />} />
        <Route exact path="/scanqr" element={<ScanQrCode />} />
        <Route exact path="/start/task" element={<StartTask />} />
        <Route exact path="/signature/page" element={<SignnaturePage />} />
        <Route exact path="/chemical/list" element={<Chemicals />} />
        <Route exact path="/profile" element={<Profile />} />
        <Route exact path="/customer-list" element={<Customerlist />} />
        <Route exact path="/completed/Tasks" element={<CompletedTasks/>}/>
        <Route exact path="/reset-password" element={<ResetPassword/>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
