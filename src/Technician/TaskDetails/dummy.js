import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Menus from "../../Screens/Customer/Home/Menus/Menus";
import { Heading } from "../../Reusable/Headings/Heading";
import s2 from "../../Assets/Images/s2.webp";
import Model from "../../Reusable/Model";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from "../../Services/TaskServices";

const TaskDetails = () => {
  const selectedTaskData = useSelector((state) => state?.task?.task?.selectedTask);
  const customerDetailsData = useSelector((state) => state?.task?.task?.customerDetails);
  const [showForm, setShowForm] = useState(false);
  const [startTask, setStartTask] = useState(false);
  const [otherTech, setOtherTech] = useState();
  const navigate = useNavigate();
  let location = useLocation();
  const { selectedTask, customerDetails, selectedTaskId } = location.state || {};

  const taskId = selectedTaskId;
  const taskItemId = selectedTask ? selectedTask._id : null;
  console.log("userData=========================>",customerDetailsData);

  const handleAddTeamMemberClick = () => {
    setShowForm(true);
  };

  const handleStart = () => {
    setStartTask(true);
  };

  const handleClose = () => {
    setStartTask(false);
  };

  const handleScan = () => {
    navigate("/scanqr");
  };

  const handleAdd = async () => {
    try {
      const response = await ApiService.UpdateOtherTechnician({
        taskId: taskId,
        taskItemId: taskItemId,
        otherTechnicianName: otherTech,
      });
      console.log("response", response);
      // Check the status code of the response
      if (response.status === 200) {
        // Handle success
        console.log("Other technician's name updated successfully.");
      } else {
        // Handle other status codes
        console.error(
          `Error updating other technician's name. Status code: ${response.status}`
        );
      }
    } catch (error) {
      console.error("Error updating other technician's name:", error);
    }
  };

  const handleInputChange = (event) => {
    setOtherTech(event.target.value);
  };
  return (
    <>
      <Menus />
      <Heading heading="Task Details" />
      <div>
        <div className="container ">
          <div className="row d-flex justify-content-center">
            <div className="col-md-7">
              <div className="details-full p-3 py-4">
                <div className="text-center">
                  <img src={s2} width="150" className="rounded-circle" />
                </div>

                <div className="text-center mt-3">
                  <h5 className="mt-2 mb-0 fonts14 fontWeight">
                    {selectedTaskData.serviceName}
                  </h5>
                  <div className="col-12 d-flex flex-column mt-4">
                    <div className="d-flex flex-row align-items-center ">
                      <h5
                        style={{ fontWeight: "bold" }}
                        className="col-5 fonts12 textLeft"
                      >
                        Customer Name
                      </h5>
                      <h5 className="col-2 fonts12 justify-content-center">
                        -
                      </h5>
                      <h5 className="col-5 fonts12 textLeft">
                        {customerDetailsData.name}
                      </h5>
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
                      <h5 className="col-5 fonts12 textLeft">
                        {customerDetailsData.email}
                      </h5>
                    </div>
                    <div className="d-flex flex-row align-items-center ">
                      <h5
                        style={{ fontWeight: "bold" }}
                        className="col-5 fonts12 textLeft"
                      >
                        Phone
                      </h5>
                      <h5 className="col-2 fonts12 justify-content-center">
                        -
                      </h5>
                      <h5 className="col-5 fonts12 textLeft">
                        {customerDetailsData.phoneNumber}
                      </h5>
                    </div>
                    <div className="d-flex flex-row align-items-center ">
                      <h5
                        style={{ fontWeight: "bold" }}
                        className="col-5 fonts12 textLeft"
                      >
                        Start Date
                      </h5>
                      <h5 className="col-2 fonts12 justify-content-center">
                        -
                      </h5>
                      <h5 className="col-5 fonts12 textLeft">
                        {moment(selectedTaskData.startDate).format("DD-MM-YYYY")}
                      </h5>
                    </div>
                    <div className="d-flex flex-row  align-items-center ">
                      <h5
                        style={{ fontWeight: "bold" }}
                        className="col-5 fonts12 textLeft"
                      >
                        Status
                      </h5>
                      <h5 className="col-2 fonts12 justify-content-center">
                        -
                      </h5>
                      <h5 className="col-5 fonts12 textLeft">
                        {selectedTaskData.status === "start"
                          ? "Yet to start"
                          : selectedTaskData.status}
                      </h5>
                    </div>
                  </div>
                </div>
                <div className="mt-3" style={{ backgroundColor: " #8be97d1f" }}>
                  <h6 className="pt-2 fonts14 fontWeight">Task Description</h6>
                  <div className=" task-des mt-1">
                    <p className="fonts10 p-2">{selectedTaskData.description}</p>
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    style={{ fontSize: "13px" }}
                    onClick={handleAddTeamMemberClick}
                    className="btn btn-outline-secondary mt-3 "
                  >
                    Add Team Member
                  </button>
                </div>

                {showForm && (
                  <div className="d-flex justify-content-center mt-4">
                    <form
                      style={{
                        backgroundColor: "rgba(139, 233, 125, 0.12)",
                        borderRadius: "20px",
                      }}
                      className="col-10 d-flex justify-content-end"
                    >
                      <div className="container col-10 p-3">
                        <h6 className="mb-3">Add Technician</h6>
                        <input
                          id="addtechnician"
                          className="form-control mb-3"
                          placeholder="Enter Name"
                          value={otherTech}
                          onChange={handleInputChange}
                        />
                        <button
                          className="btn btn-primary fonts12 mt-3 mb-2"
                          onClick={handleAdd}
                        >
                          Add{" "}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="buttons d-flex justify-content-center gap-3 mt-3">
                  <button
                    className="btn btn-primary fonts12"
                    onClick={handleStart}
                  >
                    Start Task{" "}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/home")}
                    className="btn btn-outline-secondary fonts12"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Model
        show={startTask}
        modalTitle="Start Task"
        modalContent="Are you sure you want to start the task?"
        onClose={handleClose}
        onConfirm={handleScan}
      />
    </>
  );
};

export default TaskDetails;
