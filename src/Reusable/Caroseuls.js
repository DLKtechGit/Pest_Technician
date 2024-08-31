import React from 'react'
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import caro1 from "../Assets/Images/caro1.png"
import caro2 from "../Assets/Images/caro2.png"
import caro3 from "../Assets/Images/caro3.png"
import caro4 from "../Assets/Images/caro4.png"

const Caroseuls = ({showDots}) => {
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1
        }
    };
    return (
        <Carousel
            responsive={responsive}
            showDots={showDots}
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
            infinite={true}
            autoPlay={true}
            className='mainCarousel'
        >        
            <div className='card p-3'>
                <img src={caro1} className='img-fluid' />
            </div>
            <div className='card p-3'>
                <img src={caro2} className='img-fluid' />
            </div>
            <div className='card p-3'>
                <img src={caro3} className='img-fluid' />
            </div>
            <div className='card p-3'>
                <img src={caro4} className='img-fluid' />
            </div>
        </Carousel>
    )
}

export default Caroseuls