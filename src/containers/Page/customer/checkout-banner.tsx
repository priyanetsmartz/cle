import { Link } from "react-router-dom";
import IntlMessages from "../../../components/utility/intlMessages";

function CheckoutBannerFooter(props) {
    return (
        <section className="container-fluid help-center">
            <div className="row">
                <div className="col-xs-12 col-md-12 col-lg-12">
                    <h3><IntlMessages id="menu_contactnew" /></h3>
                    <p><IntlMessages id="contactCheckout" /></p>
                    <Link to="/contact-us" type="submit" className="btn"><IntlMessages id="menu_contactnew" /></Link>
                </div>
            </div>
        </section>
    )
}

export default CheckoutBannerFooter;