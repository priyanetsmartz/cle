import React, { useState, useEffect } from 'react';
import { PostData, GetComments } from '../../redux/pages/magazineList';
import { useParams } from "react-router-dom";
import IntlMessages from "../../components/utility/intlMessages";

function SinglePost() {

    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);
    const { slug } = useParams();

    useEffect(() => {
        async function getData() {
            let result: any = await PostData(slug);
            setPost(result.data);
            getPostComments(result.data.post_id);
            console.log(result);
        }
        getData()
    }, [])

    const getPostComments = async (postId) => {
        let result: any = await GetComments(postId);
        setComments(result.data)
        console.log(result);
    }

    return (
        <div>
            <h2>SinglePost Single page</h2>
        </div>
    );
}

export default SinglePost;
