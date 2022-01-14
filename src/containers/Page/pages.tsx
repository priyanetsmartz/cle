import { useEffect, useState } from 'react';
import { Pages } from '../../redux/pages/allPages';
import { getCookie } from "../../helpers/session";
import { Helmet, HelmetProvider } from 'react-helmet-async';
function AllPages(props) {
    const [pagesData, SetPagesData] = useState({ title: '', content: '', meta_description: '', meta_keywords: '', meta_title: '' })
    const language = getCookie('currentLanguage');
    useEffect(() => {
        let pageIdentifier = props.match.params.id;
        let lang = props.languages ? props.languages : language;
        async function fetchMyAPI() {
            let result: any = await Pages(pageIdentifier, lang);
            var jsonData = result.data.items[0];
            SetPagesData(jsonData)

        }
        fetchMyAPI()
        return () => {
            // componentwillunmount in functional component.
            // Anything in here is fired on component unmount.
        }
    }, [props.match.params.id, props.languages])

    return (
        <div className="container about-inner inner-pages">

            {props.match.params.id !== 'contact-us' ?
                <><HelmetProvider>
                    <Helmet >
                        <title>{pagesData?.title}</title>
                        <meta name="description" content={pagesData?.meta_description} />
                        <meta name="keywords" content={pagesData?.meta_keywords} />
                        <meta property="og:title" content={pagesData?.meta_title} />
                        <meta property="og:description" content={pagesData?.meta_description} />
                        {/* <meta property="og:image" content="$OG_IMAGE" /> */}
                    </Helmet>
                </HelmetProvider>
                    <figure className="text-center page-head">
                        <svg xmlns="http://www.w3.org/2000/svg" width="850" height="144" viewBox="0 0 850 144">
                            <text id="{pagesData.title}" data-name="{pagesData.title}" transform="translate(425 108)" fill="none" stroke="#2E2BAA"
                                strokeWidth="1" fontSize="110" fontFamily="Monument Extended Book">
                                <tspan x="-423.555" y="0">{pagesData ? pagesData.title : "404"}</tspan>
                            </text>
                        </svg>
                    </figure>
                </>
                : ''
            }
            <div dangerouslySetInnerHTML={{ __html: pagesData ? pagesData.content : "Ooops Page not found...." }} />
        </div>
    );
}

export default AllPages;