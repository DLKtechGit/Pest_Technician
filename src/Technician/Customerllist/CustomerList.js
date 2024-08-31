import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { SubHeading } from "../../Reusable/Headings/Heading";
import Menus from "../../Screens/Customer/Home/Menus/Menus";
import { Heading } from "../../Reusable/Headings/Heading";
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import ApiService from "../../Services/TaskServices";
import { GoInbox } from "react-icons/go";
import { BiTask } from "react-icons/bi";
import Loader from "../../Reusable/Loader";
import moment from "moment";
import PullToRefresh from 'react-simple-pull-to-refresh';

const CustomerList = () => {
  const [data, setData] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((state) => state.user.userData);
  const userID = useMemo(() => (userData ? userData._id : ""), [userData]);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParamsData = searchParams.get("status");
  const [initialStatus, setInitialStatus] = useState("Yet to Start");
  const status = location.state?.status;
  const [loader, setLoader] = useState(false);



  useEffect(()=>{
    const isLoggedIn = localStorage.getItem("login") === 'true'; 
    if (!isLoggedIn) {
      navigate("/"); 
      return; 
    }

  },[])
 

  useEffect(() => {
    if (status) {
      setInitialStatus(status);
    } else {
      setInitialStatus("Yet to Start");
    }
  }, [status]);

  useEffect(() => {
    if (userID) {
      getAllTasks();
    }
  }, [userID]);

  const getAllTasks = async () => {
    setLoader(true);
    try {
      const allTasksResponse = await ApiService.GetStartTasks();
      const allTasks = allTasksResponse.data.Results;
  
      const technicianTasks = allTasks
        .filter((task) =>
          task.technicians.some((technician) => technician.technicianId === userID)
        )
        .map((task) => {
          const filteredTechnicians = task.technicians.map((technician) => {
            // Filter tasks based on isDelete and status
            const filteredTasks = technician.tasks.filter(
              (t) => t.isDelete === false && (t.status === "ongoing" || t.status === "start")
            );
            return { ...technician, tasks: filteredTasks };
          });
          return { ...task, technicians: filteredTechnicians };
        })
        .filter((task) => task.technicians.some((technician) => technician.tasks.length > 0));
  
      setData(technicianTasks);
      console.log('tecdata', technicianTasks);
      
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoader(false);
    }
  };
  
  const handleView = (customerId, taskId) => {
    setLoader(true);
    setSelectedTaskId(taskId);

    navigate(`/tasklist/${customerId}`, {
      state: {
        data: data,
        customerData: data.find((task) => task.customerId === customerId),
        customerId: customerId,
        selectedTaskId: taskId,
        searchParamsData: searchParamsData ? searchParamsData : "",
      },
    });
    setLoader(false);
  };

  const getFormattedStartDate = (task) => {
    if (
      task.technicians &&
      task.technicians.length > 0 &&
      task.technicians[0].tasks &&
      task.technicians[0].tasks.length > 0
    ) {
      const currentTaskData = task.technicians[0].tasks.filter(task => task.status !== 'completed');
      if (currentTaskData.length > 0) {
        const startDate = moment(currentTaskData[0].startDate).format("DD-MM-YYYY");
        const status = currentTaskData[0].status;
        if (status === "start") {
          return { startDate, status: "Yet to Start" };
        } else {
          return { startDate, status };
        }
      }
    }
    return {
      startDate: "Start Date Not Available",
      status: "Status Not Available",
    };
  };

  const onhandleClick = () => {
    navigate("/customer-list");
  };

  return (
    <>
      <PullToRefresh onRefresh={getAllTasks}>
        {loader && <Loader show={loader} />}
        <div className="tech-full">
          {location.pathname === "/customer-list" && <Menus />}
          <div className="container">
            {location.pathname === "/tech/home" && (
              <>
                <div>
                  <SubHeading subHeading="Services" />
                </div>
                <div
                  className="subHeadingRightText d-flex justify-content-end p-2"
                  onClick={onhandleClick}
                  style={{ cursor: "pointer" }}
                >
                 {`View all >`}
                </div>
              </>
            )}
            {location.pathname === "/customer-list" && (
              <Heading heading="Customers List" />
            )}
            {data.length === 0 ? (
              <div className="d-flex flex-column mt-3 justify-content-center">
                <div className="d-flex justify-content-center">
                  <GoInbox
                    className="d-flex justify-content-center"
                    style={{ fontSize: "30px", color: "#d2d2d2" }}
                  />
                </div>
                <p className="mt-3" style={{ fontSize: "12px", color: "grey" }}>
                  No services scheduled at the moment
                </p>
              </div>
            ) : (
              <>
                {data.slice(0, 3).map((task) => {
                  const { startDate, status } = getFormattedStartDate(task);
                  return (
                    <div
                      className="card mb-3 mt-3 d-flex flex-row align-items-center p-2"
                      key={task._id}
                    >
                      <div className="col-1 d-flex justify-content-center">
                        <BiTask style={{ fontSize: "19px" }} />
                      </div>
                      <div className="col-9 d-md-flex flex-md-column justify-content-start align-items-center px-3">
                        <h6
                          className="fonts textLeft mt-2"
                          style={{ fontSize: "12px" }}
                        >
                          <b> {task.customerDetails.name}</b>
                        </h6>
                        <p
                          className="fonts textLeft mt-2 mb-1"
                          style={{ fontSize: "10px" }}
                        >
                          <span style={{ fontWeight: "700" }}>Start Date:</span>{" "}
                          {startDate}
                        </p>
                        <p
                          className="fonts textLeft mt-2 mb-1"
                          style={{ fontSize: "10px" }}
                        >
                          <span style={{ fontWeight: "700" }}>Status:</span>{" "}
                          {status === 'Yet to Start' ?
                            <span style={{ color: "darkorange", textTransform: "capitalize", fontWeight: 600 }}>{status}</span>
                            :
                            <span style={{ color: "green", textTransform: "capitalize", fontWeight: 600 }}>{status}</span>
                          }
                        </p>
                      </div>
                      <div className="col-2 d-flex justify-content-center">
                        <button
                          onClick={() => handleView(task.customerId, task._id)}
                          className="btn btn-primary btn-sm"
                          style={{ fontSize: "9px" }}
                          type="button"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  );
                })}
                {location.pathname === "/customer-list" &&
                  data.slice(3).map((task) => {
                    const { startDate, status } = getFormattedStartDate(task);
                    return (
                      <div
                      className="card mb-3 mt-3 d-flex flex-row align-items-center p-2"
                      key={task._id}
                    >
                      <div className="col-1 d-flex justify-content-center">
                        <BiTask style={{ fontSize: "19px" }} />
                      </div>
                      <div className="col-9 d-md-flex flex-md-column justify-content-start align-items-center px-3">
                        <h6
                          className="fonts textLeft mt-2"
                          style={{ fontSize: "12px" }}
                        >
                          <b> {task.customerDetails.name}</b>
                        </h6>
                        <p
                          className="fonts textLeft mt-2 mb-1"
                          style={{ fontSize: "10px" }}
                        >
                          <span style={{ fontWeight: "700" }}>Start Date:</span>{" "}
                          {startDate}
                        </p>
                        <p
                          className="fonts textLeft mt-2 mb-1"
                          style={{ fontSize: "10px" }}
                        >
                          <span style={{ fontWeight: "700" }}>Status:</span>{" "}
                          {status === 'Yet to Start' ?
                            <span style={{ color: "darkorange", textTransform: "capitalize", fontWeight: 600 }}>{status}</span>
                            :
                            <span style={{ color: "green", textTransform: "capitalize", fontWeight: 600 }}>{status}</span>
                          }
                        </p>
                      </div>
                      <div className="col-2 d-flex justify-content-center">
                        <button
                          onClick={() => handleView(task.customerId, task._id)}
                          className="btn btn-primary btn-sm"
                          style={{ fontSize: "9px" }}
                          type="button"
                        >
                          View
                        </button>
                      </div>
                    </div>
                    );
                  })}
              </>
            )}
          </div>
        </div>
      </PullToRefresh>
    </>
  );
};

export default CustomerList;
