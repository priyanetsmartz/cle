import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { getHomePageBanner } from '../../../redux/pages/customers';
import Slider from "react-slick";
import { Link } from "react-router-dom";
import './slider.css';
function HomeBanner(props) {
    const [banner, setBanner] = useState({
        banners: []
    });
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        let result: any = await getHomePageBanner();
        // console.log(result.data.items);
        if (result) {
            setBanner(result.data.items[0]);
        }
    }


    return (
        // <Slider {...settings}>
        //     {banner && banner.banners.map((item, i) => {
        //         return item.resource_type === "custom_html" ? (
        //             <div key={i} dangerouslySetInnerHTML={{ __html: item.resource_path }} />
        //         ) : item.resource_type === "local_image" ? (<img src={`https://4a83875b65.nxcli.net/${item.resource_path}`} alt="" />) :
        //             item.resource_type === "external_image" ? (<img src={item.resource_path} alt="" />) :
        //                 (<iframe className="product-full-img" title="product video" src={item.resource_path}>
        //                 </iframe>)
        //     })}
        // </Slider>
            <div className="gallery-wrap">
                <div className="item item-1">
                    <div className="part_one">Welcome to Our Marketplace</div>
                    <h2 className="part_one">Summer redolence</h2>
                    <div className="part_two">Refreshing fregrances reminiscent of the warm weather</div>
                    <div className="cta"><Link to="#">Discover</Link></div>
                </div>
                <div className="item item-2">
                    <div className="part_one">Welcome to Our Marketplace</div>
                    <h2 className="part_one">Summer redolence</h2>
                    <div className="part_two">Refreshing fregrances reminiscent of the warm weather</div>
                    <div className="cta"><Link to="#">Discover</Link></div>
                </div>
                <div className="item item-3">
                    <div className="part_one">Welcome to Our Marketplace</div>
                    <h2 className="part_one">Summer redolence</h2>
                    <div className="part_two">Refreshing fregrances reminiscent of the warm weather</div>
                    <div className="cta"><Link to="#">Discover</Link></div>
                </div>
                <div className="item item-4">
                    <div className="part_one">Welcome to Our Marketplace</div>
                    <h2 className="part_one">Summer redolence</h2>
                    <div className="part_two">Refreshing fregrances reminiscent of the warm weather</div>
                    <div className="cta"><Link to="#">Discover</Link></div>
                </div>
                <div className="item item-5">
                    <div className="part_one">Welcome to Our Marketplace</div>
                    <h2 className="part_one">Summer redolence</h2>
                    <div className="part_two">Refreshing fregrances reminiscent of the warm weather</div>
                    <div className="cta"><Link to="#">Discover</Link></div>
                </div>
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