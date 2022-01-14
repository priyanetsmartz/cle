import { Link } from "react-router-dom";
import IntlMessages from "../../../components/utility/intlMessages";

function returnFooter(props) {
    return (
        <section className="return-footer-sec">
            <div className="container">
                <div className="row">
                    <div className="col-md-6 pe-0">
                        <div className="black-bg-footer">
                            <div className="black-bg-inner">
                                <h2><IntlMessages id="return.policy" /></h2>
                                <p><IntlMessages id="return.policy.details" /></p>
                                <Link to="#" className="btn-white-primary"><IntlMessages id="check.out" /></Link>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 ps-0">
                        <div className="blue-bg-footer">
                            <div className="black-bg-inner">
                                <h2><IntlMessages id="contact.title" /></h2>
                                <p><IntlMessages id="return.footer.contact.details" /></p>
                                <Link to="/customer/support" className="btn-white-primary"><IntlMessages id="contact.title" /></Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default returnFooter;