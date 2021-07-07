import React, { useState, useEffect } from 'react';
import { PostData } from '../../redux/pages/magazineList';

function SinglePost() {

    const [post, setPost] = useState({});

    useEffect(() => {
        async function getData() {
            let result = PostData("magazine-list");
            console.log(result);
        }
        getData()

    }, [])

    return (
        <div>
            <h2>SinglePost Single page</h2>
        </div>
    );
}

export default SinglePost;
