import { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { getFaqlabels } from '../../../redux/pages/allPages';
import { siteConfig } from '../../../settings';
import { Link } from "react-router-dom";
import IntlMessages from "../../../components/utility/intlMessages";
import FaqHeader from './faq-header';
function Faq(props) {

	const [faqData, setFaqData] = useState([])
	useEffect(() => {
		getData();

		return () => {
			setFaqData([])
		}
	}, [props.languages]);

	async function getData() {
		let results: any = await getFaqlabels(props.languages, siteConfig.pageSize, siteConfig.questionLimitFaq);
		setFaqData(results.data.items)
	}

	return (
		<section>
			<section className="faq-topics">
				<div className="container">
					<div className="row">
						<div className="col-sm-12">
							<h2><IntlMessages id="topic.faq" /></h2>
							{faqData && faqData.length > 0 && (
								<div className="row">

									{
										faqData.map((item, index) => (
											<div className="col-sm-4" key={index}>
												<h4><i className="fas fa-truck"></i>{item['title']} </h4>
												<ul className="list-unstyled">
													{
														item['questionArray'].map((question, i) => (
															<li key={i}><Link to={`help-center/` + item['url_key'] + '?id=' + question['question_id']}>{question['title']}</Link></li>
														))
													}
												</ul>
												<div className="faq-view-all">
													<Link to={`help-center/` + item['url_key']}><IntlMessages id="category.viewAll" /></Link>
												</div>
											</div>
										))
									}

								</div>
							)}
						</div>
					</div>
				</div>
			</section>
			<section className="faq-form">
				<div className="container">
					<div className="row">
						<div className="col-xs-12 col-md-6 offset-md-3 col-lg-6 offset-lg-3">
							<iframe title="contact form" style={{ "height": "800px", "width": "99%", "border": "none" }} src='https://forms.zohopublic.com/cleportal692/form/ContactusTeaser/formperma/ChqWeIlStcsFpEqH1XolNHheBwaVh9Huwq8bZ6pXOIQ'></iframe>
						</div>
					</div>
				</div>
			</section>

		</section>
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
)(Faq);