import React, { useEffect, useState } from "react";
import Menus from "../../../Home/Menus/Menus";
import { Heading } from "../../../../../Reusable/Headings/Heading";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import ApiService from "../../../../../Services/TaskServices";
import Caroseuls from "../../../../../Reusable/Caroseuls";
import Loader from "../../../../../Reusable/Loader";
import { saveAs } from 'file-saver';

const SpecificHistory = () => {
  const location = useLocation();
  const taskId = location.state?.taskId;
  const [task, setTask] = useState([]);
  const [finalTasks, setFinalTasks] = useState([])
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false)

  const onFinish = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (taskId) {
      getTaskById();
    }
  }, [taskId]);

  const getTaskById = async () => {
    setLoader(true)
    try {
      const response = await ApiService.GetTaskByID(taskId);
      const taskData = response.data.task;
      setTask([taskData]);
    } catch (error) {
      console.error("Error fetching task:", error);
    } finally {
      setLoader(false)

    }
  };

  // https://node.1croreads.com/

  const downloadPdf = (pdf) => {
    const byteCharacters = atob(pdf);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    saveAs(blob, "report.pdf");
};


  useEffect(() => {
    const taskss = task.map((data) => { return data.technicians[0] })
    taskss.map((item) => {
      const data = item.tasks
      const finaldata = data.filter((e) => e._id === taskId)
      setFinalTasks(finaldata)
    })
  }, [task])



  return (
    <>
      {loader && (
        <Loader show={loader} />

      )}
      <div className="history-full">
        <Menus title="Crawling Insects" />
        <div className="d-flex flex-row">
          <div className="col-2">
            <IoIosArrowBack className="backArrow" onClick={onFinish} />
          </div>
          <div className="col-8 d-flex justify-content-center mt-1">
            <Heading heading="Service Details" />
          </div>

        </div>

        <div>


          <>
            {finalTasks.map((data, idx) => {
              const AllQrCodeCategory = data.QrCodeCategory
              const AllnoqrcodeService = data.noqrcodeService

              const QrCodeCategory = AllQrCodeCategory.length > 0 ? AllQrCodeCategory : AllnoqrcodeService;

              return (
                <>
                  <div className="padding1">
                    <div className="col-12 allServicesHistory card d-flex flex-row align-items-center">
                      <div className="col-7">
                        {
                          QrCodeCategory && QrCodeCategory.length > 0 && (

                            QrCodeCategory.map((serviceName, index) => {
                              const category = serviceName.category;
                              return (
                                <div key={index} className="mb-2 padding1 px-4">
                                  <div>
                                    <div className="fonts13 textLeft" style={{ fontWeight: "700" }}>
                                      {category} :
                                    </div>
                                    {serviceName.subCategory.map((subItem, subIndex) => (
                                      <div key={subIndex} className="mt-1 d-flex flex-row justify-content-between align-items-center">
                                        <div className="d-flex align-items-center fonts13 textLeft px-2">
                                          {subIndex + 1}. {subItem}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })
                          )
                        }



                        {
                          AllnoqrcodeService && AllnoqrcodeService.length > 0 && QrCodeCategory[0]?.category === 'Rodent Pro' && (

                            AllnoqrcodeService.map((serviceName, index) => {
                              const category = serviceName.category;
                              return (
                                <div key={index} className="mb-2 padding1 px-4">
                                  <div>
                                    <div className="fonts13 textLeft" style={{ fontWeight: "700" }}>
                                      {category} :
                                    </div>
                                    {serviceName.subCategory.map((subItem, subIndex) => (
                                      <div key={subIndex} className="mt-1 d-flex flex-row justify-content-between align-items-center">
                                        <div className="d-flex align-items-center fonts13 textLeft px-2">
                                          {subIndex + 1}. {subItem}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })
                          )
                        }
                      </div>
                      <div className="col-5 ">
                        <Caroseuls showDots={false} />
                      </div>
                    </div>
                  </div>


                  <div className="padding1">
                    <div className="allServicesHistory card">
                      <>
                        <div
                          className="d-flex flex-row align-items-center"
                          style={{ padding: "10px 20px 5px 20px" }}
                        >
                          <div className="col-6 d-flex align-items-center">
                            <h6 style={{ fontSize: "12px" }} className="allHistTitle">
                              Start Date{" "}
                            </h6>
                          </div>
                          <div className="col-2"> : </div>
                          <div className="col-5 d-flex justify-content-start align-items-center">
                            <text style={{ fontSize: "12px" }} className="allHistText">
                              {moment(data.startDate).isValid()
                                ? moment(data.startDate).format("DD-MM-YYYY")
                                : data.startDate}
                            </text>
                          </div>
                        </div>
                        <div
                          className="d-flex flex-row align-items-center"
                          style={{ padding: "5px 20px 5px 20px" }}
                        >
                          <div className="col-6 d-flex align-items-center">
                            <h6 style={{ fontSize: "12px" }} className="allHistTitle">
                              Status{" "}
                            </h6>
                          </div>
                          <div className="col-2"> : </div>
                          <div className="col-5 d-flex justify-content-start align-items-center">
                            <text style={{ fontSize: "12px" }} className="allHistText">
                              {data.status == 'start' ? <span style={{color:"darkorange",textTransform:"capitalize",fontWeight:600}}>Yet to Start</span> : <span style={{color:"green",textTransform:"capitalize",fontWeight:600}}>{data.status}</span>}
                            </text>
                          </div>
                        </div>
                        <div
                          className="d-flex flex-row align-items-center"
                          style={{ padding: "5px 20px 5px 20px" }}
                        >
                          <div className="col-6 d-flex align-items-center">
                            <h6 style={{ fontSize: "12px" }} className="allHistTitle">
                              Description{" "}
                            </h6>
                          </div>
                          <div className="col-2"> : </div>
                          <div className="col-5 d-flex justify-content-start align-items-center">
                            <text style={{ fontSize: "12px" }} className="allHistText">
                              {data.description}
                            </text>
                          </div>
                        </div>
                        <div
                          className="d-flex flex-row align-items-center"
                          style={{ padding: "5px 20px 5px 20px" }}
                        >
                          <div className="col-6 d-flex align-items-center">
                            <h6 style={{ fontSize: "12px" }} className="allHistTitle">
                              Technician Name{" "}
                            </h6>
                          </div>
                          <div className="col-2"> : </div>
                          <div className="col-5 d-flex justify-content-start align-items-center">
                            <text style={{ fontSize: "12px" }} className="allHistText">
                                  {data.technicianDetails.firstName} {data.technicianDetails.lastName}
                            </text> 
                          </div>
                        </div>
                        <div
                          className="d-flex flex-row align-items-center"
                          style={{ padding: "5px 20px 5px 20px" }}
                        >
                          <div className="col-6 d-flex align-items-center">
                            <h6 style={{ fontSize: "12px" }} className="allHistTitle">
                              Technician Start Date{" "}
                            </h6>
                          </div>
                          <div className="col-2"> : </div>
                          <div className="col-5 d-flex justify-content-start align-items-center">
                            <text style={{ fontSize: "12px" }} className="allHistText">
                              {moment(data.technicianStartDate).isValid()
                                ? moment(data.technicianStartDate).format("DD-MM-YYYY")
                                : data.technicianStartDate}
                            </text>
                          </div>
                        </div>
                      </>
                    </div>
                    {data.status === "completed" && (
                      <div className="d-flex justify-content-center mt-3">

                        <button type="button" onClick={() => downloadPdf(data.pdf)} className="btn pestBtn">Download Report</button>
                      </div>
                    )
                    }
                  </div>
                </>
              )
            })}
          </>
        </div>
      </div>
    </>
  );
};

export default SpecificHistory;
