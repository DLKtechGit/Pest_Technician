import React from 'react'
import "../../Assets/CSS/ReusableCss/Headings/Heading.css"
import { useNavigate } from 'react-router-dom'
export const Heading = ({ heading }) => {
  
  return (
    <div>
      <h5 style={{fontSize:'12px'}} className='heading'>{heading}</h5>
    </div>
  )
}

export const SubHeading = ({ subHeading, subInsideHeading }) => {
  const navigate = useNavigate()
  return (
    <div className='d-flex flex-row subHeading'>
      <div className='col-6 subHeadingLeftText'>{subHeading}</div>
      <div className='col-6 subHeadingRightText' >{subInsideHeading}</div>
    </div>
  )
}



// export const SubHeading = ({ subHeading, subInsideHeading }) => {
//   const navigate = useNavigate();

//   const handleClick = () => {
//     // Navigate to '/tasklist' route
//     navigate('/tasklist');
//   };

//   return (
//     <div className='d-flex flex-row subHeading'>
//       <div className='col-6 subHeadingLeftText'>{subHeading}</div>
//       <div className='col-6 subHeadingRightText' onClick={handleClick}>{subInsideHeading}</div>
//     </div>
//   );
// };
