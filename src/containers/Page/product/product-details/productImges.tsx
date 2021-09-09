import { useEffect, useState } from 'react';


const ProductImages = (props) => {
    const [productImage, setProductImages] = useState(props.productImages);
    const [fullSizedImg, setFullSizedImg] = useState(productImage[0]);
    useEffect(() => {
        setProductImages(props.productImages)
        setFullSizedImg(productImage[0]);
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
                        <video autoPlay loop muted playsInline className="product-full-img">
                            <source src={fullSizedImg.extension_attributes.video_content.video_url} type="video/mp4" />
                            Your browser does not support HTML video.
                        </video>
                    ) : <img src={fullSizedImg ? fullSizedImg.file : ""} alt="" className="product-full-img" />
                }

            </div>
        </div>
    )
}

export default ProductImages;