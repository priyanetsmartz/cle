import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { unsubscribeNewsletter } from "../../../redux/pages/customers";
import { Link } from "react-router-dom";
import { useIntl } from 'react-intl';
function Unsubscribe(props) {
    const intl = useIntl();
    const pass = useLocation().search;
    const email = new URLSearchParams(pass).get("email");
    const storeId = new URLSearchParams(pass).get("storeId");
    useEffect(() => {
        unsubscribe();
    }, [])
    const [message, setMessage] = useState([])
    async function unsubscribe() {
        let payload = {
            'email': email,
            'storeId': storeId
        }
        let result: any = await unsubscribeNewsletter(payload)
        let message = [];
        if (result?.data && !result?.data.message) {
            if (result?.data?.[0]?.success === 1) {
                message['message'] = intl.formatMessage({ id: "successunsubscribe" })
                message['status'] = 'success';
                setMessage(message)
            } else {
                message['message'] = intl.formatMessage({ id: "alreadyunsubscribe" })
                message['status'] = 'error';
                setMessage(message)
            }

        } else {
            message['message'] = intl.formatMessage({ id: "errorunsubscribe" })
            message['status'] = 'error';
            setMessage(message)
        }

    }
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-12">
                    <div className="text-center datasubsribe">
                        <div className={message?.['status'] }>
                            {message?.['status'] === 'success' &&(  <i className="fa fa-check-circle" aria-hidden="true"></i>)}
                            {message?.['status'] === 'error' &&(   <i className="fa fa-times-circle" aria-hidden="true"></i>)}
                           
                        </div>
                        <div className="subscription text-left">
                            <h6>{message?.['message']}</h6>
                        </div>
                        <br />
                        <Link to="/" className="btn btn-primary">{intl.formatMessage({ id: "home" })}</Link>
                    </div>
                </div>
            </div>
        </div>

    )
}

const mapStateToProps = (state) => {
    let languages = '';

    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }


    return {
        languages: languages
    }
}

export default connect(
    mapStateToProps,
    {}
)(Unsubscribe);
