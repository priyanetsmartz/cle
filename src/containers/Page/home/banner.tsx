import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { getHomePageBanner } from '../../../redux/pages/customers';
import Slider from "react-slick";


function HomeBanner(props) {
    const [banner, setBanner] = useState({
        banners:[]
    });
    const settings = {
        dots: false,
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
        <Slider {...settings}>
            {banner && banner.banners.map((item,i) => {
                return (
                    <div key={i} dangerouslySetInnerHTML={{ __html: item.resource_path }} />
                )
            })}
        </Slider>
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