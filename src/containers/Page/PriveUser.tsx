import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from "react-router-dom";
import IntlMessages from "../../components/utility/intlMessages";
import { FeaturedList, GetCategoryData, SendNewsletter, GetCategoryList, GetDataOfCategory } from '../../redux/pages/magazineList';



function PriveUser(props) {
  const { category } = useParams();
  const [catMenu, setCatMenu] = useState([]);
  const [opacityVal, setOpacity] = useState(1);
  const [latest, setlatestItem] = useState({list_thumbnail:'https://4a83875b65.nxcli.net/pub/media/amasty/blog/cache/p/o/1440/760/post-list-top.png'})


  useEffect(() => {
    getCategoryList(props.languages);
  }, [props.languages, category])

  async function getCategoryList(language) {
    let result: any = await GetCategoryList(props.languages);
    setCatMenu(result.data);
  }




  return (

    <>
      <div className="container magazine-inner" style={{ opacity: opacityVal }}>

        <div className="row mt-3 mag-list-head">
          <div className="col-md-6 offset-md-3 text-center">
            <h3><IntlMessages id="prive.prive_user" /></h3>
            {catMenu.length > 0 && (
              <ul>
                <li key="0"><Link to="/learn" className={!category ? "active-menu" : ""}>Latest</Link></li>
                {catMenu.map((item, i) => {
                  let link = "/learn-category/" + item.category_id;
                  let classValue = item.category_id === category ? "active-menu" : "";

                  return (
                    <li key={i}><Link to={link} className={classValue}>{item.name}</Link></li>
                  )
                })}
              </ul>
            )}

          </div>
        </div>
        <div className="row">
          <div className="col-md-12 back-home mb-2">
            <Link to="/">
              <svg className="me-2" xmlns="http://www.w3.org/2000/svg" width="6.08" height="9.743" viewBox="0 0 6.08 9.743">
                <path id="Path_13" data-name="Path 13" d="M0,5,4.5,0,9,5" transform="translate(0.747 9.372) rotate(-90)" fill="none" stroke="#2E2BAA" strokeWidth="1" />
              </svg> <IntlMessages id="backhome.link" />
            </Link>
          </div>
        </div>
      </div>
      <div className="mag-top-banner">
        <img src={latest.list_thumbnail} alt="list_thumbnail" />
        
      </div>
    </>
  );
}

export default PriveUser

