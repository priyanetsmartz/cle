import { Link } from "react-router-dom";
import cross from '../../image/cross.svg';
function Promotion(props) {
    return (
        <section>
            <div className="notification">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="promotion_alert">
                                <p>
                                    <span className="promition">promotion</span> Contrary to popular belief, Lorem Ipsum is not simply random
                                    text.
                                </p>
                            </div>
                            <div className="alert_cross">
                                <Link to="#"><img src={cross} className="" alt="Cross" /> </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Promotion;