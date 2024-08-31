import React, { useEffect, useState, useMemo } from "react";
import Menus from "../../Screens/Customer/Home/Menus/Menus";
import { Heading } from "../../Reusable/Headings/Heading";
import s2 from "../../Assets/Images/s2.webp";
import { useSelector } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import Apiservice from "../../Services/TaskServices";
import moment from "moment";
import { DatePicker } from "antd";
import Loader from "../../Reusable/Loader";
import { useNavigate } from "react-router-dom";
// import { DatePicker } from 'rsuite';
// import 'rsuite/DatePicker/styles/index.css';

const CompletedTasks = () => {
  // const [date, setDate] = useState('');
  // const [selectedDate, setSelectedDate] = useState(null);
  const [customerName, setCustomerName] = useState([]);
  const [selectedTaskDatas, setSelectedTaskDatas] = useState([]);
  const selectedTaskData = useSelector(
    (state) => state?.task?.task?.selectedTask
  );
  // console.log("selectedTaskData", selectedTaskData);

  const completedData = selectedTaskData?.status;
  // console.log("completedData", completedData);
  const [data, setData] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  // console.log("allTasks", allTasks);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [companyName, setCompanyName] = useState();
  const [loader, setLoader] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("login") === 'true';
    if (!isLoggedIn) {
      navigate("/");
      return;
    }

  }, [])

  const userData = useSelector((state) => state.user.userData.email);

  const handleViewDetails = async (taskItemId) => {
    const selectedTaskDatas = await getAllTasksData(taskItemId);
    setSelectedTaskDatas(selectedTaskDatas);
    setSelectedTask(taskItemId);
    setShowModal(true);
  };


  const getAllTasksData = async (id) => {
    setLoader(true);
    try {
      const response = await Apiservice.GetTaskStatus(id);
      return response?.data?.selectedTask;
    } catch (error) {
      console.error("Unable to start the task:", error);
    } finally {
      setLoader(false);
    }
  };

  const closeModal = () => {
    setSelectedTask(null);
    setShowModal(false);
  };
  useEffect(() => {
    getAllTasks();
  }, []);

  useEffect(() => {
    const completedTask = allTasks.filter(
      (task) => task.status === "completed"
    );
    const company = completedTask.map((data) => {
      return data.companyName;
    });
    setCompanyName(company);
    setCompletedTasks(completedTask);
  }, [allTasks]);

  const getAllTasks = async () => {
    setLoader(true);
    try {
      const AllTask = await Apiservice.technicianTask();
      const Tasks = AllTask.data.Results;
      const mergedTasks = Tasks.reduce((acc, curr) => {
        acc.push(...curr.technicians[0]?.tasks);
        return acc;
      }, []);
      const completedTasks = mergedTasks.filter(
        (task) => task.technicianDetails.email === userData
      );
      setAllTasks(completedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoader(false);
    }
  };

  // const handleDateChange = (date) => {
  //   setSelectedDate(date);
  // };

  // const clearFilter = () => {
  //   setSelectedDate(null);
  // };

  // const filteredData = selectedDate ? completedTasks.filter((task) => moment(task.startDate).isSame(selectedDate, 'day')) : data;

  const onChangeMonth = (date, dateString) => {
    if (date) {
      setSelectedMonth(date.month() + 1);
    } else {
      setSelectedMonth(null);
    }
  };

  const filteredData = completedTasks.filter((entry) => {
    const entryMonth = moment(entry.startDate).month() + 1;
    return selectedMonth === null || entryMonth === selectedMonth;
  });

  return (
    <>
      {loader && <Loader show={loader} />}

      <Menus />
      <div className="container">
        <div>
          <Heading heading="Completed Task Lists" />
        </div>
        <div className="d-flex justify-content-end">
          <DatePicker
            className=" col-5 d-flex flex-column"
            onChange={onChangeMonth}
            picker="month"
          />
        </div>
        {filteredData !== undefined &&
          filteredData.map((task, index) => {
            const QrCodeCategory = task?.QrCodeCategory?.length > 0 ? task?.QrCodeCategory : task?.noqrcodeService;
            return (
              <>
                {
                  task.status === "completed" && (
                    <div
                      className="card mb-3 mt-3 d-flex flex-column align-items-center"
                      key={task._id}
                    >
                      <div className="col-12 taskcompanyheader">
                        <div className="fonts13 fontWeight p-2 ">
                          {" "}
                          Customer ----- {task.companyName}{" "}
                        </div>
                        <p style={{ fontSize: "10px" }}> {task.technicianStartDate} </p>
                      </div>

                      <div className="col-12 d-md-flex flex-md-column justify-content-start align-items-center px-3 mt-2 p-2">
                        {/* {task.serviceName &&
                        task.serviceName.map((serviceName, index) => (
                          <div key={index} className="mb-2">
                            <h5 className="fonts13 textLeft">
                              {index + 1}. {serviceName}
                            </h5>
                          </div>
                        ))} */}
                        {QrCodeCategory &&
                          QrCodeCategory.map((serviceName, index) => {
                            const category = serviceName.category;
                            const isLastItem =
                              index === QrCodeCategory.length - 1;
                            return (
                              <div key={index} className="mb-2">
                                <div>
                                  <div
                                    className="fonts13 textLeft"
                                    style={{ fontWeight: "700" }}
                                  >
                                    {serviceName.category} :
                                  </div>
                                  {serviceName.subCategory.map(
                                    (subItem, subIndex) => (
                                      <div
                                        key={subIndex}
                                        className="mt-1 d-flex flex-row justify-content-between align-items-center"
                                      >
                                        <div className="d-flex align-items-center fonts13 textLeft p-2">
                                          {subIndex + 1}. {subItem}
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                                {isLastItem ? "" : <hr />}
                              </div>
                            );
                          })}

                        {task?.noqrcodeService && QrCodeCategory[0]?.category == 'Rodent Pro' &&
                          task?.noqrcodeService.map((serviceName, index) => {
                            const category = serviceName.category;
                            const isLastItem =
                              index === task?.noqrcodeService.length - 1;
                            return (
                              <div key={index} className="mb-2">
                                <div>
                                  <div
                                    className="fonts13 textLeft"
                                    style={{ fontWeight: "700" }}
                                  >
                                    {serviceName.category} :
                                  </div>
                                  {serviceName.subCategory.map(
                                    (subItem, subIndex) => (
                                      <div
                                        key={subIndex}
                                        className="mt-1 d-flex flex-row justify-content-between align-items-center"
                                      >
                                        <div className="d-flex align-items-center fonts13 textLeft p-2">
                                          {subIndex + 1}. {subItem}
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                                {isLastItem ? "" : <hr />}
                              </div>
                            );
                          })}
                      </div>
                      <div className="col-2 d-flex justify-content-center mt-2 mb-2">
                        <button
                          onClick={() => handleViewDetails(task._id)}
                          className="btn btn-primary btn-sm"
                          style={{ fontSize: "9px" }}
                          type="button"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  )
                  // :
                  // <div>No Assigned Task Found</div>
                }
              </>
            );
          })}
      </div>
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Task Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="col-12">
          <div></div>
          <>
            <div
              className="d-flex flex-column align-items-center mt-2"
            // style={{ padding: "5px 20px 5px 20px" }}
            >
              <div className="col-12 d-flex flex-row">
                <div className="col-5 d-flex align-items-center">
                  <text style={{ fontSize: "12px" }} className="allHistTitle">
                    Service Name{" "}
                  </text>
                </div>
                <div className="col-1 d-flex justify-content-start align-items-center">
                  {" "}
                  :{" "}
                </div>
                <div className="col-7 d-flex flex-column justify-content-start align-items-start">
                  {selectedTaskDatas && (
                    selectedTaskDatas.QrCodeCategory && selectedTaskDatas.QrCodeCategory.length > 0 ? (
                      selectedTaskDatas.QrCodeCategory.map((category, index) => (
                        <div key={index}>
                          <div className="fonts13 textLeft" style={{ fontWeight: "700" }}>
                            {category.category} :
                          </div>
                          {category.subCategory.map((subItem, subIndex) => (
                            <div key={`${index}-${subIndex}`} style={{ fontSize: "12px" }}>
                              {subIndex + 1}. {subItem}
                            </div>
                          ))}
                        </div>
                      ))
                    ) : (
                      selectedTaskDatas.noqrcodeService && selectedTaskDatas.noqrcodeService.length > 0 && (
                        selectedTaskDatas.noqrcodeService.map((category, index) => (
                          <div key={index}>
                            <div className="fonts13 textLeft" style={{ fontWeight: "700" }}>
                              {category.category} :
                            </div>
                            {category.subCategory.map((subItem, subIndex) => (
                              <div key={`${index}-${subIndex}`} style={{ fontSize: "12px" }}>
                                {subIndex + 1}. {subItem}
                              </div>
                            ))}
                          </div>
                        ))
                      )
                    )
                  )}


                  {selectedTaskDatas && selectedTaskDatas.QrCodeCategory && selectedTaskDatas.QrCodeCategory.length > 0 && selectedTaskDatas.QrCodeCategory[0]?.category === 'Rodent Pro' && selectedTaskDatas.noqrcodeService && (
                    selectedTaskDatas.noqrcodeService.map((category, index) => (
                      <div key={index}>
                        <div className="fonts13 textLeft" style={{ fontWeight: "700" }}>
                          {category.category} :
                        </div>
                        {category.subCategory && category.subCategory.map((subItem, subIndex) => (
                          <div key={`${index}-${subIndex}`} style={{ fontSize: "12px" }}>
                            {subIndex + 1}. {subItem}
                          </div>
                        ))}
                      </div>
                    ))
                  )}


                </div>
              </div>

              <div className="col-12 d-flex flex-row mt-2">
                <div className="col-5 d-flex align-items-center">
                  <text style={{ fontSize: "12px" }} className="allHistTitle">
                    Company Name{" "}
                  </text>
                </div>
                <div className="col-1"> : </div>
                <div className="col-7 d-flex justify-content-start align-items-center">
                  <text style={{ fontSize: "12px" }} className="allHistText">
                    {selectedTaskDatas?.companyName}
                  </text>
                </div>
              </div>

              <div className="col-12 d-flex flex-row mt-2">
                <div className="col-5 d-flex align-items-center">
                  <text style={{ fontSize: "12px" }} className="allHistTitle">
                    Assigned Date{" "}
                  </text>
                </div>
                <div className="col-1"> : </div>
                <div className="col-7 d-flex justify-content-start align-items-center">
                  <text style={{ fontSize: "12px" }} className="allHistText">
                    {moment(selectedTaskDatas?.startDate).format("DD-MM-YYYY")}
                  </text>
                </div>
              </div>

              <div className="col-12 d-flex flex-row mt-2">
                <div className="col-5 d-flex align-items-center">
                  <text style={{ fontSize: "12px" }} className="allHistTitle">
                    Completed Date{" "}
                  </text>
                </div>
                <div className="col-1"> : </div>
                <div className="col-7 d-flex justify-content-start align-items-center">
                  <text style={{ fontSize: "12px" }} className="allHistText">
                    {selectedTaskDatas?.technicianStartDate}
                  </text>
                </div>
              </div>

              <div className="col-12 d-flex flex-row mt-2">
                <div className="col-5 d-flex align-items-center">
                  <text style={{ fontSize: "12px" }} className="allHistTitle">
                    Chemicals Used{" "}
                  </text>
                </div>
                <div className="col-1"> : </div>
                <div className="col-7 d-flex justify-content-start align-items-center">
                  <text style={{ fontSize: "12px" }} className="allHistText">
                    {selectedTaskDatas?.completedDetails?.chemicalsName.map((chemical, index) => {
                      return (
                        <div key={index}>
                          {index + 1}. {chemical}
                        </div>
                      )
                    })}
                  </text>
                </div>
              </div>

              <div className="col-12 d-flex flex-row mt-2">
                <div className="col-5 d-flex align-items-center">
                  <text style={{ fontSize: "12px" }} className="allHistTitle">
                    Description{" "}
                  </text>
                </div>
                <div className="col-1"> : </div>
                <div className="col-7 d-flex justify-content-start align-items-center">
                  <text style={{ fontSize: "12px" }} className="allHistText">
                    {selectedTaskDatas?.description}
                  </text>
                </div>
              </div>

              <div className="col-12 d-flex flex-row mt-2">
                <div className="col-5 d-flex align-items-center">
                  <text style={{ fontSize: "12px" }} className="allHistTitle">
                    Recommendation{" "}
                  </text>
                </div>
                <div className="col-1"> : </div>
                <div className="col-7 d-flex justify-content-start align-items-center">
                  <text style={{ fontSize: "12px" }} className="allHistText">
                    <div>
                      {selectedTaskDatas?.completedDetails?.recommendation
                        ? selectedTaskDatas?.completedDetails?.recommendation
                        : "-"}
                    </div>
                  </text>
                </div>
              </div>
            </div>
          </>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CompletedTasks;
