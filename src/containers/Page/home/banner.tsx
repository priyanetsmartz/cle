import { useState, useEffect } from 'react';
import Slider from "react-slick";
import { connect } from 'react-redux';
import { getHomePageBanner } from '../../../redux/pages/customers';
import { Link } from "react-router-dom";
import { BrowserView, MobileView } from 'react-device-detect';
import './slider.css';

function HomeBanner(props) {
    const baseUrl = process.env.REACT_APP_API_URL;
    const imagePath = baseUrl + 'pub/media/';
    const [banner, setBanner] = useState({
        banners: []
    });
    const settings = {
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        infinite: true,
        autoplaySpeed: 2000,
    }
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
        <div className="banner-wrap">
            <BrowserView>
                <div className="gallery-wrap">
                    {banner && banner.banners.map((item, i) => {
                        return (<div key={i} className={`item ${item.is_featured === 1 ? 'featured' : ''}`} onMouseEnter={() => setActiveIndex(i)}
                            style={{ backgroundImage: `url(${imagePath + item.resource_path})`, height: '657px', width: '436px', flex: (activeIndex === i) ? 7 : 1 }} >
                            {(activeIndex === i) && <> <div className="slider-text-inner"><div className="head_one_txt">Welcome to Our Marketplace</div>
                                <h2 className="head_two_txt">{item.title}</h2>
                                <div className="head_three_txt">Refreshing fregrances reminiscent of the warm weather</div>
                                <div className="cta-dicover"><Link to="#">Discover</Link></div></div></>}
                        </div>)
                    })}
                </div>
            </BrowserView>
            <MobileView>
                <Slider {...settings}>
                    {banner && banner.banners.map((item, i) => {
                        return (<div key={i} className={`item ${item.is_featured === 1 ? 'featured' : ''}`} onMouseEnter={() => setActiveIndex(i)}
                            style={{ backgroundImage: `url(${imagePath + item.resource_path})`, height: '657px', width: '436px', flex: (activeIndex === i) ? 7 : 1 }} >
                            <img src={imagePath + item.resource_path} alt="" />
                            <div className="slider-text-inner"><div className="head_one_txt">Welcome to Our Marketplace</div>
                                <h2 className="head_two_txt">{item.title}</h2>
                                <div className="head_three_txt">Refreshing fregrances reminiscent of the warm weather</div>
                                <div className="cta-dicover"><Link to="#">Discover</Link></div></div>
                        </div>)
                    })}
                </Slider>
            </MobileView>
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