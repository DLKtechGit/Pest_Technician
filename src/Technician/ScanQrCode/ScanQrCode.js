import React, { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";
import { useDispatch, useSelector } from "react-redux";
import Menus from "../../Screens/Customer/Home/Menus/Menus";
import success from "../../Assets/Images/success.svg";
import { useNavigate, useLocation } from "react-router-dom";
import QrFrame from "../../Assets/Images/qr-frame.svg";
import ApiService from "../../Services/TaskServices";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
import { fetchTaskstatus } from "../../Redux/Action/Action";
import Loader from "../../Reusable/Loader";

export default function ScanQrCode() {
  const dispatch = useDispatch();
  const [result, setResult] = useState(null);
  const [taskId, setTaskID] = useState("");
  const [taskItemId, setTaskItemID] = useState("");
  const [ongoing, setOngoing] = useState("ongoing");
  const [serviceNames, setServiceNames] = useState([]);
  const [title, setTitle] = useState();
  const [scan, setScan] = useState();
  const [rodent, setRodent] = useState();
  const [subCatId, setSubCatId] = useState();
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const technicianStartTime = location.state?.technicianStartTime;
  const technicianStartDate = location.state?.technicianStartDate;
  const serviceName = location.state?.serviceName;
  const category = location.state?.category;
  const rodentService = useSelector(
    (state) => state.ServiceNameReducer.serviceName
  );
  const selectedTaskIDData = useSelector(
    (state) => state?.task?.task?.selectedTaskId
  );
  const selectedTaskDetailData = useSelector(
    (state) => state?.task?.task?.selectedTask
  );


  useEffect(()=>{
    const location_check = localStorage.getItem("location_check");
    if(location_check == 1)
    {
      navigate("/start/task", {
        state: {
          ongoing: ongoing,
          technicianStartDate: technicianStartDate,
          technicianStartTime: technicianStartTime,
          subid: subCatId,
          serviceName: serviceName,
        },
      });
    }
  },[])

  useEffect(() => {
    const fetchData = async () => {
      setLoader(true);
      const getdata = await getAllTasksData(selectedTaskDetailData?._id);
      const mainCategory = getdata.mainCategory;
      const QrCodeCategory = getdata.QrCodeCategory;
      if (getdata) {
        setTaskItemID(getdata?._id);
        setTaskID(selectedTaskIDData);
        const serviceName = getdata?.serviceName;
        setServiceNames(serviceName);
        let arr = [];
        getdata?.qrDetails?.map((data) => {
          const dataTitles = data.titles;
          if (mainCategory === data.serviceName) {
            {
              dataTitles &&
                dataTitles.map((item) => {
                  if (item.qrScanned === false) {
                    const titledata = item?.title;
                    arr?.push(titledata);
                  }
                });
            }
          }
        });
        setTitle(arr);
      }
      getdata.QrCodeCategory &&
        getdata.QrCodeCategory.map((item) => {
          // console.log("getdata", item.category);
          setRodent(item.subCategory);
        });
      setLoader(false);
    };
    fetchData();
  }, [dispatch, selectedTaskDetailData, selectedTaskIDData]);

  useEffect(() => {
    const resultData = result?.text?.split(":");
    if (resultData) {
      const scanData = resultData[1]?.split("\n");
      if (scanData.length > 0) {
        setScan(scanData[0]);
      }
    }
  }, [result]);

  const handleError = (error) => {
    alert.error(error);
  };

  const handleScan = (data) => {
    if (data) {
      setResult(data);
    }
  };

  const getAllTasksData = async (id) => {
    setLoader(true);
    try {
      const response = await ApiService.GetTaskStatus(id);
      // console.log("response", response);
      if (
        response &&
        response.status === 200 &&
        response.data &&
        response.data.selectedTask
      ) {
        return response.data.selectedTask;
      } else {
        throw new Error("Task not found");
      }
    } catch (error) {
      console.error("Error fetching task data:", error);
      throw error;
    } finally {
      setLoader(false);
    }
  };

  const cancelTask = () => {
    navigate("/taskdetails", {
      state: { category: category, taskId: selectedTaskDetailData?._id },
    });
  };

  useEffect(() => {
    const subcatID = location.state.subid;
    setSubCatId(subcatID);
  }, [location]);
  console.log("suncatId",subCatId);

  const scanstart = async () => {
setLoader(true)
    try {
    
      const scanData = scan.trim();
      // console.log("scanData",scan);
      // Check if title array is defined and includes scanData
      const finialTitleData = title !== undefined && title.includes(scanData);

      // console.log("finialTitleData", title);

      // if (finialTitleData) {
      const response = await ApiService.UpdateQrscanned({
        taskId: taskId,
        taskItemId: taskItemId,
        qrScanned: true,
        qrId: scanData,
      });
      if (category === "Rodent Pro") {
        const UpdateRodentStatusMain = await ApiService.UpdateRodentStatusMain({
          taskId: taskId,
          taskItemId: taskItemId,
          Rodentstatus: true,
          qrId: scanData,
        });

        if (UpdateRodentStatusMain && UpdateRodentStatusMain.status === 200) {
          console.log("success");
        } else {
          toast.error(UpdateRodentStatusMain?.data?.error);
        }
      }

      // console.log("response", response);
      if (response && response.status === 200) {
        //toast.success("Now you can start the task");
        localStorage.setItem('StartStatus','true')
        navigate("/start/task", {
          state: {
            ongoing: ongoing,
            technicianStartDate: technicianStartDate,
            technicianStartTime: technicianStartTime,
            serviceName: serviceName,
            finialTitleData: scanData,
            subid: subCatId,
          },
        });
      } else {

        toast.error("QR Code Miss Matching", { scanData })
        console.error(
          
          
          `Error: Unable to start the task. Status code: ${
            response ? response.status : "unknown"
          }`
        );
      }
      
    } catch (error) {
      console.error("Unable to start the task:", error);
    }
    finally{
      setLoader(false)
    } 
  };

  const constraints = {
    facingMode: "environment", // Use the back camera
  };

  return (
    <>
    {loader && (
      <Loader show={loader}/>
      
    )} 
      <Menus />
      {!result && (
        <div className="mb-5">
          <h3>Scan the QR Code</h3>
        </div>
      )}
      <div style={{ position: "relative" }}>
        {!result && ( // Render the scanner if result is null
          <>
            <QrReader onResult={handleScan} constraints={constraints} />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1,
              }}
            >
              <img
                src={QrFrame}
                alt="Qr Frame"
                width={220}
                height={256}
                className="qr-frame"
              />
            </div>
          </>
        )}

        {result && (
          <div>
            <div className="b m-3 d-flex justify-content-center flex-column align-items-center ">
              <img
                style={{ width: "80px" }}
                className="m-3"
                src={success}
                alt="success"
              />
              <p className="m-2 fs-10"> Successfully Scanned </p>
              <hr style={{ width: "100%" }} />
              <h3 className="m-2" style={{ fontWeight: "700" }}>
                Scanned Result
              </h3>
              <div style={{ width: "300px" }} className="bt m-3 ">
                {result.text.split("QR Title:").map((part, index) => {
                  if (index !== 0) {
                    // Skip the first part which doesn't contain "qrtitle:"
                    const parts = part.split(/Service Name:|Customer Name:/); // Split by "Service Name:" or "Customer Name:"
                    return (
                      <div key={index}>
                        <div className="mt-2">
                          <span style={{ fontWeight: "600" }}>QR Title:</span>{" "}
                          {parts[0]}
                        </div>
                        <div className="mt-2">
                          <span style={{ fontWeight: "600" }}>
                            Service Name:
                          </span>{" "}
                          {parts[1]}
                        </div>
                        <div className="mt-2">
                          <span style={{ fontWeight: "600" }}>
                            Customer Name:
                          </span>{" "}
                          {parts[2]}
                        </div>
                      </div>
                    );
                  }
                  return null; // Skip rendering for the first part
                })}
                {/* {rodent.map((data, index) => (
                  <React.Fragment key={index}>
                    <h6 className="fonts13 fontWeight mt-4 ">Assigned Task </h6>
                    <div className="d-flex  justify-content-center align-items-center ">
                      <h6 className="fonts13 mt-2 ">{index + 1}. {data.subCategory}</h6>
                    </div>
                  </React.Fragment>
                ))} */}
              </div>
              <div className="d-flex gap-3 mb-5 mt-4">
                <button
                  className="btn btn-primary "
                  onClick={scanstart}
                  value="ongoing"
                >
                  Start Task
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={cancelTask}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </>
  );
}

{
  /* <QrReader
constraints={constraints}

 
  onResult={(result, error) => {
    if (!!result) {
      setData(result?.text);
    }

    if (!!error) {
      console.info(error);
    }
  }}
  style={{ width: '100%' }}
/> */
}
