import { Link } from "react-router-dom";
import IntlMessages from "../../../components/utility/intlMessages";

function ContactBannerFooter(props) {
    return (
        <section className="container-fluid help-center">
            <div className="row">
                <div className="col-xs-12 col-md-12 col-lg-12">
                    <h3><IntlMessages id="mysupport.checkHelp" /></h3>
                    <p><IntlMessages id="mysupport.findTheAnswer" /></p>
                    <Link to="/help-center" type="submit" className="btn"><IntlMessages id="mysupport.cta" /></Link>
                </div>
            </div>
        </section>
    )
}

export default ContactBannerFooter;