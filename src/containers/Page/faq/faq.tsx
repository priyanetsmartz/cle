import { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { getFaqlabels } from '../../../redux/pages/allPages';
import { siteConfig } from '../../../settings';
import { Link } from "react-router-dom";
import FaqFooter from './faq-footer';
import IntlMessages from "../../../components/utility/intlMessages";
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
		if (results && results.data && results.data.length > 0 && results.data.items) {
			setFaqData(results.data.items)
		}

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
															<li key={i}><Link to={`/help-center/` + item['url_key'] + '?#' + question['title']}>{question['title']}</Link></li>
														))
													}
												</ul>
												<div className="faq-view-all">
													<Link to={`/help-center/` + item['url_key']}><IntlMessages id="category.viewAll" /></Link>
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
			<FaqFooter />

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