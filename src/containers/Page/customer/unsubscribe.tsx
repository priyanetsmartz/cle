import { connect } from "react-redux";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { unsubscribeNewsletter } from "../../../redux/pages/customers";


function Unsubscribe(props){
    const { email,storeId }: any = useParams();
    useEffect(() => {
        unsubscribe();
    }, [])
    const [message,setMessage] = useState('')
    async function unsubscribe(){
        console.log("propppps", props)
        console.log(email,storeId)

        let payload = {
            'email':email,
            'storeId':storeId
        }
        let result  = await unsubscribeNewsletter(payload)
        if(result['data']){
            console.log("result", result['data'][0].message)
            setMessage(result['data'][0].message)
        }
        
    }
    return (
        <div className="container mt-5">
    <div className="row">
        <div className="col-md-12">
            <div className="subscription text-left">
                <h6>{message}</h6>
            </div>
            <br/>
            <button className="btn btn-secondary" type="button"><Link to="/customer/profile">Go Home</Link></button></div>
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
        languages: languages,
        token: state.session.user,
        prefrences: state.Cart.isPrepOpen,
        forgotPop: state?.App?.showForgot
    }
}

export default connect(
    mapStateToProps,
    {}
)(Unsubscribe);
