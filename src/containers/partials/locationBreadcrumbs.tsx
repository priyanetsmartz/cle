import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

function Breadcrumbs(props) {
    const location = useLocation()
    const { category, subcat, childcat, greatchildcat } = useParams();
    let stateBread = location.pathname.split('\/');
    const [breadcrumsState, setBreadcrumsState] = useState(stateBread);
    const [keyUl, setKey] = useState('');
    useEffect(() => {
        let urlPath = '';
        if (category && subcat && childcat && greatchildcat) {
            urlPath = category + "/" + subcat + "/" + childcat + '/' + greatchildcat;
        } else if (category && subcat && childcat) {
            urlPath = category + "/" + subcat + "/" + childcat;
        } else if (category && subcat) {
            urlPath = category + "/" + subcat;
        } else {
            urlPath = category;
        }
      //  console.log(urlPath)
        // let test = urlPath.split("/");
        //console.log(test)
        setKey(urlPath)
        let breads = location.pathname.split('\/');
        setBreadcrumsState(breads)
    }, [location]);

    return (
        <nav aria-label="breadcrumb" className="new-breadcrumb">
            {(location.pathname !== "/home") && (<ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                {breadcrumsState.map((local, j) => {
                    //       console.log(local)              
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