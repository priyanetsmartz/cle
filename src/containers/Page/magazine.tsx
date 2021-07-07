import React, { useState, useEffect } from 'react';

function Magazine() {

    const [items, setItems] = useState([]);

    const apiUrl = "https://jsonplaceholder.typicode.com/posts";
    const apiUrl1 = "https://picsum.photos/v2/list";

    useEffect(() => {
        fetch(apiUrl1)
            .then(res => res.json())
            .then(res => {
                setItems(res);
            })
            .catch(err => {
                console.log(err);
            })
    });

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
            <h2>Magazine page</h2>
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
