import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../image/CLE-LOGO.svg";
import blackLogo from "../../image/CLE-logo-black.svg"
import appAction from '../../redux/app/actions';
import { connect } from "react-redux";
const { toggleOpenDrawer } = appAction;

function Hamburger(props) {
    //  const [menuLoaded, setMenuLoaded] = useState(false);
    const [classState, setClassState] = useState('');
    const [logoState, setlogoState] = useState(logo);

    const handleMenuOpen = (e) => {
        e.preventDefault();
        //  console.log('here');
        props.toggleOpenDrawer(true);
    }
    useEffect(() => {
        const header = document.getElementById("header");
        const sticky = header.offsetTop;
        const scrollCallBack: any = window.addEventListener("scroll", () => {
            if (window.pageYOffset > sticky) {
                header.classList.add("sticky");
                setlogoState(blackLogo);
            } else {
                header.classList.remove("sticky");
                setlogoState(logo);
            }
        });
        return () => {
            window.removeEventListener("scroll", scrollCallBack);
        };
    }, []);

    useEffect(() => {

        const classValue = 'inner_pages_body';
        const classValueLogo = 'header-logo-menu';
        setClassState(classValueLogo);
        document.body.classList.add(classValue);
    }, []);
    return (
        <div className={classState} id="header">
            <div className="container">
                <div className="mt-5">
                    <Link to="/"><img src={logoState} alt="logo" /></Link>
                    <div className="hamburger">
                        <Link to="/" className="open-menu" onClick={handleMenuOpen}>
                            <span className="hb-first"></span>
                            <span className="hb-second"></span>
                            <span className="hb-third"></span>
                        </Link>
                    </div>
                    <div className="clearfix"></div>
                </div>
            </div>
        </div>)

}

function mapStateToProps(state) {
    //console.log(state);
    return state;
}

export default connect(
    mapStateToProps,
    { toggleOpenDrawer }
)(Hamburger);