import { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { getFaqlabels } from '../../../redux/pages/allPages';
import { siteConfig } from '../../../settings';
import { Link } from "react-router-dom";
function Faq(props) {
	const [faqData, setFaqData] = useState([])
	useEffect(() => {
		getData();

		return () => {
			setFaqData([])
		}
	}, [props.languages]);

	async function getData() {
		let results = await getFaqlabels(props.languages, siteConfig.pageSize, siteConfig.questionLimitFaq);
		console.log("results1", results)

		let deummyData = {
			"items": [
				{
					"category_id": "1",
					"title": "Test FAQ",
					"page_title": "Test FAQ",
					"relative_url": "knowledge-base/test-faq/",
					"position": "0",
					"url_key": "test-faq",
					"status": "1",
					"meta_title": null,
					"meta_description": null,
					"visit_count": "0",
					"exclude_sitemap": "0",
					"created_at": "2021-12-07 03:55:05",
					"updated_at": "2021-12-08 05:10:02",
					"canonical_url": "test-faq",
					"noindex": "0",
					"nofollow": "0",
					"description": "<p>This is test faq category</p>",
					"icon": null,
					"stores": "0",
					"questions": "1,2",
					"questionCount": 2,
					"questionArray": [
						{
							"question_id": "1",
							"title": "What about the quality of product?",
							"answer": "<p>This product has best quality.</p>",
							"short_answer": "This product has best quality."
						}
					],
					"customer_groups": "0,1,4",
					"relatedquestions": ""
				},
				{
					"category_id": "2",
					"title": "Delivery questions",
					"page_title": null,
					"relative_url": "knowledge-base/delivery-questions/",
					"position": "2",
					"url_key": "delivery-questions",
					"status": "1",
					"meta_title": null,
					"meta_description": null,
					"visit_count": "0",
					"exclude_sitemap": "0",
					"created_at": "2021-12-07 06:41:00",
					"updated_at": "2021-12-09 10:11:17",
					"canonical_url": "delivery-questions",
					"noindex": "0",
					"nofollow": "0",
					"description": "",
					"icon": null,
					"stores": "0",
					"questions": "2",
					"questionCount": 1,
					"questionArray": [
						{
							"question_id": "2",
							"title": "Is this poduct deliver on time?",
							"answer": "<p>yes, this product always deliver on time.</p>",
							"short_answer": "yes, this product always deliver on time."
						}
					],
					"customer_groups": "0,1,4",
					"relatedquestions": "1"
				},
				{
					"category_id": "3",
					"title": "test related",
					"page_title": "test related",
					"relative_url": "knowledge-base/test-related/",
					"position": "3",
					"url_key": "test-related",
					"status": "1",
					"meta_title": null,
					"meta_description": null,
					"visit_count": "0",
					"exclude_sitemap": "0",
					"created_at": "2021-12-08 05:11:49",
					"updated_at": "2021-12-08 06:34:38",
					"canonical_url": "test-related",
					"noindex": "0",
					"nofollow": "0",
					"description": "<p>this is test</p>",
					"icon": null,
					"stores": "0",
					"questions": "1,2,3",
					"questionCount": 3,
					"questionArray": [
						{
							"question_id": "1",
							"title": "What about the quality of product?",
							"answer": "<p>This product has best quality.</p>",
							"short_answer": "This product has best quality."
						}
					],
					"customer_groups": "0,1,4",
					"relatedquestions": "1,2"
				}
			],
			"search_criteria": {
				"filter_groups": [],
				"page_size": 100
			},
			"total_count": 3
		}

		results = deummyData;
		console.log("results", results)
		setFaqData(results['items'])
	}
	return (
		<section>



			<section className="help-center-ban">
				<div className="container">
					<div className="row">
						<div className="col-xs-12 col-md-6 offset-md-3 col-lg-6 offset-lg-3">
							<h1>Help Center</h1>
							<p>We want to be there for you whenever you need us. Find the answer you need in our FAQ's section.</p>
							<div className="form-group has-search">
								<span className="fa fa-search form-control-feedback"></span>
								<input type="text" className="form-control" placeholder="Search..." />
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

							</nav>
						</div>
					</div>
				</div>
			</section>


			<section className="faq-topics">
				<div className="container">
					<div className="row">
						<div className="col-sm-12">
							<h2>FAQ topics</h2>
							<div className="row">

								{
									faqData.map((item, index) => (
										<div className="col-sm-4" key={index}>
											<h4><i className="fas fa-truck"></i>{item['title']} </h4>
											<ul className="list-unstyled">
												{
													item['questionArray'].map((question, i) => (
														<li key={i}><Link to={`faq-listing/` + item['url_key'] + '/' + question['question_id']}>{question['title']}</Link></li>
													))
												}
											</ul>
											<div className="faq-view-all">
												<Link to={`faq-listing/` + item['url_key']}>View all</Link>
											</div>
										</div>
									))
								}

							</div>
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