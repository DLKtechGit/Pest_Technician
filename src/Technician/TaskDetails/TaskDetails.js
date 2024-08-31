import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Menus from "../../Screens/Customer/Home/Menus/Menus";
import { Heading } from "../../Reusable/Headings/Heading";
import s2 from "../../Assets/Images/s2.webp";
import Models from "../../Reusable/Model";
import { Modal, Button } from "react-bootstrap";
import moment from "moment";
import { useLocation, useNavigate } from "react-router-dom";
import ApiService from "../../Services/TaskServices";
import { fetchTasks } from "../../Redux/Action/Action";
import { toast, ToastContainer } from "react-toastify";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Spinner from "react-bootstrap/Spinner";
import { Circles } from "react-loader-spinner";
import Loader from "../../Reusable/Loader";

const TaskDetails = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  // const selectedTaskData = useSelector(
  //   (state) => state?.task?.task?.selectedTask
  // );
  const selectedTaskIDData = useSelector(
    (state) => state?.task?.task?.selectedTaskId
  );

  const customerDetailsData = useSelector(
    (state) => state?.task?.task?.customerDetails
  );
  const [skipConfirmed, setSkipConfirmed] = useState({});
  const [task, setTask] = useState([]);
  const category = useSelector((state) => state.CategoryReducer.category);
  const serviceName = useSelector(
    (state) => state.ServiceNameReducer.serviceName
  );

  const [ongoing, setOngoing] = useState("ongoing");
  const [showForm, setShowForm] = useState(false);
  const [startTask, setStartTask] = useState(false);
  const [otherTech, setOtherTech] = useState("");
  const [taskItemId, setTaskItemID] = useState("");
  const [taskId, setTaskID] = useState("");
  const [servicename, setServiceName] = useState([]);
  const [serviceImages, setServiceImages] = useState([]);
  const [titleId, setTitleId] = useState();
  const [titlesData, setTitlesData] = useState([]);
  const [falseQrScannedCount, setFalseQrScannedCount] = useState();
  const [selectedTaskData, setselectedTaskData] = useState({});
  const [customerData, setCustomerData] = useState({});
  const [subid, setSubid] = useState("");
  const [qrDetails, setQrDetails] = useState();
  const [loader, setLoader] = useState(false);
  const [othertechhide, setOtherTechHide] = useState(true);
  const [rodentQrdetails, setRodentQrdetails] = useState();

  const [qrparID, setQrperID] = useState({});

  const navigate = useNavigate();


  

  useEffect(()=>{
    
    const isLoggedIn = localStorage.getItem("login") === 'true'; 
    const location = localStorage.getItem('location')
    if (!isLoggedIn) {
      navigate("/"); 
      return; 
    }
    else if(location === '/chemical/list')
      navigate('/chemical/list')


    const location_check = localStorage.getItem("location_check");
    if(location_check == 1)
    {
      const currentDate = moment().format("DD-MM-YYYY");
      const currentTime = moment().format("HH:mm");
      setOngoing("ongoing");
      const technicianStartDate = currentDate;
      const technicianStartTime = currentTime;
      navigate("/start/task", {
        state: {
          ongoing: ongoing,
          technicianStartDate: technicianStartDate,
          technicianStartTime: technicianStartTime,
          subid: subid,
          serviceName: serviceName,
        },
      });
    }
  },[])


  useEffect(() => {
    const subID = state?._id;
    setSubid(subID);
    getTaskById();
  }, [state]);

  useEffect(() => {
    localStorage.setItem("location", window.location.pathname);
    localStorage.setItem('subid',state?._id)
    
    if (selectedTaskData && selectedTaskData.qrDetails) {
      const qrperIDArray = selectedTaskData.qrDetails.reduce((acc, e) => {
        if (e.serviceName === "General Pest Control") {
          setQrDetails(e.serviceName);
          const titles = e.titles.filter((item) => item.qrScanned === true);
          if (titles.length > 0) {
            acc.push(titles[0]);
          }
        }
        return acc;
      }, []);

      // Set qrperID state after processing all qrDetails
      if (qrperIDArray.length > 0) {
        setQrperID(qrperIDArray[0]);
      }
    }
  }, [selectedTaskData]);

  const getTaskById = async () => {
    const titleId = taskItemId ? taskItemId : state?.taskId;
    setLoader(true);
    try {
      const response = await ApiService.GetTaskByID(titleId);
      setCustomerData(response?.data?.task.customerDetails);
      const selectedData = response?.data?.task;
      setTaskID(selectedData._id);
      const finaldata = selectedData.technicians[0].tasks.filter(
        (e) => e._id === titleId
      );
      setselectedTaskData(finaldata[0]);
      finaldata[0]?.otherTechnicianName
        ? setOtherTechHide(false)
        : setOtherTechHide(true);
      const taskData = finaldata[0]?.qrDetails;
      const rodentProData = taskData.filter(
        (data) => data.serviceName === "Rodent Pro"
      );
      rodentProData &&
        rodentProData.map((item) => {
          const falseQrScannedCount = item.titles.reduce((count, title) => {
            if (!title.qrScanned) {
              return count + 1;
            } else {
              return count;
            }
          }, 0);
          setFalseQrScannedCount(falseQrScannedCount);
        });
      setTask(taskData);
    } catch (error) {
      console.error("Error fetching task:", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    setTaskItemID(selectedTaskData?._id);
    // setTaskID(selectedTaskIDData);
    const getServiceName = selectedTaskData.serviceName;
    setServiceName(getServiceName);

    const serviceimages = selectedTaskData.serviceImage;
    setServiceImages(serviceimages);

    selectedTaskData?.qrDetails?.map((data, index) => {
      const titlesData = data?.titles;
      if (category === data?.serviceName) {
        const firstTitleId = titlesData[0]?._id;
        setTitleId(firstTitleId);
        setTitlesData(titlesData);
      }
    });
  }, [selectedTaskData, selectedTaskIDData, titlesData]);

  const handleAddTeamMemberClick = () => {
    setShowForm(true);
  };

  const handleStart = () => {
    setStartTask(true);
  };

  const handleClose = () => {
    setStartTask(false);
  };

  // const

  const serviceIsRodentPro = selectedTaskData?.available === "Yes";

  const handleScan = async () => {
    setLoader(true);
    const currentDate = moment().format("DD-MM-YYYY");
    const currentTime = moment().format("HH:mm");
    setOngoing("ongoing");
    const technicianStartDate = currentDate;
    const technicianStartTime = currentTime;
    try {
      const response = await ApiService.UpdateStatus({
        taskId: taskId,
        titleId: titleId,
        subcatId: state._id,
        taskItemId: taskItemId,
        status: "ongoing",
        taskItemStatus: "ongoing",
        technicianStartDate: technicianStartDate,
        technicianStartTime: technicianStartTime,
      });
      if (response && response.status === 200) {
        const checkQr = selectedTaskData?.noqrcodeService?.length  == 1 ? 0 : 1;
        const res = await ApiService.GetGeneraltrueStatus({
          taskItemId,checkQr
        });
        const genSerice = selectedTaskData?.qrDetails.filter((item)=> item.serviceName == 'General Pest Control');
        const qrLng = genSerice[0]?.titles.filter((item)=> item.qrScanned === true).length;
        if (selectedTaskData?.qrDetails?.length && qrLng == 0 && selectedTaskData?.noqrcodeService?.length == 0 || serviceName == "Rodent Pro") {
          //serviceIsRodentPro === true ||
          const subID = state._id;
          setSubid(subID);
          navigate("/scanqr", {
            state: {
              serviceName: serviceName,
              category: category,
              subid: subid,
            },
          });
        } else {
          navigate("/start/task", {
            state: {
              ongoing: ongoing,
              technicianStartDate: technicianStartDate,
              technicianStartTime: technicianStartTime,
              subid: subid,
              serviceName: serviceName,
            },
          });
        }
      } else {
        console.error(
          `Error: Unable to start the task. Status code: ${
            response ? response.status : "unknown"
          }`
        );
      }
    } catch (error) {
      console.error("Unable to start the task:", error);
    } finally {
      setLoader(false);
    }
  };

  const handleCancel = () => {
    setOtherTech("");
    setShowForm(false);
  };

  const handleAdd = async (event) => {
    setLoader(true);
    event.preventDefault();
    try {
      const response = await ApiService.UpdateOtherTechnician({
        taskId: taskId,
        taskItemId: taskItemId,
        otherTechnicianName: otherTech,
      });

      if (response && response.status === 200) {
        setOtherTechHide(false);
        toast.success("Other technician name added successfully.");
      } else {
        console.error(
          `Error updating other technician name. Status code: ${
            response ? response.status : "unknown"
          }`
        );
      }
    } catch (error) {
      console.error("Error updating other technician's name:", error);
    } finally {
      setLoader(false);
      setShowForm(false);
    }
  };

  const handleInputChange = (event) => {
    const inputvalue = event.target.value;
    setOtherTech(typeof inputvalue === undefined ? "-" : inputvalue);
  };

  const [showModal, setShowModal] = useState(false);
  const [rodentId, setRodentId] = useState(null);

  const handleSkipQRCode = async (rodentId) => {
    setRodentId(rodentId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    // Close the modal
    setShowModal(false);
  };

  useEffect(() => {
    const data =
      selectedTaskData.qrDetails &&
      selectedTaskData.qrDetails.filter((e) => {
        return e.serviceName === "Rodent Pro"; // Added return statement
      });
    console.log("dataaaaaa", data);
    setRodentQrdetails(data);
  }, [selectedTaskData]);

  const handleConfirmModal = async () => {
    
    setLoader(true);
    try {
      const getdata = rodentQrdetails[0].titles;
      const response = await ApiService.GetRodentSkipStatusfalse({
        taskItemId,
      });
      const checkQr = selectedTaskData?.noqrcodeService?.length == 1 ? 0 : 1;
      const Generalresponse = await ApiService.GetGeneralFalseStatus({
        taskItemId,checkQr
      });
      const RodentStatusResponse = await ApiService.GetRodentStatus({
        taskItemId,
      });
      const skipLength = response?.data?.qrDetails[0]?.titles?.length;
      const TotalQrLength = getdata?.length;
      // navigate("/taskdetails", { state: { category: category } });

      // let navigateToTechHome = false;z

      if (TotalQrLength >= skipLength && skipLength !== 1) {
        const res = await ApiService.UpdateRodentSkipStatus({
          taskId: taskId,
          taskItemId: taskItemId,
          skip: true,
          qrScanned: true,
          rodentId: rodentId,
        });
        setShowModal(false);
        navigate("/taskdetails", {
          state: { category: category, taskId: state?.taskId, _id: state._id },
        });
      } else if (
        (skipLength == 1 &&
          !Generalresponse.data?.subCategoryStatusWithFalseStatus &&
          RodentStatusResponse?.data[0]?.Rodentstatus) ||
        (Generalresponse.data?.subCategoryStatusWithFalseStatus?.length == 0 &&
          RodentStatusResponse?.data[0]?.Rodentstatus)
      ) {
        const res = await ApiService.UpdateRodentSkipStatus({
          taskId: taskId,
          taskItemId: taskItemId,
          skip: true,
          qrScanned: true,
          rodentId: rodentId,
        });
        setShowModal(false);
        navigate("/chemical/list", {
          state: {
            technicianStartDate: 0,
            technicianStartTime: 0,
            pauseReason: "",
          },
        });
      } else if (
        skipLength == 1 &&
        RodentStatusResponse?.data[0]?.Rodentstatus
      ) {
        const res = await ApiService.UpdateRodentSkipStatus({
          taskId: taskId,
          taskItemId: taskItemId,
          skip: true,
          qrScanned: true,
          rodentId: rodentId,
        });
        setShowModal(false);
        navigate("/tech/home", { state: { status: "Ongoing" } });
      } else {
        setShowModal(false);
        toast.error("Can't able to skip this task");
      }

      //debugger
      // if (response?.data?.qrDetails[0]?.titles?.length > 1) {
      //   const res = await ApiService.UpdateRodentSkipStatus({
      //     taskId: taskId,
      //     taskItemId: taskItemId,
      //     skip: true,
      //     rodentId: rodentId
      //   });

      //   setSkipConfirmed(prevState => ({
      //     ...prevState,
      //     [rodentId]: true
      //   }));

      //   setShowModal(false);
      //   if (Generalresponse.data?.subCategoryStatusWithFalseStatus?.length > 0) {
      //     navigateToTechHome = true;
      //   }
      //   let mappedData = 0
      //   let filterData = 0
      //   let finalData = 0
      //   // let finalData
      //   response?.data?.qrDetails[0]?.titles?.map((data) => {
      //     if (data.qrScanned && !data.skip) {
      //       mappedData += 1;
      //     }
      //     else if (!data.skip) {
      //       filterData += 1;
      //     }
      //   })
      //   finalData = mappedData + filterData
      //   if (navigateToTechHome) {
      //     navigate('/tech/home', { state: { status: "Ongoing" } });
      //   } else if (response?.data?.qrDetails[0]?.titles?.length == finalData && filterData != finalData && mappedData == 0) {
      //     navigate("/chemical/list", { state: { technicianStartDate: 0, technicianStartTime: 0, pauseReason: "" } });
      //   } else if (response?.data?.qrDetails[0]?.titles?.length == finalData && filterData != finalData ) {
      //     navigate("/chemical/list", { state: { technicianStartDate: 0, technicianStartTime: 0, pauseReason: "" } });
      //   } else {
      //     navigate("/taskdetails", { state: { category: category } });
      //   }
      // } else if (response?.data?.qrDetails[0]?.titles?.length === 1) {
      //   toast.error("Can't able to skip this task");
      // } else {
      //   const res = await ApiService.UpdateRodentSkipStatus({
      //     taskId: taskId,
      //     taskItemId: taskItemId,
      //     skip: true,
      //     qrScanned:true,
      //     rodentId: rodentId
      //   });

      //   setSkipConfirmed(prevState => ({
      //     ...prevState,
      //     [rodentId]: true
      //   }));

      //   setShowModal(false);
      // }
    } catch (error) {
      console.error("Error occurred while handling confirm modal:", error);
      // Handle error appropriately, if needed
    } finally {
      setLoader(false);
    }
  };

  return (
    <>
      {loader && <Loader show={loader} />}
      <Menus />
      <Heading heading="Task Details" />
      <div className="container">
        <div className="row d-flex justify-content-center">
          <div className="col-md-7">
            <div className="details-full p-3 py-4">
              <div className="text-center mt-3">
                <div className="card p-2">
                  <div className="servicename ">
                    <h6 className="fonts13 fontWeight mt-2 "> Services</h6>
                  </div>
                  <div className="d-flex flex-column justify-content-start align-items-center">
                    <h5 className="mt-2 mb-0 fonts12 ">{serviceName}</h5>
                  </div>
                </div>
                <div className="col-12 d-flex flex-column mt-4">
                  {customerData && (
                    <>
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
                        <div className="col-6">
                          <h5
                            className="col-12 fonts12 textLeft"
                            style={{
                              lineBreak: "anywhere",
                              lineHeight: "20px",
                            }}
                          >
                            {customerData.name || "Name Not Available"}
                          </h5>
                        </div>
                      </div>
                      <div className=" col-12 d-flex flex-row align-items-center ">
                        <h5
                          style={{ fontWeight: "bold" }}
                          className="col-5 fonts12 textLeft"
                        >
                          Email
                        </h5>
                        <h5 className="col-2 fonts12 justify-content-center">
                          -
                        </h5>
                        <h5
                          className="col-5 fonts12 textLeft"
                          style={{
                            lineBreak: "anywhere",
                            lineHeight: "20px",
                          }}
                        >
                          {customerData.email}
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
                          {customerData.phoneNumber}
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
                      <div className="d-flex flex-row  align-items-center ">
                        <h5
                          style={{ fontWeight: "bold" }}
                          className="col-5 fonts12 textLeft"
                        >
                          Total No of QR Codes
                        </h5>
                        <h5 className="col-2 fonts12 justify-content-center">
                          -
                        </h5>
                        <h5 className="col-5 fonts12 textLeft mt-2">
                          {titlesData && titlesData.length ? (
                            <h5 className="d-flex flex-column fonts12 textLeft">
                              {titlesData.length}
                            </h5>
                          ) : (
                            "N/A"
                          )}
                        </h5>
                      </div>
                      {category === "Rodent Pro" && (
                        <div className="d-flex flex-row  align-items-center ">
                          <h5
                            style={{ fontWeight: "bold" }}
                            className="col-5 fonts12 textLeft"
                          >
                            No of QR Code - Remaining
                          </h5>
                          <h5 className="col-2 fonts12 justify-content-center">
                            -
                          </h5>
                          <h5 className="col-5 fonts12 textLeft mt-2">
                            {falseQrScannedCount}
                          </h5>
                        </div>
                      )}
                      <div className="d-flex flex-row  align-items-center ">
                        <h5
                          style={{ fontWeight: "bold" }}
                          className="col-5 fonts12 textLeft"
                        >
                          QR Code Titles
                        </h5>
                        <h5 className="col-2 fonts12 justify-content-center">
                          -
                        </h5>
                        <div className="d-flex flex-column">
                          {titlesData && titlesData.length > 0 ? (
                            <React.Fragment>
                              {titlesData.map((title, titleIndex) => (
                                <div
                                  key={titleIndex}
                                  className="d-flex align-items-center gap-2 mt-2"
                                >
                                  <h5 className="d-flex flex-column fonts12 textLeft mb-0">
                                    {titleIndex + 1}. {title.title}
                                  </h5>
                                  {category === "Rodent Pro" &&
                                    (title.skip && title.qrScanned ? (
                                      <button
                                        style={{ fontSize: "10px" }}
                                        type="button"
                                        className="btn btn-danger btn-sm ml-auto"
                                        disabled
                                      >
                                        Skipped
                                      </button>
                                    ) : category === "Rodent Pro" &&
                                      !title.skip &&
                                      title.qrScanned ? (
                                      <button
                                        style={{ fontSize: "10px" }}
                                        type="button"
                                        className="btn btn-success btn-sm ml-auto"
                                        disabled
                                      >
                                        Scanned
                                      </button>
                                    ) : (
                                      <button
                                        style={{ fontSize: "10px" }}
                                        type="button"
                                        className="btn btn-success btn-sm ml-auto"
                                        onClick={() =>
                                          handleSkipQRCode(title._id)
                                        }
                                      >
                                        skip
                                      </button>
                                    ))}
                                </div>
                              ))}
                            </React.Fragment>
                          ) : (
                            <h5 className="d-flex flex-column fonts12 textLeft">
                              N/A
                            </h5>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div
                className="card mt-3"
                style={{ backgroundColor: "#8be97d1f" }}
              >
                <h6 className="pt-1 fonts14 fontWeight mt-2">
                  Task Description
                </h6>
                <div className=" task-des mt-1">
                  <p className="fonts10 p-2">
                    {selectedTaskData?.description ||
                      "Description Not Available"}
                  </p>
                </div>
              </div>
              <div>
                {othertechhide && (
                  <button
                    type="button"
                    style={{ fontSize: "13px" }}
                    onClick={handleAddTeamMemberClick}
                    className="btn btn-outline-secondary mt-3 "
                  >
                    Add Team Member
                  </button>
                )}
              </div>

              {showForm && (
                <div className="d-flex justify-content-center mt-4">
                  <form
                    style={{
                      backgroundColor: "rgba(139, 233, 125, 0.12)",
                      borderRadius: "20px",
                    }}
                    className="col-12 d-flex justify-content-end"
                  >
                    <div className="container col-12 p-3">
                      <h6 className="mb-3 fonts14 fontWeight">
                        Add Technician
                      </h6>
                      <input
                        id="addtechnician"
                        className="form-control mb-3"
                        placeholder="Enter Name"
                        value={otherTech}
                        onChange={handleInputChange}
                        style={{ fontSize: "12px" }}
                      />
                      <p style={{fontSize:"13px",color:"gray"}}> Enter a comma (,) to add multiple technicians. </p>
                      <button
                        className="btn btn-primary fonts12 mt-2 mb-2"
                        onClick={handleAdd}
                        style={{ fontSize: "13px", height: "auto" }}
                      >
                        Add{" "}
                      </button>
                      <button
                        className="btn btn-outline-secondary fonts12 mt-2 mb-2 mx-3"
                        onClick={handleCancel}
                        style={{ fontSize: "13px", height: "auto" }}
                      >
                        Cancel{" "}
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
                {/* <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="btn btn-outline-secondary fonts12"
                >
                  Cancel
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Models
        show={startTask}
        modalTitle="Start Task"
        modalContent="Are you sure want to start the task?"
        onClose={handleClose}
        onConfirm={handleScan}
      />
      <ToastContainer />

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Skip</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to skip this task?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TaskDetails;
