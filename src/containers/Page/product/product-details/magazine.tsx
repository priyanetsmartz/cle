import { useState, useEffect } from 'react';
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import IntlMessages from "../../../../components/utility/intlMessages";
function ProductsMagazine(props) {
    const [relatedPosts, setRelatedPosts] = useState([]);

    useEffect(() => {
        setRelatedPosts(props.posts)
        // console.log(relatedPosts)
        //    console.log(typeof (recomendedProducts))
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [props.posts])

    return (
        <div className="container">
            <div className="col-sm-12">
                {(relatedPosts && relatedPosts.length) ? (
                    <div className="magazine_article ">
                        <h1 className="mb-4"><IntlMessages id="magazine.title" /></h1>
                        <div className="row">
                            {relatedPosts.slice(0, 2).map((post) => {
                                return (
                                    <div className="col-sm-6" key={post.id}>
                                        <div className="magzine_blog">
                                            <div className="blog_img">
                                                <img src={post.img} alt={post.title} className="img-fluid" />
                                            </div>
                                            <h3 className="text">{post.title}</h3>
                                            <div dangerouslySetInnerHTML={{ __html: post.short_content }} />
                                            <Link to={'/magazine/' + post.id} type="button" className="btn btn-secondary"> Read more</Link>
                                        </div>
                                    </div>
                                )
                            })}

                        </div>
                    </div>
                ) : ""}
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
)(ProductsMagazine);