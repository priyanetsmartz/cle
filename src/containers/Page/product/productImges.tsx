import Slider from "react-slick";

const ProductImages = (props) => {
    const settings = {
        customPaging: (i) => {
            console.log(i);
            return (
                <a>
                    <img src={i} />
                </a>
            );
        },
        dots: true,
        dotsClass: "slick-dots slick-thumb",
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <Slider {...settings}>
            <div>
                <img src="https://picsum.photos/id/1018/1000/600/" />
            </div>
            <div>
                <img src="https://picsum.photos/id/1015/1000/600/" />
            </div>
            <div>
                <img src="https://picsum.photos/id/1019/1000/600/" />
            </div>
            <div>
                <img src="https://picsum.photos/id/1012/1000/600/" />
            </div>
        </Slider>
    )
}

export default ProductImages;