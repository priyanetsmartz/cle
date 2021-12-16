import { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { getFaqListinglabels } from '../../../redux/pages/allPages';
import { useParams } from "react-router-dom";
function FaqListing(props) {
  const [categoryData, setCategoryData] = useState([])
  const { url_key, question_id }: any = useParams();
  // console.log(question_id)
  useEffect(() => {
    getData();
    return () => {
      //
    }
  }, [props.languages]);

  async function getData() {
    let results1 = await getFaqListinglabels(props.languages, url_key);
    console.log("results", results1)

    let deummyData =
      [
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
          "updated_at": "2021-12-13 12:36:13",
          "canonical_url": "test-related",
          "noindex": "0",
          "nofollow": "0",
          "description": "<p>this is test</p>",
          "icon": null,
          "stores": "3",
          "questions": "1,2,3",
          "questionCount": 3,
          "questionArray": [
            {
              "question_id": "1",
              "title": "What about the quality of product?",
              "answer": "<p>This product has best quality.</p>",
              "short_answer": "This product has best quality."
            },
            {
              "question_id": "2",
              "title": "Is this poduct deliver on time?",
              "answer": "<p>yes, this product always deliver on time.</p>",
              "short_answer": "yes, this product always deliver on time."
            },
            {
              "question_id": "3",
              "title": "Shiiping Fee",
              "answer": "<p>this provide delivery on time</p>",
              "short_answer": "this provide delivery on time"
            }
          ],
          "customer_groups": "0,1,4",
          "relatedquestions": "3,1",
          "relatedquestions_count": 2,
          "relatedquestions_array": [
            {
              "question_id": "3",
              "title": "Shiiping Fee",
              "answer": "<p>this provide delivery on time</p>",
              "short_answer": "this provide delivery on time"
            },
            {
              "question_id": "1",
              "title": "What about the quality of product?",
              "answer": "<p>This product has best quality.</p>",
              "short_answer": "This product has best quality."
            }
          ]
        }
      ]

    let results = deummyData;
    setCategoryData(results)
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


      <section className="faq-list">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <section>
                {
                  categoryData.map((category, index) => (
                    <div key={index}>
                      <h2>{category['title']}</h2>
                      <div className="accordion" id="accordionExample">
                        {
                          category['questionArray'].map((question, i) => (
                            <div key={i} className="accordion-item">
                              <h2 className="accordion-header" id={`heading${i}`}>
                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseSecOne${question['question_id']}`} aria-expanded="false" aria-controls={`collapseSectwo${question['question_id']}`}>
                                  {question['title']}
                                </button>
                              </h2>
                              <div id={`collapseSecOne${question['question_id']}`} className={question['question_id'] === question_id || i === 0 ? `accordion-collapse collapse show` : `accordion-collapse collapse`} aria-labelledby={`heading${i}`} data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                  <p>{question['short_answer']}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  ))
                }
              </section>
              {
                categoryData.map((category, index) => (
                  <section>
                    <h2>Related FAQs</h2>
                    <div className="accordion" id="accordionExample">
                      {
                        category['relatedquestions_array'].map((question, i) => (
                          <div className="accordion-item">
                            <h2 className="accordion-header" id={`headingTwo${i}`}>
                              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseSectwo${question['question_id']}`} aria-expanded="false" aria-controls={`collapseSectwo${question['question_id']}`}>
                                {question['title']}
                              </button>
                            </h2>
                            <div id={`collapseSectwo${question['question_id']}`} className={i === 0 ? `accordion-collapse collapse show` : `accordion-collapse collapse`} aria-labelledby={`headingTwo${i}`} data-bs-parent="#accordionExample">
                              <div className="accordion-body">
                                <p>{question['short_answer']}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </section>
                ))
              }

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
)(FaqListing);