import React, { useState, useEffect } from 'react';
import { PostData, postViews, GetCategoryList, RelatedList } from '../../redux/pages/magazineList';
import { useParams } from "react-router-dom";
import moment from 'moment';
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton } from "react-share";
import IntlMessages from "../../components/utility/intlMessages";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import PostComment from './postComments';
import { getCookie } from "../../helpers/session";
const axios = require("axios");
const readingTime = require('reading-time');

function SinglePost(props) {
    const language = getCookie('currentLanguage');
    const [post, setPost] = useState({
        title: "",
        post_thumbnail: "",
        full_content: "",
        published_at: "",
        short_content: "",
        category_name: "",
        author_name: ""
    });

    const [shareUrl, setShareUrl] = useState('');
    const { slug }: any = useParams();
    const [related, setRelated] = useState([]);
    const [catMenu, setCatMenu] = useState([]);
    const [opacityVal, setOpacity] = useState(1);
    const [bread, setBread] = useState("");
    useEffect(() => {
        getData()
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [props.match.params.slug])

    const getCategory = async () => {
        let result: any = await GetCategoryList(props.languages);
        setCatMenu(result.data);
    }

    useEffect(() => {
        let lang = props.languages ? props.languages : language;
        getCategory();
        setShareUrl(window.location.href);
        PostViews(lang);
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [props.languages])


    async function getData() {
        let lang = props.languages ? props.languages : language;
        setOpacity(0.3);
        let result: any = await PostData(lang, slug);
        let catId = result.data[0].categories[0];
        let featuredResult: any = await RelatedList(lang, slug);
        const filteredItems = featuredResult.data.filter(item => item.post_id !== slug)
        setRelated(filteredItems);
        setBread(result?.data?.[0]?.title)
        setPost(result.data[0]);
        window.scrollTo(0, 0)
        setOpacity(1);
    }
    async function PostViews(languages) {
        const res = await axios.get('https://geolocation-db.com/json/');
        await PostData(languages, slug);
        await postViews(languages, slug, res.data.IPv4);
    }



    const imgStyle = {
        width: "100%"
    };
    const stats = readingTime(post.full_content);
    return (
        <div style={{ opacity: opacityVal }}>

            <div className="main-banner">
                <img style={imgStyle} src={post.post_thumbnail} alt="post-thumbnail" />
            </div>
            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                    <li className="breadcrumb-item"><Link to="/magazines">Magazine</Link></li>
                                    {slug && (<li className="breadcrumb-item">{bread}</li>)}
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>
            <div className="detail-page mt-5" >
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <ul className="newReleaseTitle">
                                <li className="border-right">{post.category_name}</li>
                                <li>{stats.text}</li>
                            </ul>
                        </div>
                        <div className="col-md-12">
                            <h1 className="detail-page-title my-4 text-center">{post.title}</h1>
                        </div>
                        <div className="col-md-12 text-center">
                            <ul className="date-social-link">
                                <li>{moment(post.published_at).format('LL')}</li>
                                <li>
                                    <FacebookShareButton
                                        url={shareUrl}
                                        quote={post.title}>
                                        <i className="fab fa-facebook"></i>
                                    </FacebookShareButton>
                                    <LinkedinShareButton
                                        url={shareUrl}
                                        title={post.title}>
                                        <i className="fab fa-linkedin-in"></i>
                                    </LinkedinShareButton>

                                    <TwitterShareButton
                                        url={shareUrl}
                                        title={post.title}>
                                        <i className="fab fa-twitter"></i>
                                    </TwitterShareButton>

                                </li>
                            </ul>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: post.full_content }} />
                        <div className="col-md-12">
                            <h6 className="author-name"><IntlMessages id="magazinepost.author" />: {post.author_name ? post.author_name : "Admin"}</h6>

                            <div className="cate-keywords">
                                {catMenu.map((item, i) => {
                                    return (
                                        <button type="button" className="btn btn-outline-dark" key={i}>
                                            <Link to={`/magazines/${item.category_id}`}>{item.name}</Link>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <div className="mt-5 py-5">
                                    {related.length > 0 && <h2 className="pb-3 text-center want-read"><IntlMessages id="magazinepost.slogan" /> </h2>}
                                    {related.length > 0 && (
                                        <div className="">
                                            <div className="row my-3">
                                                {related.map((item, i) => {
                                                    return (
                                                        <div className="col-md-4" key={i}>
                                                            <div className="blog-sec-main">
                                                                <div className="post-effect">
																<div className="mag-blog-pic-2"><img src={item.list_thumbnail} alt="post-thumbnail" /></div>
                                                                <div className="cate-name">{item.categroy}</div>
                                                                <h3 className="mag-blog-title-2 my-2">{item.title}</h3>
                                                                <div className="cate-date mb-2">{moment(item.published_at).format('LL')}</div>
                                                                <p className="mag-blog-desc"> <div dangerouslySetInnerHTML={{ __html: post.short_content }} /></p>
																</div>
                                                                <Link to={`/magazine/${item.post_id}`} className="signup-btn mx-auto "><IntlMessages id="magazine.read_more" /></Link>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                    {/* {!related.length && (
                                        <div className="container">
                                            <IntlMessages id="no_data" />
                                        </div>
                                    )} */}
                                </div>
                            </div>
                        </div>
                        {/* comments sections starts here */}
                        <PostComment postId={slug} />

                        {/* comments section ends here */}
                    </div>
                </div>

            </div>

        </div>
    );
}


function mapStateToProps(state) {
    let languages = '';

    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }
    return {
        languages: languages

    };
};
export default connect(
    mapStateToProps,
    {}
)(SinglePost);
