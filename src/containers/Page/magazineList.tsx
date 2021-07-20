import { useState, useEffect } from 'react';
import IntlMessages from "../../components/utility/intlMessages";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import notification from '../../components/notification';
import { PostList } from '../../redux/pages/magazineList';

function AllPosts() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        async function getData() {
            let result: any = await PostList();
            console.log(result);
            if (result.data.length > 0) {
                setItems(result.data);
            } else {
                notification("error", "", "No data found!");
            }
            console.log(result);
            // history.push("/signup");
        }
        getData()

    }, [])


    return (
        <>
            <h3>See All Posts!</h3>
        </>
    );
}

export default AllPosts;
