import { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { getFaqListinglabels } from '../../../redux/pages/allPages';
import { useParams, useLocation } from "react-router-dom";
import IntlMessages from "../../../components/utility/intlMessages";
import { capitalize } from '../../../components/utility/allutils';
import FaqFooter from './faq-footer';
import FaqHeader from './faq-header';
function FaqListing(props) {
  const location = useLocation();
  const [categoryData, setCategoryData] = useState([])
  const { url_key, question_id }: any = useParams();
  const search = useLocation().hash;
  let ser = search.replace(/%20/g, '')
  useEffect(() => {
    getData();
    return () => {
      //
    }
  }, [props.languages, location]);

  async function getData() {
    let results: any = await getFaqListinglabels(props.languages, url_key);
    setCategoryData(results.data)
  }

  return (
    <section>
       <FaqHeader />
      <section className="faq-list">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <section>
                {
                  categoryData.map((category, index) => (
                    <div key={index}>
                      <h2>{ capitalize(category['title'])}</h2>

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
                    <div className="accordion" key={index} id="accordionExample1">
                      {
                        category['relatedquestions_array'].map((question, i) => (
                          <div key={i} className="accordion-item">
                            <h2 className="accordion-header" id={`headingSecTwo${i}`}>
                              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapseSecTwo${question['question_id']}`} aria-expanded="false" aria-controls="collapseFive">
                                {question['title']}
                              </button>
                            </h2>
                            <div id={`collapseSecTwo${question['question_id']}`} className="accordion-collapse collapse" aria-labelledby={`headingSecTwo${i}`} data-bs-parent="#accordionExample1">
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
)(FaqListing);