import { useState } from 'react';
import { useEffect } from 'react';


function VendorLogin(props) {
    const [loginForm, setLoginForm] = useState({
        email: '',
        password: ''
    });

    useEffect(() => {
    }, [])

    const handleChange = (e) => {
        const { id, value } = e.target
        setLoginForm(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    const loginHadler = () => {
        console.log(loginForm);
    }

    return (
        <div className="container" style={{ "marginTop": "200px" }}>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h3>Login</h3>
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control"
                        id="email"
                        value={loginForm.email}
                        onChange={handleChange} />
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control"
                        id="password"
                        value={loginForm.password}
                        onChange={handleChange} />
                    
                    <div className="confirm-btn">
                                    <button type="button" className="btn btn-secondary" onClick={loginHadler}>Login</button>
                                </div>

                </div>
            </div>
        </div>
    )
}


export default VendorLogin;