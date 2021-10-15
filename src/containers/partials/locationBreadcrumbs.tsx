import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Breadcrumbs(props) {
    const location = useLocation()
    let stateBread = location.pathname.split('\/');
    const [breadcrumsState, setBreadcrumsState] = useState(stateBread);
    useEffect(() => {
        console.log(location)
        let breads = location.pathname.split('\/');
        setBreadcrumsState(breads)
    }, [location]);

    return (
        <nav aria-label="breadcrumb" className="new-breadcrumb">
            {(location.pathname !== "/home") && (<ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                {breadcrumsState.map((local, j) => {                   
                    if (j === breadcrumsState.length - 1) {
                        return (
                            <li key={j} className="breadcrumb-item active">{local}</li>
                        )
                    } else {
                        if (local === "") {
                            return "";
                        } else {
                            return (
                                <li key={j} className="breadcrumb-item"><Link to={local === 'product-details' ? '/products' : "/" + local}>{local === 'product-details' ? 'Products' : local}</Link></li>
                            )
                        }
                    }
                })}
            </ol>
            )}
        </nav>
    );
}

export default Breadcrumbs;