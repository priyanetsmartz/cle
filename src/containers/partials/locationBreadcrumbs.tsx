import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { capitalize } from "../../components/utility/allutils";

function Breadcrumbs(props) {
    const location = useLocation()
    let localData = localStorage.getItem('redux-react-session/USER_DATA');
    let localToken = JSON.parse((localData));
    const { category, subcat, childcat, greatchildcat, cat, returnId, prodsku, vendorIdprev }: any = useParams();
    let stateBread = location.pathname.split('\/');
    const [breadcrumsState, setBreadcrumsState] = useState(stateBread);
    const [vendorName, SetVendorName] = useState(localToken?.vendor_id);

    useEffect(() => {

        let breads = location.pathname.split('\/');
        setBreadcrumsState(breads)
    }, [location]);

    return (
        <nav aria-label="breadcrumb" className="new-breadcrumb">
            {(!location.pathname.includes("product-details")) && (
                <ol className="breadcrumb">
                    {!breadcrumsState.includes("product-details-preview") ?
                        <li className="breadcrumb-item" key={100}> {vendorName ? <Link to="/vendor/dashboard">Home</Link> : <Link to="/">Home</Link>}</li>
                        : ""}

                    {breadcrumsState.map((local, j) => {

                        let result = local.includes("new-in");
                        if (result) {
                            local = 'New in';
                        }

                        let result1 = local.includes("designer");
                        if (result1) {
                            local = 'Designer';
                        }
                        if (j === breadcrumsState.length - 1) {
                            let data = local.split('-')
                            if (local === 'orders-and-returns' || local === 'wishlist' || local === 'profile' || local === 'support' || local === 'product-listing' || local === 'sales-orders' || local === 'payouts') {
                                return (
                                    <li key={j} className="breadcrumb-item active">My
                                        {
                                            data.map((answer, i) => {
                                                return (<span key={i}> {capitalize(answer)} </span>)
                                            })
                                        }
                                    </li>

                                )
                            } else if (local === 'returns-complaints') {
                                return (
                                    <p style={{ 'display': 'inline-flex' }} key="-3">
                                        <li key={-1} className="breadcrumb-item"><Link to='/vendor/returns-complaints'> / My returns & complains </Link></li>
                                    </p>
                                )
                            } else if (local === 'thankyou') {
                                return (
                                    <><li key={10} className="breadcrumb-item"><Link to="/customer/dashboard">My Account</Link></li>
                                        <li key={11} className="breadcrumb-item"><Link to="/customer/orders-and-returns">My Orders and Return</Link></li>
                                        <li key={12} className="breadcrumb-item active">Thank you</li>
                                    </>
                                )
                            } else if (local === 'business-profile') {
                                return (
                                    <p style={{ 'display': 'inline-flex' }} key="-3">
                                        <li key={-1} className="breadcrumb-item"><Link to='/vendor/business-profile'> / My business profile </Link></li>
                                    </p>
                                )
                            } else if (local === 'checkout') {
                                return (
                                    <p style={{ 'display': 'inline-flex' }} key="-3">
                                        <li key={-1} className="breadcrumb-item"><Link to='my-cart'> / My Cart </Link></li>
                                        <li key={-2} className="breadcrumb-item active">
                                            {
                                                data.map((answer, k) => {
                                                    return (<span key={k}>{capitalize(answer)} </span>)
                                                })
                                            }
                                        </li>
                                    </p>
                                )
                            } else if (local === 'product-integration') {
                                return (
                                    <p style={{ 'display': 'inline-flex' }} key="-3">
                                        <li key={-1} className="breadcrumb-item"><Link to='/vendor/dashboard'> / My Business Account </Link></li>
                                        <li key={-2} className="breadcrumb-item"><Link to='/vendor/product-listing'>  My Product listing </Link></li>
                                        <li key={-3} className="breadcrumb-item active">
                                            {
                                                data.map((answer, k) => {
                                                    return (<span key={k}>{capitalize(answer)} </span>)
                                                })
                                            }
                                        </li>
                                    </p>
                                )
                            } else if (local === 'all' || local === cat || local === 'email' || local === prodsku) {
                                return ('')
                            }

                            else if (local === returnId) {
                                return (
                                    <li key={j} className="breadcrumb-item">Return details</li>
                                )
                            }
                            else {
                                return (

                                    <li key={j} className="breadcrumb-item active">
                                        {
                                            data.map((answer, i) => {
                                                let str = answer.replace(/-/g, ' ');
                                                return (<span key={i}> {capitalize(str)} </span>)
                                            })
                                        }
                                    </li>

                                )
                            }

                        } else {
                            if (local === "" || local === "settings" || local === vendorIdprev) {
                                return "";
                            } else {

                                if (local === 'product-details' || local === 'products' || local === 'product-details-preview') {
                                    return (
                                        ''
                                    )
                                } else if (local === 'order-details') {
                                    return (
                                        <> <li key="-2" className="breadcrumb-item"><Link to={'/customer/dashboard'}>My Account</Link></li>
                                            <li key="-1" className="breadcrumb-item"><Link to={"/customer/orders-and-returns"}>My Orders and Returns</Link></li>
                                        </>
                                    )
                                } else if (local === 'customer') {
                                    return (
                                        <li key={j} className="breadcrumb-item"><Link to={"/customer/dashboard"}>My Account</Link></li>
                                    )
                                } else if (local === 'vendor') {
                                    return (
                                        <li key={j} className="breadcrumb-item"><Link to={"/vendor/dashboard"}>My Business Account</Link></li>
                                    )
                                } else if (local === category) {
                                    return (
                                        <li key={j} className="breadcrumb-item"><Link to={"/products/" + category}>{category}</Link></li>
                                    )
                                } else if (local === subcat) {
                                    return (
                                        <li key={j} className="breadcrumb-item"><Link to={"/products/" + category + "/" + subcat}>{subcat}</Link></li>
                                    )
                                } else if (local === childcat) {
                                    return (
                                        <li key={j} className="breadcrumb-item"><Link to={"/products/" + category + "/" + subcat + "/" + childcat}>{childcat}</Link></li>
                                    )
                                } else if (local === greatchildcat) {
                                    return (
                                        <li key={j} className="breadcrumb-item"><Link to={"/products/" + category + "/" + subcat + "/" + childcat + "/" + greatchildcat}>{greatchildcat}</Link></li>
                                    )
                                } else if (local === 'search') {
                                    return (
                                        <li key={j} className="breadcrumb-item"><Link to={"/"}>Search Results</Link></li>
                                    )
                                } else if (local === 'returns-complaints') {
                                    return (
                                        <li key={j} className="breadcrumb-item"><Link to={'/vendor/returns-complaints'}>My returns & complains</Link></li>

                                    )
                                } else if (local === 'sales-orders') {
                                    let data = local.split('-')
                                    return (

                                        <li key={j} className="breadcrumb-item"><Link to={'/vendor/sales-orders'}>My {

                                            data.map((answer, i) => {
                                                return (<span key={i}> {capitalize(answer)} </span>)
                                            })
                                        }</Link></li>
                                    )
                                } else if (local === 'payoutdetails') {
                                    let data = local.split('-')
                                    return (
                                        <li key={j} className="breadcrumb-item"><Link to={'/vendor/payouts'}>My {

                                            data.map((answer, i) => {
                                                return (<span key={i}> Payouts </span>)
                                            })
                                        }</Link></li>

                                    )
                                } else if (local === 'create-return' || local === 'return-details'|| local === 'return-summary') {
                                    return (
                                        <li key={j} className="breadcrumb-item"><Link to={"/customer/orders-and-returns"}>My Orders and Returns</Link></li>
                                    )
                                } else if (local === 'orderauth') {
                                    return (
                                        <li key={j} className="breadcrumb-item">Order Authentication</li>
                                    )
                                } else {
                                    let str = local.replace(/-/g, ' ');
                                    return (
                                        <li key={j} className="breadcrumb-item"><Link to={local === 'product-details' ? '/products' : "/" + local}>{local === 'product-details' ? 'Products' : capitalize(str)}</Link></li>
                                    )
                                }

                            }
                        }
                    })}
                </ol>
            )
            }
        </nav >
    );
}

export default Breadcrumbs;