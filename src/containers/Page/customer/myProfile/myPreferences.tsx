import React, { useEffect, useState } from 'react';
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getPreference, savePreference } from '../../../../redux/pages/customers';
import { language } from '../../../../settings';


function MyPreferences(props) {
    const [custId, setCustid] = useState(localStorage.getItem('cust_id'));
    const [attributesAll, setAttributesAll]: any = useState({});
    const [attributes, setAttributes]: any = useState({});
    const [catFilter, setCatFilter]: any = useState('');
    const [designFilter, setDesignFilter]: any = useState('');


    useEffect(() => {
        console.log(props)
        getAttributes();
    }, []);

    const getAttributes = async () => {
        let result: any = props.preferences;
        if (result.data[0].preference) {
            props.custData.custom_attributes.forEach(el => {
                if (el.attribute_code == 'mostly_intersted_in') {
                    result.data[0].preference.mostly_intersted.forEach(intested => {
                        el.value.split(',').forEach(element => {
                            if (intested.id == element) {
                                intested.isChecked = true;
                            }
                        });
                    })
                }
                if (el.attribute_code == 'clothing_size') {
                    result.data[0].preference.clothing_size.forEach(cloth => {
                        el.value.split(',').forEach(element => {
                            if (cloth.value == element) {
                                cloth.isChecked = true;
                            }
                        });
                    })
                }
                if (el.attribute_code == 'shoes_size') {
                    result.data[0].preference.shoes_size.forEach(cloth => {
                        el.value.split(',').forEach(element => {
                            if (cloth.value == element) {
                                cloth.isChecked = true;
                            }
                        });
                    })
                }

                if (el.attribute_code == 'favourite_categories') {
                    result.data[0].preference.categories[1].forEach(favCat => {
                        el.value.split(',').forEach(element => {
                            if (favCat.id == element) {
                                favCat.isChecked = true;
                            }
                        });
                    })
                }
            });
            setAttributes(result.data[0].preference);
            setAttributesAll(result.data[0].preference);
        }
    }

    const selectMostlyIntersted = (i) => {
        attributes.mostly_intersted[i].isChecked = !attributes.mostly_intersted[i].isChecked;
        setAttributes(prevState => ({
            ...prevState,
            mostly_intersted: attributes.mostly_intersted
        }));
    }

    const selectClothingSize = (i) => {
        attributes.clothing_size[i].isChecked = !attributes.clothing_size[i].isChecked;
        setAttributes(prevState => ({
            ...prevState,
            clothing_size: attributes.clothing_size
        }));
    }

    const removeAllCloth = () => {
        attributes.clothing_size.forEach(el => {
            el.isChecked = false;
        });
        setAttributes(prevState => ({
            ...prevState,
            clothing_size: attributes.clothing_size
        }))
    }

    const selectShoeSize = (i) => {
        attributes.shoes_size[i].isChecked = !attributes.shoes_size[i].isChecked;
        setAttributes(prevState => ({
            ...prevState,
            shoes_size: attributes.shoes_size
        }));
    }

    const removeAllShoe = () => {
        attributes.shoes_size.forEach(el => {
            el.isChecked = false;
        });
        setAttributes(prevState => ({
            ...prevState,
            shoes_size: attributes.shoes_size
        }))
    }

    //for selecting categories in the my prefernce modal
    const selectCategories = (i) => {
        attributes.categories[1][i].isChecked = !attributes.categories[1][i].isChecked;
        setAttributes(prevState => ({
            ...prevState,
            categories: attributes.categories
        }));
    }

    //remove all selected categores in my preference modal
    const removeAllCat = () => {
        attributes.categories[1].forEach(el => {
            el.isChecked = false;
        });
        setAttributes(prevState => ({
            ...prevState,
            categories: attributes.categories
        }))
    }

    //for selecting categories in the my prefernce modal
    const selectDesigner = (i) => {
        attributes.designers[0][i].isChecked = !attributes.designers[0][i].isChecked;
        setAttributes(prevState => ({
            ...prevState,
            designers: attributes.designers
        }));
    }

    //remove all selected categores in my preference modal
    const removeAllDesign = () => {
        attributes.designers[0].forEach(el => {
            el.isChecked = false;
        });
        setAttributes(prevState => ({
            ...prevState,
            designers: attributes.designers
        }))
    }

    const filterCategories = (e) => {
        console.log(attributesAll)
        setCatFilter(e.target.value)
        let newObj  = {...attributesAll}
        let filterd = newObj.categories[1].filter(eq => {
            return eq.name.toLowerCase().includes(e.target.value.toLowerCase());
        });

        attributes.categories[1] = filterd;

        setAttributes(prevState => ({
            ...prevState,
            categories:attributes.categories
        }));
    }

    const saveMyPreferences = async () => {
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
                if (data.mostly_intersted_in == '') {
                    data.mostly_intersted_in = mi.id
                } else {
                    data.mostly_intersted_in = `${data.mostly_intersted_in},${mi.id}`
                }
            }
        });

        attributes.shoes_size.forEach(ss => {
            if (ss.isChecked) {
                if (data.shoes_size == '') {
                    data.shoes_size = ss.value
                } else {
                    data.shoes_size = `${data.shoes_size},${ss.value}`
                }
            }
        });

        attributes.clothing_size.forEach(cs => {
            if (cs.isChecked) {
                if (data.clothing_size == '') {
                    data.clothing_size = cs.value
                } else {
                    data.clothing_size = `${data.clothing_size},${cs.value}`
                }
            }
        });

        attributes.categories[1].forEach(c => {
            if (c.isChecked) {
                if (data.fav_categories == '') {
                    data.fav_categories = c.id
                } else {
                    data.fav_categories = `${data.fav_categories},${c.id}`
                }
            }
        });

        attributes.designers[0].forEach(d => {
            if (d.isChecked) {
                if (data.fav_designers == '') {
                    data.fav_designers = d.id
                } else {
                    data.fav_designers = `${data.fav_designers},${d.id}`
                }
            }
        });

        const res = await savePreference(data);
        if(res){
            console.log(res);
        }
    }

    return (
        <>
            <div className="Mosty_interested_in">
                <h2>Mosty interested in</h2>
                <div className="interestd_check">
                    {attributes.mostly_intersted && attributes.mostly_intersted.map((interest, i) => {
                        return (
                            <div className="form-check" key={interest.id}>
                                <input className="form-check-input" type="checkbox" value="" id={interest.name}
                                    checked={interest.isChecked} onChange={() => selectMostlyIntersted(i)} />
                                <label className="form-check-label" htmlFor={interest.name}>
                                    {interest.name}
                                </label>
                            </div>
                        )
                    })}
                </div>

                <div className="row">
                    <div className="col-sm-6">
                        <div className="clothing_size mb-4">
                            <h2>Clothing size</h2>
                            <div className="cl_size_sec">
                                <ul>
                                    {attributes.clothing_size && attributes.clothing_size.map((cs, i) => {
                                        return (cs && cs.value !== '' &&
                                            <li key={cs.value}>
                                                <a key={cs.value} onClick={() => selectClothingSize(i)} className={cs.isChecked ? 'active' : ''}>
                                                    {cs.label}
                                                </a>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                            <div className="sizebtn clothnmrgin">
                                <div className="save-btn"><Link to="#" className="btn-link-blue">Save</Link></div>
                                <div className="save-btn removel_allbtn">
                                    <a onClick={removeAllCloth} className="btn-link-grey">Remove all</a></div>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="clothing_size">
                            <h2>Shoes size</h2>
                            <div className="cl_size_sec">
                                <ul>
                                    {attributes.shoes_size && attributes.shoes_size.map((ss, i) => {
                                        return (ss && ss.value !== '' &&
                                            <li key={ss.value}>
                                                <a onClick={() => selectShoeSize(i)} className={ss.isChecked ? 'active' : ''} key={ss.value}>{ss.label}</a></li>
                                        )
                                    })}
                                </ul>
                            </div>
                            <div className="sizebtn">
                                <div className="save-btn"><Link to="#" className="btn-link-blue">Save</Link></div>
                                <div className="save-btn removel_allbtn">
                                    <a onClick={removeAllShoe} className="btn-link-grey">Remove all</a></div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            <div className="favorite_designers mb-4">
                <h2>Favorite designers</h2>
                <div className="row">

                    <div className="col-sm-6">
                        <div className="search_results">
                            <img src="images/Icon_zoom_in.svg" alt="" className="me-1 search_icn" />
                            <input type="search" placeholder="Search..." className="form-control me-1" />
                        </div>
                    </div>

                </div>
                <div className="row">
                    <div className="col-sm-6">
                        <div className="favt_section">
                            <ul>
                                {attributes.designers && attributes.designers[0].map((design, i) => {
                                    return (
                                        // <li key={design.id}>
                                        <div className="form-check" key={design.id} >
                                            <input className="form-check-input" type="checkbox" value="" id={design.name}
                                                checked={design.isChecked} onChange={() => selectDesigner(i)} />
                                            <label className="form-check-label" htmlFor={design.name}>
                                                {design.name}
                                            </label>
                                        </div>
                                        // </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="favt_dragdrop">
                            <div className="favdesignr_size_sec">
                                <ul>
                                    {attributes.designers && attributes.designers[0].map(dg => {
                                        return dg.isChecked &&
                                            (<li key={dg.id}><a>{dg.name}</a></li>)
                                    })}
                                </ul>
                                <div className="save-btn removel_allbtn">
                                    <a onClick={removeAllDesign} className="btn-link-grey">Remove all</a></div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>

            <div className="favorite_designers mb-4">
                <h2>Favorite categories</h2>
                <div className="row">

                    <div className="col-sm-6">
                        <div className="search_results">
                            <img src="images/Icon_zoom_in.svg" alt="" className="me-1 search_icn" />
                            <input type="search" placeholder="Search..." className="form-control me-1" 
                            value={catFilter} onChange={filterCategories} />
                        </div>
                    </div>

                </div>
                <div className="row">

                    <div className="col-sm-6">
                        <div className="favt_section">
                            <ul>
                                {attributes.categories && attributes.categories[1].map((cat, i) => {
                                    return (
                                        // <li key={cat.id}>
                                        <div className="form-check" key={cat.id}>
                                            <input className="form-check-input" type="checkbox" value="" id={cat.name}
                                                checked={cat.isChecked} onChange={() => selectCategories(i)} />
                                            <label className="form-check-label" htmlFor={cat.name}>
                                                {cat.name}
                                            </label>
                                        </div>
                                        // </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                    <div className="col-sm-6">
                        <div className="favt_dragdrop">
                            <div className="favdesignr_size_sec">
                                <ul>
                                    {attributes.categories && attributes.categories[1].map(cat => {
                                        return cat.isChecked &&
                                            (<li key={cat.id}><a>{cat.name}</a></li>)
                                    })}
                                </ul>
                                <div className="save-btn removel_allbtn">
                                    <a onClick={removeAllCat} className="btn-link-grey">Remove all</a></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="width-100 mb-4">
                <div className="float-end">
                    <button type="button" className="btn btn-secondary" onClick={saveMyPreferences}>Confirm</button>
                </div>
            </div>
        </>
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
)(MyPreferences);