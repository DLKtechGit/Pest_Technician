import React, { useEffect, useState } from "react";
import Menus from "../../Screens/Customer/Home/Menus/Menus";
import { Heading } from "../../Reusable/Headings/Heading";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { setTaskDetailsAction } from "../../Redux/Action/Action";
import moment from "moment";
import { setCategoryAction } from "../../Redux/Action/Action";
import { setServiceNameAction } from "../../Redux/Action/Action";
import ApiService from "../../Services/TaskServices";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../Reusable/Loader";

const MyTaskList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  let { id } = useParams();

  const searchParamsData = location.state?.searchParamsData;
  const [customerData, setCustomerData] = useState({});
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [customer, setCustomer] = useState();
  const [serviceName, setServiceName] = useState([]);
  const [subcatId, setSubcatId] = useState();
  const [customerDetails, setCustomerDetails] = useState();
  const [taskDetails, setTaskDetails] = useState([]);
  const [taskSkip, setTaskskip] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [subcagorytId, setSubcagorytId] = useState("");
  const [skipTaskId, setSkipTaskId] = useState("");
  const [loader, setLoader] = useState(false)

  // useEffect(() => {
  //   const handlePopState = (event) => {
  //     event.preventDefault();
  //     navigate(0); 
  //   };

  //   window.history.pushState(null, null, window.location.href);
  //   window.addEventListener('popstate', handlePopState);

  //   return () => {
  //     window.removeEventListener('popstate', handlePopState);
  //   };
  // }, [navigate]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("login") === 'true';
    const location = localStorage.getItem('location')
    if (!isLoggedIn) {
      navigate("/");
      return;
    }
    else if (location === '/chemical/list')
      navigate('/chemical/list')

  }, [])



  useEffect(() => {
    getalltaskByCustomerId();
    setTaskskip("");
  }, [taskSkip]);

  useEffect(() => {
    localStorage.setItem("location", window.location.pathname);
    const taskid = customerData._id;
    setSelectedTaskId(taskid);

    const tech = customerData.technicians;
    setCustomer(tech);

    const custo = customerData.customerDetails;
    setCustomerDetails(custo);
  }, [customerData]);

  useEffect(() => {
    customer &&
      customer.map((data) => {
        const alls = data.tasks;
        const alldatas = alls.filter(
          (item) => item.isDelete === false && (item.status === "start" || item.status === "ongoing")
        );
        setTaskDetails(alldatas);
      });
  }, [customer]);

  const technicianID = useSelector((state) => state.user.userData._id);

  useEffect(() => {
    const servicename =
      taskDetails && taskDetails.map((service) => service.serviceName);
    setServiceName(servicename);
  }, [taskDetails]);

  useEffect(() => {
    handleTaskDetails();
  }, []);

  useEffect(() => {
    if (taskDetails) {
      let lastSubcatId = null;
      taskDetails.forEach((task) => {
        const QrCodeCategory = task.QrCodeCategory;
        QrCodeCategory &&
          QrCodeCategory.forEach((category) => {
            const subCategoryStatus = category.subCategoryStatus;
            subCategoryStatus &&
              subCategoryStatus.forEach((item) => {
                lastSubcatId = item._id;
              });
          });
      });
      setSubcatId(lastSubcatId);
    }
  }, [taskDetails]);

  useEffect(() => {
    getalltaskByCustomerId();
  }, []);

  const handleCloseModal = () => {
    // Close the modal
    setShowModal(false);
  };

  const handleModelOpen = (subCategoryId, taskId) => {
    setSubcagorytId(subCategoryId);
    setSkipTaskId(taskId);
    setShowModal(true);
  };

  const getalltaskByCustomerId = async () => {
    setLoader(true)
    try {
      const res = await ApiService.getTaskByCustomerId({
        customeID: id,
        technicianID: technicianID,
      });

      const finalTaskData = res.data.data[0];

      if (res.status === 200) {
        setCustomerData(finalTaskData);
        console.log("task fetched successfully");
      } else {
        console.log("task not found");
      }
    } catch (error) {
      console.error("Error occurred while fetching tasks:", error);
    } finally {
      setLoader(false)
    }
  };

  const handleViewDetails = (taskId, subItem, category, _id) => {
    dispatch(setCategoryAction(category));
    dispatch(setServiceNameAction(subItem));
    const selectedTask = taskDetails.find((task) => task._id === taskId);
    dispatch(
      setTaskDetailsAction(selectedTask, customerDetails, selectedTaskId)
    );
    localStorage.setItem("subItem", subItem);
    navigate("/taskdetails", {
      state: {
        serviceName: subItem,
        category: category,
        taskId: taskId,
        _id: _id,
      },
    });
  };

  const handleTaskDetails = () => {
    // const customerTasks = customer.map((data) => {
    //   return data.tasks;
    // });
    // const allTasks = [].concat(...customerTasks);
    // setTaskDetails(allTasks);
  };

  const handleSkipStatus = async () => {
    setLoader(true)
    const selectedTask = taskDetails.find((task) => task._id === skipTaskId);
    const checkQr = selectedTask?.noqrcodeService?.length  == 1 ? 0 : 1;
    try {
      const Generalresponse = await ApiService.GetGeneralFalseStatus({
        taskItemId: skipTaskId,checkQr
      });
      const GeneralTrueresponse = await ApiService.GetGeneraltrueStatus({
        taskItemId: skipTaskId,
      });
      const GeneralNoQrresponse = await ApiService.GetNoQrGeneralFalseStatus({
        taskItemId: skipTaskId,
      });
      const GeneralNoQrTrueresponse = await ApiService.GetNoQrGeneraltrueStatus({
        taskItemId: skipTaskId,
      });
      
      if (
        Generalresponse?.data?.subCategoryStatusWithFalseStatus?.length > 1 ||
        (!selectedTask?.Rodentstatus &&
          selectedTask?.QrCodeCategory?.length > 1 &&
          GeneralTrueresponse?.data?.subCategoryStatusWithFalseStatus?.length >
          0) || (selectedTask?.Rodentstatus == false && selectedTask?.QrCodeCategory?.length == 1 && selectedTask?.noqrcodeService?.length == 1 && GeneralNoQrTrueresponse.data?.subCategoryStatusWithFalseStatus?.length >
            0)
      ) {
        const res = await ApiService.UpdateSkipStatus({
          taskId: selectedTaskId,
          taskItemId: skipTaskId,
          status: true,
          skip: true,
          subcatId: subcagorytId,
          checkQr:checkQr
        });
        setTaskskip(true);
        setShowModal(false);
      } else if (
        GeneralTrueresponse.data?.subCategoryStatusWithFalseStatus?.length >= 1
      ) {
        const res = await ApiService.UpdateSkipStatus({
          taskId: selectedTaskId,
          taskItemId: skipTaskId,
          status: true,
          skip: true,
          subcatId: subcagorytId,
          checkQr:checkQr
        });
        navigate("/chemical/list");
      } else if (selectedTask?.noqrcodeService?.length > 0 && GeneralNoQrresponse.data?.subCategoryStatusWithFalseStatus?.length > 1) {
        const res = await ApiService.UpdateNoQrSkipStatus({
          taskId: selectedTaskId,
          taskItemId: skipTaskId,
          status: true,
          skip: true,
          subcatId: subcagorytId,
          checkQr:checkQr
        });
        setTaskskip(true);
        setShowModal(false);
      } else if (
        GeneralNoQrTrueresponse.data?.subCategoryStatusWithFalseStatus?.length >= 1
      ) {
        const res = await ApiService.UpdateNoQrSkipStatus({
          taskId: selectedTaskId,
          taskItemId: skipTaskId,
          status: true,
          skip: true,
          subcatId: subcagorytId,
          checkQr:checkQr
        });
        navigate("/chemical/list");
      } else {
        toast.error("Can't able to skip this task");
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error occurred while handling skip status:", error);
    }
    finally {
      setLoader(false)
    }
  };

  return (

    <>


      {loader && (
        <Loader show={loader} />

      )}

      <div className="tech-full">
        <Menus />
        <div className="container">
          <Heading heading="Task List" />
          {taskDetails !== undefined &&
            taskDetails.map((task, index) => {
              const QrCodeCategory = task.QrCodeCategory;
              const noqrcodeService = task.noqrcodeService;
              const serviceList = QrCodeCategory.length > 0 ? QrCodeCategory : noqrcodeService;
              const taskStatus = task?.status;
              let qrLng = 1;
              if(QrCodeCategory?.length == 2)
              {
                const roSerice = task?.qrDetails.filter((item)=> item.serviceName == 'Rodent Pro');
                qrLng = roSerice[0]?.titles.filter((item)=> item.qrScanned === false).length;
              }
              else
              {
                qrLng = task?.qrDetails[0]?.titles.filter((item) => item.qrScanned === false).length;
              }
              
              return (
                <React.Fragment key={index}>
                  {["start", "ongoing"].includes(task.status) && (
                    <div
                      className="card mb-3 mt-3 d-flex flex-column align-items-center"
                      key={task._id}
                    >
                      <div className="col-12 taskcompanyheader">
                        <div className="fonts13 fontWeight p-2">
                          {`Start Date ----`}{" "}
                          {moment(task.startDate).format("DD-MMM-YYYY")}
                        </div>
                      </div>
                      <div className="col-12 d-md-flex flex-md-column justify-content-start align-items-center px-3 mt-2 p-2">
                        {serviceList?.map((serviceName, index) => {
                          const category = serviceName.category;
                          const isLastItem =
                            index === serviceList.length - 1;
                          return (
                            <div key={index} className="mb-2">
                              <div>
                                <div
                                  className="fonts13 textLeft"
                                  style={{ fontWeight: "700" }}
                                >
                                  {category} :
                                </div>
                                {serviceName?.subCategory?.map(
                                  (subItem, subIndex) => (
                                    <div
                                      key={subIndex}
                                      className="mt-1 d-flex flex-row justify-content-between align-items-center"
                                    >
                                      <div className="d-flex align-items-center fonts13 textLeft p-2">
                                        {subIndex + 1}. {subItem}
                                      </div>
                                      <div className="col-3 d-flex justify-content-center gap-2">
                                        {category === "Rodent Pro" &&
                                          subItem === "Rodent Pro" &&
                                          !task.Rodentstatus && (
                                            <button
                                              onClick={() =>
                                                handleViewDetails(
                                                  task._id,
                                                  subItem,
                                                  category,
                                                  serviceName.subCategoryStatus[
                                                    subIndex
                                                  ]._id
                                                )
                                              }
                                              className="btn btn-primary btn-sm"
                                              style={{ fontSize: "10px" }}
                                              type="button"
                                            >
                                              Start
                                            </button>
                                          )
                                          ? !task.Rodentstatus && (
                                            <button
                                              onClick={() =>
                                                handleViewDetails(
                                                  task._id,
                                                  subItem,
                                                  category,
                                                  serviceName
                                                    .subCategoryStatus[
                                                    subIndex
                                                  ]._id
                                                )
                                              }
                                              className="btn btn-primary btn-sm"
                                              style={{ fontSize: "10px" }}
                                              type="button"
                                            >
                                              Start
                                            </button>
                                          )
                                          : category == "Rodent Pro" &&(
                                            qrLng == 0  ? <button
                                              className="btn btn-success btn-sm px-2"
                                              style={{ fontSize: "10px" }}
                                              type="button"
                                              disabled={true}
                                            >
                                              Completed
                                            </button> : <button
                                              onClick={() =>
                                                handleViewDetails(
                                                  task._id,
                                                  subItem,
                                                  category,
                                                  serviceName
                                                    .subCategoryStatus[
                                                    subIndex
                                                  ]._id
                                                )
                                              }
                                              className="btn btn-primary btn-sm"
                                              style={{ fontSize: "10px" }}
                                              type="button"
                                            >
                                              Start
                                            </button>
                                          )}
                                        {category !== "Rodent Pro" &&
                                          serviceName.subCategoryStatus[
                                            subIndex
                                          ].status === false && (
                                            <>
                                              <button
                                                onClick={() =>
                                                  handleViewDetails(
                                                    task._id,
                                                    serviceName
                                                      .subCategoryStatus[
                                                      subIndex
                                                    ].subCategory,
                                                    category,
                                                    serviceName
                                                      .subCategoryStatus[
                                                      subIndex
                                                    ]._id,

                                                  )
                                                }
                                                className="btn btn-primary btn-sm"
                                                style={{ fontSize: "10px" }}
                                                type="button"
                                                key={subIndex}
                                              >
                                                Start
                                              </button>
                                            </>
                                          )}
                                        {category !== "Rodent Pro" && (
                                          <>
                                            {serviceName.subCategoryStatus[
                                              subIndex
                                            ].skip === true &&
                                              serviceName.subCategoryStatus[
                                                subIndex
                                              ].status === true ? (
                                              <button
                                                className="btn btn-danger btn-sm px-2"
                                                style={{ fontSize: "10px" }}
                                                type="button"
                                                key={subIndex}
                                                disabled={true}
                                              >
                                                Skipped
                                              </button>
                                            ) : serviceName.subCategoryStatus[
                                              subIndex
                                            ].skip === false &&
                                              serviceName.subCategoryStatus[
                                                subIndex
                                              ].status === true ? (
                                              <button
                                                className="btn btn-success btn-sm px-2"
                                                style={{ fontSize: "10px" }}
                                                type="button"
                                                key={subIndex}
                                                disabled={true}
                                              >
                                                {QrCodeCategory.length > 0 ? 'Scanned' : 'Completed'}
                                              </button>
                                            ) : (
                                              <button
                                                onClick={() =>
                                                  handleModelOpen(
                                                    serviceName
                                                      .subCategoryStatus[
                                                      subIndex
                                                    ]._id,
                                                    task._id
                                                  )
                                                }
                                                className="btn btn-secondary btn-sm px-2"
                                                style={{ fontSize: "10px" }}
                                                type="button"
                                                key={subIndex}
                                              >
                                                Skip
                                              </button>
                                            )}

                                            <Modal
                                              show={showModal}
                                              onHide={handleCloseModal}
                                            >
                                              <Modal.Header closeButton>
                                                <Modal.Title>
                                                  Confirm Skip
                                                </Modal.Title>
                                              </Modal.Header>
                                              <Modal.Body>
                                                Are you sure you want to skip
                                                this task?
                                              </Modal.Body>
                                              <Modal.Footer>
                                                <Button
                                                  variant="secondary"
                                                  onClick={handleCloseModal}
                                                >
                                                  Cancel
                                                </Button>
                                                <Button
                                                  variant="primary"
                                                  onClick={() =>
                                                    handleSkipStatus()
                                                  }
                                                >
                                                  OK
                                                </Button>
                                              </Modal.Footer>
                                            </Modal>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                              {isLastItem ? "" : <hr />}
                            </div>
                          );
                        })}





                        {QrCodeCategory?.length > 0 && noqrcodeService?.length > 0 && noqrcodeService?.map((serviceName, index) => {
                          const category = serviceName.category;
                          const isLastItem =
                            index === noqrcodeService.length - 1;
                          return (
                            <div key={index} className="mb-2">
                              <div>
                                <div
                                  className="fonts13 textLeft"
                                  style={{ fontWeight: "700" }}
                                >
                                  {category} :
                                </div>
                                {serviceName?.subCategory?.map(
                                  (subItem, subIndex) => (
                                    <div
                                      key={subIndex}
                                      className="mt-1 d-flex flex-row justify-content-between align-items-center"
                                    >
                                      <div className="d-flex align-items-center fonts13 textLeft p-2">
                                        {subIndex + 1}. {subItem}
                                      </div>
                                      <div className="col-3 d-flex justify-content-center gap-2">
                                        {category === "Rodent Pro" &&
                                          subItem === "Rodent Pro" &&
                                          !task.Rodentstatus && (
                                            <button
                                              onClick={() =>
                                                handleViewDetails(
                                                  task._id,
                                                  subItem,
                                                  category,
                                                  serviceName.subCategoryStatus[
                                                    subIndex
                                                  ]._id
                                                )
                                              }
                                              className="btn btn-primary btn-sm"
                                              style={{ fontSize: "10px" }}
                                              type="button"
                                            >
                                              Start
                                            </button>
                                          )
                                          ? !task.Rodentstatus && (
                                            <button
                                              onClick={() =>
                                                handleViewDetails(
                                                  task._id,
                                                  subItem,
                                                  category,
                                                  serviceName
                                                    .subCategoryStatus[
                                                    subIndex
                                                  ]._id
                                                )
                                              }
                                              className="btn btn-primary btn-sm"
                                              style={{ fontSize: "10px" }}
                                              type="button"
                                            >
                                              Start
                                            </button>
                                          )
                                          : category == "Rodent Pro" && serviceName.subCategoryStatus[
                                            subIndex
                                          ].status === true && (
                                            <button
                                              className="btn btn-success btn-sm px-2"
                                              style={{ fontSize: "10px" }}
                                              type="button"
                                              disabled={true}
                                            >
                                              Completed
                                            </button>
                                          )}
                                        {category !== "Rodent Pro" &&
                                          serviceName.subCategoryStatus[
                                            subIndex
                                          ].status === false && (
                                            <>
                                              <button
                                                onClick={() =>
                                                  handleViewDetails(
                                                    task._id,
                                                    serviceName
                                                      .subCategoryStatus[
                                                      subIndex
                                                    ].subCategory,
                                                    category,
                                                    serviceName
                                                      .subCategoryStatus[
                                                      subIndex
                                                    ]._id,

                                                  )
                                                }
                                                className="btn btn-primary btn-sm"
                                                style={{ fontSize: "10px" }}
                                                type="button"
                                                key={subIndex}
                                              >
                                                Start
                                              </button>
                                            </>
                                          )}
                                        {category !== "Rodent Pro" && (
                                          <>
                                            {serviceName.subCategoryStatus[
                                              subIndex
                                            ].skip === true &&
                                              serviceName.subCategoryStatus[
                                                subIndex
                                              ].status === true ? (
                                              <button
                                                className="btn btn-danger btn-sm px-2"
                                                style={{ fontSize: "10px" }}
                                                type="button"
                                                key={subIndex}
                                                disabled={true}
                                              >
                                                Skipped
                                              </button>
                                            ) : serviceName.subCategoryStatus[
                                              subIndex
                                            ].skip === false &&
                                              serviceName.subCategoryStatus[
                                                subIndex
                                              ].status === true ? (
                                              <button
                                                className="btn btn-success btn-sm px-2"
                                                style={{ fontSize: "10px" }}
                                                type="button"
                                                key={subIndex}
                                                disabled={true}
                                              >
                                                {QrCodeCategory.length > 0 ? 'Scanned' : 'Completed'}
                                              </button>
                                            ) : (
                                              <button
                                                onClick={() =>
                                                  handleModelOpen(
                                                    serviceName
                                                      .subCategoryStatus[
                                                      subIndex
                                                    ]._id,
                                                    task._id
                                                  )
                                                }
                                                className="btn btn-secondary btn-sm px-2"
                                                style={{ fontSize: "10px" }}
                                                type="button"
                                                key={subIndex}
                                              >
                                                Skip
                                              </button>
                                            )}

                                            <Modal
                                              show={showModal}
                                              onHide={handleCloseModal}
                                            >
                                              <Modal.Header closeButton>
                                                <Modal.Title>
                                                  Confirm Skip
                                                </Modal.Title>
                                              </Modal.Header>
                                              <Modal.Body>
                                                Are you sure you want to skip
                                                this task?
                                              </Modal.Body>
                                              <Modal.Footer>
                                                <Button
                                                  variant="secondary"
                                                  onClick={handleCloseModal}
                                                >
                                                  Cancel
                                                </Button>
                                                <Button
                                                  variant="primary"
                                                  onClick={() =>
                                                    handleSkipStatus()
                                                  }
                                                >
                                                  OK
                                                </Button>
                                              </Modal.Footer>
                                            </Modal>
                                          </>
                                        )}
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
                    </div>
                  )}
                </React.Fragment>
              );
            })}
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default MyTaskList;