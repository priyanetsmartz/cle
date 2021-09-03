import { useState } from 'react';


const ProductImages = (props) => {
    const [productImage, setProductImages] = useState(props.productImages);
    const [fullSizedImg, setFullSizedImg] = useState(productImage[0]);
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
            <div className="col-sm-2">
                <button onClick={scrolldown}>Pre</button>
                <div className="product-img-slider" id="inner">
                    {productImage.map((img, i) => {
                        return (
                            <img src={img} className="product-img" key={i} alt="" onClick={() => changeImg(i)} />
                        );
                    })}
                </div>
                <button onClick={scrollup}>Next</button>
            </div>
            <div className="col-sm-10 img-container">
                <img src={fullSizedImg} alt="" className="product-full-img" />
            </div>
        </div>
    )
}

export default ProductImages;