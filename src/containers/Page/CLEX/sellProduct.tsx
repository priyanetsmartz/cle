import React from 'react';

function SellProduct(props) {
    const handleOnChange = async (e) => {
        e.preventDefault();
        const [value]  = e.target;
    }
    return (
        <div className="container about-inner-clex inner-pages-clex"  >
            <section>
                <h1>Sell An Item</h1>
                <p>Give your wardrobe a second life. Sell what you don't wear to our global
                    fashion community: list it yourself in less than 60 seconds.</p>
            </section>
            <section>
                <h2>CHOCSE THE PRODUCT CATEGORYY</h2>
                <p>Choose the item. You can sell watch or bag.</p>
                <div className='chooseCategory'>
                    <div className='options'>
                        <input type="radio" id="watch" onChange={handleOnChange} name="fav_language" value="watch" />
                        <label htmlFor="html">Watch</label>
                    </div>
                    <div className='options'>
                        <input type="radio" id="bag" onChange={handleOnChange} name="fav_language" value="bag" />
                        <label htmlFor="css">Bag</label>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default SellProduct;