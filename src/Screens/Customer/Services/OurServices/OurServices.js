// import React from 'react'
// import { SubHeading } from '../../../../Reusable/Headings/Heading'
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import { ServicesName } from './ServicesName/ServicesName';
// import "../../../../Assets/CSS/CustomerCss/Services/Services.css"
// import { useNavigate } from 'react-router-dom';

// const OurServices = () => {
//     const navigate = useNavigate()
//     const onFinish = () => {
//         navigate('/insideServices');
//     };
//     return (
//         <div className='padding'>
//             <div>
//                 <SubHeading subHeading="Our Services" />
//                 <p className='servicePara mt-3'>Offering a variety of professional services that meet your needs</p>
//             </div>
//             <div>
//                 <Row >
//                     {ServicesName.map((data) => {
//                         return (
//                             <Col xs={4} md={2} sm={4} className='ServicesMain' >
//                                 <div className='card mt-4'>
//                                     <img src={data.img} className='serviceImg' onClick={onFinish}/>
//                                     <h6 className='ServiceTitle mt-2'>{data.title}</h6>
//                                 </div>
//                             </Col>
//                         )
//                     })}
//                 </Row>
//             </div>
//         </div>
//     )
// }

// export default OurServices
