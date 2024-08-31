import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Model from "../../Reusable/Model";
import Menus from "../../Screens/Customer/Home/Menus/Menus";
import clock from "../../Assets/Images/icons8-clock-100.png";
import { useNavigate } from "react-router-dom";
import ApiService from "../../Services/TaskServices";
import { toast, ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";
import moment from "moment";
import Loader from "../../Reusable/Loader";

const StartTask = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const s_subid = localStorage.getItem("subid");
  const s_service = localStorage.getItem("serviceName");
  const s_time = localStorage.getItem("time");
  const serviceNames = s_service ? s_service : location.state?.serviceName;
  const finialTitleData = location.state?.finialTitleData;

  const [time, setTime] = useState(() => {
    const storedStartTime = localStorage.getItem("startTime");
    const storedPauseStartTime = localStorage.getItem("ExactPauseTime");

    if (storedPauseStartTime) {
      const pauseStartTime = JSON.parse(storedPauseStartTime);
      return {
        hours: pauseStartTime.hours,
        minutes: pauseStartTime.minutes,
        seconds: pauseStartTime.seconds,
      };
    } else if (storedStartTime) {
      const startTime = moment(storedStartTime);
      const currentTime = moment();
      const elapsed = moment.duration(currentTime.diff(startTime));
      return {
        hours: Math.floor(elapsed.asHours()),
        minutes: elapsed.minutes(),
        seconds: elapsed.seconds(),
      };
    } else {
      return { hours: 0, minutes: 0, seconds: 0 };
    }
  });

  const [isRunning, setIsRunning] = useState(() => !localStorage.getItem("pauseStartTime"));
  const [pauseStartTime, setPauseStartTime] = useState('');
  const [pauseReason, setPauseReason] = useState("");
  const [stopTask, setStopTask] = useState(false);
  const [showPauseReasonModal, setShowPauseReasonModal] = useState(false);
  const [taskId, setTaskID] = useState("");
  const [qrStatusId, setqrcodeStatusId] = useState([]);
  const [taskItemId, setTaskItemID] = useState("");
  const [serviceName, setServiceName] = useState([]);
  const [title, setTitle] = useState();
  const [maincategory, setMaincategory] = useState();
  const [subCatName, setSubCatNames] = useState([]);
  const [qrId, setQrId] = useState([]);
  const [resume, setResume] = useState(true);
  const [resumeTime, setResumeTime] = useState(null);
  const [pauseTiming, setPauseDuration] = useState("");
  const [getData, setGetdata] = useState([]);
  const [service1, setService1] = useState(false);
  const [rodent, setRodent] = useState(false);
  const [service2, setService2] = useState(false);
  const [subCatId, setSubcatId] = useState("");
  const [rodentSubID, setRodentSubId] = useState("");
  const [loader, setLoader] = useState(false);
  const [stateServicename, setStateServiceName] = useState('')
  const [stateSubid, setStateSubId] = useState('')
  let navigate = useNavigate()


  useEffect(() => {
    console.log('resume');
  }, [resume])

  useEffect(() => {
    const loc = localStorage.getItem('subItem', location?.state?.serviceName)
    const subid = localStorage.getItem('subid', location?.state?.subid)
    setStateServiceName(loc)
    setStateSubId(subid)
  }, [])



  useEffect(() => {
    const locatoin = localStorage.getItem("location")
    const chechstart = localStorage.getItem('StartStatus')
    const subitem = localStorage.getItem('subItem')
    localStorage.setItem("location", window.location.pathname);
    const location_check = localStorage.getItem("location_check");

    if (locatoin === '/tech/home') {
      navigate('/tech/home')
    }
    else if ((locatoin === '/taskdetails' && chechstart === 'false') && (subitem && subitem === 'Rodent Pro')) {
      navigate("/taskdetails", {
        state: { taskId: selectedTaskDetailData?._id, _id: s_subid ? s_subid : stateSubid },
      });
    }
    else if (location_check && location_check == 2) {
      navigate("/chemical/list");
    }
    else {
      localStorage.setItem("location_check", 1);
    }
  }, []);



  const selectedTaskIDData = useSelector(
    (state) => state?.task?.task?.selectedTaskId
  );
  const selectedTaskData = useSelector(
    (state) => state?.task?.task?.selectedTask
  );
  const cat = useSelector((state) => state.CategoryReducer.category);


  useEffect(() => {
    setTaskItemID(selectedTaskData?._id);
  }, [selectedTaskData]);
  const selectedTaskDetailData = useSelector(
    (state) => state?.task?.task?.selectedTask
  );


  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setLoader(true);
    try {
      const getdata = await getAllTasksData(selectedTaskDetailData?._id);
      if (getdata) {
        setTaskItemID(getdata?._id);
        setTaskID(selectedTaskIDData);
        setGetdata(getdata);
        const serviceName = getdata?.serviceName;
        setSubCatNames(serviceName);
        let arr = [];
        let foundQrId = false;
        getdata?.qrDetails?.forEach((data) => {
          const dataTitles = data.titles;
          if (cat === data.serviceName) {
            dataTitles &&
              dataTitles.forEach((item) => {
                if (finialTitleData === item.title) {
                  setQrId(item._id);
                  foundQrId = true;
                  if (finialTitleData === item.title) {
                    setQrId(item._id);
                    foundQrId = true;
                  }
                  if (item.qrScanned === true) {
                    const titledata = item?.title;
                    arr.push(titledata);
                  }
                }
              });
          }
        });
        setTitle(arr);

        if (!foundQrId) {
          setQrId(null);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoader(false);
    }
  };

  const finalpauseTimer = () => {
    if (pauseReason.trim() === "") {
      toast.warning("Please enter a reason for pause");
    } else {
      setShowPauseReasonModal(false);
      pauseconfirm();
    }
  };


  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        setTime((prevTime) => {
          const newSeconds = prevTime.seconds + 1;
          const newMinutes = prevTime.minutes + Math.floor(newSeconds / 60);
          const newHours = prevTime.hours + Math.floor(newMinutes / 60);

          localStorage.setItem(
            "startTime",
            moment()
              .subtract(newHours, "hours")
              .subtract(newMinutes % 60, "minutes")
              .subtract(newSeconds % 60, "seconds")
              .toISOString()
          );

          return {
            hours: newHours,
            minutes: newMinutes % 60,
            seconds: newSeconds % 60,
          };
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isRunning]);


  const getAllTasksData = async (id) => {
    setLoader(true);
    try {
      const response = await ApiService.GetTaskStatus(id);
      return response?.data?.selectedTask;
    } catch (error) {
      console.error("Unable to start the task:", error);
    } finally {
      setLoader(false);
    }
  };
  useEffect(() => {
    setTaskID(selectedTaskIDData);
  }, [selectedTaskIDData]);
  useEffect(() => {
    const servicenames = selectedTaskData.serviceName;
    const mainCategory = selectedTaskData.qrDetails.map((data) => {
      return data.serviceName;
    });
    setMaincategory(mainCategory);
    setServiceName(servicenames);
  }, [selectedTaskData]);

  const handleShow = () => {
    setShowPauseReasonModal(true);
  };
  const handleClose = () => {
    setShowPauseReasonModal(false);
    setIsRunning(true);
  };

  const handleStop = async () => {
    setLoader(true)
    try {
      setResume(false)
      setIsRunning(false)
      localStorage.setItem("isStopped", "true");
      localStorage.removeItem("startTime");
      localStorage.removeItem("location_check");
      setTime({ hours: 0, minutes: 0, seconds: 0 });
      const selectedTaskData = await getAllTasksData(taskItemId);
      const checkQr = selectedTaskData?.noqrcodeService?.length  == 1 ? 0 : 1;
      const Generalresponse = await ApiService.GetGeneralFalseStatus({
        taskItemId,checkQr
      });
      const GeneralTrueresponse = await ApiService.GetGeneraltrueStatus({
        taskItemId,
      });
      const GeneralNoQrresponse = await ApiService.GetNoQrGeneralFalseStatus({
        taskItemId,
      });
      const GeneralNoQrTrueresponse = await ApiService.GetNoQrGeneraltrueStatus({
        taskItemId,
      });

      const RodentSkipResponse = await ApiService.GetRodentSkipStatusfalse({
        taskItemId,
      });
      const rodentSkipLng = RodentSkipResponse?.data?.qrDetails?.length;
      await ApiService.UpdateSubCategoryStatus({
        taskId,
        taskItemId,
        status: true,
        subcatId: s_subid ? s_subid : stateSubid,
      });
      if (
        (!selectedTaskData?.Rodentstatus &&
          stateServicename == "Rodent Pro") ||
        (rodentSkipLng > 0 && stateServicename == "Rodent Pro")
      ) {
        localStorage.setItem('StartStatus', 'false')
        navigate("/taskdetails", {
          state: { taskId: selectedTaskDetailData?._id, _id: s_subid ? s_subid : stateSubid },
        });
      } else if (
        Generalresponse.data?.subCategoryStatusWithFalseStatus?.length > 1
      ) {
        navigate("/tech/home", { state: { status: "Ongoing" } });
      } else if (
        !selectedTaskData?.Rodentstatus && selectedTaskData?.QrCodeCategory?.length == 2 && stateServicename != "Rodent Pro"
      ) {
        navigate("/tech/home", { state: { status: "Ongoing" } });
      } else if (
        selectedTaskData?.Rodentstatus &&
        selectedTaskData?.QrCodeCategory?.length == 2 &&
        GeneralTrueresponse.data?.subCategoryStatusWithFalseStatus?.length == 0 &&
        stateServicename == "Rodent Pro"
      ) {
        navigate("/tech/home", { state: { status: "Ongoing" } });
      } else if (
        !selectedTaskData?.Rodentstatus &&
        selectedTaskData?.QrCodeCategory?.length == 2 &&
        GeneralTrueresponse.data?.subCategoryStatusWithFalseStatus?.length > 0 && stateServicename != "Rodent Pro"
      ) {
        navigate("/tech/home", { state: { status: "Ongoing" } });
      } else if (selectedTaskData?.noqrcodeService?.length > 0 && GeneralNoQrresponse.data?.subCategoryStatusWithFalseStatus?.length >= 1) {
        navigate("/tech/home", { state: { status: "Ongoing" } });
      } else if (selectedTaskData?.noqrcodeService?.length > 0 && GeneralNoQrresponse.data?.subCategoryStatusWithFalseStatus?.length == 1 && GeneralNoQrTrueresponse.data?.subCategoryStatusWithFalseStatus?.length >= 1) {
        navigate("/tech/home", { state: { status: "Ongoing" } });
      } else if (selectedTaskData?.Rodentstatus && selectedTaskData?.QrCodeCategory?.length == 2 && Generalresponse.data?.subCategoryStatusWithFalseStatus?.length == 1 && GeneralTrueresponse.data?.subCategoryStatusWithFalseStatus?.length >= 1 &&
        stateServicename == "Rodent Pro") {
        navigate("/tech/home", { state: { status: "Ongoing" } });
      } else if (selectedTaskData?.noqrcodeService?.length == 1 && selectedTaskData?.noqrcodeService[0]?.category == 'General Pest Control' && selectedTaskData?.Rodentstatus == false && selectedTaskData?.QrCodeCategory?.length != 0) {
        navigate("/tech/home", { state: { status: "Ongoing" } });
      } else {
        localStorage.setItem('StartStatus', 'false')
        navigate("/chemical/list");
      }
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoader(false)
    }

  };

  useEffect(() => {
    const suball = getData.QrCodeCategory;

    suball &&
      suball.map((it) => {
        const subsId = it;
        setqrcodeStatusId(subsId);
      });
  }, [getData]);

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };
  const pauseTimer = () => {
    setIsRunning(true);
    handleShow();
  };
  const pauseconfirm = () => {
    setIsRunning(false);
    console.log("time", time);
    const pauseTime = new Date();
    setPauseStartTime(pauseTime);
    localStorage.setItem("pauseStartTime", pauseTime);
    localStorage.setItem("ExactPauseTime", JSON.stringify(time))
    localStorage.setItem("PauseReason", pauseReason)
  };

  useEffect(() => {
    const storedpause = localStorage.getItem("pauseStartTime");
    const storedpauseReson = localStorage.getItem("PauseReason")
    const soredpauseTimeFinal = storedpause ? new Date(storedpause) : null;
    if (storedpause) {
      setPauseStartTime(soredpauseTimeFinal)
      setPauseReason(storedpauseReson)
    }
  }, [isRunning == false])

  const PauseDurationtimes = async () => {
    setIsRunning(true);
    localStorage.removeItem("pauseStartTime");
    localStorage.removeItem("ExactPauseTime")
    setPauseStartTime(null);
    const resumeTimes = new Date();
    const duration = moment.duration(resumeTimes - pauseStartTime);
    console.log("duration", duration);
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    const seconds = duration.seconds();
    const alldata = `${hours}:${minutes}:${seconds}`;
    console.log("allTime", alldata);
    try {
      const response = await ApiService.UpdatePauseReason({
        taskItemId,
        taskId,
        subCatId: s_subid ? s_subid : location?.state?.subid,
        pauseReason,
        pauseTiming: alldata,
      });
      if (response && response.status === 200) {
        setIsRunning(true);
        setPauseReason("");
        console.log("success");
      } else {
        console.error(
          `Error: Pause Reason Submitted Failed. Status code: ${response ? response.status : "unknown"
          }`
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };


  return (
    <div>
      {loader && <Loader show={loader} />}

      <Menus />
      <div className="d-flex justify-content-center align-items-center flex-column mt-4">
        <div
          className="m-2 p-2"
          style={{
            backgroundColor: "rgb(159 221 90 / 20%)",
            borderRadius: "0px",
          }}
        >
          <p className="fonts12 mt-2">
            {" "}
            🕒 NOTE: Work has commenced and the timer is now running. Once the
            task is completed, kindly hit the stop button. Thank you!
          </p>
        </div>
        <div className="mt-3">
          <table>
            <tr>
              <td className="fonts12 " style={{ textAlign: "left" }}>
                <span style={{ fontWeight: "bold" }}>
                  Customer Name&nbsp; -{" "}
                </span>
                <span>&nbsp; {selectedTaskData.companyName}</span>
              </td>
            </tr>
            <tr>
              {/* <td className="fonts12 " style={{ textAlign: "left" }}>
                <span style={{ fontWeight: "bold" }}>
                  Service Name&nbsp; -{" "}
                </span>
                {serviceNames}
              </td> */}
            </tr>
          </table>
        </div>
      </div>
      { resume ? <div className="d-flex flex-column justify-content-center gap-4 align-items-center mt-4 mb-5">
        <div
          className="bf d-flex flex-column justify-content-center align-items-center gap-3 "
          style={{
            backgroundColor: "rgb(159 221 90 / 42%)",
            width: "300px",
            height: "350px",
            borderRadius: "30px",
          }}
        >
          <div className="d-flex flex-column justify-content-center align-items-center gap-2">
            <h2>Timer</h2>
            <img src={clock} alt="clock" />
          </div>
          <div>
            <h1>
              {formatTime(time.hours)}:{formatTime(time.minutes)}:
              {formatTime(time.seconds)}
            </h1>
          </div>
          <div className="d-flex gap-4">
            {isRunning ? (
              <>
                <button className="btn btn-danger" onClick={pauseTimer}>
                  Pause
                </button>
                <button className="btn btn-primary ml-2" onClick={handleStop}>
                  Stop
                </button>
              </>
            ) : (
              <button className="btn btn-success" onClick={PauseDurationtimes}>
                Resume
              </button>
            )}
          </div>
        </div>
      </div> : <Loader show={loader} /> }
      <Model
        show={showPauseReasonModal}
        modalTitle="Pause Reason"
        modalContent={
          <textarea
            rules={[
              {
                required: true,
                message: "Please input your Email!",
              },
            ]}
            style={{ border: "1px solid #d4cfcf" }}
            className="col-12"
            value={pauseReason}
            onChange={(e) => setPauseReason(e.target.value)}
            rows={5}
            placeholder="Enter reason for pause..."
          />
        }
        onClose={handleClose}
        onConfirm={finalpauseTimer}
      />
      <ToastContainer />
    </div>
  );
};
export default StartTask;
