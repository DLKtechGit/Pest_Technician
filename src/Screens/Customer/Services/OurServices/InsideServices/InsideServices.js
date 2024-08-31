import React from 'react'
import caro2 from "../../../../../Assets/Images/caro2.png"
import Menus from '../../../Home/Menus/Menus'
import { Heading } from '../../../../../Reusable/Headings/Heading'
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const InsideServices = () => {
    const navigate = useNavigate();
    const onFinish = () => {
        navigate('/home');
    };

    
    const specificHistoryLabel = [
        {
            label: "Service Id",
            formData: "908",
            padding: "30px 20px 20px 20px",
            index: 1
        },
        {
            label: "Service Name",
            formData: "Crawling",
            padding: "0px 20px 20px 20px",
            index: 2
        },
        {
            label: "Date",
            formData: "25-01-2024",
            padding: "0px 20px 20px 20px",
            index: 3
        },
        {
            label: "Start Time",
            formData: "09:19",
            padding: "0px 20px 20px 20px",
            index: 4
        },
        {
            label: "Technician Name",
            formData: "XYZ",
            padding: "0px 20px 20px 20px",
            index: 5
        },
        {
            label: "Status",
            formData: "Completed",
            padding: "0px 20px 20px 20px",
            index: 5
        },
    ]
    return (
        <div>
            <Menus title="Services History" />
            <div className='insideServices'>
                <div className='d-flex flex-row'>
                    <div className='col-2'>
                        <IoIosArrowBack className='backArrow' onClick={onFinish} />
                    </div>
                    <div className='col-8 d-flex justify-content-center'>
                        <Heading heading="Service History" />
                    </div>
                </div>
                <div className='card p-3'>
                    <img src={caro2} className='img-fluid' />
                </div>


                <div className='padding'>
                <div className='allServicesHistory card'>
                    {specificHistoryLabel.map((data) => {
                        return (
                            <div className='d-flex flex-row align-items-center' style={{ padding: `${data.padding}` }}>
                                <div className='col-6 d-flex align-items-center'>
                                    <h6 className='allHistTitle'>{data.label} </h6>
                                </div>
                                <div className='col-2'> : </div>
                                <div className='col-5 d-flex justify-content-start align-items-center'>
                                    <text className='allHistText'>{data.formData}</text>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
            </div>
        </div>
    )
}

export default InsideServices