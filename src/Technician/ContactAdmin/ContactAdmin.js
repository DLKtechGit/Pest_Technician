import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Menus from '../../Screens/Customer/Home/Menus/Menus'
import { Input } from 'antd';
import { Heading } from '../../Reusable/Headings/Heading';
import ApiService from "../../Services/IssuesServices";
import moment from "moment";
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate } from "react-router-dom";
const { TextArea } = Input;

const ContactAdmin = () => {
  const [issueDescription, setIssueDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const userData = useSelector((state) => state.user.userData);
  const [userRole, setUserRole] = useState("");
  const [resIssues, setResIssues] = useState("");
const naivgate = useNavigate()
  const technicianId = userData._id;

  useEffect(()=>{
    const isLoggedIn = localStorage.getItem("login") === 'true'; 
    if (!isLoggedIn) {
      naivgate("/"); 
      return; 
    }


  },[])

  useEffect(() => {
    const user = userData.role
    setUserRole(user)
  }, [userData]);

  useEffect(() => {
    handleGetIssues();
  }, []);

  const handleSubmit = async () => {
    try {
      setLoading(true); // Set loading to true when submitting
      const response = await ApiService.CreateIssues({
        technicianId: userData._id,
        issueDetails: {
          description: issueDescription,
          priority: 'Open',
        },
      });
      // console.log(response.data.message);
      setIssueDescription('');
      // Fetch issues after submitting
      handleGetIssues();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false); // Reset loading to false after submitting
    }
  };

  const handleGetIssues = async () => {
    try {
      setLoading(true); // Set loading to true while fetching
      const res = await ApiService.GetUserIdByIssues(technicianId);
      const resIssuesData = res.data;
      setResIssues(resIssuesData);
    } catch (error) {
      console.error('Error fetching issues:', error);
    } finally {
      setLoading(false); // Reset loading to false after fetching
    }
  }

  return (
    <div>
      <Menus />
      <div className='p-3'>
        <div className=''>
          <h6 className="mb-3" style={{ fontSize: "13px" }}><b>Share Your Concerns, Admin is Here to Help!</b></h6>
          <TextArea
            rows={4}
            placeholder="Type here..."
            value={issueDescription}
            onChange={(e) => setIssueDescription(e.target.value)}
          />
          <button
            type="submit"
            onClick={handleSubmit}
            className="btn btn-primary m-4"
          >
            Submit
          </button>
        </div>
        <hr />

        <div>
          <div>
            <Heading heading="Issues History" />
          </div>
          <div>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "100px" }}>
                <Spinner animation="border" variant="success" />
              </div>
            ) :
              resIssues.length === 0 ? (
                <p>No history found</p>
              ) :
                (
                  resIssues && resIssues.map((data) => {
                    const IssuesData = data?.issueDetails;
                    const date = data?.createdAt;
                    return (
                      <div
                        className="card mb-3 mt-3 d-flex flex-column p-2"
                      >
                        <div className="col-12 d-flex flex-row justify-content-end">
                          <div className="col-8"></div>
                          <div className="col-4 d-flex flex-column justify-content-end">
                            <h6
                              className="fonts textLeft mt-2"
                              style={{ fontSize: "12px" }}
                            >
                              Date :  {moment(date).format("DD-MM-YYYY")}
                            </h6>
                            <div className="d-flex justify-content-end">
                              {IssuesData.priority === 'Open' ? (
                                <button className="col-7 btn btn-warning" style={{ fontSize: "10px" }}>Open</button>
                              ) : (
                                <button className="col-7 btn btn-success" style={{ fontSize: "10px" }}>Closed</button>
                              )}
                            </div>

                          </div>
                        </div>

                        <hr />
                        <h6
                          className="fonts textLeft mt-2"
                          style={{ fontSize: "12px" }}
                        >
                          {IssuesData.description}
                        </h6>
                      </div>
                    )
                  })
                )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactAdmin;
