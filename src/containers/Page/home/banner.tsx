import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { getHomePageBanner } from '../../../redux/pages/customers';
import { Link } from "react-router-dom";
import './slider.css';

function HomeBanner(props) {
    const [banner, setBanner] = useState({
        banners: []
    });
    const [activeIndex, setActiveIndex] = useState(null);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        let result: any = await getHomePageBanner();
        if (result) {
            setBanner(result.data.items[0]);
        }
    }


    return (
        <div className="gallery-wrap">
            {banner && banner.banners.map((item, i) => {
                return (<div className={`item ${item.is_featured == 1 ? 'featured' : ''}`} onMouseEnter={() => setActiveIndex(i)}
                    style={{ backgroundImage: `url(${item.resource_path})`, height: '657px', width: '436px', flex:(activeIndex == i) ? 7 : 1 }} >
                    {(activeIndex == i) && <> <div className="part_one">Welcome to Our Marketplace</div>
                        <h2 className="part_one">{item.title}</h2>
                        <div className="part_two">Refreshing fregrances reminiscent of the warm weather</div>
                        <div className="cta"><Link to="#">Discover</Link></div></>}
                </div>)
            })}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        items: state.Cart.items
    }
}

export default connect(
    mapStateToProps
)(HomeBanner);