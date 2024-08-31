import React, { useEffect, useState, useMemo } from "react";
import { SubHeading } from "../../../../Reusable/Headings/Heading";
import "../../../../Assets/CSS/CustomerCss/Services/Services.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ApiService from "../../../../Services/TaskServices";
import moment from "moment";
import Spinner from 'react-bootstrap/Spinner';
import Loader from "../../../../Reusable/Loader";


const ServiceHistory = () => {
  const userData = useSelector((state) => state.user.userData);
  const userID = useMemo(() => (userData ? userData._id : ""), [userData]);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [loader,setLoader] = useState(false)

  useEffect(() => {
    if (userID) {
      getAllTasks();
    }
  }, [userID]);

  const getAllTasks = async () => {
    setLoader(true)
    try {
      const allTasksResponse = await ApiService.TaskList();
      const allTasks = allTasksResponse.data.Results;
      const technicianTasks = allTasks.filter(
        (task) => task.customerId === userID
      );
      const taskData = technicianTasks.map((item) => {
        return item.technicians;
      });
      const customerTasks = taskData.map((data) => {
        const taskDetails = data[0].tasks;
        return taskDetails;
      });
      setData(customerTasks[0]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
    finally{
      setLoader(false)
    }
  };
  // console.log("data", data);
  const navigate = useNavigate();

  const onFinish = (taskId) => {
    navigate("/specificHistory", { state: { taskId: taskId } });
  };

  const onhandleClick = () => {
    navigate("/home/allservicesHistory", { state: { userID: userID } });
  };

  const groupedData = data ? data.reduce((acc, current) => {
    if (!acc[current._id]) {
      acc[current._id] = [current];
    } else {
      acc[current._id].push(current);
    }
    return acc;
  }, {}) : {};

  // Render each unique task along with its sub-categories
  const renderedTasks = Object.values(groupedData).map((tasks, index) => (
    <div key={index} className="card d-flex flex-column serviceHistoryCard mb-3">
      <div className="col-12 d-flex justify-content-end mt-3">
        <FaRegCalendarAlt className="calendarIcon" />
        <div className="ServiceHistoryDate px-2">
          {moment(tasks[0].startDate).format("DD-MM-YYYY")}
        </div>
        <div className="ServiceHistoryStatus px-2">
          {tasks[0].status === "start" ? "Yet to start" : tasks[0].status}
        </div>
      </div>
      <hr/>
      <div className="d-flex flex-row mb-2">
        <div className="col-9 mt-2 px-3 p-1">
        

          {tasks[0].QrCodeCategory.map((item, innerIndex) => (
            <React.Fragment key={innerIndex}>
              {item.subCategory.map((data, subIndex) => (
                <h6 key={`${index}-${innerIndex}-${subIndex}`} className="serviceHistorytitle">{data}</h6>
              ))}
            </React.Fragment>
          ))}
        </div>
        <div className="col-3 d-flex align-items-center justify-content-center">
          <div style={{ fontSize: "12px" }}>
            <button
              type="button"
              className="btn pestBtn"
              onClick={() => onFinish(tasks[0]._id)} // Pass the task ID to onFinish
            >
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  ));


  return (
    <>
    {loader && (
      <Loader show={loader}/>
      
    )} 
    <div className="p-3">
      <div>
        <SubHeading subHeading="Services" />
      </div>
      <div
        className="subHeadingRightText d-flex justify-content-end p-2"
        onClick={onhandleClick}
        style={{ cursor: "pointer" }} // Add cursor pointer style
      >
        View All
      </div>
      <div>
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "100px" }}>
            <Spinner animation="border" variant="success" />
          </div>
        ) : data && data.length ? (
          renderedTasks
        ) : (
          <p className="mt-3" style={{ fontSize: "12px", color: "grey" }}>
            No services scheduled at the moment
          </p>
        )}
      </div>

    </div>
    </>
  );
};

export default ServiceHistory;
