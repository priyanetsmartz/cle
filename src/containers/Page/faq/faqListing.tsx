import { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { getFaqListinglabels } from '../../../redux/pages/allPages';
import { useParams, useLocation } from "react-router-dom";
import IntlMessages from "../../../components/utility/intlMessages";
function FaqListing(props) {
  const [categoryData, setCategoryData] = useState([])
  const { url_key, question_id }: any = useParams();
  const search = useLocation().hash;
  let ser = search.replace(/%20/g, '')
  const [idparams, setIdparams] = useState(ser ? ser : '')
  useEffect(() => {
    getData();
    return () => {
      //
    }
  }, [props.languages]);

  async function getData() {
    let results: any = await getFaqListinglabels(props.languages, url_key);
    setCategoryData(results.data)
  }

  return (
    <section>
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
                              {/* {console.log(ser.replace(/ /g, ''), '#' + question['title'].replace(/ /g, ''))} */}
                              <h2 className="accordion-header" id={`heading${i}`}>
                                <button className={'#' + question['title'].replace(/ /g, '') === ser.replace(/ /g, '') ? `accordion-button` : `accordion-button collapsed`} type="button" data-bs-toggle="collapse" data-bs-target={`#collapseSecOne${question['question_id']}`} aria-expanded="false" aria-controls={`collapseSectwo${question['question_id']}`}>
                                  {question['title']}
                                </button>
                              </h2>
                              <div id={`collapseSecOne${question['question_id']}`} className={'#' + question['title'].replace(/ /g, '') === ser.replace(/ /g, '') ? `accordion-collapse collapse show` : `accordion-collapse collapse`} aria-labelledby={`heading${i}`} data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                  <p dangerouslySetInnerHTML={{ __html: question['answer'] }} />
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

              <section>
                <h2><IntlMessages id="related.faq" /></h2>
                {
                  categoryData.map((category, index) => (
                    <div className="accordion" key={index} id="accordionExample">
                      {
                        category['relatedquestions_array'].map((question, i) => (
                          <div key={i} className="accordion-item">
                            <h2 className="accordion-header" id={`headingSecTwo${i}`}>
                              <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseSecTwo${question['question_id']}`} aria-expanded="false" aria-controls="collapseFive">
                                {question['title']}
                              </button>
                            </h2>
                            <div id={`collapseSecTwo${question['question_id']}`} className={question['question_id'] === question_id || i === 0 ? `accordion-collapse collapse show` : `accordion-collapse collapse`} aria-labelledby={`headingSecTwo${i}`} data-bs-parent="#accordionExample">
                              <div className="accordion-body">
                                <p dangerouslySetInnerHTML={{ __html: question['answer'] }} />
                              </div>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  ))
                }
              </section>

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
)(FaqListing);