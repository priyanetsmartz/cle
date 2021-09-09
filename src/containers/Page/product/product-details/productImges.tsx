import { useEffect, useState } from 'react';
import homeVideo from "../../../../image/Website1440px.mp4"

const ProductImages = (props) => {
    const [productImage, setProductImages] = useState(props.productImages);
    const [fullSizedImg, setFullSizedImg] = useState(props.productImages[0]);
    useEffect(() => {
        setProductImages(props.productImages)
        setFullSizedImg(props.productImages[0]);
    }, [props.productImages])
    const changeImg = (i) => {
        console.log(productImage[i])
        setFullSizedImg(productImage[i]);
        // console.log(fullSizedImg.extension_attributes.video_content.video_url)
    }

    const scrolldown = () => {
        document.getElementById('inner').scrollTop -= 80;
    }
    const scrollup = () => {
        document.getElementById('inner').scrollTop += 80;
    }

    return (
        <div className="row">
            <div className="col-sm-2">
                <button onClick={scrolldown}>Pre</button>
                <div className="product-img-slider" id="inner">
                    {productImage.map((img, i) => {
                        return (
                            <img src={img.file} className="product-img" key={i} alt="" onClick={() => changeImg(i)} />
                        );
                    })}
                </div>
                <button onClick={scrollup}>Next</button>
            </div>
            <div className="col-sm-10 img-container">
                {
                    fullSizedImg && fullSizedImg.media_type === 'external-video' ? (
                        // <video controls muted autoPlay={false} loop playsInline className="product-full-img">
                        //     <source src={fullSizedImg.extension_attributes.video_content.video_url} type="video/mp4" />
                        //     Your browser does not support HTML video.
                        // </video>
                        <iframe className="product-full-img" title="product video" src={fullSizedImg.extension_attributes.video_content.video_url}>
                        </iframe>
                        
                    ) : <img src={fullSizedImg ? fullSizedImg.file : ""} alt="" className="product-full-img" />
                }

            </div>
        </div >
    )
}

export default ProductImages;