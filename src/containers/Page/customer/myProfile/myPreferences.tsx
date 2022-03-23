import { useEffect, useState } from 'react';
import { connect } from "react-redux";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import searchIcon from '../../../../image/Icon_zoom_in.svg';
import { savePreference } from '../../../../redux/pages/customers';
import notification from '../../../../components/notification';
import IntlMessages from "../../../../components/utility/intlMessages";
import cartAction from "../../../../redux/cart/productAction";
import { useIntl } from 'react-intl';
const { closePrefPopup } = cartAction;

function MyPreferences(props) {
    let result: any = props.preferences;
    let preference = result.data && result.data[0] ? result.data[0].preference : "";
    const [custId, setCustid] = useState(props.token.cust_id);
    const [attributesAll, setAttributesAll]: any = useState(preference);
    const [isShown, setIsShown] = useState(0);
    const [attributes, setAttributes]: any = useState(preference);
    const [catFilter, setCatFilter]: any = useState('');
    const [favCat, setFavCat]: any = useState({});
    const [activeDesigner, setActiveDesigner] = useState(0);
    const [activeCategory, setActiveCategory] = useState(0);
    const [isShow, setIsShow] = useState(false);
    const [crossIcon, setCrossIcon] = useState(0);
    const intl = useIntl();
    useEffect(() => {
        getAttributes();
        return () => {
        }
    }, [props.preferences, props.custData]);



    const getAttributes = async () => {//getting attributes for which preferences are set like 'mostly interested in', 'clothing size', 'shoe size', 'favourite categories'

        let result: any = props.preferences;
        let preference = result.data && result.data[0] ? result.data[0].preference : ""

        if (preference && props.custData && props.custData.custom_attributes) {
            props.custData.custom_attributes.forEach(el => {
                if (el.attribute_code === 'mostly_intersted_in') {
                    preference.mostly_intersted.forEach((intested, index) => {
                        el.value.split(',').forEach(element => {
                            if (intested.id === element) {
                                intested.isChecked = true;
                                setActiveCategory(index);
                            }
                        });
                    })
                }
                if (el.attribute_code === 'clothing_size') {
                    preference.clothing_size.forEach(cloth => {
                        el.value.split(',').forEach(element => {
                            if (cloth.value === element) {
                                cloth.isChecked = true;
                            }
                        });
                    })
                }
                if (el.attribute_code === 'shoes_size') {
                    preference.shoes_size.forEach(cloth => {
                        el.value.split(',').forEach(element => {
                            if (cloth.value === element) {
                                cloth.isChecked = true;
                            }
                        });
                    })
                }
                if (el.attribute_code === 'favourite_categories') {

                    let favcategoryArray = preference.categories && preference.categories[activeCategory] ? preference.categories[activeCategory] : [];
                    if (favcategoryArray.length > 0) {
                        favcategoryArray.forEach(favCat => {
                            el.value.split(',').forEach(element => {
                                if (favCat.id === element) {
                                    favCat.isChecked = true;
                                }
                            });
                        })
                    }


                }

            });

        }

        setAttributes(preference);
        setAttributesAll(preference);
    }

    const selectMostlyIntersted = (i) => {// function to select/unselect the  'mostly interested in'  while editing the preferences.
        setActiveIndex(i);
        attributes.mostly_intersted.forEach(el => {
            if (el.id === attributes.mostly_intersted[i].id) {
                el.isChecked = true;
            } else {
                el.isChecked = false;
            }
        })
        setAttributes(prevState => ({
            ...prevState,
            mostly_intersted: attributes.mostly_intersted
        }));
    }

    const setActiveIndex = (index: number) => {// setting the active index  in category and designer
        setActiveCategory(index)
        setActiveDesigner(index)
    }

    const selectClothingSize = (i) => {// function to select/unselect the  'clothing size'  while editing the preferences.
        attributes.clothing_size[i].isChecked = !attributes.clothing_size[i].isChecked;
        setAttributes(prevState => ({
            ...prevState,
            clothing_size: attributes.clothing_size
        }));
    }

    const removeAllCloth = () => {// clear the clothing size in editing preferences.
        attributes.clothing_size.forEach(el => {
            el.isChecked = false;
        });
        setAttributes(prevState => ({
            ...prevState,
            clothing_size: attributes.clothing_size
        }))
    }

    const selectShoeSize = (i) => {// function to select/unselect the  'shoe size'  while editing the preferences.
        attributes.shoes_size[i].isChecked = !attributes.shoes_size[i].isChecked;
        setAttributes(prevState => ({
            ...prevState,
            shoes_size: attributes.shoes_size
        }));
    }

    const removeAllShoe = () => {//clear the shoe size in editing preferences.
        attributes.shoes_size.forEach(el => {
            el.isChecked = false;
        });
        setAttributes(prevState => ({
            ...prevState,
            shoes_size: attributes.shoes_size
        }))
    }

    //for selecting categories in the my prefernce modal
    const selectCategories = (i, cat) => {
        attributes.categories[activeCategory] = attributes.categories[activeCategory].map(el => (
            el.id === cat.id ? { ...el, isChecked: true } : el
        ))

        setAttributes(prevState => ({
            ...prevState,
            categories: attributes.categories
        }));
        let sataa = attributes.categories[activeCategory];
        setFavCat(prevState => ({
            ...prevState,
            sataa
        }));
    }
    const removeSelectedCategories = (cat) => {// removing the selected favourite categories
        attributes.categories[activeCategory] = attributes.categories[activeCategory].map(el => (
            el.id === cat.id ? { ...el, isChecked: false } : el
        ))

        setAttributes(prevState => ({
            ...prevState,
            categories: attributes.categories
        }));
    }


    //remove all selected categores in my preference modal
    const removeAllCat = () => {// removing the all categories 
        attributes.categories[activeCategory].forEach(el => {
            el.isChecked = false;
        });
        setAttributes(prevState => ({
            ...prevState,
            categories: attributes.categories
        }))
    }

    const filterCategories = (e) => {
        let value = e.target.value.toLowerCase();
        let result = [];
        let newObj = { ...attributes }
        setCatFilter(value)
        if (value.length > 0) {
            result = newObj.categories[activeCategory].filter((eq) => {
                return eq.name.toLowerCase().includes(e.target.value.toLowerCase());
            });
        }
        setFavCat(result);
    }

    const saveMyPreferences = async () => {// saving the preferences from edit preerences modal and saving them by hitting API.
        setIsShow(true);
        let data = {
            customerId: custId,
            mostly_intersted_in: "",
            clothing_size: "",
            shoes_size: "",
            fav_designers: "",
            fav_categories: ""
        }

        attributes.mostly_intersted.forEach(mi => {
            if (mi.isChecked) {
                if (data.mostly_intersted_in === '') {
                    data.mostly_intersted_in = mi.id
                } else {
                    data.mostly_intersted_in = `${data.mostly_intersted_in},${mi.id}`
                }
            }
        });

        attributes.shoes_size.forEach(ss => {
            if (ss.isChecked) {
                if (data.shoes_size === '') {
                    data.shoes_size = ss.value
                } else {
                    data.shoes_size = `${data.shoes_size},${ss.value}`
                }
            }
        });

        attributes.clothing_size.forEach(cs => {
            if (cs.isChecked) {
                if (data.clothing_size === '') {
                    data.clothing_size = cs.value
                } else {
                    data.clothing_size = `${data.clothing_size},${cs.value}`
                }
            }
        });

        if (attributes.categories[activeCategory].length > 0) {
            attributes.categories[activeCategory].forEach(c => {
                if (c.isChecked) {
                    if (data.fav_categories === '') {
                        data.fav_categories = c.id
                    } else {
                        data.fav_categories = `${data.fav_categories},${c.id}`
                    }
                }
            });
        }

        if (attributes.designers[activeDesigner] && attributes.designers[activeDesigner].length > 0) {
            attributes.designers[activeDesigner].forEach(d => {
                if (d.isChecked) {
                    if (data.fav_designers === '') {
                        data.fav_designers = d.id
                    } else {
                        data.fav_designers = `${data.fav_designers},${d.id}`
                    }
                }
            });
        }

        const res = await savePreference(data);
        if (res) {
            setIsShow(false);
            props.closePrefPopup(false);
            notification("success", "", intl.formatMessage({ id: "preferencessuccess" }));
        } else {
            notification("error", "", intl.formatMessage({ id: "genralerror" }));
        }
    }
    return (
        <Modal.Body className="arabic-rtl-direction">
            <div className="Mosty_interested_in">
                <h2><IntlMessages id="preferences.mostlyInterested" /></h2>
                <div className="interestd_check">
                    {attributes.mostly_intersted && attributes.mostly_intersted.map((inter, i) => {
                        return (
                            <div className="form-check" key={inter.id}>
                                <input className="form-check-input" type="checkbox" id={inter.name}
                                    checked={inter.isChecked} onChange={() => selectMostlyIntersted(i)} />
                                <label className="form-check-label" htmlFor={inter.name}>
                                    {inter.name}
                                </label>
                            </div>
                        )
                    })}
                </div>

                <div className="row">
                    <div className="col-sm-6">
                        <div className="clothing_size mb-4">
                            <h2><IntlMessages id="preferences.clothingSize" /></h2>
                            <div className="cl_size_sec">
                                <ul>
                                    {attributes.clothing_size && attributes.clothing_size.map((cs, i) => {
                                        return (cs && cs.value !== '' &&
                                            <li key={cs.value}>
                                                <Link to="#" key={cs.value} onClick={() => selectClothingSize(i)} className={cs.isChecked ? 'active' : ''}>
                                                    {cs.label}
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                            <div className="sizebtn clothnmrgin">
                                <div className="save-btn"><Link to="#" className="btn-link-blue" onClick={saveMyPreferences}><IntlMessages id="checkout.save" /></Link></div>
                                <div className="save-btn removel_allbtn">
                                    <Link to="#" onClick={removeAllCloth} className="btn-link-grey"><IntlMessages id="preferences.removeAll" /></Link></div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="clothing_size">
                            <h2><IntlMessages id="preferences.shoeSize" /></h2>
                            <div className="cl_size_sec">
                                <ul>
                                    {attributes.shoes_size && attributes.shoes_size.map((ss, i) => {
                                        return (ss && ss.value !== '' &&
                                            <li key={ss.value}>
                                                <Link to="#" onClick={() => selectShoeSize(i)} className={ss.isChecked ? 'active' : ''} key={ss.value}>{ss.label}</Link></li>
                                        )
                                    })}
                                </ul>
                            </div>
                            <div className="sizebtn">
                                <div className="save-btn"><Link to="#" className="btn-link-blue" onClick={saveMyPreferences}><IntlMessages id="checkout.save" /></Link></div>
                                <div className="save-btn removel_allbtn">
                                    <Link to="#" onClick={removeAllShoe} className="btn-link-grey"><IntlMessages id="preferences.removeAll" /></Link></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            

            <div className="favorite_designers mb-4">
                <h2><IntlMessages id="preferences.favCategory" /></h2>
                <div className="row">

                    <div className="col-sm-6">
                        <div className="search_results">
                            <img src={searchIcon} alt="" className="me-1 search_icn" />
                            <input type="search" placeholder={intl.formatMessage({ id: "searchPlaceholder" })} className="form-control me-1"
                                defaultValue={catFilter} onChange={filterCategories} />
                        </div>
                    </div>

                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="favt_section">

                            {(favCat && favCat.length > 0) ?
                                <ul> {favCat.map((cat, i) => {
                                    return (
                                        <div className="form-check" key={cat.id}>
                                            <input className="form-check-input" type="checkbox" value="" id={cat.name}
                                                checked={cat.isChecked} onChange={() => selectCategories(i, cat)} />
                                            <label className="form-check-label" htmlFor={cat.name}>
                                                {cat.name}
                                            </label>
                                        </div>
                                    )
                                })} </ul> :
                                <ul>
                                    {attributes.categories && attributes.categories[activeCategory] && attributes.categories[activeCategory].length > 0 && attributes.categories[activeCategory].map((cat, i) => {
                                        return (
                                            <div className="form-check" key={cat.id}>
                                                <input className="form-check-input" type="checkbox" value="" id={cat.name}
                                                    checked={cat.isChecked} onChange={() => selectCategories(i, cat)} />
                                                <label className="form-check-label" htmlFor={cat.name}>
                                                    {cat.name}
                                                </label>
                                            </div>
                                        )
                                    })}
                                </ul>
                            }
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="favt_dragdrop">
                            <div className="favdesignr_size_sec">
                                <ul>
                                    {attributes.categories && attributes.categories[activeCategory] && attributes.categories[activeCategory].length && attributes.categories[activeCategory].map((cat, i) => {
                                        return cat.isChecked &&
                                            (<li key={i} onMouseEnter={() => setIsShown(cat.id)} onMouseLeave={() => setIsShown(0)} ><Link to="#"  >
                                                {isShown === cat.id ? <span className='textname' onClick={() => removeSelectedCategories(cat)} > <i className="fa fa-times" aria-hidden="true"></i></span> : <span className='textname'>{cat.name}</span>
                                                }</Link></li>)
                                    })}
                                </ul>
                                <div className="save-btn removel_allbtn">
                                    <Link to="#" onClick={removeAllCat} className="btn-link-grey"><IntlMessages id="preferences.removeAll" /></Link></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="width-100 mb-4">
                <div className="float-end">
                    <button type="button" className="btn btn-secondary" onClick={saveMyPreferences} style={{ "display": !isShow ? "inline-block" : "none" }}>
                        <IntlMessages id="myaccount.confirm" /></button>
                    <div className="spinner" style={{ "display": isShow ? "inline-block" : "none" }}>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" ></span>
                        <IntlMessages id="loading" />
                    </div>
                </div>
            </div>
        </Modal.Body>
    )
}

const mapStateToProps = (state) => {
    let languages = '';
    if (state && state.LanguageSwitcher) {
        languages = state.LanguageSwitcher.language
    }
    return {
        languages: languages,
        token: state.session.user
    }
}

export default connect(
    mapStateToProps,
    { closePrefPopup }
)(MyPreferences);