import React from "react";
import { SubHeading } from "../../Reusable/Headings/Heading";
import s6 from '../../Assets/Images/s2.webp'
import s5 from '../../Assets/Images/s3.webp'

import { useNavigate,useLocation } from "react-router-dom";


const MyTask = () => {

  let navigate = useNavigate()
  let location = useLocation()

  const tasks = [
    { id: 1, name: "Bird Control", phone: "8983983478", customer: "Gowtham", date: "02-03-2024", image: s5 },
    { id: 2, name: "Rodent Control", phone: "8983983498", customer: "rajesh", date: "02-03-2024", image: s6 },
    
  ];

  return (
    <div className="padding">
      {location.pathname === '/tech/home' &&(
      <SubHeading subHeading="My Tasks" subInsideHeading="View All" />
      )}
      {tasks.map(task => (
       
        <div className="card mb-3 mt-3 d-flex flex-row align-items-center p-2">
          <div className="col-2 d-flex justify-content-center">
            <img className='serviceImage rounded' src={task.image} alt="Product" />
          </div>
          <div className="col-8 d-md-flex flex-md-column justify-content-start px-3">
            <h5 className="fonts13 fontWeight textLeft">{task.name}</h5>
            <h6 className="fonts textLeft">Customer : XXX Company</h6>
          </div>
          <div className="col-2 d-flex justify-content-center">
            <button onClick={() => navigate('/taskdetails')}
              className="btn btn-primary btn-sm  " style={{fontSize:"9px"}} type="button">
              View
            </button>
          </div>
        </div>       
      ))}
    </div>
    // </div>
  );
};

export default MyTask;
