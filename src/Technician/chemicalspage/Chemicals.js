import React, { useState, useEffect } from "react";
import Menus from "../../Screens/Customer/Home/Menus/Menus";
import { useNavigate, useLocation } from "react-router-dom";
import ApiChemicalService from "../../Services/ChemicalServices";
import { toast, ToastContainer } from "react-toastify";
import { CiCircleMinus } from "react-icons/ci";
import Loader from "../../Reusable/Loader";

const Chemicals = () => {
  const location = useLocation();
  const technicianStartTime = location.state?.technicianStartTime;
  const technicianStartDate = location.state?.technicianStartDate;
  const pauseReason = location.state?.pauseReason;
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [selectedChemical, setSelectedChemical] = useState("Select Chemicals");
  const [inputFields, setInputFields] = useState([]);
  const [recommendation, setRecommendation] = useState("");
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isNoneSelected, setIsNoneSelected] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    localStorage.setItem("location", window.location.pathname);
    localStorage.setItem("location_check", 2);
    getChemicals();
  }, []);

  const getChemicals = async () => {
    setLoader(true);
    try {
      const serviceData = await ApiChemicalService.GetChemicals();
      const services = serviceData?.data?.Results.map((service, index) => ({
        ...service,
        key: service._id,
        serviceId: (index + 1).toString().padStart(3, "0"),
      }));
      setData(services);
    } catch (error) {
      console.error("Error fetching Chemicals data:", error);
      toast.error("Failed to fetch Chemicals data");
    } finally {
      setLoader(false);
    }
  };

  const handleChemicalChange = (e) => {
    const selectedOption = e.target.value;
    setSelectedChemical(selectedOption);

    if (selectedOption === "None") {
      setIsNoneSelected(true);
      setInputFields([{ chemical: "None", value: "" }]);
      setIsSubmitDisabled(false);
    } else {
      setIsNoneSelected(false);
      if (!inputFields.some((field) => field.chemical === selectedOption)) {
        const updatedFields = [
          ...inputFields,
          { chemical: selectedOption, value: "" },
        ];
        setInputFields(updatedFields);
        setIsSubmitDisabled(updatedFields.length === 0);
      } else {
        setIsSubmitDisabled(false);
      }
    }

    if (selectedOption === "Select Chemicals") {
      setIsSubmitDisabled(true);
    }
  };

  const handleRecommendationChange = (e) => {
    const inputValue = e.target.value;
    setRecommendation(inputValue.trim() === "" ? "-" : inputValue);
  };

  const handleSubmit = () => {
    setLoader(true)
    localStorage.removeItem("service1");
    localStorage.removeItem("service2");
    localStorage.removeItem("service3");
    localStorage.removeItem("rodent");
    navigate("/signature/page", {
      state: {
        inputFields,
        recommendation,
        pauseReason,
        technicianStartDate,
        technicianStartTime,
      },
    });
  };

  return (
    <div>
      {loader && <Loader show={loader} />}

      <Menus />
      <div
        className="m-2 mb-0 p-1"
        style={{
          backgroundColor: "rgb(159 221 90 / 20%)",
          borderRadius: "0px",  
        }}
      >
        <p className="fonts12 mt-2">
          If any chemicals were utilized during the task, please specify from
          the following list
        </p>
      </div>

      <div className="container">
        <div className="col-12 mt-3">
          <h6
            className="h6 col-12"
            style={{ fontSize: "13px", fontWeight: "500" }}
          >
            Select Chemicals
          </h6>
          <select
            className="form-select"
            aria-label="Default select example"
            value={selectedChemical}
            onChange={handleChemicalChange}
            style={{ fontSize: "13px" }}
            disabled={isNoneSelected}
          >
            <option disabled>Select Chemicals</option>
            <option value="None"> None </option>
            {data &&
              data.map((item, index) => (
                <option key={index} value={item.chemicalsName}>
                  {item.chemicalsName}
                </option>
              ))}
          </select>
        </div>
        <div className="mt-3">
          {inputFields.map((input, index) => (
            <div key={index} className="col-12 d-flex mt-2 px-2">
              <div className="col-8 d-flex justify-content-start align-items-center">
                <label style={{ fontSize: "13px" }}>
                  {index + 1}. {input.chemical}
                </label>
              </div>
              <div className="col-4 d-flex justify-content-end">
                <CiCircleMinus
                  onClick={() => {
                    const updatedFields = [...inputFields];
                    updatedFields.splice(index, 1);
                    setInputFields(updatedFields);
                    if (updatedFields.length === 0) {
                      setIsNoneSelected(false);
                      setSelectedChemical("Select Chemicals");
                      setIsSubmitDisabled(true);
                    } else {
                      setIsSubmitDisabled(false);
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="col-12 p-3">
        <div className="d-flex justify-content-start mb-2">
          <label style={{ fontSize: "13px", fontWeight: "500" }}>
            Recommendation :
          </label>
        </div>
        <textarea
          className="col-12 p-2"
          style={{
            border: "none",
            backgroundColor: "#ccdacf42",
            fontSize: "12px",
          }}
          rows={5}
          value={recommendation}
          onChange={handleRecommendationChange}
          placeholder="Type here......"
        />
      </div>
      <div>
        <button
          type="submit"
          onClick={handleSubmit}
          className="btn btn-primary m-4"
          disabled={isSubmitDisabled}
        >
          Submit
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Chemicals;

