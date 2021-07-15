import { useState, useEffect } from 'react';
import IntlMessages from "../../components/utility/intlMessages";
import { useHistory } from "react-router-dom";

import { MagazineList } from '../../redux/pages/magazineList';

function Magazine() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        async function getData() {
            let result = MagazineList("magazine-list");
            console.log(result);
            // history.push("/signup");
        }
        getData()

    }, [])

    const Tr = ({ item }) => {
        return (
            <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.author}</td>
                <td>{item.url}</td>
                <td>{item.download_url}</td>
            </tr>
        )
    }


    return (
        <div>
            <h2><IntlMessages id="magazine_page" /></h2>
            <h3>Calling Api</h3>
            <table id='data'>
                <thead>
                    <th>ID</th>
                    <th>Author</th>
                    <th>Url</th>
                    <th>Download Url</th>
                </thead>

                <tbody>
                    {items.map((i, id) => {
                        return <Tr key={id} item={i} />
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default Magazine;
