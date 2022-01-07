import { connect } from 'react-redux';

function FaqFooter(props) {

    return (
        <section className="faq-form">
        <div className="container">
            <div className="row">
                <div className="col-xs-12 col-md-6 offset-md-3 col-lg-6 offset-lg-3">
                    <iframe title="contact form" style={{ "height": "800px", "width": "99%", "border": "none" }} src={`https://forms.zohopublic.com/cleportal692/form/ContactusTeaser/formperma/ChqWeIlStcsFpEqH1XolNHheBwaVh9Huwq8bZ6pXOIQ?zf_lang=${props.languages === 'english' ? 'en' : 'ar'}`}></iframe>
                </div>
            </div>
        </div>
    </section>
    )
}
const mapStateToProps = (state) => {
    let languages = '';

    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }

    return {
        languages: languages
    }
}

export default connect(
    mapStateToProps
)(FaqFooter);