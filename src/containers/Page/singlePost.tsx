import React, { useState, useEffect } from 'react';
import { PostData, GetDataOfCategory, postViews, GetCategoryList } from '../../redux/pages/magazineList';
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
    const { slug } = useParams();
    const [related, setRelated] = useState([]);
    const [catMenu, setCatMenu] = useState([]);
    const [opacityVal, setOpacity] = useState(1);

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
        let featuredResult: any = await GetDataOfCategory(lang, catId, 1, 'published_at', 'desc');
        const filteredItems = featuredResult.data.filter(item => item.post_id !== slug)
        setRelated(filteredItems);
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

            <div>
                <img style={imgStyle} src={post.post_thumbnail} alt="post-thumbnail" />
            </div>

            <div className="detail-page mt-5" >
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <ul className="newReleaseTitle">
                                <li className="border-right">{post.category_name}</li>
                                <li>{stats.text}</li>
                            </ul>
                        </div>
                        <div className="col-md-10 offset-md-1">
                            <h1 className="detail-page-title my-4 text-center">{post.title}</h1>
                        </div>
                        <div className="col-md-10 offset-md-1 text-center">
                            <ul className="date-social-link">
                                <li>{moment(post.published_at).format('LL')}</li>
                                <li>
                                    <FacebookShareButton
                                        url={shareUrl}
                                        quote={post.title}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="21.42" height="21.419" viewBox="0 0 21.42 21.419">
                                            <path id="facebook" d="M18.093,7.758A10.614,10.614,0,0,1,23.5,9.229,10.818,10.818,0,0,1,26.2,25.568a10.912,10.912,0,0,1-6.043,3.609v-7.7h2.1l.475-3.025h-3.18V16.472a1.722,1.722,0,0,1,.366-1.138,1.675,1.675,0,0,1,1.344-.511h1.921v-2.65q-.041-.013-.784-.105a15.591,15.591,0,0,0-1.692-.105,4.228,4.228,0,0,0-3.038,1.083,4.187,4.187,0,0,0-1.141,3.108v2.3H14.11v3.025h2.42v7.7a10.65,10.65,0,0,1-6.549-3.609,10.805,10.805,0,0,1,2.706-16.34,10.617,10.617,0,0,1,5.406-1.471Z" transform="translate(-7.383 -7.758)" fill="#2E2BAA" fillRule="evenodd" />
                                        </svg>
                                    </FacebookShareButton>
                                    <LinkedinShareButton
                                        url={shareUrl}
                                        title={post.title}>
                                        <svg id="_x31_0.Linkedin" xmlns="http://www.w3.org/2000/svg" width="21.472" height="21.472" viewBox="0 0 21.472 21.472">
                                            <path id="Path_17" data-name="Path 17" d="M52.176,49.981V42.117c0-3.865-.832-6.817-5.341-6.817a4.66,4.66,0,0,0-4.214,2.308h-.054V35.649H38.3V49.981h4.455V42.869c0-1.879.349-3.677,2.657-3.677,2.281,0,2.308,2.12,2.308,3.784v6.978h4.455Z" transform="translate(-30.704 -28.51)" fill="#2E2BAA" />
                                            <path id="Path_18" data-name="Path 18" d="M11.3,36.6h4.455V50.932H11.3Z" transform="translate(-10.951 -29.461)" fill="#2E2BAA" />
                                            <path id="Path_19" data-name="Path 19" d="M12.577,10a2.59,2.59,0,1,0,2.577,2.577A2.577,2.577,0,0,0,12.577,10Z" transform="translate(-10 -10)" fill="#2E2BAA" />
                                        </svg>
                                    </LinkedinShareButton>

                                    <TwitterShareButton
                                        url={shareUrl}
                                        title={post.title}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="85.393" height="22" viewBox="0 0 85.393 22">
                                            <g id="Group_727" data-name="Group 727" transform="translate(-785.223 -4492)">
                                                <g id="Group_728" data-name="Group 728">
                                                    <text id="Twitter" transform="translate(813.615 4510)" fontSize="18"
                                                        fontFamily="Lato-Semibold, Lato" fontWeight="600">
                                                        {/* <tspan x="0" y="0">Twitter</tspan> */}
                                                    </text>
                                                    <path id="twitter-brands"
                                                        d="M20.989,52.817c.015.208.015.416.015.623A13.548,13.548,0,0,1,7.362,67.082,13.549,13.549,0,0,1,0,64.93a9.919,9.919,0,0,0,1.158.059A9.6,9.6,0,0,0,7.11,62.94a4.8,4.8,0,0,1-4.483-3.325,6.047,6.047,0,0,0,.905.074,5.071,5.071,0,0,0,1.262-.163A4.8,4.8,0,0,1,.95,54.821v-.059a4.829,4.829,0,0,0,2.167.609,4.8,4.8,0,0,1-1.484-6.412,13.628,13.628,0,0,0,9.886,5.017,5.412,5.412,0,0,1-.119-1.1,4.8,4.8,0,0,1,8.3-3.28,9.439,9.439,0,0,0,3.043-1.158,4.782,4.782,0,0,1-2.108,2.642,9.612,9.612,0,0,0,2.761-.742A10.306,10.306,0,0,1,20.989,52.817Z"
                                                        transform="translate(785.223 4445.418)" fill="#2E2BAA" />
                                                </g>
                                            </g>
                                        </svg>
                                    </TwitterShareButton>

                                </li>
                            </ul>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: post.full_content }} />
						<div className="col-md-10 offset-md-1">
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
                                        <div className="container">
                                            <div className="row my-3">
                                                {related.map((item, i) => {
                                                    return (
                                                        <div className="col-md-4" key={i}>
                                                            <div className="blog-sec-main">
                                                                <div className="mag-blog-pic-2"><img src={item.list_thumbnail} alt="post-thumbnail" /></div>
                                                                <div className="cate-name">{item.categroy}</div>
                                                                <h3 className="mag-blog-title-2 my-2">{item.title}</h3>
                                                                <div className="cate-date mb-2">{moment(item.published_at).format('LL')}</div>
                                                                <p className="mag-blog-desc d-none"> <div dangerouslySetInnerHTML={{ __html: post.short_content }} /></p>
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
