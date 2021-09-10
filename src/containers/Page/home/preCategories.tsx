import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { getContent } from '../../../redux/pages/customers';


function PreCategories(props) {
    const [pagesData, SetPagesData] = useState({ title: '', content: '' })

    useEffect(() => {
        getData();
    }, [props.languages]);

    const getData = async () => {
        let result: any = await getContent(props.languages, 'home_page_pre-owned_category');
        // console.log(result.data.items[0].content);
        if (result) {
            SetPagesData(result.data.items[0]);
        }
    }

    return (
        <>
            {pagesData ? <div dangerouslySetInnerHTML={{ __html: pagesData.content }} /> : ""}
        </>
        // <section className="width-100 discover-bg my-5">
        //     <div className="container">
        //         <div className="row ">
        //             <div className="col-sm-12 col-md-6 px-0">
        //                 <div className="discoverleft">
        //                     <h2>Discover the Pre-Owned category</h2>
        //                     <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
        //                         dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan
        //                         lacus vel facilisis. </p>
        //                     <div className="company-logo"><img src="images/compy-logo.svg" alt="" className="img-fluid" /></div>
        //                     <div className="newdesigner-btn">
        //                         <button type="button" className="btn btn-greenview">View more</button>
        //                     </div>
        //                 </div>
        //             </div>
        //             <div className="col-sm-12 col-md-6 px-0">
        //                 <div className="list-prodctsale">
        //                     <div className="accordion" id="accordionExample">
        //                         <div className="accordion-item">
        //                             <h2 className="accordion-header" id="headingOne">
        //                                 <button className="accordion-button" type="button" data-bs-toggle="collapse"
        //                                     data-bs-target="#collapselistOne" aria-expanded="true" aria-controls="collapselistOne">
        //                                     <div><span className="list-number"> <span className="number-sort">1</span> </span> <span>List a product
        //                                         for sale</span></div>
        //                                 </button>
        //                             </h2>
        //                             <div id="collapselistOne" className="accordion-collapse collapse show" aria-labelledby="headingOne"
        //                                 data-bs-parent="#accordionExample">
        //                                 <div className="accordion-body">
        //                                     Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        //                                     labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida.
        //                                 </div>
        //                             </div>
        //                         </div>
        //                         <div className="accordion-item">
        //                             <h2 className="accordion-header" id="headingTwo">
        //                                 <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
        //                                     data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
        //                                     <div> <span className="list-number"><span className="number-sort">2</span></span> <span> Ship your
        //                                         item</span></div>
        //                                 </button>
        //                             </h2>
        //                             <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo"
        //                                 data-bs-parent="#accordionExample">
        //                                 <div className="accordion-body">
        //                                     <strong>This is the second item's accordion body.</strong> It is hidden by default, until the
        //                                     collapse plugin adds the appropriate classes that we use to style each element. These classes
        //                                     control the overall appearance, as well as the showing and hiding via CSS transitions. You can
        //                                     modify any of this with custom CSS or overriding our default variables. It's also worth noting
        //                                     that just about any HTML can go within the <code>.accordion-body</code>, though the transition
        //                                     does limit overflow.
        //                                 </div>
        //                             </div>
        //                         </div>
        //                         <div className="accordion-item">
        //                             <h2 className="accordion-header" id="headingThree">
        //                                 <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse"
        //                                     data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
        //                                     <div> <span className="list-number"><span className="number-sort">3</span></span><span> We release found
        //                                         to you</span> </div>
        //                                 </button>
        //                             </h2>
        //                             <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree"
        //                                 data-bs-parent="#accordionExample">
        //                                 <div className="accordion-body">
        //                                     <strong>This is the third item's accordion body.</strong> It is hidden by default, until the
        //                                     collapse plugin adds the appropriate classes that we use to style each element. These classes
        //                                     control the overall appearance, as well as the showing and hiding via CSS transitions. You can
        //                                     modify any of this with custom CSS or overriding our default variables. It's also worth noting
        //                                     that just about any HTML can go within the <code>.accordion-body</code>, though the transition
        //                                     does limit overflow.
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>

        //             </div>

        //         </div>
        //     </div>
        // </section>
    )
}

const mapStateToProps = (state) => {
    let languages = '';

    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }

    return {
        languages: languages
    }
}

export default connect(
    mapStateToProps
)(PreCategories);