import { useEffect, useState } from 'react';

const ProductImages = (props) => {
    let featuredImage = props.productImages ? props.productImages[0] : "";
    const [productImage, setProductImages] = useState(props.productImages);
    const [fullSizedImg, setFullSizedImg] = useState(featuredImage);
    useEffect(() => {
        setProductImages(props.productImages)
        if (props.productImages && props.productImages.length > 0) {
            setFullSizedImg(props.productImages[0]);
        }

    }, [props.productImages])
    const changeImg = (i) => {
        setFullSizedImg(productImage[i]);
    }

    const scrolldown = () => {
        document.getElementById('inner').scrollTop -= 80;
    }
    const scrollup = () => {
        document.getElementById('inner').scrollTop += 80;
    }

    return (
        <div className="row">
            <div className="col-md-4 col-lg-2">
            <button onClick={scrolldown} className="pdp-thumbnail-pre"><i className="fas fa-chevron-up"></i></button>
                <div className="product-img-slider" id="inner">
                    {productImage.map((img, i) => {
                        return (
                            <img src={img.file} className="product-img" key={i} alt="" onClick={() => changeImg(i)} />
                        );
                    })}
                </div>
                <button onClick={scrollup} className="pdp-thumbnail-next"><i className="fas fa-chevron-down"></i></button>
            </div>
            <div className="col-md-8 col-lg-10 img-container">
                {
                    fullSizedImg && fullSizedImg.media_type === 'external-video' ? (
                        <iframe className="product-full-img" title="product video" src={fullSizedImg.extension_attributes.video_content.video_url}>
                        </iframe>

                    ) : <img src={fullSizedImg ? fullSizedImg.file : ""} alt="" className="product-full-img" />
                }

            </div>
        </div >
    )
}

export default ProductImages;