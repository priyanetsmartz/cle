import React, { useEffect } from 'react';
import IntlMessages from "../../components/utility/intlMessages";
import { Pages } from '../../redux/pages/pages';

function Home() {

    useEffect(() => {
        console.log('ggg');
        async function fetchMyAPI() {
            let result = Pages("about-us");
            console.log(result);
        }
        fetchMyAPI()

    }, [])


    return (
        <div>
            <IntlMessages id="title" />
        </div>
    );
}

export default Home;
