import { useState, useEffect } from 'react';
import IntlMessages from "../../components/utility/intlMessages";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import notification from '../../components/notification';

import { MagazineList } from '../../redux/pages/magazineList';

function Magazine() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        async function getData() {
            let result: any = await MagazineList();
            if(result.data.length > 0) {
                setItems(result.data);
            }else{
                notification("error", "", "No data found!");
            }
            console.log(result);
            // history.push("/signup");
        }
        getData()

    }, [])


    return (
        <>
            <div className="container magazine-inner">
                <figure className="offset-md-1 ps-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="770" height="134" viewBox="0 0 770 134">
                        <text id="Magazine" transform="translate(385 98)" fill="none" stroke="#2e2baa" strokeWidth="1" fontSize="110"
                            fontFamily="Monument Extended Book">
                            <tspan x="-383.515" y="0">Magazine</tspan>
                        </text> </svg>
                </figure>
                <div className="row my-3 mag-first-sec">
                    {items.map((item, i) => {
                        return (
                            <div className={"col-md-5 " + (((i % 2) == 0) ? 'offset-md-1' : 'mt-5')} key={i}>
                                <div className="blog-sec-main">
                                    <div className="mag-blog-pic"><img src={item.list_thumbnail} /></div>
                                    <h3 className="mag-blog-title mt-5 mb-3">{item.title}</h3>
                                    <p className="mag-blog-desc d-none">{item.short_content}...</p>
                                    <Link to={"/magazine/"+item.post_id} className="signup-btn"><IntlMessages id="magazine.read_more" /></Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="row mt-5">
                    <div className="col-12 text-center">
                        <Link to={"/magazine/see-all"} className="signup-btn" href=""><IntlMessages id="magazine.see_all_articles" /></Link>
                    </div>
                </div>

            </div>
        </>
    );
}

export default Magazine;
