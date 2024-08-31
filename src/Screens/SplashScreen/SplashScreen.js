import React from 'react'
import splash from "../../Assets/Images/splash.png"
import "../../Assets/CSS/SplashScreen/SplashScreen.css"

const SplashScreen = () => {
    return (
        <section className="splashblock">
            <div className="col-sm-12">
                <div className="auth-box card">
                    <div className="card-block checkout-page-style">
                        <div className='col-12 d-flex justify-content-center '>
                            {/* <img src={splash} className="img-fluid splashImg" /> */}
                            <div className='card'>
                            <img src={splash} className="img-fluid splashImg" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SplashScreen