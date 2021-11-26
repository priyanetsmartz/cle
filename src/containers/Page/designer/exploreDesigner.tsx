import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { getDesginers } from '../../../redux/pages/customers';


function ExploreDesigner(props) {
    const [catId, setCatId] = useState(153);
    const [designers, setDesigners] = useState({
        banners: []
    });

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        let result: any = await getDesginers(props.languages, catId);
       // console.log(result.data.items);
        if (result) {
            // setDesigners(result.data.items[0]);
        }
    }
    return (
        <section className="designer-alphabet-list">
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h2 className="DC-section-title">Explore Designers</h2>
                        <div className="explore-alphabets">
                            <a href="">a</a>
                            <a href="">b</a>
                            <a href="">c</a>
                            <a href="">d</a>
                            <a href="">e</a>
                            <a href="">f</a>
                            <a href="">g</a>
                            <a href="">h</a>
                            <a href="">i</a>
                            <a href="">j</a>
                            <a href="">k</a>
                            <a href="">l</a>
                            <a href="">m</a>
                            <a href="">n</a>
                            <a href="">o</a>
                            <a href="">p</a>
                            <a href="">q</a>
                            <a href="">r</a>
                            <a href="">s</a>
                            <a href="">t</a>
                            <a href="">u</a>
                            <a href="">v</a>
                            <a href="">w</a>
                            <a href="">x</a>
                            <a href="">y</a>
                            <a href="">z</a>
                            <a href="">0-9</a>
                        </div>
                    </div>
                </div>
                <div className="row mb-5 alphabet-list">
                    <div className="col-md-12">
                        <a href="" className="alpha-list-title">a</a>
                    </div>
                    <div className="col-md-3">
                        <a href="">Aaa</a>
                    </div>
                    <div className="col-md-3">
                        <a href="">Aab</a>
                    </div>
                    <div className="col-md-3">
                        <a href="">Aac</a>
                    </div>
                    <div className="col-md-3">
                        <a href="">Aad</a>
                    </div>
                    <div className="col-md-3">
                        <a href="">Aae</a>
                    </div>
                    <div className="col-md-3">
                        <a href="">Aaf</a>
                    </div>
                    <div className="col-md-3">
                        <a href="">Aag</a>
                    </div>
                    <div className="col-md-3">
                        <a href="">Aah</a>
                    </div>
                    <div className="col-md-3">
                        <a href="">Aai</a>
                    </div>
                    <div className="col-md-3">
                        <a href="">Aaj</a>
                    </div>
                </div>
                <div className="row mb-5 alphabet-list">
                    <div className="col-md-12">
                        <a href="" className="alpha-list-title">B</a>
                    </div>
                    <div className="col-md-3">
                        <a href="">Baa</a>
                    </div>
                    <div className="col-md-3">
                        <a href="">Bab</a>
                    </div>
                    <div className="col-md-3">
                        <a href="">Bac</a>
                    </div>
                    <div className="col-md-3">
                        <a href="">Bad</a>
                    </div>
                    <div className="col-md-3">
                        <a href="">Bae</a>
                    </div>
                    <div className="col-md-3">
                        <a href="">Baf</a>
                    </div>
                    <div className="col-md-3">
                        <a href="">Bag</a>
                    </div>
                    <div className="col-md-3">
                        <a href="">Bah</a>
                    </div>
                    <div className="col-md-3">
                        <a href="">Bai</a>
                    </div>
                    <div className="col-md-3">
                        <a href="">Baj</a>
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
)(ExploreDesigner);