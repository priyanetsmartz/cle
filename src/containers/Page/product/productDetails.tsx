import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux'


function ProductDetails(props) {
    useEffect(() => {
    }, [])

    return (
        <>
            <div className="container">
    <div className="row flex-nowrap justify-content-between align-items-center top-menuselect">
      <div className="col-4 pt-1">
        <div className="select-wearing">
          <ul>
            <li> <a href="#" className="line-through-active up-arrow">Women</a> </li>
            <li> <a href="#">Men</a></li>
            <li> <a href="#">Kids</a></li>
            <li> <a href="#">All</a></li>
          </ul>
        </div>
      </div>
      <div className="col-4">
        <div className="cli_logo">
          <a className=" me-2" href="#">
            <img src="images/CLIlogo.png" className="img-fluid" />
          </a>
        </div>
      </div>
      <div className="col-4">

        <div className="sell_item" style={{display:'none'}}>
          <div className="sell_itemnote mb-2">
            <a href="" className="btn btn-green">Sell an Item</a>
          </div>
        </div>

        <div className="user_cart">
          <div className="cartuser-info">
            <ul>
              <li><a href="#">Alex </a></li>
              <li> <a href="#"><img src="images/avtar.svg"/> </a></li>
              <li> <a href="#"><img src="images/favrot.svg"/></a> </li>
              <li> <a href="#"><img src="images/carticon.svg"/> <span className="cart-number">(3)</span></a></li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  </div>

  <header className="header-top navbar navbar-expand-md navbar-light main-navbr mb-2">



    <nav className="container-xxl flex-wrap flex-md-nowrap " aria-label="Main navigation">


      <button className="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#bdNavbar"
        aria-controls="bdNavbar" aria-expanded="false" aria-label="Toggle navigation">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" className="bi" fill="currentColor"
          viewBox="0 0 16 16">
          <path fill-rule="evenodd"
            d="M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z">
          </path>
        </svg>

      </button>

      <div className="navbar-collapse collapse mainmenu-bar" id="bdNavbar">
        <ul className="navbar-nav flex-row flex-wrap bd-navbar-nav pt-2 py-md-0">
          <li className="nav-item col-6 col-md-auto">
            <a className="nav-link p-2" href="/">New in</a>
          </li>
          <li className="nav-item col-6 col-md-auto">
            <a className="nav-link p-2 active" aria-current="true" href="#" >Watches</a>
          </li>
          <li className="nav-item col-6 col-md-auto">
            <a className="nav-link p-2" href="/docs/5.0/examples/" >Jewerly</a>
          </li>
          <li className="nav-item col-6 col-md-auto">
            <a className="nav-link p-2" href="https://icons.getbootstrap.com/"  target="_blank"
              rel="noopener">Designers</a>
          </li>
          <li className="nav-item col-6 col-md-auto">
            <a className="nav-link p-2" href="https://themes.getbootstrap.com/"  target="_blank"
              rel="noopener">Pre-Owned</a>
          </li>
          <li className="nav-item col-6 col-md-auto">
            <a className="nav-link p-2" href="https://blog.getbootstrap.com/"  target="_blank"
              rel="noopener">Sale</a>
          </li>
        </ul>

        <hr className="d-md-none text-white-50"/>

        <ul className="navbar-nav flex-row flex-wrap ms-md-auto">
          <div className="search_input">
            <div className="search_top"><img src="images/Icon_zoom_in.svg" alt="" className="me-1" />
              <input type="search" placeholder="Search..." className="form-control me-1"/>
              <select className="form-select" aria-label="Default select example">
                <option selected>Select category</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>

            </div>
          </div>
        </ul>


      </div>
    </nav>


  </header>

  <main>

    <section>
      <div className="notification">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="promotion_alert">
                <p>
                  <span className="promition">promotion</span> Contrary to popular belief, Lorem Ipsum is not simply random
                  text.
                </p>

              </div>
              <div className="alert_cross">
                <a href="#"><img src="images/cross.svg" className="" alt=""/> </a>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>

    <section>
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item"><a href="#">Home</a></li>
                <li className="breadcrumb-item"><a href="#">Women</a></li>
                <li className="breadcrumb-item"><a href="#">Designers</a></li>
                <li className="breadcrumb-item"><a href="#">Bottega Veneta</a></li>
                <li className="breadcrumb-item"><a href="#">Jewelry</a></li>
                <li className="breadcrumb-item active" aria-current="page">Necklaces</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

    </section>

    <section>
      <div className="container">
        <div className="row">
          <div className="col-sm-8">
            <div className="product-slider">
              <img src="images/product_img.svg" alt="" className="img-fluid"/>
            </div>
          </div>
          <div className="col-sm-4">

            <div className="product_description">
              <div className="list_accordon">
                <ul>
                  <li><a href="javascript:void(0)" className="active">Sale</a></li>
                  <li><a href="javascript:void(0)">New Designers</a></li>
                  <li><a href="javascript:void(0)">Popular</a></li>
                </ul>
                <div className="logo_stampg">
                  <a href="#"><img src="images/cle work-logo.svg" alt="" className="img-fluid"/></a>
                </div>
              </div>
              <div className="product_details">
                <h1>Bottega Veneta</h1>
                <h2>18Kt Gold-Plated Sterling-Silver Chain Necklace</h2>
              </div>
              <div className="product-sale_off mt-4 mb-4">
                <div className="product_saleoff"><span className="saleoff">$2,850</span> now 25% off</div>
                <div className="product_price">$2,137</div>
              </div>
              <div className="selection-process mb-2">
                <div className="row">
                  <div className="col-sm-4">
                    <div className="form-group">
                      <span className="form-label">Quantity:</span>
                      <select className="form-select" aria-label="Default select example">
                        <option >1</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="form-group">
                      <span className="form-label">Size:</span>
                      <select className="form-select" aria-label="Default select example">
                        <option>One size</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div className="form-group">
                      <a href="#" className="">Size Guide</a>
                    </div>
                  </div>
                </div>

              </div>

              <div className="width-100 my-3">
                <div className="d-grid">
                  <button type="button" className="btn btn-primary"><img src="images/carticon_btn.svg" alt="" className="pe-1"/>
                    Add to Cart</button>
                </div>
              </div>

              <div className="row my-3">
                <div className="d-grid gap-2 d-md-flex justify-content-start">
                  <button type="button" className="btn btn-outline-primary me-4">Send a Gift</button>
                  <button type="button" className="btn btn-outline-success"><img src="images/share-alt-solidicon.svg" alt=""
                      className="pe-1"/> </button>
                </div>
              </div>

            </div>

            <div className="accodian_descrpt">
              <div className="accordion accordion-flush" id="accordionFlushExample">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingOne">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                      Description
                    </button>
                  </h2>
                  <div id="flush-collapseOne" className="accordion-collapse collapse" aria-labelledby="flush-headingOne"
                    data-bs-parent="#accordionFlushExample">
                    <div className="accordion-body">
                      <p> Bottega Veneta’s 18kt gold-plated sterling-silver necklace is joined with marbled-brown
                        picture jasper links – a semi-precious healing stone thought to bring tranquility to the wearer.
                        It’s handcrafted by an Italian goldsmith with curb and irregular-chain links. Alternate between
                        wearing it with the T-bar pendant at the front and back.</p>

                      <p> Shown here with Bottega Veneta Gathered-back balloon-sleeve poplin shirt.</p>

                      <p> Product number: 1396090</p>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingTwo">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                      Details
                    </button>
                  </h2>
                  <div id="flush-collapseTwo" className="accordion-collapse collapse" aria-labelledby="flush-headingTwo"
                    data-bs-parent="#accordionFlushExample">
                    <div className="accordion-body">
                      <div className="details_product">
                        <ul>
                          <li>Colour: Gold</li>
                          <li>Composition: 18kt gold-plated sterling silver.</li>
                          <li>Country of origin: Italy</li>
                          <li>Curb-chain links</li>
                          <li>Picture jasper-stone links</li>
                          <li>T bar</li>
                          <li>Clasp fastening</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingThree">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                      Size
                    </button>
                  </h2>
                  <div id="flush-collapseThree" className="accordion-collapse collapse" aria-labelledby="flush-headingThree"
                    data-bs-parent="#accordionFlushExample">
                    <div className="accordion-body">
                      <div className="details_product">
                        <ul>
                          <li> Chain length 16.6in/42.5cm</li>
                          <li> Max feature width 1.4in/3.8cm</li>
                          <li> Max feature length 0.7in/1.3cm</li>
                        </ul>
                        <a href="#" className="sizeguid">Size Guide</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="flush-headingFourth">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                      data-bs-target="#flush-collapseFourth" aria-expanded="false" aria-controls="flush-collapseThree">
                      Shipping and returns
                    </button>
                  </h2>
                  <div id="flush-collapseFourth" className="accordion-collapse collapse"
                    aria-labelledby="flush-headingFourth" data-bs-parent="#accordionFlushExample">
                    <div className="accordion-body">
                      <div className="express_rate">

                        <ul>
                          <li>Express: EUR $25</li>
                        </ul>

                        <p>
                          Delivery between 9am-5pm, Monday to Friday
                          Receive your purchases in 2-3 working days after your order has been placed
                        </p>

                        <ul>
                          <li>Standard: EUR $15</li>
                        </ul>
                        <p>
                          Delivery between 9am-5pm, Monday to Friday
                          Receive your purchases in 3-4 working days after your order has been placed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>



          </div>
        </div>
      </div>
    </section>

    <section>
      <div className="container">
        <div className="col-sm-12">
          <div className="recommendations-section text-center ">
            <h1>Recommendations</h1>
            <div className="recommed-slider">
              <div className="regular slider">
                <div className="productcalr">
                  <div className="product_img"><img src="images/kbg8zolf.png" className="image-fluid" /> </div>
                  <div className="product_name"> Bottega Veneta </div>
                  <div className="product_price"> $2,803</div>
                </div>
                <div className="productcalr">
                  <div className="product_img"><img src="images/kbg8zolf.png" className="image-fluid" /> </div>
                  <div className="product_name"> Bottega Veneta </div>
                  <div className="product_price"> $2,803</div>
                </div>

                <div className="productcalr">
                  <div className="product_img"><img src="images/kbg8zolf.png" className="image-fluid" /> </div>
                  <div className="product_name"> Bottega Veneta </div>
                  <div className="product_price"> $2,803</div>
                </div>

                <div className="productcalr">
                  <div className="product_img"><img src="images/kbg8zolf.png" className="image-fluid" /> </div>
                  <div className="product_name"> Bottega Veneta </div>
                  <div className="product_price"> $2,803</div>
                </div>

                <div className="productcalr">
                  <div className="product_img"><img src="images/kbg8zolf.png" className="image-fluid" /> </div>
                  <div className="product_name"> Bottega Veneta </div>
                  <div className="product_price"> $2,803</div>
                </div>

                <div className="productcalr">
                  <div className="product_img"><img src="images/kbg8zolf.png" className="image-fluid" /> </div>
                  <div className="product_name"> Bottega Veneta </div>
                  <div className="product_price"> $2,803</div>
                </div>

                <div className="productcalr">
                  <div className="product_img"><img src="images/kbg8zolf.png" className="image-fluid" /> </div>
                  <div className="product_name"> Bottega Veneta </div>
                  <div className="product_price"> $2,803</div>
                </div>

                <div className="productcalr">
                  <div className="product_img"><img src="images/kbg8zolf.png" className="image-fluid" /> </div>
                  <div className="product_name"> Bottega Veneta </div>
                  <div className="product_price"> $2,803</div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <div className="container">
        <div className="col-sm-12">
          <div className="magazine_article ">
            <h1 className="mb-4">Magazine</h1>
            <div className="row">

              <div className="col-sm-6">
                <div className="magzine_blog">
                  <div className="blog_img">
                    <img src="images/blog_1.jpg" alt="" className="img-fluid" />
                  </div>
                  <h3 className="text">Preppy style: how to wear the trend in 2021</h3>
                  <p className="text">This season’s runways were packed with preppy references, from V-neck knitted sweaters
                    to socks with loafers. But what is preppy style and how do you cremplement your look, jewellery is a
                    tremplement your look, jewellery is a tremplement your look, jewellery is a tremplement your look,
                    jewellery is a tremplement your look, jewellery is a tremplement your look, jewellery is a
                    tremplement your look, jewellery is a tremplement your look, jewellery is a treate a...</p>
                  <button type="button" className="btn btn-secondary"> Read more</button>
                </div>
              </div>

              <div className="col-sm-6">
                <div className="magzine_blog">
                  <div className="blog_img">
                    <img src="images/blog_1.jpg" alt="" className="img-fluid" />
                  </div>
                  <h3 className="text">Introducing... The Jewellery Guide</h3>
                  <p className="text">Adding the final touch to complement your look, jewellery is a treasured accesmplement
                    your look, jewellery is a tremplement your look, jewellery is a tremplement your look, jewellery is
                    a tremplement your look, jewellery is a tremplement your look, jewellery is a tresory that varies
                    from the everyday to the collectible. Whether you are sourcing a logo...</p>
                  <button type="button" className="btn btn-secondary"> Read more</button>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>


  </main>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        items: state.Cart.items
    }
}

export default connect(
    mapStateToProps
)(ProductDetails);